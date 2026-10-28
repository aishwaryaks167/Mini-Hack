import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Clock,
  XCircle,
  Edit3,
  Calendar,
  AlertCircle,
  Pill,
  Utensils,
  Volume2,
  Phone,
  AlertTriangle,
  ShieldCheck,
} from 'lucide-react';
import { DoseInstance, UserProfile } from '../types';
import { formatTimeDisplay } from '../utils/storage';
import { speakText, formatDoseSpeechText } from '../utils/speech';

interface DoseActionModalProps {
  dose: DoseInstance | null;
  profile: UserProfile;
  onClose: () => void;
  onTakeDose: (doseId: string, customTime?: string, notes?: string) => void;
  onSnoozeDose: (doseId: string, minutes: number) => void;
  onSkipDose: (doseId: string, reason: string) => void;
  onCorrectDose: (
    doseId: string,
    newStatus: 'taken' | 'missed' | 'skipped' | 'pending',
    notes: string
  ) => void;
}

export const DoseActionModal: React.FC<DoseActionModalProps> = ({
  dose,
  profile,
  onClose,
  onTakeDose,
  onSnoozeDose,
  onSkipDose,
  onCorrectDose,
}) => {
  if (!dose) return null;

  const [activeTab, setActiveTab] = useState<'actions' | 'skip' | 'correct'>('actions');
  const [selectedSnooze, setSelectedSnooze] = useState(profile.snoozeIntervalMinutes || 10);
  const [skipReason, setSkipReason] = useState('Doctor advised temporary hold');
  const [correctionStatus, setCorrectionStatus] = useState(dose.status);
  const [correctionNotes, setCorrectionNotes] = useState(dose.notes || '');

  const skipPresets = [
    'Felt nauseous / stomach upset',
    'Fasting for blood work / lab test',
    'Doctor advised temporary hold',
    'Out of medicine (refill pending)',
    'Accidentally missed time window',
  ];

  const handleTakeNow = () => {
    onTakeDose(dose.id);
    onClose();
  };

  const handleSnooze = () => {
    onSnoozeDose(dose.id, selectedSnooze);
    onClose();
  };

  const handleConfirmSkip = () => {
    if (!skipReason.trim()) {
      alert('Please select or specify a reason for skipping this dose.');
      return;
    }
    onSkipDose(dose.id, skipReason.trim());
    onClose();
  };

  const handleConfirmCorrection = () => {
    onCorrectDose(dose.id, correctionStatus, correctionNotes.trim());
    onClose();
  };

  const handleHearAloud = () => {
    const text = formatDoseSpeechText(
      dose.medicineName,
      dose.strength,
      dose.quantityPerDose,
      dose.unit,
      dose.mealTiming,
      formatTimeDisplay(dose.scheduledTime, profile.timeFormat),
      dose.notes,
      profile.preferredLanguage
    );
    speakText(text, {
      rate: profile.voiceRate || 0.85,
      langCode: profile.preferredLanguage,
    });
  };

  const isMissedOrLate = dose.status === 'missed' || dose.status === 'skipped';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div
          className="p-4 sm:p-5 text-white flex items-start justify-between relative overflow-hidden"
          style={{ backgroundColor: dose.color || '#0284c7' }}
        >
          <div className="flex items-center gap-3">
            {dose.imageUrl ? (
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white/20 border-2 border-white/40 shadow-sm flex-shrink-0">
                <img
                  src={dose.imageUrl}
                  alt={dose.medicineName}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/25 flex-shrink-0">
                <Pill className="w-7 h-7 -rotate-45" />
              </div>
            )}
            <div>
              <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">
                {dose.scheduledDate} • {formatTimeDisplay(dose.scheduledTime, profile.timeFormat)}
              </span>
              <h3 className="font-heading font-extrabold text-xl leading-tight">
                {dose.medicineName}
              </h3>
              <p className="text-xs text-white/90 font-medium">
                {dose.strength} ({dose.quantityPerDose} {dose.unit})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleHearAloud}
              title="Hear dose spoken aloud"
              className="p-2 rounded-xl bg-black/20 hover:bg-black/30 text-white transition flex items-center gap-1 text-xs font-bold"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-black/20 hover:bg-black/30 text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">Confirmation Status:</span>
          <span
            className={`font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
              dose.status === 'taken'
                ? 'bg-emerald-100 text-emerald-800'
                : dose.status === 'missed'
                ? 'bg-rose-100 text-rose-800'
                : dose.status === 'skipped'
                ? 'bg-slate-200 text-slate-700'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {dose.status}
          </span>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* MANDATORY CLINICAL MISSED-DOSE GUIDANCE */}
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-heading font-extrabold text-amber-950 text-xs sm:text-sm">
                  Clinical Safety Instruction
                </h4>
                <p className="text-xs text-amber-900 leading-relaxed font-medium mt-0.5">
                  <strong>Never take an extra or double dose</strong> to make up for a missed dose. If it is close to your next scheduled dose, skip the missed dose and resume your regular schedule. Follow your prescribed label or call your pharmacist.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 border-t border-amber-200">
              <a
                href={`tel:${profile.defaultPharmacyPhone || '+15553456789'}`}
                className="flex-1 py-1.5 px-2 rounded-xl bg-white border border-amber-300 text-amber-900 text-xs font-bold hover:bg-amber-100 text-center flex items-center justify-center gap-1"
              >
                <Phone className="w-3.5 h-3.5 text-amber-700" />
                <span>Call Pharmacist</span>
              </a>
              <a
                href={`tel:${profile.emergencyContactPhone || '+15552345678'}`}
                className="flex-1 py-1.5 px-2 rounded-xl bg-amber-700 text-white text-xs font-bold hover:bg-amber-800 text-center flex items-center justify-center gap-1"
              >
                <Phone className="w-3.5 h-3.5 text-white" />
                <span>Call Doctor</span>
              </a>
            </div>
          </div>

          {activeTab === 'actions' && (
            <div className="space-y-3">
              {/* Take Button (Large Senior-Friendly Tap Target) */}
              <button
                onClick={handleTakeNow}
                className={`w-full flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold shadow-md shadow-emerald-600/25 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.98] transition-all ${
                  profile.elderlyMode ? 'py-4 text-lg' : 'py-3 text-base'
                }`}
              >
                <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                <span>Mark as Taken Now</span>
              </button>

              {/* Snooze Options */}
              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-sky-600" />
                    Snooze Reminder
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    (Does not mark taken)
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  {[5, 10, 15].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => setSelectedSnooze(mins)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        selectedSnooze === mins
                          ? 'bg-sky-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {mins} Minutes
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleSnooze}
                  className="mt-2.5 w-full py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-extrabold text-xs transition"
                >
                  Apply Snooze for {selectedSnooze} min
                </button>
              </div>

              {/* Sub-Actions: Skip or Correct */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => setActiveTab('skip')}
                  className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
                >
                  <XCircle className="w-4 h-4 text-rose-500" />
                  <span>Skip Dose...</span>
                </button>

                <button
                  onClick={() => setActiveTab('correct')}
                  className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
                >
                  <Edit3 className="w-4 h-4 text-sky-600" />
                  <span>Correct Record</span>
                </button>
              </div>
            </div>
          )}

          {/* Skip Dose Sub-Screen */}
          {activeTab === 'skip' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-heading font-bold text-slate-800 text-sm">
                  Specify Reason for Skipping
                </h4>
                <button
                  onClick={() => setActiveTab('actions')}
                  className="text-xs font-semibold text-sky-600 hover:underline"
                >
                  Back
                </button>
              </div>

              <div className="space-y-1.5">
                {skipPresets.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setSkipReason(preset)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs font-medium border transition-all ${
                      skipReason === preset
                        ? 'border-sky-500 bg-sky-50 text-sky-900 font-semibold'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Custom note / doctor's instructions:
                </label>
                <input
                  type="text"
                  value={skipReason}
                  onChange={(e) => setSkipReason(e.target.value)}
                  placeholder="e.g. Physician told me to hold off until BP normalizes"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setActiveTab('actions')}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSkip}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-white font-extrabold text-xs hover:bg-slate-900 shadow-sm"
                >
                  Confirm Skip
                </button>
              </div>
            </div>
          )}

          {/* Retroactive Audit Correction Sub-Screen */}
          {activeTab === 'correct' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-heading font-bold text-slate-800 text-sm">
                    Retroactive Record Correction
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Fix accidental taps or log doses taken earlier
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('actions')}
                  className="text-xs font-semibold text-sky-600 hover:underline"
                >
                  Back
                </button>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {(['taken', 'missed', 'skipped', 'pending'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setCorrectionStatus(st)}
                    className={`py-2 rounded-xl text-xs font-bold uppercase transition ${
                      correctionStatus === st
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Reason for manual record audit:
                </label>
                <input
                  type="text"
                  value={correctionNotes}
                  onChange={(e) => setCorrectionNotes(e.target.value)}
                  placeholder="e.g. Took with breakfast, forgot to tap confirmation"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setActiveTab('actions')}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmCorrection}
                  className="flex-1 py-2.5 rounded-xl bg-sky-600 text-white font-extrabold text-xs hover:bg-sky-700 shadow-sm"
                >
                  Save Correction
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

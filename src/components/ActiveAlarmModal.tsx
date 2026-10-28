import React, { useEffect } from 'react';
import {
  Bell,
  CheckCircle2,
  Clock,
  XCircle,
  Pill,
  Utensils,
  AlertTriangle,
  Volume2,
  Phone,
} from 'lucide-react';
import { DoseInstance, UserProfile } from '../types';
import { playReminderSound } from '../utils/audio';
import { speakText, formatDoseSpeechText } from '../utils/speech';
import { getTranslation } from '../utils/translations';

interface ActiveAlarmModalProps {
  dose: DoseInstance | null;
  profile: UserProfile;
  onTake: (doseId: string) => void;
  onSnooze: (doseId: string, minutes: number) => void;
  onSkip: (doseId: string) => void;
  onDismiss: () => void;
}

export const ActiveAlarmModal: React.FC<ActiveAlarmModalProps> = ({
  dose,
  profile,
  onTake,
  onSnooze,
  onSkip,
  onDismiss,
}) => {
  if (!dose) return null;

  useEffect(() => {
    // 1. Play reminder sound immediately upon alarm trigger if audio is enabled
    if (profile.soundAlerts) {
      playReminderSound(profile.soundTone || 'chime');
    }

    // 2. Automatically announce dose aloud via Web Speech API in preferred language if enabled
    if (profile.voiceEnabled && profile.voiceAutoReadAlarms) {
      const speechText = formatDoseSpeechText(
        dose.medicineName,
        dose.strength,
        dose.quantityPerDose,
        dose.unit,
        dose.mealTiming,
        dose.scheduledTime,
        dose.notes,
        profile.preferredLanguage
      );
      // Small delay after chime
      const timer = setTimeout(() => {
        speakText(speechText, {
          rate: profile.voiceRate || 0.85,
          langCode: profile.preferredLanguage,
        });
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [dose, profile.soundAlerts, profile.soundTone, profile.voiceEnabled, profile.voiceAutoReadAlarms, profile.preferredLanguage]);

  const mealTimingText = (t: string) => {
    return getTranslation(profile.preferredLanguage, t) || t;
  };

  const handleSpeakAgain = () => {
    const speechText = formatDoseSpeechText(
      dose.medicineName,
      dose.strength,
      dose.quantityPerDose,
      dose.unit,
      dose.mealTiming,
      dose.scheduledTime,
      dose.notes,
      profile.preferredLanguage
    );
    speakText(speechText, {
      rate: profile.voiceRate || 0.85,
      langCode: profile.preferredLanguage,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 text-center animate-in zoom-in-95 duration-200">
        {/* Pulsing Alert Banner */}
        <div className="bg-gradient-to-r from-sky-600 via-teal-600 to-sky-700 p-6 text-white relative">
          {dose.imageUrl ? (
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-white/20 backdrop-blur-md mx-auto mb-3 border-2 border-white/40 shadow-lg shadow-black/20 flex items-center justify-center">
              <img
                src={dose.imageUrl}
                alt={dose.medicineName}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 right-1 p-1 rounded-full bg-sky-600/90 text-white shadow">
                <Bell className="w-3 h-3 animate-bounce" />
              </span>
            </div>
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-3 border border-white/30 shadow-lg shadow-black/10">
              <Bell className="w-8 h-8 text-white animate-bounce" />
            </div>
          )}

          <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-black uppercase tracking-wider text-sky-100 mb-1">
            Medication Reminder
          </span>

          <h3 className="font-heading font-black text-2xl text-white tracking-tight leading-tight">
            Time for {dose.medicineName}
          </h3>

          <p className="text-xs text-sky-100 font-semibold mt-1">
            Scheduled for {dose.scheduledTime}
          </p>

          {/* Voice Repeat Button */}
          <button
            onClick={handleSpeakAgain}
            className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/25 hover:bg-white/35 text-xs font-bold text-white transition backdrop-blur-sm"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Hear Reminder Aloud</span>
          </button>
        </div>

        {/* Prescription Details */}
        <div className="p-5 space-y-3.5">
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 text-left space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span>Prescribed Dosage:</span>
              <span className="text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100 font-extrabold">
                {dose.strength} ({dose.quantityPerDose} {dose.unit})
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
              <Utensils className="w-3.5 h-3.5" />
              <span>{mealTimingText(dose.mealTiming)}</span>
            </div>

            {dose.notes && (
              <p className="text-[11px] text-slate-600 leading-snug">
                <strong>Instruction:</strong> {dose.notes}
              </p>
            )}
          </div>

          {/* Clinical Safety Protocol Callout */}
          <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-3 text-left space-y-1 text-xs text-amber-950">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Important Dose Safety:</span>
            </div>
            <p className="text-[11px] text-amber-900 leading-snug">
              Never take an extra or double dose. Follow prescribed instructions or contact your pharmacist.
            </p>
          </div>

          {/* Action Buttons (Large Touch Targets) */}
          <div className="space-y-2 pt-1">
            <button
              onClick={() => onTake(dose.id)}
              className={`w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black shadow-lg shadow-emerald-600/30 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.98] transition-all ${
                profile.elderlyMode ? 'py-4 text-xl' : 'py-3.5 text-base'
              }`}
            >
              <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
              <span>Mark as Taken</span>
            </button>

            <button
              onClick={() => onSnooze(dose.id, profile.snoozeIntervalMinutes || 10)}
              className={`w-full flex items-center justify-center gap-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold active:scale-[0.98] transition-all ${
                profile.elderlyMode ? 'py-4 text-base' : 'py-2.5 text-xs sm:text-sm'
              }`}
            >
              <Clock className="w-4 h-4 text-sky-600" />
              <span>Snooze for {profile.snoozeIntervalMinutes} Minutes</span>
            </button>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => onSkip(dose.id)}
                className="flex-1 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
              >
                Skip Dose...
              </button>
              <button
                onClick={onDismiss}
                className="flex-1 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

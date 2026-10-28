import React, { useState } from 'react';
import {
  ShieldCheck,
  UserPlus,
  Phone,
  Mail,
  Bell,
  Trash2,
  AlertCircle,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Info,
  Clock,
  CheckCircle2,
  Lock,
  KeyRound,
  RefreshCw,
  FileCheck,
} from 'lucide-react';
import { Caregiver, UserProfile } from '../types';

interface CaregiverScreenProps {
  caregivers: Caregiver[];
  profile: UserProfile;
  onAddCaregiver: (cg: Omit<Caregiver, 'id' | 'createdAt'>) => void;
  onDeleteCaregiver: (id: string) => void;
  onToggleAlertSetting: (id: string, setting: 'alertOnMissed' | 'shareAdherenceWeekly' | 'alertOnLowRefill') => void;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

export const CaregiverScreen: React.FC<CaregiverScreenProps> = ({
  caregivers,
  profile,
  onAddCaregiver,
  onDeleteCaregiver,
  onToggleAlertSetting,
  onUpdateProfile,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [simulatedAlertMessage, setSimulatedAlertMessage] = useState<string | null>(null);
  const [simulatedAlertType, setSimulatedAlertType] = useState<'missed' | 'refill'>('missed');

  // Form state
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Daughter');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [accessLevel, setAccessLevel] = useState<'full' | 'emergency_only' | 'adherence_only'>('full');
  const [alertDelayMinutes, setAlertDelayMinutes] = useState(45);
  const [alertOnMissed, setAlertOnMissed] = useState(true);
  const [alertOnLowRefill, setAlertOnLowRefill] = useState(true);
  const [shareAdherenceWeekly, setShareAdherenceWeekly] = useState(true);

  const handleSaveCaregiver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert('Please provide caregiver name and phone number.');
      return;
    }

    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

    onAddCaregiver({
      name: name.trim(),
      relationship: relationship.trim(),
      phone: phone.trim(),
      email: email.trim(),
      accessLevel,
      alertOnMissed,
      alertDelayMinutes,
      alertOnLowRefill,
      shareAdherenceWeekly,
      emergencyAlerts: true,
      isVerified: true,
      consentSigned: profile.caregiverConsentAccepted,
      verificationCode,
    });

    setName('');
    setPhone('');
    setEmail('');
    setShowAddModal(false);
  };

  const simulateCaregiverAlert = (cg: Caregiver, type: 'missed' | 'refill' = 'missed') => {
    setSimulatedAlertType(type);
    if (type === 'refill') {
      const text = `[SmartDose Refill Notice] Hi ${cg.name}, ${profile.name}'s supply of Lisinopril 10mg is running low (4 tablets remaining, ~4 days of medication left). Prescribed pharmacy: ${profile.defaultPharmacyName || 'Corner Health Pharmacy'} (${profile.defaultPharmacyPhone || '+1 555-345-6789'}). Please assist with scheduling a refill.`;
      setSimulatedAlertMessage(text);
    } else {
      const text = `[SmartDose Safety Alert] Hi ${cg.name}, ${profile.name}'s evening medication (Metformin 500mg) has not been confirmed within ${cg.alertDelayMinutes} minutes of scheduled reminder. Note: This indicates confirmation was not received in the app, not necessarily that the dose was missed. Please check in with ${profile.name.split(' ')[0]} at ${profile.emergencyContactPhone || 'home'}.`;
      setSimulatedAlertMessage(text);
    }
  };

  const toggleConsent = () => {
    const nextConsent = !profile.caregiverConsentAccepted;
    onUpdateProfile({
      caregiverConsentAccepted: nextConsent,
      caregiverConsentDate: nextConsent ? new Date().toISOString() : undefined,
    });
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Title & Action */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
            Caregiver Network
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Family & medical contacts for safety escalations
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-600/20 hover:from-sky-700 hover:to-teal-700 transition"
        >
          <UserPlus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Caregiver</span>
        </button>
      </div>

      {/* 1. PATIENT CONSENT & AUTHORIZATION AGREEMENT (SECURITY & PRIVACY) */}
      <div className={`rounded-3xl p-4 sm:p-5 border-2 transition-all shadow-sm space-y-3 ${
        profile.caregiverConsentAccepted
          ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
          : 'bg-rose-50 border-rose-300 text-rose-950'
      }`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
              profile.caregiverConsentAccepted ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
            }`}>
              <FileCheck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-extrabold text-sm sm:text-base">
                  Patient Consent & Secure Data Sharing
                </h3>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                  profile.caregiverConsentAccepted ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'
                }`}>
                  {profile.caregiverConsentAccepted ? 'Consent Active' : 'Access Revoked'}
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed mt-1">
                {profile.caregiverConsentAccepted
                  ? `Authorized on ${new Date(profile.caregiverConsentDate || Date.now()).toLocaleDateString()}: Verified caregivers may receive unconfirmed dose alerts, refill warnings, and adherence digests.`
                  : 'Caregiver sharing is currently disabled. Caregivers cannot receive any alerts until consent is granted.'}
              </p>
            </div>
          </div>

          <button
            onClick={toggleConsent}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex-shrink-0 ${
              profile.caregiverConsentAccepted
                ? 'bg-rose-100 hover:bg-rose-200 text-rose-800'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {profile.caregiverConsentAccepted ? 'Revoke Consent' : 'Grant Consent'}
          </button>
        </div>
      </div>

      {/* Critical Safety Distinction Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs sm:text-sm text-amber-900 space-y-1 shadow-sm">
        <div className="flex items-center gap-2 font-bold text-amber-950">
          <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>Clinical Escalation Protocol Notice</span>
        </div>
        <p className="text-xs text-amber-800 leading-relaxed">
          SmartDose strictly distinguishes <em>"unconfirmed dose"</em> from <em>"medicine not taken"</em>. When a reminder goes unconfirmed after the designated delay, caregivers receive a gentle check-in prompt to avoid undue alarm or panic.
        </p>
      </div>

      {/* Caregiver List */}
      {caregivers.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 shadow-sm space-y-3">
          <div className="w-14 h-14 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center mx-auto">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h3 className="font-heading font-extrabold text-slate-800 text-lg">
            No Caregivers Configured
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            Add a family member, nurse, or physician. If a dose is unconfirmed past your grace period or supply runs low, they can be securely alerted to check on you.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-sky-600 text-white font-bold text-xs sm:text-sm hover:bg-sky-700 transition"
          >
            Add Your First Caregiver
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {caregivers.map((cg) => (
            <div
              key={cg.id}
              className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-500 text-white font-black flex items-center justify-center text-lg flex-shrink-0 shadow-sm">
                    {cg.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-extrabold text-slate-900 text-base leading-tight">
                        {cg.name}
                      </h3>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-100">
                        {cg.relationship}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        Code: {cg.verificationCode || '4821'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-600">
                      <span className="flex items-center gap-1 font-medium">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {cg.phone}
                      </span>
                      {cg.email && (
                        <span className="flex items-center gap-1 text-slate-500">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          {cg.email}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onDeleteCaregiver(cg.id)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  title="Revoke Caregiver Access"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Preferences & Toggles */}
              <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={cg.alertOnMissed}
                      onChange={() => onToggleAlertSetting(cg.id, 'alertOnMissed')}
                      className="rounded text-sky-600 focus:ring-sky-500"
                    />
                    <span>Unconfirmed Alert ({cg.alertDelayMinutes}m)</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={cg.alertOnLowRefill}
                      onChange={() => onToggleAlertSetting(cg.id, 'alertOnLowRefill')}
                      className="rounded text-sky-600 focus:ring-sky-500"
                    />
                    <span>Low Supply Refill Alerts</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={cg.shareAdherenceWeekly}
                      onChange={() => onToggleAlertSetting(cg.id, 'shareAdherenceWeekly')}
                      className="rounded text-sky-600 focus:ring-sky-500"
                    />
                    <span>Weekly Adherence Digest</span>
                  </label>
                </div>

                {/* Simulated Alert Triggers */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-400">
                    Test Outbound Escalation:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => simulateCaregiverAlert(cg, 'missed')}
                      className="px-2.5 py-1 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 font-bold hover:bg-teal-100 transition flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                      <span>Simulate Missed Alert</span>
                    </button>

                    <button
                      onClick={() => simulateCaregiverAlert(cg, 'refill')}
                      className="px-2.5 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 font-bold hover:bg-amber-100 transition flex items-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
                      <span>Simulate Refill Alert</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Simulated Alert Modal / Preview */}
      {simulatedAlertMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-500 animate-bounce" />
                <h3 className="font-heading font-extrabold text-slate-900 text-base">
                  Simulated Caregiver Alert ({simulatedAlertType === 'refill' ? 'Refill Warning' : 'Unconfirmed Dose'})
                </h3>
              </div>
              <button
                onClick={() => setSimulatedAlertMessage(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700"
              >
                Close
              </button>
            </div>

            <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl text-xs font-mono leading-relaxed space-y-2 border border-slate-800">
              <div className="text-[10px] text-teal-400 uppercase tracking-widest font-bold">
                [Outbound Dispatch Payload]
              </div>
              <p>{simulatedAlertMessage}</p>
            </div>

            <p className="text-xs text-slate-500">
              Dispatched with verified patient consent. For testing right now, you can also open this via WhatsApp directly:
            </p>

            <div className="flex gap-2">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(simulatedAlertMessage)}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs text-center hover:bg-emerald-700 flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open in WhatsApp</span>
              </a>
              <button
                onClick={() => setSimulatedAlertMessage(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Caregiver Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-sky-600" />
                <h3 className="font-heading font-extrabold text-slate-900 text-lg">
                  Add Caregiver
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSaveCaregiver} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah Vance"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Relationship <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  placeholder="e.g. Daughter, Nurse, Doctor, Spouse"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +1 (555) 234-5678"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Access & Notification Level
                </label>
                <select
                  value={accessLevel}
                  onChange={(e) => setAccessLevel(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                >
                  <option value="full">Full Access (Missed Doses + Low Refills + Adherence)</option>
                  <option value="emergency_only">Emergency Escalations Only</option>
                  <option value="adherence_only">Weekly Adherence Reports Only</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Alert Escalation Delay (Minutes)
                </label>
                <select
                  value={alertDelayMinutes}
                  onChange={(e) => setAlertDelayMinutes(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                >
                  <option value={30}>30 minutes after reminder</option>
                  <option value={45}>45 minutes after reminder (Recommended)</option>
                  <option value={60}>60 minutes after reminder</option>
                  <option value={90}>90 minutes after reminder</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 text-white font-extrabold shadow-md shadow-sky-600/20"
                >
                  Save Caregiver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

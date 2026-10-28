import React, { useState } from 'react';
import { Pill, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Eye } from 'lucide-react';
import { UserProfile } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (profileUpdates: Partial<UserProfile>, loadDemoData: boolean) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete }) => {
  if (!isOpen) return null;

  const [step, setStep] = useState(1);
  const [userName, setUserName] = useState('Eleanor Vance');
  const [elderlyMode, setElderlyMode] = useState(false);
  const [startWithDemo, setStartWithDemo] = useState(true);

  const handleFinish = () => {
    onComplete(
      {
        name: userName.trim() || 'Eleanor Vance',
        elderlyMode,
        isGuest: startWithDemo,
      },
      startWithDemo
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-md p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Progress Header */}
        <div className="bg-gradient-to-r from-sky-600 to-teal-600 p-6 text-white text-center relative">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-2 border border-white/25">
            <Pill className="w-8 h-8 -rotate-45" />
          </div>
          <h2 className="font-heading font-extrabold text-2xl tracking-tight">
            Welcome to SmartDose
          </h2>
          <p className="text-xs text-sky-100 font-medium mt-1">
            Smart, accessible medicine reminders for elderly & chronic care
          </p>

          <div className="flex justify-center gap-1.5 mt-4">
            <span className={`h-1.5 rounded-full transition-all ${step === 1 ? 'w-8 bg-white' : 'w-2 bg-white/40'}`} />
            <span className={`h-1.5 rounded-full transition-all ${step === 2 ? 'w-8 bg-white' : 'w-2 bg-white/40'}`} />
          </div>
        </div>

        {/* Step 1: User Name & Demo Choice */}
        {step === 1 && (
          <div className="p-5 sm:p-6 space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800">
                What should SmartDose call you?
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="e.g. Eleanor Vance"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-slate-800">
                Choose Demonstration Setup:
              </label>

              <button
                type="button"
                onClick={() => setStartWithDemo(true)}
                className={`w-full p-3 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  startWithDemo
                    ? 'border-sky-500 bg-sky-50 text-sky-950 font-bold'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Sparkles className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-extrabold">Hackathon Demo Mode (Recommended)</div>
                  <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                    Preloads 3 realistic chronic prescriptions (Metformin, Lisinopril, Atorvastatin) and 88% adherence history.
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setStartWithDemo(false)}
                className={`w-full p-3 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  !startWithDemo
                    ? 'border-sky-500 bg-sky-50 text-sky-950 font-bold'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-extrabold">Fresh Clean Slate</div>
                  <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                    Start with empty medication logs to add your own prescriptions from scratch.
                  </div>
                </div>
              </button>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 text-white font-extrabold text-sm shadow-md hover:from-sky-700 hover:to-teal-700 flex items-center justify-center gap-1.5 transition"
            >
              <span>Next: Accessibility Setup</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Accessibility Preference */}
        {step === 2 && (
          <div className="p-5 sm:p-6 space-y-4">
            <div className="space-y-1">
              <h3 className="font-heading font-extrabold text-slate-900 text-base">
                Accessibility Preferences
              </h3>
              <p className="text-xs text-slate-500">
                SmartDose is designed to be effortlessly usable by seniors and elderly patients.
              </p>
            </div>

            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-amber-600" />
                  <span className="font-extrabold text-slate-900 text-sm">
                    Enable Elderly Accessible Mode
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={elderlyMode}
                  onChange={(e) => setElderlyMode(e.target.checked)}
                  className="w-5 h-5 rounded text-amber-600 focus:ring-amber-500"
                />
              </div>
              <p className="text-xs text-amber-900">
                Increases text font size, expands touch buttons to 56px, and applies high-contrast visual borders. You can toggle this on or off anytime from the header.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
              >
                Back
              </button>
              <button
                onClick={handleFinish}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 text-white font-extrabold text-sm shadow-md hover:from-sky-700 hover:to-teal-700 flex items-center justify-center gap-1.5 transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Launch SmartDose</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

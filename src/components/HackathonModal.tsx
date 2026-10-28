import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Award,
  Layers,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Mic,
  Copy,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { SQLITE_SCHEMA_DDL } from '../utils/sqliteSchema';

interface HackathonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HackathonModal: React.FC<HackathonModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<
    'pitch' | 'problem' | 'solution' | 'architecture' | 'innovation' | 'schema' | 'future'
  >('pitch');
  const [copiedSchema, setCopiedSchema] = useState(false);

  const copySchemaToClipboard = () => {
    navigator.clipboard.writeText(SQLITE_SCHEMA_DDL);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-md p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-600 p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Award className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-extrabold text-lg sm:text-xl leading-tight">
                  SmartDose Mini-Hackathon Presentation Kit
                </h3>
                <span className="text-[10px] font-bold bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full uppercase">
                  Judge Deck
                </span>
              </div>
              <p className="text-xs text-violet-100 font-medium">
                2-Member College Team Showcase • Problem, Architecture & Live Pitch
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-black/20 hover:bg-black/30 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-50 px-3 py-2 gap-1 text-xs font-bold text-slate-600">
          {[
            { id: 'pitch', label: '3-Min Pitch Script', icon: Mic },
            { id: 'problem', label: '1. Problem', icon: AlertTriangle },
            { id: 'solution', label: '2. Solution', icon: Lightbulb },
            { id: 'architecture', label: '3. Architecture', icon: Layers },
            { id: 'innovation', label: '4. Innovations', icon: Sparkles },
            { id: 'schema', label: '5. SQLite Schema', icon: Layers },
            { id: 'future', label: '6. Limitations & Roadmap', icon: Clock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'hover:bg-slate-200/70 text-slate-600'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Slide Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {/* 3-Minute Live Pitch Script */}
          {activeTab === 'pitch' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <Mic className="w-4 h-4 text-amber-600" />
                  3-Minute Judge Presentation Script (Team of 2)
                </span>
                <p className="text-xs text-amber-950 font-medium">
                  Follow these exact speaking cues during your live demo to cover the problem, software architecture, elderly UX, and adherence calculations.
                </p>
              </div>

              {/* Speaker 1 */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-indigo-700 text-xs uppercase tracking-wider">
                    Speaker 1 — Problem & Motivation (0:00 - 0:50)
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">50 seconds</span>
                </div>
                <blockquote className="italic border-l-4 border-indigo-500 pl-3 py-1 text-slate-800">
                  "Good morning judges! Over 48% of elderly chronic patients struggle to remember multiple daily prescriptions. Medication non-adherence causes 125,000 preventable deaths annually and billions in avoidable hospitalizations. While hardware pillboxes exist, they are expensive, break easily, and require constant charging. We built <strong>SmartDose</strong>: an accessible, zero-hardware, software-first mobile application engineered specifically for elderly patients and their families."
                </blockquote>
              </div>

              {/* Speaker 2 */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sky-700 text-xs uppercase tracking-wider">
                    Speaker 2 — Live Product Demo & UX (0:50 - 1:50)
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">60 seconds</span>
                </div>
                <blockquote className="italic border-l-4 border-sky-500 pl-3 py-1 text-slate-800">
                  "Let's look at the live app. Notice our <strong>Elderly Mode</strong>: with one tap, buttons expand to 56px touch targets and typography scales up for high readability. On the Today dashboard, Eleanor Vance sees her next dose with a live countdown and meal instructions. When she takes her Lisinopril, she taps 'Mark as Taken' — notice our Web Audio API chime plays without needing external MP3 files. And notice how our adherence percentage calculates strictly on due doses, never punishing future doses."
                </blockquote>
              </div>

              {/* Speaker 1 */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-teal-700 text-xs uppercase tracking-wider">
                    Speaker 1 — Caregiver Escalation & Safety (1:50 - 2:30)
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">40 seconds</span>
                </div>
                <blockquote className="italic border-l-4 border-teal-500 pl-3 py-1 text-slate-800">
                  "A key innovation is our <strong>Grace Period Escalation Engine</strong>. If a reminder is ignored for 45 minutes, it moves to 'Missed', and SmartDose prepares an alert for daughter Sarah. Notice our critical distinction: we never claim the patient failed to take the pill; we alert that confirmation was not received, prompting a caring phone call without false panic. Patients can also retroactively fix records or export a doctor's CSV report."
                </blockquote>
              </div>

              {/* Speaker 2 */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-violet-700 text-xs uppercase tracking-wider">
                    Speaker 2 — Conclusion & Future Roadmap (2:30 - 3:00)
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">30 seconds</span>
                </div>
                <blockquote className="italic border-l-4 border-violet-500 pl-3 py-1 text-slate-800">
                  "SmartDose is built on a clean relational SQLite schema, runs 100% offline with zero server lock-in, and can be compiled into an Android APK via Capacitor. In future iterations, we plan to add OCR prescription bottle scanning and BLE pillbox integration. Thank you, and we welcome your questions!"
                </blockquote>
              </div>
            </div>
          )}

          {/* Problem Statement */}
          {activeTab === 'problem' && (
            <div className="space-y-3">
              <h4 className="font-heading font-extrabold text-slate-900 text-base">
                The Medication Non-Adherence Crisis
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-2xl text-center">
                  <span className="text-2xl font-black text-rose-700 font-heading">50%</span>
                  <p className="text-xs text-rose-900 font-bold mt-1">Non-Adherence Rate</p>
                  <p className="text-[11px] text-rose-800 mt-0.5">In patients taking 3+ daily medications</p>
                </div>
                <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl text-center">
                  <span className="text-2xl font-black text-amber-700 font-heading">125k</span>
                  <p className="text-xs text-amber-900 font-bold mt-1">Preventable Deaths</p>
                  <p className="text-[11px] text-amber-800 mt-0.5">Annually in the US alone due to missed medications</p>
                </div>
                <div className="bg-indigo-50 border border-indigo-200 p-3.5 rounded-2xl text-center">
                  <span className="text-2xl font-black text-indigo-700 font-heading">$300B</span>
                  <p className="text-xs text-indigo-900 font-bold mt-1">Avoidable Healthcare Cost</p>
                  <p className="text-[11px] text-indigo-800 mt-0.5">Direct cost of readmissions and complications</p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <h5 className="font-bold text-slate-800">Key Barriers Faced by Elderly Users:</h5>
                <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
                  <li><strong>Small UI Targets:</strong> Most reminder apps have tiny buttons and cluttered menus impossible for shaky hands or impaired vision.</li>
                  <li><strong>False Assumptions:</strong> Many apps assume an opened notification equals a swallowed pill, producing dangerously inaccurate medical records.</li>
                  <li><strong>Complex Hardware:</strong> Bluetooth pillboxes are expensive, easily misplaced, and run out of battery.</li>
                </ul>
              </div>
            </div>
          )}

          {/* Solution */}
          {activeTab === 'solution' && (
            <div className="space-y-3">
              <h4 className="font-heading font-extrabold text-slate-900 text-base">
                Proposed Solution: SmartDose
              </h4>
              <p>
                SmartDose provides a pure-software, mobile-first medication companion engineered with extreme accessibility, verifiable intake logging, and a compassionate caregiver escalation protocol.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-2xl border border-slate-200 bg-white space-y-1.5">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Elderly-First Accessibility
                  </span>
                  <p className="text-xs text-slate-600">
                    High-contrast color profiles, 56px touch targets, color-coded medicine badges, and clear meal instructions.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl border border-slate-200 bg-white space-y-1.5">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Offline-First Local Database
                  </span>
                  <p className="text-xs text-slate-600">
                    Stores all schedules and dose audit logs locally using relational SQLite structures. Zero dependency on continuous internet.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl border border-slate-200 bg-white space-y-1.5">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Strict Clinical Adherence Math
                  </span>
                  <p className="text-xs text-slate-600">
                    Formula: (Taken ÷ Due) × 100. Never counts future scheduled doses in denominator, providing genuine clinical compliance scores.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl border border-slate-200 bg-white space-y-1.5">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Safety Escalation vs Panic
                  </span>
                  <p className="text-xs text-slate-600">
                    Distinguishes "unconfirmed intake" from "missed dose" to prevent unnecessary panic when notifying family members.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Architecture */}
          {activeTab === 'architecture' && (
            <div className="space-y-3">
              <h4 className="font-heading font-extrabold text-slate-900 text-base">
                System Architecture & Tech Stack
              </h4>
              <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl font-mono text-xs space-y-2 border border-slate-800">
                <div className="text-teal-400 font-bold">[SmartDose Architectural Diagram]</div>
                <div>+-----------------------------------------------------------+</div>
                <div>|                      React SPA & PWA                      |</div>
                <div>|  - Tailwind CSS v4 Responsive Mobile Viewport UI        |</div>
                <div>|  - Web Audio API Chime Synthesizer (0 External Assets)  |</div>
                <div>|  - Service Worker Background Notifications             |</div>
                <div>+-----------------------------+-----------------------------+</div>
                <div>                              |                              </div>
                <div>                              v                              </div>
                <div>+-----------------------------------------------------------+</div>
                <div>|           Smart Medication Relational Data Layer          |</div>
                <div>|  - medicines (Master Catalog, Dosage, Meal Instructions)  |</div>
                <div>|  - medicine_schedules (1-to-Many Multi-Time Reminders)   |</div>
                <div>|  - dose_instances (Taken, Missed, Pending, Snooze Logs)   |</div>
                <div>|  - caregivers & alert_escalation_rules                    |</div>
                <div>+-----------------------------+-----------------------------+</div>
                <div>                              |                              </div>
                <div>                              v                              </div>
                <div>+-----------------------------------------------------------+</div>
                <div>|            Android Native Bridge (Capacitor / TWA)        |</div>
                <div>|  - SCHEDULE_EXACT_ALARM + POST_NOTIFICATIONS Permissions  |</div>
                <div>|  - Native SQLite Storage Option / IndexedDB Persist      |</div>
                <div>+-----------------------------------------------------------+</div>
              </div>
            </div>
          )}

          {/* Innovations */}
          {activeTab === 'innovation' && (
            <div className="space-y-3">
              <h4 className="font-heading font-extrabold text-slate-900 text-base">
                Key Hackathon Innovations
              </h4>
              <div className="space-y-2.5">
                <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200">
                  <h5 className="font-bold text-sky-950 text-xs sm:text-sm">
                    1. Zero-False-Positive Adherence Accounting
                  </h5>
                  <p className="text-xs text-sky-900 mt-1">
                    Standard apps mark doses as "taken" simply when a notification is swiped away. SmartDose enforces explicit confirmation, supports configurable snooze intervals that do not corrupt adherence math, and provides retroactive record correction with audit notes.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200">
                  <h5 className="font-bold text-teal-950 text-xs sm:text-sm">
                    2. Web Audio Synthesizer (Zero External Dependencies)
                  </h5>
                  <p className="text-xs text-teal-900 mt-1">
                    Rather than relying on external MP3 audio files that fail offline or suffer from CORS restrictions, SmartDose synthesizes soothing medical harmonic chimes directly using browser Web Audio oscillators and envelope filters.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-violet-50 border border-violet-200">
                  <h5 className="font-bold text-violet-950 text-xs sm:text-sm">
                    3. Doctor-Ready Clinical CSV & Printable Sheets
                  </h5>
                  <p className="text-xs text-violet-900 mt-1">
                    Generates exportable clinical logs with exact scheduled times, timestamps, and skip reasons for visits with cardiologists and primary care doctors.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SQLite Relational Schema */}
          {activeTab === 'schema' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-heading font-extrabold text-slate-900 text-base">
                    Relational SQLite Database Schema (DDL)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Production schema for Android SQLite / Room / Flutter sqflite
                  </p>
                </div>
                <button
                  onClick={copySchemaToClipboard}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
                >
                  {copiedSchema ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedSchema ? 'Copied!' : 'Copy SQL'}</span>
                </button>
              </div>

              <pre className="bg-slate-900 text-slate-200 p-4 rounded-2xl text-[11px] font-mono overflow-x-auto max-h-80 border border-slate-800 leading-relaxed">
                {SQLITE_SCHEMA_DDL}
              </pre>
            </div>
          )}

          {/* Limitations & Future Roadmap */}
          {activeTab === 'future' && (
            <div className="space-y-3">
              <h4 className="font-heading font-extrabold text-slate-900 text-base">
                Current Limitations & Future Roadmap
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-1.5">
                  <span className="font-bold text-amber-950 text-xs flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Current Limitations
                  </span>
                  <ul className="list-disc list-inside text-xs text-amber-900 space-y-1 pl-1">
                    <li>Subject to Android OEM battery saver killing background threads without unrestricted battery permission.</li>
                    <li>Caregiver alerts currently run in local verified simulation mode without dedicated SMS cellular gateway API key.</li>
                    <li>Manual prescription entry required without optical scanner.</li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1.5">
                  <span className="font-bold text-emerald-950 text-xs flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    Future Phase 2 Roadmap
                  </span>
                  <ul className="list-disc list-inside text-xs text-emerald-900 space-y-1 pl-1">
                    <li><strong>OCR Camera Prescription Scanner:</strong> Scan medicine label photo to autofill name, dosage, and frequency.</li>
                    <li><strong>BLE Smart Pillbox Link:</strong> Optional magnetic sensor lid detection over Bluetooth Low Energy.</li>
                    <li><strong>Multi-Device Cloud Firestore Sync:</strong> Real-time family dashboard for remote caregivers.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>SmartDose • College Mini-Hackathon Edition</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-900 transition"
          >
            Close Presentation Kit
          </button>
        </div>
      </div>
    </div>
  );
};

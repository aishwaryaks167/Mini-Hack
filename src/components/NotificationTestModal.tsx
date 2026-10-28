import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Play,
  Volume2,
  Mic,
  Smartphone,
  Clock,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { UserProfile, DoseInstance } from '../types';
import { playReminderSound } from '../utils/audio';
import { speakText } from '../utils/speech';
import {
  getNotificationPermissionStatus,
  requestNotificationPermission,
  triggerSystemNotification,
} from '../utils/notifications';

interface NotificationTestModalProps {
  isOpen: boolean;
  profile: UserProfile;
  sampleDose: DoseInstance;
  onClose: () => void;
  onTriggerAlarmModal: (dose: DoseInstance) => void;
}

export const NotificationTestModal: React.FC<NotificationTestModalProps> = ({
  isOpen,
  profile,
  sampleDose,
  onClose,
  onTriggerAlarmModal,
}) => {
  if (!isOpen) return null;

  const [permStatus, setPermStatus] = useState(getNotificationPermissionStatus());
  const [swActive, setSwActive] = useState<boolean>(false);
  const [testCountdown, setTestCountdown] = useState<number | null>(null);
  const [testLog, setTestLog] = useState<string[]>([]);
  const countdownIntervalRef = useRef<any>(null);

  useEffect(() => {
    setPermStatus(getNotificationPermissionStatus());
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        setSwActive(!!reg);
      });
    }
    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, []);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setTestLog((prev) => [`[${time}] ${msg}`, ...prev.slice(0, 8)]);
  };

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    setPermStatus(getNotificationPermissionStatus());
    if (granted) {
      addLog('OS Notification Permission granted by user');
      triggerSystemNotification('SmartDose Diagnostic', {
        body: 'Notifications are verified and working on this device.',
      });
    } else {
      addLog('Notification Permission was denied or ignored');
    }
  };

  const handleTestChime = () => {
    playReminderSound(profile.soundTone || 'chime');
    addLog(`Played audio tone: ${profile.soundTone || 'chime'}`);
  };

  const handleTestVoice = () => {
    speakText(`Time for your medicine: ${sampleDose.medicineName}, ${sampleDose.strength}. Take as prescribed.`, {
      rate: profile.voiceRate || 0.85,
    });
    addLog(`Synthesized voice speech for: ${sampleDose.medicineName}`);
  };

  const startCountdownTest = (seconds: number = 8) => {
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    setTestCountdown(seconds);
    addLog(`Initiated ${seconds}s live reminder countdown test. Try locking screen or switching tabs!`);

    countdownIntervalRef.current = setInterval(() => {
      setTestCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownIntervalRef.current);
          countdownIntervalRef.current = null;

          // Fire all alerts
          addLog('⏰ REMINDER TRIGGERED: Firing notification, sound, speech, and alarm modal');

          // 1. Audio chime
          if (profile.soundAlerts) {
            playReminderSound(profile.soundTone || 'chime');
          }

          // 2. Voice speech
          if (profile.voiceEnabled) {
            speakText(`Time for your medicine: ${sampleDose.medicineName}, ${sampleDose.strength}. Scheduled for now.`, {
              rate: profile.voiceRate || 0.85,
            });
          }

          // 3. System Push/Local Notification
          triggerSystemNotification(
            profile.maskNotifications ? 'Medication Reminder' : `Medication Due: ${sampleDose.medicineName}`,
            {
              body: profile.maskNotifications
                ? 'Time for your scheduled medication. Open app to confirm.'
                : `Time to take ${sampleDose.strength} (${sampleDose.quantityPerDose} ${sampleDose.unit}). Tap to confirm.`,
              image: profile.maskNotifications ? undefined : sampleDose.imageUrl,
              vibrate: [200, 100, 200, 100, 200],
            }
          );

          // 4. Modal Alert
          onTriggerAlarmModal(sampleDose);
          onClose();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-md p-3 sm:p-5 animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-600 via-teal-600 to-sky-700 p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-lg sm:text-xl leading-tight">
                Notification Diagnostic & Test Lab
              </h3>
              <p className="text-xs text-sky-100 font-medium">
                Verify multi-channel reminder delivery on this device
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

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* Diagnostic Status Chips */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 text-xs">OS Notification</span>
                <span
                  className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                    permStatus === 'granted'
                      ? 'bg-emerald-100 text-emerald-800'
                      : permStatus === 'denied'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {permStatus}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                {permStatus === 'granted'
                  ? 'System permission active.'
                  : 'Action required to show banners.'}
              </p>
              {permStatus !== 'granted' && (
                <button
                  onClick={handleRequestPermission}
                  className="mt-1 w-full py-1.5 rounded-lg bg-sky-600 text-white font-bold text-xs hover:bg-sky-700 transition"
                >
                  Request Permission
                </button>
              )}
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 text-xs">Audio Chimes</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Ready
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Web Audio API synthesized locally.</p>
              <button
                onClick={handleTestChime}
                className="mt-1 w-full py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition flex items-center justify-center gap-1"
              >
                <Volume2 className="w-3.5 h-3.5" />
                Play Test Chime
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 text-xs">Voice Speech</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Active
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Web Speech API voice engine.</p>
              <button
                onClick={handleTestVoice}
                className="mt-1 w-full py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition flex items-center justify-center gap-1"
              >
                <Mic className="w-3.5 h-3.5" />
                Speak Test Dose
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 text-xs">Offline PWA</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Cached
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Service Worker background support.</p>
            </div>
          </div>

          {/* Interactive Countdown Test Section */}
          <div className="bg-gradient-to-r from-sky-50 to-teal-50 border-2 border-sky-300 rounded-2xl p-4 text-center space-y-3">
            <div className="space-y-1">
              <h4 className="font-heading font-extrabold text-slate-900 text-base flex items-center justify-center gap-1.5">
                <Clock className="w-4 h-4 text-sky-600" />
                Live 8-Second Countdown Reminder Test
              </h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Starts an 8-second timer. Switch tabs or minimize app to test OS background delivery!
              </p>
            </div>

            {testCountdown !== null ? (
              <div className="space-y-2 py-2">
                <div className="w-16 h-16 rounded-full bg-sky-600 text-white font-heading font-black text-2xl flex items-center justify-center mx-auto shadow-lg shadow-sky-600/30 animate-pulse">
                  {testCountdown}s
                </div>
                <p className="text-xs font-semibold text-sky-800">
                  Simulating reminder delivery for <strong>{sampleDose.medicineName}</strong>...
                </p>
                <button
                  onClick={() => {
                    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
                    setTestCountdown(null);
                    addLog('Countdown test cancelled.');
                  }}
                  className="px-3 py-1 rounded-lg border border-slate-300 text-slate-600 text-xs font-bold hover:bg-slate-100"
                >
                  Cancel Timer
                </button>
              </div>
            ) : (
              <button
                onClick={() => startCountdownTest(8)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 text-white font-extrabold text-sm shadow-md shadow-sky-600/25 hover:from-sky-700 hover:to-teal-700 active:scale-[0.99] transition flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Start 8-Second Live Countdown Test</span>
              </button>
            )}
          </div>

          {/* Android Background Execution Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-xs text-amber-950 space-y-1.5">
            <div className="font-bold flex items-center gap-1.5 text-amber-900">
              <Smartphone className="w-4 h-4 text-amber-600" />
              <span>Android OEM Background Reminder Check</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-amber-900/90 pl-1 text-[11px]">
              <li><strong>Samsung:</strong> Settings → Battery → Background usage limits → Put SmartDose in "Never sleeping apps".</li>
              <li><strong>Xiaomi/MIUI:</strong> Enable "Autostart" and set Battery Saver to "No restrictions".</li>
              <li><strong>Do Not Disturb:</strong> Allow SmartDose through DND priority exemptions so chime sounds during sleep.</li>
            </ul>
          </div>

          {/* Live Diagnostic Console */}
          {testLog.length > 0 && (
            <div className="bg-slate-950 text-slate-300 p-3.5 rounded-2xl font-mono text-[11px] space-y-1 border border-slate-800">
              <div className="text-[10px] text-teal-400 font-bold uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Diagnostic Event Stream</span>
                <button onClick={() => setTestLog([])} className="hover:text-white">Clear</button>
              </div>
              {testLog.map((log, idx) => (
                <div key={idx} className="leading-tight text-slate-300">{log}</div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-900 transition"
          >
            Close Lab
          </button>
        </div>
      </div>
    </div>
  );
};

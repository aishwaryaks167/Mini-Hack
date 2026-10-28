import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Terminal,
  CheckCircle2,
  Copy,
  ExternalLink,
  Shield,
  Layers,
} from 'lucide-react';

interface AndroidBuildGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidBuildGuideModal: React.FC<AndroidBuildGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [activeApproach, setActiveApproach] = useState<'capacitor' | 'twa' | 'permissions'>('capacitor');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyCode = (key: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const capacitorCommands = `# 1. Install Capacitor dependencies
npm install @capacitor/core @capacitor/android
npm install -D @capacitor/cli

# 2. Initialize Capacitor Configuration
npx cap init "SmartDose" "com.smartdose.app" --web-dir "dist"

# 3. Add Android platform project
npx cap add android

# 4. Build web production bundle & copy assets to Android
npm run build
npx cap sync android

# 5. Open in Android Studio or compile APK via command line
npx cap open android

# Or build release APK directly via Gradle wrapper:
cd android
./gradlew assembleRelease
# Resulting APK will be located at:
# android/app/build/outputs/apk/release/app-release-unsigned.apk`;

  const manifestPermissions = `<!-- Add to android/app/src/main/AndroidManifest.xml inside <manifest> -->

<!-- Required for accurate medication reminder alarms on Android 12+ -->
<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
<uses-permission android:name="android.permission.USE_EXACT_ALARM" />

<!-- Required for Push/Local Notifications on Android 13+ (API 33+) -->
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

<!-- Reschedule reminders on device reboot -->
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />

<!-- Prevent CPU sleeping during reminder chime synthesis -->
<uses-permission android:name="android.permission.WAKE_LOCK" />
<uses-permission android:name="android.permission.VIBRATE" />`;

  const bubblewrapCommands = `# 1. Install Google's official Bubblewrap CLI for Trusted Web Activity (TWA)
npm install -g @bubblewrap/cli

# 2. Initialize Android Project directly from Web App Manifest
bubblewrap init --manifest https://ais-pre-ufrb5ufafbnjvqjwt7nrnp-784631161416.asia-northeast1.run.app/manifest.json

# 3. Build signed production APK
bubblewrap build

# Result: Output file 'app-release-signed.apk' ready for sideloading or Google Play Store!`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-md p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-lg sm:text-xl leading-tight">
                Android APK Compilation & Deployment Guide
              </h3>
              <p className="text-xs text-emerald-100 font-medium">
                Step-by-step instructions to compile SmartDose into an Android APK
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

        {/* Subtabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-3 py-2 gap-1 text-xs font-bold text-slate-600">
          {[
            { id: 'capacitor', label: '1. Capacitor (Recommended)' },
            { id: 'permissions', label: '2. AndroidManifest.xml' },
            { id: 'twa', label: '3. Bubblewrap TWA APK' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveApproach(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeApproach === tab.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'hover:bg-slate-200/70 text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {activeApproach === 'capacitor' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-heading font-extrabold text-slate-900 text-base">
                    Native Android APK via Capacitor
                  </h4>
                  <p className="text-xs text-slate-500">
                    Wraps the SmartDose React application inside a native Android Studio WebView container with full access to Android alarm services.
                  </p>
                </div>
                <button
                  onClick={() => copyCode('cap', capacitorCommands)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
                >
                  {copiedKey === 'cap' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedKey === 'cap' ? 'Copied' : 'Copy Commands'}</span>
                </button>
              </div>

              <pre className="bg-slate-900 text-emerald-400 p-4 rounded-2xl text-[11px] font-mono overflow-x-auto border border-slate-800 leading-relaxed">
                {capacitorCommands}
              </pre>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                <strong>Prerequisites for Android Studio:</strong>
                <p>Ensure Android SDK 33+ (Tiramisu) and JDK 17 are installed on your machine. Running <code>./gradlew assembleDebug</code> will generate an installable debug APK in seconds.</p>
              </div>
            </div>
          )}

          {activeApproach === 'permissions' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-heading font-extrabold text-slate-900 text-base">
                    Required Android Permissions
                  </h4>
                  <p className="text-xs text-slate-500">
                    Mandatory permissions for Android 12+ and 13+ background alarm delivery
                  </p>
                </div>
                <button
                  onClick={() => copyCode('perm', manifestPermissions)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
                >
                  {copiedKey === 'perm' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedKey === 'perm' ? 'Copied' : 'Copy XML'}</span>
                </button>
              </div>

              <pre className="bg-slate-900 text-sky-300 p-4 rounded-2xl text-[11px] font-mono overflow-x-auto border border-slate-800 leading-relaxed">
                {manifestPermissions}
              </pre>

              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-900">
                <strong>Important for Android 14 (API 34):</strong> <code>SCHEDULE_EXACT_ALARM</code> requires the user to grant permission in device settings if the app is not in the Alarm Clock / Medicine category. SmartDose handles permission denial gracefully by falling back to in-app notification scheduling.
              </div>
            </div>
          )}

          {activeApproach === 'twa' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-heading font-extrabold text-slate-900 text-base">
                    Lightweight APK via Bubblewrap TWA
                  </h4>
                  <p className="text-xs text-slate-500">
                    Google's official CLI tool that turns any Progressive Web App into a signed Android APK without writing Java or Kotlin.
                  </p>
                </div>
                <button
                  onClick={() => copyCode('twa', bubblewrapCommands)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
                >
                  {copiedKey === 'twa' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedKey === 'twa' ? 'Copied' : 'Copy CLI'}</span>
                </button>
              </div>

              <pre className="bg-slate-900 text-amber-300 p-4 rounded-2xl text-[11px] font-mono overflow-x-auto border border-slate-800 leading-relaxed">
                {bubblewrapCommands}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-900 transition"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};

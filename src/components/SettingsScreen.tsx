import React, { useState } from 'react';
import {
  Settings,
  Volume2,
  Bell,
  Eye,
  Globe,
  Clock,
  Database,
  RotateCcw,
  Download,
  Upload,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Smartphone,
  Play,
  User,
  Shield,
  HelpCircle,
  Mic,
  Lock,
  Phone,
  KeyRound,
  ShieldCheck,
  RefreshCw,
  Plus,
  Edit3,
} from 'lucide-react';
import { UserProfile, FontSizeScale, AppLanguage } from '../types';
import { playReminderSound } from '../utils/audio';
import { speakText } from '../utils/speech';
import { getNotificationPermissionStatus, requestNotificationPermission, triggerSystemNotification } from '../utils/notifications';
import { SUPPORTED_LANGUAGES, getTranslation } from '../utils/translations';

interface SettingsScreenProps {
  profile: UserProfile;
  allProfiles?: UserProfile[];
  onSwitchProfile?: (profileId: string) => void;
  onOpenCreateProfile?: () => void;
  onOpenEditProfile?: (profile?: UserProfile) => void;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onResetDemoData: () => void;
  onClearAllData: () => void;
  onExportJSON: () => void;
  onImportJSON: (file: File) => void;
  onOpenBuildGuide: () => void;
  onOpenNotificationLab: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  profile,
  allProfiles = [],
  onSwitchProfile,
  onOpenCreateProfile,
  onOpenEditProfile,
  onUpdateProfile,
  onResetDemoData,
  onClearAllData,
  onExportJSON,
  onImportJSON,
  onOpenBuildGuide,
  onOpenNotificationLab,
}) => {
  const [permissionStatus, setPermissionStatus] = useState(getNotificationPermissionStatus());
  const [notificationTestSuccess, setNotificationTestSuccess] = useState<boolean | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleTestTone = (tone: 'gentle' | 'chime' | 'bell' | 'radar') => {
    playReminderSound(tone);
  };

  const handleTestVoice = () => {
    const testPhrases: Record<string, string> = {
      en: 'Voice assistance active. Next medication: Lisinopril, 10 milligrams, scheduled for 8:00 AM.',
      kn: 'ಧ್ವನಿ ಸಹಾಯ ಸಕ್ರಿಯವಾಗಿದೆ. ಮುಂದಿನ ಔಷಧಿ: ಲಿಸಿನೊಪ್ರಿಲ್, 10 ಮಿಲಿಗ್ರಾಂ, ಬೆಳಗ್ಗೆ 8:00 ಗಂಟೆಗೆ ನಿಗದಿಯಾಗಿದೆ.',
      te: 'వాయిస్ సహాయం సక్రియం చేయబడింది. తదుపరి మందు: లిసినోప్రిల్, 10 మిల్లీగ్రాములు, ఉదయం 8:00 గంటలకు షెడ్యూల్ చేయబడింది.',
      hi: 'आवाज सहायता सक्रिय है। अगली दवा: लिसिनोप्रिल, 10 मिलीग्राम, सुबह 8:00 बजे निर्धारित है।',
    };
    speakText(testPhrases[profile.preferredLanguage] || testPhrases.en, {
      rate: profile.voiceRate || 0.85,
      langCode: profile.preferredLanguage,
    });
  };

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    setPermissionStatus(getNotificationPermissionStatus());
    if (granted) {
      triggerSystemNotification('SmartDose Notification Test', {
        body: 'Medication reminder engine is verified and active!',
      });
      setNotificationTestSuccess(true);
      setTimeout(() => setNotificationTestSuccess(null), 4000);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportJSON(file);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      <div>
        <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
          Settings & Accessibility
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Profiles, large fonts, voice speech, reliable alerts, and privacy security
        </p>
      </div>

      {/* 0. Patient Profiles Management (Create & Edit) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-sky-600" />
            <h3 className="font-heading font-extrabold text-base text-slate-900">
              {getTranslation(profile.preferredLanguage, 'patientProfile') || 'Patient Profiles'}
            </h3>
          </div>
          {onOpenCreateProfile && (
            <button
              onClick={onOpenCreateProfile}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 text-xs font-bold transition active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{getTranslation(profile.preferredLanguage, 'createProfile') || '+ Add Profile'}</span>
            </button>
          )}
        </div>

        {/* Active Profile Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-50/70 via-teal-50/40 to-slate-50 border border-sky-200/80 shadow-xs space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white border-2 border-sky-200 shadow-sm flex items-center justify-center flex-shrink-0">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-sky-500 to-teal-500 flex items-center justify-center text-white text-xl font-black">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-extrabold text-slate-900 text-base sm:text-lg leading-tight">
                    {profile.name}
                  </h4>
                  {profile.relationship && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-100 text-sky-800 border border-sky-200">
                      {profile.relationship}
                    </span>
                  )}
                  <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Active
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-600 font-medium mt-1 flex-wrap">
                  {profile.age && <span>{profile.age} years old</span>}
                  {profile.gender && <span>• {profile.gender}</span>}
                  {profile.bloodGroup && (
                    <span className="font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded-md border border-rose-200 text-[11px]">
                      Blood {profile.bloodGroup}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Edit Button */}
            {onOpenEditProfile && (
              <button
                onClick={() => onOpenEditProfile(profile)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold shadow-xs transition active:scale-95"
              >
                <Edit3 className="w-3.5 h-3.5 text-sky-600" />
                <span>{getTranslation(profile.preferredLanguage, 'editProfile') || 'Edit'}</span>
              </button>
            )}
          </div>

          {/* Quick Details: Allergies & Chronic Conditions */}
          {(profile.allergies && profile.allergies.length > 0) || (profile.chronicConditions && profile.chronicConditions.length > 0) ? (
            <div className="pt-2 border-t border-sky-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {profile.allergies && profile.allergies.length > 0 && (
                <div>
                  <span className="font-bold text-rose-800 text-[11px] block mb-1">
                    Known Drug Allergies:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {profile.allergies.map((allg) => (
                      <span
                        key={allg}
                        className="px-2 py-0.5 rounded-md bg-rose-100/80 text-rose-800 font-bold text-[10px]"
                      >
                        {allg}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {profile.chronicConditions && profile.chronicConditions.length > 0 && (
                <div>
                  <span className="font-bold text-teal-800 text-[11px] block mb-1">
                    Health Conditions:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {profile.chronicConditions.map((cond) => (
                      <span
                        key={cond}
                        className="px-2 py-0.5 rounded-md bg-teal-100/80 text-teal-800 font-bold text-[10px]"
                      >
                        {cond}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {/* Emergency & Doctor Contact snippet */}
          {(profile.emergencyContactName || profile.primaryDoctorName) && (
            <div className="pt-2 border-t border-sky-100/70 text-[11px] text-slate-600 flex flex-wrap items-center gap-x-4 gap-y-1">
              {profile.emergencyContactName && (
                <div>
                  <span className="font-bold text-slate-700">Emergency: </span>
                  {profile.emergencyContactName} ({profile.emergencyContactPhone || 'No phone'})
                </div>
              )}
              {profile.primaryDoctorName && (
                <div>
                  <span className="font-bold text-slate-700">Doctor: </span>
                  {profile.primaryDoctorName}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Switch Between Multiple Profiles (if more than 1) */}
        {allProfiles.length > 1 && (
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-600 block">
              {getTranslation(profile.preferredLanguage, 'manageProfiles') || 'All Saved Family Profiles'} ({allProfiles.length}):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {allProfiles.map((p) => {
                const isCurrent = p.id === profile.id;
                return (
                  <div
                    key={p.id}
                    className={`p-3 rounded-2xl border flex items-center justify-between transition ${
                      isCurrent
                        ? 'border-sky-500 bg-sky-50/60 shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate mr-2">
                      <div className="w-8 h-8 rounded-xl overflow-hidden bg-slate-200 flex items-center justify-center text-xs font-black text-slate-700 flex-shrink-0">
                        {p.avatarUrl ? (
                          <img src={p.avatarUrl} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          p.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-extrabold text-slate-900 truncate">{p.name}</div>
                        <div className="text-[10px] text-slate-500">
                          {p.relationship || 'Patient'} {p.age ? `• ${p.age}y` : ''}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      {isCurrent ? (
                        <span className="text-[11px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">
                          Current
                        </span>
                      ) : (
                        <button
                          onClick={() => onSwitchProfile && onSwitchProfile(p.id)}
                          className="px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-700 transition"
                        >
                          Switch
                        </button>
                      )}
                      {onOpenEditProfile && (
                        <button
                          onClick={() => onOpenEditProfile(p)}
                          title="Edit this profile"
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 transition"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 1. Large Text & Elderly Accessibility */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-amber-500" />
          <h3 className="font-heading font-extrabold text-base text-slate-900">
            Senior Accessibility & Large Text
          </h3>
        </div>

        {/* Big Senior Toggle */}
        <div className="bg-amber-50/80 border-2 border-amber-300 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <span className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-1.5">
              Elderly-Accessible High Contrast Profile
            </span>
            <p className="text-xs text-amber-950 leading-relaxed">
              Enlarges buttons to 56px+ tap targets, applies high-contrast borders, and simplifies medical reminders.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
            <input
              type="checkbox"
              checked={profile.elderlyMode}
              onChange={(e) => onUpdateProfile({ elderlyMode: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-14 h-8 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-amber-600"></div>
          </label>
        </div>

        {/* Font Scaling Options */}
        <div className="space-y-2 pt-1 border-t border-slate-100">
          <label className="block font-bold text-slate-800 text-xs sm:text-sm">
            Text Size Sizing
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'normal', label: 'Standard', desc: '100% Size' },
              { id: 'large', label: 'Large', desc: '+20% Sizing' },
              { id: 'extra-large', label: 'Extra Large', desc: '+35% Senior Size' },
            ].map((scale) => (
              <button
                key={scale.id}
                onClick={() => onUpdateProfile({ fontSizeScale: scale.id as FontSizeScale })}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  profile.fontSizeScale === scale.id
                    ? 'border-sky-600 bg-sky-50 text-sky-950 font-black shadow-sm'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50 font-bold'
                }`}
              >
                <div className="text-xs sm:text-sm">{scale.label}</div>
                <div className="text-[10px] text-slate-500 font-medium">{scale.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Time Format */}
        <div className="flex items-center justify-between py-2 border-t border-slate-100">
          <div>
            <span className="font-bold text-slate-800 text-xs sm:text-sm block">
              Clock Format
            </span>
            <span className="text-xs text-slate-500">
              12-hour AM/PM or 24-hour clock
            </span>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => onUpdateProfile({ timeFormat: '12h' })}
              className={`px-3 py-1.5 rounded-lg transition ${
                profile.timeFormat === '12h' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600'
              }`}
            >
              12-Hour (8:00 AM)
            </button>
            <button
              onClick={() => onUpdateProfile({ timeFormat: '24h' })}
              className={`px-3 py-1.5 rounded-lg transition ${
                profile.timeFormat === '24h' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600'
              }`}
            >
              24-Hour (08:00)
            </button>
          </div>
        </div>
      </div>

      {/* 2. Voice Assistance (Web Speech API) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-sky-600" />
            <h3 className="font-heading font-extrabold text-base text-slate-900">
              Voice Assistance
            </h3>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={profile.voiceEnabled}
              onChange={(e) => onUpdateProfile({ voiceEnabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
          </label>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Speaks medicine names, dosages, and reminder times aloud so older adults and visually impaired users can listen without straining their eyes.
        </p>

        {/* Voice Speech Options */}
        <div className="space-y-3 pt-1 border-t border-slate-100">
          <div>
            <label className="block font-bold text-slate-800 text-xs mb-1.5">
              Voice Speaking Speed
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { rate: 0.75, label: 'Slow (0.75x)' },
                { rate: 0.85, label: 'Natural (0.85x)' },
                { rate: 1.0, label: 'Standard (1.0x)' },
              ].map((opt) => (
                <button
                  key={opt.rate}
                  onClick={() => onUpdateProfile({ voiceRate: opt.rate })}
                  className={`py-2 px-1 rounded-xl text-xs font-bold border transition ${
                    profile.voiceRate === opt.rate
                      ? 'bg-sky-50 border-sky-500 text-sky-900 shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800 py-1">
            <input
              type="checkbox"
              checked={profile.voiceAutoReadAlarms}
              onChange={(e) => onUpdateProfile({ voiceAutoReadAlarms: e.target.checked })}
              className="rounded text-sky-600 focus:ring-sky-500"
            />
            <span>Automatically read dose aloud when alarm triggers</span>
          </label>

          <button
            onClick={handleTestVoice}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition"
          >
            <Volume2 className="w-4 h-4 text-sky-600" />
            <span>Test Voice Announcement Now</span>
          </button>
        </div>
      </div>

      {/* 3. Reliable Notifications & Diagnostics */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-teal-600" />
            <h3 className="font-heading font-extrabold text-base text-slate-900">
              Reliable Notification Engine
            </h3>
          </div>
          <button
            onClick={onOpenNotificationLab}
            className="px-3 py-1.5 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 font-extrabold text-xs hover:bg-teal-100 transition flex items-center gap-1"
          >
            <span>Open Test Lab</span>
          </button>
        </div>

        {/* Chime tone picker */}
        <div className="space-y-2">
          <span className="font-bold text-slate-800 text-xs sm:text-sm block">
            Reminder Chime Tone (Synthesized Web Audio API)
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'chime', label: 'Classic Chime' },
              { id: 'gentle', label: 'Gentle Harp' },
              { id: 'bell', label: 'Hospital Bell' },
              { id: 'radar', label: 'Pulse Ping' },
            ].map((tone) => (
              <div
                key={tone.id}
                className={`p-2.5 rounded-xl border flex flex-col justify-between transition-all ${
                  profile.soundTone === tone.id
                    ? 'border-sky-500 bg-sky-50 text-sky-900 font-bold'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <button
                  onClick={() => onUpdateProfile({ soundTone: tone.id as any })}
                  className="text-left text-xs"
                >
                  {tone.label}
                </button>
                <button
                  type="button"
                  onClick={() => handleTestTone(tone.id as any)}
                  className="mt-2 text-[10px] py-1 px-1.5 rounded bg-white border border-slate-200 text-slate-600 hover:text-sky-600 flex items-center justify-center gap-1 font-semibold"
                >
                  <Play className="w-2.5 h-2.5" />
                  Test Tone
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Snooze & Grace Period */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
          <div>
            <label className="block font-bold text-slate-800 text-xs mb-1">
              Default Snooze Interval
            </label>
            <select
              value={profile.snoozeIntervalMinutes}
              onChange={(e) => onUpdateProfile({ snoozeIntervalMinutes: Number(e.target.value) })}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
            >
              <option value={5}>5 minutes</option>
              <option value={10}>10 minutes (Recommended)</option>
              <option value={15}>15 minutes</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-800 text-xs mb-1">
              Missed Dose Grace Period
            </label>
            <select
              value={profile.missedGraceMinutes}
              onChange={(e) => onUpdateProfile({ missedGraceMinutes: Number(e.target.value) })}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
            >
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes (Recommended)</option>
              <option value={60}>60 minutes</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Multilingual Language Support (Kannada, Telugu, Hindi, English) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-sky-600" />
            <h3 className="font-heading font-extrabold text-base text-slate-900">
              {getTranslation(profile.preferredLanguage, 'switchLanguage') || 'Language'} / ಭಾಷೆ / భాష / भाषा
            </h3>
          </div>
          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
            4 Languages
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Select your comfortable language. All schedules, reminder buttons, meal instructions, and voice assistance will update instantly.
        </p>

        {/* 4 Language Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = profile.preferredLanguage === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => onUpdateProfile({ preferredLanguage: lang.code as AppLanguage })}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'border-sky-600 bg-sky-50 text-sky-950 font-bold shadow-sm'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50 font-medium'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-extrabold">{lang.nativeName}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-sky-600" />}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">{lang.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Privacy Protection */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600" />
            <h3 className="font-heading font-extrabold text-base text-slate-900">
              Privacy Protection
            </h3>
          </div>
          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            Local Encrypted
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Protect sensitive prescriptions and health records from onlookers on your lock screen.
        </p>

        {/* Mask Notification Toggle */}
        <div className="flex items-center justify-between py-2 border-t border-slate-100">
          <div>
            <span className="font-bold text-slate-800 text-xs sm:text-sm block">
              Mask Drug Names on Lock Screen
            </span>
            <span className="text-xs text-slate-500">
              Notification displays "Medication Reminder" instead of specific drug name
            </span>
          </div>
          <input
            type="checkbox"
            checked={profile.maskNotifications}
            onChange={(e) => onUpdateProfile({ maskNotifications: e.target.checked })}
            className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* 5. Pharmacy & Refill Contact Defaults */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Phone className="w-5 h-5 text-emerald-600" />
          <h3 className="font-heading font-extrabold text-base text-slate-900">
            Preferred Pharmacy for Refills
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Pharmacy Name</label>
            <input
              type="text"
              value={profile.defaultPharmacyName || ''}
              onChange={(e) => onUpdateProfile({ defaultPharmacyName: e.target.value })}
              placeholder="e.g. Corner Health Pharmacy"
              className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Pharmacy Phone Number</label>
            <input
              type="tel"
              value={profile.defaultPharmacyPhone || ''}
              onChange={(e) => onUpdateProfile({ defaultPharmacyPhone: e.target.value })}
              placeholder="e.g. +1 (555) 345-6789"
              className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
            />
          </div>
        </div>
      </div>

      {/* 6. Database & Demo Management */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-slate-700" />
          <h3 className="font-heading font-extrabold text-base text-slate-900">
            Database & Backups
          </h3>
        </div>

        <div className="space-y-2">
          <button
            onClick={onResetDemoData}
            className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-200 hover:bg-slate-50 transition text-left"
          >
            <div className="flex items-center gap-2.5">
              <RotateCcw className="w-4 h-4 text-sky-600" />
              <div>
                <span className="font-bold text-xs sm:text-sm text-slate-800 block">
                  Reset to Hackathon Demo Data
                </span>
                <span className="text-xs text-slate-500">
                  Preloads 3 standard medicines with low stock demo alert & caregiver.
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-sky-600">Reload</span>
          </button>

          <button
            onClick={onExportJSON}
            className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-200 hover:bg-slate-50 transition text-left"
          >
            <div className="flex items-center gap-2.5">
              <Download className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="font-bold text-xs sm:text-sm text-slate-800 block">
                  Export Full JSON Backup
                </span>
                <span className="text-xs text-slate-500">
                  Save all prescriptions, dose history, and caregiver rules.
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-600">Export</span>
          </button>

          <button
            onClick={() => setShowClearConfirm(true)}
            className="w-full flex items-center justify-between p-3 rounded-2xl border border-rose-200 bg-rose-50/50 hover:bg-rose-50 transition text-left"
          >
            <div className="flex items-center gap-2.5">
              <Trash2 className="w-4 h-4 text-rose-600" />
              <div>
                <span className="font-bold text-xs sm:text-sm text-rose-900 block">
                  Wipe All Data (Clean Slate)
                </span>
                <span className="text-xs text-rose-700">
                  Clear all prescriptions and dose records for a fresh test.
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-rose-600">Clear</span>
          </button>
        </div>
      </div>

      {/* Clear Confirmation Dialog */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-heading font-extrabold text-slate-900 text-lg">
                Wipe All App Data?
              </h3>
              <p className="text-xs text-slate-500">
                This will reset SmartDose to an empty state with zero prescriptions and no dose records.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClearAllData();
                  setShowClearConfirm(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20"
              >
                Yes, Clear Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

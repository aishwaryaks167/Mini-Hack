import React, { useState, useRef, useEffect } from 'react';
import {
  Pill,
  Volume2,
  Eye,
  Smartphone,
  Monitor,
  BookOpen,
  Mic,
  Bell,
  Globe,
  Check,
  User,
  Plus,
  Edit3,
  ChevronDown,
} from 'lucide-react';
import { AppLanguage, UserProfile } from '../types';
import { getTranslation, SUPPORTED_LANGUAGES } from '../utils/translations';

interface HeaderProps {
  profile: UserProfile;
  allProfiles?: UserProfile[];
  onSwitchProfile?: (profileId: string) => void;
  onOpenCreateProfile?: () => void;
  onOpenEditProfile?: () => void;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
  onOpenHackathonKit: () => void;
  onOpenBuildGuide: () => void;
  onTestAlarm: () => void;
  onOpenNotificationLab: () => void;
  onSpeakDailySummary: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  allProfiles = [],
  onSwitchProfile,
  onOpenCreateProfile,
  onOpenEditProfile,
  onUpdateProfile,
  isMobileFrame,
  onToggleMobileFrame,
  onOpenHackathonKit,
  onOpenBuildGuide,
  onTestAlarm,
  onOpenNotificationLab,
  onSpeakDailySummary,
}) => {
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }
    if (isLangMenuOpen || isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLangMenuOpen, isProfileMenuOpen]);

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === profile.preferredLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-3.5 py-2.5 transition-colors">
      <div className="flex items-center justify-between gap-2 max-w-lg mx-auto">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 text-white shadow-md shadow-sky-500/20 flex-shrink-0">
            <Pill className="w-5 h-5 -rotate-45" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-heading font-extrabold text-lg text-slate-900 tracking-tight leading-none">
                Smart<span className="text-sky-600">Dose</span>
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200/60">
                {getTranslation(profile.preferredLanguage, 'mobileBadge') || 'Mobile'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-none mt-0.5">
              {getTranslation(profile.preferredLanguage, 'appSubtitle') || 'Smart Medication Companion'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Active Profile Chip / Switcher */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setIsProfileMenuOpen((prev) => !prev)}
              title={`Active Profile: ${profile.name} (${profile.relationship || 'Patient'}). Tap to switch or edit.`}
              aria-label="Patient Profile"
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl text-xs font-bold bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200/80 transition active:scale-95 max-w-[125px] sm:max-w-[150px]"
            >
              <div className="w-5 h-5 rounded-lg overflow-hidden bg-sky-600 text-white flex items-center justify-center text-[10px] flex-shrink-0 font-black">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  profile.name.charAt(0).toUpperCase()
                )}
              </div>
              <span className="truncate text-xs font-bold">{profile.name.split(' ')[0]}</span>
              <ChevronDown className="w-3 h-3 text-sky-600 flex-shrink-0" />
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3.5 py-1.5 border-b border-slate-100">
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    {getTranslation(profile.preferredLanguage, 'switchProfile') || 'Profiles'}
                  </div>
                  <div className="text-xs font-bold text-slate-800 truncate mt-0.5">
                    {profile.name} {profile.relationship ? `(${profile.relationship})` : ''}
                  </div>
                </div>

                {/* Profiles List */}
                <div className="py-1 max-h-48 overflow-y-auto">
                  {allProfiles.map((p) => {
                    const isSelected = p.id === profile.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          if (onSwitchProfile && p.id !== profile.id) {
                            onSwitchProfile(p.id);
                          }
                          setIsProfileMenuOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition ${
                          isSelected
                            ? 'bg-sky-50 text-sky-900 font-bold'
                            : 'text-slate-700 hover:bg-slate-50 font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <div className="w-6 h-6 rounded-lg overflow-hidden bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-black flex-shrink-0">
                            {p.avatarUrl ? (
                              <img src={p.avatarUrl} alt={p.name} className="w-full h-full object-cover" />
                            ) : (
                              p.name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div className="truncate">
                            <div className="font-bold truncate">{p.name}</div>
                            <div className="text-[10px] text-slate-500">
                              {p.relationship || 'Patient'} {p.age ? `• ${p.age}y` : ''}
                            </div>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-sky-600 flex-shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>

                {/* Profile Actions: Edit & Add */}
                <div className="border-t border-slate-100 pt-1 mt-1 px-1">
                  {onOpenEditProfile && (
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onOpenEditProfile();
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-2 transition"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-sky-600" />
                      <span>{getTranslation(profile.preferredLanguage, 'editProfile') || 'Edit Profile'}</span>
                    </button>
                  )}

                  {onOpenCreateProfile && (
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onOpenCreateProfile();
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold text-teal-700 hover:bg-teal-50 flex items-center gap-2 transition"
                    >
                      <Plus className="w-3.5 h-3.5 text-teal-600" />
                      <span>{getTranslation(profile.preferredLanguage, 'createProfile') || '+ Add Profile'}</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
          {/* Multilingual Switcher Dropdown (Kannada, Telugu, Hindi, English) */}
          <div className="relative" ref={langMenuRef}>
            <button
              onClick={() => setIsLangMenuOpen((prev) => !prev)}
              title="Change Language / ಭಾಷೆ / భాష / भाषा"
              aria-label="Change Language"
              className="flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition active:scale-95"
            >
              <Globe className="w-3.5 h-3.5 text-sky-600" />
              <span>{currentLang.nativeName}</span>
            </button>

            {isLangMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                  Select Language / ಭಾಷೆ
                </div>
                {SUPPORTED_LANGUAGES.map((lang) => {
                  const isSelected = profile.preferredLanguage === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onUpdateProfile({ preferredLanguage: lang.code as AppLanguage });
                        setIsLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition ${
                        isSelected
                          ? 'bg-sky-50 text-sky-800 font-bold'
                          : 'text-slate-700 hover:bg-slate-50 font-medium'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">{lang.nativeName}</span>
                        <span className="text-[10px] text-slate-500">{lang.name}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-sky-600" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Voice Assistance Button (Read Schedule Aloud) */}
          <button
            onClick={onSpeakDailySummary}
            title={getTranslation(profile.preferredLanguage, 'voiceSummary')}
            aria-label="Read schedule aloud"
            className="flex items-center gap-1 p-1.5 sm:px-2 sm:py-1 rounded-xl text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 active:scale-95 transition"
          >
            <Mic className="w-4 h-4 text-sky-600 animate-pulse" />
            <span className="hidden md:inline">Voice</span>
          </button>

          {/* Elderly Accessibility Toggle */}
          <button
            onClick={() => onUpdateProfile({ elderlyMode: !profile.elderlyMode })}
            title={profile.elderlyMode ? 'Switch to Standard Mode' : 'Switch to Elderly Accessible Mode'}
            className={`flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-semibold transition-all ${
              profile.elderlyMode
                ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-sm scale-105'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">
              {profile.elderlyMode
                ? getTranslation(profile.preferredLanguage, 'elderlyOn') || 'Senior: ON'
                : getTranslation(profile.preferredLanguage, 'elderlyMode') || 'Senior Mode'}
            </span>
          </button>

          {/* Test Reminders / Notification Lab */}
          <button
            onClick={onOpenNotificationLab}
            title="Notification Diagnostic & Test Lab"
            aria-label="Notification Diagnostic"
            className="p-1.5 rounded-xl text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 hover:bg-teal-100 transition"
          >
            <Bell className="w-4 h-4" />
          </button>

          {/* Hackathon Pitch Kit */}
          <button
            onClick={onOpenHackathonKit}
            title="Mini-Hackathon Presentation & Live Pitch Script"
            className="flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm hover:from-violet-700 hover:to-indigo-700 transition"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Kit</span>
          </button>

          {/* Toggle Mobile Frame (for desktop testers) */}
          <button
            onClick={onToggleMobileFrame}
            title={isMobileFrame ? 'Expand to Full Width' : 'Show in Mobile Frame'}
            className="p-1.5 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
          >
            {isMobileFrame ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};

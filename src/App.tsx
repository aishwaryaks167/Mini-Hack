/**
 * SmartDose — Smart Medicine Reminder Mobile App
 * College Mini-Hackathon Edition
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Caregiver,
  DoseInstance,
  Medicine,
  UserProfile,
} from './types';
import {
  clearAllData,
  createProfile,
  DEFAULT_USER_PROFILE,
  deleteProfile,
  formatDateKey,
  formatTimeDisplay,
  INITIAL_CAREGIVERS,
  INITIAL_MEDICINES,
  loadAllProfiles,
  loadCaregivers,
  loadDoses,
  loadMedicines,
  loadUserProfile,
  resetToDemoData,
  saveCaregivers,
  saveDoses,
  saveMedicines,
  saveUserProfile,
  setActiveProfileId,
  syncTodayDoses,
  updateProfile,
  deductMedicineStock,
  refillMedicineStock,
} from './utils/storage';
import { SAMPLE_MEDICINE_PHOTOS } from './utils/imageUtils';
import { triggerSystemNotification } from './utils/notifications';
import { speakText } from './utils/speech';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { HomeDashboard } from './components/HomeDashboard';
import { MedicineList } from './components/MedicineList';
import { MedicineFormModal } from './components/MedicineFormModal';
import { DoseActionModal } from './components/DoseActionModal';
import { HistoryScreen } from './components/HistoryScreen';
import { CaregiverScreen } from './components/CaregiverScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { ActiveAlarmModal } from './components/ActiveAlarmModal';
import { HackathonModal } from './components/HackathonModal';
import { AndroidBuildGuideModal } from './components/AndroidBuildGuideModal';
import { OnboardingModal } from './components/OnboardingModal';
import { NotificationTestModal } from './components/NotificationTestModal';
import { ProfileModal } from './components/ProfileModal';

export default function App() {
  // State
  const [activeTab, setActiveTab] = useState<TabType>('today');
  const [profiles, setProfiles] = useState<UserProfile[]>(loadAllProfiles);
  const [profile, setProfile] = useState<UserProfile>(loadUserProfile);
  const [medicines, setMedicines] = useState<Medicine[]>(loadMedicines);
  const [doses, setDoses] = useState<DoseInstance[]>(() => syncTodayDoses());
  const [caregivers, setCaregivers] = useState<Caregiver[]>(loadCaregivers);
  const [selectedDate, setSelectedDate] = useState<string>(formatDateKey);

  // Modals & Panels
  const [isMedicineModalOpen, setIsMedicineModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [doseInActionModal, setDoseInActionModal] = useState<DoseInstance | null>(null);
  const [activeAlarmDose, setActiveAlarmDose] = useState<DoseInstance | null>(null);
  const [isHackathonModalOpen, setIsHackathonModalOpen] = useState(false);
  const [isBuildGuideOpen, setIsBuildGuideOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isNotificationLabOpen, setIsNotificationLabOpen] = useState(false);
  const [isMobileFrame, setIsMobileFrame] = useState(false);

  // Profile Modal State (Create & Edit)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileModalMode, setProfileModalMode] = useState<'create' | 'edit'>('create');
  const [editingProfileData, setEditingProfileData] = useState<UserProfile | null>(null);

  // Ref to track already alarmed dose IDs this session to avoid spamming
  const triggeredAlarmsRef = useRef<Set<string>>(new Set());

  // Check onboarding flag on initial mount
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('smartdose_onboarded_v1');
    if (!hasSeenOnboarding) {
      setIsOnboardingOpen(true);
    }
  }, []);

  // Update active profile
  const handleUpdateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile((prev) => {
      const updated = { ...prev, ...updates };
      saveUserProfile(updated);
      setProfiles(loadAllProfiles());
      return updated;
    });
  }, []);

  // Open Create Profile Modal
  const handleOpenCreateProfile = useCallback(() => {
    setEditingProfileData(null);
    setProfileModalMode('create');
    setIsProfileModalOpen(true);
  }, []);

  // Open Edit Profile Modal
  const handleOpenEditProfile = useCallback((targetProfile?: UserProfile) => {
    setEditingProfileData(targetProfile || profile);
    setProfileModalMode('edit');
    setIsProfileModalOpen(true);
  }, [profile]);

  // Save Profile (Create or Edit)
  const handleSaveProfile = useCallback((data: Partial<UserProfile>, isNew: boolean) => {
    if (isNew) {
      const created = createProfile(data);
      setProfiles(loadAllProfiles());
      setProfile(created);
    } else {
      const targetId = editingProfileData?.id || profile.id;
      const updated = updateProfile(targetId, data);
      setProfiles(loadAllProfiles());
      if (profile.id === targetId) {
        setProfile(updated);
      }
    }
    setIsProfileModalOpen(false);
  }, [editingProfileData, profile]);

  // Switch Active Profile
  const handleSwitchProfile = useCallback((profileId: string) => {
    setActiveProfileId(profileId);
    const updatedProfiles = loadAllProfiles();
    setProfiles(updatedProfiles);
    const target = updatedProfiles.find((p) => p.id === profileId);
    if (target) {
      setProfile(target);
    }
  }, []);

  // Delete Profile
  const handleDeleteProfile = useCallback((profileId: string) => {
    try {
      const remaining = deleteProfile(profileId);
      setProfiles(remaining);
      setProfile(loadUserProfile());
    } catch (err) {
      console.error('Failed to delete profile:', err);
    }
  }, []);

  // Sync today's doses and schedule background ticker
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Sync doses and auto-calculate missed statuses
      const updated = syncTodayDoses();
      setDoses(updated);

      // 2. Check for reminders due this minute
      const now = new Date();
      const currentH = String(now.getHours()).padStart(2, '0');
      const currentM = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentH}:${currentM}`;
      const todayKey = formatDateKey(now);

      // Look for pending dose scheduled for right now
      const dueDose = updated.find((d) => {
        if (d.scheduledDate !== todayKey || d.status !== 'pending') return false;

        // If snoozed, check snoozedUntil
        if (d.snoozedUntil) {
          const snoozeTime = new Date(d.snoozedUntil);
          const snoozeDiff = Math.abs(now.getTime() - snoozeTime.getTime());
          return snoozeDiff < 60000; // within 1 minute of snooze time
        }

        return d.scheduledTime === currentTimeStr;
      });

      if (dueDose && !triggeredAlarmsRef.current.has(dueDose.id)) {
        triggeredAlarmsRef.current.add(dueDose.id);
        setActiveAlarmDose(dueDose);

        // Also fire OS push notification (with privacy masking option)
        const notifTitle = profile.maskNotifications
          ? 'Medication Reminder'
          : `Medication Due: ${dueDose.medicineName}`;
        const notifBody = profile.maskNotifications
          ? 'Time for your scheduled dose. Open SmartDose to confirm.'
          : `Time to take ${dueDose.strength} (${dueDose.quantityPerDose} ${dueDose.unit}). Tap to confirm.`;

        triggerSystemNotification(notifTitle, {
          body: notifBody,
          image: profile.maskNotifications ? undefined : dueDose.imageUrl,
          icon: dueDose.imageUrl || '/pwa-192x192.png',
        });
      }
    }, 15000); // Check every 15s

    return () => clearInterval(interval);
  }, [profile.maskNotifications]);

  // Dose Actions: Take Dose (with automatic refill stock deduction)
  const handleTakeDose = useCallback(
    (doseId: string, customTime?: string, notes?: string) => {
      setDoses((prev) => {
        const targetDose = prev.find((d) => d.id === doseId);
        if (targetDose) {
          // Deduct from medicine inventory
          const updatedMeds = deductMedicineStock(targetDose.medicineId, targetDose.quantityPerDose);
          setMedicines(updatedMeds);
        }

        const updated = prev.map((d) => {
          if (d.id === doseId) {
            return {
              ...d,
              status: 'taken' as const,
              takenAt: customTime || new Date().toISOString(),
              notes: notes || d.notes,
              snoozedUntil: null,
            };
          }
          return d;
        });

        saveDoses(updated);

        // Check if all today's doses are completed!
        const todayKey = formatDateKey();
        const todayDoses = updated.filter((d) => d.scheduledDate === todayKey);
        const allCompleted = todayDoses.length > 0 && todayDoses.every((d) => d.status === 'taken');

        if (allCompleted) {
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#0284c7', '#0d9488', '#10b981', '#f59e0b'],
            });
          } catch {
            // ignore if blocked
          }
        }

        return updated;
      });

      // Close active alarm if this was it
      if (activeAlarmDose?.id === doseId) {
        setActiveAlarmDose(null);
      }
    },
    [activeAlarmDose]
  );

  // Dose Actions: Snooze Dose
  const handleSnoozeDose = useCallback(
    (doseId: string, minutes: number) => {
      const snoozeUntil = new Date(Date.now() + minutes * 60 * 1000).toISOString();

      setDoses((prev) => {
        const updated = prev.map((d) => {
          if (d.id === doseId) {
            return {
              ...d,
              status: 'pending' as const,
              snoozedUntil: snoozeUntil,
              snoozeCount: (d.snoozeCount || 0) + 1,
            };
          }
          return d;
        });
        saveDoses(updated);
        return updated;
      });

      if (activeAlarmDose?.id === doseId) {
        setActiveAlarmDose(null);
      }
    },
    [activeAlarmDose]
  );

  // Dose Actions: Skip Dose
  const handleSkipDose = useCallback(
    (doseId: string, reason: string) => {
      setDoses((prev) => {
        const updated = prev.map((d) => {
          if (d.id === doseId) {
            return {
              ...d,
              status: 'skipped' as const,
              skipReason: reason,
              snoozedUntil: null,
            };
          }
          return d;
        });
        saveDoses(updated);
        return updated;
      });

      if (activeAlarmDose?.id === doseId) {
        setActiveAlarmDose(null);
      }
    },
    [activeAlarmDose]
  );

  // Dose Actions: Correct Past Record
  const handleCorrectDose = useCallback(
    (
      doseId: string,
      newStatus: 'taken' | 'missed' | 'skipped' | 'pending',
      notes: string
    ) => {
      setDoses((prev) => {
        const updated = prev.map((d) => {
          if (d.id === doseId) {
            return {
              ...d,
              status: newStatus,
              takenAt: newStatus === 'taken' ? (d.takenAt || new Date().toISOString()) : null,
              notes: notes || d.notes,
            };
          }
          return d;
        });
        saveDoses(updated);
        return updated;
      });
    },
    []
  );

  // Refill Medicine Stock handler
  const handleRefillMedicine = useCallback((medicineId: string, quantity: number) => {
    const updated = refillMedicineStock(medicineId, quantity);
    setMedicines(updated);
  }, []);

  // Voice Assistance: Read Today's Schedule Aloud (Multilingual for Kannada, Telugu, Hindi, English)
  const handleSpeakDailySummary = useCallback(() => {
    const todayKey = formatDateKey();
    const todayDoses = doses
      .filter((d) => d.scheduledDate === todayKey)
      .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));

    const lang = profile.preferredLanguage || 'en';

    if (todayDoses.length === 0) {
      const emptyText =
        lang === 'kn'
          ? 'ಇಂದು ನಿಮಗೆ ಯಾವುದೇ ಔಷಧಿಗಳು ನಿಗದಿಯಾಗಿಲ್ಲ.'
          : lang === 'te'
          ? 'ఈ రోజు మీకు ఎటువంటి మందులు షెడ్యూల్ చేయబడలేదు.'
          : lang === 'hi'
          ? 'आज के लिए आपकी कोई दवा निर्धारित नहीं है।'
          : 'You have no medications scheduled for today.';

      speakText(emptyText, {
        rate: profile.voiceRate || 0.85,
        langCode: lang,
      });
      return;
    }

    if (lang === 'kn') {
      const descriptions = todayDoses
        .map((d) => {
          const statusKn =
            d.status === 'taken'
              ? 'ತೆಗೆದುಕೊಳ್ಳಲಾಗಿದೆ'
              : d.status === 'missed'
              ? 'ತಪ್ಪಿಹೋಗಿದೆ'
              : 'ಬಾಕಿ ಇದೆ';
          return `${d.medicineName} ${d.strength}, ಸಮಯ ${formatTimeDisplay(
            d.scheduledTime,
            profile.timeFormat
          )}, ಸ್ಥಿತಿ: ${statusKn}.`;
        })
        .join(' ಮುಂದಿನದು: ');

      speakText(
        `ನಮಸ್ಕಾರ ${profile.name.split(' ')[0]}. ಇಂದಿನ ನಿಮ್ಮ ಔಷಧಿ ವೇಳಾಪಟ್ಟಿ ಹೀಗಿದೆ: ${descriptions}`,
        {
          rate: profile.voiceRate || 0.85,
          langCode: 'kn',
        }
      );
      return;
    }

    if (lang === 'te') {
      const descriptions = todayDoses
        .map((d) => {
          const statusTe =
            d.status === 'taken'
              ? 'తీసుకున్నారు'
              : d.status === 'missed'
              ? 'తప్పిపోయింది'
              : 'బాకీ ఉంది';
          return `${d.medicineName} ${d.strength}, సమయం ${formatTimeDisplay(
            d.scheduledTime,
            profile.timeFormat
          )}, స్థితి: ${statusTe}.`;
        })
        .join(' తదుపరి: ');

      speakText(
        `నమస్కారం ${profile.name.split(' ')[0]}. ఈ రోజు మీ మందుల షెడ్యూల్: ${descriptions}`,
        {
          rate: profile.voiceRate || 0.85,
          langCode: 'te',
        }
      );
      return;
    }

    if (lang === 'hi') {
      const descriptions = todayDoses
        .map((d) => {
          const statusHi =
            d.status === 'taken'
              ? 'ले ली गई'
              : d.status === 'missed'
              ? 'छूट गई'
              : 'लेना बाकी है';
          return `${d.medicineName} ${d.strength}, समय ${formatTimeDisplay(
            d.scheduledTime,
            profile.timeFormat
          )}, स्थिति: ${statusHi}।`;
        })
        .join(' अगला: ');

      speakText(
        `नमस्ते ${profile.name.split(' ')[0]}। आज की आपकी दवा समय सारिणी इस प्रकार है: ${descriptions}`,
        {
          rate: profile.voiceRate || 0.85,
          langCode: 'hi',
        }
      );
      return;
    }

    // Default English
    const descriptions = todayDoses
      .map((d) => {
        return `${d.medicineName}, ${d.strength}, scheduled for ${formatTimeDisplay(
          d.scheduledTime,
          profile.timeFormat
        )}, status is ${d.status}.`;
      })
      .join(' Next: ');

    const fullSpeech = `Hello ${profile.name.split(' ')[0]}. Here is your medication schedule for today: ${descriptions}`;
    speakText(fullSpeech, { rate: profile.voiceRate || 0.85, langCode: 'en' });
  }, [doses, profile]);

  // Quick action from dashboard
  const handleQuickTakeDose = useCallback((doseId: string) => {
    handleTakeDose(doseId);
  }, [handleTakeDose]);

  const handleQuickSnoozeDose = useCallback((doseId: string) => {
    handleSnoozeDose(doseId, profile.snoozeIntervalMinutes || 10);
  }, [handleSnoozeDose, profile.snoozeIntervalMinutes]);

  // Medicine Management
  const handleSaveMedicine = useCallback(
    (medData: Omit<Medicine, 'id' | 'createdAt' | 'updatedAt'>, existingId?: string) => {
      if (existingId) {
        setMedicines((prev) => {
          const updated = prev.map((m) => {
            if (m.id === existingId) {
              return {
                ...m,
                ...medData,
                updatedAt: new Date().toISOString(),
              };
            }
            return m;
          });
          saveMedicines(updated);
          return updated;
        });
      } else {
        const newMed: Medicine = {
          ...medData,
          id: `med_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setMedicines((prev) => {
          const updated = [...prev, newMed];
          saveMedicines(updated);
          return updated;
        });
      }

      setTimeout(() => {
        const reSynced = syncTodayDoses();
        setDoses(reSynced);
      }, 50);
    },
    []
  );

  const handleDeleteMedicine = useCallback((id: string, deleteHistory: boolean) => {
    setMedicines((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      saveMedicines(updated);
      return updated;
    });

    if (deleteHistory) {
      setDoses((prev) => {
        const updated = prev.filter((d) => d.medicineId !== id);
        saveDoses(updated);
        return updated;
      });
    } else {
      const todayKey = formatDateKey();
      setDoses((prev) => {
        const updated = prev.filter((d) => {
          if (d.medicineId === id && d.scheduledDate >= todayKey && d.status === 'pending') {
            return false;
          }
          return true;
        });
        saveDoses(updated);
        return updated;
      });
    }
  }, []);

  // Caregiver Management
  const handleAddCaregiver = useCallback((cgData: Omit<Caregiver, 'id' | 'createdAt'>) => {
    const newCaregiver: Caregiver = {
      ...cgData,
      id: `cg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    setCaregivers((prev) => {
      const updated = [...prev, newCaregiver];
      saveCaregivers(updated);
      return updated;
    });
  }, []);

  const handleDeleteCaregiver = useCallback((id: string) => {
    setCaregivers((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      saveCaregivers(updated);
      return updated;
    });
  }, []);

  const handleToggleCaregiverSetting = useCallback(
    (id: string, setting: 'alertOnMissed' | 'shareAdherenceWeekly' | 'alertOnLowRefill') => {
      setCaregivers((prev) => {
        const updated = prev.map((c) => {
          if (c.id === id) {
            return { ...c, [setting]: !c[setting] };
          }
          return c;
        });
        saveCaregivers(updated);
        return updated;
      });
    },
    []
  );

  // Demo Data Reset
  const handleResetDemoData = useCallback(() => {
    resetToDemoData();
    setMedicines(loadMedicines());
    setDoses(syncTodayDoses());
    setProfiles(loadAllProfiles());
    setProfile(loadUserProfile());
    setCaregivers(loadCaregivers());
    setSelectedDate(formatDateKey());
    triggeredAlarmsRef.current.clear();
  }, []);

  // Wipe All Data
  const handleClearAllData = useCallback(() => {
    clearAllData();
    setMedicines([]);
    setDoses([]);
    setCaregivers([]);
    setProfiles(loadAllProfiles());
    setProfile(loadUserProfile());
    setSelectedDate(formatDateKey());
    triggeredAlarmsRef.current.clear();
  }, []);

  // Export JSON
  const handleExportJSON = useCallback(() => {
    const backup = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      profiles,
      profile,
      medicines,
      doses,
      caregivers,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SmartDose_Backup_${formatDateKey()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [profiles, profile, medicines, doses, caregivers]);

  // Import JSON
  const handleImportJSON = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = JSON.parse(e.target?.result as string);
        if (content.medicines && content.doses) {
          saveMedicines(content.medicines);
          saveDoses(content.doses);
          if (content.profile) saveUserProfile(content.profile);
          if (content.caregivers) saveCaregivers(content.caregivers);

          setMedicines(content.medicines);
          setDoses(content.doses);
          setProfile(content.profile || DEFAULT_USER_PROFILE);
          setCaregivers(content.caregivers || INITIAL_CAREGIVERS);
          alert('SmartDose backup restored successfully!');
        } else {
          alert('Invalid SmartDose backup JSON format.');
        }
      } catch (err) {
        alert('Failed to parse backup JSON file.');
      }
    };
    reader.readAsText(file);
  }, []);

  // Test Alarm Immediate Simulator
  const handleTriggerTestAlarm = useCallback(() => {
    if (doses.length > 0) {
      setActiveAlarmDose(doses[0]);
      return;
    }

    const sampleDose: DoseInstance = {
      id: `test_dose_${Date.now()}`,
      medicineId: 'med_lisinopril',
      medicineName: 'Lisinopril',
      medicineType: 'tablet',
      strength: '10 mg',
      quantityPerDose: 1,
      unit: 'tablet',
      mealTiming: 'before_meal',
      color: '#0284c7',
      imageUrl: SAMPLE_MEDICINE_PHOTOS[0].dataUrl,
      scheduledDate: formatDateKey(),
      scheduledTime: '08:00',
      status: 'pending',
      snoozeCount: 0,
      notes: 'Prescribed for blood pressure. Take with full glass of water.',
    };

    setActiveAlarmDose(sampleDose);
  }, [doses]);

  // Complete Onboarding
  const handleCompleteOnboarding = (profileUpdates: Partial<UserProfile>, loadDemo: boolean) => {
    localStorage.setItem('smartdose_onboarded_v1', 'true');
    if (loadDemo) {
      handleResetDemoData();
    } else {
      handleClearAllData();
    }
    handleUpdateProfile(profileUpdates);
    setIsOnboardingOpen(false);
  };

  const sampleDoseForDiagnostic: DoseInstance = doses[0] || {
    id: 'diag_dose',
    medicineId: 'med_lisinopril',
    medicineName: 'Lisinopril',
    medicineType: 'tablet',
    strength: '10 mg',
    quantityPerDose: 1,
    unit: 'tablet',
    mealTiming: 'before_meal',
    color: '#0284c7',
    imageUrl: SAMPLE_MEDICINE_PHOTOS[0].dataUrl,
    scheduledDate: formatDateKey(),
    scheduledTime: '08:00',
    status: 'pending',
    snoozeCount: 0,
    notes: 'Prescribed for blood pressure.',
  };

  return (
    <div
      className={`min-h-screen bg-slate-100 flex flex-col justify-between transition-colors ${
        profile.fontSizeScale === 'extra-large'
          ? 'text-lg'
          : profile.elderlyMode || profile.fontSizeScale === 'large'
          ? 'text-base font-medium'
          : 'text-sm'
      }`}
    >
      {/* Outer Shell for Mobile Frame on Desktop */}
      <div className={`w-full mx-auto flex-1 flex flex-col ${isMobileFrame ? 'max-w-[430px] my-4 shadow-2xl rounded-3xl overflow-hidden border-8 border-slate-800' : 'max-w-md sm:max-w-lg'}`}>
        {/* App Main Header */}
        <Header
          profile={profile}
          allProfiles={profiles}
          onSwitchProfile={handleSwitchProfile}
          onOpenCreateProfile={handleOpenCreateProfile}
          onOpenEditProfile={handleOpenEditProfile}
          onUpdateProfile={handleUpdateProfile}
          isMobileFrame={isMobileFrame}
          onToggleMobileFrame={() => setIsMobileFrame((v) => !v)}
          onOpenHackathonKit={() => setIsHackathonModalOpen(true)}
          onOpenBuildGuide={() => setIsBuildGuideOpen(true)}
          onTestAlarm={handleTriggerTestAlarm}
          onOpenNotificationLab={() => setIsNotificationLabOpen(true)}
          onSpeakDailySummary={handleSpeakDailySummary}
        />

        {/* Main Content Pages */}
        <main className="flex-1 p-3.5 sm:p-4 bg-slate-100/90 overflow-y-auto">
          {activeTab === 'today' && (
            <HomeDashboard
              doses={doses}
              medicines={medicines}
              profile={profile}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              onOpenDoseAction={(dose) => setDoseInActionModal(dose)}
              onQuickTakeDose={handleQuickTakeDose}
              onQuickSnoozeDose={handleQuickSnoozeDose}
              onOpenAddMedicine={() => {
                setEditingMedicine(null);
                setIsMedicineModalOpen(true);
              }}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onRefillMedicine={handleRefillMedicine}
            />
          )}

          {activeTab === 'medicines' && (
            <MedicineList
              medicines={medicines}
              profile={profile}
              onOpenAdd={() => {
                setEditingMedicine(null);
                setIsMedicineModalOpen(true);
              }}
              onEditMedicine={(med) => {
                setEditingMedicine(med);
                setIsMedicineModalOpen(true);
              }}
              onDeleteMedicine={handleDeleteMedicine}
              onRefillMedicine={handleRefillMedicine}
            />
          )}

          {activeTab === 'history' && (
            <HistoryScreen
              doses={doses}
              medicines={medicines}
              profile={profile}
              onOpenDoseAction={(dose) => setDoseInActionModal(dose)}
            />
          )}

          {activeTab === 'caregiver' && (
            <CaregiverScreen
              caregivers={caregivers}
              profile={profile}
              onAddCaregiver={handleAddCaregiver}
              onDeleteCaregiver={handleDeleteCaregiver}
              onToggleAlertSetting={handleToggleCaregiverSetting}
              onUpdateProfile={handleUpdateProfile}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsScreen
              profile={profile}
              allProfiles={profiles}
              onSwitchProfile={handleSwitchProfile}
              onOpenCreateProfile={handleOpenCreateProfile}
              onOpenEditProfile={handleOpenEditProfile}
              onUpdateProfile={handleUpdateProfile}
              onResetDemoData={handleResetDemoData}
              onClearAllData={handleClearAllData}
              onExportJSON={handleExportJSON}
              onImportJSON={handleImportJSON}
              onOpenBuildGuide={() => setIsBuildGuideOpen(true)}
              onOpenNotificationLab={() => setIsNotificationLabOpen(true)}
            />
          )}
        </main>

        {/* Bottom Navigation */}
        <BottomNav
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          onOpenAddMedicine={() => {
            setEditingMedicine(null);
            setIsMedicineModalOpen(true);
          }}
          elderlyMode={profile.elderlyMode}
          language={profile.preferredLanguage}
        />
      </div>

      {/* Floating Add Medicine & Edit Modal */}
      <MedicineFormModal
        isOpen={isMedicineModalOpen}
        editingMedicine={editingMedicine}
        onClose={() => {
          setIsMedicineModalOpen(false);
          setEditingMedicine(null);
        }}
        onSave={handleSaveMedicine}
      />

      {/* Dose Interactive Bottom Sheet */}
      <DoseActionModal
        dose={doseInActionModal}
        profile={profile}
        onClose={() => setDoseInActionModal(null)}
        onTakeDose={handleTakeDose}
        onSnoozeDose={handleSnoozeDose}
        onSkipDose={handleSkipDose}
        onCorrectDose={handleCorrectDose}
      />

      {/* Real-Time Reminder Alarm Modal */}
      <ActiveAlarmModal
        dose={activeAlarmDose}
        profile={profile}
        onTake={(id) => handleTakeDose(id)}
        onSnooze={(id, min) => handleSnoozeDose(id, min)}
        onSkip={(id) => {
          handleSkipDose(id, 'Skipped via alarm screen');
        }}
        onDismiss={() => setActiveAlarmDose(null)}
      />

      {/* Notification Diagnostic & Test Lab */}
      <NotificationTestModal
        isOpen={isNotificationLabOpen}
        profile={profile}
        sampleDose={sampleDoseForDiagnostic}
        onClose={() => setIsNotificationLabOpen(false)}
        onTriggerAlarmModal={(dose) => setActiveAlarmDose(dose)}
      />

      {/* Mini-Hackathon Pitch & Slides Kit */}
      <HackathonModal
        isOpen={isHackathonModalOpen}
        onClose={() => setIsHackathonModalOpen(false)}
      />

      {/* Android APK Build Guide */}
      <AndroidBuildGuideModal
        isOpen={isBuildGuideOpen}
        onClose={() => setIsBuildGuideOpen(false)}
      />

      {/* First-Time Onboarding Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onComplete={handleCompleteOnboarding}
      />

      {/* Patient Profile Create and Edit Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSave={handleSaveProfile}
        onDelete={handleDeleteProfile}
        mode={profileModalMode}
        initialProfile={editingProfileData}
        totalProfilesCount={profiles.length}
        currentLanguage={profile.preferredLanguage}
      />
    </div>
  );
}

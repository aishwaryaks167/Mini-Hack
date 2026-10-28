import { Caregiver, DoseInstance, Medicine, NotificationLog, UserProfile } from '../types';
import { SAMPLE_MEDICINE_PHOTOS } from './imageUtils';

const STORAGE_KEYS = {
  MEDICINES: 'smartdose_medicines_v1',
  DOSES: 'smartdose_doses_v1',
  PROFILE: 'smartdose_profile_v1',
  PROFILES: 'smartdose_profiles_v1',
  ACTIVE_PROFILE_ID: 'smartdose_active_profile_id_v1',
  CAREGIVERS: 'smartdose_caregivers_v1',
  LOGS: 'smartdose_logs_v1',
  FIRST_RUN: 'smartdose_first_run_v1',
};

// Helper to format date as YYYY-MM-DD
export function formatDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Format 24h time to 12h or 24h string
export function formatTimeDisplay(timeStr: string, format: '12h' | '24h' = '12h'): string {
  if (!timeStr || !timeStr.includes(':')) return timeStr;
  if (format === '24h') return timeStr;

  const [hStr, mStr] = timeStr.split(':');
  let h = parseInt(hStr, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${mStr} ${ampm}`;
}

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'usr_guest_01',
  name: 'Eleanor Vance',
  relationship: 'Mother',
  age: 72,
  gender: 'Female',
  bloodGroup: 'O+',
  allergies: ['Penicillin', 'Sulfa drugs'],
  chronicConditions: ['Hypertension', 'Type 2 Diabetes', 'Osteoarthritis'],
  primaryDoctorName: 'Dr. Robert Miller (Cardiology)',
  primaryDoctorPhone: '+1 (555) 890-1234',
  emergencyContactName: 'Sarah Vance',
  emergencyContactRelationship: 'Daughter',
  emergencyContactPhone: '+1 (555) 234-5678',
  preferredLanguage: 'en',
  timeFormat: '12h',
  elderlyMode: true,
  fontSizeScale: 'large',
  highContrastMode: false,
  soundAlerts: true,
  soundTone: 'chime',
  vibrate: true,
  voiceEnabled: true,
  voiceRate: 0.85,
  voiceAutoReadAlarms: true,
  snoozeIntervalMinutes: 10,
  missedGraceMinutes: 45,
  isGuest: false,
  isLoggedIn: true,
  email: 'eleanor.vance@example.com',
  maskNotifications: false,
  caregiverConsentAccepted: true,
  caregiverConsentDate: '2026-10-01T10:00:00Z',
  defaultPharmacyName: 'Corner Health Pharmacy',
  defaultPharmacyPhone: '+1 (555) 345-6789',
};

export const INITIAL_PROFILES: UserProfile[] = [
  DEFAULT_USER_PROFILE,
  {
    id: 'usr_arthur_02',
    name: 'Arthur Vance',
    relationship: 'Father',
    age: 75,
    gender: 'Male',
    bloodGroup: 'A+',
    allergies: ['Aspirin', 'Ibuprofen'],
    chronicConditions: ['High Blood Pressure', 'Mild Asthma'],
    primaryDoctorName: 'Dr. Robert Miller (Cardiology)',
    primaryDoctorPhone: '+1 (555) 890-1234',
    emergencyContactName: 'Sarah Vance',
    emergencyContactRelationship: 'Daughter',
    emergencyContactPhone: '+1 (555) 234-5678',
    preferredLanguage: 'kn',
    timeFormat: '12h',
    elderlyMode: true,
    fontSizeScale: 'large',
    highContrastMode: false,
    soundAlerts: true,
    soundTone: 'bell',
    vibrate: true,
    voiceEnabled: true,
    voiceRate: 0.85,
    voiceAutoReadAlarms: true,
    snoozeIntervalMinutes: 10,
    missedGraceMinutes: 45,
    isGuest: false,
    isLoggedIn: true,
    email: 'arthur.vance@example.com',
    maskNotifications: false,
    caregiverConsentAccepted: true,
    caregiverConsentDate: '2026-10-01T10:00:00Z',
    defaultPharmacyName: 'Corner Health Pharmacy',
    defaultPharmacyPhone: '+1 (555) 345-6789',
  },
];

export const INITIAL_CAREGIVERS: Caregiver[] = [
  {
    id: 'cg_1',
    name: 'Sarah Vance',
    relationship: 'Daughter (Primary)',
    phone: '+1 (555) 234-5678',
    email: 'sarah.vance@caremail.org',
    accessLevel: 'full',
    alertOnMissed: true,
    alertDelayMinutes: 45,
    alertOnLowRefill: true,
    shareAdherenceWeekly: true,
    emergencyAlerts: true,
    isVerified: true,
    consentSigned: true,
    verificationCode: '4821',
    createdAt: '2026-10-01T10:00:00Z',
  },
  {
    id: 'cg_2',
    name: 'Dr. Robert Miller',
    relationship: 'Cardiologist',
    phone: '+1 (555) 890-1234',
    email: 'rmiller.md@metroclinic.org',
    accessLevel: 'adherence_only',
    alertOnMissed: false,
    alertDelayMinutes: 120,
    alertOnLowRefill: false,
    shareAdherenceWeekly: true,
    emergencyAlerts: true,
    isVerified: true,
    consentSigned: true,
    verificationCode: '9103',
    createdAt: '2026-10-05T14:30:00Z',
  },
];

export const INITIAL_MEDICINES: Medicine[] = [
  {
    id: 'med_lisinopril',
    name: 'Lisinopril',
    genericName: 'Zestril',
    type: 'tablet',
    strength: '10 mg',
    quantityPerDose: 1,
    unit: 'tablet',
    instructions: 'Take in the morning with a glass of water. Monitor blood pressure weekly.',
    mealTiming: 'before_meal',
    startDate: '2026-10-01',
    endDate: null,
    isOngoing: true,
    reminderTimes: ['08:00'],
    frequency: 'daily',
    color: '#0284c7', // Sky Blue
    imageUrl: SAMPLE_MEDICINE_PHOTOS[0].dataUrl,
    currentStock: 4, // Intentionally low (threshold is 5) to demonstrate Refill Reminder!
    lowStockThreshold: 5,
    prescribingDoctor: 'Dr. Robert Miller (Cardiology)',
    doctorPhone: '+1 (555) 890-1234',
    pharmacyName: 'Corner Health Pharmacy',
    pharmacyPhone: '+1 (555) 345-6789',
    rxNumber: 'RX-984210',
    lastRefillDate: '2026-09-25',
    createdAt: '2026-10-01T08:00:00Z',
    updatedAt: '2026-10-01T08:00:00Z',
  },
  {
    id: 'med_metformin',
    name: 'Metformin HCl',
    genericName: 'Glucophage',
    type: 'tablet',
    strength: '500 mg',
    quantityPerDose: 1,
    unit: 'tablet',
    instructions: 'Always swallow whole with meals to avoid mild stomach discomfort.',
    mealTiming: 'with_meal',
    startDate: '2026-10-01',
    endDate: null,
    isOngoing: true,
    reminderTimes: ['08:30', '19:30'],
    frequency: 'daily',
    color: '#0d9488', // Teal
    imageUrl: SAMPLE_MEDICINE_PHOTOS[1].dataUrl,
    currentStock: 48,
    lowStockThreshold: 10,
    prescribingDoctor: 'Dr. Susan Hayes (Endocrinology)',
    doctorPhone: '+1 (555) 678-9012',
    pharmacyName: 'Corner Health Pharmacy',
    pharmacyPhone: '+1 (555) 345-6789',
    rxNumber: 'RX-441290',
    lastRefillDate: '2026-10-10',
    createdAt: '2026-10-01T08:00:00Z',
    updatedAt: '2026-10-01T08:00:00Z',
  },
  {
    id: 'med_atorvastatin',
    name: 'Atorvastatin Calcium',
    genericName: 'Lipitor',
    type: 'tablet',
    strength: '20 mg',
    quantityPerDose: 1,
    unit: 'tablet',
    instructions: 'Take once nightly after dinner for cholesterol management. Avoid grapefruit.',
    mealTiming: 'after_meal',
    startDate: '2026-10-01',
    endDate: null,
    isOngoing: true,
    reminderTimes: ['21:00'],
    frequency: 'daily',
    color: '#7c3aed', // Purple
    imageUrl: SAMPLE_MEDICINE_PHOTOS[2].dataUrl,
    currentStock: 18,
    lowStockThreshold: 5,
    prescribingDoctor: 'Dr. Robert Miller (Cardiology)',
    doctorPhone: '+1 (555) 890-1234',
    pharmacyName: 'Corner Health Pharmacy',
    pharmacyPhone: '+1 (555) 345-6789',
    rxNumber: 'RX-773104',
    lastRefillDate: '2026-10-01',
    createdAt: '2026-10-01T08:00:00Z',
    updatedAt: '2026-10-01T08:00:00Z',
  },
];

/**
 * Generate historical seed doses for the past 6 days + today
 */
export function generateSeedDoses(medicines: Medicine[]): DoseInstance[] {
  const doses: DoseInstance[] = [];
  const today = new Date();

  // Create doses for the past 6 days up to today
  for (let offset = 6; offset >= 0; offset--) {
    const d = new Date();
    d.setDate(today.getDate() - offset);
    const dateKey = formatDateKey(d);
    const isPast = offset > 0;

    medicines.forEach((med) => {
      med.reminderTimes.forEach((time) => {
        const doseId = `dose_${med.id}_${dateKey}_${time.replace(':', '')}`;

        let status: 'pending' | 'taken' | 'missed' | 'skipped' = 'pending';
        let takenAt: string | null = null;
        let notes: string | undefined = undefined;

        if (isPast) {
          // Semi-random deterministic pattern for realistic hackathon presentation:
          // offset 3 missed Metformin evening dose
          if (offset === 3 && time === '19:30') {
            status = 'missed';
            notes = 'Unconfirmed past grace period. Caregiver notified.';
          } else if (offset === 5 && time === '21:00') {
            status = 'skipped';
            notes = 'Felt mild upset stomach; advised by nurse to skip tonight.';
          } else {
            status = 'taken';
            // Simulated taken time ~10-15 mins after reminder
            takenAt = `${dateKey}T${time}:00Z`;
          }
        } else {
          // Today's doses
          const [h, m] = time.split(':').map(Number);
          const currentHour = today.getHours();
          const currentMinute = today.getMinutes();
          const reminderMinutes = h * 60 + m;
          const nowMinutes = currentHour * 60 + currentMinute;

          if (nowMinutes >= reminderMinutes + 60) {
            // Already past reminder time by > 60 min
            if (time === '08:00') {
              status = 'taken';
              takenAt = `${dateKey}T${time}:00Z`;
            } else if (time === '08:30') {
              status = 'taken';
              takenAt = `${dateKey}T08:35:00Z`;
            } else {
              status = 'pending';
            }
          } else {
            // Upcoming or due soon
            status = 'pending';
          }
        }

        doses.push({
          id: doseId,
          medicineId: med.id,
          medicineName: med.name,
          medicineType: med.type,
          strength: med.strength,
          quantityPerDose: med.quantityPerDose,
          unit: med.unit,
          mealTiming: med.mealTiming,
          color: med.color,
          imageUrl: med.imageUrl,
          scheduledDate: dateKey,
          scheduledTime: time,
          status,
          takenAt,
          notes,
          snoozeCount: 0,
        });
      });
    });
  }

  return doses;
}

// Storage Accessors
export function loadMedicines(): Medicine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MEDICINES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.MEDICINES, JSON.stringify(INITIAL_MEDICINES));
      return INITIAL_MEDICINES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading medicines:', e);
    return INITIAL_MEDICINES;
  }
}

export function saveMedicines(medicines: Medicine[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.MEDICINES, JSON.stringify(medicines));
  } catch (e) {
    console.error('Error saving medicines:', e);
  }
}

export function loadDoses(): DoseInstance[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DOSES);
    if (!raw) {
      const initialMeds = loadMedicines();
      const seed = generateSeedDoses(initialMeds);
      localStorage.setItem(STORAGE_KEYS.DOSES, JSON.stringify(seed));
      return seed;
    }
    const doses: DoseInstance[] = JSON.parse(raw);
    return doses;
  } catch (e) {
    console.error('Error loading doses:', e);
    return [];
  }
}

export function saveDoses(doses: DoseInstance[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.DOSES, JSON.stringify(doses));
  } catch (e) {
    console.error('Error saving doses:', e);
  }
}

export function loadAllProfiles(): UserProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILES);
    if (!raw) {
      // Check legacy single profile first
      const legacyRaw = localStorage.getItem(STORAGE_KEYS.PROFILE);
      let initialList = INITIAL_PROFILES;
      if (legacyRaw) {
        try {
          const parsed = JSON.parse(legacyRaw);
          initialList = [{ ...DEFAULT_USER_PROFILE, ...parsed }, INITIAL_PROFILES[1]];
        } catch {
          // fallback
        }
      }
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(initialList));
      return initialList;
    }
    const parsed: UserProfile[] = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(INITIAL_PROFILES));
      return INITIAL_PROFILES;
    }
    return parsed;
  } catch (e) {
    console.error('Error loading profiles:', e);
    return INITIAL_PROFILES;
  }
}

export function saveAllProfiles(profiles: UserProfile[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
  } catch (e) {
    console.error('Error saving profiles:', e);
  }
}

export function getActiveProfileId(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_PROFILE_ID);
    if (saved) return saved;
  } catch {
    // fallback
  }
  const profiles = loadAllProfiles();
  return profiles[0]?.id || DEFAULT_USER_PROFILE.id;
}

export function setActiveProfileId(id: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE_ID, id);
    const profiles = loadAllProfiles();
    const active = profiles.find((p) => p.id === id);
    if (active) {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(active));
    }
  } catch (e) {
    console.error('Error setting active profile ID:', e);
  }
}

export function loadUserProfile(): UserProfile {
  try {
    const profiles = loadAllProfiles();
    const activeId = getActiveProfileId();
    const active = profiles.find((p) => p.id === activeId) || profiles[0] || DEFAULT_USER_PROFILE;
    return { ...DEFAULT_USER_PROFILE, ...active };
  } catch (e) {
    console.error('Error loading profile:', e);
    return DEFAULT_USER_PROFILE;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    // 1. Update legacy single profile key
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE_ID, profile.id);

    // 2. Update within profiles list
    const profiles = loadAllProfiles();
    const index = profiles.findIndex((p) => p.id === profile.id);
    let updated: UserProfile[];
    if (index >= 0) {
      updated = [...profiles];
      updated[index] = { ...updated[index], ...profile, updatedAt: new Date().toISOString() };
    } else {
      updated = [...profiles, profile];
    }
    saveAllProfiles(updated);
  } catch (e) {
    console.error('Error saving profile:', e);
  }
}

export function createProfile(data: Partial<UserProfile>): UserProfile {
  const newId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const newProfile: UserProfile = {
    ...DEFAULT_USER_PROFILE,
    ...data,
    id: newId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const current = loadAllProfiles();
  const updated = [...current, newProfile];
  saveAllProfiles(updated);
  setActiveProfileId(newProfile.id);
  saveUserProfile(newProfile);
  return newProfile;
}

export function updateProfile(id: string, updates: Partial<UserProfile>): UserProfile {
  const current = loadAllProfiles();
  const index = current.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new Error(`Profile ${id} not found`);
  }
  const updatedProfile: UserProfile = {
    ...current[index],
    ...updates,
    id,
    updatedAt: new Date().toISOString(),
  };
  const updatedList = [...current];
  updatedList[index] = updatedProfile;
  saveAllProfiles(updatedList);

  const activeId = getActiveProfileId();
  if (activeId === id) {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updatedProfile));
  }
  return updatedProfile;
}

export function deleteProfile(id: string): UserProfile[] {
  const current = loadAllProfiles();
  if (current.length <= 1) {
    throw new Error('Cannot delete the only profile');
  }
  const filtered = current.filter((p) => p.id !== id);
  saveAllProfiles(filtered);

  const activeId = getActiveProfileId();
  if (activeId === id) {
    setActiveProfileId(filtered[0].id);
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(filtered[0]));
  }
  return filtered;
}

/**
 * Deduct medicine stock upon confirmed intake.
 */
export function deductMedicineStock(medicineId: string, quantity: number): Medicine[] {
  const medicines = loadMedicines();
  const updated = medicines.map((m) => {
    if (m.id === medicineId) {
      return {
        ...m,
        currentStock: Math.max(0, m.currentStock - quantity),
        updatedAt: new Date().toISOString(),
      };
    }
    return m;
  });
  saveMedicines(updated);
  return updated;
}

/**
 * Add medicine stock upon refill receipt.
 */
export function refillMedicineStock(medicineId: string, addQuantity: number): Medicine[] {
  const medicines = loadMedicines();
  const todayKey = formatDateKey();
  const updated = medicines.map((m) => {
    if (m.id === medicineId) {
      return {
        ...m,
        currentStock: m.currentStock + addQuantity,
        lastRefillDate: todayKey,
        updatedAt: new Date().toISOString(),
      };
    }
    return m;
  });
  saveMedicines(updated);
  return updated;
}

export function loadCaregivers(): Caregiver[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CAREGIVERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CAREGIVERS, JSON.stringify(INITIAL_CAREGIVERS));
      return INITIAL_CAREGIVERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading caregivers:', e);
    return INITIAL_CAREGIVERS;
  }
}

export function saveCaregivers(caregivers: Caregiver[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CAREGIVERS, JSON.stringify(caregivers));
  } catch (e) {
    console.error('Error saving caregivers:', e);
  }
}

export function loadNotificationLogs(): NotificationLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function addNotificationLog(log: Omit<NotificationLog, 'id'>): void {
  try {
    const existing = loadNotificationLogs();
    const newLog: NotificationLog = {
      ...log,
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    const updated = [newLog, ...existing].slice(0, 50); // keep last 50
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updated));
  } catch (e) {
    console.error('Error logging notification:', e);
  }
}

/**
 * Ensure today's doses exist for all active medicines.
 * Also automatically checks and flags missed doses according to grace period.
 */
export function syncTodayDoses(): DoseInstance[] {
  const medicines = loadMedicines();
  const allDoses = loadDoses();
  const profile = loadUserProfile();
  const todayKey = formatDateKey(new Date());
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  let modified = false;
  const updatedDoses = [...allDoses];

  // 1. Ensure doses exist for today
  medicines.forEach((med) => {
    // Check if medicine is active today
    if (med.startDate && med.startDate > todayKey) return;
    if (!med.isOngoing && med.endDate && med.endDate < todayKey) return;

    // Check specific days if applicable
    if (med.frequency === 'specific_days' && med.specificDays) {
      const dayOfWeek = now.getDay();
      if (!med.specificDays.includes(dayOfWeek)) return;
    }

    med.reminderTimes.forEach((time) => {
      const doseId = `dose_${med.id}_${todayKey}_${time.replace(':', '')}`;
      const existingIndex = updatedDoses.findIndex((d) => d.id === doseId);

      if (existingIndex === -1) {
        updatedDoses.push({
          id: doseId,
          medicineId: med.id,
          medicineName: med.name,
          medicineType: med.type,
          strength: med.strength,
          quantityPerDose: med.quantityPerDose,
          unit: med.unit,
          mealTiming: med.mealTiming,
          color: med.color,
          imageUrl: med.imageUrl,
          scheduledDate: todayKey,
          scheduledTime: time,
          status: 'pending',
          snoozeCount: 0,
        });
        modified = true;
      } else if (updatedDoses[existingIndex].imageUrl !== med.imageUrl) {
        updatedDoses[existingIndex].imageUrl = med.imageUrl;
        modified = true;
      }
    });
  });

  // 2. Auto-evaluate missed status based on grace period
  const gracePeriod = profile.missedGraceMinutes || 45;

  for (let i = 0; i < updatedDoses.length; i++) {
    const dose = updatedDoses[i];
    // If dose is for today and pending
    if (dose.scheduledDate === todayKey && dose.status === 'pending') {
      const [h, m] = dose.scheduledTime.split(':').map(Number);
      const scheduledMinutes = h * 60 + m;

      // If snoozed, check snoozedUntil
      if (dose.snoozedUntil) {
        const snoozeDate = new Date(dose.snoozedUntil);
        if (now.getTime() > snoozeDate.getTime() + gracePeriod * 60 * 1000) {
          dose.status = 'missed';
          dose.notes = `Automatic: reminder and snooze period elapsed without confirmation (${gracePeriod}m grace period)`;
          modified = true;
        }
      } else if (currentMinutes > scheduledMinutes + gracePeriod) {
        dose.status = 'missed';
        dose.notes = `Automatic: reminder passed ${gracePeriod}m grace period without intake confirmation`;
        modified = true;
      }
    } else if (dose.scheduledDate < todayKey && dose.status === 'pending') {
      // Past day doses that remained pending are officially missed
      dose.status = 'missed';
      dose.notes = 'Past date dose left unconfirmed';
      modified = true;
    }
  }

  if (modified) {
    saveDoses(updatedDoses);
  }

  return updatedDoses;
}

/**
 * Calculate adherence percentage accurately.
 * Strict Formula: (Taken Doses / Total Due Doses) * 100
 * IMPORTANT: Future doses are excluded from denominator.
 */
export function calculateAdherence(
  doses: DoseInstance[],
  filterMedicineId?: string
): {
  taken: number;
  missed: number;
  skipped: number;
  pendingDue: number;
  futureDoses: number;
  totalDue: number;
  percentage: number;
} {
  const todayKey = formatDateKey(new Date());
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  let taken = 0;
  let missed = 0;
  let skipped = 0;
  let pendingDue = 0;
  let futureDoses = 0;

  doses.forEach((d) => {
    if (filterMedicineId && d.medicineId !== filterMedicineId) return;

    if (d.scheduledDate < todayKey) {
      // Past date
      if (d.status === 'taken') taken++;
      else if (d.status === 'missed') missed++;
      else if (d.status === 'skipped') skipped++;
      else missed++; // unconfirmed past dose counts as missed
    } else if (d.scheduledDate === todayKey) {
      // Today
      const [h, m] = d.scheduledTime.split(':').map(Number);
      const reminderMinutes = h * 60 + m;

      if (d.status === 'taken') {
        taken++;
      } else if (d.status === 'missed') {
        missed++;
      } else if (d.status === 'skipped') {
        skipped++;
      } else {
        // Pending
        if (currentMinutes >= reminderMinutes) {
          // Already due today
          pendingDue++;
        } else {
          // In the future today
          futureDoses++;
        }
      }
    } else {
      // Future dates
      futureDoses++;
    }
  });

  const totalDue = taken + missed + skipped + pendingDue;
  const percentage = totalDue === 0 ? 100 : Math.round((taken / totalDue) * 100);

  return {
    taken,
    missed,
    skipped,
    pendingDue,
    futureDoses,
    totalDue,
    percentage,
  };
}

/**
 * Reset state to fresh hackathon demo data
 */
export function resetToDemoData(): void {
  localStorage.setItem(STORAGE_KEYS.MEDICINES, JSON.stringify(INITIAL_MEDICINES));
  const seedDoses = generateSeedDoses(INITIAL_MEDICINES);
  localStorage.setItem(STORAGE_KEYS.DOSES, JSON.stringify(seedDoses));
  localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(INITIAL_PROFILES));
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEFAULT_USER_PROFILE));
  localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE_ID, DEFAULT_USER_PROFILE.id);
  localStorage.setItem(STORAGE_KEYS.CAREGIVERS, JSON.stringify(INITIAL_CAREGIVERS));
  localStorage.removeItem(STORAGE_KEYS.LOGS);
}

/**
 * Clear all records to a clean slate
 */
export function clearAllData(): void {
  localStorage.removeItem(STORAGE_KEYS.MEDICINES);
  localStorage.removeItem(STORAGE_KEYS.DOSES);
  localStorage.removeItem(STORAGE_KEYS.LOGS);
  localStorage.removeItem(STORAGE_KEYS.CAREGIVERS);
  const guestProfile: UserProfile = {
    ...DEFAULT_USER_PROFILE,
    name: 'New User',
    age: undefined,
    isGuest: true,
  };
  localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify([guestProfile]));
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(guestProfile));
  localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE_ID, guestProfile.id);
}

/**
 * Export dose history as clinical CSV file
 */
export function exportDosesToCSV(doses: DoseInstance[], profile: UserProfile): void {
  const headers = [
    'Scheduled Date',
    'Scheduled Time',
    'Medicine Name',
    'Medicine Type',
    'Dosage',
    'Quantity',
    'Meal Timing',
    'Status',
    'Confirmation Timestamp',
    'Notes / Reason',
    'Snooze Count',
  ];

  const rows = doses.map((d) => [
    `"${d.scheduledDate}"`,
    `"${d.scheduledTime}"`,
    `"${d.medicineName.replace(/"/g, '""')}"`,
    `"${d.medicineType}"`,
    `"${d.strength}"`,
    `"${d.quantityPerDose} ${d.unit}"`,
    `"${d.mealTiming.replace('_', ' ')}"`,
    `"${d.status.toUpperCase()}"`,
    `"${d.takenAt || '-'}"`,
    `"${(d.notes || d.skipReason || '').replace(/"/g, '""')}"`,
    `"${d.snoozeCount || 0}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `SmartDose_Clinical_Report_${profile.name.replace(/\s+/g, '_')}_${formatDateKey()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

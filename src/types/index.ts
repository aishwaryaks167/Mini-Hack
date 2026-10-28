export type MedicineType =
  | 'tablet'
  | 'capsule'
  | 'syrup'
  | 'drops'
  | 'inhaler'
  | 'injection'
  | 'patch'
  | 'topical'
  | 'other';

export type MealTiming =
  | 'before_meal'
  | 'after_meal'
  | 'with_meal'
  | 'empty_stomach'
  | 'anytime';

export type FrequencyType = 'daily' | 'specific_days' | 'interval';

export type DoseStatus = 'pending' | 'taken' | 'missed' | 'skipped';

export interface Medicine {
  id: string;
  profileId?: string; // Associated profile ID
  name: string;
  genericName?: string;
  type: MedicineType;
  strength: string; // e.g., "500 mg", "10 ml"
  quantityPerDose: number; // e.g. 1
  unit: string; // e.g. "tablet", "capsule", "ml", "puffs"
  instructions: string; // e.g. "Take with full glass of water, do not crush"
  mealTiming: MealTiming;
  startDate: string; // YYYY-MM-DD
  endDate?: string | null; // YYYY-MM-DD
  isOngoing: boolean;
  reminderTimes: string[]; // ["08:00", "20:00"]
  frequency: FrequencyType;
  specificDays?: number[]; // [0, 1, 2, 3, 4, 5, 6] (0 = Sunday)
  intervalDays?: number; // e.g., every 2 days
  color: string; // CSS color or hex
  imageUrl?: string; // Base64 data URL or photo asset
  currentStock: number;
  lowStockThreshold: number;
  prescribingDoctor?: string;
  doctorPhone?: string;
  pharmacyName?: string;
  pharmacyPhone?: string;
  rxNumber?: string;
  lastRefillDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DoseInstance {
  id: string;
  medicineId: string;
  medicineName: string;
  medicineType: MedicineType;
  strength: string;
  quantityPerDose: number;
  unit: string;
  mealTiming: MealTiming;
  color: string;
  imageUrl?: string;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:mm (24-hour format)
  status: DoseStatus;
  takenAt?: string | null; // ISO timestamp
  notes?: string;
  skipReason?: string;
  snoozedUntil?: string | null; // ISO timestamp
  snoozeCount: number;
}

export type FontSizeScale = 'normal' | 'large' | 'extra-large';

export type AppLanguage = 'en' | 'kn' | 'te' | 'hi';

export interface UserProfile {
  id: string;
  name: string;
  relationship?: string; // e.g., 'Self', 'Mother', 'Father', 'Spouse', 'Child', 'Patient'
  avatarUrl?: string; // photo dataUrl or preset identifier
  age?: number;
  gender?: string;
  bloodGroup?: string;
  allergies?: string[];
  chronicConditions?: string[];
  primaryDoctorName?: string;
  primaryDoctorPhone?: string;
  emergencyContactName?: string;
  emergencyContactRelationship?: string;
  emergencyContactPhone?: string;
  preferredLanguage: AppLanguage;
  timeFormat: '12h' | '24h';
  elderlyMode: boolean;
  fontSizeScale: FontSizeScale;
  highContrastMode: boolean;
  soundAlerts: boolean;
  soundTone: 'gentle' | 'chime' | 'bell' | 'radar';
  vibrate: boolean;
  // Voice assistance settings
  voiceEnabled: boolean;
  voiceRate: number; // 0.7 to 1.1
  voiceAutoReadAlarms: boolean;
  snoozeIntervalMinutes: number; // 5, 10, 15
  missedGraceMinutes: number; // e.g. 45 min
  isGuest: boolean;
  isLoggedIn: boolean;
  email?: string;
  // Privacy settings
  maskNotifications: boolean; // hide medicine names on lock screen
  // Caregiver consent record
  caregiverConsentAccepted: boolean;
  caregiverConsentDate?: string;
  defaultPharmacyName?: string;
  defaultPharmacyPhone?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Caregiver {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  accessLevel: 'full' | 'emergency_only' | 'adherence_only';
  alertOnMissed: boolean;
  alertDelayMinutes: number;
  alertOnLowRefill: boolean;
  shareAdherenceWeekly: boolean;
  emergencyAlerts: boolean;
  isVerified: boolean;
  consentSigned: boolean;
  verificationCode?: string;
  createdAt: string;
}

export interface NotificationLog {
  id: string;
  medicineName: string;
  scheduledTime: string;
  scheduledDate: string;
  timestamp: string;
  status: 'delivered' | 'snoozed' | 'taken' | 'missed';
  details?: string;
}

export interface AdherenceDaySummary {
  date: string;
  totalDue: number;
  taken: number;
  missed: number;
  skipped: number;
  adherencePercentage: number;
}

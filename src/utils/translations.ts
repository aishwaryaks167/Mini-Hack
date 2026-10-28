/**
 * Comprehensive localization translations for SmartDose:
 * English, Kannada (ಕನ್ನಡ), Tamil (தமிழ்), Telugu (తెలుగు), Hindi (हिन्दी)
 */

import { AppLanguage } from '../types';

export type SupportedLanguage = AppLanguage | 'ta';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
];

export const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // App Header & Branding
    appTitle: 'SmartDose',
    appSubtitle: 'Smart Medication Companion',
    mobileBadge: 'Mobile',
    elderlyMode: 'Elderly Mode',
    elderlyOn: 'Elderly: ON',
    testDose: 'Test Dose',
    hackathonKit: 'Hackathon Kit',
    voiceSummary: "Hear Day's Doses",
    hearDose: 'Hear Dose',
    switchLanguage: 'Language',
    refillTitle: 'Refill Reminder: Low Supply',
    refill30: '+30 Refill',
    callPharmacy: 'Call Pharmacy',
    missedDoseSafetyTitle: 'Missed Dose Clinical Safety',
    missedDoseSafetyText:
      'Never take a double or extra dose to make up for a missed pill. If it is close to your next scheduled dose, skip the missed one and continue your normal schedule. Call your doctor or pharmacist if unsure.',

    // Navigation Tabs
    tabToday: 'Today',
    tabMedicines: 'Medicines',
    tabAddMed: 'Add Med',
    tabHistory: 'History',
    tabCaregiver: 'Caregiver',
    tabSettings: 'Settings',

    // Greetings & Dashboard
    greetingMorning: 'Good morning',
    greetingAfternoon: 'Good afternoon',
    greetingEvening: 'Good evening',
    todaySchedule: "Today's Schedule",
    adherence: 'Adherence',
    taken: 'Taken',
    pending: 'Pending',
    missed: 'Missed',
    skipped: 'Skipped',
    dosesTakenSoFar: 'doses taken so far.',
    noMedsScheduled: 'No medicines scheduled for this day.',

    // Next Up Hero Card
    nextUpcomingDose: 'Next Upcoming Dose',
    dueRightNow: 'Due right now!',
    dueAgo: 'ago',
    dueIn: 'Due in',
    markAsTaken: 'Mark as Taken',
    markAsTakenNow: 'Mark as Taken Now',
    snooze: 'Snooze',
    snoozeMinutes: 'Snooze {min}m',
    takeNow: 'Take Now',

    // Time blocks
    morning: 'Morning',
    afternoon: 'Afternoon',
    evening: 'Evening',
    night: 'Night',
    dailyScheduleTimeline: 'Daily Schedule Timeline',
    totalDoses: 'total',
    noDosesScheduled: 'No Doses Scheduled',
    noDosesDesc: 'There are no medicines scheduled for this date. Add a prescription or load sample demo data.',

    // Meal instructions
    before_meal: 'Before food',
    after_meal: 'After food',
    with_meal: 'With food',
    empty_stomach: 'Empty stomach',
    anytime: 'As prescribed',

    // Status notes
    confirmedTaken: 'Confirmed taken',
    unconfirmedGrace: 'Unconfirmed dose (passed grace period). Tap to fix.',
    snoozedTimes: 'Snoozed',
    times: 'time(s)',

    // Medical Safety Disclaimer
    medicalSafetyTitle: 'Medical Safety Notice:',
    medicalSafetyNotice:
      'SmartDose is a personal reminder and tracking companion. It does not provide medical diagnosis, dosage alteration, or clinical advice. Always consult your prescribing physician or pharmacist before modifying any medication schedule.',

    // Dose Action Sheet
    currentStatus: 'Current Status:',
    snoozeReminder: 'Snooze Reminder',
    doesNotMarkTaken: '(Does not mark taken)',
    skipDose: 'Skip Dose...',
    correctRecord: 'Correct Record',
    specifyReasonSkip: 'Specify Reason for Skipping',
    confirmSkip: 'Confirm Skip',
    retroactiveCorrection: 'Retroactive Record Correction',
    saveCorrection: 'Save Correction',
    cancel: 'Cancel',

    // Medicines List & Form
    myPrescriptions: 'My Prescriptions',
    managePrescriptionsDesc: 'Manage your prescribed medications and schedules',
    addMedicine: 'Add Medicine',
    editMedicine: 'Edit Medicine Schedule',
    searchPlaceholder: 'Search medicine name, generic, or doctor...',
    allTypes: 'All Types',
    medicinePhoto: 'Medicine Photo (Visual Aid for Seniors)',
    photoAttached: 'Photo Attached',
    takePhoto: 'Take Photo',
    fromGallery: 'From Gallery',
    samplePillOrPhoto: 'Or choose a realistic pill sample:',
    retake: 'Retake',
    gallery: 'Gallery',
    remove: 'Remove',
    medName: 'Medicine Brand Name',
    genericNameOpt: 'Generic Name (Optional)',
    medicineType: 'Medicine Form / Type',
    strength: 'Strength',
    qtyPerDose: 'Qty / Dose',
    unit: 'Unit',
    mealTiming: 'Meal Timing Instructions',
    reminderTimes: 'Reminder Times (Daily)',
    repeatSchedule: 'Repeat Schedule',
    everyDay: 'Every Day',
    specificDays: 'Specific Days',
    everyXDays: 'Every X Days',
    doctorClinic: 'Prescribing Doctor / Clinic',
    specialInstructions: 'Special Instructions / Precautions',
    stockLeft: 'Current Stock Left',
    refillAlert: 'Refill Alert When Below',
    scheduleMedicine: 'Schedule Medicine',
    saveChanges: 'Save Changes',

    // History & Reports
    adherenceHistory: 'Adherence History',
    historyDesc: 'Clinical compliance tracking & verifiable dose logs',
    exportCSV: 'Export CSV',
    printable: 'Printable',
    last7Days: 'Last 7 Days',
    last14Days: '14 Days',
    last30Days: '30 Days',
    avgAdherenceRate: 'Average Adherence Rate',
    excellent: 'Excellent',
    moderate: 'Moderate',
    needsAttention: 'Needs Attention',

    // Caregiver
    caregiverNetwork: 'Caregiver Network',
    caregiverDesc: 'Family & medical contacts for safety escalations',
    addCaregiver: 'Add Caregiver',
    escalationNoticeTitle: 'Clinical Escalation Protocol Notice',
    escalationNoticeDesc:
      'SmartDose strictly distinguishes "unconfirmed dose" from "medicine not taken". Caregivers receive a gentle check-in prompt to avoid undue alarm or panic.',
    simulateAlert: 'Simulate Alert',
    openInWhatsApp: 'Open in WhatsApp',

    // Settings
    settingsTitle: 'Settings & Preferences',
    settingsDesc: 'Accessibility, reminder audio, language, and data options',
    accessibilityDisplay: 'Accessibility & Display',
    elderlyModeTitle: 'Elderly-Accessible High Contrast Mode',
    elderlyModeDesc:
      'Enlarges text typography by 25%, increases tap targets to 56px+, enhances high-contrast borders, and simplifies terminology.',
    timeFormat: 'Time Display Format',
    interfaceLanguage: 'Interface Language',
    audioReminders: 'Audio & Notification Engine',
    chimeTone: 'Reminder Chime Tone (Web Audio API)',
    testTone: 'Test Tone',
    defaultSnooze: 'Default Snooze Interval',
    missedGracePeriod: 'Missed Dose Grace Period',
    osNotifications: 'OS Notification Permissions',
    sendTestNotification: 'Send Test Notification',
    resetDemoData: 'Reset to Hackathon Demo Data',
    exportBackup: 'Export Full JSON Backup',
    restoreBackup: 'Restore from JSON Backup',
    wipeAllData: 'Wipe All Data (Clean Slate)',
    viewAPKGuide: 'View Android APK Guide',

    // Language names in current language
    langEnglish: 'English',
    langKannada: 'ಕನ್ನಡ (Kannada)',
    langTamil: 'தமிழ் (Tamil)',
    langTelugu: 'తెలుగు (Telugu)',
    langHindi: 'हिन्दी (Hindi)',

    // Profile Management
    profile: 'Profile',
    editProfile: 'Edit Profile',
    createProfile: 'Add Profile',
    switchProfile: 'Switch Profile',
    manageProfiles: 'Manage Profiles',
    patientProfile: 'Patient Profile',
    patientName: 'Full Name',
    relationship: 'Relationship / Role',
    allergies: 'Known Drug Allergies',
    chronicConditions: 'Health Conditions',
    primaryDoctor: 'Primary Doctor',
    emergencyContact: 'Emergency Contact',
    saveProfile: 'Save Profile',
    deleteProfile: 'Delete Profile',
    newProfileTitle: 'Create Patient Profile',
    editProfileTitle: 'Edit Patient Profile',
  },

  kn: {
    // App Header & Branding
    appTitle: 'ಸ್ಮಾರ್ಟ್‌ಡೋಸ್',
    appSubtitle: 'ಸ್ಮಾರ್ಟ್ ಔಷಧಿ ಜ್ಞಾಪನೆ ಅಪ್ಲಿಕೇಶನ್',
    mobileBadge: 'ಮೊಬೈಲ್',
    elderlyMode: 'ಹಿರಿಯರ ಮೋಡ್',
    elderlyOn: 'ಹಿರಿಯರ ಮೋಡ್: ಆನ್',
    testDose: 'ಟೆಸ್ಟ್ ಡೋಸ್',
    hackathonKit: 'ಹ್ಯಾಕಥಾನ್ ಕಿಟ್',
    voiceSummary: 'ಇಂದಿನ ಡೋಸ್ ಆಲಿಸಿ',
    hearDose: 'ಡೋಸ್ ಆಲಿಸಿ',
    switchLanguage: 'ಭಾಷೆ',
    refillTitle: 'ಪುನರ್ಭರ್ತಿ ಜ್ಞಾಪನೆ: ಕಡಿಮೆ ಸ್ಟಾಕ್',
    refill30: '+30 ಪುನರ್ಭರ್ತಿ',
    callPharmacy: 'ಫಾರ್ಮಸಿಗೆ ಕರೆ ಮಾಡಿ',
    missedDoseSafetyTitle: 'ತಪ್ಪಿದ ಡೋಸ್ ಸುರಕ್ಷತಾ ನಿಯಮ',
    missedDoseSafetyText:
      'ತಪ್ಪಿದ ಮಾತ್ರೆಗೆ ಬದಲಾಗಿ ಎಂದಿಗೂ ಹೆಚ್ಚುವರಿ ಅಥವಾ ಡಬಲ್ ಡೋಸ್ ತೆಗೆದುಕೊಳ್ಳಬೇಡಿ. ಮುಂದಿನ ಡೋಸ್ ಸಮಯ ಹತ್ತಿರವಿದ್ದರೆ, ತಪ್ಪಿದ್ದನ್ನು ಬಿಟ್ಟು ಸಾಮಾನ್ಯ ವೇಳಾಪಟ್ಟಿ ಮುಂದುವರಿಸಿ. ಸಂದೇಹವಿದ್ದರೆ ನಿಮ್ಮ ವೈದ್ಯರು ಅಥವಾ ಫಾರ್ಮಸಿಸ್ಟ್ ಅನ್ನು ಸಂಪರ್ಕಿಸಿ.',

    // Navigation Tabs
    tabToday: 'ಇಂದು',
    tabMedicines: 'ಔಷಧಗಳು',
    tabAddMed: 'ಸೇರಿಸಿ',
    tabHistory: 'ಇತಿಹಾಸ',
    tabCaregiver: 'ಪಾಲಕರು',
    tabSettings: 'ಸೆಟ್ಟಿಂಗ್ಸ್',

    // Greetings & Dashboard
    greetingMorning: 'ಶುಭೋದಯ',
    greetingAfternoon: 'ಶುಭ ಮಧ್ಯಾಹ್ನ',
    greetingEvening: 'ಶುಭ ಸಂಜೆ',
    todaySchedule: 'ಇಂದಿನ ವೇಳಾಪಟ್ಟಿ',
    adherence: 'ಅನುಸರಣೆ',
    taken: 'ತೆಗೆದುಕೊಂಡಿದೆ',
    pending: 'ಬಾಕಿ ಇದೆ',
    missed: 'ತಪ್ಪಿಹೋಗಿದೆ',
    skipped: 'ಬಿಡಲಾಗಿದೆ',
    dosesTakenSoFar: 'ಡೋಸ್‌ಗಳನ್ನು ಇದುವರೆಗೆ ತೆಗೆದುಕೊಳ್ಳಲಾಗಿದೆ.',
    noMedsScheduled: 'ಈ ದಿನ ಯಾವುದೇ ಔಷಧಿಗಳನ್ನು ನಿಗದಿಪಡಿಸಲಾಗಿಲ್ಲ.',

    // Next Up Hero Card
    nextUpcomingDose: 'ಮುಂದಿನ ಔಷಧಿ ಸಮಯ',
    dueRightNow: 'ಈಗಲೇ ತೆಗೆದುಕೊಳ್ಳುವ ಸಮಯ!',
    dueAgo: 'ಹಿಂದೆ',
    dueIn: 'ಸಮಯ ಬಾಕಿ:',
    markAsTaken: 'ತೆಗೆದುಕೊಂಡೆ ಎಂದು ಗುರುತಿಸಿ',
    markAsTakenNow: 'ಈಗ ತೆಗೆದುಕೊಂಡೆ ಎಂದು ಗುರುತಿಸಿ',
    snooze: 'ಸ್ನೂಜ್',
    snoozeMinutes: '{min} ನಿಮಿಷ ಸ್ನೂಜ್',
    takeNow: 'ಈಗಲೇ ತೆಗೆದುಕೊಳ್ಳಿ',

    // Time blocks
    morning: 'ಬೆಳಗ್ಗೆ',
    afternoon: 'ಮಧ್ಯಾಹ್ನ',
    evening: 'ಸಂಜೆ',
    night: 'ರಾತ್ರಿ',
    dailyScheduleTimeline: 'ದೈನಂದಿನ ಔಷಧಿ ವೇಳಾಪಟ್ಟಿ',
    totalDoses: 'ಒಟ್ಟು',
    noDosesScheduled: 'ಯಾವುದೇ ಡೋಸ್ ನಿಗದಿಯಾಗಿಲ್ಲ',
    noDosesDesc: 'ಈ ದಿನಾಂಕಕ್ಕೆ ಯಾವುದೇ ಔಷಧಿಗಳು ನಿಗದಿಯಾಗಿಲ್ಲ. ಹೊಸ ಔಷಧಿ ಸೇರಿಸಿ ಅಥವಾ ಮಾದರಿ ಡೇಟಾ ಲೋಡ್ ಮಾಡಿ.',

    // Meal instructions
    before_meal: 'ಊಟಕ್ಕೆ ಮುಂಚೆ',
    after_meal: 'ಊಟದ ನಂತರ',
    with_meal: 'ಊಟದ ಜೊತೆಗೆ',
    empty_stomach: 'ಖಾಲಿ ಹೊಟ್ಟೆಯಲ್ಲಿ',
    anytime: 'ವೈದ್ಯರ ಸಲಹೆಯಂತೆ',

    // Status notes
    confirmedTaken: 'ತೆಗೆದುಕೊಂಡಿರುವುದು ದೃಢಪಟ್ಟಿದೆ',
    unconfirmedGrace: 'ದೃಢೀಕರಿಸದ ಡೋಸ್ (ಸಮಯ ಮೀರಿದೆ). ಸರಿಪಡಿಸಲು ಟ್ಯಾಪ್ ಮಾಡಿ.',
    snoozedTimes: 'ಸ್ನೂಜ್ ಮಾಡಲಾಗಿದೆ',
    times: 'ಬಾರಿ',

    // Medical Safety Disclaimer
    medicalSafetyTitle: 'ವೈದ್ಯಕೀಯ ಸುರಕ್ಷತಾ ಸೂಚನೆ:',
    medicalSafetyNotice:
      'ಸ್ಮಾರ್ಟ್‌ಡೋಸ್ ಕೇವಲ ಜ್ಞಾಪನೆ ಮತ್ತು ಟ್ರ್ಯಾಕಿಂಗ್ ಸಾಧನವಾಗಿದೆ. ಇದು ವೈದ್ಯಕೀಯ ಚಿಕಿತ್ಸೆ ಅಥವಾ ಡೋಸ್ ಬದಲಾವಣೆಯನ್ನು ಸೂಚಿಸುವುದಿಲ್ಲ. ಯಾವುದೇ ಬದಲಾವಣೆಗೆ ಮುನ್ನ ನಿಮ್ಮ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.',

    // Dose Action Sheet
    currentStatus: 'ಪ್ರಸ್ತುತ ಸ್ಥಿತಿ:',
    snoozeReminder: 'ಜ್ಞಾಪನೆ ಸ್ನೂಜ್ ಮಾಡಿ',
    doesNotMarkTaken: '(ತೆಗೆದುಕೊಂಡಂತೆ ಪರಿಗಣಿಸುವುದಿಲ್ಲ)',
    skipDose: 'ಡೋಸ್ ಬಿಡಿ...',
    correctRecord: 'ದಾಖಲೆ ಸರಿಪಡಿಸಿ',
    specifyReasonSkip: 'ಡೋಸ್ ಬಿಡಲು ಕಾರಣವನ್ನು ತಿಳಿಸಿ',
    confirmSkip: 'ಬಿಡಲು ದೃಢೀಕರಿಸಿ',
    retroactiveCorrection: 'ಹಿಂದಿನ ದಾಖಲೆ ತಿದ್ದುಪಡಿ',
    saveCorrection: 'ತಿದ್ದುಪಡಿ ಉಳಿಸಿ',
    cancel: 'ರದ್ದುಮಾಡಿ',

    // Medicines List & Form
    myPrescriptions: 'ನನ್ನ ಔಷಧಿಗಳು',
    managePrescriptionsDesc: 'ನಿಮ್ಮ ವೈದ್ಯಕೀಯ ಔಷಧಿಗಳು ಮತ್ತು ವೇಳಾಪಟ್ಟಿಯನ್ನು ನಿರ್ವಹಿಸಿ',
    addMedicine: 'ಔಷಧಿ ಸೇರಿಸಿ',
    editMedicine: 'ಔಷಧಿ ವೇಳಾಪಟ್ಟಿ ತಿದ್ದುಪಡಿ',
    searchPlaceholder: 'ಔಷಧಿ ಹೆಸರು, ಜೆನೆರಿಕ್ ಅಥವಾ ವೈದ್ಯರ ಹೆಸರು ಹುಡುಕಿ...',
    allTypes: 'ಎಲ್ಲಾ ಪ್ರಕಾರಗಳು',
    medicinePhoto: 'ಔಷಧಿ ಫೋಟೋ (ಹಿರಿಯರಿಗೆ ಸುಲಭ ಗುರುತಿಸುವಿಕೆಗಾಗಿ)',
    photoAttached: 'ಫೋಟೋ ಲಗತ್ತಿಸಲಾಗಿದೆ',
    takePhoto: 'ಫೋಟೋ ತೆಗೆಯಿರಿ',
    fromGallery: 'ಗ್ಯಾಲರಿಯಿಂದ ಆಯ್ಕೆಮಾಡಿ',
    samplePillOrPhoto: 'ಅಥವಾ ಮಾದರಿ ಮಾತ್ರೆ ಫೋಟೋ ಆಯ್ಕೆಮಾಡಿ:',
    retake: 'ಮತ್ತೆ ತೆಗೆಯಿರಿ',
    gallery: 'ಗ್ಯಾಲರಿ',
    remove: 'ತೆಗೆದುಹಾಕಿ',
    medName: 'ಔಷಧಿಯ ಬ್ರ್ಯಾಂಡ್ ಹೆಸರು',
    genericNameOpt: 'ಜೆನೆರಿಕ್ ಹೆಸರು (ಐಚ್ಛಿಕ)',
    medicineType: 'ಔಷಧಿಯ ಪ್ರಕಾರ',
    strength: 'ಸಾಮರ್ಥ್ಯ (ಉದಾ. 500 mg)',
    qtyPerDose: 'ಪ್ರತಿ ಡೋಸ್‌ಗೆ ಪ್ರಮಾಣ',
    unit: 'ಘಟಕ (ಮಾತ್ರೆ/ಮಿ.ಲೀ)',
    mealTiming: 'ಆಹಾರ ಸಮಯದ ಸೂಚನೆಗಳು',
    reminderTimes: 'ಜ್ಞಾಪನೆ ಸಮಯಗಳು (ದೈನಂದಿನ)',
    repeatSchedule: 'ಪುನರಾವರ್ತನೆ ವೇಳಾಪಟ್ಟಿ',
    everyDay: 'ಪ್ರತಿದಿನ',
    specificDays: 'ನಿಗದಿತ ದಿನಗಳು',
    everyXDays: 'ಪ್ರತಿ X ದಿನಗಳಿಗೊಮ್ಮೆ',
    doctorClinic: 'ವೈದ್ಯರು / ಆಸ್ಪತ್ರೆ',
    specialInstructions: 'ವಿಶೇಷ ಮುನ್ನೆಚ್ಚರಿಕೆಗಳು / ಸೂಚನೆಗಳು',
    stockLeft: 'ಪ್ರಸ್ತುತ ಲಭ್ಯವಿರುವ ಸ್ಟಾಕ್',
    refillAlert: 'ರೀಫಿಲ್ ಎಚ್ಚರಿಕೆ ಮಿತಿ',
    scheduleMedicine: 'ಔಷಧಿಯನ್ನು ನಿಗದಿಪಡಿಸಿ',
    saveChanges: 'ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ',

    // History & Reports
    adherenceHistory: 'ಅನುಸರಣೆಯ ಇತಿಹಾಸ',
    historyDesc: 'ನಿಖರವಾದ ಔಷಧಿ ಸೇವನೆ ದಾಖಲೆಗಳು ಮತ್ತು ವರದಿಗಳು',
    exportCSV: 'CSV ಡೌನ್‌ಲೋಡ್',
    printable: 'ಪ್ರಿಂಟ್ ಶೀಟ್',
    last7Days: 'ಕಳೆದ 7 ದಿನಗಳು',
    last14Days: '14 ದಿನಗಳು',
    last30Days: '30 ದಿನಗಳು',
    avgAdherenceRate: 'ಸರಾಸರಿ ಅನುಸರಣಾ ದರ',
    excellent: 'ಉತ್ತಮ',
    moderate: 'ಮಧ್ಯಮ',
    needsAttention: 'ಗಮನ ಹರಿಸಬೇಕಾಗಿದೆ',

    // Caregiver
    caregiverNetwork: 'ಪಾಲಕರ ನೆಟ್‌ವರ್ಕ್',
    caregiverDesc: 'ಕುಟುಂಬಸ್ಥರು ಮತ್ತು ವೈದ್ಯಕೀಯ ಸಂಪರ್ಕಗಳು',
    addCaregiver: 'ಪಾಲಕರನ್ನು ಸೇರಿಸಿ',
    escalationNoticeTitle: 'ಕ್ಲಿನಿಕಲ್ ಎಚ್ಚರಿಕೆಯ ನಿಯಮಾವಳಿ',
    escalationNoticeDesc:
      'ಸ್ಮಾರ್ಟ್‌ಡೋಸ್ "ದೃಢೀಕರಿಸದ ಡೋಸ್" ಅನ್ನು "ತೆಗೆದುಕೊಳ್ಳದ ಡೋಸ್" ಎಂದು ಗೊಂದಲಗೊಳಿಸುವುದಿಲ್ಲ. ಆತಂಕ ತಪ್ಪಿಸಲು ಪಾಲಕರಿಗೆ ಸೌಮ್ಯ ಸಂದೇಶ ರವಾನಿಸಲಾಗುತ್ತದೆ.',
    simulateAlert: 'ಎಚ್ಚರಿಕೆ ಸಿಮ್ಯುಲೇಟ್ ಮಾಡಿ',
    openInWhatsApp: 'WhatsApp ನಲ್ಲಿ ತೆರೆಯಿರಿ',

    // Settings
    settingsTitle: 'ಸೆಟ್ಟಿಂಗ್ಸ್ ಮತ್ತು ಆದ್ಯತೆಗಳು',
    settingsDesc: 'ಪ್ರವೇಶಿಸುವಿಕೆ, ರಿಮೈಂಡರ್ ಧ್ವನಿ, ಭಾಷೆ ಮತ್ತು ಡೇಟಾ ನಿರ್ವಹಣೆ',
    accessibilityDisplay: 'ಪ್ರವೇಶಿಸುವಿಕೆ ಮತ್ತು ಪ್ರದರ್ಶನ',
    elderlyModeTitle: 'ಹಿರಿಯರ ಸ್ನೇಹಿ ಹೈ-ಕಾಂಟ್ರಾಸ್ಟ್ ಮೋಡ್',
    elderlyModeDesc:
      'ಅಕ್ಷರಗಳನ್ನು 25% ದೊಡ್ಡದಾಗಿಸುತ್ತದೆ, ಬಟನ್‌ಗಳನ್ನು 56px ಗೆ ಹಿಗ್ಗಿಸುತ್ತದೆ ಮತ್ತು ಹೈ-ಕಾಂಟ್ರಾಸ್ಟ್ ಬಾರ್ಡರ್ ನೀಡುತ್ತದೆ.',
    timeFormat: 'ಸಮಯ ಪ್ರದರ್ಶನ ಶೈಲಿ',
    interfaceLanguage: 'ಆಪ್ ಭಾಷೆ (Language)',
    audioReminders: 'ಧ್ವನಿ ಮತ್ತು ಜ್ಞಾಪನೆ ಎಂಜಿನ್',
    chimeTone: 'ರಿಮೈಂಡರ್ ಬೆಲ್ ಧ್ವನಿ (Web Audio)',
    testTone: 'ಧ್ವನಿ ಪರೀಕ್ಷಿಸಿ',
    defaultSnooze: 'ಡೀಫಾಲ್ಟ್ ಸ್ನೂಜ್ ಅವಧಿ',
    missedGracePeriod: 'ಮಿಸ್ಡ್ ಡೋಸ್ ಗ್ರೇಸ್ ಅವಧಿ',
    osNotifications: 'ಮೊಬೈಲ್ ನೋಟಿಫಿಕೇಶನ್ ಅನುಮತಿ',
    sendTestNotification: 'ಟೆಸ್ಟ್ ನೋಟಿಫಿಕೇಶನ್ ಕಳುಹಿಸಿ',
    resetDemoData: 'ಹ್ಯಾಕಥಾನ್ ಡೆಮೊ ಡೇಟಾ ಮರುಹೊಂದಿಸಿ',
    exportBackup: 'ಸಂಪೂರ್ಣ JSON ಬ್ಯಾಕಪ್ ಉಳಿಸಿ',
    restoreBackup: 'JSON ಬ್ಯಾಕಪ್ ಮರುಸ್ಥಾಪಿಸಿ',
    wipeAllData: 'ಎಲ್ಲಾ ಡೇಟಾ ತೆರವುಗೊಳಿಸಿ (ಕ್ಲೀನ್ ಸ್ಲೇಟ್)',
    viewAPKGuide: 'Android APK ಗೈಡ್ ವೀಕ್ಷಿಸಿ',

    langEnglish: 'English',
    langKannada: 'ಕನ್ನಡ (Kannada)',
    langTamil: 'தமிழ் (Tamil)',
    langTelugu: 'తెలుగు (Telugu)',
    langHindi: 'हिन्दी (Hindi)',

    // Profile Management
    profile: 'ಪ್ರೊಫೈಲ್',
    editProfile: 'ಪ್ರೊಫೈಲ್ ಸಂಪಾದಿಸಿ',
    createProfile: 'ಹೊಸ ಪ್ರೊಫೈಲ್ ರಚಿಸಿ',
    switchProfile: 'ಪ್ರೊಫೈಲ್ ಬದಲಿಸಿ',
    manageProfiles: 'ಪ್ರೊಫೈಲ್‌ಗಳನ್ನು ನಿರ್ವಹಿಸಿ',
    patientProfile: 'ರೋಗಿಯ ಪ್ರೊಫೈಲ್',
    patientName: 'ಪೂರ್ಣ ಹೆಸರು',
    relationship: 'ಸಂಬಂಧ / ಪಾತ್ರ',
    allergies: 'ಔಷಧ ಅಲರ್ಜಿಗಳು',
    chronicConditions: 'ಆರೋಗ್ಯ ಸಮಸ್ಯೆಗಳು',
    primaryDoctor: 'ಮುಖ್ಯ ವೈದ್ಯರು',
    emergencyContact: 'ತುರ್ತು ಸಂಪರ್ಕ',
    saveProfile: 'ಪ್ರೊಫೈಲ್ ಉಳಿಸಿ',
    deleteProfile: 'ಪ್ರೊಫೈಲ್ ಅಳಿಸಿ',
    newProfileTitle: 'ಹೊಸ ಪ್ರೊಫೈಲ್ ರಚಿಸಿ',
    editProfileTitle: 'ಪ್ರೊಫೈಲ್ ಸಂಪಾದಿಸಿ',
  },

  ta: {
    // App Header & Branding
    appTitle: 'ஸ்மார்ட்டோஸ்',
    appSubtitle: 'ஸ்மார்ட் மருந்து நினைவூட்டல்',
    mobileBadge: 'மொபைல்',
    elderlyMode: 'முதியோர் முறை',
    elderlyOn: 'முதியோர்: ஆன்',
    testDose: 'டெஸ்ட் டோஸ்',
    hackathonKit: 'ஹேக்கத்தான் கிட்',

    // Navigation Tabs
    tabToday: 'இன்று',
    tabMedicines: 'மருந்துகள்',
    tabAddMed: 'சேர்',
    tabHistory: 'வரலாறு',
    tabCaregiver: 'பராமரிப்பாளர்',
    tabSettings: 'அமைப்புகள்',

    // Greetings & Dashboard
    greetingMorning: 'காலை வணக்கம்',
    greetingAfternoon: 'மதிய வணக்கம்',
    greetingEvening: 'மாலை வணக்கம்',
    todaySchedule: 'இன்றைய அட்டவணை',
    adherence: 'பின்பற்றுதல்',
    taken: 'எடுக்கப்பட்டது',
    pending: 'நிலுவையில்',
    missed: 'தவறவிடப்பட்டது',
    skipped: 'தவிர்க்கப்பட்டது',
    dosesTakenSoFar: 'மருந்துகள் இதுவரை எடுக்கப்பட்டுள்ளன.',
    noMedsScheduled: 'இன்று எந்த மருந்துகளும் திட்டமிடப்படவில்லை.',

    // Next Up Hero Card
    nextUpcomingDose: 'அடுத்த மருந்து நேரம்',
    dueRightNow: 'இப்போதே எடுக்க வேண்டிய நேரம்!',
    dueAgo: 'முன்பு',
    dueIn: 'இன்னும் மீதமுள்ளது:',
    markAsTaken: 'எடுத்துக்கொண்டேன் என குறிக்கவும்',
    markAsTakenNow: 'இப்போது எடுத்துக்கொண்டேன்',
    snooze: 'தள்ளிப்போடு',
    snoozeMinutes: '{min} நிமிடம் தள்ளிப்போடு',
    takeNow: 'இப்போது எடுங்கள்',

    // Time blocks
    morning: 'காலை',
    afternoon: 'மதியம்',
    evening: 'மாலை',
    night: 'இரவு',
    dailyScheduleTimeline: 'தினசரி மருந்து அட்டவணை',
    totalDoses: 'மொத்தம்',
    noDosesScheduled: 'மருந்துகள் திட்டமிடப்படவில்லை',
    noDosesDesc: 'இந்த தேதியில் மருந்துகள் இல்லை. புதிய மருந்தைச் சேர்க்கவும் அல்லது டெமோவை ஏற்றவும்.',

    // Meal instructions
    before_meal: 'உணவுக்கு முன்',
    after_meal: 'உணவுக்குப் பின்',
    with_meal: 'உணவுடன்',
    empty_stomach: 'வெறும் வயிற்றில்',
    anytime: 'பரிந்துரைத்தபடி',

    // Status notes
    confirmedTaken: 'எடுக்கப்பட்டது உறுதிசெய்யப்பட்டது',
    unconfirmedGrace: 'உறுதிப்படுத்தப்படாத டோஸ் (நேரம் கடந்துவிட்டது). திருத்த தட்டவும்.',
    snoozedTimes: 'தள்ளிப்போடப்பட்டது',
    times: 'முறை',

    // Medical Safety Disclaimer
    medicalSafetyTitle: 'மருத்துவப் பாதுகாப்பு அறிவிப்பு:',
    medicalSafetyNotice:
      'ஸ்மார்ட்டோஸ் ஒரு நினைவூட்டல் கருவி மட்டுமே. இது மருத்துவ ஆலோசனையோ மருந்தளவு மாற்றங்களையோ வழங்காது. உங்கள் மருத்துவரை அணுகவும்.',

    // Dose Action Sheet
    currentStatus: 'தற்போதைய நிலை:',
    snoozeReminder: 'நினைவூட்டலைத் தள்ளிப்போடு',
    doesNotMarkTaken: '(எடுக்கப்பட்டதாக மாறாது)',
    skipDose: 'டோஸைத் தவிர்க்கவும்...',
    correctRecord: 'பதிவைச் சரிசெய்யவும்',
    specifyReasonSkip: 'தவிர்ப்பதற்கான காரணத்தைக் குறிப்பிடவும்',
    confirmSkip: 'தவிர்ப்பதை உறுதிசெய்',
    retroactiveCorrection: 'முந்தைய பதிவைத் திருத்துதல்',
    saveCorrection: 'திருத்தத்தை சேமி',
    cancel: 'ரத்து செய்',

    // Medicines List & Form
    myPrescriptions: 'என் மருந்துகள்',
    managePrescriptionsDesc: 'உங்கள் மருந்துகள் மற்றும் அட்டவணையை நிர்வகிக்கவும்',
    addMedicine: 'மருந்து சேர்க்க',
    editMedicine: 'மருந்து அட்டவணையைத் திருத்தவும்',
    searchPlaceholder: 'மருந்து பெயர் அல்லது மருத்துவரைத் தேடவும்...',
    allTypes: 'அனைத்து வகைகள்',
    medicinePhoto: 'மருந்து புகைப்படம் (முதியோருக்கான காட்சி உதவி)',
    photoAttached: 'புகைப்படம் இணைக்கப்பட்டது',
    takePhoto: 'புகைப்படம் எடுக்கவும்',
    fromGallery: 'கேலரியிலிருந்து பதிவேற்றவும்',
    samplePillOrPhoto: 'அல்லது மாதிரி மாத்திரை புகைப்படத்தைத் தேர்ந்தெடுக்கவும்:',
    retake: 'மீண்டும் எடு',
    gallery: 'கேலரி',
    remove: 'நீக்கு',
    medName: 'மருந்தின் பிராண்ட் பெயர்',
    genericNameOpt: 'பொதுப் பெயர் (விரும்பினால்)',
    medicineType: 'மருந்தின் வடிவம் / வகை',
    strength: 'மருந்தளவு (எ.கா. 500 mg)',
    qtyPerDose: 'ஒரு டோஸுக்கு அளவு',
    unit: 'அலகு (மாத்திரை/மில்லி)',
    mealTiming: 'உணவு நேர வழிமுறைகள்',
    reminderTimes: 'நினைவூட்டல் நேரங்கள் (தினசரி)',
    repeatSchedule: 'மீண்டும் மீண்டும் அட்டவணை',
    everyDay: 'தினமும்',
    specificDays: 'குறிப்பிட்ட நாட்கள்',
    everyXDays: 'ஒவ்வொரு X நாட்களுக்கு ஒருமுறை',
    doctorClinic: 'மருத்துவர் / மருத்துவமனை',
    specialInstructions: 'சிறப்பு வழிமுறைகள்',
    stockLeft: 'மீதமுள்ள கையிருப்பு',
    refillAlert: 'மறு நிரப்பல் எச்சரிக்கை வரம்பு',
    scheduleMedicine: 'மருந்தை திட்டமிடுங்கள்',
    saveChanges: 'மாற்றங்களை சேமிக்கவும்',

    // History & Reports
    adherenceHistory: 'பின்பற்றுதல் வரலாறு',
    historyDesc: 'துல்லியமான மருந்து உட்கொள்ளல் பதிவுகள் மற்றும் அறிக்கைகள்',
    exportCSV: 'CSV ஏற்றுமதி',
    printable: 'அச்சிடக்கூடிய தாள்',
    last7Days: 'கடந்த 7 நாட்கள்',
    last14Days: '14 நாட்கள்',
    last30Days: '30 நாட்கள்',
    avgAdherenceRate: 'சராசரி பின்பற்றுதல் விகிதம்',
    excellent: 'சிறப்பானது',
    moderate: 'மிதமான',
    needsAttention: 'கவனம் தேவை',

    // Caregiver
    caregiverNetwork: 'பராமரிப்பாளர் நெட்வொர்க்',
    caregiverDesc: 'குடும்பத்தினர் மற்றும் அவசர தொடர்புகள்',
    addCaregiver: 'பராமரிப்பாளரைச் சேர்க்கவும்',
    escalationNoticeTitle: 'பாதுகாப்பு நெறிமுறை அறிவிப்பு',
    escalationNoticeDesc:
      'ஸ்மார்ட்டோஸ் "உறுதிப்படுத்தப்படாத டோஸை" "மருந்து எடுக்கவில்லை" என்பதில் இருந்து தெளிவாக வேறுபடுத்துகிறது.',
    simulateAlert: 'எச்சரிக்கையை உருவகப்படுத்தவும்',
    openInWhatsApp: 'WhatsApp இல் திறக்கவும்',

    // Settings
    settingsTitle: 'அமைப்புகள் மற்றும் விருப்பங்கள்',
    settingsDesc: 'அணுகல்தன்மை, ஒலி, மொழி மற்றும் தரவு விருப்பங்கள்',
    accessibilityDisplay: 'அணுகல்தன்மை மற்றும் காட்சி',
    elderlyModeTitle: 'முதியோருக்கான உயர்-மாறுபட்ட முறை',
    elderlyModeDesc:
      'எழுத்துக்களை 25% பெரிதாக்குகிறது, தொடு பொத்தான்களை 56px ஆக உயர்த்துகிறது.',
    timeFormat: 'நேர காட்சி வடிவம்',
    interfaceLanguage: 'பயன்பாட்டு மொழி (Language)',
    audioReminders: 'ஒலி மற்றும் நினைவூட்டல் அமைப்பு',
    chimeTone: 'நினைவூட்டல் மணி ஒலி (Web Audio)',
    testTone: 'ஒலியை சோதிக்கவும்',
    defaultSnooze: 'இயல்புநிலை தள்ளிப்போடும் நேரம்',
    missedGracePeriod: 'தவறிய டோஸ் கருணை காலம்',
    osNotifications: 'அறிவிப்பு அனுமதிகள்',
    sendTestNotification: 'சோதனை அறிவிப்பை அனுப்பவும்',
    resetDemoData: 'டெமோ தரவை மீட்டமைக்கவும்',
    exportBackup: 'முழுமையான JSON காப்புப்பிரதி',
    restoreBackup: 'காப்புப்பிரதியை மீட்டமைக்கவும்',
    wipeAllData: 'அனைத்து தரவையும் அழிக்கவும்',
    viewAPKGuide: 'Android APK வழிகாட்டியைப் பார்க்கவும்',

    langEnglish: 'English',
    langKannada: 'ಕನ್ನಡ (Kannada)',
    langTamil: 'தமிழ் (Tamil)',
    langTelugu: 'తెలుగు (Telugu)',
    langHindi: 'हिन्दी (Hindi)',
  },

  te: {
    // App Header & Branding
    appTitle: 'స్మార్ట్‌డోస్',
    appSubtitle: 'స్మార్ట్ ఔషధ రిమైండర్ కంపానియన్',
    mobileBadge: 'మొబైల్',
    elderlyMode: 'వృద్ధుల మోడ్',
    elderlyOn: 'వృద్ధుల మోడ్: ఆన్',
    testDose: 'టెస్ట్ డోస్',
    hackathonKit: 'హ్యాకథాన్ కిట్',
    voiceSummary: 'ఈ రోజు మోతాదులు వినండి',
    hearDose: 'మోతాదు వినండి',
    switchLanguage: 'భాష',
    refillTitle: 'రీఫిల్ రిమైండర్: తక్కువ స్టాక్',
    refill30: '+30 రీఫిల్',
    callPharmacy: 'ఫార్మసీకి కాల్ చేయండి',
    missedDoseSafetyTitle: 'తప్పిపోయిన మోతాదు భద్రతా నియమం',
    missedDoseSafetyText:
      'తప్పిపోయిన మందు కోసం ఎప్పుడూ డబుల్ లేదా అదనపు మోతాదు తీసుకోకండి. తర్వాతి మోతాదు సమయం దగ్గరగా ఉంటే, తప్పినదాన్ని వదిలేసి సాధారణ సమయపట్టికను కొనసాగించండి. సందేహం ఉంటే మీ డాక్టర్ లేదా ఫార్మసిస్ట్‌ను సంప్రదించండి.',

    // Navigation Tabs
    tabToday: 'నేడు',
    tabMedicines: 'మందులు',
    tabAddMed: 'చేర్చు',
    tabHistory: 'చరిత్ర',
    tabCaregiver: 'సంరక్షకుడు',
    tabSettings: 'సెట్టింగ్‌లు',

    // Greetings & Dashboard
    greetingMorning: 'శుభోదయం',
    greetingAfternoon: 'శుభ మధ్యాహ్నం',
    greetingEvening: 'శుభ సాయంత్రం',
    todaySchedule: 'నేటి షెడ్యూల్',
    adherence: 'అనుసరణ',
    taken: 'తీసుకున్నారు',
    pending: 'బాకీ ఉంది',
    missed: 'తప్పిపోయింది',
    skipped: 'వదిలేశారు',
    dosesTakenSoFar: 'డోస్‌లు ఇప్పటివరకు తీసుకున్నారు.',
    noMedsScheduled: 'ఈ రోజుకు ఎటువంటి మందులు షెడ్యూల్ చేయబడలేదు.',

    // Next Up Hero Card
    nextUpcomingDose: 'తదుపరి మందు సమయం',
    dueRightNow: 'ఇప్పుడే తీసుకునే సమయం!',
    dueAgo: 'క్రితం',
    dueIn: 'మిగిలిన సమయం:',
    markAsTaken: 'తీసుకున్నట్లు గుర్తించు',
    markAsTakenNow: 'ఇప్పుడే తీసుకున్నట్లు గుర్తించు',
    snooze: 'స్నూజ్',
    snoozeMinutes: '{min}ని. స్నూజ్',
    takeNow: 'ఇప్పుడే తీసుకోండి',

    // Time blocks
    morning: 'ఉదయం',
    afternoon: 'మధ్యాహ్నం',
    evening: 'సాయంత్రం',
    night: 'రాత్రి',
    dailyScheduleTimeline: 'రోజువారీ మందుల టైమ్‌లైన్',
    totalDoses: 'మొత్తం',
    noDosesScheduled: 'ఎటువంటి డోస్ షెడ్యూల్ కాలేదు',
    noDosesDesc: 'ఈ తేదీకి మందులు లేవు. కొత్త మందును జోడించండి లేదా డెమో డేటాను లోడ్ చేయండి.',

    // Meal instructions
    before_meal: 'భోజనానికి ముందు',
    after_meal: 'భోజనం తర్వాత',
    with_meal: 'భోజనంతో పాటు',
    empty_stomach: 'ఖాళీ కడుపుతో',
    anytime: 'వైద్యుని సలహా మేరకు',

    // Status notes
    confirmedTaken: 'తీసుకున్నట్లు ధృవీకరించబడింది',
    unconfirmedGrace: 'ధృవీకరించని డోస్ (సమయం ముగిసింది). సరిచేయడానికి నొక్కండి.',
    snoozedTimes: 'స్నూజ్ చేయబడింది',
    times: 'సార్లు',

    // Medical Safety Disclaimer
    medicalSafetyTitle: 'వైద్య భద్రతా నోటీసు:',
    medicalSafetyNotice:
      'స్మార్ట్‌డోస్ వ్యక్తిగత రిమైండర్ సాధనం మాత్రమే. ఇది వైద్య నిర్ధారణ లేదా మోతాదు మార్పులను సిఫార్సు చేయదు. మీ వైద్యుడిని సంప్రదించండి.',

    // Dose Action Sheet
    currentStatus: 'ప్రస్తుత స్థితి:',
    snoozeReminder: 'రిమైండర్ స్నూజ్ చేయండి',
    doesNotMarkTaken: '(తీసుకున్నట్లుగా మారదు)',
    skipDose: 'డోస్ వదిలేయండి...',
    correctRecord: 'రికార్డును సరిచేయండి',
    specifyReasonSkip: 'వదిలేయడానికి కారణాన్ని పేర్కొనండి',
    confirmSkip: 'వదిలేయడాన్ని నిర్ధారించండి',
    retroactiveCorrection: 'గత రికార్డు సవరణ',
    saveCorrection: 'సవరణను సేవ్ చేయండి',
    cancel: 'రద్దు చేయండి',

    // Medicines List & Form
    myPrescriptions: 'నా ప్రిస్క్రిప్షన్లు',
    managePrescriptionsDesc: 'మీ మందులు మరియు షెడ్యూల్‌లను నిర్వహించండి',
    addMedicine: 'మందు జోడించు',
    editMedicine: 'మందు షెడ్యూల్ సవరించండి',
    searchPlaceholder: 'మందు పేరు లేదా డాక్టర్ పేరును వెతకండి...',
    allTypes: 'అన్ని రకాలు',
    medicinePhoto: 'మందు ఫోటో (వృద్ధుల సులభ గుర్తింపు కోసం)',
    photoAttached: 'ఫోటో జతచేయబడింది',
    takePhoto: 'ఫోటో తీయండి',
    fromGallery: 'గ్యాలరీ నుండి అప్‌లోడ్ చేయండి',
    samplePillOrPhoto: 'లేదా నమూనా మాత్ర ఫోటోను ఎంచుకోండి:',
    retake: 'మళ్ళీ తీయండి',
    gallery: 'గ్యాలరీ',
    remove: 'తొలగించండి',
    medName: 'మందు బ్రాండ్ పేరు',
    genericNameOpt: 'జెనెరిక్ పేరు (ఐచ్ఛికం)',
    medicineType: 'మందు రూపం / రకం',
    strength: 'మోతాదు (ఉదా. 500 mg)',
    qtyPerDose: 'ప్రతి మోతాదుకు పరిమాణం',
    unit: 'యూనిట్ (మాత్ర/మి.లీ)',
    mealTiming: 'ఆహార సమయ సూచనలు',
    reminderTimes: 'రిమైండర్ సమయాలు (రోజువారీ)',
    repeatSchedule: 'పునరావృత షెడ్యూల్',
    everyDay: 'ప్రతిరోజూ',
    specificDays: 'నిర్దిష్ట రోజులు',
    everyXDays: 'ప్రతి X రోజులకు ఒకసారి',
    doctorClinic: 'డాక్టర్ / క్లినిక్',
    specialInstructions: 'ప్రత్యేక సూచనలు',
    stockLeft: 'మిగిలిన స్టాక్',
    refillAlert: 'రీఫిల్ హెచ్చరిక పరిమితి',
    scheduleMedicine: 'మందును షెడ్యూల్ చేయండి',
    saveChanges: 'మార్పులను సేవ్ చేయండి',

    // History & Reports
    adherenceHistory: 'అనుసరణ చరిత్ర',
    historyDesc: 'ఖచ్చితమైన ఔషధ వినియోగ రికార్డులు & నివేదికలు',
    exportCSV: 'CSV డౌన్‌లోడ్',
    printable: 'ప్రింటబుల్ షీట్',
    last7Days: 'గత 7 రోజులు',
    last14Days: '14 రోజులు',
    last30Days: '30 రోజులు',
    avgAdherenceRate: 'సగటు అనుసరణ రేటు',
    excellent: 'అద్భుతం',
    moderate: 'మధ్యస్థం',
    needsAttention: 'శ్రద్ధ అవసరం',

    // Caregiver
    caregiverNetwork: 'సంరక్షకుల నెట్‌వర్క్',
    caregiverDesc: 'కుటుంబ సభ్యులు & వైద్య పరిచయాలు',
    addCaregiver: 'సంరక్షకుడిని చేర్చండి',
    escalationNoticeTitle: 'క్లినికల్ ఎస్కలేషన్ ప్రోటోకాల్ నోటీసు',
    escalationNoticeDesc:
      'స్మార్ట్‌డోస్ "ధృవీకరించని డోస్" ను "మందు తీసుకోలేదు" అనే దాని నుండి స్పష్టంగా వేరు చేస్తుంది. ఆందోళనను నివారించడానికి సున్నితమైన సమాచారం పంపబడుతుంది.',
    simulateAlert: 'హెచ్చరికను అనుకరించండి',
    openInWhatsApp: 'WhatsApp లో తెరవండి',

    // Settings
    settingsTitle: 'సెట్టింగ్‌లు & ప్రాధాన్యతలు',
    settingsDesc: 'యాక్సెసిబిలిటీ, రిమైండర్ ఆడియో, భాష & డేటా ఎంపికలు',
    accessibilityDisplay: 'యాక్సెసిబిలిటీ & డిస్‌ప్లే',
    elderlyModeTitle: 'వృద్ధుల అనుకూల హై-కాంట్రాస్ట్ మోడ్',
    elderlyModeDesc:
      'అక్షరాలను 25% పెద్దదిగా చేస్తుంది, బటన్‌లను 56px కి పెంచుతుంది.',
    timeFormat: 'సమయ ప్రదర్శన శైలి',
    interfaceLanguage: 'అనువర్తన భాష (Language)',
    audioReminders: 'ఆడియో & నోటిఫికేషన్ ఇంజిన్',
    chimeTone: 'రిమైండర్ చైమ్ సౌండ్ (Web Audio)',
    testTone: 'సౌండ్ టెస్ట్ చేయండి',
    defaultSnooze: 'డిఫాల్ట్ స్నూజ్ వ్యవధి',
    missedGracePeriod: 'మిస్డ్ డోస్ గ్రేస్ పీరియడ్',
    osNotifications: 'OS నోటిఫికేషన్ అనుమతులు',
    sendTestNotification: 'టెస్ట్ నోటిఫికేషన్ పంపండి',
    resetDemoData: 'హ్యాకథాన్ డెమో డేటాను రీసెట్ చేయండి',
    exportBackup: 'పూర్తి JSON బ్యాకప్ తీసుకోండి',
    restoreBackup: 'JSON బ్యాకప్‌ను పునరుద్ధరించండి',
    wipeAllData: 'మొత్తం డేటాను తొలగించండి (క్లీన్ స్లేట్)',
    viewAPKGuide: 'Android APK గైడ్‌ను చూడండి',

    langEnglish: 'English',
    langKannada: 'ಕನ್ನಡ (Kannada)',
    langTamil: 'தமிழ் (Tamil)',
    langTelugu: 'తెలుగు (Telugu)',
    langHindi: 'हिन्दी (Hindi)',

    // Profile Management
    profile: 'ప్రొఫైల్',
    editProfile: 'ప్రొఫైల్ సవరించండి',
    createProfile: 'కొత్త ప్రొఫైల్ సృష్టించండి',
    switchProfile: 'ప్రొఫైల్ మార్చండి',
    manageProfiles: 'ప్రొఫైల్స్ నిర్వహించండి',
    patientProfile: 'రోగి ప్రొఫైల్',
    patientName: 'పూర్తి పేరు',
    relationship: 'సంబంధం / పాత్ర',
    allergies: 'ఔషధ అలర్జీలు',
    chronicConditions: 'ఆరోగ్య సమస్యలు',
    primaryDoctor: 'ప్రధాన వైద్యులు',
    emergencyContact: 'అత్యవసర పరిచయం',
    saveProfile: 'ప్రొఫైల్ భద్రపరచండి',
    deleteProfile: 'ప్రొఫైల్ తొలగించండి',
    newProfileTitle: 'కొత్త ప్రొఫైల్ సృష్టించండి',
    editProfileTitle: 'ప్రొఫైల్ సవరించండి',
  },

  hi: {
    // App Header & Branding
    appTitle: 'स्मार्टडोज़',
    appSubtitle: 'स्मार्ट दवा रिमाइंडर साथी',
    mobileBadge: 'मोबाइल',
    elderlyMode: 'बुजुर्ग मोड',
    elderlyOn: 'बुजुर्ग मोड: ऑन',
    testDose: 'टेस्ट डोज़',
    hackathonKit: 'हैकाथॉन किट',
    voiceSummary: 'आज की खुराक सुनें',
    hearDose: 'खुराक सुनें',
    switchLanguage: 'भाषा',
    refillTitle: 'रिफिल रिमाइंडर: कम स्टॉक',
    refill30: '+30 रिफिल',
    callPharmacy: 'फ़ार्मेसी को कॉल करें',
    missedDoseSafetyTitle: 'छूटी हुई खुराक नैदानिक सुरक्षा',
    missedDoseSafetyText:
      'छूटी हुई दवा की भरपाई के लिए कभी भी दोहरी या अतिरिक्त खुराक न लें। यदि अगली खुराक का समय नजदीक है, तो छूटी हुई खुराक को छोड़ दें और अपनी सामान्य दिनचर्या जारी रखें। किसी भी संदेह में अपने डॉक्टर या फार्मासिस्ट से संपर्क करें।',

    // Navigation Tabs
    tabToday: 'आज',
    tabMedicines: 'दवाइयाँ',
    tabAddMed: 'जोड़ें',
    tabHistory: 'इतिहास',
    tabCaregiver: 'देखभालकर्ता',
    tabSettings: 'सेटिंग्स',

    // Greetings & Dashboard
    greetingMorning: 'शुभ प्रभात',
    greetingAfternoon: 'शुभ दोपहर',
    greetingEvening: 'शुभ संध्या',
    todaySchedule: 'आज की समय सारिणी',
    adherence: 'अनुपालन',
    taken: 'ले ली',
    pending: 'बाकी है',
    missed: 'छूट गई',
    skipped: 'छोड़ दी',
    dosesTakenSoFar: 'खुराकें अब तक ली जा चुकी हैं।',
    noMedsScheduled: 'इस दिन के लिए कोई दवा निर्धारित नहीं है।',

    // Next Up Hero Card
    nextUpcomingDose: 'अगली दवा का समय',
    dueRightNow: 'अभी लेने का समय!',
    dueAgo: 'पहले',
    dueIn: 'समय बचा:',
    markAsTaken: 'दवा ले ली दर्ज करें',
    markAsTakenNow: 'अभी दवा ले ली दर्ज करें',
    snooze: 'स्नूज़',
    snoozeMinutes: '{min} मिनट स्नूज़',
    takeNow: 'अभी लें',

    // Time blocks
    morning: 'सुबह',
    afternoon: 'दोपहर',
    evening: 'शाम',
    night: 'रात',
    dailyScheduleTimeline: 'दैनिक दवा समय सारिणी',
    totalDoses: 'कुल',
    noDosesScheduled: 'कोई खुराक निर्धारित नहीं',
    noDosesDesc: 'इस तारीख के लिए कोई दवा निर्धारित नहीं है। नई दवा जोड़ें या डेमो डेटा लोड करें।',

    // Meal instructions
    before_meal: 'भोजन से पहले',
    after_meal: 'भोजन के बाद',
    with_meal: 'भोजन के साथ',
    empty_stomach: 'खाली पेट',
    anytime: 'निर्देशानुसार',

    // Status notes
    confirmedTaken: 'दवा लेना दर्ज हो चुका है',
    unconfirmedGrace: 'अपुष्ट खुराक (समय बीत चुका है)। सुधारने के लिए टैप करें।',
    snoozedTimes: 'स्नूज़ किया गया',
    times: 'बार',

    // Medical Safety Disclaimer
    medicalSafetyTitle: 'चिकित्सा सुरक्षा सूचना:',
    medicalSafetyNotice:
      'स्मार्टडोज़ केवल एक व्यक्तिगत रिमाइंडर और ट्रैकिंग टूल है। यह कोई चिकित्सीय निदान या खुराक परिवर्तन की सलाह नहीं देता है। किसी भी बदलाव से पहले अपने डॉक्टर से सलाह लें।',

    // Dose Action Sheet
    currentStatus: 'वर्तमान स्थिति:',
    snoozeReminder: 'रिमाइंडर स्नूज़ करें',
    doesNotMarkTaken: '(यह दवा ली गई दर्ज नहीं करता)',
    skipDose: 'खुराक छोड़ें...',
    correctRecord: 'रिकॉर्ड सुधारें',
    specifyReasonSkip: 'खुराक छोड़ने का कारण बताएं',
    confirmSkip: 'छोड़ना सुनिश्चित करें',
    retroactiveCorrection: 'पिछला रिकॉर्ड सुधारें',
    saveCorrection: 'सुधार सहेजें',
    cancel: 'रद्द करें',

    // Medicines List & Form
    myPrescriptions: 'मेरी दवाइयाँ',
    managePrescriptionsDesc: 'अपनी निर्धारित दवाइयों और समय सारिणी का प्रबंधन करें',
    addMedicine: 'दवा जोड़ें',
    editMedicine: 'दवा समय सारिणी सुधारें',
    searchPlaceholder: 'दवा का नाम या डॉक्टर का नाम खोजें...',
    allTypes: 'सभी प्रकार',
    medicinePhoto: 'दवा की फोटो (बुजुर्गों की पहचान के लिए)',
    photoAttached: 'फोटो संलग्न है',
    takePhoto: 'फोटो खींचें',
    fromGallery: 'गैलरी से अपलोड करें',
    samplePillOrPhoto: 'या गोली की नमूना फोटो चुनें:',
    retake: 'पुनः खींचें',
    gallery: 'गैलरी',
    remove: 'हटाएं',
    medName: 'दवा का ब्रांड नाम',
    genericNameOpt: 'जेनेरिक नाम (वैकल्पिक)',
    medicineType: 'दवा का रूप / प्रकार',
    strength: 'मात्रा (उदा. 500 mg)',
    qtyPerDose: 'प्रति खुराक मात्रा',
    unit: 'इकाई (गोली/मिली)',
    mealTiming: 'भोजन संबंधी निर्देश',
    reminderTimes: 'रिमाइंडर का समय (दैनिक)',
    repeatSchedule: 'दोहराव अनुसूची',
    everyDay: 'हर दिन',
    specificDays: 'विशिष्ट दिन',
    everyXDays: 'हर X दिन में एक बार',
    doctorClinic: 'डॉक्टर / क्लिनिक',
    specialInstructions: 'विशेष सावधानियां / निर्देश',
    stockLeft: 'बची हुई दवाइयाँ (स्टॉक)',
    refillAlert: 'रीफिल चेतावनी सीमा',
    scheduleMedicine: 'दवा शेड्यूल करें',
    saveChanges: 'बदलाव सहेजें',

    // History & Reports
    adherenceHistory: 'अनुपालन इतिहास',
    historyDesc: 'सटीक दवा सेवन रिकॉर्ड और रिपोर्ट',
    exportCSV: 'CSV डाउनलोड',
    printable: 'प्रिंट शीट',
    last7Days: 'पिछले 7 दिन',
    last14Days: '14 दिन',
    last30Days: '30 दिन',
    avgAdherenceRate: 'औसत अनुपालन दर',
    excellent: 'उत्कृष्ट',
    moderate: 'मध्यम',
    needsAttention: 'ध्यान देने की आवश्यकता है',

    // Caregiver
    caregiverNetwork: 'देखभालकर्ता नेटवर्क',
    caregiverDesc: 'परिवार और चिकित्सा संपर्क',
    addCaregiver: 'देखभालकर्ता जोड़ें',
    escalationNoticeTitle: 'सुरक्षा प्रोटोकॉल सूचना',
    escalationNoticeDesc:
      'स्मार्टडोज़ "अपुष्ट खुराक" को "दवा नहीं ली गई" से अलग समझता है ताकि परिजनों में अनावश्यक चिंता न हो।',
    simulateAlert: 'अलर्ट का परीक्षण करें',
    openInWhatsApp: 'WhatsApp में खोलें',

    // Settings
    settingsTitle: 'सेटिंग्स और प्राथमिकताएं',
    settingsDesc: 'अभिगम्यता, रिमाइंडर ध्वनि, भाषा और डेटा विकल्प',
    accessibilityDisplay: 'अभिगम्यता और प्रदर्शन',
    elderlyModeTitle: 'बुजुर्गों के अनुकूल हाई-कंट्रास्ट मोड',
    elderlyModeDesc:
      'अक्षरों को 25% बड़ा करता है, बटनों को 56px तक बढ़ाता है और स्पष्ट कंट्रास्ट देता है।',
    timeFormat: 'समय प्रदर्शन प्रारूप',
    interfaceLanguage: 'ऐप की भाषा (Language)',
    audioReminders: 'ध्वनि और रिमाइंडर इंजन',
    chimeTone: 'रिमाइंडर बेल टोन (Web Audio)',
    testTone: 'ध्वनि का परीक्षण करें',
    defaultSnooze: 'डिफ़ॉल्ट स्नूज़ अंतराल',
    missedGracePeriod: 'छूटी खुराक अनुग्रह अवधि',
    osNotifications: 'सिस्टम नोटिफिकेशन अनुमति',
    sendTestNotification: 'टेस्ट नोटिफिकेशन भेजें',
    resetDemoData: 'हैकाथॉन डेमो डेटा रीसेट करें',
    exportBackup: 'पूर्ण JSON बैकअप डाउनलोड करें',
    restoreBackup: 'JSON बैकअप से पुनर्स्थापित करें',
    wipeAllData: 'सभी डेटा मिटाएं (क्लीन स्लेट)',
    viewAPKGuide: 'Android APK गाइड देखें',

    langEnglish: 'English',
    langKannada: 'ಕನ್ನಡ (Kannada)',
    langTamil: 'தமிழ் (Tamil)',
    langTelugu: 'తెలుగు (Telugu)',
    langHindi: 'हिन्दी (Hindi)',

    // Profile Management
    profile: 'प्रोफ़ाइल',
    editProfile: 'प्रोफ़ाइल संपादित करें',
    createProfile: 'नया प्रोफ़ाइल जोड़ें',
    switchProfile: 'प्रोफ़ाइल बदलें',
    manageProfiles: 'प्रोफ़ाइल प्रबंधित करें',
    patientProfile: 'मरीज प्रोफ़ाइल',
    patientName: 'पूरा नाम',
    relationship: 'रिश्ता / भूमिका',
    allergies: 'दवा एलर्जी',
    chronicConditions: 'स्वास्थ्य स्थितियां',
    primaryDoctor: 'प्राथमिक चिकित्सक',
    emergencyContact: 'आपातकालीन संपर्क',
    saveProfile: 'प्रोफ़ाइल सहेजें',
    deleteProfile: 'प्रोफ़ाइल हटाएं',
    newProfileTitle: 'नया प्रोफ़ाइल बनाएं',
    editProfileTitle: 'प्रोफ़ाइल संपादित करें',
  },
};

/**
 * Helper to fetch a translated string with optional interpolation fallback.
 */
export function getTranslation(lang: string | undefined, key: string, params?: Record<string, string | number>): string {
  const code: SupportedLanguage = (lang && lang in TRANSLATIONS) ? (lang as SupportedLanguage) : 'en';
  let str = TRANSLATIONS[code]?.[key] || TRANSLATIONS.en[key] || key;

  if (params) {
    Object.entries(params).forEach(([k, val]) => {
      str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(val));
    });
  }

  return str;
}

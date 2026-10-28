import React, { useState, useRef } from 'react';
import {
  X,
  User,
  Camera,
  Upload,
  Heart,
  AlertTriangle,
  Phone,
  Shield,
  Eye,
  Check,
  Trash2,
  Plus,
  Stethoscope,
  Globe,
  Sparkles,
} from 'lucide-react';
import { AppLanguage, FontSizeScale, UserProfile } from '../types';
import { compressAndResizeImage } from '../utils/imageUtils';
import { SUPPORTED_LANGUAGES, getTranslation } from '../utils/translations';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profileData: Partial<UserProfile>, isNew: boolean) => void;
  onDelete?: (profileId: string) => void;
  mode: 'create' | 'edit';
  initialProfile?: UserProfile | null;
  totalProfilesCount: number;
  currentLanguage: AppLanguage;
}

const RELATIONSHIP_OPTIONS = [
  'Self',
  'Mother',
  'Father',
  'Spouse',
  'Child',
  'Grandparent',
  'Patient',
  'Other',
];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];

const COMMON_ALLERGIES = [
  'Penicillin',
  'Sulfa drugs',
  'Aspirin',
  'NSAIDs',
  'Latex',
  'Peanuts',
  'Shellfish',
  'Codeine',
];

const COMMON_CONDITIONS = [
  'Hypertension',
  'Type 2 Diabetes',
  'High Cholesterol',
  'Osteoarthritis',
  'Asthma',
  'Heart Disease',
  'Thyroid',
  'Kidney Disease',
];

const AVATAR_PRESETS = [
  { id: 'avatar_senior_w', label: 'Senior Woman', bg: 'bg-rose-100 text-rose-700 border-rose-300' },
  { id: 'avatar_senior_m', label: 'Senior Man', bg: 'bg-sky-100 text-sky-700 border-sky-300' },
  { id: 'avatar_adult_w', label: 'Adult Woman', bg: 'bg-teal-100 text-teal-700 border-teal-300' },
  { id: 'avatar_adult_m', label: 'Adult Man', bg: 'bg-indigo-100 text-indigo-700 border-indigo-300' },
  { id: 'avatar_child', label: 'Child / Youth', bg: 'bg-amber-100 text-amber-700 border-amber-300' },
  { id: 'avatar_neutral', label: 'Neutral', bg: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  mode,
  initialProfile,
  totalProfilesCount,
  currentLanguage,
}) => {
  const isCreate = mode === 'create';

  // Form State
  const [name, setName] = useState(initialProfile?.name || '');
  const [relationship, setRelationship] = useState(initialProfile?.relationship || (isCreate ? 'Self' : 'Patient'));
  const [age, setAge] = useState<string>(initialProfile?.age ? String(initialProfile.age) : '');
  const [gender, setGender] = useState(initialProfile?.gender || 'Female');
  const [bloodGroup, setBloodGroup] = useState(initialProfile?.bloodGroup || 'O+');
  const [avatarUrl, setAvatarUrl] = useState<string>(initialProfile?.avatarUrl || '');
  const [selectedPreset, setSelectedPreset] = useState<string>(
    initialProfile?.avatarUrl ? '' : 'avatar_senior_w'
  );

  // Allergies & Conditions tags
  const [allergies, setAllergies] = useState<string[]>(initialProfile?.allergies || []);
  const [allergyInput, setAllergyInput] = useState('');
  const [chronicConditions, setChronicConditions] = useState<string[]>(
    initialProfile?.chronicConditions || []
  );
  const [conditionInput, setConditionInput] = useState('');

  // Contacts
  const [emergencyContactName, setEmergencyContactName] = useState(
    initialProfile?.emergencyContactName || ''
  );
  const [emergencyContactRelationship, setEmergencyContactRelationship] = useState(
    initialProfile?.emergencyContactRelationship || ''
  );
  const [emergencyContactPhone, setEmergencyContactPhone] = useState(
    initialProfile?.emergencyContactPhone || ''
  );
  const [primaryDoctorName, setPrimaryDoctorName] = useState(
    initialProfile?.primaryDoctorName || ''
  );
  const [primaryDoctorPhone, setPrimaryDoctorPhone] = useState(
    initialProfile?.primaryDoctorPhone || ''
  );
  const [defaultPharmacyName, setDefaultPharmacyName] = useState(
    initialProfile?.defaultPharmacyName || ''
  );
  const [defaultPharmacyPhone, setDefaultPharmacyPhone] = useState(
    initialProfile?.defaultPharmacyPhone || ''
  );

  // Accessibility & Preferences
  const [preferredLanguage, setPreferredLanguage] = useState<AppLanguage>(
    initialProfile?.preferredLanguage || currentLanguage
  );
  const [elderlyMode, setElderlyMode] = useState<boolean>(
    initialProfile?.elderlyMode !== undefined ? initialProfile.elderlyMode : true
  );
  const [fontSizeScale, setFontSizeScale] = useState<FontSizeScale>(
    initialProfile?.fontSizeScale || 'large'
  );

  // Validation & UI State
  const [nameError, setNameError] = useState('');
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle Photo File Upload
  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessingPhoto(true);
      const compressedDataUrl = await compressAndResizeImage(file, 400, 400, 0.85);
      setAvatarUrl(compressedDataUrl);
      setSelectedPreset('');
    } catch (err) {
      console.error('Failed to process photo:', err);
    } finally {
      setIsProcessingPhoto(false);
    }
  };

  // Add Allergy tag
  const handleAddAllergy = (tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed) return;
    if (!allergies.includes(trimmed)) {
      setAllergies([...allergies, trimmed]);
    }
    setAllergyInput('');
  };

  const handleRemoveAllergy = (tag: string) => {
    setAllergies(allergies.filter((a) => a !== tag));
  };

  // Add Condition tag
  const handleAddCondition = (tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed) return;
    if (!chronicConditions.includes(trimmed)) {
      setChronicConditions([...chronicConditions, trimmed]);
    }
    setConditionInput('');
  };

  const handleRemoveCondition = (tag: string) => {
    setChronicConditions(chronicConditions.filter((c) => c !== tag));
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setNameError('Please enter a name for this profile');
      return;
    }

    const payload: Partial<UserProfile> = {
      name: name.trim(),
      relationship,
      age: age ? parseInt(age, 10) : undefined,
      gender,
      bloodGroup,
      avatarUrl: avatarUrl || undefined,
      allergies,
      chronicConditions,
      emergencyContactName: emergencyContactName.trim() || undefined,
      emergencyContactRelationship: emergencyContactRelationship.trim() || undefined,
      emergencyContactPhone: emergencyContactPhone.trim() || undefined,
      primaryDoctorName: primaryDoctorName.trim() || undefined,
      primaryDoctorPhone: primaryDoctorPhone.trim() || undefined,
      defaultPharmacyName: defaultPharmacyName.trim() || undefined,
      defaultPharmacyPhone: defaultPharmacyPhone.trim() || undefined,
      preferredLanguage,
      elderlyMode,
      fontSizeScale,
    };

    onSave(payload, isCreate);
    onClose();
  };

  // Pre-fill family role preset
  const handleSelectRelationship = (rel: string) => {
    setRelationship(rel);
    if (rel === 'Mother' || rel === 'Grandparent') {
      setElderlyMode(true);
      setFontSizeScale('large');
      if (!avatarUrl) setSelectedPreset('avatar_senior_w');
    } else if (rel === 'Father') {
      setElderlyMode(true);
      setFontSizeScale('large');
      if (!avatarUrl) setSelectedPreset('avatar_senior_m');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-sky-600 to-teal-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-sm border border-white/20">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-lg text-white leading-tight">
                {isCreate
                  ? getTranslation(currentLanguage, 'newProfileTitle') || 'Create Patient Profile'
                  : getTranslation(currentLanguage, 'editProfileTitle') || 'Edit Patient Profile'}
              </h2>
              <p className="text-xs text-sky-100 font-medium">
                {isCreate
                  ? 'Add a profile for an elderly parent, spouse, child, or yourself'
                  : `Managing medical profile for ${initialProfile?.name || 'Patient'}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* 1. Avatar & Photo Upload Section */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Profile Photo & Avatar
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Photo Display / Preview */}
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-200 border-2 border-slate-300 shadow-sm flex items-center justify-center">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-sky-500 to-teal-500 flex items-center justify-center text-white">
                      <span className="text-2xl font-black">
                        {name ? name.charAt(0).toUpperCase() : <User className="w-9 h-9" />}
                      </span>
                    </div>
                  )}
                </div>

                {avatarUrl && (
                  <button
                    type="button"
                    onClick={() => setAvatarUrl('')}
                    title="Remove photo"
                    className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md hover:bg-rose-600 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Upload Controls */}
              <div className="flex-1 space-y-2 text-center sm:text-left">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessingPhoto}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-sky-600 text-white hover:bg-sky-700 shadow-sm transition active:scale-95 disabled:opacity-50"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{avatarUrl ? 'Change Photo' : 'Take / Upload Photo'}</span>
                  </button>
                  {isProcessingPhoto && (
                    <span className="text-xs text-slate-500 font-medium animate-pulse">
                      Processing...
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  Upload a clear portrait to easily distinguish medications and reminders.
                </p>
              </div>
            </div>
          </div>

          {/* 2. Personal Information */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
              <User className="w-3.5 h-3.5 text-sky-600" />
              Personal Information
            </h3>

            {/* Name */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (nameError) setNameError('');
                }}
                placeholder="e.g. Eleanor Vance or John Doe"
                className={`w-full p-3 rounded-xl border text-sm sm:text-base font-medium transition focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                  nameError ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300 bg-white'
                }`}
              />
              {nameError && (
                <p className="text-xs text-rose-600 font-bold mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {nameError}
                </p>
              )}
            </div>

            {/* Relationship / Role Chips */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Who is this profile for?
              </label>
              <div className="flex flex-wrap gap-1.5">
                {RELATIONSHIP_OPTIONS.map((opt) => {
                  const isSelected = relationship === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleSelectRelationship(opt)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        isSelected
                          ? 'bg-sky-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Age, Gender, Blood Group */}
            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Age</label>
                <input
                  type="number"
                  min="0"
                  max="125"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 72"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-medium bg-white"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Blood Group</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-bold bg-white text-slate-800"
                >
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 3. Known Allergies & Chronic Conditions */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              Known Drug Allergies & Health Conditions
            </h3>

            {/* Allergies Tag List */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Drug Allergies
              </label>

              {/* Tag Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={allergyInput}
                  onChange={(e) => setAllergyInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddAllergy(allergyInput);
                    }
                  }}
                  placeholder="e.g. Penicillin, Sulfa, Aspirin"
                  className="flex-1 p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium"
                />
                <button
                  type="button"
                  onClick={() => handleAddAllergy(allergyInput)}
                  className="px-3.5 py-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-300 text-xs font-bold hover:bg-amber-100 transition"
                >
                  <Plus className="w-4 h-4 inline mr-0.5" />
                  Add
                </button>
              </div>

              {/* Current Allergy Chips */}
              {allergies.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {allergies.map((allg) => (
                    <span
                      key={allg}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold"
                    >
                      {allg}
                      <button
                        type="button"
                        onClick={() => handleRemoveAllergy(allg)}
                        className="hover:text-rose-950"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Suggested quick allergies */}
              <div className="flex flex-wrap items-center gap-1 text-[11px] text-slate-500">
                <span className="font-semibold">Quick add:</span>
                {COMMON_ALLERGIES.slice(0, 5).map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => handleAddAllergy(sug)}
                    className="px-1.5 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                  >
                    +{sug}
                  </button>
                ))}
              </div>
            </div>

            {/* Chronic Conditions */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700">
                Chronic / Existing Health Conditions
              </label>

              {/* Tag Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={conditionInput}
                  onChange={(e) => setConditionInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCondition(conditionInput);
                    }
                  }}
                  placeholder="e.g. Hypertension, Type 2 Diabetes"
                  className="flex-1 p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium"
                />
                <button
                  type="button"
                  onClick={() => handleAddCondition(conditionInput)}
                  className="px-3.5 py-2 rounded-xl bg-teal-50 text-teal-800 border border-teal-300 text-xs font-bold hover:bg-teal-100 transition"
                >
                  <Plus className="w-4 h-4 inline mr-0.5" />
                  Add
                </button>
              </div>

              {/* Current Condition Chips */}
              {chronicConditions.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {chronicConditions.map((cond) => (
                    <span
                      key={cond}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold"
                    >
                      {cond}
                      <button
                        type="button"
                        onClick={() => handleRemoveCondition(cond)}
                        className="hover:text-teal-950"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Suggested quick conditions */}
              <div className="flex flex-wrap items-center gap-1 text-[11px] text-slate-500">
                <span className="font-semibold">Quick add:</span>
                {COMMON_CONDITIONS.slice(0, 5).map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => handleAddCondition(sug)}
                    className="px-1.5 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                  >
                    +{sug}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Emergency & Medical Contacts */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              Emergency & Doctor Contacts
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Emergency Contact Name
                </label>
                <input
                  type="text"
                  value={emergencyContactName}
                  onChange={(e) => setEmergencyContactName(e.target.value)}
                  placeholder="e.g. Sarah Vance"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Contact Phone Number
                </label>
                <input
                  type="tel"
                  value={emergencyContactPhone}
                  onChange={(e) => setEmergencyContactPhone(e.target.value)}
                  placeholder="e.g. +1 (555) 234-5678"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Primary Doctor Name
                </label>
                <input
                  type="text"
                  value={primaryDoctorName}
                  onChange={(e) => setPrimaryDoctorName(e.target.value)}
                  placeholder="e.g. Dr. Robert Miller"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Doctor Clinic Phone
                </label>
                <input
                  type="tel"
                  value={primaryDoctorPhone}
                  onChange={(e) => setPrimaryDoctorPhone(e.target.value)}
                  placeholder="e.g. +1 (555) 890-1234"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Preferred Pharmacy
                </label>
                <input
                  type="text"
                  value={defaultPharmacyName}
                  onChange={(e) => setDefaultPharmacyName(e.target.value)}
                  placeholder="e.g. Corner Health Pharmacy"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pharmacy Phone
                </label>
                <input
                  type="tel"
                  value={defaultPharmacyPhone}
                  onChange={(e) => setDefaultPharmacyPhone(e.target.value)}
                  placeholder="e.g. +1 (555) 345-6789"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium"
                />
              </div>
            </div>
          </div>

          {/* 5. Language & Senior Accessibility */}
          <div className="space-y-3.5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-sky-600" />
              Language & Accessibility Preferences
            </h3>

            {/* Language Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Default Language for Reminders & Voice
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SUPPORTED_LANGUAGES.map((lang) => {
                  const isSelected = preferredLanguage === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setPreferredLanguage(lang.code as AppLanguage)}
                      className={`p-2 rounded-xl text-center border transition ${
                        isSelected
                          ? 'border-sky-600 bg-sky-50 text-sky-900 font-extrabold shadow-sm'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100 font-medium'
                      }`}
                    >
                      <div className="text-xs font-bold">{lang.nativeName}</div>
                      <div className="text-[10px] text-slate-500">{lang.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Senior Mode Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
              <div>
                <span className="font-bold text-slate-800 text-xs sm:text-sm block">
                  Senior-Friendly High Contrast & Large Touch Targets
                </span>
                <span className="text-xs text-slate-500">
                  Enlarges buttons to 56px+ and simplifies instructions
                </span>
              </div>
              <input
                type="checkbox"
                checked={elderlyMode}
                onChange={(e) => setElderlyMode(e.target.checked)}
                className="w-5 h-5 rounded text-sky-600 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Delete Option (for edit mode when >1 profiles exist) */}
          {!isCreate && totalProfilesCount > 1 && onDelete && initialProfile?.id && (
            <div className="pt-2 border-t border-slate-100">
              {!showDeleteConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 p-2 rounded-xl hover:bg-rose-50 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete this profile
                </button>
              ) : (
                <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 space-y-2">
                  <p className="text-xs font-bold text-rose-900">
                    Are you sure you want to delete profile for "{initialProfile.name}"?
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onDelete(initialProfile.id);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-sm transition"
                    >
                      Yes, Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl border border-slate-300 text-slate-700 text-xs sm:text-sm font-bold hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-sky-600 to-teal-600 text-white text-xs sm:text-sm font-extrabold shadow-md shadow-sky-600/20 hover:from-sky-700 hover:to-teal-700 active:scale-95 transition"
            >
              {isCreate ? 'Create Profile' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

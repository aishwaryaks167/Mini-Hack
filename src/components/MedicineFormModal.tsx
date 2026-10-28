import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Pill,
  Clock,
  Plus,
  Trash2,
  Calendar,
  Utensils,
  AlertCircle,
  Check,
  ShieldCheck,
  Sparkles,
  Camera,
  Image as ImageIcon,
  Upload,
  RotateCcw,
} from 'lucide-react';
import { FrequencyType, MealTiming, Medicine, MedicineType } from '../types';
import { formatDateKey } from '../utils/storage';
import { compressAndResizeImage, SAMPLE_MEDICINE_PHOTOS } from '../utils/imageUtils';

interface MedicineFormModalProps {
  isOpen: boolean;
  editingMedicine: Medicine | null;
  onClose: () => void;
  onSave: (medicine: Omit<Medicine, 'id' | 'createdAt' | 'updatedAt'>, existingId?: string) => void;
}

const MEDICINE_TYPES: { type: MedicineType; label: string }[] = [
  { type: 'tablet', label: 'Tablet' },
  { type: 'capsule', label: 'Capsule' },
  { type: 'syrup', label: 'Syrup' },
  { type: 'drops', label: 'Eye/Ear Drops' },
  { type: 'inhaler', label: 'Inhaler' },
  { type: 'injection', label: 'Injection' },
  { type: 'patch', label: 'Skin Patch' },
  { type: 'topical', label: 'Cream / Gel' },
  { type: 'other', label: 'Other' },
];

const MEAL_OPTIONS: { value: MealTiming; label: string }[] = [
  { value: 'after_meal', label: 'After Food' },
  { value: 'before_meal', label: 'Before Food' },
  { value: 'with_meal', label: 'With Food' },
  { value: 'empty_stomach', label: 'Empty Stomach' },
  { value: 'anytime', label: 'Anytime / As prescribed' },
];

const COLOR_PALETTE = [
  '#0284c7', // Sky Blue
  '#0d9488', // Teal
  '#10b981', // Emerald
  '#7c3aed', // Purple
  '#e11d48', // Rose
  '#f59e0b', // Amber
  '#4f46e5', // Indigo
];

const DAYS_OF_WEEK = [
  { day: 0, label: 'Sun' },
  { day: 1, label: 'Mon' },
  { day: 2, label: 'Tue' },
  { day: 3, label: 'Wed' },
  { day: 4, label: 'Thu' },
  { day: 5, label: 'Fri' },
  { day: 6, label: 'Sat' },
];

export const MedicineFormModal: React.FC<MedicineFormModalProps> = ({
  isOpen,
  editingMedicine,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [type, setType] = useState<MedicineType>('tablet');
  const [strength, setStrength] = useState('');
  const [quantityPerDose, setQuantityPerDose] = useState(1);
  const [unit, setUnit] = useState('tablet');
  const [instructions, setInstructions] = useState('');
  const [mealTiming, setMealTiming] = useState<MealTiming>('after_meal');
  const [startDate, setStartDate] = useState(formatDateKey());
  const [endDate, setEndDate] = useState('');
  const [isOngoing, setIsOngoing] = useState(true);
  const [reminderTimes, setReminderTimes] = useState<string[]>(['08:00']);
  const [frequency, setFrequency] = useState<FrequencyType>('daily');
  const [specificDays, setSpecificDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [intervalDays, setIntervalDays] = useState(1);
  const [color, setColor] = useState(COLOR_PALETTE[0]);
  const [currentStock, setCurrentStock] = useState(30);
  const [lowStockThreshold, setLowStockThreshold] = useState(5);
  const [prescribingDoctor, setPrescribingDoctor] = useState('');
  const [doctorPhone, setDoctorPhone] = useState('');
  const [pharmacyName, setPharmacyName] = useState('');
  const [pharmacyPhone, setPharmacyPhone] = useState('');
  const [rxNumber, setRxNumber] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingMedicine) {
      setName(editingMedicine.name);
      setGenericName(editingMedicine.genericName || '');
      setType(editingMedicine.type);
      setStrength(editingMedicine.strength);
      setQuantityPerDose(editingMedicine.quantityPerDose || 1);
      setUnit(editingMedicine.unit || 'tablet');
      setInstructions(editingMedicine.instructions || '');
      setMealTiming(editingMedicine.mealTiming);
      setStartDate(editingMedicine.startDate);
      setEndDate(editingMedicine.endDate || '');
      setIsOngoing(editingMedicine.isOngoing);
      setReminderTimes(editingMedicine.reminderTimes || ['08:00']);
      setFrequency(editingMedicine.frequency);
      setSpecificDays(editingMedicine.specificDays || [1, 2, 3, 4, 5]);
      setIntervalDays(editingMedicine.intervalDays || 1);
      setColor(editingMedicine.color || COLOR_PALETTE[0]);
      setImageUrl(editingMedicine.imageUrl);
      setCurrentStock(editingMedicine.currentStock ?? 30);
      setLowStockThreshold(editingMedicine.lowStockThreshold ?? 5);
      setPrescribingDoctor(editingMedicine.prescribingDoctor || '');
      setDoctorPhone(editingMedicine.doctorPhone || '');
      setPharmacyName(editingMedicine.pharmacyName || '');
      setPharmacyPhone(editingMedicine.pharmacyPhone || '');
      setRxNumber(editingMedicine.rxNumber || '');
    } else {
      // Default clean state
      setName('');
      setGenericName('');
      setType('tablet');
      setStrength('');
      setQuantityPerDose(1);
      setUnit('tablet');
      setInstructions('');
      setMealTiming('after_meal');
      setStartDate(formatDateKey());
      setEndDate('');
      setIsOngoing(true);
      setReminderTimes(['08:00']);
      setFrequency('daily');
      setSpecificDays([1, 2, 3, 4, 5]);
      setIntervalDays(1);
      setColor(COLOR_PALETTE[0]);
      setImageUrl(undefined);
      setCurrentStock(30);
      setLowStockThreshold(5);
      setPrescribingDoctor('');
      setDoctorPhone('');
      setPharmacyName('');
      setPharmacyPhone('');
      setRxNumber('');
    }
    setErrors({});
  }, [editingMedicine, isOpen]);

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsProcessingImage(true);
      const compressed = await compressAndResizeImage(file);
      setImageUrl(compressed);
    } catch (err) {
      console.error('Image compression failed:', err);
      alert('Could not process this image. Please try another photo.');
    } finally {
      setIsProcessingImage(false);
      e.target.value = '';
    }
  };

  // Adjust default unit when type changes
  const handleTypeChange = (newType: MedicineType) => {
    setType(newType);
    if (newType === 'syrup') setUnit('ml');
    else if (newType === 'drops') setUnit('drops');
    else if (newType === 'inhaler') setUnit('puffs');
    else if (newType === 'capsule') setUnit('capsule');
    else if (newType === 'tablet') setUnit('tablet');
    else setUnit('unit');
  };

  const handleAddTime = () => {
    if (reminderTimes.length >= 6) return;
    setReminderTimes([...reminderTimes, '12:00']);
  };

  const handleRemoveTime = (index: number) => {
    if (reminderTimes.length <= 1) return;
    setReminderTimes(reminderTimes.filter((_, i) => i !== index));
  };

  const handleTimeChange = (index: number, val: string) => {
    const updated = [...reminderTimes];
    updated[index] = val;
    setReminderTimes(updated);
  };

  const applySchedulePreset = (times: string[]) => {
    setReminderTimes(times);
  };

  const toggleDay = (day: number) => {
    if (specificDays.includes(day)) {
      if (specificDays.length <= 1) return; // Keep at least one
      setSpecificDays(specificDays.filter((d) => d !== day));
    } else {
      setSpecificDays([...specificDays, day].sort());
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = 'Medicine name is required.';
    if (!strength.trim()) newErrors.strength = 'Dosage strength is required (e.g. 500 mg, 10 ml).';
    if (quantityPerDose <= 0) newErrors.quantity = 'Quantity per dose must be at least 1.';
    if (reminderTimes.length === 0) newErrors.times = 'At least one reminder time is required.';
    if (!startDate) newErrors.startDate = 'Start date is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave(
      {
        name: name.trim(),
        genericName: genericName.trim() || undefined,
        type,
        strength: strength.trim(),
        quantityPerDose: Number(quantityPerDose),
        unit: unit.trim(),
        instructions: instructions.trim(),
        mealTiming,
        startDate,
        endDate: isOngoing ? null : endDate || null,
        isOngoing,
        reminderTimes: Array.from(new Set(reminderTimes)).sort(),
        frequency,
        specificDays: frequency === 'specific_days' ? specificDays : undefined,
        intervalDays: frequency === 'interval' ? intervalDays : undefined,
        color,
        imageUrl: imageUrl || undefined,
        currentStock: Number(currentStock),
        lowStockThreshold: Number(lowStockThreshold),
        prescribingDoctor: prescribingDoctor.trim() || undefined,
        doctorPhone: doctorPhone.trim() || undefined,
        pharmacyName: pharmacyName.trim() || undefined,
        pharmacyPhone: pharmacyPhone.trim() || undefined,
        rxNumber: rxNumber.trim() || undefined,
      },
      editingMedicine?.id
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-600 to-teal-600 p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Pill className="w-6 h-6 -rotate-45" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-lg sm:text-xl leading-tight">
                {editingMedicine ? 'Edit Medicine Schedule' : 'Add New Medicine'}
              </h3>
              <p className="text-xs text-sky-100 font-medium">
                Set accurate prescribed dose and reminder times
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

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* Medicine Name & Generic */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-800">
              Medicine Brand Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Metformin, Lisinopril, Lipitor"
              className={`w-full p-2.5 rounded-xl border font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                errors.name ? 'border-rose-400 bg-rose-50' : 'border-slate-200'
              }`}
            />
            {errors.name && <p className="text-rose-600 text-xs">{errors.name}</p>}
          </div>

          {/* Medicine Photo / Camera Capture Section */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-sky-600" />
                Medicine Photo (Visual Aid for Seniors)
              </label>
              {imageUrl && (
                <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Photo Attached
                </span>
              )}
            </div>

            {/* Hidden native file inputs */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageFile}
              className="hidden"
            />
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageFile}
              className="hidden"
            />

            {/* Photo preview if available */}
            {imageUrl ? (
              <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0 shadow-sm">
                  <img
                    src={imageUrl}
                    alt="Medicine Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="text-xs font-bold text-slate-800">
                    Custom Pill/Bottle Photo
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Shown during alerts and dashboard timeline for easy identification.
                  </p>
                  <div className="flex items-center gap-2 pt-0.5">
                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      Retake
                    </button>
                    <span className="text-slate-300">•</span>
                    <button
                      type="button"
                      onClick={() => galleryInputRef.current?.click()}
                      className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Gallery
                    </button>
                    <span className="text-slate-300">•</span>
                    <button
                      type="button"
                      onClick={() => setImageUrl(undefined)}
                      className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    disabled={isProcessingImage}
                    className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200 hover:border-sky-500 hover:bg-sky-50 text-slate-700 font-bold text-xs transition shadow-sm"
                  >
                    <Camera className="w-4 h-4 text-sky-600" />
                    <span>Take Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    disabled={isProcessingImage}
                    className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200 hover:border-sky-500 hover:bg-sky-50 text-slate-700 font-bold text-xs transition shadow-sm"
                  >
                    <Upload className="w-4 h-4 text-teal-600" />
                    <span>From Gallery</span>
                  </button>
                </div>

                {/* Quick Presets for Instant Demo Testing */}
                <div className="pt-1">
                  <div className="text-[11px] font-semibold text-slate-500 mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    Or choose a realistic pill sample:
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {SAMPLE_MEDICINE_PHOTOS.map((sample) => (
                      <button
                        key={sample.id}
                        type="button"
                        onClick={() => setImageUrl(sample.dataUrl)}
                        className="p-1.5 rounded-lg border border-slate-200 bg-white hover:border-sky-400 hover:bg-sky-50 transition flex flex-col items-center gap-1"
                        title={sample.label}
                      >
                        <img
                          src={sample.dataUrl}
                          alt={sample.label}
                          className="w-8 h-8 rounded-md object-contain"
                        />
                        <span className="text-[9px] font-medium text-slate-600 truncate w-full text-center">
                          {sample.label.split(' ')[0]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Generic Name (Optional)
              </label>
              <input
                type="text"
                value={genericName}
                onChange={(e) => setGenericName(e.target.value)}
                placeholder="e.g. Metformin Hydrochloride"
                className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Medicine Form / Type
              </label>
              <select
                value={type}
                onChange={(e) => handleTypeChange(e.target.value as MedicineType)}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
              >
                {MEDICINE_TYPES.map((t) => (
                  <option key={t.type} value={t.type}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dosage & Unit */}
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-1">
              <label className="block font-bold text-slate-800 mb-1">
                Strength <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={strength}
                onChange={(e) => setStrength(e.target.value)}
                placeholder="500 mg"
                className={`w-full p-2.5 rounded-xl border font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                  errors.strength ? 'border-rose-400 bg-rose-50' : 'border-slate-200'
                }`}
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Qty / Dose
              </label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={quantityPerDose}
                onChange={(e) => setQuantityPerDose(parseFloat(e.target.value) || 1)}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Unit
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="tablet"
                className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>
          {errors.strength && <p className="text-rose-600 text-xs">{errors.strength}</p>}

          {/* Meal Instructions */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Meal Timing Instructions
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {MEAL_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setMealTiming(opt.value)}
                  className={`p-2 rounded-xl text-xs font-semibold border transition text-center ${
                    mealTiming === opt.value
                      ? 'bg-sky-50 border-sky-600 text-sky-800 shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reminder Times Engine */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-sky-600" />
                Reminder Times (Daily)
              </label>
              <button
                type="button"
                onClick={handleAddTime}
                className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Time
              </button>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-1.5 pb-1">
              <button
                type="button"
                onClick={() => applySchedulePreset(['08:00'])}
                className="px-2 py-1 rounded-lg text-[11px] font-semibold bg-white border border-slate-200 text-slate-600 hover:bg-sky-50"
              >
                Once (8 AM)
              </button>
              <button
                type="button"
                onClick={() => applySchedulePreset(['08:00', '20:00'])}
                className="px-2 py-1 rounded-lg text-[11px] font-semibold bg-white border border-slate-200 text-slate-600 hover:bg-sky-50"
              >
                Twice (8 AM, 8 PM)
              </button>
              <button
                type="button"
                onClick={() => applySchedulePreset(['08:00', '14:00', '20:00'])}
                className="px-2 py-1 rounded-lg text-[11px] font-semibold bg-white border border-slate-200 text-slate-600 hover:bg-sky-50"
              >
                Thrice (8 AM, 2 PM, 8 PM)
              </button>
            </div>

            {/* Time inputs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {reminderTimes.map((time, idx) => (
                <div key={idx} className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => handleTimeChange(idx, e.target.value)}
                    className="w-full text-xs font-bold p-1 bg-transparent focus:outline-none text-slate-800"
                  />
                  {reminderTimes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTime(idx)}
                      className="text-slate-400 hover:text-rose-500 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {errors.times && <p className="text-rose-600 text-xs">{errors.times}</p>}
          </div>

          {/* Repeat Frequency */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Repeat Schedule
            </label>
            <div className="grid grid-cols-3 gap-1.5 mb-2">
              <button
                type="button"
                onClick={() => setFrequency('daily')}
                className={`p-2 rounded-xl text-xs font-semibold border transition text-center ${
                  frequency === 'daily'
                    ? 'bg-sky-600 text-white font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Every Day
              </button>
              <button
                type="button"
                onClick={() => setFrequency('specific_days')}
                className={`p-2 rounded-xl text-xs font-semibold border transition text-center ${
                  frequency === 'specific_days'
                    ? 'bg-sky-600 text-white font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Specific Days
              </button>
              <button
                type="button"
                onClick={() => setFrequency('interval')}
                className={`p-2 rounded-xl text-xs font-semibold border transition text-center ${
                  frequency === 'interval'
                    ? 'bg-sky-600 text-white font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Every X Days
              </button>
            </div>

            {frequency === 'specific_days' && (
              <div className="flex justify-between gap-1 pt-1">
                {DAYS_OF_WEEK.map((d) => (
                  <button
                    type="button"
                    key={d.day}
                    onClick={() => toggleDay(d.day)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                      specificDays.includes(d.day)
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            )}

            {frequency === 'interval' && (
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs text-slate-600">Repeat every</span>
                <input
                  type="number"
                  min="2"
                  max="30"
                  value={intervalDays}
                  onChange={(e) => setIntervalDays(parseInt(e.target.value, 10) || 2)}
                  className="w-16 p-2 rounded-xl border border-slate-200 text-center font-bold"
                />
                <span className="text-xs text-slate-600">days</span>
              </div>
            )}
          </div>

          {/* Color Identification Badge */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Visual Color Marker (Elderly-Friendly Identification)
            </label>
            <div className="flex items-center gap-2">
              {COLOR_PALETTE.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    color === c ? 'ring-2 ring-offset-2 ring-slate-800 scale-110' : 'opacity-85'
                  }`}
                  style={{ backgroundColor: c }}
                >
                  {color === c && <Check className="w-4 h-4 text-white stroke-[3]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Stock Tracking */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Current Stock Left
              </label>
              <input
                type="number"
                min="0"
                value={currentStock}
                onChange={(e) => setCurrentStock(parseInt(e.target.value, 10) || 0)}
                className="w-full p-2 rounded-xl border border-slate-200 bg-white font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Refill Alert When Below
              </label>
              <input
                type="number"
                min="1"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(parseInt(e.target.value, 10) || 5)}
                className="w-full p-2 rounded-xl border border-slate-200 bg-white font-medium"
              />
            </div>
          </div>

          {/* Doctor & Pharmacy Details for Refills */}
          <div className="space-y-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <div className="font-bold text-slate-800 text-xs">
              Doctor & Pharmacy Information (for Refills & Guidance)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Prescribing Doctor / Clinic
                </label>
                <input
                  type="text"
                  value={prescribingDoctor}
                  onChange={(e) => setPrescribingDoctor(e.target.value)}
                  placeholder="e.g. Dr. Robert Miller"
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Doctor Phone Number
                </label>
                <input
                  type="tel"
                  value={doctorPhone}
                  onChange={(e) => setDoctorPhone(e.target.value)}
                  placeholder="e.g. +1 (555) 890-1234"
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Pharmacy Name
                </label>
                <input
                  type="text"
                  value={pharmacyName}
                  onChange={(e) => setPharmacyName(e.target.value)}
                  placeholder="e.g. Corner Health Pharmacy"
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Pharmacy Phone / Order Line
                </label>
                <input
                  type="tel"
                  value={pharmacyPhone}
                  onChange={(e) => setPharmacyPhone(e.target.value)}
                  placeholder="e.g. +1 (555) 345-6789"
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Rx / Prescription Bottle Number
              </label>
              <input
                type="text"
                value={rxNumber}
                onChange={(e) => setRxNumber(e.target.value)}
                placeholder="e.g. RX-984210"
                className="w-full p-2.5 rounded-xl border border-slate-200 font-medium bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Special Instructions / Precautions
            </label>
            <textarea
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Swallow whole with a full glass of water. Do not crush or chew."
              className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Buttons */}
          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 text-white font-extrabold shadow-md shadow-sky-600/25 hover:from-sky-700 hover:to-teal-700 transition"
            >
              {editingMedicine ? 'Save Changes' : 'Schedule Medicine'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

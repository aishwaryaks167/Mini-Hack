import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  ChevronRight,
  ShieldAlert,
  Flame,
  ArrowUpRight,
  Sparkles,
  Utensils,
  Pill,
  Coffee,
  Sun,
  Sunset,
  Moon,
  Info,
  Volume2,
  Phone,
  RefreshCw,
  AlertTriangle,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { DoseInstance, Medicine, UserProfile } from '../types';
import { calculateAdherence, formatDateKey, formatTimeDisplay } from '../utils/storage';
import { speakText, formatDoseSpeechText } from '../utils/speech';
import { getTranslation } from '../utils/translations';

interface HomeDashboardProps {
  doses: DoseInstance[];
  medicines: Medicine[];
  profile: UserProfile;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onOpenDoseAction: (dose: DoseInstance) => void;
  onQuickTakeDose: (doseId: string) => void;
  onQuickSnoozeDose: (doseId: string) => void;
  onOpenAddMedicine: () => void;
  onNavigateTab: (tab: any) => void;
  onRefillMedicine?: (medicineId: string, quantity: number) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  doses,
  medicines,
  profile,
  selectedDate,
  onSelectDate,
  onOpenDoseAction,
  onQuickTakeDose,
  onQuickSnoozeDose,
  onOpenAddMedicine,
  onNavigateTab,
  onRefillMedicine,
}) => {
  const todayKey = formatDateKey(new Date());
  const isToday = selectedDate === todayKey;

  const [refillSuccessMedId, setRefillSuccessMedId] = useState<string | null>(null);

  // Greeting based on current time (localized)
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return getTranslation(profile.preferredLanguage, 'greetingMorning') || 'Good morning';
    if (hour < 17) return getTranslation(profile.preferredLanguage, 'greetingAfternoon') || 'Good afternoon';
    return getTranslation(profile.preferredLanguage, 'greetingEvening') || 'Good evening';
  }, [profile.preferredLanguage]);

  // Filter doses for selected date
  const dateDoses = useMemo(() => {
    return doses
      .filter((d) => d.scheduledDate === selectedDate)
      .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));
  }, [doses, selectedDate]);

  // Overall adherence for selected date
  const adherence = useMemo(() => {
    return calculateAdherence(dateDoses);
  }, [dateDoses]);

  // Low stock medicines checking (Refill Reminders)
  const lowStockMedicines = useMemo(() => {
    return medicines.filter((m) => m.currentStock <= m.lowStockThreshold);
  }, [medicines]);

  // Next upcoming pending dose
  const nextUpDose = useMemo(() => {
    if (!isToday) return null;
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Look for pending doses today
    const pending = dateDoses.filter((d) => d.status === 'pending');
    if (pending.length === 0) return null;

    // Sort by scheduled time
    return (
      pending.find((d) => {
        const [h, m] = d.scheduledTime.split(':').map(Number);
        return h * 60 + m >= currentMinutes - 30; // Within 30 min in past or future
      }) || pending[0]
    );
  }, [dateDoses, isToday]);

  // Calculate next dose countdown
  const nextDoseCountdown = useMemo(() => {
    if (!nextUpDose) return null;
    const now = new Date();
    const [h, m] = nextUpDose.scheduledTime.split(':').map(Number);
    const doseMinutes = h * 60 + m;
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const diff = doseMinutes - nowMinutes;

    if (diff > 0) {
      if (diff < 60) return `Due in ${diff} min`;
      const hrs = Math.floor(diff / 60);
      const mins = diff % 60;
      return `Due in ${hrs}h ${mins > 0 ? `${mins}m` : ''}`;
    } else if (diff === 0) {
      return 'Due right now';
    } else {
      const overdue = Math.abs(diff);
      return overdue < 60 ? `${overdue} min past due` : `${Math.floor(overdue / 60)}h past due`;
    }
  }, [nextUpDose]);

  // Group doses into Morning, Afternoon, Evening, Night
  const groupedDoses = useMemo(() => {
    const morning: DoseInstance[] = [];
    const afternoon: DoseInstance[] = [];
    const evening: DoseInstance[] = [];
    const night: DoseInstance[] = [];

    dateDoses.forEach((d) => {
      const [h] = d.scheduledTime.split(':').map(Number);
      if (h < 12) morning.push(d);
      else if (h < 17) afternoon.push(d);
      else if (h < 21) evening.push(d);
      else night.push(d);
    });

    return [
      { label: getTranslation(profile.preferredLanguage, 'morning') || 'Morning', icon: Coffee, doses: morning, timeRange: '6:00 AM - 12:00 PM' },
      { label: getTranslation(profile.preferredLanguage, 'afternoon') || 'Afternoon', icon: Sun, doses: afternoon, timeRange: '12:00 PM - 5:00 PM' },
      { label: getTranslation(profile.preferredLanguage, 'evening') || 'Evening', icon: Sunset, doses: evening, timeRange: '5:00 PM - 9:00 PM' },
      { label: getTranslation(profile.preferredLanguage, 'night') || 'Night', icon: Moon, doses: night, timeRange: '9:00 PM - 12:00 AM' },
    ].filter((g) => g.doses.length > 0);
  }, [dateDoses, profile.preferredLanguage]);

  // Generate 7-day strip around selected date
  const weekDays = useMemo(() => {
    const days = [];
    const center = new Date(selectedDate + 'T00:00:00');

    for (let i = -3; i <= 3; i++) {
      const d = new Date(center);
      d.setDate(center.getDate() + i);
      const key = formatDateKey(d);
      const dayDoses = doses.filter((dose) => dose.scheduledDate === key);
      const hasDoses = dayDoses.length > 0;
      const isSelected = key === selectedDate;
      const isCurrentDay = key === todayKey;

      days.push({
        date: d,
        key,
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: d.getDate(),
        hasDoses,
        isSelected,
        isCurrentDay,
      });
    }
    return days;
  }, [selectedDate, doses, todayKey]);

  const mealTimingLabel = (timing: string) => {
    return getTranslation(profile.preferredLanguage, timing) || timing;
  };

  const handleSpeakDose = (dose: DoseInstance) => {
    const speech = formatDoseSpeechText(
      dose.medicineName,
      dose.strength,
      dose.quantityPerDose,
      dose.unit,
      dose.mealTiming,
      formatTimeDisplay(dose.scheduledTime, profile.timeFormat),
      dose.notes,
      profile.preferredLanguage
    );
    speakText(speech, {
      rate: profile.voiceRate || 0.85,
      langCode: profile.preferredLanguage,
    });
  };

  const handleRefillClick = (medicineId: string, qty: number = 30) => {
    if (onRefillMedicine) {
      onRefillMedicine(medicineId, qty);
      setRefillSuccessMedId(medicineId);
      setTimeout(() => setRefillSuccessMedId(null), 3000);
    }
  };

  // Font sizing styles based on elderly preferences
  const isLarge = profile.elderlyMode || profile.fontSizeScale === 'large';
  const isExtraLarge = profile.fontSizeScale === 'extra-large';

  return (
    <div className={`space-y-4 pb-20 ${isExtraLarge ? 'text-lg' : isLarge ? 'text-base' : 'text-sm'}`}>
      {/* 1. Header Greeting & Adherence Summary Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-sky-700 via-sky-600 to-teal-600 text-white p-5 sm:p-6 shadow-xl shadow-sky-900/10">
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute right-12 top-2 w-20 h-20 bg-teal-400/20 rounded-full blur-lg pointer-events-none" />

        <div className="relative z-10 flex items-start justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-sm mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              {isToday ? "Today's Schedule" : new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
            <div className="flex items-center gap-2.5">
              {profile.avatarUrl && (
                <div className="w-10 h-10 rounded-2xl overflow-hidden border-2 border-white/40 shadow-sm flex-shrink-0">
                  <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div>
                <h2 className={`font-extrabold tracking-tight font-heading flex items-center gap-2 flex-wrap ${isExtraLarge ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}>
                  <span>{greeting}, {profile.name.split(' ')[0]}!</span>
                  {profile.relationship && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30">
                      {profile.relationship}
                    </span>
                  )}
                </h2>
                <p className="text-sky-100 text-xs sm:text-sm font-medium mt-0.5">
                  {adherence.totalDue > 0
                    ? `${adherence.taken} of ${adherence.totalDue} doses confirmed taken so far.`
                    : 'All doses scheduled are on track.'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Adherence Gauge Ring */}
          <div className="flex flex-col items-center justify-center bg-white/15 backdrop-blur-md rounded-2xl p-3 border border-white/20 shadow-inner">
            <span className="text-2xl sm:text-3xl font-black font-heading leading-none">
              {adherence.percentage}%
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-200 mt-1">
              Adherence
            </span>
          </div>
        </div>

        {/* Adherence Mini Status Counters */}
        <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-white/15">
          <div className="bg-white/10 rounded-xl p-2 text-center backdrop-blur-sm">
            <span className="block text-xs font-medium text-sky-200">Taken</span>
            <span className="text-base sm:text-lg font-bold text-emerald-300">
              {adherence.taken}
            </span>
          </div>
          <div className="bg-white/10 rounded-xl p-2 text-center backdrop-blur-sm">
            <span className="block text-xs font-medium text-sky-200">Pending</span>
            <span className="text-base sm:text-lg font-bold text-amber-300">
              {adherence.pendingDue + adherence.futureDoses}
            </span>
          </div>
          <div className="bg-white/10 rounded-xl p-2 text-center backdrop-blur-sm">
            <span className="block text-xs font-medium text-sky-200">Missed</span>
            <span className="text-base sm:text-lg font-bold text-rose-300">
              {adherence.missed}
            </span>
          </div>
          <div className="bg-white/10 rounded-xl p-2 text-center backdrop-blur-sm">
            <span className="block text-xs font-medium text-sky-200">Skipped</span>
            <span className="text-base sm:text-lg font-bold text-slate-200">
              {adherence.skipped}
            </span>
          </div>
        </div>
      </div>

      {/* 2. CLINICAL MISSED-DOSE GUIDANCE BANNER (MANDATORY CLINICAL SAFETY) */}
      {adherence.missed > 0 && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-4 sm:p-5 shadow-sm space-y-2.5 animate-in fade-in">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0 mt-0.5">
              <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="font-heading font-extrabold text-rose-950 text-sm sm:text-base leading-tight">
                {getTranslation(profile.preferredLanguage, 'missedDoseSafetyTitle') || 'Important Clinical Guidance: Missed Dose'}
              </h4>
              <p className="text-xs sm:text-sm text-rose-900 leading-relaxed font-medium">
                {getTranslation(profile.preferredLanguage, 'missedDoseSafetyText') ||
                  'Never take an extra or double dose to make up for a missed dose. If it is almost time for your next scheduled dose, skip the missed dose and resume your regular schedule. Check your prescription label or call your pharmacist/doctor for advice.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-rose-200/70">
            <a
              href={`tel:${profile.defaultPharmacyPhone || '+15553456789'}`}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-rose-300 text-rose-800 font-bold text-xs hover:bg-rose-100/60 shadow-sm transition"
            >
              <Phone className="w-3.5 h-3.5 text-rose-600" />
              <span>Call Pharmacy ({profile.defaultPharmacyPhone || '+1 555-345-6789'})</span>
            </a>
            <a
              href="tel:+15558901234"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-700 text-white font-bold text-xs hover:bg-rose-800 shadow-sm transition"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Doctor's Office</span>
            </a>
          </div>
        </div>
      )}

      {/* 3. REFILL REMINDERS BANNER (WHEN MEDICINE IS RUNNING LOW) */}
      {lowStockMedicines.length > 0 && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <RefreshCw className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-200/80 text-amber-900">
                  Refill Needed
                </span>
                <h4 className="font-heading font-extrabold text-amber-950 text-sm sm:text-base mt-0.5">
                  Medication Supply Running Low
                </h4>
                <p className="text-xs text-amber-900 leading-relaxed">
                  Remember to order refills before running out. You have low stock for:
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {lowStockMedicines.map((med) => {
              const daysLeft = Math.max(1, Math.floor(med.currentStock / (med.quantityPerDose * med.reminderTimes.length || 1)));
              const isRefilled = refillSuccessMedId === med.id;

              return (
                <div
                  key={med.id}
                  className="bg-white p-3 rounded-2xl border border-amber-200/80 flex flex-wrap items-center justify-between gap-2 shadow-sm"
                >
                  <div className="flex items-center gap-2.5">
                    {med.imageUrl ? (
                      <img src={med.imageUrl} alt={med.name} className="w-9 h-9 rounded-xl object-cover border border-slate-200" />
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                        <Pill className="w-4 h-4" />
                      </div>
                    )}
                    <div>
                      <div className="font-extrabold text-slate-900 text-xs sm:text-sm">{med.name}</div>
                      <div className="text-[11px] text-amber-800 font-semibold">
                        {med.currentStock} {med.unit}s remaining (~{daysLeft} days left)
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <a
                      href={`tel:${med.pharmacyPhone || profile.defaultPharmacyPhone || '+15553456789'}`}
                      className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 flex items-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5 text-sky-600" />
                      <span>Order Refill</span>
                    </a>

                    <button
                      onClick={() => handleRefillClick(med.id, 30)}
                      className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition flex items-center gap-1 ${
                        isRefilled
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm'
                      }`}
                    >
                      {isRefilled ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <RefreshCw className="w-3.5 h-3.5" />}
                      <span>{isRefilled ? 'Refilled!' : '+30 Received'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Interactive Week Calendar Strip */}
      <div className="bg-white rounded-2xl p-2.5 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between gap-1 overflow-x-auto py-1">
          {weekDays.map((d) => (
            <button
              key={d.key}
              onClick={() => onSelectDate(d.key)}
              className={`flex-1 min-w-[42px] py-2 px-1 rounded-xl flex flex-col items-center transition-all ${
                d.isSelected
                  ? 'bg-sky-600 text-white font-bold shadow-md shadow-sky-600/20 scale-105'
                  : d.isCurrentDay
                  ? 'bg-sky-50 text-sky-800 border border-sky-200 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100 font-medium'
              }`}
            >
              <span className="text-[10px] uppercase font-bold tracking-tight opacity-80">
                {d.dayName}
              </span>
              <span className={`text-sm sm:text-base leading-tight mt-0.5 ${d.isSelected ? 'font-extrabold' : ''}`}>
                {d.dayNum}
              </span>
              <span
                className={`w-1.5 h-1.5 rounded-full mt-1 ${
                  d.isSelected
                    ? 'bg-white'
                    : d.hasDoses
                    ? 'bg-teal-500'
                    : 'bg-transparent'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* 5. Next Up Dose Hero Card (if today & pending available) */}
      {isToday && nextUpDose && (
        <div className="bg-white border-2 border-sky-300 rounded-3xl p-4 sm:p-5 shadow-sm hover:border-sky-400 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-800">
                Next Upcoming Dose
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSpeakDose(nextUpDose)}
                title="Hear dose details aloud"
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 text-xs font-bold border border-sky-200 transition"
              >
                <Volume2 className="w-3.5 h-3.5 text-sky-600" />
                <span>Hear Dose</span>
              </button>

              <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                {nextDoseCountdown}
              </span>
            </div>
          </div>

          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              {nextUpDose.imageUrl ? (
                <div className="w-14 h-14 rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex-shrink-0 bg-white">
                  <img
                    src={nextUpDose.imageUrl}
                    alt={nextUpDose.medicineName}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold shadow-sm flex-shrink-0"
                  style={{ backgroundColor: nextUpDose.color || '#0284c7' }}
                >
                  <Pill className="w-6 h-6 -rotate-45" />
                </div>
              )}
              <div>
                <h3 className={`font-heading font-extrabold text-slate-900 leading-snug ${isExtraLarge ? 'text-xl' : 'text-base sm:text-lg'}`}>
                  {nextUpDose.medicineName}
                </h3>
                <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                  <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    {nextUpDose.strength} • {nextUpDose.quantityPerDose} {nextUpDose.unit}
                  </span>
                  <span className="text-xs font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 flex items-center gap-1">
                    <Utensils className="w-3 h-3" />
                    {mealTimingLabel(nextUpDose.mealTiming)}
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-medium mt-1">
                  Scheduled for{' '}
                  <span className="font-extrabold text-slate-900">
                    {formatTimeDisplay(nextUpDose.scheduledTime, profile.timeFormat)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons (Large Touch Targets for Seniors) */}
          <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-100">
            <button
              onClick={() => onQuickTakeDose(nextUpDose.id)}
              className={`flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black shadow-md shadow-emerald-600/25 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.98] transition-all ${
                profile.elderlyMode ? 'py-4 text-lg' : 'py-3 text-sm'
              }`}
            >
              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
              <span>Mark as Taken</span>
            </button>

            <button
              onClick={() => onQuickSnoozeDose(nextUpDose.id)}
              className={`flex items-center justify-center gap-2 rounded-2xl bg-slate-100 text-slate-800 font-bold hover:bg-slate-200 active:scale-[0.98] transition-all ${
                profile.elderlyMode ? 'py-4 text-base' : 'py-3 text-sm'
              }`}
            >
              <Clock className="w-4 h-4 text-sky-600" />
              <span>Snooze {profile.snoozeIntervalMinutes}m</span>
            </button>
          </div>
        </div>
      )}

      {/* 6. Timeline Schedule Grouped by Time of Day */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-extrabold text-slate-900 text-base sm:text-lg">
            Daily Schedule Timeline
          </h3>
          <span className="text-xs font-semibold text-slate-500">
            {dateDoses.length} {dateDoses.length === 1 ? 'dose' : 'doses'} total
          </span>
        </div>

        {groupedDoses.length === 0 ? (
          <div className="bg-white rounded-3xl p-6 text-center border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center mx-auto">
              <Pill className="w-6 h-6" />
            </div>
            <h4 className="font-heading font-bold text-slate-800 text-base">
              No Doses Scheduled
            </h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              There are no medicines scheduled for this date.
            </p>
            <button
              onClick={onOpenAddMedicine}
              className="px-4 py-2.5 rounded-xl bg-sky-600 text-white font-bold text-xs hover:bg-sky-700 transition"
            >
              Add Medicine
            </button>
          </div>
        ) : (
          groupedDoses.map((group) => {
            const GroupIcon = group.icon;

            return (
              <div key={group.label} className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600 px-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <GroupIcon className="w-4 h-4 text-sky-600" />
                    <span>{group.label}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {group.timeRange}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {group.doses.map((dose) => {
                    const isTaken = dose.status === 'taken';
                    const isMissed = dose.status === 'missed';
                    const isSkipped = dose.status === 'skipped';

                    return (
                      <div
                        key={dose.id}
                        onClick={() => onOpenDoseAction(dose)}
                        className={`group relative bg-white rounded-2xl p-4 border transition-all cursor-pointer shadow-sm hover:shadow-md ${
                          isTaken
                            ? 'border-emerald-200 bg-emerald-50/20'
                            : isMissed
                            ? 'border-rose-300 bg-rose-50/30'
                            : isSkipped
                            ? 'border-slate-200 bg-slate-50/60 opacity-80'
                            : 'border-slate-200 hover:border-sky-300'
                        } ${profile.elderlyMode ? 'py-4.5' : ''}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          {/* Left Pill Info */}
                          <div className="flex items-start gap-3">
                            {dose.imageUrl ? (
                              <div className="w-11 h-11 rounded-xl overflow-hidden border border-slate-200 shadow-sm flex-shrink-0 bg-white">
                                <img
                                  src={dose.imageUrl}
                                  alt={dose.medicineName}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div
                                className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold shadow-sm flex-shrink-0"
                                style={{ backgroundColor: dose.color || '#0284c7' }}
                              >
                                <Pill className="w-5 h-5 -rotate-45" />
                              </div>
                            )}

                            <div>
                              <div className="flex items-center gap-2">
                                <span className={`font-heading font-extrabold text-slate-900 leading-tight ${isExtraLarge ? 'text-lg' : 'text-base'}`}>
                                  {dose.medicineName}
                                </span>
                                <span className="text-xs font-bold text-slate-500">
                                  • {formatTimeDisplay(dose.scheduledTime, profile.timeFormat)}
                                </span>
                              </div>

                              <p className="text-xs text-slate-600 font-medium mt-0.5">
                                {dose.strength} • {dose.quantityPerDose} {dose.unit} • {mealTimingLabel(dose.mealTiming)}
                              </p>

                              {/* Status Subtitle Note */}
                              {isTaken && (
                                <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 mt-1">
                                  <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                                  <span>
                                    Confirmed taken {dose.takenAt ? `at ${new Date(dose.takenAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
                                  </span>
                                </p>
                              )}
                              {isMissed && (
                                <p className="text-[11px] text-rose-700 font-bold flex items-center gap-1 mt-1">
                                  <XCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                                  <span>Missed past grace period. Check guidance.</span>
                                </p>
                              )}
                              {isSkipped && (
                                <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-1">
                                  <AlertCircle className="w-3.5 h-3.5" />
                                  <span>Skipped ({dose.skipReason || 'Advised by doctor'})</span>
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Right Action & Voice Speaker button */}
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSpeakDose(dose);
                              }}
                              title="Hear medicine details spoken aloud"
                              className="p-2 rounded-xl text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>

                            {dose.status === 'pending' ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onQuickTakeDose(dose.id);
                                }}
                                className={`px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-extrabold text-xs shadow-sm hover:bg-emerald-700 transition flex items-center gap-1 ${
                                  profile.elderlyMode ? 'py-2 px-3.5 text-sm' : ''
                                }`}
                              >
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                                <span>Take</span>
                              </button>
                            ) : (
                              <span
                                className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                                  isTaken
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : isMissed
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-slate-200 text-slate-700'
                                }`}
                              >
                                {dose.status}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

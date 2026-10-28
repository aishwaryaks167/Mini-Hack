import React, { useState, useMemo } from 'react';
import {
  Pill,
  Search,
  Plus,
  Clock,
  Utensils,
  Edit2,
  Trash2,
  AlertTriangle,
  Package,
  Calendar,
  Sparkles,
  Info,
  Volume2,
  Phone,
  RefreshCw,
  Check,
} from 'lucide-react';
import { Medicine, MedicineType, UserProfile } from '../types';
import { formatTimeDisplay } from '../utils/storage';
import { speakText } from '../utils/speech';

interface MedicineListProps {
  medicines: Medicine[];
  profile: UserProfile;
  onOpenAdd: () => void;
  onEditMedicine: (med: Medicine) => void;
  onDeleteMedicine: (id: string, deleteHistory: boolean) => void;
  onRefillMedicine?: (medicineId: string, quantity: number) => void;
}

export const MedicineList: React.FC<MedicineListProps> = ({
  medicines,
  profile,
  onOpenAdd,
  onEditMedicine,
  onDeleteMedicine,
  onRefillMedicine,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [medicineToDelete, setMedicineToDelete] = useState<Medicine | null>(null);
  const [deleteHistoryOption, setDeleteHistoryOption] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<{ name: string; url: string } | null>(null);
  const [refillSuccessId, setRefillSuccessId] = useState<string | null>(null);

  const filteredMedicines = useMemo(() => {
    return medicines.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.genericName && m.genericName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (m.prescribingDoctor && m.prescribingDoctor.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType = selectedType === 'all' || m.type === selectedType;

      return matchesSearch && matchesType;
    });
  }, [medicines, searchQuery, selectedType]);

  const mealTimingLabel = (timing: string) => {
    switch (timing) {
      case 'before_meal':
        return 'Before Food';
      case 'after_meal':
        return 'After Food';
      case 'with_meal':
        return 'With Food';
      case 'empty_stomach':
        return 'Empty Stomach';
      default:
        return 'As Prescribed';
    }
  };

  const confirmDelete = () => {
    if (!medicineToDelete) return;
    onDeleteMedicine(medicineToDelete.id, deleteHistoryOption);
    setMedicineToDelete(null);
  };

  const handleSpeakPrescription = (med: Medicine) => {
    const text = `Prescription for ${med.name}, ${med.strength}. Take ${med.quantityPerDose} ${med.unit}, ${mealTimingLabel(med.mealTiming)}. Scheduled times: ${med.reminderTimes.join(' and ')}. Current stock: ${med.currentStock} ${med.unit}s remaining. ${med.instructions ? `Instructions: ${med.instructions}` : ''}`;
    speakText(text, { rate: profile.voiceRate || 0.85 });
  };

  const handleQuickRefill = (medId: string, quantity: number = 30) => {
    if (onRefillMedicine) {
      onRefillMedicine(medId, quantity);
      setRefillSuccessId(medId);
      setTimeout(() => setRefillSuccessId(null), 2500);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Title & Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
            My Prescriptions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Manage your prescribed medications, photos, and refill levels
          </p>
        </div>

        <button
          onClick={onOpenAdd}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-600/20 hover:from-sky-700 hover:to-teal-700 active:scale-95 transition"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Medicine</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search medicine name, generic, or doctor..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
          {['all', 'tablet', 'capsule', 'syrup', 'drops', 'inhaler'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1 rounded-full font-semibold capitalize whitespace-nowrap transition-all ${
                selectedType === type
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {type === 'all' ? 'All Types' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Medicines List */}
      {filteredMedicines.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 shadow-sm space-y-3">
          <div className="w-14 h-14 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center mx-auto">
            <Pill className="w-7 h-7" />
          </div>
          <h3 className="font-heading font-extrabold text-slate-800 text-lg">
            No Medicines Found
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            {searchQuery
              ? 'No medicines match your search criteria. Try a different keyword.'
              : 'You have not added any medicines yet. Tap the button below to add your first prescribed medication.'}
          </p>
          <button
            onClick={onOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-sky-600 text-white font-bold text-xs sm:text-sm hover:bg-sky-700 transition"
          >
            Add Your First Medicine
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMedicines.map((med) => {
            const isLowStock = med.currentStock <= med.lowStockThreshold;
            const daysLeft = Math.max(1, Math.floor(med.currentStock / (med.quantityPerDose * med.reminderTimes.length || 1)));
            const isRefilled = refillSuccessId === med.id;

            return (
              <div
                key={med.id}
                className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {med.imageUrl ? (
                      <div
                        onClick={() => setPhotoPreview({ name: med.name, url: med.imageUrl! })}
                        className="relative w-14 h-14 rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex-shrink-0 cursor-pointer group/img bg-slate-50"
                        title="Click to enlarge photo"
                      >
                        <img
                          src={med.imageUrl}
                          alt={med.name}
                          className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-200"
                        />
                      </div>
                    ) : (
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold shadow-sm flex-shrink-0"
                        style={{ backgroundColor: med.color || '#0284c7' }}
                      >
                        <Pill className="w-6 h-6 -rotate-45" />
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-heading font-extrabold text-slate-900 text-base sm:text-lg leading-tight">
                          {med.name}
                        </h3>
                        {med.genericName && (
                          <span className="text-xs text-slate-400 font-medium">
                            ({med.genericName})
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 mt-1 text-xs">
                        <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                          {med.strength} • {med.quantityPerDose} {med.unit}
                        </span>
                        <span className="font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Utensils className="w-3 h-3" />
                          {mealTimingLabel(med.mealTiming)}
                        </span>
                        <span className="font-medium text-sky-800 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-md capitalize">
                          {med.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Top Action Buttons (Hear, Edit, Delete) */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleSpeakPrescription(med)}
                      className="p-2 rounded-xl text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition"
                      title="Hear prescription aloud"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEditMedicine(med)}
                      className="p-2 rounded-xl text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition"
                      title="Edit Medicine Schedule"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setMedicineToDelete(med)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Delete Medicine"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Reminder Schedule Chips */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs">
                  <span className="font-bold text-slate-600 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-sky-600" />
                    Reminders:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {med.reminderTimes.map((time) => (
                      <span
                        key={time}
                        className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 font-bold border border-sky-200"
                      >
                        {formatTimeDisplay(time, profile.timeFormat)}
                      </span>
                    ))}
                  </div>
                  <span className="text-slate-400 font-medium ml-auto capitalize">
                    {med.frequency === 'daily'
                      ? 'Daily'
                      : med.frequency === 'specific_days'
                      ? 'Selected Days'
                      : 'Every X Days'}
                  </span>
                </div>

                {/* Stock Status & Refill Action Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1">
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-bold ${
                      isLowStock
                        ? 'bg-amber-100 text-amber-950 border border-amber-300'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>
                      {med.currentStock} {med.unit}s left (~{daysLeft} days)
                      {isLowStock && ' • Low Supply!'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 ml-auto">
                    <a
                      href={`tel:${med.pharmacyPhone || profile.defaultPharmacyPhone || '+15553456789'}`}
                      className="px-2.5 py-1 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3 text-sky-600" />
                      <span>Pharmacy</span>
                    </a>

                    <button
                      onClick={() => handleQuickRefill(med.id, 30)}
                      className={`px-3 py-1 rounded-xl text-xs font-extrabold transition flex items-center gap-1 ${
                        isRefilled
                          ? 'bg-emerald-600 text-white'
                          : 'bg-sky-600 hover:bg-sky-700 text-white shadow-sm'
                      }`}
                    >
                      {isRefilled ? <Check className="w-3 h-3 stroke-[3]" /> : <RefreshCw className="w-3 h-3" />}
                      <span>{isRefilled ? 'Refilled!' : '+30 Stock'}</span>
                    </button>
                  </div>
                </div>

                {med.instructions && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 leading-relaxed">
                    <strong>Instructions:</strong> {med.instructions}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {medicineToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-heading font-extrabold text-slate-900 text-lg">
                Delete {medicineToDelete.name}?
              </h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to remove this medication from your active reminders?
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={deleteHistoryOption}
                  onChange={(e) => setDeleteHistoryOption(e.target.checked)}
                  className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                />
                <span>Also wipe past dose history for this medicine</span>
              </label>
              <p className="text-[11px] text-slate-500 mt-1 pl-5">
                Recommended: Leave unchecked to retain historical adherence data for your doctor's clinical report.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setMedicineToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enlarged Photo Preview Modal */}
      {photoPreview && (
        <div
          onClick={() => setPhotoPreview(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-200 text-center space-y-3"
          >
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-heading font-extrabold text-slate-900 text-base">
                {photoPreview.name}
              </span>
              <button
                onClick={() => setPhotoPreview(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-800"
              >
                <span className="text-xs font-bold px-2 py-1 rounded bg-slate-100">Close</span>
              </button>
            </div>

            <div className="w-full h-64 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner flex items-center justify-center">
              <img
                src={photoPreview.url}
                alt={photoPreview.name}
                className="w-full h-full object-contain p-2"
              />
            </div>

            <p className="text-xs text-slate-500">
              Prescription / Pill visual verification photo
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

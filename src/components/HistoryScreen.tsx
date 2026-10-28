import React, { useState, useMemo } from 'react';
import {
  Calendar,
  BarChart2,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Download,
  Filter,
  FileText,
  Printer,
  ChevronLeft,
  ChevronRight,
  Info,
  Clock,
  Sparkles,
} from 'lucide-react';
import { DoseInstance, Medicine, UserProfile } from '../types';
import { calculateAdherence, exportDosesToCSV, formatDateKey, formatTimeDisplay } from '../utils/storage';
import { getTranslation } from '../utils/translations';

interface HistoryScreenProps {
  doses: DoseInstance[];
  medicines: Medicine[];
  profile: UserProfile;
  onOpenDoseAction: (dose: DoseInstance) => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  doses,
  medicines,
  profile,
  onOpenDoseAction,
}) => {
  const t = (key: string, params?: Record<string, string | number>) =>
    getTranslation(profile.preferredLanguage, key, params);

  const [timeRange, setTimeRange] = useState<'7days' | '14days' | '30days'>('7days');
  const [selectedMedicineId, setSelectedMedicineId] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedHistoryDate, setSelectedHistoryDate] = useState<string>(formatDateKey());
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  // Range limit calculation
  const rangeDaysCount = timeRange === '7days' ? 7 : timeRange === '14days' ? 14 : 30;

  // Filtered doses for current selected medicine and status
  const filteredDoses = useMemo(() => {
    return doses.filter((d) => {
      const matchMed = selectedMedicineId === 'all' || d.medicineId === selectedMedicineId;
      const matchStatus = selectedStatus === 'all' || d.status === selectedStatus;
      return matchMed && matchStatus;
    });
  }, [doses, selectedMedicineId, selectedStatus]);

  // Overall adherence calculation for filtered doses
  const overallAdherence = useMemo(() => {
    return calculateAdherence(
      filteredDoses,
      selectedMedicineId === 'all' ? undefined : selectedMedicineId
    );
  }, [filteredDoses, selectedMedicineId]);

  // Daily summary array for SVG trend chart
  const dailyChartData = useMemo(() => {
    const today = new Date();
    const result = [];

    for (let i = rangeDaysCount - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = formatDateKey(d);
      const dayDoses = filteredDoses.filter((dose) => dose.scheduledDate === key);
      const dayAdherence = calculateAdherence(dayDoses);

      result.push({
        dateKey: key,
        displayLabel: d.toLocaleDateString('en-US', { weekday: 'narrow', month: 'numeric', day: 'numeric' }),
        fullLabel: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        taken: dayAdherence.taken,
        missed: dayAdherence.missed,
        skipped: dayAdherence.skipped,
        pending: dayAdherence.pendingDue + dayAdherence.futureDoses,
        percentage: dayAdherence.percentage,
        totalDue: dayAdherence.totalDue,
      });
    }

    return result;
  }, [filteredDoses, rangeDaysCount]);

  // Doses for the currently selected history date
  const dateDoses = useMemo(() => {
    return filteredDoses
      .filter((d) => d.scheduledDate === selectedHistoryDate)
      .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));
  }, [filteredDoses, selectedHistoryDate]);

  const handleExportCSV = () => {
    exportDosesToCSV(filteredDoses, profile);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Title & Export Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
            {t('adherenceHistory')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {t('historyDesc')}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowPrintModal(true)}
            className="p-2 sm:px-3 sm:py-2 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold text-xs hover:bg-slate-50 shadow-sm flex items-center gap-1"
            title="View Printable Clinical Report"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">{t('printable')}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-600/20 hover:from-sky-700 hover:to-teal-700 transition"
            title="Download CSV Spreadsheet for Doctor"
          >
            <Download className="w-4 h-4" />
            <span>{t('exportCSV')}</span>
          </button>
        </div>
      </div>

      {/* Range & Filter Selector Bar */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Range tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
            {(['7days', '14days', '30days'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  timeRange === r
                    ? 'bg-white text-sky-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {r === '7days' ? t('last7Days') : r === '14days' ? t('last14Days') : t('last30Days')}
              </button>
            ))}
          </div>

          {/* Medicine dropdown filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedMedicineId}
              onChange={(e) => setSelectedMedicineId(e.target.value)}
              className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="all">All Prescriptions</option>
              {medicines.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.strength})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status filter pills */}
        <div className="flex gap-1.5 overflow-x-auto text-xs pt-1">
          {[
            { id: 'all', label: 'All Statuses' },
            { id: 'taken', label: 'Taken Only' },
            { id: 'missed', label: 'Missed Only' },
            { id: 'skipped', label: 'Skipped Only' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setSelectedStatus(st.id)}
              className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition ${
                selectedStatus === st.id
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Adherence Score & SVG Trend Chart */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Average Adherence Rate
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl sm:text-4xl font-black font-heading text-slate-900 leading-none">
                {overallAdherence.percentage}%
              </span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  overallAdherence.percentage >= 80
                    ? 'bg-emerald-100 text-emerald-800'
                    : overallAdherence.percentage >= 60
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {overallAdherence.percentage >= 80
                  ? 'Excellent'
                  : overallAdherence.percentage >= 60
                  ? 'Moderate'
                  : 'Needs Attention'}
              </span>
            </div>
          </div>

          <div className="text-right text-xs text-slate-500">
            <div>
              <span className="font-bold text-slate-800">{overallAdherence.taken}</span> of{' '}
              <span className="font-bold text-slate-800">{overallAdherence.totalDue}</span> due doses taken
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Strict formula: (Taken / Due) × 100
            </div>
          </div>
        </div>

        {/* SVG Interactive Trend Bar Chart */}
        <div className="space-y-2">
          <div className="h-36 sm:h-44 flex items-end justify-between gap-1 sm:gap-2 pt-6 px-1 border-b border-slate-200">
            {dailyChartData.map((day) => {
              const isSelected = day.dateKey === selectedHistoryDate;
              const barHeightPct = day.totalDue === 0 ? 10 : Math.max(12, day.percentage);

              let barBg = 'bg-slate-300';
              if (day.totalDue > 0) {
                if (day.percentage >= 80) barBg = 'bg-emerald-500 hover:bg-emerald-600';
                else if (day.percentage >= 50) barBg = 'bg-amber-500 hover:bg-amber-600';
                else barBg = 'bg-rose-500 hover:bg-rose-600';
              }

              return (
                <div
                  key={day.dateKey}
                  onClick={() => setSelectedHistoryDate(day.dateKey)}
                  className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                >
                  {/* Tooltip on hover */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 bg-slate-900 text-white text-[10px] font-bold py-1 px-2 rounded shadow-lg whitespace-nowrap">
                    {day.fullLabel}: {day.percentage}% ({day.taken}/{day.totalDue})
                  </div>

                  {/* Percentage label */}
                  {day.totalDue > 0 && (
                    <span className="text-[9px] font-bold text-slate-500 mb-1 group-hover:text-slate-900">
                      {day.percentage}%
                    </span>
                  )}

                  {/* Bar */}
                  <div
                    className={`w-full rounded-t-md transition-all ${barBg} ${
                      isSelected ? 'ring-2 ring-sky-600 ring-offset-1' : ''
                    }`}
                    style={{ height: `${barHeightPct}%` }}
                  />
                </div>
              );
            })}
          </div>

          {/* X-axis labels */}
          <div className="flex justify-between gap-1 px-1 text-[10px] font-medium text-slate-400">
            <span>{dailyChartData[0]?.displayLabel}</span>
            <span className="font-semibold text-slate-700">
              Selected: {new Date(selectedHistoryDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
            <span>{dailyChartData[dailyChartData.length - 1]?.displayLabel}</span>
          </div>
        </div>

        {/* Documented Formula Box */}
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 flex items-start gap-2">
          <Info className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
          <p>
            <strong>Adherence Formula:</strong> Adherence % = (Confirmed Taken Doses ÷ Total Doses Due to Date) × 100. Unconfirmed doses past the grace period are marked missed. Future scheduled doses are excluded from the denominator.
          </p>
        </div>
      </div>

      {/* Detailed Log for Selected Date */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-sky-600" />
            <h3 className="font-heading font-extrabold text-slate-900 text-sm sm:text-base">
              Doses for {new Date(selectedHistoryDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {dateDoses.length} dose(s)
          </span>
        </div>

        {dateDoses.length === 0 ? (
          <div className="py-6 text-center text-slate-400 text-xs">
            No medication doses recorded for this date.
          </div>
        ) : (
          <div className="space-y-2">
            {dateDoses.map((dose) => {
              const isTaken = dose.status === 'taken';
              const isMissed = dose.status === 'missed';
              const isSkipped = dose.status === 'skipped';

              return (
                <div
                  key={dose.id}
                  onClick={() => onOpenDoseAction(dose)}
                  className="p-3 rounded-xl border border-slate-200 hover:border-sky-300 transition-all flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0"
                      style={{ backgroundColor: dose.color || '#0284c7' }}
                    >
                      {formatTimeDisplay(dose.scheduledTime, profile.timeFormat).split(' ')[0]}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-bold text-slate-900 text-xs sm:text-sm">
                          {dose.medicineName}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {dose.strength}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Scheduled: {formatTimeDisplay(dose.scheduledTime, profile.timeFormat)}
                        {dose.takenAt && ` • Taken: ${new Date(dose.takenAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                        {dose.notes && ` • Note: ${dose.notes}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isTaken
                          ? 'bg-emerald-100 text-emerald-800'
                          : isMissed
                          ? 'bg-rose-100 text-rose-800'
                          : isSkipped
                          ? 'bg-slate-200 text-slate-700'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {dose.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Printable Clinical Report Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-start justify-between border-b pb-4">
              <div>
                <span className="text-xs uppercase font-extrabold text-sky-600 tracking-wider">
                  Clinical Medication Adherence Report
                </span>
                <h3 className="font-heading font-extrabold text-2xl text-slate-900 mt-1">
                  SmartDose Adherence Summary
                </h3>
                <p className="text-xs text-slate-500">
                  Patient: <strong className="text-slate-800">{profile.name}</strong> • Age: {profile.age || 'N/A'} • Generated: {new Date().toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            {/* Scorecard */}
            <div className="grid grid-cols-4 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
              <div>
                <span className="block text-xs text-slate-500 font-medium">Compliance</span>
                <span className="text-xl font-black text-slate-900">{overallAdherence.percentage}%</span>
              </div>
              <div>
                <span className="block text-xs text-slate-500 font-medium">Confirmed Taken</span>
                <span className="text-xl font-black text-emerald-600">{overallAdherence.taken}</span>
              </div>
              <div>
                <span className="block text-xs text-slate-500 font-medium">Missed Doses</span>
                <span className="text-xl font-black text-rose-600">{overallAdherence.missed}</span>
              </div>
              <div>
                <span className="block text-xs text-slate-500 font-medium">Skipped Doses</span>
                <span className="text-xl font-black text-slate-600">{overallAdherence.skipped}</span>
              </div>
            </div>

            {/* Active Prescriptions Table */}
            <div>
              <h4 className="font-heading font-bold text-sm text-slate-800 mb-2">
                Active Prescribed Regimen
              </h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-slate-600 font-semibold border-b">
                    <tr>
                      <th className="p-2">Medication</th>
                      <th className="p-2">Dosage</th>
                      <th className="p-2">Timing</th>
                      <th className="p-2">Instructions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {medicines.map((m) => (
                      <tr key={m.id}>
                        <td className="p-2 font-bold text-slate-800">{m.name}</td>
                        <td className="p-2">{m.strength} ({m.quantityPerDose} {m.unit})</td>
                        <td className="p-2">{m.reminderTimes.join(', ')}</td>
                        <td className="p-2 text-slate-500">{m.instructions || 'Standard'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/20"
              >
                Print Clinical Sheet
              </button>
              <button
                onClick={handleExportCSV}
                className="flex-1 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs"
              >
                Download CSV Spreadsheet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

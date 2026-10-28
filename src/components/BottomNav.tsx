import React from 'react';
import { Calendar, Pill, BarChart2, ShieldCheck, Settings, Plus } from 'lucide-react';
import { getTranslation } from '../utils/translations';

export type TabType = 'today' | 'medicines' | 'history' | 'caregiver' | 'settings';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  onOpenAddMedicine: () => void;
  elderlyMode?: boolean;
  language?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  onOpenAddMedicine,
  elderlyMode = false,
  language = 'en',
}) => {
  const tabs = [
    { id: 'today', labelKey: 'tabToday', fallback: 'Today', icon: Calendar },
    { id: 'medicines', labelKey: 'tabMedicines', fallback: 'Medicines', icon: Pill },
    { id: 'add', labelKey: 'tabAddMed', fallback: 'Add', icon: Plus, isAction: true },
    { id: 'history', labelKey: 'tabHistory', fallback: 'History', icon: BarChart2 },
    { id: 'caregiver', labelKey: 'tabCaregiver', fallback: 'Caregiver', icon: ShieldCheck },
    { id: 'settings', labelKey: 'tabSettings', fallback: 'Settings', icon: Settings },
  ] as const;

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-lg ${
        elderlyMode ? 'py-2.5' : 'py-1.5'
      }`}
    >
      <div className="max-w-lg mx-auto px-2 flex items-center justify-around">
        {tabs.map((tab) => {
          if (tab.id === 'add') {
            return (
              <button
                key={tab.id}
                onClick={onOpenAddMedicine}
                className="relative -top-3 flex flex-col items-center group focus:outline-none"
                title={getTranslation(language, 'addMedicine')}
              >
                <div
                  className={`flex items-center justify-center rounded-full bg-gradient-to-tr from-sky-600 to-teal-500 text-white shadow-lg shadow-sky-500/30 group-hover:scale-105 active:scale-95 transition-all ${
                    elderlyMode ? 'w-14 h-14' : 'w-12 h-12'
                  }`}
                >
                  <Plus className={`${elderlyMode ? 'w-7 h-7' : 'w-6 h-6'} stroke-[2.5]`} />
                </div>
                <span
                  className={`text-[10px] font-bold text-sky-700 mt-0.5 tracking-tight ${
                    elderlyMode ? 'text-xs' : ''
                  }`}
                >
                  {getTranslation(language, 'tabAddMed')}
                </span>
              </button>
            );
          }

          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id as TabType)}
              className={`flex flex-col items-center justify-center rounded-xl transition-all focus:outline-none ${
                elderlyMode ? 'px-2.5 py-1.5 min-w-[58px]' : 'px-2 py-1 min-w-[48px]'
              } ${
                isActive
                  ? 'text-sky-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <div
                className={`flex items-center justify-center rounded-lg transition-colors ${
                  isActive ? 'bg-sky-50 text-sky-600' : ''
                } ${elderlyMode ? 'p-1.5' : 'p-1'}`}
              >
                <Icon
                  className={`${
                    elderlyMode ? 'w-6 h-6' : 'w-5 h-5'
                  } ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`}
                />
              </div>
              <span
                className={`mt-0.5 leading-none tracking-tight ${
                  elderlyMode ? 'text-xs font-semibold' : 'text-[11px]'
                }`}
              >
                {getTranslation(language, tab.labelKey) || tab.fallback}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

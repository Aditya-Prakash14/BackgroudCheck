import React from 'react';
import { 
  UserGroupIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  XCircleIcon 
} from '@heroicons/react/24/solid';

type CardColor = 'blue' | 'green' | 'yellow' | 'red';

const colorThemes: Record<CardColor, {
  borderLeft: string;
  iconBg: string;
  iconText: string;
}> = {
  blue: {
    borderLeft: 'border-l-[6px] border-l-blue-600',
    iconBg: 'bg-blue-50',
    iconText: 'text-blue-700',
  },
  green: {
    borderLeft: 'border-l-[6px] border-l-emerald-600',
    iconBg: 'bg-emerald-50',
    iconText: 'text-emerald-700',
  },
  yellow: {
    borderLeft: 'border-l-[6px] border-l-amber-500',
    iconBg: 'bg-amber-50',
    iconText: 'text-amber-700',
  },
  red: {
    borderLeft: 'border-l-[6px] border-l-rose-600',
    iconBg: 'bg-rose-50',
    iconText: 'text-rose-700',
  },
};

interface StatCardProps {
  label: string;
  value: number | string;
  color: CardColor;
}

export default function StatCard({ label, value, color }: StatCardProps) {
  const theme = colorThemes[color] || colorThemes.blue;

  return (
    <div className={`relative bg-white border border-slate-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-300 ${theme.borderLeft} overflow-hidden`}>
      <div className="relative flex justify-between items-center">
        <div>
          <p className="text-xs font-bold text-slate-500 tracking-wider uppercase">{label}</p>
          <p className="text-3xl font-extrabold text-slate-900 mt-2 font-sans tracking-tight">
            {value}
          </p>
        </div>

        {/* Small icon indicator container */}
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg ${theme.iconBg} ${theme.iconText}`}>
          {color === 'blue' && <UserGroupIcon className="w-6 h-6" />}
          {color === 'green' && <CheckCircleIcon className="w-6 h-6" />}
          {color === 'yellow' && <ClockIcon className="w-6 h-6" />}
          {color === 'red' && <XCircleIcon className="w-6 h-6" />}
        </div>
      </div>
    </div>
  );
}

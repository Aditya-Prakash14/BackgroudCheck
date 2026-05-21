import React from 'react';
import { 
  CheckIcon, 
  XMarkIcon, 
  ExclamationTriangleIcon, 
  ClockIcon 
} from '@heroicons/react/20/solid';

export type StatusType = 'VERIFIED' | 'FAILED' | 'PARTIAL' | 'PENDING';

const styles: Record<StatusType, string> = {
  VERIFIED: 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-sm',
  FAILED: 'bg-rose-50 text-rose-800 border-rose-300 shadow-sm',
  PARTIAL: 'bg-amber-50 text-amber-800 border-amber-300 shadow-sm',
  PENDING: 'bg-slate-100 text-slate-800 border-slate-300 shadow-sm',
};

interface BadgeProps {
  status: StatusType | string;
}

export default function Badge({ status }: BadgeProps) {
  const normStatus = (String(status).toUpperCase() as StatusType) || 'PENDING';
  const badgeStyle = styles[normStatus] || styles.PENDING;

  const renderIcon = () => {
    switch (normStatus) {
      case 'VERIFIED':
        return <CheckIcon className="w-3.5 h-3.5 text-emerald-700" />;
      case 'FAILED':
        return <XMarkIcon className="w-3.5 h-3.5 text-rose-700" />;
      case 'PARTIAL':
        return <ExclamationTriangleIcon className="w-3.5 h-3.5 text-amber-700" />;
      case 'PENDING':
      default:
        return <ClockIcon className="w-3.5 h-3.5 text-slate-650" />;
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-extrabold tracking-wider border select-none ${badgeStyle}`}
    >
      {renderIcon()}
      {normStatus}
    </span>
  );
}

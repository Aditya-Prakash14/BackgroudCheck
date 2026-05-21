import React from 'react';
import { BuildingLibraryIcon } from '@heroicons/react/24/solid';

interface GovHeaderProps {
  title: string;
  subtitle?: string;
}

export default function GovHeader({ title, subtitle }: GovHeaderProps) {
  return (
    <div className="w-full bg-white border-b border-slate-200 mb-6">
      {/* 1. Tricolor Top Accent Line */}
      <div className="gov-border-gradient" />

      {/* 2. Top Ministry Metadata & Accessibility Utility Strip */}
      <div className="max-w-7xl mx-auto px-6 py-1.5 flex justify-between items-center text-[11px] text-slate-500 font-semibold border-b border-slate-100">
        <div className="flex items-center gap-4">
          <span>भारत सरकार | GOVERNMENT OF INDIA</span>
          <span className="hidden md:inline text-slate-300">|</span>
          <span className="hidden md:inline">राष्ट्रीय सूचना विज्ञान केंद्र (NIC)</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#main-content" className="hover:underline text-blue-600">Skip to main content</a>
          <span>|</span>
          <div className="flex gap-1.5">
            <button className="px-1 py-0.5 border border-slate-300 rounded bg-slate-50 hover:bg-slate-100 text-[10px]" title="Decrease Text Size">A-</button>
            <button className="px-1 py-0.5 border border-slate-300 rounded bg-slate-50 hover:bg-slate-100 text-[10px]" title="Normal Text Size">A</button>
            <button className="px-1 py-0.5 border border-slate-300 rounded bg-slate-50 hover:bg-slate-100 text-[10px]" title="Increase Text Size">A+</button>
          </div>
          <span>|</span>
          <button className="hover:underline font-bold text-blue-600">ENGLISH</button>
          <span>/</span>
          <button className="hover:underline text-slate-500">हिन्दी</button>
        </div>
      </div>

      {/* 3. Main Brand Portal Banner */}
      <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          {/* Stylized Crest Logo */}
          <div className="w-14 h-14 rounded-full bg-slate-100 border-2 border-[#0A2240] flex items-center justify-center shadow-sm shrink-0">
            <BuildingLibraryIcon className="w-7 h-7 text-[#0A2240]" />
          </div>
          <div>
            <h2 className="text-[10px] text-slate-500 uppercase tracking-widest font-extrabold leading-none">
              Ministry of Electronics & Information Technology
            </h2>
            <h1 className="text-2xl font-extrabold text-[#0A2240] font-serif tracking-tight mt-1">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Flag Graphic or Digital India Badge */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="px-3 py-1.5 border border-amber-300 rounded bg-amber-50/50 flex flex-col items-center">
            <span className="text-[9px] font-extrabold text-amber-800 tracking-wider uppercase leading-none">Secure Portal</span>
            <span className="text-[13px] font-bold text-slate-800 mt-1">UIDAI / Income Tax Mocked</span>
          </div>
          <div className="w-16 h-10 border border-slate-200 rounded flex flex-col overflow-hidden shadow-sm shrink-0">
            <div className="h-1/3 bg-[#FF9933]" />
            <div className="h-1/3 bg-white flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full border border-blue-800 animate-spin" style={{ animationDuration: '10s' }} />
            </div>
            <div className="h-1/3 bg-[#138808]" />
          </div>
        </div>
      </div>
    </div>
  );
}

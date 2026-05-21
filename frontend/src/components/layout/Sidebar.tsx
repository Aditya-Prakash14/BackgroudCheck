'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/auth.store';
import { 
  Squares2X2Icon, 
  UsersIcon, 
  ArrowLeftOnRectangleIcon, 
  BuildingLibraryIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/solid';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const [isOpen, setIsOpen] = useState(false);

  // If on login or register page, do not display the sidebar
  if (pathname === '/login' || pathname === '/register' || pathname === '/') {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navItems = [
    { label: 'System Dashboard', path: '/dashboard', icon: Squares2X2Icon },
    { label: 'Candidate Register', path: '/candidates', icon: UsersIcon },
  ];

  // Mobile Menu Button
  const MobileMenuButton = () => (
    <div className="md:hidden fixed top-4 left-4 z-40">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 bg-[#0A2240] text-white rounded-md hover:bg-[#081B33] transition-colors"
      >
        {isOpen ? (
          <XMarkIcon className="w-6 h-6" />
        ) : (
          <Bars3Icon className="w-6 h-6" />
        )}
      </button>
    </div>
  );

  return (
    <>
      <MobileMenuButton />
      
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`w-64 bg-[#0A2240] border-r border-slate-700 h-screen fixed left-0 top-0 flex flex-col justify-between z-30 shadow-lg text-white transition-transform duration-300 md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
      {/* Brand Header */}
      <div>
        <div className="p-6 border-b border-slate-750 bg-[#081B33]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-amber-500 flex items-center justify-center shadow-md">
              <BuildingLibraryIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-amber-400 font-extrabold text-sm leading-none tracking-wider font-serif">NBVP PORTAL</h1>
              <span className="text-[9px] font-bold text-slate-300 tracking-wider uppercase mt-0.5 block">GOVERNMENT OF INDIA</span>
            </div>
          </div>
          <div className="mt-3 text-[10px] text-slate-400 font-semibold uppercase tracking-widest border-t border-slate-700 pt-2">
            Verification Services
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1 mt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-md text-xs font-bold tracking-wider uppercase transition-all duration-200 ${
                  isActive
                    ? 'bg-amber-500 text-[#0A2240] shadow-sm font-extrabold border-l-4 border-l-[#0A2240]'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Recruiter profile info + Logout */}
      <div className="p-4 border-t border-slate-700 space-y-3 bg-[#081B33]">
        {user && (
          <div className="px-2 py-1">
            <p className="text-[10px] text-amber-400 uppercase tracking-widest font-bold">Authorized Officer</p>
            <p className="text-sm font-bold text-white mt-0.5 truncate">{user.name}</p>
            <p className="text-xs text-slate-400 truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={() => {
            handleLogout();
            setIsOpen(false);
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-xs font-bold tracking-wider uppercase text-red-400 hover:text-white hover:bg-red-600 transition-all duration-200"
        >
          <ArrowLeftOnRectangleIcon className="w-4 h-4 shrink-0" />
          Revoke Session
        </button>
      </div>
    </div>
    </>
  );
}

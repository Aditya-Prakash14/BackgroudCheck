'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerSchema, RegisterFormData } from '../../validations/schemas';
import api from '../../services/api';
import { BuildingLibraryIcon } from '@heroicons/react/24/solid';

export default function RegisterPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await api.post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      alert('Registration successful! Please login to proceed.');
      router.push('/login');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Registration failed. Email might already exist.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col justify-between relative overflow-hidden">
      {/* 1. Tricolor Banner Top Line */}
      <div className="gov-border-gradient" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Government Portal Logo Header */}
        <div className="text-center mb-6 max-w-md">
          <div className="w-16 h-16 rounded-full bg-white border-2 border-[#0A2240] flex items-center justify-center mx-auto mb-4 shadow-sm">
            <BuildingLibraryIcon className="w-8 h-8 text-[#0A2240]" />
          </div>
          <h2 className="text-[10px] text-slate-500 uppercase tracking-widest font-extrabold leading-none">
            Government of India
          </h2>
          <h1 className="text-xl font-extrabold text-[#0A2240] font-serif tracking-tight mt-1">
            National Background Verification Portal
          </h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">Officer Security Registration Portal</p>
        </div>

        {/* Register Card */}
        <div className="bg-white border border-slate-200 p-8 rounded-lg shadow-sm w-full max-w-md">
          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Officer Full Name</label>
              <input
                {...register('name')}
                type="text"
                placeholder="e.g. Dr. Ramesh Kumar"
                className="w-full bg-white border border-slate-350 text-slate-800 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder-slate-400"
              />
              {errors.name && (
                <p className="text-rose-600 text-xs mt-1.5 font-bold">{errors.name.message}</p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Registered Email Address</label>
              <input
                {...register('email')}
                type="email"
                placeholder="e.g. officer@nic.in"
                className="w-full bg-white border border-slate-350 text-slate-800 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder-slate-400"
              />
              {errors.email && (
                <p className="text-rose-600 text-xs mt-1.5 font-bold">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Secret Passcode / Password</label>
              <input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                className="w-full bg-white border border-slate-350 text-slate-800 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder-slate-400"
              />
              {errors.password && (
                <p className="text-rose-600 text-xs mt-1.5 font-bold">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Confirm Secret Passcode</label>
              <input
                {...register('confirmPassword')}
                type="password"
                placeholder="••••••••"
                className="w-full bg-white border border-slate-350 text-slate-800 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder-slate-400"
              />
              {errors.confirmPassword && (
                <p className="text-rose-600 text-xs mt-1.5 font-bold">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#0A2240] hover:bg-[#1E40AF] text-white py-3 rounded-md font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-55 flex items-center justify-center gap-2 shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating Account...
                </>
              ) : (
                'Create Portal Account'
              )}
            </button>
          </form>

          {/* Footer Link */}
          <p className="text-slate-500 text-xs text-center mt-6 font-semibold">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-700 hover:underline font-bold transition-all">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* 3. Security Warning Disclaimer Footer */}
      <div className="bg-[#0A2240] text-slate-400 text-[10px] text-center p-4 border-t border-slate-700 leading-normal font-semibold">
        <p className="max-w-3xl mx-auto">
          SECURITY NOTICE: This is an official federal government portal. Unauthorized attempts to upload candidate dossiers, 
          bypass access tokens, or scan background check logs are strictly monitored and punishable under Section 66 of the Information Technology Act.
        </p>
        <p className="mt-1 text-slate-500">
          Designed and hosted by the National Informatics Centre (NIC) &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}

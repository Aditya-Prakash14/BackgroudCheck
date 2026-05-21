'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../store/auth.store';
import CandidateForm from '../../../components/candidates/CandidateForm';
import GovHeader from '../../../components/layout/GovHeader';

export default function NewCandidatePage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);

  const handleSuccess = () => {
    router.push('/candidates');
  };

  const handleCancel = () => {
    router.push('/candidates');
  };

  return (
    <div className="pl-64 min-h-screen bg-[#F1F5F9] pb-12">
      <GovHeader title="National Background Verification Portal" subtitle="Register Candidate Profiles" />

      <div className="max-w-4xl mx-auto px-8 space-y-6">
        {/* Breadcrumbs */}
        <div className="flex gap-2 items-center text-xs text-slate-500 font-bold uppercase tracking-wider">
          <span className="hover:underline cursor-pointer transition-colors" onClick={handleCancel}>Candidates</span>
          <span>&bull;</span>
          <span className="text-[#0A2240]">Register Dossier</span>
        </div>

        {/* Form Container */}
        <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-sm">
          <div className="mb-6 border-b border-slate-100 pb-4">
            <h2 className="text-sm font-extrabold text-[#0A2240] uppercase tracking-wider">Form B-GV: Candidate Particulars</h2>
            <p className="text-xs text-slate-400 font-semibold mt-1">Please fill in all mandatory legal details. Double-check Aadhaar and PAN inputs before submitting.</p>
          </div>
          <CandidateForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </div>
      </div>
    </div>
  );
}

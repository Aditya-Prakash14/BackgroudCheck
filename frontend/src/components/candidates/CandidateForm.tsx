import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { candidateSchema, CandidateFormData } from '../../validations/schemas';
import api from '../../services/api';

interface CandidateFormProps {
  onSuccess: () => void;
  onCancel?: () => void;
  initialData?: CandidateFormData;
  candidateId?: string;
}

export default function CandidateForm({ onSuccess, onCancel, initialData, candidateId }: CandidateFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CandidateFormData>({
    resolver: zodResolver(candidateSchema),
    defaultValues: initialData ? {
      ...initialData,
      dob: initialData.dob ? new Date(initialData.dob).toISOString().split('T')[0] : '',
    } : undefined,
  });

  const onSubmit = async (data: CandidateFormData) => {
    try {
      const payload: any = { ...data };
      if (candidateId && payload.aadhaarNumber && payload.aadhaarNumber.includes('X')) {
        delete payload.aadhaarNumber; // Skip sending masked Aadhaar
      }
      if (candidateId) {
        await api.put(`/candidates/${candidateId}`, payload);
      } else {
        await api.post('/candidates', payload);
      }
      reset();
      onSuccess();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to submit candidate details.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Full Legal Name</label>
          <input
            {...register('fullName')}
            type="text"
            placeholder="e.g. Rahul Sharma"
            className="w-full bg-white border border-slate-350 text-slate-800 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder-slate-400"
          />
          {errors.fullName && (
            <p className="text-rose-600 text-xs mt-2 font-bold">{errors.fullName.message}</p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email Address</label>
          <input
            {...register('email')}
            type="email"
            placeholder="e.g. rahul@example.com"
            className="w-full bg-white border border-slate-350 text-slate-800 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder-slate-400"
          />
          {errors.email && (
            <p className="text-rose-600 text-xs mt-2 font-bold">{errors.email.message}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Phone Number</label>
          <input
            {...register('phone')}
            type="tel"
            maxLength={10}
            placeholder="e.g. 9876543210"
            className="w-full bg-white border border-slate-350 text-slate-800 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder-slate-400"
          />
          {errors.phone && (
            <p className="text-rose-600 text-xs mt-2 font-bold">{errors.phone.message}</p>
          )}
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Date of Birth</label>
          <input
            {...register('dob')}
            type="date"
            className="w-full bg-white border border-slate-350 text-slate-800 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
          />
          {errors.dob && (
            <p className="text-rose-600 text-xs mt-2 font-bold">{errors.dob.message}</p>
          )}
        </div>

        {/* Aadhaar Number */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Aadhaar Number (12 digits)</label>
          <input
            {...register('aadhaarNumber')}
            type="text"
            maxLength={12}
            placeholder="e.g. 123456789012"
            className="w-full bg-white border border-slate-350 text-slate-800 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder-slate-400"
          />
          {errors.aadhaarNumber && (
            <p className="text-rose-600 text-xs mt-2 font-bold">{errors.aadhaarNumber.message}</p>
          )}
        </div>

        {/* PAN Number */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">PAN Number (e.g. ABCDE1234F)</label>
          <input
            {...register('panNumber')}
            type="text"
            maxLength={10}
            placeholder="e.g. ABCDE1234F"
            className="w-full bg-white border border-slate-350 text-slate-800 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder-slate-400 uppercase"
          />
          {errors.panNumber && (
            <p className="text-rose-600 text-xs mt-2 font-bold">{errors.panNumber.message}</p>
          )}
        </div>
      </div>

      {/* Address */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Residential Address</label>
        <textarea
          {...register('address')}
          rows={3}
          placeholder="Enter full residential address..."
          className="w-full bg-white border border-slate-350 text-slate-800 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder-slate-400"
        />
        {errors.address && (
          <p className="text-rose-600 text-xs mt-2 font-bold">{errors.address.message}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors text-xs font-bold rounded uppercase tracking-wider"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 bg-[#0A2240] hover:bg-[#1E40AF] text-white font-bold text-xs tracking-wider uppercase rounded shadow-sm disabled:opacity-55 flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {candidateId ? 'Updating Details...' : 'Saving Details...'}
            </>
          ) : (
            candidateId ? 'Update Details' : 'Register Candidate'
          )}
        </button>
      </div>
    </form>
  );
}

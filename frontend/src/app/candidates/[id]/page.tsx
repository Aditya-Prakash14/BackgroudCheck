'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../../services/api';
import { useAuthStore } from '../../../store/auth.store';
import Badge from '../../../components/ui/Badge';
import GovHeader from '../../../components/layout/GovHeader';
import { 
  UserIcon, 
  DocumentTextIcon, 
  Cog6ToothIcon,
  PencilSquareIcon
} from '@heroicons/react/24/solid';
import CandidateForm from '../../../components/candidates/CandidateForm';

interface Log {
  id: string;
  verificationType: 'AADHAAR' | 'PAN' | string;
  requestPayload: any;
  responsePayload: any;
  verificationStatus: string;
  verifiedAt: string;
}

interface Candidate {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  aadhaarNumber: string;
  panNumber: string;
  dob: string;
  address: string;
  status: string;
  createdAt: string;
  verificationLogs: Log[];
}

export default function CandidateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const candidateId = params.id as string;

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Accordion state tracker by log id
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const fetchCandidate = () => {
    if (!token) return;
    setLoading(true);
    api.get(`/candidates/${candidateId}`)
      .then((res) => {
        setCandidate(res.data.data);
      })
      .catch((err) => {
        console.error('Failed to load candidate', err);
        alert('Could not find candidate. Redirecting...');
        router.push('/candidates');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    fetchCandidate();
  }, [candidateId, token]);

  const handleStartVerification = async () => {
    if (!candidate) return;
    setVerifying(true);

    try {
      const res = await api.post(`/verifications/${candidateId}/start`);
      alert(`Verification run completed! Calculated status: ${res.data.data.overallStatus}`);
      fetchCandidate(); // Refresh details
    } catch (err: any) {
      alert(err.response?.data?.error || 'Verification run failed.');
    } finally {
      setVerifying(false);
    }
  };

  const handleDownloadReport = async () => {
    if (!candidate) return;
    setDownloading(true);

    try {
      const res = await api.get(`/reports/${candidateId}`, {
        responseType: 'blob', // Crucial for receiving PDF binary files
      });

      // Trigger browser file download
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `BGV_Report_${candidate.fullName.replace(/\s+/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      alert('Failed to generate PDF report. Make sure checks have been run.');
    } finally {
      setDownloading(false);
    }
  };

  const toggleLogExpand = (id: string) => {
    setExpandedLogId(expandedLogId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="bg-[#F1F5F9] min-h-screen">
        <GovHeader title="National Background Verification Portal" subtitle="Dossier Review & Clearance" />
        <div className="p-8 space-y-8">
          <div className="h-4 bg-slate-200 animate-pulse rounded w-24" />
          <div className="h-28 bg-white border border-slate-200 animate-pulse rounded-lg" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-96 bg-white border border-slate-200 animate-pulse rounded-lg" />
            <div className="h-96 bg-white border border-slate-200 animate-pulse rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!candidate) return null;

  return (
    <div className="min-h-screen bg-[#F1F5F9] pb-12">
      <GovHeader title="National Background Verification Portal" subtitle="Dossier Review & Clearance" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Back button */}
        <div>
          <Link
            href="/candidates"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#0A2240] uppercase tracking-wider transition-all select-none"
          >
            &larr; Return to Register Directory
          </Link>
        </div>

        {/* Header Card / Action Bar */}
        <div className="bg-white border border-slate-200 p-6 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-lg select-none">
              <UserIcon className="w-6 h-6 text-[#0A2240]" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-lg font-extrabold text-[#0A2240] tracking-wide">{candidate.fullName}</h1>
                <Badge status={candidate.status} />
              </div>
              <p className="text-xs text-slate-500 font-semibold mt-1">{candidate.email}</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 border border-slate-350 hover:bg-slate-50 text-slate-700 font-bold text-xs tracking-wider uppercase rounded transition-all flex items-center gap-2 select-none"
            >
              <PencilSquareIcon className="w-4 h-4 text-slate-500" />
              Edit Dossier
            </button>

            <button
              onClick={handleDownloadReport}
              disabled={downloading || candidate.status === 'PENDING'}
              className="px-4 py-2 border border-slate-350 hover:bg-slate-50 text-slate-700 font-bold text-xs tracking-wider uppercase rounded disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-2 select-none"
            >
              {downloading ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5 text-slate-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Compiling...
                </>
              ) : (
                <>
                  <DocumentTextIcon className="w-4 h-4" />
                  Clearance Report
                </>
              )}
            </button>

            <button
              onClick={handleStartVerification}
              disabled={verifying || candidate.status === 'VERIFIED'}
              className="px-4 py-2 bg-[#0A2240] hover:bg-[#1E40AF] text-white font-bold text-xs tracking-wider uppercase rounded disabled:opacity-40 disabled:pointer-events-none shadow-sm transition-all flex items-center gap-2 select-none"
            >
              {verifying ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Running Check...
                </>
              ) : (
                <>
                  <Cog6ToothIcon className="w-4 h-4" />
                  Run Verification Check
                </>
              )}
            </button>
          </div>
        </div>

        {/* Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Personal Info Summary */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
            <div className="mb-6 border-b border-slate-100 pb-4">
              <h2 className="text-sm font-extrabold text-[#0A2240] uppercase tracking-wider">Candidate Particulars Dossier</h2>
              <p className="text-xs text-slate-400 font-semibold mt-1">Official credentials registered under security check</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-150 rounded">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Full Legal Name</span>
                <p className="text-sm font-extrabold text-[#0A2240] mt-1">{candidate.fullName}</p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-150 rounded">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Registered Email</span>
                <p className="text-sm font-bold text-slate-700 mt-1 truncate">{candidate.email}</p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-150 rounded">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Contact Number</span>
                <p className="text-sm font-bold text-slate-700 mt-1">{candidate.phone}</p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-150 rounded">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date of Birth</span>
                <p className="text-sm font-bold text-slate-700 mt-1">
                  {new Date(candidate.dob).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-150 rounded">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Aadhaar ID (Secure Masked)</span>
                <p className="text-sm font-extrabold text-slate-800 mt-1 font-mono">{candidate.aadhaarNumber}</p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-150 rounded">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Income Tax PAN ID</span>
                <p className="text-sm font-extrabold text-slate-800 mt-1 font-mono tracking-wider">{candidate.panNumber}</p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-slate-50 border border-slate-150 rounded">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Registered Residential Address</span>
              <p className="text-xs font-bold text-slate-600 mt-1.5 leading-relaxed">{candidate.address}</p>
            </div>
          </div>

          {/* Verification Timeline */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
            <div className="mb-6 border-b border-slate-100 pb-4">
              <h2 className="text-sm font-extrabold text-[#0A2240] uppercase tracking-wider">Audit & Verification Timeline</h2>
              <p className="text-xs text-slate-400 font-semibold mt-1">Official audit timeline history of identity checks</p>
            </div>

            {candidate.verificationLogs && candidate.verificationLogs.length > 0 ? (
              <div className="relative pl-5 space-y-6 border-l border-slate-200 ml-2">
                {candidate.verificationLogs.map((log) => {
                  const isAadhaar = log.verificationType === 'AADHAAR';
                  const isVerified = log.verificationStatus === 'verified';
                  const isExpanded = expandedLogId === log.id;

                  return (
                    <div key={log.id} className="relative">
                      {/* Time indicator Dot */}
                      <div className={`absolute -left-[29px] top-1.5 w-4 h-4 rounded-full border-2 border-white ${
                        isVerified ? 'bg-emerald-600' : 'bg-rose-600'
                      }`} />

                      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded hover:border-slate-350 transition-all">
                        <div className="flex justify-between items-center">
                          <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border ${
                            isAadhaar
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          }`}>
                            {log.verificationType} Check
                          </span>
                          <span className={`text-[10px] font-extrabold ${
                            isVerified ? 'text-emerald-700' : 'text-rose-700'
                          }`}>
                            {isVerified ? 'APPROVED' : 'REJECTED'}
                          </span>
                        </div>
                        
                        <div className="mt-3 flex justify-between items-center text-[11px]">
                          <span className="text-slate-400 font-bold">
                            {new Date(log.verifiedAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          <button
                            onClick={() => toggleLogExpand(log.id)}
                            className="text-blue-700 font-extrabold hover:underline"
                          >
                            {isExpanded ? 'Hide Details' : 'Verify Logs'}
                          </button>
                        </div>

                        {/* Expandable accordion */}
                        {isExpanded && (
                          <div className="mt-3 p-2.5 bg-slate-900 border border-slate-850 rounded text-[10px] font-mono text-emerald-400 leading-normal">
                            <p className="text-slate-500 font-bold border-b border-slate-800 pb-0.5 mb-1.5">UIDAI/NREGA PAYLOAD</p>
                            <pre className="overflow-x-auto">{JSON.stringify(log.responsePayload, null, 2)}</pre>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 text-slate-400 text-xs font-bold">
                No official screening checks executed.
                <button
                  onClick={handleStartVerification}
                  className="block text-[10px] font-extrabold text-blue-700 hover:underline mx-auto mt-2 uppercase tracking-wider"
                >
                  Initiate System Check
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="mb-6 border-b border-slate-100 pb-4 flex justify-between items-center">
              <div>
                <h2 className="text-sm font-extrabold text-[#0A2240] uppercase tracking-wider">Form B-GV/U: Update Candidate Particulars</h2>
                <p className="text-xs text-slate-400 font-semibold mt-1">Authorized update of candidate registry dossier.</p>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="text-slate-450 hover:text-slate-700 text-2xl font-bold select-none cursor-pointer"
              >
                &times;
              </button>
            </div>
            <CandidateForm
              candidateId={candidateId}
              initialData={{
                fullName: candidate.fullName,
                email: candidate.email,
                phone: candidate.phone,
                aadhaarNumber: candidate.aadhaarNumber,
                panNumber: candidate.panNumber,
                dob: candidate.dob,
                address: candidate.address,
              }}
              onSuccess={() => {
                setIsEditing(false);
                fetchCandidate();
              }}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

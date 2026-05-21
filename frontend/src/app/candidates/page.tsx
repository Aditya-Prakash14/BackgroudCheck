'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../services/api';
import { useAuthStore } from '../../store/auth.store';
import Badge from '../../components/ui/Badge';
import GovHeader from '../../components/layout/GovHeader';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  MagnifyingGlassIcon, 
  FolderIcon 
} from '@heroicons/react/24/solid';

interface Candidate {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  aadhaarNumber: string;
  panNumber: string;
  status: string;
  createdAt: string;
}

export default function CandidatesPage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Search State
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Toast State
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // 1. Redirect if not authenticated
  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);

  // 2. Search Debounce Logic
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page to 1 on new search
    }, 500);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [search]);

  // 3. Fetch candidates on change of page / debouncedSearch
  const fetchCandidates = () => {
    if (!token) return;
    setLoading(true);
    api.get(`/candidates?page=${page}&limit=8&search=${encodeURIComponent(debouncedSearch)}`)
      .then((res) => {
        const { candidates: fetchedCandidates, total, pages } = res.data.data;
        setCandidates(fetchedCandidates);
        setTotalItems(total);
        setTotalPages(pages || 1);
      })
      .catch((err) => {
        console.error('Failed to load candidates', err);
        showToast('error', 'Could not load candidate list.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCandidates();
  }, [page, debouncedSearch, token]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}'s profile? All verification logs will be deleted permanently.`)) {
      return;
    }

    try {
      await api.delete(`/candidates/${id}`);
      showToast('success', `Candidate ${name} was deleted successfully.`);
      fetchCandidates();
    } catch (err: any) {
      showToast('error', err.response?.data?.error || 'Failed to delete candidate.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] pb-12">
      <GovHeader title="National Background Verification Portal" subtitle="Official Register of Candidate Dossiers" />

      {/* Toast Alert */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded border shadow-lg transition-all duration-500 animate-slide-in ${
          toast.type === 'success'
            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
            : 'bg-rose-50 text-rose-800 border-rose-300'
        }`}>
          {toast.type === 'success' ? (
            <CheckCircleIcon className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <XCircleIcon className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span className="text-xs font-bold tracking-wider uppercase">{toast.message}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 border border-slate-200 rounded-lg shadow-sm">
          <div>
            <h3 className="text-base font-extrabold text-[#0A2240]">Dossier Records Directory</h3>
            <p className="text-xs text-slate-500 font-semibold mt-1">Authorized officers can review identities, perform checks, and download PDF clearance files.</p>
          </div>
          <Link
            href="/candidates/new"
            className="px-5 py-2.5 bg-[#0A2240] hover:bg-[#1E40AF] text-white rounded-md font-bold text-xs uppercase tracking-wider transition-all self-start sm:self-auto shadow-sm"
          >
            + Register Candidate
          </Link>
        </div>

        {/* Filter / Search Bar */}
        <div className="flex bg-white border border-slate-200 p-4 rounded-lg gap-4 items-center shadow-sm">
          <MagnifyingGlassIcon className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidate registers by full name or email address..."
            className="flex-1 bg-transparent text-slate-800 text-sm focus:outline-none placeholder-slate-400 font-medium"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="text-xs text-slate-500 hover:text-slate-800 font-bold transition-all px-2"
            >
              Clear
            </button>
          )}
        </div>

        {/* Main Table / Loader */}
        {loading ? (
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden p-6 space-y-4 shadow-sm">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-14 bg-slate-50 border border-slate-100 rounded animate-pulse" />
            ))}
          </div>
        ) : candidates.length > 0 ? (
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-[#0A2240] text-white">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Candidate Particulars</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Email Address</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Contact Number</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Status Badge</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Submission Date</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right">Verification Dossier</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((c) => (
                    <tr key={c.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-extrabold text-[#0A2240] tracking-wide">{c.fullName}</td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-600">{c.email}</td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-500">{c.phone}</td>
                      <td className="px-6 py-4"><Badge status={c.status} /></td>
                      <td className="px-6 py-4 text-xs text-slate-500 font-bold">
                        {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Link
                          href={`/candidates/${c.id}`}
                          className="inline-block px-3 py-1.5 border border-[#0A2240] text-[#0A2240] hover:bg-[#0A2240] hover:text-white text-xs font-bold rounded transition-all"
                        >
                          Review Dossier
                        </Link>
                        <button
                          onClick={() => handleDelete(c.id, c.fullName)}
                          className="px-3 py-1.5 border border-red-300 text-red-700 hover:bg-red-50 text-xs font-bold rounded transition-all"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List */}
            <div className="lg:hidden divide-y divide-slate-200">
              {candidates.map((c) => (
                <div key={c.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-extrabold text-[#0A2240] tracking-wide truncate">{c.fullName}</span>
                    <Badge status={c.status} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-600 truncate">{c.email}</p>
                    <p className="text-xs font-semibold text-slate-500">{c.phone}</p>
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className="text-xs text-slate-500 font-bold">
                      {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <div className="flex gap-2">
                      <Link
                        href={`/candidates/${c.id}`}
                        className="px-3 py-1.5 border border-[#0A2240] text-[#0A2240] hover:bg-[#0A2240] hover:text-white text-xs font-bold rounded transition-all"
                      >
                        Review
                      </Link>
                      <button
                        onClick={() => handleDelete(c.id, c.fullName)}
                        className="px-3 py-1.5 border border-red-300 text-red-700 hover:bg-red-50 text-xs font-bold rounded transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 px-4 sm:px-6 py-4 border-t border-slate-200 bg-slate-50">
              <span className="text-xs text-slate-500 font-bold">
                Dossiers: showing page {page} of {totalPages} &bull; {totalItems} total records
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 bg-white border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded disabled:opacity-40 disabled:hover:bg-white transition-all select-none"
                >
                  &larr; Previous Page
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 bg-white border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded disabled:opacity-40 disabled:hover:bg-white transition-all select-none"
                >
                  Next Page &rarr;
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white border border-slate-200 border-dashed rounded-lg p-16 text-center space-y-6 shadow-sm">
            <FolderIcon className="w-12 h-12 text-slate-400 mx-auto" />
            <div className="space-y-2">
              <h3 className="text-base font-extrabold text-[#0A2240]">No Candidate Dossiers Found</h3>
              <p className="text-xs text-slate-500 font-semibold">
                {debouncedSearch
                  ? `No dossiers match search query "${debouncedSearch}".`
                  : 'No candidate records have been registered under this portal.'}
              </p>
            </div>
            <Link
              href="/candidates/new"
              className="inline-block px-5 py-2.5 bg-[#0A2240] hover:bg-[#1E40AF] text-white rounded-md font-bold text-xs uppercase tracking-wider transition-all shadow-sm"
            >
              Register Candidate Profile
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

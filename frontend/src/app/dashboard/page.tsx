'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { InformationCircleIcon } from '@heroicons/react/24/solid';
import api from '../../services/api';
import { useAuthStore } from '../../store/auth.store';
import StatCard from '../../components/dashboard/StatCard';
import Badge from '../../components/ui/Badge';
import GovHeader from '../../components/layout/GovHeader';

interface Stats {
  total: number;
  verified: number;
  failed: number;
  pending: number;
  partial: number;
  recentCandidates: Array<{
    id: string;
    fullName: string;
    email: string;
    status: string;
    createdAt: string;
  }>;
  chartData: Array<{
    day: string;
    count: number;
  }>;
}

export default function DashboardPage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    api.get('/dashboard/stats')
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => {
        console.error('Failed to fetch dashboard stats', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token, router]);

  if (loading) {
    return (
      <div className="bg-[#F1F5F9] min-h-screen md:ml-64">
        <GovHeader title="National Background Verification Portal" subtitle="System Dashboard Overview" />
        <div className="p-6 sm:p-8 space-y-8">
          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 bg-white border border-slate-200 animate-pulse rounded-lg" />
            ))}
          </div>

          {/* Charts & Table Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-2 h-96 bg-white border border-slate-200 animate-pulse rounded-lg" />
            <div className="h-96 bg-white border border-slate-200 animate-pulse rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] pb-12 md:ml-64">
      <GovHeader title="National Background Verification Portal" subtitle="System Dashboard Overview" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-14 md:pt-0">
        
        {/* Government Compliance Warning Box */}
        <div className="bg-blue-50 border-l-4 border-l-[#0A2240] p-4 rounded-r-md shadow-sm">
          <div className="flex gap-3">
            <InformationCircleIcon className="w-5 h-5 text-[#0A2240] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-[#0A2240] uppercase tracking-wider">COMPLIANCE NOTICE (Section 29, Aadhaar Act)</h4>
              <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                In compliance with federal data protection protocols, all Aadhaar numbers displayed within this registry are securely masked. 
                Raw biometric/identity information is never written to public log streams or local databases.
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Action Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 border border-slate-200 rounded-lg shadow-sm">
          <div>
            <h3 className="text-base font-extrabold text-[#0A2240]">Authorized Screening Operations</h3>
            <p className="text-xs text-slate-500 font-semibold mt-1">Manage, verify, and generate certified screening reports for registered candidates.</p>
          </div>
          <Link
            href="/candidates"
            className="px-5 py-2.5 bg-[#0A2240] hover:bg-[#1E40AF] text-white rounded-md font-bold text-xs uppercase tracking-wider transition-all shadow-sm"
          >
            Manage Candidates Register
          </Link>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Total Submissions" value={stats?.total ?? 0} color="blue" />
          <StatCard label="Verified Dossiers" value={stats?.verified ?? 0} color="green" />
          <StatCard label="Awaiting Check" value={stats?.pending ?? 0} color="yellow" />
          <StatCard label="Failed Checks" value={stats?.failed ?? 0} color="red" />
        </div>

        {/* Main Analytics Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Charts Trend Panel */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
            <div className="mb-6 border-b border-slate-100 pb-4">
              <h2 className="text-sm font-extrabold text-[#0A2240] uppercase tracking-wider">Registration Volume Trend</h2>
              <p className="text-xs text-slate-400 font-semibold mt-1">Dossiers submitted for screening over the past 7 days</p>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats?.chartData || []}>
                  <XAxis dataKey="day" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#cbd5e1',
                      borderRadius: '4px',
                      color: '#0f172a',
                      fontSize: '12px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#1E40AF"
                    strokeWidth={2.5}
                    dot={{ r: 4, stroke: '#1E40AF', strokeWidth: 2, fill: '#ffffff' }}
                    activeDot={{ r: 6, fill: '#FF9933' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activities List */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="mb-6 border-b border-slate-100 pb-4">
                <h2 className="text-sm font-extrabold text-[#0A2240] uppercase tracking-wider">Recent Dossier Submissions</h2>
                <p className="text-xs text-slate-400 font-semibold mt-1">Audit trail of newly registered profiles</p>
              </div>

              <div className="space-y-3">
                {stats && stats.recentCandidates.length > 0 ? (
                  stats.recentCandidates.map((c) => (
                    <div key={c.id} className="flex justify-between items-center p-3 rounded border border-slate-100 bg-slate-50 hover:bg-slate-100/70 transition-all">
                      <div className="overflow-hidden pr-2">
                        <Link href={`/candidates/${c.id}`} className="text-xs font-bold text-[#0A2240] hover:underline truncate block">
                          {c.fullName}
                        </Link>
                        <span className="text-[10px] text-slate-500 font-medium block truncate mt-0.5">{c.email}</span>
                      </div>
                      <Badge status={c.status} />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400 text-xs font-bold">
                    No recent candidate profiles.
                  </div>
                )}
              </div>
            </div>

            <Link
              href="/candidates/new"
              className="w-full text-center mt-6 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#0A2240] rounded-md font-bold text-xs tracking-wider uppercase block"
            >
              + Register New Candidate
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from 'next';
import { Inter, Lora } from 'next/font/google';
import './globals.css';
import Sidebar from '../components/layout/Sidebar';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: 'National Background Verification Portal (NBVP)',
  description: 'Official background verification platform for candidate identity checks, KYC, Aadhaar and PAN mocks, and PDF report downloads.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${lora.variable} font-sans bg-[#F1F5F9] text-slate-850 min-h-screen overflow-x-hidden`} suppressHydrationWarning>
        {/* Dashboard Shell Wrapper */}
        <div className="flex">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content Area */}
          <main className="flex-1 min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

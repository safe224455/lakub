import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { MainNav } from '@/components/main-nav';
import { MainLoading } from '@/components/loading';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ระบบจัดการการลา',
  description: 'ระบบจัดการการลาพนักงาน',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="th">
      <body className={inter.className}>
        <MainLoading>
          <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
            <MainNav />
            <main className="p-2 sm:p-4 md:p-6">
              {children}
            </main>
          </div>
        </MainLoading>
      </body>
    </html>
  );
}
import type { Metadata } from 'next';
import Sidebar from '@/components/admin/Sidebar';
import AdminAuthGuard from '@/components/admin/AdminAuthGuard';

export const metadata: Metadata = {
  title: 'Tarek 360 City Admin — Dashboard',
  description: 'Admin dashboard for Tarek 360 City virtual tour management',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthGuard>
      <div
        className="flex min-h-screen"
        style={{ background: '#0a0a14', overflowY: 'auto', overflowX: 'hidden' }}
      >
        <Sidebar />
        <main className="flex-1 min-h-screen overflow-y-auto">
          {children}
        </main>
      </div>
    </AdminAuthGuard>
  );
}

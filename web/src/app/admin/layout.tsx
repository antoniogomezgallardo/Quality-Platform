'use client';

import { AdminRoute } from '../../components/auth/admin-route';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminHeader } from './components/AdminHeader';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-100">
        <div className="flex">
          <AdminSidebar />
          <div className="flex-1 ml-64">
            <AdminHeader />
            <main className="p-6">
              {children}
            </main>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
}
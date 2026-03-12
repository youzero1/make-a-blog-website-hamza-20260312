import { checkAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminLoginForm from '@/components/AdminLoginForm';
import AdminDashboard from '@/components/AdminDashboard';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const isAuthenticated = checkAuth();

  if (!isAuthenticated) {
    return <AdminLoginForm />;
  }

  return <AdminDashboard />;
}

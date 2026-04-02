import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useUserStore } from '@libiland/shared';

const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AuditListPage = lazy(() => import('./pages/AuditListPage'));
const UserManagePage = lazy(() => import('./pages/UserManagePage'));
const ReportHandlePage = lazy(() => import('./pages/ReportHandlePage'));

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-64">
      <span className="loading loading-spinner loading-lg text-primary" />
    </div>
  );
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const isAdmin = useUserStore((s) => s.isAdmin);
  if (!isAdmin) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin/dashboard"
            element={<AdminRoute><AdminDashboard /></AdminRoute>}
          />
          <Route
            path="/admin/audit"
            element={<AdminRoute><AuditListPage /></AdminRoute>}
          />
          <Route
            path="/admin/user"
            element={<AdminRoute><UserManagePage /></AdminRoute>}
          />
          <Route
            path="/admin/report"
            element={<AdminRoute><ReportHandlePage /></AdminRoute>}
          />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

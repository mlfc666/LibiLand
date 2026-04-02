import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useUserStore } from '@libiland/shared';

const HomePage = lazy(() => import('./pages/HomePage'));
const VideoDetailPage = lazy(() => import('./pages/VideoDetailPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const PublishPage = lazy(() => import('./pages/PublishPage'));
const MyVideosPage = lazy(() => import('./pages/MyVideosPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const CollectPage = lazy(() => import('./pages/CollectPage'));

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-64">
      <span className="loading loading-spinner loading-lg text-primary" />
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useUserStore((s) => s.isLoggedIn);
  if (!isLoggedIn) {
    return <Navigate to="/user/login" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/video/list" element={<HomePage />} />
          <Route path="/video/detail/:id" element={<VideoDetailPage />} />
          <Route path="/video/search" element={<SearchPage />} />
          <Route path="/user/login" element={<LoginPage />} />
          <Route path="/user/register" element={<RegisterPage />} />
          <Route
            path="/video/publish"
            element={
              <ProtectedRoute>
                <PublishPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/video/my"
            element={
              <ProtectedRoute>
                <MyVideosPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/collect"
            element={
              <ProtectedRoute>
                <CollectPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

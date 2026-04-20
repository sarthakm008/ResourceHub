import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const FeedPage = lazy(() => import("./pages/FeedPage"));
const SubmitResourcePage = lazy(() => import("./pages/SubmitResourcePage"));
const ResourceDetailPage = lazy(() => import("./pages/ResourceDetailPage"));
const EditResourcePage = lazy(() => import("./pages/EditResourcePage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));

function Loader() {
  return <div className="mx-auto max-w-6xl px-4 py-6">Loading page...</div>;
}

export default function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Navigate to="/feed" replace />} />
            <Route path="/feed" element={<FeedPage />} />
            <Route path="/submit" element={<SubmitResourcePage />} />
            <Route path="/resources/:id" element={<ResourceDetailPage />} />
            <Route path="/resources/:id/edit" element={<EditResourcePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

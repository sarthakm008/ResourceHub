import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
        <p className="mt-1 text-sm text-slate-500">Your StudyVault account details</p>

        <div className="mt-6 space-y-3">
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Email</p>
            <p className="text-sm text-slate-800">{user?.email}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">User ID</p>
            <p className="break-all text-sm text-slate-800">{user?.uid}</p>
          </div>
        </div>

        <button
          className="mt-6 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

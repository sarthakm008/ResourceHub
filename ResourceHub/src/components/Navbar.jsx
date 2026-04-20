import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/feed" className="text-lg font-bold text-slate-900">
          StudyVault
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <NavLink to="/feed" className="text-slate-600 hover:text-slate-900">
                Feed
              </NavLink>
              <NavLink to="/submit" className="text-slate-600 hover:text-slate-900">
                Submit
              </NavLink>
              <NavLink to="/dashboard" className="text-slate-600 hover:text-slate-900">
                Dashboard
              </NavLink>
              <NavLink to="/profile" className="text-slate-600 hover:text-slate-900">
                Profile
              </NavLink>
              <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-700 hover:bg-slate-50" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="text-slate-600 hover:text-slate-900">
                Login
              </NavLink>
              <NavLink to="/signup" className="rounded-lg bg-blue-600 px-3 py-1.5 font-medium text-white hover:bg-blue-700">
                Sign Up
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

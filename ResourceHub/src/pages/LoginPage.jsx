import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const redirectTo = location.state?.from?.pathname || "/feed";

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError("");
      await login(form.email, form.password);
      navigate(redirectTo, { replace: true });
    } catch (submitError) {
      setError(submitError.message || "Unable to sign in");
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    try {
      setLoading(true);
      setError("");
      await loginWithGoogle();
      navigate(redirectTo, { replace: true });
    } catch (googleError) {
      setError(googleError.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-md rounded-xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Login to StudyVault</h1>
        <p className="mt-1 text-sm text-slate-500">Access your resources and bookmarks</p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <input
            className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={onChange}
            required
          />
          <input
            className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={onChange}
            required
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <button
          type="button"
          disabled={loading}
          onClick={onGoogle}
          className="mt-3 w-full rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed"
        >
          Continue with Google
        </button>

        <p className="mt-4 text-center text-sm text-slate-600">
          No account?{" "}
          <Link className="font-medium text-blue-600 hover:underline" to="/signup">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

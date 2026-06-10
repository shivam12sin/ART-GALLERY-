import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = location.state?.from || "/";
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <form className="form auth-form" onSubmit={handleSubmit}>
        <p className="eyebrow">Welcome back</p>
        <h1>Login</h1>
        {from !== "/" && (
          <p className="info-banner" style={{ fontSize: "0.85rem" }}>
            Please login to continue.
          </p>
        )}
        {error && <p className="alert">{error}</p>}
        <label className="form-label">
          Email address
          <input
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </label>
        <label className="form-label">
          Password
          <input
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </label>
        <button className="primary-button" type="submit" disabled={loading} style={{ width: "100%", marginTop: 4 }}>
          {loading ? <><span className="spinner" /> Logging in…</> : "Login"}
        </button>
        <p className="auth-divider">
          New user? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </main>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "customer" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <form className="form auth-form" onSubmit={handleSubmit}>
        <p className="eyebrow">Join the gallery</p>
        <h1>Create account</h1>
        {error && <p className="alert">{error}</p>}
        <label className="form-label">
          Full name
          <input
            placeholder="Your full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </label>
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
            placeholder="Min. 6 characters"
            minLength="6"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </label>
        <label className="form-label">
          I am a…
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="customer">Customer — I want to buy art</option>
            <option value="artist">Artist — I want to sell art</option>
          </select>
        </label>
        <button className="primary-button" type="submit" disabled={loading} style={{ width: "100%", marginTop: 4 }}>
          {loading ? <><span className="spinner" /> Creating account…</> : "Create account"}
        </button>
        <p className="auth-divider">
          Already registered? <Link to="/login">Login</Link>
        </p>
      </form>
    </main>
  );
}

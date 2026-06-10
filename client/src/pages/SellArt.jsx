import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api/http";

const CATEGORIES = ["Contemporary", "Landscape", "Abstract", "Portrait", "Sculpture", "Photography"];

const EMPTY_FORM = {
  title: "",
  category: "Contemporary",
  medium: "",
  dimensions: "",
  year: new Date().getFullYear(),
  price: "",
  imageUrl: "",
  description: "",
};

export default function SellArt() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await apiRequest("/artworks", {
        method: "POST",
        body: JSON.stringify({ ...form, price: Number(form.price), year: Number(form.year) }),
      });
      navigate("/my-artworks", { state: { notice: "Artwork published successfully!" } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page narrow">
      <div className="page-heading">
        <p className="eyebrow">Artist portal</p>
        <h1>Submit artwork</h1>
        <p style={{ color: "var(--muted)", marginTop: 8 }}>
          Share your work with collectors and art lovers. All fields are required.
        </p>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        {error && <p className="alert">{error}</p>}

        <div className="form-grid">
          <label className="form-label">
            Artwork title
            <input name="title" value={form.title} onChange={update} placeholder="e.g. Morning Light" required />
          </label>
          <label className="form-label">
            Category
            <select name="category" value={form.category} onChange={update}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label className="form-label">
            Medium
            <input name="medium" value={form.medium} onChange={update} placeholder="e.g. Oil on canvas" required />
          </label>
          <label className="form-label">
            Dimensions
            <input name="dimensions" value={form.dimensions} onChange={update} placeholder="e.g. 24 × 36 in" required />
          </label>
          <label className="form-label">
            Year created
            <input name="year" type="number" value={form.year} onChange={update} min="1900" max={new Date().getFullYear()} required />
          </label>
          <label className="form-label">
            Price (INR)
            <input name="price" type="number" value={form.price} onChange={update} placeholder="e.g. 45000" min="0" required />
          </label>
        </div>

        <label className="form-label">
          Image URL
          <input name="imageUrl" value={form.imageUrl} onChange={update} placeholder="https://…" required />
        </label>

        {form.imageUrl && (
          <img
            src={form.imageUrl}
            alt="Preview"
            style={{ width: "100%", maxHeight: 240, objectFit: "cover", borderRadius: "var(--radius)", border: "1px solid var(--line)" }}
            onError={(e) => { e.target.style.display = "none"; }}
          />
        )}

        <label className="form-label">
          Artwork story
          <textarea name="description" value={form.description} onChange={update} placeholder="Describe the inspiration, process, or story behind this work…" required />
        </label>

        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? <><span className="spinner" /> Publishing…</> : "Publish artwork"}
        </button>
      </form>
    </main>
  );
}

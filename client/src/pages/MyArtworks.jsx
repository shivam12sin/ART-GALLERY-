import { Edit3, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { apiRequest } from "../api/http";
import { useApi } from "../hooks/useApi";
import { formatCurrency } from "../utils/format";

const CATEGORIES = ["Contemporary", "Landscape", "Abstract", "Portrait", "Sculpture", "Photography"];

function toEditForm(a) {
  return {
    title: a.title,
    category: a.category,
    medium: a.medium,
    dimensions: a.dimensions,
    year: a.year,
    price: a.price,
    imageUrl: a.imageUrl,
    description: a.description,
    isAvailable: a.isAvailable,
  };
}

export default function MyArtworks() {
  const { data, setData, loading, error } = useApi("/artworks/mine", { artworks: [] });
  const [editingId, setEditingId] = useState("");
  const [form, setForm] = useState(null);
  const [notice, setNotice] = useState("");
  const [actionError, setActionError] = useState("");
  const location = useLocation();

  useEffect(() => {
    if (location.state?.notice) {
      setNotice(location.state.notice);
      window.history.replaceState({}, "");
    }
  }, []);

  function startEdit(artwork) {
    setEditingId(artwork._id);
    setForm(toEditForm(artwork));
    setNotice(""); setActionError("");
  }

  function cancelEdit() { setEditingId(""); setForm(null); }

  function updateField(e) {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  }

  async function saveArtwork(e) {
    e.preventDefault();
    setNotice(""); setActionError("");
    try {
      const payload = { ...form, year: Number(form.year), price: Number(form.price) };
      const result = await apiRequest(`/artworks/${editingId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      setData({ artworks: data.artworks.map((a) => (a._id === editingId ? result.artwork : a)) });
      cancelEdit();
      setNotice("Artwork updated successfully.");
    } catch (err) {
      setActionError(err.message);
    }
  }

  async function deleteArtwork(artworkId) {
    if (!window.confirm("Permanently delete this artwork?")) return;
    setNotice(""); setActionError("");
    try {
      await apiRequest(`/artworks/${artworkId}`, { method: "DELETE" });
      setData({ artworks: data.artworks.filter((a) => a._id !== artworkId) });
      setNotice("Artwork deleted.");
    } catch (err) {
      setActionError(err.message);
    }
  }

  return (
    <main className="page">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Artist dashboard</p>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: "2.2rem", marginTop: 4 }}>
            My artworks
          </h1>
        </div>
        <Link className="primary-button" to="/sell">
          <Plus size={17} /> Add artwork
        </Link>
      </div>

      {notice && <p className="success" style={{ marginBottom: 16 }}>{notice}</p>}
      {(error || actionError) && <p className="alert" style={{ marginBottom: 16 }}>{error || actionError}</p>}
      {loading && (
        <div style={{ display: "grid", gap: 16 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="artist-art-item" style={{ gap: 20 }}>
              <div className="skeleton" style={{ width: 200, height: 160, borderRadius: "var(--radius)" }} />
              <div style={{ display: "grid", gap: 12, alignContent: "start" }}>
                <div className="skeleton" style={{ height: 12, width: "40%" }} />
                <div className="skeleton" style={{ height: 22, width: "70%" }} />
                <div className="skeleton" style={{ height: 12 }} />
                <div className="skeleton" style={{ height: 12, width: "60%" }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && data.artworks.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" /><path d="m3 9 4-4 4 4 4-4 4 4" />
            </svg>
          </div>
          <h3>No artworks yet</h3>
          <p>Start building your gallery by uploading your first artwork.</p>
          <Link className="primary-button" to="/sell">Upload artwork</Link>
        </div>
      )}

      <div className="artist-art-list">
        {data.artworks.map((artwork) => (
          <article className="artist-art-item" key={artwork._id}>
            <img src={artwork.imageUrl} alt={artwork.title} />

            {editingId === artwork._id ? (
              <form className="form artist-edit-form" onSubmit={saveArtwork}>
                <div className="form-grid">
                  <label className="form-label">
                    Title
                    <input name="title" value={form.title} onChange={updateField} required />
                  </label>
                  <label className="form-label">
                    Category
                    <select name="category" value={form.category} onChange={updateField}>
                      {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </label>
                  <label className="form-label">
                    Medium
                    <input name="medium" value={form.medium} onChange={updateField} required />
                  </label>
                  <label className="form-label">
                    Dimensions
                    <input name="dimensions" value={form.dimensions} onChange={updateField} required />
                  </label>
                  <label className="form-label">
                    Year
                    <input name="year" type="number" value={form.year} onChange={updateField} required />
                  </label>
                  <label className="form-label">
                    Price (INR)
                    <input name="price" type="number" value={form.price} onChange={updateField} required />
                  </label>
                </div>
                <label className="form-label">
                  Image URL
                  <input name="imageUrl" value={form.imageUrl} onChange={updateField} required />
                </label>
                <label className="form-label">
                  Description
                  <textarea name="description" value={form.description} onChange={updateField} required />
                </label>
                <label className="checkbox-row">
                  <input name="isAvailable" type="checkbox" checked={form.isAvailable} onChange={updateField} />
                  Available for purchase
                </label>
                <div className="card-actions">
                  <button className="primary-button" type="submit">Save changes</button>
                  <button className="secondary-button" type="button" onClick={cancelEdit}>
                    <X size={16} /> Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="artist-art-content">
                <div>
                  <p className="eyebrow">{artwork.category}</p>
                  <h2>{artwork.title}</h2>
                  <p>{artwork.description}</p>
                  <div className="details-meta" style={{ marginTop: 12 }}>
                    <span>{artwork.medium}</span>
                    <span>{artwork.dimensions}</span>
                    <span>{artwork.year}</span>
                    <span style={{ color: artwork.isAvailable ? "var(--sage)" : "var(--accent)", fontWeight: 700 }}>
                      {artwork.isAvailable ? "Available" : "Sold"}
                    </span>
                  </div>
                </div>
                <div className="artist-art-actions">
                  <strong style={{ fontSize: "1.1rem" }}>{formatCurrency(artwork.price)}</strong>
                  <div className="card-actions">
                    <button className="secondary-button compact" onClick={() => startEdit(artwork)}>
                      <Edit3 size={15} /> Edit
                    </button>
                    <button className="danger-button compact" onClick={() => deleteArtwork(artwork._id)}>
                      <Trash2 size={15} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </article>
        ))}
      </div>
    </main>
  );
}

import { useMemo, useState } from "react";
import ArtworkCard from "../components/ArtworkCard";
import Filters from "../components/Filters";
import { useApi } from "../hooks/useApi";

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-img" />
      <div className="skeleton-body">
        <div className="skeleton skeleton-line short" />
        <div className="skeleton skeleton-line medium" />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line short" />
      </div>
    </div>
  );
}

export default function Gallery() {
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    sort: "-createdAt",
  });

  const query = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return params.toString();
  }, [filters]);

  const { data, loading, error } = useApi(`/artworks?${query}`, { artworks: [] });
  const count = data.artworks.length;

  return (
    <main className="page">
      <div className="page-heading">
        <p className="eyebrow">Explore gallery</p>
        <h1>Browse artworks</h1>
      </div>

      <Filters filters={filters} onChange={setFilters} />

      {!loading && (
        <div className="filters-bar">
          <p className="gallery-count">
            {count} {count === 1 ? "artwork" : "artworks"} found
          </p>
        </div>
      )}

      {error && <p className="alert">{error}</p>}

      {loading ? (
        <div className="artwork-grid">
          {Array.from({ length: 9 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : count > 0 ? (
        <div className="artwork-grid">
          {data.artworks.map((artwork) => (
            <ArtworkCard key={artwork._id} artwork={artwork} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <h3>No artworks found</h3>
          <p>Try adjusting your search or filters to discover more artworks.</p>
          <button
            className="secondary-button"
            onClick={() => setFilters({ search: "", category: "", sort: "-createdAt" })}
          >
            Clear filters
          </button>
        </div>
      )}
    </main>
  );
}

import { Heart, ShoppingBag } from "lucide-react";
import ArtworkCard from "../components/ArtworkCard";
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

export default function Favorites() {
  const { data, loading, error } = useApi("/favorites", { favorites: [] });

  return (
    <main className="page">
      <div className="page-heading">
        <p className="eyebrow">Saved collection</p>
        <h1>Your favorites</h1>
      </div>

      {error && <p className="alert">{error}</p>}

      {loading ? (
        <div className="artwork-grid">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : data.favorites.length > 0 ? (
        <div className="artwork-grid">
          {data.favorites.map((artwork) => (
            <ArtworkCard key={artwork._id} artwork={{ ...artwork, isFavorite: true }} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <Heart size={28} />
          </div>
          <h3>No favorites yet</h3>
          <p>Browse the gallery and save artworks you love by clicking the heart icon.</p>
          <a className="primary-button" href="/gallery">
            <ShoppingBag size={16} /> Browse Gallery
          </a>
        </div>
      )}
    </main>
  );
}

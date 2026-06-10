import { Eye, Heart, ShoppingBag, Star } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api/http";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/format";

export default function ArtworkCard({ artwork, onFavoriteChange }) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(Boolean(artwork.isFavorite));
  const [imgError, setImgError] = useState(false);

  async function toggleFavorite(e) {
    e.preventDefault();
    if (!isAuthenticated) return;
    const data = await apiRequest(`/favorites/${artwork._id}`, { method: "PATCH" });
    setIsFavorite(data.isFavorite);
    onFavoriteChange?.(data.favorites);
  }

  function handleAddToCart(e) {
    e.preventDefault();
    addToCart(artwork);
  }

  return (
    <article className="artwork-card">
      <Link to={`/artworks/${artwork._id}`} className="artwork-image">
        {imgError ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "grid",
              placeItems: "center",
              background: "var(--bg-2)",
              color: "var(--muted)",
              fontSize: "0.8rem",
            }}
          >
            No image
          </div>
        ) : (
          <img
            src={artwork.imageUrl}
            alt={artwork.title}
            onError={() => setImgError(true)}
          />
        )}
        <div className="artwork-overlay">
          <Eye size={16} /> View Details
        </div>
        {!artwork.isAvailable && <span className="status-pill">Sold</span>}
      </Link>

      <div className="artwork-body">
        <div>
          <p className="muted">{artwork.category}</p>
          <h3>{artwork.title}</h3>
          <p>By {artwork.artistName}</p>
        </div>
        <div className="card-meta">
          <span className="rating">
            <Star size={14} fill="currentColor" /> {artwork.averageRating || 0}
          </span>
          <strong>{formatCurrency(artwork.price)}</strong>
        </div>
        <div className="card-actions">
          <button
            className={isFavorite ? "icon-button favorite-button active" : "icon-button favorite-button"}
            onClick={toggleFavorite}
            disabled={!isAuthenticated}
            title={
              !isAuthenticated
                ? "Login to save favorites"
                : isFavorite
                ? "Remove from favorites"
                : "Save to favorites"
            }
          >
            <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
          </button>
          <button
            className="primary-button compact"
            onClick={handleAddToCart}
            disabled={!artwork.isAvailable}
          >
            <ShoppingBag size={15} />
            {artwork.isAvailable ? "Add" : "Sold"}
          </button>
        </div>
      </div>
    </article>
  );
}

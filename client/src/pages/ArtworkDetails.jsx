import { Heart, ShoppingBag, Star } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { apiRequest } from "../api/http";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useApi } from "../hooks/useApi";
import { formatCurrency } from "../utils/format";

function StarRating({ rating, onRate }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="stars-select" aria-label="Rate this artwork">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={(hovered || rating) >= n ? "filled" : ""}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onRate(n)}
          title={`${n} star${n > 1 ? "s" : ""}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function ReviewStars({ rating }) {
  return (
    <span className="review-stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} style={{ color: n <= rating ? "var(--gold)" : "var(--line-2)" }}>
          ★
        </span>
      ))}
    </span>
  );
}

export default function ArtworkDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { data, setData, loading, error } = useApi(`/artworks/${id}`, { artwork: null });
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [message, setMessage] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // isFavorite is derived from the loaded artwork when available
  const [isFavorite, setIsFavorite] = useState(false);
  const [favInitialized, setFavInitialized] = useState(false);
  if (data.artwork && !favInitialized) {
    setIsFavorite(Boolean(data.artwork.isFavorite));
    setFavInitialized(true);
  }

  async function submitReview(e) {
    e.preventDefault();
    setReviewError("");
    setSubmitting(true);
    try {
      const result = await apiRequest(`/artworks/${id}/reviews`, {
        method: "POST",
        body: JSON.stringify({ rating: reviewRating, comment: reviewComment }),
      });
      setData({ artwork: result.artwork });
      setReviewComment("");
      setReviewRating(5);
    } catch (err) {
      setReviewError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleFavorite() {
    if (!isAuthenticated) return;
    const result = await apiRequest(`/favorites/${id}`, { method: "PATCH" });
    setIsFavorite(result.isFavorite);
    setMessage(result.isFavorite ? "Added to your favorites." : "Removed from your favorites.");
    setTimeout(() => setMessage(""), 3000);
  }

  if (loading)
    return (
      <main className="details-layout">
        <div className="skeleton" style={{ aspectRatio: "4/5", borderRadius: "var(--radius-lg)" }} />
        <div style={{ display: "grid", gap: 18 }}>
          <div className="skeleton" style={{ height: 16, width: "40%" }} />
          <div className="skeleton" style={{ height: 40, width: "80%" }} />
          <div className="skeleton" style={{ height: 16, width: "30%" }} />
          <div className="skeleton" style={{ height: 80 }} />
          <div className="skeleton" style={{ height: 44, width: "60%" }} />
        </div>
      </main>
    );

  if (error) return <p className="alert page">{error}</p>;
  if (!data.artwork) return null;

  const art = data.artwork;

  return (
    <main className="details-layout">
      <section className="details-image">
        <img src={art.imageUrl} alt={art.title} />
      </section>

      <section className="details-content">
        <p className="eyebrow">{art.category}</p>
        <h1>{art.title}</h1>
        <p className="lead">By {art.artistName}</p>

        <div className="details-meta">
          <span>{art.medium}</span>
          <span>{art.dimensions}</span>
          <span>{art.year}</span>
        </div>

        <p style={{ color: "var(--muted)", lineHeight: 1.75 }}>{art.description}</p>

        <div className="price-row">
          <strong>{formatCurrency(art.price)}</strong>
          <span className={art.isAvailable ? "available" : "sold"}>
            {art.isAvailable ? "● Available" : "● Sold"}
          </span>
        </div>

        {message && <p className="success">{message}</p>}

        <div className="hero-actions">
          <button
            className="primary-button"
            onClick={() => addToCart(art)}
            disabled={!art.isAvailable}
          >
            <ShoppingBag size={17} /> {art.isAvailable ? "Add to cart" : "Sold out"}
          </button>
          <button
            className={isFavorite ? "secondary-button favorite-button active" : "secondary-button"}
            onClick={toggleFavorite}
            disabled={!isAuthenticated}
            title={!isAuthenticated ? "Login to save favorites" : ""}
          >
            <Heart size={17} fill={isFavorite ? "currentColor" : "none"} />
            {isFavorite ? "Saved" : "Save"}
          </button>
        </div>

        {/* Reviews */}
        <section className="reviews">
          <h2>Reviews</h2>
          <p className="rating" style={{ marginBottom: 8 }}>
            <Star size={16} fill="currentColor" />
            {art.averageRating || 0} average from {art.reviews.length}{" "}
            {art.reviews.length === 1 ? "review" : "reviews"}
          </p>

          {art.reviews.map((r) => (
            <div className="review-item" key={r._id}>
              <div className="review-header">
                <ReviewStars rating={r.rating} />
                <span style={{ color: "var(--muted)", fontWeight: 400 }}>
                  {r.rating}/5
                </span>
              </div>
              {r.comment && <p>{r.comment}</p>}
            </div>
          ))}

          {art.reviews.length === 0 && (
            <p className="notice">No reviews yet. Be the first to share your thoughts!</p>
          )}

          {isAuthenticated ? (
            <form className="form compact-form" onSubmit={submitReview}>
              <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>Leave a review</p>
              {reviewError && <p className="alert">{reviewError}</p>}
              <StarRating rating={reviewRating} onRate={setReviewRating} />
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Write a short review…"
                required
              />
              <button className="primary-button" type="submit" disabled={submitting}>
                {submitting ? "Posting…" : "Post review"}
              </button>
            </form>
          ) : (
            <p className="notice">
              <a href="/login" style={{ color: "var(--accent)", fontWeight: 600 }}>Login</a>{" "}
              to leave a review.
            </p>
          )}
        </section>
      </section>
    </main>
  );
}

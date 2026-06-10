import { ArrowRight, Brush, ShieldCheck, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import ArtworkCard from "../components/ArtworkCard";
import { useAuth } from "../context/AuthContext";
import { useApi } from "../hooks/useApi";
import { formatCurrency } from "../utils/format";

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

export default function Home() {
  const { user } = useAuth();
  const canSellArt = user?.role === "artist" || user?.role === "admin";
  const { data, loading } = useApi("/artworks?featured=true", { artworks: [] });
  const stats = useApi("/artworks/stats", {
    totalArtworks: 0,
    availableArtworks: 0,
    totalArtists: 0,
    totalCategories: 0,
  });

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">Curated Indian &amp; global artwork</p>
          <h1>Discover original art for homes, offices, and collectors.</h1>
          <p>
            CanvasCart connects art lovers with artists through a browsable gallery,
            secure ordering, favorites, reviews, and direct artwork inquiries.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" to="/gallery">
              Browse Gallery <ArrowRight size={17} />
            </Link>
            {canSellArt && (
              <Link className="secondary-button" to="/sell">
                Submit Artwork
              </Link>
            )}
          </div>
        </div>
        <div className="hero-art">
          <img
            src="https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=1200&q=80"
            alt="People viewing paintings in a gallery"
          />
        </div>
      </section>

      {/* Stats */}
      <div className="stats-strip" style={{ width: "min(1180px, calc(100% - 32px))", margin: "0 auto 0" }}>
        <div>
          <strong>{stats.data.totalArtworks}</strong>
          <span>Artworks</span>
        </div>
        <div>
          <strong>{stats.data.totalArtists}</strong>
          <span>Artists</span>
        </div>
        <div>
          <strong>{stats.data.totalCategories}</strong>
          <span>Categories</span>
        </div>
        <div>
          <strong>{stats.data.availableArtworks}</strong>
          <span>Available</span>
        </div>
      </div>

      {/* Featured Collection */}
      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Featured collection</p>
            <h2>Gallery highlights</h2>
          </div>
          <Link to="/gallery" className="secondary-button compact">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="artwork-grid">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            : data.artworks.map((artwork) => (
                <ArtworkCard key={artwork._id} artwork={artwork} />
              ))}
        </div>
        {!loading && data.artworks.length === 0 && (
          <p className="notice">No featured artworks at the moment. Check back soon.</p>
        )}
      </section>

      {/* Services */}
      <section className="service-band" style={{ width: "min(1180px, calc(100% - 32px))", margin: "0 auto" }}>
        <div>
          <Brush size={28} />
          <h3>Artist submissions</h3>
          <p>Artists can publish works with title, medium, dimensions, pricing, and story.</p>
        </div>
        <div>
          <ShieldCheck size={28} />
          <h3>Trusted gallery</h3>
          <p>Customer, artist, and gallery manager accounts keep each workflow organized.</p>
        </div>
        <div>
          <Truck size={28} />
          <h3>Order tracking</h3>
          <p>Customers place orders while admins can update order progress at every stage.</p>
        </div>
      </section>
    </>
  );
}

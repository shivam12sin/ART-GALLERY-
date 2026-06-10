import { Package } from "lucide-react";
import { Link } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { formatCurrency } from "../utils/format";

const STATUS_CLASS = {
  Placed: "placed",
  Processing: "processing",
  Shipped: "shipped",
  Delivered: "delivered",
  Cancelled: "cancelled",
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function MyOrders() {
  const { data, loading, error } = useApi("/orders/mine", { orders: [] });

  return (
    <main className="page">
      <div className="page-heading">
        <p className="eyebrow">Order history</p>
        <h1>My orders</h1>
      </div>

      {error && <p className="alert">{error}</p>}

      {loading ? (
        <div className="orders-list">
          {[1, 2, 3].map((i) => (
            <div key={i} className="order-card">
              <div className="order-card-header">
                <div className="skeleton" style={{ height: 14, width: 120 }} />
                <div className="skeleton" style={{ height: 14, width: 80 }} />
              </div>
              <div className="order-items">
                {[1, 2].map((j) => (
                  <div key={j} className="order-item">
                    <div className="skeleton" style={{ width: 64, height: 52, borderRadius: 6 }} />
                    <div style={{ display: "grid", gap: 6 }}>
                      <div className="skeleton" style={{ height: 13, width: "60%" }} />
                      <div className="skeleton" style={{ height: 11, width: "40%" }} />
                    </div>
                    <div className="skeleton" style={{ height: 14, width: 60 }} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : data.orders.length > 0 ? (
        <div className="orders-list">
          {data.orders.map((order) => (
            <div className="order-card" key={order._id}>
              <div className="order-card-header">
                <div className="order-card-header-left">
                  <span className="order-number">
                    Order #{order._id.slice(-8).toUpperCase()}
                  </span>
                  <span className="order-date">{formatDate(order.createdAt)}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span className={`status-badge ${STATUS_CLASS[order.status] || ""}`}>
                    {order.status}
                  </span>
                  <span className="order-total">{formatCurrency(order.total)}</span>
                </div>
              </div>
              <div className="order-items">
                {order.items.map((item) => (
                  <div className="order-item" key={item.artwork || item.title}>
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                    <div>
                      <h4>{item.title}</h4>
                      <p>{item.artistName || "Artist"}</p>
                    </div>
                    <strong>{formatCurrency(item.price)}</strong>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <Package size={28} />
          </div>
          <h3>No orders yet</h3>
          <p>Once you place an order, it will appear here with its current status.</p>
          <Link className="primary-button" to="/gallery">
            Browse Gallery
          </Link>
        </div>
      )}
    </main>
  );
}

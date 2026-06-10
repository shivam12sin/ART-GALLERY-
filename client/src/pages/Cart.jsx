import { ShoppingBag, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api/http";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/format";

const ADDRESS_FIELDS = [
  { name: "fullName", label: "Full name", type: "text" },
  { name: "phone", label: "Phone number", type: "tel" },
  { name: "street", label: "Street address", type: "text" },
  { name: "city", label: "City", type: "text" },
  { name: "state", label: "State", type: "text" },
  { name: "postalCode", label: "Postal code", type: "text" },
];

export default function Cart() {
  const { items, total, removeFromCart, clearCart } = useCart();
  const [address, setAddress] = useState({
    fullName: "", phone: "", street: "", city: "", state: "", postalCode: "",
  });
  const [message, setMessage] = useState("");
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function checkout(e) {
    e.preventDefault();
    setMessage(""); setError(""); setLoading(true);
    try {
      const res = await apiRequest("/orders", {
        method: "POST",
        body: JSON.stringify({
          artworkIds: items.map((i) => i._id),
          shippingAddress: address,
        }),
      });
      clearCart();
      setOrderId(res.order._id);
      setMessage("Order placed successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (message) {
    return (
      <main className="page">
        <div className="empty-state" style={{ paddingTop: 48 }}>
          <div className="empty-icon" style={{ background: "var(--sage)", color: "white" }}>
            <ShoppingBag size={28} />
          </div>
          <h3>Order confirmed!</h3>
          <p>
            Your order has been placed. We'll notify you once it's shipped.
            <br />
            <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
              Order ID: {orderId.slice(-8).toUpperCase()}
            </span>
          </p>
          <div className="hero-actions">
            <Link className="primary-button" to="/gallery">
              Continue shopping
            </Link>
            <Link className="secondary-button" to="/my-orders">
              View my orders
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-layout">
      {/* Cart Items */}
      <section>
        <div className="cart-items-header">
          <div>
            <p className="eyebrow">Checkout</p>
            <h1 style={{ fontFamily: "\"Playfair Display\", serif", fontSize: "2rem", marginTop: 4 }}>
              Your cart
            </h1>
          </div>
          {items.length > 0 && (
            <button className="ghost-button compact" onClick={clearCart}>
              Clear all
            </button>
          )}
        </div>

        {error && <p className="alert" style={{ marginBottom: 16 }}>{error}</p>}

        {items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <ShoppingBag size={28} />
            </div>
            <h3>Your cart is empty</h3>
            <p>Browse our gallery and add artworks you love.</p>
            <Link className="primary-button" to="/gallery">
              Browse Gallery
            </Link>
          </div>
        ) : (
          items.map((item) => (
            <div className="cart-item" key={item._id}>
              <img src={item.imageUrl} alt={item.title} />
              <div>
                <h3>{item.title}</h3>
                <p>{item.artistName} · {item.category}</p>
                <strong>{formatCurrency(item.price)}</strong>
              </div>
              <button
                className="icon-button"
                onClick={() => removeFromCart(item._id)}
                title="Remove"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </section>

      {/* Checkout Panel */}
      <form className="form checkout-panel" onSubmit={checkout}>
        <h2 style={{ fontFamily: "\"Playfair Display\", serif", fontSize: "1.4rem", marginBottom: 4 }}>
          Shipping details
        </h2>
        <div className="form-grid">
          {ADDRESS_FIELDS.slice(0, 2).map((f) => (
            <label key={f.name} className="form-label">
              {f.label}
              <input
                type={f.type}
                value={address[f.name]}
                onChange={(e) => setAddress({ ...address, [f.name]: e.target.value })}
                placeholder={f.label}
                required
              />
            </label>
          ))}
        </div>
        {ADDRESS_FIELDS.slice(2).map((f) => (
          <label key={f.name} className="form-label">
            {f.label}
            <input
              type={f.type}
              value={address[f.name]}
              onChange={(e) => setAddress({ ...address, [f.name]: e.target.value })}
              placeholder={f.label}
              required
            />
          </label>
        ))}

        <div className="total-row">
          <span>Total ({items.length} {items.length === 1 ? "item" : "items"})</span>
          <strong>{formatCurrency(total)}</strong>
        </div>

        <button
          className="primary-button"
          type="submit"
          disabled={items.length === 0 || loading}
          style={{ width: "100%" }}
        >
          {loading ? <><span className="spinner" /> Placing order…</> : "Place order"}
        </button>
      </form>
    </main>
  );
}

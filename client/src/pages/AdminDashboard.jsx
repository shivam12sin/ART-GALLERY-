import { ClipboardList, DollarSign, Inbox, PackageCheck, RefreshCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { apiRequest } from "../api/http";
import { useApi } from "../hooks/useApi";
import { formatCurrency } from "../utils/format";

const ORDER_STATUSES = ["Placed", "Processing", "Shipped", "Delivered", "Cancelled"];

const STATUS_CLASS = {
  Placed: "placed",
  Processing: "processing",
  Shipped: "shipped",
  Delivered: "delivered",
  Cancelled: "cancelled",
};

export default function AdminDashboard() {
  const ordersApi = useApi("/orders", { orders: [] });
  const inquiriesApi = useApi("/inquiries", { inquiries: [] });
  const statsApi = useApi("/artworks/stats", {
    totalArtworks: 0,
    availableArtworks: 0,
    totalArtists: 0,
    totalCategories: 0,
  });
  const [message, setMessage] = useState("");
  const [actionError, setActionError] = useState("");

  const totalRevenue = useMemo(
    () =>
      ordersApi.data.orders
        .filter((o) => o.status !== "Cancelled")
        .reduce((sum, o) => sum + o.total, 0),
    [ordersApi.data.orders]
  );

  async function updateStatus(orderId, status) {
    setMessage(""); setActionError("");
    try {
      const result = await apiRequest(`/orders/${orderId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      ordersApi.setData({
        orders: ordersApi.data.orders.map((o) =>
          o._id === orderId ? { ...o, status: result.order.status } : o
        ),
      });
      setMessage("Order status updated.");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setActionError(err.message);
    }
  }

  const isLoading = ordersApi.loading || inquiriesApi.loading || statsApi.loading;
  const pageError = ordersApi.error || inquiriesApi.error || statsApi.error || actionError;

  return (
    <main className="page">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Admin panel</p>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: "2.2rem", marginTop: 4 }}>
            Dashboard
          </h1>
        </div>
        <button className="secondary-button compact" onClick={() => window.location.reload()}>
          <RefreshCcw size={15} /> Refresh
        </button>
      </div>

      {message && <p className="success" style={{ marginBottom: 16 }}>{message}</p>}
      {pageError && <p className="alert" style={{ marginBottom: 16 }}>{pageError}</p>}

      {/* Stats Cards */}
      <div className="admin-stats">
        <div className="admin-stat-card">
          <ClipboardList size={22} />
          <span>Total orders</span>
          <strong>{ordersApi.data.orders.length}</strong>
        </div>
        <div className="admin-stat-card">
          <PackageCheck size={22} />
          <span>Available artworks</span>
          <strong>{statsApi.data.availableArtworks}</strong>
        </div>
        <div className="admin-stat-card">
          <Inbox size={22} />
          <span>Inquiries</span>
          <strong>{inquiriesApi.data.inquiries.length}</strong>
        </div>
        <div className="admin-stat-card">
          <DollarSign size={22} />
          <span>Revenue</span>
          <strong style={{ fontSize: "1.3rem" }}>{formatCurrency(totalRevenue)}</strong>
        </div>
      </div>

      {isLoading && (
        <div style={{ display: "grid", gap: 12 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: 64, borderRadius: "var(--radius)" }} />
          ))}
        </div>
      )}

      {/* Orders Table */}
      <section className="admin-section">
        <div className="section-heading compact-heading" style={{ marginBottom: 16 }}>
          <div>
            <p className="eyebrow">Orders</p>
            <h2 className="compact-heading">Manage customer orders</h2>
          </div>
        </div>
        <div className="admin-table">
          <div className="admin-table-row admin-table-head">
            <span>Customer</span>
            <span>Items</span>
            <span>Total</span>
            <span>Status</span>
          </div>
          {ordersApi.data.orders.map((order) => (
            <div className="admin-table-row" key={order._id}>
              <div>
                <strong>{order.user?.name || "Customer"}</strong>
                <small>{order.user?.email || ""}</small>
              </div>
              <div>
                {order.items.map((item) => (
                  <small key={item.artwork || item.title}>{item.title}</small>
                ))}
              </div>
              <strong>{formatCurrency(order.total)}</strong>
              <div>
                <span className={`status-badge ${STATUS_CLASS[order.status] || ""}`}>
                  {order.status}
                </span>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  style={{ marginTop: 6 }}
                >
                  {ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
        {!ordersApi.loading && ordersApi.data.orders.length === 0 && (
          <p className="notice" style={{ marginTop: 12 }}>No orders placed yet.</p>
        )}
      </section>

      {/* Inquiries */}
      <section className="admin-section">
        <div className="section-heading compact-heading" style={{ marginBottom: 16 }}>
          <div>
            <p className="eyebrow">Inquiries</p>
            <h2 className="compact-heading">Messages from visitors</h2>
          </div>
        </div>
        <div className="inquiry-list">
          {inquiriesApi.data.inquiries.map((inq) => (
            <article className="inquiry-item" key={inq._id}>
              <div>
                <h3>{inq.subject}</h3>
                <p>{inq.message}</p>
              </div>
              <div>
                <strong>{inq.name}</strong>
                <small>{inq.email}</small>
                {inq.artwork && <small>Re: {inq.artwork.title}</small>}
              </div>
            </article>
          ))}
        </div>
        {!inquiriesApi.loading && inquiriesApi.data.inquiries.length === 0 && (
          <p className="notice" style={{ marginTop: 12 }}>No inquiries yet.</p>
        )}
      </section>
    </main>
  );
}

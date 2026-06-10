import { Heart, Menu, Package, ShoppingBag, UserCircle, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { items } = useCart();
  const canSellArt = user?.role === "artist" || user?.role === "admin";
  const isAdmin = user?.role === "admin";
  const isCustomer = user?.role === "customer";

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/gallery", label: "Gallery" },
    isAdmin && { to: "/admin", label: "Admin" },
    canSellArt && { to: "/my-artworks", label: "My Artworks" },
    canSellArt && { to: "/sell", label: "Sell Art" },
    { to: "/contact", label: "Contact" },
  ].filter(Boolean);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <header className="site-header">
      <Link className="brand" to="/">
        <span className="brand-mark">C</span>
        <span>CanvasCart</span>
      </Link>

      <button
        className="icon-button mobile-only"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <nav className={isOpen ? "nav open" : "nav"}>
        {navLinks.map((link) => (
          <NavLink key={link.to} to={link.to} onClick={() => setIsOpen(false)}>
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="header-actions">
        <Link className="icon-link" to="/favorites" title="Favorites">
          <Heart size={18} />
        </Link>
        {(isCustomer || !user) && (
          <Link className="cart-link" to="/cart" title="Cart">
            <ShoppingBag size={18} />
            {items.length > 0 && <span>{items.length}</span>}
          </Link>
        )}
        {isCustomer && (
          <Link className="icon-link" to="/my-orders" title="My Orders">
            <Package size={18} />
          </Link>
        )}
        {user ? (
          <>
            <div className="header-user">
              <div className="user-avatar">{initials}</div>
              <span>{user.name.split(" ")[0]}</span>
            </div>
            <button className="ghost-button" onClick={logout} style={{ fontSize: "0.85rem" }}>
              Logout
            </button>
          </>
        ) : (
          <Link className="ghost-button" to="/login">
            <UserCircle size={17} />
            Login
          </Link>
        )}
      </div>
    </header>
  );
}

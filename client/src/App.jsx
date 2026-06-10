import { Link, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import ArtworkDetails from "./pages/ArtworkDetails";
import Cart from "./pages/Cart";
import Contact from "./pages/Contact";
import Favorites from "./pages/Favorites";
import Gallery from "./pages/Gallery";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MyArtworks from "./pages/MyArtworks";
import MyOrders from "./pages/MyOrders";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import SellArt from "./pages/SellArt";

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/artworks/:id" element={<ArtworkDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/my-artworks" element={
          <ProtectedRoute allowedRoles={["artist", "admin"]}>
            <MyArtworks />
          </ProtectedRoute>
        } />
        <Route path="/sell" element={
          <ProtectedRoute allowedRoles={["artist", "admin"]}>
            <SellArt />
          </ProtectedRoute>
        } />
        <Route path="/cart" element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        } />
        <Route path="/favorites" element={
          <ProtectedRoute>
            <Favorites />
          </ProtectedRoute>
        } />
        <Route path="/my-orders" element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <MyOrders />
          </ProtectedRoute>
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>

      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 800, fontSize: "1rem" }}>
              <span style={{ width: 28, height: 28, background: "linear-gradient(135deg, #c0392b, #96271d)", borderRadius: 6, display: "grid", placeItems: "center", color: "white", fontSize: "0.85rem", fontWeight: 900 }}>C</span>
              CanvasCart
            </Link>
            <p>
              India's curated online art gallery connecting artists with collectors and
              art lovers through original, authentic artwork.
            </p>
          </div>
          <div className="footer-col">
            <h4>Explore</h4>
            <Link to="/gallery">Gallery</Link>
            <Link to="/gallery?category=Abstract">Abstract</Link>
            <Link to="/gallery?category=Landscape">Landscape</Link>
            <Link to="/gallery?category=Portrait">Portrait</Link>
            <Link to="/gallery?category=Sculpture">Sculpture</Link>
          </div>
          <div className="footer-col">
            <h4>Account</h4>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/favorites">Favorites</Link>
            <Link to="/my-orders">My Orders</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} CanvasCart. College project — all artworks are fictional.</span>
          <span>Built with React, Express &amp; MongoDB</span>
        </div>
      </footer>
    </>
  );
}

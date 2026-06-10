import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { apiRequest } from "../api/http";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setNotice(""); setError(""); setLoading(true);
    try {
      const res = await apiRequest("/inquiries", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setForm({ name: "", email: "", subject: "", message: "" });
      setNotice(res.message || "Message sent! We'll get back to you shortly.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="contact-layout">
      <section>
        <p className="eyebrow">Contact gallery</p>
        <h1>Ask about an artwork, artist, or order.</h1>
        <div className="contact-info">
          <div className="contact-info-item">
            <Mail size={18} />
            <span>hello@canvascart.test</span>
          </div>
          <div className="contact-info-item">
            <Phone size={18} />
            <span>+91 98765 43210</span>
          </div>
          <div className="contact-info-item">
            <MapPin size={18} />
            <span>New Delhi, India</span>
          </div>
        </div>
      </section>

      <form className="form" onSubmit={handleSubmit}>
        <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: "1.4rem" }}>
          Send a message
        </h2>
        {notice && <p className="success">{notice}</p>}
        {error && <p className="alert">{error}</p>}
        <label className="form-label">
          Name
          <input name="name" placeholder="Your name" value={form.name} onChange={update} required />
        </label>
        <label className="form-label">
          Email
          <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={update} required />
        </label>
        <label className="form-label">
          Subject
          <input name="subject" placeholder="What is this about?" value={form.subject} onChange={update} required />
        </label>
        <label className="form-label">
          Message
          <textarea name="message" placeholder="Describe your question or inquiry…" value={form.message} onChange={update} required />
        </label>
        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? <><span className="spinner" /> Sending…</> : "Send inquiry"}
        </button>
      </form>
    </main>
  );
}

import { Search } from "lucide-react";

const CATEGORIES = ["Contemporary", "Landscape", "Abstract", "Portrait", "Sculpture", "Photography"];
const SORT_OPTIONS = [
  { value: "-createdAt", label: "Newest" },
  { value: "price", label: "Price: Low → High" },
  { value: "-price", label: "Price: High → Low" },
  { value: "-views", label: "Most Viewed" },
];

export default function Filters({ filters, onChange }) {
  function update(e) {
    onChange({ ...filters, [e.target.name]: e.target.value });
  }

  return (
    <section className="filters">
      <label className="search-field">
        <Search size={17} />
        <input
          name="search"
          value={filters.search}
          onChange={update}
          placeholder="Search artworks, artists, keywords…"
        />
      </label>
      <select name="category" value={filters.category} onChange={update}>
        <option value="">All categories</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <select name="sort" value={filters.sort} onChange={update}>
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </section>
  );
}

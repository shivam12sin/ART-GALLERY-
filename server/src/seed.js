import "dotenv/config";
import { connectDB } from "./config/db.js";
import Artwork from "./models/Artwork.js";
import Inquiry from "./models/Inquiry.js";
import Order from "./models/Order.js";
import User from "./models/User.js";

const artworks = [
  {
    title: "Monsoon Courtyard",
    artistName: "Aarav Mehta",
    category: "Landscape",
    medium: "Acrylic on canvas",
    dimensions: "30 x 24 in",
    year: 2024,
    price: 42000,
    imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=1000&q=80",
    description: "A bright study of rain-washed walls, reflective stone, and the quiet mood after a storm.",
    isFeatured: true
  },
  {
    title: "City Between Lights",
    artistName: "Mira Sen",
    category: "Abstract",
    medium: "Mixed media",
    dimensions: "36 x 36 in",
    year: 2023,
    price: 68000,
    imageUrl: "https://images.unsplash.com/photo-1549887534-1541e9326642?auto=format&fit=crop&w=1000&q=80",
    description: "Layered color fields inspired by city traffic, night markets, and glass reflections.",
    isFeatured: true
  },
  {
    title: "Quiet Reader",
    artistName: "Devika Rao",
    category: "Portrait",
    medium: "Oil on linen",
    dimensions: "22 x 28 in",
    year: 2022,
    price: 56000,
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1000&q=80",
    description: "A warm portrait focused on soft light, stillness, and everyday concentration.",
    isFeatured: false
  },
  {
    title: "Copper Bloom",
    artistName: "Kabir Thomas",
    category: "Sculpture",
    medium: "Recycled metal",
    dimensions: "18 x 18 x 26 in",
    year: 2025,
    price: 79000,
    imageUrl: "https://images.unsplash.com/photo-1561839561-b13bcfe95249?auto=format&fit=crop&w=1000&q=80",
    description: "A tabletop sculpture using reclaimed copper to create an industrial floral form.",
    isFeatured: true
  },
  {
    title: "Blue Raga",
    artistName: "Naina Kapoor",
    category: "Contemporary",
    medium: "Watercolor",
    dimensions: "20 x 30 in",
    year: 2024,
    price: 35000,
    imageUrl: "https://images.unsplash.com/photo-1578926288207-a90a5366759d?auto=format&fit=crop&w=1000&q=80",
    description: "Transparent washes and rhythmic marks arranged like a slow evening melody.",
    isFeatured: false
  },
  {
    title: "Marble Memory",
    artistName: "Ishan Roy",
    category: "Photography",
    medium: "Fine art print",
    dimensions: "24 x 18 in",
    year: 2021,
    price: 28000,
    imageUrl: "https://images.unsplash.com/photo-1580136579312-94651dfd596d?auto=format&fit=crop&w=1000&q=80",
    description: "Architectural photography exploring symmetry, shadow, and heritage textures.",
    isFeatured: false
  },
  {
    title: "Hill Path at Dawn",
    artistName: "Xavier",
    category: "Landscape",
    medium: "Oil on canvas",
    dimensions: "32 x 24 in",
    year: 2024,
    price: 46000,
    imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80",
    description: "A quiet mountain path painted with soft morning light and layered green valleys.",
    isFeatured: true
  },
  {
    title: "River After Rain",
    artistName: "Xavier",
    category: "Landscape",
    medium: "Acrylic on canvas",
    dimensions: "28 x 22 in",
    year: 2023,
    price: 39000,
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
    description: "A reflective river landscape capturing clouds, wet earth, and calm water movement.",
    isFeatured: false
  },
  {
    title: "Crimson Geometry",
    artistName: "Xavier",
    category: "Abstract",
    medium: "Mixed media on board",
    dimensions: "30 x 30 in",
    year: 2025,
    price: 52000,
    imageUrl: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=1000&q=80",
    description: "Bold geometric planes arranged through red, black, and muted gold color blocks.",
    isFeatured: true
  },
  {
    title: "Silent Frequency",
    artistName: "Xavier",
    category: "Abstract",
    medium: "Acrylic and ink",
    dimensions: "36 x 24 in",
    year: 2024,
    price: 48000,
    imageUrl: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=1000&q=80",
    description: "Fine lines and layered washes create a rhythmic abstract composition.",
    isFeatured: false
  },
  {
    title: "The Green Shawl",
    artistName: "Xavier",
    category: "Portrait",
    medium: "Oil on linen",
    dimensions: "24 x 30 in",
    year: 2022,
    price: 57000,
    imageUrl: "https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?auto=format&fit=crop&w=1000&q=80",
    description: "A sensitive portrait focused on expression, fabric texture, and warm side lighting.",
    isFeatured: false
  },
  {
    title: "Studio Window",
    artistName: "Xavier",
    category: "Portrait",
    medium: "Charcoal and pastel",
    dimensions: "20 x 26 in",
    year: 2023,
    price: 31000,
    imageUrl: "https://images.unsplash.com/photo-1599855185065-1fc3d6f84769?auto=format&fit=crop&w=1000&q=80",
    description: "A contemplative figure study with strong shadows and delicate pastel highlights.",
    isFeatured: false
  },
  {
    title: "Folded Bronze",
    artistName: "Xavier",
    category: "Sculpture",
    medium: "Bronze",
    dimensions: "14 x 12 x 24 in",
    year: 2024,
    price: 88000,
    imageUrl: "https://images.unsplash.com/photo-1577083288073-40892c0860a4?auto=format&fit=crop&w=1000&q=80",
    description: "A compact bronze sculpture shaped around folded surfaces and negative space.",
    isFeatured: true
  },
  {
    title: "White Stone Loop",
    artistName: "Xavier",
    category: "Sculpture",
    medium: "Carved stone",
    dimensions: "16 x 16 x 20 in",
    year: 2021,
    price: 72000,
    imageUrl: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=1000&q=80",
    description: "A smooth carved form exploring balance, weight, and circular movement.",
    isFeatured: false
  },
  {
    title: "Market Light",
    artistName: "Xavier",
    category: "Photography",
    medium: "Archival pigment print",
    dimensions: "24 x 18 in",
    year: 2025,
    price: 26000,
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80",
    description: "Street photography capturing late evening glow, motion, and layered market life.",
    isFeatured: false
  },
  {
    title: "Quiet Facade",
    artistName: "Xavier",
    category: "Photography",
    medium: "Fine art print",
    dimensions: "20 x 30 in",
    year: 2024,
    price: 30000,
    imageUrl: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1000&q=80",
    description: "An architectural study of windows, walls, and afternoon shadow.",
    isFeatured: false
  },
  {
    title: "Urban Pause",
    artistName: "Xavier",
    category: "Contemporary",
    medium: "Acrylic and collage",
    dimensions: "34 x 28 in",
    year: 2025,
    price: 61000,
    imageUrl: "https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?auto=format&fit=crop&w=1000&q=80",
    description: "A contemporary city scene built from painted shapes, paper fragments, and texture.",
    isFeatured: true
  },
  {
    title: "Signal Garden",
    artistName: "Xavier",
    category: "Contemporary",
    medium: "Mixed media",
    dimensions: "30 x 40 in",
    year: 2023,
    price: 64000,
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1000&q=80",
    description: "Organic marks and modern color fields arranged like a garden of signs and signals.",
    isFeatured: false
  }
];

async function seed() {
  await connectDB();

  await Promise.all([User.deleteMany(), Artwork.deleteMany(), Order.deleteMany(), Inquiry.deleteMany()]);

  const [admin, artist, xavier] = await User.create([
    {
      name: "Gallery Admin",
      email: "admin@gallery.com",
      password: "admin123",
      role: "admin",
      bio: "Curates featured collections and manages customer orders."
    },
    {
      name: "Aarav Mehta",
      email: "artist@gallery.com",
      password: "artist123",
      role: "artist",
      bio: "Painter working with color, architecture, and seasonal Indian landscapes."
    },
    {
      name: "Xavier",
      email: "xavier@gallery.com",
      password: "xavier123",
      role: "artist",
      bio: "Multidisciplinary artist creating landscapes, portraits, photography, sculpture, and contemporary works."
    }
  ]);

  await Artwork.insertMany(
    artworks.map((artwork) => ({
      ...artwork,
      artist:
        artwork.artistName === artist.name
          ? artist._id
          : artwork.artistName === xavier.name
            ? xavier._id
            : undefined
    }))
  );

  console.log("Database seeded");
  console.log("Admin login: admin@gallery.com / admin123");
  console.log("Artist login: artist@gallery.com / artist123");
  console.log("Xavier login: xavier@gallery.com / xavier123");
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});

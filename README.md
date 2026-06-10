# Online Art Gallery MERN Project

CanvasCart is a college-level online art gallery built with React.js, Express.js, Node.js, and MongoDB. The repository also keeps the old static assignment files, while the MERN project lives inside `client/` and `server/`.

## Functional Requirements

- User registration and login with JWT authentication.
- Role-based access for customers, artists, and admins.
- Public gallery browsing with search, category filter, sorting, artwork details, views, and reviews.
- Artist artwork submission with title, category, medium, dimensions, year, price, image URL, and description.
- Artist dashboard to view, edit, and delete their own uploaded artworks.
- Customer favorites and local cart management.
- Checkout flow that creates orders and marks purchased artwork as unavailable.
- Admin order listing and order status update API.
- Admin dashboard to view gallery stats, orders, update order statuses, and read inquiries.
- Contact/inquiry form for gallery questions.
- Seed script with sample artists, admin account, and artworks.

## Non-Functional Requirements

- Clean modular code using controllers, routes, models, contexts, reusable components, and utility helpers.
- Responsive UI for mobile, tablet, and desktop.
- Secure API basics: Helmet, CORS, rate limiting, password hashing, and JWT-based protected routes.
- Maintainable comments in important places without noisy line-by-line explanations.
- Environment-based configuration through `.env`.
- Reusable React state through `AuthContext`, `CartContext`, and `useApi`.

## Tech Stack

- Frontend: React.js, Vite, React Router, Lucide icons, CSS.
- Backend: Node.js, Express.js, MongoDB, Mongoose.
- Auth and security: JWT, bcryptjs, Helmet, CORS, express-rate-limit.

## Project Structure

```text
client/
  src/
    api/            API helper
    components/     Reusable UI components
    context/        Auth and cart state
    hooks/          Reusable data fetching hook
    pages/          Route-level screens
    utils/          Formatting helpers
server/
  src/
    config/         MongoDB connection
    controllers/    Request handlers
    middleware/     Auth and error middleware
    models/         Mongoose schemas
    routes/         Express routers
    seed.js         Sample database data
```

## Setup

1. Install dependencies.

```bash
npm install
npm run install:all
```

2. Create environment files.

```bash
copy server\.env.example server\.env
copy client\.env.example client\.env
```

3. Start MongoDB locally, then seed the database.

```bash
npm run seed
```

4. Run the full project.

```bash
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:5000`

## Sample Login

- Admin: `admin@gallery.com` / `admin123`
- Artist: `artist@gallery.com` / `artist123`

After logging in as admin, open `/admin` or use the `Admin` navbar link.

## Main API Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/artworks`
- `GET /api/artworks/:id`
- `POST /api/artworks`
- `GET /api/artworks/mine`
- `PUT /api/artworks/:id`
- `DELETE /api/artworks/:id`
- `POST /api/artworks/:id/reviews`
- `GET /api/favorites`
- `PATCH /api/favorites/:artworkId`
- `POST /api/orders`
- `GET /api/orders/mine`
- `POST /api/inquiries`

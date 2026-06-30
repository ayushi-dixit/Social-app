# HappyApp — Full Stack Social Media App

A complete MERN-stack (MongoDB, Express, React, Node.js) social media application built for the Week 07 Minor Project. Users can register, log in, create posts, like/unlike posts, edit or delete their own posts, and manage their profile — all wrapped in a responsive, pastel-and-gold premium UI.

## Project Overview

HappyApp is a two-part project:

- **backend/** — REST API built with Node.js, Express, and MongoDB (Mongoose). Handles authentication (JWT), users, and posts.
- **frontend/** — React (Vite) single-page application that consumes the API, with client-side routing, protected routes, and a context-based auth state.

## Features Implemented

### Authentication
- User registration with hashed passwords (bcrypt)
- Login with JWT issuance
- Logout (client-side token removal + server endpoint)
- Protected routes both on the frontend (redirect to login) and backend (JWT middleware)
- Basic password validation (min 6 characters)

### User Profile
- View profile info (name, email, bio)
- Edit name and bio
- `profilePicture` field supported in the schema (optional — upload UI can be added on top of the existing field)

### Posts
- Create text posts with timestamps
- View a chronological feed of all posts with author info
- Like / unlike posts (toggle)
- Edit and delete your own posts only (ownership enforced server-side)

### UI/UX
- Fully responsive layout (mobile, tablet, desktop)
- Pastel color palette with gold accent gradients
- Reusable components: Navbar, PostCard, ProtectedRoute

## Technologies Used

**Frontend:** React 18, React Router v6, Axios, Vite, plain CSS (custom design system)
**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, CORS, dotenv

## Project Structure

```
social-app/
├── backend/
│   ├── config/        # MongoDB connection
│   ├── controllers/    # Route handler logic
│   ├── middleware/     # Auth + error handling
│   ├── models/         # User & Post schemas
│   ├── routes/         # Express routers
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/  # Navbar, PostCard, ProtectedRoute
    │   ├── context/     # AuthContext (global auth state)
    │   ├── pages/       # Login, Register, Feed, Profile
    │   ├── services/    # axios instance (api.js)
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── .env.example
```

## Installation Guide

### Prerequisites
- Node.js (v18+)
- MongoDB running locally, or a MongoDB Atlas connection string

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env   # then fill in your own values
npm run dev             # starts on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env   # adjust VITE_API_URL if needed
npm run dev             # starts on http://localhost:5173
```

Open `http://localhost:5173` in your browser. Register a new account to get started.

## Environment Variables Required

### backend/.env
| Variable | Description |
|---|---|
| `PORT` | Port the API server runs on (default 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key used to sign JWTs |
| `JWT_EXPIRES_IN` | Token expiry (e.g. `7d`) |
| `CLIENT_URL` | Frontend URL for CORS (e.g. `http://localhost:5173`) |

### frontend/.env
| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API (e.g. `http://localhost:5000/api`) |

## API Documentation

Base URL: `/api`

### Auth (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register a new user |
| POST | `/login` | Public | Log in and receive a JWT |
| POST | `/logout` | Private | Log out (client clears token) |
| GET | `/me` | Private | Get the logged-in user's data |

### Users (`/api/users`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/:id` | Private | Get a user's public profile |
| PUT | `/me` | Private | Update logged-in user's name/bio/password |

### Posts (`/api/posts`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Private | Get all posts (feed), newest first |
| POST | `/` | Private | Create a new post |
| GET | `/:id` | Private | Get a single post |
| PUT | `/:id` | Private | Update own post |
| DELETE | `/:id` | Private | Delete own post |
| PUT | `/:id/like` | Private | Toggle like/unlike on a post |

All `Private` routes require an `Authorization: Bearer <token>` header.

## Notes / Next Steps (Bonus Ideas)
- Profile picture upload is schema-ready; wire up `multer` (already in dependencies) for actual file uploads.
- Comments, follow/friend system, dark mode, and Socket.IO real-time chat were left as stretch goals per the assignment's bonus features list — the current architecture (controllers/models/routes) makes them straightforward to add.
- For deployment: host the backend (Render/Railway) and frontend (Vercel/Netlify), then update `CLIENT_URL` and `VITE_API_URL` accordingly.

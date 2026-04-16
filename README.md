# Little Stories

A full-stack web app for building **16-patch “blanket” stories**: a 4×4 grid of text, images, and snippets you can reorder, save, and share via read-only invite links.

## Features

- **Auth** — Register, login, JWT sessions (bcrypt + JSON Web Tokens)
- **Projects** — CRUD for blankets backed by MongoDB
- **Editor** — Drag-and-drop reordering, per-patch editor (text, image URL, or upload), auto-save
- **Sharing** — Public read-only view at `/invite/:code`
- **Payments** — Stripe checkout + webhook hooks (optional)

## Tech stack

| Layer | Technologies |
|--------|----------------|
| **Frontend** | React (Vite), TypeScript, Tailwind CSS v4, Zustand, React Router, Axios, Framer Motion, @dnd-kit |
| **Backend** | Node.js, Express, MongoDB + Mongoose, Zod validation, JWT, Stripe, Multer (image uploads) |

## Repository layout

```
story/
├── frontend/          # Vite + React app
├── backend/           # Express REST API
├── package.json       # Root scripts (run API + web together)
└── README.md
```

## Prerequisites

- **Node.js** 18+ (20+ recommended)
- **MongoDB** — [MongoDB Atlas](https://www.mongodb.com/atlas) (or local MongoDB for development)

## Local development

### 1. Install dependencies

From the repository root:

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

### 2. Backend environment

Copy the example file and edit values:

```bash
cp backend/.env.example backend/.env
```

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | Atlas `mongodb+srv://...` or local `mongodb://127.0.0.1:27017/little-stories` |
| `JWT_SECRET` | Long random string (e.g. `openssl rand -hex 32`) |
| `JWT_EXPIRES_IN` | Optional; default `7d` |
| `FRONTEND_URL` | Local app origin, e.g. `http://localhost:5173` (CORS + Stripe redirects) |
| `STRIPE_*` | Optional — see `backend/.env.example` |

### 3. Link the frontend to the API

The API base URL is set in **`frontend/src/config/api.ts`** as `API_BASE_URL`.

- For **local API** (`http://localhost:4000`), change `API_BASE_URL` to that URL.
- For **production**, set it to your deployed API origin (no trailing slash).

### 4. Run both services

From the **repository root**:

```bash
npm run dev
```

- **API:** `http://localhost:4000` (default)
- **Web app:** `http://localhost:5173`

Or run them in separate terminals:

```bash
cd backend && npm run dev
cd frontend && npm run dev
```

### Tests (backend)

```bash
npm test --prefix backend
```

## API overview

| Method | Path | Auth |
|--------|------|------|
| `POST` | `/auth/register` | No |
| `POST` | `/auth/login` | No |
| `GET` | `/auth/me` | Bearer token |
| `POST` | `/projects` | Yes |
| `GET` | `/projects` | Yes |
| `GET` | `/projects/:id` | Yes |
| `PUT` | `/projects/:id` | Yes |
| `DELETE` | `/projects/:id` | Yes |
| `GET` | `/invite/:code` | No (public) |
| `POST` | `/upload/single` | Yes (multipart `image`) |
| `POST` | `/payment/create-session` | Yes |
| `POST` | `/payment/webhook` | Stripe signature |
| `GET` | `/health` | No |

Static files for uploads are served at `/uploads/...` from the `backend/uploads/` directory.

## Deployment notes

### Frontend (e.g. Vercel)

- **Root directory:** `frontend`
- **Build:** `npm run build`
- **Output:** `frontend/dist`
- **`frontend/vercel.json`** includes SPA rewrites for client-side routing.

Ensure **`frontend/src/config/api.ts`** points `API_BASE_URL` at your live API before building.

### Backend (e.g. Render)

- **Root directory:** `backend` (if the repo is a monorepo)
- **Build command:** `npm install && npm run build` (the `build` script is a no-op placeholder)
- **Start command:** `npm start`

**Required environment variables on the host:**

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | Full Atlas connection string |
| `JWT_SECRET` | Same idea as local — required for login |
| `FRONTEND_URL` | Your deployed frontend URL (CORS), e.g. `https://your-app.vercel.app` |

**Atlas:** Under **Network Access**, allow your server (for demos, `0.0.0.0/0` is common).

**Uploads:** Files saved under `uploads/` on disk are **ephemeral** on many hosts; for production, consider object storage (S3, Cloudinary, etc.).

### Stripe (optional)

Set `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID`, and `STRIPE_WEBHOOK_SECRET`. Point the Stripe webhook URL at `https://<your-api-host>/payment/webhook`.

## Troubleshooting

| Symptom | What to check |
|---------|----------------|
| `MONGODB_URI is not set` | Env var missing on the server |
| Atlas connection / `ReplicaSetNoPrimary` | **Network Access** IP allowlist; cluster not paused |
| Login returns `500` / `Internal Server Error` | **`JWT_SECRET`** set on the backend host |
| CORS errors in the browser | **`FRONTEND_URL`** matches your real frontend origin |
| Images 404 after deploy | Ephemeral disk; re-upload or move storage to the cloud |

## License

Private / your project — add a license file if you open-source it.

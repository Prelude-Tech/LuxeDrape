# 👗 Luxe Drape — Dress Catalog Web Application

A complete, production-ready dress catalog with RBAC, JWT auth, file uploads, and polished animations.

## Tech Stack
- **Frontend:** React 18 + Vite 8 + Tailwind CSS v4 + Framer Motion
- **Backend:** Node.js + Express + MongoDB (Mongoose)
- **Auth:** JWT (HTTP-only cookie) + bcrypt password hashing
- **Security:** Helmet, CORS, express-rate-limit, express-validator
- **Uploads:** Multer v2 (local disk storage)

## Quick Start

### Prerequisites
- Node.js ≥ 18
- MongoDB (local or Atlas)

### 1. Install all dependencies
```bash
# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```

### 2. Configure environment
Edit `server/.env` with your MongoDB URI and a strong JWT secret.

### 3. Seed admin users & sample catalog (run once)
```bash
# Seed master and secondary admin accounts
cd server && node src/utils/seedAdmin.js

# (Optional) Seed initial sample haute couture pieces (Sarees, Lehengas, Shirts, Kurtas)
node src/utils/seedProducts.js
```
Default credentials:
- **Master Admin:** `master_admin` / `Admin@1234`
- **Secondary Admin:** `secondary_admin` / `Admin@5678`

> ⚠️ Change these passwords immediately in production!

### 4. Run development servers

```bash
# Terminal 1 — Backend (port 5000)
cd server && npm run dev

# Terminal 2 — Frontend (port 5173)
cd client && npm run dev
```

Open: http://localhost:5173  
Admin login: http://localhost:5173/admin/login

## Admin Roles

| Role | Permissions |
|------|-------------|
| **Master Admin** | Full CRUD: add, edit, delete products + view stats |
| **Secondary Admin** | Read + Delete only. No create/edit access |
| **Public** | Browse catalog, view product details |

## Deployment (Hostinger)

### Backend
1. Upload `server/` to Hostinger Node.js app directory
2. Set env vars in hPanel → Node.js → Environment Variables:
   ```
   PORT=<hostinger-assigned-port>
   MONGO_URI=mongodb+srv://...
   JWT_SECRET=<your-strong-secret>
   CLIENT_URL=https://yourdomain.com
   NODE_ENV=production
   ```
3. Set startup file to `src/index.js`
4. Run `npm install --production`
5. Run seed script once: `node src/utils/seedAdmin.js`

### Frontend
```bash
cd client && npm run build
```
Upload contents of `client/dist/` to `public_html/` on Hostinger.

> Update the proxy target in `vite.config.js` to point to your backend URL before building.

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/login` | — | Login, sets JWT cookie |
| POST | `/api/auth/logout` | Cookie | Clear session |
| GET | `/api/auth/me` | Cookie | Current user |
| GET | `/api/products` | — | List (filterable, paginated) |
| GET | `/api/products/stats` | Admin | Dashboard stats |
| GET | `/api/products/:id` | — | Single product |
| POST | `/api/products` | Master | Create (multipart/form-data) |
| PUT | `/api/products/:id` | Master | Update |
| DELETE | `/api/products/:id` | Admin | Delete + remove image |
| GET | `/api/admin/users` | Master | List admin users |


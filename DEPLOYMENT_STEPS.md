# 🚀 Step-by-Step Deployment Guide

This guide covers deploying the **NetTech India Placement** project to production.

We will use:
1. **GitHub** (Source Code)
2. **MongoDB Atlas** (Database)
3. **Render** (Backend Hosting)
4. **Vercel** (Frontend Hosting)

---

## Phase 1: Preparation

1. **Sanitize Code**:
   - I have already updated `.env.example` files to be safe.
   - Ensure your real `.env` files are in `.gitignore` (they already are).

2. **Push to GitHub**:
   - Commit all your changes and push to your GitHub repository.
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

---

## Phase 2: Database Setup (MongoDB Atlas)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new Cluster (Free Tier is fine).
3. **Database Access**: Create a database user (e.g., `nettech_admin`).
   - **Save the password!**
4. **Network Access**: Allow access from anywhere (`0.0.0.0/0`).
5. **Get Connection String**:
   - Click "Connect" -> "Drivers".
   - Copy the string, it looks like:
     `mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority`
   - Replace `<username>` and `<password>` with your real credentials.

---

## Phase 3: Backend Deployment (Render)

1. Go to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. **Settings**:
   - **Name**: `nettech-backend` (or similar)
   - **Root Directory**: `backend` (Important!)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. **Environment Variables** (Advanced):
   Add the following keys:
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = *(Paste your Atlas connection string from Phase 2)*
   - `JWT_SECRET` = *(Generate a long random string)*
   - `CLIENT_ORIGIN` = `https://your-vercel-app.vercel.app` (You can update this later after deploying frontend)
6. Click **Create Web Service**.
7. Wait for deployment to finish. **Copy your Backend URL** (e.g., `https://nettech-backend.onrender.com`).

---

## Phase 4: Frontend Deployment (Vercel)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New** -> **Project**.
3. Import your GitHub repository.
4. **Project Configuration**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click "Edit" and select `client`.
5. **Environment Variables**:
   - Key: `VITE_API_BASE_URL`
   - Value: `https://nettech-backend.onrender.com/api` (Your Render Backend URL + `/api`)
6. Click **Deploy**.
7. Wait for completion. **Copy your Frontend URL** (e.g., `https://nettech-placement.vercel.app`).

---

## Phase 5: Final Configuration & Seeding

1. **Update Backend CORS**:
   - Go back to Render -> Environment Variables.
   - Update `CLIENT_ORIGIN` to your actual Vercel URL (e.g., `https://nettech-placement.vercel.app`).
   - Save changes. Render will redeploy automatically.

2. **Seed the Database** (Import Data):
   - You need to run the seed script **against the production database**.
   - **Option A (Easiest - Local Machine)**:
     1. Open `backend/.env` on your local machine.
     2. Temporarily replace `MONGODB_URI` with your **Production Atlas URI**.
     3. Run: `npm run seed` inside the `backend` folder.
     4. **Important**: Revert `backend/.env` to your local URI afterwards.
   - **Option B (Render Shell)**:
     1. In Render Dashboard, go to "Shell" tab.
     2. Run: `npm run seed`.

---

## Phase 6: Verification

1. Open your Vercel URL.
2. Check if:
   - Success stories are loading.
   - Domain cards are visible.
   - "Stats" counter is animating.
3. Try to log in to Admin Dashboard:
   - URL: `/admin`
   - Default Credentials (if seeded): `admin` / `admin123`
   - **Security**: Go to Render Shell and run `node scripts/create-admin.js <newuser> <newpass>` to create a secure admin.

---

## Troubleshooting

- **"Network Error" / API Fails**: Check `VITE_API_BASE_URL` in Vercel. It must end with `/api`.
- **CORS Error**: Check `CLIENT_ORIGIN` in Render. It must match your Vercel URL exactly (no trailing slash usually).
- **Database Empty**: You forgot to run `npm run seed` with the production URI.

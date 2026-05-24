# Day.ly

A short-video sharing platform. Users can upload, browse, and like videos.

## Stack
- **Frontend** — React 19 + Vite, single CSS file design system
- **Backend** — Express, MongoDB (Mongoose), JWT auth, Multer uploads

## Getting started

### Backend
```bash
cd server
npm install
# Edit .env — set a real MONGO_URI and a strong JWT_SECRET
npm run dev
```

### Frontend
```bash
npm install
npm run dev
```

## Project structure
```
src/
  App.jsx              # Root — state, routing, API calls
  App.css              # Full design system (tokens, all component styles)
  main.jsx             # Entry point
  components/
    Navbar.jsx         # Top nav with search, upload, auth buttons
    VideoCard.jsx      # Masonry card with hover-play and like
    VideoModal.jsx     # Lightbox with playback controls and like
    UploadModal.jsx    # Drag-and-drop video upload form
    Toast.jsx          # Success/error notification
  pages/
    ExplorePage.jsx    # Main feed — masonry grid of all videos
    ProfilePage.jsx    # User profile, stats, and their uploaded videos
    AuthPage.jsx       # Login / signup card
server/
  index.js             # Express app entry
  models/user.js       # User schema
  models/video.js      # Video schema (likes, views, full-text index)
  routes/auth.js       # POST /api/auth/signup, /login
  routes/videos.js     # GET/POST /api/videos, like, view endpoints
```

## Notes
- The explore feed is empty until real videos are uploaded — no mock data.
- Like state is per-session (stored in React state). Counts persist in MongoDB.
- Change `JWT_SECRET=12345` in `server/.env` before deploying.
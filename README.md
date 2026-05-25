# Day.ly

A short-video sharing platform. Users can sign up, verify their email, upload videos, and like content from other creators.

## Stack
- **Frontend** - React 19 + Vite, single CSS file design system
- **Backend** - Express, MongoDB (Mongoose), JWT auth, Multer uploads, Resend email

## Getting started

### Backend
```bash
cd server
npm install
# Edit .env (see Environment Variables below)
node index.js
```

### Frontend
```bash
npm install
npm run dev
```

## Project structure

```
dayly/
├── public/
│   └── logo.png                  # Site logo used in navbar and auth page
│
├── src/
│   ├── config.js                 # Shared API base URL (import instead of hardcoding)
│   ├── main.jsx                  # React entry point
│   ├── App.jsx                   # Root component - global state, routing, all API calls
│   ├── App.css                   # Full design system (CSS variables, all component styles)
│   │
│   ├── components/
│   │   ├── Navbar.jsx            # Sticky nav - logo, search, login/signup or avatar
│   │   ├── VideoCard.jsx         # Masonry card - hover-to-play preview, like button
│   │   ├── VideoModal.jsx        # Lightbox - full playback, progress bar, like, view tracking
│   │   ├── UploadModal.jsx       # Drag-and-drop video upload form
│   │   └── Toast.jsx             # Success/error notification
│   │
│   └── pages/
│       ├── ExplorePage.jsx       # Main feed - masonry grid of all videos, search results
│       ├── ProfilePage.jsx       # User profile - stats, uploaded videos, settings panel
│       └── AuthPage.jsx          # Login / signup modal with email/password fields
│
└── server/
    ├── index.js                  # Express app - CORS, rate limiting, static uploads, DB connect
    ├── package.json              # Server dependencies (type: module for ES imports)
    │
    ├── lib/
    │   └── email.js              # Resend integration - sends branded verification email
    │
    ├── models/
    │   ├── user.js               # User schema - username, email, password, verified, verifyToken
    │   └── video.js              # Video schema - title, src, tags, likes, views, likedBy[]
    │
    └── routes/
        ├── auth.js               # POST /signup, POST /login, GET /verify, DELETE /delete
        └── videos.js             # GET /, POST / (upload), POST /:id/like, POST /:id/view
```

## Features
- Email verification on signup via Resend - unverified accounts cannot log in
- JWT authentication with 7-day token expiry
- Video upload with file type validation (video only) and 50MB size limit
- Like toggle - persists to MongoDB, optimistic UI update with revert on failure
- View count - increments each time a video modal is opened
- Settings panel - logout and full account deletion (removes user + all videos from disk and DB)
- Rate limiting on auth routes (100 requests per 15 minutes per IP)
- Search by title or creator name

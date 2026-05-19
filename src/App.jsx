import "./App.css";
import { useEffect, useState, useCallback } from "react";
import Navbar from "./components/Navbar";
import ExplorePage from "./pages/ExplorePage";
import ProfilePage from "./pages/ProfilePage";
import AuthPage from "./pages/AuthPage";
import VideoModal from "./components/VideoModal";
import UploadModal from "./components/UploadModal";
import Toast from "./components/Toast";

const MOCK_VIDEOS = [
  { _id: "v1", title: "Morning vlog", creator: "manya", creatorId: "u1", src: "/videos/sample1.mp4", thumbnail: "", tags: ["vlog", "morning", "lifestyle"], likes: 142, saves: 38, views: 1024, createdAt: new Date(Date.now() - 86400000 * 2) },
  { _id: "v2", title: "Study setup tour", creator: "studyspace", creatorId: "u2", src: "/videos/sample2.mp4", thumbnail: "", tags: ["study", "setup", "aesthetic"], likes: 89, saves: 61, views: 740, createdAt: new Date(Date.now() - 86400000 * 5) },
  { _id: "v3", title: "Travel clip – Himachal", creator: "wanderer", creatorId: "u3", src: "/videos/sample3.mp4", thumbnail: "", tags: ["travel", "himachal", "nature"], likes: 310, saves: 95, views: 2180, createdAt: new Date(Date.now() - 86400000) },
  { _id: "v4", title: "Sunset timelapse", creator: "manya", creatorId: "u1", src: "/videos/sample1.mp4", thumbnail: "", tags: ["nature", "timelapse", "sunset"], likes: 57, saves: 22, views: 430, createdAt: new Date(Date.now() - 86400000 * 10) },
  { _id: "v5", title: "Cafe day out", creator: "wanderer", creatorId: "u3", src: "/videos/sample2.mp4", thumbnail: "", tags: ["cafe", "vlog", "food"], likes: 204, saves: 77, views: 1560, createdAt: new Date(Date.now() - 86400000 * 3) },
  { _id: "v6", title: "Room makeover", creator: "studyspace", creatorId: "u2", src: "/videos/sample3.mp4", thumbnail: "", tags: ["room", "aesthetic", "decor"], likes: 388, saves: 131, views: 3200, createdAt: new Date(Date.now() - 86400000 * 7) },
];

const API = "http://localhost:5000";

export default function App() {
  const [page, setPage] = useState("explore");
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState(MOCK_VIDEOS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeVideo, setActiveVideo] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [likedIds, setLikedIds] = useState(new Set());
  const [savedIds, setSavedIds] = useState(new Set());
  const [toast, setToast] = useState(null);
  const [authMode, setAuthMode] = useState("login");

  useEffect(() => {
    const saved = localStorage.getItem("dayly_user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleLogin = async (loginData) => {
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      const data = await res.json();
      if (res.ok) {
        const u = { username: data.username, email: loginData.email };
        setUser(u);
        localStorage.setItem("dayly_user", JSON.stringify(u));
        setPage("explore");
        showToast(`Welcome back, @${data.username}!`);
      } else {
        showToast(data.message, "error");
      }
    } catch {
      showToast("Cannot reach server. Is the backend running?", "error");
    }
  };

  const handleSignup = async (signupData) => {
    try {
      const res = await fetch(`${API}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Account created! Please log in.");
        setAuthMode("login");
      } else {
        showToast(data.message, "error");
      }
    } catch {
      showToast("Cannot reach server.", "error");
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("dayly_user");
    setPage("explore");
    showToast("Logged out.");
  };

  const toggleLike = (videoId) => {
    if (!user) { showToast("Log in to like videos.", "error"); return; }
    const isLiked = likedIds.has(videoId);
    setLikedIds(prev => {
      const next = new Set(prev);
      isLiked ? next.delete(videoId) : next.add(videoId);
      return next;
    });
    setVideos(prev => prev.map(v =>
      v._id === videoId ? { ...v, likes: v.likes + (isLiked ? -1 : 1) } : v
    ));
  };

  const toggleSave = (videoId) => {
    if (!user) { showToast("Log in to save videos.", "error"); return; }
    setSavedIds(prev => {
      const next = new Set(prev);
      if (next.has(videoId)) { next.delete(videoId); showToast("Removed from saved."); }
      else { next.add(videoId); showToast("Saved to collection!"); }
      return next;
    });
  };

  const handleUpload = (videoData) => {
    const newVideo = {
      _id: `v_${Date.now()}`,
      ...videoData,
      creator: user.username,
      creatorId: user.email,
      likes: 0,
      saves: 0,
      views: 0,
      createdAt: new Date(),
    };
    setVideos(prev => [newVideo, ...prev]);
    setShowUpload(false);
    showToast("Video uploaded successfully!");
  };

  const filteredVideos = searchQuery.trim()
    ? videos.filter(v =>
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : videos;

  const userVideos = user ? videos.filter(v => v.creator === user.username) : [];
  const savedVideos = videos.filter(v => savedIds.has(v._id));

  const goAuth = (mode) => { setAuthMode(mode); setPage("auth"); };

  return (
    <div className="app">
      <Navbar
        user={user}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        onLogoClick={() => { setPage("explore"); setSearchQuery(""); }}
        onProfileClick={() => setPage("profile")}
        onLogin={() => goAuth("login")}
        onSignup={() => goAuth("signup")}
        onLogout={handleLogout}
        onUpload={() => user ? setShowUpload(true) : goAuth("login")}
        onExplore={() => setPage("explore")}
      />

      <main className="main-content">
        {(page === "explore" || page === "home") && (
          <ExplorePage
            videos={filteredVideos}
            searchQuery={searchQuery}
            likedIds={likedIds}
            savedIds={savedIds}
            onVideoClick={setActiveVideo}
            onLike={toggleLike}
            onSave={toggleSave}
            user={user}
          />
        )}

        {page === "profile" && user && (
          <ProfilePage
            user={user}
            userVideos={userVideos}
            savedVideos={savedVideos}
            likedIds={likedIds}
            savedIds={savedIds}
            onVideoClick={setActiveVideo}
            onLike={toggleLike}
            onSave={toggleSave}
            onUpload={() => setShowUpload(true)}
          />
        )}

        {page === "auth" && (
          <AuthPage
            mode={authMode}
            onModeSwitch={setAuthMode}
            onLogin={handleLogin}
            onSignup={handleSignup}
            onBack={() => setPage("explore")}
          />
        )}
      </main>

      {activeVideo && (
        <VideoModal
          video={activeVideo}
          liked={likedIds.has(activeVideo._id)}
          saved={savedIds.has(activeVideo._id)}
          onClose={() => setActiveVideo(null)}
          onLike={toggleLike}
          onSave={toggleSave}
          user={user}
        />
      )}

      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onUpload={handleUpload}
        />
      )}

      {toast && <Toast message={toast.msg} type={toast.type} />}
    </div>
  );
}
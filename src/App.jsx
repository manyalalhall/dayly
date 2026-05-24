import "./App.css";
import { useEffect, useState, useCallback } from "react";
import Navbar from "./components/Navbar";
import ExplorePage from "./pages/ExplorePage";
import ProfilePage from "./pages/ProfilePage";
import AuthPage from "./pages/AuthPage";
import VideoModal from "./components/VideoModal";
import UploadModal from "./components/UploadModal";
import Toast from "./components/Toast";

const API = "http://localhost:5000";

export default function App() {
  const [page, setPage] = useState("explore");
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeVideo, setActiveVideo] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [likedIds, setLikedIds] = useState(new Set());
  const [toast, setToast] = useState(null);
  const [authMode, setAuthMode] = useState("login");

  useEffect(() => {
    const saved = localStorage.getItem("dayly_user");
    if (saved) setUser(JSON.parse(saved));
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await fetch(`${API}/api/videos`);
      if (res.ok) {
        const data = await res.json();
        setVideos(data);
      }
    } catch {
      // backend not running — stay empty
    }
  };

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
        const u = { username: data.username, email: loginData.email, token: data.token, userId: data.userId };
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

  const handleDeleteAccount = async () => {
    try {
      const res = await fetch(`${API}/api/auth/delete`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (res.ok) {
        setUser(null);
        setVideos(prev => prev.filter(v => v.creator !== user.username));
        setLikedIds(new Set());
        localStorage.removeItem("dayly_user");
        setPage("explore");
        showToast("Account deleted.");
      } else {
        showToast("Failed to delete account.", "error");
      }
    } catch {
      showToast("Cannot reach server.", "error");
    }
  };

  const toggleLike = async (videoId) => {
    if (!user) { showToast("Log in to like videos.", "error"); return; }
    const isLiked = likedIds.has(videoId);
    // Optimistic update
    setLikedIds(prev => {
      const next = new Set(prev);
      isLiked ? next.delete(videoId) : next.add(videoId);
      return next;
    });
    setVideos(prev => prev.map(v =>
      v._id === videoId ? { ...v, likes: v.likes + (isLiked ? -1 : 1) } : v
    ));
    try {
      await fetch(`${API}/api/videos/${videoId}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${user.token}` },
      });
    } catch {
      // revert on failure
      setLikedIds(prev => {
        const next = new Set(prev);
        isLiked ? next.add(videoId) : next.delete(videoId);
        return next;
      });
    }
  };

  const handleUpload = async (videoData) => {
    if (!user) return;
    try {
      const formData = new FormData();
      formData.append("title", videoData.title);
      formData.append("tags", videoData.tags.join(","));
      formData.append("video", videoData.file);
      const res = await fetch(`${API}/api/videos`, {
        method: "POST",
        headers: { Authorization: `Bearer ${user.token}` },
        body: formData,
      });
      if (res.ok) {
        const newVideo = await res.json();
        setVideos(prev => [newVideo, ...prev]);
        setShowUpload(false);
        showToast("Video uploaded successfully!");
      } else {
        showToast("Upload failed.", "error");
      }
    } catch {
      showToast("Cannot reach server.", "error");
    }
  };

  const filteredVideos = searchQuery.trim()
    ? videos.filter(v =>
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.creator.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : videos;

  const userVideos = user ? videos.filter(v => v.creator === user.username) : [];

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
      />

      <main className="main-content">
        {(page === "explore" || page === "home") && (
          <ExplorePage
            videos={filteredVideos}
            searchQuery={searchQuery}
            likedIds={likedIds}
            onVideoClick={setActiveVideo}
            onLike={toggleLike}
            user={user}
          />
        )}

        {page === "profile" && user && (
          <ProfilePage
            user={user}
            userVideos={userVideos}
            likedIds={likedIds}
            onVideoClick={setActiveVideo}
            onLike={toggleLike}
            onUpload={() => setShowUpload(true)}
            onLogout={handleLogout}
            onDeleteAccount={handleDeleteAccount}
          />
        )}
      </main>

      {page === "auth" && (
        <AuthPage
          mode={authMode}
          onModeSwitch={setAuthMode}
          onLogin={handleLogin}
          onSignup={handleSignup}
          onBack={() => setPage("explore")}
        />
      )}

      {activeVideo && (
        <VideoModal
          video={activeVideo}
          liked={likedIds.has(activeVideo._id)}
          onClose={() => setActiveVideo(null)}
          onLike={toggleLike}
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
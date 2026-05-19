import { useState } from "react";
import VideoCard from "../components/VideoCard";

export default function ProfilePage({ user, userVideos, savedVideos, likedIds, savedIds, onVideoClick, onLike, onSave, onUpload }) {
  const [tab, setTab] = useState("videos");

  const displayVideos = tab === "videos" ? userVideos : savedVideos;

  const totalLikes = userVideos.reduce((s, v) => s + v.likes, 0);
  const totalViews = userVideos.reduce((s, v) => s + v.views, 0);
  const fmt = (n) => n >= 1000 ? `${(n/1000).toFixed(1)}k` : n;

  return (
    <div className="profile-page">
      <div className="profile-hero">
        <div className="profile-avatar-large">
          {user.username[0].toUpperCase()}
        </div>
        <div className="profile-info">
          <h1 className="profile-name">@{user.username}</h1>
          <p className="profile-email">{user.email}</p>
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-value">{userVideos.length}</span>
              <span className="stat-label">Videos</span>
            </div>
            <div className="stat-divider"/>
            <div className="stat-item">
              <span className="stat-value">{fmt(totalLikes)}</span>
              <span className="stat-label">Likes</span>
            </div>
            <div className="stat-divider"/>
            <div className="stat-item">
              <span className="stat-value">{fmt(totalViews)}</span>
              <span className="stat-label">Views</span>
            </div>
            <div className="stat-divider"/>
            <div className="stat-item">
              <span className="stat-value">{savedVideos.length}</span>
              <span className="stat-label">Saved</span>
            </div>
          </div>
          <button className="btn-primary profile-upload-btn" onClick={onUpload}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
            Upload video
          </button>
        </div>
      </div>

      <div className="profile-tabs">
        <button className={`tab-btn ${tab === "videos" ? "active" : ""}`} onClick={() => setTab("videos")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>
          Videos
        </button>
        <button className={`tab-btn ${tab === "saved" ? "active" : ""}`} onClick={() => setTab("saved")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          Saved
        </button>
      </div>

      {displayVideos.length === 0 ? (
        <div className="empty-state profile-empty">
          {tab === "videos" ? (
            <>
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.3">
                <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
              </svg>
              <p>No videos yet</p>
              <span>Upload your first video to get started</span>
              <button className="btn-primary" style={{ marginTop: "16px" }} onClick={onUpload}>Upload now</button>
            </>
          ) : (
            <>
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.3">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
              <p>No saved videos</p>
              <span>Save videos you love from the explore feed</span>
            </>
          )}
        </div>
      ) : (
        <div className="masonry-grid">
          {displayVideos.map(video => (
            <VideoCard
              key={video._id}
              video={video}
              liked={likedIds.has(video._id)}
              saved={savedIds.has(video._id)}
              onVideoClick={onVideoClick}
              onLike={onLike}
              onSave={onSave}
            />
          ))}
        </div>
      )}
    </div>
  );
}
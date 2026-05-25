import { useState } from "react"
import VideoCard from "../components/VideoCard"

export default function ProfilePage({ user, userVideos, likedIds, pinnedIds, onVideoClick, onLike, onPin, onUpload, onLogout, onDeleteAccount }) {
  const [showSettings, setShowSettings] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [activeTab, setActiveTab] = useState("posts")

  const totalLikes = userVideos.reduce((s, v) => s + v.likes, 0)
  const totalViews = userVideos.reduce((s, v) => s + v.views, 0)
  const fmt = (n) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n

  const pinnedVideos = userVideos.filter(v => pinnedIds.has(v._id))

  return (
    <div className="profile-page">
      <div className="profile-hero">
        <div className="profile-avatar-large">
          {user.username[0].toUpperCase()}
        </div>
        <div className="profile-info">
          <div className="profile-name-row">
            <h1 className="profile-name">@{user.username}</h1>
            <button className="settings-btn" onClick={() => { setShowSettings(true); setConfirmDelete(false) }} title="Settings">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </button>
          </div>
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
          </div>
          <button className="btn-primary profile-upload-btn" onClick={onUpload}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
            Upload video
          </button>
        </div>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div className="modal-backdrop" onClick={() => setShowSettings(false)}>
          <div className="settings-box" onClick={e => e.stopPropagation()}>
            <div className="settings-header">
              <h3>Settings</h3>
              <button className="modal-close" onClick={() => setShowSettings(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            {!confirmDelete ? (
              <div className="settings-options">
                <button className="settings-option" onClick={() => { setShowSettings(false); onLogout() }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Log out
                </button>
                <button className="settings-option danger" onClick={() => setConfirmDelete(true)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                  </svg>
                  Delete account
                </button>
              </div>
            ) : (
              <div className="delete-confirm">
                <p className="delete-warning">This will permanently delete your account and all your videos. This cannot be undone.</p>
                <div className="delete-actions">
                  <button className="btn-ghost" onClick={() => setConfirmDelete(false)}>Cancel</button>
                  <button className="btn-danger" onClick={() => { setShowSettings(false); onDeleteAccount() }}>Yes, delete everything</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="profile-tabs">
        <button className={`profile-tab ${activeTab === "posts" ? "active" : ""}`} onClick={() => setActiveTab("posts")}>
          Posts
          <span className="tab-count">{userVideos.length}</span>
        </button>
        <button className={`profile-tab ${activeTab === "pins" ? "active" : ""}`} onClick={() => setActiveTab("pins")}>
          <span className="pin-dot pinned" style={{ marginRight: "6px" }} />
          Pins
          <span className="tab-count">{pinnedVideos.length}</span>
        </button>
      </div>

      {/* Posts tab */}
      {activeTab === "posts" && (
        userVideos.length === 0 ? (
          <div className="empty-state">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.3">
              <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            </svg>
            <p>No videos yet</p>
            <span>Upload your first video to get started</span>
          </div>
        ) : (
          <div className="masonry-grid" style={{ paddingTop: "20px" }}>
            {userVideos.map(video => (
              <VideoCard
                key={video._id}
                video={video}
                liked={likedIds.has(video._id)}
                pinned={pinnedIds.has(video._id)}
                onVideoClick={onVideoClick}
                onLike={onLike}
                onPin={onPin}
              />
            ))}
          </div>
        )
      )}

      {/* Pins tab */}
      {activeTab === "pins" && (
        pinnedVideos.length === 0 ? (
          <div className="empty-state">
            <span className="pin-dot pinned" style={{ width: "48px", height: "48px", opacity: 0.3 }} />
            <p>No pins yet</p>
            <span>Pin videos from your posts to feature them here</span>
          </div>
        ) : (
          <div className="masonry-grid" style={{ paddingTop: "20px" }}>
            {pinnedVideos.map(video => (
              <VideoCard
                key={video._id}
                video={video}
                liked={likedIds.has(video._id)}
                pinned={pinnedIds.has(video._id)}
                onVideoClick={onVideoClick}
                onLike={onLike}
                onPin={onPin}
              />
            ))}
          </div>
        )
      )}
    </div>
  )
}
import { useEffect, useRef, useState } from "react";
import { API } from "../config.js";

export default function VideoModal({ video, liked, onClose, onLike, user }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Increment view count when video is opened
    fetch(`${API}/api/videos/${video._id}/view`, { method: "POST" })
      .catch(() => {});
  }, [video._id]);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const togglePlay = () => {
    if (videoRef.current) {
      playing ? videoRef.current.pause() : videoRef.current.play();
      setPlaying(!playing);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100 || 0);
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    if (videoRef.current) {
      videoRef.current.currentTime = ratio * videoRef.current.duration;
    }
  };

  const fmt = (n) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        <div className="modal-video-wrap" onClick={togglePlay}>
          <video
            ref={videoRef}
            src={video.src}
            autoPlay
            loop
            playsInline
            onTimeUpdate={handleTimeUpdate}
            className="modal-video"
          />
          {!playing && (
            <div className="modal-play-overlay">
              <svg width="52" height="52" viewBox="0 0 24 24" fill="white">
                <circle cx="12" cy="12" r="11" fillOpacity="0.25"/>
                <path d="M10 8l6 4-6 4V8z"/>
              </svg>
            </div>
          )}
          <div className="modal-progress-bar" onClick={handleSeek}>
            <div className="modal-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="modal-info">
          <div className="modal-header">
            <div className="modal-creator-info">
              <div className="modal-avatar">{video.creator[0].toUpperCase()}</div>
              <div>
                <p className="modal-title">{video.title}</p>
                <p className="modal-creator">@{video.creator}</p>
              </div>
            </div>
            <span className="modal-stat">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              {fmt(video.views)}
            </span>
          </div>

          {video.tags?.length > 0 && (
            <div className="modal-tags">
              {video.tags.map(t => <span key={t} className="tag">#{t}</span>)}
            </div>
          )}

          <div className="modal-actions">
            <button
              className={`modal-action-btn ${liked ? "active-like" : ""}`}
              onClick={() => onLike(video._id)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <span>{fmt(video.likes)} Likes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
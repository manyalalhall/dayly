import { useState, useRef } from "react";

export default function VideoCard({ video, liked, pinned, onVideoClick, onLike, onPin }) {
  const [hovered, setHovered] = useState(false);
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    setHovered(true);
    videoRef.current?.play().catch(() => {});
  };
  const handleMouseLeave = () => {
    setHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const fmt = (n) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n;

  return (
    <div
      className={`video-card ${hovered ? "hovered" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="video-thumb" onClick={() => onVideoClick(video)}>
        <video
          ref={videoRef}
          src={video.src}
          muted
          loop
          playsInline
          preload="metadata"
        />
        <div className="video-overlay">
          <svg className="play-icon" width="40" height="40" viewBox="0 0 24 24" fill="white">
            <circle cx="12" cy="12" r="11" fillOpacity="0.3"/>
            <path d="M10 8l6 4-6 4V8z"/>
          </svg>
        </div>
      </div>

      <div className="video-info">
        <p className="video-title" onClick={() => onVideoClick(video)}>{video.title}</p>
        <div className="video-meta">
          <span className="creator-link">@{video.creator}</span>
          <div className="video-actions">
            <button
              className={`action-btn ${liked ? "liked" : ""}`}
              onClick={(e) => { e.stopPropagation(); onLike(video._id); }}
              title="Like"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <span>{fmt(video.likes)}</span>
            </button>
            <button
              className={`action-btn pin-btn ${pinned ? "pinned" : ""}`}
              onClick={(e) => { e.stopPropagation(); onPin(video._id); }}
              title="Pin"
            >
              <span className={`pin-dot ${pinned ? "pinned" : ""}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
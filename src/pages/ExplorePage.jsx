import VideoCard from "../components/VideoCard";

export default function ExplorePage({ videos, searchQuery, likedIds, onVideoClick, onLike, user }) {
  return (
    <div className="explore-page">
      {searchQuery && (
        <div className="search-header">
          <p className="search-results-label">
            {videos.length > 0
              ? <><strong>{videos.length}</strong> results for "<em>{searchQuery}</em>"</>
              : <>No results for "<em>{searchQuery}</em>"</>
            }
          </p>
        </div>
      )}

      {videos.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.3">
            <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
          </svg>
          <p>No videos yet</p>
          <span>Be the first to upload something</span>
        </div>
      ) : (
        <div className="masonry-grid">
          {videos.map(video => (
            <VideoCard
              key={video._id}
              video={video}
              liked={likedIds.has(video._id)}
              onVideoClick={onVideoClick}
              onLike={onLike}
            />
          ))}
        </div>
      )}
    </div>
  );
}
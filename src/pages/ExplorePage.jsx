import VideoCard from "../components/VideoCard";

const CATEGORIES = ["All", "Vlog", "Travel", "Study", "Aesthetic", "Nature", "Food", "Lifestyle"];

export default function ExplorePage({ videos, searchQuery, likedIds, savedIds, onVideoClick, onLike, onSave }) {
  return (
    <div className="explore-page">
      {!searchQuery && (
        <div className="category-bar">
          {CATEGORIES.map(cat => (
            <button key={cat} className="cat-btn">{cat}</button>
          ))}
        </div>
      )}

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
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <p>No videos found</p>
          <span>Try a different search term</span>
        </div>
      ) : (
        <div className="masonry-grid">
          {videos.map(video => (
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
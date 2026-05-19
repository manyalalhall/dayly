import { useState, useRef } from "react";

export default function UploadModal({ onClose, onUpload }) {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [videoSrc, setVideoSrc] = useState(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef(null);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("video/")) return;
    setVideoFile(file);
    setVideoSrc(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = () => {
    if (!title.trim() || !videoSrc) return;
    onUpload({
      title: title.trim(),
      src: videoSrc,
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="upload-box" onClick={e => e.stopPropagation()}>
        <div className="upload-header">
          <h2>Upload a video</h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {!videoSrc ? (
          <div
            className={`drop-zone ${dragging ? "drag-active" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
          >
            <input ref={fileRef} type="file" accept="video/*" hidden onChange={e => handleFile(e.target.files[0])} />
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <p className="drop-text">Drag & drop a video here</p>
            <p className="drop-sub">or click to browse</p>
          </div>
        ) : (
          <div className="upload-preview">
            <video src={videoSrc} controls className="upload-video-preview" />
            <button className="change-video-btn" onClick={() => { setVideoFile(null); setVideoSrc(null); }}>Change video</button>
          </div>
        )}

        <div className="upload-fields">
          <input
            className="upload-input"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={80}
          />
          <input
            className="upload-input"
            placeholder="Tags (comma separated, e.g. vlog, travel)"
            value={tags}
            onChange={e => setTags(e.target.value)}
          />
        </div>

        <button
          className={`upload-submit-btn ${(!title.trim() || !videoSrc) ? "disabled" : ""}`}
          onClick={handleSubmit}
          disabled={!title.trim() || !videoSrc}
        >
          Post video
        </button>
      </div>
    </div>
  );
}
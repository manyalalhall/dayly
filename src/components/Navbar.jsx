import { useState, useRef } from "react";

export default function Navbar({ user, searchQuery, onSearch, onLogoClick, onProfileClick, onLogin, onSignup }) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  const handleKey = (e) => {
    if (e.key === "Escape") { onSearch(""); inputRef.current?.blur(); }
  };

  return (
    <header className="navbar">
      <div className="navbar-logo" onClick={onLogoClick}>
        <img src="/logo.png" alt="Day.ly" className="navbar-logo-img" />
        <span className="logo-text">day<span className="logo-dot">.</span>ly</span>
      </div>

      <div className={`search-wrap ${focused ? "focused" : ""}`}>
        <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <input
          ref={inputRef}
          className="search-input"
          type="text"
          placeholder="Search videos, creators, tags…"
          value={searchQuery}
          onChange={e => onSearch(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={handleKey}
        />
        {searchQuery && (
          <button className="search-clear" onClick={() => onSearch("")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        )}
      </div>

      <div className="navbar-actions">
        {user ? (
          <button className="avatar-btn" onClick={onProfileClick} title={`@${user.username}`}>
            <span className="avatar-letter">{user.username[0].toUpperCase()}</span>
          </button>
        ) : (
          <>
            <button className="btn-ghost" onClick={onLogin}>Log in</button>
            <button className="btn-primary" onClick={onSignup}>Sign up</button>
          </>
        )}
      </div>
    </header>
  );
}
import { useState } from "react";

export default function AuthPage({ mode, onModeSwitch, onLogin, onSignup, onBack }) {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ username: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onLogin(loginData);
    setLoading(false);
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSignup(signupData);
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <button className="auth-back" onClick={onBack}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        Back to explore
      </button>

      <div className="auth-card">
        <div className="auth-logo">
          <svg width="36" height="36" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="13" fill="#e63946"/>
            <path d="M8 10 L14 18 L20 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
          <span className="logo-text">day<span className="logo-dot">.</span>ly</span>
        </div>

        <div className="auth-tabs">
          <button className={`auth-tab ${mode === "login" ? "active" : ""}`} onClick={() => onModeSwitch("login")}>Log in</button>
          <button className={`auth-tab ${mode === "signup" ? "active" : ""}`} onClick={() => onModeSwitch("signup")}>Sign up</button>
        </div>

        {mode === "login" ? (
          <form className="auth-form" onSubmit={handleLoginSubmit}>
            <label className="field-label">Email</label>
            <input
              className="auth-input"
              type="email"
              placeholder="you@example.com"
              value={loginData.email}
              onChange={e => setLoginData({ ...loginData, email: e.target.value })}
              required
              autoFocus
            />
            <label className="field-label">Password</label>
            <div className="pass-wrap">
              <input
                className="auth-input"
                type={showPass ? "text" : "password"}
                placeholder="Your password"
                value={loginData.password}
                onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                required
              />
              <button type="button" className="show-pass" onClick={() => setShowPass(s => !s)}>
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
            <button className="auth-submit-btn" type="submit" disabled={loading}>
              {loading ? "Logging in…" : "Log in"}
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleSignupSubmit}>
            <label className="field-label">Username</label>
            <input
              className="auth-input"
              type="text"
              placeholder="yourname"
              value={signupData.username}
              onChange={e => setSignupData({ ...signupData, username: e.target.value })}
              required
              autoFocus
            />
            <label className="field-label">Email</label>
            <input
              className="auth-input"
              type="email"
              placeholder="you@example.com"
              value={signupData.email}
              onChange={e => setSignupData({ ...signupData, email: e.target.value })}
              required
            />
            <label className="field-label">Password</label>
            <div className="pass-wrap">
              <input
                className="auth-input"
                type={showPass ? "text" : "password"}
                placeholder="Create a password"
                value={signupData.password}
                onChange={e => setSignupData({ ...signupData, password: e.target.value })}
                required
              />
              <button type="button" className="show-pass" onClick={() => setShowPass(s => !s)}>
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
            <button className="auth-submit-btn" type="submit" disabled={loading}>
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>
        )}

        <p className="auth-switch">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button className="auth-switch-btn" onClick={() => onModeSwitch(mode === "login" ? "signup" : "login")}>
            {mode === "login" ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";

export default function AuthPage({ mode, onModeSwitch, onLogin, onSignup, onBack }) {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ username: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onBack(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onBack]);

  const handleLoginSubmit = async () => {
    if (!loginData.email || !loginData.password) return;
    setLoading(true);
    await onLogin(loginData);
    setLoading(false);
  };

  const handleSignupSubmit = async () => {
    if (!signupData.username || !signupData.email || !signupData.password) return;
    setLoading(true);
    await onSignup(signupData);
    setLoading(false);
  };

  const handleKeyDown = (e, submitFn) => {
    if (e.key === "Enter") submitFn();
  };

  return (
    <div className="modal-backdrop" onClick={onBack}>
      <div className="auth-card" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        <div className="auth-logo">
          <img src="/logo.png" alt="Day.ly" style={{ height: "44px", width: "auto" }} />
        </div>

        <div className="auth-tabs">
          <button className={`auth-tab ${mode === "login" ? "active" : ""}`} onClick={() => onModeSwitch("login")}>Log in</button>
          <button className={`auth-tab ${mode === "signup" ? "active" : ""}`} onClick={() => onModeSwitch("signup")}>Sign up</button>
        </div>

        {mode === "login" ? (
          <div className="auth-form">
            <label className="field-label">Email</label>
            <input
              className="auth-input" type="email" placeholder="you@example.com"
              value={loginData.email}
              onChange={e => setLoginData({ ...loginData, email: e.target.value })}
              onKeyDown={e => handleKeyDown(e, handleLoginSubmit)}
              autoFocus
            />
            <label className="field-label">Password</label>
            <div className="pass-wrap">
              <input
                className="auth-input" type={showPass ? "text" : "password"} placeholder="Your password"
                value={loginData.password}
                onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                onKeyDown={e => handleKeyDown(e, handleLoginSubmit)}
              />
              <button type="button" className="show-pass" onClick={() => setShowPass(s => !s)}>
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
            <button className="auth-submit-btn" onClick={handleLoginSubmit} disabled={loading}>
              {loading ? "Logging in…" : "Log in"}
            </button>
          </div>
        ) : (
          <div className="auth-form">
            <label className="field-label">Username</label>
            <input
              className="auth-input" type="text" placeholder="yourname"
              value={signupData.username}
              onChange={e => setSignupData({ ...signupData, username: e.target.value })}
              onKeyDown={e => handleKeyDown(e, handleSignupSubmit)}
              autoFocus
            />
            <label className="field-label">Email</label>
            <input
              className="auth-input" type="email" placeholder="you@example.com"
              value={signupData.email}
              onChange={e => setSignupData({ ...signupData, email: e.target.value })}
              onKeyDown={e => handleKeyDown(e, handleSignupSubmit)}
            />
            <label className="field-label">Password</label>
            <div className="pass-wrap">
              <input
                className="auth-input" type={showPass ? "text" : "password"} placeholder="Create a password"
                value={signupData.password}
                onChange={e => setSignupData({ ...signupData, password: e.target.value })}
                onKeyDown={e => handleKeyDown(e, handleSignupSubmit)}
              />
              <button type="button" className="show-pass" onClick={() => setShowPass(s => !s)}>
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
            <button className="auth-submit-btn" onClick={handleSignupSubmit} disabled={loading}>
              {loading ? "Creating account…" : "Create account"}
            </button>
          </div>
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
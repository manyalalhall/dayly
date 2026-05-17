import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [page, setPage] = useState("home");
  const [backendMessage, setBackendMessage] = useState("");

  const videos = [
    { title: "Morning vlog", creator: "@manya", src: "/videos/sample1.mp4" },
    { title: "Study setup", creator: "@creator", src: "/videos/sample2.mp4" },
    { title: "Travel clip", creator: "@wanderer", src: "/videos/sample3.mp4" },
  ];

  useEffect(() => {
    fetch("http://localhost:5000")
      .then((res) => res.text())
      .then((data) => setBackendMessage(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="app">
      <header className="navbar">
        <h1 onClick={() => setPage("home")}>Day.ly</h1>

        <input
          className="search"
          type="text"
          placeholder="Search short videos..."
        />

        <div className="nav-buttons">
          <button onClick={() => setPage("login")} className="nav-btn">
            Login
          </button>

          <button onClick={() => setPage("signup")} className="upload-btn">
            Signup
          </button>
        </div>
      </header>

      {page === "home" && (
        <>
          <p style={{ padding: "20px", fontWeight: "bold" }}>
            Backend: {backendMessage}
          </p>

          <main className="video-grid">
            {videos.map((video, index) => (
              <div className="video-card" key={index}>
                <video controls>
                  <source src={video.src} type="video/mp4" />
                </video>

                <h3>{video.title}</h3>
                <p>{video.creator}</p>
              </div>
            ))}
          </main>
        </>
      )}

      {page === "login" && (
        <div className="auth-container">
          <div className="auth-box">
            <h2>Login to Day.ly</h2>
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button className="auth-btn">Login</button>
          </div>
        </div>
      )}

      {page === "signup" && (
        <div className="auth-container">
          <div className="auth-box">
            <h2>Create Account</h2>
            <input type="text" placeholder="Username" />
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button className="auth-btn">Signup</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
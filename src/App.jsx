import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [page, setPage] = useState("home");
  const [backendMessage, setBackendMessage] = useState("");

  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [user, setUser] = useState(null);

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

  const handleSignup = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();
      alert(data.message);

      if (response.ok) {
        setPage("login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        setUser({
          username: data.username,
          email: loginData.email,
        });

        alert("Login successful");
        setPage("home");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setPage("home");
  };

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
          {user ? (
            <>
              <p style={{ fontWeight: "bold" }}>@{user.username}</p>

              <button className="nav-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setPage("login")} className="nav-btn">
                Login
              </button>

              <button onClick={() => setPage("signup")} className="upload-btn">
                Signup
              </button>
            </>
          )}
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

            <input
              type="email"
              placeholder="Email"
              value={loginData.email}
              onChange={(e) =>
                setLoginData({
                  ...loginData,
                  email: e.target.value,
                })
              }
            />

            <input
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({
                  ...loginData,
                  password: e.target.value,
                })
              }
            />

            <button className="auth-btn" onClick={handleLogin}>
              Login
            </button>
          </div>
        </div>
      )}

      {page === "signup" && (
        <div className="auth-container">
          <div className="auth-box">
            <h2>Create Account</h2>

            <input
              type="text"
              placeholder="Username"
              value={signupData.username}
              onChange={(e) =>
                setSignupData({
                  ...signupData,
                  username: e.target.value,
                })
              }
            />

            <input
              type="email"
              placeholder="Email"
              value={signupData.email}
              onChange={(e) =>
                setSignupData({
                  ...signupData,
                  email: e.target.value,
                })
              }
            />

            <input
              type="password"
              placeholder="Password"
              value={signupData.password}
              onChange={(e) =>
                setSignupData({
                  ...signupData,
                  password: e.target.value,
                })
              }
            />

            <button className="auth-btn" onClick={handleSignup}>
              Signup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
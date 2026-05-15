import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="navbar">
        <h1>Day.ly</h1>

        <input
          className="search"
          type="text"
          placeholder="Search short videos..."
        />

        <button className="upload-btn">Upload</button>
      </header>

      <main className="video-grid">
        <div className="video-card">
          <video controls>
            <source src="/videos/sample1.mp4" type="video/mp4" />
          </video>
          <h3>Morning vlog</h3>
          <p>@manya</p>
        </div>

        <div className="video-card">
          <video controls>
            <source src="/videos/sample2.mp4" type="video/mp4" />
          </video>
          <h3>Study setup</h3>
          <p>@creator</p>
        </div>

        <div className="video-card">
          <video controls>
            <source src="/videos/sample3.mp4" type="video/mp4" />
          </video>
          <h3>Travel clip</h3>
          <p>@wanderer</p>
        </div>
      </main>
    </div>
  );
}

export default App;
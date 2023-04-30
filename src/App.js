import React, { useEffect, useState } from "react";
import "./App.css";
import VideoPlayer from "./components/VideoPlayer";

const App = () => {
  const [status, setStatus] = useState("Disconnected");

  useEffect(() => {
    setStatus("Connected");
  }, []);

  return (
    <div className="app">
      <div className="status">Status: {status}</div>
      <VideoPlayer />
    </div>
  );
};

export default App;

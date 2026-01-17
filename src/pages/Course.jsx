import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./course.css";

// ✅ AI Assistant (FREE chatbot)
import AIAssistant from "../components/AIAssistant";

export default function Course() {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));

  const [course, setCourse] = useState(null);
  const [current, setCurrent] = useState(null);
  const [progress, setProgress] = useState(0);

  const playerRef = useRef(null);

  // Load course
  useEffect(() => {
    axios
      .get(`http://ai-it-training-server.onrender.com/api/course/${id}`)
      .then((res) => {
        setCourse(res.data);
        setCurrent(res.data.videos?.[0]);
      });
  }, [id]);

  // Load progress
  useEffect(() => {
    if (!user) return;

    axios
      .get(`http://ai-it-training-server.onrender.com/api/progress/${user._id}/${id}`)
      .then((res) => setProgress(res.data?.percentage || 0));
  }, [id, user]);

  // Load YouTube Iframe API
  useEffect(() => {
    if (window.YT) return;

    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(script);
  }, []);

  // Initialize player on video change
  useEffect(() => {
    if (!current || !window.YT) return;

    if (playerRef.current) {
      playerRef.current.destroy();
    }

    playerRef.current = new window.YT.Player("player", {
      videoId: current.videoId,
      playerVars: { autoplay: 1 },
      events: {
        onStateChange: onPlayerStateChange,
      },
    });
  }, [current]);

  // Mark progress ONLY when video ends
  const onPlayerStateChange = async (event) => {
    if (event.data === window.YT.PlayerState.ENDED) {
      const res = await axios.post(
        "http://ai-it-training-server.onrender.com/api/progress/complete",
        {
          userId: user._id,
          courseId: id,
          videoId: current.videoId,
        }
      );
      setProgress(res.data.percentage);
    }
  };

  if (!course) return <p className="loading">Loading...</p>;

  return (
    <div className="course-page">
      {/* LEFT - VIDEO SECTION */}
      <div className="video-section">
        <h2>{course.title}</h2>

        {/* Progress */}
        <div className="progress-box">
          <span>Progress: {progress}%</span>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* YouTube Player */}
        <div id="player"></div>

        {/* Certificate */}
        {progress === 100 && (
          <button
            className="cert-btn"
            onClick={() => (window.location = "/cert")}
          >
            🎓 Get Certificate
          </button>
        )}
      </div>

      {/* RIGHT - PLAYLIST */}
      <div className="playlist">
        <h3>Course Content</h3>

        {course.videos.map((v, i) => (
          <div
            key={i}
            className={`video-item ${
              current?.videoId === v.videoId ? "active" : ""
            }`}
            onClick={() => setCurrent(v)}
          >
            ▶ {v.title}
          </div>
        ))}
      </div>

      {/* 🤖 FLOATING AI CHATBOT */}
      <AIAssistant courseTitle={course.title} />
    </div>
  );
}

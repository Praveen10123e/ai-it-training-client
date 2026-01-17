import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../pages/dashboard.css";

import cImg from "../assets/courses/c.png";
import javaImg from "../assets/courses/java.jpg";
import pythonImg from "../assets/courses/python.jpg";
import frontImg from "../assets/courses/front.jpg";
import backImg from "../assets/courses/back.jpg";

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")); // ✅ get logged user

  useEffect(() => {
    axios.get("https://ai-it-training-server.onrender.com/api/course")
      .then(res => setCourses(res.data))
      .catch(err => console.log(err));
  }, []);

  const getCourseImage = (title) => {
    title = title.toLowerCase();
    if (title.includes("java")) return javaImg;
    if (title.includes("python")) return pythonImg;
    if (title.includes("frontend")) return frontImg;
    if (title.includes("backend")) return backImg;
    return cImg;
  };

  return (
    <div className="dashboard">
      <h1>📚 Available Courses</h1>

      <div className="course-grid">
        {courses.map(course => (
          <div key={course._id} className="course-card">
            <img
              src={getCourseImage(course.title)}
              alt={course.title}
              className="course-image"
            />

            <div className="course-body">
              <h3>{course.title}</h3>
              <p>
                {course.description ||
                  "Learn step-by-step with videos and AI support"}
              </p>

              {/* ✅ ADMIN / STUDENT BUTTON */}
              {user?.role === "admin" ? (
                <button onClick={() => navigate("/admin")}>
                  Manage Course
                </button>
              ) : (
                <button onClick={() => navigate(`/course/${course._id}`)}>
                  Start Learning
                </button>
              )}

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

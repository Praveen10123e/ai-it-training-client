import { useEffect, useState } from "react";
import axios from "axios";
import "./admin.css";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);


export default function AdminDashboard() {
  const [stats, setStats] = useState([]);
  const [courses, setCourses] = useState([]);
  const [editCourse, setEditCourse] = useState(null);
  const [title, setTitle] = useState("");

  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const [videoTitle, setVideoTitle] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  const loadData = async () => {
    const statsRes = await axios.get("https://ai-it-training-server.onrender.com/api/admin/stats");
    const courseRes = await axios.get("https://ai-it-training-server.onrender.com/api/course");
    setStats(statsRes.data);
    setCourses(courseRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Extract YouTube ID
  const getVideoId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|embed\/|watch\?v=|&v=)([^#&?]{11}).*/;
    const match = url.match(regExp);
    return match ? match[2] : null;
  };

  // ADD COURSE
  const addCourse = async () => {
    if (!newTitle) return alert("Enter course title");

    await axios.post("https://ai-it-training-server.onrender.com/api/course", {
      title: newTitle,
      description: newDesc,
      videos: []
    });

    setNewTitle("");
    setNewDesc("");
    loadData();
  };

  // ADD VIDEO
  const addVideo = async () => {
    const videoId = getVideoId(videoLink);

    if (!videoId || !selectedCourse)
      return alert("Invalid link or select course");

    await axios.post("https://ai-it-training-server.onrender.com/api/course/video", {
      courseId: selectedCourse,
      title: videoTitle,
      videoId
    });

    setVideoTitle("");
    setVideoLink("");
    loadData();
  };

  // DELETE COURSE
  const deleteCourse = async (id) => {
    if (!window.confirm("Delete course permanently?")) return;
    await axios.delete(`https://ai-it-training-server.onrender.com/api/course/${id}`);
    loadData();
  };

  // EDIT COURSE
  const startEdit = (course) => {
    setEditCourse(course);
    setTitle(course.title);
  };

  const saveEdit = async () => {
    await axios.put(
      `https://ai-it-training-server.onrender.com/api/course/${editCourse._id}`,
      { title }
    );
    setEditCourse(null);
    loadData();
  };

  // Chart Data
  const chartData = {
    labels: stats.map(s => s.title),
    datasets: [
      {
        label: "Learners (%)",
        data: stats.map(s => Number(s.learners)),
        backgroundColor: "#2563eb",
        borderRadius: 6
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: "white" }
      }
    },
    scales: {
      x: {
        ticks: { color: "#93c5fd" },
        grid: { color: "#1e293b" }
      },
      y: {
        beginAtZero: true,
        min: 0,
        max: 100,
        ticks: {
          stepSize: 10,
          color: "#93c5fd"
        },
        grid: { color: "#1e293b" }
      }
    }
  };

  return (
    <div className="admin-page">
      <h1 className="admin-title">📊 Admin Dashboard</h1>

      {/* ADD COURSE */}
      <div className="add-course-box">
        <h2>Add Course</h2>
        <input placeholder="Course Title" value={newTitle} onChange={e=>setNewTitle(e.target.value)} />
        <input placeholder="Description" value={newDesc} onChange={e=>setNewDesc(e.target.value)} />
        <button onClick={addCourse}>+ Add Course</button>
      </div>

      {/* ADD VIDEO */}
      <div className="add-course-box">
        <h2>Add YouTube Video</h2>

        <select value={selectedCourse} onChange={e=>setSelectedCourse(e.target.value)}>
          <option value="">Select Course</option>
          {courses.map(c => (
            <option key={c._id} value={c._id}>{c.title}</option>
          ))}
        </select>

        <input placeholder="Video Title" value={videoTitle} onChange={e=>setVideoTitle(e.target.value)} />
        <input placeholder="YouTube Link" value={videoLink} onChange={e=>setVideoLink(e.target.value)} />
        <button onClick={addVideo}>+ Add Video</button>
      </div>

      {/* TABLE */}
      <div className="table-box">
        <h2>Manage Courses</h2>
        <table>
          <thead>
            <tr>
              <th align="left">Course</th>
              <th>Learners</th>
              <th>Videos</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(c => {
              const stat = stats.find(s => s.courseId == c._id);

              return (
                <tr key={c._id}>
                  <td align="left">{c.title}</td>
                  <td>{stat?.learners || 0}</td>
                  <td>{c.videos?.length || 0}</td>
                  <td>
                    <button className="btn edit" onClick={()=>startEdit(c)}>Edit</button>
                    <button className="btn delete" onClick={()=>deleteCourse(c._id)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* CHART */}
      <div className="chart-box">
        <h2>Course Popularity</h2>
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* MODAL */}
      {editCourse && (
  <div className="modal">
    <div className="modal-content">
      <h3>Edit Course</h3>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className="modal-actions">
        <button
          className="btn edit"
          type="button"
          onClick={async () => {
            await axios.put(
              `https://ai-it-training-server.onrender.com/api/course/${editCourse._id}`,
              { title }
            );
            setEditCourse(null);
            loadData();
          }}
        >
          Save
        </button>

        <button
          className="btn delete"
          type="button"
          onClick={() => setEditCourse(null)}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

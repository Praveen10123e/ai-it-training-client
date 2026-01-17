import { useEffect, useState } from "react";
import axios from "axios";

export default function Certificate() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [certs, setCerts] = useState([]);

  useEffect(() => {
    axios
      .get("https://ai-it-training-server.onrender.com/api/certificate/" + user._id)
      .then(res => setCerts(res.data));
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h2>Certificates</h2>

      {certs.map((c, i) => (
        <div
          key={i}
          style={{
            border: "2px solid black",
            padding: "20px",
            margin: "20px 0"
          }}
        >
          <h1>Certificate of Completion</h1>
          <p>This certifies that</p>
          <h3>{user.name}</h3>
          <p>has successfully completed the course</p>
          <b>{c.courseId}</b>
          <p>Date: {c.date}</p>
        </div>
      ))}
    </div>
  );
}

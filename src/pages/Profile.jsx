import { useEffect, useState } from "react";
import axios from "axios";
import "./profile.css";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [data, setData] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    axios.get(`http://ai-it-training-server.onrender.com/api/profile/${user._id}`)
      .then(res => {
        setData(res.data);
        setForm(res.data.user);
      });
  }, []);

  const save = async () => {
    const res = await axios.put(
      `http://ai-it-training-server.onrender.com/api/profile/${user._id}`,
      form
    );
    localStorage.setItem("user", JSON.stringify(res.data));
    setEdit(false);
  };

  if (!data) return <p className="loading">Loading profile...</p>;

  return (
    <div className="profile">
      <div className="card">
        <img
          src={form.avatar || "https://i.imgur.com/6VBx3io.png"}
          alt="avatar"
        />

        {edit ? (
          <>
            <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
            <input value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
            <input placeholder="Avatar URL" value={form.avatar} onChange={e=>setForm({...form,avatar:e.target.value})}/>
            <button onClick={save}>Save</button>
          </>
        ) : (
          <>
            <h2>{form.name}</h2>
            <p>{form.email}</p>
            <button onClick={()=>setEdit(true)}>Edit Profile</button>
          </>
        )}
      </div>

     {user.role !== "admin" && (
  <div className="stats">
    <h3>📚 Course Progress</h3>
    {data.progress.map(p => (
      <div key={p._id}>
        {p.courseId.title} — {p.percentage}%
      </div>
    ))}

    <h3>🎓 Certificates</h3>
    {data.certificates.map(c => (
      <div key={c._id}>{c.courseId.title}</div>
    ))}
  </div>
)}

    </div>
  );
}

import { useState } from "react";
import axios from "axios";
import "./AIAssistant.css";

export default function AIAssistant({ courseTitle }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: `👋 Hi! I am your AI Tutor for "${courseTitle}".  
Ask me any doubt related to this course.`,
    },
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("https://ai-it-training-server.onrender.com/api/ai/chat", {
        courseTitle,
        message: userMessage.text,
      });

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: res.data.reply },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "⚠️ AI service unavailable right now." },
      ]);
    }

    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button className="ai-fab" onClick={() => setOpen(!open)}>
        🤖
      </button>

      {/* Chat Window */}
      {open && (
        <div className="ai-chat">
          <div className="ai-header">
            <span>AI Tutor</span>
            <button onClick={() => setOpen(false)}>✖</button>
          </div>

          <div className="ai-body">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`ai-msg ${m.role === "user" ? "user" : "ai"}`}
              >
                {m.text}
              </div>
            ))}
            {loading && <div className="ai-msg ai">Typing...</div>}
          </div>

          <div className="ai-footer">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your doubt..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}

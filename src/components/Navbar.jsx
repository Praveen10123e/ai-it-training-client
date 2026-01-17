import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  // Hide navbar on login page
  if (location.pathname === "/") return null;

  return (
    <div style={styles.nav}>
      <h2 style={styles.logo}>🎓 AI IT Training System</h2>

      <div style={styles.links}>
        {/* Admin only */}
        {user?.role === "admin" && (
          <Link style={styles.link} to="/admin">
            Admin
          </Link>
        )}

        <Link style={styles.link} to="/dashboard">
          Dashboard
        </Link>

        {/* SINGLE PROFILE LINK */}
        <Link style={styles.link} to="/profile">
          Profile
        </Link>

        <button
          style={styles.logout}
          onClick={() => {
            localStorage.clear();
            window.location = "/";
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 35px",
    background: "#111",
    borderBottom: "1px solid #222",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  logo: {
    color: "white",
    fontSize: "20px",
    fontWeight: "600",
  },
  links: {
    display: "flex",
    alignItems: "center",
  },
  link: {
    marginRight: "18px",
    color: "#4ea8ff",
    textDecoration: "none",
    fontWeight: "500",
    fontSize: "15px",
  },
  logout: {
    background: "#e63946",
    border: "none",
    padding: "6px 14px",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
    fontSize: "14px",
  },
};

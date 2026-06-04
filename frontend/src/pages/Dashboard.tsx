import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const token =
    localStorage.getItem("token");

  if (!token) {
    navigate("/");
  }

  const logout = () => {
    localStorage.removeItem("token");

    navigate("/");
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#f3f4f6",
        fontFamily: "Arial",
      }}
    >
      <h1>Dashboard</h1>

      <p>User Logged In</p>

      <button
        onClick={logout}
        style={{
          padding: "12px 20px",
          background: "red",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
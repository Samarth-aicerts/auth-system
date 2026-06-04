import { useState } from "react";

import { useNavigate } from "react-router-dom";

import API from "../services/api";

function Otp() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");

  const email = localStorage.getItem("email");

  const handleVerify = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      const res = await API.post(
        "/verify-otp",
        {
          email,
          otp,
        }
      );

      localStorage.setItem(
        "token",
        res.data.accessToken
      );

      alert("OTP Verified");

      navigate("/dashboard");
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          "Invalid OTP"
      );
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg,#2563eb,#1d4ed8)",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          width: "340px",
          background: "white",
          padding: "30px",
          borderRadius: "10px",
          boxShadow:
            "0px 0px 20px rgba(0,0,0,0.2)",
        }}
      >
        <h1
          style={{
            color: "#131315",
          }}
        >
          Verify OTP
        </h1>

        <form
          onSubmit={handleVerify}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value)
            }
            style={{
              padding: "12px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              fontSize: "14px",
            }}
          />

          <button
            type="submit"
            style={{
              padding: "12px",
              background: "green",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
}

export default Otp;
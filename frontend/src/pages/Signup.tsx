import { useState } from "react";

import {
  useNavigate,
  Link,
} from "react-router-dom";

import API from "../services/api";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
    });

  const [errors, setErrors] =
    useState({
      name: "",
      email: "",
      password: "",
    });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      name: "",
      email: "",
      password: "",
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const newErrors = {
      name: "",
      email: "",
      password: "",
    };

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name) {
      newErrors.name =
        "Name is required";
    }

    if (!formData.email) {
      newErrors.email =
        "Email is required";
    } else if (
      !emailRegex.test(
        formData.email
      )
    ) {
      newErrors.email =
        "Please enter valid email";
    }

    if (!formData.password) {
      newErrors.password =
        "Password is required";
    } else if (
      formData.password.length < 6
    ) {
      newErrors.password =
        "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    if (
      newErrors.name ||
      newErrors.email ||
      newErrors.password
    ) {
      return;
    }

    try {
      await API.post(
        "/signup",
        formData
      );

      
      localStorage.setItem(
  "email",
  formData.email
);

alert("OTP Sent");

navigate("/otp"); 

    } catch (error: any) {
      alert(
        error.response?.data
          ?.message ||
          "Signup Failed"
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
          Sign Up
        </h1>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <div>
            <input
              type="text"
              name="name"
              placeholder="Enter Name"
              onChange={handleChange}
              style={{
                width: "90%",
                padding: "12px",
                borderRadius: "5px",
                border:
                  "1px solid #ccc",
              }}
            />

            {errors.name && (
              <p
                style={{
                  color: "red",
                  fontSize: "13px",
                  marginTop: "5px",
                }}
              >
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <input
              type="text"
              name="email"
              placeholder="Enter Email"
              onChange={handleChange}
              style={{
                width: "90%",
                padding: "12px",
                borderRadius: "5px",
                border:
                  "1px solid #ccc",
              }}
            />

            {errors.email && (
              <p
                style={{
                  color: "red",
                  fontSize: "13px",
                  marginTop: "5px",
                }}
                >
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              onChange={handleChange}
              style={{
                width: "90%",
                padding: "12px",
                borderRadius: "5px",
                border:
                  "1px solid #ccc",
              }}
            />

            {errors.password && (
              <p
                style={{
                  color: "red",
                  fontSize: "13px",
                  marginTop: "5px",
                }}
              >
                {errors.password}
              </p>
            )}
          </div>

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
            Sign Up
          </button>
        </form>

        <p
          style={{
            marginTop: "20px",
            textAlign: "center",
          }}
        >
          Already have an account?
        </p>

        <Link to="/">
          <button
            style={{
              width: "100%",
              padding: "12px",
              background: "green",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </Link>
      </div>
    </div>
  );
} 

export default Signup;
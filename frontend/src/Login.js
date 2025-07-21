import React, { useState } from "react";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [passwordType, setPasswordType] = useState("password");
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // API base URL
  const API_URL = "http://localhost:8000/auth/";

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordType(passwordType === "password" ? "text" : "password");
  };

  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordType(
      confirmPasswordType === "password" ? "text" : "password"
    );
  };

  const toggleForm = () => {
    setIsSignup(!isSignup);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleAction = async () => {
    // Basic validation
    if (!email || !password || (isSignup && !confirmPassword)) {
      setModalMessage("Please fill in all fields.");
      setShowModal(true);
      return;
    }

    if (isSignup && password !== confirmPassword) {
      setModalMessage("Passwords do not match.");
      setShowModal(true);
      return;
    }

    setIsLoading(true);

    try {
      if (isSignup) {
        // Signup API call
        const response = await axios.post(`${API_URL}signup/`, {
          email,
          password,
        });

        setModalMessage("Signup successful! Please log in.");
        setIsSignup(false); // Switch to login form
      } else {
        // Login API call
        const response = await axios.post(`${API_URL}login/`, {
          email,
          password,
        });

        // Store tokens in localStorage
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);

        setModalMessage("Login successful! Redirecting...");

        // Redirect after a short delay
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      }
    } catch (error) {
      // Handle different types of errors
      let errorMessage = "An error occurred. Please try again.";

      if (error.response) {
        // The request was made and the server responded with a status code
        if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else if (error.response.status === 401) {
          errorMessage = "Invalid email or password";
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = "Network error. Please check your connection.";
      }

      setModalMessage(errorMessage);
    } finally {
      setIsLoading(false);
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="auth-form-container">
      <div className="form-container">
        <h1 id="formTitle" className="form-title">
          {isSignup ? "Create a New Account" : "Welcome to Rate It Right"}
        </h1>

        <div className="input-container">
          <label className="input-label">
            <input
              id="email"
              type="email"
              placeholder="Email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
        </div>

        <div className="input-container">
          <label className="input-label">
            <input
              id="password"
              type={passwordType}
              placeholder="Password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <i
              id="eyeIcon"
              className={`fas fa-eye eye-icon ${
                passwordType === "password" ? "" : "fa-eye-slash"
              }`}
              onClick={togglePasswordVisibility}
            ></i>
          </label>
        </div>

        {isSignup && (
          <div className="input-container">
            <label className="input-label">
              <input
                id="confirmPassword"
                type={confirmPasswordType}
                placeholder="Confirm Password"
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <i
                id="eyeIcon"
                className={`fas fa-eye eye-icon ${
                  confirmPasswordType === "password" ? "" : "fa-eye-slash"
                }`}
                onClick={toggleConfirmPasswordVisibility}
              ></i>
            </label>
          </div>
        )}

        <div className="action-container">
          <button
            id="actionBtn"
            className="action-button"
            onClick={handleAction}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="spinner"></span>
            ) : isSignup ? (
              "Sign up"
            ) : (
              "Log in"
            )}
          </button>
        </div>

        <p id="toggleLink" className="toggle-link" onClick={toggleForm}>
          {isSignup
            ? "Already have an account? Log in"
            : "Don't have an account? Sign up now."}
        </p>

        <p className="terms">
          By continuing, you agree to Rate It Right's Terms of Service and
          Privacy Policy.
        </p>
      </div>

      {showModal && (
        <div id="modal" className="modal">
          <p id="modalMessage">{modalMessage}</p>
          <button id="modalClose" className="modal-close" onClick={closeModal}>
            Close
          </button>
        </div>
      )}

      {showModal && (
        <div id="overlay" className="overlay" onClick={closeModal}></div>
      )}
    </div>
  );
};

export default Login;

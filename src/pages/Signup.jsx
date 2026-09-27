import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../services/supabase";

function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "trainee",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setMessageType("");

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setMessage("Please fill in all fields.");
      setMessageType("error");
      return;
    }

    if (formData.password.length < 6) {
      setMessage("Password must contain at least 6 characters.");
      setMessageType("error");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,

        options: {
          data: {
            full_name: formData.fullName,
            role: formData.role,
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        setMessage(
          formData.role === "trainer"
            ? "Account created! Please check your email and verify your address. After verification, your trainer account will require administrator approval."
            : "Account created! Please check your email and click the verification link before logging in."
        );

        setMessageType("success");

        setFormData({
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "trainee",
        });
      }
    } catch (error) {
      console.error("Signup error:", error);

      setMessage(error.message || "Unable to create account.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-brand">
        <Link to="/" className="auth-logo">
          Capacity<span>Connect</span>
        </Link>

        <div className="auth-brand-content">
          <p className="auth-label">BUILD YOUR CAPACITY</p>

          <h1>
            Learn today.
            <br />
            <span>Lead tomorrow.</span>
          </h1>

          <p>
            Join a centralized platform for professional learning, competency
            development, assessments and knowledge sharing.
          </p>

          <div className="auth-feature-list">
            <div>✓ Access structured learning programs</div>
            <div>✓ Learn from experienced trainers</div>
            <div>✓ Assess and track your progress</div>
            <div>✓ Build your professional competencies</div>
          </div>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-container">
          <div className="auth-heading">
            <h2>Create your account</h2>
            <p>Get started with CapacityConnect</p>
          </div>

          {message && (
            <div className={`auth-message ${messageType}`}>
              {message}

              {messageType === "success" && (
                <div style={{ marginTop: "10px" }}>
                  <Link
                    to="/login"
                    style={{
                      color: "#15803d",
                      fontWeight: "700",
                      textDecoration: "underline",
                    }}
                  >
                    Go to Login
                  </Link>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>

              <input
                id="fullName"
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">I am joining as</label>

              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="trainee">Trainee</option>
                <option value="trainer">Trainer</option>
              </select>

              {formData.role === "trainer" && (
                <p className="field-note">
                  Trainer accounts require administrator approval.
                </p>
              )}
            </div>

            <div className="password-row">
              <div className="form-group">
                <label htmlFor="password">Password</label>

                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">
                  Confirm Password
                </label>

                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  placeholder="Repeat password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="auth-switch">
            Already verified? <Link to="/login">Login</Link>
          </p>

          <Link to="/" className="back-home">
            ← Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
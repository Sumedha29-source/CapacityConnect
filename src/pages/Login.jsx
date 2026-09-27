import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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

    if (!formData.email || !formData.password) {
      setMessage("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      // STEP 1: Login with Supabase Auth
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

      if (authError) {
        throw authError;
      }

      const user = authData.user;

      if (!user) {
        throw new Error("Unable to retrieve user information.");
      }

      console.log("Logged in user:", user);
      console.log("Logged in user ID:", user.id);

      // STEP 2: Get profile belonging to logged-in user
      const { data: profile, error: profileError } =
        await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

      console.log("Profile returned:", profile);
      console.log("Profile error:", profileError);

      if (profileError) {
        throw new Error(
          `Profile error: ${profileError.message}`
        );
      }

      if (!profile) {
        throw new Error(
          "Your authentication account exists, but no matching profile was found."
        );
      }

      console.log("User role:", profile.role);
      console.log(
        "Approval status:",
        profile.approval_status
      );

      // STEP 3: Redirect according to role
      if (profile.role === "trainee") {
        navigate("/trainee/dashboard");
        return;
      }

      if (profile.role === "trainer") {
        if (profile.approval_status === "pending") {
          await supabase.auth.signOut();

          setMessage(
            "Your trainer account is waiting for administrator approval."
          );

          return;
        }

        if (profile.approval_status === "rejected") {
          await supabase.auth.signOut();

          setMessage(
            "Your trainer account has not been approved. Please contact the administrator."
          );

          return;
        }

        navigate("/trainer/dashboard");
        return;
      }

      if (profile.role === "admin") {
        navigate("/admin/dashboard");
        return;
      }

      await supabase.auth.signOut();

      setMessage(
        "Your account has an invalid role. Please contact the administrator."
      );
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      if (
        error.message &&
        error.message
          .toLowerCase()
          .includes("email not confirmed")
      ) {
        setMessage(
          "Please verify your email before logging in."
        );
      } else if (
        error.message === "Invalid login credentials"
      ) {
        setMessage("Invalid email or password.");
      } else {
        setMessage(
          error.message || "Unable to login."
        );
      }
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
          <p className="auth-label">WELCOME BACK</p>

          <h1>
            Continue learning.
            <br />
            <span>Keep growing.</span>
          </h1>

          <p>
            Access your courses, assessments, learning
            resources and professional development progress
            from one platform.
          </p>

          <div className="auth-feature-list">
            <div>✓ Continue enrolled courses</div>
            <div>✓ Access learning resources</div>
            <div>✓ Attempt assessments</div>
            <div>✓ Monitor your progress</div>
          </div>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-container">
          <div className="auth-heading">
            <h2>Welcome back</h2>

            <p>
              Login to your CapacityConnect account
            </p>
          </div>

          {message && (
            <div className="auth-message error">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">
                Email Address
              </label>

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
              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account?{" "}
            <Link to="/signup">
              Create Account
            </Link>
          </p>

          <Link to="/" className="back-home">
            ← Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
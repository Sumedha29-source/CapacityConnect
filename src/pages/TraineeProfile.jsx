import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

function TraineeProfile() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    qualification: "",
    organization: "",
    experience: 0,
    interests: "",
    skills: "",
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          navigate("/login");
          return;
        }

        setUserId(user.id);

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          throw error;
        }

        if (data.role !== "trainee") {
          navigate("/login");
          return;
        }

        setFormData({
          full_name: data.full_name || "",
          email: data.email || "",
          qualification: data.qualification || "",
          organization: data.organization || "",
          experience: data.experience || 0,
          interests: data.interests?.join(", ") || "",
          skills: data.skills?.join(", ") || "",
        });
      } catch (error) {
        console.error("Profile loading error:", error);

        setMessage("Unable to load your profile.");
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [navigate]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  function convertToArray(value) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setMessageType("");

    if (!formData.full_name.trim()) {
      setMessage("Full name cannot be empty.");
      setMessageType("error");
      return;
    }

    if (Number(formData.experience) < 0) {
      setMessage("Experience cannot be negative.");
      setMessageType("error");
      return;
    }

    try {
      setSaving(true);

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name.trim(),
          qualification: formData.qualification.trim(),
          organization: formData.organization.trim(),
          experience: Number(formData.experience),
          interests: convertToArray(formData.interests),
          skills: convertToArray(formData.skills),
        })
        .eq("id", userId);

      if (error) {
        throw error;
      }

      setMessage("Profile updated successfully.");
      setMessageType("success");
    } catch (error) {
      console.error("Profile update error:", error);

      setMessage(
        error.message || "Unable to update your profile."
      );

      setMessageType("error");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        Loading your profile...
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <aside className="dashboard-sidebar">
        <div>
          <div className="dashboard-logo">
            Capacity<span>Connect</span>
          </div>

          <nav className="dashboard-menu">
            <button
              onClick={() =>
                navigate("/trainee/dashboard")
              }
            >
              Dashboard
            </button>

            <button className="dashboard-menu-active">
              My Profile
            </button>

            <button>Explore Courses</button>
            <button>My Learning</button>
            <button>Assessments</button>
            <button>Certificates</button>
          </nav>
        </div>

        <button
          className="dashboard-logout"
          onClick={handleLogout}
        >
          Logout
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="profile-page-header">
          <div>
            <p className="dashboard-small-text">
              TRAINEE PROFILE
            </p>

            <h1>My Profile</h1>

            <p>
              Keep your professional information, interests
              and competencies up to date.
            </p>
          </div>

          <button
            className="profile-back-btn"
            onClick={() =>
              navigate("/trainee/dashboard")
            }
          >
            ← Dashboard
          </button>
        </header>

        <section className="profile-layout">
          <div className="profile-summary-card">
            <div className="profile-large-avatar">
              {formData.full_name
                ?.charAt(0)
                ?.toUpperCase() || "U"}
            </div>

            <h2>{formData.full_name}</h2>

            <p>{formData.email}</p>

            <span className="profile-role-badge">
              Trainee
            </span>

            <div className="profile-summary-divider"></div>

            <div className="profile-summary-item">
              <span>Qualification</span>
              <strong>
                {formData.qualification ||
                  "Not provided"}
              </strong>
            </div>

            <div className="profile-summary-item">
              <span>Experience</span>
              <strong>
                {formData.experience || 0} year(s)
              </strong>
            </div>

            <div className="profile-summary-item">
              <span>Skills</span>
              <strong>
                {convertToArray(formData.skills).length}
              </strong>
            </div>
          </div>

          <div className="profile-form-card">
            <div className="profile-form-heading">
              <h2>Professional Information</h2>

              <p>
                This information helps CapacityConnect
                understand your learning profile.
              </p>
            </div>

            {message && (
              <div
                className={`auth-message ${messageType}`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="profile-form-grid">
                <div className="form-group">
                  <label htmlFor="full_name">
                    Full Name
                  </label>

                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    value={formData.full_name}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    Email Address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="qualification">
                    Qualification
                  </label>

                  <input
                    id="qualification"
                    name="qualification"
                    type="text"
                    placeholder="e.g. B.Tech, M.Sc, PhD"
                    value={formData.qualification}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="organization">
                    Organization / Institution
                  </label>

                  <input
                    id="organization"
                    name="organization"
                    type="text"
                    placeholder="Enter organization"
                    value={formData.organization}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="experience">
                    Work Experience (Years)
                  </label>

                  <input
                    id="experience"
                    name="experience"
                    type="number"
                    min="0"
                    value={formData.experience}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="interests">
                  Areas of Interest
                </label>

                <input
                  id="interests"
                  name="interests"
                  type="text"
                  placeholder="Meteorology, Climate Science, Data Analysis"
                  value={formData.interests}
                  onChange={handleChange}
                />

                <p className="field-note">
                  Separate multiple interests using commas.
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="skills">
                  Skills / Competencies
                </label>

                <input
                  id="skills"
                  name="skills"
                  type="text"
                  placeholder="Python, GIS, Data Analysis, Forecasting"
                  value={formData.skills}
                  onChange={handleChange}
                />

                <p className="field-note">
                  Separate multiple skills using commas.
                </p>
              </div>

              <div className="profile-actions">
                <button
                  type="button"
                  className="profile-cancel-btn"
                  onClick={() =>
                    navigate("/trainee/dashboard")
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="profile-save-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : "Save Profile"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

export default TraineeProfile;
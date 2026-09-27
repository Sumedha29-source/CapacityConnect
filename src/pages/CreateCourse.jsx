import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

function CreateCourse() {
  const navigate = useNavigate();

  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    level: "Beginner",
    duration_hours: 1,
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    let active = true;

    async function checkTrainer() {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          navigate("/login");
          return;
        }

        const { data: profile, error: profileError } =
          await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

        if (profileError) {
          throw profileError;
        }

        if (
          profile.role !== "trainer" ||
          profile.approval_status !== "approved"
        ) {
          navigate("/login");
          return;
        }

        if (active) {
          setTrainer(profile);
        }
      } catch (error) {
        console.error("Trainer verification error:", error);

        if (active) {
          setMessage(
            error.message || "Unable to verify trainer account."
          );
          setMessageType("error");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    checkTrainer();

    return () => {
      active = false;
    };
  }, [navigate]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function createCourse(status) {
    setMessage("");
    setMessageType("");

    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.category.trim()
    ) {
      setMessage(
        "Please enter the course title, description and category."
      );
      setMessageType("error");
      return;
    }

    if (
      Number(formData.duration_hours) < 1 ||
      Number.isNaN(Number(formData.duration_hours))
    ) {
      setMessage("Course duration must be at least 1 hour.");
      setMessageType("error");
      return;
    }

    try {
      setSaving(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        navigate("/login");
        return;
      }

      const { error } = await supabase
        .from("courses")
        .insert({
          trainer_id: user.id,
          title: formData.title.trim(),
          description: formData.description.trim(),
          category: formData.category.trim(),
          level: formData.level,
          duration_hours: Number(formData.duration_hours),
          status,
        });

      if (error) {
        throw error;
      }

      navigate("/trainer/dashboard");
    } catch (error) {
      console.error("Create course error:", error);

      setMessage(
        error.message || "Unable to create course."
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
        Loading course creator...
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
            <Link to="/trainer/dashboard">
              Dashboard
            </Link>

            <Link to="/trainer/courses">
              My Courses
            </Link>

            <Link
              to="/trainer/courses/create"
              className="dashboard-menu-active"
            >
              Create Course
            </Link>

            <a href="#assessments">Assessments</a>
            <a href="#library">Trainer Library</a>
            <a href="#performance">Performance</a>
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
        <header className="course-page-header">
          <div>
            <p className="dashboard-small-text">
              COURSE MANAGEMENT
            </p>

            <h1>Create New Course</h1>

            <p>
              Create a structured learning program for
              CapacityConnect trainees.
            </p>
          </div>

          <Link
            to="/trainer/dashboard"
            className="course-back-button"
          >
            ← Dashboard
          </Link>
        </header>

        <div className="course-form-layout">
          <section className="course-form-card">
            <div className="course-form-heading">
              <h2>Course Information</h2>

              <p>
                Enter the basic information trainees will see
                when exploring your course.
              </p>
            </div>

            {message && (
              <div
                className={`auth-message ${messageType}`}
              >
                {message}
              </div>
            )}

            <div className="course-form">
              <div className="course-field">
                <label htmlFor="title">
                  Course Title
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Example: Meteorological Data Analysis"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div className="course-field">
                <label htmlFor="description">
                  Course Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows="6"
                  placeholder="Describe what trainees will learn from this course..."
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="course-form-row">
                <div className="course-field">
                  <label htmlFor="category">
                    Category / Subject
                  </label>

                  <input
                    id="category"
                    name="category"
                    type="text"
                    placeholder="Example: Meteorology"
                    value={formData.category}
                    onChange={handleChange}
                  />
                </div>

                <div className="course-field">
                  <label htmlFor="level">
                    Difficulty Level
                  </label>

                  <select
                    id="level"
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                  >
                    <option value="Beginner">
                      Beginner
                    </option>

                    <option value="Intermediate">
                      Intermediate
                    </option>

                    <option value="Advanced">
                      Advanced
                    </option>
                  </select>
                </div>
              </div>

              <div className="course-field course-duration-field">
                <label htmlFor="duration_hours">
                  Estimated Duration
                </label>

                <div className="course-duration-input">
                  <input
                    id="duration_hours"
                    name="duration_hours"
                    type="number"
                    min="1"
                    value={formData.duration_hours}
                    onChange={handleChange}
                  />

                  <span>hours</span>
                </div>
              </div>

              <div className="course-form-actions">
                <Link
                  to="/trainer/dashboard"
                  className="course-cancel-button"
                >
                  Cancel
                </Link>

                <button
                  type="button"
                  className="course-draft-button"
                  disabled={saving}
                  onClick={() =>
                    createCourse("draft")
                  }
                >
                  {saving
                    ? "Saving..."
                    : "Save as Draft"}
                </button>

                <button
                  type="button"
                  className="course-publish-button"
                  disabled={saving}
                  onClick={() =>
                    createCourse("published")
                  }
                >
                  {saving
                    ? "Publishing..."
                    : "Publish Course"}
                </button>
              </div>
            </div>
          </section>

          <aside className="course-help-card">
            <div className="course-help-icon">
              i
            </div>

            <h3>Creating a good course</h3>

            <p>
              Provide clear information so trainees can
              understand the purpose and difficulty of your
              training program.
            </p>

            <div className="course-help-item">
              <strong>Course title</strong>
              <span>
                Keep it specific and easy to understand.
              </span>
            </div>

            <div className="course-help-item">
              <strong>Description</strong>
              <span>
                Explain the key learning outcomes.
              </span>
            </div>

            <div className="course-help-item">
              <strong>Draft</strong>
              <span>
                Draft courses remain invisible to trainees.
              </span>
            </div>

            <div className="course-help-item">
              <strong>Published</strong>
              <span>
                Published courses become available for
                trainee enrollment.
              </span>
            </div>

            <div className="course-trainer-info">
              <span>Course Trainer</span>
              <strong>
                {trainer?.full_name || "Trainer"}
              </strong>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default CreateCourse;
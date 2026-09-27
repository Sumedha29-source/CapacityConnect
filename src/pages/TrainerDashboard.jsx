import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

function TrainerDashboard() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadTrainerDashboard() {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          navigate("/login");
          return;
        }

        const { data: trainerProfile, error: profileError } =
          await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

        if (profileError) {
          throw profileError;
        }

        if (
          trainerProfile.role !== "trainer" ||
          trainerProfile.approval_status !== "approved"
        ) {
          navigate("/login");
          return;
        }

        const { data: courseData, error: courseError } =
          await supabase
            .from("courses")
            .select("*")
            .eq("trainer_id", user.id)
            .order("created_at", {
              ascending: false,
            });

        if (courseError) {
          throw courseError;
        }

        if (!active) {
          return;
        }

        setProfile(trainerProfile);
        setCourses(courseData || []);
      } catch (error) {
        console.error(
          "Trainer dashboard error:",
          error
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadTrainerDashboard();

    return () => {
      active = false;
    };
  }, [navigate]);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  const publishedCourses = courses.filter(
    (course) => course.status === "published"
  ).length;

  const draftCourses = courses.filter(
    (course) => course.status === "draft"
  ).length;

  if (loading) {
    return (
      <div className="dashboard-loading">
        Loading trainer dashboard...
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
            <Link
              to="/trainer/dashboard"
              className="dashboard-menu-active"
            >
              Dashboard
            </Link>

            <Link to="/trainer/courses">
              My Courses
            </Link>

            <Link to="/trainer/courses/create">
              Create Course
            </Link>

            <a href="#assessments">
              Assessments
            </a>

            <a href="#library">
              Trainer Library
            </a>

            <a href="#performance">
              Performance
            </a>
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
        <header className="dashboard-header">
          <div>
            <p className="dashboard-small-text">
              TRAINER DASHBOARD
            </p>

            <h1>
              Welcome back,{" "}
              {profile?.full_name?.split(" ")[0] ||
                "Trainer"}
            </h1>

            <p>
              Create learning programs, manage resources
              and monitor trainee performance.
            </p>
          </div>

          <div className="dashboard-user">
            <div className="dashboard-avatar">
              {profile?.full_name
                ?.charAt(0)
                ?.toUpperCase() || "T"}
            </div>

            <div>
              <strong>
                {profile?.full_name || "Trainer"}
              </strong>

              <span>Trainer</span>
            </div>
          </div>
        </header>

        <section className="dashboard-stats">
          <div className="dashboard-stat-card">
            <span>Total Courses</span>

            <strong>{courses.length}</strong>

            <small>Courses created</small>
          </div>

          <div className="dashboard-stat-card">
            <span>Published</span>

            <strong>{publishedCourses}</strong>

            <small>Available to trainees</small>
          </div>

          <div className="dashboard-stat-card">
            <span>Drafts</span>

            <strong>{draftCourses}</strong>

            <small>Courses being prepared</small>
          </div>

          <div className="dashboard-stat-card">
            <span>Learners</span>

            <strong>0</strong>

            <small>Total enrollments</small>
          </div>
        </section>

        <section className="trainer-dashboard-grid">
          <div className="trainer-main-card">
            <div className="trainer-card-heading">
              <div>
                <h2>My Courses</h2>

                <p>
                  Manage your training programs.
                </p>
              </div>

              <Link
                to="/trainer/courses/create"
                className="trainer-create-button"
              >
                + Create Course
              </Link>
            </div>

            {courses.length === 0 ? (
              <div className="trainer-empty-state">
                <div className="trainer-empty-icon">
                  +
                </div>

                <h3>
                  Create your first course
                </h3>

                <p>
                  Build a structured training program
                  and publish it for CapacityConnect
                  trainees.
                </p>

                <Link
                  to="/trainer/courses/create"
                  className="primary-btn"
                >
                  Create Course
                </Link>
              </div>
            ) : (
              <div className="trainer-course-list">
                {courses.slice(0, 4).map((course) => (
                  <div
                    className="trainer-course-item"
                    key={course.id}
                  >
                    <div>
                      <span className="trainer-course-category">
                        {course.category}
                      </span>

                      <h3>{course.title}</h3>

                      <p>
                        {course.level} •{" "}
                        {course.duration_hours} hour(s)
                      </p>
                    </div>

                    <span
                      className={`status-badge status-${course.status}`}
                    >
                      {course.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="trainer-side-card">
            <h2>Quick Actions</h2>

            <p>
              Common trainer activities
            </p>

            <Link to="/trainer/courses/create">
              <strong>Create Course</strong>
              <span>
                Add a new training program →
              </span>
            </Link>

            <a href="#assessment">
              <strong>Create Assessment</strong>
              <span>
                Build an MCQ questionnaire →
              </span>
            </a>

            <a href="#library">
              <strong>Upload Resource</strong>
              <span>
                Add learning materials →
              </span>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

export default TrainerDashboard;
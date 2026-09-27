import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

function TraineeDashboard() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          navigate("/login");
          return;
        }

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

        setProfile(data);
      } catch (error) {
        console.error("Dashboard error:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [navigate]);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        Loading CapacityConnect...
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
            <button className="dashboard-menu-active">
              Dashboard
            </button>

            <button
              onClick={() =>
                navigate("/trainee/profile")
              }
            >
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
        <header className="dashboard-header">
          <div>
            <p className="dashboard-small-text">
              TRAINEE DASHBOARD
            </p>

            <h1>
              Welcome back,{" "}
              {profile?.full_name?.split(" ")[0] ||
                "Learner"}
            </h1>

            <p>
              Continue building your skills and
              professional competencies.
            </p>
          </div>

          <div className="dashboard-user">
            <div className="dashboard-avatar">
              {profile?.full_name
                ?.charAt(0)
                ?.toUpperCase() || "U"}
            </div>

            <div>
              <strong>
                {profile?.full_name}
              </strong>

              <span>Trainee</span>
            </div>
          </div>
        </header>

        <section className="dashboard-stats">
          <div className="dashboard-stat-card">
            <span>Enrolled Courses</span>
            <strong>0</strong>
            <small>
              Start exploring courses
            </small>
          </div>

          <div className="dashboard-stat-card">
            <span>Completed</span>
            <strong>0</strong>
            <small>Courses completed</small>
          </div>

          <div className="dashboard-stat-card">
            <span>Assessments</span>
            <strong>0</strong>
            <small>
              Assessments attempted
            </small>
          </div>

          <div className="dashboard-stat-card">
            <span>Certificates</span>
            <strong>0</strong>
            <small>
              Certificates earned
            </small>
          </div>
        </section>

        <section className="dashboard-content-grid">
          <div className="dashboard-panel">
            <div className="dashboard-panel-heading">
              <div>
                <h2>Continue Learning</h2>

                <p>
                  Your active learning programs
                </p>
              </div>

              <button>View All</button>
            </div>

            <div className="dashboard-empty">
              <div className="empty-icon">
                +
              </div>

              <h3>
                No enrolled courses yet
              </h3>

              <p>
                Explore available training programs
                and start building your
                competencies.
              </p>

              <button>
                Explore Courses
              </button>
            </div>
          </div>

          <div className="dashboard-panel">
            <div className="dashboard-panel-heading">
              <div>
                <h2>Upcoming</h2>

                <p>
                  Assessments & deadlines
                </p>
              </div>
            </div>

            <div className="dashboard-empty small">
              <h3>
                You're all caught up!
              </h3>

              <p>
                No upcoming assessments or
                deadlines.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default TraineeDashboard;
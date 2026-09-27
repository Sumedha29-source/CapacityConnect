import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

function AdminDashboard() {
  const navigate = useNavigate();

  const [adminProfile, setAdminProfile] = useState(null);
  const [trainers, setTrainers] = useState([]);
  const [allProfiles, setAllProfiles] = useState([]);

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    let active = true;

    async function initializeDashboard() {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          navigate("/login");
          return;
        }

        const { data: currentProfile, error: currentProfileError } =
          await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

        if (currentProfileError) {
          throw currentProfileError;
        }

        if (
          currentProfile.role !== "admin" ||
          currentProfile.approval_status !== "approved"
        ) {
          await supabase.auth.signOut();
          navigate("/login");
          return;
        }

        const { data: profiles, error: profilesError } =
          await supabase
            .from("profiles")
            .select("*")
            .order("created_at", {
              ascending: false,
            });

        if (profilesError) {
          throw profilesError;
        }

        if (!active) {
          return;
        }

        const profileList = profiles || [];

        setAdminProfile(currentProfile);
        setAllProfiles(profileList);

        setTrainers(
          profileList.filter(
            (profile) => profile.role === "trainer"
          )
        );
      } catch (error) {
        console.error("Admin dashboard error:", error);

        if (active) {
          setMessage(
            error.message ||
              "Unable to load administrator dashboard."
          );

          setMessageType("error");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    initializeDashboard();

    return () => {
      active = false;
    };
  }, [navigate]);

  async function refreshProfiles() {
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      throw error;
    }

    const profileList = profiles || [];

    setAllProfiles(profileList);

    setTrainers(
      profileList.filter(
        (profile) => profile.role === "trainer"
      )
    );
  }

  async function updateTrainerStatus(trainerId, newStatus) {
    try {
      setUpdatingId(trainerId);
      setMessage("");
      setMessageType("");

      const { error } = await supabase
        .from("profiles")
        .update({
          approval_status: newStatus,
        })
        .eq("id", trainerId)
        .eq("role", "trainer");

      if (error) {
        throw error;
      }

      await refreshProfiles();

      setMessage(
        newStatus === "approved"
          ? "Trainer approved successfully."
          : "Trainer application rejected."
      );

      setMessageType("success");
    } catch (error) {
      console.error("Trainer update error:", error);

      setMessage(
        error.message ||
          "Unable to update trainer status."
      );

      setMessageType("error");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  const totalTrainees = allProfiles.filter(
    (profile) => profile.role === "trainee"
  ).length;

  const totalTrainers = trainers.length;

  const pendingTrainers = trainers.filter(
    (trainer) =>
      trainer.approval_status === "pending"
  ).length;

  const approvedTrainers = trainers.filter(
    (trainer) =>
      trainer.approval_status === "approved"
  ).length;

  if (loading) {
    return (
      <div className="dashboard-loading">
        Loading administrator dashboard...
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

            <button>Users</button>
            <button>Courses</button>
            <button>Assessments</button>
            <button>Announcements</button>
            <button>Competency Mapping</button>
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
              ADMINISTRATOR DASHBOARD
            </p>

            <h1>Platform Administration</h1>

            <p>
              Manage CapacityConnect users, trainers and
              learning activities.
            </p>
          </div>

          <div className="dashboard-user">
            <div className="dashboard-avatar">
              {adminProfile?.full_name
                ?.charAt(0)
                ?.toUpperCase() || "A"}
            </div>

            <div>
              <strong>
                {adminProfile?.full_name ||
                  "Administrator"}
              </strong>

              <span>Administrator</span>
            </div>
          </div>
        </header>

        {message && (
          <div
            className={`auth-message ${messageType}`}
          >
            {message}
          </div>
        )}

        <section className="dashboard-stats">
          <div className="dashboard-stat-card">
            <span>Trainees</span>
            <strong>{totalTrainees}</strong>
            <small>Registered learners</small>
          </div>

          <div className="dashboard-stat-card">
            <span>Trainers</span>
            <strong>{totalTrainers}</strong>
            <small>Total trainer accounts</small>
          </div>

          <div className="dashboard-stat-card">
            <span>Pending Approvals</span>
            <strong>{pendingTrainers}</strong>
            <small>
              Require administrator action
            </small>
          </div>

          <div className="dashboard-stat-card">
            <span>Approved Trainers</span>
            <strong>{approvedTrainers}</strong>
            <small>Active trainers</small>
          </div>
        </section>

        <section className="admin-section">
          <div className="admin-section-heading">
            <div>
              <h2>Trainer Approvals</h2>

              <p>
                Review and manage trainer registrations.
              </p>
            </div>

            <span className="admin-pending-count">
              {pendingTrainers} Pending
            </span>
          </div>

          {trainers.length === 0 ? (
            <div className="admin-empty">
              <h3>No trainer accounts</h3>

              <p>
                Trainer applications will appear here
                when users register as trainers.
              </p>
            </div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Trainer</th>
                    <th>Email</th>
                    <th>Qualification</th>
                    <th>Experience</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {trainers.map((trainer) => (
                    <tr key={trainer.id}>
                      <td>
                        <div className="admin-trainer-name">
                          <div className="admin-mini-avatar">
                            {trainer.full_name
                              ?.charAt(0)
                              ?.toUpperCase() || "T"}
                          </div>

                          <strong>
                            {trainer.full_name}
                          </strong>
                        </div>
                      </td>

                      <td>{trainer.email}</td>

                      <td>
                        {trainer.qualification ||
                          "Not provided"}
                      </td>

                      <td>
                        {trainer.experience || 0}{" "}
                        year(s)
                      </td>

                      <td>
                        <span
                          className={`status-badge status-${trainer.approval_status}`}
                        >
                          {trainer.approval_status}
                        </span>
                      </td>

                      <td>
                        {trainer.approval_status ===
                        "pending" ? (
                          <div className="admin-actions">
                            <button
                              className="approve-btn"
                              disabled={
                                updatingId ===
                                trainer.id
                              }
                              onClick={() =>
                                updateTrainerStatus(
                                  trainer.id,
                                  "approved"
                                )
                              }
                            >
                              {updatingId === trainer.id
                                ? "Updating..."
                                : "Approve"}
                            </button>

                            <button
                              className="reject-btn"
                              disabled={
                                updatingId ===
                                trainer.id
                              }
                              onClick={() =>
                                updateTrainerStatus(
                                  trainer.id,
                                  "rejected"
                                )
                              }
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="admin-action-complete">
                            Reviewed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
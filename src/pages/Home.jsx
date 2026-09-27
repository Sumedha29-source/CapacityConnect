import Navbar from "../components/Navbar";

function Home() {
  return (
    <>
      <Navbar />

      <main>
        {/* HERO SECTION */}
        <section className="hero">
          <div className="hero-content">
            <p className="hero-label">DIGITAL CAPACITY BUILDING PLATFORM</p>

            <h1>
              Learn. Grow.
              <br />
              <span>Build Capacity.</span>
            </h1>

            <p className="hero-description">
              A centralized learning platform designed to empower professionals
              through structured training, competency development, assessments,
              and knowledge sharing.
            </p>

            <div className="hero-buttons">
              <a href="/signup" className="primary-btn">
                Start Learning
              </a>

              <a href="#courses" className="secondary-btn">
                Explore Courses
              </a>
            </div>
          </div>

          <div className="hero-card">
            <div className="hero-card-header">
              <span>Learning Dashboard</span>
              <span>●</span>
            </div>

            <div className="dashboard-preview">
              <div className="preview-stat">
                <strong>24+</strong>
                <span>Courses</span>
              </div>

              <div className="preview-stat">
                <strong>50+</strong>
                <span>Trainers</span>
              </div>

              <div className="preview-stat">
                <strong>1K+</strong>
                <span>Learners</span>
              </div>
            </div>

            <div className="preview-course">
              <p>Continue Learning</p>

              <h3>Meteorological Data Analysis</h3>

              <div className="progress-bar">
                <div className="progress"></div>
              </div>

              <small>65% completed</small>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="features-section" id="features">
          <div className="section-heading">
            <p className="section-label">PLATFORM FEATURES</p>

            <h2>Everything you need to learn and grow</h2>

            <p>
              One platform connecting learners, trainers and administrators for
              structured learning and competency development.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">01</div>

              <h3>Structured Learning</h3>

              <p>
                Enroll in courses and access lectures, presentations and study
                materials from expert trainers.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">02</div>

              <h3>Smart Assessments</h3>

              <p>
                Attempt subject-wise assessments, receive scores and monitor
                your learning progress.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">03</div>

              <h3>Competency Mapping</h3>

              <p>
                Match organizational training requirements with trainers based
                on skills, expertise and experience.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">04</div>

              <h3>Trainer Library</h3>

              <p>
                Access recorded lectures, presentations, documents and learning
                resources from one centralized library.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">05</div>

              <h3>Performance Tracking</h3>

              <p>
                Monitor participation, assessment performance, enrollments and
                learning outcomes.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">06</div>

              <h3>Certifications</h3>

              <p>
                Track completed training programs and maintain professional
                learning achievements.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Home;
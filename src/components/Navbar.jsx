import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        Capacity<span>Connect</span>
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <a href="#features">Features</a>
        <a href="#courses">Courses</a>
        <a href="#about">About</a>
      </div>

      <div className="nav-actions">
        <Link to="/login" className="login-btn">
          Login
        </Link>

        <Link to="/signup" className="signup-btn">
          Get Started
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
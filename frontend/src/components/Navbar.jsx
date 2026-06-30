import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        HappyApp
      </Link>
      <div className="navbar-links">
        {user ? (
          <>
            <Link to="/">Feed</Link>
            <Link to="/profile">Profile</Link>
            <button className="btn-link" onClick={handleLogout}>
              Logout
            </button>
            <span className="navbar-user">Hi, {user.name?.split(" ")[0]}</span>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn-pill">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

import { NavLink } from "react-router-dom";
import { BsPersonFill } from "react-icons/bs";
import "./Navbar.css";

export function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to={"/homepage"} className="navbar-logo">
          Logo
        </NavLink>
        <ul className="navbar-items">
          <li className="navbar-item">
            <NavLink to={"/homepage"}>Home</NavLink>
          </li>
          <li className="navbar-item">
            <NavLink to="/post">Post</NavLink>
          </li>
          <li className="navbar-item">
            <NavLink to="/saved">Saved</NavLink>
          </li>
          <li className="navbar-item">
            <NavLink to="/profile">
              <BsPersonFill />
            </NavLink>
          </li>
          <li className="navbar-item">
            <a href="/signin" className="signin-btn">
              <button>Sign In</button>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

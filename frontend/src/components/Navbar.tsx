import { NavLink, useNavigate } from "react-router-dom";
import { BsPersonFill } from "react-icons/bs";
import "./Navbar.css";

interface NavbarProps {
  isAuthenticated: boolean;
}

export function Navbar({ isAuthenticated }: NavbarProps) {
  const navigate = useNavigate(); 

  const handleSignOut = () => {
    isAuthenticated = false;
    localStorage.removeItem('token');
    navigate('/signin'); 
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to={"/homepage"} className="navbar-logo">
          Logo
        </NavLink>
        {isAuthenticated ? (
          <ul className="navbar-items">
            <li className="navbar-item">
              <NavLink to={"/homepage"}>Home</NavLink>
            </li>
            <li className="navbar-item">
              <NavLink to="/post">Post</NavLink>
            </li>
            <li className="navbar-item">
            <NavLink to="/profile">Profile</NavLink>
            </li>
            <li className="navbar-item">
              <NavLink to="/profile">
                <BsPersonFill />
              </NavLink>
            </li>
            <li className="navbar-item">
              <button onClick={handleSignOut}>Sign Out</button>
            </li>
          </ul>
        ) : null}
      </div>
    </nav>
  );
}

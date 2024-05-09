import "./SecondNavbar.css"
import { NavLink } from "react-router-dom";

export function SecondNavbar() {
  return (
    <nav className="second-navbar">

      <div className="categories-header">Choose your favorite category</div>
      <ul className="categories">
        <ul className="categories-items">
        <li>
            <NavLink className="second-nav-link" to={"/homepage"}>Home</NavLink>
          </li>
          <li>
            <NavLink className="second-nav-link" to={"/weather"}>Weather</NavLink>
          </li>
          <li>
            <NavLink className="second-nav-link" to={"/general"}>General</NavLink>
          </li>
          <li>
            <NavLink className="second-nav-link" to={"/politics"}>Politics</NavLink>
          </li>
          <li>
            <NavLink className="second-nav-link" to={"/movies"}>Movies</NavLink>
          </li>
          <li>
            <NavLink className="second-nav-link" to={"/books"}>Books</NavLink>
          </li>
          <li>
            <NavLink className="second-nav-link" to={"/socialmedia"}>Social Media</NavLink>
          </li>
          <li>
            <NavLink className="second-nav-link" to={"/celebrity"}>Celebrity</NavLink>
          </li>
        </ul>
      </ul>
    </nav>
  );
}

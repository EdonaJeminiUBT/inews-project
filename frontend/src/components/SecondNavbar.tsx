import "./SecondNavbar.css"
import { Link } from "react-router-dom";

export function SecondNavbar() {
  return (
    <nav className="second-navbar">
      <ul className="categories">
        <li>
          <div className="categories-header">Choose your favorite category</div>
        </li>
        <ul className="categories-items">
          <li>
            <Link className="second-nav-link" to={"/general"}>General</Link>
          </li>
          <li>
            <Link className="second-nav-link" to={"/politics"}>Politics</Link>
          </li>
          <li>
            <Link className="second-nav-link" to={"/movies"}>Movies</Link>
          </li>
          <li>
            <Link className="second-nav-link" to={"/books"}>Books</Link>
          </li>
          <li>
            <Link className="second-nav-link" to={"/socialmedia"}>Social Media</Link>
          </li>
          <li>
            <Link className="second-nav-link" to={"/celebrity"}>Celebrity</Link>
          </li>
        </ul>
      </ul>
    </nav>
  );
}

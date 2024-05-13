import { FaFacebook, FaInstagram, FaTelegramPlane } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
      <div className="footer-content">
        <div className="footer-contact">
          <h2>Contact Us</h2>
          <p>INews@inews.com</p>
          <p>+383 111 11 111</p>
        </div>
      </div>
      <div className="social-media">
        <ul>
          <li><a href="www.facebook.com"><FaFacebook /></a></li>
          <li><a href="www.instagram.com"><FaInstagram /></a></li>
          <li><a href="www.telegram.com"><FaTelegramPlane /></a></li>
          </ul>
      </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 INews. All rights reserved.</p>
      </div>
    </footer>
  );
}

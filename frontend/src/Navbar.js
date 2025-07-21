import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // ✅ Import Link for routing
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleToggle = () => setMenuOpen(!menuOpen);

  // Optional: close menu on window resize
  useEffect(() => {
    const closeMenu = () => {
      if (window.innerWidth > 991) setMenuOpen(false);
    };
    window.addEventListener("resize", closeMenu);
    return () => window.removeEventListener("resize", closeMenu);
  }, []);

  return (
    <header className="custom-navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="logo">
          Rate It Right.
        </Link>

        {/* Hamburger Menu */}
        <div
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={handleToggle}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Nav Links */}
        <nav className={`nav-links ${menuOpen ? "active" : ""}`}>
          <a href="#hero" onClick={handleToggle}>Home</a>
          <a href="#about" onClick={handleToggle}>About</a>
          <a href="#services" onClick={handleToggle}>Services</a>
          <a href="#team" onClick={handleToggle}>Team</a>
          <a href="#contact" onClick={handleToggle}>Contact</a>

          {/* ✅ Link to Login component using React Router */}
          <Link to="/login" className="login-btn" onClick={handleToggle}>
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

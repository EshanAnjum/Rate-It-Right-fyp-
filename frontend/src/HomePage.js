// HomePage.js
import React, { useEffect } from "react";
import "aos/dist/aos.css"; // AOS styles
import AOS from "aos";
import "./HomePage.css"; // Custom CSS
import { Link } from "react-router-dom";
import NewRecommenderPage from "./NewRecommenderPage";

const HomePage = () => {
  useEffect(() => {
    AOS.init({
      offset: 120,
      delay: 0,
      duration: 900,
      easing: "ease",
      once: false,
      mirror: false,
      anchorPlacement: "top-bottom",
    });
  }, []);



  
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    try {
      const res = await fetch("http://127.0.0.1:8000/api/contact/submit/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Message sent successfully!");
        document.getElementById("name").value = "";
        document.getElementById("email").value = "";
        document.getElementById("message").value = "";
      } else {
        alert("❌ Error: " + data.error);
      }
    } catch (err) {
      alert("❌ Failed to send message. Please try again later.");
    }
  };

  return (
    <>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Rate it Right</title>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css"
      />
      <link
        href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@fancyapps/ui@4.0/dist/fancybox.css"
      />
      <link rel="stylesheet" href="https://unpkg.com/aos@next/dist/aos.css" />
      <link rel="stylesheet" href="./assets/css/style.css" />
      {/* NAVBAR */}

      {/* <nav className="navbar navbar-expand-lg sticky-top">
        <div className="container">
          <a className="navbar-brand" href="#">
            <h2>Rate It Right.</h2>
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="#hero">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#about">
                  About
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#services">
                  Services
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#team">
                  Team
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#contact">
                  Contact
                </a>
              </li>
              <li className="nav-item">
                <a className="btn btn-primary ms-2" href="#signup">
                  Login
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav> */}
      {/* HERO */}
      <section
        id="hero"
        className="min-vh-100 d-flex align-items-center text-center"
      >
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h1
                data-aos="fade-left"
                className="text-uppercase text-white fw-semibold display-1"
              >
                Welcome to Rate-it-Right.
              </h1>
              <h5 className="text-white mt-3 mb-4" data-aos="fade-right">
                "Rate It Right" is an intelligent feedback management platform
                that empowers businesses to capture, analyze, and act on
                customer insights in real time, driving informed decisions and
                enhanced service quality.
              </h5>
              <div data-aos="fade-up" data-aos-delay={50}>
                <a
                  href="#services"
                  className="btn btn-brand me-2 bg-black text-white"
                >
                  Our Services
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ABOUT */}
      <section id="about" className="section-padding bg-dark text-white">
        <div className="container ">
          {/* Section Title */}
          <div className="row">
            <div
              className="col-12 text-center text-white"
              data-aos="fade-down"
              data-aos-delay={50}
            >
              <div className="section-title">
                <h1 className="display-4 fw-semibold mb-4">About Us</h1>
                <div
                  className="line mx-auto mb-4"
                  style={{ width: 100, height: 4, backgroundColor: "#FFD661" }}
                />
                <p
                  className="text-muted mx-auto"
                  style={{
                    maxWidth: 700,
                    fontSize: "1.1rem",
                    lineHeight: "1.8",
                  }}
                >
                  At Rate It Right, we are dedicated to bridging the gap between
                  businesses and their customers through innovative feedback
                  solutions. Our platform simplifies the process of capturing,
                  analyzing, and understanding customer opinions, empowering
                  organizations to deliver exceptional experiences. Join us in
                  creating a world where every voice matters and every rating
                  leads to improvement!
                </p>
              </div>
            </div>
          </div>
          {/* Content */}
          <div className="row justify-content-between align-items-center mt-5">
            {/* Image */}
            <div
              className="col-lg-6"
              data-aos="fade-right"
              data-aos-delay={100}
            >
              <img
                src="/images/about.png"
                alt="About Us Image"
                className="img-fluid rounded shadow"
              />
            </div>

            {/* About Our Services */}
            <div data-aos="fade-left" data-aos-delay={150} className="col-lg-5">
              <br />
              <h2 className="fw-bold">Our Services</h2>
              <p className="mt-3 mb-4 text-muted" style={{ lineHeight: "1.7" }}>
                We provide cutting-edge tools designed to simplify product
                research and decision-making. Discover our key services:
              </p>
              {/* Product Analyzer */}
              <div className="d-flex pt-4 mb-3">
                <div className="iconbox me-4">
                  <i
                    className="ri-bar-chart-box-fill fs-3"
                    style={{ color: "#FFD661" }}
                  />
                </div>
                <div>
                  <h5 className="fw-bold">Product Analyzer</h5>
                  <p className="text-muted">
                    Gain deep insights into product performance, features, and
                    customer feedback to make informed decisions.
                  </p>
                </div>
              </div>
              {/* Product Recommender */}
              <div className="d-flex mb-3">
                <div className="iconbox me-4">
                  <i
                    className="ri-lightbulb-flash-fill fs-3"
                    style={{ color: "#FFD661" }}
                  />
                </div>
                <div>
                  <h5 className="fw-bold">Product Recommender</h5>
                  <p className="text-muted">
                    Discover personalized product recommendations tailored to
                    your unique needs and preferences.
                  </p>
                </div>
              </div>
              {/* Product Comparison */}
              <div className="d-flex">
                <div className="iconbox me-4">
                  <i
                    className="ri-file-list-3-fill fs-3"
                    style={{ color: "#FFD661" }}
                  />
                </div>
                <div>
                  <h5 className="fw-bold">Product Comparison</h5>
                  <p className="text-muted">
                    Compare products side-by-side to evaluate features, prices,
                    and reviews, making your decisions easier and more reliable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* SERVICES */}
      <section
        id="services"
        className="section-padding border-top bg-dark text-white"
      >
        <div className="container">
          {/* Section Title */}
          <div className="row">
            <div
              className="col-12 text-center"
              data-aos="fade-down"
              data-aos-delay={150}
            >
              <div className="section-title">
                <h1 className="display-4 fw-semibold">Awesome Services</h1>
                <div
                  className="line mx-auto mb-4"
                  style={{ width: 100, height: 4, backgroundColor: "#FFD661" }}
                />
                <p
                  className="text-muted mx-auto"
                  style={{
                    maxWidth: 700,
                    fontSize: "1.1rem",
                    lineHeight: "1.8",
                  }}
                >
                  Discover our innovative services that help streamline product
                  research and decision-making for customers and businesses.
                </p>
              </div>
            </div>
          </div>
          {/* Service Cards */}
          <div className="row g-4 text-center">
            {/* Product Analyzer */}
            <div
              className="col-lg-4 col-sm-6"
              data-aos="fade-down"
              data-aos-delay={150}
            >
              <Link to="/analyzerpage" className="service-link">
                <div className="service theme-shadow p-lg-5 p-4">
                  <div className="iconbox">
                    <i
                      className="ri-bar-chart-box-fill fs-3"
                      style={{ color: "#FFD661" }}
                    />
                  </div>
                  <h5 className="mt-4 mb-3">Product Analyzer</h5>
                  <p className="text-muted">
                    Gain detailed insights into product performance, features,
                    and customer feedback for data-driven decisions.
                  </p>
                </div>
              </Link>
            </div>
            {/* Product Recommender */}
            <div
              className="col-lg-4 col-sm-6"
              data-aos="fade-down"
              data-aos-delay={250}
            >
              <Link to="/newrecommenderpage" className="service-link">
                <div className="service theme-shadow p-lg-5 p-4">
                  <div className="iconbox">
                    <i
                      className="ri-lightbulb-flash-fill fs-3"
                      style={{ color: "#FFD661" }}
                    />
                  </div>
                  <h5 className="mt-4 mb-3">Product Recommender</h5>
                  <p className="text-muted">
                    Receive personalized recommendations tailored to your unique
                    preferences and needs with our smart algorithms.
                  </p>
                </div>
              </Link>
            </div>

            {/* Product Comparison */}
            <div
              className="col-lg-4 col-sm-6"
              data-aos="fade-down"
              data-aos-delay={350}
            >
              <Link to="/newcomparisonpage" className="service-link">
                <div className="service theme-shadow p-lg-5 p-4">
                  <div className="iconbox">
                    <i
                      className="ri-file-list-3-fill fs-3"
                      style={{ color: "#FFD661" }}
                    />
                  </div>
                  <h5 className="mt-4 mb-3">Product Comparison</h5>
                  <p className="text-muted">
                    Easily compare products side-by-side, evaluating features,
                    prices, and reviews for better decision-making.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* TEAM */}
      <section id="team" className="section-padding bg-dark text-white">
        <div className="container">
          <div className="row">
            <div
              className="col-12 text-center"
              data-aos="fade-down"
              data-aos-delay={150}
            >
              <div className="section-title">
                <h1 className="display-4 fw-semibold">Team Members</h1>
                <div className="line" />
                <p>
                  Meet the passionate software engineers behind "Rate It Right,"
                  dedicated to crafting innovative solutions for a seamless user
                  experience.
                </p>
              </div>
            </div>
          </div>
          <div className="row g-4 text-center">
            <div className="col-md-4" data-aos="fade-down" data-aos-delay={150}>
              <a
                href="https://www.linkedin.com/in/jamshaid-iqbal-365200251/"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="team-member image-zoom">
                  <div className="image-zoom-wrapper">
                    <img src="\images\Jamshaid.jpg" alt="Jamshaid Iqbal" />
                  </div>
                  <div className="team-member-content">
                    <h4 className="text-black">Jamshaid Iqbal</h4>
                    <p className="mb-0 text-black">Software Engineer</p>
                  </div>
                </div>
              </a>
            </div>
            <div className="col-md-4" data-aos="fade-down" data-aos-delay={250}>
              <a
                href="https://www.linkedin.com/in/abdullah-raja-b1703327b/"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="team-member image-zoom">
                  <div className="image-zoom-wrapper">
                    <img src="\images\Abdullah.jpg" alt="Abdullah Raja" />
                  </div>
                  <div className="team-member-content">
                    <h4 className="text-black">Abdullah Raja</h4>
                    <p className="mb-0 text-black">Software Engineer</p>
                  </div>
                </div>
              </a>
            </div>
            <div className="col-md-4" data-aos="fade-down" data-aos-delay={350}>
              <a
                href="https://www.linkedin.com/in/eshananjum/"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="team-member image-zoom">
                  <div className="image-zoom-wrapper">
                    <img src="\images\Eshan.jpg" alt="Eshan Anjum" />
                  </div>
                  <div className="team-member-content">
                    <h4 className="text-black">Eshan Anjum</h4>
                    <p className="mb-0 text-black">Software Engineer</p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* GET IN TOUCH */}
<section
        id="contact"
        className="section-padding bg-light text-white d-flex justify-content-center align-items-center"
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div
                className="card p-5 shadow-lg border-0"
                style={{
                  borderRadius: "12px",
                  backgroundColor: "#333",
                  color: "#fff",
                }}
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <div className="card-body">
                  <div className="text-center mb-4">
                    <h1 className="display-5 fw-semibold">Get in Touch</h1>
                    <div
                      className="line mx-auto mb-4"
                      style={{
                        width: 100,
                        height: 4,
                        backgroundColor: "#FFD661",
                      }}
                    />
                    <p className="text-muted" style={{ color: "#ccc" }}>
                      We'd love to hear from you! Send us your thoughts.
                    </p>
                  </div>

                  <form onSubmit={handleContactSubmit}>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">
                        Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        placeholder="Enter your name"
                        style={{ borderRadius: "8px", borderColor: "#FFD661" }}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        Email address
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Enter your email"
                        style={{ borderRadius: "8px", borderColor: "#FFD661" }}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="message" className="form-label">
                        Message
                      </label>
                      <textarea
                        className="form-control"
                        id="message"
                        rows="4"
                        placeholder="Your message"
                        style={{ borderRadius: "8px", borderColor: "#FFD661" }}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-brand w-100"
                      style={{
                        backgroundColor: "#FFD661",
                        borderColor: "#FFD661",
                        color: "#000",
                        borderRadius: "8px",
                      }}
                    >
                      Send Message
                    </button>
                  </form>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-dark text-white text-white">
      <div className="container py-5">
        <div className="row">
          {/* About Section */}
          <div className="col-md-4 text-center mb-4 mb-md-0">
            <h3 className="fw-bold">Rate It Right</h3>
            <p>
              At "Rate It Right", we're committed to providing insightful
              reviews and ratings to help users make informed decisions. Join us
              on our journey to enhance user experiences.
            </p>
          </div>

          {/* Services Section */}
          <div className="col-md-4 text-center mb-4 mb-md-0">
            <h5 className="fw-bold">Services</h5>
            <ul className="list-unstyled">
              <li>Product Analyzer</li>
              <li>Product Recommender</li>
              <li>Product Comparison</li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="col-md-4 text-center">
            <h5 className="fw-bold">Contact</h5>
            <p>Lahore, Pakistan</p>
            <p>(+92) 300-123-4567</p>
            <p>contact@rateitright.com</p>
          </div>
        </div>

        <div className="row text-center mt-4">
          <div className="col-12">
            <ul className="list-inline">
              <li className="list-inline-item">
                <a href="https://facebook.com" className="text-white">
                  <i className="ri-facebook-fill" />
                </a>
              </li>
              <li className="list-inline-item">
                <a href="https://twitter.com" className="text-white">
                  <i className="ri-twitter-fill" />
                </a>
              </li>
              <li className="list-inline-item">
                <a href="https://linkedin.com" className="text-white">
                  <i className="ri-linkedin-fill" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center mt-4">
          <p>&copy; 2025 Rate It Right. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

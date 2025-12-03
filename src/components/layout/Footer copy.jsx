import React from "react";
import { Link } from "react-router-dom"; // For navigation links
import logo from "../../assets/images/codehelper-logo-white-bg.png"; // Import the logo

const Footer = () => {
  console.log('Footer');
  return (
    <footer className="main-footer">
      <div className="auto-container">
        <div className="widgets-section wow fadeInUp">
          <div className="row">
            <div className="big-column col-xl-4 col-lg-3 col-md-12">
              <div className="footer-column about-widget">
                <div className="logo">
                  <Link to="/">
                    <img src={logo} alt="Logo" />
                  </Link>
                </div>
                <p className="phone-num">
                  <span>Call us </span>
                  <a href="tel:1234567890">123 456 7890</a>
                </p>
                <p className="address">
                  329 Queensberry Street, North Melbourne VIC<br />
                  3051, Australia. <br />
                  <a href="mailto:support@CodeHelper.com" className="email">support@CodeHelper.com</a>
                </p>
              </div>
            </div>

            <div className="big-column col-xl-8 col-lg-9 col-md-12">
              <div className="row">
                {/** Footer Sections */}
                {[
                  {
                    title: "Important Links",
                    links: [
                      { name: "About Us", to: "/about" },
                      { name: "Contact Us", to: "/contact" },
                    ],
                  },
                  {
                    title: "Important Links",
                    links: [
                      { name: "Privacy Policy", to: "/privacy-policy" },
                      { name: "Terms And Conditions", to: "/terms-and-conditions" },
                    ],
                  },
                  {
                    title: "Important Links",
                    links: [
                      { name: "Client", to: "/client" },
                      { name: "Freelancer", to: "/freelancer" },
                    ],
                  },
                  {
                    title: "Important Links",
                    links: [                      
                      { name: "Login", to: "/login" },
                      { name: "Signup", to: "/register" },
                    ],
                  },           
                ].map((section, index) => (
       
        <div key={index} className="footer-column col-lg-3 col-md-6 col-sm-12">
          <div className="footer-widget links-widget">
            <h4 className="widget-title">{section.title}</h4>
            <div className="widget-content">
              <ul className="list">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <Link to={link.to}>{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>                
              </div>
            </div>
          </div>
        </div>

      {/** Footer Bottom Section */}
      <div className="footer-bottom">
        <div className="auto-container">
          <div className="outer-box">
            <div className="copyright-text">
              © {new Date().getFullYear()} <Link to="/">The Code Helper</Link>. All Rights Reserved.
            </div>
            <div className="social-links">
              {["facebook-f", "twitter", "instagram", "linkedin-in"].map((icon, i) => (
                <Link key={i} to="/" rel="noopener noreferrer">
                  <i className={`fab fa-${icon}`} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/** Scroll to Top Button */}
      <div className="scroll-to-top scroll-to-target" data-target="html">
        <span className="fa fa-angle-up"></span>
      </div>
    </footer>
  );
};

export default React.memo(Footer);
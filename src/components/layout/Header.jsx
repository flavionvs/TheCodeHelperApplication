import React, { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useWallet } from "../../utils/WalletContext";
import logo from "../../assets/images/codehelper-logo-white-bg.png";
import company_6 from "../../assets/images/resource/company-6.png";

const Header = () => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const { walletAmount, image, name } = useWallet();

  const user_id = localStorage.getItem("user_id")
    ? JSON.parse(localStorage.getItem("user_id"))
    : null;

  const user = localStorage.getItem(`user_${user_id}`)
    ? JSON.parse(localStorage.getItem(`user_${user_id}`))
    : {};

  const [mobileOpen, setMobileOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);

  const headerClass = useMemo(
    () =>
      location.pathname.startsWith("/user")
        ? "main-header header-shaddow"
        : "main-header",
    [location.pathname]
  );

  return (
    <header className={headerClass}>
      <div className="main-box navbar navbar-expand-lg tu-navbar sticky-top">
        <div className="nav-outer">
          <div className="logo-box">
            <div className="logo navbar-brand p-0">
              <Link to="/">
                <img src={logo} alt="logo" />
              </Link>
            </div>
          </div>

          <nav className="nav main-menu">
            <ul className="navigation" id="navbar">
              <li className="mm-add-listing">
                <Link to="/" className="theme-btn btn-style-one">
                  Job Post
                </Link>
                <span>
                  <span className="contact-info">
                    <span className="phone-num">
                      <span>Call us</span>
                      <Link to="/">123 456 7890</Link>
                    </span>
                    <span className="address">
                      Auckland, New Zealand. <br /></span>
                    <Link to="/" className="email">
                      support@thecodehelper.com
                    </Link>
                  </span>
                  <span className="social-links">
                    <Link to="/">
                      <span className="fab fa-facebook-f"></span>
                    </Link>
                    <Link to="/">
                      <span className="fab fa-twitter"></span>
                    </Link>
                    <Link to="/">
                      <span className="fab fa-instagram"></span>
                    </Link>
                    <Link to="/">
                      <span className="fab fa-linkedin-in"></span>
                    </Link>
                  </span>
                </span>
              </li>
            </ul>
          </nav>
        </div>

        {location.pathname.startsWith("/user") ? (
          <div className="outer-box admin-outer-box">
            <div className="admin-dashboard-header">{user.role}&nbsp;Dashboard</div>

            <div className="dropdown dashboard-option admin-dashboard-option">
            <Link to="/projects" className="menu-btn">
              Explore More Project
            </Link>
            &nbsp;&nbsp;&nbsp;&nbsp;
              <a
                className="dropdown-toggle"
                role="button"
                data-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src={image ? image : company_6}
                  alt="avatar"
                  className="thumb"
                />
                <span className="name">{name ? name : "My Account"}</span>
              </a>
              <ul className="dropdown-menu">
                <li className="active">
                  <Link to="/user/profile">
                    <i className="la la-home"></i> My Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/user/logout"
                    className="theme-btn btn-style-three call-modal"
                  >
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="outer-box">
            <div className="btn-box">
              <Link to="/about">About us</Link>
              <Link to="/contact">Contact Us</Link>
              <Link to="/privacy-policy">Privacy Policy</Link>
              <Link to="/terms-and-conditions">Terms And Conditions</Link>

              {token ? (
                <>
                  <Link to="/user/logout" className="button-87">
                    Logout
                  </Link>
                  <Link to="/user/dashboard" className="button-87">
                    {user.role} Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="button-87 call-modal">
                    Login
                  </Link>
                  <Link
                    to="/register?type=Freelancer"
                    className="button-87 call-modal"
                  >
                    I am Freelancer
                  </Link>
                  <Link
                    to="/register?type=Client"
                    className="button-87 call-modal"
                  >
                    I am Client
                  </Link>
                </>
              )}
              <Link to="/projects" className="button-48">
                <span className="text">Explore Projects</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* ====== MOBILE MENU ====== */}
      <div className="mobile-header d-lg-none">
        <div className="d-flex justify-content-between align-items-center px-3 py-2">
          <Link to="/" onClick={() => setMobileOpen(false)}>
            <img src={logo} alt="logo" style={{ height: 64 }} />
          </Link>

          <button
            className="mobile-nav-toggler btn btn-link p-0"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            <i
              className={`bi ${mobileOpen ? "bi-x" : "bi-list"} fs-3 text-dark`}
            ></i>
          </button>
        </div>

        <div
          id="nav-mobile"
          className={`mobile-drawer ${mobileOpen ? "open" : ""}`}
        >
          <div className="mobile-drawer-inner">
            {location.pathname.startsWith("/user") ? (
              <ul className="mobile-nav-list">
                <li>
                  <Link to="/user/dashboard" onClick={() => setMobileOpen(false)}>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/user/profile" onClick={() => setMobileOpen(false)}>
                    Personal Profile
                  </Link>
                </li>
                {user.role === 'Freelancer' ? (<li>
                  <Link to="/user/professional" onClick={() => setMobileOpen(false)}>
                    Professional Profile
                  </Link>
                </li>):('')}
                {user.role === 'Client' ? (
                  <li>
                  <Link
                    to="/user/project/create"
                    onClick={() => setMobileOpen(false)}
                  >
                    Post Requirement
                  </Link>
                </li>
                ):('')}

                {/* Projects Dropdown */}
                <li>
                  <button
                    className="btn w-100 text-start p-0 border-0 bg-transparent"
                    onClick={() => setProjectsOpen((prev) => !prev)}
                  >
                    Projects{" "}
                    <i
                      className={`bi ${
                        projectsOpen ? "bi-chevron-up" : "bi-chevron-down"
                      } ms-1`}
                    ></i>
                  </button>
                  {projectsOpen && user.role == 'Client' && (
                    <ul className="dropdown-submenu ps-3 mt-2">
                      {[
                        ["my-projects", "My Projects"],
                        ["applied", "Pending Projects"],
                        ["completed", "Completed Projects"],
                        ["ongoing", "Ongoing Projects"],
                        ["cancelled", "Cancelled Projects"],
                      ].map(([type, label]) => (
                        <li key={type}>
                          <Link
                            to={`/user/project?type=${type}`}
                            onClick={() => setMobileOpen(false)}
                          >
                            {label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                  {projectsOpen && user.role == 'Freelancer' && (
                    <ul className="dropdown-submenu ps-3 mt-2">
                      {[
                        ["applied", "Applied Projects"],
                        ["completed", "Completed Projects"],
                        ["ongoing", "Ongoing Projects"],
                        ["cancelled", "Cancelled Projects"],
                      ].map(([type, label]) => (
                        <li key={type}>
                          <Link
                            to={`/user/project?type=${type}`}
                            onClick={() => setMobileOpen(false)}
                          >
                            {label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>

                <li>
                  <Link to="/user/payments" onClick={() => setMobileOpen(false)}>
                    {user.role === 'Freelancer' ? ("Client Payment History") : ("Payment History")}
                  </Link>
                </li>
                                {user.role === 'Freelancer' ? (

                <li>
                  <Link to="/user/account" onClick={() => setMobileOpen(false)}>
                    Connect Account
                  </Link>
                </li>):('')}
                <li>
                  <Link to="/user/chat" onClick={() => setMobileOpen(false)}>
                    Chat
                  </Link>
                </li>
                <li>
                  <Link to="/user/logout" onClick={() => setMobileOpen(false)}>
                    Logout
                  </Link>
                </li>
              </ul>
            ) : (
              <ul className="mobile-nav-list">
                <li>
                  <Link to="/about" onClick={() => setMobileOpen(false)}>
                    About us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" onClick={() => setMobileOpen(false)}>
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/privacy-policy" onClick={() => setMobileOpen(false)}>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms-and-conditions"
                    onClick={() => setMobileOpen(false)}
                  >
                    Terms And Conditions
                  </Link>
                </li>
                {token ? (
                  <>
                    <li>
                      <Link to="/user/logout" onClick={() => setMobileOpen(false)}>
                        Logout
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/user/dashboard"
                        onClick={() => setMobileOpen(false)}
                      >
                        {user.role} Dashboard
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link to="/login" onClick={() => setMobileOpen(false)}>
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/register?type=Freelancer"
                        onClick={() => setMobileOpen(false)}
                      >
                        I am Freelancer
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/register?type=Client"
                        onClick={() => setMobileOpen(false)}
                      >
                        I am Client
                      </Link>
                    </li>
                  </>
                )}
                <li>
                  <Link to="/projects" onClick={() => setMobileOpen(false)}>
                    Explore Projects
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>

        {mobileOpen && (
          <div
            className="mobile-drawer-backdrop"
            onClick={() => setMobileOpen(false)}
          ></div>
        )}

        {/* Styles */}
        <style>{`
          .mobile-drawer {
            position: fixed;
            top: 0;
            right: -100%;
            width: 80%;
            max-width: 320px;
            height: 100vh;
            background: #fff;
            box-shadow: -4px 0 18px rgba(0,0,0,0.12);
            transition: right 0.28s ease;
            z-index: 1200;
            display: flex;
            flex-direction: column;
          }
          .mobile-drawer.open { right: 0; }
          .mobile-drawer-inner { padding: 80px 20px 20px; overflow-y: auto; }
          .mobile-nav-list { list-style: none; padding: 0; margin: 0; }
          .mobile-nav-list li { padding: 14px 0; border-bottom: 1px solid #f2f2f2; }
          .mobile-nav-list li a { color: #222; text-decoration: none; font-size: 15px; display:block; }
          .dropdown-submenu li { border: 0; padding: 8px 0; }
          .mobile-drawer-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.32); z-index: 1100; }
          .mobile-nav-toggler { border: 0; background: transparent; z-index: 1300;}
        `}</style>
      </div>
    </header>
  );
};

export default React.memo(Header);

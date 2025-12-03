import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const fullPath = `${location.pathname}${location.search}`;
  const [isProjectOpen, setIsProjectOpen] = useState(false);

  let user = {};
  try {
    const user_id = JSON.parse(localStorage.getItem("user_id"));
    user = JSON.parse(localStorage.getItem(`user_${user_id}`) || "{}");
  } catch (e) {
    console.error("Failed to parse user from localStorage", e);
  }

  const toggleProjects = (e) => {
    e.preventDefault();
    setIsProjectOpen((prev) => !prev);
  };

  return (
    <>
      <span className="header-span"></span>
      <div className="sidebar-backdrop"></div>

      <div className="user-sidebar">
        <div className="sidebar-inner">
          <ul className="navigation">
            <li className={fullPath === "/user/dashboard" ? "active" : ""}>
              <Link to="/user/dashboard">
                <i className="la la-caret-right"></i> Dashboard
              </Link>
            </li>

            <li className={fullPath === "/user/profile" ? "active" : ""}>
              <Link to="/user/profile">
                <i className="la la-caret-right"></i> Personal Profile
              </Link>
            </li>

            {/* CLIENT SECTION */}
            {user.role === "Client" ? (
              <>
                <li className={fullPath === "/user/project/create" ? "active" : ""}>
                  <Link to="/user/project/create">
                    <i className="la la-caret-right"></i> Post Requirement
                  </Link>
                </li>


                <li className={`collapsible-item ${isProjectOpen ? "open" : ""}`}>
                  <a href="#" onClick={toggleProjects} className="collapsible-toggle dropdown-main-items">
                    <i className={`la ${isProjectOpen ? "la-caret-down" : "la-caret-right"}`}></i> Projects
                  </a>

                  <ul className="collapsible-content">
                    <li className={fullPath === "/user/project?type=my-projects" ? "active" : ""}>
                      <Link to="/user/project?type=my-projects">
                        <i className="la la-caret-right"></i> My Projects
                      </Link>
                    </li>
                    <li className={fullPath === "/user/project?type=applied" ? "active" : ""}>
                      <Link to="/user/project?type=applied">
                        <i className="la la-caret-right"></i> Pending Projects
                      </Link>
                    </li>
                    <li className={fullPath === "/user/project?type=completed" ? "active" : ""}>
                      <Link to="/user/project?type=completed">
                        <i className="la la-caret-right"></i> Completed Projects
                      </Link>
                    </li>
                    <li className={fullPath === "/user/project?type=ongoing" ? "active" : ""}>
                      <Link to="/user/project?type=ongoing">
                        <i className="la la-caret-right"></i> Ongoing Projects
                      </Link>
                    </li>
                    <li className={fullPath === "/user/project?type=cancelled" ? "active" : ""}>
                      <Link to="/user/project?type=cancelled">
                        <i className="la la-caret-right"></i> Cancelled Projects
                      </Link>
                    </li>
                  </ul>
                </li>

                <li className={fullPath === "/user/payments" ? "active" : ""}>
                  <Link to="/user/payments">
                    <i className="la la-caret-right"></i> Payment History
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className={fullPath === "/user/professional-profile" ? "active" : ""}>
                  <Link to="/user/professional-profile">
                    <i className="la la-caret-right"></i> Professional Profile
                  </Link>
                </li>

                {/* Collapsible Projects Section for Professionals */}
                <li className={`collapsible-item ${isProjectOpen ? "open" : ""}`}>
                  <a href="#" onClick={toggleProjects} className="collapsible-toggle">
                    <i className={`la ${isProjectOpen ? "la-caret-down" : "la-caret-right"}`}></i> Projects
                  </a>

                  <ul className="collapsible-content">
                    <li className={fullPath === "/user/project?type=applied" ? "active" : ""}>
                      <Link to="/user/project?type=applied">
                        <i className="la la-caret-right"></i> Applied Projects
                      </Link>
                    </li>
                    <li className={fullPath === "/user/project?type=completed" ? "active" : ""}>
                      <Link to="/user/project?type=completed">
                        <i className="la la-caret-right"></i> Completed Projects
                      </Link>
                    </li>
                    <li className={fullPath === "/user/project?type=ongoing" ? "active" : ""}>
                      <Link to="/user/project?type=ongoing">
                        <i className="la la-caret-right"></i> Ongoing Projects
                      </Link>
                    </li>
                    <li className={fullPath === "/user/project?type=cancelled" ? "active" : ""}>
                      <Link to="/user/project?type=cancelled">
                        <i className="la la-caret-right"></i> Cancelled Projects
                      </Link>
                    </li>
                  </ul>
                </li>

                <li className={fullPath === "/user/payments" ? "active" : ""}>
                  <Link to="/user/payments">
                    <i className="la la-caret-right"></i> Client Payment History
                  </Link>
                </li>

                <li className={fullPath === "/user/account" ? "active" : ""}>
                  <Link to="/user/account">
                    <i className="la la-caret-right"></i> Connect Account
                  </Link>
                </li>
              </>
            )}

            <li className={fullPath === "/user/chat" ? "active" : ""}>
              <Link to="/user/chat">
                <i className="la la-caret-right"></i> Chat
              </Link>
            </li>

            <li className={fullPath === "/user/logout" ? "active" : ""}>
              <Link to="/user/logout">
                <i className="la la-caret-right"></i> Logout
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default React.memo(Sidebar);

import React from "react";

import about_img from '../assets/images/background/8.png'
import our_mission from '../assets/images/background/mission.jpg'
import team from '../assets/images/background/developer-team.jpg'
import { Link } from "react-router-dom";

const About = () => {
  return (
    <>

    <section style={{marginTop:"100px",}} className="hero-banner position-relative">
          <img src={about_img} alt="Coding workspace" className="hero-image" />
          <div className="hero-content container position-absolute top-50 start-50 translate-middle text-center text-white">
            <h1 className="display-4 fw-bold mb-4 fade-in">About Us</h1>
            <p className="mb-4 fade-in text-white">Your global partner for coding support</p>
            <a href="/contact" className="btn btn-outline-info text-white col-md-2  py-3">
              <Link to="/contact"><span className="">Get Support Now</span></Link>
            </a>
          </div>
        </section>

    <section className="py-5">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 mb-4 mb-lg-0">
                <h2 className="fw-bold mb-4 slide-in-left">Who We Are</h2>
                <p className="mb-4 slide-in-left">
                  The Code Helper is a global platform connecting businesses and individuals with skilled freelance
                  developers. We specialize in providing on-demand coding support across multiple programming languages
                  and technologies.
                </p>
                <p className="slide-in-left">
                  Our mission is to make quality coding assistance accessible to everyone, whether you're a startup
                  looking to build your first application or an established company needing specialized technical
                  expertise. We bridge the gap between talent and opportunity in the digital world.
                </p>
              </div>
              <div className="col-lg-6 slide-in-right">
                <img src={team} alt="Developer team" className="img-fluid" />
              </div>
            </div>
          </div>
        </section>

        <section className="py-5 bg-light">
          <div className="container">
            <h2 className="text-center fw-bold mb-5 fade-in">Why Choose The Code Helper?</h2>
            <div className="row">
              <div className="col-lg-4 mb-4">
                <div className="feature-card card h-100 ">
                  <div className="card-body text-center p-4">
                    <div className="feature-icon mb-3">
                      <i class="bi bi-globe2"></i>
                    </div>
                    <h4 className="fw-bold mb-3">Global Talent</h4>
                    <p className="text-muted">
                      Access to skilled freelance developers worldwide, bringing diverse perspectives and expertise to
                      your projects.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 mb-4">
                <div className="feature-card card h-100">
                  <div className="card-body text-center p-4">
                    <div className="feature-icon mb-3">
                      <i class="bi bi-translate"></i>
                    </div>
                    <h4 className="fw-bold mb-3">Cross-Language Expertise</h4>
                    <p className="text-muted">
                      Proficiency in Python, JavaScript, Ruby, Java, C++, and many other programming languages and
                      frameworks.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 mb-4">
                <div className="feature-card card h-100 ">
                  <div className="card-body text-center p-4">
                    <div className="feature-icon mb-3">
                     <i class="bi bi-clock"></i>
                    </div>
                    <h4 className="fw-bold mb-3">On-Demand Support</h4>
                    <p className="text-muted">
                      Hourly, contactless, fast, and reliable coding support whenever you need it, 24/7 availability.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-5 mission-section">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 mb-4 mb-lg-0">
                <h2 className="fw-bold mb-4 slide-in-left">Our Mission</h2>
                <p className=" slide-in-left">
                  To democratize access to quality coding expertise by connecting talented developers with businesses
                  and individuals who need technical solutions. We believe that great code should be accessible to
                  everyone, regardless of location or budget constraints.
                </p>
                <p className="slide-in-left">
                  We're committed to fostering a global community where innovation thrives through collaboration,
                  knowledge sharing, and mutual support.
                </p>
              </div>
              <div className="col-lg-6 slide-in-right">
                <img src={our_mission} alt="Inspirational workspace" className="img-fluid" />
              </div>
            </div>
          </div>
        </section>

        
    </>
  );
};

export default About;

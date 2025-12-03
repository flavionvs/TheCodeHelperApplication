import React from "react";
import { Link } from "react-router-dom";
// import '../../src/assets/css/new-animate.css';
// import '../../src/assets/css/new-style.css';
import hero from '../../src/assets/images/hero.webp';
import img1 from '../../src/assets/images/guy-working-laptop.jpg';
import img2 from '../../src/assets/images/icon-logo-1.png';
import img3 from '../../src/assets/images/icon-logo-2.png';
import img4 from '../../src/assets/images/icon-logo-3.png';

const ProjectListing = () => {
  return (
    <>
      <section className="banner-section">
        <div className="auto-container">
          <div className="row">
            <div className="content-column col-lg-7 col-md-12 col-sm-12">
              <div
                className="inner-column wow fadeInUp animated"
                data-wow-delay="1000ms"
                style={{ visibility: "visible", animationDelay: "1000ms", animationName: "fadeInUp" }}
              >
                <div className="title-box">
                  <h3>
                    Expand your professional team{" "}
                    <span>effortlessly with skilled</span> freelancers.
                  </h3>
                </div>
                <button
                  type="button"
                  className="theme-btn btn-style-one px-5 py-3 mb-4"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                >
                  Submit Your Project
                </button>
                <form method="post" action="">
                  <div className="row">
                    <div className="form-group col-lg-8 col-md-12 col-sm-12">
                      <i className="bi bi-search"></i>
                      <input
                        type="text"
                        name="field_name"
                        placeholder="Create your project now"
                      />
                    </div>
                    <div className="form-group col-lg-4 col-md-12 col-sm-12 btn-box">
                      <button type="submit" className="theme-btn btn-style-one">
                        <span className="btn-title">Submit Your Proposal</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <div className="popular-searches">
                <span className="title">Popular Searches : </span>
                <Link to="/home">Website Development</Link>,
                <Link to="/home">Logo Design</Link>,<Link to="/home">SEO</Link>,
                <Link to="/home">Social Media Marketing</Link>,
                <Link to="/home">Interior Design</Link>
              </div>
            </div>
          </div>

          <div className="image-column col-lg-5 col-md-12">
            <div className="image-box">
              <figure
                className="main-image wow fadeIn animated"
                data-wow-delay="500ms"
                style={{ visibility: "visible", animationDelay: "500ms", animationName: "fadeIn" }}
              >
                <img
                  src={hero}
                  alt=""
                  className="img-fluid"
                />
              </figure>
            </div>
          </div>
        </div>
      </section>
      <section className="layout-pt-60 pt-5 layout-pb-60 pb-5 border-bottom-none services-main">
        <div className="auto-container">
          <div
            className="d-flex align-items-center justify-content-between wow fadeInUp animated"
            style={{ visibility: "visible", animationName: "fadeInUp" }}
          >
            <div className="sec-title">
              <h6 className="blue-clr text-uppercase">Our Services</h6>
              <h2>Service We Provide</h2>
            </div>
          </div>
          <div
            className="row wow fadeInUp animated"
            style={{ visibility: "visible", animationName: "fadeInUp" }}
          >
            <div className="category-block-two at-home21 col-lg-3 col-md-4 col-6">
              <div className="inner-box">
                <div className="content">
                  <i className="bi bi-code-slash"></i>
                  <h4>
                    <Link href="#">Web Development</Link>
                  </h4>
                </div>
              </div>
            </div>
            <div className="category-block-two at-home21 col-lg-3 col-md-4 col-6">
              <div className="inner-box">
                <div className="content">
                  <i className="bi bi-filetype-css"></i>
                  <h4>
                    <Link href="#">CSS</Link>
                  </h4>
                </div>
              </div>
            </div>
            <div className="category-block-two at-home21 col-lg-3 col-md-4 col-6">
              <div className="inner-box">
                <div className="content">
                  <i className="bi bi-search"></i>
                  <h4>
                    <Link href="#">Programming</Link>
                  </h4>
                </div>
              </div>
            </div>
            <div className="category-block-two at-home21  col-lg-3 col-md-4 col-6">
              <div className="inner-box">
                <div className="content">
                  <i className="bi bi-filetype-php"></i>
                  <h4>
                    <Link href="#">PHP</Link>
                  </h4>
                </div>
              </div>
            </div>
            <div className="category-block-two at-home21  col-lg-3 col-md-4 col-6">
              <div className="inner-box">
                <div className="content">
                  <i className="bi bi-filetype-js"></i>
                  <h4>
                    <Link href="#">Java Script</Link>
                  </h4>
                </div>
              </div>
            </div>
            <div className="category-block-two at-home21 col-lg-3 col-md-4 col-6">
              <div className="inner-box">
                <div className="content">
                  <i className="bi bi-filetype-json"></i>
                  <h4>
                    <Link href="#">JSON</Link>
                  </h4>
                </div>
              </div>
            </div>
            <div className="category-block-two at-home21 col-lg-3 col-md-4 col-6">
              <div className="inner-box">
                <div className="content">
                  <svg
                    className="str"
                    width="70px"
                    height="70px"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M6 2.5H7M4.5 4V1.5C4.5 0.947715 4.94772 0.5 5.5 0.5H9.5C10.0523 0.5 10.5 0.947715 10.5 1.5V6.5C10.5 7.05228 10.0523 7.5 9.5 7.5H5.5C4.94772 7.5 4.5 7.94772 4.5 8.5V13.5C4.5 14.0523 4.94772 14.5 5.5 14.5H9.5C10.0523 14.5 10.5 14.0523 10.5 13.5V11M8 4.5H1.5C0.947715 4.5 0.5 4.94772 0.5 5.5V10.5C0.5 11.0523 0.947715 11.5 1.5 11.5H4.5M7 10.5H13.5C14.0523 10.5 14.5 10.0523 14.5 9.5V4.5C14.5 3.94772 14.0523 3.5 13.5 3.5H10.5M8 12.5H9" />
                  </svg>
                  <h4>
                    <Link href="#">Python</Link>
                  </h4>
                </div>
              </div>
            </div>
            <div className="category-block-two at-home21 col-lg-3 col-md-4 col-6">
              <div className="inner-box">
                <div className="content">
                  <svg
                    viewBox="0 0 24 24"
                    width="70px"
                    height="70px"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="#ffffff"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <path d="M6.078 12A5.928 5.928 0 0 1 12 6.078a5.946 5.946 0 0 1 5.129 2.959l-1.499.867 5.027-2.902a1.579 1.579 0 0 0-.543-.575l-7.345-4.24c-.424-.245-1.116-.245-1.539 0l-7.345 4.24c-.422.244-.768.844-.768 1.333v8.48c0 .245.086.517.226.758l3.529-2.038A5.883 5.883 0 0 1 6.078 12z"></path>
                      <path d="M14.564 10.519A2.971 2.971 0 0 0 12 9.039a2.964 2.964 0 0 0-2.564 4.441L12 12l2.564-1.481z"></path>
                      <path d="m20.657 7.002-5.046 2.913-1.046.605-.001-.001L12 12l-2.563 1.48A2.964 2.964 0 0 0 12 14.961a2.97 2.97 0 0 0 2.565-1.481l2.563 1.483a5.944 5.944 0 0 1-5.129 2.959 5.926 5.926 0 0 1-5.128-2.962l-3.529 2.038c.14.242.332.453.543.575l7.345 4.24c.423.245 1.115.245 1.539 0l7.345-4.24c.211-.122.403-.333.543-.575.14-.241.226-.513.226-.758V7.76c0-.245-.086-.517-.226-.758zm-2.735 5.327h-.658v.658h-.657v-.658h-.658v-.658h.658v-.658h.657v.658h.658v.658zm2.468 0h-.658v.658h-.658v-.658h-.657v-.658h.657v-.658h.658v.658h.658v.658z"></path>
                    </g>
                  </svg>
                  <h4>
                    <Link href="#">C++</Link>
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="who bg-body-tertiary py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="sec-title mb-4">
                <h2>Flexible Freelance Solutions to Power Your Business!</h2>
              </div>
              <img
                src={img1}
                className="img-fluid mb-4"
              />
              <p>
                Unveil the essence of The Code Helper: a community-driven platform
                dedicated to empowering coders of all levels. Discover who we
                are and how we're shaping the future of coding education.
              </p>
              <Link className="theme-btn btn-style-one" to="/login">
                <span className="btn-title">Signup for a Client</span>
              </Link>
            </div>
            <div className="col-md-6 px-md-5">
              <div className="who-box">
                <i className="bi bi-check"></i>
                <h4>Scalability & Flexibility</h4>
                <p className="mb-0">
                  Scale your workforce up or down based on project needs.
                </p>
              </div>
              <div className="who-box">
                <i className="bi bi-check"></i>
                <h4>Access to Global Expertise</h4>
                <p className="mb-0">
                  Connect with top freelancers worldwide for specialized skills.
                </p>
              </div>
              <div className="who-box">
                <i className="bi bi-check"></i>
                <h4>Enhanced Productivity</h4>
                <p className="mb-0">
                  Focus on core business operations while freelancers handle the
                  rest.
                </p>
              </div>
              <div className="who-box">
                <i className="bi bi-check"></i>
                <h4>Quality Assurance</h4>
                <p className="mb-0">
                  Work with vetted professionals who deliver high-quality
                  results.
                </p>
              </div>
              <div className="who-box">
                <i className="bi bi-check"></i>
                <h4>Innovative Solutions</h4>
                <p className="mb-0">
                  Gain fresh perspectives and creative approaches to business
                  challenges.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="why py-5  wow fadeInUp animated"
        data-wow-delay="1000ms"
        style={{ visibility: "visible", animationDelay: "1000ms", animationName: "fadeInUp" }}
      >
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="text-start">
                <div className="sec-title">
                  <h2>Why Choose The Code Helper</h2>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="why-box text-center">
                <img
                  src={img2}
                  className="img-fluid mb-3"
                  alt=""
                />
                <h4>Fast & Easy Hiring</h4>
                <p>
                  Post your project and receive proposals from talented
                  freelancers, making the hiring process swift and efficient.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="why-box text-center">
                <img
                  src={img3}
                  className="img-fluid mb-3"
                  alt=""
                />
                <h4>Expert Freelancers</h4>
                <p>
                  Access a global talent pool of expert freelancers skilled in
                  various programming languages and technologies.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="why-box text-center">
                <img
                  src={img4}
                  className="img-fluid mb-3"
                  alt=""
                  style={{ height: "182px" }}
                />
                <h4>Quality Code Solutions</h4>
                <p>
                  Receive high-quality code solutions tailored to your project
                  requirements, with options for revisions and feedback.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div
        className="container-fluid bg-body-tertiary py-5 wow fadeInUp animated"
        data-wow-delay="1000ms"
        style={{ visibility: "visible", animationDelay: "1000ms", animationName: "fadeInUp" }}
      >
        <div className="row">
          <div className="col-12">
            <div className="container p-md-0">
              <div className="sec-title">
                <h2>Testimonials From Our Customers</h2>
              </div>
            </div>
          </div>
        </div>
        <div id="testimonialCarousel" className="carousel">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <div className="card shadow-sm rounded-3">
                <div className="quotes display-2 text-body-tertiary">
                  <i className="bi bi-quote"></i>
                </div>
                <div className="card-body">
                  <p className="card-text">
                    "Some quick example text to build on the card title and make
                    up the bulk of the card's content."
                  </p>
                  <div className="d-flex align-items-center pt-2">
                    <img
                      src="https://codingyaar.com/wp-content/uploads/square-headshot-1.png"
                      alt="bootstrap testimonial carousel slider 2"
                    />
                    <div>
                      <h5 className="card-title fw-bold">Jane Doe</h5>
                      <span className="text-secondary">
                        CEO, Example Company
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="carousel-item">
              <div className="card shadow-sm rounded-3">
                <div className="quotes display-2 text-body-tertiary">
                  <i className="bi bi-quote"></i>
                </div>
                <div className="card-body">
                  <p className="card-text">
                    "Some quick example text to build on the card title and make
                    up the bulk of the card's content."
                  </p>
                  <div className="d-flex align-items-center pt-2">
                    <img
                      src="https://codingyaar.com/wp-content/uploads/square-headshot-2.png"
                      alt="bootstrap testimonial carousel slider 2"
                    />
                    <div>
                      <h5 className="card-title fw-bold">June Doe</h5>
                      <span className="text-secondary">
                        CEO, Example Company
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="carousel-item">
              <div className="card shadow-sm rounded-3">
                <div className="quotes display-2 text-body-tertiary">
                  <i className="bi bi-quote"></i>
                </div>
                <div className="card-body">
                  <p className="card-text">
                    "Some quick example text to build on the card title and make
                    up the bulk of the card's content."
                  </p>
                  <div className="d-flex align-items-center pt-2">
                    <img
                      src="https://codingyaar.com/wp-content/uploads/bootstrap-profile-card-image.jpg"
                      alt="bootstrap testimonial carousel slider 2"
                    />
                    <div>
                      <h5 className="card-title fw-bold">John Doe</h5>
                      <span className="text-secondary">
                        CEO, Example Company
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="carousel-item">
              <div className="card shadow-sm rounded-3">
                <div className="quotes display-2 text-body-tertiary">
                  <i className="bi bi-quote"></i>
                </div>
                <div className="card-body">
                  <p className="card-text">
                    "Some quick example text to build on the card title and make
                    up the bulk of the card's content."
                  </p>
                  <div className="d-flex align-items-center pt-2">
                    <img
                      src="https://codingyaar.com/wp-content/uploads/bootstrap-profile-card-image.jpg"
                      alt="bootstrap testimonial carousel slider 2"
                    />
                    <div>
                      <h5 className="card-title fw-bold">John Doe</h5>
                      <span className="text-secondary">
                        CEO, Example Company
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="carousel-item">
              <div className="card shadow-sm rounded-3">
                <div className="quotes display-2 text-body-tertiary">
                  <i className="bi bi-quote"></i>
                </div>
                <div className="card-body">
                  <p className="card-text">
                    "Some quick example text to build on the card title and make
                    up the bulk of the card's content."
                  </p>
                  <div className="d-flex align-items-center pt-2">
                    <img
                      src="https://codingyaar.com/wp-content/uploads/bootstrap-profile-card-image.jpg"
                      alt="bootstrap testimonial carousel slider 2"
                    />
                    <div>
                      <h5 className="card-title fw-bold">John Doe</h5>
                      <span className="text-secondary">
                        CEO, Example Company
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="carousel-item">
              <div className="card shadow-sm rounded-3">
                <div className="quotes display-2 text-body-tertiary">
                  <i className="bi bi-quote"></i>
                </div>
                <div className="card-body">
                  <p className="card-text">
                    "Some quick example text to build on the card title and make
                    up the bulk of the card's content."
                  </p>
                  <div className="d-flex align-items-center pt-2">
                    <img
                      src="https://codingyaar.com/wp-content/uploads/bootstrap-profile-card-image.jpg"
                      alt="bootstrap testimonial carousel slider 2"
                    />
                    <div>
                      <h5 className="card-title fw-bold">John Doe</h5>
                      <span className="text-secondary">
                        CEO, Example Company
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="carousel-item">
              <div className="card shadow-sm rounded-3">
                <div className="quotes display-2 text-body-tertiary">
                  <i className="bi bi-quote"></i>
                </div>
                <div className="card-body">
                  <p className="card-text">
                    "Some quick example text to build on the card title and make
                    up the bulk of the card's content."
                  </p>
                  <div className="d-flex align-items-center pt-2">
                    <img
                      src="https://codingyaar.com/wp-content/uploads/bootstrap-profile-card-image.jpg"
                      alt="bootstrap testimonial carousel slider 2"
                    />
                    <div>
                      <h5 className="card-title fw-bold">John Doe</h5>
                      <span className="text-secondary">
                        CEO, Example Company
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="carousel-item">
              <div className="card shadow-sm rounded-3">
                <div className="quotes display-2 text-body-tertiary">
                  <i className="bi bi-quote"></i>
                </div>
                <div className="card-body">
                  <p className="card-text">
                    "Some quick example text to build on the card title and make
                    up the bulk of the card's content."
                  </p>
                  <div className="d-flex align-items-center pt-2">
                    <img
                      src="https://codingyaar.com/wp-content/uploads/bootstrap-profile-card-image.jpg"
                      alt="bootstrap testimonial carousel slider 2"
                    />
                    <div>
                      <h5 className="card-title fw-bold">John Doe</h5>
                      <span className="text-secondary">
                        CEO, Example Company
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="carousel-item">
              <div className="card shadow-sm rounded-3">
                <div className="quotes display-2 text-body-tertiary">
                  <i className="bi bi-quote"></i>
                </div>
                <div className="card-body">
                  <p className="card-text">
                    "Some quick example text to build on the card title and make
                    up the bulk of the card's content."
                  </p>
                  <div className="d-flex align-items-center pt-2">
                    <img
                      src="https://codingyaar.com/wp-content/uploads/bootstrap-profile-card-image.jpg"
                      alt="bootstrap testimonial carousel slider 2"
                    />
                    <div>
                      <h5 className="card-title fw-bold">John Doe</h5>
                      <span className="text-secondary">
                        CEO, Example Company
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#testimonialCarousel"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#testimonialCarousel"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>

      <section className="subscribe-section at-home22 py-xl-0">
        <div className="auto-container py-5">
          <div
            className="outer-box d-flex wow fadeInUp animated"
            style={{ visibility: "visible", animationName: "fadeInUp" }}
          >
            <div className="sec-title">
              <h3 className="text-white">
                Join. Work. Thrive – Your Freelance Journey Starts Here!
              </h3>
              <div className="text-white">
                Unlock endless opportunities as a freelancer. Sign up today and
                start working on your own terms!
              </div>
            </div>
            <div className="form-column">
              <div className="subscribe-form">
                <form method="post" action="#">
                  <div className="form-group">
                    <div className="response"></div>
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      name="email"
                      className="email"
                      value=""
                      placeholder="Your e-mail"
                      required=""
                    />
                    <button
                      type="button"
                      id="subscribe-newsletters"
                      className="theme-btn btn-style-one"
                    >
                      Sign Up <i className="bi bi-arrow-up-right ms-2"></i>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProjectListing;

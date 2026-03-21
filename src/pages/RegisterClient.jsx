import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiRequest } from "../utils/api";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import heroImg from "../assets/images/guy-working-laptop.jpg";
import iconLogo1 from "../assets/images/icon-logo-1.png";
import iconLogo2 from "../assets/images/icon-logo-2.png";
import iconLogo3 from "../assets/images/icon-logo-3.png";

const RegisterClient = () => {
  const [param] = useSearchParams();
  const email = param.get("email");

  const [formData, setFormData] = useState({
    role: "Client",
    name: "",
    phone: "",
    country: "",
    term_and_condition: "",
    email: email || "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (email) {
      setFormData((prev) => ({ ...prev, email }));
    }
  }, [email]);

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: inputType === "checkbox" ? (checked ? "1" : "") : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    if (!formData.country) {
      toast.error("Please select a country", { position: "top-right", autoClose: 3000 });
      setLoading(false);
      return;
    }

    if (formData.term_and_condition !== "1") {
      toast.error("You must accept Terms and Conditions", { position: "top-right", autoClose: 3000 });
      setLoading(false);
      return;
    }

    const payload = { ...formData };

    try {
      const response = await apiRequest("POST", "/register", payload);

      if (response.data?.status) {
        // Fire conversion tracking events
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'sign_up',
          method: 'email',
          user_role: 'Client',
          registration_source: 'register_client_landing',
        });
        if (typeof window.fbq === 'function') {
          window.fbq('track', 'CompleteRegistration', {
            content_name: 'Client',
            status: true,
          });
        }

        if (response.data?.requires_verification) {
          toast.success(response.data.message, { position: "top-right", autoClose: 3000 });
          navigate("/verify-email", {
            state: { email: response.data.data.email, role: response.data.data.role },
          });
          return;
        }

        if (response.data?.access_token) {
          localStorage.setItem("token", response.data.access_token);
          localStorage.setItem("user_id", JSON.stringify(response.data.data.personal.id));
          localStorage.setItem(`user_${response.data.data.personal.id}`, JSON.stringify(response.data.data.personal));
          if (response.data?.data?.professional?.id) {
            localStorage.setItem(`professional_${response.data.data.professional.id}`, JSON.stringify(response.data.data.professional));
          }
        }

        toast.success(response.data.message, { position: "top-right", autoClose: 3000 });
        navigate("/user/project/create");
      } else {
        if (response.data?.message) {
          toast.error(response.data.message, { position: "top-right", autoClose: 3000 });
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!", { position: "top-right", autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const scrollToForm = () => {
    document.getElementById("register-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* HERO SECTION */}
      <section className="landing-hero landing-hero--client">
        <div className="auto-container">
          <div className="row align-items-center">
            <div className="col-lg-7 col-md-12">
              <div className="landing-hero__content">
                <span className="landing-hero__badge">IT Freelancer Marketplace</span>
                <h1>
                  Find the Right <span className="landing-accent">IT Freelancer</span> for Your Project
                </h1>
                <p className="landing-hero__subtitle">
                  Post your project on The Code Helper and connect with vetted freelance developers, designers, and IT professionals ready to deliver.
                </p>
                <div className="landing-hero__ctas">
                  <button type="button" className="button-87 px-5 py-3 ms-0" onClick={scrollToForm}>
                    Post Your Project for Free
                  </button>
                  <Link to="/projects" className="landing-outline-btn px-4 py-3">
                    Explore Other Projects
                  </Link>
                </div>
                <div className="landing-hero__trust">
                  <div className="landing-trust-item">
                    <i className="bi bi-shield-check"></i>
                    <span>Vetted Freelancers</span>
                  </div>
                  <div className="landing-trust-item">
                    <i className="bi bi-clock-history"></i>
                    <span>Fast Matching</span>
                  </div>
                  <div className="landing-trust-item">
                    <i className="bi bi-currency-dollar"></i>
                    <span>No Upfront Cost</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-5 col-md-12">
              <div className="landing-hero__image">
                <img src={heroImg} alt="Find IT freelancers for your project" className="img-fluid" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="landing-steps bg-body-tertiary">
        <div className="auto-container">
          <div className="sec-title text-center">
            <h2>How It Works</h2>
            <p className="landing-section-subtitle">Get your project started in 3 simple steps</p>
          </div>
          <div className="row">
            <div className="col-md-4">
              <div className="landing-step-card">
                <div className="landing-step-number">1</div>
                <div className="landing-step-icon"><i className="bi bi-pencil-square"></i></div>
                <h4>Post Your Project</h4>
                <p>Describe what you need, from web development to cloud setup, AI integration, or mobile apps.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="landing-step-card landing-step-card--active">
                <div className="landing-step-number">2</div>
                <div className="landing-step-icon"><i className="bi bi-people"></i></div>
                <h4>Review Proposals</h4>
                <p>Receive proposals from skilled freelancers. Compare profiles, portfolios, and pricing.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="landing-step-card">
                <div className="landing-step-number">3</div>
                <div className="landing-step-icon"><i className="bi bi-rocket-takeoff"></i></div>
                <h4>Start Building</h4>
                <p>Choose your freelancer and kick off the project with clear milestones and communication.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="landing-benefits">
        <div className="auto-container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-12">
              <div className="sec-title">
                <h6 className="blue-clr text-uppercase">Why Businesses Choose Us</h6>
                <h2>A Smarter Way to Build Your IT Team</h2>
              </div>
              <div className="landing-benefit-list">
                <div className="landing-benefit-item">
                  <div className="landing-benefit-icon"><i className="bi bi-check-circle-fill"></i></div>
                  <div>
                    <h5>Access Global IT Talent</h5>
                    <p>Connect with expert developers, designers, and engineers from around the world.</p>
                  </div>
                </div>
                <div className="landing-benefit-item">
                  <div className="landing-benefit-icon"><i className="bi bi-check-circle-fill"></i></div>
                  <div>
                    <h5>Scale On Demand</h5>
                    <p>Hire for a single task or build an entire team. Scale up or down as your project evolves.</p>
                  </div>
                </div>
                <div className="landing-benefit-item">
                  <div className="landing-benefit-icon"><i className="bi bi-check-circle-fill"></i></div>
                  <div>
                    <h5>Transparent Pricing</h5>
                    <p>Review proposals with clear pricing, timelines, and deliverables before you commit.</p>
                  </div>
                </div>
                <div className="landing-benefit-item">
                  <div className="landing-benefit-icon"><i className="bi bi-check-circle-fill"></i></div>
                  <div>
                    <h5>Quality You Can Trust</h5>
                    <p>Work with professionals who are reviewed and rated by other businesses on the platform.</p>
                  </div>
                </div>
                <div className="landing-benefit-item">
                  <div className="landing-benefit-icon"><i className="bi bi-check-circle-fill"></i></div>
                  <div>
                    <h5>Secure Collaboration</h5>
                    <p>Built-in messaging, milestone tracking, and payment protection for peace of mind.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="landing-benefits__images">
                <div className="row g-3">
                  <div className="col-6">
                    <div className="why-box text-center">
                      <img src={iconLogo1} className="img-fluid mb-3" alt="Fast and easy hiring" />
                      <h4>Fast & Easy</h4>
                      <p>Post once, receive multiple proposals.</p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="why-box active text-center">
                      <img src={iconLogo2} className="img-fluid mb-3" alt="Expert freelancers" />
                      <h4>Expert Talent</h4>
                      <p>Vetted IT professionals worldwide.</p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="why-box active text-center">
                      <img src={iconLogo3} className="img-fluid mb-3" alt="Quality solutions" style={{ height: "140px" }} />
                      <h4>Quality Results</h4>
                      <p>Reliable delivery, every time.</p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="why-box text-center">
                      <div style={{ fontSize: "60px", color: "#1967d2", marginBottom: "10px" }}>
                        <i className="bi bi-shield-lock"></i>
                      </div>
                      <h4>Secure Payments</h4>
                      <p>Pay safely through the platform.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES CATEGORIES */}
      <section className="landing-categories bg-body-tertiary">
        <div className="auto-container">
          <div className="sec-title text-center">
            <h2>Find Freelancers for Any IT Need</h2>
          </div>
          <div className="row">
            {[
              { icon: "bi-code-slash", label: "Web Development" },
              { icon: "bi-phone", label: "Mobile App Development" },
              { icon: "bi-filetype-css", label: "DevOps & Cloud" },
              { icon: "bi-search", label: "API Development" },
              { icon: "bi-database", label: "Database Engineering" },
              { icon: "bi-robot", label: "AI & Machine Learning" },
              { icon: "bi-shield-lock", label: "Cybersecurity" },
              { icon: "bi-bar-chart", label: "Data Analysis & BI" },
            ].map(({ icon, label }) => (
              <div className="col-lg-3 col-md-4 col-6" key={label}>
                <div className="category-block-two at-home21">
                  <div className="inner-box">
                    <div className="content">
                      <i className={`bi ${icon}`}></i>
                      <h4><span>{label}</span></h4>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF / STATS */}
      <section className="landing-social-proof">
        <div className="auto-container">
          <div className="row text-center">
            <div className="col-md-3 col-6">
              <div className="landing-stat">
                <h3>500+</h3>
                <p>Freelancers Available</p>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="landing-stat">
                <h3>50+</h3>
                <p>IT Skill Categories</p>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="landing-stat">
                <h3>30+</h3>
                <p>Countries Covered</p>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="landing-stat">
                <h3>Free</h3>
                <p>To Post a Project</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REGISTRATION FORM */}
      <section className="landing-register-section" id="register-form">
        <div className="auto-container">
          <div className="row justify-content-center">
            <div className="col-lg-7 col-md-10">
              <div className="landing-form-card">
                <div className="text-center mb-4">
                  <h2>Sign Up as a Client</h2>
                  <p className="landing-form-subtitle">
                    Create your free account and post your first project in minutes.
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* Name + Phone */}
                  <div className="form-group">
                    <div className="row">
                      <div className="col-lg-6 col-md-12">
                        <label>Full Name</label>
                        <input
                          type="text"
                          name="name"
                          placeholder="Your full name"
                          value={formData.name}
                          onChange={handleChange}
                          className={errors.name ? "error-border" : ""}
                        />
                        {errors.name && <p className="error-text">{errors.name}</p>}
                      </div>
                      <div className="col-lg-6 col-md-12">
                        <label>Phone Number</label>
                        <input
                          type="text"
                          name="phone"
                          placeholder="Phone number"
                          value={formData.phone}
                          onChange={handleChange}
                          className={errors.phone ? "error-border" : ""}
                        />
                        {errors.phone && <p className="error-text">{errors.phone}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Country + Email */}
                  <div className="form-group">
                    <div className="row">
                      <div className="col-lg-6 col-md-12">
                        <label>Country</label>
                        <select
                          name="country"
                          className="chosen-select"
                          value={formData.country || ""}
                          onChange={handleChange}
                        >
                          <option value="">Select Country</option>
                          <option value="Afghanistan">Afghanistan</option>
                          <option value="Albania">Albania</option>
                          <option value="Algeria">Algeria</option>
                          <option value="Argentina">Argentina</option>
                          <option value="Australia">Australia</option>
                          <option value="Austria">Austria</option>
                          <option value="Bangladesh">Bangladesh</option>
                          <option value="Belgium">Belgium</option>
                          <option value="Brazil">Brazil</option>
                          <option value="Canada">Canada</option>
                          <option value="China">China</option>
                          <option value="Colombia">Colombia</option>
                          <option value="Croatia">Croatia</option>
                          <option value="Czech Republic">Czech Republic</option>
                          <option value="Denmark">Denmark</option>
                          <option value="Egypt">Egypt</option>
                          <option value="Finland">Finland</option>
                          <option value="France">France</option>
                          <option value="Germany">Germany</option>
                          <option value="Greece">Greece</option>
                          <option value="Hong Kong">Hong Kong</option>
                          <option value="India">India</option>
                          <option value="Indonesia">Indonesia</option>
                          <option value="Ireland">Ireland</option>
                          <option value="Italy">Italy</option>
                          <option value="Japan">Japan</option>
                          <option value="Malaysia">Malaysia</option>
                          <option value="Mexico">Mexico</option>
                          <option value="Netherlands">Netherlands</option>
                          <option value="New Zealand">New Zealand</option>
                          <option value="Nigeria">Nigeria</option>
                          <option value="Norway">Norway</option>
                          <option value="Pakistan">Pakistan</option>
                          <option value="Philippines">Philippines</option>
                          <option value="Poland">Poland</option>
                          <option value="Portugal">Portugal</option>
                          <option value="Qatar">Qatar</option>
                          <option value="Romania">Romania</option>
                          <option value="Russia">Russia</option>
                          <option value="Saudi Arabia">Saudi Arabia</option>
                          <option value="Singapore">Singapore</option>
                          <option value="South Africa">South Africa</option>
                          <option value="South Korea">South Korea</option>
                          <option value="Spain">Spain</option>
                          <option value="Sweden">Sweden</option>
                          <option value="Switzerland">Switzerland</option>
                          <option value="Thailand">Thailand</option>
                          <option value="Turkey">Turkey</option>
                          <option value="Ukraine">Ukraine</option>
                          <option value="United Arab Emirates">United Arab Emirates</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="United States">United States</option>
                          <option value="Vietnam">Vietnam</option>
                        </select>
                      </div>
                      <div className="col-lg-6 col-md-12">
                        <label>Email Address</label>
                        <input
                          type="email"
                          name="email"
                          placeholder="you@company.com"
                          value={formData.email}
                          onChange={handleChange}
                          className={errors.email ? "error-border" : ""}
                        />
                        {errors.email && <p className="error-text">{errors.email}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      className={errors.password ? "error-border" : ""}
                    />
                    {errors.password && <p className="error-text">{errors.password}</p>}
                  </div>

                  {/* Terms */}
                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        onChange={handleChange}
                        name="term_and_condition"
                        checked={formData.term_and_condition === "1"}
                      />
                      &nbsp;&nbsp;I agree to the{" "}
                      <Link to="/terms-and-conditions">Terms and Conditions</Link>
                    </label>
                  </div>

                  {/* Submit */}
                  <div className="form-group">
                    <button className="button-87 text-uppercase w-100 mx-0 py-3" type="submit" disabled={loading}>
                      {loading ? "Creating Your Account..." : "Create My Free Account"}
                    </button>
                  </div>
                </form>

                <div className="text-center mt-3">
                  <span style={{ color: "#696969", fontSize: "14px" }}>
                    Already have an account? <Link to="/login">Login</Link>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="subscribe-section at-home22 py-xl-0">
        <div className="auto-container py-5">
          <div className="outer-box d-flex">
            <div className="sec-title">
              <h3 className="text-white">Ready to Find Your Perfect Freelancer?</h3>
              <div className="text-white">
                Join The Code Helper marketplace today. Post your project for free and start receiving proposals from skilled IT professionals.
              </div>
            </div>
            <div className="form-column">
              <div className="d-flex align-items-center gap-3 h-100">
                <button type="button" className="button-87 mx-0 px-5 py-3" onClick={scrollToForm}>
                  Get Started Free <i className="bi bi-arrow-up-right ms-2"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default RegisterClient;

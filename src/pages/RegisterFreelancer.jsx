import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiRequest } from "../utils/api";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import free1 from "../assets/images/freelancer-projects.jpg";
import free2 from "../assets/images/freelancer-price.jpg";
import free3 from "../assets/images/freelancer-independent.jpg";

const RegisterFreelancer = () => {
  const [param] = useSearchParams();
  const email = param.get("email");

  const [formData, setFormData] = useState({
    role: "Freelancer",
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
        navigate("/user/dashboard");
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

  const freelancerImgStyle = {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "14px",
  };

  return (
    <>
      {/* HERO SECTION */}
      <section className="landing-hero landing-hero--freelancer">
        <div className="auto-container">
          <div className="row align-items-center">
            <div className="col-lg-7 col-md-12">
              <div className="landing-hero__content">
                <span className="landing-hero__badge">IT Freelancer Marketplace</span>
                <h1>
                  Find Freelance <span className="landing-accent">Development Projects</span> That Pay Well
                </h1>
                <p className="landing-hero__subtitle">
                  Join The Code Helper marketplace and connect with businesses looking for skilled developers. Choose projects you love, set your own rates, and grow your freelance career.
                </p>
                <div className="landing-hero__ctas">
                  <button type="button" className="button-87 px-5 py-3 ms-0" onClick={scrollToForm}>
                    Join as a Freelancer — Free
                  </button>
                  <Link to="/projects" className="landing-outline-btn px-4 py-3">
                    Browse Available Projects
                  </Link>
                </div>
                <div className="landing-hero__trust">
                  <div className="landing-trust-item">
                    <i className="bi bi-wallet2"></i>
                    <span>Set Your Own Rates</span>
                  </div>
                  <div className="landing-trust-item">
                    <i className="bi bi-globe2"></i>
                    <span>Work Remotely</span>
                  </div>
                  <div className="landing-trust-item">
                    <i className="bi bi-lightning"></i>
                    <span>Free to Join</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-5 col-md-12">
              <div className="landing-hero__image">
                <img src={free1} alt="Find freelance coding projects" className="img-fluid" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="landing-steps bg-body-tertiary">
        <div className="auto-container">
          <div className="sec-title text-center">
            <h2>Start Earning in 3 Steps</h2>
            <p className="landing-section-subtitle">Your freelance journey starts here</p>
          </div>
          <div className="row">
            <div className="col-md-4">
              <div className="landing-step-card">
                <div className="landing-step-number">1</div>
                <div className="landing-step-icon"><i className="bi bi-person-plus"></i></div>
                <h4>Create Your Profile</h4>
                <p>Sign up for free, showcase your skills, experience, and portfolio to stand out.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="landing-step-card landing-step-card--active">
                <div className="landing-step-number">2</div>
                <div className="landing-step-icon"><i className="bi bi-search"></i></div>
                <h4>Find Projects</h4>
                <p>Browse projects that match your expertise and submit proposals with your timeline and price.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="landing-step-card">
                <div className="landing-step-number">3</div>
                <div className="landing-step-icon"><i className="bi bi-cash-stack"></i></div>
                <h4>Get Paid</h4>
                <p>Complete the work, get approved by the client, and receive payment securely through the platform.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY FREELANCERS CHOOSE US */}
      <section className="landing-benefits">
        <div className="auto-container">
          <div className="sec-title text-center">
            <h6 className="blue-clr text-uppercase">Built for Developers</h6>
            <h2>Why Freelancers Choose The Code Helper</h2>
          </div>
          <div className="row">
            <div className="col-md-4">
              <div className="why-box text-center">
                <img src={free1} className="img-fluid mb-3" alt="Choose projects you love" style={freelancerImgStyle} loading="lazy" />
                <h4>Select Your Kind of Projects</h4>
                <p>Choose projects that match your skills, interests, and schedule — no pressure to take everything.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="why-box active text-center">
                <img src={free2} className="img-fluid mb-3" alt="Set your own rates" style={freelancerImgStyle} loading="lazy" />
                <h4>Set Your Own Price</h4>
                <p>Define your rates and proposal terms clearly so you stay in control of your income.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="why-box text-center">
                <img src={free3} className="img-fluid mb-3" alt="Work independently" style={freelancerImgStyle} loading="lazy" />
                <h4>Work Independently</h4>
                <p>Build your freelance career your way — manage your time, grow your profile, and work with projects you like.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ADDITIONAL BENEFITS LIST */}
      <section className="landing-extra-benefits bg-body-tertiary">
        <div className="auto-container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-12">
              <div className="sec-title">
                <h2>Everything You Need to Succeed</h2>
              </div>
              <div className="landing-benefit-list">
                <div className="landing-benefit-item">
                  <div className="landing-benefit-icon"><i className="bi bi-check-circle-fill"></i></div>
                  <div>
                    <h5>Direct Client Communication</h5>
                    <p>Chat directly with clients to clarify requirements and build lasting work relationships.</p>
                  </div>
                </div>
                <div className="landing-benefit-item">
                  <div className="landing-benefit-icon"><i className="bi bi-check-circle-fill"></i></div>
                  <div>
                    <h5>Diverse Project Categories</h5>
                    <p>From web & mobile apps to cloud, AI, data science, and cybersecurity — find projects in your niche.</p>
                  </div>
                </div>
                <div className="landing-benefit-item">
                  <div className="landing-benefit-icon"><i className="bi bi-check-circle-fill"></i></div>
                  <div>
                    <h5>Secure Payment System</h5>
                    <p>Get paid reliably through the platform's secure payment infrastructure.</p>
                  </div>
                </div>
                <div className="landing-benefit-item">
                  <div className="landing-benefit-icon"><i className="bi bi-check-circle-fill"></i></div>
                  <div>
                    <h5>Build Your Reputation</h5>
                    <p>Earn ratings and reviews that help you win more projects and command higher rates.</p>
                  </div>
                </div>
                <div className="landing-benefit-item">
                  <div className="landing-benefit-icon"><i className="bi bi-check-circle-fill"></i></div>
                  <div>
                    <h5>Work From Anywhere</h5>
                    <p>100% remote projects — work from your home, a café, or anywhere with an internet connection.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="landing-freelancer-stats">
                <div className="row g-3 text-center">
                  <div className="col-6">
                    <div className="landing-stat-card">
                      <i className="bi bi-briefcase" style={{ fontSize: "36px", color: "#1967d2" }}></i>
                      <h3>200+</h3>
                      <p>Active Projects</p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="landing-stat-card">
                      <i className="bi bi-globe" style={{ fontSize: "36px", color: "#4e9d5a" }}></i>
                      <h3>30+</h3>
                      <p>Countries</p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="landing-stat-card">
                      <i className="bi bi-code-square" style={{ fontSize: "36px", color: "#4e9d5a" }}></i>
                      <h3>50+</h3>
                      <p>Skill Categories</p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="landing-stat-card">
                      <i className="bi bi-star" style={{ fontSize: "36px", color: "#1967d2" }}></i>
                      <h3>Free</h3>
                      <p>To Join & Apply</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS IN DEMAND */}
      <section className="landing-categories">
        <div className="auto-container">
          <div className="sec-title text-center">
            <h2>Skills in Demand Right Now</h2>
            <p className="landing-section-subtitle">Businesses are actively looking for freelancers with these skills</p>
          </div>
          <div className="row">
            {[
              { icon: "bi-filetype-jsx", label: "React / Next.js" },
              { icon: "bi-filetype-py", label: "Python / Django" },
              { icon: "bi-filetype-php", label: "PHP / Laravel" },
              { icon: "bi-phone", label: "Mobile Development" },
              { icon: "bi-cloud", label: "AWS / Cloud" },
              { icon: "bi-robot", label: "AI / ChatGPT Integration" },
              { icon: "bi-wordpress", label: "WordPress" },
              { icon: "bi-palette", label: "UI/UX Design" },
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
                <p>Registered Freelancers</p>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="landing-stat">
                <h3>200+</h3>
                <p>Projects Posted</p>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="landing-stat">
                <h3>30+</h3>
                <p>Countries</p>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="landing-stat">
                <h3>100%</h3>
                <p>Free to Join</p>
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
                  <h2>Join as a Freelancer</h2>
                  <p className="landing-form-subtitle">
                    Create your free account and start applying to projects today.
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
                          placeholder="you@example.com"
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
                      {loading ? "Creating Your Account..." : "Start Freelancing — It's Free"}
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
              <h3 className="text-white">Your Freelance Career Starts Here</h3>
              <div className="text-white">
                Join hundreds of developers already earning on The Code Helper. Sign up for free and start applying to projects today.
              </div>
            </div>
            <div className="form-column">
              <div className="d-flex align-items-center gap-3 h-100">
                <button type="button" className="button-87 mx-0 px-5 py-3" onClick={scrollToForm}>
                  Join Now — Free <i className="bi bi-arrow-up-right ms-2"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default RegisterFreelancer;

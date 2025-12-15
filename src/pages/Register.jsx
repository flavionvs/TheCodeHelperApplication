import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { apiRequest } from "../utils/api";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const Register = () => {
  const [param] = useSearchParams();
  const type = param.get("type");
  const email = param.get("email");

  const [formData, setFormData] = useState({
    role: type,
    name: "",
    phone: "",
    country: "",
    term_and_condition: "",
    email: email || "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [active, setActive] = useState("Freelancer");
  const navigate = useNavigate(); // ✅ Initialize navigate function

  useEffect(() => {
    if (type) {
      setFormData((prev) => ({ ...prev, role: type }));
      setActive(type);
    }
    if (type) {
      setFormData((prev) => ({ ...prev, email: email }));
    }
  }, [type, email]);

  const clickOnRole = (role) => {
    setActive(role);
    setFormData({ ...formData, role });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? "1" : "") : value,
    });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
      const payload = {
    ...formData,
    role: "Freelancer", 
  };

    try {
      const response = await apiRequest("POST", "/register", payload);
      if (response.data?.status) {
        if (response.data?.access_token) {
          localStorage.setItem("token", response.data.access_token);
          localStorage.setItem(
            "user_id",
            JSON.stringify(response.data.data.personal.id)
          );
          localStorage.setItem(
            `user_${response.data?.data.personal.id}`,
            JSON.stringify(response.data?.data?.personal)
          );
          localStorage.setItem(
            `professional_${response.data?.data.professional.id}`,
            JSON.stringify(response.data?.data?.professional)
          );
        }
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 3000,
        });

        if (formData.role === "Client") {
          navigate("/user/project/create");
        } else {
          navigate("/user/dashboard");
        }
        setTimeout(() => {
        }, 1000);
      } else {
        if (response.data?.message) {
          toast.error(response.data.message, {
            position: "top-right",
            autoClose: 3000,
          });
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-section">
        <div className="login-signup-image image-layer"></div>
        <div className="outer-box">
          <div className="login-form default-form">
            <div className="form-inner">
              <h3>Create a Free Account</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <div className="btn-box row">
                    <div className="col-lg-6 col-md-12">
                      <a
                        href="#"
                        className={`theme-btn btn-style-${
                          active === "Freelancer" ? "seven" : "four"
                        }`}
                        onClick={() => clickOnRole("Freelancer")}
                      >
                        Freelancer
                      </a>
                    </div>
                    <div className="col-lg-6 col-md-12">
                      <a
                        href="#"
                        className={`theme-btn btn-style-${
                          active === "Client" ? "seven" : "four"
                        }`}
                        onClick={() => clickOnRole("Client")}
                      >
                        Client
                      </a>
                    </div>
                  </div>
                </div>

                {/* Name Field */}
                <div className="form-group">
                  <div className="row">
                    <div className="col-lg-6 col-md-12">
                      <label>Name</label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                        className={errors.name ? "error-border" : ""}
                      />
                      {errors.name && (
                        <p className="error-text">{errors.name}</p>
                      )}
                    </div>
                    <div className="col-lg-6 col-md-12">
                      <label>Phone</label>
                      <input
                        type="text"
                        name="phone"
                        placeholder="Phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={errors.phone ? "error-border" : ""}
                      />
                      {errors.phone && (
                        <p className="error-text">{errors.phone}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div className="row">
                    <div className="col-lg-6 col-md-12">
                      <label>County</label>
                      <select name="country" class="chosen-select">
                        <option>Select Country</option>
                        <option>Afghanistan</option>
                        <option>Albania</option>
                        <option>Algeria</option>
                        <option>Andorra</option>
                        <option>Angola</option>
                        <option>Argentina</option>
                        <option>Armenia</option>
                        <option>Australia</option>
                        <option>Austria</option>
                        <option>Azerbaijan</option>
                        <option>Bahrain</option>
                        <option>Bangladesh</option>
                        <option>Belarus</option>
                        <option>Belgium</option>
                        <option>Belize</option>
                        <option>Benin</option>
                        <option>Bhutan</option>
                        <option>Bolivia</option>
                        <option>Bosnia and Herzegovina</option>
                        <option>Botswana</option>
                        <option>Brazil</option>
                        <option>Bulgaria</option>
                        <option>Canada</option>
                        <option>China</option>
                        <option>Colombia</option>
                        <option>Croatia</option>
                        <option>Cuba</option>
                        <option>Cyprus</option>
                        <option>Czech Republic</option>
                        <option>Denmark</option>
                        <option>Egypt</option>
                        <option>Finland</option>
                        <option>France</option>
                        <option>Germany</option>
                        <option>Greece</option>
                        <option>Hong Kong</option>
                        <option selected>India</option>
                        <option>Indonesia</option>
                        <option>Iran</option>
                        <option>Iraq</option>
                        <option>Ireland</option>
                        <option>Italy</option>
                        <option>Japan</option>
                        <option>Kuwait</option>
                        <option>Lebanon</option>
                        <option>Malaysia</option>
                        <option>Mexico</option>
                        <option>Morocco</option>
                        <option>Netherlands</option>
                        <option>New Zealand</option>
                        <option>Nigeria</option>
                        <option>Norway</option>
                        <option>Pakistan</option>
                        <option>Philippines</option>
                        <option>Poland</option>
                        <option>Portugal</option>
                        <option>Qatar</option>
                        <option>Romania</option>
                        <option>Russia</option>
                        <option>Saudi Arabia</option>
                        <option>Singapore</option>
                        <option>South Africa</option>
                        <option>South Korea</option>
                        <option>Spain</option>
                        <option>Sweden</option>
                        <option>Switzerland</option>
                        <option>Thailand</option>
                        <option>Turkey</option>
                        <option>Ukraine</option>
                        <option>United Arab Emirates</option>
                        <option>United Kingdom</option>
                        <option>United States</option>
                        <option>Vietnam</option>
                      </select>
                    </div>
                    <div className="col-lg-6 col-md-12">
                      <label>Email Address</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className={errors.email ? "error-border" : ""}
                      />
                      {errors.email && (
                        <p className="error-text">{errors.email}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Password Field */}
                <div className="form-group">
                  <label>Password</label>
                  <input
                    id="password-field"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? "error-border" : ""}
                  />
                  {errors.password && (
                    <p className="error-text">{errors.password}</p>
                  )}
                </div>
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

                <div className="form-group">
                  <button
                    className="button-87 text-uppercase w-100 mx-0"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Registering..." : "Register"}
                  </button>
                </div>
              </form>
              <div className="text">
                Already have an account? <Link to="/login">Login</Link>
              </div>

              {/* <div className="bottom-box">
                <div className="divider">
                  <span>or</span>
                </div>
                <div className="btn-box row">
                  <div className="col-lg-6 col-md-12">
                    <a
                      href="#"
                      className="theme-btn social-btn-two facebook-btn"
                    >
                      <i className="fab fa-facebook-f"></i> Log In via Facebook
                    </a>
                  </div>
                  <div className="col-lg-6 col-md-12">
                    <a href="#" className="theme-btn social-btn-two google-btn">
                      <i className="fab fa-google"></i> Log In via Gmail
                    </a>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;

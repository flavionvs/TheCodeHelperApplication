import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { apiRequest } from "../utils/api";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const Register = () => {
  const [param] = useSearchParams();
  const type = param.get("type");   // expected values: "Freelancer" or "Client"
  const email = param.get("email");

  // ✅ No default role – user must choose (unless URL provides it)
  const [formData, setFormData] = useState({
    role: "",
    name: "",
    phone: "",
    country: "",
    term_and_condition: "",
    email: email || "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [active, setActive] = useState(""); // ✅ no default selected
  const navigate = useNavigate();

  useEffect(() => {
    if (type) {
      setFormData((prev) => ({ ...prev, role: type }));
      setActive(type);
    }
    if (email) {
      setFormData((prev) => ({ ...prev, email }));
    }
  }, [type, email]);

  const clickOnRole = (role) => {
    setActive(role);
    setFormData((prev) => ({ ...prev, role }));
    setErrors((prev) => ({ ...prev, role: "" }));
  };

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

    // ✅ Frontend validation to avoid bad payload
    if (!formData.role) {
      toast.error("Please choose Client or Freelancer", {
        position: "top-right",
        autoClose: 3000,
      });
      setLoading(false);
      return;
    }

    if (!formData.country) {
      toast.error("Please select a country", {
        position: "top-right",
        autoClose: 3000,
      });
      setLoading(false);
      return;
    }

    if (formData.term_and_condition !== "1") {
      toast.error("You must accept Terms and Conditions", {
        position: "top-right",
        autoClose: 3000,
      });
      setLoading(false);
      return;
    }

    // ✅ DO NOT override role here. Use what user selected.
    const payload = { ...formData };

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

          // Some APIs may not return professional object for Client, so guard it
          if (response.data?.data?.professional?.id) {
            localStorage.setItem(
              `professional_${response.data?.data.professional.id}`,
              JSON.stringify(response.data?.data?.professional)
            );
          }
        }

        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 3000,
        });

        // ✅ Redirect based on chosen role
        if (payload.role === "Client") {
          navigate("/user/project/create");
        } else {
          navigate("/user/dashboard");
        }
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
                {/* Role chooser */}
                <div className="form-group">
                  <div className="btn-box row">
                    <div className="col-lg-6 col-md-12">
                      <button
                        type="button"
                        className={`theme-btn btn-style-${
                          active === "Freelancer" ? "seven" : "four"
                        }`}
                        onClick={() => clickOnRole("Freelancer")}
                      >
                        Freelancer
                      </button>
                    </div>

                    <div className="col-lg-6 col-md-12">
                      <button
                        type="button"
                        className={`theme-btn btn-style-${
                          active === "Client" ? "seven" : "four"
                        }`}
                        onClick={() => clickOnRole("Client")}
                      >
                        Client
                      </button>
                    </div>
                  </div>

                  {errors.role && <p className="error-text">{errors.role}</p>}
                </div>

                {/* Name + Phone */}
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
                        <option value="Andorra">Andorra</option>
                        <option value="Angola">Angola</option>
                        <option value="Argentina">Argentina</option>
                        <option value="Armenia">Armenia</option>
                        <option value="Australia">Australia</option>
                        <option value="Austria">Austria</option>
                        <option value="Azerbaijan">Azerbaijan</option>
                        <option value="Bahrain">Bahrain</option>
                        <option value="Bangladesh">Bangladesh</option>
                        <option value="Belarus">Belarus</option>
                        <option value="Belgium">Belgium</option>
                        <option value="Belize">Belize</option>
                        <option value="Benin">Benin</option>
                        <option value="Bhutan">Bhutan</option>
                        <option value="Bolivia">Bolivia</option>
                        <option value="Bosnia and Herzegovina">
                          Bosnia and Herzegovina
                        </option>
                        <option value="Botswana">Botswana</option>
                        <option value="Brazil">Brazil</option>
                        <option value="Bulgaria">Bulgaria</option>
                        <option value="Canada">Canada</option>
                        <option value="China">China</option>
                        <option value="Colombia">Colombia</option>
                        <option value="Croatia">Croatia</option>
                        <option value="Cuba">Cuba</option>
                        <option value="Cyprus">Cyprus</option>
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
                        <option value="Iran">Iran</option>
                        <option value="Iraq">Iraq</option>
                        <option value="Ireland">Ireland</option>
                        <option value="Italy">Italy</option>
                        <option value="Japan">Japan</option>
                        <option value="Kuwait">Kuwait</option>
                        <option value="Lebanon">Lebanon</option>
                        <option value="Malaysia">Malaysia</option>
                        <option value="Mexico">Mexico</option>
                        <option value="Morocco">Morocco</option>
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
                        <option value="United Arab Emirates">
                          United Arab Emirates
                        </option>
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

                {/* Password */}
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;

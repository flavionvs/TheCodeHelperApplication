import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiRequest } from "../utils/api";
import { Link, useNavigate } from "react-router-dom"; // ✅ Import useNavigate


const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); // ✅ Initialize navigate function

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await apiRequest("POST", "/send-otp", formData);
      if (response.data?.status) {        
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 3000,
        });
        const basePath = import.meta.env.BASE_URL; // will be '/' in dev, '/codehelper/web/' in prod
        window.location.href = `${basePath}/change-password`;

      } else {
        if (!response.validation_error) {
          toast.error(response.data?.message || response.message || "Something went wrong.", {
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
              <h3>Forgot Password</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? "error-border" : ""}
                  />
                  {errors.email && <p className="error-text">{errors.email}</p>}
                </div>          
                <Link to="/login">Already have an account ?</Link>
                <div className="form-group">
                  <button className="button-87 text-uppercase w-100 mx-0" type="submit" disabled={loading}>
                    {loading ? "Sending..." : "Send OTP"}
                  </button>
                </div>
              </form>

              <div className="bottom-box">
                <div className="text">Don't have an account? <Link to="/register">Signup</Link></div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;

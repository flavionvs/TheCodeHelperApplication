import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiRequest } from "../utils/api";
import { Link, useNavigate } from "react-router-dom"; // ✅ Import useNavigate


const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    otp: "",
    new_password: "",
    confirm_password: "",    
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
      const response = await apiRequest("POST", "/change-password", formData);
      if (response.data?.status) {        
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 3000,
        });

         setTimeout(() => {          
            const basePath = import.meta.env.BASE_URL; // will be '/' in dev, '/codehelper/web/' in prod          
            localStorage.removeItem("redirectAfterLogin");
            window.location.href = `${basePath}/login`;          
        }, 1000);        

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
              <h3>Change Password</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Enter OTP</label>
                  <input
                    type="text"
                    name="otp"
                    placeholder="Enter 6-ditig OTP"
                    value={formData.otp}
                    onChange={handleChange}
                    className={errors.otp ? "error-border" : ""}
                  />
                  {errors.otp && <p className="error-text">{errors.otp}</p>}
                </div>          
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="text"
                    name="password"
                    placeholder="Enter new password"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? "error-border" : ""}
                  />
                  {errors.password && <p className="error-text">{errors.password}</p>}
                </div>          
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input
                    type="text"
                    name="confirm_password"
                    placeholder="Confirm password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    className={errors.confirm_password ? "error-border" : ""}
                  />
                  {errors.confirm_password && <p className="error-text">{errors.confirm_password}</p>}
                </div>          
                <div className="form-group">
                  <button className="button-87 text-uppercase w-100 mx-0" type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </form>              
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;

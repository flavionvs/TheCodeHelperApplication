import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiRequest } from "../utils/api";
import { Link, useNavigate, useLocation } from "react-router-dom";

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get email and role from navigation state (passed from Register)
  const email = location.state?.email || "";
  const role = location.state?.role || "";
  
  const [formData, setFormData] = useState({
    email: email,
    otp: "",
  });

  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [countdown, setCountdown] = useState(0);

  // Redirect if no email passed
  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Only allow digits and limit to 6 characters for OTP
    if (name === "otp") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 6);
      setFormData({ ...formData, [name]: digitsOnly });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    
    setLoading(true);
    setErrors({});

    try {
      const response = await apiRequest("POST", "/verify-signup-otp", formData);
      
      if (response.data?.status) {
        // Store token and user data
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

        // Redirect based on role
        setTimeout(() => {
          if (role === "Client") {
            navigate("/user/project/create");
          } else {
            navigate("/user/dashboard");
          }
        }, 500);
      } else {
        toast.error(response.data?.message || "Verification failed", {
          position: "top-right",
          autoClose: 3000,
        });
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

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    
    setResendLoading(true);
    
    try {
      const response = await apiRequest("POST", "/resend-signup-otp", { email: formData.email });
      
      if (response.data?.status) {
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 3000,
        });
        setCountdown(30); // Start 30 second countdown
      } else {
        toast.error(response.data?.message || "Failed to resend OTP", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to resend OTP", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <>
      <div className="login-section">
        <div className="login-signup-image image-layer"></div>
        <div className="outer-box">
          <div className="login-form default-form">
            <div className="form-inner">
              <h3>Verify Your Email</h3>
              <p className="text-center mb-4" style={{ color: "#666" }}>
                We've sent a 6-digit verification code to<br />
                <strong>{email}</strong>
              </p>
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Enter Verification Code</label>
                  <input
                    type="text"
                    name="otp"
                    placeholder="Enter 6-digit code"
                    value={formData.otp}
                    onChange={handleChange}
                    className={errors.otp ? "error-border" : ""}
                    style={{ 
                      textAlign: "center", 
                      letterSpacing: "8px", 
                      fontSize: "20px",
                      fontWeight: "bold"
                    }}
                    maxLength={6}
                    autoComplete="one-time-code"
                  />
                  {errors.otp && <p className="error-text">{errors.otp}</p>}
                </div>
                
                <p className="text-center" style={{ fontSize: "14px", color: "#888", marginBottom: "20px" }}>
                  Code expires in 10 minutes
                </p>
                
                <div className="form-group">
                  <button 
                    className="button-87 text-uppercase w-100 mx-0" 
                    type="submit" 
                    disabled={loading}
                  >
                    {loading ? "Verifying..." : "Verify Email"}
                  </button>
                </div>
              </form>

              <div className="text-center" style={{ marginTop: "20px" }}>
                <p style={{ color: "#666", marginBottom: "10px" }}>
                  Didn't receive the code?
                </p>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={countdown > 0 || resendLoading}
                  style={{
                    background: "none",
                    border: "none",
                    color: countdown > 0 ? "#999" : "#1967D2",
                    cursor: countdown > 0 ? "not-allowed" : "pointer",
                    textDecoration: "underline",
                    fontSize: "14px",
                  }}
                >
                  {resendLoading 
                    ? "Sending..." 
                    : countdown > 0 
                      ? `Resend in ${countdown}s` 
                      : "Resend Code"
                  }
                </button>
              </div>

              <div className="bottom-box" style={{ marginTop: "30px" }}>
                <div className="text">
                  <Link to="/register">← Back to Registration</Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyEmail;

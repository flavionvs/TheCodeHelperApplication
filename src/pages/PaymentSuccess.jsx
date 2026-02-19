import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying | success | error

  const sessionId = searchParams.get("session_id");
  const applicationId = searchParams.get("application_id");

  useEffect(() => {
    if (sessionId) {
      // Payment was processed by Stripe — webhook handles DB updates
      // Just show success message
      setStatus("success");
      toast.success("Payment Successful!", { autoClose: 5000 });
    } else {
      setStatus("error");
    }
  }, [sessionId]);

  return (
    <section
      className="user-dashboard"
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          textAlign: "center",
          maxWidth: "500px",
          padding: "40px",
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        {status === "verifying" && (
          <>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</div>
            <h2 style={{ color: "#333", marginBottom: "12px" }}>
              Verifying Payment...
            </h2>
            <p style={{ color: "#666" }}>
              Please wait while we confirm your payment.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>✅</div>
            <h2 style={{ color: "#28a745", marginBottom: "12px" }}>
              Payment Successful!
            </h2>
            <p style={{ color: "#666", marginBottom: "24px" }}>
              Your payment has been processed successfully. The freelancer has
              been notified and can start working on your project.
            </p>
            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Link
                to="/user/project?type=ongoing"
                style={{
                  background: "#6772e5",
                  color: "#fff",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                View Ongoing Projects
              </Link>
              <Link
                to="/user/dashboard"
                style={{
                  background: "#f0f0f0",
                  color: "#333",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Go to Dashboard
              </Link>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>❌</div>
            <h2 style={{ color: "#dc3545", marginBottom: "12px" }}>
              Payment Issue
            </h2>
            <p style={{ color: "#666", marginBottom: "24px" }}>
              We couldn't verify your payment. If you were charged, your payment
              will still be processed automatically. Please check your projects
              or contact support.
            </p>
            <Link
              to="/user/dashboard"
              style={{
                background: "#6772e5",
                color: "#fff",
                padding: "12px 24px",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Go to Dashboard
            </Link>
          </>
        )}
      </div>
    </section>
  );
};

export default PaymentSuccess;

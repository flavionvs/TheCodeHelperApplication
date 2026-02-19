import React, { useMemo, useState, useEffect } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import { apiRequest } from "../utils/api";
import { useLocation, useNavigate } from "react-router-dom";

const StripePayment = () => {
  const stripe = useStripe();
  const elements = useElements();
  const token = localStorage.getItem("token");
  const location = useLocation();
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [applicationData, setApplicationData] = useState(null);

  // ✅ applicationId from query string or localStorage
  const applicationId = useMemo(() => {
    const qs = new URLSearchParams(location.search);
    const fromQuery = qs.get("applicationId") || qs.get("application_id");
    if (fromQuery && Number(fromQuery) > 0) return Number(fromQuery);

    const fromLs = localStorage.getItem("selected_application_id");
    if (fromLs && Number(fromLs) > 0) return Number(fromLs);

    return 0;
  }, [location.search]);

  // ✅ Fetch application details to show amount
  useEffect(() => {
    if (applicationId && token) {
      fetchApplicationDetails();
    }
  }, [applicationId]);

  const fetchApplicationDetails = async () => {
    try {
      // Try to get the application details from localStorage first
      const storedApp = localStorage.getItem("selected_application_data");
      if (storedApp) {
        try {
          const parsed = JSON.parse(storedApp);
          if (parsed && parsed.total_amount) {
            setApplicationData(parsed);
            return;
          }
        } catch (e) { /* ignore parse errors */ }
      }
    } catch (err) {
      console.log("Could not load application details:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    setSuccess(false);

    if (!stripe || !elements) {
      toast.error("Stripe is not ready yet. Please try again.");
      return;
    }

    if (!token) {
      toast.error("You must be logged in to pay.");
      return;
    }

    if (!applicationId || Number(applicationId) === 0) {
      const msg = "Application ID missing. Please go back and click Approve again.";
      setError(msg);
      toast.error(msg);
      return;
    }

    setLoading(true);

    try {
      const cardElement = elements.getElement(CardElement);

      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (pmError) {
        setError(pmError.message);
        setLoading(false);
        return;
      }

      // ✅ Backend calculates amount from DB (secure)
      const payload = {
        paymentMethod: paymentMethod.id,
        applicationId: applicationId,
      };

      const response = await apiRequest("POST", "/payment", payload, {
        Authorization: `Bearer ${token}`,
      });

      console.log("Payment response:", response);

      // ✅ Handle the response — backend may return:
      // 1. {status:true, paymentIntent:{status:'succeeded'}} → immediate success
      // 2. {requires_action:true, payment_intent_client_secret:'...'} → needs 3DS
      // 3. {status:false, message:'...'} → error

      let paymentIntent = response?.data?.paymentIntent || null;

      // Check for 3DS / requires_action
      const requiresAction =
        response?.data?.requires_action === true ||
        response?.data?.requiresAction === true;

      const clientSecret =
        response?.data?.payment_intent_client_secret ||
        response?.data?.client_secret ||
        response?.data?.clientSecret ||
        null;

      if ((requiresAction || clientSecret) && stripe) {
        if (!clientSecret) {
          toast.error("Payment requires authentication, but client secret was not provided.");
          setLoading(false);
          return;
        }

        const confirmResult = await stripe.confirmCardPayment(clientSecret);

        if (confirmResult?.error) {
          const msg = confirmResult.error.message || "Authentication failed. Please try again.";
          setError(msg);
          toast.error(msg);
          setLoading(false);
          return;
        }

        paymentIntent = confirmResult?.paymentIntent || paymentIntent;

        if (!paymentIntent || paymentIntent.status !== "succeeded") {
          const msg = paymentIntent?.status
            ? `Payment not completed (status: ${paymentIntent.status}).`
            : "Payment not completed. Please try again.";
          setError(msg);
          toast.error(msg);
          setLoading(false);
          return;
        }
      }

      // ✅ If payment succeeded (immediately or after 3DS), finalize in backend
      if (paymentIntent && paymentIntent.status === "succeeded") {
        const finalizePayload = {
          applicationId: applicationId,
          amount: paymentIntent.amount,
          paymentIntentId: paymentIntent.id,
          paymentStatus: paymentIntent.status,
          paymentDetails: paymentIntent,
        };

        const finalizeRes = await apiRequest(
          "POST",
          "/update-application-status",
          finalizePayload,
          { Authorization: `Bearer ${token}` }
        );

        if (!finalizeRes?.data?.status) {
          const msg = finalizeRes?.data?.message || "Payment succeeded, but failed to update project status.";
          setError(msg);
          toast.error(msg);
          setLoading(false);
          return;
        }

        toast.success("Payment Successful!", { position: "top-right", autoClose: 3000 });
        setSuccess(true);
        setError(null);
        return;
      }

      // ✅ If backend returned {status:true} with paymentIntent (legacy path)
      if (response?.data?.status && paymentIntent) {
        const finalizePayload = {
          applicationId: applicationId,
          amount: paymentIntent.amount,
          paymentIntentId: paymentIntent.id,
          paymentStatus: paymentIntent.status,
          paymentDetails: paymentIntent,
        };

        const finalizeRes = await apiRequest(
          "POST",
          "/update-application-status",
          finalizePayload,
          { Authorization: `Bearer ${token}` }
        );

        if (finalizeRes?.data?.status) {
          toast.success("Payment Successful!", { position: "top-right", autoClose: 3000 });
          setSuccess(true);
          setError(null);
        } else {
          setError(finalizeRes?.data?.message || "Failed to update application status");
          toast.error(finalizeRes?.data?.message || "Failed to update application status");
        }
        return;
      }

      // ✅ If backend returned {status:true} but no paymentIntent (already handled by backend)
      if (response?.data?.status) {
        toast.success("Payment Successful!", { position: "top-right", autoClose: 3000 });
        setSuccess(true);
        setError(null);
        return;
      }

      // ✅ Error
      const msg = response?.data?.message || "Payment failed.";
      setError(msg);
      toast.error(msg);

    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Something went wrong";
      setError(message);
      setSuccess(false);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = {
    style: {
      base: {
        fontSize: "16px",
        color: "#32325d",
        "::placeholder": { color: "#a0aec0" },
        padding: "12px 16px",
      },
      invalid: { color: "#fa755a", iconColor: "#fa755a" },
    },
    hidePostalCode: true,
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "150px",
        marginBottom: "150px",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "450px",
          width: "100%",
          padding: "30px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
          borderRadius: "12px",
          backgroundColor: "#fff",
        }}
      >
        <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
          Stripe Payment
        </h3>

        {applicationData && (
          <div style={{ marginBottom: "20px", padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "14px" }}>
              <li style={{ marginBottom: "5px" }}>Price: <strong>${applicationData.amount || applicationData.total_amount}</strong></li>
              {applicationData.admin_amount && (
                <li style={{ marginBottom: "5px" }}>
                  Code Helper Commission: ${applicationData.admin_amount} ({applicationData.admin_commission}%)
                </li>
              )}
              {applicationData.stripe_amount && (
                <li style={{ marginBottom: "5px" }}>
                  Payment Commission: ${applicationData.stripe_amount} ({applicationData.stripe_commission}%)
                </li>
              )}
              {applicationData.stripe_fee && (
                <li style={{ marginBottom: "5px" }}>Payment Fee: ${applicationData.stripe_fee}</li>
              )}
              <li style={{ marginTop: "10px", fontWeight: "bold", borderTop: "1px solid #dee2e6", paddingTop: "8px" }}>
                Total: ${applicationData.total_amount}
              </li>
            </ul>
          </div>
        )}

        {!applicationData && applicationId > 0 && (
          <div style={{ textAlign: "center", fontSize: "13px", opacity: 0.7, marginBottom: "20px" }}>
            Application ID: <b>{applicationId}</b>
          </div>
        )}

        {!applicationId && (
          <div style={{ textAlign: "center", color: "red", marginBottom: "20px", fontSize: "14px" }}>
            No application selected. Please go back and click Approve on an application.
          </div>
        )}

        <div
          style={{
            marginBottom: "20px",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            padding: "12px",
          }}
        >
          <CardElement options={cardStyle} />
        </div>

        <button
          type="submit"
          disabled={!stripe || loading || !applicationId}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#6772e5",
            color: "#fff",
            fontWeight: "bold",
            border: "none",
            borderRadius: "8px",
            cursor: !stripe || loading || !applicationId ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading
            ? "Processing..."
            : applicationData?.total_amount
            ? `Pay $${applicationData.total_amount}`
            : "Pay"}
        </button>

        {error && (
          <p style={{ color: "red", marginTop: "15px", textAlign: "center" }}>
            {error}
          </p>
        )}
        {success && (
          <p style={{ color: "green", marginTop: "15px", textAlign: "center" }}>
            Payment Successful!
          </p>
        )}
      </form>
    </div>
  );
};

export default StripePayment;

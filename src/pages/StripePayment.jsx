import React, { useMemo, useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import { apiRequest } from "../utils/api";
import { useLocation } from "react-router-dom";

const StripePayment = () => {
  const stripe = useStripe();
  const elements = useElements();
  const token = localStorage.getItem("token");
  const location = useLocation();

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ applicationId MUST come from the application the client is paying for
  // We read from:
  // 1) query string ?applicationId=123 (recommended)
  // 2) query string ?application_id=123
  // 3) localStorage selected_application_id (fallback)
  const applicationId = useMemo(() => {
    const qs = new URLSearchParams(location.search);
    const fromQuery = qs.get("applicationId") || qs.get("application_id");
    if (fromQuery && Number(fromQuery) > 0) return Number(fromQuery);

    const fromLs = localStorage.getItem("selected_application_id");
    if (fromLs && Number(fromLs) > 0) return Number(fromLs);

    return 0;
  }, [location.search]);

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

    // ✅ block if missing
    if (!applicationId || Number(applicationId) === 0) {
      const msg =
        "Application ID missing. Open this page like: /stripe-payment?applicationId=123";
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

      // ✅ Send REQUIRED applicationId (backend will calculate amount from DB)
      const payload = {
        paymentMethod: paymentMethod.id,
        applicationId: applicationId,
      };

      const response = await apiRequest("POST", "/payment", payload, {
        Authorization: `Bearer ${token}`,
      });

      // backend might return:
      // - {status:true, paymentIntent:{client_secret:...}} OR
      // - {requires_action:true, payment_intent_client_secret:...} OR
      // - {status:true, client_secret:...}
      const clientSecret =
        response?.data?.payment_intent_client_secret ||
        response?.data?.client_secret ||
        response?.data?.paymentIntent?.client_secret;

      if (!clientSecret) {
        const msg =
          response?.data?.message ||
          response?.data?.error ||
          "Payment setup failed.";
        setError(msg);
        toast.error(msg);
        setLoading(false);
        return;
      }

      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: paymentMethod.id,
        }
      );

      if (confirmError) {
        setError(confirmError.message);
        setSuccess(false);
        toast.error(confirmError.message);
        setLoading(false);
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        // ✅ NEW: finalize in backend so project/payment/status updates even if webhook isn't working
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
          {
            Authorization: `Bearer ${token}`,
          }
        );

        if (!finalizeRes?.data?.status) {
          const msg =
            finalizeRes?.data?.message ||
            "Payment succeeded, but failed to update project status.";
          setError(msg);
          toast.error(msg);
          setLoading(false);
          return;
        }

        toast.success("Payment Successful!", {
          position: "top-right",
          autoClose: 3000,
        });
        setSuccess(true);
        setError(null);
      } else {
        const msg = `Payment status: ${paymentIntent?.status || "unknown"}`;
        setError(msg);
        toast.error(msg);
      }
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || "Something went wrong";
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

        {/* ✅ Helpful display so you can confirm it isn't 0 */}
        <div
          style={{
            textAlign: "center",
            fontSize: "12px",
            opacity: 0.7,
            marginBottom: "20px",
          }}
        >
          Application ID: <b>{applicationId || "missing"}</b>
        </div>

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
          disabled={!stripe || loading}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#6772e5",
            color: "#fff",
            fontWeight: "bold",
            border: "none",
            borderRadius: "8px",
            cursor: !stripe || loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Processing..." : "Pay"}
        </button>

        {error && (
          <p style={{ color: "red", marginTop: "15px", textAlign: "center" }}>
            {error}
          </p>
        )}
        {success && (
          <p
            style={{ color: "green", marginTop: "15px", textAlign: "center" }}
          >
            Payment Successful!
          </p>
        )}
      </form>
    </div>
  );
};

export default StripePayment;

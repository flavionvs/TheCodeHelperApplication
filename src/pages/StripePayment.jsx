import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { toast } from "react-toastify"; // Assuming you're using react-toastify for notifications
import { apiRequest } from "../utils/api";

const StripePayment = () => {
  const stripe = useStripe();
  const elements = useElements();
  const token = localStorage.getItem("token");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [amount, setAmount] = useState("1000"); // Amount in cents ($10.00)

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      setError(error.message);
      setSuccess(false);
    } else {
      try {
        const updatedData = { paymentMethod: paymentMethod.id, amount: amount };
        
        // Call your API to create the paymentIntent and get client_secret
        const response = await apiRequest('post', '/payment', updatedData, {
          Authorization: `Bearer ${token}`,
        });

        if (response.data?.status) {
          // Confirm payment with the client_secret
          const { client_secret } = response.data;

          // Confirm the payment with Stripe
          const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(client_secret, {
            payment_method: paymentMethod.id,
          });

          if (confirmError) {
            setError(confirmError.message);
            setSuccess(false);
          } else if (paymentIntent.status === "succeeded") {
            toast.success("Payment Successful!", { position: "top-right", autoClose: 3000 });
            setSuccess(true);
            setError(null);
          }
        } else {
                if(response.data?.message){
                  toast.error(response.data.message, {
                    position: "top-right",
                    autoClose: 3000,
                  });
                }
              }
      } catch (err) {
        const message = err?.response?.data?.message || err.message || "Something went wrong";
        setError(message);
        setSuccess(false);
      }
    }
  };

  const cardStyle = {
    style: {
      base: {
        fontSize: '16px',
        color: '#32325d',
        '::placeholder': {
          color: '#a0aec0',
        },
        padding: '12px 16px',
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '150px', marginBottom: '150px' }}>
      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: '450px',
          width: '100%',
          padding: '30px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
          backgroundColor: '#fff',
        }}
      >
        <h3 style={{ textAlign: 'center', marginBottom: '30px' }}>Stripe Payment</h3>

        <input
          type="number"
          placeholder="Amount in cents"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{
            marginBottom: "20px",
            width: "100%",
            padding: "10px",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
          }}
        />

        <div style={{ marginBottom: '20px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
          <CardElement options={cardStyle} />
        </div>

        <button
          type="submit"
          disabled={!stripe}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#6772e5',
            color: '#fff',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '8px',
            cursor: stripe ? 'pointer' : 'not-allowed',
            transition: 'background-color 0.3s',
          }}
        >
          Pay
        </button>

        {error && <p style={{ color: 'red', marginTop: '15px', textAlign: 'center' }}>{error}</p>}
        {success && <p style={{ color: 'green', marginTop: '15px', textAlign: 'center' }}>Payment Successful!</p>}
      </form>
    </div>
  );
};

export default StripePayment;

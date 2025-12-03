import React, { useState } from "react";
import { toast } from "react-toastify";
import { apiRequest } from "../utils/api";
import { useLoader } from "../ui/LoaderContext";

import customer_support from "../assets/images/background/contact-us.png";
import hero_img from "../assets/images/background/5.png";

const Contact = () => {
  const { showLoader, hideLoader } = useLoader();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    showLoader();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      const response = await apiRequest("POST", "/send-contact-query", data, {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      });

      if (response.data?.status) {
        toast.success(response.data.message || "Message sent successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        toast.error(response.data?.message || "Failed to send message", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      hideLoader();
    }
  };

  return (
    <>
      <section style={{ marginTop: "100px" }} className="hero-banner position-relative">
        <img src={hero_img} alt="Contact us" className="hero-image" />
        <div className="hero-content container position-absolute top-50 start-50 translate-middle text-center text-white">
          <h1 className="display-4 fw-bold mb-4 fade-in">Let's Connect</h1>
          <p className="text-white fade-in">
            Ready to start your next project? Get in touch with us today.
          </p>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="contact-form-card card border-0">
                <div className="card-body p-5">
                  <h2 className="fw-bold mb-4 text-center">Send us a Message</h2>
                  <form className="default-form" onSubmit={handleSubmit}>
                    <div>
                      <label htmlFor="name">Name:</label>
                      <input
                        type="text"
                        className="form-control mb-3"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email">Email:</label>
                      <input
                        type="email"
                        className="form-control mb-3"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="phone">Phone:</label>
                      <input
                        type="text"
                        className="form-control mb-3"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>              
                    <div>
                      <label htmlFor="message">Message:</label>
                      <textarea
                        className="form-control mb-3"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </div>

                    <button type="submit" className="btn btn-primary d-block">
                      Send
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="col-lg-6 slide-in-right">
              <img src={customer_support} alt="Customer support" className="img-fluid" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;

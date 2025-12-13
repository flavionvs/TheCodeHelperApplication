import axios from "axios";
import { handleValidationErrors } from './handleValidationErrors';

// ✅ Vite env var (build-time). Fallback keeps local dev working.
const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000") + "/api";

export const apiRequest = async (method, endpoint, data = {}, headers = {}) => {
  // Remove previous errors
  document.querySelectorAll(".error-text").forEach(el => el.remove());
  document.querySelectorAll("input").forEach(el => el.classList.remove("input-error"));

  const isFormData = data instanceof FormData;

  try {
    const response = await axios({
      method,
      url: `${API_BASE_URL}${endpoint}`,
      data,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...headers,
      },
    });

    if (!response.data.status) {
      let validation_error = false;
      if (response.data.message === 'Validation error') {
        const validationErrors = response.data.data;
        handleValidationErrors(validationErrors);
        validation_error = true;
      }

      return {
        success: false,
        message: response.data.message || "Validation failed",
        validation_error,
        data: response.data
      };
    }

    return { success: true, data: response.data };

  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Something went wrong",
      data: error.response?.data || null
    };
  }
};
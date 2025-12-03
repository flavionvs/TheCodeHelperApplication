import axios from "axios";
import { handleValidationErrors } from './handleValidationErrors';

// const API_BASE_URL = "http://localhost:8000/api"; // Test
const API_BASE_URL = "https://ndpelectronics.com/codehelper/api"; // Live

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

    // If status is false
    if (!response.data.status) {
      // Handle validation errors
      let validation_error = false;
      if (response.data.message === 'Validation error') {
        const validationErrors = response.data.data;
        handleValidationErrors(validationErrors);       
        validation_error = true;
      }
      
      return {
        success: false,
        message: response.data.message || "Validation failed",
        validation_error : validation_error,
        data: response.data
      };
    }

    // If status is true
    return { success: true, data: response.data };

  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Something went wrong",
      data: error.response?.data || null
    };
  }
};

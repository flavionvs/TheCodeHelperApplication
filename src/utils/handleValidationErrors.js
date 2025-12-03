import { toast } from "react-toastify";

export const handleValidationErrors = (errors) => {
  let isToastrShown = false; // Show toastr only once

  Object.keys(errors).forEach((field) => {
    // Try to find element by name (input, select, textarea)
    let inputField = document.querySelector(
      `input[name="${field}"], select[name="${field}"], textarea[name="${field}"]`
    );
    
    if (!inputField) {
      inputField = document.querySelector(`.${field}`);
      console.log(`Field ${field}`);
    }

    if (inputField) {
      // Add error class
      inputField.classList.add("input-error");

      // Remove previous error message if any
      const existingError = inputField.parentNode.querySelector(".error-text");
      if (existingError) {
        existingError.remove();
      }

      // Create new error message element
      const errorText = document.createElement("small");
      errorText.className = "error-text";
      errorText.style.color = "red";
      errorText.textContent = errors[field];

      // Append error message after the input field
      inputField.parentNode.appendChild(errorText);

      // Show Toastr once
      if (!isToastrShown) {
        toast.error("Please fill all required fields!", {
          position: "top-right",
          autoClose: 3000,
        });
        isToastrShown = true;
      }
    }
  });
};

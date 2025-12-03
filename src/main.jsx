import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// Create a new root element dynamically
const appContainer = document.querySelector(".page-wrapper");
document.body.appendChild(appContainer); // Append to <body>
createRoot(appContainer).render(
  // <StrictMode>
    <App />
  // </StrictMode>
);

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Get the stored user ID
    const userId = localStorage.getItem("user_id");

    // Remove all stored items related to the user
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");

    if (userId) {
      localStorage.removeItem(`user_${userId}`);
      localStorage.removeItem(`professional_${userId}`);
    }

    // Optional: remove redirectAfterLogin if stored
    localStorage.removeItem("redirectAfterLogin");

    // Navigate to login page
    navigate("/login");
  }, [navigate]);

  return null;
};

export default Logout;

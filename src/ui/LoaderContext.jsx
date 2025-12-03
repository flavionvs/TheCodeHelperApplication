import React, { createContext, useState, useContext } from "react";

// 1. Create context
const LoaderContext = createContext();

// 2. Create provider component
export const LoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const showLoader = () => setLoading(true);
  const hideLoader = () => setLoading(false);

  return (
    <LoaderContext.Provider value={{ loading, showLoader, hideLoader }}>
      {children}
    </LoaderContext.Provider>
  );
};

// 3. Create a custom hook to use loader context easily
export const useLoader = () => useContext(LoaderContext);

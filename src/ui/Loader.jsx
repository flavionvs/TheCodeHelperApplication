import React from "react";
import ReactDOM from "react-dom";


import { useLoader } from "./LoaderContext";


const loaderStyles = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.3)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999999,
};

const LoaderContent = () => (
  <div style={loaderStyles}>
    <div
      style={{
        padding: 20,
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 0 10px rgba(0,0,0,0.3)",
      }}
    >
      Loading...
    </div>
  </div>
);

const Loader = () => {
  const { loading } = useLoader();

  if (!loading) return null;

  return ReactDOM.createPortal(
    <LoaderContent />,
    document.body // ⬅️ this makes sure loader is rendered at end of body
  );
};

export default Loader;

import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";


const LinkSent = () => {
  return (
    <>
      <div className="login-section">
        <div
          className="login-signup-image image-layer"
        ></div>
        <div className="outer-box">
          <div className="login-form default-form">
            <div className="form-inner">
              <h3>Verification link has sent</h3>              
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LinkSent;

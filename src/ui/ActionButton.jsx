import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { apiRequest } from "../utils/api";
import parse from 'html-react-parser';
import { useLoader } from "./LoaderContext";

const ActionButton = ({ id, buttons = [], onDeleteSuccess }) => {
  const token = localStorage.getItem("token");

  const { showLoader, hideLoader } = useLoader();
  const [showModal, setShowModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [submitUrl, setSubmitUrl] = useState("");
  const [errors, setErrors] = useState({});

  const handleFileChange = (e) => {
    setAttachments(e.target.files);
  };
  const handleDelete = async (deleteUrl) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      const response = await apiRequest("GET", deleteUrl, null, {
        Authorization: `Bearer ${token}`,
      });

      if (response.data?.status) {
        toast.success("Project deleted successfully");
        onDeleteSuccess(id);
      } else {
        toast.error("Failed to delete project");
      }
    } catch (error) {
      toast.error("Error deleting project");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    showLoader();
    setErrors({});
    const data = new FormData();
    data.append("remark", remarks);
    if (cancelReason) {
      data.append("cancel_reason", cancelReason);
    }
  
    for (let i = 0; i < attachments.length; i++) {
      data.append("attachments[]", attachments[i]);
    }

    try {
      const response = await apiRequest("POST", submitUrl, data, {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      });

      if (response.data?.status) {     
        toast.success(response.data.message ?? 'Success', {
          position: "top-right",
          autoClose: 3000,
        });
        window.location.reload();
     } else {
             if(response.data?.message){
               toast.error(response.data.message, {
                 position: "top-right",
                 autoClose: 3000,
               });
             }
           }
    } catch (error) {
      
      toast.error("Something went wrong!", {
        position: "top-right",
        autoClose: 3000,
      });
    }finally{
      hideLoader();
    }
  };

  return (
    <div className="option-box">
      <ul className="option-list">
        {buttons.map((button, index) => (
          <li key={index}>
            {button.type === "pay" ? (
              <button type="button" data-text={button.name} className="btn btn-light px-3 py-2" onClick={button.onClick}>
                {button.name}
              </button>
            ) : button.action === "delete" ? (
              <button onClick={() => handleDelete(button.deleteUrl)} data-text={button.name}>
                <span className={button.icon}></span>
              </button>
            ) : button.name === "Mark Complete" ? (
              <button
                type="button"
                onClick={() => {
                  setSubmitUrl(button.url);
                  setShowModal(true);
                }}
                data-text={button.name}
              >
                {button.icon ? <span className={button.icon}></span> : <p>{parse(button.name || '')}</p>}
              </button>
              
            ) : button.name === "Cancel" ? (
              <button
                type="button"
                onClick={() => {
                  setSubmitUrl(button.url);
                  setCancelModal(true);
                }}
                data-text={button.name}
              >
                {button.icon ? <span className={button.icon}></span> : <p>{parse(button.name || '')}</p>}
              </button>
              
            ) : button.name === "Accept Completion Request" ? (
              <button
                type="button"
                onClick={() => {
                  setSubmitUrl(button.url);
                  setShowAcceptModal(true);
                }}
                data-text={button.name}
              >
                {button.icon ? <span className={button.icon}></span> : <p>{parse(button.name || '')}</p>}
              </button>
              
            ) : button.url ? (
              <Link to={button.url} data-text={button.name}>
                {button.icon ? <span className={button.icon}></span> : <p>{parse(button.name || '')}</p>}
              </Link>
            ) : null}
          </li>
        ))}
      </ul>

      {/* Modal */}
      {showModal && (
        <div className="modal-backdrop1">
          <div className="modal-box1">
            <h4>Mark Project as Complete</h4>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="form-group">
                <label>Remarks</label>
                <textarea
                  className="form-control"
                  value={remarks}
                  name="remark"
                  onChange={(e) => setRemarks(e.target.value)}
                ></textarea>                
              </div>
              <div className="form-group">                
                          <label>File Attachment ( Multiple )</label>
                          <input
                            type="file"
                            name="attachments[]"
                            className="form-control"
                            onChange={handleFileChange}
                            multiple
                          />
                        
              </div>
              <div className="modal-actions mt-3">
                <button type="submit" className="btn btn-primary">Submit</button>&nbsp;
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showAcceptModal && (
        <div className="modal-backdrop1">
          <div className="modal-box1">
            <h4>Accept Project Completion Request</h4>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="form-group">
                <label>Are you sure, you want to accept ?</label>                                        
              </div>
              <div className="modal-actions mt-3">
                <button type="submit" className="btn btn-primary">Submit</button>&nbsp;
                <button type="button" className="btn btn-secondary" onClick={() => setShowAcceptModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {cancelModal && (
        <div className="modal-backdrop1">
          <div className="modal-box1">
            <h4>Are you sure, you want to cancel ?</h4>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="form-group">
                <label>Reason</label>                                        
                <textarea 
                  name="cancel_reason" 
                  className="form-control"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                ></textarea>
              </div>
              <div className="modal-actions mt-3">
                <button type="submit" className="btn btn-primary">Submit</button>&nbsp;
                <button type="button" className="btn btn-secondary" onClick={() => setCancelModal(false)}>Close</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionButton;

import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { apiRequest } from "../utils/api";
import parse from "html-react-parser";

const ProjectDetail = () => {
  const navigate = useNavigate(); // ✅ Now navigate is available

  const [description, setDescription] = useState("");
  const [hours, setHours] = useState("");
  const [rate, setRate] = useState("");
  const [attachments, setAttachments] = useState([]);
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId");

  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submit, setSubmit] = useState(false);
  const [button, setButton] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [projects, setProjects] = useState({});

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await apiRequest("GET", `/project/detail/${slug}`, null, {
        Authorization: `Bearer ${token}`,
      });
      console.log(response);
      if (response.data?.status) {
        // ✅ FIX: API returns `data: []` array, but this page expects a single project object
        setProjects(
          Array.isArray(response.data.data)
            ? response.data.data[0] || {}
            : response.data.data || {}
        );
      } else {
        toast.error("Failed to fetch projects");
      }
    } catch (error) {
      toast.error("Error loading projects");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // convert FileList to array
    setAttachments(files);
  };

  const handleProposalClick = () => {
    const token = localStorage.getItem("token");
    console.log(`token ${token}`);
    if (token) {
      const modal = new bootstrap.Modal(document.getElementById("exampleModal"));
      modal.show();
    } else {
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      navigate("/login");
    }
  };

  const handleSubmit = async (e) => {
    console.log("Calling HandleSubmit");
    e.preventDefault();
    setLoading(true);
    setButton(true);
    setErrors({});

    const formData = new FormData();
    formData.append("description", description);
    formData.append("hours", hours);
    formData.append("rate", rate);

    for (let i = 0; i < attachments.length; i++) {
      console.log(attachments[i]);
      formData.append("attachments[]", attachments[i]);
    }

    try {
      const response = await apiRequest("POST", `/apply/${projectId}`, formData, {
        Authorization: `Bearer ${token}`,
      });

      if (response.data?.status) {
        toast.success(response.data.message || "Submitted successfully", {
          position: "top-right",
          autoClose: 3000,
        });

        setSubmitted(true);

        const modalEl = document.getElementById("exampleModal");
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        modalInstance?.hide();
      } else {
        if (response.data?.message) {
          toast.error(response.data.message, {
            position: "top-right",
            autoClose: 3000,
          });
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
      setButton(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const checkApplicationStatus = async () => {
        try {
          const response = await apiRequest("GET", `/applied/${slug}`, null, {
            Authorization: `Bearer ${token}`,
          });

          if (response.data?.status && response.data?.applied) {
            setSubmitted(true); // Already applied
          }
          setSubmit(true); // Already applied
        } catch (error) {
          console.log("Check application error:", error);
        }
      };
      checkApplicationStatus();
    }, 100);
    return () => clearTimeout(timeoutId); // Clear timeout if component unmounts
  }, [slug]);

  return (
    <>
      <div className={`modal-loader ${button ? "show" : "hide"}`}></div>
      <section className="page-title style-two py-5">
        <div className="auto-container">
          <div className="row">
            <div className="col-12">
              <h1>Detail</h1>
              <nav aria-label="breadcrumb" className="breadcrumb-nav">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">Home</li>
                  <li className="breadcrumb-item">Listing</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Detail
                  </li>
                </ol>
              </nav>
            </div>
            <div className="col-md-3"></div>
            <div className="job-search-form col-md-9 d-none">
              <form method="post" action="">
                <div className="row">
                  <div className="form-group col-lg-8 col-md-12 col-sm-12">
                    <i className="bi bi-search"></i>
                    <input
                      type="text"
                      name="field_name"
                      placeholder="Search for any services"
                    />
                  </div>
                  <div className="form-group col-lg-4 col-md-12 col-sm-12 btn-box">
                    <button type="submit" className="theme-btn btn-style-one">
                      <span className="btn-title">Search</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-4">
        <div className="detail-page">
          <h2>{projects.title ?? ""}</h2>

          {projects.status && (
            <div className="mb-2">
              <strong>Status:</strong>{" "}
              <span>{projects.status}</span>
            </div>
          )}

          <div>
            {submit ? (
              submitted ? (
                <button type="button" className="button-48">
                  <span className="text">Already Applied</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="button-48"
                  onClick={() => handleProposalClick()}
                >
                  <span className="text">Submit Your Proposal</span>
                </button>
              )
            ) : (
              ""
            )}
          </div>

          <h5>Budget : ${projects.budget ?? ""}</h5>
          <hr />
          <h5>{parse(projects.description || "")}</h5>
        </div>
      </div>

      <div className="proposal bg-gredient py-3">
        <div className="container">
          <div className="col-md-4 offset-md-8 text-md-end">
            {submit ? (
              submitted ? (
                <button type="button" className="button-48">
                  <span className="text">Already Applied</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="button-48"
                  onClick={() => handleProposalClick()}
                >
                  <span className="text">Submit Your Proposal</span>
                </button>
              )
            ) : (
              ""
            )}
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Project Proposal
              </h5>
              <p>
                <small>
                  Fill out the form below to submit a project proposal. You
                  should receive a response within 48 hours.
                </small>
              </p>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12 mb-2">
                    <label>Brief Description</label>
                    <textarea
                      name="description"
                      className="form-control"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Brief description..."
                    ></textarea>
                  </div>
                  <div className="col-md-6 mb-2">
                    <label>File Attachment ( Multiple )</label>
                    <input
                      type="file"
                      name="attachments[]"
                      className="form-control"
                      multiple
                      onChange={handleFileChange}
                    />
                  </div>
                  <div className="col-md-6 mb-2">
                    <label>Total number of hours</label>
                    <input
                      type="number"
                      name="hours"
                      className="form-control w-100"
                      placeholder="No. of hours"
                      value={hours}
                      onChange={(e) => setHours(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 mb-2">
                    <label>Per hour rate</label>
                    <input
                      type="text"
                      name="rate"
                      className="form-control w-100"
                      placeholder="Per hour Rate"
                      value={rate}
                      onChange={(e) => setRate(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 mb-2">
                    <label>Total Cost</label>
                    <p>
                      {hours && rate
                        ? `$${(parseFloat(hours) * parseFloat(rate)).toFixed(2)}`
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button type="submit" className="btn btn-primary">
                  {button ? "Please wait..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <section className="subscribe-section at-home22 py-xl-0">
        <div className="auto-container py-5">
          <div
            className="outer-box d-flex wow fadeInUp animated"
            style={{ visibility: "visible", animationName: "fadeInUp" }}
          >
            <div className="sec-title">
              <h3 className="text-white">
                Join. Work. Thrive – Your Freelance Journey Starts Here!
              </h3>
              <div className="text-white">
                Unlock endless opportunities as a freelancer. Sign up today and
                start working on your own terms!
              </div>
            </div>
            <div className="form-column">
              <div className="subscribe-form">
                <form method="post" action="#">
                  <div className="form-group">
                    <div className="response"></div>
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      name="email"
                      className="email"
                      defaultValue=""
                      placeholder="Your e-mail"
                      required
                    />
                    <button
                      type="button"
                      id="subscribe-newslatters"
                      className="theme-btn btn-style-one"
                    >
                      Sign Up <i className="bi bi-arrow-up-right ms-2"></i>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProjectDetail;

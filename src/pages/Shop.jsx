import React, { useEffect, useState } from "react";
import { apiRequest } from "../utils/api";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import Pagination from "../ui/Pagination";
import parse from "html-react-parser";
import { useLoader } from "../ui/LoaderContext";

const Shop = () => {
  const { showLoader, hideLoader } = useLoader();
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const text = searchParams.get("text");

  const user_id = JSON.parse(localStorage.getItem("user_id"));
  const user = JSON.parse(localStorage.getItem(`user_${user_id}`));
  const navigate = useNavigate(); // ✅ Now navigate is available
  const [projects, setProjects] = useState([]);
  const [loader, setLoader] = useState(true);
  const [button, setButton] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(1);
  const [total, setTotal] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [category, setCategory] = useState([]);
  const token = localStorage.getItem("token");

  const [errors, setErrors] = useState({});

  const [description, setDescription] = useState("");
  const [hours, setHours] = useState("");
  const [rate, setRate] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [search, setSearch] = useState(text ?? "");
  const [entries, setEntries] = useState(10);

  useEffect(() => {    
    fetchProjects(page);    
  }, [page, slug, entries]);
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchProjects(page); // you can also reset to page 1 if needed
    }, 300);

    return () => clearTimeout(delay);
  }, [search]);
  useEffect(() => {
    fetchedCategory();
  }, []);

  const fetchProjects = async (currentPage) => {
    try {
      showLoader(); // show loader
      setLoader(true);
      const response = await apiRequest(
        "POST",
        `/filter?page=${currentPage}&user_id=${user_id}&category=${slug}&search=${search}&entries=${entries}`,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      console.log(response);
     if (response.data?.status) {
  setProjects(response.data.data);

  const currentPage = response.data.page.current_page;
  const from = response.data.page.from;
  const to = response.data.page.to;
  const total = response.data.page.total;
  const lastPage = response.data.page.last_page;

  setPage(currentPage);
  setFrom(from);
  setTo(to);
  setTotal(total);
  setLastPage(lastPage);

  setPagination({
    totalPages: lastPage,
    from: from,
    to: to,
    total: total,
    onPageChange: setPage, // ✅ safe now
  });
}
 else {
        toast.error("Failed to fetch projects");
      }
    } catch (error) {
      toast.error("Error loading projects");
    } finally {
      hideLoader();
      setLoader(false);
    }
  };

  const fetchedCategory = async () => {
    try {
      showLoader(); // show loader
      setLoader(true);
      const response = await apiRequest("GET", `/category?type=1`, null, {
        Authorization: `Bearer ${token}`,
      });
      if (response.data?.status) {
        console.log(`Fetched category ${JSON.stringify()}`);
        setCategory(response.data.data);
      } else {
        toast.error("Failed to fetch projects");
      }
    } catch (error) {
      toast.error("Error loading projects");
    } finally {
      hideLoader();
      setLoader(false);
    }
  };

  const handleFileChange = (e) => {
    setAttachments(e.target.files);
  };
  const handleProposalClick = (projectId) => {
    const token = localStorage.getItem("token");

    if (token) {
      setProjectId(projectId);
      // Open the modal
      const modal = new bootstrap.Modal(
        document.getElementById("exampleModal")
      );
      modal.show();
    } else {
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      navigate("/login");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    setErrors({});
    setButton(true);
    const formData = new FormData();
    formData.append("description", description);
    formData.append("hours", hours);
    formData.append("rate", rate);

    for (let i = 0; i < attachments.length; i++) {
      formData.append("attachments[]", attachments[i]);
    }

    try {
      const response = await apiRequest(
        "POST",
        `/apply/${projectId}`,
        formData,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (response.data?.status) {
        toast.success(response.data?.message || "Submitted successfully", {
          position: "top-right",
          autoClose: 3000,
        });


        const modalEl = document.getElementById("exampleModal");
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        modalInstance?.hide();
      }else{
        if(!response.validation_error){
          toast.error(response.data?.message || response.message || "Something went wrong.", {
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
      setLoader(false);
      setButton(false);
    }
  };
  return (
    <>
      <div className={`modal-loader ${button ? 'show' : 'hide'}`}></div>
      <section className="page-title style-two py-5">
        <div className="auto-container">
          <div className="row">
            <div className="col-12">
              <h1>Listing</h1>
              <nav aria-label="breadcrumb" className="breadcrumb-nav">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">Home</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Listing
                  </li>
                </ol>
              </nav>
            </div>
          </div>
          <div className="job-search-form col-md-6 offset-md-3 mt-3">
            <form method="post" action="">
              <div className="row">
                <div className="form-group col-md-12 col-sm-12">
                  <i className="bi bi-search"></i>
                  <input
                    type="text"
                    name="listing-search"
                    placeholder="Search here..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />

                  {/* <div className="form-group col-lg-4 col-md-12 col-sm-12 btn-box">
                  <button type="submit" className="theme-btn btn-style-one">
                    <span className="btn-title">Search</span>
                  </button>
                </div> */}
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      <div className="container-fluid position-relative">
        <div className="row">
          <div className="filters-column col-xl-3 col-lg-4 col-md-12 col-sm-12">
            <div className="inner-column mt-3 mb-3">
              <div className="filters-outer">
                <button type="button" className="theme-btn close-filters">
                  X
                </button>

                <div className="filter-block d-none">
                  <h4>Search Programming Language</h4>
                  <div className="form-group">
                    <input
                      type="text"
                      name="listing-search"
                      placeholder="Search here..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <i className="bi bi-search"></i>
                  </div>
                </div>

                <div className="filter-block">
                  <h4>Category</h4>
                  <div className="form-group">
                    <Link
                      to={`/projects`}
                      className={`btn btn-sm btn-green-out m-1 ${!slug ? 'active' : ''}`}
                    >
                      All
                    </Link>
                   
                    {category.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/projects/${cat.slug}`}
                        className={`btn btn-sm btn-green-out m-1 ${slug && slug == cat.slug ? 'active' : ''}`}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="filter-block d-none">
                  <h4>Category</h4>
                  <div className="form-group">
                    <select className="chosen-select">
                      <option>Choose a category</option>
                      <option>Web Development</option>
                      <option>Logo Design</option>
                      <option>Programming</option>
                      <option>Interior Design</option>
                      <option>Ecommerce</option>
                      <option>Digital Marketing</option>
                    </select>
                    <i className="bi bi-briefcase"></i>
                  </div>
                </div>

                <div className="filter-block d-none">
                  <h4>Tags</h4>
                  <ul className="tags-style-one list-unstyled p-0">
                    <li>
                      <Link to="/">app</Link>
                    </li>
                    <li>
                      <Link to="/">administrative</Link>
                    </li>
                    <li>
                      <Link to="/">android</Link>
                    </li>
                    <li>
                      <Link to="/">wordpress</Link>
                    </li>
                    <li>
                      <Link to="/">design</Link>
                    </li>
                    <li>
                      <Link to="/">react</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-9">
            <div className="ls-outer p-4">
              <div className="row">
                <div className="col-6">
                  <div className="showing-result">
                    <div className="text">
                      Showing{" "}
                      <strong>
                        {from}-{to}
                      </strong>{" "}
                      of <strong>{total}</strong>
                    </div>
                  </div>
                </div>               
                <div className="col-6 d-flex justify-content-end align-items-center">
                  <Link className="button-87" to={user && user.role == 'Clien'? "/user/project/create" : "/login" }>Post Project</Link>
                  <div className="sort-by">
                    <select className="chosen-select" onChange={(e) => setEntries(e.target.value)}>
                      <option value="10">Show 10</option>
                      <option value="20">Show 20</option>
                      <option value="30">Show 30</option>
                      <option value="40">Show 40</option>
                      <option value="50">Show 50</option>
                    </select>
                  </div>
                </div>

                
                

              </div>
            </div>

            <div className="row">
              {loader ? (
                <p>Loading...</p>
              ) : Array.isArray(projects) && projects.length > 0 ? (
                projects.map((project) => {
                  const applied = project.applied === true;
                  return (
                    <div
                      key={project.id}
                      className="job-block col-md-6 col-sm-12 mb-3">
                      <div className="inner-box">
                        <div className="content">
                          {/* <span className="company-logo">
                            <img
                              src={project.seller_image ? project.seller_image : "src/assets/images/1-1.png"}
                              alt="Company Logo"
                            />
                          </span> */}
                          <h4>
                            <Link to={`/apply/${project.slug}`}>{project.title}</Link>
                          </h4>
                          <h5 className="price">
                            <Link to={`/apply/${project.slug}`}>$ {project.budget}</Link>
                          </h5>
                          <ul className="job-other-info p-0 list-unstyled">
                            {/* You can customize these items based on project data */}
                            <li className="time">{project.category}</li>
                            {/* <li className="privacy">
                              Sub Category
                              </li>
                              <li className="privacy">Platform</li>
                              <li className="required">
                                Customer Requirement
                              </li> */}
                          </ul>
                          <Link
                            to={`/apply/${project.slug}?projectId=${project.id}`} // Example detail page link
                            className="button-87 ms-0"
                          >
                            View Detail
                          </Link>
                          <button
                            type="button"
                            className="button-48"
                            onClick={() =>
                              !applied && handleProposalClick(project.route_id)
                            }
                            disabled={applied}
                          >
                            <span className="text">
                            {applied
                              ? "Already Applied"
                              : "Submit Your Proposal"}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>No projects found.</p>
              )}
            </div>
              <div className="mb-4">
                {pagination && <Pagination {...pagination} />}
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
                  <div className="modal-header d-block position-relative text-center">
                    <h5 className="modal-title" id="exampleModalLabel">
                      Project Proposal
                    </h5>
                    <p className="text-white">
                      <small>
                        Fill out the form below to submit a project proposal.
                        You should receive a response within 48 hours.
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
                            accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
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
                              ? `$${(
                                parseFloat(hours) * parseFloat(rate)
                              ).toFixed(2)}`
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
                        {button ? 'Please wait...' : 'Submit'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="subscribe-section at-home22 py-xl-0">
        <div className="auto-container py-5">
          <div
            className="outer-box d-flex wow fadeInUp animated"
            style={{ visibility: "visible", animationName: "fadeInUp" }}
          >
            <img src="src/assets/images/newsletter-img-1.png" alt="" />
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
                      value=""
                      placeholder="Your e-mail"
                      required=""
                    />
                    <button
                      type="button"
                      id="subscribe-newsletters"
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

export default Shop;

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { apiRequest } from "../../utils/api";
import SummernoteEditor from '../../ui/SummernoteEditor';

const ApplicationDetails = () => {
  const { applicationId } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [content, setContent] = useState("");  // ✅ Initialize content state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    category_id: "",
    tags: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (projectId) {
      fetchApplicationData();
    }
  }, [projectId]);

  const fetchApplicationData = async () => {
    setLoading(true);
    try {
      const response = await apiRequest("GET", `/applications/details/${applicationId}`, null, {
        Authorization: `Bearer ${token}`,
      });
      if (response.data?.status) {
        const applicationData = { ...response.data.data[0] };
        setFormData(applicationData);
        setContent(applicationData.description);  
      } else {
        toast.error("Failed to fetch project data");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching project data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const url = projectId ? `/project/update/${projectId}` : "/project/create";
      const method = projectId ? "PUT" : "POST";

      const updatedData = { ...formData, description: content }; 

      const response = await apiRequest(method, url, updatedData, {
        Authorization: `Bearer ${token}`,
      });

      if (response.data?.status) {
        toast.success(response.data.message, { position: "top-right", autoClose: 3000 });
        setTimeout(() => {
          navigate('/user/project');
        }, 400);
      } else {
              if(response.data?.message){
                toast.error(response.data.message, {
                  position: "top-right",
                  autoClose: 3000,
                });
              }
            }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!", { position: "top-right", autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="user-dashboard">
      <div className="dashboard-outer">
        <div className="upper-title-box">
          <h3>{projectId ? "Edit Project" : "Post Requirement"}</h3>
          <div className="text">Ready to {projectId ? "update" : "create"} your project?</div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div className="ls-widget">
              <div className="tabs-box">
                <div className="widget-title">
                  <h4>{projectId ? "Update Project" : "Create Project"}</h4>
                </div>

                <div className="widget-content">
                  <form className="default-form" onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="form-group col-lg-6 col-md-12">
                        <label>Title</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} />
                      </div>

                      <div className="form-group col-lg-6 col-md-12">
                        <label>Category</label>
                        <select name="category_id" className="chosen-select" value={formData.category_id} onChange={handleChange}>
                          <option value="">Select Category</option>
                          <option value="1">Name</option>
                        </select>
                      </div>

                      <div className="form-group col-lg-6 col-md-12">
                        <label>Budget</label>
                        <input type="text" name="budget" value={formData.budget} onChange={handleChange} />
                      </div>

                      <div className="form-group col-lg-6 col-md-12">
                        <label>Tags</label>
                        <input type="text" name="tags" value={formData.tags} onChange={handleChange} />
                      </div>

                      <div className="form-group col-lg-12 col-md-12">
                        <label>Description</label>
                        <SummernoteEditor content={content} setContent={setContent} />
                      </div>

                      <div className="form-group col-lg-12 col-md-12">
                        <button className="theme-btn btn-style-one" disabled={loading}>
                          {loading ? "Processing..." : projectId ? "Update Project" : "Create Project"}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>                
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApplicationDetails;

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { apiRequest } from "../../utils/api";
import SummernoteEditor from '../../ui/SummernoteEditor';
import SelectDropdown from "../../ui/SelectDropdown";
import { useLoader } from "../../ui/LoaderContext";
import TagInput from "../../ui/TagInput";

const Project = () => {
  const { showLoader, hideLoader } = useLoader();
  const { projectId } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [content, setContent] = useState("");  // ✅ Initialize content state
  const [tags, setTags] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    status: "",
    budget: "",
    category_id: "",
    tags: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (projectId) {
      fetchProjectData();
    }

  }, [projectId]);
  useEffect(() => {
      const saved = localStorage.getItem("unsavedProject");
    if (saved) {
      const parsed = JSON.parse(saved);
      setFormData(parsed.formData || {});
      setTags(parsed.tags || []);
      setContent(parsed.content || "");            
    }
    

  }, []);

  const fetchProjectData = async () => {
    try {
      showLoader();
      setLoading(true);
      const response = await apiRequest("GET", `/project/edit/${projectId}`, null, {
        Authorization: `Bearer ${token}`,
      });
      if (response.data?.status) {
        const projectData = { ...response.data.data };        
        const tagsArray = projectData.tags ? projectData.tags.split(",") : [];        
        setTags(tagsArray);
        setFormData(projectData);
        setContent(projectData.description);  
      } else {
        toast.error("Failed to fetch project data");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching project data");
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  const handleChange = (e) => {
    const { name, value, classList } = e.target;
    // If it's a numeric field, allow only valid decimal numbers
    if (classList?.contains("numeric") && !/^\d*\.?\d*$/.test(value)) {
      return; // Don't update if the value is invalid
    }          
    let updatedData = { ...formData, [name]: value };

  // If the field being updated is 'name', auto-generate a slug
  if (name === "title") {
    const slug = value
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")   // Remove special chars
      .replace(/\s+/g, "-")       // Replace spaces with -
      .replace(/-+/g, "-");       // Replace multiple dashes with single
    updatedData.slug = slug;
  }

  setFormData(updatedData);
    setErrors({ ...errors, [e.target.name]: "" });
    
  };
  
  // const handleChange = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  //   setErrors({ ...errors, [e.target.name]: "" });
  // };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    showLoader();
    setErrors({});

    try {
      const url = projectId ? `/project/update/${projectId}` : "/project/create";
      const method = projectId ? "PUT" : "POST";

      const updatedData = { ...formData, description: content, tags: tags.join(",")}; 
      const response = await apiRequest(method, url, updatedData, {
        Authorization: `Bearer ${token}`,
      });

      if (response.data?.status) {
        toast.success(response.data.message, { position: "top-right", autoClose: 3000 });
        localStorage.removeItem("unsavedProject"); // ✅ clear after success
        setTimeout(() => {
          navigate('/user/project?type=my-projects');
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
      hideLoader();
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
                      <div className="form-group col-lg-12 col-md-12">
                        <label>Title</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} />
                      </div>
                      <div className="form-group col-lg-12 col-md-12">
                        <label>Slug</label>
                        <input type="text" name="slug" value={formData.slug} onChange={handleChange} />
                      </div>

                      <div className="form-group col-lg-6 col-md-12">
                        <label>Category</label>                        
                        <SelectDropdown
                          name="category_id"
                          apiEndpoint="/category"
                          selectedValue={formData.category_id || []} // Single value
                          onChange={handleChange}
                          multiple={false}
                        />
                      </div>

                      <div className="form-group col-lg-6 col-md-12">
                        <label>Budget ( USD ) ( Optional )</label>
                        <input type="text" name="budget" className="numeric" value={formData.budget} onChange={handleChange} />
                      </div>

                      <div className="form-group col-lg-6 col-md-12">
                        <label>Tags</label>                        
                        <TagInput tags={tags} setTags={setTags} placeholder="Add tags..." />      
                      </div>
                      <div className="form-group col-lg-6 col-md-12">
                        <label>Profile Status</label>
                        <SelectDropdown
                          name="status"
                          selectedValue={formData.status || "Active"}
                          onChange={handleChange}
                          multiple={false}
                          options={[
                            { value: 'Active', label: "Active" },
                            { value: 'Inactive', label: "Inactive" },
                          ]}
                        />
                      </div>
                      <div className="form-group col-lg-12 col-md-12">
                        <label>Description</label>
                        <SummernoteEditor className="description" content={content} setContent={setContent} />
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

export default Project;

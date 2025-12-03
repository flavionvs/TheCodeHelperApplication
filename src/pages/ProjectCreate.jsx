import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { apiRequest } from "../utils/api";
import SummernoteEditor from "../ui/SummernoteEditor";
import SelectDropdown from "../ui/SelectDropdown";
import { useLoader } from "../ui/LoaderContext";
import TagInput from "../ui/TagInput";

const ProjectCreate = () => {
  const { showLoader, hideLoader } = useLoader();
  const { projectId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    status: "Active",
    budget: "",
    category_id: "",
    tags: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);

  // 🧠 Load from localStorage if guest user
  useEffect(() => {
    const saved = localStorage.getItem("unsavedProject");
    if (!token && saved) {
      const parsed = JSON.parse(saved);
      setFormData(parsed.formData || {});
      setTags(parsed.tags || []);
      setContent(parsed.content || "");
    }

    if (projectId && token) {
      fetchProjectData();
    }
  }, [projectId, token]);

  // 💾 Save progress to localStorage for guest users
  useEffect(() => {
    if (!token) {
      localStorage.setItem(
        "unsavedProject",
        JSON.stringify({ formData, content, tags })
      );
    }
  }, [formData, content, tags, token]);

  const fetchProjectData = async () => {
    try {
      showLoader();
      setLoading(true);
      const response = await apiRequest(
        "GET",
        `/project/edit/${projectId}`,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );
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
    if (classList?.contains("numeric") && !/^\d*\.?\d*$/.test(value)) return;

    let updated = { ...formData, [name]: value };
    if (name === "title") {
      updated.slug = value
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
    }
    setFormData(updated);
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let tempErrors = {};

    if (!formData.title.trim()) tempErrors.title = "Title is required";
    if (!formData.slug.trim()) tempErrors.slug = "Slug is required";
    if (!formData.category_id) tempErrors.category_id = "Category is required";
    if (!content.trim()) tempErrors.description = "Description is required";

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    // 🚨 If guest user, store data and redirect
    if (!token) {
      localStorage.setItem(
        "unsavedProject",
        JSON.stringify({ formData, content, tags })
      );
      setOpen(true);
      return;
    }

    showLoader();
    setErrors({});
    try {
      const url = projectId
        ? `/project/update/${projectId}`
        : "/project/create";
      const method = projectId ? "PUT" : "POST";
      const dataToSend = {
        ...formData,
        description: content,
        tags: tags.join(","),
      };

      const response = await apiRequest(method, url, dataToSend, {
        Authorization: `Bearer ${token}`,
      });

      if (response.data?.status) {
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 3000,
        });
        localStorage.removeItem("unsavedProject"); // ✅ clear after success

        setTimeout(() => navigate("/user/project?type=my-projects"), 400);
      } else if (response.data?.message) {
        toast.error(response.data.message, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      hideLoader();
    }
  };

  return (
    <section className="user-dashboard mt-5">
      <div className="dashboard-outer">
        <div className="upper-title-box">
          <h3>{projectId ? "Edit Project" : "Post Requirement"}</h3>
          <div className="text">
            Ready to {projectId ? "update" : "create"} your project?
          </div>
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
                      <div
                        className={`form-group col-lg-12 ${
                          errors.title ? "text-danger" : ""
                        }`}
                      >
                        <label>Title</label>
                        <input
                          type="text"
                          name="title"
                          required
                          value={formData.title}
                          onChange={handleChange}
                        />
                        {errors.title && (
                          <div style={{ color: "red", fontSize: "13px" }}>
                            {errors.title}
                          </div>
                        )}
                      </div>

                      <div className="form-group col-lg-12">
                        <label>Slug</label>
                        <input
                          type="text"
                          name="slug"
                          required
                          value={formData.slug}
                          onChange={handleChange}
                        />
                        {errors.slug && (
                          <div className="text-danger small mt-1">
                            {errors.slug}
                          </div>
                        )}
                      </div>

                      <div className="form-group col-lg-6">
                        <label>Category</label>
                        <SelectDropdown
                          name="category_id"
                          apiEndpoint="/category"
                          selectedValue={formData.category_id || []}
                          onChange={handleChange}
                          multiple={false}
                          required
                        />
                        {errors.category_id && (
                          <div className="text-danger small mt-1">
                            {errors.category_id}
                          </div>
                        )}
                      </div>

                      <div className="form-group col-lg-6">
                        <label>Budget ( USD ) ( Optional )</label>
                        <input
                          type="text"
                          name="budget"
                          className="numeric"
                          value={formData.budget}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-group col-lg-6">
                        <label>Tags</label>
                        <TagInput
                          tags={tags}
                          setTags={setTags}
                          placeholder="Add tags..."
                        />
                      </div>

                      <div className="form-group col-lg-6">
                        <label>Project Status</label>
                        <SelectDropdown
                          name="status"
                          selectedValue={formData.status || "Active"}
                          onChange={handleChange}
                          multiple={false}
                          options={[
                            { value: "Active", label: "Active" },
                            { value: "Inactive", label: "Inactive" },
                          ]}
                        />
                      </div>

                      <div className="form-group col-lg-12">
                        <label>Description</label>
                        <SummernoteEditor
                          className="description"
                          required
                          content={content}
                          setContent={setContent}
                        />
                        {errors.description && (
                          <div className="text-danger small mt-1">
                            {errors.description}
                          </div>
                        )}
                      </div>

                      <div className="form-group col-lg-12">
                        <button
                          className="theme-btn btn-style-one"
                          disabled={loading}
                        >
                          {loading
                            ? "Processing..."
                            : projectId
                            ? "Update Project"
                            : "Create Project"}
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
      <div
        className={`modal fade ${open ? "show d-block" : ""}`}
        style={{ background: "rgba(0,0,0,0.5)", height: "-webkit-fill-available" }}
      >
        <div className="modal-dialog modal-lg" style={{height: "545px", display: "flex", justifyContent: "center", alignItems: "center"}}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-center">Sign in required to create a project</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setOpen(false)}
              />
            </div>

                <p className="px-3 py-2 text-center" style={{fontSize: "20px"}}>
                  To create and manage a project, you need a free account
                </p>
            <div style={{marginTop: "20px", marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "center"}}>
              <a className="button-87 call-modal" href="https://ndpelectronics.com/codehelper/web/login">I already have an account</a>
               <a className="button-87 call-modal" href="https://ndpelectronics.com/codehelper/web/register?type=Client">Create a free account</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectCreate;

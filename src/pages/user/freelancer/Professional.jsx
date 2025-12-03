import React, { useState } from "react";
import { toast } from "react-toastify";
import { apiRequest } from "../../../utils/api";
import SelectDropdown from "../../../ui/SelectDropdown";
import SummernoteEditor from "../../../ui/SummernoteEditor";
import { useLoader } from "../../../ui/LoaderContext";

const Professional = () => {
  const user_id = localStorage.getItem("user_id")
    ? JSON.parse(localStorage.getItem("user_id"))
    : null;
  const professional = localStorage.getItem(`professional_${user_id}`)
    ? JSON.parse(localStorage.getItem(`professional_${user_id}`))
    : {};    
  const [formData, setFormData] = useState({
    professional_title: professional.professional_title || "",
    experience: professional.experience || "",
    language: professional.language || [],
    timezone: professional.timezone || "",
    about: professional.about || "",
    technology_id: professional.technology_id || [],
    lang_id: professional.lang_id || [],
    programming_language_id: professional.programming_language_id || [],
    availability: professional.availability || "",
    profile_status: professional.profile_status || "",
    linkedin_link: professional.linkedin_link || "",
    portfolio_link: professional.portfolio_link || "",
    relevant_link: professional.relevant_link || "",
  });
  const { showLoader, hideLoader } = useLoader();

  const token = localStorage.getItem("token");
  const [errors, setErrors] = useState({});
  const [content, setContent] = useState(formData.about);  
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setContent(formData.about);  
    setErrors({ ...errors, [e.target.name]: "" });
  };
  const handleMultiSelectChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setContent(formData.about);  

  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    showLoader(); // show loader    
    setErrors({});

    try {
 
 const payload = {
        ...formData,
        about:content,
        
        lang_id: Array.isArray(formData.lang_id)
          ? formData.lang_id
          : [formData.lang_id],
        programming_language_id: Array.isArray(formData.programming_language_id)
          ? formData.programming_language_id
          : [formData.programming_language_id],
      };
      
      const response = await apiRequest(
        "POST",
        "/update-professional-profile",
        payload,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      if (response.data?.status) {        
        localStorage.setItem(
          `professional_${user_id}`,
          JSON.stringify(response.data?.data)
        );
        setFormData({ ...formData, password: "" });
        toast.success(response.data.message, {
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
      console.log(error);
      toast.error("Something went wrong!", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {      
      hideLoader();
    }
  };

  return (
    <section className="user-dashboard">
      <div className="dashboard-outer">
        <div className="upper-title-box">
          <h3>Professional Profile</h3>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div className="ls-widget">
              <div className="tabs-box">
                <div className="widget-content">
                  <form className="default-form pt-4" onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="segment-title">
                        <h5>Professional Details</h5>
                      </div>
                      <div className="form-group col-lg-6 col-md-12">
                        <label>Professional Title </label>
                        <input
                          type="text"
                          name="professional_title"
                          value={formData.professional_title}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group col-lg-6 col-md-12">
                        <label>Years of Experience </label>
                        <select
                          name="experience"
                          className="chosen-select"
                          value={formData.experience}
                          onChange={handleChange}
                        >
                          <option value="Select Experience">
                            Select Experience
                          </option>
                          <option value="0-1 years">0-1 years</option>
                          <option value="2-3 years">2-3 years</option>
                          <option value="4-6 years">4-6 years</option>
                          <option value="7+ years">7+ years</option>
                        </select>
                      </div>                 
                    <div className="form-group col-lg-6 col-md-12">
                        <label>Language Spoken</label>
                        <SelectDropdown
                          name="lang_id"
                          apiEndpoint="/langs"
                          selectedValue={formData.lang_id || []} // Ensure an array for multiple selection
                          onChange={handleChange}
                          multiple={true}
                        />
                      </div>
                      <div className="form-group col-lg-6 col-md-12">
                        <label>Preferable Timezone (Optional) </label>
                        <select
                          name="timezone"
                          className="chosen-select"
                          value={formData.timezone}
                          onChange={handleChange}
                        >
                          <option value="Select Timezone">
                            Select Timezone
                          </option>

                          <option value="GMT-12:00">
                            GMT-12:00 — International Date Line West
                          </option>
                          <option value="GMT-11:00">
                            GMT-11:00 — Midway Island, Samoa
                          </option>
                          <option value="GMT-10:00">GMT-10:00 — Hawaii</option>
                          <option value="GMT-09:00">GMT-09:00 — Alaska</option>
                          <option value="GMT-08:00">
                            GMT-08:00 — Pacific Time (US & Canada)
                          </option>
                          <option value="GMT-07:00">
                            GMT-07:00 — Mountain Time (US & Canada)
                          </option>
                          <option value="GMT-06:00">
                            GMT-06:00 — Central Time (US & Canada), Mexico City
                          </option>
                          <option value="GMT-05:00">
                            GMT-05:00 — Eastern Time (US & Canada), Bogota, Lima
                          </option>
                          <option value="GMT-04:00">
                            GMT-04:00 — Atlantic Time (Canada), Caracas
                          </option>
                          <option value="GMT-03:30">
                            GMT-03:30 — Newfoundland
                          </option>
                          <option value="GMT-03:00">
                            GMT-03:00 — Brazil, Buenos Aires, Georgetown
                          </option>
                          <option value="GMT-02:00">
                            GMT-02:00 — Mid-Atlantic
                          </option>
                          <option value="GMT-01:00">
                            GMT-01:00 — Azores, Cape Verde Islands
                          </option>
                          <option value="GMT+00:00">
                            GMT+00:00 — Greenwich Mean Time: Dublin, London
                          </option>
                          <option value="GMT+01:00">
                            GMT+01:00 — Amsterdam, Berlin, Rome, Paris
                          </option>
                          <option value="GMT+02:00">
                            GMT+02:00 — Athens, Bucharest, Cairo
                          </option>
                          <option value="GMT+03:00">
                            GMT+03:00 — Moscow, Nairobi, Baghdad
                          </option>
                          <option value="GMT+03:30">GMT+03:30 — Tehran</option>
                          <option value="GMT+04:00">
                            GMT+04:00 — Abu Dhabi, Baku, Muscat
                          </option>
                          <option value="GMT+04:30">GMT+04:30 — Kabul</option>
                          <option value="GMT+05:00">
                            GMT+05:00 — Islamabad, Karachi, Tashkent
                          </option>
                          <option value="GMT+05:30">
                            GMT+05:30 — India, Sri Lanka
                          </option>
                          <option value="GMT+05:45">
                            GMT+05:45 — Kathmandu
                          </option>
                          <option value="GMT+06:00">
                            GMT+06:00 — Dhaka, Astana
                          </option>
                          <option value="GMT+06:30">
                            GMT+06:30 — Yangon (Rangoon)
                          </option>
                          <option value="GMT+07:00">
                            GMT+07:00 — Bangkok, Hanoi, Jakarta
                          </option>
                          <option value="GMT+08:00">
                            GMT+08:00 — Beijing, Perth, Singapore
                          </option>
                          <option value="GMT+09:00">
                            GMT+09:00 — Tokyo, Seoul, Yakutsk
                          </option>
                          <option value="GMT+09:30">
                            GMT+09:30 — Adelaide, Darwin
                          </option>
                          <option value="GMT+10:00">
                            GMT+10:00 — Brisbane, Sydney, Guam
                          </option>
                          <option value="GMT+11:00">
                            GMT+11:00 — Magadan, Solomon Is.
                          </option>
                          <option value="GMT+12:00">
                            GMT+12:00 — Auckland, Wellington, Fiji
                          </option>
                          <option value="GMT+13:00">
                            GMT+13:00 — Tonga, Phoenix Islands
                          </option>
                          <option value="GMT+14:00">
                            GMT+14:00 — Line Islands
                          </option>
                        </select>
                      </div>
                      <div className="form-group col-lg-12 col-md-12">
                        <label>Bio / About Me</label>                        
                        <label>Description</label>
                        <SummernoteEditor className="description" content={content} setContent={setContent} />                                              
                      <small className="color-red">Do not share any personal information like Phone or Email</small>
                      </div>
                      <div className="segment-title">
                        <h5>Skill & Expertise</h5>
                      </div>
                      <div className="form-group col-lg-6 col-md-12">
                        <label>Core Technology</label>
                        <SelectDropdown
                          name="technology_id"
                          apiEndpoint="/technology"
                          selectedValue={formData.technology_id || []} // Single value
                          onChange={handleChange}
                          multiple={true}
                        />
                      </div>

                      <div className="form-group col-lg-6 col-md-12">
                        <label>Programming Languages & Technologies</label>
                        <SelectDropdown
                          name="programming_language_id"
                          apiEndpoint="/programming-language"
                          selectedValue={formData.programming_language_id || []} // Ensure an array for multiple selection
                          onChange={handleChange}
                          multiple={true}
                        />
                      </div>

                      <div className="segment-title">
                        <h5>⁠Work Preferences & Availability</h5>
                      </div>
                      <div className="form-group col-lg-6 col-md-12">
                        <label>Availability</label>
                        <SelectDropdown
                          name="availability"
                          selectedValue={formData.availability || ""}
                          onChange={handleChange}
                          multiple={false}
                          options={[
                            { value: "Available", label: "Available" },
                            { value: "Not Available", label: "Not Available" },
                          ]}
                        />
                      </div>
                
                      <div className="segment-title">
                        <h5>⁠⁠Social Media & Other Links</h5>
                      </div>
                      <div className="form-group col-lg-6 col-md-12">
                        <label>LinkedIn Profile</label>
                        <input
                          type="text"
                          name="linkedin_link"
                          value={formData.linkedin_link}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group col-lg-6 col-md-12">
                        <label>GitHub/Portfolio Website</label>
                        <input
                          type="text"
                          name="portfolio_link"
                          value={formData.portfolio_link}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group col-lg-6 col-md-12">
                        <label>Other Relevant Links</label>
                        <input
                          type="text"
                          name="relevant_link"
                          value={formData.relevant_link}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group col-lg-12 col-md-12">
                        <button className="theme-btn btn-style-one">
                          Update Profile
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

export default Professional;

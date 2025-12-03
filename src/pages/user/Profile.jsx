import React, { useState } from "react";
import { toast } from "react-toastify";
import { apiRequest } from "../../utils/api";
import { useLoader } from "../../ui/LoaderContext";

const Profile = () => {
  const { showLoader, hideLoader } = useLoader();
  const user_id = localStorage.getItem("user_id")
    ? JSON.parse(localStorage.getItem("user_id"))
    : null;
  const user = localStorage.getItem(`user_${user_id}`)
    ? JSON.parse(localStorage.getItem(`user_${user_id}`))
    : {};
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    country: user.country || "",
    image: user.image || "",
    password: "",
  });
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user.photo || null); // `user.photo` should be image URL from backend
  const [errors, setErrors] = useState({});
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    showLoader();
    setErrors({});

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("country", formData.country);
    data.append("password", formData.password);
    if (image) data.append("image", image);

    try {
      const response = await apiRequest("POST", "/update-profile", data, {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      });

      if (response.data?.status) {
        localStorage.setItem(
          `user_${user_id}`,
          JSON.stringify(response.data?.data)
        );
        setFormData({ ...formData, password: "" });
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 3000,
        });
        window.location.reload();
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
      hideLoader();
    }
  };

  return (
    <section className="user-dashboard">
      <div className="dashboard-outer">
        <div className="upper-title-box">
          <h3>My Profile</h3>
          <div className="text">Ready to jump back in?</div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div className="ls-widget">
              <div className="tabs-box">
                <div className="widget-title">
                  <h4>My Profile</h4>
                </div>

                <div className="widget-content">
                  <form className="default-form" onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="form-group col-lg-12 col-md-12">
                        <label>Profile Photo</label><br />
                        {(previewUrl || formData.image) && (

                          <img
                            src={previewUrl || formData.image}
                            alt="Preview"
                            style={{ maxWidth: "150px", borderRadius: "8px" }}
                          />
                        )}
                        <br />
                        <br />
                        <input
                          type="file"
                          name="photo"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </div>


                      <div className="form-group col-lg-6 col-md-12">
                        <label>Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-group col-lg-6 col-md-12">
                        <label>Phone</label>
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-group col-lg-6 col-md-12">
                        <label>Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-group col-lg-6 col-md-12">
                        <label>Country </label>
                        <select
                          name="country"
                          className="chosen-select"
                          value={formData.country}
                          onChange={handleChange}
                        >
                          <option value="Select Country">Select Country</option>
                          <option>Afghanistan</option>
                          <option>Albania</option>
                          <option>Algeria</option>
                          <option>Andorra</option>
                          <option>Angola</option>
                          <option>Argentina</option>
                          <option>Armenia</option>
                          <option>Australia</option>
                          <option>Austria</option>
                          <option>Azerbaijan</option>
                          <option>Bahrain</option>
                          <option>Bangladesh</option>
                          <option>Belarus</option>
                          <option>Belgium</option>
                          <option>Belize</option>
                          <option>Benin</option>
                          <option>Bhutan</option>
                          <option>Bolivia</option>
                          <option>Bosnia and Herzegovina</option>
                          <option>Botswana</option>
                          <option>Brazil</option>
                          <option>Bulgaria</option>
                          <option>Canada</option>
                          <option>China</option>
                          <option>Colombia</option>
                          <option>Croatia</option>
                          <option>Cuba</option>
                          <option>Cyprus</option>
                          <option>Czech Republic</option>
                          <option>Denmark</option>
                          <option>Egypt</option>
                          <option>Finland</option>
                          <option>France</option>
                          <option>Germany</option>
                          <option>Greece</option>
                          <option>Hong Kong</option>
                          <option>India</option>
                          <option>Indonesia</option>
                          <option>Iran</option>
                          <option>Iraq</option>
                          <option>Ireland</option>
                          <option>Italy</option>
                          <option>Japan</option>
                          <option>Kuwait</option>
                          <option>Lebanon</option>
                          <option>Malaysia</option>
                          <option>Mexico</option>
                          <option>Morocco</option>
                          <option>Netherlands</option>
                          <option>New Zealand</option>
                          <option>Nigeria</option>
                          <option>Norway</option>
                          <option>Pakistan</option>
                          <option>Philippines</option>
                          <option>Poland</option>
                          <option>Portugal</option>
                          <option>Qatar</option>
                          <option>Romania</option>
                          <option>Russia</option>
                          <option>Saudi Arabia</option>
                          <option>Singapore</option>
                          <option>South Africa</option>
                          <option>South Korea</option>
                          <option>Spain</option>
                          <option>Sweden</option>
                          <option>Switzerland</option>
                          <option>Thailand</option>
                          <option>Turkey</option>
                          <option>Ukraine</option>
                          <option>United Arab Emirates</option>
                          <option>United Kingdom</option>
                          <option>United States</option>
                          <option>Vietnam</option>
                        </select>
                      </div>

                      <div className="form-group col-lg-6 col-md-12">
                        <label>Password</label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
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

export default Profile;

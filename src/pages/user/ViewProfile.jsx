import React, { useEffect, useState } from "react";
import { useLoader } from "../../ui/LoaderContext";
import { Link, useParams } from "react-router-dom";
import { apiRequest } from "../../utils/api";
import { toast } from "react-toastify";
import '../../assets/css/ViewProfileStyle.css';

const ViewProfile = () => {
  const { showLoader, hideLoader } = useLoader();
  const { profileId } = useParams();

  const [profile, setProfile] = useState([]);
  const [loader, setLoader] = useState(true);    
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      
      showLoader();
      setLoader(true);
      const response = await apiRequest("GET", `/profile/${profileId}`, null, {
        Authorization: `Bearer ${token}`,
      });
      if (response.data?.status) {
        console.log(JSON.stringify(response.data.data));
        setProfile(response.data.data);                
      } else {
        toast.error("Failed to fetch profile");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Error loading profile");
    } finally {
      hideLoader();
      setLoader(false);
    }
  };

  return (
    <section className="job-detail-section mt-5">
    <div className="upper-box">
      <div className="auto-container">        
        <div className="job-block-seven style-three">
          <div className="inner-box">
            <div className="content">
              <span className="company-logo"><img src={profile.image} alt=""/></span>
              <h4>{profile.professional_title}</h4>
              <ul className="job-other-info">
                <li className="time">{profile.category}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="job-detail-outer">
      <div className="auto-container">
        <div className="row">
          <div className="content-column col-lg-8 col-md-12 col-sm-12 order-2">
            <div className="job-detail">
              <h4>About</h4>              
              <div dangerouslySetInnerHTML={{ __html: profile.about }} />
            </div>
            
            <div className="related-jobs d-none">
              <div className="title-box">
                <h3>3 jobs at Invision</h3>
                <div className="text">2020 jobs live - 293 added today.</div>
              </div>
              
              <div className="job-block">
                <div className="inner-box">
                  <div className="content">
                    <span className="company-logo"><img src="images/resource/company-logo/1-3.png" alt=""/></span>
                    <h4><a href="#">Senior Full Stack Engineer, Creator Success</a></h4>
                    <ul className="job-info">
                      <li><span className="icon flaticon-briefcase"></span> Segment</li>
                      <li><span className="icon flaticon-map-locator"></span> London, UK</li>
                      <li><span className="icon flaticon-clock-3"></span> 11 hours ago</li>
                      <li><span className="icon flaticon-money"></span> $35k - $45k</li>
                    </ul>
                    <ul className="job-other-info">
                      <li className="time">Full Time</li>
                      <li className="required">Urgent</li>
                    </ul>
                    <button className="bookmark-btn"><span className="flaticon-bookmark"></span></button>
                  </div>
                </div>
              </div>
              
              <div className="job-block">
                <div className="inner-box">
                  <div className="content">
                    <span className="company-logo"><img src="images/resource/company-logo/1-3.png" alt=""/></span>
                    <h4><a href="#">Web Developer</a></h4>
                    <ul className="job-info">
                      <li><span className="icon flaticon-briefcase"></span> Segment</li>
                      <li><span className="icon flaticon-map-locator"></span> London, UK</li>
                      <li><span className="icon flaticon-clock-3"></span> 11 hours ago</li>
                      <li><span className="icon flaticon-money"></span> $35k - $45k</li>
                    </ul>
                    <ul className="job-other-info">
                      <li className="time">Part Time</li>
                      <li className="required">Urgent</li>
                    </ul>
                    <button className="bookmark-btn"><span className="flaticon-bookmark"></span></button>
                  </div>
                </div>
              </div>
              
              <div className="job-block">
                <div className="inner-box">
                  <div className="content">
                    <span className="company-logo"><img src="images/resource/company-logo/1-3.png" alt=""/></span>
                    <h4><a href="#">Sr. Full Stack Engineer</a></h4>
                    <ul className="job-info">
                      <li><span className="icon flaticon-briefcase"></span> Segment</li>
                      <li><span className="icon flaticon-map-locator"></span> London, UK</li>
                      <li><span className="icon flaticon-clock-3"></span> 11 hours ago</li>
                      <li><span className="icon flaticon-money"></span> $35k - $45k</li>
                    </ul>
                    <ul className="job-other-info">
                      <li className="time">Part Time</li>
                    </ul>
                    <button className="bookmark-btn"><span className="flaticon-bookmark"></span></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="sidebar-column col-lg-4 col-md-12 col-sm-12">
            <aside className="sidebar pd-right">

              <div className="sidebar-widget company-widget">
                <div className="widget-content">
                  <ul className="company-info mt-0">


                <li>Email:<span>{profile.email}</span></li>
                <li>Phone:<span>{profile.phone}</span></li>
                <li>Country:<span>{profile.country}</span></li>
                <li>Language:<span>{profile.language}</span></li>
                <li>Availability:<span>{profile.availability}</span></li>
                <li>Experience:<span>{profile.experience}</span></li>
                <li>Timezone:<span>{profile.timezone}</span></li>
                <li>Linkedin:<span>{profile.linkedin_link}</span></li>
                <li>Portfolio:<span>{profile.portfolio_link}</span></li>
                <li>Relevant:<span>{profile.relevant_link}</span></li>
                    {/* <li>Social media:
                      <div className="social-links">
                        <a href="#"><i className="fab fa-facebook-f"></i></a>
                        <a href="#"><i className="fab fa-twitter"></i></a>
                        <a href="#"><i className="fab fa-instagram"></i></a>

                        {profile.linkedin_link ? (
                          <a to={profile.linkedin_link}><i className="fab fa-linkedin-in"></i></a>
                        ) : null}                        
                      </div>
                    </li> */}
                  </ul>
                </div>
              </div>            
            </aside>
          </div>
        </div>
      </div>
    </div>
  </section>
  );
};

export default ViewProfile;

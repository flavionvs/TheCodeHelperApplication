import React, { useEffect, useMemo, useState } from "react";

import logo from "../../assets/images/codehelper-logo-white-bg.png"; // Import the logo
import company_6 from "../../assets/images/resource/company-6.png"; // Import the logo
import { Link, useLocation } from "react-router-dom";
import { useWallet } from "../../utils/WalletContext";

const Header = () => {
  // console.log('Header');
  const location = useLocation();
  const token = localStorage.getItem('token');
  const { walletAmount, image, name } = useWallet();

    const user_id = localStorage.getItem("user_id")
    ? JSON.parse(localStorage.getItem("user_id"))
    : null;
  const user = localStorage.getItem(`user_${user_id}`)
    ? JSON.parse(localStorage.getItem(`user_${user_id}`))
    : {};
    
const [mobileOpen, setMobileOpen] = useState(false);

  const headerClass = useMemo(() => 
    location.pathname.startsWith("/user") ? "main-header header-shaddow" : "main-header", 
    [location.pathname]
  );
  
  return (
     <header className={headerClass}>     
     <div className="main-box navbar navbar-expand-lg tu-navbar sticky-top">
       <div className="nav-outer">
         <div className="logo-box">
           <div className="logo navbar-brand p-0">
            <Link to="/">
            <img src={logo} alt="" title=""/>
            </Link>
            </div>
         </div>

         <nav className="nav main-menu">
           <ul className="navigation" id="navbar">
             {/* <li className="current">
               <Link to="/"><span>Home</span></Link>
             </li>            */}
             {/* <li>
               <Link to="/"><span>About</span></Link>
             </li>           
             <li>
               <Link to="/"><span>Projects</span></Link>
             </li>           
             <li>
               <Link to="/"><span>Projects</span></Link>
             </li>            */}
             <li className="mm-add-listing">
               <Link to="/" className="theme-btn btn-style-one">Job Post</Link>
               <span>
                 <span className="contact-info">
                   <span className="phone-num"><span>Call us</span><Link to="/">123 456 7890</Link></span>
                   <span className="address">329 Queensberry Street, North Melbourne VIC <br/>3051, Australia.</span>
                   <Link to="/" className="email">support@codehelper.com</Link>
                 </span>
                 <span className="social-links">
                   <Link to="/"><span className="fab fa-facebook-f"></span></Link>
                   <Link to="/"><span className="fab fa-twitter"></span></Link>
                   <Link to="/"><span className="fab fa-instagram"></span></Link>
                   <Link to="/"><span className="fab fa-linkedin-in"></span></Link>
                 </span>
               </span>
             </li>
           </ul>
         </nav>
       </div>
      {
        location.pathname.startsWith("/user") ? 
        <div className="outer-box">
            <button className="menu-btn">              
              {/* <span className="icon la la-dollar">{walletAmount !== null ? walletAmount : 'Loading...'}</span> */}
            </button>
            <div>
              Welcome, {user.role}
            </div>
            <Link to="/projects" className="menu-btn">
              {/* <span className="icon la la-bell"></span> */}
              Explore More Project
            </Link>

           
            <div className="dropdown dashboard-option">
              <a className="dropdown-toggle" role="button" data-toggle="dropdown" aria-expanded="false">
                <img src={image ? image : company_6} alt="avatar" className="thumb"/>
                <span className="name">{name ? name : 'My Account'}</span>
              </a>
              <ul className="dropdown-menu">
                <li class="active"><Link to="/user/profile"> <i class="la la-home"></i> My Profile</Link></li>           
                <li><Link to="/user/logout" className="theme-btn btn-style-three call-modal">Logout</Link></li>                           
              </ul>
            </div>
          </div>
          :
          <div className="outer-box">
            {/* <div className="btn-box">
         <Link to="/" className="upload-cv"> Upload your CV</Link>
            </div> */}
         <div className="btn-box">          
         <Link to="/about" className="">About us</Link>
         <Link to="/contact" className="">Contact Us</Link>
         <Link to="/privacy-policy" className="">Privacy Policy</Link>
         <Link to="/terms-and-conditions" className="">Terms And Conditions</Link>
         
          {token ? (
            <>
            <Link to="/user/logout" className="button-87">Logout</Link>
            <Link to="/user/dashboard" className="button-87">{user.role} Dashboard</Link>
            </>
          ) : (
            <>
            <Link to="/login" className="button-87 call-modal">Login</Link>
            <Link to="/register?type=Freelancer" className="button-87 call-modal">I am Freelancer</Link>
            <Link to="/register?type=Client" className="button-87 call-modal">I am Client</Link>
            </>
          )}
            <Link to="/projects" className="button-48"><span class="text">Explore Projects</span></Link>
           
         </div>
       </div>
      }
      
     </div>
     

{/* ===== Replace your existing mobile header + #nav-mobile with this ===== */}
<div className="mobile-header d-lg-none">
  <div className="d-flex justify-content-between align-items-center px-3 py-2">
    <Link to="/" onClick={() => setMobileOpen(false)}>
      <img src={logo} alt="logo" title="" style={{ height: 64 }} />
    </Link>

    <div className="d-flex align-items-center">
      <div className="me-2">
        <Link to="/" className="call-modal"><span className="icon-user"></span></Link>
      </div>

      <button
        className="mobile-nav-toggler btn btn-link p-0"
        aria-label="Toggle menu"
        onClick={(e) => { e.preventDefault(); setMobileOpen(prev => !prev); }}
      >
        <i className={`bi ${mobileOpen ? "bi-x" : "bi-list"} fs-3 text-dark`}></i>
      </button>
    </div>
  </div>

  {/* Mobile drawer */}
  <div id="nav-mobile" className={`mobile-drawer ${mobileOpen ? "open" : ""}`}>
    <div className="mobile-drawer-inner">
      <ul className="mobile-nav-list">
        <li><Link to="/about" onClick={() => setMobileOpen(false)}>About Us</Link></li>
        <li><Link to="/contact" onClick={() => setMobileOpen(false)}>Contact Us</Link></li>
        <li><Link to="/projects" onClick={() => setMobileOpen(false)}>Explore Projects</Link></li>

        {token ? (
          <>
            <li><Link to="/user/dashboard" onClick={() => setMobileOpen(false)}>Dashboard</Link></li>
            <li><Link to="/user/logout" onClick={() => setMobileOpen(false)}>Logout</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/login" onClick={() => setMobileOpen(false)}>Login</Link></li>
            <li><Link to="/register?type=Freelancer" onClick={() => setMobileOpen(false)}>I am Freelancer</Link></li>
            <li><Link to="/register?type=Client" onClick={() => setMobileOpen(false)}>I am Client</Link></li>
          </>
        )}

        <li className="mt-2"><Link to="/privacy-policy" onClick={() => setMobileOpen(false)}>Privacy Policy</Link></li>
        <li><Link to="/terms-and-conditions" onClick={() => setMobileOpen(false)}>Terms & Conditions</Link></li>
      </ul>
    </div>
  </div>

  {/* minimal styles (paste inside component or global css) */}
  <style>{`
    /* Mobile drawer base */
    .mobile-drawer {
      position: fixed;
      top: 0;
      right: -100%;
      width: 80%;
      max-width: 320px;
      height: 100vh;
      background: #fff;
      box-shadow: -4px 0 18px rgba(0,0,0,0.12);
      transition: right 0.28s ease;
      z-index: 1200;
      display: flex;
      flex-direction: column;
    }
    .mobile-drawer.open { right: 0; }
    .mobile-drawer-inner { padding: 80px 20px 20px; overflow-y: auto; }
    .mobile-nav-list { list-style: none; padding: 0; margin: 0; }
    .mobile-nav-list li { padding: 14px 0; border-bottom: 1px solid #f2f2f2; }
    .mobile-nav-list li a { color: #222; text-decoration: none; font-size: 15px; display:block; }
    /* Optional backdrop */
    .mobile-drawer-backdrop {
      position: fixed; inset: 0; background: rgba(0,0,0,0.32); z-index: 1100;
    }
    /* ensure hamburger button looks neutral */
    .mobile-nav-toggler { border: 0; background: transparent;z-index: 1300;}
  `}</style>
</div>

{/* If you want a clickable backdrop to close menu, add this right after the drawer in JSX:
{mobileOpen && <div className="mobile-drawer-backdrop" onClick={() => setMobileOpen(false)}></div>}
*/}

   </header>
  );
};

export default React.memo(Header);;



import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, BrowserRouter } from "react-router-dom";

import './assets/css/bootstrap.css';
import './assets/css/style.css';
import './assets/css/responsive.css';
import './assets/css/pagination.css';
import './assets/css/custom-react-select.css';

import Home from "./pages/Home";
import Dashboard from "./pages/user/Dashboard";
import Profile from "./pages/user/Profile";
import Register from './pages/Register';
import Login from './pages/Login';
import Counter from './pages/Counter';
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { ToastContainer } from "react-toastify";
import AdminLayout from "./components/layout/AdminLayout";
import Project from "./pages/user/Project";
import ProjectList from "./pages/user/ProjectList";
import Logout from "./components/layout/Logout";
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import Freelancer from "./pages/Freelancer";
import Client from "./pages/Client";
import Contact from "./pages/Contact";
import Professional from './pages/user/freelancer/Professional';
import Application from "./pages/user/Application";
import ApplicationDetails from "./pages/user/ApplicationDetails";
import ProjectListing from './pages/ProjectListing';



const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

const PublicRoute = ({ children }) => {
  return isAuthenticated() ? <Navigate to="/" /> : children;
};

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};



const AppLayout = () => {
  
  const location = useLocation();
  const hideFooterPages = location.pathname.startsWith("/user") || location.pathname === "/login" || location.pathname === "/register";


  useEffect(() => {
    const pageWrapper = document.querySelector(".page-wrapper");

    if (pageWrapper) {
      pageWrapper.className = "page-wrapper";
      if (location.pathname.startsWith("/user")) {
        pageWrapper.classList.add("dashboard");
        pageWrapper.classList.add("mm-page");
        pageWrapper.classList.add("mm-slideout");
      // } else if (location.pathname === "/login" || location.pathname === "/register") {
      //   pageWrapper.classList.add("auth-page");
      } else {
        // pageWrapper.classList.add("");
      }
    }
  }, [location.pathname]);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/projects" element={<ProjectListing />} /> 
        <Route path="/counter" element={<Counter />} /> 
        <Route path="/about" element={<About />} /> 
        <Route path="/contact" element={<Contact />} /> 
        <Route path="/privacy-policy" element={<PrivacyPolicy />} /> 
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} /> 
        <Route path="/freelancer" element={<Freelancer />} /> 
        <Route path="/client" element={<Client />} /> 
        
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} /> 
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} /> 
        <Route path="/user" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<Dashboard />} />  {/* Default page for /dashboard */}
          <Route path="profile" element={<Profile />} />  {/* Relative path (correct way) */}
          <Route path="professional-profile" element={<Professional />} />  {/* Relative path (correct way) */}
          <Route path="project" element={<ProjectList />} />  {/* Relative path (correct way) */}
          <Route path="project/create" element={<Project />} />  {/* Relative path (correct way) */}
          <Route path="project/edit/:projectId" element={<Project />} />  {/* Relative path (correct way) */}
          <Route path="applications" element={<Application />} />  {/* Relative path (correct way) */}
          <Route path="applications/:projectId" element={<Application />} />  {/* Relative path (correct way) */}
          <Route path="logout" element={<Logout />} />  {/* Relative path (correct way) */}          
        </Route>
        

      </Routes>
      {!hideFooterPages && <Footer />}
      <ToastContainer />

    </>    
  );
};

const App = () => {
  return (
    <Router>
      <AppLayout />
    </Router>
    // <BrowserRouter>
    //   <AppLayout />
    // </BrowserRouter>
  );
};

export default App;

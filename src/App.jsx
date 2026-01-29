import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, BrowserRouter } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { NotificationProvider } from "./context/NotificationContext";

// import './assets/css/bootstrap.css';
 import './assets/css/style.css';
import './assets/css/responsive.css';
import './assets/css/pagination.css';
import './assets/css/custom-react-select.css';

import './assets/css/custom-style.css';

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
import StripePayment from "./pages/StripePayment";
import Shop from "./pages/Shop";
import ProjectDetail from "./pages/ProjectDetail";
import Chat from './pages/user/Chat';
import Payments from "./pages/user/Payments";
import OngoingProjectList from "./pages/user/OngoingProjectList";
import ScrollToTop from './ui/ScrollToTop';
import Loader from './ui/Loader';
import { LoaderProvider } from './ui/LoaderContext';
import { WalletProvider } from "./utils/WalletContext";
import ViewProfile from "./pages/user/ViewProfile";
import Account from "./pages/user/Account";
import LinkSent from "./pages/LinkSent";
import ForgotPassword from "./pages/ForgotPassword";
import ChangePassword from "./pages/ChangePassword";
import ProjectCreate from "./pages/ProjectCreate";


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_51R6XWiJKuUaFK6VWYrSUSk7kNsyJoBPUO9gvnz9yVbN6QgZePfNDK8sPZIZvZG7z6VDAAflDPbk6BS6PdPcwmASD00Kq8SygY8");

const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

const PublicRoute = ({ children }) => {
  return isAuthenticated() ? <Navigate to="/" /> : children;
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const user_id = JSON.parse(localStorage.getItem("user_id"));
  const user = JSON.parse(localStorage.getItem(`user_${user_id}`));
  if (!token) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />; // You can make a custom Unauthorized page
  }

  return children;
};




const AppLayout = () => {
  
  const location = useLocation();
  const hideFooterPages = location.pathname.startsWith("/user") || location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/link-sent";


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
      <ScrollToTop/>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/payment" element={<StripePayment />} />
        <Route path="/new-payment" element={<StripePayment />} />
        <Route path="/apply/:slug" element={<ProjectDetail />} /> 
        {/* <Route path="/projects" element={<ProjectListing />} />  */}
        <Route path="/project/create" element={<ProjectCreate />} /> 
        <Route path="/projects" element={<Shop />} /> 
        <Route path="/projects/:slug" element={<Shop />} /> 
        <Route path="/counter" element={<Counter />} /> 
        <Route path="/about" element={<About />} /> 
        <Route path="/contact" element={<Contact />} /> 
        <Route path="/privacy-policy" element={<PrivacyPolicy />} /> 
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} /> 
        <Route path="/freelancer" element={<Freelancer />} /> 
        <Route path="/client" element={<Client />} /> 
        <Route path="view-profile/:profileId" element={<ViewProfile />} />  {/* Relative path (correct way) */}

        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} /> 
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} /> 
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} /> 
        <Route path="/change-password" element={<PublicRoute><ChangePassword /></PublicRoute>} /> 
        <Route path="/link-sent" element={<PublicRoute><LinkSent /></PublicRoute>} /> 
        <Route path="/user" element={<ProtectedRoute allowedRoles={["Client", "Freelancer"]}><AdminLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<Dashboard />} />  {/* Default page for /dashboard */}
          <Route path="account" element={<Account />} />  {/* Default page for /dashboard */}
          <Route path="chat" element={<Chat />} />  {/* Default page for /dashboard */}
          <Route path="profile" element={<Profile />} />  {/* Relative path (correct way) */}
          <Route path="payments" element={<Payments />} />  {/* Relative path (correct way) */}
          <Route path="project" element={<ProjectList />} />  {/* Relative path (correct way) */}
          <Route path="ongoing-project" element={<OngoingProjectList />} />  {/* Relative path (correct way) */}          
          <Route path="logout" element={<Logout />} />  {/* Relative path (correct way) */}          
        </Route>
        <Route path="/user" element={<ProtectedRoute allowedRoles={["Freelancer"]}><AdminLayout /></ProtectedRoute>}>
          <Route path="professional-profile" element={<Professional />} />  {/* Relative path (correct way) */}
          
        </Route>
        <Route path="/user" element={<ProtectedRoute allowedRoles={["Client"]}><AdminLayout /></ProtectedRoute>}>          
          <Route path="payments" element={<Payments />} />  {/* Relative path (correct way) */}
          <Route path="project/create" element={<Project />} />  {/* Relative path (correct way) */}
          <Route path="project/edit/:projectId" element={<Project />} />  {/* Relative path (correct way) */}
          <Route path="applications" element={<Application />} />  {/* Relative path (correct way) */}
          <Route path="applications/:projectId" element={<Application />} />  {/* Relative path (correct way) */}          
        </Route>
        

      </Routes>
      
      {!hideFooterPages && <Footer />}
      <ToastContainer />
      <Loader /> {/* <- Global loader shown here */}

    </>    
  );
};

const App = () => {
  return (
  //   <Elements stripe={stripePromise}>            
  //     <LoaderProvider > 
  //     <Router>
  //     <WalletProvider>
  //       <AppLayout />
  //       </WalletProvider>
  //     </Router>      
  //     </LoaderProvider>
  // </Elements>  
    <Elements stripe={stripePromise}>  
    <LoaderProvider > {/* <- Global loader shown here */}
    <BrowserRouter>
    <NotificationProvider>
    <WalletProvider>
      <AppLayout />
    </WalletProvider>
    </NotificationProvider>
    </BrowserRouter>
    </LoaderProvider>
    </Elements>  
  );
};

export default App;

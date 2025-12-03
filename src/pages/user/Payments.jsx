// ProjectList.js
import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { apiRequest } from "../../utils/api";
import Table from '../../ui/Table';
import ActionButton from "../../ui/ActionButton";
import { useLoader } from "../../ui/LoaderContext";



const Payments = () => {
  const { showLoader, hideLoader } = useLoader();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(1);
  const [total, setTotal] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProjects(page);
  }, [page]);

  const fetchProjects = async (currentPage) => {
    try {
      showLoader();
      const response = await apiRequest("GET", `/payments?page=${currentPage}`, null, {
        Authorization: `Bearer ${token}`,
      });

      if (response.data?.status) {
        setProjects(response.data.data);
        setPage(response.data.page.current_page);
        setFrom(response.data.page.from);
        setTo(response.data.page.to);
        setTotal(response.data.page.total);
        setLastPage(response.data.page.last_page);
      } else {
        toast.error("Failed to fetch projects");
      }
    } catch (error) {
      toast.error("Error loading projects");
    } finally {
      setLoading(false);
      hideLoader();
    }
  };


  const columns = useMemo(
    () => [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "username", header: "Freelancer" },          
      { accessorKey: "project", header: "Project Name" },          
      { accessorKey: "amount", header: "Amount" },
      { accessorKey: "paymentIntentId", header: "Payment Intent Id" },          
      { accessorKey: "stripe_transfer_id", header: "Stripe Transfer Id" },          
      { accessorKey: "paymentStatus", header: "Status" },          
      { accessorKey: "created_at", header: "DateTime" },         
    ],
    []
  );

  return (
    <section className="user-dashboard">
      <div className="dashboard-outer">
        <div className="upper-title-box">
          <h3>Payment History</h3>
          <div className="text">Payment History</div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div className="ls-widget">
              <div className="widget-title">
                <h4>Payments</h4>                
              </div>
              <div className="widget-content">
                <Table columns={columns} data={projects} loading={loading} pagination={{ totalPages: lastPage,from:from,to:to,total:total, onPageChange: setPage }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Payments;

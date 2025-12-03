// ProjectList.js
import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { apiRequest } from "../../utils/api";
import Table from '../../ui/Table';
import ActionButton from "../../ui/ActionButton";



const OngoingProjectList = () => {
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
      const response = await apiRequest("GET", `/ongoing-projects?page=${currentPage}`, null, {
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
    }
  };


  const handleDeleteSuccess = (deletedId) => {
    fetchProjects(page);
  };
  const columns = useMemo(
    () => [
      {
        header: "S.N",
        cell: ({ row }) => from + row.index,  // from is coming from pagination state
      },      { accessorKey: "title", header: "Title" },
      { accessorKey: "budget", header: "Budget", cell: (info) => `$${info.getValue()}` },
      { accessorKey: "category", header: "Category" },
      { accessorKey: "application", header: "Total Application", cell: ({row}) => (<Link to={`/user/applications/${row.original.id}?title=${row.original.title}`}>{row.original.application}</Link>) },
      { accessorKey: "created_at", header: "Creation Date" },     
    ],
    []
  );

  return (
    <section className="user-dashboard">
      <div className="dashboard-outer">
        <div className="upper-title-box">
          <h3>Ongoing Projects List</h3>
          <div className="text">Manage your projects easily.</div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div className="ls-widget">
              <div className="widget-title">
                <h4>Ongoing Projects</h4>            
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

export default OngoingProjectList;

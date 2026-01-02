// Dashboard.js
import React, { useEffect, useMemo, useState } from "react";
import { useLoader } from "../../ui/LoaderContext";
import { toast } from "react-toastify";
import { apiRequest } from "../../utils/api";
import Table from "../../ui/Table";
import { Link, useLocation } from "react-router-dom";

const Dashboard = () => {
  const user_id = localStorage.getItem("user_id")
    ? JSON.parse(localStorage.getItem("user_id"))
    : null;

  const { showLoader, hideLoader } = useLoader();

  const [data, setData] = useState({});
  const [projects, setProjects] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(1);
  const [total, setTotal] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const token = localStorage.getItem("token");

  // ✅ FIX: you were using `location.search` without defining `location`
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get("type"); // not used here, but kept (as in your code)

  let user = {};
  try {
    user = JSON.parse(localStorage.getItem(`user_${user_id}`) || "{}");
  } catch (e) {
    console.error("Failed to parse user from localStorage", e);
  }

  const columnVisibility = {
    title: true,
    budget: true,
    category: true,
    application: user.role === "Client",
    created_at: user.role === "Client",
    status: true,
  };

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    try {
      showLoader();
      const response = await apiRequest("GET", `/dashboard`, null, {
        Authorization: `Bearer ${token}`,
      });

      if (response.data?.status) {
        setProjects(response.data.projects || []);
        setNotifications(response.data.notification || []);
        setData(response.data.data || {});

        // ✅ If your API ever returns pagination here, this will safely support it
        if (response.data.page) {
          setFrom(response.data.page?.from ?? 1);
          setTo(response.data.page?.to ?? 1);
          setTotal(response.data.page?.total ?? 1);
          setLastPage(response.data.page?.last_page ?? 1);
        }
      } else {
        toast.error(response.data?.message || "Failed to load dashboard.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  const columns = useMemo(
    () => [
      {
        header: "S.N",
        cell: ({ row }) => from + row.index,
      },
      { accessorKey: "title", header: "Title" },
      {
        accessorKey: "budget",
        header: "Budget",
        cell: (info) => `$${info.getValue()}`,
      },
      { accessorKey: "category", header: "Category" },
      {
        accessorKey: "application",
        header: "View Applications",
        cell: ({ row }) => (
          <Link to={`/user/applications/${row.original.id}?title=${row.original.title}`}>
            <button className="btn btn-primary btn-sm text-white">
              {row.original.application} <i className="fa fa-arrow-right"></i>
            </button>
          </Link>
        ),
      },
      { accessorKey: "created_at", header: "Creation Date" },

      // ✅ UPDATED STATUS (same approach as ProjectList)
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const raw = (row.original.status ?? "").toString().trim().toLowerCase();
          const status = raw === "canceled" ? "cancelled" : raw;

          const STATUS_META = {
            pending: { label: "Pending", className: "badge bg-primary" },
            cancelled: { label: "Cancelled", className: "badge bg-danger" },
            completed: { label: "Completed", className: "badge bg-success" },
            approved: { label: "Approved", className: "badge bg-secondary" },
            not_applied: { label: "Not Applied", className: "badge bg-dark" },

            // optional common extras
            in_progress: { label: "In Progress", className: "badge bg-info" },
            on_hold: { label: "On Hold", className: "badge bg-warning text-dark" },
            rejected: { label: "Rejected", className: "badge bg-danger" },
            draft: { label: "Draft", className: "badge bg-dark" },
          };

          const meta = STATUS_META[status] || {
            label: row.original.status ?? "Pending",
            className: "badge bg-dark",
          };

          return <span className={meta.className}>{meta.label}</span>;
        },
      },
    ],
    [from]
  );

  return (
    <section className="user-dashboard">
      <div className="dashboard-outer">
        <div className="upper-title-box">
          <h3>Hello, {user.name}</h3>
          <div className="text">Ready to jump back in?</div>
        </div>

        {user.role === "Client" ? (
          <>
            <div className="row">
              <div className="ui-block col-xl-3 col-lg-6 col-md-6 col-sm-12">
                <div className="ui-item">
                  <div className="left">
                    <i className="icon la la-briefcase"></i>
                  </div>
                  <div className="right">
                    <h4>{data.client_projects ?? 0}</h4>
                    <p>Requirements Posted</p>
                  </div>
                </div>
              </div>
              <div className="ui-block col-xl-3 col-lg-6 col-md-6 col-sm-12">
                <div className="ui-item ui-red">
                  <div className="left">
                    <i className="icon la la-file-invoice"></i>
                  </div>
                  <div className="right">
                    <h4>{data.client_project_in_progress ?? 0}</h4>
                    <p>Projects In Progress</p>
                  </div>
                </div>
              </div>
              <div className="ui-block col-xl-3 col-lg-6 col-md-6 col-sm-12">
                <div className="ui-item ui-yellow">
                  <div className="left">
                    <i className="icon la la-comment-o"></i>
                  </div>
                  <div className="right">
                    <h4>{data.client_message_count}</h4>
                    <p>Messages</p>
                  </div>
                </div>
              </div>
              <div className="ui-block col-xl-3 col-lg-6 col-md-6 col-sm-12">
                <div className="ui-item ui-green">
                  <div className="left">
                    <i className="icon la la-bookmark-o"></i>
                  </div>
                  <div className="right">
                    <h4>{data.client_project_completed ?? 0}</h4>
                    <p>Projects Completed</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="row">
              <div className="ui-block col-xl-3 col-lg-6 col-md-6 col-sm-12">
                <div className="ui-item">
                  <div className="left">
                    <i className="icon flaticon-briefcase"></i>
                  </div>
                  <div className="right">
                    <h4>{data.freelancer_applied_projects}</h4>
                    <p>Applied Projects</p>
                  </div>
                </div>
              </div>
              <div className="ui-block col-xl-3 col-lg-6 col-md-6 col-sm-12">
                <div className="ui-item ui-red">
                  <div className="left">
                    <i className="icon la la-file-invoice"></i>
                  </div>
                  <div className="right">
                    <h4>{data.freelancer_approved_projects}</h4>
                    <p>Approved Projects</p>
                  </div>
                </div>
              </div>
              <div className="ui-block col-xl-3 col-lg-6 col-md-6 col-sm-12">
                <div className="ui-item ui-yellow">
                  <div className="left">
                    <i className="icon la la-comment-o"></i>
                  </div>
                  <div className="right">
                    <h4>{data.freelancer_message_count}</h4>
                    <p>Messages</p>
                  </div>
                </div>
              </div>
              <div className="ui-block col-xl-3 col-lg-6 col-md-6 col-sm-12">
                <div className="ui-item ui-green">
                  <div className="left">
                    <i className="icon la la-bookmark-o"></i>
                  </div>
                  <div className="right">
                    <h4>0</h4>
                    <p>Approved Clients</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="upper-title-box">
          <h3>Recent Projects</h3>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div className="ls-widget">
              <div className="widget-content pt-3">
                <Table columns={columns} data={projects} loading={loading} columnVisibility={columnVisibility} />
              </div>
            </div>
          </div>

          <div className="container">
            <h2 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "20px", color: "#333" }}>
              Notifications
            </h2>

            <div
              style={{
                maxWidth: "100%",
                margin: "30px auto",
                padding: "20px",
                backgroundColor: "#fff",
                borderRadius: "10px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              }}
            >
              {notifications && notifications.length > 0 ? (
                notifications.map((n, index) => (
                  <div
                    key={index}
                    style={{
                      border: "1px solid #eee",
                      borderRadius: "8px",
                      padding: "16px",
                      marginBottom: "15px",
                      backgroundColor: "#fafafa",
                      transition: "0.3s",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f1f1f1")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fafafa")}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <h3 style={{ fontSize: "18px", fontWeight: "600", margin: 0, color: "#222" }}>
                        {n.title || "No Title"}
                      </h3>
                      <span style={{ fontSize: "13px", color: "#888" }}>
                        {new Date(n.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p style={{ marginTop: "8px", fontSize: "15px", color: "#555", lineHeight: "1.6" }}>
                      {n.message || "No message provided."}
                    </p>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: "center", color: "#777", fontSize: "15px", marginTop: "30px" }}>
                  No notifications found.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;

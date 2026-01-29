// Dashboard.js
import React, { useEffect, useMemo, useState } from "react";
import { useLoader } from "../../ui/LoaderContext";
import { toast } from "react-toastify";
import { apiRequest } from "../../utils/api";
import Table from "../../ui/Table";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useNotifications } from "../../context/NotificationContext";

const Dashboard = () => {
  const user_id = localStorage.getItem("user_id")
    ? JSON.parse(localStorage.getItem("user_id"))
    : null;

  const { showLoader, hideLoader } = useLoader();
  const navigate = useNavigate();
  const { setNotificationsFromDashboard, markAsRead, markAllAsRead, unreadCount } = useNotifications();

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
        
        // Update notification context with dashboard data
        setNotificationsFromDashboard(
          response.data.notification || [], 
          response.data.unread_count || 0
        );

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

  // Helper function to get notification type color
  const getNotificationTypeColor = (type) => {
    const colors = {
      'completed': '#28a745',
      'completion': '#28a745',
      'approved': '#007bff',
      'application': '#17a2b8',
      'project': '#007bff',
      'payment': '#28a745',
      'cancelled': '#dc3545',
      'rejected': '#dc3545',
      'message': '#6c757d',
    };
    return colors[type?.toLowerCase()] || '#6c757d';
  };

  // Helper function to determine the link for a notification
  const getNotificationLink = (notification, user) => {
    // If notification has a direct link, use it
    if (notification.link) {
      // Convert relative links to proper user routes
      if (notification.link.startsWith('/dashboard')) {
        return notification.link.replace('/dashboard', '/user/dashboard');
      }
      return notification.link;
    }

    // Otherwise, determine link based on notification type and reference_id
    const type = notification.type?.toLowerCase();
    const refId = notification.reference_id;
    
    if (!type) return null;

    // Determine route based on notification type and user role
    switch (type) {
      case 'application':
        // Client: go to applications list, Freelancer: go to applied projects
        if (user.role === 'Client' && refId) {
          return `/user/applications/${refId}`;
        }
        return '/user/project?type=applied';
        
      case 'approved':
      case 'payment':
        // Go to ongoing projects
        return '/user/project?type=ongoing';
        
      case 'completion':
      case 'completed':
        // Go to completed projects
        return '/user/project?type=completed';
        
      case 'project':
        // Go to project list
        if (user.role === 'Client') {
          return '/user/project?type=my-projects';
        }
        return '/user/project?type=applied';
        
      case 'cancelled':
      case 'rejected':
        return '/user/project?type=cancelled';
        
      case 'message':
        return '/user/chat';
        
      default:
        return null;
    }
  };

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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: "22px", fontWeight: "600", color: "#333", margin: 0 }}>
                Notifications
                {unreadCount > 0 && (
                  <span 
                    style={{
                      backgroundColor: '#dc3545',
                      color: '#fff',
                      borderRadius: '50%',
                      padding: '2px 10px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      marginLeft: '10px'
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </h2>
              {unreadCount > 0 && (
                <button
                  onClick={async () => {
                    await markAllAsRead();
                    // Update local state to mark all as read
                    setNotifications(prev => 
                      prev.map(n => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
                    );
                  }}
                  style={{
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Mark All as Read
                </button>
              )}
            </div>

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
                notifications.map((n, index) => {
                  const isUnread = !n.read_at;
                  const notificationLink = getNotificationLink(n, user);
                  
                  return (
                    <div
                      key={n.id || index}
                      style={{
                        border: isUnread ? "2px solid #007bff" : "1px solid #eee",
                        borderRadius: "8px",
                        padding: "16px",
                        marginBottom: "15px",
                        backgroundColor: isUnread ? "#f0f7ff" : "#fafafa",
                        transition: "0.3s",
                        cursor: notificationLink ? "pointer" : "default",
                        position: 'relative'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = isUnread ? "#e6f2ff" : "#f1f1f1")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = isUnread ? "#f0f7ff" : "#fafafa")}
                      onClick={async () => {
                        // Mark as read if unread
                        if (isUnread && n.id) {
                          await markAsRead(n.id);
                          // Update local state
                          setNotifications(prev => 
                            prev.map(notif => 
                              notif.id === n.id 
                                ? { ...notif, read_at: new Date().toISOString() }
                                : notif
                            )
                          );
                        }
                        // Navigate if link exists
                        if (notificationLink) {
                          navigate(notificationLink);
                        }
                      }}
                    >
                      {isUnread && (
                        <span 
                          style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            width: '10px',
                            height: '10px',
                            backgroundColor: '#007bff',
                            borderRadius: '50%'
                          }}
                        />
                      )}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h3 style={{ fontSize: "18px", fontWeight: isUnread ? "700" : "600", margin: 0, color: "#222" }}>
                          {n.title || "No Title"}
                          {notificationLink && (
                            <span style={{ fontSize: "12px", marginLeft: "10px", color: "#007bff" }}>
                              <i className="fa fa-external-link-alt"></i>
                            </span>
                          )}
                        </h3>
                        <span style={{ fontSize: "13px", color: "#888" }}>
                          {new Date(n.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p style={{ marginTop: "8px", fontSize: "15px", color: "#555", lineHeight: "1.6" }}>
                        {n.message || "No message provided."}
                      </p>
                      {n.type && (
                        <span 
                          style={{ 
                            fontSize: "11px", 
                            padding: "2px 8px", 
                            borderRadius: "4px", 
                            backgroundColor: getNotificationTypeColor(n.type),
                            color: '#fff',
                            marginTop: '8px',
                            display: 'inline-block'
                          }}
                        >
                          {n.type.charAt(0).toUpperCase() + n.type.slice(1).replace('_', ' ')}
                        </span>
                      )}
                    </div>
                  );
                })
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

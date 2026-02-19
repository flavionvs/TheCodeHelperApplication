import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { apiRequest } from "../../utils/api";
import Table from "../../ui/Table";
import ActionButton from "../../ui/ActionButton";

const Application = () => {
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const title = decodeURIComponent(searchParams.get("title"));
  const navigate = useNavigate();

  const [desc, setDesc] = useState("");

  const [loading, setLoading] = useState(true);
  const [button, setButton] = useState(false);
  const [page, setPage] = useState(1);
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(1);
  const [total, setTotal] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const token = localStorage.getItem("token");

  const [projects, setProjects] = useState([]);

  // ✅ helper: accept only positive ints (blocks "0" + null + undefined)
  const toPositiveInt = (v) => {
    const n = Number(v);
    return Number.isInteger(n) && n > 0 ? n : 0;
  };

  // ✅ helper: get Application primary key (id)
  const getAppPk = (app) => toPositiveInt(app?.id);

  useEffect(() => {
    fetchProjects(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchProjects = async (currentPage) => {
    try {
      const response = await apiRequest(
        "GET",
        `/applications/${projectId}?page=${currentPage}`,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

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

  const columns = useMemo(
    () => [
      {
        header: "S.N",
        cell: ({ row }) => from + row.index,
      },
      { accessorKey: "username", header: "User" },
      { accessorKey: "hours", header: "Hours" },
      { accessorKey: "rate", header: "Rate" },
      { accessorKey: "total_amount", header: "Budget" },
      {
        accessorKey: "attachment",
        header: "Attachments",
        cell: ({ row }) => {
          const attachments = row.original.attachments;

          if (!Array.isArray(attachments) || attachments.length === 0) {
            return "No Attachments";
          }

          return (
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {attachments.map((url, index) => (
                <a
                  key={index}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#007bff", textDecoration: "underline" }}
                >
                  Attachment {index + 1}
                </a>
              ))}
            </div>
          );
        },
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => {
          const description = row.original.description;
          return description ? (
            <div
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => {
                setDesc(description);
                setTimeout(() => {
                  const modal = new bootstrap.Modal(
                    document.getElementById("viewDescriptionModal")
                  );
                  modal.show();
                }, 100);
              }}
            >
              View Description
            </div>
          ) : null;
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const app = row.original;
          return (
            <div>
              <span>{app.status}</span>
              {app.status === "Pending" && app.stripe_connected === false && (
                <div
                  style={{
                    fontSize: "11px",
                    color: "#dc3545",
                    marginTop: "4px",
                    fontWeight: 600,
                  }}
                  title="This freelancer has not connected their Stripe account for payouts"
                >
                  ⚠ Stripe not connected
                </div>
              )}
            </div>
          );
        },
      },
      { accessorKey: "date_and_time", header: "DateTime" },
      {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const app = row.original;

          // ✅ Get application primary key
          const appPk = getAppPk(app);

          const buttons = [
            {
              id: appPk || app?.id, // just for ActionButton internal key
              name: "View&nbsp;Details",
              url: `/view-profile/${app.user_id}`,
            },
            app.status != "Pending" &&
              app.status != "Cancelled" && {
                id: appPk || app?.id,
                name: "Chat",
                type: "pay",
                onClick: () => {
                  const chatUserId = app.user_id;
                  navigate(`/user/chat?user_id=${chatUserId}`);
                },
              },
            app.status == "Pending" && {
              id: appPk || app?.id,
              name: "Approve",
              type: "pay",
              onClick: async () => {
                // ✅ HARD BLOCK if API did not return id
                if (!appPk) {
                  toast.error(
                    "Application ID missing. Please refresh the page."
                  );
                  return;
                }

                if (button) return; // prevent double-click
                setButton(true);

                try {
                  toast.info("Redirecting to payment page...", { autoClose: 3000 });

                  const response = await apiRequest(
                    "POST",
                    "/create-checkout-session",
                    { applicationId: appPk },
                    { Authorization: `Bearer ${token}` }
                  );

                  if (response.data?.status && response.data?.checkout_url) {
                    // Redirect to Stripe Checkout
                    window.location.href = response.data.checkout_url;
                  } else {
                    toast.error(
                      response.data?.message || "Failed to create payment session. Please try again."
                    );
                    setButton(false);
                  }
                } catch (err) {
                  toast.error(
                    err?.response?.data?.message || "Failed to create payment session."
                  );
                  setButton(false);
                }
              },
            },
            app.status !== "Pending" &&
              app.status !== "Cancelled" &&
              app.status !== "Completed" && {
                id: appPk || app?.id,
                name: "Cancel",

                url: `/application/cancel/${app.id}`,
              },
          ];

          return (
            <ActionButton
              id={appPk || app?.id}
              buttons={buttons}
              onDeleteSuccess={() => {}}
            />
          );
        },
      },
    ],
    [from, navigate]
  );

  // Show toast if redirected back from cancelled payment
  useEffect(() => {
    const paymentParam = searchParams.get("payment");
    if (paymentParam === "cancelled") {
      toast.info("Payment was cancelled. You can try again by clicking Approve.", { autoClose: 5000 });
    }
  }, [searchParams]);

  return (
    <>
      <div className={`modal-loader ${button ? "show" : "hide"}`}></div>
      <section className="user-dashboard">
        <div className="dashboard-outer">
          <div className="upper-title-box">
            <h3>{title !== "null" ? title : "Applications"}</h3>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="ls-widget">
                <div className="widget-title">
                  <h4>Applications</h4>
                </div>
                <div className="widget-content">
                  <Table
                    columns={columns}
                    data={projects}
                    loading={loading}
                    pagination={{
                      totalPages: lastPage,
                      from: from,
                      to: to,
                      total: total,
                      onPageChange: setPage,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description Modal */}
        <div
          className="modal fade"
          id="viewDescriptionModal"
          tabIndex="-1"
          aria-labelledby="viewDescriptionModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="viewDescriptionModalLabel">
                  Description
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p>{desc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Application;

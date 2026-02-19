import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { apiRequest } from "../../utils/api";
import Table from "../../ui/Table";
import ActionButton from "../../ui/ActionButton";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Application = () => {
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const title = decodeURIComponent(searchParams.get("title"));
  const navigate = useNavigate();

  const [desc, setDesc] = useState("");

  // ✅ store selected application for the confirmation modal
  const [selectedApp, setSelectedApp] = useState(null);
  const [projectAmount, setProjectAmount] = useState({});
  // ✅ Stripe embedded checkout state
  const [checkoutClientSecret, setCheckoutClientSecret] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);

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
              onClick: () => {
                // ✅ HARD BLOCK if API did not return id
                if (!appPk) {
                  toast.error(
                    "Application ID missing. Please refresh the page."
                  );
                  return;
                }

                // ✅ Store selected application for the modal
                setSelectedApp(app);

                const amountData = {
                  amount: app.amount ?? app.total_amount ?? 0,
                  admin_commission: app.admin_commission,
                  admin_amount: app.admin_amount,
                  stripe_commission: app.stripe_commission,
                  stripe_amount: app.stripe_amount,
                  stripe_fee: app.stripe_fee,
                  total_amount: app.total_amount ?? app.amount ?? 0,
                };
                setProjectAmount(amountData);

                // Show confirmation modal
                setTimeout(() => {
                  const modal = new bootstrap.Modal(
                    document.getElementById("approveModal")
                  );
                  modal.show();
                }, 100);
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

  // ✅ Proceed to Stripe Embedded Checkout after user confirms fees
  const handleProceedToPayment = async () => {
    const appPk = getAppPk(selectedApp);
    if (!appPk) {
      toast.error("Application ID missing. Please click Approve again.");
      return;
    }

    if (button) return;
    setButton(true);

    try {
      const response = await apiRequest(
        "POST",
        "/create-checkout-session",
        { applicationId: appPk },
        { Authorization: `Bearer ${token}` }
      );

      if (response.data?.status && response.data?.clientSecret) {
        // Switch modal view from fee breakdown to Stripe checkout
        setCheckoutClientSecret(response.data.clientSecret);
        setShowCheckout(true);
        setButton(false);
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
  };

  // ✅ Called when Stripe Embedded Checkout completes
  const handleCheckoutComplete = useCallback(() => {
    // Close the modal
    const modalElement = document.getElementById("approveModal");
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance?.hide();

    // Reset checkout state
    setCheckoutClientSecret(null);
    setShowCheckout(false);
    setSelectedApp(null);
    setProjectAmount({});

    toast.success("Payment Successful! The application has been approved.", {
      position: "top-right",
      autoClose: 4000,
    });

    // Refresh the applications table to show updated status
    setTimeout(() => {
      fetchProjects(page);
    }, 1500);
  }, [page]);

  // ✅ Reset checkout state when modal is closed
  useEffect(() => {
    const modalElement = document.getElementById("approveModal");
    if (!modalElement) return;

    const handleModalHidden = () => {
      setCheckoutClientSecret(null);
      setShowCheckout(false);
      setButton(false);
    };

    modalElement.addEventListener("hidden.bs.modal", handleModalHidden);
    return () => {
      modalElement.removeEventListener("hidden.bs.modal", handleModalHidden);
    };
  }, []);

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

        {/* Approve Proposal Modal */}
        <div
          className="modal fade"
          id="approveModal"
          tabIndex="-1"
          aria-labelledby="approveModalLabel"
          aria-hidden="true"
          data-bs-backdrop="static"
        >
          <div className="modal-dialog" style={showCheckout ? { maxWidth: "600px" } : {}}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="approveModalLabel">
                  {showCheckout ? "Complete Payment" : "Approve Proposal"}
                </h5>
                {!showCheckout && (
                  <p>
                    <small>
                      Fill out the form below to submit a project proposal. You
                      should receive a response within 48 hours.
                    </small>
                  </p>
                )}
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>

              <div className="modal-body">
                {!showCheckout ? (
                  <>
                    <ul>
                      <li>Price : ${projectAmount.amount}</li>
                      <li>
                        Code helper commission : ${projectAmount.admin_amount} (
                        {projectAmount.admin_commission} %)
                      </li>
                      <li>
                        Payment commission : ${projectAmount.stripe_amount} (
                        {projectAmount.stripe_commission} %)
                      </li>
                      <li>Payment Fee : ${projectAmount.stripe_fee}</li>
                    </ul>

                    <button
                      type="button"
                      disabled={button}
                      onClick={handleProceedToPayment}
                      style={{
                        width: "100%",
                        padding: "12px",
                        backgroundColor: "#6772e5",
                        color: "#fff",
                        fontWeight: "bold",
                        border: "none",
                        borderRadius: "8px",
                        cursor: button ? "not-allowed" : "pointer",
                        transition: "background-color 0.3s",
                        opacity: button ? 0.7 : 1,
                      }}
                    >
                      {button ? "Loading..." : `Pay $${projectAmount.total_amount}`}
                    </button>
                  </>
                ) : (
                  <div id="checkout-container" style={{ minHeight: "400px" }}>
                    {checkoutClientSecret && (
                      <EmbeddedCheckoutProvider
                        stripe={stripePromise}
                        options={{
                          clientSecret: checkoutClientSecret,
                          onComplete: handleCheckoutComplete,
                        }}
                      >
                        <EmbeddedCheckout />
                      </EmbeddedCheckoutProvider>
                    )}
                  </div>
                )}
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

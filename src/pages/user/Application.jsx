import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { apiRequest } from "../../utils/api";
import Table from "../../ui/Table";
import ActionButton from "../../ui/ActionButton";

import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const Application = () => {
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const title = decodeURIComponent(searchParams.get("title"));
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();

  const [desc, setDesc] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // ✅ store selected application row (avoid state timing issues)
  const [selectedApp, setSelectedApp] = useState(null);

  // ✅ store selected application id (MUST be applications.my_row_id now)
  const [selectedAppId, setSelectedAppId] = useState(0);

  const [projectAmount, setProjectAmount] = useState({});
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

  // ✅ helper: correct Application identifier is my_row_id (NOT id)
  const getAppPk = (app) => toPositiveInt(app?.my_row_id);

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
      { accessorKey: "status", header: "Status" },
      { accessorKey: "date_and_time", header: "DateTime" },
      {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const app = row.original;

          // ✅ IMPORTANT: application primary key is my_row_id (backend must include it in API response)
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
                // ✅ HARD BLOCK if API did not return my_row_id
                if (!appPk) {
                  toast.error(
                    "Application ID missing (my_row_id). Please refresh. If it persists, backend must include my_row_id."
                  );
                  return;
                }

                // ✅ store id FIRST + persist (prevents missing id on submit)
                setSelectedAppId(appPk);
                localStorage.setItem("selected_application_id", String(appPk));

                // ✅ store full row for UI
                setSelectedApp(app);

                // ✅ use reliable fields (prefer total_amount)
                setProjectAmount({
                  amount: app.amount ?? app.total_amount ?? 0,
                  admin_commission: app.admin_commission,
                  admin_amount: app.admin_amount,
                  stripe_commission: app.stripe_commission,
                  stripe_amount: app.stripe_amount,
                  stripe_fee: app.stripe_fee,
                  total_amount: app.total_amount ?? app.amount ?? 0,
                });

                setTimeout(() => {
                  const modal = new bootstrap.Modal(
                    document.getElementById("exampleModal")
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
                // NOTE: if cancel endpoint expects legacy id, this may need backend alignment too.
                // Keeping as original for now to avoid breaking. If cancel fails, update backend to accept my_row_id.
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    setButton(true);
    setError(null);
    setSuccess(false);

    if (!stripe || !elements) {
      toast.error("Stripe is not ready yet. Please try again.");
      setButton(false);
      return;
    }

    // ✅ CRITICAL: use my_row_id everywhere, and NEVER accept 0
    const appId =
      toPositiveInt(selectedApp?.my_row_id) ||
      toPositiveInt(selectedAppId) ||
      toPositiveInt(localStorage.getItem("selected_application_id"));

    if (!appId) {
      toast.error("Application ID missing. Please click Approve again.");
      setButton(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (pmError) {
      setError(pmError.message);
      setSuccess(false);
      setButton(false);
      return;
    }

    try {
      console.log("PAYMENT DEBUG appId =", appId);

      // ✅ backend calculates amount from Application (recommended)
      const updatedData = {
        paymentMethod: paymentMethod.id,
        applicationId: appId, // ✅ this is my_row_id now
      };

      const response = await apiRequest("POST", "/payment", updatedData, {
        Authorization: `Bearer ${token}`,
      });

      console.log("Payment response:", response);

      if (response.data?.status) {
        // ✅ Webhook should finalize DB status.
        // This legacy endpoint may be removed later, but keeping it for compatibility if your flow relies on it.
        const paymentIntent = response.data.paymentIntent;

        const applicationData = {
          applicationId: appId, // ✅ my_row_id
          amount: paymentIntent.amount,
          paymentIntentId: paymentIntent.id,
          paymentStatus: paymentIntent.status,
          paymentDetails: paymentIntent,
        };

        console.log("Application data:", applicationData);

        const res = await apiRequest(
          "POST",
          "/update-application-status",
          applicationData,
          {
            Authorization: `Bearer ${token}`,
          }
        );

        console.log("Update response:", res);

        if (res.data?.status) {
          const modalElement = document.getElementById("exampleModal");
          const modalInstance = bootstrap.Modal.getInstance(modalElement);
          modalInstance?.hide();

          toast.success("Payment Successful!", {
            position: "top-right",
            autoClose: 3000,
          });

          setTimeout(() => {
            window.location.reload();
          }, 1000);

          setSuccess(true);
          setError(null);
        } else {
          setSuccess(false);
          setError(res.data.message);
          toast.error(res.data.message || "Failed to update application status", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      } else {
        if (response.data?.message) {
          toast.error(response.data.message, {
            position: "top-right",
            autoClose: 3000,
          });
        } else {
          toast.error("Payment failed.", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      }
    } catch (err) {
      const message =
        err?.response?.data?.message || err.message || "Something went wrong";
      setError(message);
      setSuccess(false);
    } finally {
      setButton(false);
    }
  };

  const cardStyle = {
    style: {
      base: {
        fontSize: "16px",
        color: "#32325d",
        "::placeholder": {
          color: "#a0aec0",
        },
        padding: "12px 16px",
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

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

        {/* Modal */}
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Approve Proposal
                  </h5>
                  <p>
                    <small>
                      Fill out the form below to submit a project proposal. You
                      should receive a response within 48 hours.
                    </small>
                  </p>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>

                <div className="modal-body">
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

                  <div
                    style={{
                      marginBottom: "20px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      padding: "12px",
                    }}
                  >
                    <CardElement options={cardStyle} />
                  </div>

                  <button
                    type="submit"
                    disabled={!stripe || button}
                    data-text="Pay"
                    style={{
                      width: "100%",
                      padding: "12px",
                      backgroundColor: "#6772e5",
                      color: "#fff",
                      fontWeight: "bold",
                      border: "none",
                      borderRadius: "8px",
                      cursor: !stripe || button ? "not-allowed" : "pointer",
                      transition: "background-color 0.3s",
                      opacity: button ? 0.7 : 1,
                    }}
                  >
                    {button ? "Paying.." : `Pay $${projectAmount.total_amount}`}
                  </button>
                </div>
              </form>
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

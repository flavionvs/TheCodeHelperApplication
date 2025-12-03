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
  const [desc, setDesc] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [amount, setAmount] = useState("1000");
  const [applicationId, setApplicationId] = useState(null); // ✅ Store selected application ID

  const [projects, setProjects] = useState([]);
  const [projectAmount, setProjectAmount] = useState({});
  const [loading, setLoading] = useState(true);
  const [button, setButton] = useState(false);
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
        cell: ({ row }) => from + row.index,  // from is coming from pagination state
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
          return (
            (description ? (<div style={{ color:"blue",cursor:"pointer" }} onClick={() => {setDesc(description);  setTimeout(() => {
                    const modal = new bootstrap.Modal(
                      document.getElementById("viewDescriptionModal")
                    );
                    modal.show();
                  }, 100); }}>
             View Description
            </div>) : null)
          );
        },
      },
      
      { accessorKey: "status", header: "Status" },
      { accessorKey: "date_and_time", header: "DateTime" },
      {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const buttons = [
            {
              id: row.original.id,
              name: "View&nbsp;Details",
              url: `/view-profile/${row.original.user_id}`,
            },(row.original.status != 'Pending' && row.original.status != 'Cancelled') && {
              id: row.original.id,
              name: "Chat",
              type: 'pay',
              onClick: () => {
                  const chatUserId = row.original.user_id;
                  navigate(`/user/chat?user_id=${chatUserId}`);               
              }
            },
            row.original.status == 'Pending' && {
              id: row.original.id,
              name: 'Approve',
              type: 'pay',
              onClick: () => {                
                  const selectedId = row.original.id;
                  setApplicationId(selectedId);                
                  setAmount(row.original.amount);
                  setProjectAmount(
                    {
                      'amount':row.original.amount,
                      'admin_commission':row.original.admin_commission,
                      'admin_amount':row.original.admin_amount,
                      'stripe_commission':row.original.stripe_commission,
                      'stripe_amount':row.original.stripe_amount,
                      'stripe_fee':row.original.stripe_fee,
                      'total_amount':row.original.total_amount,
                    }
                  );
                  setTimeout(() => {
                    const modal = new bootstrap.Modal(
                      document.getElementById("exampleModal")
                    );
                    modal.show();
                  }, 100);               
              }
            },row.original.status !== 'Pending' && row.original.status !== 'Cancelled' && row.original.status !== 'Completed' && {
              id: row.original.id,
              name: 'Cancel',
              url: `/application/cancel/${row.original.id}`,              
            }
            
          ];

          return (
            <ActionButton
              id={row.original.id}
              buttons={buttons}
              onDeleteSuccess={() => {}}
            />
          );
        },
      },
    ],
    []
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButton(true);    
    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      setError(error.message);
      setSuccess(false);
      setButton(false);
    } else {
      try {
        console.log("Submitting payment for Application ID:", applicationId); // Log the application ID

        const updatedData = {
          paymentMethod: paymentMethod.id,
          amount: projectAmount.total_amount,
          applicationId: applicationId, 
        };

        const response = await apiRequest("post", "/payment", updatedData, {
          Authorization: `Bearer ${token}`,
        });
        console.log('Payment response:', response);

        if (response.data?.status) {
          const paymentIntent = response.data.paymentIntent;
        
          const applicationData = {
            applicationId: applicationId,
            amount: paymentIntent.amount,
            paymentIntentId: paymentIntent.id,
            paymentStatus: paymentIntent.status,
            paymentDetails: paymentIntent,
          };
        
          console.log("Application data:", applicationData);
        
          const res = await apiRequest("post", "/update-application-status", applicationData, {
            Authorization: `Bearer ${token}`,
          });
        
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
            toast.success(res.data.message, {
              position: "top-right",
              autoClose: 3000,
            });
          }
        } else {
                if(response.data?.message){
                  toast.error(response.data.message, {
                    position: "top-right",
                    autoClose: 3000,
                  });
                }
              }
        
      }catch (err) {
        const message =
          err?.response?.data?.message || err.message || "Something went wrong";
        setError(message);
        setSuccess(false);
      }finally{
        setButton(false);
      }
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
    <div className={`modal-loader ${button ? 'show' : 'hide'}`}></div>    
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
      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Approve Proposal</h5>
                <p>
                  <small>
                    Fill out the form below to submit a project proposal. You
                    should receive a response within 48 hours.
                  </small>
                </p>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>

              <div className="modal-body">              
                  <ul>
                    <li>Price  : ${projectAmount.amount}</li>                    
                    <li>Code helper commission  : ${projectAmount.admin_amount} ({projectAmount.admin_commission} %)</li>                    
                    <li>Payment commission  : ${projectAmount.stripe_amount} ({projectAmount.stripe_commission} %)</li>                    
                    <li>Payment Fee  : ${projectAmount.stripe_fee}</li>                                       
                  </ul>
                {/* No need for hidden field for applicationId */}
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
                  disabled={!stripe}
                  data-text="Pay"
                  style={{
                    width: "100%",
                    padding: "12px",
                    backgroundColor: "#6772e5",
                    color: "#fff",
                    fontWeight: "bold",
                    border: "none",
                    borderRadius: "8px",
                    cursor: stripe ? "pointer" : "not-allowed",
                    transition: "background-color 0.3s",
                  }}
                >
                  {button ? 'Paying..' : `Pay $${projectAmount.total_amount}`}
                </button>                
              </div>             
            </form>
          </div>
        </div>
      </div>
      {/* Modal */}
      <div className="modal fade" id="viewDescriptionModal" tabIndex="-1" aria-labelledby="viewDescriptionModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            
              <div className="modal-header">
                <h5 className="modal-title" id="viewDescriptionModalLabel">Description</h5>               
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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

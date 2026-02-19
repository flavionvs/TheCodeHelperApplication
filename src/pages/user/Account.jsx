import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { apiRequest } from "../../utils/api";
import { useLoader } from "../../ui/LoaderContext";

const Account = () => {
  const [button, setButton] = useState(false);
  const { showLoader, hideLoader } = useLoader();
  const [data, setData] = useState("");
  const [availabelBalance, setAvailabelBalance] = useState(0);
  const [pendingBalance, setPendingBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("user_id")
    ? JSON.parse(localStorage.getItem("user_id"))
    : null;
  const user = localStorage.getItem(`user_${user_id}`)
    ? JSON.parse(localStorage.getItem(`user_${user_id}`))
    : {};
  useEffect(() => {
    fetchAccountDetails();
  }, []);

  const fetchAccountDetails = async () => {
    try {
      showLoader();
      setLoading(true);
      const response = await apiRequest("GET", `/account-details`, null, {
        Authorization: `Bearer ${token}`,
      });
      if (response.data?.status) {
          const account = response.data.data;  // rename to avoid confusion
          const available = response.data.available_balance ?? 0;
          const pending = response.data.pending_balance ?? 0;

          setAvailabelBalance(available);
          setPendingBalance(pending);
          setData(account);
      } else {
        toast.error("Failed to fetch account details");
      }
    } catch (error) {
      toast.error("Error fetching account details");
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  const handleConnectStripe = async () => {
    try {
      setButton(true);
      const res = await apiRequest(
        "POST",
        "/create-stripe-account",
        {},
        {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        }
      );

      if (res.data?.status) {
        window.location.href = res.data.url;
      } else {
        toast.error("Stripe onboarding URL not received.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error connecting to Stripe.");
    } finally {
      setButton(false);
    }
  };

  return (
    <>
      <div className={`modal-loader ${button ? "show" : "hide"}`}></div>

      <section className="user-dashboard">
        <div className="dashboard-outer">
          <div className="upper-title-box">
            <h3>Stripe Account Details</h3>
            <div className="text">Manage your account details.</div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="ls-widget">
                <div className="widget-title">
                  <h4>Account Details</h4>
                </div>
                <div className="widget-content">
                  {data ? (
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th colSpan={2} className="text-center">Stripe Account Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th>Available Balance</th>
                          <td>${availabelBalance ?? "0.00"}</td>
                        </tr>
                        <tr>
                          <th>Pending Balance</th>
                          <td>${pendingBalance ?? "0.00"}</td>
                        </tr>
                        <tr>
                          <th>Name</th>
                          <td>
                            {data.individual?.first_name ?? ""} {data.individual?.last_name ?? ""}
                          </td>
                        </tr>
                        <tr>
                          <th>Email</th>
                          <td>{data.email}</td>
                        </tr>
                        <tr>
                          <th>Currency</th>
                          <td>{data.default_currency}</td>
                        </tr>
                        <tr>
                          <th>Country</th>
                          <td>{data.country}</td>
                        </tr>
                        <tr>
                          <td colSpan={2} className="text-center p-4">
                            <button
                              onClick={handleConnectStripe}
                              className="btn btn-success"
                            >
                              Update Stripe Account
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  ) : (
                    <button
                      onClick={handleConnectStripe}
                      className="btn btn-primary"
                    >
                      Connect Stripe Account
                    </button>
                  )}

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Account;

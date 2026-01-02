// ProjectList.js
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { apiRequest } from "../../utils/api";
import Table from "../../ui/Table";
import ActionButton from "../../ui/ActionButton";
import { useLoader } from "../../ui/LoaderContext";
import * as bootstrap from "bootstrap";

const ProjectList = () => {
  const user_id = JSON.parse(localStorage.getItem("user_id"));
  const user = JSON.parse(localStorage.getItem(`user_${user_id}`));
  const { showLoader, hideLoader } = useLoader();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(1);
  const [total, setTotal] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [desc, setDesc] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const token = localStorage.getItem("token");
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get("type");

  const role = user?.role || "";

  const columnVisibility = {
    actions: type == "my-projects",
    application: role === "Client",
    status: role === "Client",
    mark_complete: role === "Freelancer" && type == "ongoing",
    completed_on: type == "completed",
    cancelled_at: type == "cancelled",
    completion_request: type == "ongoing",
    accept_completion_request: role === "Client" && type == "ongoing",
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  const fetchProjects = useCallback(
    async (currentPage) => {
      showLoader();
      try {
        const response = await apiRequest(
          "GET",
          `/projects?page=${currentPage}&type=${type}&search=${encodeURIComponent(
            debouncedSearch || ""
          )}`,
          null,
          {
            Authorization: `Bearer ${token}`,
          }
        );

        if (response.data?.status) {
          setProjects(response.data.data || []);
          setPage(response.data.page?.current_page ?? currentPage);
          setFrom(response.data.page?.from ?? 1);
          setTo(response.data.page?.to ?? 1);
          setTotal(response.data.page?.total ?? 0);
          setLastPage(response.data.page?.last_page ?? 1);
        } else {
          toast.error("Failed to fetch projects");
        }
      } catch (error) {
        toast.error("Error loading projects");
        // optional: console for debugging
        // console.error(error);
      } finally {
        setLoading(false);
        hideLoader();
      }
    },
    [showLoader, hideLoader, token, type, debouncedSearch]
  );

  useEffect(() => {
    setLoading(true);
    fetchProjects(page);
  }, [page, type, fetchProjects]);

  // When debounced search changes, go back to page 1 and refetch
  useEffect(() => {
    setLoading(true);
    setPage(1);
    fetchProjects(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const handleDeleteSuccess = useCallback(() => {
    fetchProjects(page);
  }, [fetchProjects, page]);

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
        header: "Applications",
        cell: ({ row }) => (
          <Link
            to={`/user/applications/${row.original.id}?title=${row.original.title}`}
          >
            {row.original.application > 0 ? (
              <button className="btn btn-primary btn-sm text-white">
                {row.original.application} <i className="fa fa-arrow-right"></i>
              </button>
            ) : (
              0
            )}
          </Link>
        ),
      },

      { accessorKey: "created_at", header: "Creation Date" },

      {
        accessorKey: "chat",
        header: "Chat",
        cell: ({ row }) => {
          const chatUserId = row.original.approved_freelancer_id;
          const st = (row.original.status ?? "")
            .toString()
            .trim()
            .toLowerCase();

          return (
            <div>
              {st === "approved" && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() =>
                    (window.location.href = `/codehelper/web/user/chat?user_id=${chatUserId}`)
                  }
                >
                  Chat
                </button>
              )}
            </div>
          );
        },
      },

      { accessorKey: "completion_request", header: "Completion Requested At" },

      {
        accessorKey: "completion_attachment",
        header: "Completion Attachments",
        cell: ({ row }) => {
          const attachments = row.original.completion_attachment;

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
        accessorKey: "remark",
        header: "Completion Remark",
        cell: ({ row }) => {
          const remark = row.original.remark;

          return remark ? (
            <div
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => {
                setDesc(remark);
                setTimeout(() => {
                  const modalEl = document.getElementById("viewDescriptionModal");
                  if (!modalEl) return;
                  const modal = new bootstrap.Modal(modalEl);
                  modal.show();
                }, 100);
              }}
            >
              View Remark
            </div>
          ) : null;
        },
      },

      { accessorKey: "completed_on", header: "Complete At" },

      { accessorKey: "cancelled_at", header: "Cancelled At" },

      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const raw = (row.original.status ?? "").toString().trim().toLowerCase();
          const status = raw === "canceled" ? "cancelled" : raw;

          const STATUS_META = {
            pending: { label: "Pending", className: "badge bg-primary" },
            approved: { label: "Approved", className: "badge bg-secondary" },
            completed: { label: "Completed", className: "badge bg-success" },
            cancelled: { label: "Cancelled", className: "badge bg-danger" },
            not_applied: { label: "Not Applied", className: "badge bg-dark" },

            // extra common statuses (safe defaults)
            in_progress: { label: "In Progress", className: "badge bg-info" },
            on_hold: { label: "On Hold", className: "badge bg-warning text-dark" },
            rejected: { label: "Rejected", className: "badge bg-danger" },
            draft: { label: "Draft", className: "badge bg-dark" },
          };

          const meta = STATUS_META[status] || {
            label: row.original.status ?? "",
            className: "badge bg-dark",
          };

          return <span className={meta.className}>{meta.label}</span>;
        },
      },

      {
        accessorKey: "accept_completion_request",
        header: "Accept Completion Request",
        cell: ({ row }) => {
          const { id, completion_request } = row.original;
          if (!completion_request?.trim?.()) return null;

          return (
            <ActionButton
              id={id}
              onDeleteSuccess={handleDeleteSuccess}
              buttons={[
                {
                  type: "link",
                  name: "Accept Completion Request",
                  url: `/project/accept/complete/${id}`,
                },
              ]}
            />
          );
        },
      },

      {
        accessorKey: "mark_complete",
        header: "Mark Complete",
        cell: ({ row }) => (
          <ActionButton
            id={row.original.id}
            onDeleteSuccess={handleDeleteSuccess}
            buttons={[
              {
                type: "link",
                name: "Mark Complete",
                url: `/project/complete/${row.original.id}`,
              },
            ]}
          />
        ),
      },

      {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <ActionButton
            id={row.original.id}
            onDeleteSuccess={handleDeleteSuccess}
            buttons={[
              row.original.application === 0
                ? {
                    type: "link",
                    name: "Edit",
                    url: `/user/project/edit/${row.original.id}`,
                  }
                : null,
              row.original.application === 0
                ? {
                    action: "delete",
                    name: "Delete",
                    deleteUrl: `/project/delete/${row.original.id}`,
                  }
                : null,
            ].filter(Boolean)}
          />
        ),
      },
    ],
    [from, handleDeleteSuccess]
  );

  return (
    <section className="user-dashboard">
      <div className="dashboard-outer">
        <div className="upper-title-box">
          <h3>{type ? type.charAt(0).toUpperCase() + type.slice(1) : "All"} Project List</h3>
          <div className="text">Manage your projects easily.</div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div className="ls-widget">
              <div className="widget-title d-flex">
                {role == "Client" ? (
                  <Link to="/user/project/create" className="btn btn-primary">
                    + Add New Project
                  </Link>
                ) : null}

                <input
                  type="text"
                  className="search-product form-control"
                  placeholder="Search Project"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ maxWidth: "250px", marginLeft: "auto" }}
                />
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
                  columnVisibility={columnVisibility}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
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
                Completion Remark
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
  );
};

export default ProjectList;

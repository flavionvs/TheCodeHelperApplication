import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { apiRequest } from "../utils/api";

const BlogListing = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [pagination, setPagination] = useState(null);

  const currentCategory = searchParams.get("category") || "";
  const currentSearch = searchParams.get("search") || "";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [currentCategory, currentSearch, currentPage]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = { page: currentPage, per_page: 12 };
      if (currentCategory) params.category = currentCategory;
      if (currentSearch) params.search = currentSearch;

      const queryString = new URLSearchParams(params).toString();
      const res = await apiRequest("GET", `/blog?${queryString}`);
      if (res.data?.status) {
        setPosts(res.data.data.data || []);
        setPagination({
          current_page: res.data.data.current_page,
          last_page: res.data.data.last_page,
          total: res.data.data.total,
        });
      }
    } catch (err) {
      console.error("Failed to fetch blog posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await apiRequest("GET", "/blog/categories");
      if (res.data?.status) {
        setCategories(res.data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const handleCategoryFilter = (cat) => {
    const params = new URLSearchParams(searchParams);
    if (cat) {
      params.set("category", cat);
    } else {
      params.delete("category");
    }
    params.delete("page");
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const form = e.target;
    const search = form.search.value.trim();
    const params = new URLSearchParams(searchParams);
    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }
    params.delete("page");
    setSearchParams(params);
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    setSearchParams(params);
    window.scrollTo(0, 0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const stripMarkdown = (md) => {
    if (!md) return "";
    return md
      .replace(/#{1,6}\s/g, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/`{1,3}[^`]*`{1,3}/g, "")
      .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
      .replace(/>\s?/g, "")
      .replace(/[-*+]\s/g, "")
      .replace(/\n/g, " ")
      .trim();
  };

  return (
    <>
      <Helmet>
        <title>Blog - The Code Helper</title>
        <meta
          name="description"
          content="Read the latest articles on freelancing, web development, coding tips, and tech industry insights from The Code Helper."
        />
        <link rel="canonical" href="https://thecodehelper.com/blog" />
      </Helmet>

      {/* Hero Banner */}
      <section
        style={{ marginTop: "100px", background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", padding: "60px 0" }}
      >
        <div className="container text-center text-white">
          <h1 className="display-4 fw-bold mb-3">Blog</h1>
          <p className="mb-4" style={{ fontSize: "18px", opacity: 0.9 }}>
            Insights, tutorials, and tips for developers and businesses
          </p>
          <form onSubmit={handleSearch} className="d-flex justify-content-center" style={{ maxWidth: "500px", margin: "0 auto" }}>
            <input
              type="text"
              name="search"
              className="form-control me-2"
              placeholder="Search articles..."
              defaultValue={currentSearch}
            />
            <button type="submit" className="btn btn-light fw-bold">
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="mb-4 d-flex flex-wrap gap-2 justify-content-center">
              <button
                className={`btn btn-sm ${!currentCategory ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => handleCategoryFilter("")}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`btn btn-sm ${currentCategory === cat ? "btn-primary" : "btn-outline-primary"}`}
                  onClick={() => handleCategoryFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-5">
              <h3 className="text-muted">No blog posts found</h3>
              <p className="text-muted">Check back soon for new articles!</p>
            </div>
          ) : (
            <>
              <div className="row g-4">
                {posts.map((post) => (
                  <div key={post.id} className="col-lg-4 col-md-6">
                    <Link
                      to={`/blog/${post.slug}`}
                      className="text-decoration-none"
                    >
                      <div
                        className="card h-100 border-0 shadow-sm"
                        style={{ borderRadius: "12px", overflow: "hidden", transition: "transform 0.2s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                      >
                        {post.cover_image && (
                          <img
                            src={post.cover_image}
                            alt={post.title}
                            className="card-img-top"
                            style={{ height: "200px", objectFit: "cover" }}
                          />
                        )}
                        <div className="card-body d-flex flex-column">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            {post.category && (
                              <span className="badge bg-primary bg-opacity-10 text-primary" style={{ fontSize: "12px" }}>
                                {post.category}
                              </span>
                            )}
                            <small className="text-muted">
                              {formatDate(post.published_at)}
                            </small>
                          </div>
                          <h5 className="card-title text-dark fw-bold mb-2">{post.title}</h5>
                          <p
                            className="card-text text-muted flex-grow-1"
                            style={{ fontSize: "14px", lineHeight: "1.6" }}
                          >
                            {post.excerpt
                              ? stripMarkdown(post.excerpt).substring(0, 150) + "..."
                              : stripMarkdown(post.content).substring(0, 150) + "..."}
                          </p>
                          <div className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top">
                            <small className="text-muted">
                              <i className="bi bi-person me-1"></i>
                              {post.author || "The Code Helper"}
                            </small>
                            <span className="text-primary fw-bold" style={{ fontSize: "14px" }}>
                              Read More →
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.last_page > 1 && (
                <nav className="mt-5 d-flex justify-content-center">
                  <ul className="pagination">
                    <li className={`page-item ${pagination.current_page === 1 ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(pagination.current_page - 1)}
                      >
                        Previous
                      </button>
                    </li>
                    {[...Array(pagination.last_page)].map((_, i) => (
                      <li
                        key={i + 1}
                        className={`page-item ${pagination.current_page === i + 1 ? "active" : ""}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(i + 1)}
                        >
                          {i + 1}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item ${pagination.current_page === pagination.last_page ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(pagination.current_page + 1)}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default BlogListing;

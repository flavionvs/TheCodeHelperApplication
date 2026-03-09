import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import { apiRequest } from "../utils/api";

const BlogDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest("GET", `/blog/${slug}`);
      if (res.data?.status) {
        setPost(res.data.data);
      } else {
        setError("Blog post not found.");
      }
    } catch (err) {
      setError("Blog post not found.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <section style={{ marginTop: "120px", minHeight: "60vh" }}>
        <div className="container text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error || !post) {
    return (
      <>
        <Helmet>
          <title>Post Not Found - Blog - The Code Helper</title>
        </Helmet>
        <section style={{ marginTop: "120px", minHeight: "60vh" }}>
          <div className="container text-center py-5">
            <h2 className="text-muted mb-4">Post Not Found</h2>
            <p className="text-muted mb-4">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/blog" className="btn btn-primary">
              ← Back to Blog
            </Link>
          </div>
        </section>
      </>
    );
  }

  const metaTitle = post.meta_title || post.title;
  const metaDesc =
    post.meta_description ||
    post.excerpt ||
    (post.content ? post.content.replace(/[#*`>\[\]!]/g, "").substring(0, 160) : "");

  return (
    <>
      <Helmet>
        <title>{metaTitle} - The Code Helper</title>
        <meta name="description" content={metaDesc} />
        <link rel="canonical" href={`https://thecodehelper.com/blog/${post.slug}`} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:url" content={`https://thecodehelper.com/blog/${post.slug}`} />
        {post.cover_image && <meta property="og:image" content={post.cover_image} />}
        <meta property="article:published_time" content={post.published_at} />
        <meta property="article:author" content={post.author || "The Code Helper"} />
      </Helmet>

      {/* Hero / Cover */}
      <section
        style={{
          marginTop: "100px",
          background: post.cover_image
            ? `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${post.cover_image}) center/cover`
            : "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          padding: "60px 0",
          minHeight: "280px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="container text-white text-center">
          {post.category && (
            <Link
              to={`/blog?category=${encodeURIComponent(post.category)}`}
              className="badge bg-primary mb-3 text-decoration-none"
              style={{ fontSize: "13px" }}
            >
              {post.category}
            </Link>
          )}
          <h1 className="display-5 fw-bold mb-3">{post.title}</h1>
          <div className="d-flex justify-content-center gap-4 text-white-50">
            <span>
              <i className="bi bi-person me-1"></i>
              {post.author || "The Code Helper"}
            </span>
            <span>
              <i className="bi bi-calendar me-1"></i>
              {formatDate(post.published_at)}
            </span>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <section className="bg-light py-2">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0" style={{ fontSize: "14px" }}>
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/blog">Blog</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {post.title}
              </li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Content */}
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mb-4 d-flex flex-wrap gap-2">
                  {post.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="badge bg-secondary bg-opacity-10 text-secondary"
                      style={{ fontSize: "12px" }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Markdown Content */}
              <article className="blog-content">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw, rehypeHighlight]}
                  components={{
                    img: ({ node, ...props }) => (
                      <img
                        {...props}
                        style={{ maxWidth: "100%", height: "auto", borderRadius: "8px", margin: "20px 0" }}
                        loading="lazy"
                        alt={props.alt || ""}
                      />
                    ),
                    a: ({ node, ...props }) => (
                      <a
                        {...props}
                        target={props.href?.startsWith("http") ? "_blank" : undefined}
                        rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
                      />
                    ),
                    table: ({ node, ...props }) => (
                      <div className="table-responsive">
                        <table className="table table-bordered table-striped" {...props} />
                      </div>
                    ),
                    pre: ({ node, ...props }) => (
                      <pre
                        style={{
                          background: "#1e1e1e",
                          color: "#d4d4d4",
                          padding: "20px",
                          borderRadius: "8px",
                          overflow: "auto",
                          fontSize: "14px",
                          lineHeight: "1.5",
                        }}
                        {...props}
                      />
                    ),
                    blockquote: ({ node, ...props }) => (
                      <blockquote
                        style={{
                          borderLeft: "4px solid #1a73e8",
                          paddingLeft: "20px",
                          margin: "20px 0",
                          color: "#555",
                          fontStyle: "italic",
                        }}
                        {...props}
                      />
                    ),
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </article>

              {/* Back to Blog */}
              <div className="mt-5 pt-4 border-top">
                <Link to="/blog" className="btn btn-outline-primary">
                  ← Back to Blog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog content styles */}
      <style>{`
        .blog-content h1 { font-size: 2rem; font-weight: 700; margin: 30px 0 15px; color: #1a1a2e; }
        .blog-content h2 { font-size: 1.6rem; font-weight: 600; margin: 28px 0 14px; color: #1a1a2e; }
        .blog-content h3 { font-size: 1.35rem; font-weight: 600; margin: 24px 0 12px; color: #333; }
        .blog-content h4 { font-size: 1.15rem; font-weight: 600; margin: 20px 0 10px; color: #333; }
        .blog-content p { font-size: 16px; line-height: 1.8; color: #444; margin-bottom: 16px; }
        .blog-content ul, .blog-content ol { margin-bottom: 16px; padding-left: 24px; }
        .blog-content li { font-size: 16px; line-height: 1.8; color: #444; margin-bottom: 6px; }
        .blog-content code { background: #f0f0f0; padding: 2px 6px; border-radius: 4px; font-size: 14px; color: #d63384; }
        .blog-content pre code { background: none; padding: 0; color: inherit; }
        .blog-content hr { margin: 30px 0; border-color: #e0e0e0; }
        .blog-content a { color: #1a73e8; text-decoration: underline; }
        .blog-content a:hover { color: #0f5bb5; }
      `}</style>
    </>
  );
};

export default BlogDetail;

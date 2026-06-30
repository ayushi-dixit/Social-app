import { useEffect, useState } from "react";
import api from "../services/api";
import PostCard from "../components/PostCard";
import { useAuth } from "../context/AuthContext";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const fetchPosts = async () => {
    try {
      const { data } = await api.get("/posts");
      setPosts(data);
    } catch (err) {
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setPosting(true);
    try {
      const { data } = await api.post("/posts", { content });
      setPosts((prev) => [data, ...prev]);
      setContent("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post");
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (id) => {
    try {
      const { data } = await api.put(`/posts/${id}/like`);
      setPosts((prev) => prev.map((p) => (p._id === id ? data : p)));
    } catch (err) {
      setError("Failed to update like");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await api.delete(`/posts/${id}`);
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      setError("Failed to delete post");
    }
  };

  const handleEdit = async (id, newContent) => {
    try {
      const { data } = await api.put(`/posts/${id}`, { content: newContent });
      setPosts((prev) => prev.map((p) => (p._id === id ? data : p)));
    } catch (err) {
      setError("Failed to update post");
    }
  };

  return (
    <div className="feed-page">
      <form className="create-post-card" onSubmit={handleCreatePost}>
        <div className="post-avatar">
          <span>{user?.name?.charAt(0).toUpperCase() || "U"}</span>
        </div>
        <div className="create-post-body">
          <textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
          />
          <button type="submit" className="btn-primary" disabled={posting || !content.trim()}>
            {posting ? "Posting..." : "Post"}
          </button>
        </div>
      </form>

      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <p className="muted">Loading feed...</p>
      ) : posts.length === 0 ? (
        <p className="muted">No posts yet. Be the first to share something!</p>
      ) : (
        <div className="post-list">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onLike={handleLike}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Feed;

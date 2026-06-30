import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const timeAgo = (dateString) => {
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  const intervals = [
    { label: "y", secs: 31536000 },
    { label: "mo", secs: 2592000 },
    { label: "d", secs: 86400 },
    { label: "h", secs: 3600 },
    { label: "m", secs: 60 },
  ];
  for (const i of intervals) {
    const count = Math.floor(seconds / i.secs);
    if (count >= 1) return `${count}${i.label} ago`;
  }
  return "just now";
};

const PostCard = ({ post, onLike, onDelete, onEdit }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);

  const isOwner = user && post.author?._id === user._id;
  const isLiked = user && post.likes?.includes(user._id);

  const handleSaveEdit = () => {
    if (!editContent.trim()) return;
    onEdit(post._id, editContent);
    setIsEditing(false);
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-avatar">
          {post.author?.profilePicture ? (
            <img src={post.author.profilePicture} alt={post.author.name} />
          ) : (
            <span>{post.author?.name?.charAt(0).toUpperCase() || "U"}</span>
          )}
        </div>
        <div>
          <p className="post-author">{post.author?.name || "Unknown user"}</p>
          <p className="post-time">{timeAgo(post.createdAt)}</p>
        </div>
      </div>

      {isEditing ? (
        <div className="post-edit">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={3}
          />
          <div className="post-edit-actions">
            <button className="btn-small" onClick={handleSaveEdit}>
              Save
            </button>
            <button className="btn-small btn-ghost" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="post-content">{post.content}</p>
      )}

      <div className="post-footer">
        <button
          className={`btn-like ${isLiked ? "liked" : ""}`}
          onClick={() => onLike(post._id)}
        >
          {isLiked ? "♥" : "♡"} {post.likes?.length || 0}
        </button>

        {isOwner && !isEditing && (
          <div className="post-owner-actions">
            <button className="btn-small btn-ghost" onClick={() => setIsEditing(true)}>
              Edit
            </button>
            <button className="btn-small btn-danger" onClick={() => onDelete(post._id)}>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;

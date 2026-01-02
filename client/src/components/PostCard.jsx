import React, { useState } from "react";
import { reactToPost, addComment } from "../api/api";

function PostCard({ post: initialPost }) {
  const [post, setPost] = useState(initialPost);
  const [expanded, setExpanded] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [loadingReaction, setLoadingReaction] = useState(false);

  const token = localStorage.getItem("token");
  const currentUserId = localStorage.getItem("userId");

  const reactionEmojis = ["❤️", "👍", "😂", "😮", "😢", "🔥"];

  const previewLength = 200;
  const isLong = post.content.length > previewLength;
  const contentToShow = expanded || !isLong
    ? post.content
    : post.content.slice(0, previewLength) + "...";

  const reactionCounts = post.likes.reduce((acc, l) => {
    acc[l.emoji] = (acc[l.emoji] || 0) + 1;
    return acc;
  }, {});

  const userReaction = post.likes.find(l => l.userId === currentUserId)?.emoji;

  const handleReaction = async (emoji) => {
    if (!token) return alert("Please log in to react");
    setLoadingReaction(true);
    try {
      const data = await reactToPost(post._id, emoji);
      setPost(prev => ({ ...prev, likes: data.likes }));
    } catch (err) {
      alert(err.message);
    } finally {
      setLoadingReaction(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!token) return alert("Please log in to comment");

    try {
      const data = await addComment(post._id, newComment);
      setPost(prev => ({ ...prev, comments: [...prev.comments, data.comment] }));
      setNewComment("");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="post-card">
      <h3>{post.title}</h3>
      <p className="content">{contentToShow}</p>
      {isLong && (
        <button onClick={() => setExpanded(!expanded)} className="read-more-btn">
          {expanded ? "Show less" : "Read more"}
        </button>
      )}

      <div className="reactions">
        <div className="reaction-buttons">
          {reactionEmojis.map(emoji => (
            <button
              key={emoji}
              onClick={() => handleReaction(emoji)}
              disabled={loadingReaction}
              className={`reaction-btn ${userReaction === emoji ? "active" : ""}`}
            >
              {emoji} {reactionCounts[emoji] || 0}
            </button>
          ))}
        </div>
      </div>

      <div className="comments-section">
        <button onClick={() => setShowComments(!showComments)} className="toggle-comments-btn">
          {showComments ? "Hide" : `${post.comments.length} comment${post.comments.length !== 1 ? "s" : ""}`}
        </button>

        {showComments && (
          <div className="comments-list">
            {post.comments.length === 0 ? (
              <p>No comments yet.</p>
            ) : (
              post.comments.map(c => (
                <div key={c._id} className="comment">
                  <strong>{c.author?.username || "Anonymous"}</strong>
                  <p>{c.text}</p>
                  <small>{new Date(c.createdAt).toLocaleDateString()}</small>
                </div>
              ))
            )}

            <form onSubmit={handleAddComment} className="add-comment-form">
              <input
                type="text"
                placeholder="Write a comment..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
              />
              <button type="submit">Post</button>
            </form>
          </div>
        )}
      </div>

      <div className="post-meta">
        <span>Author: {post.author?.username || "Unknown"}</span>
        {post.tags.length > 0 && <div className="tags">{post.tags.join(", ")}</div>}
      </div>
    </div>
  );
}

export default PostCard;
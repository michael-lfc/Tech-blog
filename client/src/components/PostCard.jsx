// src/components/PostCard.jsx
import React, { useState } from "react";

function PostCard({ post }) {
  const [expanded, setExpanded] = useState(false);
  const previewLength = 200;

  const isLong = post.content.length > previewLength;
  const contentToShow = expanded || !isLong
    ? post.content
    : post.content.slice(0, previewLength) + "...";

  return (
    <div className="post-card">
      <h3>{post.title}</h3>
      <p>{contentToShow}</p>

      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="read-more-btn"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}

      <span>Author: {post.author?.username || "Unknown"}</span>
      <div className="tags">{post.tags?.join(", ")}</div>
    </div>
  );
}

export default PostCard;

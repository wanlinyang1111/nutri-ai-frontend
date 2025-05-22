/**
 * 社群功能尚未開發
 */

import React from "react";

const SocialPost = ({ post }) => {
  return (
    <div className="social-post">
      <h3>{post.title}</h3>
      <p>{post.content}</p>
    </div>
  );
};

export default SocialPost;

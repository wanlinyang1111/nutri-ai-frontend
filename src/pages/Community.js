/**
 * 社群功能尚未開發
 */

import React from "react";
import SocialPost from "../components/SocialPost";
import Navbar from "../components/Navbar"; // 引入Navbar

const posts = [
  //{ title: "Post 1", content: "This is the content of post 1" },
  //{ title: "Post 2", content: "This is the content of post 2" },
];

const Community = () => {
  return (
    <div className="community-page">
      <Navbar /> {/* 確保Navbar渲染在頁面中 */}
      <img
        src="/images/construction.png"
        alt="網頁施工中"
        style={{ width: "100%", marginBottom: "20px" }}
      />
      <h1>社群</h1>
      {posts.map((post, index) => (
        <SocialPost key={index} post={post} />
      ))}
    </div>
  );
};

export default Community;

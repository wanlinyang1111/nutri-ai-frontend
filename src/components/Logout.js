import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * @component 登出組件
 * 功能：提供使用者登出功能，清除本地存儲並重定向到首頁
 * 使用方式：<Logout />
 */
const Logout = () => {
  // 使用 React Router 的導航 hook
  // navigate: 用於程式化導航的函數，可傳入路徑字串作為參數
  const navigate = useNavigate();

  /**
   * 處理登出邏輯的函數
   * 功能：
   * 1. 清除所有 localStorage 中的數據
   * 2. 在控制台輸出清除確認訊息
   * 3. 將使用者重定向到首頁
   */
  const handleLogout = () => {
    // 清除所有 localStorage 數據
    localStorage.clear();
    console.log("Cleared localStorage on logout");
    // 導航到首頁 (Home.js)
    navigate("/"); // 因為 Home.js 是掛載在根路徑 "/"
  };

  return (
    // 登出按鈕元件，點擊時觸發 handleLogout 函數
    <button onClick={handleLogout} className="logout-button">
      登出
    </button>
  );
};

export default Logout;

/**
 * @component Navbar.js
 * @description 網站導航欄組件，提供網站的主要導航功能
 * 包含：登入狀態顯示、選單項目、登出功能
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * @function Navbar
 * @description 導航欄主要組件
 * @param {Object} props - 組件屬性
 * @param {boolean} props.isLoggedIn - 使用者登入狀態
 * @param {function} props.handleLogout - 登出處理函數
 */
const Navbar = ({ isLoggedIn, handleLogout }) => {
  /**
   * @state {boolean} isMobile - 控制手機版選單顯示狀態
   * @state {boolean} isOpen - 控制下拉選單開關狀態
   */
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  /**
   * @function toggleMenu
   * @description 切換手機版選單顯示狀態
   */
  const toggleMenu = () => {
    setIsMobile(!isMobile);
  };

  /**
   * @function handleDropdown
   * @description 處理下拉選單開關
   */
  const handleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <ul>
        <li>
          <a href="/dashboard">
            <img src="/images/dashboard-icon.png" alt="Dashboard" />
          </a>
        </li>
        <li>
          <a href="/community">
            <img src="/images/community-icon.png" alt="Community" />
          </a>
        </li>
        <li>
          <a href="/ai-chatbox">
            <img src="/images/ai-chatbox-icon.png" alt="AI Chatbox" />
          </a>
        </li>
        <li>
          <a href="/daily-records">
            <img src="/images/daily-records-icon.png" alt="Daily Records" />
          </a>
        </li>
        <li>
          <a href="/personal-info">
            <img src="/images/personal-info-icon.png" alt="Personal Info" />
          </a>
        </li>
      </ul>
    </nav>
  );
};

/**
 * @備註 重要設定參數說明：
 * 1. isLoggedIn: 控制導航欄顯示登入/登出狀態
 * 2. handleLogout: 需要實作登出相關邏輯
 * 3. logo 圖片路徑: 需要正確設定圖片位置
 * 4. 選單項目: 可在 menuItems 中配置
 *
 * @樣式說明
 * - 需配置 responsive design 斷點
 * - 手機版 < 768px
 * - 電腦版 >= 768px
 */

export default Navbar;

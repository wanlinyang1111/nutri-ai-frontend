/**
 * @file Firsthome.js
 * @description 首頁歡迎入口畫面，為平台登入前的主視覺入口。
 *
 * 功能：
 * - 顯示品牌名稱與 Logo
 * - 提供語言選擇器，支援多語言切換（中文／英文／日文）
 * - 提供註冊、登入、Demo Login 按鈕
 *
 * 狀態管理：
 * - `language`: 儲存選擇的語言（localStorage 同步）
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/home.css";

const Firsthome = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "zh"
  );

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    i18n.changeLanguage(selectedLanguage);
    localStorage.setItem("language", selectedLanguage);
  };

  const handleRegister = () => {
    console.log("Redirecting to Registration Page");
    navigate("/regist");
  };

  const handleLogin = () => {
    console.log("Redirecting to Home Page");
    navigate("/home");
  };

  const handleDemoLogin = () => {
    // 儲存 demo user ID
    localStorage.setItem("userid", "demo-user-123");
    console.log("Demo user logged in.");
    navigate("dashboard");
  };

  return (
    <div
      className="firsthome-container"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      {/* LOGO */}
      <img
        src="/images/logo.png"
        alt="Voyager Logo"
        className="logo"
        style={{ width: "180px", height: "auto", marginBottom: "20px" }}
      />

      {/* 軟體名稱 */}
      <h1 style={{ color: "#333", fontSize: "2.5rem", margin: "10px 0" }}>
        Voyager
      </h1>

      {/* Slogan */}
      <p style={{ color: "#555", fontSize: "1.2rem", margin: "10px 0" }}>
        {t("slogan")}
      </p>

      {/* 語言選擇器 */}
      <div className="language-selector" style={{ marginBottom: "20px" }}>
        <select value={language} onChange={handleLanguageChange}>
          <option value="zh">中文</option>
          <option value="en">English</option>
          <option value="ja">日本語</option>
        </select>
      </div>

      {/* 按鈕容器 */}
      <div
        className="button-container"
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginTop: "30px",
          flexWrap: "wrap",
        }}
      >
        {/* 註冊按鈕 */}
        <button
          className="register-button"
          style={{
            backgroundColor: "#8597c1",
            color: "white",
            padding: "12px 20px",
            fontSize: "1rem",
            borderRadius: "8px",
            cursor: "pointer",
            border: "none",
          }}
          onClick={handleRegister}
        >
          {t("register")}
        </button>

        {/* 登入按鈕 */}
        <button
          style={{
            backgroundColor: "#ff7843",
            color: "white",
            padding: "12px 20px",
            fontSize: "1rem",
            borderRadius: "8px",
            cursor: "pointer",
            border: "none",
          }}
          onClick={handleLogin}
        >
          {t("login")}
        </button>

        {/* Demo Login 按鈕 */}
        <button
          style={{
            backgroundColor: "#4caf50",
            color: "white",
            padding: "12px 20px",
            fontSize: "1rem",
            borderRadius: "8px",
            cursor: "pointer",
            border: "none",
          }}
          onClick={handleDemoLogin}
        >
          {t("demoLogin")}
        </button>
      </div>
    </div>
  );
};

export default Firsthome;

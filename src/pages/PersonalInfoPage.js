/**
 * @file PersonalInfoPage.jsx
 * @description 使用者個人資料頁面
 *
 * 功能：
 * - 顯示 <PersonalInfoForm /> 表單供使用者填寫或查看個人資料
 * - 點擊按鈕可導向 AI 分析報告頁（/report），傳入 userId
 * - 顯示登入後的登出按鈕（右上角固定）
 * - 若從其他頁面導入，可接收 state.message 顯示提示訊息
 *
 * 使用元件：
 * - <Navbar />
 * - <PersonalInfoForm />
 * - <Logout />
 */

// PersonalInfoPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import PersonalInfoForm from "../components/PersonalInfoForm";
import Logout from "../components/Logout";
import { useTranslation } from "react-i18next";

const PersonalInfoPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const message = location.state?.message;
  const userId = localStorage.getItem("userid");

  const handleGenerateReport = () => {
    // 直接導向report頁面，帶入userId
    navigate("/report", { state: { userId } });
  };

  return (
    <div className="personal-info-page" style={{ position: "relative" }}>
      <Navbar />
      <h1>{t("personalInfoPage.title")}</h1>

      <button onClick={handleGenerateReport}>
        {t("產生報告") || "產生報告"}
      </button>

      {message && <p>{message}</p>}

      <PersonalInfoForm userId={userId} />

      <Logout
        style={{
          position: "fixed",
          top: "10px",
          right: "0",
          padding: "10px 20px",
          backgroundColor: "rgba(70, 66, 66, 0.44)",
          color: "white",
          border: "none",
          borderTopLeftRadius: "20px",
          borderBottomLeftRadius: "20px",
          borderTopRightRadius: "0",
          borderBottomRightRadius: "0",
          fontSize: "1em",
          cursor: "pointer",
          zIndex: 9999,
          whiteSpace: "nowrap",
        }}
      />
    </div>
  );
};

export default PersonalInfoPage;

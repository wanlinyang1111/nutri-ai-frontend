/**
 * @file Dashboard.js
 * @description 使用者登入後主控頁（健康平台首頁）
 *
 * 功能：
 * - 顯示歡迎語與平台簡介
 *
 */

import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useTranslation } from "react-i18next"; // 引入 i18n
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { t } = useTranslation(); // 使用翻譯功能
  const navigate = useNavigate();
  const [initialDiagnosisData, setInitialDiagnosisData] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userid");
    if (userId) {
      // 從後端獲取初診資料
      // fetchInitialDiagnosisData(userId);
    }
  }, []);

  return (
    <div className="dashboard-container">
      <Navbar />
      <h1>{t("dashboard.welcome", "歡迎來到 Voyage 健康管理平台")}</h1>
      <p
        style={{
          paddingLeft: "50px",
          paddingRight: "50px",
          boxSizing: "border-box",
          width: "100%",
        }}
      >
        {t(
          "dashboard.description",
          "在這裡，我們將一起啟航，探索您的飲食與健康之旅。選擇下邊欄的功能，開始與營養師一同制定專屬您的健康計畫，讓每一天都充滿活力！"
        )}
      </p>
      {initialDiagnosisData && (
        <div className="initial-diagnosis-section">
          <h3>初診資料</h3>
          <button onClick={() => navigate("/initial-chat")}>
            查看/編輯初診資料
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

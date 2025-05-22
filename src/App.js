/**
 * @file App.js
 * @description 應用主進入點，設置全域路由與語言初始化
 *
 * 功能：
 * - 根據 localStorage 的語言設定載入初始語系
 * - 使用 React Router 定義所有頁面對應路由
 * - 路由結構符合單頁式應用設計（SPA）
 */

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Firsthome from "./pages/Firsthome";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Community from "./pages/Community";
import AIChatboxPage from "./pages/AIChatboxPage";
import DailyRecordsPage from "./pages/DailyRecordsPage";
import PersonalInfoPage from "./pages/PersonalInfoPage";
import PersonalInfoForm from "./components/PersonalInfoForm";
import Regist from "./pages/Regist";
import { useTranslation } from "react-i18next"; // 引入 useTranslation
import i18n from "./i18n/i18n"; // 正確的路徑：src/i18n/i18n.js
import ReportPage from "./pages/ReportPage";

const App = () => {
  const { t } = useTranslation();

  // 在 App 加載時，檢查 localStorage 是否已經有語言設置
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage); // 根據 localStorage 中的語言設定切換
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Firsthome />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/community" element={<Community />} />
        <Route path="/ai-chatbox" element={<AIChatboxPage />} />
        <Route path="/daily-records" element={<DailyRecordsPage />} />
        <Route path="/personal-info" element={<PersonalInfoPage />} />
        <Route path="/personal-info-form" element={<PersonalInfoForm />} />
        <Route path="/regist" element={<Regist />} />
        <Route path="/report" element={<ReportPage />} />
      </Routes>
    </Router>
  );
};

export default App;

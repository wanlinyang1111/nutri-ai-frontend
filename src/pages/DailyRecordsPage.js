/**
 * @file DailyRecordsPage.js
 * @description 每日健康紀錄頁面容器
 *
 * 功能：
 * - 呈現導覽列與主頁面標題
 * - 嵌入 <DailyRecordForm /> 元件，支援使用者記錄三餐、液體、運動資訊
 *
 * 結構：
 * - <Navbar />
 * - <DailyRecordForm />
 *
 * 備註：
 * - `handleVoiceSave()` 預留語音紀錄接入，可用於未來語音輸入擴充（目前未使用）
 */

import React from "react";
import DailyRecordForm from "../components/DailyRecordForm";
import Navbar from "../components/Navbar";

const DailyRecordsPage = () => {
  // 預留語音輸入接入（目前未使用）
  const handleVoiceSave = (mealType, content) => {
    console.log(`語音紀錄儲存：${mealType} - ${content}`);
    // ✅ 這邊你可以接後端 API 儲存 user_daily_diet（可日後補上）
  };

  return (
    <div className="daily-records-page">
      <Navbar />
      <header>
        <h1 className="page-title">日常紀錄</h1>
      </header>
      <main className="p-4 space-y-8">
        <DailyRecordForm />
      </main>
    </div>
  );
};

export default DailyRecordsPage;

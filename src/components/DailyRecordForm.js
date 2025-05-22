/**
 * @component DailyRecordForm
 * @description 用戶每日健康紀錄整合元件。
 *
 * 功能：
 * - 提供使用者選擇日期，查看／填寫當日的三項紀錄：
 *   1. 飲食紀錄（DietSection）
 *   2. 液體攝取紀錄（LiquidSection）[目前隱藏]
 *   3. 運動紀錄（ExerciseSection）[目前隱藏]
 * - 顯示當週日期按鈕，快速切換日期查看
 * - 支援即時獲取每日記錄資料（fetchDailyData）
 * - 資料將依據時間分類儲存於 `dailyRecord` 物件中
 *
 * dailyRecord 結構範例：
 * {
 *   早餐: { diet_time, diet_content, diet_img_path },
 *   午餐: { ... },
 *   ...
 * }
 */

//📌 1. 引入所需的函式庫與檔案
import React, { useState, useEffect } from "react";
import { fetchDailyData } from "../utils/apiCalls"; // 移除 submitDailyData
import "../styles/dailyrecordform.css";
import { DietSection } from "./DietSection";
import LiquidSection from "./LiquidSection";
import ExerciseSection from "./ExerciseSection";

//📌 2. 宣告元件 DailyRecordForm
const DailyRecordForm = ({ userid }) => {
  //📌 3. 初始化狀態 (useState)
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  // 儲存目前所選日期的各餐資料（以餐別分類）
  // 格式範例：{ 早餐: {...}, 午餐: {...}, 晚餐: {...} }
  const [dailyRecord, setDailyRecord] = useState({});
  const [weekDates, setWeekDates] = useState([]);

  //📌 4. 產生當週日期範圍
  const generateDates = (centerDate) => {
    const center = new Date(centerDate);
    const dates = [center];

    for (let i = 1; i <= 3; i++) {
      const prevDate = new Date(center);
      prevDate.setDate(center.getDate() - i);
      dates.unshift(prevDate);

      const nextDate = new Date(center);
      nextDate.setDate(center.getDate() + i);
      dates.push(nextDate);
    }

    return dates;
  };

  // 更新日期範圍
  const updateWeekDates = (centerDate) => {
    const newDates = generateDates(centerDate);
    setWeekDates(newDates);
  };

  //📌 5. 格式化日期（為 API 設計）
  const formatDateForAPI = (date) => {
    return new Date(date).toISOString().split("T")[0];
  };

  //📌 6. 選擇日期並獲取紀錄
  const handleDateSelect = async (date) => {
    try {
      const formattedDate = formatDateForAPI(date);
      setSelectedDate(formattedDate);
      updateWeekDates(formattedDate);

      const userIdFromStorage = localStorage.getItem("userid");
      if (!userIdFromStorage) {
        console.error("⚠️ No userid found in storage");
        return;
      }

      console.log("🔍 Fetching data for date:", formattedDate);
      const response = await fetchDailyData(userIdFromStorage, formattedDate);

      if (response?.success && response?.data) {
        // Group data by meal type, ignoring time portion
        const formattedData = response.data.reduce((acc, item) => {
          // Extract only the date part for comparison
          const itemDate = new Date(item.diet_time).toISOString().split("T")[0];

          if (itemDate === formattedDate) {
            console.log(`Found matching data for ${itemDate}:`, item);
            const mealId = item.diet_time_type;
            acc[mealId] = {
              diet_time: item.diet_time,
              diet_content: item.diet_content,
              diet_img_path: item.diet_img_path,
            };
          }
          return acc;
        }, {});

        console.log("✅ Formatted daily record:", formattedData);
        setDailyRecord(formattedData);
      } else {
        console.log("ℹ️ No data found for date:", formattedDate);
        setDailyRecord({});
      }
    } catch (error) {
      console.error("❌ Error fetching data:", error);
      setDailyRecord({});
    }
  };

  //📌 7. 處理輸入變更
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDailyRecord((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //📌 8. 更新飲食記錄
  const handleDietUpdate = (mealData) => {
    setDailyRecord((prev) => ({
      ...prev,
      [mealData.diet_time_type]: {
        diet_time: mealData.diet_time,
        diet_content: mealData.diet_content,
        diet_img_path: mealData.diet_image,
      },
    }));
  };

  //📌 9. 渲染日期按鈕
  const renderDateButtons = () => {
    return weekDates.map((date) => {
      const formattedDate = date.toISOString().split("T")[0];
      const isSelected = selectedDate === formattedDate;
      const weekDay = new Intl.DateTimeFormat("zh-TW", {
        weekday: "short",
      }).format(date);
      const monthDay = `${date.getMonth() + 1}/${date.getDate()}`;

      return (
        <button
          key={formattedDate}
          onClick={() => handleDateSelect(formattedDate)}
          className={`date-button ${isSelected ? "selected" : ""}`}
        >
          <div className="date-day">{monthDay}</div>
          <div className="date-weekday">{weekDay}</div>
        </button>
      );
    });
  };

  //📌 10. 初始化時載入今天的數據
  useEffect(() => {
    const userIdFromStorage = localStorage.getItem("userid");
    if (userIdFromStorage) {
      console.log("🔄 Initial load with userid:", userIdFromStorage);
      updateWeekDates(today);
      handleDateSelect(today);
    }
  }, []);

  return (
    <div className="daily-record-form">
      <div className="header-section">
        <h1 className="daily-record-title">日常紀錄</h1>

        {/* 月曆選單 */}
        <div
          className="calendar-picker"
          style={{ position: "absolute", top: "10px", right: "10px" }}
        >
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => handleDateSelect(e.target.value)}
          />
        </div>

        <div className="date-section">
          <h3>選擇日期</h3>
          <div
            className="date-buttons"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            {renderDateButtons()}
          </div>
        </div>
      </div>

      {selectedDate && (
        <div className="records-wrapper">
          <div className="records-container">
            <DietSection
              userid={localStorage.getItem("userid")}
              date={selectedDate}
              handleInputChange={handleInputChange}
              dailyRecord={dailyRecord} // Add this prop
              onUpdateDiet={(formData) => {
                setDailyRecord((prev) => ({
                  ...prev,
                  [formData.diet_time_type]: {
                    diet_time: formData.diet_time,
                    diet_content: formData.diet_content,
                    diet_img_path: formData.diet_image,
                  },
                }));
              }}
              selectedDate={selectedDate}
            />

            <LiquidSection
              dailyRecord={dailyRecord}
              handleInputChange={handleInputChange}
            />

            <ExerciseSection
              dailyRecord={dailyRecord}
              handleInputChange={handleInputChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyRecordForm;

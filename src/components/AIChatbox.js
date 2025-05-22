/**
 * AIChatbox 元件
 * 本元件為用戶與 AI 互動的入口，功能包括：
 * - 顯示用戶每日飲食紀錄狀態提示
 * - 檢查個人資料與三餐紀錄是否完整，並依結果引導用戶補填資料或產出報告
 * - 控制互動式飲食紀錄區塊的開啟（DietSection）
 * - 顯示必要的提示通知與導向（使用者尚未登入或未填寫個人資料等）
 *
 * 使用元件：DietSection、MUI Dialog
 * 使用函式：checkUserBaseData, fetchDailyData
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { checkUserBaseData, fetchDailyData } from "../utils/apiCalls";
import { DietSection } from "./DietSection";
import "../styles/AIChatbox.css";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

/**
 * 樣式設定
 * mealContainer: 餐點容器的基本樣式
 * mealContent: 餐點內容區域的樣式
 */

const styles = {
  mealContainer: {
    width: "100%",
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    boxSizing: "border-box",
  },
  mealContent: {
    overflow: "auto",
    maxHeight: "300px",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
  },
};

const AIChatbox = () => {
  // 載入狀態控制
  const [loading, setLoading] = useState(true);
  // 錯誤訊息儲存
  const [error, setError] = useState(null);
  // AI對話訊息
  const [message, setMessage] = useState("");
  // 是否顯示「前往填寫餐點紀錄」按鈕（當三餐資料尚未完整時）
  const [showMealButton, setShowMealButton] = useState(false);
  // 當前選擇的餐點
  const [selectedMeal, setSelectedMeal] = useState(null);
  // 控制通知顯示
  const [showNotification, setShowNotification] = useState(false);
  // 通知路徑
  const [notificationPath, setNotificationPath] = useState("");
  // 每日飲食紀錄資料
  const [dailyRecord, setDailyRecord] = useState({});
  // 控制飲食區塊顯示
  const [showDietSection, setShowDietSection] = useState(false);
  // 初始餐點類型
  const [initialMealType, setInitialMealType] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  /**
   * 檢查餐點完整性
   * @param {Array} meals - 餐點陣列，預設為空陣列
   * @returns {Object} - 返回餐點完整性檢查結果
   * 功能：
   * - 檢查當日是否記錄所有必要餐點(早餐、午餐、晚餐)
   * - 處理跨日期的晚餐時間邏輯
   */
  const checkMealCompleteness = (meals = []) => {
    // 定義必需記錄的餐點類型
    const requiredMeals = ["早餐", "午餐", "晚餐"];

    // 取得今日日期
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    // 過濾當日餐點
    const todayMeals = meals.filter((meal) => {
      if (!meal.diet_time) return false;
      const mealDate = new Date(meal.diet_time);

      /**
       * 晚餐時間特殊處理
       * - 凌晨0-6點的晚餐紀錄會被歸類到前一天
       * - 確保跨日期的晚餐正確歸類
       */
      if (meal.diet_time_type === "晚餐") {
        const hour = mealDate.getHours();
        if (hour >= 0 && hour < 6) {
          console.log("⏱ 晚餐在凌晨，歸類為前一天:", meal.diet_time);
          mealDate.setDate(mealDate.getDate() - 1);
        }
      }

      /**
       * 日期格式化
       * - 將日期轉換為 YYYY-MM-DD 格式
       * - 用於比對是否為當日餐點
       */
      const localMealDateStr =
        mealDate.getFullYear() +
        "-" +
        String(mealDate.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(mealDate.getDate()).padStart(2, "0");

      const isToday = localMealDateStr === todayStr;
      console.log(
        `🔍 檢查餐點: ${meal.diet_time_type} | 原始: ${meal.diet_time} | local: ${localMealDateStr} | 今日: ${todayStr} | isToday: ${isToday}`
      );
      return isToday;
    });

    const recordedMeals = new Set(
      todayMeals.map((meal) => meal.diet_time_type)
    );
    console.log("🍽 今天已填寫餐別:", Array.from(recordedMeals));

    const complete = requiredMeals.every((meal) => recordedMeals.has(meal));
    console.log("✅ 是否三餐完整:", complete);
    return complete;
  };

  const getMissingMeal = (meals = []) => {
    const requiredMeals = ["早餐", "午餐", "晚餐"];
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    const todayMeals = meals.filter((meal) => {
      if (!meal.diet_time) return false;
      const mealDate = new Date(meal.diet_time);
      // ✅ 晚餐凌晨修正
      if (meal.diet_time_type === "晚餐") {
        const hour = mealDate.getHours();
        if (hour >= 0 && hour < 6) {
          console.log("⏱ 晚餐在凌晨，歸類為前一天:", meal.diet_time);
          mealDate.setDate(mealDate.getDate() - 1);
        }
      }
      const localMealDateStr =
        mealDate.getFullYear() +
        "-" +
        String(mealDate.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(mealDate.getDate()).padStart(2, "0");

      const isToday = localMealDateStr === todayStr;
      console.log(
        `🔎 getMissingMeal 檢查: ${meal.diet_time_type} | ${meal.diet_time} | ${localMealDateStr} | ${todayStr} | isToday: ${isToday}`
      );
      return isToday;
    });

    const recordedMeals = new Set(
      todayMeals.map((meal) => meal.diet_time_type)
    );
    const missing = requiredMeals.find((meal) => !recordedMeals.has(meal));
    console.log("❗️ 尚未填寫:", missing);
    return missing;
  };

  const checkUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      setShowMealButton(false);

      const userId = localStorage.getItem("userid");
      console.log("📌 使用者 ID:", userId);
      if (!userId) {
        setMessage("請先登入");
        setNotificationPath("/login");
        setShowNotification(true);
        return;
      }

      const hasProfile = await checkUserBaseData(userId);
      console.log("🧾 是否填寫個人資料:", hasProfile);
      if (!hasProfile) {
        setMessage("請先完成個人資料填寫");
        setNotificationPath("/personal-info");
        setShowNotification(true);
        return;
      }

      try {
        const today = new Date().toISOString().split("T")[0];
        console.log("📅 今天日期:", today);
        const mealsResponse = await fetchDailyData(userId, today);
        console.log("📦 後端回傳 meals:", mealsResponse);

        if (mealsResponse?.success && mealsResponse?.data) {
          const mealsComplete = checkMealCompleteness(mealsResponse.data);
          if (mealsComplete) {
            setMessage("感謝您完整填寫資料～請至個人資料頁面生成個人化報告");
            setModalOpen(true);
          } else {
            const missingMeal = getMissingMeal(mealsResponse.data);
            setSelectedMeal(missingMeal);
            setMessage(
              `感謝您完整填寫個人資料～現在來紀錄今天的${missingMeal}，讓問診流程更加順利吧！`
            );
            setShowMealButton(true);
          }
        }
      } catch (mealError) {
        console.warn("⚠️ 餐點資料取得失敗:", mealError);
        setSelectedMeal("早餐");
        setMessage(
          "感謝您完整填寫個人資料～現在來紀錄今天的早餐，讓問診流程更加順利吧！"
        );
        setShowMealButton(true);
      }
    } catch (err) {
      console.error("❌ Error details:", err);
      setError(err.message || "系統發生錯誤，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => setModalOpen(false);
  const goToProfile = () => {
    navigate("/personal-info");
    handleCloseModal();
  };
  const refreshPage = () => window.location.reload();
  const handleMealRecord = () => {
    if (selectedMeal) {
      setInitialMealType(selectedMeal);
      setShowDietSection(true);
    }
  };
  const handleNotificationConfirm = () => {
    setShowNotification(false);
    navigate(notificationPath);
  };

  useEffect(() => {
    checkUserData();
  }, [navigate]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="ai-chatbox">
      {showNotification && (
        <motion.div
          className="notification-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="notification"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p>{message}</p>
            <button
              className="notification-button"
              onClick={handleNotificationConfirm}
            >
              前往填寫
            </button>
          </motion.div>
        </motion.div>
      )}
      <motion.div
        className="chat-message"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p>{message}</p>
        {showMealButton && (
          <motion.button
            className="meal-record-button"
            onClick={handleMealRecord}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {`前往填寫${selectedMeal || "飲食紀錄"}`}
          </motion.button>
        )}
      </motion.div>
      <div style={styles.mealContainer}>
        <div style={styles.mealContent}>
          {showDietSection && (
            <DietSection
              userid={localStorage.getItem("userid")}
              date={new Date().toISOString().split("T")[0]}
              dailyRecord={dailyRecord}
              initialMealType={initialMealType}
              onUpdateDiet={(newData) => {
                setDailyRecord((prev) => ({
                  ...prev,
                  [newData.diet_time_type]: newData,
                }));
                setShowDietSection(false);
                checkUserData();
              }}
              onSaveSuccess={refreshPage}
            />
          )}
        </div>
      </div>
      <Dialog open={modalOpen} onClose={handleCloseModal}>
        <DialogTitle>成功</DialogTitle>
        <DialogContent>
          感謝您完整填寫資料～請至個人資料頁面生成個人化報告
        </DialogContent>
        <DialogActions>
          <Button onClick={goToProfile} color="primary" variant="contained">
            前往個人資料頁面
          </Button>
          <Button onClick={handleCloseModal} color="secondary">
            關閉
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AIChatbox;

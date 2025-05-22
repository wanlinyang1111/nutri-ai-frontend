/**
 * @component DietSection
 * @description 飲食記錄區塊元件
 *
 * 用途：
 * - 提供使用者記錄每日五個時段（早餐、午餐、下午茶、晚餐、宵夜）的飲食資料
 * - 每個餐別可記錄：時間、飲食內容、圖片、是否跳過該餐
 * - 支援圖片上傳與即時更新後回填至父層 dailyRecord
 *
 * 使用：
 * - 點擊「新增」或「編輯」進入 modal 彈窗
 * - 儲存後資料將傳送至後端，並透過 onUpdateDiet 回傳資料給父元件更新
 */

import React, { useState } from "react";
import "../styles/dietSection.css";
import { submitDailyData } from "../utils/apiCalls";

/**
 * DietSection 元件
 * @param {string} userid - 用戶ID
 * @param {string} date - 當前日期
 * @param {object} dailyRecord - 當日飲食紀錄資料
 * @param {function} onUpdateDiet - 更新飲食資料的回調函數
 * @param {string} selectedDate - 選擇的日期
 */
export const DietSection = ({
  userid,
  date,
  dailyRecord,
  onUpdateDiet,
  selectedDate,
}) => {
  // 控制彈窗顯示狀態
  const [activeModal, setActiveModal] = useState(null);

  // ⏳ 使用者目前正在編輯的餐別資料暫存區
  // 包含時間、內容、圖片、是否跳過
  const [tempData, setTempData] = useState({
    diet_time: "", // 餐點時間（datetime-local 格式）
    diet_time_type: "", // 餐點類型（例如 "午餐"）
    diet_content: "", // 餐點內容（字串，可用逗號分隔）
    diet_images: null, // 圖片 FileList
    skipMeal: false, // 是否跳過該餐
  });

  // 載入狀態
  const [loading, setLoading] = useState(false);
  // 錯誤訊息
  const [error, setError] = useState(null);
  // 重整提示顯示狀態
  const [showRefreshNotice, setShowRefreshNotice] = useState(false);
  // 已選擇的檔案名稱列表
  const [selectedFileNames, setSelectedFileNames] = useState([]);

  // 用餐時段配置
  const meals = [
    { id: "早餐", label: "早餐", icon: "/images/breakfast.png" },
    { id: "午餐", label: "午餐", icon: "/images/lunch-box.png" },
    { id: "下午茶", label: "下午茶", icon: "/images/afternoon-tea.png" },
    { id: "晚餐", label: "晚餐", icon: "/images/dinner.png" },
    { id: "宵夜", label: "宵夜", icon: "/images/night-snack.png" },
  ];

  /**
   * 開啟編輯用餐紀錄彈窗
   * @param {string} mealId - 用餐時段ID
   */
  const openModal = (mealId) => {
    const existingData = dailyRecord[mealId];
    if (existingData) {
      let timeValue = existingData.diet_time
        ? existingData.diet_time.replace(" ", "T").slice(0, 16)
        : "";
      setTempData({
        diet_time: timeValue,
        diet_time_type: mealId,
        diet_content: Array.isArray(existingData.diet_content)
          ? existingData.diet_content.join(", ")
          : existingData.diet_content || "",
        diet_images: null,
        skipMeal: false,
      });
    } else {
      const initialTime = selectedDate ? `${selectedDate}T00:00` : "";
      setTempData({
        diet_time: initialTime,
        diet_time_type: mealId,
        diet_content: "",
        diet_images: null,
        skipMeal: false,
      });
    }
    setActiveModal(mealId);
    setError(null);
  };

  const closeModal = () => {
    setActiveModal(null);
    setTempData({
      diet_time: "",
      diet_time_type: "",
      diet_content: "",
      diet_images: null,
      skipMeal: false,
    });
    setError(null);
  };

  const handleSave = async () => {
    try {
      const userIdFromStorage = localStorage.getItem("userid");
      if (!userIdFromStorage) {
        setError("請先登入");
        return;
      }

      if (!tempData.diet_time) {
        alert("請選擇時間");
        return;
      }

      let fd = new FormData();
      const dataJson = {
        userid: userIdFromStorage,
        diet_time: tempData.diet_time.replace("T", " ") + ":00",
        diet_time_type: tempData.diet_time_type,
        diet_content: tempData.skipMeal
          ? ["沒吃"]
          : tempData.diet_content.split(",").map((s) => s.trim()),
      };

      fd.append("data", JSON.stringify(dataJson));

      if (!tempData.skipMeal && tempData.diet_images) {
        for (let i = 0; i < tempData.diet_images.length; i++) {
          fd.append("image", tempData.diet_images[i]);
        }
      }

      setLoading(true);
      setError(null);
      const response = await submitDailyData(fd);

      if (response.success) {
        onUpdateDiet({
          ...dataJson,
          skipMeal: tempData.skipMeal,
          diet_content: tempData.skipMeal ? "不吃" : dataJson.diet_content,
          diet_image: response.newImages || null,
        });
        closeModal();
      } else {
        setError(response.message || "儲存失敗");
      }
    } catch (err) {
      console.error("handleSave Error:", err);
      setError("儲存失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  const handleTempChange = (field, value) => {
    setTempData((prev) => {
      if (field === "skipMeal") {
        return {
          ...prev,
          skipMeal: value,
          diet_content: value ? "沒吃" : "",
        };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleFileChange = (files) => {
    const fileNames = Array.from(files).map((file) => file.name);
    setSelectedFileNames(fileNames);
    handleTempChange("diet_images", files);
  };

  const extractImagePaths = (imgData) => {
    try {
      if (!imgData) return [];
      if (Array.isArray(imgData)) return imgData;
      if (typeof imgData === "string") {
        try {
          const parsed = JSON.parse(imgData);
          if (parsed && parsed.path) return [parsed.path];
          return [imgData];
        } catch {
          return [imgData];
        }
      }
      if (typeof imgData === "object" && imgData !== null && imgData.path) {
        return [imgData.path];
      }
    } catch (e) {
      console.warn("❌ 無法解析 diet_img_path", e);
    }
    return [];
  };

  const renderMealContent = (mealId) => {
    const mealData = dailyRecord[mealId];
    if (!mealData) return null;
    return (
      <div className="meal-data">
        <div className="meal-info">
          {mealData.skipMeal ? (
            <span className="skip-meal-text">不吃</span>
          ) : (
            <>
              <div>{mealData.diet_time}</div>
              <div>
                {Array.isArray(mealData.diet_content)
                  ? mealData.diet_content.join(", ")
                  : mealData.diet_content}
              </div>
            </>
          )}
        </div>
        {extractImagePaths(mealData.diet_img_path).map((imgUrl, idx) => (
          <img
            key={idx}
            src={
              imgUrl.startsWith("http")
                ? imgUrl
                : `https://flaskapi.avatarmedicine.xyz/${imgUrl}`
            }
            alt={`${mealId}照片-${idx}`}
            className="meal-thumbnail"
          />
        ))}
        <button
          className="edit-record-button"
          onClick={(e) => {
            e.stopPropagation();
            openModal(mealId);
          }}
        >
          編輯記錄
        </button>
      </div>
    );
  };

  return (
    <div className="diet-section">
      <h3 className="section-title">飲食紀錄</h3>
      {loading && <div className="loading">載入中...</div>}
      {error && <div className="error">{error}</div>}
      {showRefreshNotice && (
        <div className="refresh-notice">
          已成功上傳照片，如未立即顯示，請重新整理頁面。
        </div>
      )}
      {!loading && !error && (
        <div className="meals-container">
          {meals.map((meal) => (
            <div key={meal.id} className="meal-item">
              <div
                className={`meal-content ${
                  dailyRecord[meal.id] ? "has-data" : ""
                }`}
                onClick={() => !dailyRecord[meal.id] && openModal(meal.id)}
              >
                <img src={meal.icon} alt={meal.label} className="meal-icon" />
                <div className="meal-label">{meal.label}</div>
                {dailyRecord[meal.id] && (
                  <span className="has-data-indicator">✓</span>
                )}
                {renderMealContent(meal.id)}
                {!dailyRecord[meal.id] && (
                  <button
                    className="add-button"
                    onClick={() => openModal(meal.id)}
                  >
                    新增
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {activeModal && (
        <div className="meal-modal-overlay">
          <div className="meal-modal">
            <h3>{meals.find((m) => m.id === activeModal)?.label}</h3>

            <div className="skip-meal-field">
              <label className="skip-meal-label">
                <input
                  type="checkbox"
                  checked={tempData.skipMeal}
                  onChange={(e) =>
                    handleTempChange("skipMeal", e.target.checked)
                  }
                />
                不吃
              </label>
            </div>

            <div className="diet-time-field">
              <label>{tempData.skipMeal ? "不吃時間" : "飲食時間"}:</label>
              <input
                type="datetime-local"
                value={tempData.diet_time || ""}
                onChange={(e) => handleTempChange("diet_time", e.target.value)}
                required
              />
            </div>

            {!tempData.skipMeal && (
              <>
                <div className="diet-content-field">
                  <label>飲食內容:</label>
                  <textarea
                    value={tempData.diet_content || ""}
                    onChange={(e) =>
                      handleTempChange("diet_content", e.target.value)
                    }
                    placeholder="例如：牛奶, 麵包..."
                    required
                  />
                </div>
                <div className="diet-image-field">
                  <label>上傳照片(至多三張):</label>
                  <label htmlFor="file-upload" className="custom-file-upload">
                    選擇檔案
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileChange(e.target.files)}
                    style={{ display: "none" }}
                  />
                  {selectedFileNames.length > 0 && (
                    <div className="file-names">
                      <p>已選擇檔案:</p>
                      <ul>
                        {selectedFileNames.map((name, index) => (
                          <li key={index}>{name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="modal-buttons">
              <button onClick={closeModal}>取消</button>
              <button onClick={handleSave} className="save-button">
                儲存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

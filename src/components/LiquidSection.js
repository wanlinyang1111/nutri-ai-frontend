/*
 * 飲水記錄區塊元件（目前隱藏）
 */

import React, { useState } from "react";
import "../styles/liquidSection.css";
import questionsData from "../data/dailyrecord.json";

const LiquidSection = ({ dailyRecord, handleInputChange }) => {
  const [activeModal, setActiveModal] = useState(null);
  const [tempData, setTempData] = useState({
    liquid_time: "",
    liquid_name: "",
    volume: "",
  });

  const drinks = [
    {
      id: "water",
      label: "水",
      icon: "💧",
    },
    {
      id: "drink",
      label: "飲料",
      icon: "🥤",
    },
    {
      id: "soymilk",
      label: "豆漿",
      icon: "🥛",
    },
  ];

  const openModal = (drinkId) => {
    setActiveModal(drinkId);
    // 從 dailyRecord 中獲取已存在的數據
    setTempData({
      liquid_time: dailyRecord[`${drinkId}_time`] || "",
      liquid_name: dailyRecord[`${drinkId}_name`] || "",
      volume: dailyRecord[`${drinkId}_volume`] || "",
    });
  };

  const closeModal = () => {
    setActiveModal(null);
    setTempData({
      liquid_time: "",
      liquid_name: "",
      volume: "",
    });
  };

  const handleSave = () => {
    // 保存所有欄位
    handleInputChange({
      target: {
        name: `${activeModal}_time`,
        value: tempData.liquid_time,
      },
    });
    handleInputChange({
      target: {
        name: `${activeModal}_name`,
        value: tempData.liquid_name,
      },
    });
    handleInputChange({
      target: {
        name: `${activeModal}_volume`,
        value: tempData.volume,
      },
    });
    closeModal();
  };

  const handleTempChange = (field, value) => {
    setTempData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  //style={{ display: 'none' }} 加這行可以隱藏整個區塊//

  return (
    <div style={{ display: "none" }} className="liquid-section">
      <h3 className="section-title">飲水紀錄</h3>
      <div className="drinks-grid">
        {drinks.map((drink) => (
          <div key={drink.id} className="drink-item">
            <div className="drink-icon" onClick={() => openModal(drink.id)}>
              <div className="cup-container">
                <div className="cup">
                  {dailyRecord[`${drink.id}_volume`] && (
                    <div
                      className="cup-fill"
                      style={{
                        height: `${Math.min(
                          parseInt(dailyRecord[`${drink.id}_volume`]) / 10,
                          100
                        )}%`,
                      }}
                    />
                  )}
                </div>
                <span className="emoji-icon">{drink.icon}</span>
              </div>
              <div className="drink-label">{drink.label}</div>
              {dailyRecord[`${drink.id}_volume`] && (
                <div className="amount">
                  {dailyRecord[`${drink.id}_volume`]}ml
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {activeModal && (
        <div className="liquid-modal-overlay">
          <div className="liquid-modal">
            <h3>{drinks.find((d) => d.id === activeModal)?.label}</h3>

            <div className="input-group">
              <label>飲用時間</label>
              <input
                type="time"
                value={tempData.liquid_time}
                onChange={(e) =>
                  handleTempChange("liquid_time", e.target.value)
                }
                className="time-input"
              />
            </div>

            <div className="input-group">
              <label>飲品名稱</label>
              <input
                type="text"
                value={tempData.liquid_name}
                onChange={(e) =>
                  handleTempChange("liquid_name", e.target.value)
                }
                placeholder="請輸入飲品名稱"
                className="name-input"
              />
            </div>

            <div className="input-group">
              <label>飲用量 (ml)</label>
              <div className="volume-input-container">
                <input
                  type="number"
                  value={tempData.volume}
                  onChange={(e) => handleTempChange("volume", e.target.value)}
                  placeholder="請輸入飲用量"
                  className="volume-input"
                />
                <span className="unit">ml</span>
              </div>
            </div>

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

export default LiquidSection;

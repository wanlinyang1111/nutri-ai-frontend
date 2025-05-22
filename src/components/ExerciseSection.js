/*
 * 運動記錄區塊元件（目前隱藏）
 */

import React, { useState } from "react";
import "../styles/exerciseSection.css";
import questionsData from "../data/dailyrecord.json";

const ExerciseSection = ({ dailyRecord, handleInputChange }) => {
  const [activeModal, setActiveModal] = useState(null);
  const [tempExercise, setTempExercise] = useState({
    exercise_type: "",
    start_time: "",
    duration: "",
  });

  const openModal = () => {
    setActiveModal(true);
    setTempExercise({
      exercise_type: dailyRecord.exercise_type || "",
      start_time: dailyRecord.start_time || "",
      duration: dailyRecord.duration || "",
    });
  };

  const closeModal = () => {
    setActiveModal(false);
    setTempExercise({
      exercise_type: "",
      start_time: "",
      duration: "",
    });
  };

  const handleSave = () => {
    // 更新所有運動相關欄位
    Object.keys(tempExercise).forEach((key) => {
      handleInputChange({
        target: {
          name: key,
          value: tempExercise[key],
        },
      });
    });
    closeModal();
  };

  const handleTempChange = (field, value) => {
    setTempExercise((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  //style={{ display: 'none' }} 加這行可以隱藏整個區塊//

  return (
    <div style={{ display: "none" }} className="exercise-section">
      <h3 className="section-title">運動紀錄</h3>
      <div className="exercise-summary" onClick={openModal}>
        {dailyRecord.exercise_type ? (
          <div className="exercise-info">
            <p>運動類型：{dailyRecord.exercise_type}</p>
            <p>開始時間：{dailyRecord.start_time}</p>
            <p>持續時間：{dailyRecord.duration}</p>
          </div>
        ) : (
          <div className="add-exercise">
            <span className="add-icon">+</span>
            <p>新增運動紀錄</p>
          </div>
        )}
      </div>

      {activeModal && (
        <div className="exercise-modal-overlay">
          <div className="exercise-modal">
            <h3>運動紀錄</h3>
            {questionsData.exerciseFields.map((field) => (
              <div key={field.name} className="field-container">
                <label>{field.label}</label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={tempExercise[field.name] || ""}
                  onChange={(e) => handleTempChange(field.name, e.target.value)}
                />
              </div>
            ))}
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

export default ExerciseSection;

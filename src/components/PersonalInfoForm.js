/**
 * @component 個人資料表單元件 PersonalInfoForm
 * @description 處理使用者的個人資訊輸入與編輯。
 *
 * 功能：
 * - 讀取用戶資料（透過 fetchBaseData）
 * - 動態渲染表單（根據 questions.json 配置）
 * - 提交表單（submitPersonalInfo）
 * - 內建生日轉民國年選擇器、年齡即時計算
 * - 支援預覽 / 編輯模式切換、欄位錯誤提示與展開控制
 *
 * 主要狀態資料 formData 結構：
 * {
 *   birth_date: "1996-11-11",
 *   calculated_age: "28 歲 6 個月",
 *   language: "中文",
 *   ...（其餘欄位來自 questions.json）
 * }
 */

import React, { useState, useEffect } from "react";
import "../styles/personalInfoForm.css";
import questionsData from "../data/questions.json";
import { submitPersonalInfo, fetchBaseData } from "../utils/apiCalls";
import { FaCog } from "react-icons/fa";

/* 組件功能說明：
1. calculateAge：計算年齡
2. formatChineseDate：日期格式轉換
3. TaiwanDatePicker：民國年日期選擇器
*/

/**
 * 計算年齡函數
 * @param {string} birthdayString - 生日字串，格式為 'YYYY-MM-DD'
 * @returns {string} - 返回計算後的年齡字串
 * @description 根據輸入的生日計算目前的年齡（年份差異）和月份
 */
function calculateAge(birthdayString) {
  // 參數驗證：若無生日資料則返回空字串
  if (!birthdayString) return "";
  const birthDate = new Date(birthdayString);
  if (isNaN(birthDate.getTime())) return "";

  const now = new Date();

  // 計算年齡差異
  let yearDiff = now.getFullYear() - birthDate.getFullYear();
  let monthDiff = now.getMonth() - birthDate.getMonth();
  let dayDiff = now.getDate() - birthDate.getDate();

  // 計算總月份差
  let totalMonths = yearDiff * 12 + monthDiff;

  // 日期差異處理：若當月未到生日日期，需減去一個月
  if (dayDiff < 0) {
    totalMonths--;
  }

  // 防止未來日期：確保不會出現負數月份
  if (totalMonths < 0) {
    totalMonths = 0;
  }

  // 計算歲、月
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  return `${years} 歲 ${months} 個月`;
}

// 格式化生日 (回傳 "YYYY年MM月DD日")
function formatChineseDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString; // 若無法解析，直接顯示原字串
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
}

function TaiwanDatePicker({ value, onChange }) {
  const [taiwanYear, setTaiwanYear] = useState(
    value ? value.split("-")[0] : ""
  ); // 民國年
  const [month, setMonth] = useState(value ? value.split("-")[1] : ""); // 月
  const [day, setDay] = useState(value ? value.split("-")[2] : ""); // 日

  // 更新年份、月份、日期
  const handleYearChange = (e) => {
    const year = e.target.value;
    setTaiwanYear(year);
    updateGregorianDate(year, month, day);
  };

  const handleMonthChange = (e) => {
    const month = e.target.value;
    setMonth(month);
    updateGregorianDate(taiwanYear, month, day);
  };

  const handleDayChange = (e) => {
    const day = e.target.value;
    setDay(day);
    updateGregorianDate(taiwanYear, month, day);
  };

  // 將民國日期轉換為西元日期並回傳
  const updateGregorianDate = (year, month, day) => {
    if (year && month && day) {
      const gregorianYear = parseInt(year) + 1911;
      const gregorianDate = `${gregorianYear}-${month.padStart(
        2,
        "0"
      )}-${day.padStart(2, "0")}`;
      onChange(gregorianDate); // 回傳西元日期
    }
  };

  return (
    <div className="taiwan-date-picker">
      <select value={taiwanYear} onChange={handleYearChange}>
        <option value="">民國年</option>
        {Array.from({ length: 120 }, (_, i) => 113 - i).map((year) => (
          <option key={year} value={year}>
            民國 {year} 年
          </option>
        ))}
      </select>
      <select value={month} onChange={handleMonthChange}>
        <option value="">月</option>
        {Array.from({ length: 12 }, (_, i) => (
          <option key={i + 1} value={i + 1}>
            {i + 1} 月
          </option>
        ))}
      </select>
      <select value={day} onChange={handleDayChange}>
        <option value="">日</option>
        {Array.from({ length: 31 }, (_, i) => (
          <option key={i + 1} value={i + 1}>
            {i + 1} 日
          </option>
        ))}
      </select>
    </div>
  );
}

const PersonalInfoForm = ({ userId }) => {
  const [isEditMode, setIsEditMode] = useState(false);

  // 初始狀態：把所有欄位 name 都設成空字串
  const [formData, setFormData] = useState(() => {
    const initialData = {};
    questionsData.forEach((section) => {
      section.fields.forEach((field) => {
        initialData[field.name] = "";
      });
    });
    return initialData;
  });

  const [expandedSections, setExpandedSections] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const questions = questionsData;
  const [userid, setUserid] = useState(null);
  const [hasData, setHasData] = useState(false);

  // 1. 取得 userid
  useEffect(() => {
    const storedUserid = localStorage.getItem("userid");
    if (storedUserid) {
      setUserid(storedUserid);
    }
  }, []);

  // 2. 取得用戶資料
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await fetchBaseData();
        console.log("Fetched data:", data);

        if (data && data.data && data.data[0]) {
          // 從後端拿到資料
          const userObj = data.data[0];

          // 若已有生日，先計算年齡 & 格式化日期
          const birthDateValue = userObj.birth_date;
          const ageText = calculateAge(birthDateValue);

          setFormData({
            ...userObj,
            calculated_age: ageText,
          });

          // 判斷是否已有資料
          setHasData(Object.values(userObj).some((value) => value !== ""));
        } else {
          console.error("Unexpected data format:", data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (userid) {
      console.log("Current userid:", userid);
      fetchUserData();
    }
  }, [userid]);

  // 3. 輸入變動
  const handleChange = (e) => {
    const { name, value } = e.target;

    // 更新狀態
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // 若是 "生日" 欄位，立即計算年齡
    if (name === "birth_date") {
      const ageText = calculateAge(value);
      setFormData((prevData) => ({
        ...prevData,
        birth_date: value,
        calculated_age: ageText,
      }));
    }
  };

  // 4. 驗證表單
  const validateForm = () => {
    const newErrors = {};
    questions.forEach((section) => {
      section.fields.forEach((field) => {
        if (field.required && !formData[field.name]) {
          newErrors[field.name] = "必填";
        } else if (field.type === "number" && formData[field.name]) {
          if (isNaN(Number(formData[field.name]))) {
            newErrors[field.name] = "請輸入有效的數字";
          }
        }
      });
    });
    return newErrors;
  };

  // 5. 區塊展開/收合
  const toggleSection = (sectionName) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  // 6. 提交表單
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    let newExpandedSections = { ...expandedSections };

    // 如果欄位有錯誤，展開該區段
    questions.forEach((section) => {
      section.fields.forEach((field) => {
        if (formErrors[field.name]) {
          newExpandedSections[section.section] = true;
        }
      });
    });
    setExpandedSections(newExpandedSections);
    setErrors(formErrors);

    // 將空字串改為 null
    const updatedFormData = { ...formData };
    Object.keys(updatedFormData).forEach((key) => {
      if (updatedFormData[key] === "") {
        updatedFormData[key] = null;
      }
    });

    // 不將 "calculated_age" 傳到後端
    delete updatedFormData.calculated_age;

    // 若無錯誤則送出
    if (Object.keys(formErrors).length === 0) {
      setIsSubmitting(true);
      setSubmissionStatus(null);

      try {
        const dataToSubmit = { data: { ...updatedFormData, userid } };
        const response = await submitPersonalInfo(dataToSubmit);
        console.log("資料提交成功", response);
        setSubmissionStatus("success");
        alert("資料提交成功！");
        setIsEditMode(false); // 切回預覽模式
        window.location.reload(); // 刷新畫面以載入最新資料
      } catch (error) {
        console.error("提交資料時發生錯誤:", error);
        setSubmissionStatus("error");
        alert("提交失敗，請稍後再試！");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // 7. 渲染單一欄位
  const renderField = (field) => {
    const value = formData[field.name] || "";

    // 「預覽模式」 → 顯示文字
    if (!isEditMode) {
      // 如果是生日欄位，格式化顯示 "YYYY年MM月DD日"
      if (field.name === "birth_date" && value) {
        return <div className="field-value">{formatChineseDate(value)}</div>;
      }
      // 其餘欄位直接顯示
      return <div className="field-value">{value}</div>;
    }

    // 「編輯模式」
    const commonProps = {
      name: field.name,
      value: value,
      onChange: handleChange,
      placeholder: field.placeholder || "",
      required: field.required || false,
    };

    // 年齡欄位 (calculated_age) 設為唯讀
    if (field.name === "calculated_age") {
      return <input type="text" {...commonProps} readOnly />;
    }

    if (field.name === "birth_date") {
      return (
        <TaiwanDatePicker
          value={formData.birth_date}
          onChange={(value) =>
            handleChange({ target: { name: "birth_date", value } })
          }
        />
      );
    }

    switch (field.type) {
      case "select":
        return (
          <select {...commonProps}>
            <option value="">請選擇</option>
            {field.options.map((option, idx) => (
              <option key={idx} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case "textarea":
        return <textarea {...commonProps}></textarea>;
      default:
        return <input type={field.type} {...commonProps} />;
    }
  };

  // 8. 若尚未填寫資料 + 非編輯模式 → 顯示提示
  if (!hasData && !isEditMode) {
    return (
      <div className="personal-info-form">
        <div className="form-header">
          <h2>個人資料</h2>
          <button
            type="button"
            onClick={() => setIsEditMode(true)}
            className="edit-toggle-button"
          >
            <FaCog />
          </button>
        </div>
        <div className="no-data-alert">
          <p>尚未填寫個人資料，請點擊齒輪圖標進行編輯。</p>
          <button
            type="button"
            onClick={() => setIsEditMode(true)}
            className="edit-toggle-button"
          >
            開始編輯個人資料
          </button>
        </div>
      </div>
    );
  }

  // 9. 主渲染
  return (
    <div className="personal-info-form">
      <div className="form-header">
        <h2>個人資料</h2>
        <button
          type="button"
          onClick={() => setIsEditMode(!isEditMode)}
          className="edit-toggle-button"
        >
          <FaCog />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {questions.map((section, index) => (
          <div
            key={index}
            className={`section-container ${
              expandedSections[section.section] ? "expanded" : ""
            }`}
          >
            <div
              className="section-header"
              onClick={() => isEditMode && toggleSection(section.section)}
            >
              <h3>{section.section}</h3>
              {isEditMode && (
                <div
                  className={`toggle-icon ${
                    expandedSections[section.section] ? "open" : ""
                  }`}
                >
                  ▼
                </div>
              )}
            </div>
            {(expandedSections[section.section] || !isEditMode) && (
              <div className="section-content">
                {section.fields.map((field, idx) => {
                  const value = formData[field.name];
                  // 預覽模式下，若為空則不顯示
                  if (!isEditMode && (!value || value === "")) {
                    return null;
                  }
                  return (
                    <div key={idx} className="form-group">
                      <label>
                        {field.label}
                        {field.required && (
                          <span style={{ color: "red" }}>*</span>
                        )}
                      </label>
                      {renderField(field)}
                      {errors[field.name] && (
                        <span style={{ color: "red" }}>
                          {errors[field.name]}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
        {isEditMode && (
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "儲存中..." : "儲存"}
          </button>
        )}
        {submissionStatus && (
          <div
            className={`submission-status ${
              submissionStatus === "success" ? "success" : "error"
            }`}
          >
            {submissionStatus === "success"
              ? "資料提交成功！"
              : "提交失敗，請稍後再試！"}
          </div>
        )}
      </form>
    </div>
  );
};

export default PersonalInfoForm;

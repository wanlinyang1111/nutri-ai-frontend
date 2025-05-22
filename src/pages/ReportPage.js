/**
 * @file ReportPage.jsx
 * @description 個人化健康報告頁面
 *
 * 功能：
 * - 顯示四大區塊：
 *   1. 必填個人資訊 (RequiredInfo)
 *   2. AI 分析摘要 (AISummary)
 *   3. 其他個資補充 (OthersInfo)
 *   4. 三日飲食總表 (DietRecord)
 * - 從 location.state 傳入 userId，並傳遞至各子元件
 * - 提供返回按鈕回到 /personal-info
 */

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ReportPage.css";
import questionsData from "../data/questions.json";
import {
  fetchBaseData,
  fetchDailyData,
  fetchGenerateReport,
} from "../utils/apiCalls";

const formatChineseDate = (dateString) => {
  if (!dateString) return "未填寫";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekDay = ["日", "一", "二", "三", "四", "五", "六"][date.getDay()];

  return `${year}年${month}月${day}日 星期${weekDay}`;
};

const calculateAge = (birthdayString) => {
  if (!birthdayString) return "未填寫";
  const birthDate = new Date(birthdayString);
  if (isNaN(birthDate.getTime())) return "未填寫";

  const now = new Date();
  let yearDiff = now.getFullYear() - birthDate.getFullYear();
  let monthDiff = now.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && now.getDate() < birthDate.getDate())
  ) {
    yearDiff--;
  }

  return `${yearDiff}歲`;
};

const RequiredInfo = ({ userId }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await fetchBaseData(userId);
        if (response.success && response.data.length > 0) {
          setUserData(response.data[0]);
        }
      } catch (err) {
        setError("資料載入失敗");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      getUserData();
    }
  }, [userId]);

  const getRequiredFields = () => {
    const required = [];
    questionsData.forEach((section) => {
      section.fields?.forEach((field) => {
        if (field.required) {
          required.push({
            label: field.label,
            name: field.name,
          });
        }
      });
    });
    return required;
  };

  if (loading) return <div>載入中...</div>;
  if (error) return <div>{error}</div>;

  const requiredFields = getRequiredFields();

  return (
    <div className="report-section">
      <h2>必要資訊</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {requiredFields.map((field, index) => (
          <li key={index} style={{ margin: "10px 0" }}>
            <span style={{ fontWeight: "bold" }}>{field.label}：</span>
            <span>
              {field.name === "birth_date" ? (
                <>
                  {formatChineseDate(userData?.[field.name])} (
                  {calculateAge(userData?.[field.name])})
                </>
              ) : (
                userData?.[field.name] || "未填寫"
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const AISummary = ({ userId }) => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      if (!userId) {
        setError("無法識別用戶");
        setLoading(false);
        return;
      }

      try {
        const data = await fetchGenerateReport(userId);
        console.log("👁 API 回傳內容：", data); // <== 加這行

        if (data && data.AI_response) {
          console.log("🧠 回傳文字內容：", JSON.stringify(data.AI_response)); // ⬅️ 加在這
          setReportData(data.AI_response);
        } else {
          throw new Error("無法生成報告內容");
        }
      } catch (err) {
        setError(err.message);
        console.error("報告生成失敗:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [userId]);

  if (loading)
    return (
      <div className="report-section">
        <h2>AI 分析報告</h2>
        <div className="loading-message">正在生成個人化報告，請稍候...</div>
      </div>
    );

  if (error)
    return (
      <div className="report-section">
        <h2>AI 分析報告</h2>
        <div className="error-message">{error}</div>
      </div>
    );

  return (
    <div className="report-section">
      <h2>AI 分析報告</h2>
      <div className="ai-summary-content">
        {reportData && (
          <div className="analysis-section">
            <div
              className="markdown-content"
              style={{ whiteSpace: "pre-wrap" }}
            >
              {reportData}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const OthersInfo = ({ userId }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await fetchBaseData();
        if (response.success && response.data.length > 0) {
          setUserData(response.data[0]);
        }
      } catch (err) {
        setError("資料載入失敗");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      getUserData();
    }
  }, [userId]);

  const getNonGeneralSections = () => {
    const sections = [];
    questionsData.forEach((section) => {
      if (section.section !== "一般資訊") {
        const sectionFields = section.fields.map((field) => ({
          label: field.label,
          name: field.name,
        }));
        sections.push({
          section: section.section,
          fields: sectionFields,
        });
      }
    });
    return sections;
  };

  if (loading) return <div>載入中...</div>;
  if (error) return <div>{error}</div>;
  if (!userData) return <div>無填寫資料</div>;

  const sections = getNonGeneralSections();

  return (
    <div className="report-section">
      <h2>其他資訊</h2>
      {sections.map((section, sIndex) => (
        <div key={sIndex}>
          <h3>{section.section}</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {section.fields.map(
              (field, fIndex) =>
                userData[field.name] && (
                  <li key={fIndex} style={{ margin: "10px 0" }}>
                    <span style={{ fontWeight: "bold" }}>{field.label}：</span>
                    <span>{userData[field.name]}</span>
                  </li>
                )
            )}
          </ul>
        </div>
      ))}
    </div>
  );
};

const DietRecord = ({ userId }) => {
  const [dietRecords, setDietRecords] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getDietRecords = async () => {
      try {
        // 優先使用傳入的 userId，若無則從 localStorage 取得
        const uid = userId || localStorage.getItem("userid");
        if (!uid) {
          setError("請先登入");
          setLoading(false);
          return;
        }
        const today = new Date();
        const datePromises = [];
        const datesArray = [];

        // 只抓取最近 7 天的資料
        for (let i = 0; i < 3; i++) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split("T")[0];
          datesArray.push(dateStr);
          datePromises.push(fetchDailyData(uid, dateStr));
        }

        const responses = await Promise.all(datePromises);
        const allRecords = {};
        datesArray.forEach((dateStr) => {
          allRecords[dateStr] = {};
        });

        responses.forEach((response) => {
          if (response.success && response.data.length > 0) {
            response.data.forEach((record) => {
              // 將 record.diet_time 轉換為正確的 ISO 格式日期字串
              const recordDate = new Date(record.diet_time)
                .toISOString()
                .split("T")[0];
              if (allRecords.hasOwnProperty(recordDate)) {
                allRecords[recordDate][record.diet_time_type] = {
                  content: record.diet_content,
                  images: record.diet_img_path,
                };
              }
            });
          }
        });

        setDietRecords(allRecords);
      } catch (err) {
        setError("載入飲食紀錄失敗");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getDietRecords();
  }, [userId]);

  const mealTypes = ["早餐", "午餐", "下午茶", "晚餐", "宵夜"];

  const renderImages = (imageData) => {
    if (!imageData) return null;

    let paths = [];

    try {
      if (Array.isArray(imageData)) {
        // 直接是陣列
        paths = imageData;
      } else if (typeof imageData === "string") {
        // 嘗試解析為 JSON 字串
        const parsed = JSON.parse(imageData);
        if (parsed && parsed.path) {
          paths = [parsed.path];
        } else {
          // 若非 JSON，就當逗號分隔字串處理
          paths = imageData.split(",");
        }
      } else if (typeof imageData === "object" && imageData.path) {
        paths = [imageData.path];
      }
    } catch (e) {
      console.warn("❌ 圖片格式解析失敗:", e);
    }

    return paths.map((path, index) => (
      <img
        key={index}
        src={
          path.trim().startsWith("/static")
            ? path.trim()
            : `/static/diet_img/${path.trim()}`
        }
        alt={`餐點照片 ${index + 1}`}
        className="meal-thumbnail"
        onError={(e) => {
          e.target.style.display = "none";
        }}
      />
    ));
  };

  if (loading) return <div>載入中...</div>;
  if (error) return <div>{error}</div>;

  const sortedDates = [];
  for (let i = 0; i < 3; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    sortedDates.push(date.toISOString().split("T")[0]);
  }

  return (
    <div className="report-section">
      <h2>飲食紀錄總表</h2>
      <div className="diet-table-container">
        <table className="diet-table">
          <thead>
            <tr>
              <th>日期</th>
              {mealTypes.map((type) => (
                <th key={type}>{type}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedDates.map((dateStr) => (
              <tr key={dateStr}>
                <td>{formatChineseDate(dateStr)}</td>
                {mealTypes.map((type) => (
                  <td key={type}>
                    {dietRecords[dateStr] && dietRecords[dateStr][type] ? (
                      <div className="meal-cell">
                        <div>{dietRecords[dateStr][type].content}</div>
                        {renderImages(dietRecords[dateStr][type].images)}
                      </div>
                    ) : (
                      "－"
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate("/personal-info")}
      style={{
        position: "fixed",
        width: "20%",
        top: "10px",
        left: "0",
        padding: "10px 20px",
        backgroundColor: "rgba(70, 66, 66, 0.44)",
        color: "white",
        border: "none",
        borderTopRightRadius: "20px",
        borderBottomRightRadius: "20px",
        borderTopLeftRadius: "0",
        borderBottomLeftRadius: "0",
        fontSize: "1em",
        cursor: "pointer",
      }}
    >
      返回
    </button>
  );
};

const ReportPage = () => {
  const location = useLocation();
  const userId = location.state?.userId;
  console.log("📦 抓到的 userId：", userId); // <-- 加這行 debug

  return (
    <div className="report-page">
      <BackButton />
      <h1 className="report-main-title">個人化報告</h1>
      <RequiredInfo userId={userId} />
      <AISummary userId={userId} />
      <OthersInfo userId={userId} />
      <DietRecord userId={userId} />
    </div>
  );
};

export default ReportPage;

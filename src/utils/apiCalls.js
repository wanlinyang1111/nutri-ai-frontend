import axios from "axios";

// 🔐 從環境變數取得設定
const API_KEY = process.env.REACT_APP_API_KEY;
const BASE_URL = `${process.env.REACT_APP_API_BASE_URL}/api`;

// ✅ 共用 axios 實例
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": API_KEY,
  },
});

// 🚀 註冊帳號，成功後自動登入
export const registerUser = async (userData) => {
  try {
    const registerRes = await api.post("/signin", userData);
    if (registerRes.data.success) {
      const loginRes = await signinUser({
        userkey: userData.userkey,
        email: userData.email,
        passwd: userData.passwd,
      });
      return { ...registerRes.data, userid: loginRes.userid };
    }
    return registerRes.data;
  } catch (err) {
    console.error("❌ Register/Login failed:", err);
    throw err;
  }
};

// 🧩 使用者登入
export const signinUser = async (payload) => {
  const res = await api.post("/login", payload);
  return res.data;
};

// 📋 取得使用者基本資料
export const fetchBaseData = async () => {
  const userid = localStorage.getItem("userid");
  if (!userid) throw new Error("No userid found");
  const res = await api.get("/get", {
    params: { tablename: "basedata", userid },
  });
  return res.data;
};

// 📝 提交個人資料
export const submitPersonalInfo = async (formData) => {
  const userid = localStorage.getItem("userid");
  if (!userid) throw new Error("No userid found");
  const data = { userid, ...formData };
  const res = await api.post("/insert/basedata", data);
  return res.data;
};

// 📆 取得某天的三餐紀錄
export const fetchDailyData = async (userid, date) => {
  const res = await api.get("/get", {
    params: { tablename: "daily_d", userid, date },
  });
  return res.data;
};

// 📤 上傳每日三餐（含圖片）
export const submitDailyData = async (formData) => {
  const res = await axios.post(`${BASE_URL}/insert/daily_d`, formData, {
    headers: { "X-API-Key": API_KEY },
  });
  return res.data;
};

// 💬 建立新的聊天 session
export const createNewSession = async (userid) => {
  const res = await api.post("/new-session", { data: { userid } });
  return res.data;
};

// 💬 傳送新訊息
export const sendNewMessage = async (userid, session_id, content) => {
  const res = await api.post("/new-message", {
    data: { userid, session_id, content },
  });
  return res.data;
};

// 📜 取得特定聊天歷史訊息
export const getMessageHistory = async (userid, session_id) => {
  const res = await api.post("/get/message-history", {
    data: { userid, session_id: Number(session_id) },
  });
  return res.data;
};

// 🧾 取得聊天 session 列表
export const getSessionHistory = async (userid) => {
  const res = await api.post("/get/session-history", {
    data: { userid },
  });
  return res.data;
};

// ✅ 檢查是否有基本資料
export const checkUserBaseData = async (userid) => {
  const res = await api.get("/get", {
    params: { tablename: "basedata", userid },
  });
  return res.data?.success && res.data?.data?.length > 0;
};

// ✅ 檢查是否已填當日三餐
export const checkUserDailyMeal = async (userid, dateString) => {
  const res = await fetchDailyData(userid, dateString);
  return res?.success && res?.data?.length > 0;
};

// 📄 取得營養諮詢報告（非 GPT）
export const getConsultationReport = async (reportId) => {
  const res = await fetch(`/api/get/consultation_report/${reportId}`);
  if (!res.ok) throw new Error("Failed to fetch consultation report");
  return res.json();
};

// ✅ 初次登入檢查是否有缺資料
export const initialCheck = async (userId) => {
  const res = await api.get(`/get/initial_check/${userId}`);
  return res.data;
};

// 🧠 呼叫 GPT API，產生 AI 報告摘要
export const fetchGenerateReport = async (userId) => {
  const res = await api.get(`/get/generate_report/${userId}`);
  return res.data;
};

// 🧾 儲存簡易飲食資料（食物 + base64圖片）
export const saveDietData = async (payload) => {
  const data = {
    user_id: payload.userid,
    diet_time: payload.diet_time,
    diet_time_type: payload.diet_time_type,
    content: payload.diet_content,
    image_base64: payload.diet_img_path || null,
  };
  const res = await api.post("/save-diet", data);
  if (!res.data.success) throw new Error(res.data.message || "儲存失敗");
  return res.data;
};

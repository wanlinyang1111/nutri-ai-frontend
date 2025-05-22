/**
 * @file Regist.js
 * @description 使用者註冊頁面
 *
 * 功能：
 * - 提供 Email、密碼、確認密碼欄位，驗證後送出註冊請求
 * - 呼叫 registerUser() 將資料送往後端 API
 * - 註冊成功後將 userId 存入 localStorage，導向個人資料填寫頁（/personal-info）
 * - 使用 i18n 處理多語言提示與按鈕文字
 * - 預留 Apple / Google 註冊按鈕（目前僅前端 UI）
 *
 * 狀態管理：
 * - email / password / confirmPassword：綁定輸入欄位
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../utils/apiCalls";
import "../styles/regist.css";
import { useTranslation } from "react-i18next"; // 引入 i18n

const Regist = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation(); // 使用翻譯功能

  //handleRegister 函數 註冊處理流程：表單驗證 → 呼叫 API → 回應處理
  const handleRegister = async (e) => {
    e.preventDefault();

    //表單驗證: 確保所有欄位都有值
    if (!email || !password || !confirmPassword) {
      alert(t("signup.alert.fillFields")); // 提示填寫所有欄位
      return;
    }

    if (password !== confirmPassword) {
      alert(t("signup.alert.passwordMismatch")); // 密碼不一致提示
      return;
    }
    //建構請求數據
    try {
      const payload = {
        userkey: "key12345",
        email: email,
        passwd: password,
      };

      console.log("Attempting to register with:", { email }); // 記錄註冊嘗試

      // 調用 registerUser API ，傳遞 payload 進行註冊。
      const response = await registerUser(payload);
      console.log("Register response:", response); // 記錄註冊響應

      if (response.success) {
        localStorage.clear();
        localStorage.setItem("userid", response.userid);
        alert(t("signup.alert.success"));
        navigate("/personal-info"); // 導向初診對話頁面
      } else {
        console.error("Registration failed:", response.message);
        alert(t("signup.alert.failure") + response.message);
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert(t("signup.alert.networkError")); // 網絡錯誤提示
    }
  };

  return (
    <div className="home-container">
      <img
        src="/images/logo.png"
        alt="App Logo"
        className="logo"
        style={{ width: "200px", height: "auto" }}
      />
      <div className="form-container">
        <form onSubmit={handleRegister}>
          {/* Email 輸入欄位 */}
          <input
            type="email"
            placeholder={t("signup.email")} // 替換 placeholder
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {/* 密碼輸入欄位 */}
          <input
            type="password"
            placeholder={t("signup.password")} // 替換 placeholder
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* 再次輸入密碼 */}
          <input
            type="password"
            placeholder={t("signup.confirmPassword")} // 替換 placeholder
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <div className="button-container">
            {/* 註冊按鈕 */}
            <button type="submit">{t("signup.button")}</button>{" "}
            {/* 替換按鈕文字 */}
          </div>
        </form>

        {/* 其他註冊方式 */}
        <div className="other-register-options">
          <p>{t("signup.otherRegisterOptions")}</p> {/* 替換 "其他註冊方式" */}
          <div className="social-buttons">
            <button className="social-button">
              <img
                src="/images/ios-icon.png"
                alt="iOS Register"
                className="social-icon"
              />
            </button>
            <button className="social-button">
              <img
                src="/images/google-icon.png"
                alt="Google Register"
                className="social-icon"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Regist;

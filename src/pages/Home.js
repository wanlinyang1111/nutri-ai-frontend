/**
 * @file Home.js
 * @description 使用者登入頁面
 *
 * 功能：
 * - 提供 Email + 密碼登入
 * - 使用 signinUser() 呼叫後端 API，回傳後儲存 userId 到 localStorage
 * - 登入成功導向 /dashboard
 * - 支援 i18n 國際化（所有文字皆從翻譯鍵值取得）
 * - 預留社群登入（Google / iOS）
 * - 預留忘記密碼功能
 *
 * 狀態管理：
 * - email / password：綁定輸入欄位
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signinUser } from "../utils/apiCalls"; // 引入 signinUser 函數
import "../styles/home.css"; // 引入 home.css
import { useTranslation } from "react-i18next"; // 引入 i18n

const Home = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation(); // 使用翻譯功能

  // 處理登入
  const handleLogin = async (e) => {
    e.preventDefault(); // 防止頁面重新加載
    const payload = { email, passwd: password }; // 改為 passwd 而非 password

    try {
      // 呼叫 signinUser 進行登入
      const response = await signinUser(payload);

      if (response.success) {
        // 儲存 user id 到 localStorage
        localStorage.setItem("userid", response.userid);

        // 登入成功後跳轉到 Dashboard
        navigate("/dashboard");
      } else {
        alert(t("homePage.alert.failure") + response.message); // 多語言錯誤提示
      }
    } catch (error) {
      alert(t("homePage.alert.networkError")); // 多語言網絡錯誤提示
      console.error(error);
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
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder={t("homePage.email")} // 替換 placeholder
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder={t("homePage.password")} // 替換 placeholder
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <a href="/forgot-password" className="forgot-password">
            {t("homePage.forgotPassword")} {/* 替換忘記密碼 */}
          </a>

          <div className="button-container">
            <button type="submit">{t("homePage.button")}</button>{" "}
            {/* 替換按鈕文字 */}
          </div>
        </form>

        <div className="other-register-options">
          <p>{t("homePage.otherLoginOptions")}</p> {/* 替換 "其他登入方式" */}
          <div className="social-buttons">
            <button className="social-button">
              <img
                src="/images/ios-icon.png"
                alt={t("homePage.iosLogin")} // iOS 登入的翻譯
                className="social-icon"
              />
            </button>

            <button className="social-button">
              <img
                src="/images/google-icon.png"
                alt={t("homePage.googleLogin")} // Google 登入的翻譯
                className="social-icon"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next"; // 確保導入 initReactI18next
import en from "./en.json"; // 確保路徑正確
import zh from "./zh.json"; // 確保路徑正確
import ja from "./ja.json"; // 確保路徑正確

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    zh: {
      translation: zh,
    },
    ja: {
      translation: ja,
    },
  },
  lng: "zh", // 預設語言
  fallbackLng: "en", // 預設回退語言
  interpolation: {
    escapeValue: false, // React 已經處理過 XSS，這裡設置為 false
  },
});

export default i18n;

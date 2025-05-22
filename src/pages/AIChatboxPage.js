/**
 * @file AIChatboxPage.js
 * @description 使用者互動頁面，整合兩種飲食紀錄方式：
 *
 * 功能：
 * - 提供「語音輸入紀錄」按鈕，彈出 VoiceChatBox（語音 → GPT 分析 → 存入後端）
 * - 彈窗結束後可觸發回饋提示
 *
 * 元件整合：
 * - <Navbar />
 * - <AIChatbox />
 * - <VoiceChatBox />（放在 <Dialog /> 中）
 *
 * 使用者流程：
 * 1. 進入頁面直接看到 AIChatbox 對話建議
 * 2. 點擊按鈕 → 開啟語音輸入 modal
 * 3. 使用語音記錄三餐 → 成功後跳出提示與關閉彈窗
 */

import React, { useState } from "react";
import AIChatbox from "../components/AIChatbox";
import Navbar from "../components/Navbar";
import VoiceChatBox from "../components/VoiceChatBox";
import "../styles/AIChatboxPage.css";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

const AIChatboxPage = () => {
  const [showVoiceChat, setShowVoiceChat] = useState(false);

  const handleOpen = () => setShowVoiceChat(true);
  const handleClose = () => setShowVoiceChat(false);

  return (
    <div className="ai-chatbox-page min-h-screen relative bg-gray-50">
      <Navbar />

      <div className="content px-6 pt-6">
        {/* 標題 + 按鈕 */}
        <div className="flex justify-center">
          <button
            onClick={handleOpen}
            title="語音填寫三餐"
            className="w-fit px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-md transition duration-200 ease-in-out inline-flex items-center gap-2"
          >
            <span className="text-base">AI語音小助手紀錄今日飲食</span>
            <span className="text-lg">💬</span>
          </button>
        </div>

        <AIChatbox />
      </div>

      {/* ✅ Modal 彈出語音聊天框
    - 點擊按鈕後開啟 <VoiceChatBox />
    - 使用者完成語音輸入後會觸發 onComplete()
*/}

      <Dialog
        open={showVoiceChat}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>💬</DialogTitle>
        <DialogContent>
          <VoiceChatBox
            userId={localStorage.getItem("userid")}
            date={new Date().toISOString().split("T")[0]}
            onComplete={() => {
              alert("✅ 三餐語音紀錄已完成！");
              handleClose();
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            關閉
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AIChatboxPage;

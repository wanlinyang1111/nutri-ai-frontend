/**
 * @component VoiceChatBox 語音聊天記錄元件
 *
 * 功能流程：
 * 1. 使用者點擊「開始錄音」觸發 Web Speech API → 回傳語音辨識結果 rawSpeech
 * 2. 點擊「送交 AI 分析」後，將語音文字送至 GPT 分析 → 回傳 JSON 格式的 meal_type / time / content
 * 3. 使用者可對每一筆紀錄補充圖片
 * 4. 點擊「儲存」後，依據 GPT 結果與圖片組成每日飲食紀錄，送往後端存入資料庫
 *
 * 狀態管理：
 * - step：流程控制（step 2 為錄音、step 4 為預覽與上傳）
 * - rawSpeech：語音辨識結果
 * - preview：GPT 回傳的解析結果（JSON 格式）
 * - imageMap：使用者上傳的圖片資料（key: GPT 結果 index，value: base64 圖）
 */

import React, { useState, useRef } from "react";
import { saveDietData } from "../utils/apiCalls";

/* ---------- utils ---------- */
const todayISO = () => new Date().toISOString().split("T")[0];
const normalizeTime = (raw) => {
  if (!raw) return null;
  const m = raw.match(/(\d{1,2})[:：](\d{2})/);
  if (!m) return null;
  let [, h, mm] = m;
  if (h.length === 1) h = "0" + h;
  return `${h}:${mm}`; // → "08:30"
};

/* GPT_PROMPT
   提供給 OpenAI 模型的系統提示，請模型回傳 JSON 陣列，每筆資料包含：
   - meal_type（餐別，如早餐、午餐等）
   - time（格式為 "07:30"）
   - content（餐點內容，如 "蛋餅"）
   ➜ 注意：模型只能回傳 JSON 格式，不能加任何說明。
*/

const GPT_PROMPT = `你是一位營養助理，請根據使用者的語音內容判斷所有提到的餐別
（早餐／午餐／下午茶／晚餐／宵夜）、時間及內容，並以 JSON 陣列格式回傳：
[
  { "meal_type": "早餐", "time": "07:30", "content": "蛋餅" },
  { "meal_type": "午餐", "time": "11:00", "content": "便當" }
]
只輸出 JSON，請勿補充說明。`;

/**
 * @component VoiceChatBox
 * @description 語音聊天框主要組件
 * @param {Object} props
 * @param {boolean} props.isListening - 控制是否正在進行語音識別
 * @param {Function} props.setIsListening - 設置語音識別狀態的函數
 */

const VoiceChatBox = () => {
  const [step, setStep] = useState(2); // 直接在錄音畫面
  // 使用者語音輸入後的文字結果
  const [rawSpeech, setRawSpeech] = useState("");
  // GPT 分析結果，格式為 [{ meal_type, time, content }]
  const [preview, setPreview] = useState([]); // GPT 結果
  // 上傳圖片對應的暫存區，格式為 { 0: base64string, 1: ... }
  const [imageMap, setImageMap] = useState({}); // {idx: base64}
  const [isRec, setIsRec] = useState(false);
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem("userid");
  const recogRef = useRef(null);

  /* ---------- 錄音 ---------- */
  const startRec = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("Please use Chrome with SpeechRecognition.");

    const r = new SR();
    r.lang = "zh-TW";
    r.onstart = () => setIsRec(true);
    r.onend = () => setIsRec(false);
    r.onerror = (e) => alert("Speech error: " + e.error);
    r.onresult = (e) => setRawSpeech(e.results[0][0].transcript.trim());

    recogRef.current = r;
    r.start();
  };

  /* ---------- GPT 分析 ---------- */
  const analyse = async () => {
    if (!rawSpeech) return;
    setLoading(true);
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          temperature: 0.3,
          messages: [
            { role: "system", content: GPT_PROMPT },
            { role: "user", content: rawSpeech },
          ],
        }),
      });
      const data = await res.json();
      const arr = JSON.parse(data.choices[0].message.content);
      setPreview(Array.isArray(arr) ? arr : [arr]);
      setStep(4);
    } catch {
      alert("❌ GPT 分析失敗");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- 圖片上傳 ---------- */
  const onUpload = (e, idx) => {
    const file = e.target.files[0];
    if (!file) return;
    const rd = new FileReader();
    rd.onloadend = () => setImageMap((prev) => ({ ...prev, [idx]: rd.result }));
    rd.readAsDataURL(file);
  };

  /* ---------- 儲存 ---------- */
  const save = async () => {
    try {
      for (let i = 0; i < preview.length; i++) {
        const p = preview[i];
        const clean = normalizeTime(p.time); // 可能為 null
        const iso = `${todayISO()}T${clean ?? "00:00"}:00`;

        await saveDietData({
          userid: userId,
          diet_time: iso,
          diet_time_type: p.meal_type,
          diet_content: [p.content],
          diet_img_path: imageMap[i] || null,
        });
      }
      alert("✅ 已儲存！");
      setStep(2);
      setRawSpeech("");
      setPreview([]);
      setImageMap({});
    } catch (e) {
      alert("❌ 儲存失敗：" + e.message);
    }
  };

  {
    /* ---------- UI ---------- */
  }
  return (
    <div className="p-4 max-w-xl mx-auto border rounded-xl bg-white shadow space-y-6">
      <h2 className="text-lg font-semibold">🎙️ 今日語音飲食紀錄</h2>

      {/* Step 2：錄音 */}
      {step === 2 && (
        <>
          {/* ⬇︎　說明區塊（長輩友善版） */}
          <div className="rounded-lg bg-blue-50 px-4 py-3 text-gray-800 leading-relaxed">
            <p className="font-semibold mb-1">
              ① 點「開始錄音」 → ② 說內容 → ③ 按「送交 AI 分析」 → ④ 按「儲存」
            </p>

            <p className="text-base">
              請一次說<strong>時間</strong>＋<strong>食物</strong>，格式如下：
            </p>

            <ul className="list-none space-y-1 mt-2 text-[15px]">
              <li>
                📋 早上 <span className="font-mono">7:30</span>　吃 蛋餅
              </li>
              <li>
                📋 中午 <span className="font-mono">11:00</span> 吃 便當
              </li>
            </ul>

            <p className="text-sm text-gray-600 mt-3">
              如果忘記時間，也可直接說「早餐吃蛋餅」。
            </p>
          </div>

          {/* 錄音按鈕 */}
          <button
            onClick={startRec}
            className="mt-3 px-6 py-3 bg-blue-600 text-white rounded-full shadow flex items-center gap-2"
          >
            🎤 <span className="text-[17px]">開始錄音</span>
          </button>

          {isRec && (
            <p className="text-red-600 text-sm mt-1 animate-pulse">
              ● 正在錄音…
            </p>
          )}

          {rawSpeech && (
            <>
              <p className="mt-3">你說：{rawSpeech}</p>
              <button
                onClick={analyse}
                disabled={loading}
                className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-xl"
              >
                {loading ? "分析中…" : "🚀 送交 AI 分析"}
              </button>
            </>
          )}
        </>
      )}

      {/* Step 4：預覽 + 上傳圖片 */}
      {step === 4 && preview.length > 0 && (
        <>
          <div className="border rounded-xl p-4 bg-gray-50 text-sm space-y-4">
            {preview.map((p, idx) => (
              <div key={idx} className="space-y-1">
                <p>餐別：{p.meal_type}</p>
                <p>時間：{p.time}</p>
                <p>內容：{p.content}</p>

                <div className="mt-1">
                  <label className="text-xs">
                    📸 上傳 {p.meal_type} 照片（可選）
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onUpload(e, idx)}
                  />
                  {imageMap[idx] && (
                    <img
                      src={imageMap[idx]}
                      alt="pre"
                      className="w-16 h-16 object-contain rounded mt-2 border"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={save}
              className="mt-3 px-4 py-2 bg-green-600 text-white rounded-xl"
            >
              ✅ 儲存
            </button>
            <button
              onClick={() => {
                setStep(2);
                setPreview([]);
                setImageMap({});
              }}
              className="mt-3 px-4 py-2 bg-gray-300 rounded-xl"
            >
              取消
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default VoiceChatBox;

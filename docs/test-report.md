# 測試報告

驗證日期：2026-07-13（Asia/Taipei）

## 結果摘要

- 正式檢查：`npm.cmd run check` 通過。
- 物理模型：7 / 7 個不變量通過，涵蓋閉合／斷路、正確／翻轉磁極、電池方向反轉、0.5 V 與 1.5 V 邊界及超界輸入夾限。
- 瀏覽器：agent-browser 0.31.1 控制 Chromium；頁面錯誤 0、主控台錯誤 0。
- 本機資源：`index.html`、`styles.css`、`script.js`、`physics-model.mjs`、`favicon.svg` 均回應 200 或快取 304；修正驗證前曾有 favicon 404，補檔後重測通過。
- 社群縮圖：本機與公開 PNG 均為 `1200 × 630`；公開回應為 `image/png`，Open Graph 與 Twitter Card 使用正式絕對 HTTPS 網址。
- 占位掃描：未發現 `TODO`、`待補`、`lorem ipsum`。
- HTML ID：無重複 ID；未使用缺少替代文字的 `<img>`。

## Viewport 與版面

| 尺寸 | 檢查範圍 | 水平頁面溢出 | 結果 |
|---|---|---:|---|
| 1440 × 1000 | 觀察頁、模型頁、原始影片嵌入、互動控制 | 無 | 通過 |
| 768 × 1024 | 五個頁籤、模型、闖關、安全頁 | 無 | 通過 |
| 390 × 844 | 觀察、原理解剖、模型、闖關、安全頁 | 無 | 通過 |

原理解剖的大型 SVG 在手機使用畫面內的橫向捲動容器，未造成整頁水平溢出；模型 SVG 在手機裁入安全範圍，控制按鈕未重疊。

## 互動與無障礙

- 預測題：正確與錯誤選項皆有即時文字回饋。
- 模型：運行後 SVG 位移；電池方向反轉後方向文字由右改左；翻轉一側磁鐵後相對推力成為 0%，並顯示模型限制說明。
- 闖關：以瀏覽器實際作答，4 / 4 時顯示完整概念回饋。
- 頁籤：`ArrowRight` 可由「先觀察」移到「拆原理」，並同步 `aria-selected` 與面板顯示。
- 互動元件：按鈕、選單、滑桿、核取方塊與選項皆在瀏覽器無障礙樹中具有名稱。
- 降低動畫：模擬 `prefers-reduced-motion` 後，按下運行 700 ms，列車維持 `translate(365 0)`，靜態資訊與控制仍可用。

## 截圖證據

- `audit/screenshots/desktop-observe.png`
- `audit/screenshots/desktop-lab.png`
- `audit/screenshots/tablet-safety.png`
- `audit/screenshots/mobile-observe.png`
- `audit/screenshots/mobile-explain.png`
- `audit/screenshots/mobile-lab.png`
- `audit/screenshots/mobile-challenge.png`
- `audit/screenshots/finish-local-home.png`
- `audit/screenshots/finish-local-mobile.png`
- `audit/screenshots/finish-public-mobile.png`

## 公開部署驗證

- Repository：`https://github.com/prayer168/electric-train`
- GitHub Pages：`https://prayer168.github.io/electric-train/`
- Pages 狀態：`built`
- 公開首頁、CSS、JavaScript、ES module、favicon 與社群縮圖皆為 HTTP 200。
- 在公開版 390 × 844 viewport 重做模型運行；`#trainGroup` 由初始位置移動至 `translate(513.5715000000027 0)`，頁面無水平溢出或瀏覽器錯誤。

## 物理稽核文件

- 設定與模型限制：`physics-audit.json`
- 機器可讀報告：`audit/physics-audit-report.json`
- 可讀報告：`audit/physics-audit-report.md`
- 重跑：`npm.cmd test`

## 已知限制

- YouTube 播放器需要網路並受影片公開狀態、地區與校園網路政策影響；教材文字、SVG、模型與測驗可在本機伺服器離線使用。
- 相對推力不是牛頓值；未模擬摩擦、接觸電阻、電池內阻、線圈節距、升溫與終端速度。
- Facebook 可能快取舊連結預覽；若更新縮圖後仍顯示舊圖，需在 Meta Sharing Debugger 使用 **Scrape Again**。

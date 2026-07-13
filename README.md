# 線圈裡的小火車

以 AmazingScience 的〈World's Simplest Electric Train〉為觀察素材，帶領學生從現象、閉合電路、線圈磁場到兩端磁鐵受力，建立可驗證的電磁學解釋。

公開教材：https://prayer168.github.io/electric-train/

## 適用情境

- 建議年級：國中八、九年級延伸，或高中基礎物理
- 使用時間：一節 45 分鐘
- 形式：影片觀察、原理解剖、互動模型、四題證據闖關、實作安全
- 實體實驗：建議教師示範；未滿 14 歲學生不自行接觸小型高強度磁鐵

## 開啟教材

直接開啟 `index.html` 即可。若瀏覽器限制 ES module 載入，請在資料夾執行：

```powershell
python -m http.server 4173
```

再開啟 `http://localhost:4173`。

## 驗證

```powershell
npm.cmd run check
```

模型限制、測試邊界與符號約定記錄於 `physics-audit.json`；來源與查核目的記錄於 `docs/references.md`。

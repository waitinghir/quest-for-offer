# ⚔️ Quest for Offer

把 PM 面試準備變成 RPG 經營遊戲。

## 部署到 Vercel（5 分鐘）

### Step 1：建立 GitHub Repo
1. 去 [github.com/new](https://github.com/new) 建一個新 repo（例如 `quest-for-offer`）
2. 把這整個資料夾的檔案 push 上去：
```bash
cd quest-for-offer
git init
git add .
git commit -m "init"
git branch -M main
git remote add origin https://github.com/你的帳號/quest-for-offer.git
git push -u origin main
```

### Step 2：連結 Vercel
1. 去 [vercel.com](https://vercel.com) 用 GitHub 登入
2. 點「Add New → Project」
3. 選你剛建的 `quest-for-offer` repo
4. Framework 會自動偵測為 Vite，不用改任何設定
5. 點 Deploy

完成！Vercel 會給你一個網址（像 `quest-for-offer.vercel.app`）。

### Step 3：手機加到主畫面
1. 用手機瀏覽器打開 Vercel 給的網址
2. iOS：Safari → 分享 → 加入主畫面
3. Android：Chrome → 選單 → 加到主畫面

這樣就像一個 App 了，全螢幕、有 icon。

## 本地開發

```bash
npm install
npm run dev
```

打開 http://localhost:5173

## 技術棧

- React 18 + Vite
- 純前端，無後端
- localStorage 存檔
- PWA manifest（可加到手機主畫面）

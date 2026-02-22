import { useState, useEffect, useCallback, useMemo } from "react";

const SKILLS = [
  { id: "intro", name: "自我介紹", icon: "🗣", maxLevel: 10, order: 1, questions: {
    easy: [
      { q: "請用 2 分鐘介紹你自己（英文短版）", note: "Hi, I'm Tim. Senior Product & Growth leader with 8+ years building/scaling consumer apps, international expansion across Taiwan, Japan, HK, SEA.\n\nDcard: Japan repositioning → retention +300%, PMF. Content ecosystem 0→1.\nCMoney: subscription learning app → 23% YoY MAU growth, doubled revenue, AI features.\n\nRelocating to Japan, need visa sponsorship." },
      { q: "用一句話說明你是誰、做過什麼", note: "I'm a data- and experiment-driven Product/Growth PM. My strength is building repeatable optimization loops—from objective to metrics, experiments, and iterations." },
    ],
    medium: [
      { q: "請用 3 分鐘詳細介紹你的經歷（英文長版）", note: "Dcard: Taiwan's biggest social community, 20M+ MAU. Joined ~30 people → ~400. Expanded user base via content ecosystem (recommendation, moderator system, creator programs). Managed overseas teams (HK, Japan). Japan: retention +300%.\n\nCMoney: ToastEnglish 23% YoY MAU, Top 3 App Store Education." },
      { q: "請用日文自我介紹", note: "はじめまして、Tim です。消費者向けアプリのプロダクトとグロース領域で8年以上の経験があります。Dcardでは日本市場でリテンション300%改善。CMoney では学習アプリでMAU 23%成長。" },
      { q: "追問：你的強項是什麼？", note: "Data- and experiment-driven. Repeatable optimization loops. ML-driven improvements. Content ecosystems. Cross-functional alignment, fast validation, measurable impact." },
    ],
    hard: [
      { q: "追問：你的管理幅度有多大？", note: "Dcard：最多正職 16 人\nCMoney：最多正職 21 人" },
      { q: "請根據這個職缺，調整你的自我介紹重點", note: "最後一句要「扣回這職缺」。根據 JD 關鍵字，調整強調的經歷比重。" },
      { q: "面試官打斷你的自我介紹問了細節，你怎麼應對？", note: "保持冷靜，簡短回答，然後自然回到自我介紹脈絡。" },
    ],
  }},
  { id: "hr", name: "HR 應對", icon: "📋", maxLevel: 10, order: 2, questions: {
    easy: [
      { q: "Why Product Management?", note: "I like building things that create value. I enjoy solving ambiguous problems end-to-end." },
      { q: "Why Japan?", note: "已有日本市場經驗。想更靠近市場和用戶。Plus snowboarding." },
    ],
    medium: [
      { q: "為什麼離開上一份工作？", note: "Company reorganized → core finance focus. My role became Taiwan stock product, less aligned with goals. Planning to relocate to Japan." },
      { q: "What are your top 3 criteria for the next role?", note: "1. Visa sponsorship 2. English-first or bilingual 3. Strong product ownership (own roadmap, not just delivery)." },
      { q: "你英文/日文程度？", note: "English: business level. Japanese: JLPT N2." },
    ],
    hard: [
      { q: "你的薪資期望？", note: "Target: ~JPY 12M total comp, flexible on scope and package." },
      { q: "What if the team requires more Japanese than expected?", note: "Short-term: prepare, written summaries, confirm in writing. Long-term: structured improvement. Deliver from day one through product execution." },
      { q: "如果 offer 比期望低 20%，你會怎麼考慮？", note: "考量整體 package（scope, growth, team, benefits）。但要有底線。" },
      { q: "你覺得你最大的缺點是什麼？", note: "1. 不太會做貼心小動作 2. 懼怕行政工作 3. 不會做業務。要有自覺+改善。" },
      { q: "What was the biggest risk you've ever taken?", note: "Changed career / decided to move to Japan. 要有具體行動和結果。" },
      { q: "If you could have done something differently?", note: "大學更早探索自己，花更多時間說服爸媽。展現自我反思。" },
    ],
  }},
  { id: "star", name: "STAR 故事", icon: "⚔️", maxLevel: 10, order: 3, questions: {
    easy: [
      { q: "請講述板主系統 0→1 的故事（STAR）", note: "S: Core users=college students, need to expand. New users poor engagement.\nT: Increase engagement without affecting existing community.\nA: Organic content ecosystem—users as moderators. Aligned eng/CS/legal/ads. MVP stages.\nR: Forum 10×, engagement +30%." },
      { q: "請講述一個你最自豪的專案", note: "可選：日本 PMF、板主系統、小鈴鐺，根據對方興趣選擇。" },
    ],
    medium: [
      { q: "請講述日本市場 PMF 的故事（STAR）", note: "S: Took over Japan, 7d retention ~5%, high CAC. Forums + friend-matching, positioning messy.\nT: Find Japan-fit positioning.\nA: Challenged assumption → user interviews (students want companions) → workshops → new positioning → ops+product integration.\nR: Retention +300%, PMF milestone." },
      { q: "請講述小鈴鐺推播個人化的故事（STAR）", note: "S: Improve push effectiveness.\nT: Increase CTR and DAM.\nA: A/B test frequency (cap 3/day). ML stuck → my analysis: school-forum content under-ranked (low likes/views) → rule-based boost.\nR: CTR 3%→5%, DAM +10%." },
      { q: "追問：retention +300% 的定義與歸因？", note: "Cohort-based returning retention, monthly. +300% relative lift. Validated via cohort metrics + controlled rollouts." },
    ],
    hard: [
      { q: "追問：推薦系統中你的角色？跟 DS 怎麼分工？", note: "DS: model. Eng: serving. Me: product outcomes—objectives/metrics, experiment design, ranking constraints (freshness/diversity/safety), iteration decisions." },
      { q: "追問：content flywheel 最大槓桿？", note: "板主系統 → 內容多元 → 推薦精準 → 更多用戶 → 更多板主。最大槓桿：板主系統（供給端 10x）。" },
      { q: "面試官質疑你的數據不夠嚴謹？", note: "先聽質疑。承認局限（sample, confounders），說明 guardrails。不要 defensive。" },
      { q: "追問：Led analytics instrumentation — 具體做了什麼？", note: "Event taxonomy/schema → DE 實作+QA → DS success metrics + guardrails → dashboard + A/B 迭代。" },
      { q: "追問：Search success rate 60%→80% 怎麼做到？", note: "定義：click + 有效下游行為 + 沒有 reformulate。補 logging → 零結果+排序差做召回和 ranking → A/B。" },
      { q: "請講述個人看板的故事（STAR）", note: "S: 提升發文量。門檻高，公共場所恐懼。\nA: 個人看板=私領域。\nR: 1000 創作者, +36% YoY。成為電商賣場基礎。" },
      { q: "Tell me about sunsetting a feature.", note: "追蹤列表：都追蹤熱門看板 → feed=首頁 → engagement降 → 改ML推薦 → session duration 升。" },
    ],
  }},
  { id: "product", name: "產品思維", icon: "💡", maxLevel: 10, order: 4, questions: {
    easy: [
      { q: "Tell me about a product you like.", note: "Duolingo: short gamified sessions, scenario-based. Less repetitive. Downside: too lightweight for test-driven learners." },
      { q: "What does a good PRD look like?", note: "Triple-A PRD:\n1. Alignment: why (objective, user story, metrics, guardrails)\n2. Actionable: how (scope, requirements, flows, experiment)\n3. Adjustable: flexible vs fixed (assumptions, trade-offs)" },
    ],
    medium: [
      { q: "How would you improve Duolingo?", note: "Real-life usage: scenario review, AI on-demand practice. Metric: retention. Feature: adoption + retention as leading." },
      { q: "New feature caused retention to drop. What do you do?", note: "Adoption → segments → funnel → error logs → support signals → rollback if serious." },
      { q: "How do you define success metrics?", note: "問題→北極星→拆解 leading indicators + guardrails → Dashboard → A/B 驗因果。" },
    ],
    hard: [
      { q: "你怎麼拆解 subscription revenue driver？", note: "Revenue = MAU × conversion × ARPPU × renewal. Growth track + monetization track. Guardrails." },
      { q: "設計 A/B test：hypothesis、metrics、sample、duration", note: "Hypothesis → metric (primary+guardrails) → sample → duration → decision criteria. Stratified randomization, persistent holdout." },
      { q: "你的產品如何建立護城河？", note: "Network effects, switching costs, data advantages, brand/trust。" },
      { q: "你做過 AI 什麼？具體說明。", note: "AI TOEIC listening (human-in-the-loop: ops sampling, <20% error → pilot → scale). AI localization for Japan." },
      { q: "Human-in-the-loop AI pipeline 怎麼做？", note: "AI翻譯 → ops sampling → <20% error → pilot → scale → else iterate prompt." },
      { q: "Share a time you launched in a new market.", note: "個人看板：創作者怕被批評 → 私領域 → 跨部門 → 1000 creators, +36% posts." },
    ],
  }},
  { id: "team", name: "團隊合作", icon: "🤝", maxLevel: 10, order: 5, questions: {
    easy: [
      { q: "與他人產生衝突的經驗及處理方式", note: "原則：1. 對齊目標 2. 交換資訊 3. 研究分析 4. 往上處理。案例：個板UI、推薦分歧。" },
      { q: "How do you handle production incidents?", note: "Severity → mitigation → root cause → prevention. Dashboards → rollback/hotfix. Postmortem: smoke tests, alerts, checklists." },
    ],
    medium: [
      { q: "How do you prioritize when stakeholders disagree?", note: "Align objective+metrics → clarify assumptions → RICE → small experiment → evidence decides." },
      { q: "老闆插單怎麼辦？", note: "理解原因 → 列優先順序。If yes, must say no to something — here are options." },
      { q: "Aligning Sales/Ops/Eng on a trade-off?", note: "板主系統：speed vs scalability → organic ecosystem → cross-functional → MVP → 10× forum, +30%." },
      { q: "個板 UI 被老闆臨時要求修改？", note: "兩週 7 個 interviews → creators prefer mixed feed → 說服 CEO → 不耽誤時程。" },
      { q: "推薦成效分歧 — 跟老闆意見不同？", note: "老闆=算法問題，我=內容供給。拉跨部門 → 內容拆成可量化指標 → 共識。" },
    ],
    hard: [
      { q: "重大專案臨時出問題無法上線？", note: "圈定風險 → 最小可行解 → 工程訂計畫 → 利害關係人溝通。" },
      { q: "遇過技術上最挑戰的專案？", note: "板主系統權限矩陣 → role-based → 文件化 edge cases → 分階段 → 法務對齊。" },
      { q: "工程師認為需求不合理？", note: "聽理由 → 對齊目標 → 替代方案。MVP behind feature flag + refactor after." },
    ],
  }},
  { id: "mgmt", name: "管理經驗", icon: "👑", maxLevel: 10, order: 6, questions: {
    easy: [
      { q: "你最相信的管理心法？", note: "1. 共同目標 2. 充分溝通 3. 相信專業" },
      { q: "幫助團隊成員成長的經驗", note: "成功案例：Sara、Kazu" },
    ],
    medium: [
      { q: "最印象深刻的管理經驗", note: "空降日本：不信任 → HR+1-on-1 → workshop → trust rebuilt → milestone." },
      { q: "Disagreeing with your manager on priorities?", note: "對齊目標 → 交換資訊 → 分析 → checkpoint。案例：個板UI、推薦。" },
      { q: "跟老闆溝通最需要注意什麼？", note: "了解老闆（關心/害怕什麼）。讓他掌握狀況。尊重但有底線。" },
    ],
    hard: [
      { q: "空降主管如何重新凝聚團隊？", note: "HR配合 → 密集1-on-1 → 說明選我原因 → 產品定位workshop → 成效達標" },
      { q: "直屬下屬績效持續不達標？", note: "了解原因(能力/動機/資源) → 期望+支持 → 改善期限 → 公平決定。" },
      { q: "不同文化背景的團隊中建立信任？", note: "不能用本市場知識判斷。招募當地夥伴。確保安心提供在地知識。" },
      { q: "Introducing OKR — 怎麼克服阻力？", note: "All-hands → key men → 1-on-1(怕炫耀/怕KPI) → 針對解法 → 台灣OKR典範。" },
      { q: "Community team 差點被收掉？", note: "前主管離職 → 1-on-1缺目標 → 設定目標 → quick wins → content outsourcing hub → 100板主 → 重生。" },
    ],
  }},
];

const BUILDINGS = [
  { id: "tavern", name: "冒險者酒館", desc: "自信開場的起點", cost: 100, req: { intro: 3 }, emoji: "🍺" },
  { id: "forge", name: "武器鍛造屋", desc: "鍛造你的故事武器", cost: 200, req: { star: 4 }, emoji: "⚒️" },
  { id: "library", name: "智者圖書館", desc: "產品知識的殿堂", cost: 200, req: { product: 4 }, emoji: "📚" },
  { id: "tower", name: "瞭望塔", desc: "洞察面試官的意圖", cost: 250, req: { hr: 5 }, emoji: "🗼" },
  { id: "arena", name: "勇者競技場", desc: "實戰訓練場", cost: 300, req: { star: 5, team: 3 }, emoji: "🏟️" },
  { id: "castle", name: "領主城堡", desc: "帶領團隊的殿堂", cost: 500, req: { mgmt: 6, team: 5 }, emoji: "🏰" },
];

const pickQ = (sk, lv) => { const t = lv < 3 ? "easy" : lv < 6 ? "medium" : "hard"; const p = sk.questions[t]; return p[Math.floor(Math.random() * p.length)]; };
const xpNeed = lv => 3 + lv;
const tierName = lv => lv < 3 ? "初級" : lv < 6 ? "中級" : "高級";
const tierColor = lv => lv < 3 ? "#6ec97e" : lv < 6 ? "#e8b84a" : "#d46a6a";
const SAVE = "qfo-save-v4";
const empty = () => ({ gold: 0, sLv: Object.fromEntries(SKILLS.map(s => [s.id, 0])), sXp: Object.fromEntries(SKILLS.map(s => [s.id, 0])), built: [], battles: 0, trains: 0 });


// ============ UI COMPONENTS ============
const BD = "'Noto Sans TC', 'Helvetica Neue', sans-serif";
const TT = "'Cinzel', 'Noto Serif TC', serif";

const Card = ({ children, style, onClick, glow }) => (
  <div onClick={onClick} style={{ background: "linear-gradient(135deg, #1e1e30, #1a1a2c)", border: `1px solid ${glow || "#2a2a44"}`, borderRadius: 12, padding: 18, cursor: onClick ? "pointer" : "default", transition: "all 0.2s", boxShadow: glow ? `0 0 20px ${glow}22` : "none", ...style }}>{children}</div>
);

const Btn = ({ children, onClick, disabled, color = "#e8b84a", variant, full, style }) => {
  const bg = variant === "green" ? "#1a3020" : variant === "red" ? "#301a1a" : "#1e1e30";
  const bc = variant === "green" ? "#3a7a4a" : variant === "red" ? "#7a3a3a" : "#3a3a55";
  return <button disabled={disabled} onClick={onClick} style={{ fontFamily: BD, fontSize: 15, fontWeight: 600, padding: "12px 20px", color: disabled ? "#555" : color, background: disabled ? "#151520" : bg, border: `2px solid ${disabled ? "#222" : bc}`, borderRadius: 10, cursor: disabled ? "not-allowed" : "pointer", width: full ? "100%" : undefined, opacity: disabled ? 0.4 : 1, transition: "all 0.15s", ...style }}>{children}</button>;
};

const Bar = ({ value, max, color = "#e8b84a", h = 6 }) => (
  <div style={{ height: h, background: "#12121e", borderRadius: h, overflow: "hidden", marginTop: 4 }}>
    <div style={{ height: "100%", width: `${Math.min(value / max * 100, 100)}%`, background: `linear-gradient(90deg, ${color}, ${color}bb)`, borderRadius: h, transition: "width 0.5s" }} />
  </div>
);

// ============ MAIN APP ============
export default function App() {
  const [sv, setSvRaw] = useState(() => {
    try { const r = JSON.parse(localStorage.getItem(SAVE)); return r ? { ...empty(), ...r } : empty(); } catch { return empty(); }
  });
  const [scr, setScr] = useState("map");
  const [selSkill, setSelSkill] = useState(null);
  const [curQ, setCurQ] = useState(null);
  const [noteOpen, setNoteOpen] = useState(false);
  const [bs, setBs] = useState(null);
  const [br, setBr] = useState(null);
  const [log, setLog] = useState(["歡迎回來，勇者！"]);
  const [toast, setToast] = useState(null);

  const setSv = useCallback(fn => setSvRaw(p => { const n = typeof fn === "function" ? fn(p) : fn; try { localStorage.setItem(SAVE, JSON.stringify(n)); } catch {} return n; }), []);
  const addLog = useCallback(m => setLog(p => [m, ...p].slice(0, 30)), []);
  const flash = useCallback(m => { setToast(m); setTimeout(() => setToast(null), 2500); }, []);
  const totLv = Object.values(sv.sLv).reduce((a, b) => a + b, 0);

  const gainXp = useCallback((sid, amt) => {
    setSv(s => {
      const nx = (s.sXp[sid] || 0) + amt, nd = xpNeed(s.sLv[sid] || 0);
      if (nx >= nd) { const nl = Math.min((s.sLv[sid] || 0) + 1, 10); const sk = SKILLS.find(x => x.id === sid); flash(`✨ ${sk.name} → Lv.${nl}`); addLog(`✨ ${sk.name} 升到 Lv.${nl}！`); return { ...s, sLv: { ...s.sLv, [sid]: nl }, sXp: { ...s.sXp, [sid]: nx - nd } }; }
      return { ...s, sXp: { ...s.sXp, [sid]: nx } };
    });
  }, [addLog, flash, setSv]);

  const startTrain = sk => { setSelSkill(sk); setCurQ(pickQ(sk, sv.sLv[sk.id] || 0)); setNoteOpen(false); setScr("trainQ"); };
  const finTrain = r => { gainXp(selSkill.id, r); setSv(s => ({ ...s, trains: s.trains + 1 })); addLog(`${selSkill.icon} 練習完成 (+${r} XP)`); setScr("train"); };

  const startBattle = () => {
    const ord = [...SKILLS].sort((a, b) => a.order - b.order);
    const elig = [ord[0]]; for (let i = 1; i < ord.length; i++) { if ((sv.sLv[ord[i].id] || 0) >= 1 || (sv.sLv[ord[i - 1].id] || 0) >= 2) elig.push(ord[i]); }
    const pk = elig.slice(0, 4);
    setBs({ qs: pk.map(s => ({ skill: s, ...pickQ(s, sv.sLv[s.id] || 0) })), cur: 0, res: [] }); setBr(null); setScr("battle");
    addLog(`⚔️ 進入森林！${pk.length} 題`);
  };

  const ansBattle = r => {
    const nr = [...bs.res, { ...bs.qs[bs.cur], rating: r }];
    if (bs.cur + 1 >= bs.qs.length) {
      const tot = nr.reduce((a, x) => a + x.rating, 0), mx = nr.length * 3, g = 30 + Math.floor((tot / mx) * 70);
      setSv(s => ({ ...s, gold: s.gold + g, battles: s.battles + 1 })); nr.forEach(x => gainXp(x.skill.id, x.rating));
      setBr({ results: nr, gold: g, tot, mx }); addLog(`💰 +${g} 金幣`); setScr("battleResult");
    } else setBs({ ...bs, cur: bs.cur + 1, res: nr });
  };

  const canBld = b => sv.gold >= b.cost && Object.entries(b.req).every(([k, v]) => (sv.sLv[k] || 0) >= v);
  const doBld = b => { setSv(s => ({ ...s, gold: s.gold - b.cost, built: [...s.built, b.id] })); flash(`🏗️ ${b.name} 建成！`); addLog(`🏗️ 建成 ${b.name}！`); setScr("map"); };
  const avail = BUILDINGS.filter(b => !sv.built.includes(b.id));
  const tip = useMemo(() => { const s = [...SKILLS].sort((a, b) => (sv.sLv[a.id] || 0) - (sv.sLv[b.id] || 0)); return `建議練習「${s[0].name}」— 目前 Lv.${sv.sLv[s[0].id]}`; }, [sv.sLv]);


  // ============ Plot component ============
  const Plot = ({ i }) => { const bid = sv.built[i], b = BUILDINGS.find(x => x.id === bid); return (
    <div onClick={() => !bid && setScr("build")} style={{ height: 80, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: bid ? "#1a2e14" : "#121e0c", border: `1.5px ${bid ? "solid" : "dashed"} ${bid ? "#3a6a30" : "#2a3a20"}`, borderRadius: 10, cursor: bid ? "default" : "pointer", animation: bid ? "float 4s ease-in-out infinite" : "none" }}>
      {bid ? <><span style={{ fontSize: 28 }}>{b.emoji}</span><div style={{ fontSize: 10, color: "#e8b84a", marginTop: 4, fontWeight: 600, fontFamily: BD }}>{b.name}</div></> : <><div style={{ fontSize: 22, color: "#2a4020" }}>?</div><div style={{ fontSize: 10, color: "#2a4020", fontFamily: BD }}>空地</div></>}
    </div>
  ); };

  return (
    <div style={{ minHeight: "100vh", background: "#0c0c18", fontFamily: BD, color: "#d4cfc0" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Noto+Sans+TC:wght@400;600;700&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes toastIn { from { opacity: 0; transform: translate(-50%, -20px); } to { opacity: 1; transform: translate(-50%, 0); } }
        button:hover:not(:disabled) { filter: brightness(1.15); transform: translateY(-1px); }
        button:active:not(:disabled) { transform: translateY(0); }
      `}</style>

      {toast && <div style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 200, background: "#252538", border: "2px solid #e8b84a", borderRadius: 12, padding: "12px 28px", animation: "toastIn 0.3s", fontFamily: BD, fontSize: 16, fontWeight: 700, color: "#e8b84a", whiteSpace: "nowrap" }}>{toast}</div>}

      {/* HUD */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "#0c0c18ee", borderBottom: "1px solid #e8b84a18", backdropFilter: "blur(12px)", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontFamily: TT, fontSize: 15, color: "#e8b84a", letterSpacing: 2, fontWeight: 700 }}>⚔ QUEST FOR OFFER</div>
          <div style={{ fontSize: 13, color: "#777", marginTop: 2 }}>Lv.{totLv} 勇者</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#e8b84a" }}>💰 {sv.gold}</div>
          <div style={{ fontSize: 13, color: "#777" }}>🏗 {sv.built.length}/6</div>
        </div>
      </div>

      <div style={{ maxWidth: 500, margin: "0 auto", padding: "0 16px 32px" }}>

      {/* ===== MAP ===== */}
      {scr === "map" && <div style={{ animation: "fadeIn 0.3s" }}>
        <Card style={{ marginTop: 16, padding: 14, background: "#18182c" }}>
          <div style={{ fontSize: 14, color: "#e8b84a" }}>💡 {tip}</div>
        </Card>

        <div style={{ marginTop: 16, background: "radial-gradient(ellipse, #1a2e16, #10200c 70%)", border: "2px solid #2a4020", borderRadius: 16, padding: 20, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, opacity: 0.05, backgroundImage: "radial-gradient(circle, #6a6 1px, transparent 1px)", backgroundSize: "12px 12px" }} />
          <div onClick={startBattle} style={{ position: "relative", textAlign: "center", padding: "18px 0", cursor: "pointer", borderBottom: "1px solid #2a402033", marginBottom: 16 }}>
            <div style={{ fontSize: 44, animation: "float 3s ease-in-out infinite" }}>🌲⚔️🌲</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#6ec97e", marginTop: 8 }}>迷霧森林</div>
            <div style={{ fontSize: 13, color: "#4a7a40" }}>點擊進入模擬面試</div>
          </div>
          <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 12, alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{[0, 1, 2].map(i => <Plot key={i} i={i} />)}</div>
            <div onClick={() => setScr("train")} style={{ width: 110, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 0", cursor: "pointer", borderRadius: 14 }}>
              <div style={{ fontSize: 56, animation: "float 3s ease-in-out infinite" }}>⛺</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#e8b84a", marginTop: 10 }}>訓練帳篷</div>
              <div style={{ fontSize: 12, color: "#8a6a30" }}>點擊練習</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{[3, 4, 5].map(i => <Plot key={i} i={i} />)}</div>
          </div>
        </div>

        <Card style={{ marginTop: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#e8b84a", marginBottom: 14 }}>📊 技能總覽</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 18px" }}>
            {[...SKILLS].sort((a, b) => a.order - b.order).map(s => (
              <div key={s.id}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                  <span style={{ fontSize: 14 }}>{s.icon} {s.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#e8b84a" }}>Lv.{sv.sLv[s.id]}</span>
                </div>
                <Bar value={sv.sXp[s.id]} max={xpNeed(sv.sLv[s.id])} h={5} />
              </div>
            ))}
          </div>
        </Card>

        <Card style={{ marginTop: 12, padding: 14, maxHeight: 100, overflowY: "auto", background: "#0a0a14" }}>
          <div style={{ fontSize: 13, color: "#e8b84a", marginBottom: 6 }}>📜 冒險日誌</div>
          {log.map((l, i) => <div key={i} style={{ fontSize: 13, color: "#666", marginTop: 3, opacity: 1 - i * 0.06 }}>{l}</div>)}
        </Card>

        <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "#444" }}>訓練 {sv.trains} | 戰鬥 {sv.battles}</span>
          <button onClick={() => { if (confirm("重置所有進度？")) { localStorage.removeItem(SAVE); setSv(empty()); setLog(["已重置。"]); } }} style={{ fontSize: 12, color: "#553", background: "none", border: "1px solid #332222", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontFamily: BD }}>重置</button>
        </div>
      </div>}


      {/* ===== TRAIN LIST ===== */}
      {scr === "train" && <div style={{ paddingTop: 16, animation: "fadeIn 0.3s" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontFamily: TT, fontSize: 22, fontWeight: 700, color: "#e8b84a" }}>⛺ 訓練帳篷</div>
          <Btn onClick={() => setScr("map")} style={{ padding: "8px 14px", fontSize: 13 }}>← 地圖</Btn>
        </div>
        <div style={{ fontSize: 15, color: "#888", marginBottom: 14 }}>選擇一個技能進行練習：</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[...SKILLS].sort((a, b) => a.order - b.order).map(sk => {
            const lv = sv.sLv[sk.id]; return (
              <Card key={sk.id} onClick={() => startTrain(sk)} style={{ cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 28 }}>{sk.icon}</span>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700 }}>{sk.name}</div>
                      <div style={{ display: "flex", gap: 10, marginTop: 3 }}>
                        <span style={{ fontSize: 13, color: "#888" }}>Lv.{lv}/{sk.maxLevel}</span>
                        <span style={{ fontSize: 13, color: tierColor(lv), fontWeight: 600 }}>{tierName(lv)}</span>
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: 15, color: "#e8b84a" }}>練習 →</span>
                </div>
                <Bar value={sv.sXp[sk.id]} max={xpNeed(lv)} h={5} />
              </Card>
            );
          })}
        </div>
      </div>}

      {/* ===== TRAIN QUESTION ===== */}
      {scr === "trainQ" && selSkill && curQ && <div style={{ paddingTop: 16, animation: "fadeIn 0.3s" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#e8b84a" }}>{selSkill.icon} {selSkill.name}</div>
          <Btn onClick={() => setScr("train")} style={{ padding: "8px 14px", fontSize: 13 }}>← 返回</Btn>
        </div>
        <Card glow="#e8b84a33" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: "#888", marginBottom: 8 }}>題目（{tierName(sv.sLv[selSkill.id])}）</div>
          <div style={{ fontSize: 17, lineHeight: 1.8, color: "#ece4d4", fontWeight: 500 }}>{curQ.q}</div>
        </Card>
        {curQ.note && <div style={{ marginBottom: 16 }}>
          <Btn onClick={() => setNoteOpen(!noteOpen)} full color={noteOpen ? "#e8b84a" : "#888"} style={{ background: noteOpen ? "#1a2018" : "#151520", borderColor: noteOpen ? "#e8b84a44" : "#2a2a44" }}>
            {noteOpen ? "📖 收起參考筆記" : "📖 查看參考筆記"}
          </Btn>
          {noteOpen && <div style={{ marginTop: 8, padding: 16, background: "#0e1a0e", border: "1px solid #2a4020", borderRadius: 10, maxHeight: 240, overflowY: "auto" }}>
            <div style={{ fontSize: 14, color: "#8aaa7a", lineHeight: 1.9, whiteSpace: "pre-wrap" }}>{curQ.note}</div>
          </div>}
        </div>}
        <div style={{ fontSize: 15, color: "#888", marginBottom: 10 }}>💡 口頭練習後，自評表現：</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Btn full onClick={() => finTrain(1)} color="#d46a6a" variant="red">😅 還不熟，需要看筆記（+1 XP）</Btn>
          <Btn full onClick={() => finTrain(2)} color="#e8b84a">😊 大致能講，不夠流暢（+2 XP）</Btn>
          <Btn full onClick={() => finTrain(3)} color="#6ec97e" variant="green">💪 流暢完整，可以上場！（+3 XP）</Btn>
        </div>
        <Btn full onClick={() => { setCurQ(pickQ(selSkill, sv.sLv[selSkill.id] || 0)); setNoteOpen(false); }} style={{ marginTop: 10, color: "#888", borderColor: "#333" }}>🔄 換一題</Btn>
      </div>}

      {/* ===== BATTLE ===== */}
      {scr === "battle" && bs && <div style={{ paddingTop: 16, animation: "fadeIn 0.3s" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontFamily: TT, fontSize: 22, fontWeight: 700, color: "#d46a6a" }}>⚔️ 模擬面試</div>
          <span style={{ fontSize: 15, color: "#888" }}>第 {bs.cur + 1} / {bs.qs.length} 題</span>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 18 }}>
          {bs.qs.map((_, i) => <div key={i} style={{ width: 14, height: 14, borderRadius: 4, background: i < bs.cur ? "#6ec97e" : i === bs.cur ? "#e8b84a" : "#1a1a28", border: `2px solid ${i === bs.cur ? "#e8b84a" : i < bs.cur ? "#4a9a5a" : "#2a2a38"}`, transition: "all 0.3s" }} />)}
        </div>
        <Card glow="#d46a6a33" style={{ marginBottom: 18, background: "linear-gradient(135deg, #201515, #1a1218)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 24 }}>{bs.qs[bs.cur].skill.icon}</span>
            <span style={{ fontSize: 15, color: "#d4a0a0", fontWeight: 600 }}>{bs.qs[bs.cur].skill.name}</span>
          </div>
          <div style={{ fontSize: 17, lineHeight: 1.8, color: "#ece4d4", fontWeight: 500 }}>{bs.qs[bs.cur].q}</div>
        </Card>
        <div style={{ fontSize: 15, color: "#888", marginBottom: 10 }}>口頭回答後，自評表現：</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Btn full onClick={() => ansBattle(1)} color="#d46a6a" variant="red">💔 卡住了（+1 XP）</Btn>
          <Btn full onClick={() => ansBattle(2)} color="#e8b84a">⚡ 有答但不夠好（+2 XP）</Btn>
          <Btn full onClick={() => ansBattle(3)} color="#6ec97e" variant="green">🔥 完美回擊！（+3 XP）</Btn>
        </div>
      </div>}

      {/* ===== BATTLE RESULT ===== */}
      {scr === "battleResult" && br && <div style={{ paddingTop: 16, animation: "fadeIn 0.3s" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontFamily: TT, fontSize: 26, fontWeight: 700, color: "#e8b84a" }}>⚔️ 戰鬥結束！</div>
          <div style={{ fontSize: 16, color: "#888", marginTop: 6 }}>評分：{br.tot} / {br.mx}</div>
        </div>
        <Card style={{ marginBottom: 16 }}>
          {br.results.map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < br.results.length - 1 ? "1px solid #1e1e30" : "none" }}>
              <span style={{ fontSize: 15 }}>{r.skill.icon} {r.skill.name}</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: r.rating === 3 ? "#6ec97e" : r.rating === 2 ? "#e8b84a" : "#d46a6a" }}>{r.rating === 3 ? "🔥 完美" : r.rating === 2 ? "⚡ 普通" : "💔 失敗"}</span>
            </div>
          ))}
        </Card>
        <Card glow="#e8b84a44" style={{ textAlign: "center", marginBottom: 20, background: "linear-gradient(135deg, #1a2018, #151e10)" }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#e8b84a" }}>💰 +{br.gold} 金幣</div>
          <div style={{ fontSize: 14, color: "#6ec97e", marginTop: 6 }}>各技能已獲得對應 XP</div>
        </Card>
        <Btn full onClick={() => { setScr("map"); setBs(null); }} color="#e8b84a" style={{ borderColor: "#e8b84a55", background: "#1a1810", fontSize: 17, padding: 14 }}>← 返回基地</Btn>
      </div>}

      {/* ===== BUILD ===== */}
      {scr === "build" && <div style={{ paddingTop: 16, animation: "fadeIn 0.3s" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontFamily: TT, fontSize: 22, fontWeight: 700, color: "#e8b84a" }}>🏗️ 建造</div>
          <Btn onClick={() => setScr("map")} style={{ padding: "8px 14px", fontSize: 13 }}>← 地圖</Btn>
        </div>
        <div style={{ fontSize: 15, color: "#888", marginBottom: 14 }}>💰 持有金幣：{sv.gold}</div>
        {avail.length === 0 ? (
          <Card style={{ textAlign: "center", padding: 40 }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>🎉</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#e8b84a" }}>全部建築完成！</div>
          </Card>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {avail.map(b => { const ok = canBld(b); return (
              <Card key={b.id} glow={ok ? "#3a7a4a33" : undefined} style={ok ? { background: "linear-gradient(135deg, #142014, #101a0c)" } : {}}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <span style={{ fontSize: 36 }}>{b.emoji}</span>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700 }}>{b.name}</div>
                      <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>{b.desc}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: sv.gold >= b.cost ? "#e8b84a" : "#d46a6a" }}>💰 {b.cost}</div>
                </div>
                <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {Object.entries(b.req).map(([sid, req]) => { const sk = SKILLS.find(x => x.id === sid), met = (sv.sLv[sid] || 0) >= req; return (
                    <div key={sid} style={{ padding: "4px 10px", borderRadius: 6, background: met ? "#1a2e1a" : "#2e1a1a", border: `1px solid ${met ? "#3a6a30" : "#6a3a3a"}` }}>
                      <span style={{ fontSize: 13, color: met ? "#6ec97e" : "#d46a6a", fontWeight: 600 }}>{sk.icon} Lv.{req} {met ? "✓" : `(${sv.sLv[sid]})`}</span>
                    </div>
                  ); })}
                </div>
                <Btn full disabled={!ok} onClick={() => ok && doBld(b)} color={ok ? "#e8b84a" : "#555"} variant={ok ? "green" : undefined} style={{ marginTop: 12, fontSize: 16, borderColor: ok ? "#e8b84a55" : "#222" }}>
                  {ok ? "⚒️ 建造！" : "🔒 條件不足"}
                </Btn>
              </Card>
            ); })}
          </div>
        )}
      </div>}

      </div>
    </div>
  );
}

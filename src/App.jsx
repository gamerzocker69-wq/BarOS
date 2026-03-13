import { useState, useEffect } from "react";

const API_URL = "/api/sheets";

// ─── STYLES ────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=Syne:wght@400;600;700;800&display=swap');
  :root {
    --bg: #0f0f0d; --surface: #1a1a16; --surface2: #222219; --border: #2e2e26;
    --olive: #8a9a2e; --olive-bright: #aabf38; --olive-dim: #5a6620;
    --gold: #c9a84c; --cream: #f0ead6; --muted: #6b6b5a; --text: #e8e4d4;
    --danger: #c0392b; --danger-bg: rgba(192,57,43,0.12);
    --info: #3a7ca5; --info-bg: rgba(58,124,165,0.12); --success-bg: rgba(138,154,46,0.12);
  }
  * { margin:0; padding:0; box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
  body { background:#070706; font-family:'Syne',sans-serif; display:flex; justify-content:center; align-items:flex-start; min-height:100vh; padding:30px 16px; }
  .phone { width:390px; min-height:844px; background:var(--bg); border-radius:48px; border:10px solid #1c1c18; box-shadow:0 0 0 1px #333,0 40px 80px rgba(0,0,0,.8); overflow:hidden; position:relative; display:flex; flex-direction:column; }
  .notch { width:120px; height:34px; background:#000; border-radius:0 0 20px 20px; position:absolute; top:0; left:50%; transform:translateX(-50%); z-index:100; }
  .status-bar { display:flex; justify-content:space-between; align-items:center; padding:14px 28px 0; font-family:'DM Mono',monospace; font-size:12px; color:var(--text); position:relative; z-index:99; flex-shrink:0; }
  .scroll-area { flex:1; overflow-y:auto; overflow-x:hidden; padding-bottom:90px; scroll-behavior:smooth; }
  .scroll-area::-webkit-scrollbar { width:0; }
  .header { padding:20px 24px 16px; border-bottom:1px solid var(--border); }
  .header-top { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:4px; }
  .greeting { font-family:'DM Mono',monospace; font-size:11px; color:var(--muted); letter-spacing:.12em; text-transform:uppercase; margin-bottom:4px; }
  .logo { font-family:'DM Serif Display',serif; font-size:26px; color:var(--cream); line-height:1; }
  .logo em { color:var(--olive-bright); font-style:italic; }
  .notif-btn { width:40px; height:40px; background:var(--surface); border:1px solid var(--border); border-radius:12px; display:flex; align-items:center; justify-content:center; cursor:pointer; position:relative; font-size:18px; transition:border-color .2s; }
  .notif-btn:hover { border-color:var(--olive); }
  .notif-dot { position:absolute; top:8px; right:8px; width:7px; height:7px; background:var(--olive-bright); border-radius:50%; border:1.5px solid var(--bg); animation:blink 2s infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
  .date-pill { display:inline-flex; align-items:center; gap:6px; background:var(--surface); border:1px solid var(--border); border-radius:100px; padding:5px 12px; font-family:'DM Mono',monospace; font-size:11px; color:var(--muted); margin-top:10px; }
  .pulse-dot { width:6px; height:6px; background:var(--olive-bright); border-radius:50%; animation:blink 2s infinite; }
  .section { padding:18px 24px 0; }
  .section-label { font-family:'DM Mono',monospace; font-size:10px; letter-spacing:.15em; text-transform:uppercase; color:var(--muted); margin-bottom:12px; }
  .section-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
  .see-all { font-family:'DM Mono',monospace; font-size:10px; color:var(--olive-bright); cursor:pointer; opacity:.8; transition:opacity .2s; }
  .see-all:hover { opacity:1; }
  .divider { display:flex; align-items:center; gap:10px; padding:18px 24px 0; }
  .divider-line { flex:1; height:1px; background:var(--border); }
  .divider-label { font-family:'DM Mono',monospace; font-size:10px; letter-spacing:.15em; text-transform:uppercase; color:var(--muted); white-space:nowrap; }
  .kpi-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
  .kpi-card { background:var(--surface); border:1px solid var(--border); border-radius:18px; padding:16px; position:relative; overflow:hidden; cursor:pointer; transition:all .25s; animation:slideUp .4s ease both; }
  .kpi-card:hover { border-color:var(--olive-dim); transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,.4); }
  .kpi-card.featured { grid-column:span 2; display:flex; align-items:center; justify-content:space-between; background:linear-gradient(135deg,#1e2410,#2a3018); border-color:var(--olive-dim); }
  .kpi-glow { position:absolute; top:-20px; right:-20px; width:100px; height:100px; background:var(--olive); border-radius:50%; opacity:.08; filter:blur(30px); }
  .kpi-icon { font-size:22px; margin-bottom:10px; display:block; }
  .kpi-label { font-family:'DM Mono',monospace; font-size:10px; color:var(--muted); text-transform:uppercase; letter-spacing:.1em; margin-bottom:4px; }
  .kpi-value { font-size:26px; font-weight:800; color:var(--cream); line-height:1; }
  .kpi-sub { font-family:'DM Mono',monospace; font-size:10px; color:var(--olive-bright); margin-top:4px; }
  .kpi-sub.warn { color:var(--gold); }
  .kpi-sub.danger { color:var(--danger); }
  .kpi-badge { display:inline-flex; align-items:center; gap:4px; background:rgba(138,154,46,.15); border:1px solid var(--olive-dim); border-radius:100px; padding:4px 10px; font-family:'DM Mono',monospace; font-size:10px; color:var(--olive-bright); margin-top:8px; }
  .stock-alert { background:linear-gradient(135deg,#1a0f0f,#220d0d); border:1px solid rgba(192,57,43,.3); border-radius:14px; padding:14px 16px; display:flex; align-items:center; gap:12px; cursor:pointer; transition:border-color .2s; margin:18px 24px 0; }
  .stock-alert:hover { border-color:rgba(192,57,43,.6); }
  .alert-icon { width:36px; height:36px; background:rgba(192,57,43,.15); border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0; }
  .alert-title { font-size:13px; font-weight:700; color:#e74c3c; margin-bottom:2px; }
  .alert-sub { font-family:'DM Mono',monospace; font-size:10px; color:var(--muted); }
  .resa-card { background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:14px 16px; display:flex; align-items:flex-start; gap:14px; transition:all .2s; margin-bottom:8px; flex-wrap:wrap; animation:slideUp .4s ease both; }
  .resa-card:hover { border-color:var(--olive-dim); background:var(--surface2); }
  .resa-time { font-family:'DM Mono',monospace; font-size:13px; font-weight:500; color:var(--olive-bright); min-width:44px; text-align:center; padding-top:2px; }
  .resa-div { width:1px; height:36px; background:var(--border); }
  .resa-info { flex:1; }
  .resa-name { font-size:14px; font-weight:700; color:var(--cream); margin-bottom:2px; }
  .resa-details { font-family:'DM Mono',monospace; font-size:10px; color:var(--muted); }
  .resa-actions { display:flex; gap:6px; width:100%; margin-top:4px; padding-left:58px; }
  .btn-confirm { flex:1; padding:7px 10px; background:rgba(138,154,46,.15); border:1px solid var(--olive-dim); border-radius:10px; font-family:'DM Mono',monospace; font-size:10px; color:var(--olive-bright); cursor:pointer; text-align:center; transition:all .2s; }
  .btn-confirm:hover { background:rgba(138,154,46,.3); }
  .btn-cancel-resa { flex:1; padding:7px 10px; background:var(--danger-bg); border:1px solid rgba(192,57,43,.3); border-radius:10px; font-family:'DM Mono',monospace; font-size:10px; color:#e74c3c; cursor:pointer; text-align:center; transition:all .2s; }
  .btn-cancel-resa:hover { background:rgba(192,57,43,.25); }
  .btn-delete { padding:7px 10px; background:var(--surface2); border:1px solid var(--border); border-radius:10px; font-family:'DM Mono',monospace; font-size:10px; color:var(--muted); cursor:pointer; text-align:center; transition:all .2s; }
  .btn-delete:hover { border-color:rgba(192,57,43,.4); color:#e74c3c; }
  .tag { font-family:'DM Mono',monospace; font-size:9px; padding:3px 8px; border-radius:100px; white-space:nowrap; font-weight:500; }
  .tag-table { background:var(--info-bg); color:#6ab0d4; border:1px solid rgba(58,124,165,.3); }
  .tag-terrasse { background:var(--success-bg); color:var(--olive-bright); border:1px solid var(--olive-dim); }
  .tag-event { background:rgba(201,168,76,.15); color:var(--gold); border:1px solid rgba(201,168,76,.3); }
  .tag-privee { background:var(--danger-bg); color:#e74c3c; border:1px solid rgba(192,57,43,.3); }
  .tag-attente { background:rgba(201,168,76,.15); color:var(--gold); border:1px solid rgba(201,168,76,.3); }
  .tag-confirmee { background:var(--success-bg); color:var(--olive-bright); border:1px solid var(--olive-dim); }
  .tag-annulee { background:var(--danger-bg); color:#e74c3c; border:1px solid rgba(192,57,43,.3); }
  .task-card { background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:14px 16px; display:flex; align-items:center; gap:12px; transition:all .2s; margin-bottom:8px; }
  .task-card:hover { border-color:var(--olive-dim); }
  .task-check { width:22px; height:22px; border-radius:7px; border:1.5px solid var(--border); flex-shrink:0; display:flex; align-items:center; justify-content:center; transition:all .2s; cursor:pointer; font-size:12px; font-weight:700; }
  .task-check:hover { border-color:var(--olive); }
  .task-check.done { background:var(--olive); border-color:var(--olive); color:#000; }
  .task-title { font-size:13px; font-weight:600; color:var(--cream); margin-bottom:2px; }
  .task-title.done { text-decoration:line-through; color:var(--muted); }
  .task-meta { font-family:'DM Mono',monospace; font-size:10px; color:var(--muted); }
  .task-del { padding:4px 8px; background:var(--surface2); border:1px solid var(--border); border-radius:8px; font-size:11px; color:var(--muted); cursor:pointer; transition:all .2s; flex-shrink:0; }
  .task-del:hover { border-color:rgba(192,57,43,.4); color:#e74c3c; }
  .stock-item { background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:14px 16px; display:flex; align-items:center; gap:12px; transition:all .2s; margin-bottom:8px; }
  .stock-item:hover { border-color:var(--olive-dim); }
  .stock-item.alert { border-color:rgba(192,57,43,.4); background:linear-gradient(135deg,#1a0f0f,#1e1010); }
  .stock-icon { width:36px; height:36px; border-radius:10px; background:var(--surface2); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; font-size:16px; flex-shrink:0; }
  .stock-info { flex:1; }
  .stock-name { font-size:13px; font-weight:700; color:var(--cream); margin-bottom:2px; }
  .stock-cat { font-family:'DM Mono',monospace; font-size:10px; color:var(--muted); }
  .stock-bar { height:3px; border-radius:2px; background:var(--border); margin-top:6px; overflow:hidden; }
  .stock-bar-fill { height:100%; border-radius:2px; transition:width .5s; }
  .stock-qty { display:flex; flex-direction:column; align-items:center; gap:4px; }
  .stock-num { font-family:'DM Mono',monospace; font-size:16px; font-weight:500; color:var(--cream); }
  .stock-num.low { color:#e74c3c; }
  .stock-unit { font-family:'DM Mono',monospace; font-size:9px; color:var(--muted); }
  .qty-btns { display:flex; align-items:center; gap:6px; }
  .qty-btn { width:26px; height:26px; border-radius:8px; background:var(--surface2); border:1px solid var(--border); color:var(--cream); font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .2s; font-weight:700; line-height:1; user-select:none; }
  .qty-btn:hover { border-color:var(--olive); color:var(--olive-bright); }
  .planning-day { margin-bottom:20px; }
  .planning-date { font-family:'DM Mono',monospace; font-size:11px; color:var(--olive-bright); letter-spacing:.1em; text-transform:uppercase; margin-bottom:10px; padding:0 24px; }
  .shift-card { background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:14px 16px; display:flex; align-items:center; gap:12px; margin-bottom:8px; margin-left:24px; margin-right:24px; }
  .shift-avatar { width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:700; flex-shrink:0; }
  .shift-info { flex:1; }
  .shift-name { font-size:13px; font-weight:700; color:var(--cream); margin-bottom:2px; }
  .shift-poste { font-family:'DM Mono',monospace; font-size:10px; color:var(--muted); }
  .shift-hours { font-family:'DM Mono',monospace; font-size:12px; color:var(--olive-bright); }
  .fab { position:absolute; bottom:90px; right:20px; width:52px; height:52px; background:var(--olive-bright); border-radius:16px; display:flex; align-items:center; justify-content:center; font-size:28px; cursor:pointer; box-shadow:0 4px 20px rgba(138,154,46,.4); transition:all .25s; z-index:20; color:#000; line-height:1; font-weight:300; user-select:none; }
  .fab:hover { transform:scale(1.08) rotate(90deg); box-shadow:0 8px 30px rgba(138,154,46,.5); }
  .bottom-nav { position:absolute; bottom:0; left:0; right:0; background:rgba(15,15,13,.97); backdrop-filter:blur(20px); border-top:1px solid var(--border); padding:10px 4px 20px; display:flex; justify-content:space-around; z-index:10; }
  .nav-item { display:flex; flex-direction:column; align-items:center; gap:3px; cursor:pointer; padding:6px 10px; border-radius:12px; transition:all .2s; min-width:50px; }
  .nav-item:hover { background:var(--surface); }
  .nav-item.active { background:rgba(138,154,46,.12); }
  .nav-icon { font-size:20px; }
  .nav-label { font-family:'DM Mono',monospace; font-size:9px; color:var(--muted); }
  .nav-item.active .nav-label { color:var(--olive-bright); }
  .modal-overlay { position:absolute; inset:0; background:rgba(0,0,0,.7); z-index:50; display:flex; align-items:flex-end; animation:fadeIn .2s ease; }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  .modal { background:var(--surface); border:1px solid var(--border); border-radius:28px 28px 0 0; padding:24px; width:100%; animation:slideUp .3s ease; max-height:85vh; overflow-y:auto; }
  .modal-title { font-family:'DM Serif Display',serif; font-size:22px; color:var(--cream); margin-bottom:6px; }
  .modal-sub { font-family:'DM Mono',monospace; font-size:11px; color:var(--muted); margin-bottom:20px; }
  .field { margin-bottom:14px; }
  .field label { font-family:'DM Mono',monospace; font-size:10px; color:var(--muted); text-transform:uppercase; letter-spacing:.1em; display:block; margin-bottom:6px; }
  .field input,.field select,.field textarea { width:100%; background:var(--bg); border:1px solid var(--border); border-radius:12px; padding:11px 14px; color:var(--cream); font-family:'Syne',sans-serif; font-size:13px; outline:none; transition:border-color .2s; appearance:none; }
  .field input:focus,.field select:focus { border-color:var(--olive); }
  .field select option { background:var(--bg); }
  .modal-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .btn-primary { width:100%; padding:14px; background:var(--olive-bright); border:none; border-radius:14px; color:#000; font-family:'Syne',sans-serif; font-size:15px; font-weight:700; cursor:pointer; transition:all .2s; margin-top:4px; }
  .btn-primary:hover { background:#c0d840; transform:translateY(-1px); }
  .btn-cancel { width:100%; padding:12px; background:transparent; border:1px solid var(--border); border-radius:14px; color:var(--muted); font-family:'Syne',sans-serif; font-size:13px; cursor:pointer; transition:all .2s; margin-top:8px; }
  .btn-cancel:hover { border-color:var(--olive-dim); color:var(--text); }
  .filter-row { display:flex; gap:8px; overflow-x:auto; padding:0 24px; margin-bottom:14px; scrollbar-width:none; }
  .filter-row::-webkit-scrollbar { display:none; }
  .pill { display:inline-flex; align-items:center; gap:4px; flex-shrink:0; background:var(--surface); border:1px solid var(--border); border-radius:100px; padding:6px 12px; font-family:'DM Mono',monospace; font-size:10px; color:var(--muted); cursor:pointer; transition:all .2s; white-space:nowrap; }
  .pill:hover { border-color:var(--olive-dim); color:var(--text); }
  .pill.active { background:rgba(138,154,46,.15); border-color:var(--olive-dim); color:var(--olive-bright); }
  @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  .page-header { padding:20px 24px 16px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; }
  .page-title { font-family:'DM Serif Display',serif; font-size:26px; color:var(--cream); }
  .page-count { font-family:'DM Mono',monospace; font-size:11px; color:var(--muted); margin-top:2px; }
  .toast { position:absolute; top:70px; left:50%; transform:translateX(-50%); background:var(--olive-bright); color:#000; font-family:'DM Mono',monospace; font-size:11px; padding:8px 18px; border-radius:100px; z-index:200; white-space:nowrap; animation:slideUp .3s ease; font-weight:700; box-shadow:0 4px 20px rgba(138,154,46,.4); }
  .empty { font-family:'DM Mono',monospace; font-size:11px; color:var(--muted); text-align:center; padding:24px 0; }
  /* ── TABLES ── */
  .tables-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; padding:16px 24px 0; }
  .table-card { border-radius:18px; padding:16px 14px; cursor:pointer; transition:all .25s; position:relative; overflow:hidden; border:1.5px solid transparent; animation:slideUp .3s ease both; }
  .table-card.libre { background:var(--surface); border-color:var(--border); }
  .table-card.libre:hover { border-color:var(--olive-dim); transform:translateY(-2px); }
  .table-card.encours { background:linear-gradient(135deg,#1e1a08,#2a2410); border-color:rgba(201,168,76,.4); }
  .table-card.encours:hover { border-color:var(--gold); transform:translateY(-2px); }
  .table-card.apayer { background:linear-gradient(135deg,#1a0f0f,#220d0d); border-color:rgba(192,57,43,.5); }
  .table-status-dot { width:8px; height:8px; border-radius:50%; margin-bottom:10px; }
  .dot-libre { background:var(--olive-bright); }
  .dot-encours { background:var(--gold); }
  .dot-apayer { background:#e74c3c; }
  .table-name { font-size:15px; font-weight:800; color:var(--cream); margin-bottom:2px; }
  .table-info { font-family:'DM Mono',monospace; font-size:10px; color:var(--muted); }
  .table-total { font-family:'DM Mono',monospace; font-size:13px; font-weight:600; color:var(--gold); margin-top:8px; }
  .table-zone-label { font-family:'DM Mono',monospace; font-size:9px; letter-spacing:.12em; text-transform:uppercase; color:var(--muted); padding:14px 24px 6px; }
  .commande-header { padding:16px 24px 14px; border-bottom:1px solid var(--border); display:flex; align-items:center; gap:12px; }
  .back-btn { width:36px; height:36px; background:var(--surface); border:1px solid var(--border); border-radius:11px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:16px; transition:border-color .2s; flex-shrink:0; }
  .back-btn:hover { border-color:var(--olive); }
  .commande-table-name { font-family:'DM Serif Display',serif; font-size:22px; color:var(--cream); }
  .commande-table-status { font-family:'DM Mono',monospace; font-size:10px; color:var(--muted); }
  .menu-cats { display:flex; gap:8px; overflow-x:auto; padding:12px 24px; scrollbar-width:none; border-bottom:1px solid var(--border); }
  .menu-cats::-webkit-scrollbar { display:none; }
  .menu-cat-btn { flex-shrink:0; padding:7px 14px; border-radius:100px; font-family:'DM Mono',monospace; font-size:11px; cursor:pointer; transition:all .2s; white-space:nowrap; background:var(--surface); border:1px solid var(--border); color:var(--muted); }
  .menu-cat-btn.active { background:rgba(138,154,46,.15); border-color:var(--olive-dim); color:var(--olive-bright); }
  .menu-items { padding:10px 24px 0; }
  .menu-item { display:flex; align-items:center; justify-content:space-between; padding:12px 14px; background:var(--surface); border:1px solid var(--border); border-radius:14px; margin-bottom:8px; cursor:pointer; transition:all .2s; gap:10px; }
  .menu-item:hover { border-color:var(--olive-dim); background:var(--surface2); }
  .menu-item-info { flex:1; }
  .menu-item-name { font-size:13px; font-weight:600; color:var(--cream); }
  .menu-item-desc { font-family:'DM Mono',monospace; font-size:10px; color:var(--muted); margin-top:1px; }
  .menu-item-right { display:flex; align-items:center; gap:10px; }
  .menu-item-price { font-family:'DM Mono',monospace; font-size:14px; font-weight:600; color:var(--olive-bright); }
  .menu-item-add { width:28px; height:28px; background:var(--olive-bright); border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:20px; color:#000; font-weight:300; flex-shrink:0; }
  .ticket { background:var(--surface2); border-top:1px solid var(--border); padding:14px 24px; }
  .ticket-title { font-family:'DM Mono',monospace; font-size:10px; letter-spacing:.12em; text-transform:uppercase; color:var(--muted); margin-bottom:10px; }
  .ticket-line { display:flex; align-items:center; gap:8px; margin-bottom:6px; }
  .ticket-qty { font-family:'DM Mono',monospace; font-size:11px; color:var(--olive-bright); min-width:20px; }
  .ticket-item-name { font-size:12px; color:var(--cream); flex:1; }
  .ticket-item-price { font-family:'DM Mono',monospace; font-size:11px; color:var(--muted); }
  .ticket-remove { font-size:16px; color:var(--muted); cursor:pointer; padding:0 2px; transition:color .2s; }
  .ticket-remove:hover { color:#e74c3c; }
  .ticket-total { display:flex; justify-content:space-between; align-items:center; padding-top:10px; margin-top:6px; border-top:1px solid var(--border); }
  .ticket-total-label { font-family:'DM Mono',monospace; font-size:11px; color:var(--muted); }
  .ticket-total-amount { font-family:'DM Mono',monospace; font-size:20px; font-weight:700; color:var(--cream); }
  .commande-actions { display:flex; gap:8px; padding:12px 24px 16px; }
  .btn-envoyer { flex:1; padding:13px; background:var(--olive-bright); border:none; border-radius:14px; color:#000; font-family:'Syne',sans-serif; font-size:14px; font-weight:700; cursor:pointer; transition:all .2s; }
  .btn-envoyer:hover { background:#c0d840; }
  .btn-encaisser { flex:1; padding:13px; background:linear-gradient(135deg,#1a3a1a,#1e4a1e); border:1.5px solid rgba(138,154,46,.5); border-radius:14px; color:var(--olive-bright); font-family:'Syne',sans-serif; font-size:14px; font-weight:700; cursor:pointer; transition:all .2s; }
  .btn-liberer { padding:13px 16px; background:var(--surface2); border:1px solid var(--border); border-radius:14px; color:var(--muted); font-family:'DM Mono',monospace; font-size:11px; cursor:pointer; transition:all .2s; }
  .ca-bar-wrap { background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:14px 16px; margin:14px 24px 0; }
  .ca-bar-top { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:8px; }
  .ca-bar-label { font-family:'DM Mono',monospace; font-size:10px; color:var(--muted); text-transform:uppercase; letter-spacing:.1em; }
  .ca-bar-value { font-family:'DM Mono',monospace; font-size:18px; font-weight:700; color:var(--cream); }
  .ca-bar-track { height:6px; background:var(--border); border-radius:4px; overflow:hidden; }
  .ca-bar-fill { height:100%; border-radius:4px; background:linear-gradient(90deg,var(--olive-dim),var(--olive-bright)); transition:width .8s ease; }
  .ca-bar-sub { font-family:'DM Mono',monospace; font-size:10px; color:var(--muted); margin-top:6px; display:flex; justify-content:space-between; }
`;

// ─── HELPERS ──────────────────────────────────────────────────────────────
function getTagClass(type) {
  if (!type) return "tag";
  const t = type.toLowerCase();
  if (t.includes("terrasse")) return "tag tag-terrasse";
  if (t.includes("événement")||t.includes("event")) return "tag tag-event";
  if (t.includes("privé")||t.includes("priva")) return "tag tag-privee";
  return "tag tag-table";
}
function getStatutClass(s) {
  if (!s) return "tag";
  if (s==="Confirmée") return "tag tag-confirmee";
  if (s==="En attente") return "tag tag-attente";
  if (s==="Annulée") return "tag tag-annulee";
  return "tag";
}
function var_gold() { return "#c9a84c"; }
function getCatEmoji(cat) {
  const map = {"Boissons alcoolisées":"🍾","Softs":"🥤","Nourriture":"🍋","Matériel":"🍷","Consommables":"🧻"};
  return map[cat]||"📦";
}
function getAvatarColor(name) {
  const colors = ["#8a9a2e","#3a7ca5","#c9a84c","#9b59b6","#e67e22"];
  let h=0; for(let c of (name||"")) h+=c.charCodeAt(0);
  return colors[h%colors.length];
}
function formatDate(d) {
  if (!d) return "";
  try { return new Date(d).toLocaleDateString("fr-FR",{weekday:"short",day:"numeric",month:"short"}); }
  catch { return d; }
}
async function apiCall(body) {
  const res = await fetch(API_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
  return res.json();
}

// ─── MODALS ──────────────────────────────────────────────────────────────
function AddResaModal({onClose,onAdd}) {
  const [form,setForm]=useState({nom:"",tel:"",date:"",heure:"",couverts:"",type:"Table classique",statut:"En attente",notes:""});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const submit=()=>{if(!form.nom||!form.date||!form.heure)return;onAdd({...form,couverts:Number(form.couverts)});onClose();};
  return(
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div className="modal-title">Nouvelle réservation</div>
        <div className="modal-sub">Remplissez les infos</div>
        <div className="field"><label>Nom *</label><input value={form.nom} onChange={e=>set("nom",e.target.value)} placeholder="Nom du client"/></div>
        <div className="field"><label>Téléphone</label><input value={form.tel} onChange={e=>set("tel",e.target.value)} placeholder="06 ..."/></div>
        <div className="modal-grid">
          <div className="field"><label>Date *</label><input type="date" value={form.date} onChange={e=>set("date",e.target.value)}/></div>
          <div className="field"><label>Heure *</label><input type="time" value={form.heure} onChange={e=>set("heure",e.target.value)}/></div>
        </div>
        <div className="modal-grid">
          <div className="field"><label>Couverts</label><input type="number" value={form.couverts} onChange={e=>set("couverts",e.target.value)} placeholder="2"/></div>
          <div className="field"><label>Type</label>
            <select value={form.type} onChange={e=>set("type",e.target.value)}>
              {["Table classique","Terrasse","Salle privatisable","Événement privé"].map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div className="field"><label>Notes</label><input value={form.notes} onChange={e=>set("notes",e.target.value)} placeholder="Infos..."/></div>
        <button className="btn-primary" onClick={submit}>Ajouter</button>
        <button className="btn-cancel" onClick={onClose}>Annuler</button>
      </div>
    </div>
  );
}

function AddStockModal({onClose,onAdd}) {
  const [form,setForm]=useState({produit:"",categorie:"Boissons alcoolisées",quantite:"",unite:"bouteille",seuil:"",fournisseur:""});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const submit=()=>{if(!form.produit||!form.quantite)return;onAdd({...form,quantite:Number(form.quantite),seuil:Number(form.seuil)});onClose();};
  return(
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div className="modal-title">Nouveau produit</div>
        <div className="modal-sub">Ajout au stock</div>
        <div className="field"><label>Produit *</label><input value={form.produit} onChange={e=>set("produit",e.target.value)} placeholder="Nom du produit"/></div>
        <div className="field"><label>Catégorie</label>
          <select value={form.categorie} onChange={e=>set("categorie",e.target.value)}>
            {["Boissons alcoolisées","Softs","Nourriture","Matériel","Consommables"].map(c=><option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="modal-grid">
          <div className="field"><label>Quantité *</label><input type="number" value={form.quantite} onChange={e=>set("quantite",e.target.value)} placeholder="0"/></div>
          <div className="field"><label>Unité</label>
            <select value={form.unite} onChange={e=>set("unite",e.target.value)}>
              {["bouteille","pack","pièce","kg","litre","canette"].map(u=><option key={u}>{u}</option>)}
            </select>
          </div>
        </div>
        <div className="modal-grid">
          <div className="field"><label>Seuil alerte</label><input type="number" value={form.seuil} onChange={e=>set("seuil",e.target.value)} placeholder="3"/></div>
          <div className="field"><label>Fournisseur</label><input value={form.fournisseur} onChange={e=>set("fournisseur",e.target.value)} placeholder="Metro..."/></div>
        </div>
        <button className="btn-primary" onClick={submit}>Ajouter au stock</button>
        <button className="btn-cancel" onClick={onClose}>Annuler</button>
      </div>
    </div>
  );
}


function AddShiftModal({onClose,onAdd}) {
  const employes=["Marius","Marie","Charlotte","Fanny","Thomas"];
  const postes=["Manager","Bar","Service","Cuisine","Plonge"];
  const [form,setForm]=useState({employe:employes[0],poste:postes[0],date:"",debut:"",fin:""});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const submit=()=>{if(!form.date||!form.debut||!form.fin)return;onAdd({...form});onClose();};
  return(
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div className="modal-title">Ajouter un shift</div>
        <div className="modal-sub">Planifier un employé</div>
        <div className="modal-grid">
          <div className="field"><label>Employé</label>
            <select value={form.employe} onChange={e=>set("employe",e.target.value)}>
              {employes.map(e=><option key={e}>{e}</option>)}
            </select>
          </div>
          <div className="field"><label>Poste</label>
            <select value={form.poste} onChange={e=>set("poste",e.target.value)}>
              {postes.map(p=><option key={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <div className="field"><label>Date</label><input type="date" value={form.date} onChange={e=>set("date",e.target.value)}/></div>
        <div className="modal-grid">
          <div className="field"><label>Début</label><input type="time" value={form.debut} onChange={e=>set("debut",e.target.value)}/></div>
          <div className="field"><label>Fin</label><input type="time" value={form.fin} onChange={e=>set("fin",e.target.value)}/></div>
        </div>
        <button className="btn-primary" onClick={submit}>Ajouter le shift</button>
        <button className="btn-cancel" onClick={onClose}>Annuler</button>
      </div>
    </div>
  );
}

function AddTacheModal({onClose,onAdd}) {
  const [form,setForm]=useState({titre:"",categorie:"Service",statut:"À faire",assigne:"",deadline:"",notes:""});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const submit=()=>{if(!form.titre)return;onAdd({...form});onClose();};
  return(
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div className="modal-title">Nouvelle tâche</div>
        <div className="modal-sub">Ajouter une tâche</div>
        <div className="field"><label>Titre *</label><input value={form.titre} onChange={e=>set("titre",e.target.value)} placeholder="Décrire la tâche..."/></div>
        <div className="modal-grid">
          <div className="field"><label>Catégorie</label>
            <select value={form.categorie} onChange={e=>set("categorie",e.target.value)}>
              {["Service","Exploitation","Cuisine","Admin","Entretien"].map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="field"><label>Assigné à</label><input value={form.assigne} onChange={e=>set("assigne",e.target.value)} placeholder="Prénom..."/></div>
        </div>
        <div className="field"><label>Date limite</label><input type="date" value={form.deadline} onChange={e=>set("deadline",e.target.value)}/></div>
        <button className="btn-primary" onClick={submit}>Ajouter la tâche</button>
        <button className="btn-cancel" onClick={onClose}>Annuler</button>
      </div>
    </div>
  );
}

// ─── PAGES ────────────────────────────────────────────────────────────────
function Dashboard({data,onNav,caJour}) {
  const today=new Date().toISOString().split("T")[0];
  const alertes=data.stock.filter(s=>Number(s.quantite)<=Number(s.seuil));
  const resasSoir=data.reservations.filter(r=>r.date===today);
  const tachesUrgentes=data.taches.filter(t=>t.statut!=="Fait").slice(0,3);
  const tachesRestantes=data.taches.filter(t=>t.statut!=="Fait");
  const couverts=resasSoir.reduce((a,r)=>a+Number(r.couverts),0);
  const resasConfirmees=resasSoir.filter(r=>r.statut==="Confirmée").length;
  const resasAttente=resasSoir.filter(r=>r.statut==="En attente").length;
  return(
    <>
      <div className="header">
        <div className="header-top">
          <div>
            <div className="greeting">Bonsoir, Marie et Marius 👋</div>
            <div className="logo">Bar<em>OS</em></div>
          </div>
          <div className="notif-btn">🔔{(alertes.length>0||resasAttente>0)&&<div className="notif-dot"/>}</div>
        </div>
        <div className="date-pill"><span className="pulse-dot"/> {new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"})}</div>
      </div>

      <div className="section">
        <div className="section-label">Ce soir</div>
        <div className="kpi-grid">
          <div className="kpi-card featured" onClick={()=>onNav("reservations")}>
            <div className="kpi-glow"/>
            <div>
              <div className="kpi-label">Réservations</div>
              <div className="kpi-value">{resasSoir.length}</div>
              <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>
                <div className="kpi-badge">✓ {resasConfirmees} confirmées</div>
                {resasAttente>0&&<div className="kpi-badge" style={{background:"rgba(201,168,76,.15)",borderColor:"rgba(201,168,76,.3)",color:"var(--gold)"}}>⏳ {resasAttente} attente</div>}
              </div>
            </div>
            <div style={{fontSize:42,opacity:.4}}>🍽️</div>
          </div>
          <div className="kpi-card" onClick={()=>onNav("reservations")}>
            <span className="kpi-icon">👥</span>
            <div className="kpi-label">Couverts</div>
            <div className="kpi-value">{couverts}</div>
            <div className="kpi-sub">ce soir</div>
          </div>
          <div className="kpi-card" onClick={()=>onNav("taches")}>
            <span className="kpi-icon">✅</span>
            <div className="kpi-label">Tâches</div>
            <div className="kpi-value">{data.taches.length-tachesRestantes.length}<span style={{fontSize:14,color:"var(--muted)"}}>/{data.taches.length}</span></div>
            <div className={`kpi-sub ${tachesRestantes.length>3?"warn":""}`}>{tachesRestantes.length} restantes</div>
          </div>
          <div className="kpi-card" onClick={()=>onNav("stock")}>
            <span className="kpi-icon">📦</span>
            <div className="kpi-label">Stock</div>
            <div className="kpi-value" style={{fontSize:alertes.length>0?"20px":"26px",color:alertes.length>0?"#e74c3c":"var(--cream)"}}>
              {alertes.length>0?`⚠️ ${alertes.length}`:"OK"}
            </div>
            <div className={`kpi-sub ${alertes.length>0?"danger":""}`}>{alertes.length>0?"alertes bas":"tout ok"}</div>
          </div>
        </div>
      </div>

      {/* CA du jour */}
      <div className="ca-bar-wrap" onClick={()=>onNav("tables")} style={{cursor:"pointer"}}>
        <div className="ca-bar-top">
          <div className="ca-bar-label">💰 CA du jour</div>
          <div className="ca-bar-value">{caJour.toFixed(2)}€</div>
        </div>
        <div className="ca-bar-track"><div className="ca-bar-fill" style={{width:`${Math.min((caJour/500)*100,100)}%`}}/></div>
        <div className="ca-bar-sub"><span>Objectif 500€</span><span style={{color:caJour>=500?"var(--olive-bright)":"var(--muted)"}}>{caJour>=500?"✓ Atteint !":caJour>0?`${(500-caJour).toFixed(0)}€ restants`:"Ouvrir une table →"}</span></div>
      </div>

      {/* Alertes stock — seulement si problème */}
      {alertes.length>0&&(
        <div className="stock-alert" onClick={()=>onNav("stock")}>
          <div className="alert-icon">⚠️</div>
          <div style={{flex:1}}>
            <div className="alert-title">Stock critique — commander maintenant</div>
            <div className="alert-sub">{alertes.map(a=>a.produit).join(" · ")}</div>
          </div>
          <span style={{color:"var(--muted)",fontSize:16}}>›</span>
        </div>
      )}

      {/* Tâches urgentes — max 3, seulement "À faire" */}
      {tachesUrgentes.length>0&&(
        <>
          <div className="divider"><div className="divider-line"/><div className="divider-label">Urgent</div><div className="divider-line"/></div>
          <div className="section" style={{paddingBottom:20}}>
            <div className="section-header">
              <div className="section-label" style={{margin:0}}>Tâches à faire</div>
              <span className="see-all" onClick={()=>onNav("taches")}>Tout voir →</span>
            </div>
            {tachesUrgentes.map((t,i)=>(
              <div key={i} className="task-card">
                <div className="task-check"/>
                <div style={{flex:1}}>
                  <div className="task-title">{t.titre}</div>
                  <div className="task-meta">{t.assigne&&`${t.assigne} · `}{t.categorie}</div>
                </div>
                <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,padding:"3px 8px",borderRadius:100,background:"var(--surface2)",border:"1px solid var(--border)",color:"var(--muted)"}}>{t.categorie}</span>
              </div>
            ))}
            {tachesRestantes.length>3&&(
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"var(--olive-bright)",textAlign:"center",padding:"8px 0",cursor:"pointer"}} onClick={()=>onNav("taches")}>
                + {tachesRestantes.length-3} autres tâches →
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

function Stock({data,setData,showToast}) {
  const [modal,setModal]=useState(false);
  const [filtre,setFiltre]=useState("Tout");
  const [editingProduit,setEditingProduit]=useState(null);
  const [editVal,setEditVal]=useState("");
  const cats=["Tout","Boissons alcoolisées","Softs","Nourriture","Matériel","Consommables"];
  const filtered=filtre==="Tout"?data.stock:data.stock.filter(s=>s.categorie===filtre);
  const alertes=data.stock.filter(s=>Number(s.quantite)<=Number(s.seuil));

  const addItem=async(item)=>{
    await apiCall({sheet:"Stock",action:"add",data:item});
    setData(d=>({...d,stock:[...d.stock,item]}));
    showToast("Produit ajouté ✓");
  };

  const updateQty=async(produit,delta)=>{
    const idx=data.stock.findIndex(s=>s.produit===produit);
    if(idx===-1)return;
    const item=data.stock[idx];
    const newQty=Math.max(0,Number(item.quantite)+delta);
    setData(d=>({...d,stock:d.stock.map((s,i)=>i===idx?{...s,quantite:newQty}:s)}));
    await apiCall({sheet:"Stock",action:"update",rowId:produit,searchCol:"produit",data:{quantite:newQty}});
    showToast(`${produit} → ${newQty} ${item.unite}`);
  };

  const startEdit=(produit,current)=>{
    setEditingProduit(produit);
    setEditVal(String(current));
  };

  const confirmEdit=async(produit)=>{
    const val=parseInt(editVal,10);
    if(isNaN(val)||val<0){setEditingProduit(null);return;}
    const idx=data.stock.findIndex(s=>s.produit===produit);
    if(idx===-1){setEditingProduit(null);return;}
    const item=data.stock[idx];
    setData(d=>({...d,stock:d.stock.map((s,i)=>i===idx?{...s,quantite:val}:s)}));
    setEditingProduit(null);
    await apiCall({sheet:"Stock",action:"update",rowId:produit,searchCol:"produit",data:{quantite:val}});
    showToast(`${produit} → ${val} ${item.unite}`);
  };

  return(
    <>
      <div className="page-header">
        <div><div className="page-title">Stock</div><div className="page-count">{data.stock.length} produits · {alertes.length} alertes</div></div>
      </div>
      {alertes.length>0&&(
        <div style={{padding:"14px 24px 0"}}>
          <div className="stock-alert" style={{margin:0}}>
            <div className="alert-icon">⚠️</div>
            <div style={{flex:1}}>
              <div className="alert-title">{alertes.length} produit{alertes.length>1?"s":""} en rupture</div>
              <div className="alert-sub">{alertes.map(a=>a.produit).join(", ")}</div>
            </div>
          </div>
        </div>
      )}
      <div style={{paddingTop:14}}>
        <div className="filter-row">
          {cats.map(c=><div key={c} className={`pill ${filtre===c?"active":""}`} onClick={()=>setFiltre(c)}>{c}</div>)}
        </div>
      </div>
      <div style={{padding:"0 24px"}}>
        {filtered.map((s,i)=>{
          const isLow=Number(s.quantite)<=Number(s.seuil);
          const ratio=Math.min(Number(s.quantite)/(Number(s.seuil)*2||1),1);
          const barColor=isLow?"#e74c3c":Number(s.quantite)<=Number(s.seuil)*1.2?var_gold():"#aabf38";
          const isEditing=editingProduit===s.produit;
          return(
            <div key={i} className={`stock-item ${isLow?"alert":""}`}>
              <div className="stock-icon">{getCatEmoji(s.categorie)}</div>
              <div className="stock-info">
                <div className="stock-name">{s.produit}</div>
                <div className="stock-cat">{s.categorie}{s.fournisseur?` · ${s.fournisseur}`:""}</div>
                <div className="stock-bar"><div className="stock-bar-fill" style={{width:`${ratio*100}%`,background:barColor}}/></div>
              </div>
              <div className="stock-qty">
                <div className="qty-btns">
                  <div className="qty-btn" onClick={()=>updateQty(s.produit,-1)}>−</div>
                  {isEditing?(
                    <input
                      type="number"
                      value={editVal}
                      onChange={e=>setEditVal(e.target.value)}
                      onBlur={()=>confirmEdit(s.produit)}
                      onKeyDown={e=>{if(e.key==="Enter")confirmEdit(s.produit);if(e.key==="Escape")setEditingProduit(null);}}
                      autoFocus
                      style={{width:44,background:"var(--bg)",border:"1px solid var(--olive)",borderRadius:8,color:"var(--cream)",fontFamily:"'DM Mono',monospace",fontSize:14,textAlign:"center",padding:"2px 4px",outline:"none"}}
                    />
                  ):(
                    <div
                      className={`stock-num ${isLow?"low":""}`}
                      onClick={()=>startEdit(s.produit,s.quantite)}
                      title="Cliquer pour modifier"
                      style={{cursor:"pointer",borderBottom:"1px dashed var(--border)",minWidth:28,textAlign:"center"}}
                    >{s.quantite}</div>
                  )}
                  <div className="qty-btn" onClick={()=>updateQty(s.produit,1)}>+</div>
                </div>
                <div className="stock-unit">{s.unite}</div>
              </div>
            </div>
          );
        })}
      </div>
      {modal&&<AddStockModal onClose={()=>setModal(false)} onAdd={addItem}/>}
      <div className="fab" onClick={()=>setModal(true)}>+</div>
    </>
  );
}

function Reservations({data,setData,showToast}) {
  const [modal,setModal]=useState(false);
  const [filtre,setFiltre]=useState("Tout");
  const filtres=["Tout","En attente","Confirmée","Annulée","Terrasse","Événement privé"];
  const filtered=data.reservations.filter(r=>{
    if(filtre==="Tout")return true;
    if(["En attente","Confirmée","Annulée"].includes(filtre))return r.statut===filtre;
    return r.type===filtre;
  }).sort((a,b)=>String(a.date).localeCompare(String(b.date))||String(a.heure).localeCompare(String(b.heure)));

  const addResa=async(r)=>{
    await apiCall({sheet:"Reservations",action:"add",data:r});
    setData(d=>({...d,reservations:[...d.reservations,r]}));
    showToast("Réservation ajoutée ✓");
  };

  const updateStatut=async(nom,newStatut)=>{
    setData(d=>({...d,reservations:d.reservations.map(r=>r.nom===nom?{...r,statut:newStatut}:r)}));
    await apiCall({sheet:"Reservations",action:"update",rowId:nom,searchCol:"nom",data:{statut:newStatut}});
    showToast(`${nom} → ${newStatut} ✓`);
  };

  const deleteResa=async(nom)=>{
    setData(d=>({...d,reservations:d.reservations.filter(r=>r.nom!==nom)}));
    await apiCall({sheet:"Reservations",action:"delete",rowId:nom,searchCol:"nom"});
    showToast("Supprimée ✓");
  };

  return(
    <>
      <div className="page-header">
        <div><div className="page-title">Réservations</div><div className="page-count">{data.reservations.length} total · {data.reservations.filter(r=>r.statut==="En attente").length} en attente</div></div>
      </div>
      <div style={{paddingTop:14}}>
        <div className="filter-row">
          {filtres.map(f=><div key={f} className={`pill ${filtre===f?"active":""}`} onClick={()=>setFiltre(f)}>{f}</div>)}
        </div>
      </div>
      <div style={{padding:"0 24px"}}>
        {filtered.length===0&&<div className="empty">Aucune réservation</div>}
        {filtered.map((r,i)=>(
          <div key={i} className="resa-card" style={{animationDelay:`${i*.05}s`}}>
            <div className="resa-time">{r.heure}</div>
            <div className="resa-div"/>
            <div className="resa-info">
              <div className="resa-name">{r.nom}</div>
              <div className="resa-details">{r.couverts} pers. · {formatDate(r.date)}{r.notes?` · ${r.notes}`:""}</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"flex-end"}}>
              <span className={getTagClass(r.type)}>{r.type?r.type.split(" ")[0]:""}</span>
              <span className={getStatutClass(r.statut)}>{r.statut}</span>
            </div>
            <div className="resa-actions">
              {r.statut!=="Confirmée"&&<div className="btn-confirm" onClick={()=>updateStatut(r.nom,"Confirmée")}>✓ Confirmer</div>}
              {r.statut!=="Annulée"&&<div className="btn-cancel-resa" onClick={()=>updateStatut(r.nom,"Annulée")}>✗ Annuler</div>}
              <div className="btn-delete" onClick={()=>deleteResa(r.nom)}>🗑</div>
            </div>
          </div>
        ))}
      </div>
      {modal&&<AddResaModal onClose={()=>setModal(false)} onAdd={addResa}/>}
      <div className="fab" onClick={()=>setModal(true)}>+</div>
    </>
  );
}

function Taches({data,setData,showToast}) {
  const [modal,setModal]=useState(false);
  const [filtre,setFiltre]=useState("Tout");
  const cats=["Tout","Service","Exploitation","Cuisine","Admin","Entretien"];
  const filtered=filtre==="Tout"?data.taches:data.taches.filter(t=>t.categorie===filtre);

  const toggle=async(titre)=>{
    const tache=data.taches.find(t=>t.titre===titre);
    if(!tache)return;
    const newStatut=tache.statut==="Fait"?"À faire":"Fait";
    setData(d=>({...d,taches:d.taches.map(t=>t.titre===titre?{...t,statut:newStatut}:t)}));
    await apiCall({sheet:"Taches",action:"update",rowId:titre,searchCol:"titre",data:{statut:newStatut}});
    showToast(newStatut==="Fait"?`✓ ${titre}`:`↩ ${titre}`);
  };

  const deleteTache=async(titre)=>{
    setData(d=>({...d,taches:d.taches.filter(t=>t.titre!==titre)}));
    await apiCall({sheet:"Taches",action:"delete",rowId:titre,searchCol:"titre"});
    showToast("Tâche supprimée");
  };

  const addTache=async(t)=>{
    await apiCall({sheet:"Taches",action:"add",data:t});
    setData(d=>({...d,taches:[...d.taches,t]}));
    showToast("Tâche ajoutée ✓");
  };

  return(
    <>
      <div className="page-header">
        <div><div className="page-title">Tâches</div><div className="page-count">{data.taches.filter(t=>t.statut!=="Fait").length} restantes</div></div>
      </div>
      <div style={{paddingTop:14}}>
        <div className="filter-row">
          {cats.map(c=><div key={c} className={`pill ${filtre===c?"active":""}`} onClick={()=>setFiltre(c)}>{c}</div>)}
        </div>
      </div>
      <div style={{padding:"0 24px"}}>
        {filtered.length===0&&<div className="empty">Aucune tâche</div>}
        {filtered.map((t,i)=>(
          <div key={i} className="task-card">
            <div className={`task-check ${t.statut==="Fait"?"done":""}`} onClick={()=>toggle(t.titre)}>{t.statut==="Fait"?"✓":""}</div>
            <div style={{flex:1}}>
              <div className={`task-title ${t.statut==="Fait"?"done":""}`}>{t.titre}</div>
              <div className="task-meta">{t.assigne&&`${t.assigne} · `}{t.categorie}{t.deadline?` · ${formatDate(t.deadline)}`:""}</div>
            </div>
            <div className="task-del" onClick={()=>deleteTache(t.titre)}>🗑</div>
          </div>
        ))}
      </div>
      {modal&&<AddTacheModal onClose={()=>setModal(false)} onAdd={addTache}/>}
      <div className="fab" onClick={()=>setModal(true)}>+</div>
    </>
  );
}

function Planning({data,setData,showToast}) {
  const [modal,setModal]=useState(false);
  const [filterDate,setFilterDate]=useState("");
  const postes={"Manager":"🎯","Bar":"🍹","Service":"🍽️","Cuisine":"👨‍🍳","Plonge":"🪣"};

  const allDays=[...new Set(data.planning.map(p=>p.date))].sort();
  const days=filterDate?allDays.filter(d=>d===filterDate):allDays;

  const addShift=async(shift)=>{
    await apiCall({sheet:"Planning",action:"add",data:shift});
    setData(d=>({...d,planning:[...d.planning,shift]}));
    showToast(`${shift.employe} ajouté ✓`);
  };

  const deleteShift=async(employe,date,debut)=>{
    setData(d=>({...d,planning:d.planning.filter(p=>!(p.employe===employe&&p.date===date&&p.debut===debut))}));
    await apiCall({sheet:"Planning",action:"delete",rowId:employe,searchCol:"employe"});
    showToast("Shift supprimé");
  };

  // Résumé par employé
  const employes=["Marius","Marie","Charlotte","Fanny","Thomas"];
  const shiftsParEmploye=employes.map(e=>({
    nom:e,
    shifts:data.planning.filter(p=>p.employe===e).length,
    heures:data.planning.filter(p=>p.employe===e).reduce((acc,p)=>{
      try{const [dh,dm]=p.debut.split(":").map(Number);const [fh,fm]=p.fin.split(":").map(Number);let diff=(fh*60+fm)-(dh*60+dm);if(diff<0)diff+=24*60;return acc+diff/60;}catch{return acc;}
    },0)
  }));

  return(
    <>
      <div className="page-header">
        <div><div className="page-title">Planning</div><div className="page-count">{data.planning.length} shifts planifiés</div></div>
      </div>

      {/* Résumé équipe */}
      <div style={{padding:"14px 24px 0",display:"flex",gap:8,overflowX:"auto",scrollbarWidth:"none"}}>
        {shiftsParEmploye.map(e=>(
          <div key={e.nom} style={{flexShrink:0,background:"var(--surface)",border:"1px solid var(--border)",borderRadius:12,padding:"10px 14px",minWidth:90,textAlign:"center",cursor:"pointer",transition:"border-color .2s"}}
            onClick={()=>setFilterDate(filterDate===""?data.planning.find(p=>p.employe===e.nom)?.date||"":"")}
          >
            <div style={{width:32,height:32,borderRadius:10,background:getAvatarColor(e.nom)+"22",border:`1px solid ${getAvatarColor(e.nom)}44`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 6px",fontWeight:700,color:getAvatarColor(e.nom)}}>{e.nom[0]}</div>
            <div style={{fontSize:12,fontWeight:700,color:"var(--cream)"}}>{e.nom}</div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"var(--muted)",marginTop:2}}>{e.shifts} shift{e.shifts!==1?"s":""} · {e.heures.toFixed(0)}h</div>
          </div>
        ))}
      </div>

      {/* Filtre date */}
      <div style={{padding:"12px 24px 0",display:"flex",gap:8,alignItems:"center"}}>
        <input type="date" value={filterDate} onChange={e=>setFilterDate(e.target.value)}
          style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:10,padding:"7px 12px",color:"var(--cream)",fontFamily:"'DM Mono',monospace",fontSize:11,outline:"none",flex:1}}
        />
        {filterDate&&<div onClick={()=>setFilterDate("")} style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"var(--muted)",cursor:"pointer",padding:"7px 12px",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:10}}>✕ Tout</div>}
      </div>

      <div style={{paddingTop:14}}>
        {days.length===0&&<div className="empty">Aucun shift{filterDate?" ce jour-là":""}</div>}
        {days.map(day=>(
          <div key={day} className="planning-day">
            <div className="planning-date">{formatDate(day)}</div>
            {data.planning.filter(p=>p.date===day).map((p,i)=>(
              <div key={i} className="shift-card">
                <div className="shift-avatar" style={{background:getAvatarColor(p.employe)+"22",border:`1px solid ${getAvatarColor(p.employe)}44`}}>
                  <span style={{color:getAvatarColor(p.employe)}}>{(p.employe||"?")[0]}</span>
                </div>
                <div className="shift-info">
                  <div className="shift-name">{p.employe}</div>
                  <div className="shift-poste">{postes[p.poste]||"👤"} {p.poste}</div>
                </div>
                <div className="shift-hours">{p.debut} – {p.fin}</div>
                <div className="task-del" onClick={()=>deleteShift(p.employe,p.date,p.debut)}>🗑</div>
              </div>
            ))}
          </div>
        ))}
      </div>
      {modal&&<AddShiftModal onClose={()=>setModal(false)} onAdd={addShift}/>}
      <div className="fab" onClick={()=>setModal(true)}>+</div>
    </>
  );
}


// ─── MENU DATA ─────────────────────────────────────────────────────────────
const MENU = [
  // Bières
  { id:"b1", cat:"Bières", nom:"Heineken", desc:"33cl bouteille", prix:4.5, stockProduit:"Bière Heineken" },
  { id:"b2", cat:"Bières", nom:"Chouffe", desc:"33cl bouteille", prix:5.5, stockProduit:"Bière Chouffe" },
  { id:"b3", cat:"Bières", nom:"IPA Locale", desc:"33cl bouteille", prix:5.5, stockProduit:"Bière IPA" },
  { id:"b4", cat:"Bières", nom:"Bière pression", desc:"25cl", prix:4.0, stockProduit:null },
  // Cocktails
  { id:"c1", cat:"Cocktails", nom:"Mojito", desc:"Rhum, menthe, citron", prix:9.0, stockProduit:"Rhum" },
  { id:"c2", cat:"Cocktails", nom:"Sex on the Beach", desc:"Vodka, pêche, jus", prix:9.0, stockProduit:"Vodka Grey Goose" },
  { id:"c3", cat:"Cocktails", nom:"Daïquiri Fraise", desc:"Rhum, fraise, citron", prix:9.0, stockProduit:"Rhum" },
  { id:"c4", cat:"Cocktails", nom:"Spritz", desc:"Aperol, Prosecco", prix:8.0, stockProduit:null },
  { id:"c5", cat:"Cocktails", nom:"Gin Tonic", desc:"Gin Hendrick's, Tonic", prix:10.0, stockProduit:"Gin Hendrick's" },
  // Softs
  { id:"s1", cat:"Softs", nom:"Coca Cola", desc:"33cl", prix:3.0, stockProduit:null },
  { id:"s2", cat:"Softs", nom:"Eau plate", desc:"50cl", prix:2.5, stockProduit:null },
  { id:"s3", cat:"Softs", nom:"Jus d'orange", desc:"25cl frais", prix:3.5, stockProduit:null },
  { id:"s4", cat:"Softs", nom:"Tonic", desc:"Fever-Tree", prix:4.0, stockProduit:"Tonic Fever-Tree" },
  // Manger
  { id:"m1", cat:"Manger", nom:"Planche charcuterie", desc:"Saucisson, coppa, jambon", prix:14.0, stockProduit:null },
  { id:"m2", cat:"Manger", nom:"Plat du jour", desc:"Selon ardoise", prix:13.0, stockProduit:null },
  { id:"m3", cat:"Manger", nom:"Frites maison", desc:"Portion", prix:5.0, stockProduit:null },
  { id:"m4", cat:"Manger", nom:"Olives", desc:"Bol", prix:4.0, stockProduit:null },
];

const TABLES_CONFIG = [
  // Salle
  { id:"t1", nom:"Table 1", zone:"Salle" },
  { id:"t2", nom:"Table 2", zone:"Salle" },
  { id:"t3", nom:"Table 3", zone:"Salle" },
  { id:"t4", nom:"Table 4", zone:"Salle" },
  { id:"t5", nom:"Table 5", zone:"Salle" },
  { id:"t6", nom:"Table 6", zone:"Salle" },
  // Bar
  { id:"bar1", nom:"Bar", zone:"Bar" },
  { id:"bar2", nom:"Comptoir 2", zone:"Bar" },
  // Terrasse
  { id:"ter1", nom:"Terrasse 1", zone:"Terrasse" },
  { id:"ter2", nom:"Terrasse 2", zone:"Terrasse" },
];

// ─── TABLES + COMMANDES ────────────────────────────────────────────────────
function Tables({ data, setData, showToast, caJour, setCaJour }) {
  const [selectedTable, setSelectedTable] = useState(null);
  const [tables, setTables] = useState(() =>
    TABLES_CONFIG.map(t => ({ ...t, statut: "libre", commande: [], total: 0 }))
  );
  const [menuCat, setMenuCat] = useState("Bières");
  const cats = ["Bières", "Cocktails", "Softs", "Manger"];

  const selectedT = selectedTable ? tables.find(t => t.id === selectedTable) : null;

  const addToCommande = (item) => {
    setTables(ts => ts.map(t => {
      if (t.id !== selectedTable) return t;
      const existing = t.commande.find(c => c.id === item.id);
      const newCommande = existing
        ? t.commande.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c)
        : [...t.commande, { ...item, qty: 1 }];
      const total = newCommande.reduce((s, c) => s + c.prix * c.qty, 0);
      return { ...t, commande: newCommande, total, statut: "encours" };
    }));
  };

  const removeFromCommande = (itemId) => {
    setTables(ts => ts.map(t => {
      if (t.id !== selectedTable) return t;
      const newCommande = t.commande
        .map(c => c.id === itemId ? { ...c, qty: c.qty - 1 } : c)
        .filter(c => c.qty > 0);
      const total = newCommande.reduce((s, c) => s + c.prix * c.qty, 0);
      const statut = newCommande.length === 0 ? "libre" : t.statut;
      return { ...t, commande: newCommande, total, statut };
    }));
  };

  const envoyerCommande = () => {
    if (!selectedT || selectedT.commande.length === 0) return;
    showToast(`Commande envoyée — ${selectedT.nom} ✓`);
    // Déduire le stock pour chaque item commandé
    selectedT.commande.forEach(item => {
      if (item.stockProduit) {
        const idx = data.stock.findIndex(s => s.produit === item.stockProduit);
        if (idx !== -1) {
          const newQty = Math.max(0, Number(data.stock[idx].quantite) - item.qty);
          setData(d => ({ ...d, stock: d.stock.map((s, i) => i === idx ? { ...s, quantite: newQty } : s) }));
          apiCall({ sheet: "Stock", action: "update", rowId: item.stockProduit, searchCol: "produit", data: { quantite: newQty } });
        }
      }
    });
  };

  const encaisser = () => {
    if (!selectedT || selectedT.commande.length === 0) return;
    const montant = selectedT.total;
    setCaJour(ca => ca + montant);
    setTables(ts => ts.map(t => t.id === selectedTable
      ? { ...t, statut: "libre", commande: [], total: 0 }
      : t
    ));
    showToast(`💰 ${montant.toFixed(2)}€ encaissé — ${selectedT.nom} libérée ✓`);
    setSelectedTable(null);
  };

  const libererTable = () => {
    setTables(ts => ts.map(t => t.id === selectedTable
      ? { ...t, statut: "libre", commande: [], total: 0 }
      : t
    ));
    setSelectedTable(null);
    showToast("Table libérée");
  };

  // ── Vue commande d'une table ──
  if (selectedT) {
    const filteredMenu = MENU.filter(m => m.cat === menuCat);
    const totalItems = selectedT.commande.reduce((s, c) => s + c.qty, 0);
    return (
      <>
        <div className="commande-header">
          <div className="back-btn" onClick={() => setSelectedTable(null)}>←</div>
          <div>
            <div className="commande-table-name">{selectedT.nom}</div>
            <div className="commande-table-status">{selectedT.zone} · {totalItems} article{totalItems !== 1 ? "s" : ""}</div>
          </div>
          <div style={{ marginLeft: "auto", fontFamily: "'DM Mono',monospace", fontSize: 18, fontWeight: 700, color: selectedT.statut === "apayer" ? "#e74c3c" : "var(--cream)" }}>
            {selectedT.total.toFixed(2)}€
          </div>
        </div>

        <div className="menu-cats">
          {cats.map(c => (
            <div key={c} className={`menu-cat-btn ${menuCat === c ? "active" : ""}`} onClick={() => setMenuCat(c)}>{c}</div>
          ))}
        </div>

        <div className="menu-items" style={{ paddingBottom: selectedT.commande.length > 0 ? 0 : 20 }}>
          {filteredMenu.map(item => (
            <div key={item.id} className="menu-item" onClick={() => addToCommande(item)}>
              <div className="menu-item-info">
                <div className="menu-item-name">{item.nom}</div>
                <div className="menu-item-desc">{item.desc}</div>
              </div>
              <div className="menu-item-right">
                <div className="menu-item-price">{item.prix.toFixed(2)}€</div>
                <div className="menu-item-add">+</div>
              </div>
            </div>
          ))}
        </div>

        {selectedT.commande.length > 0 && (
          <>
            <div className="ticket">
              <div className="ticket-title">Ticket · {selectedT.nom}</div>
              {selectedT.commande.map(item => (
                <div key={item.id} className="ticket-line">
                  <div className="ticket-qty">×{item.qty}</div>
                  <div className="ticket-item-name">{item.nom}</div>
                  <div className="ticket-item-price">{(item.prix * item.qty).toFixed(2)}€</div>
                  <div className="ticket-remove" onClick={() => removeFromCommande(item.id)}>✕</div>
                </div>
              ))}
              <div className="ticket-total">
                <div className="ticket-total-label">Total</div>
                <div className="ticket-total-amount">{selectedT.total.toFixed(2)}€</div>
              </div>
            </div>
            <div className="commande-actions">
              <div className="btn-liberer" onClick={libererTable}>🗑 Vider</div>
              <div className="btn-envoyer" onClick={envoyerCommande}>📤 Envoyer</div>
              <div className="btn-encaisser" onClick={encaisser}>💰 Encaisser</div>
            </div>
          </>
        )}
      </>
    );
  }

  // ── Vue grille des tables ──
  const zones = [...new Set(TABLES_CONFIG.map(t => t.zone))];
  const tablesOccupees = tables.filter(t => t.statut !== "libre").length;
  const caTotal = tables.reduce((s, t) => s + t.total, 0);

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Tables</div>
          <div className="page-count">{tablesOccupees}/{tables.length} occupées · {caTotal.toFixed(2)}€ en cours</div>
        </div>
      </div>

      {/* CA du jour */}
      <div className="ca-bar-wrap">
        <div className="ca-bar-top">
          <div className="ca-bar-label">CA du jour</div>
          <div className="ca-bar-value">{caJour.toFixed(2)}€</div>
        </div>
        <div className="ca-bar-track">
          <div className="ca-bar-fill" style={{ width: `${Math.min((caJour / 500) * 100, 100)}%` }} />
        </div>
        <div className="ca-bar-sub">
          <span>Objectif : 500€</span>
          <span style={{ color: caJour >= 500 ? "var(--olive-bright)" : "var(--muted)" }}>
            {caJour >= 500 ? "✓ Atteint !" : `${(500 - caJour).toFixed(0)}€ restants`}
          </span>
        </div>
      </div>

      {zones.map(zone => (
        <div key={zone}>
          <div className="table-zone-label">{zone}</div>
          <div className="tables-grid">
            {tables.filter(t => t.zone === zone).map((t, i) => (
              <div
                key={t.id}
                className={`table-card ${t.statut}`}
                style={{ animationDelay: `${i * 0.06}s` }}
                onClick={() => setSelectedTable(t.id)}
              >
                <div className={`table-status-dot dot-${t.statut}`} />
                <div className="table-name">{t.nom}</div>
                <div className="table-info">
                  {t.statut === "libre" ? "Libre" : t.statut === "encours" ? `${t.commande.reduce((s,c)=>s+c.qty,0)} articles` : "À encaisser"}
                </div>
                {t.total > 0 && <div className="table-total">{t.total.toFixed(2)}€</div>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
// ─── APP ROOT ─────────────────────────────────────────────────────────────
export default function App() {
  const [page,setPage]=useState("dashboard");
  const [loading,setLoading]=useState(true);
  const [toast,setToast]=useState(null);
  const [data,setData]=useState({reservations:[],stock:[],taches:[],planning:[]});
  const [caJour,setCaJour]=useState(0);

  const showToast=(msg)=>{
    setToast(msg);
    setTimeout(()=>setToast(null),2500);
  };

  useEffect(()=>{
    const fetchAll=async()=>{
      try{
        const [res,stock,taches,planning]=await Promise.all([
          fetch(`${API_URL}?sheet=Reservations`).then(r=>r.json()),
          fetch(`${API_URL}?sheet=Stock`).then(r=>r.json()),
          fetch(`${API_URL}?sheet=Taches`).then(r=>r.json()),
          fetch(`${API_URL}?sheet=Planning`).then(r=>r.json()),
        ]);
        setData({
          reservations:Array.isArray(res)?res:[],
          stock:Array.isArray(stock)?stock:[],
          taches:Array.isArray(taches)?taches:[],
          planning:Array.isArray(planning)?planning:[],
        });
      }catch(e){console.error(e);}
      finally{setLoading(false);}
    };
    fetchAll();
  },[]);

  if(loading)return(
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh",background:"#070706",color:"#aabf38",fontFamily:"'DM Mono',monospace",fontSize:13}}>
      Chargement...
    </div>
  );

  const nav=[
    {id:"dashboard",icon:"🏠",label:"Dashboard"},
    {id:"tables",icon:"🟢",label:"Tables"},
    {id:"reservations",icon:"📋",label:"Réserv."},
    {id:"stock",icon:"📦",label:"Stock"},
    {id:"taches",icon:"✅",label:"Tâches"},
  ];

  return(
    <>
      <style>{css}</style>
      <div className="phone">
        <div className="notch"/>
        <div className="status-bar">
          <span style={{fontFamily:"'DM Mono',monospace"}}>{new Date().toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})}</span>
          <span>▪▪▪ 🔋</span>
        </div>
        {toast&&<div className="toast">{toast}</div>}
        <div className="scroll-area">
          {page==="dashboard"&&<Dashboard data={data} onNav={setPage} caJour={caJour}/>}
          {page==="tables"&&<Tables data={data} setData={setData} showToast={showToast} caJour={caJour} setCaJour={setCaJour}/>}
          {page==="stock"&&<Stock data={data} setData={setData} showToast={showToast}/>}
          {page==="reservations"&&<Reservations data={data} setData={setData} showToast={showToast}/>}
          {page==="taches"&&<Taches data={data} setData={setData} showToast={showToast}/>}
          {page==="planning"&&<Planning data={data} setData={setData} showToast={showToast}/>}
        </div>
        <div className="bottom-nav">
          {nav.map(n=>(
            <div key={n.id} className={`nav-item ${page===n.id?"active":""}`} onClick={()=>setPage(n.id)}>
              <span className="nav-icon">{n.icon}</span>
              <span className="nav-label">{n.label}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
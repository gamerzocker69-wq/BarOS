import { useState, useEffect } from "react";

// ─── DONNÉES DE DÉMO ───────────────────────────────────────────────────────
const DEMO_RESERVATIONS = [
  { id: 1, nom: "Famille Dupont", tel: "06 12 34 56 78", date: "2025-03-12", heure: "19:30", couverts: 4, type: "Terrasse", statut: "Confirmée", notes: "" },
  { id: 2, nom: "M. Bernard", tel: "06 98 76 54 32", date: "2025-03-12", heure: "20:00", couverts: 2, type: "Table classique", statut: "Confirmée", notes: "Anniversaire" },
  { id: 3, nom: "Soirée Martin", tel: "07 11 22 33 44", date: "2025-03-12", heure: "21:30", couverts: 18, type: "Salle privatisable", statut: "Confirmée", notes: "Soirée anniversaire 40 ans" },
  { id: 4, nom: "Leroy", tel: "06 55 44 33 22", date: "2025-03-13", heure: "19:00", couverts: 6, type: "Terrasse", statut: "En attente", notes: "" },
  { id: 5, nom: "Événement Corpo", tel: "01 23 45 67 89", date: "2025-03-15", heure: "20:00", couverts: 35, type: "Événement privé", statut: "En attente", notes: "Team building entreprise" },
];

const DEMO_STOCK = [
  { id: 1, produit: "Gin Hendrick's", categorie: "Boissons alcoolisées", quantite: 1, unite: "bouteille", seuil: 3, fournisseur: "Metro" },
  { id: 2, produit: "Tonic Fever-Tree", categorie: "Softs", quantite: 4, unite: "pack", seuil: 5, fournisseur: "Coca-Cola" },
  { id: 3, produit: "Vodka Grey Goose", categorie: "Boissons alcoolisées", quantite: 8, unite: "bouteille", seuil: 4, fournisseur: "Metro" },
  { id: 4, produit: "Citrons", categorie: "Nourriture", quantite: 12, unite: "pièce", seuil: 20, fournisseur: "Marché" },
  { id: 5, produit: "Verres à cocktail", categorie: "Matériel", quantite: 24, unite: "pièce", seuil: 20, fournisseur: "Pro-Hygiène" },
  { id: 6, produit: "Sirop de sucre", categorie: "Nourriture", quantite: 3, unite: "bouteille", seuil: 2, fournisseur: "Metro" },
  { id: 7, produit: "Bière Kronenbourg", categorie: "Boissons alcoolisées", quantite: 48, unite: "canette", seuil: 24, fournisseur: "Brasseur Local" },
  { id: 8, produit: "Serviettes", categorie: "Consommables", quantite: 200, unite: "pièce", seuil: 100, fournisseur: "Pro-Hygiène" },
];

const DEMO_TACHES = [
  { id: 1, titre: "Inventaire bar", categorie: "Exploitation", statut: "Fait", assigne: "Lucas", deadline: "2025-03-12", notes: "" },
  { id: 2, titre: "Mise en place terrasse", categorie: "Service", statut: "À faire", assigne: "Sarah", deadline: "2025-03-12", notes: "" },
  { id: 3, titre: "Commander Gin Hendrick's", categorie: "Admin", statut: "À faire", assigne: "Marco", deadline: "2025-03-12", notes: "Urgent" },
  { id: 4, titre: "Nettoyage cave", categorie: "Entretien", statut: "À faire", assigne: "Lucas", deadline: "2025-03-13", notes: "" },
  { id: 5, titre: "Préparer salle privée Martin", categorie: "Service", statut: "À faire", assigne: "Sarah", deadline: "2025-03-12", notes: "18 personnes" },
];

const DEMO_PLANNING = [
  { id: 1, employe: "Marco", poste: "Manager", date: "2025-03-12", debut: "17:00", fin: "01:00" },
  { id: 2, employe: "Sarah", poste: "Service", date: "2025-03-12", debut: "18:00", fin: "00:00" },
  { id: 3, employe: "Lucas", poste: "Bar", date: "2025-03-12", debut: "18:00", fin: "02:00" },
  { id: 4, employe: "Camille", poste: "Service", date: "2025-03-12", debut: "19:00", fin: "23:00" },
  { id: 5, employe: "Marco", poste: "Manager", date: "2025-03-13", debut: "17:00", fin: "01:00" },
  { id: 6, employe: "Thomas", poste: "Cuisine", date: "2025-03-13", debut: "16:00", fin: "23:00" },
];

// ─── STYLES ────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=Syne:wght@400;600;700;800&display=swap');

  :root {
    --bg: #0f0f0d;
    --surface: #1a1a16;
    --surface2: #222219;
    --border: #2e2e26;
    --olive: #8a9a2e;
    --olive-bright: #aabf38;
    --olive-dim: #5a6620;
    --gold: #c9a84c;
    --cream: #f0ead6;
    --muted: #6b6b5a;
    --text: #e8e4d4;
    --danger: #c0392b;
    --danger-bg: rgba(192,57,43,0.12);
    --info: #3a7ca5;
    --info-bg: rgba(58,124,165,0.12);
    --success-bg: rgba(138,154,46,0.12);
  }

  * { margin:0; padding:0; box-sizing:border-box; -webkit-tap-highlight-color: transparent; }

  body {
    background: #070706;
    font-family: 'Syne', sans-serif;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: 100vh;
    padding: 30px 16px;
  }

  .phone {
    width: 390px;
    min-height: 844px;
    background: var(--bg);
    border-radius: 48px;
    border: 10px solid #1c1c18;
    box-shadow: 0 0 0 1px #333, 0 40px 80px rgba(0,0,0,0.8);
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .notch {
    width: 120px; height: 34px;
    background: #000;
    border-radius: 0 0 20px 20px;
    position: absolute; top: 0; left: 50%; transform: translateX(-50%);
    z-index: 100;
  }

  .status-bar {
    display: flex; justify-content: space-between; align-items: center;
    padding: 14px 28px 0;
    font-family: 'DM Mono', monospace; font-size: 12px; color: var(--text);
    position: relative; z-index: 99; flex-shrink: 0;
  }

  .scroll-area {
    flex: 1; overflow-y: auto; overflow-x: hidden;
    padding-bottom: 90px;
    scroll-behavior: smooth;
  }

  .scroll-area::-webkit-scrollbar { width: 0; }

  /* ── HEADER ── */
  .header {
    padding: 20px 24px 16px;
    border-bottom: 1px solid var(--border);
  }
  .header-top { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:4px; }
  .greeting { font-family:'DM Mono',monospace; font-size:11px; color:var(--muted); letter-spacing:.12em; text-transform:uppercase; margin-bottom:4px; }
  .logo { font-family:'DM Serif Display',serif; font-size:26px; color:var(--cream); line-height:1; }
  .logo em { color:var(--olive-bright); font-style:italic; }
  .notif-btn {
    width:40px; height:40px; background:var(--surface); border:1px solid var(--border);
    border-radius:12px; display:flex; align-items:center; justify-content:center;
    cursor:pointer; position:relative; font-size:18px; transition:border-color .2s;
  }
  .notif-btn:hover { border-color:var(--olive); }
  .notif-dot { position:absolute; top:8px; right:8px; width:7px; height:7px; background:var(--olive-bright); border-radius:50%; border:1.5px solid var(--bg); animation: blink 2s infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }

  .date-pill {
    display:inline-flex; align-items:center; gap:6px;
    background:var(--surface); border:1px solid var(--border); border-radius:100px;
    padding:5px 12px; font-family:'DM Mono',monospace; font-size:11px; color:var(--muted); margin-top:10px;
  }
  .pulse-dot { width:6px; height:6px; background:var(--olive-bright); border-radius:50%; animation: blink 2s infinite; }

  /* ── SECTIONS ── */
  .section { padding: 18px 24px 0; }
  .section-label { font-family:'DM Mono',monospace; font-size:10px; letter-spacing:.15em; text-transform:uppercase; color:var(--muted); margin-bottom:12px; }
  .section-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
  .see-all { font-family:'DM Mono',monospace; font-size:10px; color:var(--olive-bright); cursor:pointer; opacity:.8; transition:opacity .2s; }
  .see-all:hover { opacity:1; }

  .divider { display:flex; align-items:center; gap:10px; padding:18px 24px 0; }
  .divider-line { flex:1; height:1px; background:var(--border); }
  .divider-label { font-family:'DM Mono',monospace; font-size:10px; letter-spacing:.15em; text-transform:uppercase; color:var(--muted); white-space:nowrap; }

  /* ── KPI ── */
  .kpi-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
  .kpi-card {
    background:var(--surface); border:1px solid var(--border); border-radius:18px;
    padding:16px; position:relative; overflow:hidden; cursor:pointer;
    transition: all .25s; animation: slideUp .4s ease both;
  }
  .kpi-card:hover { border-color:var(--olive-dim); transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,.4); }
  .kpi-card.featured {
    grid-column:span 2; display:flex; align-items:center; justify-content:space-between;
    background:linear-gradient(135deg,#1e2410,#2a3018); border-color:var(--olive-dim);
  }
  .kpi-glow { position:absolute; top:-20px; right:-20px; width:100px; height:100px; background:var(--olive); border-radius:50%; opacity:.08; filter:blur(30px); }
  .kpi-icon { font-size:22px; margin-bottom:10px; display:block; }
  .kpi-label { font-family:'DM Mono',monospace; font-size:10px; color:var(--muted); text-transform:uppercase; letter-spacing:.1em; margin-bottom:4px; }
  .kpi-value { font-size:26px; font-weight:800; color:var(--cream); line-height:1; }
  .kpi-sub { font-family:'DM Mono',monospace; font-size:10px; color:var(--olive-bright); margin-top:4px; }
  .kpi-sub.warn { color:var(--gold); }
  .kpi-sub.danger { color:var(--danger); }
  .kpi-badge { display:inline-flex; align-items:center; gap:4px; background:rgba(138,154,46,.15); border:1px solid var(--olive-dim); border-radius:100px; padding:4px 10px; font-family:'DM Mono',monospace; font-size:10px; color:var(--olive-bright); margin-top:8px; }

  /* ── ALERT ── */
  .stock-alert {
    background:linear-gradient(135deg,#1a0f0f,#220d0d); border:1px solid rgba(192,57,43,.3);
    border-radius:14px; padding:14px 16px; display:flex; align-items:center; gap:12px;
    cursor:pointer; transition:border-color .2s; margin:18px 24px 0;
  }
  .stock-alert:hover { border-color:rgba(192,57,43,.6); }
  .alert-icon { width:36px; height:36px; background:rgba(192,57,43,.15); border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0; }
  .alert-title { font-size:13px; font-weight:700; color:#e74c3c; margin-bottom:2px; }
  .alert-sub { font-family:'DM Mono',monospace; font-size:10px; color:var(--muted); }

  /* ── RESA CARDS ── */
  .resa-card {
    background:var(--surface); border:1px solid var(--border); border-radius:14px;
    padding:14px 16px; display:flex; align-items:center; gap:14px;
    cursor:pointer; transition:all .2s; margin-bottom:8px;
    animation: slideUp .4s ease both;
  }
  .resa-card:hover { border-color:var(--olive-dim); background:var(--surface2); }
  .resa-time { font-family:'DM Mono',monospace; font-size:13px; font-weight:500; color:var(--olive-bright); min-width:44px; text-align:center; }
  .resa-div { width:1px; height:36px; background:var(--border); }
  .resa-info { flex:1; }
  .resa-name { font-size:14px; font-weight:700; color:var(--cream); margin-bottom:2px; }
  .resa-details { font-family:'DM Mono',monospace; font-size:10px; color:var(--muted); }
  .tag { font-family:'DM Mono',monospace; font-size:9px; padding:3px 8px; border-radius:100px; white-space:nowrap; font-weight:500; }
  .tag-table { background:var(--info-bg); color:#6ab0d4; border:1px solid rgba(58,124,165,.3); }
  .tag-terrasse { background:var(--success-bg); color:var(--olive-bright); border:1px solid var(--olive-dim); }
  .tag-event { background:rgba(201,168,76,.15); color:var(--gold); border:1px solid rgba(201,168,76,.3); }
  .tag-privee { background:var(--danger-bg); color:#e74c3c; border:1px solid rgba(192,57,43,.3); }
  .tag-attente { background:rgba(201,168,76,.15); color:var(--gold); border:1px solid rgba(201,168,76,.3); }
  .tag-confirmee { background:var(--success-bg); color:var(--olive-bright); border:1px solid var(--olive-dim); }
  .tag-annulee { background:var(--danger-bg); color:#e74c3c; border:1px solid rgba(192,57,43,.3); }

  /* ── TASK ── */
  .task-card {
    background:var(--surface); border:1px solid var(--border); border-radius:14px;
    padding:14px 16px; display:flex; align-items:center; gap:12px;
    cursor:pointer; transition:all .2s; margin-bottom:8px;
  }
  .task-card:hover { border-color:var(--olive-dim); }
  .task-check {
    width:22px; height:22px; border-radius:7px; border:1.5px solid var(--border);
    flex-shrink:0; display:flex; align-items:center; justify-content:center;
    transition:all .2s; cursor:pointer; font-size:12px; font-weight:700;
  }
  .task-check:hover { border-color:var(--olive); }
  .task-check.done { background:var(--olive); border-color:var(--olive); color:#000; }
  .task-title { font-size:13px; font-weight:600; color:var(--cream); margin-bottom:2px; }
  .task-title.done { text-decoration:line-through; color:var(--muted); }
  .task-meta { font-family:'DM Mono',monospace; font-size:10px; color:var(--muted); }
  .task-cat { font-family:'DM Mono',monospace; font-size:9px; padding:3px 8px; border-radius:100px; background:var(--surface2); border:1px solid var(--border); color:var(--muted); }

  /* ── STOCK TABLE ── */
  .stock-item {
    background:var(--surface); border:1px solid var(--border); border-radius:14px;
    padding:14px 16px; display:flex; align-items:center; gap:12px;
    cursor:pointer; transition:all .2s; margin-bottom:8px;
  }
  .stock-item:hover { border-color:var(--olive-dim); }
  .stock-item.alert { border-color:rgba(192,57,43,.4); background:linear-gradient(135deg,#1a0f0f,#1e1010); }
  .stock-icon { width:36px; height:36px; border-radius:10px; background:var(--surface2); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; font-size:16px; flex-shrink:0; }
  .stock-info { flex:1; }
  .stock-name { font-size:13px; font-weight:700; color:var(--cream); margin-bottom:2px; }
  .stock-cat { font-family:'DM Mono',monospace; font-size:10px; color:var(--muted); }
  .stock-qty { text-align:right; }
  .stock-num { font-family:'DM Mono',monospace; font-size:16px; font-weight:500; color:var(--cream); }
  .stock-num.low { color:#e74c3c; }
  .stock-unit { font-family:'DM Mono',monospace; font-size:9px; color:var(--muted); }
  .stock-bar { height:3px; border-radius:2px; background:var(--border); margin-top:6px; overflow:hidden; }
  .stock-bar-fill { height:100%; border-radius:2px; transition:width .5s; }

  /* ── PLANNING ── */
  .planning-day { margin-bottom:20px; }
  .planning-date { font-family:'DM Mono',monospace; font-size:11px; color:var(--olive-bright); letter-spacing:.1em; text-transform:uppercase; margin-bottom:10px; padding:0 24px; }
  .shift-card {
    background:var(--surface); border:1px solid var(--border); border-radius:14px;
    padding:14px 16px; display:flex; align-items:center; gap:12px;
    margin-bottom:8px; margin-left:24px; margin-right:24px;
  }
  .shift-avatar { width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:700; flex-shrink:0; }
  .shift-info { flex:1; }
  .shift-name { font-size:13px; font-weight:700; color:var(--cream); margin-bottom:2px; }
  .shift-poste { font-family:'DM Mono',monospace; font-size:10px; color:var(--muted); }
  .shift-hours { font-family:'DM Mono',monospace; font-size:12px; color:var(--olive-bright); }

  /* ── FAB ── */
  .fab {
    position:absolute; bottom:90px; right:20px;
    width:52px; height:52px; background:var(--olive-bright);
    border-radius:16px; display:flex; align-items:center; justify-content:center;
    font-size:28px; cursor:pointer; box-shadow:0 4px 20px rgba(138,154,46,.4);
    transition:all .25s; z-index:20; color:#000; line-height:1; font-weight:300;
    user-select:none;
  }
  .fab:hover { transform:scale(1.08) rotate(90deg); box-shadow:0 8px 30px rgba(138,154,46,.5); }

  /* ── BOTTOM NAV ── */
  .bottom-nav {
    position:absolute; bottom:0; left:0; right:0;
    background:rgba(15,15,13,.97); backdrop-filter:blur(20px);
    border-top:1px solid var(--border); padding:10px 4px 20px;
    display:flex; justify-content:space-around; z-index:10;
  }
  .nav-item {
    display:flex; flex-direction:column; align-items:center; gap:3px;
    cursor:pointer; padding:6px 10px; border-radius:12px;
    transition:all .2s; min-width:50px;
  }
  .nav-item:hover { background:var(--surface); }
  .nav-item.active { background:rgba(138,154,46,.12); }
  .nav-icon { font-size:20px; }
  .nav-label { font-family:'DM Mono',monospace; font-size:9px; color:var(--muted); }
  .nav-item.active .nav-label { color:var(--olive-bright); }

  /* ── MODAL ADD ── */
  .modal-overlay {
    position:absolute; inset:0; background:rgba(0,0,0,.7); z-index:50;
    display:flex; align-items:flex-end; animation:fadeIn .2s ease;
  }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  .modal {
    background:var(--surface); border:1px solid var(--border);
    border-radius:28px 28px 0 0; padding:24px; width:100%;
    animation: slideUp .3s ease;
  }
  .modal-title { font-family:'DM Serif Display',serif; font-size:22px; color:var(--cream); margin-bottom:6px; }
  .modal-sub { font-family:'DM Mono',monospace; font-size:11px; color:var(--muted); margin-bottom:20px; }
  .field { margin-bottom:14px; }
  .field label { font-family:'DM Mono',monospace; font-size:10px; color:var(--muted); text-transform:uppercase; letter-spacing:.1em; display:block; margin-bottom:6px; }
  .field input, .field select, .field textarea {
    width:100%; background:var(--bg); border:1px solid var(--border); border-radius:12px;
    padding:11px 14px; color:var(--cream); font-family:'Syne',sans-serif; font-size:13px;
    outline:none; transition:border-color .2s; appearance:none;
  }
  .field input:focus, .field select:focus, .field textarea:focus { border-color:var(--olive); }
  .field select option { background:var(--bg); }
  .modal-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .btn-primary {
    width:100%; padding:14px; background:var(--olive-bright); border:none; border-radius:14px;
    color:#000; font-family:'Syne',sans-serif; font-size:15px; font-weight:700;
    cursor:pointer; transition:all .2s; margin-top:4px;
  }
  .btn-primary:hover { background:#c0d840; transform:translateY(-1px); }
  .btn-cancel {
    width:100%; padding:12px; background:transparent; border:1px solid var(--border); border-radius:14px;
    color:var(--muted); font-family:'Syne',sans-serif; font-size:13px;
    cursor:pointer; transition:all .2s; margin-top:8px;
  }
  .btn-cancel:hover { border-color:var(--olive-dim); color:var(--text); }

  /* ── FILTER PILLS ── */
  .filter-row { display:flex; gap:8px; overflow-x:auto; padding:0 24px 0; margin-bottom:14px; scrollbar-width:none; }
  .filter-row::-webkit-scrollbar { display:none; }
  .pill {
    display:inline-flex; align-items:center; gap:4px; flex-shrink:0;
    background:var(--surface); border:1px solid var(--border); border-radius:100px;
    padding:6px 12px; font-family:'DM Mono',monospace; font-size:10px; color:var(--muted);
    cursor:pointer; transition:all .2s; white-space:nowrap;
  }
  .pill:hover { border-color:var(--olive-dim); color:var(--text); }
  .pill.active { background:rgba(138,154,46,.15); border-color:var(--olive-dim); color:var(--olive-bright); }

  /* ── ANIMATIONS ── */
  @keyframes slideUp {
    from { opacity:0; transform:translateY(16px); }
    to { opacity:1; transform:translateY(0); }
  }

  /* ── PAGE TITLE ── */
  .page-header { padding:20px 24px 16px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; }
  .page-title { font-family:'DM Serif Display',serif; font-size:26px; color:var(--cream); }
  .page-count { font-family:'DM Mono',monospace; font-size:11px; color:var(--muted); margin-top:2px; }
`;

// ─── HELPERS ──────────────────────────────────────────────────────────────
function getTagClass(type) {
  if (!type) return "tag";
  const t = type.toLowerCase();
  if (t.includes("terrasse")) return "tag tag-terrasse";
  if (t.includes("événement") || t.includes("event")) return "tag tag-event";
  if (t.includes("privé") || t.includes("priva")) return "tag tag-privee";
  return "tag tag-table";
}

function getStatutClass(s) {
  if (!s) return "tag";
  if (s === "Confirmée") return "tag tag-confirmee";
  if (s === "En attente") return "tag tag-attente";
  if (s === "Annulée") return "tag tag-annulee";
  return "tag";
}

function getStockColor(q, seuil) {
  const ratio = q / seuil;
  if (ratio <= 0.5) return "#e74c3c";
  if (ratio <= 1) return var_gold();
  return "#aabf38";
}
function var_gold() { return "#c9a84c"; }

function getCatEmoji(cat) {
  const map = { "Boissons alcoolisées": "🍾", "Softs": "🥤", "Nourriture": "🍋", "Matériel": "🍷", "Consommables": "🧻" };
  return map[cat] || "📦";
}

function getAvatarColor(name) {
  const colors = ["#8a9a2e","#3a7ca5","#c9a84c","#9b59b6","#e67e22"];
  let h = 0; for (let c of name) h += c.charCodeAt(0);
  return colors[h % colors.length];
}

function formatDate(d) {
  const date = new Date(d);
  return date.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });
}

// ─── MODALS ──────────────────────────────────────────────────────────────
function AddResaModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ nom:"", tel:"", date:"", heure:"", couverts:"", type:"Table classique", statut:"En attente", notes:"" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const submit = () => { if (!form.nom || !form.date || !form.heure) return; onAdd({ ...form, id: Date.now(), couverts: Number(form.couverts) }); onClose(); };
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">Nouvelle réservation</div>
        <div className="modal-sub">Remplissez les infos ci-dessous</div>
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
        <div className="field"><label>Notes</label><input value={form.notes} onChange={e=>set("notes",e.target.value)} placeholder="Infos supplémentaires..."/></div>
        <button className="btn-primary" onClick={submit}>Ajouter la réservation</button>
        <button className="btn-cancel" onClick={onClose}>Annuler</button>
      </div>
    </div>
  );
}

function AddStockModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ produit:"", categorie:"Boissons alcoolisées", quantite:"", unite:"bouteille", seuil:"", fournisseur:"" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const submit = () => { if (!form.produit || !form.quantite) return; onAdd({ ...form, id: Date.now(), quantite: Number(form.quantite), seuil: Number(form.seuil) }); onClose(); };
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
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

function AddTacheModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ titre:"", categorie:"Service", statut:"À faire", assigne:"", deadline:"", notes:"" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const submit = () => { if (!form.titre) return; onAdd({ ...form, id: Date.now() }); onClose(); };
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
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
        <div className="field"><label>Notes</label><input value={form.notes} onChange={e=>set("notes",e.target.value)} placeholder="Précisions..."/></div>
        <button className="btn-primary" onClick={submit}>Ajouter la tâche</button>
        <button className="btn-cancel" onClick={onClose}>Annuler</button>
      </div>
    </div>
  );
}

// ─── PAGES ────────────────────────────────────────────────────────────────
function Dashboard({ data, onNav }) {
  const alertes = data.stock.filter(s => s.quantite <= s.seuil);
  const resasSoir = data.reservations.filter(r => r.date === "2025-03-12");
  const tachesRestantes = data.taches.filter(t => t.statut !== "Fait");
  const couverts = resasSoir.reduce((a,r)=>a+r.couverts,0);
  return (
    <>
      <div className="header">
        <div className="header-top">
          <div>
            <div className="greeting">Bonsoir, Marco 👋</div>
            <div className="logo">Bar<em>OS</em></div>
          </div>
          <div className="notif-btn">🔔<div className="notif-dot"/></div>
        </div>
        <div className="date-pill"><span className="pulse-dot"/>Mer. 12 mars · Service du soir</div>
      </div>

      <div className="section">
        <div className="section-label">Vue d'ensemble</div>
        <div className="kpi-grid">
          <div className="kpi-card featured" onClick={()=>onNav("reservations")}>
            <div className="kpi-glow"/>
            <div>
              <div className="kpi-label">Réservations ce soir</div>
              <div className="kpi-value">{resasSoir.length}</div>
              <div className="kpi-badge">↑ +3 vs hier</div>
            </div>
            <div style={{fontSize:48,opacity:.5}}>🍽️</div>
          </div>
          <div className="kpi-card" onClick={()=>onNav("reservations")}>
            <span className="kpi-icon">👥</span>
            <div className="kpi-label">Couverts</div>
            <div className="kpi-value">{couverts}</div>
            <div className="kpi-sub">sur 60 max</div>
          </div>
          <div className="kpi-card" onClick={()=>onNav("taches")}>
            <span className="kpi-icon">✅</span>
            <div className="kpi-label">Tâches</div>
            <div className="kpi-value">{data.taches.length - tachesRestantes.length}<span style={{fontSize:14,color:"var(--muted)"}}>/{data.taches.length}</span></div>
            <div className={`kpi-sub ${tachesRestantes.length > 3 ? "warn":""}`}>{tachesRestantes.length} restantes</div>
          </div>
          <div className="kpi-card" onClick={()=>onNav("stock")}>
            <span className="kpi-icon">📦</span>
            <div className="kpi-label">Stock</div>
            <div className="kpi-value" style={{fontSize:alertes.length>0?"20px":"26px", color:alertes.length>0?"#e74c3c":"var(--cream)"}}>
              {alertes.length > 0 ? `⚠️ ${alertes.length}` : "OK"}
            </div>
            <div className={`kpi-sub ${alertes.length>0?"danger":""}`}>{alertes.length > 0 ? "alertes bas" : "tout ok"}</div>
          </div>
        </div>
      </div>

      {alertes.length > 0 && (
        <div className="stock-alert" onClick={()=>onNav("stock")}>
          <div className="alert-icon">⚠️</div>
          <div style={{flex:1}}>
            <div className="alert-title">Stock critique</div>
            <div className="alert-sub">{alertes.map(a=>a.produit).join(" · ")}</div>
          </div>
          <span style={{color:"var(--muted)",fontSize:16}}>›</span>
        </div>
      )}

      <div className="divider"><div className="divider-line"/><div className="divider-label">Réservations</div><div className="divider-line"/></div>
      <div className="section">
        <div className="section-header">
          <div className="section-label" style={{margin:0}}>Ce soir</div>
          <span className="see-all" onClick={()=>onNav("reservations")}>Tout voir →</span>
        </div>
        {resasSoir.slice(0,3).map((r,i) => (
          <div key={r.id} className="resa-card" style={{animationDelay:`${i*.07}s`}}>
            <div className="resa-time">{r.heure}</div>
            <div className="resa-div"/>
            <div className="resa-info">
              <div className="resa-name">{r.nom}</div>
              <div className="resa-details">{r.couverts} pers. · {r.notes || r.statut}</div>
            </div>
            <span className={getTagClass(r.type)}>{r.type.split(" ")[0]}</span>
          </div>
        ))}
      </div>

      <div className="divider"><div className="divider-line"/><div className="divider-label">Tâches</div><div className="divider-line"/></div>
      <div className="section" style={{paddingBottom:20}}>
        <div className="section-header">
          <div className="section-label" style={{margin:0}}>Aujourd'hui</div>
          <span className="see-all" onClick={()=>onNav("taches")}>Tout voir →</span>
        </div>
        {data.taches.slice(0,3).map(t => (
          <div key={t.id} className="task-card">
            <div className={`task-check ${t.statut==="Fait"?"done":""}`}>{t.statut==="Fait"?"✓":""}</div>
            <div style={{flex:1}}>
              <div className={`task-title ${t.statut==="Fait"?"done":""}`}>{t.titre}</div>
              <div className="task-meta">{t.assigne} · {t.categorie}</div>
            </div>
            <span className="task-cat">{t.categorie}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function Stock({ data, setData, onNav }) {
  const [modal, setModal] = useState(false);
  const [filtre, setFiltre] = useState("Tout");
  const cats = ["Tout","Boissons alcoolisées","Softs","Nourriture","Matériel","Consommables"];
  const filtered = filtre === "Tout" ? data.stock : data.stock.filter(s=>s.categorie===filtre);
  const alertes = data.stock.filter(s=>s.quantite <= s.seuil);

  const addItem = (item) => setData(d => ({ ...d, stock: [...d.stock, item] }));

  return (
    <>
      <div className="page-header">
        <div><div className="page-title">Stock</div><div className="page-count">{data.stock.length} produits · {alertes.length} alertes</div></div>
      </div>

      {alertes.length > 0 && (
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
        {filtered.map((s,i) => {
          const isLow = s.quantite <= s.seuil;
          const ratio = Math.min(s.quantite / (s.seuil * 2), 1);
          const barColor = isLow ? "#e74c3c" : s.quantite <= s.seuil * 1.2 ? var_gold() : "#aabf38";
          return (
            <div key={s.id} className={`stock-item ${isLow?"alert":""}`} style={{animationDelay:`${i*.05}s`}}>
              <div className="stock-icon">{getCatEmoji(s.categorie)}</div>
              <div className="stock-info">
                <div className="stock-name">{s.produit}</div>
                <div className="stock-cat">{s.categorie} · {s.fournisseur}</div>
                <div className="stock-bar"><div className="stock-bar-fill" style={{width:`${ratio*100}%`,background:barColor}}/></div>
              </div>
              <div className="stock-qty">
                <div className={`stock-num ${isLow?"low":""}`}>{s.quantite}</div>
                <div className="stock-unit">{s.unite}</div>
              </div>
            </div>
          );
        })}
      </div>

      {modal && <AddStockModal onClose={()=>setModal(false)} onAdd={addItem}/>}
      <div className="fab" onClick={()=>setModal(true)}>+</div>
    </>
  );
}

function Reservations({ data, setData }) {
  const [modal, setModal] = useState(false);
  const [filtre, setFiltre] = useState("Tout");
  const filtres = ["Tout","En attente","Confirmée","Terrasse","Événement privé"];
  const filtered = data.reservations.filter(r => {
    if (filtre==="Tout") return true;
    if (["En attente","Confirmée","Annulée"].includes(filtre)) return r.statut===filtre;
    return r.type===filtre;
  }).sort((a,b)=>a.date.localeCompare(b.date)||a.heure.localeCompare(b.heure));

  const addResa = (r) => setData(d => ({ ...d, reservations: [...d.reservations, r] }));

  return (
    <>
      <div className="page-header">
        <div><div className="page-title">Réservations</div><div className="page-count">{data.reservations.length} au total</div></div>
      </div>
      <div style={{paddingTop:14}}>
        <div className="filter-row">
          {filtres.map(f=><div key={f} className={`pill ${filtre===f?"active":""}`} onClick={()=>setFiltre(f)}>{f}</div>)}
        </div>
      </div>
      <div style={{padding:"0 24px"}}>
        {filtered.map((r,i)=>(
          <div key={r.id} className="resa-card" style={{animationDelay:`${i*.05}s`, flexWrap:"wrap", gap:8}}>
            <div className="resa-time">{r.heure}</div>
            <div className="resa-div"/>
            <div className="resa-info">
              <div className="resa-name">{r.nom}</div>
              <div className="resa-details">{r.couverts} pers. · {formatDate(r.date)} {r.notes ? `· ${r.notes}`:""}</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"flex-end"}}>
              <span className={getTagClass(r.type)}>{r.type.split(" ")[0]}</span>
              <span className={getStatutClass(r.statut)}>{r.statut}</span>
            </div>
          </div>
        ))}
      </div>
      {modal && <AddResaModal onClose={()=>setModal(false)} onAdd={addResa}/>}
      <div className="fab" onClick={()=>setModal(true)}>+</div>
    </>
  );
}

function Taches({ data, setData }) {
  const [modal, setModal] = useState(false);
  const [filtre, setFiltre] = useState("Tout");
  const cats = ["Tout","Service","Exploitation","Cuisine","Admin","Entretien"];
  const filtered = filtre==="Tout" ? data.taches : data.taches.filter(t=>t.categorie===filtre);

  const toggle = (id) => setData(d => ({ ...d, taches: d.taches.map(t => t.id===id ? {...t, statut: t.statut==="Fait"?"À faire":"Fait"} : t) }));
  const addTache = (t) => setData(d => ({ ...d, taches: [...d.taches, t] }));

  return (
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
        {filtered.map(t=>(
          <div key={t.id} className="task-card">
            <div className={`task-check ${t.statut==="Fait"?"done":""}`} onClick={()=>toggle(t.id)}>{t.statut==="Fait"?"✓":""}</div>
            <div style={{flex:1}}>
              <div className={`task-title ${t.statut==="Fait"?"done":""}`}>{t.titre}</div>
              <div className="task-meta">{t.assigne && `${t.assigne} · `}{t.categorie}{t.deadline ? ` · ${formatDate(t.deadline)}`:""}</div>
            </div>
            <span className="task-cat">{t.categorie}</span>
          </div>
        ))}
      </div>
      {modal && <AddTacheModal onClose={()=>setModal(false)} onAdd={addTache}/>}
      <div className="fab" onClick={()=>setModal(true)}>+</div>
    </>
  );
}

function Planning({ data }) {
  const days = [...new Set(data.planning.map(p=>p.date))].sort();
  const postes = { "Manager":"🎯", "Bar":"🍹", "Service":"🍽️", "Cuisine":"👨‍🍳" };

  return (
    <>
      <div className="page-header">
        <div><div className="page-title">Planning</div><div className="page-count">{data.planning.length} shifts programmés</div></div>
      </div>
      <div style={{paddingTop:14}}>
        {days.map(day=>(
          <div key={day} className="planning-day">
            <div className="planning-date">{formatDate(day)}</div>
            {data.planning.filter(p=>p.date===day).map(p=>(
              <div key={p.id} className="shift-card">
                <div className="shift-avatar" style={{background:getAvatarColor(p.employe)+"22", border:`1px solid ${getAvatarColor(p.employe)}44`}}>
                  <span style={{color:getAvatarColor(p.employe)}}>{p.employe[0]}</span>
                </div>
                <div className="shift-info">
                  <div className="shift-name">{p.employe}</div>
                  <div className="shift-poste">{postes[p.poste]||"👤"} {p.poste}</div>
                </div>
                <div className="shift-hours">{p.debut} – {p.fin}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [data, setData] = useState({
    reservations: DEMO_RESERVATIONS,
    stock: DEMO_STOCK,
    taches: DEMO_TACHES,
    planning: DEMO_PLANNING,
  });

  const nav = [
    { id:"dashboard", icon:"🏠", label:"Dashboard" },
    { id:"stock", icon:"📦", label:"Stock" },
    { id:"reservations", icon:"🍽️", label:"Réserv." },
    { id:"planning", icon:"📅", label:"Planning" },
    { id:"taches", icon:"✅", label:"Tâches" },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="phone">
        <div className="notch"/>
        <div className="status-bar">
          <span style={{fontFamily:"'DM Mono',monospace"}}>19:42</span>
          <span>▪▪▪ 🔋</span>
        </div>
        <div className="scroll-area">
          {page==="dashboard" && <Dashboard data={data} onNav={setPage}/>}
          {page==="stock" && <Stock data={data} setData={setData} onNav={setPage}/>}
          {page==="reservations" && <Reservations data={data} setData={setData}/>}
          {page==="taches" && <Taches data={data} setData={setData}/>}
          {page==="planning" && <Planning data={data}/>}
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
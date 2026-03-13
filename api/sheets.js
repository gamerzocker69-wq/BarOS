export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const BASE = "https://sheetdb.io/api/v1/xcrgrzf7w61uh";

  try {
    if (req.method === "GET") {
      const sheet = req.query.sheet;
      const url = sheet ? `${BASE}?sheet=${sheet}` : BASE;
      const r = await fetch(url);
      const data = await r.json();
      return res.status(200).json(data);
    }

    if (req.method === "POST") {
      const { sheet, action, data, rowId, searchCol } = req.body;
      const sheetParam = sheet ? `?sheet=${sheet}` : "";

      // ── ADD ──
      if (action === "add") {
        const r = await fetch(`${BASE}${sheetParam}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data }),
        });
        const json = await r.json();
        return res.status(200).json(json);
      }

      // ── UPDATE ──
      // searchCol + rowId → patch by column value (ex: produit=Gin)
      // fallback: patch by id
      if (action === "update") {
        let url;
        if (searchCol && rowId) {
          url = `${BASE}/${searchCol}/${encodeURIComponent(rowId)}${sheetParam}`;
        } else {
          url = `${BASE}/id/${rowId}${sheetParam}`;
        }
        const r = await fetch(url, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data }),
        });
        const json = await r.json();
        return res.status(200).json(json);
      }

      // ── DELETE ──
      if (action === "delete") {
        let url;
        if (searchCol && rowId) {
          url = `${BASE}/${searchCol}/${encodeURIComponent(rowId)}${sheetParam}`;
        } else {
          url = `${BASE}/id/${rowId}${sheetParam}`;
        }
        const r = await fetch(url, { method: "DELETE" });
        const json = await r.json();
        return res.status(200).json(json);
      }

      return res.status(400).json({ error: "Action inconnue" });
    }

    res.status(405).json({ error: "Méthode non autorisée" });
  } catch (err) {
    console.error("Sheets API error:", err);
    res.status(500).json({ error: err.message });
  }
}
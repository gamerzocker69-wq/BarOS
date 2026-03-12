export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
    if (req.method === "OPTIONS") return res.status(200).end();
  
    const BASE = "https://sheetdb.io/api/v1/xcrgrzf7w61uh";
  
    try {
      if (req.method === "GET") {
        const sheet = req.query.sheet;
        const response = await fetch(BASE + "?sheet=" + sheet);
        const data = await response.json();
        return res.status(200).json(data);
      }
  
      if (req.method === "POST") {
        const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
        const sheet = body.sheet;
        const action = body.action;
        const data = body.data;
  
        if (action === "add") {
          const response = await fetch(BASE + "?sheet=" + sheet, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: data })
          });
          const result = await response.json();
          return res.status(200).json(result);
        }
      }
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }
export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
  
    const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx21pznd_AKubd0hi3xppb0kVQ5HeukIiASdUfdZylwkFJoJvQoXhoQKj3tOedFzvE5Dw/exec";
  
    try {
      if (req.method === "GET") {
        const { sheet } = req.query;
        const response = await fetch(`${APPS_SCRIPT_URL}?sheet=${sheet}`, {
          redirect: "follow"
        });
        const data = await response.json();
        return res.status(200).json(data);
      }
  
      if (req.method === "POST") {
        const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
        const response = await fetch(APPS_SCRIPT_URL, {
          method: "POST",
          redirect: "follow",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const text = await response.text();
        try {
          return res.status(200).json(JSON.parse(text));
        } catch {
          return res.status(200).json({ success: true, raw: text });
        }
      }
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }
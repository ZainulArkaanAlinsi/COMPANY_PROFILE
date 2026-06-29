/* ============================================================
   Vercel Serverless Function — proxy API Ninjas Cars API
   Path publik: /api/ninjas?path=cars&make=BMW&model=M4
   (cocok dgn proxyUrl di js/lib/carapi.js)

   Deploy: set Environment Variable di Vercel
     API_NINJAS_KEY = <key kamu>
   Key disimpan di server, tidak pernah sampai ke browser.
   ============================================================ */
const ALLOWED = ["cars", "carmakes", "carmodels", "cartrims", "cardetails"];

module.exports = async function handler(req, res) {
  const key = process.env.API_NINJAS_KEY;
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (!key) {
    res.status(500).json({ error: "API_NINJAS_KEY belum di-set di Vercel." });
    return;
  }

  const q = Object.assign({}, req.query);
  const which = q.path || "cars";
  delete q.path;
  if (ALLOWED.indexOf(which) < 0) {
    res.status(400).json({ error: "Endpoint tidak diizinkan: " + which });
    return;
  }

  try {
    const r = await fetch(
      "https://api.api-ninjas.com/v1/" + which + "?" + new URLSearchParams(q).toString(),
      { headers: { "X-Api-Key": key } }
    );
    const data = await r.json();
    res.setHeader("Cache-Control", "s-maxage=86400"); // spesifikasi jarang berubah
    res.status(r.status).json(data);
  } catch (e) {
    res.status(502).json({ error: "Proxy gagal: " + e.message });
  }
};

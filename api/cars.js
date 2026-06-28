/* ============================================================
   Vercel Serverless Function — proxy MarketCheck Cars API
   Path publik: /api/cars  (cocok dgn proxyUrl di js/lib/marketcheck.js)

   Deploy: import proyek ke Vercel, set Environment Variable
     MARKETCHECK_API_KEY = <key kamu>
   Key disimpan di server, tidak pernah sampai ke browser.
   ============================================================ */
module.exports = async function handler(req, res) {
  const key = process.env.MARKETCHECK_API_KEY;
  if (!key) {
    res.status(500).json({ error: "MARKETCHECK_API_KEY belum di-set di Vercel." });
    return;
  }

  const params = new URLSearchParams(req.query || {});
  params.set("api_key", key);

  try {
    const r = await fetch(
      "https://api.marketcheck.com/v2/search/car/active?" + params.toString(),
      { headers: { Accept: "application/json" } }
    );
    const data = await r.json();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "s-maxage=300"); // cache 5 menit di edge
    res.status(r.status).json(data);
  } catch (e) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(502).json({ error: "Proxy gagal: " + e.message });
  }
};

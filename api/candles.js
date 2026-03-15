// /api/candles.js — Fetch Historical Candle Data from Angel One
// Query params: token, exchange, interval, from, to

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { token: symboltoken, exchange = "NSE", interval = "FIVE_MINUTE", from: fromdate, to: todate, jwt } = req.query;

  if (!symboltoken || !jwt) {
    return res.status(400).json({ error: "Missing params: token, jwt required. Optional: exchange, interval, from, to" });
  }

  // Default date range: last 5 trading days
  const now = new Date();
  const defaultTo = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} 15:30`;
  const fiveAgo = new Date(now);
  fiveAgo.setDate(fiveAgo.getDate() - 7);
  const defaultFrom = `${fiveAgo.getFullYear()}-${String(fiveAgo.getMonth() + 1).padStart(2, "0")}-${String(fiveAgo.getDate()).padStart(2, "0")} 09:15`;

  try {
    const API_KEY = process.env.ANGEL_API_KEY;
    const response = await fetch("https://apiconnect.angelone.in/rest/secure/angelbroking/historical/v1/getCandleData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-UserType": "USER",
        "X-SourceID": "WEB",
        "X-ClientLocalIP": "127.0.0.1",
        "X-ClientPublicIP": "127.0.0.1",
        "X-MACAddress": "AA:BB:CC:DD:EE:FF",
        "X-PrivateKey": API_KEY,
        "Authorization": `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        exchange,
        symboltoken,
        interval,
        fromdate: fromdate || defaultFrom,
        todate: todate || defaultTo,
      }),
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

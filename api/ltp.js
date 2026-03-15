// /api/ltp.js — Fetch LTP/Quote data from Angel One
// Query params: exchange, tokens (comma-separated), mode (LTP|FULL), jwt

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { exchange = "NSE", tokens, mode = "LTP", jwt } = req.query;

  if (!tokens || !jwt) {
    return res.status(400).json({ error: "Missing params: tokens (comma-separated), jwt" });
  }

  try {
    const API_KEY = process.env.ANGEL_API_KEY;
    const tokenList = tokens.split(",").map(t => t.trim());

    const response = await fetch("https://apiconnect.angelone.in/rest/secure/angelbroking/market/v1/quote/", {
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
        mode,
        exchangeTokens: { [exchange]: tokenList },
      }),
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

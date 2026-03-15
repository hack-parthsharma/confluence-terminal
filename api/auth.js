// /api/auth.js — Angel One SmartAPI Login (Serverless Function)
// Generates TOTP server-side, logs in, returns JWT + feed tokens

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const CLIENT_ID = process.env.ANGEL_CLIENT_ID;
  const API_KEY = process.env.ANGEL_API_KEY;
  const PIN = process.env.ANGEL_PIN;
  const TOTP_SECRET = process.env.ANGEL_TOTP_SECRET;

  if (!CLIENT_ID || !API_KEY || !PIN || !TOTP_SECRET) {
    return res.status(500).json({ error: "Missing environment variables. Set ANGEL_CLIENT_ID, ANGEL_API_KEY, ANGEL_PIN, ANGEL_TOTP_SECRET in Vercel." });
  }

  try {
    // Generate TOTP
    const { TOTP } = await import("otpauth");
    const totp = new TOTP({ secret: TOTP_SECRET, digits: 6, period: 30, algorithm: "SHA1" });
    const otpCode = totp.generate();

    // Login to Angel One
    const loginRes = await fetch("https://apiconnect.angelone.in/rest/auth/angelbroking/user/v1/loginByPassword", {
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
      },
      body: JSON.stringify({
        clientcode: CLIENT_ID,
        password: PIN,
        totp: otpCode,
      }),
    });

    const data = await loginRes.json();

    if (data.status === true && data.data) {
      return res.status(200).json({
        success: true,
        jwtToken: data.data.jwtToken,
        refreshToken: data.data.refreshToken,
        feedToken: data.data.feedToken,
      });
    } else {
      return res.status(401).json({ success: false, error: data.message || "Login failed", data });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

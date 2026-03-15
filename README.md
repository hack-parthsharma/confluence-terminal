# ⚡ Confluence Trading Terminal

Real-time 5-minute trading strategy dashboard for Indian markets, powered by Angel One SmartAPI.

## Strategy
Multi-confluence signals using 5 indicators:
- **EMA(9,21)** — Trend direction & crossover
- **RSI(14)** — Overbought/oversold
- **VWAP** — Institutional price level
- **Supertrend(10,3)** — ATR-based trend follower
- **MACD(12,26,9)** — Momentum confirmation

**BUY** fires when 3+ indicators are bullish. **SELL** fires when 3+ are bearish.

## Instruments
- **Indices:** NIFTY 50, BANK NIFTY, SENSEX, FIN NIFTY, MIDCAP NIFTY
- **Stocks:** RELIANCE, TCS, HDFC BANK, INFY, SBIN, ITC + 18 more searchable
- **Timeframes:** 1m, 5m, 15m, 1h

## Deploy to Vercel (5 minutes)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/confluence-terminal.git
git branch -M main
git push -u origin main
```

### Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. Click **"New Project"**
3. Import your `confluence-terminal` repo
4. Click **Deploy** (it will fail first time — that's okay)

### Step 3: Add Environment Variables
1. Go to your project → **Settings** → **Environment Variables**
2. Add these 4 variables:

| Name | Value |
|------|-------|
| `ANGEL_CLIENT_ID` | Your Angel One Client ID (e.g., S56535030) |
| `ANGEL_API_KEY` | Your SmartAPI API Key |
| `ANGEL_PIN` | Your 4-digit MPIN |
| `ANGEL_TOTP_SECRET` | Your 32-character TOTP secret key |

3. Click **Save**

### Step 4: Redeploy
1. Go to **Deployments** tab
2. Click the **...** menu on the latest deployment
3. Click **Redeploy**
4. Your terminal is now live at `https://your-project.vercel.app`!

## How It Works

```
Browser (index.html)
    ↓ fetch("/api/auth")
Vercel Serverless Function (api/auth.js)
    ↓ Generates TOTP → Logs into Angel One
    ↓ Returns JWT token
Browser
    ↓ fetch("/api/candles?token=99926000&jwt=...")
Vercel Serverless Function (api/candles.js)
    ↓ Calls Angel One Historical API
    ↓ Returns OHLCV candle data
Browser
    → Calculates indicators (EMA, RSI, MACD, VWAP, Supertrend)
    → Generates BUY/SELL signals
    → Renders chart with signals
    → Auto-refreshes every 30 seconds
```

## Project Structure
```
confluence-terminal/
├── api/
│   ├── auth.js        # Login to Angel One (TOTP + JWT)
│   ├── candles.js     # Fetch historical candle data
│   └── ltp.js         # Fetch live LTP quotes
├── public/
│   └── index.html     # Complete trading terminal UI
├── vercel.json        # Vercel routing config
├── package.json       # Dependencies
├── .env.example       # Environment variables template
├── .gitignore         # Protects credentials
└── README.md          # This file
```

## Security
- Credentials are stored as Vercel Environment Variables (encrypted)
- API Key and TOTP Secret are NEVER exposed to the browser
- TOTP is generated server-side on each auth request
- JWT token is passed to browser but expires in ~6 hours

## Disclaimer
⚠️ **For educational purposes only.** This is not financial advice. Always backtest strategies before live trading. Never risk more than 1-2% of your capital per trade.

# Sea Gull Fund — Portfolio Tracker

A live portfolio tracker for Salisbury University's Sea Gull Fund. Built with Next.js, Tailwind CSS, and Finnhub API.

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure your API key
Create a `.env.local` file in the project root:
```bash
FINNHUB_API_KEY=your_finnhub_api_key_here
```
Get a free key at [finnhub.io](https://finnhub.io).

### 3. Run locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

---

## Deploy to Vercel (Free)

1. Push this project to a GitHub repo
2. Go to [vercel.com](https://vercel.com) and sign up with GitHub
3. Import the repo
4. In **Settings → Environment Variables**, add:
   - Key: `FINNHUB_API_KEY`
   - Value: your Finnhub API key
5. Deploy — you'll get a live URL like `seagull-fund.vercel.app`

Your API key stays on the server and is never exposed to the browser.

---

## Project Structure

```
seagull-fund-tracker/
├── public/
│   └── logo.png              # Sea Gull Fund logo
├── src/
│   ├── app/
│   │   ├── api/quotes/
│   │   │   └── route.js      # Server-side Finnhub proxy (hides API key)
│   │   ├── globals.css        # Tailwind + custom styles
│   │   ├── layout.js          # Root layout + metadata
│   │   └── page.js            # Main page
│   └── components/
│       ├── Header.jsx         # Logo, nav, live indicator
│       ├── HoldingsTable.jsx  # Sortable table with live data
│       ├── FundBio.jsx        # About section + fund stats
│       └── Footer.jsx         # Disclaimer + student credit
├── .env.local.example         # Template for API key
├── next.config.js
├── tailwind.config.js
└── package.json
```

## Features

- **Live market data** via Finnhub (auto-refreshes every 60 seconds)
- **Server-side API proxy** — API key never exposed to browser
- **Sortable columns** — click any header to sort
- **Sector filtering** — click sector badges to filter holdings
- **Responsive** — works on desktop, tablet, and mobile
- **Salisbury branded** — maroon & gold color scheme

## Adding/Removing Holdings

Edit the `HOLDINGS` array and `COMPANY_INFO` object in:
`src/app/api/quotes/route.js`

## Future Enhancements (Claude Code can help with these)

- [ ] Add shares held per ticker + portfolio value calculation
- [ ] Sold positions tab with realized P&L
- [ ] Historical performance charts
- [ ] Individual stock detail pages
- [ ] Dark mode toggle

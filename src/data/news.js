// Sea Gull Fund news updates and meeting consensus
// Add new items at the TOP of the array (most recent first)
//
// Each item supports:
//   id          - unique string identifier (used as React key)
//   date        - ISO date string "YYYY-MM-DD"
//   category    - one of: "Meeting Consensus", "Portfolio Update", "Fund News", "Announcement"
//   title       - short headline
//   summary     - 1-2 sentence summary shown on the card
//   body        - full text content (supports basic line breaks via \n\n for paragraphs)
//   tickers     - optional array of related tickers e.g. ["AAPL", "MSFT"]
//   author      - optional author name e.g. "Investment Committee"

export const NEWS_ITEMS = [
  {
    id: "2026-04-22-healthcare-rebalance",
    date: "2026-04-22",
    category: "Meeting Consensus",
    title: "4/22 Meeting — Health Care Rebalancing",
    summary: "The committee restructured Health Care exposure, exiting Zoetis and initiating a position in Eli Lilly while trimming Merck.",
    body: "At the April 22 meeting, the Investment Committee voted to rebalance the Health Care sector to better align with the fund's conviction-weighted approach.\n\nEli Lilly (LLY) — Initiated a 50-share position at $919.42 per share. The committee sees strong long-term upside driven by Lilly's GLP-1 drug franchise (Mounjaro and Zepbound), which has positioned the company at the center of the obesity and diabetes treatment market. Lilly's pipeline depth and pricing power support the thesis.\n\nZoetis (ZTS) — Fully exited 500 shares at $116.46. The position was originally purchased at $120.12, resulting in a realized loss of approximately −$1,828 (−3.0%). The committee determined that the capital could be more productively deployed into higher-conviction ideas with stronger near-term catalysts.\n\nMerck (MRK) — Trimmed 50 shares at $114.02, reducing the position from 600 to 550 shares. The partial sale locks in gains on a portion of the position (original cost basis of $87.83) while maintaining core exposure to Merck's Keytruda franchise.\n\nHealth Care sector weight moved from 4.67% to 4.01%, remaining within range of the 4.00% target allocation. The sector now holds two positions (MRK and LLY) versus the prior two (MRK and ZTS).",
    tickers: ["LLY", "ZTS", "MRK"],
    author: "Investment Committee"
  },
  {
    id: "2026-04-16-meeting",
    date: "2026-04-16",
    category: "Meeting Consensus",
    title: "4/16 Meeting",
    summary: "The committee rebalanced Financials and Communication Services — initiating two new positions, fully exiting two holdings, trimming three existing positions, and adding to two others.",
    body: "The Sea Gull Fund Investment Committee met on April 16, 2026 and executed the following trades in Financials and Communication Services.\n\nNEW POSITIONS INITIATED:\n• Intercontinental Exchange (ICE) — 400 shares @ $163.31 (Financials)\n• MSCI Inc. (MSCI) — 100 shares @ $563.59 (Financials)\n\nPOSITIONS ADDED TO:\n• Meta Platforms (META) — added 20 shares @ $673.30 (Communication Services)\n• Walt Disney (DIS) — 550 shares @ $103.26 (Communication Services, establishing tracked position)\n\nPOSITIONS TRIMMED:\n• BlackRock (BLK) — sold 20 shares @ $1,021.85\n• American Express (AXP) — sold 25 shares @ $326.18\n• Charles Schwab (SCHW) — sold 250 shares @ $95.42\n\nPOSITIONS FULLY EXITED:\n• PayPal Holdings (PYPL) — 1,000 shares sold @ $49.20. Realized loss of approximately −$21,451 (−30.4%)\n• US Bancorp (USB) — 1,700 shares sold @ $55.62. Realized gain of approximately +$32,636 (+52.7%)\n\nSECTOR IMPACT:\n• Financials: 16.65% → 12.99% (exited PYPL and USB, added ICE and MSCI, trimmed BLK/AXP/SCHW)\n• Communication Services: 8.44% → 11.46% (added DIS, increased META)",
    tickers: ["ICE", "MSCI", "META", "DIS", "BLK", "AXP", "SCHW", "PYPL", "USB"],
    author: "Investment Committee"
  },
  {
    id: "2026-04-15-position-adjustments",
    date: "2026-04-15",
    category: "Portfolio Update",
    title: "Adjusting the Current Positions",
    summary: "Spring 2026 rebalancing complete. The fund initiated five new positions, fully exited four holdings, and trimmed or added to several existing positions to bring sector weights closer to committee targets.",
    body: "The Sea Gull Fund executed a series of trades this semester to align sector weights with the committee's strategic targets and to deploy capital into newly approved investment ideas.\n\nNew positions initiated:\n• ArcelorMittal (MT) — 1,650 shares @ $65.47, establishing the fund's first Materials sector position\n• AECOM (ACM) — 925 shares @ $91.51 (Industrials)\n• RB Global (RBA) — 850 shares @ $104.25 (Industrials)\n• Amphenol (APH) — 600 shares @ $127.15 (Information Technology)\n• Marvell Technology (MRVL) — 700 shares @ $106.06 (Information Technology)\n\nPositions added to:\n• Duke Energy (DUK) — added 150 shares @ $129.36\n• Philip Morris (PM) — added 125 shares @ $171.19\n• Apple (AAPL) — added 100 shares @ $254.00\n• Microsoft (MSFT) — added 200 shares @ $369.68\n• NVIDIA (NVDA) — added 125 shares @ $175.82\n• Autodesk (ADSK) — added 200 shares @ $238.63\n• Zebra Technologies (ZBRA) — added 150 shares @ $204.03\n\nPositions trimmed:\n• Huntington Ingalls (HII) — sold 45 shares @ $423.56\n\nPositions fully exited (realized P&L vs cost basis):\n• Edison International (EIX) — 875 shares sold @ $65.00 via limit order. Realized gain of approximately +$7,848 (+16.0%) on cost basis of $49,026.88\n• Seagate Technology (STX) — full position sold\n• KBR Inc. (KBR) — 1,750 shares sold @ $38.83. Realized loss of approximately −$9,345 (−12.1%) on cost basis of $77,297.50\n• Chipotle Mexican Grill (CMG) — 1,250 shares sold @ $32.395. Realized loss of approximately −$22,389 (−35.6%) on cost basis of $62,882.50\n\nThe trades brought Materials from 0% to 4% of the portfolio (initiating exposure to a previously uncovered sector), increased Industrials from 6.01% to 10.47%, and brought Information Technology to 36.01% — within range of the 36% target.",
    tickers: ["MT", "ACM", "RBA", "APH", "MRVL", "DUK", "PM", "AAPL", "MSFT", "NVDA", "ADSK", "ZBRA", "HII", "EIX", "STX", "KBR", "CMG"],
    author: "Investment Committee"
  },
  // Example item (commented out - delete the // when ready to publish):
  //
  // {
  //   id: "2026-01-17-rebalance",
  //   date: "2026-01-17",
  //   category: "Meeting Consensus",
  //   title: "Q1 2026 Rebalancing Decisions",
  //   summary: "The committee voted to overweight Information Technology and add a Materials position.",
  //   body: "At the January 17 meeting, the investment committee reviewed sector allocations against benchmark weights.\n\nKey decisions: Increase Information Technology allocation to 36%, initiate a 4% Materials position, trim Utilities to 2.3%.",
  //   tickers: ["NVDA", "MSFT"],
  //   author: "Investment Committee"
  // },
];

// Purchase lot data — updated 4/16/2026
// Negative shares indicate a partial sell at that date.
// Tickers not in this object will not show a detail view when clicked.
export const HOLDING_LOTS = {
  HII:  [
    { date: '2025-03-14', shares: 180,  unitCost: 197.78 },
    { date: '2025-10-23', shares: 90,   unitCost: 291.5668 },
    { date: '2026-04-15', shares: -45,  unitCost: 423.56 },  // partial sell
  ],
  PM:   [
    { date: '2025-10-23', shares: 325,  unitCost: 156.84 },
    { date: '2026-04-15', shares: 125,  unitCost: 171.19 },
  ],
  AMZN: [
    { date: '2025-04-01', shares: 330,  unitCost: 189.335 },
    { date: '2025-11-20', shares: 220,  unitCost: 227.18 },
  ],
  GIL:  [{ date: '2025-11-20', shares: 1400, unitCost: 56.76 }],
  NCLH: [
    { date: '2024-11-14', shares: 2800, unitCost: 27.4899 },
    { date: '2025-04-01', shares: 600,  unitCost: 18.4891 },
  ],
  CVX:  [{ date: '2025-10-02', shares: 500,  unitCost: 155.3872 }],
  AXP:  [
    { date: '2025-11-06', shares: 200,  unitCost: 363.4356 },
    { date: '2025-11-18', shares: 25,   unitCost: 341.30 },
    { date: '2026-04-16', shares: -25,  unitCost: 326.18 },  // partial sell
  ],
  BLK:  [
    { date: '2024-04-18', shares: 50,   unitCost: 760.4616 },
    { date: '2025-04-10', shares: 25,   unitCost: 842.57 },
    { date: '2025-11-06', shares: 25,   unitCost: 1059.074 },
    { date: '2026-04-16', shares: -20,  unitCost: 1021.85 },  // partial sell
  ],
  SCHW: [
    { date: '2025-04-10', shares: 650,  unitCost: 71.93 },
    { date: '2025-04-10', shares: 200,  unitCost: 72.9974 },
    { date: '2025-11-06', shares: 250,  unitCost: 93.8472 },
    { date: '2026-04-16', shares: -250, unitCost: 95.42 },   // partial sell
  ],
  EQIX: [{ date: '2025-10-09', shares: 35,   unitCost: 804.86 }],
  MRK:  [
    { date: '2025-03-27', shares: 600,  unitCost: 87.83 },
    { date: '2026-04-22', shares: -50,  unitCost: 114.02 },
  ],
  LLY:  [{ date: '2026-04-22', shares: 50, unitCost: 919.42 }],
  ADBE: [{ date: '2024-03-28', shares: 200,  unitCost: 502.2835 }],
  AAPL: [
    { date: '2025-04-08', shares: 250,  unitCost: 188.945 },
    { date: '2026-04-15', shares: 100,  unitCost: 254.00 },
  ],
  ADSK: [
    { date: '2023-10-31', shares: 200,  unitCost: 301.66 },
    { date: '2026-04-15', shares: 200,  unitCost: 238.63 },
  ],
  CTSH: [
    { date: '2023-10-27', shares: 400,  unitCost: 63.6197 },
    { date: '2024-03-28', shares: 600,  unitCost: 73.61 },
  ],
  MSFT: [
    { date: '2018-11-07', shares: 60,   unitCost: 111.85 },
    { date: '2019-10-23', shares: 140,  unitCost: 135.9937 },
    { date: '2024-03-28', shares: 100,  unitCost: 420.4486 },
    { date: '2026-04-15', shares: 200,  unitCost: 369.68 },
  ],
  NVDA: [
    { date: '2023-10-27', shares: 1000, unitCost: 40.6109 },
    { date: '2026-04-15', shares: 125,  unitCost: 175.82 },
  ],
  ZBRA: [
    { date: '2025-10-31', shares: 200,  unitCost: 269.38 },
    { date: '2026-04-15', shares: 150,  unitCost: 204.03 },
  ],
  GOOG: [
    { date: '2021-04-06', shares: 25,   unitCost: 111.0989 },
    { date: '2022-11-30', shares: 200,  unitCost: 95.9688 },
    { date: '2024-04-11', shares: 25,   unitCost: 158.988 },
    { date: '2024-10-17', shares: 150,  unitCost: 165.2831 },
  ],
  META: [
    { date: '2024-10-17', shares: 85,   unitCost: 579.674 },
    { date: '2025-04-24', shares: 30,   unitCost: 526.86 },
    { date: '2025-11-17', shares: 40,   unitCost: 608.2986 },
    { date: '2026-04-16', shares: 20,   unitCost: 673.30 },  // additional buy
  ],
  DUK:  [
    { date: '2025-10-09', shares: 350,  unitCost: 125.20 },
    { date: '2026-04-15', shares: 150,  unitCost: 129.36 },
  ],
  SPY:  [
    { date: '2025-12-18', shares: 130,  unitCost: 674.49 },
    { date: '2025-12-23', shares: 470,  unitCost: 683.8658 },
  ],
  // New positions initiated 4/15/2026
  MT:   [{ date: '2026-04-15', shares: 1650, unitCost: 65.47 }],
  ACM:  [{ date: '2026-04-15', shares: 925,  unitCost: 91.51 }],
  RBA:  [{ date: '2026-04-15', shares: 850,  unitCost: 104.25 }],
  APH:  [{ date: '2026-04-15', shares: 600,  unitCost: 127.15 }],
  MRVL: [{ date: '2026-04-15', shares: 700,  unitCost: 106.06 }],
  // New positions initiated 4/16/2026
  DIS:  [{ date: '2026-04-16', shares: 550,  unitCost: 103.26 }],
  ICE:  [{ date: '2026-04-16', shares: 400,  unitCost: 163.31 }],
  MSCI: [{ date: '2026-04-16', shares: 100,  unitCost: 563.59 }],
};

export const LOTS_AS_OF = '4/22/2026';

// Single source of truth for ticker → name/sector mapping.
// Add or remove entries here when the portfolio changes — sector counts
// throughout the app update automatically.
export const COMPANY_INFO = {
  AMZN: { name: 'Amazon.com Inc.',          sector: 'Consumer Discretionary' },
  GIL:  { name: 'Gildan Activewear',         sector: 'Consumer Discretionary' },
  NCLH: { name: 'Norwegian Cruise Line',     sector: 'Consumer Discretionary' },
  DIS:  { name: 'Walt Disney Co.',           sector: 'Communication Services' },
  CVX:  { name: 'Chevron Corp.',             sector: 'Energy' },
  AXP:  { name: 'American Express Co.',      sector: 'Financials' },
  BLK:  { name: 'BlackRock Inc.',            sector: 'Financials' },
  SCHW: { name: 'Charles Schwab Corp.',      sector: 'Financials' },
  PYPL: { name: 'PayPal Holdings',           sector: 'Financials' },
  MRK:  { name: 'Merck & Co.',              sector: 'Health Care' },
  ZTS:  { name: 'Zoetis Inc.',              sector: 'Health Care' },
  EQIX: { name: 'Equinix Inc.',             sector: 'Real Estate' },
  ADBE: { name: 'Adobe Inc.',               sector: 'Information Technology' },
  AAPL: { name: 'Apple Inc.',               sector: 'Information Technology' },
  ADSK: { name: 'Autodesk Inc.',            sector: 'Information Technology' },
  CTSH: { name: 'Cognizant Technology',     sector: 'Information Technology' },
  MSFT: { name: 'Microsoft Corp.',          sector: 'Information Technology' },
  NVDA: { name: 'NVIDIA Corp.',             sector: 'Information Technology' },
  ZBRA: { name: 'Zebra Technologies',       sector: 'Information Technology' },
  APH:  { name: 'Amphenol Corp.',           sector: 'Information Technology' },
  MRVL: { name: 'Marvell Technology',       sector: 'Information Technology' },
  GOOG: { name: 'Alphabet Inc.',            sector: 'Communication Services' },
  META: { name: 'Meta Platforms',           sector: 'Communication Services' },
  DUK:  { name: 'Duke Energy Corp.',        sector: 'Utilities' },
  SPY:  { name: 'SPDR S&P 500 ETF',        sector: 'ETF' },
  PM:   { name: 'Philip Morris Intl.',      sector: 'Consumer Staples' },
  HII:  { name: 'HII (Huntington Ingalls)', sector: 'Industrials' },
  MT:   { name: 'ArcelorMittal',            sector: 'Materials' },
  ACM:  { name: 'AECOM',                    sector: 'Industrials' },
  RBA:  { name: 'RB Global Inc.',           sector: 'Industrials' },
};

// Derive the count of equity holdings per sector (excludes ETF).
export const SECTOR_STOCK_COUNTS = Object.values(COMPANY_INFO).reduce((acc, { sector }) => {
  if (sector !== 'ETF') acc[sector] = (acc[sector] || 0) + 1;
  return acc;
}, {});

// All numbers shown in the replica live here. Edit and reload to set up a shot.
window.RH_DATA = {
  // Investing tab (home)
  investing: {
    value: 0.003,
    change: 0.0,
    changePct: 0.0,
    buyingPower: 0.0,
  },

  // Crypto tab
  crypto: {
    value: 0.003,
    change: 0.0,
    changePct: 0.0,
    list: [
      { sym: "XRP", name: "XRP", price: 1.26, up: true },
      { sym: "SOL", name: "Solana", price: 90.87, up: false },
      { sym: "ZEC", name: "Zcash", price: 1183.14, up: true },
      { sym: "HYPE", name: "Hyperliquid", price: 82.64, up: false },
      { sym: "DOGE", name: "Dogecoin", price: 0.073248, up: false, decimals: 6 },
    ],
    chain: [
      { name: "PONS", mcap: "$136.74M MCap", pct: -4.68, color: "#f5f5f5" },
      { name: "VIRTUAL", mcap: "$412.10M MCap", pct: 2.11, color: "#3ec5d6" },
      { name: "CASHCAT", mcap: "$105.74M MCap", pct: -3.79, color: "#f5f5f5" },
      { name: "INDEX", mcap: "$58.22M MCap", pct: 1.06, color: "#7aa2ff" },
    ],
  },

  // Watchlist on the Investing tab
  watchlist: [
    { sym: "NFLX", name: "Netflix", price: 62.97, up: true },
    { sym: "KO", name: "Coca-Cola", price: 95.78, up: false },
  ],

  // Portfolio overview (Account tab on mobile, /portfolio-overview on web)
  portfolio: {
    value: 70.58,
    change: 70.58,
    changePct: 2380438.45,
    // Shape of the 1W chart: [x 0..1, value]. Other ranges reuse it, squeezed right.
    shape: [
      [0, 0.003], [0.5, 0.003], [0.68, 180], [0.8, 180], [1, 70.58],
    ],
    yTicks: [50, 100, 150, 200],
    accounts: [
      { name: "Banking", sub: "100.00% of assets", value: 70.58, pct: 0.0 },
      { name: "Crypto", sub: "0.00% of assets", value: 0.0, pct: 0.0 },
      { name: "Investments", sub: "0.00% of assets", value: 0.0, pct: 0.0 },
      { name: "Retirement", sub: "Connect a retirement account", value: 0.0, pct: null },
    ],
  },

  promo: {
    text: "Earn up to 2% on account transfers through Nov 22. Terms apply.",
    big: "2%",
  },
};

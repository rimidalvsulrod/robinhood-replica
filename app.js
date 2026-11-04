(() => {
  const D = window.RH_DATA;
  const root = document.getElementById("root");
  const qs = new URLSearchParams(location.search);
  const FORCE = qs.get("view"); // "mobile" | "desktop"
  const STATUS = qs.get("statusbar") === "1";

  /* ---------- helpers ---------- */
  const money = (v, dec) => {
    const a = Math.abs(v);
    if (dec == null) dec = a > 0 && a < 0.01 ? 3 : 2;
    return (v < 0 ? "-$" : "$") + a.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec });
  };
  const pct = (v) => Math.abs(v).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "%";
  const isDesktop = () => (FORCE ? FORCE === "desktop" : window.innerWidth >= 1024);
  const rng = (seed) => { let s = 0; for (const c of seed) s = (s * 31 + c.charCodeAt(0)) >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); };

  const I = {
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9.5"/><path d="M12 11v6" stroke-linecap="round"/><circle cx="12" cy="7.6" r="1.1" fill="currentColor" stroke="none"/></svg>',
    chev: '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>',
    chevD: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    gift: '<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9h8v4H3zM13 9h8v4h-8zM4 14h7v7H4zM13 14h7v7h-7z"/><path d="M12 8.5C10 4 6.5 4 6.5 6.3S9.5 8.5 12 8.5zm0 0c2-4.5 5.5-4.5 5.5-2.2S14.5 8.5 12 8.5z" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
    gear: '<svg class="gear" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/></svg>',
    star: '<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.8l2.8 6 6.5.7-4.9 4.4 1.4 6.4L12 17l-5.8 3.3 1.4-6.4-4.9-4.4 6.5-.7z"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.8"/><path d="M15.6 15.6L21 21"/></svg>',
    bell: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5a6.5 6.5 0 0 0-6.5 6.5v4.3L3.6 17h16.8l-1.9-3.7V9A6.5 6.5 0 0 0 12 2.5zM9.3 18.5a2.8 2.8 0 0 0 5.4 0z"/></svg>',
    menu: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3.5 6h17M3.5 12h17M3.5 18h17"/></svg>',
    lineIco: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 19l5-7 4 3 5-8 4 4v8z" opacity=".95"/><path d="M3 15.5l5-7 4 3 5-8 4 4" fill="none" stroke="#000" stroke-width="1.4"/></svg>',
    barsIco: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="4.5" height="16" rx="1"/><rect x="10" y="4" width="4.5" height="16" rx="1" opacity=".7"/><rect x="16" y="4" width="4.5" height="16" rx="1" opacity=".5"/></svg>',
    feather: '<svg class="w-logo" viewBox="0 0 32 32" fill="#fff"><path d="M27.6 3.2c-6.9.6-12.9 4.4-16.5 10.1-1.4 2.2-2.4 4.6-3 7.1l-.6 2.5-3.6 6.1c-.2.4.3.8.7.5l3.9-3.3c3.9-.2 7.6-1.8 10.4-4.6 1.1-1.1 2-2.3 2.8-3.6l-4.6.3 5.6-2.6c1.6-3.5 2.7-7.1 3.4-10.9.2-1 .3-1.3 1.5-1.6z"/></svg>',
    navInvest: '<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linejoin="round" stroke-linecap="round"><path d="M3.5 21.5l6.5-8 4.5 4 9-10.5"/><path d="M3.5 24.5h21v-12l-10 8.5-4.5-4z" fill="currentColor" stroke="none" opacity=".95"/></svg>',
    navCrypto: '<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M19.4 9.2a7.2 7.2 0 1 0 0 9.6"/><path d="M14 2.5v3.3M14 22.2v3.3M4.6 6.6l2.3 2.3M4.6 21.4l2.3-2.3M2.5 14h3.3"/><circle cx="14" cy="14" r="2.6" fill="currentColor" stroke="none"/></svg>',
    navSearch: '<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><circle cx="12.3" cy="12.3" r="7.8"/><path d="M18.2 18.2l6 6"/></svg>',
    navSocial: '<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="2.3"><circle cx="14" cy="9.6" r="6"/><circle cx="9.3" cy="17.3" r="6"/><circle cx="18.7" cy="17.3" r="6"/></svg>',
    navAcct: '<svg viewBox="0 0 28 28" fill="currentColor"><circle cx="14" cy="8.6" r="5.4"/><path d="M3.8 25.5c.6-6 4.8-9.6 10.2-9.6s9.6 3.6 10.2 9.6z"/></svg>',
    cortex: '<svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><circle cx="7" cy="13" r="3"/><circle cx="16" cy="9" r="3.4"/><circle cx="17.5" cy="16.5" r="2"/></svg>',
    wallet: '<svg width="14" height="14" viewBox="0 0 24 24" fill="#c7c7cc"><rect x="3" y="5" width="18" height="15" rx="2"/><rect x="13" y="10" width="8" height="5" rx="1" fill="#000"/></svg>',
    cube: '<svg width="70" height="104" viewBox="0 0 70 104" fill="none" stroke="#1a1a1a" stroke-width="1.6" stroke-linejoin="round"><path d="M35 6l18 9-18 9-18-9z"/><path d="M17 15v18l18 9V24M53 15v18l-18 9"/><path d="M35 46l30 15-30 15L5 61z"/><path d="M5 61v6l30 15 30-15v-6"/><path d="M35 82v6M35 76v6"/><path d="M28 88l7-4 7 4v8l-7 4-7-4z"/></svg>',
  };
  const tri = (up) => `<span class="tri${up ? "" : " down"}"></span>`;

  /* ---------- data series ---------- */
  const RANGES_HOME = ["LIVE", "1D", "1W", "1M", "3M", "YTD", "1Y"];
  const RANGES_PO = ["1W", "1M", "3M", "YTD", "1Y", "ALL"];
  const SQUEEZE = { "1W": 1, "1M": 0.3, "3M": 0.1, YTD: 0.035, "1Y": 0.025, ALL: 0.02 };
  const SPAN_MS = { "1W": 7, "1M": 30, "3M": 91, YTD: 307, "1Y": 365, ALL: 400 };

  function portfolioSeries(range) {
    const n = 168, sq = SQUEEZE[range], shape = D.portfolio.shape;
    const end = Date.now(), span = SPAN_MS[range] * 864e5;
    const out = [];
    for (let i = 0; i < n; i++) {
      const x = i / (n - 1);
      const sx = (x - (1 - sq)) / sq; // map into shape space
      let v;
      if (sx <= 0) v = shape[0][1];
      else {
        let k = 0; while (k < shape.length - 2 && shape[k + 1][0] < sx) k++;
        const [x0, y0] = shape[k], [x1, y1] = shape[k + 1];
        v = y0 + (y1 - y0) * Math.min(1, Math.max(0, (sx - x0) / (x1 - x0 || 1)));
      }
      out.push({ t: end - span + span * x, v });
    }
    out[n - 1].v = D.portfolio.value;
    return out;
  }
  function flatSeries(value, n = 80, span = 864e5) {
    const end = Date.now();
    return Array.from({ length: n }, (_, i) => ({ t: end - span + (span * i) / (n - 1), v: value }));
  }
  function spark(sym, up, n = 60) {
    const r = rng(sym + (up ? "u" : "d"));
    let v = 0; const pts = [0];
    for (let i = 1; i < n; i++) { v += (r() - 0.5) * 1.6 + (up ? 0.09 : -0.09); pts.push(v); }
    return pts;
  }

  /* ---------- charts ---------- */
  function sparkSVG(sym, up, w = 96, h = 40) {
    const p = spark(sym, up), mn = Math.min(...p, 0), mx = Math.max(...p, 0);
    const y = (v) => h - 3 - ((v - mn) / (mx - mn || 1)) * (h - 6);
    const d = p.map((v, i) => `${i ? "L" : "M"}${((i / (p.length - 1)) * w).toFixed(1)},${y(v).toFixed(1)}`).join("");
    const c = up ? "var(--green)" : "var(--red)";
    return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><line x1="0" x2="${w}" y1="${y(0)}" y2="${y(0)}" stroke="#7a7a7f" stroke-width="1" stroke-dasharray="1.5 3"/><path d="${d}" fill="none" stroke="${c}" stroke-width="1.5" stroke-linejoin="round"/></svg>`;
  }

  // Interactive line chart. opts: { h, grid:[ticks], gutter, area, dotEnd, tail, domain, onScrub(pt|null) }
  function mountChart(el, series, opts) {
    const draw = () => {
      const W = el.clientWidth || 360, H = opts.h, G = opts.gutter || 0;
      const PW = W - G, top = opts.padTop ?? 16, bot = opts.padBot ?? 10;
      const vs = series.map((p) => p.v);
      let [mn, mx] = opts.domain || [Math.min(...vs), Math.max(...vs)];
      const flat = mx - mn < 1e-9;
      const tailW = opts.tail ? PW * 0.035 : 0;
      const LW = PW - tailW;
      const X = (i) => (i / (series.length - 1)) * LW;
      const Y = (v) => (flat ? H / 2 : top + (1 - (v - mn) / (mx - mn)) * (H - top - bot));
      const d = series.map((p, i) => `${i ? "L" : "M"}${X(i).toFixed(2)},${Y(p.v).toFixed(2)}`).join("");
      const last = series[series.length - 1];
      let g = "";
      if (opts.grid) for (const t of opts.grid) {
        const yy = Y(t);
        g += `<line x1="0" x2="${PW}" y1="${yy}" y2="${yy}" stroke="#3a3a3c" stroke-width="1" stroke-dasharray="1.2 3.2"/>`;
        g += `<text x="${W - 4}" y="${yy + 4}" text-anchor="end" fill="#8e8e93" font-size="${opts.labelSize || 12}" font-family="Inter, sans-serif">${t}</text>`;
      }
      const gid = "g" + Math.random().toString(36).slice(2, 8);
      const area = opts.area ? `<defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#00c805" stop-opacity=".42"/><stop offset=".75" stop-color="#00c805" stop-opacity=".05"/><stop offset="1" stop-color="#00c805" stop-opacity="0"/></linearGradient></defs><path d="${d}L${LW},${H}L0,${H}Z" fill="url(#${gid})"/>` : "";
      const tail = opts.tail ? `<line x1="${LW}" x2="${PW}" y1="${Y(last.v)}" y2="${Y(last.v)}" stroke="#00c805" stroke-width="1.6" stroke-dasharray="1.5 4"/>` : "";
      const dot = opts.dotEnd ? `<circle cx="${LW}" cy="${Y(last.v)}" r="${opts.dotR || 4}" fill="#00c805"/>${opts.halo ? `<circle cx="${LW}" cy="${Y(last.v)}" r="9" fill="#00c805" opacity=".25"/>` : ""}` : "";
      el.innerHTML = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${g}${area}<path d="${d}" fill="none" stroke="#00c805" stroke-width="${opts.stroke || 2}" stroke-linejoin="round" stroke-linecap="round"/>${tail}${dot}<g class="cur" style="display:none"><line y1="0" y2="${H}" stroke="#8e8e93" stroke-width="1"/><circle r="5" fill="#00c805" stroke="#000" stroke-width="2"/></g></svg><div class="scrub-label" style="display:none"></div>`;
      el._geo = { X, Y, LW, H };
    };
    draw();
    const move = (e) => {
      const g = el._geo; if (!g) return;
      const r = el.getBoundingClientRect();
      const x = Math.max(0, Math.min(g.LW, e.clientX - r.left));
      const i = Math.round((x / g.LW) * (series.length - 1));
      const p = series[i];
      const cur = el.querySelector(".cur"), lab = el.querySelector(".scrub-label");
      cur.style.display = ""; cur.querySelector("line").setAttribute("x1", g.X(i)); cur.querySelector("line").setAttribute("x2", g.X(i));
      const c = cur.querySelector("circle"); c.setAttribute("cx", g.X(i)); c.setAttribute("cy", g.Y(p.v));
      lab.style.display = ""; lab.style.left = Math.max(40, Math.min(r.width - 40, g.X(i))) + "px"; lab.style.top = "-18px";
      lab.textContent = new Date(p.t).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
      opts.onScrub && opts.onScrub(p, series[0]);
    };
    const leave = () => {
      const cur = el.querySelector(".cur"), lab = el.querySelector(".scrub-label");
      if (cur) cur.style.display = "none"; if (lab) lab.style.display = "none";
      opts.onScrub && opts.onScrub(null);
    };
    el.onpointermove = move; el.onpointerdown = move; el.onpointerleave = leave; el.onpointerup = (e) => { if (e.pointerType !== "mouse") leave(); };
    el._redraw = draw;
  }

  function bindScrub(balEl, chgEl, base) {
    return (p, first) => {
      if (!p) { balEl.textContent = money(base.value); chgEl.innerHTML = base.chgHTML; return; }
      const ch = p.v - first.v, pc = first.v ? (ch / first.v) * 100 : 0, up = ch >= 0;
      balEl.textContent = money(p.v);
      chgEl.innerHTML = base.fmt(up, ch, pc);
    };
  }

  /* ---------- shared fragments ---------- */
  const statusBar = () => STATUS ? `<div class="m-status"><span>${new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }).replace(/ ?[AP]M/, "")}</span><span class="r"><svg width="18" height="12" viewBox="0 0 18 12" fill="#fff"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5" width="3" height="7" rx="1"/><rect x="10" y="2.5" width="3" height="9.5" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1" opacity=".35"/></svg><svg width="17" height="12" viewBox="0 0 17 12" fill="#fff"><path d="M8.5 2.3c2.4 0 4.6.9 6.3 2.5l1.2-1.3A10.6 10.6 0 0 0 8.5.5 10.6 10.6 0 0 0 1 3.5l1.2 1.3a8.8 8.8 0 0 1 6.3-2.5zm0 3.6c1.4 0 2.7.5 3.7 1.4l1.2-1.3a7.2 7.2 0 0 0-9.8 0l1.2 1.3c1-.9 2.3-1.4 3.7-1.4zm0 3.5c-.6 0-1.2.2-1.6.6L8.5 11.6l1.6-1.6c-.4-.4-1-.6-1.6-.6z"/></svg><span class="bat">56</span></span></div>` : '<div class="m-safe"></div>';

  const navBar = (r) => `<nav class="nav">
    <a href="#/home" class="${r === "home" ? "on" : ""}" aria-label="Investing">${I.navInvest}</a>
    <a href="#/crypto" class="${r === "crypto" ? "on" : ""}" aria-label="Crypto">${I.navCrypto}</a>
    <a href="#/search" class="${r === "search" ? "on" : ""}" aria-label="Search">${I.navSearch}</a>
    <a href="#/social" class="${r === "social" ? "on" : ""}" aria-label="Social">${I.navSocial}</a>
    <a href="#/portfolio" class="${r === "portfolio" ? "on" : ""}" aria-label="Account">${I.navAcct}</a></nav>`;

  const chgFmt = (suffix) => (up, ch, pc) => `<span class="${up ? "green" : "red"}">${tri(up)}${money(ch, 2)} (${pct(pc)})</span>${suffix ? `<span class="t">${suffix}</span>` : ""}`;

  const rangesHTML = (list, on, live) => list.map((r) =>
    r === "LIVE" ? `<button class="live" data-r="LIVE"><i></i>LIVE</button>` : `<button data-r="${r}" class="${r === on ? "on" : ""}">${r}</button>`).join("");

  const watchlistHTML = (list) => `<div class="wl">${list.map((s) => `<div class="wl-row"><div class="n"><b>${s.sym}</b><span>${s.name}</span></div><div class="sp">${sparkSVG(s.sym, s.up)}</div><div class="price ${s.up ? "up" : "down"}">${money(s.price, s.decimals)}</div></div>`).join("")}</div>`;

  const disclosures = `<div class="disc">
    <p>For more information, view our <b>disclosures</b>.</p>
    <p>Options are risky and aren't suitable for all investors. To learn more, read the <b>Options Disclosure Document</b>. Index options are subject to a <b>contract fee</b>.</p>
    <p>Futures, options on futures and cleared swaps trading involves significant risk and is not appropriate for everyone. Please carefully consider if it's appropriate for you in light of your personal financial circumstances. Please read the <b>Futures Risk Disclosure Statement</b> and the <b>Event Contracts Risk Disclosure</b>.</p>
    <p>Onchain lending takes place through your self-custody wallet via Morpho's lending protocol. Your self-custody wallet is managed by you through services provided by Robinhood Non-Custodial, Ltd. (RHNC) and Privy. Morpho is an independent lending protocol and is not affiliated with Robinhood. RHNC neither custodies your crypto nor holds your private keys. Onchain lending is not suitable for everyone and involves substantial risk, including loss of principal. Read the <b>Onchain Lending disclosure</b> to learn more.</p></div>`;

  const acctRows = () => D.portfolio.accounts.map((a) => `<div class="acct-row"><div><b>${a.name} ${I.chevD}</b><div class="s">${a.sub}</div></div><div><div class="v">${money(a.value, 2)}</div>${a.pct == null ? '<div class="p dash">—</div>' : `<div class="p green">${tri(a.pct >= 0)}${pct(a.pct)}</div>`}</div></div>`).join("");

  /* ---------- MOBILE PAGES ---------- */
  function mHome() {
    const d = D.investing;
    const chg = chgFmt("Today");
    return {
      html: `${statusBar()}
      <div class="m-tabs"><a class="on">Investing</a><a>Predict</a><a>MCP</a><a>Custodial</a><a>Retirement</a></div>
      <div class="m-hint">Swipe or tap to view prediction markets</div>
      <div class="m-head" style="margin-top:28px"><div><div class="m-bal num" id="bal">${money(d.value)}</div><div class="m-chg" id="chg">${chg(d.change >= 0, d.change, d.changePct)}</div></div><a class="gift">${I.gift}Your gift</a></div>
      <div class="m-chart" id="chart" style="margin-top:6px"></div>
      <div class="ranges" style="margin-top:12px">${rangesHTML(RANGES_HOME, "1D")}<span style="margin-left:-4px">${I.gear}</span></div>
      <div class="hr" style="margin-top:14px"></div>
      <a class="row bp"><span>Buying power</span><span class="v num">${money(d.buyingPower, 2)}${I.chev}</span></a>
      <div class="reward"><div class="side">${I.cube}</div><div class="body"><div class="tag" style="color:#b5b5ba">${I.star}Robinhood rewards</div><p>Trade eligible assets to enter our $700K crypto sweepstakes. Free entry available. Terms apply.</p></div><span class="x">${I.x}</span></div>
      <div class="earn"><div class="a">Earn an estimated 7% on a USD-backed stablecoin.</div><div class="b">Onchain lending via self-custody wallet ${I.wallet}</div><a class="ulink">Start earning</a></div>
      <div style="padding:46px var(--px) 0"><h3 class="sec-t">Prediction markets ${I.chev}</h3></div>
      <div class="pm-card"><span class="x" style="top:10px;right:10px">${I.x}</span><div class="phone"><div class="tabs"><span>Individual</span><span>Credit Card</span><span>Retirement</span><span>Strategies</span></div></div><h4>Predictions have a new home</h4><p>Easily find all your favorite prediction markets,<br>positions and trades in a dedicated place.</p><a class="pill-w">Predict</a></div>
      <div style="padding:44px var(--px) 0"><h3 class="sec-t">Realized profit &amp; loss ${I.chev}</h3></div>
      <div class="row" style="height:56px;color:#a3a3a8;font-size:14px"><span>Past month</span><span class="num" style="color:#fff">$0.00</span></div>
      <div style="height:30px"></div>
      ${watchlistHTML(D.watchlist)}
      ${disclosures}
      ${navBar("home")}`,
      mount() {
        const el = document.getElementById("chart");
        mountChart(el, flatSeries(d.value), { h: 330, dotEnd: true, tail: true, dotR: 3.5, stroke: 1.8,
          onScrub: bindScrub(document.getElementById("bal"), document.getElementById("chg"), { value: d.value, chgHTML: chg(d.change >= 0, d.change, d.changePct), fmt: chg }) });
        wireRanges();
      },
    };
  }

  function mCrypto() {
    const d = D.crypto;
    const chg = chgFmt("Today");
    return {
      html: `${statusBar()}
      <div class="m-head" style="padding-top:38px"><div><h1 class="m-title">Crypto</h1><div class="m-bal num" style="margin-top:6px"><span id="bal">${money(d.value)}</span><span class="info">${I.info}</span></div><div class="m-chg" id="chg">${chg(d.change >= 0, d.change, d.changePct)}</div></div><a class="gift dim">Your gift</a></div>
      <div class="m-chart" id="chart" style="margin-top:0"></div>
      <div class="ranges" style="margin-top:4px">${rangesHTML(RANGES_HOME, "1D")}</div>
      <div class="hr" style="margin-top:14px"></div>
      <a class="row pnl"><span>Realized profit &amp; loss</span><span class="v"><span class="newpill">New</span>${I.chev}</span></a>
      <div class="thick"></div>
      <div style="padding:34px var(--px) 8px"><h3 class="sec-t" style="font-size:24px">Holdings</h3></div>
      <div class="row" style="height:56px;color:#a3a3a8;font-size:14px"><span>No crypto yet</span><span></span></div>
      <a class="ulink" style="margin:6px var(--px) 0">Deposit crypto</a>
      <div style="padding:40px var(--px) 4px"><h3 class="sec-t" style="font-size:24px">Popular crypto</h3></div>
      ${watchlistHTML(d.list)}
      <div class="showall"><a class="ulink" style="margin-top:0">Show all</a></div>
      <div style="padding:40px var(--px) 0"><h3 class="sec-t" style="font-size:24px">Robinhood Chain <span class="info" style="width:20px;height:20px;display:inline-block">${I.info}</span></h3></div>
      <div class="chips">${d.chain.map((c) => `<span class="chip"><span class="dot" style="background:${c.color}"></span>${c.name} <span style="color:#c7c7cc">${c.mcap}</span> <span class="${c.pct >= 0 ? "green" : "red"}">${c.pct >= 0 ? "+" : ""}${c.pct.toFixed(2)}%</span></span>`).join("")}</div>
      <div style="height:160px"></div>
      <a class="cta g">Buy crypto</a>
      ${navBar("crypto")}`,
      mount() {
        mountChart(document.getElementById("chart"), flatSeries(d.value), { h: 300, dotEnd: true, halo: true, tail: true, dotR: 5, stroke: 1.8,
          onScrub: bindScrub(document.getElementById("bal"), document.getElementById("chg"), { value: d.value, chgHTML: chg(d.change >= 0, d.change, d.changePct), fmt: chg }) });
        wireRanges();
      },
    };
  }

  let poRange = "1W";
  function poChart(el, h, gutter, labelSize) {
    const d = D.portfolio, s = portfolioSeries(poRange);
    const chg = chgFmt("");
    const mx = Math.max(...d.yTicks, ...s.map((p) => p.v));
    mountChart(el, s, { h, gutter, area: true, dotEnd: true, dotR: 3.5, grid: d.yTicks, labelSize, domain: [-(mx * 0.09), mx * 1.05], padTop: 10, padBot: 0,
      onScrub: bindScrub(document.getElementById("bal"), document.getElementById("chg"), { value: d.value, chgHTML: chg(true, d.change, d.changePct), fmt: chg }) });
  }

  function mPortfolio() {
    const d = D.portfolio, chg = chgFmt("");
    return {
      html: `${statusBar()}
      <div class="po-top"><span class="pillbtn">Portfolio overview <span class="info">${I.info}</span></span><span class="iconpill"><span class="bell">${I.bell}<i>!</i></span>${I.menu}</span></div>
      <div class="po-bal"><div><div class="m-bal num" id="bal">${money(d.value)}</div><div class="m-chg" id="chg" style="font-weight:600">${chg(d.change >= 0, d.change, d.changePct)}</div></div><div class="seg"><span class="on">${I.lineIco}</span><span>${I.barsIco}</span></div></div>
      <div class="m-chart" id="chart" style="margin-top:30px"></div>
      <div class="ranges" style="margin-top:22px">${rangesHTML(RANGES_PO, poRange)}</div>
      <div class="promo"><div class="t">${D.promo.text}<br><a class="gs">Get started</a></div><div class="two">${D.promo.big}</div><span class="x">${I.x}</span></div>
      <div class="acct">${acctRows()}</div>
      <div class="foot">All investments involve risk and loss of principal is possible.</div>
      <div style="height:90px"></div>
      <a class="cta w">Transfer</a>
      ${navBar("portfolio")}`,
      mount() {
        poChart(document.getElementById("chart"), 220, 46, 13);
        wireRanges((r) => { poRange = r; render(); }, RANGES_PO);
      },
    };
  }

  function mSearch() {
    return {
      html: `${statusBar()}
      <div class="sr-top"><div class="sbox">${I.search}<span>Search Robinhood...</span></div><span class="cortex">${I.cortex}<span class="tip">Cortex can explain today's market moves—ask away.</span></span></div>
      <div class="now"><span class="on">Now</span><span>Upcoming</span></div>
      <h3 class="h3">Baseball ${I.chev}</h3>
      <div class="hscroll">${["Nov 4", "Nov 7", "Nov 8"].map((dt) => `<div class="game"><div class="d">${dt}</div><div class="t"><div><i style="background:#ff6a2b"></i>Samsung Lions</div><div><i style="background:#7a7cff"></i>KT Wiz</div></div></div>`).join("")}</div>
      <h3 class="h3" style="padding-top:34px">Sectors</h3>
      <div class="hscroll"><div class="sector">Technology ›</div><div class="sector">Financials ›</div></div>
      <h3 class="h3" style="padding-top:34px">Increased options volume <span class="info" style="width:17px;height:17px;display:inline-block;color:#a3a3a8">${I.info}</span></h3>
      <div class="ov">${Array.from({ length: 6 }, () => `<span>— <b class="green" style="font-size:12px">▲</b> —</span>`).join("")}</div>
      <div style="height:140px"></div>
      ${navBar("search")}`,
      mount() {},
    };
  }

  function mSocial() {
    return {
      html: `<div class="soc">${statusBar()}
      <div class="mini"><small>Tiger Corp · ROAR</small><b>$37.38</b><div id="sp" style="margin-top:6px"></div><div style="display:flex;justify-content:space-between;font-size:12px;margin-top:6px"><span class="green">${tri(true)}$23.21 (12.23%)</span><span>1D</span></div></div>
      <div class="card"><div class="who"><span class="avatar"></span><div><b>Voltrader<span>12m ago</span></b><p>Fed's been clear — no cuts until inflation cools further. Easy No here at these odds.</p></div></div>
        <div class="q"><div class="h">Will Bitcoin cross $100k again this year?</div><div class="b"><div>Above $100,000<small>1,000 Yes @ $0.08</small></div><span class="gain">+$15.54</span></div></div></div>
      <div class="soc-hero"><div class="k">Robinhood Social</div><h2>Real people, real trades</h2><p>Explore verified trades, P&amp;L, portfolios, and more from the Robinhood community.</p><a class="btn">Get started</a></div>
      </div>${navBar("social")}`,
      mount() { const el = document.getElementById("sp"); el.innerHTML = sparkSVG("ROAR", true, el.clientWidth || 300, 90).replace(/stroke="var\(--green\)"/, 'stroke="#d4ff3a"'); },
    };
  }

  /* ---------- DESKTOP WEB ---------- */
  function webShell(route, main, side) {
    const link = (label, r) => `<a href="${r ? "#/" + r : "javascript:void 0"}" class="${route === r ? "on" : ""}">${label}</a>`;
    return `<div class="w-banner">Our powerful, new trading platform is here—at no extra cost. <a>Try Robinhood Legend</a></div>
      <header class="w-head"><a href="#/portfolio">${I.feather}</a><label class="w-search">${I.search}<input placeholder="Search" /></label>
      <nav class="w-nav">${link("Refer")}${link("Investing", "home")}${link("Predict")}${link("Crypto", "crypto")}${link("Agentic")}${link("Retirement")}${link("Portfolio overview", "portfolio")}<a>Notifications<span class="badge">1</span></a>${link("Account")}</nav></header>
      <div class="w-wrap"><main class="w-main">${main}</main><aside class="w-side">${side}</aside></div>`;
  }
  const transferPanel = `<div class="panel"><div class="panel-h">Transfer money ${I.chevD}</div><div class="tm">
      <div class="f">Amount<span class="in"><input id="amt" inputmode="decimal" placeholder="$0.00" /></span></div>
      <div class="f">From<span class="in sel">Choose account <span style="font-size:9px">▲<br>▼</span></span></div>
      <div class="f">To<span class="in sel">Choose account <span style="font-size:9px">▲<br>▼</span></span></div>
      <button class="rv" id="rv">Review transfer</button></div></div>`;
  const accountsPanel = `<div class="panel"><div class="panel-h">Accounts</div><div class="al">
      <a><span>Open a Robinhood account<small>Choose the account type that fits your needs</small></span>${I.chev}</a>
      <a><span>Manage external accounts</span>${I.chev}</a></div></div>`;

  function wPortfolio() {
    const d = D.portfolio, chg = chgFmt("");
    const main = `<h1 class="w-title">Portfolio overview ${I.info}</h1>
      <div class="w-bal num" id="bal">${money(d.value)}</div>
      <div class="w-chg" id="chg">${chg(true, d.change, d.changePct)}</div>
      <div class="w-chart-wrap"><div class="w-seg"><span class="on">${I.lineIco}</span><span>${I.barsIco}</span></div><div class="m-chart" id="chart" style="margin-top:20px"></div></div>
      <div class="w-ranges">${RANGES_PO.map((r) => `<button data-r="${r}" class="${r === poRange ? "on" : ""}">${r}</button>`).join("")}</div>
      <div class="w-promo"><div class="two">${D.promo.big}</div><div class="c"><span>${D.promo.text}</span><a>Get started</a></div><span class="x">${I.x}</span></div>
      <div class="acct w-acct" style="padding:0">${acctRows()}</div>
      <div class="w-foot"><p>All investments involve risk and loss of principal is possible.</p>
      <p>External account balance and investment holding information displayed in the Portfolio Overview is provided by third parties and is presented as a convenience to you for informational purposes only. Robinhood makes no representation or warranty regarding the accuracy, timeliness or completeness of information related to your external accounts. You have the option to edit account names, account types, and asset types shown in the Portfolio Overview to reflect your personal classification for tracking purposes only. By electing to edit or reclassify this information, you acknowledge and assume sole responsibility for the accuracy, display, and categorization of such data. Robinhood does not validate user-initiated changes. Any edits you make are for your personal tracking purposes and will not change the underlying account.</p></div>`;
    return {
      html: webShell("portfolio", main, transferPanel + accountsPanel),
      mount() {
        poChart(document.getElementById("chart"), 268, 36, 11.5);
        document.querySelectorAll(".w-ranges button").forEach((b) => (b.onclick = () => { poRange = b.dataset.r; render(); }));
        wireTransfer();
      },
    };
  }

  function wInvesting(kind) {
    const d = kind === "crypto" ? D.crypto : D.investing;
    const chg = chgFmt("Today");
    const list = kind === "crypto" ? D.crypto.list : D.watchlist;
    const main = `<h1 class="w-title">${kind === "crypto" ? "Crypto" : "Investing"}</h1>
      <div class="w-bal num" id="bal">${money(d.value)}</div>
      <div class="w-chg" id="chg">${chg(d.change >= 0, d.change, d.changePct)}</div>
      <div class="m-chart" id="chart" style="margin-top:20px"></div>
      <div class="w-ranges">${["LIVE", "1D", "1W", "1M", "3M", "YTD", "1Y", "ALL"].map((r) => `<button data-r="${r}" class="${r === "1D" ? "on" : ""}">${r}</button>`).join("")}</div>
      ${kind === "crypto" ? "" : `<a class="row bp" style="padding:0;border-bottom:1px solid var(--line)"><span style="font-weight:700;font-size:14.5px">Buying power</span><span class="v num">${money(D.investing.buyingPower, 2)}${I.chevD.replace("<svg", '<svg width="14" height="14"')}</span></a>`}
      <div class="w-sec"><h3 class="sec-t">${kind === "crypto" ? "Popular crypto" : "Watchlist"}</h3></div>
      ${watchlistHTML(list)}
      ${kind === "crypto" ? `<div class="w-sec"><h3 class="sec-t">Robinhood Chain</h3></div><div class="chips" style="padding-left:0">${D.crypto.chain.map((c) => `<span class="chip"><span class="dot" style="background:${c.color}"></span>${c.name} <span style="color:#c7c7cc">${c.mcap}</span> <span class="${c.pct >= 0 ? "green" : "red"}">${c.pct >= 0 ? "+" : ""}${c.pct.toFixed(2)}%</span></span>`).join("")}</div>` : ""}
      <div class="w-foot" style="margin-top:40px"><p>All investments involve risk and loss of principal is possible.</p></div>`;
    return {
      html: webShell(kind === "crypto" ? "crypto" : "home", main, transferPanel + accountsPanel),
      mount() {
        mountChart(document.getElementById("chart"), flatSeries(d.value), { h: 268, dotEnd: true, tail: true, dotR: 4,
          onScrub: bindScrub(document.getElementById("bal"), document.getElementById("chg"), { value: d.value, chgHTML: chg(d.change >= 0, d.change, d.changePct), fmt: chg }) });
        document.querySelectorAll(".w-ranges button").forEach((b) => (b.onclick = () => { document.querySelectorAll(".w-ranges button").forEach((x) => x.classList.toggle("on", x === b)); }));
        wireTransfer();
      },
    };
  }

  function wireTransfer() {
    const amt = document.getElementById("amt"), rv = document.getElementById("rv");
    if (!amt) return;
    amt.oninput = () => {
      const n = amt.value.replace(/[^0-9.]/g, "");
      amt.value = n ? "$" + n : "";
      rv.classList.toggle("ok", parseFloat(n) > 0);
    };
  }

  function wireRanges(onPick, allowed) {
    document.querySelectorAll(".ranges button[data-r]").forEach((b) => {
      b.onclick = () => {
        if (onPick && allowed && allowed.includes(b.dataset.r)) return onPick(b.dataset.r);
        if (b.dataset.r === "LIVE") return;
        document.querySelectorAll(".ranges button[data-r]").forEach((x) => x.classList.toggle("on", x === b));
      };
    });
  }

  /* ---------- router ---------- */
  let lastMode = null, lastRoute = null;
  function route() {
    const r = (location.hash.replace(/^#\/?/, "") || "").split("?")[0];
    return ["home", "crypto", "search", "social", "portfolio"].includes(r) ? r : isDesktop() ? "portfolio" : "home";
  }
  function render() {
    const r = route(), desk = isDesktop();
    let page;
    if (desk) {
      if (r === "crypto") page = wInvesting("crypto");
      else if (r === "home") page = wInvesting("home");
      else page = wPortfolio();
    } else {
      page = { home: mHome, crypto: mCrypto, search: mSearch, social: mSocial, portfolio: mPortfolio }[r]();
    }
    root.innerHTML = desk ? page.html : `<div class="m">${page.html}</div>`;
    if (r !== lastRoute) window.scrollTo(0, 0);
    document.title = (r === "portfolio" ? "Portfolio overview" : r === "crypto" ? "Crypto" : r === "home" ? "Investing" : r[0].toUpperCase() + r.slice(1)) + " | Robinhood";
    page.mount();
    lastMode = desk; lastRoute = r;
  }
  window.addEventListener("hashchange", render);
  let rt;
  window.addEventListener("resize", () => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      if (isDesktop() !== lastMode) return render();
      const c = document.getElementById("chart"); if (c && c._redraw) c._redraw();
    }, 80);
  });
  render();
})();

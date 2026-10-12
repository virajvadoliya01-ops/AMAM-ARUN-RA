/**
 * AMAM ARUN RESEARCH (SEBI RA INH000028422)
 * Interactive Application Logic & 60 Strategy Engine
 */

// Embed the complete 60 strategies data directly for high performance & offline reliability
const STRATEGIES = [
  {"id":"S01","code":"S01","category":"Trend","name":"EMA 9/21 Crossover","description":"A fast trend-follower that flips with short-term momentum, so it is always either long or short.","rule":"Long when EMA9 crosses above EMA21, short on cross below. Stop-and-reverse."},
  {"id":"S02","code":"S02","category":"Trend","name":"EMA 20/50 Crossover","description":"A slower crossover that ignores minor noise and rides medium-term trends.","rule":"Long when EMA20 crosses above EMA50, short on cross below."},
  {"id":"S03","code":"S03","category":"Trend","name":"Supertrend (10, 3)","description":"Draws a volatility-based trailing line and enters when price flips to the other side of it.","rule":"Enter on Supertrend direction flip (ATR 10, factor 3)."},
  {"id":"S04","code":"S04","category":"Momentum","name":"MACD Signal Cross (12,26,9)","description":"Catches momentum shifts as the MACD line moves above or below its signal line.","rule":"Long when MACD crosses above signal line, short on cross below."},
  {"id":"S05","code":"S05","category":"Mean Reversion","name":"RSI 14 Mean Reversion (30/70)","description":"Buys oversold dips and sells overbought rallies, exiting when RSI returns to the neutral 50.","rule":"Long when RSI crosses up through 30, short when it crosses down through 70; exit at 50."},
  {"id":"S06","code":"S06","category":"Breakout","name":"Bollinger Band Breakout (20, 2)","description":"Treats a close outside the bands as the start of a strong move and trades in its direction.","rule":"Long on close above upper band, short on close below lower band."},
  {"id":"S07","code":"S07","category":"Mean Reversion","name":"Bollinger Band Reversion (20, 2)","description":"The opposite view to S06: closes outside the bands are overstretched, so it fades them back to the average.","rule":"Fade closes outside the bands; exit at the middle band."},
  {"id":"S08","code":"S08","category":"Mean Reversion","name":"VWAP Reversion","description":"Fades intraday moves that stretch too far from VWAP, the day's volume-weighted fair price, and targets a return to it.","rule":"Fade a stretch of 1.5 ATR from session VWAP; exit at VWAP. Session-based, so best suited to 15m."},
  {"id":"S09","code":"S09","category":"Breakout","name":"Opening Range Breakout (15m)","description":"Lets the first 15 minutes set the day's range, then trades whichever side breaks first.","rule":"Trade the break of the first 15-minute high/low. Session-based, so best suited to 15m."},
  {"id":"S10","code":"S10","category":"Breakout","name":"Donchian 20 Breakout","description":"The classic channel breakout: buy a new 20-bar high, sell a new 20-bar low.","rule":"Long on 20-bar high break, short on 20-bar low break."},
  {"id":"S11","code":"S11","category":"Trend","name":"Heikin Ashi Trend","description":"Smoothed candles filter out noise; a clean colour change with no opposing wick marks a new trend.","rule":"Enter on colour change of Heikin Ashi candles with no opposing wick."},
  {"id":"S12","code":"S12","category":"Momentum","name":"Stochastic (14,3,3) Cross","description":"Looks for momentum turning up from oversold or down from overbought zones.","rule":"Long on %K cross above %D below 20, short on cross below %D above 80."},
  {"id":"S13","code":"S13","category":"Trend","name":"ADX/DMI Trend (14, ADX>20)","description":"Follows directional crossovers only when ADX confirms a real trend, cutting trades in sideways markets.","rule":"Follow +DI/-DI crossovers only when ADX is above 20."},
  {"id":"S14","code":"S14","category":"Trend","name":"Ichimoku Cloud Breakout","description":"A multi-factor trend check: price must clear the cloud with the short-term line above the base line.","rule":"Long on close above the cloud with Tenkan above Kijun, short on the reverse."},
  {"id":"S15","code":"S15","category":"Trend","name":"Parabolic SAR (0.02, 0.2)","description":"Trailing dots that follow price closely; the strategy reverses every time they flip sides.","rule":"Stop-and-reverse on SAR flip."},
  {"id":"S16","code":"S16","category":"Breakout","name":"Keltner Channel Breakout (20, 1.5 ATR)","description":"An ATR-based volatility channel; a close outside it signals momentum in that direction.","rule":"Long on close above upper channel, short below lower channel."},
  {"id":"S17","code":"S17","category":"Breakout","name":"Previous Day High/Low Breakout","description":"Trades the break of yesterday's high or low, levels the whole market is watching.","rule":"Trade the break of the prior session's high/low."},
  {"id":"S18","code":"S18","category":"Price Action","name":"Inside Bar Breakout","description":"A bar that sits inside the previous one shows compression; the strategy trades the side it breaks.","rule":"Enter on the break of an inside bar's high/low."},
  {"id":"S19","code":"S19","category":"Price Action","name":"CPR / Pivot Breakout","description":"Uses the Central Pivot Range from yesterday's prices; a break above or below sets the day's bias.","rule":"Trade breaks of the Central Pivot Range (TC/BC) from prior-day data."},
  {"id":"S20","code":"S20","category":"Trend","name":"200 EMA Pullback (with 20 EMA)","description":"Buys dips to the 20 EMA in uptrends and sells rallies in downtrends, with the 200 EMA setting the direction.","rule":"Trade pullbacks to the 20 EMA in the direction of the 200 EMA."},
  {"id":"S21","code":"S21","category":"Trend","name":"Triple EMA Ribbon (8/13/21)","description":"Enters only when three EMAs are stacked in order with price beyond all of them: a clean, aligned trend.","rule":"Long when EMA8>EMA13>EMA21 and price above all three; short on full reversal."},
  {"id":"S22","code":"S22","category":"Mean Reversion","name":"CCI (20) Extreme Reversal","description":"Trades the turn as CCI comes back from extreme readings beyond plus or minus 100.","rule":"Long when CCI crosses up through -100, short when it crosses down through +100."},
  {"id":"S23","code":"S23","category":"Mean Reversion","name":"Williams %R (14) Reversal","description":"Catches reversals as Williams %R leaves its oversold or overbought zone.","rule":"Long when %R crosses up through -80, short when it crosses down through -20."},
  {"id":"S24","code":"S24","category":"Momentum","name":"Awesome Oscillator Saucer","description":"Uses Awesome Oscillator patterns to time entries in the direction of the prevailing momentum.","rule":"Enter on AO saucer/twin-peak signals in the direction of the zero-line bias."},
  {"id":"S25","code":"S25","category":"Momentum","name":"TRIX (15) Signal Cross","description":"A triple-smoothed momentum line whose signal cross filters out short-term noise.","rule":"Long when TRIX crosses above its signal line, short on cross below."},
  {"id":"S26","code":"S26","category":"Breakout","name":"ATR Volatility Breakout","description":"Enters when one bar moves far more than its normal range, a sign that volatility is expanding.","rule":"Long when close exceeds prior close + 1.5xATR(14), short on the mirror move down."},
  {"id":"S27","code":"S27","category":"Breakout","name":"52-Period Channel Breakout","description":"A longer breakout system built to catch bigger trends from new 52-bar highs or lows.","rule":"Long on a new 52-bar high close, short on a new 52-bar low close."},
  {"id":"S28","code":"S28","category":"Price Action","name":"Pivot Point Reversal (Classic)","description":"Fades the first test of the R1 or S1 pivot, aiming for a move back to the central pivot.","rule":"Fade the first touch of R1/S1 pivot levels back toward the central pivot."},
  {"id":"S29","code":"S29","category":"Price Action","name":"Fibonacci 61.8% Retracement Bounce","description":"Joins the trend after a deep but healthy pullback to the 61.8% retracement level.","rule":"Enter in the trend direction on a bounce from the 61.8% retracement of the last swing."},
  {"id":"S30","code":"S30","category":"Breakout","name":"Volume Spike Breakout","description":"Takes only the breakouts that are backed by at least double the usual volume.","rule":"Trade breakouts confirmed by volume at least 2x the 20-bar average."},
  {"id":"S31","code":"S31","category":"Price Action","name":"Three White Soldiers / Black Crows","description":"Three strong candles in a row signal conviction; the strategy enters in that direction.","rule":"Enter on three consecutive same-direction candles of increasing range."},
  {"id":"S32","code":"S32","category":"Trend","name":"MA Ribbon Compression Expansion","description":"Waits for five EMAs to bunch tightly together, then trades the move as they fan out.","rule":"Enter on breakout from a tight multi-EMA ribbon (5/10/15/20/25) once it expands."},
  {"id":"S33","code":"S33","category":"Mean Reversion","name":"RSI Divergence","description":"When price makes a new extreme but RSI does not, momentum is fading; the strategy trades the reversal.","rule":"Enter counter-trend on bullish/bearish RSI-price divergence at swing extremes."},
  {"id":"S34","code":"S34","category":"Trend","name":"Heikin Ashi Supertrend Combo","description":"Two trend filters must agree before entry, which cuts down on whipsaws.","rule":"Enter only when Heikin Ashi colour and Supertrend direction agree."},
  {"id":"S35","code":"S35","category":"Price Action","name":"Gap and Go","description":"Trades in the direction of a meaningful opening gap once the opening range confirms it.","rule":"Trade in the direction of a session open gap beyond 0.3% once the opening range confirms it."},
  {"id":"S36","code":"S36","category":"Trend","name":"Double EMA (5/20) Scalp","description":"Quick crossover trades on the 15-minute chart with tight stops.","rule":"Fast EMA5/EMA20 crossover scalp with tight stop, intended mainly for 15m."},
  {"id":"S37","code":"S37","category":"Momentum","name":"Bollinger %B Momentum","description":"Measures where price sits inside the bands: strength near the top is bought, weakness near the bottom is sold.","rule":"Long when %B crosses above 0.8 with rising momentum, short when it crosses below 0.2."},
  {"id":"S38","code":"S38","category":"Breakout","name":"Linear Regression Channel Breakout","description":"Treats a close outside a 50-bar regression channel as a break from the established path.","rule":"Trade closes outside a 50-bar linear regression channel in the breakout direction."},
  {"id":"S39","code":"S39","category":"Trend","name":"Chaikin Money Flow Trend (20)","description":"Combines money flow, the balance of buying and selling pressure, with price position against the 20 EMA.","rule":"Long while CMF>0 and price above 20 EMA, short on the mirror condition."},
  {"id":"S40","code":"S40","category":"Breakout","name":"Range Compression (NR7) Breakout","description":"The narrowest bar of the last seven often comes before a big move; the strategy trades the breakout.","rule":"Trade the breakout of the narrowest-range-of-7-bars (NR7) setup."},
  {"id":"S41","code":"S41","category":"Trend","name":"Dual Supertrend (7,2 / 14,3) Confirm","description":"A fast and a slow Supertrend must agree, so short- and medium-term trends point the same way.","rule":"Enter only when a fast and a slow Supertrend agree on direction."},
  {"id":"S42","code":"S42","category":"Momentum","name":"MACD Zero-Line Cross","description":"A slower momentum signal: the trend has turned when the MACD line crosses zero.","rule":"Long when the MACD line crosses above zero, short when it crosses below zero."},
  {"id":"S43","code":"S43","category":"Momentum","name":"RSI 14 Trend-Following (50 cross)","description":"Uses RSI as a trend gauge: above 50 and rising is bullish, below 50 is bearish.","rule":"Long when RSI crosses above 50 with rising slope, short on cross below 50."},
  {"id":"S44","code":"S44","category":"Momentum","name":"Elder Ray Bull/Bear Power","description":"Buys when sellers start weakening inside an uptrend, and the mirror for shorts.","rule":"Long when Bear Power turns up while price is above EMA13, short on the mirror condition."},
  {"id":"S45","code":"S45","category":"Trend","name":"Hull Moving Average Trend (16)","description":"Trades with the slope of the Hull MA, a fast moving average with very little lag.","rule":"Long when price closes above a rising HMA(16), short when it closes below a falling HMA(16)."},
  {"id":"S46","code":"S46","category":"Trend","name":"VWAP Trend Continuation","description":"After a pullback, rejoins the day's trend once price reclaims VWAP.","rule":"Trade in the direction of price relative to session VWAP once price reclaims it after a pullback."},
  {"id":"S47","code":"S47","category":"Breakout","name":"Bollinger Band Squeeze Breakout","description":"Band width at a 6-month low signals compression; the strategy trades the breakout that follows.","rule":"Enter on the breakout that follows a Bollinger Bandwidth contraction to a 6-month low."},
  {"id":"S48","code":"S48","category":"Price Action","name":"Camarilla Pivot Breakout","description":"Breaks of yesterday's Camarilla H3 or L3 levels set the intraday direction.","rule":"Trade breaks of the Camarilla H3/L3 levels derived from the prior session."},
  {"id":"S49","code":"S49","category":"Price Action","name":"Three Bar Reversal","description":"A three-bar higher-low or lower-high pattern at a swing extreme signals a turn.","rule":"Enter counter-trend on a three-bar reversal pattern (higher low / lower high sequence) at a swing extreme."},
  {"id":"S50","code":"S50","category":"Trend","name":"ATR Trailing Stop Trend","description":"Rides the trend behind a wide ATR trailing stop and reverses when the stop is hit.","rule":"Stay long/short following price while trailing an ATR(14) x 2.5 stop; reverse on stop-out."},
  {"id":"S51","code":"S51","category":"Trend","name":"OBV Trend Confirmation","description":"Volume must confirm price: enters when On-Balance Volume and price make new highs or lows together.","rule":"Long when OBV makes a new high alongside price, short when OBV makes a new low alongside price."},
  {"id":"S52","code":"S52","category":"Momentum","name":"Momentum Oscillator (10) Threshold","description":"Compares price with 10 bars ago; crossing the 100 line marks a shift in momentum.","rule":"Long when the 10-bar momentum oscillator crosses above 100, short when it crosses below 100."},
  {"id":"S53","code":"S53","category":"Trend","name":"Double Bollinger Band Trend (1 & 2 SD)","description":"Stays in the trade while price holds the zone between the 1 and 2 standard-deviation bands.","rule":"Long while price holds the 1-2 SD band zone above the mean, short in the mirror zone below."},
  {"id":"S54","code":"S54","category":"Trend","name":"Volume Weighted MA Cross (VWMA 10/30)","description":"A crossover that gives more weight to high-volume bars, so moves backed by volume count more.","rule":"Long when VWMA10 crosses above VWMA30, short on cross below."},
  {"id":"S55","code":"S55","category":"Momentum","name":"RSI + MACD Dual Confirmation","description":"Two momentum tools must agree before entry.","rule":"Enter only when RSI>50 and MACD is above its signal line (and the mirror for shorts)."},
  {"id":"S56","code":"S56","category":"Price Action","name":"Pin Bar / Hammer Reversal","description":"A long rejection wick at a swing extreme signals that the move is being rejected.","rule":"Enter counter-trend on a pin bar or hammer with a wick at least twice the body, at a swing extreme."},
  {"id":"S57","code":"S57","category":"Breakout","name":"Fractal Breakout (Williams Fractals)","description":"Trades the break of the most recent confirmed swing high or low.","rule":"Trade the break of the most recent confirmed Williams Fractal high/low."},
  {"id":"S58","code":"S58","category":"Mean Reversion","name":"Session VWAP Std-Dev Band Fade","description":"Fades touches of the outer VWAP band back toward VWAP during the session.","rule":"Fade a touch of the 2nd standard-deviation VWAP band back toward VWAP."},
  {"id":"S59","code":"S59","category":"Trend","name":"Choppiness Index Filtered Trend (14)","description":"Takes EMA-cross signals only when the Choppiness Index says the market is trending, not ranging.","rule":"Take EMA-cross trend signals only when the Choppiness Index is below 38 (trending regime)."},
  {"id":"S60","code":"S60","category":"Price Action","name":"End-of-Day Momentum Carry","description":"Follows the last 30 minutes' direction into the next session as a short swing trade.","rule":"Enter in the direction of the last 30 minutes' momentum for a swing hold into the next session."}
];

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initStrategies();
  initModals();
  initFAQ();
  initMobileNav();
});

/* ===================================================================
   1. COUNTDOWN TIMER TO NEXT FRIDAY @ 9:00 PM IST
   =================================================================== */
function getNextFriday9PM() {
  const now = new Date();
  // Get time in UTC+5:30 (IST)
  const istOffset = 5.5 * 60 * 60 * 1000;
  const nowIST = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + istOffset);
  
  const currentDay = nowIST.getDay(); // 0: Sun, 1: Mon, ... 5: Fri, 6: Sat
  let daysUntilFriday = (5 - currentDay + 7) % 7;
  
  // If today is Friday, check if 9:00 PM (21:00) has passed
  if (daysUntilFriday === 0 && (nowIST.getHours() > 21 || (nowIST.getHours() === 21 && nowIST.getMinutes() >= 0))) {
    daysUntilFriday = 7;
  }
  
  const targetIST = new Date(nowIST);
  targetIST.setDate(nowIST.getDate() + daysUntilFriday);
  targetIST.setHours(21, 0, 0, 0);
  
  // Convert target back to local user timestamp
  const diffFromNow = targetIST.getTime() - nowIST.getTime();
  return new Date(Date.now() + diffFromNow);
}

function initCountdown() {
  const targetTime = getNextFriday9PM();

  function update() {
    const now = new Date();
    const diff = targetTime - now;

    if (diff <= 0) {
      document.getElementById('days').textContent = '00';
      document.getElementById('hours').textContent = '00';
      document.getElementById('minutes').textContent = '00';
      document.getElementById('seconds').textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    const dEl = document.getElementById('days');
    const hEl = document.getElementById('hours');
    const mEl = document.getElementById('minutes');
    const sEl = document.getElementById('seconds');

    if (dEl) dEl.textContent = String(days).padStart(2, '0');
    if (hEl) hEl.textContent = String(hours).padStart(2, '0');
    if (mEl) mEl.textContent = String(minutes).padStart(2, '0');
    if (sEl) sEl.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ===================================================================
   2. STRATEGIES DIRECTORY & FILTERING ENGINE
   =================================================================== */
let currentFilter = 'All';
let currentSearch = '';

function initStrategies() {
  const container = document.getElementById('strategiesGrid');
  const searchInput = document.getElementById('strategySearch');
  const filterPills = document.querySelectorAll('.filter-pill');
  const countDisplay = document.getElementById('renderedCount');

  function render() {
    container.innerHTML = '';
    const filtered = STRATEGIES.filter(item => {
      const matchCat = (currentFilter === 'All') || (item.category.toLowerCase() === currentFilter.toLowerCase());
      const query = currentSearch.toLowerCase().trim();
      const matchQuery = !query || 
        item.name.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query) || 
        item.rule.toLowerCase().includes(query) ||
        item.code.toLowerCase().includes(query);
      return matchCat && matchQuery;
    });

    if (countDisplay) {
      countDisplay.textContent = `${filtered.length} of 60 Strategies Showing`;
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 48px; background: #FFFFFF; border-radius: 16px; border: 1px dashed var(--border-medium);">
          <div style="font-size: 32px; margin-bottom: 8px;">🔍</div>
          <h4 style="font-size: 18px; font-weight: 800; color: var(--text-primary); margin-bottom: 4px;">No matching strategies found</h4>
          <p style="color: var(--text-muted); font-size: 14px;">Try searching for indicators like "EMA", "RSI", "VWAP", "Supertrend", or click "All" to reset filters.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(strat => {
      const card = document.createElement('div');
      card.className = 'strategy-card';
      const catClass = 'cat-' + strat.category.toLowerCase().replace(/\s+/g, '-');

      card.innerHTML = `
        <div class="strategy-card-top">
          <span class="strat-code">${strat.code}</span>
          <span class="strat-cat ${catClass}">${strat.category}</span>
        </div>
        <h4 class="strat-title">${strat.name}</h4>
        <p class="strat-desc">${strat.description}</p>
        <div class="strat-rule-box">
          <strong>RULE · </strong>${strat.rule}
        </div>
        <div class="strat-card-footer">
          <span style="font-size: 11.5px; font-weight: 700; color: #16A34A; display: flex; align-items: center; gap: 4px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Paper & Live Ready
          </span>
          <button class="btn-inspect" onclick="openStrategyModal('${strat.id}')">
            Inspect Logic →
          </button>
        </div>
      `;
      container.appendChild(card);
    });
  }

  // Filter click handlers
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentFilter = pill.getAttribute('data-filter');
      render();
    });
  });

  // Search input handler
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value;
      render();
    });
  }

  render();
}

/* ===================================================================
   3. MODAL LOGIC (Webinar Booking & Strategy Inspection)
   =================================================================== */
function initModals() {
  const regModal = document.getElementById('webinarModal');
  const stratModal = document.getElementById('strategyDetailModal');
  const regForm = document.getElementById('webinarRegForm');

  // Hero input fast-track
  const heroWhatsapp = document.getElementById('heroWhatsapp');
  const heroRegBtn = document.getElementById('heroRegBtn');

  if (heroRegBtn && heroWhatsapp) {
    heroRegBtn.addEventListener('click', () => {
      const val = heroWhatsapp.value.trim();
      openWebinarModal(val);
    });
  }

  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('regName').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const phone = document.getElementById('regPhone').value.trim();
      const exp = document.getElementById('regExp').value;

      // Generate Ticket View
      const ticketId = 'AA-' + Math.floor(100000 + Math.random() * 900000);
      const formContainer = document.getElementById('regModalBody');
      
      formContainer.innerHTML = `
        <div style="text-align: center; padding: 10px 0;">
          <div style="width: 60px; height: 60px; background: #DCFCE7; color: #16A34A; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; margin: 0 auto 16px;">
            ✓
          </div>
          <h3 style="font-family: var(--font-display); font-size: 24px; font-weight: 800; color: var(--text-primary); margin-bottom: 6px;">
            Registration Confirmed!
          </h3>
          <p style="color: var(--text-secondary); font-size: 14.5px; margin-bottom: 24px;">
            Your live pass for Friday @ 9:00 PM IST has been issued, ${name}.
          </p>

          <div class="ticket-preview">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed var(--border-medium); padding-bottom: 12px; margin-bottom: 12px;">
              <span style="font-family: var(--font-mono); font-size: 12px; font-weight: 700; color: var(--orange-700);">PASS ID: ${ticketId}</span>
              <span style="background: #22C55E; color: #FFF; font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 999px;">CONFIRMED</span>
            </div>
            <h4 style="font-size: 16px; font-weight: 800; color: var(--text-primary); margin-bottom: 6px;">
              The Quantitative & Algo Edge Masterclass
            </h4>
            <p style="font-size: 13.5px; color: var(--orange-600); font-weight: 700; margin-bottom: 12px;">
              🗓️ Upcoming Friday | 09:00 PM – 10:30 PM IST (Zoom Live)
            </p>
            <div style="font-size: 12.5px; color: var(--text-muted); text-align: left; background: #FFF; padding: 12px; border-radius: 8px;">
              • Attendee: <strong>${name}</strong><br>
              • Registered WhatsApp: <strong>${phone}</strong><br>
              • Registered Email: <strong>${email}</strong><br>
              • Host: <strong>Amam Arun (SEBI RA INH000028422)</strong>
            </div>
          </div>

          <div style="margin-top: 24px; display: flex; flex-direction: column; gap: 12px;">
            <a href="https://api.whatsapp.com/send?text=I%20have%20registered%20for%20Amam%20Arun's%20Friday%209PM%20Live%20Algo%20Masterclass!" target="_blank" class="btn-cta" style="width: 100%; justify-content: center;">
              Join WhatsApp Alert Group for Direct Zoom Link →
            </a>
            <button onclick="closeModal('webinarModal')" class="btn-secondary" style="width: 100%;">
              Done & Return to Website
            </button>
          </div>
        </div>
      `;
    });
  }
}

function openWebinarModal(prefillPhone = '') {
  const modal = document.getElementById('webinarModal');
  if (prefillPhone && document.getElementById('regPhone')) {
    document.getElementById('regPhone').value = prefillPhone;
  }
  if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

function openStrategyModal(stratId) {
  const strat = STRATEGIES.find(s => s.id === stratId);
  if (!strat) return;

  const contentBox = document.getElementById('stratModalContent');
  const catClass = 'cat-' + strat.category.toLowerCase().replace(/\s+/g, '-');

  contentBox.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
      <span class="strat-code">${strat.code}</span>
      <span class="strat-cat ${catClass}">${strat.category}</span>
    </div>
    <h3 style="font-family: var(--font-display); font-size: 24px; font-weight: 800; color: var(--text-primary); margin-bottom: 8px;">
      ${strat.name}
    </h3>
    <p style="font-size: 15px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 20px;">
      ${strat.description}
    </p>

    <div style="background: #FFF7ED; border: 1.5px solid var(--orange-300); border-radius: 12px; padding: 18px; margin-bottom: 20px;">
      <h5 style="font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: var(--orange-800); margin-bottom: 6px;">
        Mathematical & Systematic Execution Rule:
      </h5>
      <p style="font-size: 14.5px; font-weight: 600; color: #1E293B; line-height: 1.5;">
        ${strat.rule}
      </p>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 24px;">
      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 14px; border-radius: 10px;">
        <span style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748B;">Recommended Timeframe</span>
        <div style="font-size: 15px; font-weight: 800; color: #0F172A; margin-top: 4px;">15m Intraday / Daily Positional</div>
      </div>
      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 14px; border-radius: 10px;">
        <span style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748B;">Execution Type</span>
        <div style="font-size: 15px; font-weight: 800; color: #0F172A; margin-top: 4px;">Automated / 100+ Brokers API</div>
      </div>
    </div>

    <div style="text-align: center;">
      <button onclick="closeModal('strategyDetailModal'); openWebinarModal();" class="btn-cta" style="width: 100%;">
        Learn How to Automate ${strat.code} on Friday @ 9 PM →
      </button>
    </div>
  `;

  const modal = document.getElementById('strategyDetailModal');
  if (modal) modal.classList.add('active');
}

/* ===================================================================
   4. FAQ ACCORDION
   =================================================================== */
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      items.forEach(i => i.classList.remove('open'));
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });
}

/* ===================================================================
   5. MOBILE NAV
   =================================================================== */
function initMobileNav() {
  const toggle = document.querySelector('.mobile-toggle');
  const menu = document.querySelector('.nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isVisible = menu.style.display === 'flex';
      menu.style.display = isVisible ? 'none' : 'flex';
      if (!isVisible) {
        menu.style.flexDirection = 'column';
        menu.style.position = 'absolute';
        menu.style.top = '80px';
        menu.style.left = '0';
        menu.style.right = '0';
        menu.style.background = '#FFFFFF';
        menu.style.padding = '24px';
        menu.style.borderBottom = '2px solid var(--border-medium)';
        menu.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
      }
    });
  }
}

(() => {
  const STORAGE_KEY = 'bidbasket-full-app-v1';
  const CONFIG_DEFAULTS = { minBasket: 799, deliveryFee: 29, commission: 4, bidFloor: .85, bidWindow: 10, bidExtension: 5, minBids: 3, maxExtension: 1, slotCapacity: 20, minStores: 15, extraPickup: 40, freshEnabled: false };
  const PRODUCT_DATA = [
    ['atta', 'Wheat atta', 'Aashirvaad', '5 kg', 295, 268, 'kg', 5, ['Aashirvaad', 'Pillsbury', 'Fortune'], ['atta', 'aata', 'gehu', 'wheat flour', 'आटा', 'गेहूं']],
    ['rice', 'Rice', 'India Gate', '1 kg', 128, 116, 'kg', 1, ['India Gate', 'Daawat', 'Fortune'], ['rice', 'chawal', 'चावल']],
    ['milk', 'Milk', 'Amul Taaza', '1 L', 56, 52, 'L', 1, ['Amul Taaza', 'Gokul', 'Chitale'], ['milk', 'doodh', 'दूध']],
    ['sugar', 'Sugar', 'Madhur', '1 kg', 54, 49, 'kg', 1, ['Madhur', 'Trust', 'Dhampure'], ['sugar', 'cheeni', 'chini', 'shakkar', 'चीनी', 'शक्कर']],
    ['dal', 'Toor dal', 'Tata Sampann', '1 kg', 185, 170, 'kg', 1, ['Tata Sampann', 'Fortune', '24 Mantra'], ['toor dal', 'tur dal', 'arhar dal', 'dal', 'daal', 'दाल']],
    ['oil', 'Sunflower oil', 'Fortune', '1 L', 165, 151, 'L', 1, ['Fortune', 'Saffola', 'Gemini'], ['cooking oil', 'sunflower oil', 'oil', 'tel', 'तेल']],
    ['detergent', 'Surf Excel Easy Wash', 'Surf Excel', '1 kg', 140, 128, 'kg', 1, ['Surf Excel', 'Ariel', 'Tide', 'Rin'], ['detergent', 'washing powder', 'surf excel', 'surf']],
    ['tea', 'Tea', 'Tata Tea Gold', '250 g', 165, 150, 'pack', 1, ['Tata Tea Gold', 'Red Label', 'Wagh Bakri'], ['tea', 'chai', 'चाय']],
    ['bread', 'Bread', 'Britannia', '400 g', 50, 46, 'pack', 1, ['Britannia', 'Modern', 'Harvest Gold'], ['bread', 'loaf']],
    ['eggs', 'Eggs', 'Eggoz', '12 eggs', 120, 110, 'dozen', 1, ['Eggoz', 'Keggs', 'Country Delight'], ['eggs', 'egg', 'anda', 'ande', 'अंडे']],
    ['butter', 'Butter', 'Amul', '100 g', 58, 53, 'pack', 1, ['Amul', 'Mother Dairy', 'Britannia'], ['butter', 'makhan']],
    ['salt', 'Salt', 'Tata Salt', '1 kg', 28, 25, 'kg', 1, ['Tata Salt', 'Aashirvaad', 'Catch'], ['salt', 'namak', 'tata nano', 'tata namak', 'नमक', 'टाटा नैनो', 'टाटा नमक']],
    ['paneer', 'Paneer', 'Amul', '200 g', 95, 87, 'pack', 1, ['Amul', 'Gowardhan', 'Chitale'], ['paneer']],
    ['soap', 'Bath soap', 'Dove', '4 bars', 245, 224, 'pack', 1, ['Dove', 'Lux', 'Dettol'], ['soap', 'bathing soap']],
    ['toothpaste', 'Toothpaste', 'Colgate', '150 g', 105, 96, 'pack', 1, ['Colgate', 'Pepsodent', 'Sensodyne'], ['toothpaste', 'tooth paste']],
    ['biscuits', 'Biscuits', 'Parle-G', '800 g', 90, 82, 'pack', 1, ['Parle-G', 'Good Day', 'Marie Gold'], ['biscuit', 'biscuits', 'parle-g', 'parle g']]
  ].map(([id, name, brand, pack, mrp, benchmark, unit, packAmount, brands, aliases]) => ({ id, name, brand, pack, mrp, benchmark, unit, packAmount, brands, aliases }));
  const PRODUCT_BY_ID = Object.fromEntries(PRODUCT_DATA.map(product => [product.id, product]));
  const STORE_NAMES = [
    'Shree Ganesh Kirana', 'Patil Provision Stores', 'FreshMart Mini', 'Om Sai General Store',
    'Joshi Super Market', 'Mahalaxmi Kirana', 'Kothrud Daily Needs', 'Siddhi Vinayak Stores',
    'New India Provision', 'Vijay Traders', 'Krishna Super Shop', 'Sai Krupa General',
    'Shivneri Daily Mart', 'Dhanlaxmi Kirana', 'Morya Stores', 'Prakash Provision',
    'Annapurna General Store', 'Samarth Mini Market'
  ];
  const STORES = STORE_NAMES.map((name, index) => ({
    id: `KT-${String(index + 1).padStart(3, '0')}`, name, active: true,
    distance: (0.5 + index * .13).toFixed(1), factor: [.96, .94, .985, .97, .92, .98][index % 6],
    score: 86 + (index * 7 % 15), fillRate: 90 + (index * 5 % 10), onTime: 89 + (index * 3 % 11),
    suspended: false, serviceRadius: 3, autoBid: false, missing: index % 4 === 2 ? ['paneer', 'toothpaste'] : index % 5 === 3 ? ['eggs'] : []
  }));
  const ICON = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/></svg>',
    orders: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12v18H6zM9 7h6M9 11h6M9 15h4"/></svg>',
    savings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m3 17 6-6 4 4 8-9M15 6h6v6"/></svg>',
    account: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M5 21a7 7 0 0 1 14 0"/></svg>',
    store: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10h18l-1.5-6h-15L3 10Z"/><path d="M5 10v10h14V10M9 20v-6h6v6"/></svg>',
    mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3m-4 0h8"/></svg>',
    rider: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M6 17l4-8h4l4 8M10 9H7M13 9l-2 4h5"/></svg>',
    ops: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="5" rx="1"/><rect x="13" y="10" width="8" height="11" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>'
  };
  const SAMPLE_TEXT = 'Aashirvaad atta paanch kilo, do litre Amul doodh, ek kilo toor dal koi bhi brand, Tata namak, Fortune oil ek litre, Surf Excel ek kilo aur Parle-G';
  const SEED_BASKET = [
    { pid: 'atta', qty: 1, brand: 'Aashirvaad', locked: true },
    { pid: 'milk', qty: 2, brand: 'Amul Taaza', locked: true },
    { pid: 'dal', qty: 1, brand: null, locked: false },
    { pid: 'salt', qty: 1, brand: 'Tata Salt', locked: true },
    { pid: 'oil', qty: 1, brand: 'Fortune', locked: true },
    { pid: 'detergent', qty: 1, brand: 'Surf Excel', locked: true },
    { pid: 'biscuits', qty: 1, brand: 'Parle-G', locked: true }
  ];
  const SAMPLE_BASKET_TOTAL = 1015;
  const root = document.createElement('div');
  root.id = 'bb-root';
  document.body.replaceChildren(root);
  let state = loadState();
  let voiceRecognition = null;
  let pageToastTimer = 0;

  function initialState() {
    return {
      session: null, screen: 'signin', selectedRole: null, customerTab: 'home', retailerTab: 'requests',
      language: 'mix', phone: '9822041210', otp: '123456', profile: { pincode: '', building: 'Karve Road', flat: 'B-703', gate: '', landmark: '' },
      voiceText: '', basket: [], unknown: [], activeOrderId: null, selectedBidId: null, selectedSlot: null,
      paymentMethod: 'UPI app', orders: [], retailerId: STORES[0].id, retailerRegistered: false,
      priceList: {}, autoBid: true, draftBid: null, packChecks: {}, deliveries: [], config: { ...CONFIG_DEFAULTS },
      opsTab: 'auctions', disputeActions: {}, ratings: {}
    };
  }
  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (!saved) return initialState();
      const clean = { ...initialState(), ...saved, config: { ...CONFIG_DEFAULTS, ...(saved.config || {}) } };
      clean.orders = Array.isArray(saved.orders) ? saved.orders : [];
      clean.orders.forEach(order => (order.bids || []).forEach(bid => { if (bid.isBoli) bid.label = 'BachatBazaar Price'; }));
      clean.basket = Array.isArray(saved.basket) ? saved.basket : [];
      return clean;
    } catch { return initialState(); }
  }
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { toast('Could not save demo data in this browser.'); }
  }
  function esc(value) { return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]); }
  function money(value) { return '₹' + Math.round(Number(value) || 0).toLocaleString('en-IN'); }
  function round(value) { return Math.round((Number(value) || 0) * 100) / 100; }
  function toast(message) {
    let element = document.getElementById('bb-toast');
    if (!element) { element = document.createElement('div'); element.id = 'bb-toast'; element.className = 'bb-toast'; element.setAttribute('role', 'status'); root.append(element); }
    element.textContent = message;
    clearTimeout(pageToastTimer);
    pageToastTimer = setTimeout(() => element.remove(), 2800);
  }
  function product(pid) { return PRODUCT_BY_ID[pid] || PRODUCT_DATA[0]; }
  function store(storeId) { return STORES.find(item => item.id === storeId) || STORES[0]; }
  function activeOrder() { return state.orders.find(order => order.id === state.activeOrderId) || null; }
  function basketMrp(basket = state.basket) { return round(basket.reduce((sum, item) => sum + product(item.pid).mrp * item.qty, 0)); }
  function orderById(id) { return state.orders.find(order => order.id === id); }
  function roleName() { return ({ customer: 'Ananya Kulkarni', retailer: store(state.retailerId).name, rider: 'Kunal Jadhav', ops: 'BachatBazaar Operations' })[state.session] || ''; }
  function timeLeft(order) { return Math.max(0, Math.ceil((order.deadline - Date.now()) / 1000)); }
  function windowMinutesForSlot(hours) { return ({ 3: 5, 6: 8, 9: 10, 12: 15 })[hours] || state.config.bidWindow; }
  function countdown(order) { const secs = timeLeft(order); return `${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`; }
  function lineAmount(item, bidLine = null) { return round((bidLine?.available ? bidLine.price : 0) * item.qty); }
  function mRPLine(item) { return round(product(item.pid).mrp * item.qty); }
  function grandTotal(order, bid, withSwap = true) { return round(bid.lines.reduce((sum, line, index) => sum + (line.available && (withSwap || line.brand === order.items[index].brand || !order.items[index].locked) ? line.price * order.items[index].qty : 0), 0)); }
  function bidStats(order, bid) {
    let covered = 0, substitutes = 0, exact = 0, exactTotal = 0, swapTotal = 0, missingPenalty = 0;
      bid.lines.forEach((line, index) => {
      const item = order.items[index];
      if (line.available) {
        covered++;
          swapTotal += line.price * item.qty;
        if (item.locked && line.brand !== item.brand) substitutes++;
        else { exact++; exactTotal += line.price * item.qty; }
      } else missingPenalty += product(item.pid).benchmark * item.qty * 1.1;
    });
    const effectiveCost = swapTotal + missingPenalty;
    const mrp = order.items.reduce((sum, item) => sum + product(item.pid).mrp * item.qty, 0);
    return { covered, substitutes, exact, exactTotal: round(exactTotal), swapTotal: round(swapTotal), effectiveCost: round(effectiveCost), save: round(mrp - swapTotal), missingPenalty: round(missingPenalty) };
  }
  function retailerAllowedBrands(item) { return product(item.pid).brands; }
  function productMrp(pid, brand) {
    const base = product(pid);
    const offset = Math.max(0, base.brands.indexOf(brand));
    const discount = [0, .05, .09, .13][Math.min(offset, 3)];
    return Math.max(1, Math.round(base.mrp * (1 - discount)));
  }
  function retailerPrice(pid, brand, storeId = state.retailerId) {
    const key = `${storeId}:${pid}:${brand}`;
    const saved = state.priceList[key];
    if (Number.isFinite(saved)) return saved;
    const branch = store(storeId);
    return Math.max(1, Math.round(productMrp(pid, brand) * (branch.factor + (((pid.length + brand.length) % 5) - 2) / 100)));
  }
  function createBid(order, storeId, options = {}) {
    const branch = store(storeId);
    const lines = order.items.map(item => {
      if (!options.forceAvailable && (branch.missing.includes(item.pid) || (item.pid === 'paneer' && branch.id.endsWith('003')))) return { available: false, brand: null, price: 0 };
      const choices = retailerAllowedBrands(item);
      const exactBrand = choices.includes(item.brand) ? item.brand : null;
      const alternative = choices[(STORES.indexOf(branch) + item.pid.length) % choices.length];
      const brand = exactBrand || alternative;
      const mrp = productMrp(item.pid, brand);
      const benchmark = Math.round(product(item.pid).benchmark * mrp / product(item.pid).mrp);
      const factor = options.priceFactor ?? branch.factor;
      const price = Math.min(mrp, Math.max(Math.round(benchmark * state.config.bidFloor), Math.round(mrp * factor)));
      return { available: true, brand, price, alternative: !!(item.locked && brand !== item.brand) };
    });
    return { id: `bid-${Date.now()}-${Math.floor(Math.random() * 9999)}`, storeId, label: options.label || branch.name, isBoli: !!options.isBoli, createdAt: Date.now(), lines, score: options.isBoli ? 100 : branch.score };
  }
  function createBoliBid(order) {
    return { id: `bid-boli-${order.id}`, storeId: null, label: 'BachatBazaar Price', isBoli: true, createdAt: Date.now(), score: 100, lines: order.items.map(item => ({ available: true, brand: item.brand || product(item.pid).brand, price: Math.round(product(item.pid).benchmark), alternative: false })) };
  }
  function sortedBids(order) {
    const bids = [...order.bids];
    if (state.sortBy === 'price') return bids.sort((left, right) => bidStats(order, left).swapTotal - bidStats(order, right).swapTotal);
    if (state.sortBy === 'score') return bids.sort((left, right) => right.score - left.score || bidStats(order, left).effectiveCost - bidStats(order, right).effectiveCost);
    return bids.sort((left, right) => {
      const a = bidStats(order, left), b = bidStats(order, right);
      return a.effectiveCost - b.effectiveCost || right.score - left.score || left.label.localeCompare(right.label);
    });
  }
  function buildSampleBasket() {
    state.basket = SEED_BASKET.map(item => ({ ...item }));
    state.unknown = [];
    state.voiceText = SAMPLE_TEXT;
    state.screen = 'review';
    save(); render();
  }
  function convertParsedItem(parsed) {
    const found = PRODUCT_BY_ID[parsed.id];
    if (!found) return null;
    let requestedAmount = Number(parsed.quantity) || 1;
    if (parsed.unit === 'g' && found.unit === 'kg') requestedAmount /= 1000;
    if (parsed.unit === 'ml' && found.unit === 'L') requestedAmount /= 1000;
    const qty = found.unit === parsed.unit || (found.unit === 'pack' && parsed.unit === 'pack') || (found.unit === 'dozen' && parsed.unit === 'dozen') ? requestedAmount / found.packAmount : requestedAmount / found.packAmount;
    return { pid: found.id, qty: Math.max(.1, round(qty)), brand: parsed.brand || null, locked: !!parsed.brand };
  }
  function parseOrderText(text) {
    const parsed = typeof parseHinglish === 'function' ? parseHinglish(text) : { items: [], unknown: [text] };
    const items = [...parsed.items];
    const unknown = [];
    for (const phrase of parsed.unknown || []) {
      const prefix = /surf\s*excel|\bariel\b|\btide\b|\brin\b/i.test(phrase) ? 'detergent' : /parle[\s-]*g|\bbiscuit/i.test(phrase) ? 'biscuit' : '';
      if (!prefix) { unknown.push(phrase); continue; }
      const resolved = parseHinglish(`${prefix} ${phrase}`);
      if (resolved.items.length) items.push(...resolved.items);
      else unknown.push(phrase);
    }
    return { items, unknown };
  }
  function parseVoice() {
    const parsed = parseOrderText(state.voiceText);
    const converted = parsed.items.map(convertParsedItem).filter(Boolean);
    for (const item of converted) {
      const existing = state.basket.find(line => line.pid === item.pid && line.brand === item.brand);
      if (existing) existing.qty = round(existing.qty + item.qty); else state.basket.push(item);
    }
    state.unknown = parsed.unknown;
    if (!converted.length && !state.unknown.length) toast('Name an item such as atta, doodh, cheeni, or namak.');
    state.screen = 'review';
    save(); render();
  }
  function normalizeNewItem(phrase) {
    const before = state.basket.length;
    const parsed = parseOrderText(phrase);
    parsed.items.map(convertParsedItem).filter(Boolean).forEach(item => state.basket.push(item));
    state.unknown.splice(0, 1);
    if (state.basket.length === before) toast('Could not match that phrase to a catalogue item.');
    save(); render();
  }
  function contentAmount(pid) { return product(pid).packAmount; }
  function displayQuantity(item) {
    const sku = product(item.pid), amount = round(item.qty * sku.packAmount);
    if (sku.unit === 'kg') return `${amount < 1 ? round(amount * 1000) + ' g' : amount + ' kg'}`;
    if (sku.unit === 'L') return `${amount < 1 ? round(amount * 1000) + ' ml' : amount + ' L'}`;
    if (sku.unit === 'dozen') return `${amount} dozen`;
    return `${round(item.qty)} × ${sku.pack}`;
  }
  function lineName(item) { const sku = product(item.pid); return `${item.brand || sku.brand} ${sku.name}${sku.pack ? ' ' + sku.pack : ''}`; }
  function screenHead(code, title, subtitle, badge = '') {
    return `<div class="bb-head"><div><div class="bb-kicker">${code}</div><h1>${title}</h1><p>${subtitle}</p></div>${badge}</div>`;
  }
  function card(title, body, badge = '') {
    return `<section class="bb-card"><div class="bb-card-head"><h2>${title}</h2>${badge}</div><div class="bb-card-body">${body}</div></section>`;
  }
  function stat(label, value, detail) { return `<div class="bb-stat"><small>${label}</small><strong>${value}</strong><small>${detail}</small></div>`; }
  function badge(text, tone = '') { return `<span class="bb-badge ${tone}">${text}</span>`; }
  function row(label, value, detail = '') { return `<div class="bb-row"><div class="bb-row-main"><strong>${label}</strong>${detail ? `<small>${detail}</small>` : ''}</div><div class="bb-row-end"><strong>${value}</strong></div></div>`; }
  function navButton(key, label, active, icon) { return `<button type="button" data-nav="${key}" aria-current="${active ? 'page' : 'false'}"><span class="bb-nav-icon">${ICON[icon]}</span>${label}</button>`; }
  function renderAuth() {
    if (state.selectedRole) return renderSignIn();
    return `<section class="bb-auth"><div class="bb-auth-head"><div class="bb-kicker">Local interactive demo</div><h1>Say your list.<br><span>Stores bid.</span></h1><p>Choose a role to enter the BachatBazaar prototype. OTP, payments, bids, delivery events, and data are simulated locally.</p></div><div class="bb-role-grid">${[
      ['customer', 'Customer', 'Ananya Kulkarni', ICON.account], ['retailer', 'Retailer', 'Shree Ganesh Kirana', ICON.store], ['rider', 'Rider', 'Kunal Jadhav', ICON.rider], ['ops', 'Ops console', 'BachatBazaar Operations', ICON.ops]
    ].map(([role, label, person, icon]) => `<button type="button" class="bb-role" data-role="${role}"><span class="bb-role-icon">${icon}</span><span><strong>${label}</strong><small>${person}</small></span></button>`).join('')}</div><p class="bb-login-hint" style="margin-top:18px;color:var(--bb-muted);font-size:12px">Seed zone: Kothrud, Pune · PIN 411038 · Demo OTP: 123456</p></section>`;
  }
  function renderSignIn() {
    const role = state.selectedRole;
    const heading = ({ customer: 'Sign in to BachatBazaar', retailer: 'Retailer sign in', rider: 'Rider sign in', ops: 'Ops console sign in' })[role];
    return `<section class="bb-auth"><button class="bb-link" type="button" data-action="back-roles">← All roles</button><div class="bb-auth-head" style="margin-top:12px"><div class="bb-kicker">01 · Sign in</div><h1>${heading}</h1><p>Demo authentication only. No code is sent to a phone.</p></div><form class="bb-card bb-card-body" data-form="signin"><div class="bb-form"><div class="bb-field"><label for="signin-phone">Mobile number</label><input id="signin-phone" name="phone" type="tel" value="${esc(state.phone)}" autocomplete="tel" required></div><div class="bb-field"><label for="signin-otp">6-digit OTP</label><input id="signin-otp" name="otp" inputmode="numeric" maxlength="6" value="123456" required><small>Demo code: 123456</small></div><button class="bb-button primary wide" type="submit">Verify and continue</button></div></form></section>`;
  }
  function renderAddress() {
    return `${screenHead('02 · Customer app', 'Delivery address', 'Your pincode decides which stores can bid.', badge('Private from stores'))}${card('Where should we deliver?', `<form class="bb-form" data-form="address"><div class="bb-field"><label>PIN code</label><input name="pincode" inputmode="numeric" maxlength="6" value="${esc(state.profile.pincode)}" required></div><div class="bb-note">18 active stores bid in Kothrud. Stores never see your name, phone, or address.</div><div class="bb-field"><label>Society or building</label><input name="building" value="${esc(state.profile.building)}" required></div><div class="bb-form-grid"><div class="bb-field"><label>Flat / house no.</label><input name="flat" value="${esc(state.profile.flat)}" required></div><div class="bb-field"><label>Gate code</label><input name="gate" value="${esc(state.profile.gate)}" placeholder="Optional"></div></div><div class="bb-field"><label>Landmark</label><input name="landmark" value="${esc(state.profile.landmark)}" placeholder="Optional"></div><button class="bb-button primary wide" type="submit">Save address</button></form>`)}`;
  }
  function customerHome() {
    const recent = [...state.orders].sort((a, b) => b.createdAt - a.createdAt)[0];
    const sum = state.config;
    return `${screenHead('03 · Customer app', 'What do you need?', 'Say your list, local stores compete for it.', badge('18 stores nearby'))}<div class="bb-voice"><div class="bb-voice-head"><div><h2>${state.language === 'hi' ? 'आपको क्या चाहिए?' : state.language === 'en' ? 'What do you need?' : 'Aapko kya chahiye?'}</h2><p>${state.language === 'hi' ? 'हिंदी, अंग्रेज़ी या हिंग्लिश में बोलें।' : 'Speak in Hindi, English, or Hinglish.'}</p></div>${languageControl()}</div><div class="bb-voice-entry"><button class="bb-mic" type="button" data-action="open-voice" aria-label="Start voice order">${ICON.mic}</button><textarea id="home-voice" placeholder="Aadha kilo atta, ek litre doodh...">${esc(state.voiceText)}</textarea></div><div class="bb-voice-actions"><button class="bb-link" type="button" data-action="sample-text">Try Hinglish sample</button><button class="bb-button gold" type="button" data-action="home-parse">Review list</button></div></div><div class="bb-grid three" style="margin-top:13px">${stat('Minimum basket', money(sum.minBasket), 'Estimated at MRP')}${stat('Delivery', money(sum.deliveryFee), 'Flat fee')}${stat('Fresh category', sum.freshEnabled ? 'On' : 'Off', 'Packaged FMCG at launch')}</div>${recent ? card('Continue your last order', `${row(recent.id, recent.status === 'delivered' ? 'Delivered' : money(orderPayable(recent)), `${recent.items.length} items · ${new Date(recent.createdAt).toLocaleDateString('en-IN')}`)}<button class="bb-button wide" type="button" data-action="resume-order" data-id="${recent.id}">View order</button>`) : ''}`;
  }
  function languageControl() {
    return `<div class="bb-langs" role="group" aria-label="Voice language"><button type="button" data-language="en" aria-pressed="${state.language === 'en'}">English</button><button type="button" data-language="hi" aria-pressed="${state.language === 'hi'}">हिंदी</button><button type="button" data-language="mix" aria-pressed="${state.language === 'mix'}">Hindi + English</button></div>`;
  }
  function customerVoice() {
    return `${screenHead('04 · Voice order', 'Say it naturally', 'Items stay editable until you confirm.', languageControl())}<div class="bb-voice"><div class="bb-voice-head"><div><h2>${state.language === 'hi' ? 'सूची बोलें' : 'Listening in Hindi + English'}</h2><p>Tap the mic, or type your basket below.</p></div></div><div class="bb-voice-entry"><button class="bb-mic" type="button" data-action="toggle-voice" aria-label="Start voice input">${ICON.mic}</button><textarea id="voice-input" placeholder="${state.language === 'hi' ? 'जैसे: दो किलो आटा, आधा किलो चीनी' : 'Try: do kilo aadha atta, ek litre doodh, tata nano'}">${esc(state.voiceText)}</textarea></div><div class="bb-voice-actions"><button class="bb-link" type="button" data-action="sample-text">Use mockup Hinglish sample</button><button class="bb-button gold" type="button" data-action="parse-voice">Add items</button></div></div>${state.unknown.length ? card('Not recognised', state.unknown.map((phrase, index) => `<div class="bb-row"><input class="bb-input" id="unknown-${index}" value="${esc(phrase)}" aria-label="Unrecognised phrase"><div class="bb-row-end"><button class="bb-button small" data-action="resolve-unknown" data-index="${index}">Resolve</button><button class="bb-button small" data-action="remove-unknown" data-index="${index}">Remove</button></div></div>`).join('')) : ''}${state.basket.length ? `<div class="bb-inline-actions" style="margin-top:13px"><button class="bb-button primary" type="button" data-action="review-basket">Review basket · ${state.basket.length}</button></div>` : ''}`;
  }
  function basketItem(item, index, editable = true) {
    const sku = product(item.pid), total = sku.mrp * item.qty;
    const brandChoices = sku.brands.map(brand => `<option value="${esc(brand)}" ${brand === item.brand ? 'selected' : ''}>${esc(brand)}</option>`).join('');
    return `<div class="bb-item"><div><div class="bb-item-title">${esc(lineName(item))}</div><div class="bb-item-sub">${esc(displayQuantity(item))} · ${money(sku.mrp)} / ${esc(sku.pack)}${item.locked ? ' · Brand locked' : ' · Any brand'}</div>${editable ? `<div style="display:flex;gap:8px;align-items:center;margin-top:6px"><select data-brand-select="${index}" aria-label="Brand for ${esc(sku.name)}">${brandChoices}</select><button class="bb-button small" type="button" data-action="toggle-lock" data-index="${index}">${item.locked ? 'Unlock brand' : 'Lock brand'}</button></div>` : ''}</div>${editable ? `<div class="bb-row-end"><div class="bb-stepper"><button type="button" data-action="qty-down" data-index="${index}" aria-label="Decrease quantity">−</button><span>${round(item.qty)}</span><button type="button" data-action="qty-up" data-index="${index}" aria-label="Increase quantity">+</button></div><button type="button" class="bb-link" data-action="remove-item" data-index="${index}" aria-label="Remove ${esc(sku.name)}">Remove</button></div>` : `<strong>${money(total)}</strong>`}<span class="bb-item-sub" style="grid-column:1/-1">${money(total)} at MRP</span></div>`;
  }
  function reviewBasket() {
    const total = basketMrp();
    const missing = Math.max(0, state.config.minBasket - total);
    const rows = state.basket.map((item, index) => basketItem(item, index)).join('');
    return `${screenHead('05 · Review basket', 'Check your list', `${state.basket.length} items · MRP total ${money(total)}`, badge(`${state.basket.length} items`))}${card('Your items', `${rows || '<div class="bb-empty">Add items by voice or typing.</div>'}<div class="bb-inline-actions" style="margin-top:12px"><button class="bb-button" type="button" data-action="open-voice">Add by voice or typing</button><button class="bb-button" type="button" data-action="sample-basket">Load 7-item sample · ₹1,015</button></div>`)}${state.unknown.length ? card('Confirm unclear phrases', state.unknown.map((phrase, index) => `<div class="bb-row"><span>${esc(phrase)}</span><div class="bb-row-end"><button class="bb-button small" data-action="resolve-unknown" data-index="${index}">Edit</button><button class="bb-button small" data-action="remove-unknown" data-index="${index}">Remove</button></div></div>`).join('')) : ''}<div class="bb-card" style="margin-top:12px"><div class="bb-card-body"><div class="bb-bill-row"><span>Estimated at MRP</span><strong>${money(total)}</strong></div><div class="bb-bill-row"><span>Minimum basket</span><span>${money(state.config.minBasket)}</span></div>${missing ? `<div class="bb-note" style="margin-top:9px">Add ${money(missing)} more to start bidding.</div>` : '<div class="bb-note" style="margin-top:9px">Basket minimum reached. No item is sent until you start bidding.</div>'}<button class="bb-button primary wide" style="margin-top:12px" type="button" data-action="go-slot" ${missing || !state.basket.length ? 'disabled' : ''}>Choose delivery slot</button></div></div>`;
  }
  function orderSlots() {
    const capacity = state.config.slotCapacity;
    const now = Date.now();
    const options = [3, 6, 9, 12].map(hours => {
      const count = state.orders.filter(order => order.slotHours === hours && ['confirmed', 'packed', 'picked-up', 'at-door'].includes(order.status)).length;
      const full = count >= capacity;
      const selected = state.selectedSlot === hours;
      return `<button class="bb-card" type="button" data-slot="${hours}" aria-pressed="${selected}" ${full ? 'disabled' : ''} style="padding:13px;text-align:left;border:${selected ? '2px solid var(--bb-green)' : '1px solid var(--bb-line)'};background:${selected ? 'var(--bb-green-soft)' : 'var(--bb-paper)'}"><strong>Within ${hours} hours</strong><small style="display:block;color:var(--bb-muted);margin-top:4px">By ${new Date(now + hours * 3600000).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })} · ${count}/${capacity} orders</small><span style="display:block;margin-top:7px">${full ? 'Full' : 'Delivery ' + money(state.config.deliveryFee)}</span></button>`;
    }).join('');
    return `${screenHead('06 · Delivery slot', 'When do you need it?', 'Bidding window is 5–15 minutes by slot.', badge('Kothrud · 411038'))}${card('Pick an arrival time', `<div class="bb-grid">${options}</div><div class="bb-bill" style="margin-top:12px"><div class="bb-bill-row"><span>Your basket</span><strong>${state.basket.length} items · ${money(basketMrp())} MRP</strong></div><div class="bb-bill-row"><span>Stores in your area</span><span>18 can bid</span></div><div class="bb-bill-row"><span>Delivery</span><span>${money(state.config.deliveryFee)}</span></div></div><button class="bb-button primary wide" style="margin-top:12px" type="button" data-action="start-bidding" ${state.selectedSlot ? '' : 'disabled'}>Start bidding</button>`)}`;
  }
  function newOrder() {
    if (basketMrp() < state.config.minBasket) { state.screen = 'review'; render(); toast(`Basket must reach ${money(state.config.minBasket)} at MRP.`); return; }
    if (!state.selectedSlot) { toast('Choose a delivery slot first.'); return; }
    const id = `BB-${String(2700 + Math.floor(Math.random() * 7000))}`;
    const windowMinutes = windowMinutesForSlot(state.selectedSlot);
    const order = { id, createdAt: Date.now(), deadline: Date.now() + windowMinutes * 60000, windowMinutes, slotHours: state.selectedSlot, status: 'bidding', items: state.basket.map(item => ({ ...item })), bids: [], extensionUsed: false, payment: null, winnerBidId: null, pendingBidId: null, packed: false, pickupChecks: [], rejected: [], rating: null, timeline: [{ key: 'created', at: Date.now() }] };
    order.bids.push(createBoliBid(order));
    order.bids.push(createBid(order, STORES[1].id, { priceFactor: .94 }));
    order.bids.push(createBid(order, STORES[2].id, { priceFactor: .985 }));
    state.orders.unshift(order);
    state.activeOrderId = id;
    state.basket = [];
    state.unknown = [];
    state.screen = 'bidding';
    save(); render();
  }
  function biddingScreen() {
    const order = activeOrder();
    if (!order) return `${screenHead('07 · Live auction', 'No active basket', 'Start with a new list.')}${emptyBox('Your orders will appear here after bidding starts.')}`;
    const values = sortedBids(order).map(bid => bidStats(order, bid));
    const lowest = values.length ? Math.min(...values.map(value => value.swapTotal)) : 0;
    const maxBid = Math.max(1, (order.windowMinutes || state.config.bidWindow) * 60);
    const progress = Math.max(0, Math.min(100, Math.round(timeLeft(order) / maxBid * 100)));
    return `${screenHead('07 · Bids coming in', 'Stores are bidding', `${order.items.length} items · ${countBids(order)} bids received`, badge(order.status === 'bidding' ? `<span data-auction-clock>${countdown(order)} left</span>` : 'Closed', 'gold'))}<div class="bb-card" style="padding:15px;background:var(--bb-green-dark);color:#f5f6f1"><div class="bb-bill-row"><span>TIME LEFT</span><span>${order.slotHours}-hour slot</span></div><strong data-auction-time style="display:block;font:700 44px/1.1 'Bricolage Grotesque',sans-serif;margin:9px 0">${order.status === 'bidding' ? countdown(order) : 'Closed'}</strong><div class="bb-progress"><span data-auction-progress style="width:${progress}%"></span></div><div class="bb-bill-row" style="margin-top:10px"><span>Lowest so far</span><strong>${money(lowest)}</strong></div></div><p style="margin:13px 0;font-weight:700">${order.bids.length} bids in · ${Math.max(0, 18 - order.bids.length + 1)} stores still pricing</p><div class="bb-stack">${sortedBids(order).map(bid => { const stats = bidStats(order, bid); return `<button class="bb-card" type="button" data-action="open-bid" data-id="${bid.id}" style="padding:12px;text-align:left"><div class="bb-bill-row"><strong>${esc(bid.label)}</strong><strong>${money(stats.swapTotal)}</strong></div><small style="color:var(--bb-muted)">${stats.covered} of ${order.items.length} items · ${stats.substitutes} swaps</small></button>`; }).join('')}</div><div class="bb-inline-actions" style="margin-top:14px"><button class="bb-button primary" type="button" data-action="compare-bids">Compare ${order.bids.length} bids now</button><button class="bb-button" type="button" data-action="low-response">Preview too-few-bids path</button></div>`;
  }
  function countBids(order) { return order.bids.length; }
  function compareBids() {
    const order = activeOrder();
    if (!order) return '';
    const bids = sortedBids(order);
    return `${screenHead('08 · Compare bids', `${bids.length} bids for your basket`, `${order.items.length} items · MRP ${money(order.items.reduce((total, item) => total + product(item.pid).mrp * item.qty, 0))}`, badge('Ranked by value + reliability'))}<div class="bb-tabs" role="group"><button type="button" data-sort="best" aria-pressed="true">Best value</button><button type="button" data-sort="price" aria-pressed="false">Lowest price</button><button type="button" data-sort="score" aria-pressed="false">Most reliable</button></div><div class="bb-stack">${bids.map((bid, index) => { const stats = bidStats(order, bid); const shop = bid.isBoli ? null : store(bid.storeId); return `<article class="bb-bid ${index === 0 ? 'best' : ''}"><div class="bb-bid-top"><div><h3>${esc(bid.label)}</h3><small style="color:var(--bb-muted)">${shop ? `${shop.distance} km · ${shop.score}% reliable` : 'Benchmark fallback bid'}</small></div><div class="bb-bid-total">${money(stats.swapTotal)}</div></div><div class="bb-bid-facts">${badge(`${stats.covered} of ${order.items.length} items`, stats.covered === order.items.length ? '' : 'red')}${stats.substitutes ? badge(`${stats.substitutes} swaps`, 'gold') : ''}${badge(`Save ${money(stats.save)} vs MRP`)}</div><div class="bb-grid"><div class="bb-stat"><small>Exact match</small><strong>${money(stats.exactTotal)}</strong></div><div class="bb-stat"><small>With swaps</small><strong>${money(stats.swapTotal)}</strong></div></div><p style="margin:8px 0;color:var(--bb-green);font-size:12px;font-weight:700">You save ${money(stats.save)} on MRP</p><button class="bb-button primary wide" style="margin-top:8px" type="button" data-action="open-bid" data-id="${bid.id}">View bid details</button></article>`; }).join('')}</div>`;
  }
  function bidDetail() {
    const order = activeOrder(), bid = order?.bids.find(item => item.id === state.selectedBidId);
    if (!order || !bid) return `${screenHead('09 · Bid detail', 'Bid is no longer available', '')}`;
    const stats = bidStats(order, bid);
    const rows = order.items.map((item, index) => {
      const line = bid.lines[index], sku = product(item.pid), exact = !item.locked || line.brand === item.brand;
      const swap = line.available && !exact ? `<div class="bb-note" style="margin-top:5px">Suggested swap: ${esc(line.brand)} · ${money(line.price)} / ${sku.pack}</div>` : '';
      return `<div class="bb-item"><div><div class="bb-item-title">${esc(lineName(item))}</div><div class="bb-item-sub">${displayQuantity(item)} · ${line.available ? esc(line.brand) : 'Not available'}</div>${swap}</div><div class="bb-row-end"><strong>${line.available ? money(line.price * item.qty) : '—'}</strong>${line.available && !exact ? `<label style="display:flex;align-items:center;gap:4px;font-size:11px"><input class="bb-check" type="checkbox" data-swap-index="${index}" ${order.acceptSwaps !== false ? 'checked' : ''}>Take swap</label>` : ''}</div><span class="bb-item-sub">${line.available ? `${money(line.price / Math.max(.01, sku.packAmount))} / ${sku.unit === 'pack' ? 'pack' : sku.unit}` : 'Missing line'}</span></div>`;
    }).join('');
    const withSwap = order.acceptSwaps !== false;
    const total = withSwap ? stats.swapTotal : stats.exactTotal;
    return `${screenHead('09 · Bid detail', bid.label, 'Line prices, requested brands, and available swaps.', badge(`${stats.covered}/${order.items.length} items`))}${card('Itemized bid', `${rows}<div class="bb-bill" style="margin-top:12px"><div class="bb-bill-row"><span>Exact total</span><strong>${money(stats.exactTotal)}</strong></div><div class="bb-bill-row"><span>With swaps</span><strong>${money(stats.swapTotal)}</strong></div><div class="bb-bill-row"><span>Saving vs MRP</span><strong>${money(stats.save)}</strong></div><div class="bb-bill-row total"><span>Your total</span><strong>${money(total)}</strong></div></div><div class="bb-inline-actions" style="margin-top:12px"><button class="bb-button" type="button" data-action="accept-bid" data-swaps="false">Accept exact · ${money(stats.exactTotal)}</button><button class="bb-button primary" type="button" data-action="accept-bid" data-swaps="true">Accept with swaps · ${money(stats.swapTotal)}</button></div>`)}`;
  }
  function orderPayable(order) {
    const bid = order?.bids.find(item => item.id === (order.pendingBidId || order.winnerBidId));
    return bid ? grandTotal(order, bid, order.acceptSwaps !== false) + state.config.deliveryFee : 0;
  }
  function refundForLine(order, index) {
    const bid = order.bids.find(item => item.id === order.winnerBidId);
    return Math.max(0, (bid?.lines[index]?.price || 0) * order.items[index].qty);
  }
  function payoutAfterAdjustments(order, bid) {
    const netBeforeCommission = bidStats(order, bid).swapTotal - (order.payment?.refund || 0);
    return Math.max(0, netBeforeCommission) * (1 - state.config.commission / 100);
  }
  function checkout() {
    const order = activeOrder(), bid = order?.bids.find(item => item.id === (order.pendingBidId || order.winnerBidId));
    if (!order || !bid) return '';
    const selectedTotal = grandTotal(order, bid, order.acceptSwaps !== false);
    return `${screenHead('10 · Checkout', 'Pay and confirm', 'Payment is held until delivery is confirmed.', badge(`${order.slotHours}-hour slot`))}${card('Arrival and bill', `<div class="bb-bill"><div class="bb-bill-row"><span>Arrives by</span><strong>${new Date(Date.now() + order.slotHours * 3600000).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}</strong></div><div class="bb-bill-row"><span>${order.items.length} items from ${esc(bid.label)}</span><strong>${money(selectedTotal)}</strong></div><div class="bb-bill-row"><span>Delivery fee</span><span>${money(state.config.deliveryFee)}</span></div><div class="bb-bill-row total"><span>To pay</span><strong>${money(selectedTotal + state.config.deliveryFee)}</strong></div><div class="bb-bill-row"><span>Below MRP on items</span><strong>${money(order.items.reduce((sum, item) => sum + product(item.pid).mrp * item.qty, 0) - selectedTotal)}</strong></div></div><div style="margin-top:13px;font-weight:700">Pay with</div><div class="bb-stack" style="margin-top:7px">${['UPI app', 'Debit or credit card', 'BachatBazaar wallet'].map(method => `<label class="bb-row" style="cursor:pointer"><span><input class="bb-check" type="radio" name="payment-method" value="${method}" ${state.paymentMethod === method ? 'checked' : ''}> ${method}</span><small>${method === 'UPI app' ? 'GPay, PhonePe, Paytm · mock' : method === 'BachatBazaar wallet' ? money(80) + ' balance' : 'Mock payment'}</small></label>`).join('')}</div><button class="bb-button primary wide" style="margin-top:12px" type="button" data-action="pay-order">Pay ${money(selectedTotal + state.config.deliveryFee)}</button>`)}`;
  }
  function trackOrder() {
    const order = activeOrder();
    if (!order) return `${screenHead('11 · Track order', 'No active order', '')}`;
    const events = [
      ['Bid accepted', ['confirmed', 'packed', 'picked-up', 'at-door', 'delivered'].includes(order.status)],
      ['Store confirmed stock', ['packed', 'picked-up', 'at-door', 'delivered'].includes(order.status)],
      ['Packing', ['packed', 'picked-up', 'at-door', 'delivered'].includes(order.status)],
      ['Rider pickup', ['picked-up', 'at-door', 'delivered'].includes(order.status)],
      ['Delivered', order.status === 'delivered']
    ];
    return `${screenHead('11 · Track order', order.status === 'delivered' ? 'Delivered' : `On its way by ${new Date(Date.now() + order.slotHours * 3600000).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}`, `Order ${order.id}`, badge(order.status.replace('-', ' ')))}${card('Order progress', `<ol class="bb-timeline">${events.map(([label, done]) => `<li class="${done ? 'done' : ''}"><i></i><span>${label}</span><small>${done ? 'Complete' : 'Upcoming'}</small></li>`).join('')}</ol><div class="bb-note">Rider details appear after pickup. Door code: <strong>4821</strong>.</div><div class="bb-inline-actions" style="margin-top:12px">${order.status === 'at-door' ? '<button class="bb-button primary" data-action="open-door">Check items at door</button>' : ''}<button class="bb-button" data-action="view-order-list">All orders</button></div>`)}`;
  }
  function doorCheck() {
    const order = activeOrder();
    if (!order) return '';
    return `${screenHead('12 · Check at door', 'Check your items', 'Reject anything damaged, wrong, or near expiry.', badge(order.id))}${card('Delivery checklist', `<div class="bb-items">${order.items.map((item, index) => {
      const line = (order.bids.find(bid => bid.id === order.winnerBidId)?.lines || [])[index] || {};
      const rejected = order.rejected.includes(index);
      return `<label class="bb-item" style="cursor:pointer"><span><input class="bb-check" type="checkbox" data-door-line="${index}" ${!rejected ? 'checked' : ''}> <strong>${esc(line.brand || item.brand || product(item.pid).brand)} ${esc(product(item.pid).name)} ${esc(product(item.pid).pack)}</strong><small class="bb-item-sub" style="display:block">${displayQuantity(item)} · ${rejected ? 'Rejected' : 'Received'}</small></span><span>${rejected ? money(line.price * item.qty) + ' refund' : 'Reject'}</span></label>`;
    }).join('')}</div><div class="bb-field" style="margin-top:12px"><label>Store rating</label><select id="order-rating"><option value="5">★★★★★</option><option value="4">★★★★☆</option><option value="3">★★★☆☆</option><option value="2">★★☆☆☆</option><option value="1">★☆☆☆☆</option></select></div><button class="bb-button primary wide" style="margin-top:12px" type="button" data-action="confirm-delivery">Confirm ${order.items.length - order.rejected.length} items received</button>`)}`;
  }
  function ordersPage() {
    const orders = [...state.orders].sort((a, b) => b.createdAt - a.createdAt);
    if (!orders.length) return `${screenHead('13 · Orders', 'Your orders', 'Live and past orders.')}${emptyBox('Your first basket will show up here.')}`;
    return `${screenHead('13 · Orders', 'Your orders', 'Live and past orders. Any basket can be bid on again.', badge(`${orders.length} orders`))}<div class="bb-stack">${orders.map(order => `<article class="bb-card" style="padding:13px"><div class="bb-bill-row"><strong>${order.id}</strong>${badge(order.status, order.status === 'delivered' ? '' : 'gold')}</div><p class="bb-item-sub" style="margin-top:5px">${order.items.length} items · ${new Date(order.createdAt).toLocaleDateString('en-IN')}</p><div class="bb-bill-row" style="margin-top:7px"><span>${order.status === 'delivered' ? 'Refunded' : 'Total'}</span><strong>${money(orderPayable(order))}</strong></div><div class="bb-inline-actions" style="margin-top:9px"><button class="bb-button small" type="button" data-action="resume-order" data-id="${order.id}">View</button><button class="bb-button small" type="button" data-action="rebid-order" data-id="${order.id}">Bid on this again</button></div></article>`).join('')}</div>`;
  }
  function savingsPage() {
    const completed = state.orders.filter(order => ['delivered', 'at-door', 'picked-up', 'packed', 'confirmed'].includes(order.status));
    const savings = completed.reduce((sum, order) => {
      const winningBid = order.bids.find(bid => bid.id === order.winnerBidId) || sortedBids(order)[0];
      return sum + (winningBid ? order.items.reduce((total, item) => total + product(item.pid).mrp * item.qty, 0) - grandTotal(order, winningBid, order.acceptSwaps !== false) : 0);
    }, 0);
    return `${screenHead('14 · Savings', 'What you have saved', 'Lower than MRP across your baskets.', badge(`${completed.length} orders`))}<div class="bb-card" style="padding:18px;background:var(--bb-green-dark);color:#fff"><small>BELOW MRP</small><strong style="display:block;margin:8px 0;font:700 38px/1 'Bricolage Grotesque',sans-serif">${money(Math.max(0, savings))}</strong><small>${completed.length} completed or active orders</small></div>${card('Savings by month', `<div class="bb-grid three">${['Jul', 'Aug', 'Sep'].map((month, index) => `<div class="bb-stat"><small>${month}</small><strong>${money(Math.round(savings * [0.23, .31, .46][index]))}</strong><div class="bb-meter"><span style="width:${[35, 56, 78][index]}%"></span></div></div>`).join('')}</div>`)}${card('Stores used', STORES.slice(0, Math.min(completed.length, 3)).map((item, index) => row(item.name, `${Math.max(1, completed.length - index)} orders`)).join('') || '<div class="bb-empty">Your store history appears after an order.</div>')}`;
  }
  function tooFewBids() {
    const order = activeOrder();
    if (!order) return '';
    return `${screenHead('15 · Too few bids', 'Stores are busy right now', `Bidding closed with ${order.bids.length} offer${order.bids.length === 1 ? '' : 's'} for your slot.`, badge('Free to wait', 'gold'))}<div class="bb-note">You can accept the available offer, give stores more time once, move to a later slot, or cancel at no charge.</div><div class="bb-stack" style="margin-top:12px">${sortedBids(order).map(bid => `<div class="bb-card" style="padding:13px"><div class="bb-bill-row"><strong>${esc(bid.label)}</strong><strong>${money(bidStats(order, bid).swapTotal)}</strong></div><button class="bb-button primary wide" style="margin-top:9px" data-action="open-bid" data-id="${bid.id}">Accept this bid</button></div>`).join('')}</div><div class="bb-stack" style="margin-top:12px"><button class="bb-button wide" type="button" data-action="extend-window">Wait ${state.config.bidExtension} more minutes</button><button class="bb-button wide" type="button" data-action="change-slot">Switch to a later slot</button><button class="bb-button danger wide" type="button" data-action="cancel-order">Cancel, no charge</button></div>`;
  }
  function accountPage() {
    return `${screenHead('Account', 'Your details', 'Language, delivery address, and demo session.')}${card('Delivery address', `<div class="bb-field"><label>Address</label><input class="bb-input" value="${esc(state.profile.flat)}, ${esc(state.profile.building)}, Kothrud · ${esc(state.profile.pincode)}" readonly></div><button class="bb-button" style="margin-top:9px" type="button" data-action="edit-address">Edit address</button>`)}${card('Voice language', languageControl())}<button class="bb-button danger" style="margin-top:12px" data-action="switch-role">Switch role / account</button>`;
  }
  function customerRoute() {
    const screen = state.screen;
    if (screen === 'address') return renderAddress();
    if (screen === 'voice') return customerVoice();
    if (screen === 'review') return reviewBasket();
    if (screen === 'slot') return orderSlots();
    if (screen === 'bidding') return biddingScreen();
    if (screen === 'compare') return compareBids();
    if (screen === 'bid-detail') return bidDetail();
    if (screen === 'checkout') return checkout();
    if (screen === 'track') return trackOrder();
    if (screen === 'door') return doorCheck();
    if (screen === 'too-few') return tooFewBids();
    if (screen === 'orders') return ordersPage();
    if (screen === 'savings') return savingsPage();
    if (screen === 'account') return accountPage();
    return customerHome();
  }
  function orderSafeSummary(order) {
    return `${order.id} · ${order.items.length} items · MRP ${money(order.items.reduce((sum, item) => sum + product(item.pid).mrp * item.qty, 0))} · ${order.slotHours}-hr slot`;
  }
  function retailerRegistration() {
    return `${screenHead('R1 · Retailer app', 'List your store', 'Get orders from homes near you. No listing fee.', badge('Local demo'))}${card('Store registration', `<form class="bb-form" data-form="retailer-register"><div class="bb-field"><label>Store name</label><input name="name" value="${esc(store(state.retailerId).name)}" required></div><div class="bb-field"><label>Owner mobile</label><input name="phone" value="9766018342" inputmode="tel" required></div><div class="bb-form-grid"><div class="bb-field"><label>Store pincode</label><input name="pincode" value="411038" maxlength="6" required></div><div class="bb-field"><label>Serve up to</label><input name="radius" value="3 km"></div></div><div class="bb-field"><label>UPI ID for payouts</label><input name="upi" value="shreeganesh@okaxis" required></div><div class="bb-field"><label>GSTIN (optional)</label><input name="gstin" placeholder="Optional"></div><button class="bb-button primary wide" type="submit">Save store profile</button></form>`)}`;
  }
  function retailerPriceList() {
    const storeId = state.retailerId;
    return `${screenHead('R2 · Price list & auto-bid', 'Your price list', 'Prices are learned from bids; no catalogue upload.', badge(state.autoBid ? 'Auto-bid on' : 'Auto-bid off', 'gold'))}${card('Auto-bid preference', `<label class="bb-row"><span><strong>Auto-bid on</strong><small class="bb-item-sub">Prefill from saved prices; review before sending.</small></span><input class="bb-check" type="checkbox" data-autobid ${state.autoBid ? 'checked' : ''}></label><div class="bb-field" style="margin-top:9px"><label>Search items</label><input id="price-search" placeholder="Atta, oil, Surf..."></div>`)}<div class="bb-card"><div class="bb-table-wrap"><table class="bb-table"><thead><tr><th>Item</th><th>Pack</th><th class="num">MRP</th><th class="num">Your price</th></tr></thead><tbody>${PRODUCT_DATA.map(item => `<tr data-price-row="${item.id}"><td>${esc(item.name)}<small style="display:block;color:var(--bb-muted)">${esc(item.brand)}</small></td><td>${esc(item.pack)}</td><td class="num">${money(item.mrp)}</td><td class="num"><input style="width:84px;padding:6px;border:1px solid var(--bb-line);border-radius:7px" type="number" min="1" max="${item.mrp}" data-price-edit="${item.id}" value="${retailerPrice(item.id, item.brand, storeId)}" aria-label="Price for ${esc(item.name)}"></td></tr>`).join('')}</tbody></table></div></div><div class="bb-note" style="margin-top:12px">One tap “Same as last time” pre-fills a request from this price list.</div>`;
  }
  function retailerInbox() {
    const orders = state.orders.filter(order => order.status === 'bidding' || order.status === 'too-few');
    return `${screenHead('R3 · Incoming requests', `${orders.length} baskets to bid on`, 'Your zone · Kothrud 411038 · customer details hidden.', badge('No customer identity'))}${orders.length ? `<div class="bb-stack">${orders.map(order => `<article class="bb-card" style="padding:13px"><div class="bb-bill-row"><strong>Basket ${order.id}</strong>${badge(countdown(order), 'gold')}</div><p class="bb-item-sub" style="margin:5px 0">${orderSafeSummary(order)}</p><p class="bb-item-sub">Items: ${order.items.map(item => product(item.pid).name).join(', ')}</p><div class="bb-note" style="margin-top:9px">Customer name, phone, and address are never shown to stores.</div><div class="bb-inline-actions" style="margin-top:9px"><button class="bb-button" data-action="same-last-time" data-id="${order.id}">Same as last time</button><button class="bb-button primary" data-action="build-bid" data-id="${order.id}">Review auto-bid</button></div></article>`).join('')}</div>` : emptyBox('New baskets from Kothrud will appear here while bidding is open.')}`;
  }
  function initBidDraft(order) {
    const savedBid = order.bids.find(bid => bid.storeId === state.retailerId);
    state.draftBid = order.items.map((item, index) => {
      const previous = savedBid?.lines[index];
      const brand = previous?.brand || (item.brand && product(item.pid).brands.includes(item.brand) ? item.brand : product(item.pid).brands[0]);
      const savedPrice = retailerPrice(item.pid, brand);
      return { available: previous?.available ?? !store(state.retailerId).missing.includes(item.pid), brand, price: previous?.price || savedPrice };
    });
  }
  function retailerBuildBid() {
    const order = orderById(state.activeOrderId);
    if (!order) return retailerInbox();
    if (!state.draftBid || state.draftBid.length !== order.items.length) initBidDraft(order);
    const rows = order.items.map((item, index) => {
      const draft = state.draftBid[index], sku = product(item.pid), mrp = productMrp(item.pid, draft.brand), floor = Math.ceil(sku.benchmark * state.config.bidFloor);
      const error = draft.available && draft.price > mrp ? `Above MRP. Maximum ${money(mrp)}.` : draft.available && draft.price < floor ? `Below ${Math.round(state.config.bidFloor * 100)}% floor. Minimum ${money(floor)}.` : '';
      return `<div class="bb-item"><div><div class="bb-item-title">${esc(sku.name)} · ${displayQuantity(item)}</div><div class="bb-item-sub">${item.locked ? `Customer requested ${esc(item.brand)}` : 'Any brand'} · MRP ${money(mrp)} · floor ${money(floor)}</div><div class="bb-form-grid" style="margin-top:7px"><div class="bb-field"><label>Brand</label><select data-draft-brand="${index}">${sku.brands.map(brand => `<option ${brand === draft.brand ? 'selected' : ''}>${esc(brand)}</option>`).join('')}</select></div><div class="bb-field"><label>₹ per ${sku.pack}</label><input type="number" min="1" value="${draft.price}" data-draft-price="${index}"></div></div>${error ? `<small style="display:block;margin-top:4px;color:var(--bb-red);font-weight:700">${error}</small>` : ''}</div><label style="display:flex;align-items:center;gap:5px;font-size:11px"><input class="bb-check" type="checkbox" data-draft-stock="${index}" ${draft.available ? 'checked' : ''}>In stock</label></div>`;
    }).join('');
    const total = state.draftBid.reduce((sum, line, index) => sum + (line.available ? line.price * order.items[index].qty : 0), 0);
    const count = state.draftBid.filter(line => line.available).length;
    return `${screenHead('R4 · Build a bid', 'Check and send your bid', `${order.id} · ${order.slotHours}-hr slot`, badge(countdown(order), 'gold'))}<div class="bb-note">You see order ID, zone, items, quantities, requested brands, and slot only. Customer details are not part of this view.</div>${card('Requested lines', rows)}<div class="bb-card" style="margin-top:12px"><div class="bb-card-body"><div class="bb-bill-row"><span>Your bid · ${count} of ${order.items.length} items</span><strong>${money(total)}</strong></div><button class="bb-button primary wide" style="margin-top:10px" type="button" data-action="send-bid" ${count ? '' : 'disabled'}>Send bid</button></div></div>`;
  }
  function retailerResults() {
    const sent = state.orders.filter(order => order.bids.some(bid => bid.storeId === state.retailerId));
    return `${screenHead('R5 · Bid results', 'Your bids', 'Lost feedback shows only your aggregate price gap.', badge(`${sent.length} bids`))}${sent.length ? `<div class="bb-stack">${sent.map(order => {
      const own = order.bids.find(bid => bid.storeId === state.retailerId), ownStats = bidStats(order, own);
      const won = order.winnerBidId === own.id;
      if (won) return `<article class="bb-card" style="padding:13px">${badge('Won')}<h3 style="margin-top:8px">${order.id} · ${money(ownStats.swapTotal)}</h3><p class="bb-item-sub">Pack by ${new Date(order.createdAt + order.slotHours * 3600000 - 45 * 60000).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}.</p><button class="bb-button primary" style="margin-top:9px" data-action="open-pack" data-id="${order.id}">Pack order</button></article>`;
      if (order.status === 'bidding' || order.status === 'too-few') return `<article class="bb-card" style="padding:13px"><h3>${order.id}</h3><p class="bb-item-sub">Bid sent · ${money(ownStats.swapTotal)}</p></article>`;
      const winner = order.bids.find(bid => bid.id === order.winnerBidId), winTotal = winner ? bidStats(order, winner).swapTotal : ownStats.swapTotal;
      const gap = Math.max(0, ownStats.swapTotal - winTotal);
      return `<article class="bb-card" style="padding:13px">${badge(`Lost by ${money(gap)}`, 'gold')}<h3 style="margin-top:8px">${order.id}</h3><p class="bb-item-sub">You were higher on ${ownStats.covered} items. No competitor prices or names are shown.</p></article>`;
    }).join('')}</div>` : emptyBox('Submitted bids and outcomes appear here.')}`;
  }
  function retailerPack() {
    const wonOrders = state.orders.filter(order => order.winnerBidId && order.bids.some(bid => bid.id === order.winnerBidId && bid.storeId === state.retailerId) && order.status !== 'delivered');
    const order = state.orders.find(item => item.id === state.activeOrderId) || wonOrders[0];
    if (!order) return `${screenHead('R6 · Pack order', 'No awarded baskets', 'Winning orders appear here.')}${emptyBox('There are no orders to pack yet.')}`;
    const winner = order.bids.find(bid => bid.id === order.winnerBidId);
    if (!winner) return `${screenHead('R6 · Pack order', 'Not selected', order.id)}${emptyBox('This basket has not been awarded to your store.')}`;
    const packReady = order.items.every((_, index) => state.packChecks[`${order.id}:${index}`]);
    return `${screenHead('R6 · Pack order', `Pack by ${new Date(order.createdAt + order.slotHours * 3600000 - 45 * 60000).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}`, `${order.id} · ${money(bidStats(order, winner).swapTotal)}`, badge(order.packed ? 'Ready for rider' : 'Packing', 'gold'))}${card('Checklist', `${order.items.map((item, index) => `<label class="bb-item"><span><input class="bb-check" type="checkbox" data-pack-check="${index}" ${state.packChecks[`${order.id}:${index}`] ? 'checked' : ''}> <strong>${esc(winner.lines[index].brand)} ${esc(product(item.pid).name)} ${esc(product(item.pid).pack)}</strong><small class="bb-item-sub" style="display:block">${displayQuantity(item)} · expiry checked</small></span>${winner.lines[index].alternative ? badge('Swap', 'gold') : ''}</label>`).join('')}<div class="bb-note" style="margin-top:10px">Seal a plain bag and write order code ${order.id}. Rider scans this code at pickup.</div><button class="bb-button primary wide" style="margin-top:11px" data-action="mark-packed" data-id="${order.id}" ${!packReady || order.packed ? 'disabled' : ''}>${order.packed ? 'Packed · waiting for rider' : 'Mark packed and ready'}</button>`)}`;
  }
  function retailerPayouts() {
    const orders = state.orders.filter(order => order.bids.some(bid => bid.storeId === state.retailerId));
    const held = orders.filter(order => order.status !== 'delivered' && order.winnerBidId && order.bids.find(bid => bid.id === order.winnerBidId)?.storeId === state.retailerId).reduce((sum, order) => sum + bidStats(order, order.bids.find(bid => bid.id === order.winnerBidId)).swapTotal, 0);
    const paid = orders.filter(order => order.status === 'delivered' && order.winnerBidId && order.bids.find(bid => bid.id === order.winnerBidId)?.storeId === state.retailerId).reduce((sum, order) => sum + payoutAfterAdjustments(order, order.bids.find(bid => bid.id === order.winnerBidId)), 0);
    const stats = store(state.retailerId);
    return `${screenHead('R7 · Payouts & score', 'Payouts and score', 'Payment held until customer confirms delivery.', badge(`${stats.score} score`))}<div class="bb-grid">${stat('Paid this period', money(paid), 'After commission and refunds')}${stat('Held until delivery', money(held), 'Released on customer confirmation')}</div>${card('Your store score', `<div class="bb-stack">${[['Fill rate', stats.fillRate], ['Packed on time', stats.onTime], ['Accepted at door', Math.max(85, stats.score - 1)]].map(([label, value]) => `<div><div class="bb-bill-row"><span>${label}</span><strong>${value}%</strong></div><div class="bb-meter"><span style="width:${value}%"></span></div></div>`).join('')}</div><p class="bb-item-sub" style="margin-top:9px">Reliability helps break equal-price ties. Repeated short-picks can pause bidding.</p>`)}${card('Recent payouts', orders.length ? orders.slice(-5).map(order => { const winner = order.bids.find(bid => bid.id === order.winnerBidId); return winner?.storeId === state.retailerId ? row(order.id, money(payoutAfterAdjustments(order, winner)), order.payment?.refund ? `Released · ${money(order.payment.refund)} refunded` : order.status === 'delivered' ? 'Released' : 'Held') : ''; }).join('') : '<div class="bb-empty">Payout history appears after an awarded order.</div>')}`;
  }
  function retailerRoute() {
    if (state.screen === 'retailer-register') return retailerRegistration();
    if (state.screen === 'build') return retailerBuildBid();
    const routes = { prices: retailerPriceList, requests: retailerInbox, build: retailerBuildBid, results: retailerResults, pack: retailerPack, payouts: retailerPayouts };
    return (routes[state.retailerTab] || retailerInbox)();
  }
  function riderRoute() {
    const orders = state.orders.filter(order => ['confirmed', 'packed', 'picked-up', 'at-door'].includes(order.status));
    return `${screenHead('Rider app', 'Assigned pickups', 'Plain bag · BachatBazaar order code · customer information only at pickup.', badge(`${orders.length} active`))}${orders.length ? `<div class="bb-stack">${orders.map(order => {
      const bid = order.bids.find(item => item.id === order.winnerBidId);
      const shop = bid?.storeId ? store(bid.storeId).name : 'BachatBazaar Price partner';
      const pickup = order.status === 'confirmed' ? `<button class="bb-button primary" data-action="pickup-check" data-id="${order.id}">Pickup check</button>` : order.status === 'packed' ? `<button class="bb-button primary" data-action="pickup-check" data-id="${order.id}">Scan sealed order</button>` : order.status === 'picked-up' ? `<button class="bb-button primary" data-action="arrive-door" data-id="${order.id}">Arrive at customer</button>` : badge('At customer door', 'gold');
      return `<article class="bb-card" style="padding:14px"><div class="bb-bill-row"><strong>${order.id}</strong>${badge(order.status, 'gold')}</div><p class="bb-item-sub" style="margin:6px 0">Pickup · ${esc(shop)} · Kothrud 411038</p><p class="bb-item-sub">Pack by ${new Date(order.createdAt + order.slotHours * 3600000 - 45 * 60000).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })} · ${order.items.length} lines</p><div class="bb-inline-actions" style="margin-top:10px">${pickup}</div></article>`;
    }).join('')}</div>` : emptyBox('Assigned pickups will show here after checkout.')}`;
  }
  function riderCheck(orderId) {
    const order = orderById(orderId);
    if (!order) return;
    const bid = order.bids.find(item => item.id === order.winnerBidId);
    const checks = order.items.map((item, index) => `<label class="bb-item"><span><input class="bb-check" type="checkbox" data-rider-check="${index}" ${order.pickupChecks.includes(index) ? 'checked' : ''}> <strong>${esc(bid.lines[index].brand)} ${esc(product(item.pid).name)}</strong><small class="bb-item-sub" style="display:block">${displayQuantity(item)} · correct pack · expiry 30+ days</small></span></label>`).join('');
    state.screen = 'rider-check';
    state.activeOrderId = orderId;
    state._riderChecksHtml = checks;
    render();
  }
  function riderCheckScreen() {
    const order = activeOrder();
    if (!order) return riderRoute();
    return `${screenHead('Pickup check', order.id, 'Confirm every line, correct pack, and expiry over 30 days.', badge(`${order.pickupChecks.length}/${order.items.length}`))}${card('Check the sealed bag', `${order.items.map((item, index) => { const bid = order.bids.find(value => value.id === order.winnerBidId); return `<label class="bb-item"><span><input class="bb-check" type="checkbox" data-rider-check="${index}" ${order.pickupChecks.includes(index) ? 'checked' : ''}> <strong>${esc(bid.lines[index].brand)} ${esc(product(item.pid).name)}</strong><small class="bb-item-sub" style="display:block">${displayQuantity(item)} · pack and expiry verified</small></span></label>`; }).join('')}<button class="bb-button primary wide" style="margin-top:10px" data-action="confirm-pickup" data-id="${order.id}" ${order.pickupChecks.length === order.items.length ? '' : 'disabled'}>Confirm pickup</button>`)}`;
  }
  function slotCapacity() {
    return [3, 6, 9, 12].map(hours => {
      const used = state.orders.filter(order => order.slotHours === hours && ['confirmed', 'packed', 'picked-up', 'at-door'].includes(order.status)).length;
      return `<div class="bb-row"><span>${hours} hr slot</span><span>${used} / ${state.config.slotCapacity}<div class="bb-meter" style="width:110px;margin-top:4px"><span style="width:${Math.min(100, used / state.config.slotCapacity * 100)}%"></span></div></span></div>`;
    }).join('');
  }
  function opsRoute() {
    const active = state.orders.filter(order => ['bidding', 'too-few'].includes(order.status));
    const awarded = state.orders.filter(order => order.winnerBidId);
    const disputeCount = state.orders.reduce((sum, order) => sum + order.rejected.length, 0);
    const nav = [['auctions', 'Live auctions'], ['capacity', 'Slot capacity'], ['watchlist', 'Retailer watchlist'], ['disputes', 'Disputes'], ['config', 'Config']];
    let body = '';
    if (state.opsTab === 'auctions') body = `<div class="bb-grid three">${stat('Live auctions', String(active.length), `${state.orders.length} baskets total`)}${stat('Orders awarded', String(awarded.length), 'Payment held until delivery')}${stat('Open disputes', String(disputeCount), 'Door rejections / short-picks')}</div>${card('Live auctions', active.length ? `<div class="bb-table-wrap"><table class="bb-table"><thead><tr><th>Basket</th><th>Zone</th><th>Items · MRP</th><th>Slot</th><th>Bids</th><th>Lowest</th><th>Time left</th><th></th></tr></thead><tbody>${active.map(order => `<tr><td><strong>${order.id}</strong></td><td>Kothrud</td><td>${order.items.length} · ${money(order.items.reduce((sum, item) => sum + product(item.pid).mrp * item.qty, 0))}</td><td>${order.slotHours} hr</td><td>${order.bids.length}</td><td>${money(Math.min(...order.bids.map(bid => bidStats(order, bid).swapTotal)))}</td><td>${countdown(order)}</td><td><button class="bb-button small" data-action="ops-seed" data-id="${order.id}">Seed bid</button> <button class="bb-button small" data-action="ops-extend" data-id="${order.id}">Extend 5m</button></td></tr>`).join('')}</tbody></table></div>` : emptyBox('No live auctions. Start a customer basket to see one here.'))}`;
    else if (state.opsTab === 'capacity') body = `${card('Slot capacity today', slotCapacity())}${card('Zone capacity', `<div class="bb-field"><label>Orders per delivery slot</label><input type="number" min="1" max="100" id="ops-capacity" value="${state.config.slotCapacity}"></div><button class="bb-button primary" style="margin-top:9px" data-action="save-capacity">Save capacity</button>`)}`;
    else if (state.opsTab === 'watchlist') body = card('Retailer watchlist', `<div class="bb-table-wrap"><table class="bb-table"><thead><tr><th>Store</th><th>Win rate</th><th>Fill rate</th><th>On-time pack</th><th>Score</th><th>Status</th></tr></thead><tbody>${STORES.map(branch => `<tr><td>${esc(branch.name)}</td><td>${15 + branch.score % 35}%</td><td>${branch.fillRate}%</td><td>${branch.onTime}%</td><td>${branch.score}</td><td>${branch.suspended ? badge('Paused', 'red') : badge('Active')}</td></tr>`).join('')}</tbody></table></div>`);
    else if (state.opsTab === 'disputes') body = card('Disputes', disputeCount ? state.orders.flatMap(order => order.rejected.map(index => `<div class="bb-row"><div class="bb-row-main"><strong>${order.id} · ${product(order.items[index].pid).name}</strong><small>Rejected at door · ${esc(order.rejectedReasons?.[index] || 'Customer rejection')}</small></div><div class="bb-row-end">${money(product(order.items[index].mrp) * order.items[index].qty)}${badge(state.disputeActions[`${order.id}:${index}`] || 'Open', 'gold')}<button class="bb-button small" data-action="resolve-dispute" data-id="${order.id}" data-index="${index}">Approve refund</button></div></div>`)).join('') : emptyBox('Door rejections and short-picks appear here after delivery.'));
    else body = card('Launch configuration', `<div class="bb-form-grid">${[['minBasket', 'Minimum basket ₹'], ['deliveryFee', 'Delivery fee ₹'], ['commission', 'Commission %'], ['bidFloor', 'Bid floor %', true], ['bidWindow', 'Bid window minutes'], ['minBids', 'Minimum bids'], ['slotCapacity', 'Slot capacity'], ['minStores', 'Stores to open zone']].map(([key, label, ratio]) => `<div class="bb-field"><label>${label}</label><input type="number" min="0" step="1" data-config="${key}" value="${ratio ? Math.round(state.config[key] * 100) : state.config[key]}"></div>`).join('')}</div><label class="bb-row"><span>Enable fresh items</span><input type="checkbox" class="bb-check" data-fresh ${state.config.freshEnabled ? 'checked' : ''}></label><button class="bb-button primary" data-action="save-ops-config">Save config</button>`);
    return `${screenHead('Ops console · Web', 'Platform operations', 'Kothrud, Pune · local demo', badge('Local mock'))}<div class="bb-tabs">${nav.map(([key, title]) => `<button type="button" data-ops-tab="${key}" aria-pressed="${state.opsTab === key}">${title}</button>`).join('')}</div>${body}`;
  }
  function emptyBox(text) { return `<div class="bb-empty">${text}</div>`; }
  function opsDisputesRoute() {
    const nav = [['auctions', 'Live auctions'], ['capacity', 'Slot capacity'], ['watchlist', 'Retailer watchlist'], ['disputes', 'Disputes'], ['config', 'Config']];
    const rejected = state.orders.flatMap(order => order.rejected.map(index => ({ order, index })));
    const body = card('Disputes', rejected.length ? rejected.map(({ order, index }) => `<div class="bb-row"><div class="bb-row-main"><strong>${order.id} · ${esc(product(order.items[index].pid).name)}</strong><small>Rejected at door · ${esc(order.rejectedReasons?.[index] || 'Customer rejection')}</small></div><div class="bb-row-end"><strong>${money(refundForLine(order, index))}</strong>${badge(state.disputeActions[`${order.id}:${index}`] || 'Open', 'gold')}<button class="bb-button small" data-action="resolve-dispute" data-id="${order.id}" data-index="${index}">Approve refund</button></div></div>`).join('') : emptyBox('Door rejections and short-picks appear here after delivery.'));
    return `${screenHead('Ops console · Web', 'Platform operations', 'Kothrud, Pune · local demo', badge('Local mock'))}<div class="bb-tabs">${nav.map(([key, title]) => `<button type="button" data-ops-tab="${key}" aria-pressed="${state.opsTab === key}">${title}</button>`).join('')}</div>${body}`;
  }
  function currentRoute() {
    if (!state.session) return renderAuth();
    if (state.session === 'customer') return customerRoute();
    if (state.session === 'retailer') return retailerRoute();
    if (state.session === 'rider') return state.screen === 'rider-check' ? riderCheckScreen() : riderRoute();
    return state.opsTab === 'disputes' ? opsDisputesRoute() : opsRoute();
  }
  function navItems() {
    if (state.session === 'customer') return [['home', 'Home', 'home'], ['orders', 'Orders', 'orders'], ['savings', 'Savings', 'savings'], ['account', 'Account', 'account']];
    if (state.session === 'retailer') return [['requests', 'Requests', 'orders'], ['results', 'Results', 'savings'], ['prices', 'Prices', 'store'], ['payouts', 'Payouts', 'account']];
    if (state.session === 'rider') return [['rider', 'Pickups', 'rider']];
    return [['ops', 'Ops console', 'ops']];
  }
  function render() {
    if (!state.session) {
      root.innerHTML = `<header class="bb-top"><div class="bb-logo">Bachat<span>Bazaar</span></div><span class="bb-live">Prototype</span><span class="bb-spacer"></span><span class="bb-session">Local mock data</span></header>${currentRoute()}`;
      return;
    }
    const active = state.session === 'customer' ? state.customerTab : state.session === 'retailer' ? state.retailerTab : state.session === 'rider' ? 'rider' : 'ops';
    const nav = navItems().map(([key, label, icon]) => navButton(key, label, active === key || (state.session === 'customer' && ['voice', 'review', 'slot', 'bidding', 'compare', 'bid-detail', 'checkout', 'track', 'door', 'too-few'].includes(state.screen) && key === 'home'), icon)).join('');
    root.innerHTML = `<header class="bb-top"><div class="bb-logo">Bachat<span>Bazaar</span></div><span class="bb-live">${state.session === 'ops' ? 'Ops console' : state.session}</span><span class="bb-spacer"></span><span class="bb-session">${esc(roleName())}</span><button type="button" data-action="switch-role">Switch account</button></header><div class="bb-shell"><aside class="bb-side"><div class="bb-zone"><small>Launch zone</small><h2>Kothrud, Pune</h2><p>PIN 411038 · 18 active stores</p></div><nav class="bb-nav" aria-label="Main navigation">${nav}</nav><div class="bb-side-note">Mock mode · data stays in this browser<br>OTP / payments / live events simulated</div></aside><main class="bb-content">${currentRoute()}</main></div>`;
  }
  function startSession(role) {
    state.selectedRole = role;
    state.screen = 'signin';
    render();
  }
  function completeSignIn(form) {
    const data = new FormData(form);
    state.phone = String(data.get('phone') || '').replace(/\D/g, '');
    if (String(data.get('otp')) !== '123456') { toast('Use the demo OTP 123456.'); return; }
    state.session = state.selectedRole;
    state.selectedRole = null;
    if (state.session === 'customer') state.screen = state.profile.pincode ? 'home' : 'address';
    else if (state.session === 'retailer') state.screen = state.retailerRegistered ? 'app' : 'retailer-register';
    else if (state.session === 'rider') state.screen = 'app';
    else { state.screen = 'app'; state.opsTab = 'auctions'; }
    save(); render();
  }
  function startVoice() {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) { toast('Voice is not supported here. Type the list instead.'); return; }
    try {
      voiceRecognition = new Recognition();
      voiceRecognition.lang = state.language === 'en' ? 'en-IN' : 'hi-IN';
      voiceRecognition.interimResults = true;
      voiceRecognition.continuous = false;
      voiceRecognition.onresult = event => {
        state.voiceText = Array.from(event.results).map(result => result[0].transcript).join(' ');
        const input = document.getElementById('voice-input') || document.getElementById('home-voice');
        if (input) input.value = state.voiceText;
      };
      voiceRecognition.onerror = () => toast('Mic access unavailable. Type the list instead.');
      voiceRecognition.onend = () => { if (state.voiceText.trim()) parseVoice(); };
      voiceRecognition.start();
      toast('Listening…');
    } catch { toast('Mic could not start. Type the list instead.'); }
  }
  function acceptBid(bidId, withSwaps) {
    const order = activeOrder(), bid = order?.bids.find(item => item.id === bidId);
    if (!order || !bid) return;
    order.pendingBidId = bid.id;
    order.acceptSwaps = withSwaps;
    order.status = 'awaiting-payment';
    order.timeline.push({ key: 'accepted', at: Date.now() });
    state.selectedBidId = bid.id;
    state.screen = 'checkout';
    save(); render();
  }
  function payOrder() {
    const order = activeOrder();
    if (!order) return;
    const used = state.orders.filter(item => item.slotHours === order.slotHours && ['confirmed', 'packed', 'picked-up', 'at-door'].includes(item.status)).length;
    if (used >= state.config.slotCapacity) { state.screen = 'slot'; toast('That slot filled up. Choose another time.'); render(); return; }
    order.payment = { method: state.paymentMethod, status: 'held', amount: orderPayable(order), at: Date.now(), mock: true };
    order.winnerBidId = order.pendingBidId;
    order.pendingBidId = null;
    order.status = 'confirmed';
    order.timeline.push({ key: 'paid', at: Date.now() });
    state.screen = 'track';
    save(); render(); toast('Mock payment authorized. Store payout is held.');
  }
  function confirmDelivery() {
    const order = activeOrder();
    if (!order) return;
    const rating = Number(document.getElementById('order-rating')?.value || 5);
    order.rating = rating;
    order.status = 'delivered';
    order.payment.status = 'released';
    order.payment.refund = order.rejected.reduce((sum, index) => sum + refundForLine(order, index), 0);
    order.timeline.push({ key: 'delivered', at: Date.now() });
    const winning = order.bids.find(bid => bid.id === order.winnerBidId);
    if (winning?.storeId) {
      const branch = store(winning.storeId);
      branch.score = Math.min(100, branch.score + (rating >= 4 ? 1 : -2));
      branch.fillRate = Math.max(70, Math.min(100, branch.fillRate + (order.rejected.length ? -2 : 1)));
    }
    state.screen = 'orders'; state.customerTab = 'orders'; save(); render();
    toast(`Delivery confirmed. Refund ${money(order.payment.refund)} · store payout released.`);
  }
  function demoLowResponse(order) {
    order.bids = [order.bids.find(bid => bid.isBoli) || createBoliBid(order)];
    order.status = 'too-few';
    order.deadline = Date.now();
    state.screen = 'too-few';
  }
  function submitRetailerBid() {
    const order = activeOrder();
    if (!order || !state.draftBid) return;
    for (let index = 0; index < state.draftBid.length; index++) {
      const line = state.draftBid[index], item = order.items[index];
      if (!line.available) continue;
      const mrp = productMrp(item.pid, line.brand), floor = Math.ceil(product(item.pid).benchmark * state.config.bidFloor);
      if (line.price > mrp) { toast(`${product(item.pid).name}: above MRP. Max ${money(mrp)}.`); return; }
      if (line.price < floor) { toast(`${product(item.pid).name}: below bid floor. Min ${money(floor)}.`); return; }
    }
    const bid = { id: `bid-${Date.now()}-${Math.floor(Math.random() * 9999)}`, storeId: state.retailerId, label: store(state.retailerId).name, isBoli: false, createdAt: Date.now(), score: store(state.retailerId).score, lines: state.draftBid.map(line => ({ ...line })) };
    order.bids = order.bids.filter(existing => existing.storeId !== state.retailerId);
    order.bids.push(bid);
    bid.lines.forEach(line => { if (line.available) state.priceList[`${state.retailerId}:${order.items[bid.lines.indexOf(line)].pid}:${line.brand}`] = line.price; });
    state.retailerTab = 'results'; state.screen = 'app'; save(); render(); toast(`Bid sent for ${order.id}.`);
  }
  function routeAction(action, button) {
    const id = button.dataset.id;
    if (action === 'back-roles') { state.selectedRole = null; render(); }
    else if (action === 'switch-role') { state.session = null; state.selectedRole = null; state.screen = 'signin'; save(); render(); }
    else if (action === 'open-voice') { state.screen = 'voice'; render(); }
    else if (action === 'toggle-voice') startVoice();
    else if (action === 'sample-text') { state.voiceText = SAMPLE_TEXT; if (state.screen === 'home') { document.getElementById('home-voice').value = state.voiceText; } else render(); }
    else if (action === 'home-parse') { state.voiceText = document.getElementById('home-voice')?.value || state.voiceText; state.screen = 'voice'; parseVoice(); }
    else if (action === 'parse-voice') { state.voiceText = document.getElementById('voice-input')?.value || state.voiceText; parseVoice(); }
    else if (action === 'review-basket') { state.screen = 'review'; render(); }
    else if (action === 'sample-basket') buildSampleBasket();
    else if (action === 'remove-item') { state.basket.splice(Number(button.dataset.index), 1); save(); render(); }
    else if (action === 'qty-up' || action === 'qty-down') {
      const item = state.basket[Number(button.dataset.index)]; if (item) { item.qty = round(item.qty + (action === 'qty-up' ? 1 : -1)); if (item.qty <= 0) state.basket.splice(Number(button.dataset.index), 1); save(); render(); }
    }
    else if (action === 'toggle-lock') { const item = state.basket[Number(button.dataset.index)]; if (item) { item.locked = !item.locked; save(); render(); } }
    else if (action === 'go-slot') { if (basketMrp() < state.config.minBasket) { toast(`Add ${money(state.config.minBasket - basketMrp())} more at MRP.`); return; } state.screen = 'slot'; render(); }
    else if (action === 'start-bidding') newOrder();
    else if (action === 'compare-bids') { state.screen = 'compare'; save(); render(); }
    else if (action === 'open-bid') { state.selectedBidId = id; state.screen = state.screen === 'too-few' ? 'bid-detail' : 'bid-detail'; render(); }
    else if (action === 'accept-bid') acceptBid(state.selectedBidId, button.dataset.swaps === 'true');
    else if (action === 'pay-order') payOrder();
    else if (action === 'low-response') { const order = activeOrder(); if (order) { demoLowResponse(order); save(); render(); } }
    else if (action === 'extend-window') { const order = activeOrder(); if (!order || order.extensionUsed) { toast('This auction has already been extended.'); return; } order.extensionUsed = true; order.status = 'bidding'; order.windowMinutes = state.config.bidExtension; order.deadline = Date.now() + state.config.bidExtension * 60000; state.screen = 'bidding'; save(); render(); toast(`Auction extended by ${state.config.bidExtension} minutes.`); }
    else if (action === 'change-slot') { const order = activeOrder(); if (order) { order.status = 'cancelled'; order.payment = null; state.basket = order.items.map(item => ({ ...item })); state.unknown = []; } state.selectedSlot = null; state.screen = 'slot'; save(); render(); }
    else if (action === 'cancel-order') { const order = activeOrder(); if (order) { order.status = 'cancelled'; order.payment = null; } state.screen = 'orders'; state.customerTab = 'orders'; save(); render(); toast('Order cancelled. No payment was taken.'); }
    else if (action === 'view-order-list') { state.screen = 'orders'; state.customerTab = 'orders'; render(); }
    else if (action === 'resume-order') { state.activeOrderId = id; const order = orderById(id); state.screen = order.status === 'delivered' ? 'orders' : order.status === 'bidding' ? 'bidding' : 'track'; render(); }
    else if (action === 'open-door') { state.screen = 'door'; render(); }
    else if (action === 'confirm-delivery') confirmDelivery();
    else if (action === 'edit-address') { state.screen = 'address'; render(); }
    else if (action === 'rebid-order') { const order = orderById(id); if (order) { state.basket = order.items.map(item => ({ ...item })); state.screen = 'review'; } render(); }
    else if (action === 'resolve-unknown') normalizeNewItem(document.getElementById(`unknown-${button.dataset.index}`)?.value || '');
    else if (action === 'remove-unknown') { state.unknown.splice(Number(button.dataset.index), 1); save(); render(); }
    else if (action === 'save-capacity') { const value = Number(document.getElementById('ops-capacity')?.value); if (value > 0) { state.config.slotCapacity = value; save(); render(); toast('Slot capacity updated.'); } }
    else if (action === 'save-ops-config') {
      document.querySelectorAll('[data-config]').forEach(input => { const value = Number(input.value); if (value > 0) state.config[input.dataset.config] = input.dataset.config === 'bidFloor' ? value / 100 : value; });
      state.config.freshEnabled = !!document.querySelector('[data-fresh]')?.checked; save(); render(); toast('Configuration saved.');
    }
    else if (action === 'ops-seed') { const order = orderById(id); if (order && !order.bids.some(bid => bid.isBoli)) { order.bids.push(createBoliBid(order)); save(); render(); toast('BachatBazaar Price fallback added.'); } else toast('Fallback bid already exists.'); }
    else if (action === 'ops-extend') { const order = orderById(id); if (order && !order.extensionUsed) { order.extensionUsed = true; order.deadline += state.config.bidExtension * 60000; save(); render(); toast('Auction extended by 5 minutes.'); } else toast('This auction has already been extended.'); }
    else if (action === 'resolve-dispute') { state.disputeActions[`${id}:${button.dataset.index}`] = 'Approved'; save(); render(); toast('Refund approved from local demo.'); }
    else if (action === 'same-last-time' || action === 'build-bid') {
      const order = orderById(id); if (!order) return;
      state.activeOrderId = id; initBidDraft(order);
      if (action === 'same-last-time') state.draftBid = order.items.map((item, index) => { const draft = state.draftBid[index]; return { ...draft, price: retailerPrice(item.pid, draft.brand) }; });
      state.retailerTab = 'requests'; state.screen = 'build'; render();
    }
    else if (action === 'send-bid') submitRetailerBid();
    else if (action === 'open-pack') { state.activeOrderId = id; state.retailerTab = 'pack'; render(); }
    else if (action === 'mark-packed') { const order = orderById(id); if (order) { if (!order.items.every((_, index) => state.packChecks[`${order.id}:${index}`])) { toast('Check every item before marking the bag ready.'); return; } order.packed = true; order.status = 'packed'; order.timeline.push({ key: 'packed', at: Date.now() }); save(); render(); toast('Packed. Rider pickup is ready.'); } }
    else if (action === 'pickup-check') riderCheck(id);
    else if (action === 'confirm-pickup') { const order = orderById(id); if (order) { order.status = 'picked-up'; order.timeline.push({ key: 'picked-up', at: Date.now() }); state.screen = 'app'; save(); render(); toast('Pickup confirmed.'); } }
    else if (action === 'arrive-door') { const order = orderById(id); if (order) { order.status = 'at-door'; order.timeline.push({ key: 'at-door', at: Date.now() }); save(); render(); toast('Order is at the door.'); } }
  }
  root.addEventListener('click', event => {
    const roleButton = event.target.closest('[data-role]');
    if (roleButton) { startSession(roleButton.dataset.role); return; }
    const navButton = event.target.closest('[data-nav]');
    if (navButton) {
      const key = navButton.dataset.nav;
      if (state.session === 'customer') { state.customerTab = key; state.screen = key; }
      else if (state.session === 'retailer') { state.retailerTab = key; state.screen = 'app'; }
      else if (state.session === 'rider') state.screen = 'app';
      render(); return;
    }
    const lang = event.target.closest('[data-language]');
    if (lang) { state.language = lang.dataset.language; save(); render(); return; }
    const slot = event.target.closest('[data-slot]');
    if (slot && !slot.disabled) { state.selectedSlot = Number(slot.dataset.slot); render(); return; }
    const sort = event.target.closest('[data-sort]');
    if (sort) { state.sortBy = sort.dataset.sort; render(); return; }
    const opsTab = event.target.closest('[data-ops-tab]');
    if (opsTab) { state.opsTab = opsTab.dataset.opsTab; render(); return; }
    const actionButton = event.target.closest('[data-action]');
    if (actionButton) routeAction(actionButton.dataset.action, actionButton);
  });
  root.addEventListener('submit', event => {
    const form = event.target;
    const type = form.dataset.form;
    if (!type) return;
    event.preventDefault();
    const data = new FormData(form);
    if (type === 'signin') completeSignIn(form);
    else if (type === 'address') {
      state.profile = { ...state.profile, pincode: String(data.get('pincode')).trim(), building: data.get('building'), flat: data.get('flat'), gate: data.get('gate'), landmark: data.get('landmark') };
      if (state.profile.pincode !== '411038') toast('This demo currently serves PIN 411038.');
      state.screen = 'home'; save(); render();
    } else if (type === 'retailer-register') {
      const myStore = store(state.retailerId);
      myStore.name = data.get('name'); myStore.serviceRadius = Number(String(data.get('radius')).match(/\d+/)?.[0] || 3);
      state.retailerRegistered = true; state.retailerTab = 'prices'; state.screen = 'app'; save(); render(); toast('Store profile saved locally.');
    }
  });
  root.addEventListener('change', event => {
    const target = event.target;
    if (target.matches('[data-brand-select]')) {
      const item = state.basket[Number(target.dataset.brandSelect)]; if (item) { item.brand = target.value; item.locked = true; save(); render(); }
    } else if (target.matches('[data-swap-index]')) {
      const order = activeOrder(); if (order) { order.acceptSwaps = !!target.checked; render(); }
    } else if (target.matches('[data-door-line]')) {
      const order = activeOrder(), index = Number(target.dataset.doorLine); if (!order) return;
      order.rejected = target.checked ? order.rejected.filter(item => item !== index) : [...new Set([...order.rejected, index])];
      save(); render();
    } else if (target.matches('[data-pack-check]')) {
      const key = `${state.activeOrderId}:${target.dataset.packCheck}`; state.packChecks[key] = target.checked; save(); render();
    } else if (target.matches('[data-rider-check]')) {
      const order = activeOrder(), index = Number(target.dataset.riderCheck); if (!order) return;
      order.pickupChecks = target.checked ? [...new Set([...order.pickupChecks, index])] : order.pickupChecks.filter(item => item !== index);
      save(); render();
    } else if (target.matches('[data-autobid]')) { state.autoBid = target.checked; save(); render(); }
    else if (target.matches('[name="payment-method"]')) { state.paymentMethod = target.value; save(); }
  });
  root.addEventListener('input', event => {
    const target = event.target;
    if (target.matches('[data-draft-price]')) { const line = state.draftBid?.[Number(target.dataset.draftPrice)]; if (line) line.price = Number(target.value); }
    else if (target.matches('[data-price-edit]')) { state.priceList[`${state.retailerId}:${target.dataset.priceEdit}:${product(target.dataset.priceEdit).brand}`] = Number(target.value); save(); }
    else if (target.id === 'home-voice' || target.id === 'voice-input') state.voiceText = target.value;
    else if (target.id === 'price-search') {
      const query = target.value.toLowerCase();
      document.querySelectorAll('[data-price-row]').forEach(rowElement => { rowElement.hidden = !rowElement.textContent.toLowerCase().includes(query); });
    }
  });
  window.addEventListener('storage', event => { if (event.key === STORAGE_KEY) { state = loadState(); render(); } });
  setInterval(() => {
    const order = activeOrder();
    if (!order || order.status !== 'bidding') return;
    if (timeLeft(order) === 0) {
      if (order.bids.length < state.config.minBids && !order.extensionUsed) {
        order.extensionUsed = true; order.deadline = Date.now() + state.config.bidExtension * 60000;
        order.windowMinutes = state.config.bidExtension;
      } else {
        order.status = order.bids.length < state.config.minBids ? 'too-few' : 'closed';
        state.screen = order.status === 'too-few' ? 'too-few' : 'compare';
      }
      save();
      render();
      return;
    }
    if (state.screen === 'bidding') {
      const seconds = timeLeft(order);
      const clock = countdown(order);
      const total = Math.max(1, (order.windowMinutes || state.config.bidWindow) * 60);
      const badgeClock = root.querySelector('[data-auction-clock]');
      const mainClock = root.querySelector('[data-auction-time]');
      const progress = root.querySelector('[data-auction-progress]');
      if (badgeClock) badgeClock.textContent = `${clock} left`;
      if (mainClock) mainClock.textContent = clock;
      if (progress) progress.style.width = `${Math.max(0, Math.min(100, Math.round(seconds / total * 100)))}%`;
    }
  }, 1000);
  render();
})();

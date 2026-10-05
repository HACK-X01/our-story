/* ==========================================================================
   OUR STORY ✨ - INTERACTIVE JAVASCRIPT
   Himanshu & Gullu Couple App
   ========================================================================== */

// --- PRIVATE COUPLE AUTHENTICATION & PORTAL CREDENTIALS ---
const AUTH_STORAGE_KEY = 'our_story_auth_user_v1';
const AUTH_CREDENTIALS = {
  himanshu: {
    id: 'Himanshu',
    pass: 'Hima2005@',
    name: 'Himanshu',
    avatar: '☕',
    partnerKey: 'gullu',
    partnerName: 'Gullu',
    partnerAvatar: '🌸'
  },
  gullu: {
    id: 'Gullu',
    pass: 'Sam2005@',
    name: 'Gullu',
    avatar: '🌸',
    partnerKey: 'himanshu',
    partnerName: 'Himanshu',
    partnerAvatar: '☕'
  }
};

function getAuthenticatedUser() {
  const local = localStorage.getItem(AUTH_STORAGE_KEY);
  if (local === 'himanshu' || local === 'gullu') return local;
  const session = sessionStorage.getItem(AUTH_STORAGE_KEY);
  if (session === 'himanshu' || session === 'gullu') return session;
  return null;
}

let currentUser = getAuthenticatedUser();
if (currentUser) {
  localStorage.setItem('our_story_current_user', currentUser);
}

let myDeviceId = localStorage.getItem('our_story_device_id');
if (!myDeviceId) {
  myDeviceId = 'dev_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
  localStorage.setItem('our_story_device_id', myDeviceId);
}

let currentMode = 'together';  // 'together' or 'apart'
let appState = null;
let currentPreviewBase64 = null;
let audioCtx = null;

// --- CURATED SONG PLAYLIST (Bollywood, Hollywood & Taylor Swift) ---
const SONG_CATALOG = [
  { id: 'enchanted', title: "Enchanted (Taylor's Version)", artist: "Taylor Swift", vibe: "Sparkling & Magical ✨", ytId: "igIfiqqVHtA" },
  { id: 'tumsehi', title: "Tum Se Hi", artist: "Mohit Chauhan", vibe: "Soft Rain & Road Trips 🌧️", ytId: "cbTKYt8fTvg" },
  { id: 'lover', title: "Lover", artist: "Taylor Swift", vibe: "Candlelight & Coffee ☕", ytId: "-BjZmE2gtdo" },
  { id: 'kesariya', title: "Kesariya", artist: "Arijit Singh", vibe: "Pure Heart Romance 🧡", ytId: "BddP6PYo2gs" },
  { id: 'apnabanale', title: "Apna Bana Le", artist: "Arijit Singh", vibe: "Warm Hugs & Whispers 🫂", ytId: "ElZfdU54Cp8" },
  { id: 'perfect', title: "Perfect", artist: "Ed Sheeran", vibe: "Dancing Under Stars 🌟", ytId: "2Vv-BfVoq4g" },
  { id: 'matargashti', title: "Matargashti", artist: "Mohit Chauhan", vibe: "Silly Pout & Banter 🤪", ytId: "6vKucgAeF_Q" },
  { id: 'cardigan', title: "Cardigan", artist: "Taylor Swift", vibe: "Cozy Weather & Warm Tea 🍂", ytId: "K-a8s8OLBSE" },
  { id: 'peeloon', title: "Pee Loon", artist: "Mohit Chauhan", vibe: "Soulful Eyes & Dimples 🌸", ytId: "yW8D_u2v0-w" },
  { id: 'untilifoundyou', title: "Until I Found You", artist: "Stephen Sanchez", vibe: "Retro Slow Dance 🕊️", ytId: "GxldQ9eX2wo" },
  { id: 'goldenhour', title: "Golden Hour", artist: "JVKE", vibe: "Your Face in Sunset Glow 🌅", ytId: "PEM0Vs8jf1w" },
  { id: 'raataan', title: "Raataan Lambiyan", artist: "Jubin Nautiyal & Asees Kaur", vibe: "Late Night Calls 🌙", ytId: "gvyUuxdRdR4" }
];

let selectedSongIndex = 0;

// --- DYNAMIC AI PHOTO VIBE COMPLIMENTS (100% Genuine AI Flattery - No chat quotes!) ---
const AI_PHOTO_COMPLIMENTS = {
  radiant: {
    label: "✨ Golden Hour & Radiant Glow",
    compliments: [
      "Nazar na lage! Is photo me jo natural glow aur genuine smile hai, screen par aate hi din bana deti hai. 📸✨",
      "Screen brightness full karne ki zaroorat hi nahi, is photo ka apna hi ek alag warm aur positive aura hai! ☀️💛",
      "Aisi candid smile jo poore room ki energy ek second me brighten kar de. Pure visual sunshine! 🌻✨",
      "Effortless charm aur natural warmth ka sabse pyara example. 10/10 visual perfection! 🌟",
      "Is photo me jo innocence aur softness hai, lagta hai jaise waqt ek pal ke liye yahin thehar gaya ho. 🕊️💫",
      "Photogenic hone ki bhi ek limit hoti hai, par is photo ne toh saare rules hi tod diye! So captivating. 📸💖",
      "Ek taraf poori duniya ka shor, aur ek taraf yeh peaceful aur pyaari si smile. Total stress buster! 🥰🌷",
      "Sunlight bhi blush kar jaye aisi natural radiance dekh kar. Absolutely glowing! ☀️💖"
    ]
  },
  cinematic: {
    label: "🎬 Cinematic Elegance & Depth",
    compliments: [
      "Aankhon me ek alag hi noor aur depth hai... bilkul kisi classic romantic movie ka cinematic shot lag raha hai! 🎬💫",
      "Frame itna elegant hai ki Pinterest aur magazines wale bhi moodboard me save kar lein! Truly a masterpiece. 🎨🌸",
      "Main character energy at its peak! Poore frame me bas ek hi cheez highlight ho rahi hai — your stunning presence. 👑✨",
      "Simplicity aur grace ka itna perfect combination bohot kam dekhne ko milta hai. Breathtaking! 🌷❤️",
      "Natural facial features, expressive eyes aur subtle confidence... kisi filter ki zaroorat hi nahi! 🌿🌸",
      "Royal charm aur timeless aesthetic. Camera captured not just a picture, but an absolute emotion. 💎✨",
      "Har frame me ek story hoti hai, par is tasveer me poora ek peaceful universe basa hua hai. 📖🕊️"
    ]
  },
  soulmate: {
    label: "🫂 Soulmate Chemistry & Togetherness",
    compliments: [
      "Dono ke chehre par jo sukoon aur genuine happiness dikh rahi hai, wahi sacche pyaar ki sabse pyari pehchaan hai. 🫂❤️",
      "Yeh photo nahi, do dilon ke beech ka ek khubsurat lamha hai jo hamesha ke liye freeze ho gaya. ⏳💖",
      "Is picture ki warmth aisi hai jaise sard mausam me garam coffee aur kisi khaas ka haath. ☕❄️",
      "Jab do dil ek doosre ke liye bane hon, toh unki tasveerein khud-b-khud bolti hain. Pure magic! ✨💍",
      "Togetherness at its purest! Yeh memory scrapbook ke sabse special page par decorate honi chahiye. 📖💖",
      "Dono ki chemistry dekh kar camera bhi muskura utha. Unfiltered, pure romance! 🌹✨",
      "Frame me ek aisi warmth aur understanding hai jo sirf do sacche humsafar hi create kar sakte hain. 🕊️💑"
    ]
  },
  playful: {
    label: "🤪 Playful Charm & Sweet Mischief",
    compliments: [
      "Excuse me! Itna effortlessly cute aur playful hona illegal hona chahiye. Dil churaane ka pura plan hai kya? 😉💘",
      "Expression itna pyara aur naughty ki koi kitna bhi gusse me ho, dekh kar turant smile aa hi jaye! 🍭✨",
      "Chehre par wahi masoom shararat jo har roz ek nayi khushi laati hai! Total heart-melter. 🤪🌸",
      "Cutest candid on the internet today! Ek national award toh banta hai is expression ke liye. 🏆💖",
      "Thodi si shararat, bohot saara charm aur 100% pure cuteness! Irresistible vibe. 🍬✨",
      "Yeh pyaara sa expression dekh kar kisi ki bhi har galti maaf ho jaye! 🥺❤️"
    ]
  },
  cozy: {
    label: "☕ Cozy Comfort & Aesthetic Peace",
    compliments: [
      "Is photo se aane wali cozy coffee date aur soft breeze wali vibe seedha dil ko chhooti hai. ☕🍂",
      "Slow romantic music, peaceful evening aur aisi sweet memory... zindagi ke sabse anmol lamhe yahi hote hain. 🎶🕊️",
      "Aesthetic level: Maximum cozy! Is photo ko dekh kar ek gentle sukoon aur warmth milti hai. 🧸💖",
      "Simplicity is the ultimate elegance, aur yeh photo usi ka live proof hai. Soft, sweet & serene. 🌿🕊️",
      "Har tasveer kuch kehti hai, par yeh tasveer ek pyari si thandi hawa ke jhonke jaisi hai. 🍃💫"
    ]
  }
};

let currentDetectedVibe = 'radiant';
let currentComplimentText = '';
let lastCompliment = '';

// --- AUDIO SYNTHESIZER FOR HAPTIC CHIMES & HEARTBEATS ---
function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTone(freq, duration = 0.3, type = 'sine', gainVal = 0.1) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(gainVal, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {}
}

function playHeartbeatSound() {
  playTone(65, 0.18, 'sine', 0.25);
  setTimeout(() => playTone(55, 0.22, 'sine', 0.2), 160);
}

function playCelebrationChime() {
  playTone(523.25, 0.4); // C5
  setTimeout(() => playTone(659.25, 0.4), 100); // E5
  setTimeout(() => playTone(783.99, 0.6), 200); // G5
  setTimeout(() => playTone(1046.50, 0.8), 300); // C6
}

// --- DEFAULT FRESH STATE (Fallback for GitHub Pages & Offline) ---
const DEFAULT_APP_STATE = {
  profiles: {
    himanshu: { name: "Himanshu", emoji: "☕", nickname: "Coffee Partner" },
    gullu: { name: "Gullu", emoji: "🌸", nickname: "Pout Queen 🐷" }
  },
  stats: {
    startDate: "2026-10-03",
    coffeeDatesCount: 0,
    poutsLoggedCount: 0,
    scoldingsCount: 0
  },
  currentMoods: {
    himanshu: { mood: "coffee", text: "Ready for our first story! ☕", time: "Just now" },
    gullu: { mood: "romantic", text: "Our Story begins today! ✨", time: "Just now" }
  },
  currentQA: {
    id: 1,
    date: "2026-10-03",
    question: "Agar hum dono ek kamre me band ho jayein aur chabhi kho jaye, toh sabse pehli cheez kya karenge? 😉🗝️",
    category: "Romantic & Naughty",
    answers: {
      himanshu: null,
      gullu: null
    }
  },
  pastQAs: [],
  coupons: [
    { id: "c1", title: "Gullu Won The Argument Pass ⚖️", desc: "Valid for 24 hours — no counter-arguments allowed. Gullu is 100% right!", forUser: "gullu", redeemed: false },
    { id: "c2", title: "Unlimited Coffee On Himanshu ☕", desc: "Bill on Himanshu, coffee of Gullu's choice. Redeemable at any cafe!", forUser: "gullu", redeemed: false },
    { id: "c3", title: "1 Tight Hug on Demand 🫂", desc: "No questions asked. Redeemable anytime, anywhere.", forUser: "both", redeemed: false },
    { id: "c4", title: "Late Night Ice-Cream & Drive 🍦", desc: "Midnight dessert run to Gullu's favorite spot under the stars.", forUser: "both", redeemed: false },
    { id: "c5", title: "Stop Scolding Me for 1 Hour 🤫", desc: "Himanshu's emergency shield against Gullu's cute scoldings.", forUser: "himanshu", redeemed: false },
    { id: "c6", title: "Hum Tum Ek Kamre Me Pass 🗝️", desc: "Recreate our special daydream: Just you and me, zero distractions.", forUser: "both", redeemed: false }
  ],
  memories: [],
  pulses: [],
  locations: {
    himanshu: null,
    gullu: null
  },
  chatMessages: [
    {
      id: "msg_init_welcome",
      sender: "system",
      senderName: "Our Story ✨",
      text: "Aapka aur Gullu ka private couple chat space! Kuch meetha likh kar shuru karein... 💌",
      timestamp: Date.now() - 3600000,
      type: "text"
    }
  ]
};

// --- PERMANENT COUPLE DATA STORAGE (NEVER DELETED ON UPDATES) ---
const PERMANENT_STORAGE_KEY = 'our_story_persistent_data';
const CURRENT_APP_VERSION = '1.9.5';

const NOTIFICATION_DEDUPE_KEY = 'our_story_shown_notification_ids';

function getShownNotificationIds() {
  try {
    const raw = localStorage.getItem(NOTIFICATION_DEDUPE_KEY);
    if (raw) return new Set(JSON.parse(raw));
  } catch (e) {}
  return new Set();
}

function recordNotificationShown(id) {
  if (!id) return;
  try {
    const set = getShownNotificationIds();
    set.add(String(id));
    const arr = Array.from(set).slice(-150);
    localStorage.setItem(NOTIFICATION_DEDUPE_KEY, JSON.stringify(arr));
  } catch (e) {}
}

function hasAlreadyShownNotification(id) {
  if (!id) return false;
  return getShownNotificationIds().has(String(id));
}

function normalizeArray(val) {
  if (Array.isArray(val)) return val;
  if (val && typeof val === 'object') return Object.values(val);
  return [];
}

function sanitizeAppStateArrays(state) {
  if (!state || typeof state !== 'object') return state;
  state.memories = normalizeArray(state.memories);
  state.coupons = normalizeArray(state.coupons);
  state.pulses = normalizeArray(state.pulses);
  state.chatMessages = normalizeArray(state.chatMessages || state.chat_messages);
  state.pastQAs = normalizeArray(state.pastQAs);
  return state;
}

// Retrieve stored state with backward compatibility for all legacy versions
function getStoredCoupleData() {
  try {
    const primary = localStorage.getItem(PERMANENT_STORAGE_KEY);
    if (primary) {
      const data = sanitizeAppStateArrays(JSON.parse(primary));
      // Cleanup stale test locations older than 6 hours so partner location is not stuck with identical coordinates
      if (data && data.locations) {
        const now = Date.now();
        if (data.locations.gullu && data.locations.gullu.timestamp && (now - data.locations.gullu.timestamp > 21600000)) {
          data.locations.gullu = null;
        }
        if (data.locations.himanshu && data.locations.himanshu.timestamp && (now - data.locations.himanshu.timestamp > 21600000)) {
          data.locations.himanshu = null;
        }
      }
      return data;
    }

    // Migration fallback across all previous versions so NO previous memories/coupons are lost
    const legacyKeys = [
      'our_story_cache_v6',
      'our_story_cache_v5',
      'our_story_cache_v4',
      'our_story_cache_v3',
      'our_story_cache_v2',
      'our_story_cache'
    ];
    for (const key of legacyKeys) {
      const data = localStorage.getItem(key);
      if (data) {
        try {
          const parsed = JSON.parse(data);
          if (parsed && (parsed.memories || parsed.coupons || parsed.currentQA)) {
            const sanitized = sanitizeAppStateArrays(parsed);
            localStorage.setItem(PERMANENT_STORAGE_KEY, JSON.stringify(sanitized));
            return sanitized;
          }
        } catch (e) {}
      }
    }
  } catch (err) {
    console.warn('Storage read warning:', err);
  }
  return null;
}

function saveAppState(newState) {
  if (!newState) return;
  sanitizeAppStateArrays(newState);
  appState = newState;
  try {
    localStorage.setItem(PERMANENT_STORAGE_KEY, JSON.stringify(appState));
  } catch (e) {
    console.warn('LocalStorage save failed:', e);
  }
}

// Merge server and local states without losing any memories, answers, or coupons
function mergePreservingUserData(local, incoming) {
  if (!local) return sanitizeAppStateArrays(incoming);
  if (!incoming) return sanitizeAppStateArrays(local);

  const merged = { ...incoming };

  // 1. Preserve memories (Union by id)
  const localMems = normalizeArray(local.memories);
  const incMems = normalizeArray(incoming.memories);
  const memMap = new Map();
  incMems.forEach(m => { if (m && m.id) memMap.set(m.id, m); });
  localMems.forEach(m => { if (m && m.id) memMap.set(m.id, m); });
  merged.memories = Array.from(memMap.values());

  // 2. Preserve coupons (Union by id)
  const localCoupons = normalizeArray(local.coupons);
  const incCoupons = normalizeArray(incoming.coupons);
  const coupMap = new Map();
  incCoupons.forEach(c => { if (c && c.id) coupMap.set(c.id, c); });
  localCoupons.forEach(c => { if (c && c.id) coupMap.set(c.id, c); });
  merged.coupons = Array.from(coupMap.values());

  // 3. Preserve Q&A Answers
  if (local.currentQA && incoming.currentQA) {
    merged.currentQA = { ...incoming.currentQA };
    merged.currentQA.answers = {
      himanshu: incoming.currentQA.answers?.himanshu || local.currentQA.answers?.himanshu || null,
      gullu: incoming.currentQA.answers?.gullu || local.currentQA.answers?.gullu || null
    };
  }

  // 4. Preserve Moods
  if (local.currentMoods && incoming.currentMoods) {
    merged.currentMoods = {
      himanshu: incoming.currentMoods.himanshu || local.currentMoods.himanshu,
      gullu: incoming.currentMoods.gullu || local.currentMoods.gullu
    };
  }

  // 5. Preserve Locations (Freshest GPS timestamp wins, but never resurrect expired/cleared locations)
  if (local.locations || incoming.locations) {
    const incH = incoming.locations?.himanshu;
    const locH_local = local.locations?.himanshu;
    const incG = incoming.locations?.gullu;
    const locG_local = local.locations?.gullu;

    const isLocalHFresh = locH_local && (Date.now() - (locH_local.timestamp || 0) < 21600000);
    const isLocalGFresh = locG_local && (Date.now() - (locG_local.timestamp || 0) < 21600000);

    const locH = ((incH?.timestamp || 0) >= (locH_local?.timestamp || 0))
      ? (incH || (isLocalHFresh ? locH_local : null))
      : (isLocalHFresh ? locH_local : incH);

    const locG = ((incG?.timestamp || 0) >= (locG_local?.timestamp || 0))
      ? (incG || (isLocalGFresh ? locG_local : null))
      : (isLocalGFresh ? locG_local : incG);

    merged.locations = { himanshu: locH || null, gullu: locG || null };
  }

  // 6. Preserve Pulses (Union by id/timestamp, sorted newest first)
  const localPulses = normalizeArray(local.pulses);
  const incPulses = normalizeArray(incoming.pulses);
  const pulseMap = new Map();
  incPulses.forEach(p => { if (p) pulseMap.set(p.id || (p.timestamp + '_' + p.from), p); });
  localPulses.forEach(p => { if (p) pulseMap.set(p.id || (p.timestamp + '_' + p.from), p); });
  merged.pulses = Array.from(pulseMap.values()).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)).slice(0, 50);

  // 7. Preserve Chat Messages (Union by id, sorted by timestamp)
  const localMsgs = normalizeArray(local.chatMessages || local.chat_messages);
  const incMsgs = normalizeArray(incoming.chatMessages || incoming.chat_messages);
  const msgMap = new Map();
  incMsgs.forEach(m => { if (m && m.id) msgMap.set(m.id, m); });
  localMsgs.forEach(m => { if (m && m.id) msgMap.set(m.id, m); });
  merged.chatMessages = Array.from(msgMap.values()).sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0)).slice(-200);

  return sanitizeAppStateArrays(merged);
}

async function fetchState() {
  // 1. Ensure we have state immediately so UI never blocks and data is instant
  if (!appState) {
    const stored = getStoredCoupleData();
    if (stored) {
      appState = stored;
    } else {
      appState = JSON.parse(JSON.stringify(DEFAULT_APP_STATE));
    }
    renderAll();
  }

  // 2. Fetch from server (if server active) and merge safely
  try {
    const res = await fetch('/api/state?t=' + Date.now());
    if (res.ok) {
      const serverState = await res.json();
      if (serverState && serverState.stats) {
        const merged = mergePreservingUserData(appState, serverState);
        saveAppState(merged);
        renderAll();
      }
    }
  } catch (e) {
    // Running on static host (e.g. GitHub Pages) or offline, local persistent data remains intact!
  }
}

// --- RENDER ALL SECTIONS ---
function renderAll() {
  try { renderHeader(); } catch (e) { console.error('renderHeader failed:', e); }
  try { renderVaultFeed(); } catch (e) { console.error('renderVaultFeed failed:', e); }
  try { renderQA(); } catch (e) { console.error('renderQA failed:', e); }
  try { renderCoupons(); } catch (e) { console.error('renderCoupons failed:', e); }
  try { renderPulseHistory(); } catch (e) { console.error('renderPulseHistory failed:', e); }
  try { renderMoods(); } catch (e) { console.error('renderMoods failed:', e); }
  try { updateCoupleLocationsUI(); } catch (e) { console.error('updateCoupleLocationsUI failed:', e); }
  try { renderChatUI(); } catch (e) { console.error('renderChatUI failed:', e); }
}

// ==========================================================================
// REAL-TIME CLOUD (MQTT WSS) & CROSS-TAB SYNC ENGINE
// ==========================================================================

const SYNC_BROKER_HOST = 'broker.emqx.io';
const SYNC_BROKER_PORT = 8084;
const SYNC_BROKER_PATH = '/mqtt';
const SYNC_TOPIC_PREFIX = 'ourstory/himanshu_gullu_2026/';

let mqttClient = null;
let isMqttConnected = false;
const crossTabChannel = ('BroadcastChannel' in window) ? new BroadcastChannel('our_story_sync_channel') : null;
let lastAcknowledgedPulseId = localStorage.getItem('our_story_last_pulse_ack') || null;

// ==========================================================================
// FIREBASE REALTIME CLOUD DATABASE ENGINE
// ==========================================================================

let firebaseApp = null;
let firebaseDb = null;
let isFirebaseConnected = false;

const DEFAULT_FIREBASE_CONFIG = {
  databaseURL: 'https://our-story-71a36-default-rtdb.firebaseio.com',
  projectId: 'our-story-71a36'
};

function getStoredFirebaseConfig() {
  try {
    const raw = localStorage.getItem('our_story_firebase_config');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return window.FIREBASE_CONFIG || DEFAULT_FIREBASE_CONFIG;
}

function initFirebaseDatabase() {
  const config = getStoredFirebaseConfig();
  const statusPill = document.getElementById('firebaseStatusPill');
  const statusText = document.getElementById('fbPillText');
  const banner = document.getElementById('firebaseStatusBanner');
  const bannerText = document.getElementById('firebaseBannerText');

  if (!config || !config.databaseURL) {
    if (statusPill) statusPill.classList.remove('connected');
    if (statusText) statusText.textContent = 'Cloud DB';
    if (banner) banner.classList.remove('connected');
    if (bannerText) bannerText.textContent = 'Status: Not Connected (Tap to Setup)';

    // Auto-probe firebase-config.json if deployed with one
    fetch('firebase-config.json')
      .then(r => r.ok ? r.json() : null)
      .then(extConfig => {
        if (extConfig && extConfig.databaseURL && !extConfig.databaseURL.includes('YOUR-PROJECT-ID')) {
          localStorage.setItem('our_story_firebase_config', JSON.stringify(extConfig));
          initFirebaseDatabase();
        }
      })
      .catch(() => {});
    return;
  }

  let dbUrl = config.databaseURL.trim().replace(/\/$/, '');
  if (!dbUrl.startsWith('http')) dbUrl = 'https://' + dbUrl;

  // 1. If Firebase compat SDK is loaded
  if (typeof firebase !== 'undefined' && firebase.initializeApp) {
    try {
      if (!firebase.apps || firebase.apps.length === 0) {
        firebaseApp = firebase.initializeApp({
          databaseURL: dbUrl,
          apiKey: config.apiKey || undefined,
          projectId: config.projectId || undefined
        });
      } else {
        firebaseApp = firebase.apps[0];
      }
      firebaseDb = firebase.database();
      isFirebaseConnected = true;

      if (statusPill) {
        statusPill.classList.add('connected');
        statusPill.title = 'Firebase Cloud DB: Connected & Synced 🔥';
      }
      if (statusText) statusText.textContent = 'Firebase Live 🔥';
      if (banner) banner.classList.add('connected');
      if (bannerText) bannerText.textContent = 'Status: Connected to Google Firebase Cloud DB 🔥';

      setupFirebaseRealtimeListeners();
      syncInitialStateFromFirebase();
    } catch (err) {
      console.warn('Firebase SDK init warning:', err);
    }
  }

  // 2. Active Parallel REST Sync Engine (Fail-safe polling for mobile browsers & background states)
  initFirebaseRestSync(dbUrl);
}

function setupFirebaseRealtimeListeners() {
  if (!firebaseDb) return;

  firebaseDb.ref('our_story/currentMoods').on('value', (snapshot) => {
    const moods = snapshot.val();
    if (moods) {
      const partnerKey = currentUser === 'himanshu' ? 'gullu' : 'himanshu';
      const partnerMood = moods[partnerKey];
      const prevPartnerMood = appState && appState.currentMoods ? appState.currentMoods[partnerKey] : null;

      if (!appState) appState = JSON.parse(JSON.stringify(DEFAULT_APP_STATE));
      appState.currentMoods = moods;
      saveAppState(appState);
      renderMoods();
      renderHeader();

      // Trigger instant alert if partner's mood is fresh (within 2 mins)
      if (partnerMood && (!prevPartnerMood || prevPartnerMood.text !== partnerMood.text || prevPartnerMood.mood !== partnerMood.mood)) {
        if (partnerMood.timestamp && (Date.now() - partnerMood.timestamp < 120000)) {
          showPartnerMoodToast({ user: partnerKey, ...partnerMood });
          sendSystemNotificationForMood({ user: partnerKey, ...partnerMood });
        }
      }
    }
  });

  // 1. Dedicated Realtime Listener on our_story/latestPulse (Fires within 50ms for live heartbeats)
  firebaseDb.ref('our_story/latestPulse').on('value', (snapshot) => {
    const pulse = snapshot.val();
    if (!pulse) return;
    const myName = currentUser === 'himanshu' ? 'Himanshu' : 'Gullu';
    const isFromOtherDevice = pulse.deviceId && pulse.deviceId !== myDeviceId;
    const isFromPartner = pulse.from && pulse.from.toLowerCase() !== myName.toLowerCase();

    if (isFromPartner || isFromOtherDevice) {
      const pulseId = pulse.id || ('pulse_' + pulse.timestamp);
      const lastAck = localStorage.getItem('our_story_last_pulse_ack');
      if (pulseId !== lastAck && pulseId !== lastAcknowledgedPulseId && !hasAlreadyShownNotification(pulseId)) {
        const timeDiff = Math.abs(Date.now() - (pulse.timestamp || 0));
        // Strict freshness guard: only notify if sent in the last 90 seconds
        if (pulse.timestamp && timeDiff < 90000) {
          handleIncomingPulse(pulse);
        }
      }
    }
  });

  // 2. Listen for child_added in pulses list - ONLY silently update history list, never duplicate alerts!
  firebaseDb.ref('our_story/pulses').limitToLast(5).on('child_added', (snapshot) => {
    const pulse = snapshot.val();
    if (!pulse) return;
    if (!appState) appState = JSON.parse(JSON.stringify(DEFAULT_APP_STATE));
    if (!Array.isArray(appState.pulses)) {
      appState.pulses = normalizeArray(appState.pulses);
    }
    const pulseId = pulse.id || ('pulse_' + (pulse.timestamp || Date.now()));
    const exists = appState.pulses.some(p => p.id === pulseId || (p.timestamp && p.timestamp === pulse.timestamp));
    if (!exists) {
      appState.pulses.unshift(pulse);
      if (appState.pulses.length > 25) appState.pulses.pop();
      saveAppState(appState);
      renderPulseHistory();
    }
  });

  // 3. Realtime Listener on our_story/locations (Himanshu & Gullu GPS Radar)
  firebaseDb.ref('our_story/locations').on('value', (snapshot) => {
    const locs = snapshot.val() || {};
    if (!appState) appState = JSON.parse(JSON.stringify(DEFAULT_APP_STATE));
    appState.locations = {
      himanshu: locs.himanshu || null,
      gullu: locs.gullu || null
    };
    saveAppState(appState);
    updateCoupleLocationsUI();
  });

  firebaseDb.ref('our_story/currentQA').on('value', (snapshot) => {
    const qa = snapshot.val();
    if (qa) {
      if (!appState) appState = JSON.parse(JSON.stringify(DEFAULT_APP_STATE));
      appState.currentQA = qa;
      saveAppState(appState);
      renderQA();
    }
  });

  firebaseDb.ref('our_story/coupons').on('value', (snapshot) => {
    const coupons = snapshot.val();
    if (coupons && Array.isArray(coupons)) {
      if (!appState) appState = JSON.parse(JSON.stringify(DEFAULT_APP_STATE));
      appState.coupons = coupons;
      saveAppState(appState);
      renderCoupons();
    }
  });

  firebaseDb.ref('our_story/memories').on('value', (snapshot) => {
    const mems = snapshot.val();
    if (mems) {
      const arr = Array.isArray(mems) ? mems : Object.values(mems);
      if (arr.length > 0) {
        if (!appState) appState = JSON.parse(JSON.stringify(DEFAULT_APP_STATE));
        appState.memories = arr;
        saveAppState(appState);
        renderVaultFeed();
      }
    }
  });

  firebaseDb.ref('our_story/chat_messages').limitToLast(50).on('child_added', (snapshot) => {
    const msg = snapshot.val();
    if (msg && msg.id) {
      handleIncomingChatMessage(msg, false);
    }
  });

  // 6. Realtime WebRTC Private Video Call Signaling
  firebaseDb.ref('our_story/webrtc_call/callMeta').on('value', (snapshot) => {
    const callMeta = snapshot.val();
    if (callMeta) {
      handleIncomingVCSignal(callMeta);
    }
  });
}

function syncInitialStateFromFirebase() {
  if (!firebaseDb) return;
  firebaseDb.ref('our_story').once('value').then((snapshot) => {
    const cloudData = snapshot.val();
    if (cloudData) {
      appState = mergePreservingUserData(appState, cloudData);
      saveAppState(appState);
      renderAll();
      console.log('Firebase Cloud State synced successfully! 💖');
    } else {
      firebaseDb.ref('our_story').set(appState);
    }
  }).catch((e) => console.warn('Firebase initial read failed:', e));
}

function fetchLatestCloudSync() {
  const config = getStoredFirebaseConfig();
  if (!config || !config.databaseURL) return;
  const dbUrl = config.databaseURL.trim().replace(/\/$/, '');

  // 1. Fetch Latest Heartbeat Pulse
  fetch(`${dbUrl}/our_story/latestPulse.json?t=` + Date.now())
    .then(r => r.ok ? r.json() : null)
    .then(pulse => {
      if (!pulse) return;
      const myName = currentUser === 'himanshu' ? 'Himanshu' : 'Gullu';
      const isFromOtherDevice = pulse.deviceId && pulse.deviceId !== myDeviceId;
      const isFromPartner = pulse.from && pulse.from.toLowerCase() !== myName.toLowerCase();

      if (isFromPartner || isFromOtherDevice) {
        const lastAck = localStorage.getItem('our_story_last_pulse_ack');
        if (pulse.id && pulse.id !== lastAck) {
          const timeDiff = Math.abs(Date.now() - (pulse.timestamp || 0));
          if (timeDiff < 600000 || !pulse.timestamp) {
            handleIncomingPulse(pulse);
          }
        }
      }
    })
    .catch(() => {});

  // 2. Fetch Latest Chat Messages (Clean JSON fetch without buggy limitToLast)
  fetch(`${dbUrl}/our_story/chat_messages.json?t=` + Date.now())
    .then(r => r.ok ? r.json() : null)
    .then(msgs => {
      if (!msgs) return;
      const msgList = Object.values(msgs);
      msgList.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
      msgList.forEach(m => handleIncomingChatMessage(m, false));
    })
    .catch(() => {});
}

function initFirebaseRestSync(dbUrl) {
  const statusPill = document.getElementById('firebaseStatusPill');
  const statusText = document.getElementById('fbPillText');
  const banner = document.getElementById('firebaseStatusBanner');
  const bannerText = document.getElementById('firebaseBannerText');

  fetch(`${dbUrl}/our_story.json`)
    .then(r => r.json())
    .then(cloudData => {
      isFirebaseConnected = true;
      if (statusPill) statusPill.classList.add('connected');
      if (statusText) statusText.textContent = 'Firebase Live 🔥';
      if (banner) banner.classList.add('connected');
      if (bannerText) bannerText.textContent = 'Status: Connected to Google Firebase Cloud DB 🔥';

      if (cloudData) {
        appState = mergePreservingUserData(appState, cloudData);
        saveAppState(appState);
        renderAll();
      } else {
        fetch(`${dbUrl}/our_story.json`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(appState)
        });
      }
    })
    .catch(err => {
      console.warn('Firebase REST sync warning:', err);
    });

  // Background Realtime Pulse Poller (Only active as fallback if Firebase WebSocket SDK is not connected)
  setInterval(() => {
    if (isFirebaseConnected && firebaseDb) return; // SDK WebSocket already provides 50ms live updates
    fetch(`${dbUrl}/our_story/latestPulse.json?t=` + Date.now())
      .then(r => r.ok ? r.json() : null)
      .then(pulse => {
        if (!pulse) return;
        const myName = currentUser === 'himanshu' ? 'Himanshu' : 'Gullu';
        const isFromOtherDevice = pulse.deviceId && pulse.deviceId !== myDeviceId;
        const isFromPartner = pulse.from && pulse.from.toLowerCase() !== myName.toLowerCase();

        if (isFromPartner || isFromOtherDevice) {
          const pulseId = pulse.id || ('pulse_' + pulse.timestamp);
          const lastAck = localStorage.getItem('our_story_last_pulse_ack');
          if (pulseId !== lastAck && pulseId !== lastAcknowledgedPulseId && !hasAlreadyShownNotification(pulseId)) {
            const timeDiff = Math.abs(Date.now() - (pulse.timestamp || 0));
            if (pulse.timestamp && timeDiff < 90000) {
              handleIncomingPulse(pulse);
            }
          }
        }
      })
      .catch(() => {});
  }, 3500);

  // Background Chat messages poller (Every 2.5s - Fix: no limitToLast query error)
  setInterval(() => {
    fetch(`${dbUrl}/our_story/chat_messages.json?t=` + Date.now())
      .then(r => r.ok ? r.json() : null)
      .then(msgs => {
        if (!msgs) return;
        const msgList = Object.values(msgs);
        msgList.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
        msgList.forEach(m => handleIncomingChatMessage(m, false));
      })
      .catch(() => {});
  }, 2500);

  // Background Location Poller (Every 6s for Radar & Distance)
  setInterval(() => {
    fetch(`${dbUrl}/our_story/locations.json?t=` + Date.now())
      .then(r => r.ok ? r.json() : null)
      .then(locs => {
        const parsedLocs = locs || {};
        if (!appState) appState = JSON.parse(JSON.stringify(DEFAULT_APP_STATE));
        appState.locations = {
          himanshu: parsedLocs.himanshu || null,
          gullu: parsedLocs.gullu || null
        };
        saveAppState(appState);
        updateCoupleLocationsUI();
      })
      .catch(() => {});
  }, 4000);
}

function syncToFirebase(type, data) {
  const config = getStoredFirebaseConfig();
  if (!config || !config.databaseURL) return;

  const dbUrl = config.databaseURL.trim().replace(/\/$/, '');

  if (firebaseDb) {
    try {
      if (type === 'MOOD_UPDATE') {
        firebaseDb.ref('our_story/currentMoods/' + data.user).set(data);
      } else if (type === 'PULSE_SENT') {
        firebaseDb.ref('our_story/latestPulse').set(data);
        firebaseDb.ref('our_story/pulses').push(data);
      } else if (type === 'LOCATION_UPDATE') {
        firebaseDb.ref('our_story/locations/' + data.user).set(data);
      } else if (type === 'LOCATION_CLEAR') {
        firebaseDb.ref('our_story/locations/' + data.user).remove();
      } else if (type === 'QA_ANSWER') {
        firebaseDb.ref('our_story/currentQA/answers/' + data.user).set(data.answer);
      } else if (type === 'QA_NEW') {
        firebaseDb.ref('our_story/currentQA').set(data.newQA);
        if (data.pastQA) firebaseDb.ref('our_story/pastQAs').push(data.pastQA);
      } else if (type.startsWith('COUPON_')) {
        firebaseDb.ref('our_story/coupons').set(appState.coupons);
      } else if (type === 'MEMORY_ADD') {
        firebaseDb.ref('our_story/memories').set(appState.memories);
      } else if (type === 'CHAT_MESSAGE') {
        firebaseDb.ref('our_story/chat_messages/' + data.id).set(data);
      } else if (type === 'VC_SIGNAL' || type === 'VC_CALL') {
        firebaseDb.ref('our_story/webrtc_call/callMeta').set(data);
      }
    } catch (e) {
      console.warn('Firebase SDK write error:', e);
    }
  }

  // 2. Parallel Direct HTTPS REST API write (Guarantees delivery over port 443 even if WebSocket drops)
  try {
    let endpoint = `${dbUrl}/our_story`;
    let method = 'PATCH';
    let body = {};

    if (type === 'MOOD_UPDATE') {
      endpoint += `/currentMoods/${data.user}.json`;
      method = 'PUT';
      body = data;
    } else if (type === 'PULSE_SENT') {
      fetch(`${dbUrl}/our_story/latestPulse.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).catch(() => {});
      endpoint += `/pulses.json`;
      method = 'POST';
      body = data;
    } else if (type === 'LOCATION_UPDATE') {
      endpoint += `/locations/${data.user}.json`;
      method = 'PUT';
      body = data;
    } else if (type === 'LOCATION_CLEAR') {
      endpoint += `/locations/${data.user}.json`;
      method = 'DELETE';
      body = null;
    } else if (type === 'QA_ANSWER') {
      endpoint += `/currentQA/answers/${data.user}.json`;
      method = 'PUT';
      body = JSON.stringify(data.answer);
    } else if (type === 'QA_NEW') {
      endpoint += `/currentQA.json`;
      method = 'PUT';
      body = data.newQA;
    } else if (type.startsWith('COUPON_')) {
      endpoint += `/coupons.json`;
      method = 'PUT';
      body = appState.coupons;
    } else if (type === 'MEMORY_ADD') {
      endpoint += `/memories.json`;
      method = 'PUT';
      body = appState.memories;
    } else if (type === 'CHAT_MESSAGE') {
      endpoint += `/chat_messages/${data.id}.json`;
      method = 'PUT';
      body = data;
    } else if (type === 'VC_SIGNAL' || type === 'VC_CALL') {
      endpoint += `/webrtc_call/callMeta.json`;
      method = 'PUT';
      body = data;
    }

    fetch(endpoint, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: typeof body === 'string' ? body : JSON.stringify(body)
    }).catch(() => {});
  } catch (err) {}
}

function setupFirebaseModal() {
  const statusPill = document.getElementById('firebaseStatusPill');
  const modal = document.getElementById('firebaseSetupModal');
  const closeBtn = document.getElementById('closeFirebaseModalBtn');
  const saveBtn = document.getElementById('saveFirebaseConfigBtn');
  const testBtn = document.getElementById('testFirebaseBtn');
  const dbUrlInput = document.getElementById('fbDbUrlInput');
  const apiKeyInput = document.getElementById('fbApiKeyInput');

  const config = getStoredFirebaseConfig();
  if (config) {
    if (dbUrlInput) dbUrlInput.value = config.databaseURL || '';
    if (apiKeyInput) apiKeyInput.value = config.apiKey || '';
  }

  if (statusPill && modal) {
    statusPill.addEventListener('click', () => {
      modal.classList.remove('is-hidden');
      playTone(520, 0.1);
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.add('is-hidden');
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.add('is-hidden');
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const url = dbUrlInput.value.trim();
      const apiKey = apiKeyInput.value.trim();

      if (!url) {
        showAppModal('⚠️ URL Zaroori Hai', 'Kripya apni Firebase Realtime Database URL dalein (e.g. https://your-app-default-rtdb.firebaseio.com)');
        return;
      }

      const newConfig = {
        databaseURL: url,
        apiKey: apiKey || undefined,
        projectId: url.replace('https://', '').split('.')[0]
      };

      localStorage.setItem('our_story_firebase_config', JSON.stringify(newConfig));
      playCelebrationChime();
      modal.classList.add('is-hidden');
      showAppModal('🔥 Firebase Connected!', 'Firebase Realtime Database successfully connect ho gaya hai! Saari memories, moods aur heartbeats cloud me save rahengi.');

      initFirebaseDatabase();
    });
  }

  if (testBtn) {
    testBtn.addEventListener('click', async () => {
      const url = dbUrlInput.value.trim().replace(/\/$/, '');
      if (!url) {
        showAppModal('⚠️ Database URL missing', 'Pehle Realtime Database URL box me daalo!');
        return;
      }
      testBtn.textContent = 'Testing... ⏳';
      try {
        const res = await fetch(`${url}/.json?shallow=true`);
        testBtn.textContent = 'Test Connection ⚡';
        if (res.ok) {
          playCelebrationChime();
          showAppModal('✅ Connection Successful!', 'Google Firebase Cloud Database se connection verify ho gaya hai!');
        } else {
          showAppModal('⚠️ Permission Check', 'Database respond kar raha hai par rules check karein (Start in Test Mode recommended).');
        }
      } catch (err) {
        testBtn.textContent = 'Test Connection ⚡';
        showAppModal('❌ Connection Failed', `Could not reach ${url}. Kripya URL check karein.`);
      }
    });
  }
}

function initCloudSync() {
  updateSyncIndicator(false, 'Connecting to Live Cloud Sync...');

  // 1. Cross-tab BroadcastChannel listener (0ms on same phone/PC)
  if (crossTabChannel) {
    crossTabChannel.onmessage = (event) => {
      if (event.data) handleIncomingSyncMessage(event.data);
    };
  }

  // 2. Storage event listener (fallback for cross-tab)
  window.addEventListener('storage', (e) => {
    if (e.key === 'our_story_last_sync_event' && e.newValue) {
      try {
        const evt = JSON.parse(e.newValue);
        handleIncomingSyncMessage(evt);
      } catch (err) {}
    } else if (e.key === 'our_story_persistent_data' && e.newValue) {
      try {
        const fresh = JSON.parse(e.newValue);
        appState = fresh;
        renderAll();
      } catch (err) {}
    }
  });

  // 3. Connect to MQTT WebSocket Broker (Live Cloud Relay for GitHub Pages)
  if (typeof Paho === 'undefined' || !Paho.MQTT) {
    console.warn('Paho MQTT not loaded yet. Running in Local/Server sync mode.');
    updateSyncIndicator(false, 'Offline / Local Sync');
    return;
  }

  try {
    const clientId = 'ourstory_web_' + (currentUser || 'user') + '_' + Math.random().toString(36).substring(2, 8);
    mqttClient = new Paho.MQTT.Client(SYNC_BROKER_HOST, SYNC_BROKER_PORT, SYNC_BROKER_PATH, clientId);

    mqttClient.onConnectionLost = (responseObject) => {
      isMqttConnected = false;
      updateSyncIndicator(false, 'Reconnecting...');
      if (responseObject.errorCode !== 0) {
        console.log('MQTT Connection Lost:', responseObject.errorMessage);
        setTimeout(initCloudSync, 4000);
      }
    };

    mqttClient.onMessageArrived = (message) => {
      try {
        if (message.retained) {
          console.log('Skipping retained historical MQTT message');
          return;
        }
        const payload = JSON.parse(message.payloadString);
        handleIncomingSyncMessage(payload);
      } catch (e) {
        console.error('Error parsing sync message:', e);
      }
    };

    mqttClient.connect({
      useSSL: true,
      timeout: 6,
      keepAliveInterval: 30,
      cleanSession: true,
      onSuccess: () => {
        isMqttConnected = true;
        updateSyncIndicator(true, 'Live Sync Active ✨');
        console.log('Connected to EMQX Cloud Relay! Subscribing to couple topics...');
        // Subscribe to all topics under our couple prefix
        mqttClient.subscribe(SYNC_TOPIC_PREFIX + '#', { qos: 0 });
      },
      onFailure: (err) => {
        isMqttConnected = false;
        updateSyncIndicator(false, 'Sync Reconnecting...');
        console.log('MQTT connection failed, retrying in 8s:', err);
        setTimeout(initCloudSync, 8000);
      }
    });
  } catch (err) {
    console.error('MQTT init error:', err);
  }

  // 4. Local Server Poller (if running on node server)
  setInterval(async () => {
    try {
      const res = await fetch('/api/state?t=' + Date.now());
      if (res.ok) {
        const serverState = await res.json();
        if (serverState && serverState.stats) {
          const merged = mergePreservingUserData(appState, serverState);
          if (JSON.stringify(merged) !== JSON.stringify(appState)) {
            appState = merged;
            saveAppState(appState);
            renderAll();
          }
        }
      }
    } catch (e) {}
  }, 3500);
}

function updateSyncIndicator(online, text) {
  const pill = document.getElementById('liveSyncPill');
  if (!pill) return;
  if (online) {
    pill.classList.remove('offline');
    pill.title = text || 'Live Cloud Sync Connected';
    const label = pill.querySelector('.sync-label');
    if (label) label.textContent = 'Live';
  } else {
    pill.classList.add('offline');
    pill.title = text || 'Connecting...';
    const label = pill.querySelector('.sync-label');
    if (label) label.textContent = 'Sync';
  }
}

function broadcastUpdate(type, data, retain = false) {
  const payload = {
    type,
    data,
    sender: currentUser,
    timestamp: Date.now()
  };

  // 1. Cross-tab BroadcastChannel (0ms)
  if (crossTabChannel) {
    try { crossTabChannel.postMessage(payload); } catch (e) {}
  }

  // 2. Storage event
  try {
    localStorage.setItem('our_story_last_sync_event', JSON.stringify(payload));
  } catch (e) {}

  // 3. Cloud MQTT WebSocket
  if (mqttClient && isMqttConnected) {
    try {
      let subTopic = 'sync';
      if (type === 'PULSE_SENT') subTopic = 'pulse';
      else if (type === 'MOOD_UPDATE') subTopic = 'mood';
      else if (type === 'QA_ANSWER' || type === 'QA_NEW') subTopic = 'qa';
      else if (type.startsWith('COUPON_')) subTopic = 'coupon';
      else if (type === 'MEMORY_ADD') subTopic = 'memory';
      else if (type === 'LOCATION_UPDATE') subTopic = 'location';
      else if (type === 'CHAT_MESSAGE') subTopic = 'chat';

      const msg = new Paho.MQTT.Message(JSON.stringify(payload));
      msg.destinationName = SYNC_TOPIC_PREFIX + subTopic;
      msg.retained = false; // Never retain live events so devices don't receive duplicate alerts on reconnect
      mqttClient.send(msg);
    } catch (e) {
      console.warn('MQTT send failed:', e);
    }
  }

  // 4. Cloud Firebase Realtime Database
  try {
    syncToFirebase(type, data);
  } catch (e) {
    console.warn('Firebase sync error in broadcastUpdate:', e);
  }

  // 5. Cloud Push Notification for Closed App / Locked Phone (ntfy Web Push Gateway)
  try {
    const partnerUser = currentUser === 'himanshu' ? 'gullu' : 'himanshu';
    const myName = currentUser === 'himanshu' ? 'Himanshu ☕' : 'Gullu 🌸';

    if (type === 'PULSE_SENT') {
      sendClosedAppPushNotification(partnerUser, {
        title: `💓 Dil Ki Dhadkan from ${myName}!`,
        message: `${myName}: "${data.note || 'Feel my heartbeat... thinking of you right now! ❤️'}"`,
        click: getAppNavUrl('#pulse'),
        tags: ['heart', 'sparkles'],
        priority: 5
      });
    } else if (type === 'MOOD_UPDATE') {
      sendClosedAppPushNotification(partnerUser, {
        title: `✨ ${myName} ka Mood Update!`,
        message: `${myName}: "${data.text || data.mood}"`,
        click: getAppNavUrl('#paneMood'),
        tags: ['sparkles'],
        priority: 4
      });
    } else if (type === 'LOCATION_UPDATE') {
      if (!data.silent) {
        sendClosedAppPushNotification(partnerUser, {
          title: `📍 ${myName} ki Live Location!`,
          message: `${myName} is at ${data.address || 'GPS Updated'}`,
          click: getAppNavUrl('#pulse'),
          tags: ['round_pushpin'],
          priority: 4
        });
      }
    } else if (type === 'CHAT_MESSAGE') {
      sendClosedAppPushNotification(partnerUser, {
        title: `💬 New Message from ${myName}!`,
        message: `${myName}: "${data.text.slice(0, 80)}"`,
        click: getAppNavUrl('#chat'),
        tags: ['speech_balloon', 'love_letter'],
        priority: 5
      });
    } else if (type === 'VC_CALL') {
      sendClosedAppPushNotification(partnerUser, {
        title: `📹 Video Call from ${myName}!`,
        message: `${myName} is calling you for a private video call... Tap to answer! ❤️`,
        click: getAppNavUrl('#vc'),
        tags: ['video_camera', 'phone'],
        priority: 5
      });
    }
  } catch (err) {
    console.warn('Closed-app push notification trigger failed:', err);
  }
}

function handleIncomingSyncMessage(payload) {
  if (!payload || !payload.type) return;

  // Ignore self-broadcasts
  if (payload.sender === currentUser) return;

  if (payload.type === 'PULSE_SENT') {
    handleIncomingPulse(payload.data);
  } else if (payload.type === 'MOOD_UPDATE') {
    handleIncomingMood(payload.data);
  } else if (payload.type === 'QA_ANSWER') {
    handleIncomingQAAnswer(payload.data);
  } else if (payload.type === 'QA_NEW') {
    handleIncomingNewQA(payload.data);
  } else if (payload.type === 'COUPON_REDEEM' || payload.type === 'COUPON_CREATE' || payload.type === 'COUPON_DELETE') {
    handleIncomingCoupon(payload);
  } else if (payload.type === 'MEMORY_ADD') {
    handleIncomingMemory(payload.data);
  } else if (payload.type === 'LOCATION_UPDATE') {
    handleIncomingLocation(payload.data);
  } else if (payload.type === 'LOCATION_CLEAR') {
    handleIncomingLocationClear(payload.data);
  } else if (payload.type === 'CHAT_MESSAGE') {
    handleIncomingChatMessage(payload.data, true);
  } else if (payload.type === 'VC_SIGNAL' || payload.type === 'VC_CALL') {
    handleIncomingVCSignal(payload.data);
  } else if (payload.type === 'VC_HEART') {
    handleIncomingVCHeart(payload.data);
  }
}

function sendSystemNotificationForMood(data) {
  if (!data || !('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  const notifId = 'mood_' + data.user + '_' + (data.timestamp || data.time || Date.now());

  // 1. Deduplication guard - never repeat the same mood notification
  if (hasAlreadyShownNotification(notifId)) return;

  // 2. Freshness guard - if mood was updated more than 90 seconds ago, skip notification
  if (data.timestamp && Math.abs(Date.now() - data.timestamp) > 90000) return;

  recordNotificationShown(notifId);

  const partnerName = data.user === 'himanshu' ? 'Himanshu' : 'Gullu';
  const moodEmojiMap = {
    romantic: '✨',
    coffee: '☕',
    pout: '🐷',
    hug: '🫂',
    missyou: '🥺',
    naughty: '😉',
    sleepy: '😴',
    scold: '😤'
  };
  const emoji = moodEmojiMap[data.mood] || '🎭';
  const moodDesc = data.text || `${data.title || ''} ${data.note ? '"' + data.note + '"' : ''}`.trim();

  const title = `${emoji} ${partnerName} ne apna mood update kiya!`;
  const options = {
    body: `${partnerName}: ${moodDesc || 'Abhi naya mood share kiya hai! ❤️'}`,
    icon: './icon-192.png',
    badge: './icon-192.png',
    vibrate: [200, 80, 200, 80, 300],
    tag: notifId,
    renotify: false,
    data: { url: getAppNavUrl('#paneMood') }
  };

  if ('serviceWorker' in navigator && navigator.serviceWorker.ready) {
    navigator.serviceWorker.ready.then((reg) => {
      reg.showNotification(title, options);
    }).catch(() => {
      try { new Notification(title, options); } catch (e) {}
    });
  } else {
    try { new Notification(title, options); } catch (e) {}
  }
}

function handleIncomingMood(data) {
  if (!data || !data.user) return;
  if (!appState) appState = JSON.parse(JSON.stringify(DEFAULT_APP_STATE));
  if (!appState.currentMoods) appState.currentMoods = { ...DEFAULT_APP_STATE.currentMoods };

  appState.currentMoods[data.user] = {
    mood: data.mood,
    text: data.text || `${data.title} — "${data.note}"`,
    time: data.time || 'Recently',
    timestamp: data.timestamp || Date.now()
  };
  saveAppState(appState);
  renderMoods();
  renderHeader();

  // If partner updated their mood, play soft chime, show toast & send mobile system notification!
  if (data.user !== currentUser) {
    playTone(600, 0.15);
    showPartnerMoodToast(data);
    sendSystemNotificationForMood(data);
  }
}

function sendSystemNotificationForPulse(pulse) {
  if (!pulse || !('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  const pulseId = pulse.id || ('pulse_' + (pulse.timestamp || Date.now()));

  // 1. Deduplication guard - never show the same pulse notification twice!
  if (hasAlreadyShownNotification(pulseId)) return;

  // 2. Freshness guard - if pulse is older than 90 seconds, do not buzz phone!
  if (pulse.timestamp && Math.abs(Date.now() - pulse.timestamp) > 90000) return;

  recordNotificationShown(pulseId);

  const title = `💓 Dil Ki Dhadkan from ${pulse.from}!`;
  const options = {
    body: `${pulse.from}: "${pulse.note || 'Feel my heartbeat... thinking of you right now! ❤️'}"`,
    icon: './icon-192.png',
    badge: './icon-192.png',
    vibrate: [300, 100, 300, 100, 600],
    tag: 'pulse_' + pulseId,
    renotify: false,
    requireInteraction: true,
    data: { url: getAppNavUrl('#pulse') }
  };

  if ('serviceWorker' in navigator && navigator.serviceWorker.ready) {
    navigator.serviceWorker.ready.then((reg) => {
      reg.showNotification(title, options);
    }).catch(() => {
      try { new Notification(title, options); } catch (e) {}
    });
  } else {
    try { new Notification(title, options); } catch (e) {}
  }
}

function handleIncomingPulse(pulse) {
  if (!pulse || !currentUser) return;

  const myName = currentUser === 'himanshu' ? 'Himanshu' : 'Gullu';
  const partnerName = currentUser === 'himanshu' ? 'Gullu' : 'Himanshu';

  // Smart partner resolution
  let senderName = pulse.from || partnerName;
  if (pulse.deviceId && pulse.deviceId !== myDeviceId && pulse.from && pulse.from.toLowerCase() === myName.toLowerCase()) {
    senderName = partnerName; // sender is on partner's phone
  }

  // If self-pulse from THIS device, ignore
  if (pulse.deviceId && pulse.deviceId === myDeviceId) return;
  if (pulse.senderUser && pulse.senderUser === currentUser) return;

  const pulseId = pulse.id || ('pulse_' + (pulse.timestamp || Date.now()));
  const normalizedPulse = {
    ...pulse,
    id: pulseId,
    from: senderName
  };

  if (!appState) appState = JSON.parse(JSON.stringify(DEFAULT_APP_STATE));
  if (!Array.isArray(appState.pulses)) {
    appState.pulses = normalizeArray(appState.pulses);
  }

  const exists = appState.pulses.some(p => p.id === pulseId || (p.timestamp && p.timestamp === pulse.timestamp));
  if (!exists) {
    appState.pulses.unshift(normalizedPulse);
    if (appState.pulses.length > 25) appState.pulses.pop();
    saveAppState(appState);
    renderPulseHistory();
  }

  // Freshness check: only alert if sent within the last 90 seconds
  const isFresh = pulse.timestamp && (Math.abs(Date.now() - pulse.timestamp) < 90000);
  if (!isFresh) {
    updatePulseTabIncomingState(null);
    return;
  }

  // Trigger mobile system notification (with strict deduplication)
  sendSystemNotificationForPulse(normalizedPulse);

  // Trigger sensory alert if pulse hasn't been acknowledged yet!
  const lastAck = localStorage.getItem('our_story_last_pulse_ack');
  if (lastAcknowledgedPulseId !== pulseId && lastAck !== pulseId) {
    triggerIncomingHeartbeatAlert(normalizedPulse);
  } else {
    updatePulseTabIncomingState(normalizedPulse);
  }
}

function triggerIncomingHeartbeatAlert(pulse) {
  if (!pulse) return;
  const pulseId = pulse.id || ('pulse_' + pulse.timestamp);
  lastAcknowledgedPulseId = pulseId;
  localStorage.setItem('our_story_last_pulse_ack', pulseId);
  recordNotificationShown(pulseId);

  // 1. Double heartbeat sound (lub-dub... lub-dub)
  playHeartbeatSound();
  setTimeout(playHeartbeatSound, 350);
  setTimeout(playHeartbeatSound, 900);
  setTimeout(playHeartbeatSound, 1250);

  // 2. Haptic vibration
  if (navigator.vibrate) {
    navigator.vibrate([120, 80, 160, 250, 120, 80, 160]);
  }

  // 3. Highlight Bottom Dock Pulse Tab
  const dockBadge = document.getElementById('dockPulseBadge');
  if (dockBadge) {
    dockBadge.classList.remove('is-hidden');
    dockBadge.textContent = '1';
  }

  // 4. Update Heartbeat Tab UI
  updatePulseTabIncomingState(pulse);

  // 5. Open Fullscreen Romantic Modal
  const modal = document.getElementById('incomingHeartbeatModal');
  const heading = document.getElementById('incomingPulseHeading');
  const msg = document.getElementById('incomingPulseMessage');
  const timeEl = document.getElementById('incomingMetaTime');
  const noteEl = document.getElementById('incomingMetaNote');
  const sendBackBtn = document.getElementById('incomingSendBackBtn');
  const dismissBtn = document.getElementById('incomingDismissBtn');

  if (heading) heading.textContent = `Dil Ki Dhadkan Received! 💓`;
  if (msg) msg.textContent = `${pulse.from} ne abhi abhi tumhein ek warm heartbeat bheji hai!`;
  if (timeEl) timeEl.textContent = `Received at ${pulse.time || 'Just now'}`;
  if (noteEl) noteEl.textContent = `"${pulse.note || 'Feel my heartbeat... miss you!'}"`;

  if (sendBackBtn) {
    sendBackBtn.textContent = `💓 Send Heartbeat Back to ${pulse.from}`;
    sendBackBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeIncomingHeartbeatModal();
      sendReturnHeartbeat(pulse.from);
    };
  }

  if (dismissBtn) {
    dismissBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeIncomingHeartbeatModal();
      feelIncomingHeartbeat(pulse);
    };
  }

  if (modal) {
    modal.classList.remove('is-hidden');
    modal.style.removeProperty('display');
    modal.style.display = 'flex';
  }
}

function closeIncomingHeartbeatModal() {
  const modal = document.getElementById('incomingHeartbeatModal');
  if (modal) {
    modal.classList.add('is-hidden');
    modal.style.display = 'none';
  }
}

function setupIncomingPulseModal() {
  const modal = document.getElementById('incomingHeartbeatModal');
  const backdrop = document.getElementById('incomingPulseBackdrop');
  const closeBtn = document.getElementById('incomingPulseCloseBtn');
  const dismissBtn = document.getElementById('incomingDismissBtn');
  const sendBackBtn = document.getElementById('incomingSendBackBtn');

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeIncomingHeartbeatModal();
      playTone(400, 0.1);
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeIncomingHeartbeatModal();
    });
  }

  if (dismissBtn) {
    dismissBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeIncomingHeartbeatModal();
      playTone(550, 0.2);
    });
  }

  if (sendBackBtn) {
    sendBackBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeIncomingHeartbeatModal();
      const partnerName = currentUser === 'himanshu' ? 'Gullu' : 'Himanshu';
      sendReturnHeartbeat(partnerName);
    });
  }
}

function sendReturnHeartbeat(toPartner) {
  dispatchHeartbeatPulse(`Returned a warm heartbeat pulse to ${toPartner} ❤️`);
}

function updatePulseTabIncomingState(pulse) {
  const banner = document.getElementById('incomingPulseBanner');
  const bannerTitle = document.getElementById('bannerPulseTitle');
  const bannerSubtitle = document.getElementById('bannerPulseSubtitle');
  const heart = document.getElementById('interactiveHeart');
  const statusText = document.getElementById('pulseStatusText');
  const bannerBtn = document.getElementById('bannerFeelBtn');

  const partnerName = currentUser === 'himanshu' ? 'Gullu' : 'Himanshu';

  if (pulse && pulse.from === partnerName) {
    if (banner) {
      banner.classList.remove('is-hidden');
      if (bannerTitle) bannerTitle.textContent = `Incoming Heartbeat from ${pulse.from}! 💓`;
      if (bannerSubtitle) bannerSubtitle.textContent = `Sent at ${pulse.time} • Tap below to feel the warmth`;
    }
    if (heart) {
      heart.classList.add('has-incoming-pulse');
    }
    if (statusText) {
      statusText.innerHTML = `💓 <strong>${pulse.from} is thinking of you!</strong> Touch the heart to feel their pulse.`;
    }
    if (bannerBtn) {
      bannerBtn.onclick = () => {
        feelIncomingHeartbeat(pulse);
      };
    }
  } else {
    if (banner) banner.classList.add('is-hidden');
    if (heart) heart.classList.remove('has-incoming-pulse');
    const partner = currentUser === 'himanshu' ? 'Gullu 🌸' : 'Himanshu ☕';
    if (statusText) statusText.textContent = `Hold for 2 seconds to send warmth to ${partner}...`;
  }
}

function feelIncomingHeartbeat(pulse) {
  if (pulse) {
    const pulseId = pulse.id || ('pulse_' + pulse.timestamp);
    lastAcknowledgedPulseId = pulseId;
    localStorage.setItem('our_story_last_pulse_ack', pulseId);
    recordNotificationShown(pulseId);
  }

  playHeartbeatSound();
  setTimeout(playHeartbeatSound, 300);
  setTimeout(playHeartbeatSound, 700);

  if (navigator.vibrate) {
    try {
      navigator.vibrate([140, 70, 220, 70, 260]);
    } catch (e) {}
  }

  const heart = document.getElementById('interactiveHeart');
  if (heart) {
    for (let i = 0; i < 6; i++) {
      setTimeout(() => createFloatingHeart(heart), i * 150);
    }
  }

  const dockBadge = document.getElementById('dockPulseBadge');
  if (dockBadge) dockBadge.classList.add('is-hidden');

  const banner = document.getElementById('incomingPulseBanner');
  if (banner) banner.classList.add('is-hidden');

  const statusText = document.getElementById('pulseStatusText');
  if (statusText) {
    statusText.textContent = `🥰 Felt ${pulse.from}'s heartbeat! Connection alive.`;
    setTimeout(() => {
      const partner = currentUser === 'himanshu' ? 'Gullu 🌸' : 'Himanshu ☕';
      statusText.textContent = `Hold for 2 seconds to send warmth to ${partner}...`;
    }, 4000);
  }
}

// ==========================================================================
// CLOSED-APP BACKGROUND WEB PUSH (POWERED BY NTFY GATEWAY)
// ==========================================================================

const NTFY_VAPID_PUBLIC_KEY = 'BEMjM0sNxh41x0a6Lz3YaqkJ7AUhZefxsOQgw-at69i0fM1CybVBcj7-QQXf4N_tPCgFnOXdRbQ5jrSrr9Yg9Lc';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function getMyNotificationTopic(user = currentUser) {
  return user === 'himanshu' ? 'ourstory_himanshu_dhadkan_2026' : 'ourstory_gullu_dhadkan_2026';
}

function getAppNavUrl(hash = '#pulse') {
  const cleanPath = window.location.pathname.replace(/\/(index\.html)?$/, '');
  const prefix = cleanPath.endsWith('/') ? cleanPath : cleanPath + '/';
  const cleanHash = hash.startsWith('#') ? hash : '#' + hash;
  return window.location.origin + prefix + cleanHash;
}

async function registerClosedAppPushSubscription() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('PushManager not available in this browser');
    return null;
  }

  if (Notification.permission !== 'granted') {
    return null;
  }

  try {
    const reg = await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();

    if (!sub) {
      const convertedVapidKey = urlBase64ToUint8Array(NTFY_VAPID_PUBLIC_KEY);
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey
      });
    }

    if (!sub) return null;

    const rawP256dh = sub.getKey ? sub.getKey('p256dh') : null;
    const rawAuth = sub.getKey ? sub.getKey('auth') : null;
    const p256dh = rawP256dh ? btoa(String.fromCharCode.apply(null, new Uint8Array(rawP256dh))) : null;
    const auth = rawAuth ? btoa(String.fromCharCode.apply(null, new Uint8Array(rawAuth))) : null;

    const myTopic = getMyNotificationTopic();

    const res = await fetch('https://ntfy.sh/v1/webpush', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        endpoint: sub.endpoint,
        p256dh: p256dh,
        auth: auth,
        topics: [myTopic]
      })
    });

    if (res.ok) {
      console.log('Registered with ntfy Web Push successfully for topic:', myTopic);
      localStorage.setItem('our_story_push_registered', 'true');
      localStorage.setItem('our_story_push_topic', myTopic);

      if (firebaseDb) {
        try {
          firebaseDb.ref('our_story/push_subscriptions/' + currentUser).set({
            endpoint: sub.endpoint,
            topic: myTopic,
            updatedAt: Date.now()
          });
        } catch (e) {}
      }
      return sub;
    } else {
      console.warn('ntfy webpush registration returned status:', res.status);
    }
  } catch (err) {
    console.warn('registerClosedAppPushSubscription error:', err);
  }
  return null;
}

async function sendClosedAppPushNotification(targetUser, payload) {
  if (!payload) return;
  const targetTopic = getMyNotificationTopic(targetUser);

  try {
    const notifId = payload.id || ('push_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6));
    const bodyPayload = {
      topic: targetTopic,
      title: payload.title || '💓 Our Story Notification',
      message: payload.message || payload.body || 'New message from partner!',
      priority: payload.priority || 5,
      tags: payload.tags || ['heart', 'sparkles'],
      click: payload.click || getAppNavUrl('#pulse'),
      id: notifId,
      tag: payload.tag || ('notif_' + notifId),
      cache: 'no'
    };

    fetch('https://ntfy.sh/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Cache': 'no',
        'Cache': 'no'
      },
      body: JSON.stringify(bodyPayload)
    }).catch(e => console.warn('ntfy push fetch error:', e));
  } catch (e) {
    console.warn('sendClosedAppPushNotification error:', e);
  }
}

function askNotificationPermission() {
  return new Promise((resolve) => {
    if (!('Notification' in window)) {
      resolve('unsupported');
      return;
    }
    try {
      const result = Notification.requestPermission((status) => {
        resolve(status);
      });
      if (result && typeof result.then === 'function') {
        result.then(resolve).catch(() => resolve(Notification.permission));
      }
    } catch (err) {
      resolve(Notification.permission || 'denied');
    }
  });
}

function setupNotificationPermissions() {
  const bellBtn = document.getElementById('notifBellBtn');
  const promptBox = document.getElementById('notifPromptBox');
  const enableBtn = document.getElementById('enableNotifBtn');

  const settingsModal = document.getElementById('notifSettingsModal');
  const closeBtn = document.getElementById('closeNotifModalBtn');
  const actionBtn = document.getElementById('enableOrTestNotifBtn');
  const btnHint = document.getElementById('notifBtnHint');
  const backupLink = document.getElementById('openNtfyBackupBtn');
  const badge = document.getElementById('notifModalPushBadge');
  const topicCode = document.getElementById('notifModalTopicName');

  function openSettingsModal() {
    if (!settingsModal) return;
    const myTopic = getMyNotificationTopic();
    if (topicCode) topicCode.textContent = myTopic;
    if (backupLink) backupLink.href = `https://ntfy.sh/${myTopic}`;

    const isGranted = ('Notification' in window) && Notification.permission === 'granted';

    if (isGranted) {
      if (badge) {
        badge.textContent = 'Active (Web Push Enabled) ✅';
        badge.className = 'notif-badge-pill active';
      }
      if (actionBtn) {
        actionBtn.textContent = '🚀 Test Notification (5s Timer)';
      }
      if (btnHint) {
        btnHint.textContent = 'Tap karke app band karein ya screen lock karein — 5 second me phone par notification aayegi!';
      }
      registerClosedAppPushSubscription();
    } else {
      if (badge) {
        badge.textContent = ('Notification' in window) && Notification.permission === 'denied'
          ? 'Blocked in Browser 🔕'
          : 'Permission Needed ⚠️';
        badge.className = 'notif-badge-pill pending';
      }
      if (actionBtn) {
        actionBtn.textContent = '🔔 Turn On Notifications Now';
      }
      if (btnHint) {
        btnHint.textContent = 'Pehle notification allow karein taaki phone vibrate aur sound play kar sake.';
      }
    }

    settingsModal.classList.remove('is-hidden');
    settingsModal.classList.add('open');
    playTone(550, 0.1);
  }

  function closeSettingsModal() {
    if (!settingsModal) return;
    settingsModal.classList.remove('open');
    settingsModal.classList.add('is-hidden');
  }

  if (closeBtn) closeBtn.addEventListener('click', closeSettingsModal);
  if (settingsModal) {
    settingsModal.addEventListener('click', (e) => {
      if (e.target === settingsModal) closeSettingsModal();
    });
  }

  if (actionBtn) {
    actionBtn.addEventListener('click', async () => {
      const isGranted = ('Notification' in window) && Notification.permission === 'granted';

      if (!isGranted) {
        await requestNotifPermission();
        openSettingsModal();
        return;
      }

      // If granted, run 5s test countdown
      let count = 5;
      actionBtn.disabled = true;
      actionBtn.textContent = `⏳ Screen Lock / App Band Karein (${count}s)...`;

      const countdownTimer = setInterval(() => {
        count--;
        if (count > 0) {
          actionBtn.textContent = `⏳ Screen Lock / App Band Karein (${count}s)...`;
        } else {
          clearInterval(countdownTimer);
          actionBtn.disabled = false;
          actionBtn.textContent = `🚀 Test Notification (5s Timer)`;

          const testId = 'test_' + Date.now();
          if (document.hidden) {
            // Screen locked or app minimized: send closed-app web push
            sendClosedAppPushNotification(currentUser, {
              id: testId,
              title: '💓 Test Heartbeat Received!',
              message: 'Closed-app notification is working perfectly! Dil ki dhadkan phone par aa gayi! 🎉',
              click: getAppNavUrl('#pulse'),
              tags: ['tada', 'sparkles', 'heart'],
              priority: 5
            });
          } else {
            // App is currently open on screen: trigger single local notification
            if ('serviceWorker' in navigator && navigator.serviceWorker.ready) {
              navigator.serviceWorker.ready.then(reg => {
                reg.showNotification('💓 Test Heartbeat Received!', {
                  body: 'Notifications are working! Dil ki dhadkan phone par aa gayi! 🎉',
                  icon: './icon-192.png',
                  badge: './icon-192.png',
                  vibrate: [300, 100, 300, 100, 600],
                  tag: 'heartbeat-test',
                  renotify: false,
                  requireInteraction: true,
                  data: { url: getAppNavUrl('#pulse') }
                });
              }).catch(() => {});
            }
          }
        }
      }, 1000);
    });
  }

  function updateNotifUI() {
    if (!('Notification' in window)) {
      if (bellBtn) bellBtn.style.display = 'flex';
      return;
    }

    if (Notification.permission === 'granted') {
      if (bellBtn) {
        bellBtn.classList.add('granted');
        bellBtn.title = 'Closed-App Notifications Active 🔔 (Tap for Settings & Test)';
        bellBtn.innerHTML = '🔔';
      }
      if (promptBox) promptBox.classList.add('is-hidden');
      registerClosedAppPushSubscription();
    } else if (Notification.permission === 'denied') {
      if (bellBtn) {
        bellBtn.classList.add('denied');
        bellBtn.title = 'Notifications Blocked in Browser Settings 🔕';
        bellBtn.innerHTML = '🔕';
      }
      if (promptBox) promptBox.classList.add('is-hidden');
    } else {
      if (bellBtn) {
        bellBtn.classList.remove('granted', 'denied');
        bellBtn.title = 'Enable Heartbeat Notifications 🔔';
        bellBtn.innerHTML = '🔔';
      }
      if (promptBox) promptBox.classList.remove('is-hidden');
    }
  }

  async function requestNotifPermission() {
    if (!('Notification' in window)) {
      showAppModal('ℹ️ Notifications Not Supported', 'Aapka browser system notifications support nahi karta. Direct Backup Channel use karein.');
      return;
    }

    try {
      const perm = await askNotificationPermission();
      updateNotifUI();
      if (perm === 'granted') {
        playCelebrationChime();
        await registerClosedAppPushSubscription();
      } else if (perm === 'denied') {
        showAppModal('⚠️ Notifications Blocked', 'Phone ya browser settings mein notifications blocked hain. Site settings me jaakar allow karein ya Direct Backup link use karein.');
      }
    } catch (e) {
      console.warn('Notification permission error:', e);
    }
  }

  // Bell button ALWAYS opens the modal directly!
  if (bellBtn) {
    bellBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openSettingsModal();
    });
  }

  if (enableBtn) {
    enableBtn.addEventListener('click', async () => {
      await requestNotifPermission();
      openSettingsModal();
    });
  }

  updateNotifUI();
}

function showPartnerMoodToast(data) {
  if (!data || !currentUser) return;
  let toast = document.getElementById('partnerMoodToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'partnerMoodToast';
    toast.style.cssText = `
      position: fixed;
      top: 16px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, rgba(233, 30, 99, 0.95), rgba(120, 20, 80, 0.95));
      color: #fff;
      padding: 10px 18px;
      border-radius: 25px;
      font-size: 0.82rem;
      font-weight: 700;
      box-shadow: 0 8px 25px rgba(233, 30, 99, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.4);
      z-index: 10000;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;
      max-width: 90%;
      pointer-events: none;
    `;
    document.body.appendChild(toast);
  }

  const partnerEmoji = data.user === 'himanshu' ? '☕' : '🌸';
  const partnerName = data.user === 'himanshu' ? 'Himanshu' : 'Gullu';
  toast.innerHTML = `<span>${partnerEmoji}</span> <span>${partnerName} updated mood: <strong>${data.text || data.title}</strong></span>`;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';

  clearTimeout(toast.dismissTimer);
  toast.dismissTimer = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(-20px)';
  }, 4000);
}

function handleIncomingQAAnswer(data) {
  if (!data || !data.user) return;
  if (!appState) appState = JSON.parse(JSON.stringify(DEFAULT_APP_STATE));
  if (!appState.currentQA) appState.currentQA = { ...DEFAULT_APP_STATE.currentQA };
  if (!appState.currentQA.answers) appState.currentQA.answers = {};

  appState.currentQA.answers[data.user] = data.answer;
  saveAppState(appState);
  renderQA();

  if (appState.currentQA.answers.himanshu && appState.currentQA.answers.gullu) {
    playCelebrationChime();
    showAppModal('🔓 Both Answers Unlocked!', 'Aap dono ne answer lock kar diya hai! Dono answers reveal ho gaye hain! 💕');
  }
}

function handleIncomingNewQA(data) {
  if (!data || !data.newQA) return;
  if (!appState) appState = JSON.parse(JSON.stringify(DEFAULT_APP_STATE));
  appState.currentQA = data.newQA;
  if (data.pastQA) {
    if (!appState.pastQAs) appState.pastQAs = [];
    appState.pastQAs.unshift(data.pastQA);
  }
  saveAppState(appState);
  renderQA();
}

function handleIncomingCoupon(payload) {
  if (!payload || !payload.data) return;
  if (!appState || !appState.coupons) return;

  if (payload.type === 'COUPON_REDEEM') {
    const { couponId, user } = payload.data;
    const coupon = appState.coupons.find(c => c.id === couponId);
    if (coupon) {
      coupon.redeemed = true;
      coupon.redeemedBy = user;
      coupon.redeemedAt = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      saveAppState(appState);
      renderCoupons();
    }
  } else if (payload.type === 'COUPON_CREATE') {
    const newCoupon = payload.data;
    if (newCoupon && !appState.coupons.some(c => c.id === newCoupon.id)) {
      appState.coupons.unshift(newCoupon);
      saveAppState(appState);
      renderCoupons();
    }
  } else if (payload.type === 'COUPON_DELETE') {
    const { couponId } = payload.data;
    appState.coupons = appState.coupons.filter(c => c.id !== couponId);
    saveAppState(appState);
    renderCoupons();
  }
}

function handleIncomingMemory(memory) {
  if (!memory || !memory.id) return;
  if (!appState) appState = JSON.parse(JSON.stringify(DEFAULT_APP_STATE));
  if (!appState.memories) appState.memories = [];
  const exists = appState.memories.some(m => m.id === memory.id);
  if (!exists) {
    appState.memories.unshift(memory);
    saveAppState(appState);
    renderVaultFeed();
    playTone(520, 0.15);
  }
}

// Dynamically compute Day Counter starting from startDate
function updateDaysCounter() {
  const streakDaysEl = document.getElementById('streakDays');
  if (!streakDaysEl) return;
  const startStr = (appState && appState.stats && appState.stats.startDate) ? appState.stats.startDate : '2026-10-03';
  const parts = startStr.split('-').map(Number);
  const startDate = new Date(parts[0], parts[1] - 1, parts[2]);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffTime = Math.max(0, today.getTime() - startDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; // 1-based, starts at Day 1
  streakDaysEl.textContent = diffDays;
}

// --- 1. HEADER & PROFILES ---
function renderHeader() {
  updateDaysCounter();

  const himanshuMoodText = document.getElementById('himanshuMoodText');
  const gulluMoodText = document.getElementById('gulluMoodText');
  
  if (appState && appState.currentMoods) {
    if (himanshuMoodText) himanshuMoodText.textContent = appState.currentMoods.himanshu.text || 'Craving coffee ☕';
    if (gulluMoodText) gulluMoodText.textContent = appState.currentMoods.gullu.text || 'Pout Queen mode 🐷';
  }

  // Update profile switch pill styles
  const pillH = document.getElementById('pillHimanshu');
  const pillG = document.getElementById('pillGullu');
  if (pillH && pillG) {
    pillH.classList.toggle('active', currentUser === 'himanshu');
    pillG.classList.toggle('active', currentUser === 'gullu');
  }

  // Update Portal Status Badge in header
  const portalBadge = document.getElementById('headerPortalBadgeText');
  if (portalBadge) {
    portalBadge.textContent = currentUser === 'himanshu' ? 'Himanshu ☕' : (currentUser === 'gullu' ? 'Gullu 🌸' : 'Locked 🔒');
  }

  // Update Mood Card Tag
  const moodTag = document.getElementById('currentMoodUserTag');
  if (moodTag) {
    moodTag.textContent = currentUser === 'himanshu' ? 'For Himanshu ☕' : 'For Gullu 🌸';
  }

  // Update Q&A Label
  const qaLabel = document.getElementById('qaAnswerLabel');
  if (qaLabel) {
    qaLabel.textContent = `Your Answer (${currentUser === 'himanshu' ? 'Himanshu ☕' : 'Gullu 🌸'}):`;
  }

  // Update Pulse Status Prompt for active partner
  const pulseText = document.getElementById('pulseStatusText');
  if (pulseText) {
    const partner = currentUser === 'himanshu' ? 'Gullu 🌸' : 'Himanshu ☕';
    pulseText.textContent = `Hold for 1.5 seconds to send warmth to ${partner}...`;
  }

  updatePulseIdentityUI();
}

function updatePulseIdentityUI() {
  const senderLabel = document.getElementById('pulseSenderLabel');
  const switchBtn = document.getElementById('pulseSwitchUserBtn');
  if (senderLabel) {
    senderLabel.textContent = currentUser === 'himanshu' ? 'Himanshu ☕' : 'Gullu 🌸';
  }
  if (switchBtn) {
    switchBtn.textContent = currentUser === 'himanshu' ? 'Switch to Gullu 🌸' : 'Switch to Himanshu ☕';
  }
}

function updateProfileUI() {
  renderHeader();
}

// ==========================================================================
// COUPLE PRIVATE AUTHENTICATION & LOGIN GATE FUNCTIONS
// ==========================================================================

function checkAuthGate() {
  const loginScreen = document.getElementById('coupleLoginScreen');
  const appLayout = document.querySelector('.app-layout');
  const authUser = getAuthenticatedUser();

  if (!authUser) {
    currentUser = null;
    if (appLayout) appLayout.classList.add('is-auth-locked');
    if (loginScreen) {
      loginScreen.classList.remove('is-hidden', 'login-success-fade');
      const prevUser = localStorage.getItem('our_story_current_user') || 'himanshu';
      selectLoginProfile(prevUser === 'gullu' ? 'Gullu' : 'Himanshu', false);
    }
  } else {
    currentUser = authUser;
    if (loginScreen) {
      loginScreen.classList.add('is-hidden');
      loginScreen.classList.remove('login-success-fade');
    }
    if (appLayout) {
      appLayout.classList.remove('is-auth-locked');
    }
    updateProfileUI();
  }
}

function selectLoginProfile(userName, focusPass = true) {
  const isGullu = (userName || '').trim().toLowerCase() === 'gullu';
  const idInput = document.getElementById('loginUserId');
  const chipH = document.getElementById('chipHimanshu');
  const chipG = document.getElementById('chipGullu');
  const passInput = document.getElementById('loginPassword');

  if (idInput) idInput.value = isGullu ? 'Gullu' : 'Himanshu';

  if (chipH && chipG) {
    chipH.classList.toggle('active', !isGullu);
    chipG.classList.toggle('active', isGullu);
  }

  if (focusPass && passInput) {
    passInput.focus();
  }
}

function setupCoupleLogin() {
  const form = document.getElementById('coupleLoginForm');
  const chipH = document.getElementById('chipHimanshu');
  const chipG = document.getElementById('chipGullu');
  const idInput = document.getElementById('loginUserId');
  const passInput = document.getElementById('loginPassword');
  const togglePassBtn = document.getElementById('togglePasswordBtn');
  const togglePassIcon = document.getElementById('togglePasswordIcon');
  const submitBtn = document.getElementById('loginSubmitBtn');
  const logoutBtn = document.getElementById('headerLogoutBtn');

  if (chipH) {
    chipH.addEventListener('click', () => {
      selectLoginProfile('Himanshu', true);
      playTone(440, 0.1, 'sine', 0.08);
    });
  }

  if (chipG) {
    chipG.addEventListener('click', () => {
      selectLoginProfile('Gullu', true);
      playTone(554.37, 0.1, 'sine', 0.08);
    });
  }

  if (idInput) {
    idInput.addEventListener('input', () => {
      const val = idInput.value.trim().toLowerCase();
      if (chipH && chipG) {
        chipH.classList.toggle('active', val === 'himanshu');
        chipG.classList.toggle('active', val === 'gullu');
      }
    });
  }

  if (togglePassBtn && passInput) {
    togglePassBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const isPassword = passInput.type === 'password';
      passInput.type = isPassword ? 'text' : 'password';
      if (togglePassIcon) {
        togglePassIcon.textContent = isPassword ? '🙈' : '👁️';
      }
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleLoginSubmit();
    });
  }

  if (submitBtn) {
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleLoginSubmit();
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handlePortalLogout();
    });
  }
}

function handleLoginSubmit() {
  const idInput = document.getElementById('loginUserId');
  const passInput = document.getElementById('loginPassword');
  const rememberCheckbox = document.getElementById('rememberMeCheckbox');
  const errorMsg = document.getElementById('loginErrorMsg');
  const errorText = document.getElementById('loginErrorText');
  const loginCard = document.getElementById('loginCard');
  const submitBtn = document.getElementById('loginSubmitBtn');
  const submitText = document.getElementById('loginSubmitText');

  const rawId = (idInput ? idInput.value : '').trim().toLowerCase();
  const rawPass = (passInput ? passInput.value : '').trim();

  function triggerLoginError(msg) {
    if (errorText) errorText.textContent = msg;
    if (errorMsg) errorMsg.classList.remove('is-hidden');
    if (loginCard) {
      loginCard.classList.remove('shake');
      void loginCard.offsetWidth; // re-flow
      loginCard.classList.add('shake');
      setTimeout(() => loginCard.classList.remove('shake'), 600);
    }
    if (navigator.vibrate) {
      try { navigator.vibrate([80, 50, 80]); } catch (err) {}
    }
    playTone(220, 0.25, 'sawtooth', 0.15);
  }

  if (!rawId) {
    triggerLoginError('Kripya apna ID enter karein (Himanshu ya Gullu) ✍️');
    if (idInput) idInput.focus();
    return;
  }

  if (!rawPass) {
    triggerLoginError('Kripya apna secret password enter karein 🔑');
    if (passInput) passInput.focus();
    return;
  }

  let matchedUser = null;
  if (rawId === 'himanshu') {
    if (rawPass === AUTH_CREDENTIALS.himanshu.pass) {
      matchedUser = 'himanshu';
    }
  } else if (rawId === 'gullu') {
    if (rawPass === AUTH_CREDENTIALS.gullu.pass) {
      matchedUser = 'gullu';
    }
  } else {
    triggerLoginError('Ye ID valid nahi hai! Sirf Himanshu ya Gullu login kar sakte hain 🔐');
    if (idInput) idInput.focus();
    return;
  }

  if (!matchedUser) {
    triggerLoginError('❌ Galat Password! Please check karke fir se try karein 🥺');
    if (passInput) {
      passInput.value = '';
      passInput.focus();
    }
    return;
  }

  // --- CREDENTIALS VALIDATED SUCCESSFULLY ---
  if (errorMsg) errorMsg.classList.add('is-hidden');
  if (submitText) submitText.textContent = '✨ Portal Unlocking...';
  if (submitBtn) submitBtn.disabled = true;

  playCelebrationChime();

  const isRemember = rememberCheckbox ? rememberCheckbox.checked : true;
  if (isRemember) {
    localStorage.setItem(AUTH_STORAGE_KEY, matchedUser);
    sessionStorage.setItem(AUTH_STORAGE_KEY, matchedUser);
  } else {
    sessionStorage.setItem(AUTH_STORAGE_KEY, matchedUser);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  currentUser = matchedUser;
  localStorage.setItem('our_story_current_user', currentUser);
  localStorage.setItem('our_story_profile_selected', 'true');
  window.location.hash = currentUser;

  const loginScreen = document.getElementById('coupleLoginScreen');
  const appLayout = document.querySelector('.app-layout');

  if (loginScreen) {
    loginScreen.classList.add('login-success-fade');
  }

  setTimeout(() => {
    if (loginScreen) {
      loginScreen.classList.add('is-hidden');
      loginScreen.classList.remove('login-success-fade');
    }
    if (appLayout) {
      appLayout.classList.remove('is-auth-locked');
    }
    if (submitBtn) submitBtn.disabled = false;
    if (submitText) submitText.textContent = '✨ Unlock My Portal';
    if (passInput) passInput.value = '';

    // Clean up any lingering floating hearts from DOM
    document.querySelectorAll('.floating-love-heart').forEach(el => el.remove());

    // Initialize & update all components for the authenticated user
    updateProfileUI();
    renderAll();
    updatePulseIdentityUI();
    checkForIncomingPulseOnPortalSwitch();
    if (Notification.permission === 'granted') {
      registerClosedAppPushSubscription();
    }
    try { startAutoLocationSync(); } catch (e) {}

    // Sweet non-blocking welcome toast
    showPartnerMoodToast({
      user: currentUser,
      mood: 'romantic',
      text: `Welcome back, ${currentUser === 'himanshu' ? 'Himanshu ☕' : 'Gullu 🌸'}! Portal ready hai ✨`
    });
  }, 400);
}

function handlePortalLogout() {
  if (!confirm('Kya aap portal lock karke logout karna chahte hain? 🔒')) {
    return;
  }

  localStorage.removeItem(AUTH_STORAGE_KEY);
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
  currentUser = null;

  const loginScreen = document.getElementById('coupleLoginScreen');
  const appLayout = document.querySelector('.app-layout');
  const passInput = document.getElementById('loginPassword');
  const errorMsg = document.getElementById('loginErrorMsg');

  if (errorMsg) errorMsg.classList.add('is-hidden');
  if (passInput) passInput.value = '';
  if (appLayout) appLayout.classList.add('is-auth-locked');
  if (loginScreen) {
    loginScreen.classList.remove('is-hidden', 'login-success-fade');
    const prevUser = localStorage.getItem('our_story_current_user') || 'himanshu';
    selectLoginProfile(prevUser === 'gullu' ? 'Gullu' : 'Himanshu', false);
  }

  playTone(330, 0.2, 'sine', 0.1);
}

function promptSwitchUser(targetUser) {
  if (targetUser === currentUser) {
    showAppModal(
      '✨ Active Portal',
      `Aap already ${currentUser === 'himanshu' ? 'Himanshu ☕' : 'Gullu 🌸'} ke portal me hain!`
    );
    return;
  }

  const targetName = targetUser === 'himanshu' ? 'Himanshu ☕' : 'Gullu 🌸';
  const loginScreen = document.getElementById('coupleLoginScreen');
  const appLayout = document.querySelector('.app-layout');
  const passInput = document.getElementById('loginPassword');
  const errorMsg = document.getElementById('loginErrorMsg');

  selectLoginProfile(targetUser === 'himanshu' ? 'Himanshu' : 'Gullu', false);

  if (passInput) passInput.value = '';
  if (errorMsg) errorMsg.classList.add('is-hidden');

  if (appLayout) appLayout.classList.add('is-auth-locked');
  if (loginScreen) {
    loginScreen.classList.remove('is-hidden', 'login-success-fade');
  }

  if (passInput) passInput.focus();

  showAppModal(
    '🔐 Password Zaroori Hai',
    `${targetName} ka portal private hai. Access karne ke liye kripya password daal kar unlock karein.`
  );
}

// Switch Active Profile (Himanshu vs Gullu)
function setupProfileSwitcher() {
  const pillH = document.getElementById('pillHimanshu');
  const pillG = document.getElementById('pillGullu');

  if (pillH) pillH.addEventListener('click', () => promptSwitchUser('himanshu'));
  if (pillG) pillG.addEventListener('click', () => promptSwitchUser('gullu'));
}

function checkForIncomingPulseOnPortalSwitch() {
  const pulses = normalizeArray(appState?.pulses);
  if (pulses.length === 0) {
    updatePulseTabIncomingState(null);
    return;
  }
  const partnerName = currentUser === 'himanshu' ? 'Gullu' : 'Himanshu';
  const latestPulse = pulses[0];

  if (latestPulse && latestPulse.from === partnerName) {
    const pulseKey = latestPulse.id || ('pulse_' + latestPulse.timestamp) || ('pulse_' + latestPulse.time);
    const isLiveRecent = latestPulse.timestamp && (Date.now() - latestPulse.timestamp < 120000);

    if (lastAcknowledgedPulseId !== pulseKey && isLiveRecent) {
      triggerIncomingHeartbeatAlert(latestPulse);
    } else {
      updatePulseTabIncomingState(latestPulse);
    }
  } else {
    updatePulseTabIncomingState(null);
  }
}

// --- 2. TAB NAVIGATION ---
function setupTabNavigation() {
  const dockItems = document.querySelectorAll('.dock-item');

  function switchTab(tabId) {
    if (!tabId) return;
    dockItems.forEach(d => {
      if (d.getAttribute('data-tab') === tabId) d.classList.add('active');
      else d.classList.remove('active');
    });

    document.querySelectorAll('.tab-pane').forEach(p => {
      if (p.id === tabId) p.classList.add('active');
      else p.classList.remove('active');
    });

    if (tabId === 'panePulse') {
      fetchLatestCloudSync();
      setTimeout(() => {
        if (!coupleMap) initCoupleRadarMap();
        else coupleMap.invalidateSize();
      }, 200);
    } else if (tabId === 'paneChat') {
      const badge = document.getElementById('dockChatBadge');
      if (badge) badge.classList.add('is-hidden');
      renderChatUI();
      fetchLatestCloudSync();
      setTimeout(() => {
        const listEl = document.getElementById('chatMessagesList');
        if (listEl) listEl.scrollTop = listEl.scrollHeight;
        const inputWrap = document.querySelector('.chat-input-bar');
        if (inputWrap) {
          inputWrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 120);
    }
  }

  dockItems.forEach(item => {
    item.addEventListener('click', () => {
      const tabId = item.getAttribute('data-tab');
      switchTab(tabId);
      playTone(600, 0.1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // Check URL hash for direct tab navigation from notification click
  function handleHashNavigation() {
    const rawHash = (window.location.hash || '').replace('#', '').toLowerCase();
    if (rawHash === 'pulse' || rawHash === 'panepulse') switchTab('panePulse');
    else if (rawHash === 'panemood' || rawHash === 'mood') switchTab('paneMood');
    else if (rawHash === 'panevault' || rawHash === 'vault') switchTab('paneVault');
    else if (rawHash === 'paneqa' || rawHash === 'qa') switchTab('paneQA');
    else if (rawHash === 'panecoupons' || rawHash === 'coupons') switchTab('paneCoupons');
    else if (rawHash === 'panechat' || rawHash === 'chat') switchTab('paneChat');
    else if (rawHash === 'vc' || rawHash === 'call') {
      const modal = document.getElementById('videoCallModal');
      if (modal && vcState && (vcState.status === 'incoming' || vcState.status === 'active')) {
        modal.classList.remove('is-hidden');
      }
    }
  }

  window.addEventListener('hashchange', handleHashNavigation);
  setTimeout(handleHashNavigation, 200);
}

// --- 3. MEMORY VAULT LOGIC & SMART MATCH CARD ---
function showSmartMatchCard() {
  const card = document.getElementById('smartMatchCard');
  if (card) {
    card.classList.remove('is-hidden');
    card.style.removeProperty('display');
    card.style.display = 'flex';
  }
}

function hideSmartMatchCard() {
  const card = document.getElementById('smartMatchCard');
  if (card) {
    card.classList.add('is-hidden');
    card.style.display = 'none';
  }
}

// --- SMART IMAGE PIXEL ANALYSIS (REAL AI COMPUTER VISION) ---
function analyzePhotoVibe(base64Data) {
  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = 40;
          canvas.height = 40;
          ctx.drawImage(img, 0, 0, 40, 40);
          const imgData = ctx.getImageData(0, 0, 40, 40).data;

          let totalBrightness = 0;
          let totalRed = 0;
          let totalBlue = 0;
          const count = imgData.length / 4;

          for (let i = 0; i < imgData.length; i += 4) {
            const r = imgData[i];
            const g = imgData[i + 1];
            const b = imgData[i + 2];
            totalBrightness += (r * 0.299 + g * 0.587 + b * 0.114);
            totalRed += r;
            totalBlue += b;
          }

          const avgBrightness = totalBrightness / count;
          const isWarm = totalRed > totalBlue;

          if (currentMode === 'together') {
            resolve(Math.random() > 0.4 ? 'soulmate' : (isWarm ? 'radiant' : 'cinematic'));
          } else if (avgBrightness > 155) {
            resolve(isWarm ? 'radiant' : 'cinematic');
          } else if (avgBrightness < 95) {
            resolve('cozy');
          } else {
            const pool = ['cinematic', 'radiant', 'playful', 'cozy'];
            resolve(pool[Math.floor(Math.random() * pool.length)]);
          }
        } catch (err) {
          resolve('radiant');
        }
      };
      img.onerror = () => resolve('radiant');
      img.src = base64Data;
    } catch (e) {
      resolve('radiant');
    }
  });
}

function pickRandomMatching(isTogether = true, vibe = null) {
  if (vibe) {
    currentDetectedVibe = vibe;
  }
  const vibeCategory = AI_PHOTO_COMPLIMENTS[currentDetectedVibe] || AI_PHOTO_COMPLIMENTS.radiant;
  const list = vibeCategory.compliments;

  // Pick a fresh compliment that is different from the last one
  let available = list.filter(c => c !== lastCompliment);
  if (available.length === 0) available = list;
  currentComplimentText = available[Math.floor(Math.random() * available.length)];
  lastCompliment = currentComplimentText;

  // Curate song by vibe or random
  selectedSongIndex = Math.floor(Math.random() * SONG_CATALOG.length);

  const compEl = document.getElementById('smartComplimentText');
  const songEl = document.getElementById('smartSongText');
  const badgeEl = document.getElementById('aiVibeBadge');

  if (badgeEl) {
    badgeEl.textContent = vibeCategory.label;
  }
  if (compEl) {
    compEl.textContent = `"${currentComplimentText}"`;
  }
  if (songEl) {
    const s = SONG_CATALOG[selectedSongIndex];
    songEl.innerHTML = `<strong>${s.title}</strong> • ${s.artist} <span style="color:var(--text-muted); font-size:0.75rem;">(${s.vibe})</span>`;
  }
}

// --- IN-APP MUSIC PLAYER (PLAYS MUSIC DIRECTLY ON PAGE - NO REDIRECTION!) ---
let currentPlayingYtId = null;

function playSongInApp(title, artist, ytId) {
  const bar = document.getElementById('inAppMusicBar');
  const titleEl = document.getElementById('musicTrackTitle');
  const artistEl = document.getElementById('musicTrackArtist');
  const iframe = document.getElementById('musicIframe');

  if (!bar || !iframe) return;

  currentPlayingYtId = ytId;
  if (titleEl) titleEl.textContent = title || 'Romantic Track';
  if (artistEl) artistEl.textContent = artist || 'Our Story';

  // Embed YouTube player directly into app with autoplay, playsinline and controls
  const embedUrl = `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&enablejsapi=1&playsinline=1&controls=1&modestbranding=1&rel=0`;
  iframe.src = embedUrl;

  bar.classList.remove('is-hidden');
  playTone(550, 0.15);
}

function stopInAppMusic() {
  const bar = document.getElementById('inAppMusicBar');
  const iframe = document.getElementById('musicIframe');
  const wrap = document.getElementById('musicPlayerFrameWrap');
  if (iframe) iframe.src = '';
  if (bar) bar.classList.add('is-hidden');
  if (wrap) wrap.classList.remove('expanded');
  currentPlayingYtId = null;
}

function setupInAppMusicPlayer() {
  const closeBtn = document.getElementById('musicCloseBtn');
  const expandBtn = document.getElementById('musicExpandBtn');
  const frameWrap = document.getElementById('musicPlayerFrameWrap');

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      stopInAppMusic();
    });
  }

  if (expandBtn && frameWrap) {
    expandBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = frameWrap.classList.toggle('expanded');
      expandBtn.textContent = isExpanded ? '🔽' : '📺';
      expandBtn.title = isExpanded ? 'Minimize Video' : 'Expand Video';
    });
  }
}

function setupMemoryVault() {
  const modeTogether = document.getElementById('modeTogether');
  const modeApart = document.getElementById('modeApart');
  const fileInput = document.getElementById('memoryFileInput');
  const dropzone = document.getElementById('photoDropzone');
  const dropzoneEmpty = document.getElementById('dropzoneEmpty');
  const dropzonePreview = document.getElementById('dropzonePreview');
  const previewImg = document.getElementById('previewImg');
  const removePhotoBtn = document.getElementById('removePhotoBtn');
  const shuffleComplimentBtn = document.getElementById('shuffleComplimentBtn');
  const shuffleSongBtn = document.getElementById('shuffleSongBtn');
  const listenSongBtn = document.getElementById('listenSongBtn');
  const saveMemoryBtn = document.getElementById('saveMemoryBtn');

  // Mode Toggle
  if (modeTogether && modeApart) {
    modeTogether.addEventListener('click', () => {
      currentMode = 'together';
      modeTogether.classList.add('active');
      modeApart.classList.remove('active');
      if (currentPreviewBase64) pickRandomMatching(true, 'soulmate');
    });

    modeApart.addEventListener('click', () => {
      currentMode = 'apart';
      modeApart.classList.add('active');
      modeTogether.classList.remove('active');
      if (currentPreviewBase64) pickRandomMatching(false);
    });
  }

  async function handleLoadedPhoto(base64Data) {
    currentPreviewBase64 = base64Data;
    if (previewImg) previewImg.src = currentPreviewBase64;
    if (dropzoneEmpty) dropzoneEmpty.style.display = 'none';
    if (dropzonePreview) dropzonePreview.style.display = 'block';

    showSmartMatchCard();

    // Run real computer-vision image analysis
    const detectedVibe = await analyzePhotoVibe(base64Data);
    pickRandomMatching(currentMode === 'together', detectedVibe);

    try {
      playCelebrationChime();
    } catch (e) {}
  }

  // Photo Input Trigger & Change
  if (dropzone && fileInput) {
    dropzone.addEventListener('click', (e) => {
      if (e.target.id === 'removePhotoBtn' || e.target.closest('#removePhotoBtn')) return;
      fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          handleLoadedPhoto(event.target.result);
        };
        reader.readAsDataURL(file);
      }
    });

    // Drag & Drop
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('drag-active');
    });
    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('drag-active');
    });
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('drag-active');
      const file = e.dataTransfer.files && e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          handleLoadedPhoto(event.target.result);
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Remove Photo Button
  if (removePhotoBtn) {
    removePhotoBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      currentPreviewBase64 = null;
      if (dropzonePreview) dropzonePreview.style.display = 'none';
      if (dropzoneEmpty) dropzoneEmpty.style.display = 'block';
      if (fileInput) fileInput.value = '';
      hideSmartMatchCard();
      playTone(350, 0.1);
    });
  }

  // Shuffle Compliment (Picks a fresh compliment from detected vibe!)
  if (shuffleComplimentBtn) {
    shuffleComplimentBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      pickRandomMatching(currentMode === 'together', currentDetectedVibe);
      playTone(520, 0.15);
    });
  }

  // Shuffle Song
  if (shuffleSongBtn) {
    shuffleSongBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      selectedSongIndex = (selectedSongIndex + 1) % SONG_CATALOG.length;
      const song = SONG_CATALOG[selectedSongIndex];
      const songEl = document.getElementById('smartSongText');
      if (songEl) {
        songEl.innerHTML = `<strong>${song.title}</strong> • ${song.artist} <span style="color:var(--text-muted); font-size:0.75rem;">(${song.vibe})</span>`;
      }
      playTone(680, 0.15);
    });
  }

  // Listen to Song Preview (Plays right inside the app!)
  if (listenSongBtn) {
    listenSongBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const song = SONG_CATALOG[selectedSongIndex];
      if (song && song.ytId) {
        playSongInApp(song.title, song.artist, song.ytId);
      }
    });
  }

  // Save Memory to Forever Vault
  if (saveMemoryBtn) {
    saveMemoryBtn.addEventListener('click', async () => {
      if (!currentPreviewBase64) {
        showAppModal('📸 Photo Required', 'Pehle ek pyaari si photo choose karo! Tabhi uske vibe se AI compliment aur song match hoga ✨');
        playTone(300, 0.2);
        return;
      }

      const caption = document.getElementById('memoryCaptionInput').value.trim() || 'A sweet moment together ❤️';
      const compliment = currentComplimentText || (AI_PHOTO_COMPLIMENTS.radiant.compliments[0]);
      const song = SONG_CATALOG[selectedSongIndex];

      const payload = {
        mode: currentMode,
        author: currentMode === 'together' ? 'Himanshu & Gullu' : (currentUser === 'himanshu' ? 'Himanshu' : 'Gullu'),
        photoUrl: currentPreviewBase64,
        caption: caption,
        compliment: compliment,
        song: song,
        vibe: currentDetectedVibe
      };

      saveMemoryBtn.textContent = 'Saving to Vault... 💖';

      if (!appState) appState = JSON.parse(JSON.stringify(DEFAULT_APP_STATE));
      if (!appState.memories) appState.memories = [];

      const newMemory = {
        id: 'm_' + Date.now(),
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        ...payload
      };
      if (!Array.isArray(appState.memories)) appState.memories = normalizeArray(appState.memories);
      appState.memories.unshift(newMemory);
      saveAppState(appState);
      renderVaultFeed();

      // Broadcast new memory across Cloud & Cross-Tab
      broadcastUpdate('MEMORY_ADD', newMemory, true);

      playCelebrationChime();
      showAppModal('💖 Memory Saved!', `Your daily memory with "${song.title}" is permanently stored in your Forever Scrapbook!`);
      document.getElementById('memoryCaptionInput').value = '';
      hideSmartMatchCard();
      if (removePhotoBtn) removePhotoBtn.click();
      saveMemoryBtn.textContent = '💖 Save to Our Forever Vault';

      try {
        await fetch('/api/memory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (err) {}
    });
  }
}

function renderVaultFeed() {
  const feedList = document.getElementById('timelineList');
  const feedCount = document.getElementById('feedCount');
  if (!feedList || !appState) return;

  const memories = normalizeArray(appState.memories);
  if (feedCount) {
    feedCount.textContent = memories.length === 1 ? '1 Memory Saved' : `${memories.length} Memories Saved`;
  }

  if (memories.length === 0) {
    feedList.innerHTML = `
      <div class="empty-feed-card">
        <span class="empty-icon">📖✨</span>
        <h4 class="empty-title">Your Scrapbook is Waiting!</h4>
        <p class="empty-desc">Abhi tak koi memory save nahi hui hai. Aaj ki pehli photo upar add karo aur apni story start karo! 💖</p>
      </div>
    `;
    return;
  }

  // Auto-clean any legacy memory that contained user's chat lines
  let updatedAny = false;
  const OLD_PHRASES = ['khud se bhi zyada', 'galtiya me jan', 'waala pout', 'ek kamre me', 'chabhi kho'];
  memories.forEach(m => {
    if (m && m.compliment && OLD_PHRASES.some(p => m.compliment.toLowerCase().includes(p.toLowerCase()))) {
      m.compliment = "Nazar na lage! Is photo me jo natural glow aur genuine smile hai, screen par aate hi din bana deti hai. 📸✨";
      updatedAny = true;
    }
  });
  if (updatedAny) saveAppState(appState);

  feedList.innerHTML = memories.map(m => {
    const cleanTitle = (m.song?.title || 'Enchanted').replace(/'/g, "\\'");
    const cleanArtist = (m.song?.artist || 'Taylor Swift').replace(/'/g, "\\'");
    const ytId = m.song?.ytId || 'igIfiqqVHtA';

    return `
      <div class="memory-item-card">
        <div class="memory-item-img-wrap">
          <img src="${m.photoUrl}" alt="${m.caption}">
          <span class="memory-mode-pill">${m.mode === 'together' ? '💑 Together' : '📱 Apart'}</span>
        </div>
        <div class="memory-body">
          <div class="memory-meta-row">
            <span class="memory-date">🗓️ ${m.date} • ${m.timestamp || ''}</span>
            <span class="memory-author-badge">By ${m.author}</span>
          </div>
          <h4 class="memory-caption">${m.caption}</h4>
          <div class="memory-compliment-box">
            <div class="compliment-text-wrap">
              💌 <span id="compText_${m.id}">${m.compliment}</span>
            </div>
            <button class="memory-recompliment-btn" onclick="regenerateMemoryCompliment('${m.id}')" title="Get new AI Compliment">🎲</button>
          </div>
          <div class="memory-song-pill" onclick="playSongInApp('${cleanTitle}', '${cleanArtist}', '${ytId}')">
            <span class="song-play-icon">▶</span>
            <span><strong>${m.song?.title || 'Enchanted'}</strong> • ${m.song?.artist || 'Taylor Swift'}</span>
            <span class="song-inline-badge">Listen in App 🎵</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function regenerateMemoryCompliment(memoryId) {
  if (!appState || !appState.memories) return;
  const memory = appState.memories.find(m => m.id === memoryId);
  if (!memory) return;

  const allVibes = Object.keys(AI_PHOTO_COMPLIMENTS);
  const randomVibe = allVibes[Math.floor(Math.random() * allVibes.length)];
  const pool = AI_PHOTO_COMPLIMENTS[randomVibe].compliments;
  const newComp = pool[Math.floor(Math.random() * pool.length)];

  memory.compliment = newComp;
  saveAppState(appState);

  const el = document.getElementById(`compText_${memoryId}`);
  if (el) {
    el.textContent = newComp;
  }
  playTone(650, 0.2);
}

// --- 4. DAILY BLIND Q&A LOGIC ---
function renderQA() {
  if (!appState || !appState.currentQA) return;
  const qa = appState.currentQA;

  const qEl = document.getElementById('qaQuestion');
  const catEl = document.getElementById('qaCategory');
  const answerBox = document.getElementById('qaAnswerBox');
  const revealCard = document.getElementById('qaRevealCard');
  const himanshuAnswerText = document.getElementById('himanshuAnswerText');
  const gulluAnswerText = document.getElementById('gulluAnswerText');
  const pastList = document.getElementById('pastQAList');

  if (qEl) qEl.textContent = `"${qa.question}"`;
  if (catEl) catEl.textContent = qa.category || 'Romantic & Playful';

  const userAns = (qa.answers && qa.answers[currentUser]) ? qa.answers[currentUser] : null;
  const partnerUser = currentUser === 'himanshu' ? 'gullu' : 'himanshu';
  const partnerAns = (qa.answers && qa.answers[partnerUser]) ? qa.answers[partnerUser] : null;

  // If both have answered: REVEAL!
  if (qa.answers && qa.answers.himanshu && qa.answers.gullu) {
    if (answerBox) answerBox.style.display = 'none';
    if (revealCard) revealCard.style.display = 'block';
    if (himanshuAnswerText) himanshuAnswerText.textContent = `"${qa.answers.himanshu}"`;
    if (gulluAnswerText) gulluAnswerText.textContent = `"${qa.answers.gullu}"`;
  } else {
    // Hidden until both answer
    if (revealCard) revealCard.style.display = 'none';
    if (answerBox) {
      answerBox.style.display = 'block';
      const textarea = document.getElementById('qaTextarea');
      const submitBtn = document.getElementById('submitQABtn');
      let editBtn = document.getElementById('editMyAnswerBtn');

      if (userAns) {
        textarea.value = userAns;
        textarea.disabled = true;
        submitBtn.disabled = true;
        submitBtn.textContent = `🔒 Answer Locked! Waiting for ${currentUser === 'himanshu' ? 'Gullu 🌸' : 'Himanshu ☕'}...`;

        if (!editBtn) {
          editBtn = document.createElement('button');
          editBtn.id = 'editMyAnswerBtn';
          editBtn.className = 'edit-answer-btn';
          editBtn.innerHTML = '✏️ Edit / Change My Answer';
          editBtn.style.cssText = 'background:none; border:none; color:var(--accent-gold); font-size:0.75rem; text-decoration:underline; cursor:pointer; margin-top:10px; display:block; width:100%; text-align:center; padding:4px;';
          editBtn.onclick = () => {
            textarea.disabled = false;
            submitBtn.disabled = false;
            submitBtn.textContent = '🔒 Update & Re-Lock Answer';
            textarea.focus();
            editBtn.remove();
          };
          answerBox.appendChild(editBtn);
        }
      } else {
        textarea.value = '';
        textarea.disabled = false;
        submitBtn.disabled = false;
        submitBtn.textContent = '🔒 Lock & Submit My Answer';
        if (editBtn) editBtn.remove();
      }
    }
  }

  // Past QAs
  if (pastList && appState.pastQAs) {
    const pastQAs = normalizeArray(appState.pastQAs);
    pastList.innerHTML = pastQAs.map(p => `
      <div class="past-qa-item">
        <p class="past-q">"${p.question}"</p>
        <div style="font-size:0.75rem; color:var(--text-muted);">
          <strong style="color:var(--accent-gold);">☕ Himanshu:</strong> ${(p.answers && p.answers.himanshu) || ''}<br>
          <strong style="color:var(--accent-rose);">🌸 Gullu:</strong> ${(p.answers && p.answers.gullu) || ''}
        </div>
      </div>
    `).join('');
  }
}

// Full Question Pool for Randomizer
const QA_QUESTIONS_POOL = [
  { q: "Agar hum dono ek kamre me band ho jayein aur chabhi kho jaye, toh sabse pehli cheez kya karenge? 😉🗝️", cat: "Romantic & Naughty" },
  { q: "Gullu ki aisi kaunsi aadat ya harkat hai jispe Himanshu ko sabse zyada pyaar aata hai? 🥰", cat: "Cute & Wholesome" },
  { q: "Humari agli dream coffee date kahan honi chahiye aur kaun kya order karega? ☕✈️", cat: "Coffee Dates" },
  { q: "Pehli baar milte hi dil me sabse pehla khayal kya aaya tha? Sach sach batana! ✨", cat: "First Impressions" },
  { q: "Agar hum dono ek lambi road-trip par nikle, toh car me sabse pehle kaunsa gaana bajega? 🚗🎶", cat: "Music & Drives" },
  { q: "Gullu ka kaunsa pout expression sabse zyada dangerous aur cute lagta hai? 🐷👑", cat: "Pout Queen Vibes" },
  { q: "Ek aisi baat jo tumne abhi tak mujhe khul ke nahi batai par hamesha dil me rehti hai? 🤫❤️", cat: "Deep Secrets" },
  { q: "Agar hum dono ko 1 poora din bina phone ke saath bitana ho, toh subah se shaam tak kya karenge? 📱❌", cat: "Quality Time" },
  { q: "Jab hum dono ki choti si ladai hoti hai, toh sabse pehle manane kaun aata hai? ⚖️🤭", cat: "Sweet Banter" },
  { q: "Humare pure rishte ka abhi tak ka sabse favorite aur memorable moment kaunsa hai? 📸💖", cat: "Core Memories" },
  { q: "Agar hum dono ko raat ko 2 baje craving ho, toh late night kya khane jayenge? 🍦🍕", cat: "Midnight Cravings" },
  { q: "Ek word me describe karo: Gullu Himanshu ke liye kya hai, aur Himanshu Gullu ke liye? 🌸☕", cat: "Pure Romance" }
];

function setupQAHandlers() {
  const submitBtn = document.getElementById('submitQABtn');
  const newQuestionBtn = document.getElementById('newQuestionBtn');

  if (submitBtn) {
    submitBtn.addEventListener('click', async () => {
      const textarea = document.getElementById('qaTextarea');
      const text = textarea ? textarea.value.trim() : '';
      if (!text) {
        showAppModal('✏️ Answer Khali Hai!', 'Pehle apna answer likho, phir lock karo! ❤️');
        playTone(300, 0.2);
        return;
      }

      if (!appState) appState = JSON.parse(JSON.stringify(DEFAULT_APP_STATE));
      if (!appState.currentQA) appState.currentQA = JSON.parse(JSON.stringify(DEFAULT_APP_STATE.currentQA));
      if (!appState.currentQA.answers) appState.currentQA.answers = { himanshu: null, gullu: null };

      // Immediately write answer to current user & save locally
      appState.currentQA.answers[currentUser] = text;
      saveAppState(appState);

      // Broadcast Q&A Answer in real-time across Cloud & Cross-Tab
      broadcastUpdate('QA_ANSWER', {
        user: currentUser,
        answer: text,
        qId: appState.currentQA.id
      }, true);

      const isBoth = !!(appState.currentQA.answers.himanshu && appState.currentQA.answers.gullu);

      if (isBoth) {
        playCelebrationChime();
        showAppModal('🎉 Both Answers Unlocked!', 'Aap dono ne answer lock kar diya hai! Dono answers reveal ho gaye hain! 💕');
      } else {
        playTone(587.33, 0.25);
        const partnerName = currentUser === 'himanshu' ? 'Gullu 🌸' : 'Himanshu ☕';
        showAppModal('🔒 Answer Locked!', `Aapka answer lock ho gaya hai! Jab tak <strong>${partnerName}</strong> apna answer lock nahi karegi/karega, tab tak hidden rahega! 😉`);
      }

      renderQA();

      // Sync to server in background if active
      try {
        await fetch('/api/qa/answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user: currentUser, answer: text })
        });
      } catch (e) {}
    });
  }

  if (newQuestionBtn) {
    newQuestionBtn.addEventListener('click', async () => {
      playTone(600, 0.2);

      if (!appState) appState = JSON.parse(JSON.stringify(DEFAULT_APP_STATE));
      if (!appState.pastQAs) appState.pastQAs = [];

      // If previous question was answered by both, archive it to past QAs
      if (appState.currentQA && appState.currentQA.answers && appState.currentQA.answers.himanshu && appState.currentQA.answers.gullu) {
        appState.pastQAs.unshift({
          id: appState.currentQA.id || Date.now(),
          question: appState.currentQA.question,
          answers: { ...appState.currentQA.answers }
        });
      }

      // Pick a random question different from current
      const currentQText = appState.currentQA ? appState.currentQA.question : '';
      const pool = QA_QUESTIONS_POOL.filter(item => item.q !== currentQText);
      const chosen = pool[Math.floor(Math.random() * pool.length)] || QA_QUESTIONS_POOL[0];

      appState.currentQA = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        question: chosen.q,
        category: chosen.cat,
        answers: { himanshu: null, gullu: null }
      };

      saveAppState(appState);
      renderQA();

      // Broadcast New Question in real-time across Cloud & Cross-Tab
      broadcastUpdate('QA_NEW', {
        newQA: appState.currentQA,
        pastQA: appState.pastQAs[0] || null
      }, true);

      // Animate question card pop
      const qCard = document.querySelector('.qa-card');
      if (qCard) {
        qCard.style.animation = 'none';
        qCard.offsetHeight;
        qCard.style.animation = 'modalPop 0.35s ease';
      }

      // Sync to server in background if active
      try {
        await fetch('/api/qa/new', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: chosen.q, category: chosen.cat })
        });
      } catch (e) {}
    });
  }
}

// --- 5. ROMANTIC LOVE COUPONS LOGIC ---
function renderCoupons() {
  const grid = document.getElementById('couponsGrid');
  if (!grid) return;

  if (!appState) appState = JSON.parse(JSON.stringify(DEFAULT_APP_STATE));
  if (!Array.isArray(appState.coupons)) {
    appState.coupons = normalizeArray(appState.coupons);
  }
  if (appState.coupons.length === 0) {
    appState.coupons = JSON.parse(JSON.stringify(DEFAULT_APP_STATE.coupons));
    saveAppState(appState);
  }

  grid.innerHTML = appState.coupons.map(c => {
    const isRedeemed = c.redeemed;
    const canRedeem = !isRedeemed && (c.forUser === 'both' || c.forUser === currentUser);
    const isCustom = c.isCustom;
    return `
      <div class="coupon-ticket ${isRedeemed ? 'is-redeemed' : ''}">
        <div class="coupon-header">
          <span class="coupon-target">For: ${c.forUser === 'both' ? 'Both of Us 💑' : (c.forUser === 'gullu' ? 'Gullu 🌸' : 'Himanshu ☕')}${isCustom ? ' <span style="color:var(--accent-gold); font-size:0.65rem;">(Custom Gift ✨)</span>' : ''}</span>
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="coupon-badge ${isRedeemed ? 'redeemed' : 'available'}">
              ${isRedeemed ? 'REDEEMED' : 'READY TO USE'}
            </span>
            ${isCustom ? `<button class="delete-coupon-btn" title="Delete custom coupon" onclick="deleteCustomCoupon('${c.id}')">✕</button>` : ''}
          </div>
        </div>
        <h4 class="coupon-title">${c.title}</h4>
        <p class="coupon-desc">${c.desc}</p>
        <div class="coupon-footer">
          <span class="coupon-stamp">${isRedeemed ? `Used: ${c.redeemedAt || 'Recently'}` : 'Redeemable anytime'}</span>
          <button class="redeem-btn" ${!canRedeem ? 'disabled' : ''} onclick="redeemCoupon('${c.id}')">
            ${isRedeemed ? 'Redeemed ✨' : 'Redeem Coupon 🎟️'}
          </button>
        </div>
      </div>
    `;
  }).join('');
}

async function redeemCoupon(couponId) {
  if (!appState || !appState.coupons) return;
  const coupon = appState.coupons.find(c => c.id === couponId);
  if (!coupon || coupon.redeemed) return;

  coupon.redeemed = true;
  coupon.redeemedAt = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  coupon.redeemedBy = currentUser;
  saveAppState(appState);
  renderCoupons();

  // Broadcast coupon redemption across Cloud & Cross-Tab
  broadcastUpdate('COUPON_REDEEM', { couponId, user: currentUser }, true);

  playCelebrationChime();
  const waMsg = `Oyeee! Maine app me yeh Love Coupon REDEEM kar liya: "${coupon.title}"! Ab tumhari baari hai ise poora karne ki! 😉☕❤️`;
  showAppModal('🎟️ Coupon Redeemed!', `${coupon.title} is now officially stamped! Tap below to notify Himanshu on WhatsApp:`, waMsg);

  try {
    await fetch('/api/coupon/redeem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ couponId, user: currentUser })
    });
  } catch (e) {}
}

function setupCouponCreation() {
  const card = document.getElementById('createCouponCard');
  const toggleHeader = document.getElementById('toggleCreateCouponBtn');
  const form = document.getElementById('createCouponForm');
  const titleInput = document.getElementById('newCouponTitle');
  const descInput = document.getElementById('newCouponDesc');
  const saveBtn = document.getElementById('saveCustomCouponBtn');
  const presetChips = document.querySelectorAll('.preset-chip');

  if (!card || !toggleHeader || !form) return;

  function toggleForm() {
    const isOpen = form.style.display !== 'none';
    form.style.display = isOpen ? 'none' : 'flex';
    card.classList.toggle('open', !isOpen);
    playTone(isOpen ? 400 : 550, 0.1);
  }

  toggleHeader.addEventListener('click', (e) => {
    // Don't toggle if clicking inside the form elements
    if (e.target.closest('#createCouponForm')) return;
    toggleForm();
  });

  presetChips.forEach(chip => {
    chip.addEventListener('click', (e) => {
      e.stopPropagation();
      titleInput.value = chip.getAttribute('data-title') || '';
      descInput.value = chip.getAttribute('data-desc') || '';
      playTone(650, 0.1);
      titleInput.focus();
    });
  });

  if (saveBtn) {
    saveBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const title = titleInput.value.trim();
      const desc = descInput.value.trim() || 'Redeemable anytime with love ❤️';

      if (!title) {
        showAppModal('✏️ Title Zaroori Hai!', 'Pehle coupon ka cute sa title likho! e.g. Late Night Maggi 🍜');
        playTone(300, 0.2);
        titleInput.focus();
        return;
      }

      const radioChecked = document.querySelector('input[name="couponForUser"]:checked');
      const forUser = radioChecked ? radioChecked.value : 'both';

      if (!appState) appState = JSON.parse(JSON.stringify(DEFAULT_APP_STATE));
      if (!appState.coupons) appState.coupons = [];

      const newCoupon = {
        id: 'c_' + Date.now(),
        title: title,
        desc: desc,
        forUser: forUser,
        redeemed: false,
        isCustom: true,
        createdBy: currentUser
      };

      appState.coupons.unshift(newCoupon);
      saveAppState(appState);
      renderCoupons();

      // Broadcast new coupon across Cloud & Cross-Tab
      broadcastUpdate('COUPON_CREATE', newCoupon, true);

      playCelebrationChime();
      showAppModal('🎟️ Love Coupon Created!', `Aapka naya coupon <strong>"${title}"</strong> coupon book me add ho gaya hai!`);

      // Reset and close form
      titleInput.value = '';
      descInput.value = '';
      form.style.display = 'none';
      card.classList.remove('open');

      try {
        await fetch('/api/coupon/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newCoupon)
        });
      } catch (err) {}
    });
  }
}

function deleteCustomCoupon(couponId) {
  if (!confirm("Are you sure you want to remove this custom coupon?")) return;
  if (!appState || !appState.coupons) return;
  appState.coupons = appState.coupons.filter(c => c.id !== couponId);
  saveAppState(appState);
  renderCoupons();
  playTone(400, 0.15);

  broadcastUpdate('COUPON_DELETE', { couponId }, true);

  try {
    fetch('/api/coupon/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ couponId })
    });
  } catch (err) {}
}

function dispatchHeartbeatPulse(customNote = null) {
  playCelebrationChime();
  if (navigator.vibrate) {
    try { navigator.vibrate([160, 80, 220, 80, 400]); } catch (err) {}
  }

  // Request notification permission if still default
  if ('Notification' in window && Notification.permission === 'default') {
    try { Notification.requestPermission(); } catch (e) {}
  }

  const partner = currentUser === 'himanshu' ? 'Gullu 🌸' : 'Himanshu ☕';
  const myName = currentUser === 'himanshu' ? 'Himanshu' : 'Gullu';
  const partnerName = currentUser === 'himanshu' ? 'Gullu' : 'Himanshu';
  const pulseId = 'pulse_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);

  const newPulse = {
    id: pulseId,
    from: myName,
    to: partnerName,
    senderUser: currentUser,
    deviceId: myDeviceId,
    time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    timestamp: Date.now(),
    note: customNote || `Sent a warm heartbeat pulse to ${partner} ❤️`
  };

  if (!appState) appState = JSON.parse(JSON.stringify(DEFAULT_APP_STATE));
  if (!Array.isArray(appState.pulses)) {
    appState.pulses = normalizeArray(appState.pulses);
  }
  appState.pulses.unshift(newPulse);
  if (appState.pulses.length > 25) appState.pulses.pop();
  saveAppState(appState);
  renderPulseHistory();

  // Mark our own sent pulse as acknowledged so we don't trigger incoming alert on ourselves
  lastAcknowledgedPulseId = pulseId;
  localStorage.setItem('our_story_last_pulse_ack', pulseId);

  // Broadcast in real-time across Cloud (MQTT) + Cross-tab (BroadcastChannel) + Firebase RTDB
  broadcastUpdate('PULSE_SENT', newPulse, true);

  showAppModal('💓 Heartbeat Delivered!', `A warm, loving heartbeat was sent to ${partner}! Dil ki dhadkan deliver ho gayi!`);

  const statusText = document.getElementById('pulseStatusText');
  if (statusText) statusText.textContent = `Delivered to ${partner}! Hold or tap to send another warmth.`;
}

// --- 6. LIVE HEARTBEAT PULSE / MISS YOU ---
function setupPulseArena() {
  const heart = document.getElementById('interactiveHeart');
  const instantBtn = document.getElementById('pulseInstantSendBtn');
  const switchBtn = document.getElementById('pulseSwitchUserBtn');
  const progressWrap = document.getElementById('pulseHoldBarWrap');
  const progressFill = document.getElementById('pulseHoldBarFill');
  const statusText = document.getElementById('pulseStatusText');

  let holdTimer = null;
  let heartbeatAudioInterval = null;
  let progressInterval = null;
  let holdStartTime = 0;
  let touchStartX = 0;
  let touchStartY = 0;

  if (switchBtn) {
    switchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetUser = currentUser === 'himanshu' ? 'gullu' : 'himanshu';
      promptSwitchUser(targetUser);
    });
  }

  if (instantBtn) {
    instantBtn.addEventListener('click', (e) => {
      e.preventDefault();
      dispatchHeartbeatPulse();
      if (heart) {
        heart.classList.add('holding');
        setTimeout(() => heart.classList.remove('holding'), 400);
        createFloatingHeart(heart);
        createFloatingHeart(heart);
      }
    });
  }

  if (!heart) return;

  function doHeartbeatHaptic() {
    if (navigator.vibrate) {
      try {
        navigator.vibrate([140, 70, 220]);
      } catch (err) {}
    }
  }

  function startHold(e) {
    if (e.cancelable) e.preventDefault();

    // If there is an active incoming pulse waiting to be felt, feeling takes precedence
    if (heart.classList.contains('has-incoming-pulse')) {
      const partnerName = currentUser === 'himanshu' ? 'Gullu' : 'Himanshu';
      const pulses = normalizeArray(appState?.pulses);
      const latestPulse = pulses.find(p => p.from === partnerName);
      if (latestPulse) {
        feelIncomingHeartbeat(latestPulse);
        return;
      }
    }

    holdStartTime = Date.now();
    heart.classList.add('holding');
    playHeartbeatSound();
    doHeartbeatHaptic();

    if (progressWrap) progressWrap.classList.add('active');
    if (progressFill) progressFill.style.width = '0%';

    const partner = currentUser === 'himanshu' ? 'Gullu 🌸' : 'Himanshu ☕';
    if (statusText) statusText.textContent = `Holding... sending warm heartbeat to ${partner} 💓`;

    // Animate progress bar fill over 1400ms
    progressInterval = setInterval(() => {
      const elapsed = Date.now() - holdStartTime;
      const pct = Math.min(100, Math.round((elapsed / 1400) * 100));
      if (progressFill) progressFill.style.width = pct + '%';
    }, 40);

    heartbeatAudioInterval = setInterval(() => {
      playHeartbeatSound();
      doHeartbeatHaptic();
      createFloatingHeart(heart);
    }, 550);

    holdTimer = setTimeout(() => {
      cancelHoldIntervals();
      heart.classList.remove('holding');
      if (progressWrap) progressWrap.classList.remove('active');
      if (progressFill) progressFill.style.width = '0%';

      dispatchHeartbeatPulse();
    }, 1400);
  }

  function cancelHoldIntervals() {
    clearTimeout(holdTimer);
    clearInterval(heartbeatAudioInterval);
    clearInterval(progressInterval);
  }

  function cancelHold() {
    cancelHoldIntervals();
    if (navigator.vibrate) {
      try { navigator.vibrate(0); } catch (e) {}
    }
    heart.classList.remove('holding');
    if (progressWrap) progressWrap.classList.remove('active');
    if (progressFill) progressFill.style.width = '0%';

    const partner = currentUser === 'himanshu' ? 'Gullu 🌸' : 'Himanshu ☕';
    if (statusText) statusText.textContent = `Hold for 1.5 seconds or tap button below to send warmth to ${partner}...`;
  }

  heart.addEventListener('mousedown', startHold);
  heart.addEventListener('mouseup', cancelHold);
  heart.addEventListener('mouseleave', cancelHold);

  heart.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches[0]) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
    startHold(e);
  }, { passive: false });

  heart.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      const dx = Math.abs(e.touches[0].clientX - touchStartX);
      const dy = Math.abs(e.touches[0].clientY - touchStartY);
      if (dx > 45 || dy > 45) {
        cancelHold();
      }
    }
  }, { passive: true });

  heart.addEventListener('touchend', cancelHold);
  heart.addEventListener('touchcancel', cancelHold);
  heart.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });

  updatePulseIdentityUI();
}

// ==========================================================================
// 8. LIVE LOCATION & DISTANCE RADAR (HIMANSHU & GULLU)
// ==========================================================================

let coupleMap = null;
let markerH = null;
let markerG = null;
let connectionLine = null;
let autoLocationSyncTimer = null;
let autoLocationWatchId = null;
let lastGeocodedLat = null;
let lastGeocodedLng = null;
let lastGeocodedAddress = null;
let lastGeocodedTimestamp = 0;
let isLocationSyncInProgress = false;
let lastBoundPosH = null;
let lastBoundPosG = null;
let lastLiveWatchTimestamp = 0;

// Haversine Great-Circle Distance Calculation Formula
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function getRomanticDistanceMessage(distKm) {
  if (distKm < 0.05) {
    return "Together right now! In the same room or right beside each other 🥰";
  } else if (distKm < 0.8) {
    return "Super close! Just a quick 2-minute walk away 🏃‍♂️💨";
  } else if (distKm < 5.0) {
    return "Nearby in the same area! Time for a quick coffee date ☕🛵";
  } else if (distKm < 25.0) {
    return "Same city vibes! Heading over to see you soon 🚗💨";
  } else if (distKm < 150.0) {
    return "Across town, but connected by heartbeat every second 💓";
  } else {
    return "Miles apart, but heart to heart forever & always ❤️✈️";
  }
}

function initCoupleRadarMap() {
  const mapEl = document.getElementById('coupleRadarMap');
  if (!mapEl || coupleMap || typeof L === 'undefined') return;

  try {
    coupleMap = L.map('coupleRadarMap', {
      zoomControl: true,
      attributionControl: false
    }).setView([28.6139, 77.2090], 11);

    // CartoDB Voyager tiles (clean, beautiful, high-contrast romantic map)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(coupleMap);

    updateCoupleLocationsUI();
  } catch (err) {
    console.warn('Leaflet map init warning:', err);
  }
}

function createCustomMarkerIcon(user, name, emoji) {
  return L.divIcon({
    className: 'custom-leaflet-icon-wrap',
    html: `
      <div class="map-custom-marker ${user}">
        <div class="marker-pin">${emoji}</div>
        <span class="marker-tag">${name}</span>
      </div>
    `,
    iconSize: [40, 56],
    iconAnchor: [20, 50],
    popupAnchor: [0, -45]
  });
}

function formatLocationAge(loc) {
  if (!loc || !loc.timestamp) return 'Location not shared yet';
  const diff = Date.now() - loc.timestamp;
  if (diff < 60 * 1000) return 'Updated Just now ✨';
  if (diff < 60 * 60 * 1000) return `Updated ${Math.floor(diff / 60000)}m ago (${loc.time || ''})`;
  if (diff < 24 * 60 * 60 * 1000) return `Today at ${loc.time || ''} (${Math.floor(diff / 3600000)}h ago)`;
  if (diff < 48 * 60 * 60 * 1000) return `Yesterday at ${loc.time || ''} <span class="stale-badge">⏱️ Old</span>`;
  const d = new Date(loc.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  return `${d} at ${loc.time || ''} <span class="stale-badge">⏱️ Stale</span>`;
}

function updateCoupleLocationsUI() {
  const hLoc = appState?.locations?.himanshu;
  const gLoc = appState?.locations?.gullu;

  const hAddr = document.getElementById('himanshuLocAddress');
  const hTime = document.getElementById('himanshuLocTime');
  const gAddr = document.getElementById('gulluLocAddress');
  const gTime = document.getElementById('gulluLocTime');

  const distVal = document.getElementById('radarDistanceValue');
  const distUnit = document.getElementById('radarDistanceUnit');
  const headerDistText = document.getElementById('headerDistanceText');
  const romanticMsg = document.getElementById('radarRomanticMsg');
  const directionsBtn = document.getElementById('radarDirectionsBtn');
  const deviceNotice = document.getElementById('radarDeviceNotice');
  const deviceNoticeText = document.getElementById('radarDeviceNoticeText');

  if (hAddr) hAddr.textContent = hLoc?.address || 'Location not shared yet';
  if (hTime) hTime.innerHTML = formatLocationAge(hLoc);

  if (gAddr) gAddr.textContent = gLoc?.address || 'Location not shared yet';
  if (gTime) gTime.innerHTML = formatLocationAge(gLoc);

  // If both locations are available, calculate real distance & update map
  if (hLoc && gLoc && typeof hLoc.lat === 'number' && typeof gLoc.lat === 'number') {
    const distKm = calculateDistanceKm(hLoc.lat, hLoc.lng, gLoc.lat, gLoc.lng);

    let displayNum, displayUnit, headerText;
    if (distKm < 1.0) {
      const meters = Math.max(1, Math.round(distKm * 1000));
      displayNum = meters;
      displayUnit = 'meters';
      headerText = `${meters} m`;
    } else {
      displayNum = distKm.toFixed(1);
      displayUnit = 'km';
      headerText = `${distKm.toFixed(1)} km`;
    }

    if (distVal) distVal.textContent = displayNum;
    if (distUnit) distUnit.textContent = displayUnit;
    if (headerDistText) headerDistText.textContent = headerText;
    if (romanticMsg) romanticMsg.textContent = getRomanticDistanceMessage(distKm);

    // Same-device or Identical GPS detection (< 35m)
    const isSameDevice = (hLoc.deviceId && gLoc.deviceId && hLoc.deviceId === gLoc.deviceId);
    const isIdenticalGps = distKm < 0.035;

    if (deviceNotice) {
      if (isSameDevice || (isIdenticalGps && !hLoc.isCustom && !gLoc.isCustom)) {
        deviceNotice.classList.remove('is-hidden');
        if (deviceNoticeText) {
          deviceNoticeText.textContent = 'Dono profiles ek hi device se recorded hain (~14m). Partner jab apne alag phone se "Update Location" dabayegi tab real distance dikhega. Ya "Apart Mode" se test karein.';
        }
      } else {
        deviceNotice.classList.add('is-hidden');
      }
    }

    if (directionsBtn) {
      directionsBtn.disabled = false;
      const partnerUser = currentUser === 'himanshu' ? 'gullu' : 'himanshu';
      const partnerName = currentUser === 'himanshu' ? 'Gullu 🌸' : 'Himanshu ☕';
      const myLoc = currentUser === 'himanshu' ? hLoc : gLoc;
      const pLoc = currentUser === 'himanshu' ? gLoc : hLoc;

      directionsBtn.textContent = `🚗 Route to ${partnerName} (${headerText})`;
      directionsBtn.onclick = () => {
        const url = `https://www.google.com/maps/dir/?api=1&origin=${myLoc.lat},${myLoc.lng}&destination=${pLoc.lat},${pLoc.lng}&travelmode=driving`;
        window.open(url, '_blank');
      };
    }

    // Update Leaflet Map if initialized
    if (coupleMap && typeof L !== 'undefined') {
      const posH = [hLoc.lat, hLoc.lng];
      const posG = [gLoc.lat, gLoc.lng];

      if (!markerH) {
        markerH = L.marker(posH, { icon: createCustomMarkerIcon('himanshu', 'Himanshu', '☕') }).addTo(coupleMap);
      } else {
        markerH.setLatLng(posH);
      }
      markerH.bindPopup(`<b>Himanshu ☕</b><br>${hLoc.address || 'Current Location'}<br><small>${hLoc.time || ''}</small>`);

      if (!markerG) {
        markerG = L.marker(posG, { icon: createCustomMarkerIcon('gullu', 'Gullu', '🌸') }).addTo(coupleMap);
      } else {
        markerG.setLatLng(posG);
      }
      markerG.bindPopup(`<b>Gullu 🌸</b><br>${gLoc.address || 'Current Location'}<br><small>${gLoc.time || ''}</small>`);

      if (!connectionLine) {
        connectionLine = L.polyline([posH, posG], {
          color: '#ff2a6d',
          weight: 3.5,
          dashArray: '8, 8',
          opacity: 0.85
        }).addTo(coupleMap);
      } else {
        connectionLine.setLatLngs([posH, posG]);
      }

      if (!window.__mapBoundsInitialized ||
          !lastBoundPosH ||
          calculateDistanceKm(lastBoundPosH[0], lastBoundPosH[1], posH[0], posH[1]) > 0.08 ||
          !lastBoundPosG ||
          calculateDistanceKm(lastBoundPosG[0], lastBoundPosG[1], posG[0], posG[1]) > 0.08) {
        try {
          coupleMap.fitBounds(L.latLngBounds([posH, posG]), { padding: [50, 50], maxZoom: 15 });
          window.__mapBoundsInitialized = true;
          lastBoundPosH = posH;
          lastBoundPosG = posG;
        } catch (e) {}
      }
    }
  } else if (hLoc || gLoc) {
    if (deviceNotice) deviceNotice.classList.add('is-hidden');

    const singleLoc = hLoc || gLoc;
    const singleUser = hLoc ? 'himanshu' : 'gullu';
    const singleName = hLoc ? 'Himanshu ☕' : 'Gullu 🌸';

    if (distVal) distVal.textContent = '--';
    if (distUnit) distUnit.textContent = 'km';
    if (headerDistText) headerDistText.textContent = '-- km';
    if (romanticMsg) romanticMsg.textContent = `Waiting for ${singleUser === currentUser ? 'partner' : singleName} to share location... ❤️`;

    if (directionsBtn) {
      directionsBtn.disabled = true;
      directionsBtn.textContent = '🚗 Directions to Partner in Google Maps';
    }

    if (connectionLine && coupleMap) {
      coupleMap.removeLayer(connectionLine);
      connectionLine = null;
    }

    if (coupleMap && typeof L !== 'undefined' && singleLoc.lat) {
      const pos = [singleLoc.lat, singleLoc.lng];
      if (hLoc) {
        if (!markerH) markerH = L.marker(pos, { icon: createCustomMarkerIcon('himanshu', 'Himanshu', '☕') }).addTo(coupleMap);
        else markerH.setLatLng(pos);
        if (markerG && coupleMap) { coupleMap.removeLayer(markerG); markerG = null; }
      } else {
        if (!markerG) markerG = L.marker(pos, { icon: createCustomMarkerIcon('gullu', 'Gullu', '🌸') }).addTo(coupleMap);
        else markerG.setLatLng(pos);
        if (markerH && coupleMap) { coupleMap.removeLayer(markerH); markerH = null; }
      }
      coupleMap.setView(pos, 13);
    }
  } else {
    // Neither location available
    if (deviceNotice) deviceNotice.classList.add('is-hidden');
    if (distVal) distVal.textContent = '--';
    if (distUnit) distUnit.textContent = 'km';
    if (headerDistText) headerDistText.textContent = '-- km';
    if (romanticMsg) romanticMsg.textContent = 'Tap "Update Location" to calculate distance ❤️';
    if (directionsBtn) {
      directionsBtn.disabled = true;
      directionsBtn.textContent = '🚗 Directions to Partner in Google Maps';
    }
    if (connectionLine && coupleMap) { coupleMap.removeLayer(connectionLine); connectionLine = null; }
    if (markerH && coupleMap) { coupleMap.removeLayer(markerH); markerH = null; }
    if (markerG && coupleMap) { coupleMap.removeLayer(markerG); markerG = null; }
  }
}

async function processAndBroadcastLocation(position, activeUser, silent) {
  if (!position || !position.coords) return;
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;
  const accuracy = Math.round(position.coords.accuracy || 10);

  let prettyAddress = `${lat.toFixed(3)}° N, ${lng.toFixed(3)}° E`;

  // Smart Reverse Geocode Cache (Avoids Nominatim 429 rate limit when updating every 5s)
  const now = Date.now();
  const movedKm = (lastGeocodedLat && lastGeocodedLng)
    ? calculateDistanceKm(lastGeocodedLat, lastGeocodedLng, lat, lng)
    : 999;

  const shouldGeocode = !lastGeocodedAddress || movedKm > 0.05 || (now - lastGeocodedTimestamp > 300000);

  if (!shouldGeocode && lastGeocodedAddress) {
    prettyAddress = lastGeocodedAddress;
  } else {
    try {
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14`,
        { headers: { 'Accept': 'application/json' } }
      );
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        if (geoData && geoData.address) {
          const a = geoData.address;
          const primaryArea = a.neighbourhood || a.suburb || a.city_district || a.road || a.commercial || a.residential;
          const city = a.city || a.town || a.county || a.state_district || a.state;
          if (primaryArea && city) {
            prettyAddress = `${primaryArea}, ${city}`;
          } else if (city) {
            prettyAddress = city;
          } else if (geoData.display_name) {
            prettyAddress = geoData.display_name.split(',').slice(0, 2).join(',').trim();
          }
          lastGeocodedAddress = prettyAddress;
          lastGeocodedLat = lat;
          lastGeocodedLng = lng;
          lastGeocodedTimestamp = now;
        }
      }
    } catch (err) {
      if (lastGeocodedAddress) prettyAddress = lastGeocodedAddress;
    }
  }

  const locPayload = {
    lat,
    lng,
    accuracy,
    address: prettyAddress,
    time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    timestamp: Date.now(),
    user: activeUser,
    deviceId: myDeviceId,
    deviceType: /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent) ? 'phone' : 'pc',
    silent: !!silent
  };

  if (!appState) appState = JSON.parse(JSON.stringify(DEFAULT_APP_STATE));
  if (!appState.locations) appState.locations = {};
  appState.locations[activeUser] = locPayload;
  saveAppState(appState);
  updateCoupleLocationsUI();

  // Realtime Cloud Broadcast across Firebase RTDB & MQTT
  broadcastUpdate('LOCATION_UPDATE', locPayload, true);

  if (!silent) {
    playCelebrationChime();
    if (navigator.vibrate) navigator.vibrate([100, 50, 150]);
    showAppModal(
      '📍 Location Shared!',
      `Aapki exact location (${prettyAddress}) partner ke saath share ho gayi hai!`
    );
  }
}

async function shareMyLocation(silent = false) {
  if (!navigator.geolocation) {
    if (!silent) showAppModal('ℹ️ GPS Not Supported', 'Aapka browser geolocation support nahi karta.');
    return;
  }

  const activeUser = currentUser || getAuthenticatedUser();
  if (!activeUser) {
    if (!silent) showAppModal('🔐 Login Required', 'Location share karne ke liye pehle apna portal unlock karein.');
    return;
  }

  if (isLocationSyncInProgress) return;

  const btn = document.getElementById('radarUpdateMyLocBtn');
  if (btn && !silent) {
    btn.classList.add('loading');
    btn.innerHTML = `<span class="refresh-btn-icon">⏳</span> Locating...`;
  }

  isLocationSyncInProgress = true;

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      isLocationSyncInProgress = false;
      await processAndBroadcastLocation(position, activeUser, silent);
      if (btn && !silent) {
        btn.classList.remove('loading');
        btn.innerHTML = `<span class="refresh-btn-icon">🎯</span> Update Location`;
      }
    },
    (error) => {
      isLocationSyncInProgress = false;
      console.warn('Geolocation error:', error);
      if (btn && !silent) {
        btn.classList.remove('loading');
        btn.innerHTML = `<span class="refresh-btn-icon">🎯</span> Update Location`;
      }
      if (!silent) {
        showAppModal(
          '⚠️ Location Permission Required',
          'Phone settings me jaakar location permission allow karein taaki exact distance calculate ho sake.'
        );
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 6000,
      maximumAge: 4000
    }
  );
}

function handleLiveGpsPosition(position) {
  const activeUser = currentUser || getAuthenticatedUser();
  if (!activeUser) return;
  const now = Date.now();
  if (now - lastLiveWatchTimestamp < 4000) return;
  lastLiveWatchTimestamp = now;
  processAndBroadcastLocation(position, activeUser, true);
}

function startAutoLocationSync() {
  const activeUser = currentUser || getAuthenticatedUser();
  if (!activeUser) return;

  const toggle = document.getElementById('radarAutoSyncToggle');
  if (toggle) toggle.checked = true;

  const label = document.getElementById('radarAutoSyncLabel');
  if (label) label.innerHTML = '🟢 Live (5s)';

  // Run immediate update
  shareMyLocation(true);

  if (autoLocationSyncTimer) {
    clearInterval(autoLocationSyncTimer);
    autoLocationSyncTimer = null;
  }

  // 5-second interval timer
  autoLocationSyncTimer = setInterval(() => {
    if (currentUser && document.visibilityState === 'visible') {
      shareMyLocation(true);
    }
  }, 5000);

  // OS-level continuous watchPosition
  if (navigator.geolocation && navigator.geolocation.watchPosition && autoLocationWatchId === null) {
    try {
      autoLocationWatchId = navigator.geolocation.watchPosition(
        handleLiveGpsPosition,
        (err) => console.warn('watchPosition warning:', err),
        { enableHighAccuracy: true, maximumAge: 4000, timeout: 6000 }
      );
    } catch (e) {
      console.warn('watchPosition setup failed:', e);
    }
  }
}

function stopAutoLocationSync() {
  if (autoLocationSyncTimer) {
    clearInterval(autoLocationSyncTimer);
    autoLocationSyncTimer = null;
  }
  if (autoLocationWatchId !== null && navigator.geolocation) {
    try { navigator.geolocation.clearWatch(autoLocationWatchId); } catch (e) {}
    autoLocationWatchId = null;
  }
  const toggle = document.getElementById('radarAutoSyncToggle');
  if (toggle) toggle.checked = false;

  const label = document.getElementById('radarAutoSyncLabel');
  if (label) label.innerHTML = '⏸️ Paused';
}

async function clearUserLocation(userToClear, notify = true) {
  if (!userToClear) return;
  if (!appState) appState = JSON.parse(JSON.stringify(DEFAULT_APP_STATE));
  if (!appState.locations) appState.locations = {};
  appState.locations[userToClear] = null;
  saveAppState(appState);
  updateCoupleLocationsUI();

  // 1. Firebase SDK
  if (firebaseDb) {
    try {
      firebaseDb.ref('our_story/locations/' + userToClear).remove();
    } catch (e) {}
  }

  // 2. Firebase REST DELETE
  const config = getStoredFirebaseConfig();
  if (config && config.databaseURL) {
    const dbUrl = config.databaseURL.trim().replace(/\/$/, '');
    fetch(`${dbUrl}/our_story/locations/${userToClear}.json`, { method: 'DELETE' }).catch(() => {});
  }

  // 3. Cloud Broadcast
  broadcastUpdate('LOCATION_CLEAR', { user: userToClear }, false);

  if (notify) {
    const name = userToClear === 'himanshu' ? 'Himanshu' : 'Gullu';
    showToast(`🗑️ ${name} ki location clear ho gayi!`);
  }
}

function handleIncomingLocation(data) {
  if (!data || !data.user) return;
  if (!appState) appState = JSON.parse(JSON.stringify(DEFAULT_APP_STATE));
  if (!appState.locations) appState.locations = {};
  appState.locations[data.user] = data;
  saveAppState(appState);
  updateCoupleLocationsUI();
}

function handleIncomingLocationClear(data) {
  if (!data || !data.user) return;
  if (!appState) appState = JSON.parse(JSON.stringify(DEFAULT_APP_STATE));
  if (!appState.locations) appState.locations = {};
  appState.locations[data.user] = null;
  saveAppState(appState);
  updateCoupleLocationsUI();
}

function setCustomPartnerLocation(cityName, lat, lng) {
  const partner = currentUser === 'himanshu' ? 'gullu' : 'himanshu';
  const locPayload = {
    lat: Number(lat),
    lng: Number(lng),
    accuracy: 10,
    address: cityName,
    time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    timestamp: Date.now(),
    user: partner,
    deviceId: 'demo_device_' + partner,
    isCustom: true
  };

  if (!appState) appState = JSON.parse(JSON.stringify(DEFAULT_APP_STATE));
  if (!appState.locations) appState.locations = {};
  appState.locations[partner] = locPayload;
  saveAppState(appState);
  updateCoupleLocationsUI();

  // Cloud broadcast
  broadcastUpdate('LOCATION_UPDATE', locPayload, true);
  showToast(`✨ ${partner === 'himanshu' ? 'Himanshu' : 'Gullu'} ki location "${cityName}" set ho gayi!`);
}

function setupCoupleRadar() {
  const updateBtn = document.getElementById('radarUpdateMyLocBtn');
  const headerPill = document.getElementById('headerDistancePill');
  const autoSyncToggle = document.getElementById('radarAutoSyncToggle');

  const apartDemoBtn = document.getElementById('radarApartDemoBtn');
  const customLocModal = document.getElementById('radarCustomLocModal');
  const closeCustomLocBtn = document.getElementById('closeRadarCustomLocBtn');
  const noticeResetPartnerBtn = document.getElementById('noticeResetPartnerBtn');
  const modalClearPartnerBtn = document.getElementById('modalClearPartnerBtn');

  const clearHimanshuLocBtn = document.getElementById('clearHimanshuLocBtn');
  const clearGulluLocBtn = document.getElementById('clearGulluLocBtn');

  const searchCustomCityBtn = document.getElementById('searchCustomCityBtn');
  const customCityInput = document.getElementById('radarCustomCityInput');

  if (updateBtn) {
    updateBtn.addEventListener('click', () => shareMyLocation(false));
  }

  if (headerPill) {
    headerPill.addEventListener('click', () => {
      const dockPulse = document.getElementById('dockBtnPulse');
      if (dockPulse) dockPulse.click();
      setTimeout(() => {
        const radar = document.getElementById('radarCard');
        if (radar) radar.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 250);
    });
  }

  if (apartDemoBtn && customLocModal) {
    apartDemoBtn.addEventListener('click', () => {
      customLocModal.classList.remove('is-hidden');
    });
  }

  if (closeCustomLocBtn && customLocModal) {
    closeCustomLocBtn.addEventListener('click', () => {
      customLocModal.classList.add('is-hidden');
    });
  }

  if (customLocModal) {
    customLocModal.addEventListener('click', (e) => {
      if (e.target === customLocModal) customLocModal.classList.add('is-hidden');
    });
  }

  // Preset location buttons
  const presetBtns = document.querySelectorAll('.radar-modal-presets .preset-btn');
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const city = btn.dataset.city;
      const lat = parseFloat(btn.dataset.lat);
      const lng = parseFloat(btn.dataset.lng);
      if (city && !isNaN(lat) && !isNaN(lng)) {
        setCustomPartnerLocation(city, lat, lng);
        if (customLocModal) customLocModal.classList.add('is-hidden');
      }
    });
  });

  // Search custom city via OpenStreetMap
  const triggerCitySearch = async () => {
    if (!customCityInput) return;
    const query = customCityInput.value.trim();
    if (!query) return;

    if (searchCustomCityBtn) {
      searchCustomCityBtn.disabled = true;
      searchCustomCityBtn.textContent = 'Searching...';
    }

    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`, {
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lng = parseFloat(data[0].lon);
          const name = data[0].display_name.split(',').slice(0, 2).join(',').trim();
          setCustomPartnerLocation(name, lat, lng);
          if (customLocModal) customLocModal.classList.add('is-hidden');
          customCityInput.value = '';
        } else {
          showToast('❌ City nahi mili. Please doosra naam try karein.');
        }
      }
    } catch (err) {
      console.warn('City search warning:', err);
      showToast('⚠️ Search failed, please try again.');
    } finally {
      if (searchCustomCityBtn) {
        searchCustomCityBtn.disabled = false;
        searchCustomCityBtn.textContent = 'Set GPS 🎯';
      }
    }
  };

  if (searchCustomCityBtn) {
    searchCustomCityBtn.addEventListener('click', triggerCitySearch);
  }
  if (customCityInput) {
    customCityInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') triggerCitySearch();
    });
  }

  // Reset / Clear partner locations
  if (noticeResetPartnerBtn) {
    noticeResetPartnerBtn.addEventListener('click', () => {
      const partner = currentUser === 'himanshu' ? 'gullu' : 'himanshu';
      clearUserLocation(partner);
    });
  }

  if (modalClearPartnerBtn) {
    modalClearPartnerBtn.addEventListener('click', () => {
      const partner = currentUser === 'himanshu' ? 'gullu' : 'himanshu';
      clearUserLocation(partner);
      if (customLocModal) customLocModal.classList.add('is-hidden');
    });
  }

  if (clearHimanshuLocBtn) {
    clearHimanshuLocBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      clearUserLocation('himanshu');
    });
  }

  if (clearGulluLocBtn) {
    clearGulluLocBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      clearUserLocation('gullu');
    });
  }

  if (autoSyncToggle) {
    autoSyncToggle.addEventListener('change', (e) => {
      if (e.target.checked) {
        startAutoLocationSync();
      } else {
        stopAutoLocationSync();
      }
    });
  }

  // Auto-start live 5s GPS sync if user is authenticated
  if (currentUser) {
    setTimeout(() => {
      startAutoLocationSync();
    }, 1000);
  }

  // Initialize map when container is visible
  setTimeout(() => {
    initCoupleRadarMap();
  }, 500);
}

function createFloatingHeart(parent) {
  const h = document.createElement('div');
  h.textContent = ['❤️', '💖', '✨', '☕', '🌸'][Math.floor(Math.random() * 5)];
  h.style.position = 'absolute';
  h.style.left = `${50 + (Math.random() * 60 - 30)}%`;
  h.style.top = '20%';
  h.style.fontSize = `${Math.random() * 16 + 18}px`;
  h.style.pointerEvents = 'none';
  h.style.animation = 'floatUp 1s ease-out forwards';
  parent.parentElement.appendChild(h);
  setTimeout(() => h.remove(), 1000);
}

function renderPulseHistory() {
  const logList = document.getElementById('pulseLogList');
  if (!logList) return;

  const pulses = normalizeArray(appState?.pulses);
  if (pulses.length === 0) {
    logList.innerHTML = `<div class="pulse-log-item" style="justify-content:center; text-align:center;"><span class="pulse-item-text" style="color:var(--text-muted); font-size:0.8rem;">Touch & hold the heart above to send your first pulse! ❤️</span></div>`;
    return;
  }

  logList.innerHTML = pulses.slice(0, 6).map(p => `
    <div class="pulse-log-item">
      <span class="pulse-item-icon">💓</span>
      <span class="pulse-item-text">${p.from || 'Partner'} sent a heartbeat!</span>
      <span class="pulse-item-time">${p.time || ''}</span>
    </div>
  `).join('');
}

// --- 7. "AAJ KA MOOD" INDICATOR LOGIC ---
const MOOD_DATA = {
  coffee: { title: "Craving Coffee ☕", defaultNote: "Chalo cafe date pe chalein!" },
  pout: { title: "Pout Queen Mode 🐷", defaultNote: "Thoda manao mujhe pehle!" },
  scold: { title: "Dantne Ka Mann 😤", defaultNote: "Galtiyan dhoond rahi hu, ready raho!" },
  romantic: { title: "Super Romantic 🥰", defaultNote: "Bas tumhari yaad aa rahi hai ❤️" },
  sleepy: { title: "Sleepy Baby Mode 😴", defaultNote: "Godi me sona hai 💤" },
  hungry: { title: "Bhook Lagi Hai 🍕", defaultNote: "Kuch yummy khilao jaldi!" }
};

let selectedMoodKey = 'coffee';

function setupMoodIndicator() {
  const buttons = document.querySelectorAll('.mood-option-btn');
  const updateBtn = document.getElementById('updateMoodBtn');
  const customInput = document.getElementById('moodCustomNote');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedMoodKey = btn.getAttribute('data-mood');
      playTone(500, 0.1);
    });
  });

  if (updateBtn) {
    updateBtn.addEventListener('click', async () => {
      const moodInfo = MOOD_DATA[selectedMoodKey] || MOOD_DATA.coffee;
      const note = customInput.value.trim() || moodInfo.defaultNote;

      playCelebrationChime();

      if (!appState) appState = JSON.parse(JSON.stringify(DEFAULT_APP_STATE));
      if (!appState.currentMoods) appState.currentMoods = { ...DEFAULT_APP_STATE.currentMoods };

      const moodPayload = {
        mood: selectedMoodKey,
        title: moodInfo.title,
        note: note,
        text: `${moodInfo.title} — "${note}"`,
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        timestamp: Date.now(),
        user: currentUser
      };

      appState.currentMoods[currentUser] = {
        mood: selectedMoodKey,
        text: moodPayload.text,
        time: moodPayload.time,
        timestamp: moodPayload.timestamp
      };
      saveAppState(appState);
      renderMoods();
      renderHeader();

      // Realtime Cloud & Cross-Tab Broadcast (Retained so partner receives it immediately!)
      broadcastUpdate('MOOD_UPDATE', moodPayload, true);

      showAppModal('🎭 Mood Updated!', `Your mood is now set to ${moodInfo.title}!`);
      customInput.value = '';

      try {
        await fetch('/api/mood', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(moodPayload)
        });
      } catch (e) {}
    });
  }
}

function renderMoods() {
  if (!appState || !appState.currentMoods) return;

  const h = appState.currentMoods.himanshu;
  const g = appState.currentMoods.gullu;

  const hTitle = document.getElementById('himanshuMoodFullTitle');
  const hNote = document.getElementById('himanshuMoodFullNote');
  const hTime = document.getElementById('himanshuMoodFullTime');

  const gTitle = document.getElementById('gulluMoodFullTitle');
  const gNote = document.getElementById('gulluMoodFullNote');
  const gTime = document.getElementById('gulluMoodFullTime');

  if (h && hTitle) {
    hTitle.textContent = (MOOD_DATA[h.mood]?.title) || h.text || 'Craving Coffee ☕';
    hNote.textContent = h.text || 'Coffee date soon!';
    hTime.textContent = `Updated at ${h.time || 'Recently'}`;
  }

  if (g && gTitle) {
    gTitle.textContent = (MOOD_DATA[g.mood]?.title) || g.text || 'Pout Queen 🐷';
    gNote.textContent = g.text || 'Cutest pout & smile 🌸';
    gTime.textContent = `Updated at ${g.time || 'Recently'}`;
  }
}

// --- 8. GLOBAL CELEBRATION MODAL ---
function showAppModal(title, desc, whatsappMsg = null) {
  const modal = document.getElementById('appModal');
  const heading = document.getElementById('modalHeading');
  const descEl = document.getElementById('modalDesc');
  const waBtn = document.getElementById('modalWaShareBtn');

  if (heading) heading.textContent = title;
  if (descEl) descEl.innerHTML = desc;

  if (waBtn) {
    if (whatsappMsg) {
      waBtn.style.display = 'inline-flex';
      // Linked directly to Himanshu's number (7737239757)
      waBtn.href = `https://api.whatsapp.com/send?phone=917737239757&text=${encodeURIComponent(whatsappMsg)}`;
    } else {
      waBtn.style.display = 'none';
    }
  }

  if (modal) modal.classList.add('open');
}

function setupModalDismiss() {
  const modal = document.getElementById('appModal');
  const btn = document.getElementById('modalDismissBtn');

  if (btn && modal) {
    btn.addEventListener('click', () => modal.classList.remove('open'));
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
  }
}

// --- 9. PWA INSTALL & LIVE APP UPDATE ENGINE ---
let waitingServiceWorker = null;

function showUpdateBanner(worker = null) {
  if (worker) waitingServiceWorker = worker;
  const banner = document.getElementById('appUpdateBanner');
  if (banner) {
    banner.classList.remove('is-hidden');
    try {
      playTone(700, 0.2);
    } catch (e) {}
  }
}

function setupPWAandUpdates() {
  // 1. Silent Background Auto-Update Engine
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then((registration) => {
      // Auto-activate waiting worker immediately
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }

      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {
              newWorker.postMessage({ type: 'SKIP_WAITING' });
            }
          });
        }
      });

      // Periodically check for updates silently in the background
      setInterval(() => {
        registration.update().catch(() => {});
      }, 30000);

      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          registration.update().catch(() => {});
          if (typeof firebaseDb !== 'undefined' && firebaseDb) {
            try { firebaseDb.goOnline(); } catch (e) {}
          }
          fetchLatestCloudSync();
        }
      });

      window.addEventListener('focus', () => {
        if (typeof firebaseDb !== 'undefined' && firebaseDb) {
          try { firebaseDb.goOnline(); } catch (e) {}
        }
        fetchLatestCloudSync();
      });
    }).catch((err) => {
      console.warn('PWA Service Worker registration skipped:', err);
    });

    // When the new worker takes control, save data silently
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (appState) saveAppState(appState);
      console.log('App auto-updated silently in the background ✨');
    });
  }

  // 2. Hide any update banner permanently (Silent Auto-Update Mode)
  const banner = document.getElementById('appUpdateBanner');
  if (banner) {
    banner.classList.add('is-hidden');
    banner.style.display = 'none';
  }

  // 4. PWA "Add to Home Screen" Install Prompt Handler
  let deferredInstallPrompt = null;
  const installBtn = document.getElementById('installPwaBtn');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    if (installBtn) {
      installBtn.classList.remove('is-hidden');
    }
  });

  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        const { outcome } = await deferredInstallPrompt.userChoice;
        if (outcome === 'accepted') {
          installBtn.classList.add('is-hidden');
        }
        deferredInstallPrompt = null;
      }
    });
  }

  window.addEventListener('appinstalled', () => {
    if (installBtn) installBtn.classList.add('is-hidden');
    showAppModal('📱 App Installed!', 'Our Story is now installed on your phone home screen! Open it anytime for quick daily check-ins 💖');
  });
}

// First-Time User Identity Setup Check (Superseded by Private Couple Login Gate)
function checkFirstTimeIdentity() {
  const modal = document.getElementById('identitySetupModal');
  if (modal) {
    modal.classList.add('is-hidden');
    modal.style.display = 'none';
  }
}

// ==========================================================================
// TAB 6: 💬 DIL KI BAATEIN • PRIVATE COUPLE CHAT ENGINE
// ==========================================================================

function escapeChatHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatChatTime(timestamp) {
  try {
    const d = new Date(timestamp);
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
  } catch (e) {
    return 'Just now';
  }
}

const processedBurstMsgIds = new Set();

function triggerLoveBurstAnimation(count = 15) {
  // Clear any existing burst hearts first to avoid stacking
  document.querySelectorAll('.floating-love-heart').forEach(el => el.remove());

  const emojis = ['💖', '💕', '💗', '💓', '✨', '🌸', '❤️', '🥰'];
  const total = Math.min(count, 15);
  for (let i = 0; i < total; i++) {
    setTimeout(() => {
      const heart = document.createElement('div');
      heart.className = 'floating-love-heart';
      heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      heart.style.left = (10 + Math.random() * 80) + 'vw';
      heart.style.animationDuration = (1.5 + Math.random() * 1.0) + 's';
      heart.style.fontSize = (1.2 + Math.random() * 1.0) + 'rem';
      document.body.appendChild(heart);
      setTimeout(() => {
        if (heart && heart.parentNode) heart.remove();
      }, 2200);
    }, i * 60);
  }
}

function setupChatUI() {
  const sendBtn = document.getElementById('chatSendBtn');
  const inputField = document.getElementById('chatTextInput');
  const heartBtn = document.getElementById('chatQuickHeartBtn');
  const burstBtn = document.getElementById('chatLoveBurstBtn');
  const chipsContainer = document.getElementById('chatQuickChips');

  if (sendBtn && inputField) {
    sendBtn.addEventListener('click', () => {
      const text = inputField.value.trim();
      if (text) {
        sendChatMessage(text, 'text');
        inputField.value = '';
        inputField.style.height = 'auto';
        inputField.focus();
      }
    });

    inputField.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const text = inputField.value.trim();
        if (text) {
          sendChatMessage(text, 'text');
          inputField.value = '';
          inputField.style.height = 'auto';
        }
      }
    });

    inputField.addEventListener('input', () => {
      inputField.style.height = 'auto';
      inputField.style.height = Math.min(inputField.scrollHeight, 80) + 'px';
    });

    inputField.addEventListener('focus', () => {
      setTimeout(() => {
        const listEl = document.getElementById('chatMessagesList');
        if (listEl) listEl.scrollTop = listEl.scrollHeight;
        inputField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 250);
    });
  }

  if (heartBtn) {
    heartBtn.addEventListener('click', () => {
      sendChatMessage('❤️', 'text');
      triggerLoveBurstAnimation(10);
    });
  }

  if (burstBtn) {
    burstBtn.addEventListener('click', () => {
      const myName = currentUser === 'himanshu' ? 'Himanshu' : 'Gullu';
      sendChatMessage(`💖 ${myName} ne ek 10x Love Burst bheja hai! 💖`, 'burst');
      triggerLoveBurstAnimation(30);
    });
  }

  if (chipsContainer) {
    chipsContainer.querySelectorAll('.quick-chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.getAttribute('data-text');
        if (text) {
          sendChatMessage(text, 'text');
          playTone(600, 0.08);
        }
      });
    });
  }

  renderChatUI();
}

function renderChatUI() {
  const partnerUser = currentUser === 'himanshu' ? 'gullu' : 'himanshu';
  const partnerName = currentUser === 'himanshu' ? 'Gullu 🌸' : 'Himanshu ☕';
  const partnerAvatar = currentUser === 'himanshu' ? '🌸' : '☕';

  const headingEl = document.getElementById('chatPartnerName');
  const avatarEl = document.getElementById('chatPartnerAvatar');
  const inputField = document.getElementById('chatTextInput');

  if (headingEl) headingEl.textContent = partnerName;
  if (avatarEl) avatarEl.textContent = partnerAvatar;
  if (inputField) {
    inputField.placeholder = `Kuch bhi message likhein (${currentUser === 'himanshu' ? 'Gullu' : 'Himanshu'} ke liye)... ✍️`;
  }

  const listEl = document.getElementById('chatMessagesList');
  if (!listEl) return;

  const msgs = normalizeArray(appState?.chatMessages || appState?.chat_messages);

  // Seed processedBurstMsgIds with all existing burst messages so history never re-triggers animations
  msgs.forEach(m => {
    if (m && m.type === 'burst' && m.id) {
      processedBurstMsgIds.add(m.id);
    }
  });

  // Remove existing message rows (preserve empty state if zero messages)
  const existingRows = listEl.querySelectorAll('.chat-msg-row');
  existingRows.forEach(r => r.remove());

  const emptyState = document.getElementById('chatEmptyState');
  if (msgs.length === 0) {
    if (emptyState) emptyState.style.display = 'flex';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  msgs.forEach(msg => {
    appendChatMessageDOM(msg, false);
  });

  listEl.scrollTop = listEl.scrollHeight;
}

function appendChatMessageDOM(msg, shouldScroll = true) {
  const listEl = document.getElementById('chatMessagesList');
  if (!listEl) return;

  const emptyState = document.getElementById('chatEmptyState');
  if (emptyState) emptyState.style.display = 'none';

  // Check if message is already rendered
  if (msg.id && listEl.querySelector(`[data-msg-id="${msg.id}"]`)) return;

  const isMe = msg.sender === currentUser;
  const partnerAvatar = currentUser === 'himanshu' ? '🌸' : '☕';

  const row = document.createElement('div');
  row.setAttribute('data-msg-id', msg.id || ('msg_' + Date.now()));

  const timeStr = msg.timestamp ? formatChatTime(msg.timestamp) : 'Just now';

  if (msg.type === 'burst') {
    row.className = 'chat-msg-row burst-row';
    row.innerHTML = `
      <div class="chat-burst-card">
        <span class="burst-icon">✨</span>
        <span class="burst-text">${escapeChatHtml(msg.text)}</span>
        <span class="burst-icon">💖</span>
      </div>
    `;
  } else {
    row.className = `chat-msg-row ${isMe ? 'me' : 'partner'}`;

    if (!isMe) {
      row.innerHTML = `
        <div class="chat-msg-avatar" title="${escapeChatHtml(msg.senderName || 'Partner')}">${partnerAvatar}</div>
        <div class="chat-msg-bubble">
          <span class="chat-msg-sender-name">${escapeChatHtml(msg.senderName || (currentUser === 'himanshu' ? 'Gullu' : 'Himanshu'))}</span>
          <p class="chat-msg-text">${escapeChatHtml(msg.text)}</p>
          <div class="chat-msg-footer">
            <span class="chat-msg-time">${timeStr}</span>
          </div>
        </div>
      `;
    } else {
      row.innerHTML = `
        <div class="chat-msg-bubble">
          <p class="chat-msg-text">${escapeChatHtml(msg.text)}</p>
          <div class="chat-msg-footer">
            <span class="chat-msg-time">${timeStr}</span>
            <span class="chat-msg-ticks">✓✓</span>
          </div>
        </div>
      `;
    }
  }

  listEl.appendChild(row);

  if (shouldScroll) {
    listEl.scrollTo({ top: listEl.scrollHeight, behavior: 'smooth' });
  }
}

function sendChatMessage(text, type = 'text') {
  if (!text || !text.trim()) return;
  if (!appState) appState = JSON.parse(JSON.stringify(DEFAULT_APP_STATE));
  if (!appState.chatMessages) appState.chatMessages = [];

  const msgId = 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
  const myName = currentUser === 'himanshu' ? 'Himanshu' : 'Gullu';

  const msg = {
    id: msgId,
    sender: currentUser,
    senderName: myName,
    text: text.trim(),
    timestamp: Date.now(),
    type: type
  };

  appState.chatMessages.push(msg);
  if (appState.chatMessages.length > 200) {
    appState.chatMessages = appState.chatMessages.slice(-200);
  }

  saveAppState(appState);
  appendChatMessageDOM(msg, true);

  // Sweet sent tone
  playTone(587.33, 0.08);
  setTimeout(() => playTone(880, 0.1), 80);

  // Real-time broadcast (MQTT, BroadcastChannel, Firebase RTDB, and Closed-App Web Push!)
  broadcastUpdate('CHAT_MESSAGE', msg);
}

function handleIncomingChatMessage(msg, isLocalBroadcast = false) {
  if (!msg || !msg.id || !msg.text) return;
  if (!appState) appState = JSON.parse(JSON.stringify(DEFAULT_APP_STATE));
  if (!appState.chatMessages) appState.chatMessages = [];

  const isAlreadyStored = appState.chatMessages.some(m => m.id === msg.id);
  const now = Date.now();
  // Message is fresh only if it arrived within the last 15 seconds
  const isFresh = msg.timestamp ? (Math.abs(now - msg.timestamp) < 15000) : false;

  if (!isAlreadyStored) {
    appState.chatMessages.push(msg);
    appState.chatMessages.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
    if (appState.chatMessages.length > 200) {
      appState.chatMessages = appState.chatMessages.slice(-200);
    }
    saveAppState(appState);
  }

  // ALWAYS append to DOM immediately (appendChatMessageDOM safely ignores if already rendered)
  appendChatMessageDOM(msg, isFresh);

  // If this message was ALREADY in our stored state, OR it is not fresh (historical sync / REST poll repeat),
  // DO NOT trigger audio, dock badge, notifications, or burst animations!
  if (isAlreadyStored || !isFresh) {
    if (msg.type === 'burst') {
      processedBurstMsgIds.add(msg.id);
    }
    return;
  }

  // Active notification for brand-new live incoming messages only
  if (msg.sender !== currentUser && !isLocalBroadcast) {
    const chatPane = document.getElementById('paneChat');
    const isChatActive = chatPane && chatPane.classList.contains('active');

    if (isChatActive) {
      playTone(523.25, 0.08);
      setTimeout(() => playTone(659.25, 0.1), 90);
      if (navigator.vibrate) {
        try { navigator.vibrate([60, 40, 60]); } catch (e) {}
      }
    } else {
      const badge = document.getElementById('dockChatBadge');
      if (badge) badge.classList.remove('is-hidden');

      playTone(523.25, 0.08);
      setTimeout(() => playTone(659.25, 0.12), 100);

      if (document.hidden) {
        sendSystemNotificationForChat(msg);
      }
    }
  }

  // Trigger Love Burst animation ONLY ONCE for a brand-new live incoming burst from partner
  if (msg.type === 'burst' && msg.sender !== currentUser && !isLocalBroadcast) {
    if (!processedBurstMsgIds.has(msg.id)) {
      processedBurstMsgIds.add(msg.id);
      triggerLoveBurstAnimation(15);
    }
  }
}

function sendSystemNotificationForChat(msg) {
  if (!msg || !('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  const notifId = 'chat_' + (msg.id || msg.timestamp);

  // 1. Deduplication guard
  if (hasAlreadyShownNotification(notifId)) return;

  // 2. Freshness guard: only notify if message is under 90s old
  if (msg.timestamp && Math.abs(Date.now() - msg.timestamp) > 90000) return;

  recordNotificationShown(notifId);

  const senderName = msg.sender === 'himanshu' ? 'Himanshu ☕' : 'Gullu 🌸';
  const title = `💬 New Message from ${senderName}`;
  const options = {
    body: `${senderName}: "${msg.text.slice(0, 80)}"`,
    icon: './icon-192.png',
    badge: './icon-192.png',
    vibrate: [250, 100, 250],
    tag: notifId,
    renotify: false,
    data: { url: getAppNavUrl('#chat') }
  };

  if ('serviceWorker' in navigator && navigator.serviceWorker.ready) {
    navigator.serviceWorker.ready.then((reg) => {
      reg.showNotification(title, options);
    }).catch(() => {
      try { new Notification(title, options); } catch (e) {}
    });
  } else {
    try { new Notification(title, options); } catch (e) {}
  }
}

// ==========================================================================
// PRIVATE COUPLE VIDEO CALL (VC) ENGINE - WebRTC P2P + Dual Cloud Signaling
// ==========================================================================

const RTC_CONFIG = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' }
  ]
};

let vcState = {
  callId: null,
  role: null, // 'caller' | 'callee'
  status: 'idle', // 'idle' | 'outgoing' | 'incoming' | 'active'
  localStream: null,
  remoteStream: null,
  peerConnection: null,
  facingMode: 'user', // 'user' (front) or 'environment' (back)
  isMicMuted: false,
  isCamMuted: false,
  timerInterval: null,
  callDurationSeconds: 0,
  outgoingRingtoneInterval: null,
  incomingRingtoneInterval: null,
  pendingOffer: null
};

function showVcToast(msg) {
  let toast = document.getElementById('vcStatusToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'vcStatusToast';
    toast.style.cssText = `
      position: fixed;
      top: 24px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(16, 7, 26, 0.94);
      border: 1px solid rgba(245, 195, 102, 0.5);
      color: #fff;
      padding: 10px 22px;
      border-radius: 30px;
      font-size: 0.88rem;
      font-weight: 700;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(16px);
      z-index: 10000;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease, transform 0.3s ease;
      white-space: nowrap;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(-10px)';
  }, 3200);
}

function startOutgoingRingtone() {
  stopOutgoingRingtone();
  const playOutgoingChime = () => {
    playTone(440, 0.8, 'sine', 0.12);
    setTimeout(() => playTone(480, 0.8, 'sine', 0.12), 40);
  };
  playOutgoingChime();
  vcState.outgoingRingtoneInterval = setInterval(playOutgoingChime, 2800);
}

function stopOutgoingRingtone() {
  if (vcState.outgoingRingtoneInterval) {
    clearInterval(vcState.outgoingRingtoneInterval);
    vcState.outgoingRingtoneInterval = null;
  }
}

function startIncomingRingtone() {
  stopIncomingRingtone();
  const playRomanticChime = () => {
    playTone(523.25, 0.35, 'sine', 0.2);
    setTimeout(() => playTone(659.25, 0.35, 'sine', 0.2), 220);
    setTimeout(() => playTone(783.99, 0.35, 'sine', 0.2), 440);
    setTimeout(() => playTone(1046.50, 0.55, 'sine', 0.25), 660);
    if (navigator.vibrate) {
      try { navigator.vibrate([250, 150, 250, 150, 400]); } catch (e) {}
    }
  };
  playRomanticChime();
  vcState.incomingRingtoneInterval = setInterval(playRomanticChime, 2500);
}

function stopIncomingRingtone() {
  if (vcState.incomingRingtoneInterval) {
    clearInterval(vcState.incomingRingtoneInterval);
    vcState.incomingRingtoneInterval = null;
  }
}

async function startVideoCall() {
  const partnerUser = currentUser === 'himanshu' ? 'gullu' : 'himanshu';
  const partnerName = partnerUser === 'himanshu' ? 'Himanshu' : 'Gullu';
  const partnerAvatar = partnerUser === 'himanshu' ? '☕' : '🌸';

  // Request Camera & Microphone
  let stream = null;
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: vcState.facingMode, width: { ideal: 640 }, height: { ideal: 480 } },
      audio: true
    });
  } catch (err) {
    console.warn('getUserMedia failed with video+audio, trying audio only:', err);
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e2) {
      showVcToast('⚠️ Camera permission blocked. Opening Backup Couple Room!');
      openJitsiFallbackRoom();
      return;
    }
  }

  vcState.localStream = stream;
  vcState.role = 'caller';
  vcState.callId = 'call_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
  vcState.status = 'outgoing';

  // Attach local stream to PiP
  const localVideo = document.getElementById('localVideo');
  if (localVideo) {
    localVideo.srcObject = stream;
    localVideo.play().catch(() => {});
  }

  // Set screens
  const modal = document.getElementById('videoCallModal');
  const outgoingScreen = document.getElementById('vcOutgoingScreen');
  const incomingScreen = document.getElementById('vcIncomingScreen');
  const activeScreen = document.getElementById('vcActiveScreen');
  const fallbackScreen = document.getElementById('vcFallbackScreen');

  const outAvatar = document.getElementById('vcOutgoingPartnerAvatar');
  const outName = document.getElementById('vcOutgoingPartnerName');
  const outStatus = document.getElementById('vcOutgoingStatusText');

  if (outAvatar) outAvatar.textContent = partnerAvatar;
  if (outName) outName.textContent = `Calling ${partnerName}...`;
  if (outStatus) outStatus.textContent = `Ringing partner's phone... 🔔`;

  const topAvatar = document.getElementById('vcTopBarAvatar');
  const topName = document.getElementById('vcTopBarName');
  const placeholderAvatar = document.getElementById('vcActivePartnerAvatar');
  if (topAvatar) topAvatar.textContent = partnerAvatar;
  if (topName) topName.textContent = partnerName;
  if (placeholderAvatar) placeholderAvatar.textContent = partnerAvatar;

  if (outgoingScreen) outgoingScreen.classList.remove('is-hidden');
  if (incomingScreen) incomingScreen.classList.add('is-hidden');
  if (activeScreen) activeScreen.classList.add('is-hidden');
  if (fallbackScreen) fallbackScreen.classList.add('is-hidden');
  if (modal) modal.classList.remove('is-hidden');

  startOutgoingRingtone();

  // Create WebRTC Peer Connection
  const pc = new RTCPeerConnection(RTC_CONFIG);
  vcState.peerConnection = pc;

  stream.getTracks().forEach(track => pc.addTrack(track, stream));

  pc.ontrack = (event) => {
    const remoteVideo = document.getElementById('remoteVideo');
    const placeholder = document.getElementById('remoteVideoPlaceholder');
    if (remoteVideo && event.streams && event.streams[0]) {
      vcState.remoteStream = event.streams[0];
      remoteVideo.srcObject = event.streams[0];
      remoteVideo.play().catch(() => {});
      if (placeholder) placeholder.style.display = 'none';
    }
  };

  pc.onicecandidate = (event) => {
    if (event.candidate && firebaseDb) {
      firebaseDb.ref('our_story/webrtc_call/callerCandidates').push(event.candidate.toJSON());
    }
  };

  try {
    const offer = await pc.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    });
    await pc.setLocalDescription(offer);

    // Clear candidates and write offer
    if (firebaseDb) {
      firebaseDb.ref('our_story/webrtc_call/callerCandidates').set(null);
      firebaseDb.ref('our_story/webrtc_call/calleeCandidates').set(null);
      firebaseDb.ref('our_story/webrtc_call/callMeta').set({
        callId: vcState.callId,
        from: currentUser,
        to: partnerUser,
        status: 'calling',
        sdpOffer: JSON.stringify(offer),
        timestamp: Date.now()
      });
    }

    // Broadcast for MQTT & push notification
    broadcastUpdate('VC_CALL', {
      callId: vcState.callId,
      from: currentUser,
      to: partnerUser,
      status: 'calling',
      sdpOffer: JSON.stringify(offer),
      timestamp: Date.now()
    }, false);

    // Listen for Callee candidates
    if (firebaseDb) {
      firebaseDb.ref('our_story/webrtc_call/calleeCandidates').on('child_added', (snapshot) => {
        const candidateData = snapshot.val();
        if (candidateData && vcState.peerConnection && vcState.peerConnection.remoteDescription) {
          try {
            vcState.peerConnection.addIceCandidate(new RTCIceCandidate(candidateData)).catch(() => {});
          } catch (e) {}
        }
      });
    }
  } catch (err) {
    console.error('Error starting video call:', err);
    showVcToast('⚠️ Failed to initialize call. Opening Backup Room.');
    openJitsiFallbackRoom();
  }
}

function showIncomingCallScreen(callData) {
  if (vcState.status === 'active' || vcState.status === 'outgoing') return;

  const callerUser = callData.from;
  const callerName = callerUser === 'himanshu' ? 'Himanshu' : 'Gullu';
  const callerAvatar = callerUser === 'himanshu' ? '☕' : '🌸';

  vcState.callId = callData.callId;
  vcState.role = 'callee';
  vcState.status = 'incoming';
  vcState.pendingOffer = callData.sdpOffer;

  const modal = document.getElementById('videoCallModal');
  const outgoingScreen = document.getElementById('vcOutgoingScreen');
  const incomingScreen = document.getElementById('vcIncomingScreen');
  const activeScreen = document.getElementById('vcActiveScreen');
  const fallbackScreen = document.getElementById('vcFallbackScreen');

  const inAvatar = document.getElementById('vcIncomingPartnerAvatar');
  const inName = document.getElementById('vcIncomingPartnerName');

  if (inAvatar) inAvatar.textContent = callerAvatar;
  if (inName) inName.textContent = `${callerName} is calling!`;

  const topAvatar = document.getElementById('vcTopBarAvatar');
  const topName = document.getElementById('vcTopBarName');
  const placeholderAvatar = document.getElementById('vcActivePartnerAvatar');
  if (topAvatar) topAvatar.textContent = callerAvatar;
  if (topName) topName.textContent = callerName;
  if (placeholderAvatar) placeholderAvatar.textContent = callerAvatar;

  if (outgoingScreen) outgoingScreen.classList.add('is-hidden');
  if (incomingScreen) incomingScreen.classList.remove('is-hidden');
  if (activeScreen) activeScreen.classList.add('is-hidden');
  if (fallbackScreen) fallbackScreen.classList.add('is-hidden');
  if (modal) modal.classList.remove('is-hidden');

  startIncomingRingtone();
  showVcToast(`📹 Incoming Call from ${callerName}! Tap Accept to connect ❤️`);
}

async function acceptIncomingCall() {
  stopIncomingRingtone();

  const callerUser = currentUser === 'himanshu' ? 'gullu' : 'himanshu';

  let stream = null;
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: vcState.facingMode, width: { ideal: 640 }, height: { ideal: 480 } },
      audio: true
    });
  } catch (err) {
    console.warn('getUserMedia failed with video+audio, trying audio only:', err);
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e2) {
      showVcToast('⚠️ Camera permission blocked. Opening Backup Couple Room!');
      openJitsiFallbackRoom();
      return;
    }
  }

  vcState.localStream = stream;
  vcState.status = 'active';

  const localVideo = document.getElementById('localVideo');
  if (localVideo) {
    localVideo.srcObject = stream;
    localVideo.play().catch(() => {});
  }

  switchToActiveCallScreen();

  const pc = new RTCPeerConnection(RTC_CONFIG);
  vcState.peerConnection = pc;

  stream.getTracks().forEach(track => pc.addTrack(track, stream));

  pc.ontrack = (event) => {
    const remoteVideo = document.getElementById('remoteVideo');
    const placeholder = document.getElementById('remoteVideoPlaceholder');
    if (remoteVideo && event.streams && event.streams[0]) {
      vcState.remoteStream = event.streams[0];
      remoteVideo.srcObject = event.streams[0];
      remoteVideo.play().catch(() => {});
      if (placeholder) placeholder.style.display = 'none';
    }
  };

  pc.onicecandidate = (event) => {
    if (event.candidate && firebaseDb) {
      firebaseDb.ref('our_story/webrtc_call/calleeCandidates').push(event.candidate.toJSON());
    }
  };

  try {
    const offerObj = JSON.parse(vcState.pendingOffer);
    await pc.setRemoteDescription(new RTCSessionDescription(offerObj));

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    if (firebaseDb) {
      firebaseDb.ref('our_story/webrtc_call/callMeta').update({
        status: 'accepted',
        sdpAnswer: JSON.stringify(answer)
      });
    }

    broadcastUpdate('VC_SIGNAL', {
      callId: vcState.callId,
      status: 'accepted',
      sdpAnswer: JSON.stringify(answer),
      from: currentUser,
      to: callerUser
    }, false);

    if (firebaseDb) {
      firebaseDb.ref('our_story/webrtc_call/callerCandidates').on('child_added', (snapshot) => {
        const candidateData = snapshot.val();
        if (candidateData && vcState.peerConnection && vcState.peerConnection.remoteDescription) {
          try {
            vcState.peerConnection.addIceCandidate(new RTCIceCandidate(candidateData)).catch(() => {});
          } catch (e) {}
        }
      });
    }
  } catch (err) {
    console.error('Error answering call:', err);
    showVcToast('⚠️ Handshake failed. Opening Backup Room.');
    openJitsiFallbackRoom();
  }
}

async function handleCallAcceptedByPartner(callData) {
  if (vcState.status !== 'outgoing') return;
  stopOutgoingRingtone();

  vcState.status = 'active';
  switchToActiveCallScreen();

  if (callData.sdpAnswer && vcState.peerConnection) {
    try {
      const answerObj = JSON.parse(callData.sdpAnswer);
      await vcState.peerConnection.setRemoteDescription(new RTCSessionDescription(answerObj));
    } catch (err) {
      console.error('Error applying remote SDP answer:', err);
    }
  }
}

function switchToActiveCallScreen() {
  const modal = document.getElementById('videoCallModal');
  const outgoingScreen = document.getElementById('vcOutgoingScreen');
  const incomingScreen = document.getElementById('vcIncomingScreen');
  const activeScreen = document.getElementById('vcActiveScreen');
  const fallbackScreen = document.getElementById('vcFallbackScreen');

  if (outgoingScreen) outgoingScreen.classList.add('is-hidden');
  if (incomingScreen) incomingScreen.classList.add('is-hidden');
  if (activeScreen) activeScreen.classList.remove('is-hidden');
  if (fallbackScreen) fallbackScreen.classList.add('is-hidden');
  if (modal) modal.classList.remove('is-hidden');

  startCallDurationTimer();
}

function startCallDurationTimer() {
  stopCallDurationTimer();
  vcState.callDurationSeconds = 0;
  const timerText = document.getElementById('vcCallTimerText');
  if (timerText) timerText.textContent = '00:00';

  vcState.timerInterval = setInterval(() => {
    vcState.callDurationSeconds++;
    const mins = Math.floor(vcState.callDurationSeconds / 60);
    const secs = vcState.callDurationSeconds % 60;
    const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    if (timerText) timerText.textContent = formatted;
  }, 1000);
}

function stopCallDurationTimer() {
  if (vcState.timerInterval) {
    clearInterval(vcState.timerInterval);
    vcState.timerInterval = null;
  }
}

function endVideoCall(reason = 'Call ended ❤️') {
  stopOutgoingRingtone();
  stopIncomingRingtone();
  stopCallDurationTimer();

  const partnerUser = currentUser === 'himanshu' ? 'gullu' : 'himanshu';

  if (vcState.callId) {
    if (firebaseDb) {
      firebaseDb.ref('our_story/webrtc_call/callMeta').update({
        status: 'ended',
        endedBy: currentUser
      });
    }
    broadcastUpdate('VC_SIGNAL', {
      callId: vcState.callId,
      status: 'ended',
      from: currentUser,
      to: partnerUser
    }, false);
  }

  cleanupCallState();
  showVcToast(reason);
}

function declineIncomingCall() {
  stopIncomingRingtone();
  const partnerUser = currentUser === 'himanshu' ? 'gullu' : 'himanshu';

  if (vcState.callId) {
    if (firebaseDb) {
      firebaseDb.ref('our_story/webrtc_call/callMeta').update({
        status: 'declined',
        declinedBy: currentUser
      });
    }
    broadcastUpdate('VC_SIGNAL', {
      callId: vcState.callId,
      status: 'declined',
      from: currentUser,
      to: partnerUser
    }, false);
  }

  cleanupCallState();
  showVcToast('Call declined.');
}

function cleanupCallState() {
  stopOutgoingRingtone();
  stopIncomingRingtone();
  stopCallDurationTimer();

  if (vcState.localStream) {
    try {
      vcState.localStream.getTracks().forEach(track => track.stop());
    } catch (e) {}
    vcState.localStream = null;
  }

  if (vcState.peerConnection) {
    try {
      vcState.peerConnection.close();
    } catch (e) {}
    vcState.peerConnection = null;
  }

  const localVideo = document.getElementById('localVideo');
  const remoteVideo = document.getElementById('remoteVideo');
  const placeholder = document.getElementById('remoteVideoPlaceholder');
  const iframeContainer = document.getElementById('vcIframeContainer');

  if (localVideo) localVideo.srcObject = null;
  if (remoteVideo) remoteVideo.srcObject = null;
  if (placeholder) placeholder.style.display = 'flex';
  if (iframeContainer) iframeContainer.innerHTML = '';

  const modal = document.getElementById('videoCallModal');
  if (modal) modal.classList.add('is-hidden');

  vcState.callId = null;
  vcState.role = null;
  vcState.status = 'idle';
  vcState.pendingOffer = null;
  vcState.isMicMuted = false;
  vcState.isCamMuted = false;

  const micBtn = document.getElementById('vcToggleMicBtn');
  const camBtn = document.getElementById('vcToggleCamBtn');
  const micIcon = document.getElementById('vcMicIcon');
  const camIcon = document.getElementById('vcCamIcon');
  if (micBtn) micBtn.classList.remove('active-off');
  if (camBtn) camBtn.classList.remove('active-off');
  if (micIcon) micIcon.textContent = '🎙️';
  if (camIcon) camIcon.textContent = '📷';
}

function toggleMicrophone() {
  if (!vcState.localStream) return;
  const audioTrack = vcState.localStream.getAudioTracks()[0];
  if (!audioTrack) return;

  vcState.isMicMuted = !vcState.isMicMuted;
  audioTrack.enabled = !vcState.isMicMuted;

  const btn = document.getElementById('vcToggleMicBtn');
  const icon = document.getElementById('vcMicIcon');
  if (btn) btn.classList.toggle('active-off', vcState.isMicMuted);
  if (icon) icon.textContent = vcState.isMicMuted ? '🔇' : '🎙️';
  showVcToast(vcState.isMicMuted ? 'Microphone muted 🔇' : 'Microphone unmuted 🎙️');
}

function toggleCameraVideo() {
  if (!vcState.localStream) return;
  const videoTrack = vcState.localStream.getVideoTracks()[0];
  if (!videoTrack) return;

  vcState.isCamMuted = !vcState.isCamMuted;
  videoTrack.enabled = !vcState.isCamMuted;

  const btn = document.getElementById('vcToggleCamBtn');
  const icon = document.getElementById('vcCamIcon');
  if (btn) btn.classList.toggle('active-off', vcState.isCamMuted);
  if (icon) icon.textContent = vcState.isCamMuted ? '🚫' : '📷';
  showVcToast(vcState.isCamMuted ? 'Camera turned off 🚫' : 'Camera turned on 📷');
}

async function flipCameraFacing() {
  if (!vcState.localStream) return;
  vcState.facingMode = vcState.facingMode === 'user' ? 'environment' : 'user';

  try {
    const newStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: vcState.facingMode, width: { ideal: 640 }, height: { ideal: 480 } }
    });

    const newVideoTrack = newStream.getVideoTracks()[0];
    const oldVideoTrack = vcState.localStream.getVideoTracks()[0];

    if (vcState.peerConnection) {
      const sender = vcState.peerConnection.getSenders().find(s => s.track && s.track.kind === 'video');
      if (sender) {
        sender.replaceTrack(newVideoTrack);
      }
    }

    if (oldVideoTrack) oldVideoTrack.stop();
    vcState.localStream.removeTrack(oldVideoTrack);
    vcState.localStream.addTrack(newVideoTrack);

    const localVideo = document.getElementById('localVideo');
    if (localVideo) {
      localVideo.srcObject = vcState.localStream;
      localVideo.style.transform = vcState.facingMode === 'user' ? 'scaleX(-1)' : 'none';
    }

    showVcToast(`Switched to ${vcState.facingMode === 'user' ? 'Front' : 'Back'} Camera 🔄`);
  } catch (err) {
    console.warn('Camera flip error:', err);
    showVcToast('⚠️ Could not switch camera facing mode');
  }
}

function sendLoveHeartTapInCall() {
  triggerFloatingHeartAnimation();
  const partnerUser = currentUser === 'himanshu' ? 'gullu' : 'himanshu';
  broadcastUpdate('VC_HEART', { from: currentUser, to: partnerUser }, false);
  playTone(880, 0.25, 'sine', 0.2);
}

function triggerFloatingHeartAnimation() {
  const overlay = document.getElementById('vcHeartsOverlay');
  if (!overlay) return;

  const heartEmojis = ['💖', '💕', '🥰', '✨', '🌸', '❤️', '💋'];
  for (let i = 0; i < 7; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'vc-floating-heart';
      el.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
      el.style.left = (15 + Math.random() * 70) + '%';
      el.style.bottom = '20px';
      el.style.position = 'absolute';
      el.style.fontSize = (1.6 + Math.random() * 1.4) + 'rem';
      el.style.pointerEvents = 'none';
      el.style.zIndex = '30';
      el.style.animation = `heartFloatUp ${1.8 + Math.random() * 0.8}s cubic-bezier(0.2, 0.8, 0.2, 1) forwards`;
      overlay.appendChild(el);

      setTimeout(() => el.remove(), 2600);
    }, i * 110);
  }
}

function openJitsiFallbackRoom() {
  const modal = document.getElementById('videoCallModal');
  const outgoingScreen = document.getElementById('vcOutgoingScreen');
  const incomingScreen = document.getElementById('vcIncomingScreen');
  const activeScreen = document.getElementById('vcActiveScreen');
  const fallbackScreen = document.getElementById('vcFallbackScreen');
  const iframeContainer = document.getElementById('vcIframeContainer');

  stopOutgoingRingtone();
  stopIncomingRingtone();

  if (outgoingScreen) outgoingScreen.classList.add('is-hidden');
  if (incomingScreen) incomingScreen.classList.add('is-hidden');
  if (activeScreen) activeScreen.classList.add('is-hidden');
  if (fallbackScreen) fallbackScreen.classList.remove('is-hidden');
  if (modal) modal.classList.remove('is-hidden');

  const myDisplayName = currentUser === 'himanshu' ? 'Himanshu' : 'Gullu';
  const roomName = 'OurStoryCoupleHimanshuGulluSecret2026';
  const jitsiUrl = `https://meet.jit.si/${roomName}#userInfo.displayName="${myDisplayName}"&config.prejoinPageEnabled=false&config.startWithAudioMuted=false&config.startWithVideoMuted=false`;

  if (iframeContainer) {
    iframeContainer.innerHTML = `<iframe src="${jitsiUrl}" allow="camera; microphone; fullscreen; display-capture; autoplay" style="width:100%;height:100%;border:none;"></iframe>`;
  }
}

function handleIncomingVCSignal(data) {
  if (!data || !data.callId) return;

  const partnerUser = currentUser === 'himanshu' ? 'gullu' : 'himanshu';

  // 1. Someone is calling me
  if (data.to === currentUser && data.status === 'calling') {
    const timeDiff = Date.now() - (data.timestamp || 0);
    if (timeDiff < 60000 && vcState.status === 'idle') {
      showIncomingCallScreen(data);
    }
  }

  // 2. Partner accepted my call
  if (data.from === partnerUser && data.to === currentUser && data.status === 'accepted') {
    handleCallAcceptedByPartner(data);
  }

  // 3. Call was ended or declined
  if (data.status === 'ended' || data.status === 'declined') {
    if (vcState.status !== 'idle' && vcState.callId === data.callId) {
      cleanupCallState();
      showVcToast(data.status === 'declined' ? 'Partner was busy 💔' : 'Call ended ❤️');
    }
  }
}

function handleIncomingVCHeart(data) {
  if (!data) return;
  if (data.to === currentUser) {
    triggerFloatingHeartAnimation();
    playTone(880, 0.25, 'sine', 0.2);
  }
}

function setupVideoCallEngine() {
  const headerBtn = document.getElementById('headerVcBtn');
  if (headerBtn) {
    headerBtn.addEventListener('click', () => {
      playTone(600, 0.1);
      startVideoCall();
    });
  }

  const chatVcBtn = document.getElementById('chatStartVcBtn');
  if (chatVcBtn) {
    chatVcBtn.addEventListener('click', () => {
      playTone(600, 0.1);
      startVideoCall();
    });
  }

  const cancelBtn = document.getElementById('vcCancelCallBtn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => endVideoCall('Call cancelled.'));
  }

  const acceptBtn = document.getElementById('vcAcceptCallBtn');
  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => acceptIncomingCall());
  }

  const declineBtn = document.getElementById('vcDeclineCallBtn');
  if (declineBtn) {
    declineBtn.addEventListener('click', () => declineIncomingCall());
  }

  const endActiveBtn = document.getElementById('vcEndActiveCallBtn');
  if (endActiveBtn) {
    endActiveBtn.addEventListener('click', () => endVideoCall('Call ended with love ❤️'));
  }

  const micBtn = document.getElementById('vcToggleMicBtn');
  if (micBtn) {
    micBtn.addEventListener('click', toggleMicrophone);
  }

  const camBtn = document.getElementById('vcToggleCamBtn');
  if (camBtn) {
    camBtn.addEventListener('click', toggleCameraVideo);
  }

  const flipBtn = document.getElementById('vcSwitchFacingBtn');
  if (flipBtn) {
    flipBtn.addEventListener('click', flipCameraFacing);
  }

  const heartBtn = document.getElementById('vcSendHeartBtn');
  if (heartBtn) {
    heartBtn.addEventListener('click', sendLoveHeartTapInCall);
  }

  const jitsiBtn = document.getElementById('vcJitsiFallbackBtn');
  if (jitsiBtn) {
    jitsiBtn.addEventListener('click', openJitsiFallbackRoom);
  }

  const closeFallbackBtn = document.getElementById('vcCloseFallbackBtn');
  if (closeFallbackBtn) {
    closeFallbackBtn.addEventListener('click', () => cleanupCallState());
  }
}

// --- INITIALIZE EVERYTHING ON LOAD ---
document.addEventListener('DOMContentLoaded', () => {
  const safeInit = (name, fn) => {
    try {
      fn();
    } catch (err) {
      console.error(`Initialization step failed: ${name}`, err);
    }
  };

  safeInit('setupCoupleLogin', setupCoupleLogin);
  safeInit('checkAuthGate', checkAuthGate);
  safeInit('setupProfileSwitcher', setupProfileSwitcher);
  safeInit('setupTabNavigation', setupTabNavigation);
  safeInit('setupMemoryVault', setupMemoryVault);
  safeInit('setupQAHandlers', setupQAHandlers);
  safeInit('setupCouponCreation', setupCouponCreation);
  safeInit('setupPulseArena', setupPulseArena);
  safeInit('setupMoodIndicator', setupMoodIndicator);
  safeInit('setupModalDismiss', setupModalDismiss);
  safeInit('setupIncomingPulseModal', setupIncomingPulseModal);
  safeInit('setupNotificationPermissions', setupNotificationPermissions);
  safeInit('setupInAppMusicPlayer', setupInAppMusicPlayer);
  safeInit('setupPWAandUpdates', setupPWAandUpdates);
  safeInit('setupChatUI', setupChatUI);
  safeInit('setupVideoCallEngine', setupVideoCallEngine);
  safeInit('fetchState', fetchState);

  // Check first-time identity selection
  safeInit('checkFirstTimeIdentity', checkFirstTimeIdentity);

  // Initialize Live Location & Distance Radar
  safeInit('setupCoupleRadar', setupCoupleRadar);

  // Initialize Real-Time Cloud (MQTT WSS) & Cross-Tab Sync
  safeInit('initCloudSync', initCloudSync);

  // Initialize Firebase Realtime Cloud Database
  safeInit('initFirebaseDatabase', initFirebaseDatabase);
  safeInit('setupFirebaseModal', setupFirebaseModal);

  // Check if an incoming heartbeat was already waiting for this user on boot
  if (currentUser) {
    setTimeout(() => {
      try {
        checkForIncomingPulseOnPortalSwitch();
      } catch (err) {
        console.error('Initial pulse check failed:', err);
      }
    }, 600);
  }
});

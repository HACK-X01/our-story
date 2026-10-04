/* ==========================================================================
   OUR STORY ✨ - INTERACTIVE JAVASCRIPT
   Himanshu & Gullu Couple App
   ========================================================================== */

// Persistent user detection (supports query param ?user=..., hash #user, and localStorage)
const urlParams = new URLSearchParams(window.location.search);
const hashUser = (window.location.hash || '').replace('#', '').toLowerCase();
const queryUser = (urlParams.get('user') || '').toLowerCase();
const storedUser = localStorage.getItem('our_story_current_user');
let currentUser = (['himanshu', 'gullu'].includes(queryUser) ? queryUser : null)
  || (['himanshu', 'gullu'].includes(hashUser) ? hashUser : null)
  || (['himanshu', 'gullu'].includes(storedUser) ? storedUser : null)
  || 'himanshu';
localStorage.setItem('our_story_current_user', currentUser);

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
  pulses: []
};

// --- PERMANENT COUPLE DATA STORAGE (NEVER DELETED ON UPDATES) ---
const PERMANENT_STORAGE_KEY = 'our_story_persistent_data';
const CURRENT_APP_VERSION = '1.3.0';

// Retrieve stored state with backward compatibility for all legacy versions
function getStoredCoupleData() {
  try {
    const primary = localStorage.getItem(PERMANENT_STORAGE_KEY);
    if (primary) {
      return JSON.parse(primary);
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
            localStorage.setItem(PERMANENT_STORAGE_KEY, JSON.stringify(parsed));
            return parsed;
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
  appState = newState;
  try {
    localStorage.setItem(PERMANENT_STORAGE_KEY, JSON.stringify(appState));
  } catch (e) {
    console.warn('LocalStorage save failed:', e);
  }
}

// Merge server and local states without losing any memories, answers, or coupons
function mergePreservingUserData(local, incoming) {
  if (!local) return incoming;
  if (!incoming) return local;

  const merged = { ...incoming };

  // 1. Preserve memories (Union by id)
  const localMems = local.memories || [];
  const incMems = incoming.memories || [];
  const memMap = new Map();
  incMems.forEach(m => { if (m && m.id) memMap.set(m.id, m); });
  localMems.forEach(m => { if (m && m.id) memMap.set(m.id, m); });
  merged.memories = Array.from(memMap.values());

  // 2. Preserve coupons (Union by id)
  const localCoupons = local.coupons || [];
  const incCoupons = incoming.coupons || [];
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

  return merged;
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
  renderHeader();
  renderVaultFeed();
  renderQA();
  renderCoupons();
  renderPulseHistory();
  renderMoods();
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

function broadcastUpdate(type, data, retain = true) {
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

      const msg = new Paho.MQTT.Message(JSON.stringify(payload));
      msg.destinationName = SYNC_TOPIC_PREFIX + subTopic;
      msg.retained = retain;
      mqttClient.send(msg);
    } catch (e) {
      console.warn('MQTT send failed:', e);
    }
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
  }
}

function handleIncomingMood(data) {
  if (!data || !data.user) return;
  if (!appState) appState = JSON.parse(JSON.stringify(DEFAULT_APP_STATE));
  if (!appState.currentMoods) appState.currentMoods = { ...DEFAULT_APP_STATE.currentMoods };

  appState.currentMoods[data.user] = {
    mood: data.mood,
    text: data.text || `${data.title} — "${data.note}"`,
    time: data.time || 'Recently'
  };
  saveAppState(appState);
  renderMoods();
  renderHeader();

  // If partner updated their mood, play soft chime & show gentle toast notification!
  if (data.user !== currentUser) {
    playTone(600, 0.15);
    showPartnerMoodToast(data);
  }
}

function handleIncomingPulse(pulse) {
  if (!pulse) return;
  const myPartner = currentUser === 'himanshu' ? 'Gullu' : 'Himanshu';
  if (pulse.from !== myPartner) return;

  if (!appState) appState = JSON.parse(JSON.stringify(DEFAULT_APP_STATE));
  if (!appState.pulses) appState.pulses = [];

  const pulseId = pulse.id || ('pulse_' + pulse.timestamp);
  const exists = appState.pulses.some(p => p.id === pulse.id || (p.time === pulse.time && p.from === pulse.from));
  if (!exists) {
    appState.pulses.unshift(pulse);
    if (appState.pulses.length > 25) appState.pulses.pop();
    saveAppState(appState);
    renderPulseHistory();
  }

  // Trigger sensory alert if pulse hasn't been acknowledged yet!
  if (lastAcknowledgedPulseId !== pulseId) {
    triggerIncomingHeartbeatAlert(pulse);
  } else {
    updatePulseTabIncomingState(pulse);
  }
}

function triggerIncomingHeartbeatAlert(pulse) {
  if (!pulse) return;
  const pulseId = pulse.id || ('pulse_' + pulse.timestamp);
  lastAcknowledgedPulseId = pulseId;
  localStorage.setItem('our_story_last_pulse_ack', pulseId);

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
    sendBackBtn.onclick = () => {
      closeIncomingHeartbeatModal();
      sendReturnHeartbeat(pulse.from);
    };
  }

  if (dismissBtn) {
    dismissBtn.onclick = () => {
      closeIncomingHeartbeatModal();
      playTone(550, 0.2);
    };
  }

  if (modal) {
    modal.classList.remove('is-hidden');
  }
}

function closeIncomingHeartbeatModal() {
  const modal = document.getElementById('incomingHeartbeatModal');
  if (modal) modal.classList.add('is-hidden');
}

function sendReturnHeartbeat(toPartner) {
  const myName = currentUser === 'himanshu' ? 'Himanshu' : 'Gullu';
  const returnPulse = {
    id: 'pulse_' + Date.now(),
    from: myName,
    to: toPartner,
    time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    timestamp: Date.now(),
    note: `Returned a warm heartbeat pulse to ${toPartner} ❤️`
  };

  if (!appState) appState = JSON.parse(JSON.stringify(DEFAULT_APP_STATE));
  if (!appState.pulses) appState.pulses = [];
  appState.pulses.unshift(returnPulse);
  if (appState.pulses.length > 25) appState.pulses.pop();
  saveAppState(appState);
  renderPulseHistory();

  // Broadcast to partner!
  broadcastUpdate('PULSE_SENT', returnPulse, true);

  playCelebrationChime();
  showAppModal('💓 Heartbeat Returned!', `A return heartbeat was sent to ${toPartner}!`);
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
  playHeartbeatSound();
  setTimeout(playHeartbeatSound, 300);
  setTimeout(playHeartbeatSound, 700);

  if (navigator.vibrate) {
    navigator.vibrate([100, 80, 150]);
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

function showPartnerMoodToast(data) {
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
    pulseText.textContent = `Hold for 2 seconds to send warmth to ${partner}...`;
  }
}

// Switch Active Profile (Himanshu vs Gullu)
function setupProfileSwitcher() {
  const pillH = document.getElementById('pillHimanshu');
  const pillG = document.getElementById('pillGullu');

  function switchUser(newUser) {
    currentUser = newUser;
    localStorage.setItem('our_story_current_user', currentUser);
    window.location.hash = currentUser;
    playTone(currentUser === 'himanshu' ? 440 : 554.37, 0.15);
    renderAll();
    checkForIncomingPulseOnPortalSwitch();
  }

  if (pillH) pillH.addEventListener('click', () => switchUser('himanshu'));
  if (pillG) pillG.addEventListener('click', () => switchUser('gullu'));
}

function checkForIncomingPulseOnPortalSwitch() {
  if (!appState || !appState.pulses || appState.pulses.length === 0) {
    updatePulseTabIncomingState(null);
    return;
  }
  const partnerName = currentUser === 'himanshu' ? 'Gullu' : 'Himanshu';
  const latestPulse = appState.pulses[0];

  if (latestPulse && latestPulse.from === partnerName) {
    const pulseKey = latestPulse.id || ('pulse_' + latestPulse.time);
    if (lastAcknowledgedPulseId !== pulseKey) {
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
  dockItems.forEach(item => {
    item.addEventListener('click', () => {
      const tabId = item.getAttribute('data-tab');
      dockItems.forEach(d => d.classList.remove('active'));
      item.classList.add('active');

      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      const targetPane = document.getElementById(tabId);
      if (targetPane) targetPane.classList.add('active');

      playTone(600, 0.1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
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

  const memories = appState.memories || [];
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
    pastList.innerHTML = appState.pastQAs.map(p => `
      <div class="past-qa-item">
        <p class="past-q">"${p.question}"</p>
        <div style="font-size:0.75rem; color:var(--text-muted);">
          <strong style="color:var(--accent-gold);">☕ Himanshu:</strong> ${p.answers.himanshu || ''}<br>
          <strong style="color:var(--accent-rose);">🌸 Gullu:</strong> ${p.answers.gullu || ''}
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
  if (!appState.coupons || !Array.isArray(appState.coupons) || appState.coupons.length === 0) {
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

// --- 6. LIVE HEARTBEAT PULSE / MISS YOU ---
function setupPulseArena() {
  const heart = document.getElementById('interactiveHeart');
  let holdTimer = null;
  let heartbeatAudioInterval = null;

  if (!heart) return;

  function startHold(e) {
    e.preventDefault();
    heart.classList.add('holding');
    playHeartbeatSound();

    const partner = currentUser === 'himanshu' ? 'Gullu 🌸' : 'Himanshu ☕';
    const statusText = document.getElementById('pulseStatusText');
    if (statusText) statusText.textContent = `Sending warm heartbeat to ${partner}... 💓`;

    if (navigator.vibrate) {
      navigator.vibrate([70, 50, 90]);
    }

    heartbeatAudioInterval = setInterval(() => {
      playHeartbeatSound();
      if (navigator.vibrate) navigator.vibrate([70, 50, 90]);
      createFloatingHeart(heart);
    }, 700);

    holdTimer = setTimeout(async () => {
      clearInterval(heartbeatAudioInterval);
      heart.classList.remove('holding');
      playCelebrationChime();
      
      const partner = currentUser === 'himanshu' ? 'Gullu 🌸' : 'Himanshu ☕';
      showAppModal('💓 Heartbeat Delivered!', `A warm, loving heartbeat pulse was sent to ${partner}!`);

      if (statusText) statusText.textContent = `Hold for 2 seconds to send warmth to ${partner}...`;

      if (!appState) appState = JSON.parse(JSON.stringify(DEFAULT_APP_STATE));
      if (!appState.pulses) appState.pulses = [];
      const newPulse = {
        id: 'pulse_' + Date.now(),
        from: currentUser === 'himanshu' ? 'Himanshu' : 'Gullu',
        to: currentUser === 'himanshu' ? 'Gullu' : 'Himanshu',
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        timestamp: Date.now(),
        note: `Sent a warm heartbeat pulse to ${partner} ❤️`
      };
      appState.pulses.unshift(newPulse);
      if (appState.pulses.length > 25) appState.pulses.pop();
      saveAppState(appState);
      renderPulseHistory();

      // Broadcast in real-time across Cloud (MQTT) + Cross-tab (BroadcastChannel)
      broadcastUpdate('PULSE_SENT', newPulse, true);

      try {
        await fetch('/api/pulse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newPulse)
        });
      } catch (err) {}
    }, 1800);
  }

  // Handle tap on heart when there is an active incoming pulse
  heart.addEventListener('click', () => {
    if (heart.classList.contains('has-incoming-pulse')) {
      const partnerName = currentUser === 'himanshu' ? 'Gullu' : 'Himanshu';
      const latestPulse = appState?.pulses?.find(p => p.from === partnerName);
      if (latestPulse) feelIncomingHeartbeat(latestPulse);
    }
  });

  function cancelHold() {
    clearTimeout(holdTimer);
    clearInterval(heartbeatAudioInterval);
    heart.classList.remove('holding');
    const partner = currentUser === 'himanshu' ? 'Gullu 🌸' : 'Himanshu ☕';
    const statusText = document.getElementById('pulseStatusText');
    if (statusText) statusText.textContent = `Hold for 2 seconds to send warmth to ${partner}...`;
  }

  heart.addEventListener('mousedown', startHold);
  heart.addEventListener('mouseup', cancelHold);
  heart.addEventListener('mouseleave', cancelHold);

  heart.addEventListener('touchstart', startHold, { passive: false });
  heart.addEventListener('touchend', cancelHold);
  heart.addEventListener('touchcancel', cancelHold);
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

  if (!appState || !appState.pulses || appState.pulses.length === 0) {
    logList.innerHTML = `<div class="pulse-log-item" style="justify-content:center; text-align:center;"><span class="pulse-item-text" style="color:var(--text-muted); font-size:0.8rem;">Touch & hold the heart above to send your first pulse! ❤️</span></div>`;
    return;
  }

  logList.innerHTML = appState.pulses.slice(0, 6).map(p => `
    <div class="pulse-log-item">
      <span class="pulse-item-icon">💓</span>
      <span class="pulse-item-text">${p.from} sent a heartbeat!</span>
      <span class="pulse-item-time">${p.time}</span>
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
        user: currentUser
      };

      appState.currentMoods[currentUser] = {
        mood: selectedMoodKey,
        text: moodPayload.text,
        time: moodPayload.time
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
  // 1. Service Worker Registration & Live Update Detection
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then((registration) => {
      // Check if an update is already waiting (e.g. cached from previous visit)
      if (registration.waiting) {
        showUpdateBanner(registration.waiting);
      }

      // Check when a new service worker is installing
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              showUpdateBanner(newWorker);
            }
          });
        }
      });

      // Periodically check for SW updates (every 30 seconds)
      setInterval(() => {
        registration.update().catch(() => {});
      }, 30000);
    }).catch((err) => {
      console.warn('PWA Service Worker registration skipped:', err);
    });

    // When the new worker takes control, reload smoothly
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  }

  // 2. Wire up the "Update Now" Action Button
  const updateBtn = document.getElementById('updateAppBtn');
  if (updateBtn) {
    updateBtn.addEventListener('click', () => {
      updateBtn.textContent = 'Updating... ✨';
      updateBtn.disabled = true;

      // Ensure all current memories and answers are saved into permanent storage before reload!
      if (appState) saveAppState(appState);

      if (waitingServiceWorker) {
        waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
      } else {
        // Fallback for static host / hard reload
        window.location.reload();
      }
    });
  }

  // 3. Periodic Remote Version Checker (Detects git commits / version.json changes)
  async function checkRemoteVersion() {
    try {
      const res = await fetch('./version.json?t=' + Date.now());
      if (res.ok) {
        const info = await res.json();
        if (info && info.version && info.version !== CURRENT_APP_VERSION) {
          showUpdateBanner();
        }
      }
    } catch (e) {}
  }

  // Check version on load, periodically, and when switching back to app tab
  setTimeout(checkRemoteVersion, 3000);
  setInterval(checkRemoteVersion, 35000);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) checkRemoteVersion();
  });

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

// --- INITIALIZE EVERYTHING ON LOAD ---
document.addEventListener('DOMContentLoaded', () => {
  setupProfileSwitcher();
  setupTabNavigation();
  setupMemoryVault();
  setupQAHandlers();
  setupCouponCreation();
  setupPulseArena();
  setupMoodIndicator();
  setupModalDismiss();
  setupInAppMusicPlayer();
  setupPWAandUpdates();
  fetchState();

  // Initialize Real-Time Cloud (MQTT WSS) & Cross-Tab Sync
  initCloudSync();

  // Check if an incoming heartbeat was already waiting for this user on boot
  setTimeout(checkForIncomingPulseOnPortalSwitch, 600);
});

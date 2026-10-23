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
  if (currentUser === 'himanshu') {
    localStorage.setItem('our_story_device_role', 'himanshu');
    localStorage.setItem('our_story_is_himanshu_device', 'true');
  }
}

function isHimanshuDevice() {
  if (currentUser === 'himanshu') return true;
  const role = localStorage.getItem('our_story_device_role');
  if (role === 'himanshu') return true;
  const isH = localStorage.getItem('our_story_is_himanshu_device');
  if (isH === 'true') return true;
  const auth = localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY);
  if (auth === 'himanshu') return true;
  return false;
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
  {
    id: 'enchanted',
    title: "Enchanted (Taylor's Version)",
    artist: "Taylor Swift",
    vibe: "Sparkling & Magical ✨",
    ytId: "igIfiqqVHtA",
    audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/ff/f2/da/fff2daa7-e089-c08b-9b34-d2ba8d8ee37c/mzaf_13585740172543756019.plus.aac.p.m4a"
  },
  {
    id: 'tumsehi',
    title: "Tum Se Hi",
    artist: "Mohit Chauhan",
    vibe: "Soft Rain & Road Trips 🌧️",
    ytId: "cbTKYt8fTvg",
    audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/e7/39/b8/e739b870-54a1-8f33-57d5-3817108b8bd9/mzaf_16925921654959290990.plus.aac.p.m4a"
  },
  {
    id: 'lover',
    title: "Lover",
    artist: "Taylor Swift",
    vibe: "Candlelight & Coffee ☕",
    ytId: "-BjZmE2gtdo",
    audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/e0/db/47/e0db47b0-7f70-0631-0414-cd4777d2fb3e/mzaf_6362891154838442638.plus.aac.p.m4a"
  },
  {
    id: 'kesariya',
    title: "Kesariya",
    artist: "Arijit Singh",
    vibe: "Pure Heart Romance 🧡",
    ytId: "BddP6PYo2gs",
    audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/38/4c/5c/384c5c8f-3ff8-e457-b2f7-3158ce108649/mzaf_12389299033886433185.plus.aac.p.m4a"
  },
  {
    id: 'apnabanale',
    title: "Apna Bana Le",
    artist: "Arijit Singh & Sachin-Jigar",
    vibe: "Warm Hugs & Whispers 🫂",
    ytId: "ElZfdU54Cp8",
    audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/a6/1c/9d/a61c9d7c-70a6-4c32-537d-671a923bbcd6/mzaf_16476369450587684583.plus.aac.p.m4a"
  },
  {
    id: 'perfect',
    title: "Perfect",
    artist: "Ed Sheeran",
    vibe: "Dancing Under Stars 🌟",
    ytId: "2Vv-BfVoq4g",
    audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/c7/ba/bc/c7babc66-f598-aaa6-bcf6-307281795817/mzaf_16337361235117168274.plus.aac.p.m4a"
  },
  {
    id: 'matargashti',
    title: "Matargashti",
    artist: "Mohit Chauhan",
    vibe: "Silly Pout & Banter 🤪",
    ytId: "6vKucgAeF_Q",
    audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/b8/97/f2/b897f255-71a6-852b-cfdb-a432f28a5f3b/mzaf_3055897486425416265.plus.aac.p.m4a"
  },
  {
    id: 'cardigan',
    title: "Cardigan",
    artist: "Taylor Swift",
    vibe: "Cozy Weather & Warm Tea 🍂",
    ytId: "K-a8s8OLBSE",
    audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/00/b3/f2/00b3f2a0-3228-b65f-7189-91eb26f5adf6/mzaf_3535055549125623460.plus.aac.p.m4a"
  },
  {
    id: 'peeloon',
    title: "Pee Loon",
    artist: "Mohit Chauhan",
    vibe: "Soulful Eyes & Dimples 🌸",
    ytId: "yW8D_u2v0-w",
    audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/a7/01/44/a7014423-fbed-c623-aa04-41bc84215593/mzaf_11299150908396348912.plus.aac.p.m4a"
  },
  {
    id: 'untilifoundyou',
    title: "Until I Found You",
    artist: "Stephen Sanchez",
    vibe: "Retro Slow Dance 🕊️",
    ytId: "GxldQ9eX2wo",
    audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/53/82/c1/5382c1d4-ddba-aa2b-90df-57268895fac9/mzaf_8926201202931541051.plus.aac.p.m4a"
  },
  {
    id: 'goldenhour',
    title: "Golden Hour",
    artist: "JVKE",
    vibe: "Your Face in Sunset Glow 🌅",
    ytId: "PEM0Vs8jf1w",
    audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/30/02/8c/30028c8a-a125-5466-bcc6-27a83b1c0135/mzaf_16911571635366913039.plus.aac.p.m4a"
  },
  {
    id: 'raataan',
    title: "Raataan Lambiyan",
    artist: "Jubin Nautiyal & Asees Kaur",
    vibe: "Late Night Calls 🌙",
    ytId: "gvyUuxdRdR4",
    audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/99/0c/38/990c381b-0530-8c0d-87a9-18b050b97f0a/mzaf_10418866714500530894.plus.aac.p.m4a"
  }
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
  ],

  isAppPaused: false,
  pausedBy: null,
  pausedAt: null
};

// --- PERMANENT COUPLE DATA STORAGE (NEVER DELETED ON UPDATES) ---
const PERMANENT_STORAGE_KEY = 'our_story_persistent_data';
const CURRENT_APP_VERSION = '2.0.0';

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

function getMessageTimestamp(m) {
  if (!m) return 0;
  if (typeof m.timestamp === 'number' && !isNaN(m.timestamp) && m.timestamp > 0) return m.timestamp;
  if (typeof m.timestamp === 'string') {
    const num = Number(m.timestamp);
    if (!isNaN(num) && num > 0) return num;
    const parsed = Date.parse(m.timestamp);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  if (typeof m.time === 'number' && !isNaN(m.time) && m.time > 0) return m.time;
  if (typeof m.time === 'string') {
    const num = Number(m.time);
    if (!isNaN(num) && num > 0) return num;
    const parsed = Date.parse(m.time);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  if (typeof m.createdAt === 'number' && !isNaN(m.createdAt) && m.createdAt > 0) return m.createdAt;
  if (m.id && typeof m.id === 'string') {
    const match = m.id.match(/^msg_(\d+)/);
    if (match && match[1]) {
      const idTime = Number(match[1]);
      if (!isNaN(idTime) && idTime > 0) return idTime;
    }
  }
  return 0;
}

function sortChatMessagesAscending(messages) {
  if (!Array.isArray(messages)) return [];
  const seenIds = new Set();
  const deduped = [];
  messages.forEach(m => {
    if (!m) return;
    const t = getMessageTimestamp(m);
    const id = m.id || ('msg_' + (t || Date.now()) + '_' + Math.random().toString(36).substr(2, 4));
    m.id = id;
    if (t > 0 && (!m.timestamp || typeof m.timestamp !== 'number')) {
      m.timestamp = t;
    }
    if (!seenIds.has(id)) {
      seenIds.add(id);
      deduped.push(m);
    }
  });

  return deduped.sort((a, b) => {
    const tA = getMessageTimestamp(a);
    const tB = getMessageTimestamp(b);
    if (tA !== tB) return tA - tB;
    return String(a.id || '').localeCompare(String(b.id || ''));
  });
}

function sanitizeAppStateArrays(state) {
  if (!state || typeof state !== 'object') return state;
  state.memories = normalizeArray(state.memories);
  state.coupons = normalizeArray(state.coupons);
  state.pulses = normalizeArray(state.pulses);
  state.chatMessages = sortChatMessagesAscending(normalizeArray(state.chatMessages || state.chat_messages));
  state.pastQAs = normalizeArray(state.pastQAs);

  return state;
}

/* ==========================================================================
   OFFLINE MEDIA STORAGE & INDEXEDDB ENGINE (Zero-Freeze Async Blob Storage)
   Extracts Heavy Base64 Audio, Docs, & Images out of localStorage
   ========================================================================== */

const IDB_DATABASE_NAME = 'OurStoryMediaDB';
const IDB_DATABASE_VERSION = 1;
const IDB_STORE_NAME = 'media_blobs';
let mediaIDBInstance = null;
const mediaMemoryCache = new Map();

function openMediaDB() {
  if (mediaIDBInstance) return Promise.resolve(mediaIDBInstance);
  if (typeof indexedDB === 'undefined') return Promise.resolve(null);

  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(IDB_DATABASE_NAME, IDB_DATABASE_VERSION);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(IDB_STORE_NAME)) {
          db.createObjectStore(IDB_STORE_NAME, { keyPath: 'id' });
        }
      };
      request.onsuccess = (e) => {
        mediaIDBInstance = e.target.result;
        resolve(mediaIDBInstance);
      };
      request.onerror = (e) => {
        console.warn('IndexedDB open error:', e);
        resolve(null);
      };
    } catch (err) {
      console.warn('IndexedDB initialization failed:', err);
      resolve(null);
    }
  });
}

function saveMediaBlobToIDB(id, base64Data) {
  if (!id || !base64Data) return Promise.resolve(false);
  mediaMemoryCache.set(id, base64Data);

  return openMediaDB().then((db) => {
    if (!db) return false;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction([IDB_STORE_NAME], 'readwrite');
        const store = tx.objectStore(IDB_STORE_NAME);
        store.put({ id, data: base64Data, updatedAt: Date.now() });
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch (e) {
        resolve(false);
      }
    });
  });
}

function getMediaBlobFromIDB(id) {
  if (!id) return Promise.resolve(null);
  if (mediaMemoryCache.has(id)) {
    return Promise.resolve(mediaMemoryCache.get(id));
  }

  return openMediaDB().then((db) => {
    if (!db) return null;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction([IDB_STORE_NAME], 'readonly');
        const store = tx.objectStore(IDB_STORE_NAME);
        const req = store.get(id);
        req.onsuccess = () => {
          if (req.result && req.result.data) {
            mediaMemoryCache.set(id, req.result.data);
            resolve(req.result.data);
          } else {
            resolve(null);
          }
        };
        req.onerror = () => resolve(null);
      } catch (e) {
        resolve(null);
      }
    });
  });
}

function resolveMediaUrl(urlOrRef) {
  if (!urlOrRef) return Promise.resolve('');
  if (typeof urlOrRef !== 'string') return Promise.resolve(urlOrRef);
  if (!urlOrRef.startsWith('[IDB]:')) return Promise.resolve(urlOrRef);

  const key = urlOrRef.replace('[IDB]:', '');
  if (mediaMemoryCache.has(key)) {
    return Promise.resolve(mediaMemoryCache.get(key));
  }
  return getMediaBlobFromIDB(key).then(data => data || '');
}

// Strip heavy Base64 media before writing to localStorage, persisting into IndexedDB
function stripAndPersistMediaBlobs(state) {
  if (!state || typeof state !== 'object') return state;
  const stripped = { ...state };

  if (Array.isArray(state.chatMessages)) {
    stripped.chatMessages = state.chatMessages.map(msg => {
      if (!msg) return msg;
      let clone = null;

      if (msg.imageData && msg.imageData.startsWith('data:')) {
        const key = 'media_' + msg.id + '_img';
        saveMediaBlobToIDB(key, msg.imageData);
        if (!clone) clone = { ...msg };
        clone.imageData = '[IDB]:' + key;
      }

      if (msg.audioData && msg.audioData.startsWith('data:')) {
        const key = 'media_' + msg.id + '_audio';
        saveMediaBlobToIDB(key, msg.audioData);
        if (!clone) clone = { ...msg };
        clone.audioData = '[IDB]:' + key;
      }

      if (msg.docData && msg.docData.startsWith('data:')) {
        const key = 'media_' + msg.id + '_doc';
        saveMediaBlobToIDB(key, msg.docData);
        if (!clone) clone = { ...msg };
        clone.docData = '[IDB]:' + key;
      }

      return clone || msg;
    });
  }

  if (Array.isArray(state.memories)) {
    stripped.memories = state.memories.map(mem => {
      if (!mem) return mem;
      if (mem.photoUrl && mem.photoUrl.startsWith('data:')) {
        const key = 'media_mem_' + mem.id + '_img';
        saveMediaBlobToIDB(key, mem.photoUrl);
        return { ...mem, photoUrl: '[IDB]:' + key };
      }
      return mem;
    });
  }

  return stripped;
}

// Migrate any legacy Base64 media from existing phones into IndexedDB without losing any chats/memories
function migrateLegacyMediaToIndexedDB(state) {
  if (!state || typeof state !== 'object') return state;
  let hasLegacy = false;

  if (Array.isArray(state.chatMessages)) {
    state.chatMessages.forEach(msg => {
      if (!msg) return;
      if (msg.imageData && msg.imageData.startsWith('data:')) {
        const key = 'media_' + msg.id + '_img';
        saveMediaBlobToIDB(key, msg.imageData);
        hasLegacy = true;
      }
      if (msg.audioData && msg.audioData.startsWith('data:')) {
        const key = 'media_' + msg.id + '_audio';
        saveMediaBlobToIDB(key, msg.audioData);
        hasLegacy = true;
      }
      if (msg.docData && msg.docData.startsWith('data:')) {
        const key = 'media_' + msg.id + '_doc';
        saveMediaBlobToIDB(key, msg.docData);
        hasLegacy = true;
      }
    });
  }

  if (Array.isArray(state.memories)) {
    state.memories.forEach(mem => {
      if (mem && mem.photoUrl && mem.photoUrl.startsWith('data:')) {
        const key = 'media_mem_' + mem.id + '_img';
        saveMediaBlobToIDB(key, mem.photoUrl);
        hasLegacy = true;
      }
    });
  }

  // Pre-load the latest 35 messages media into RAM cache for 0ms access
  if (Array.isArray(state.chatMessages)) {
    state.chatMessages.slice(-35).forEach(msg => {
      if (!msg) return;
      if (msg.imageData && msg.imageData.startsWith('[IDB]:')) {
        getMediaBlobFromIDB(msg.imageData.replace('[IDB]:', ''));
      }
      if (msg.audioData && msg.audioData.startsWith('[IDB]:')) {
        getMediaBlobFromIDB(msg.audioData.replace('[IDB]:', ''));
      }
      if (msg.docData && msg.docData.startsWith('[IDB]:')) {
        getMediaBlobFromIDB(msg.docData.replace('[IDB]:', ''));
      }
    });
  }

  if (hasLegacy) {
    try {
      const stripped = stripAndPersistMediaBlobs(state);
      localStorage.setItem(PERMANENT_STORAGE_KEY, JSON.stringify(stripped));
      console.log('✅ Successfully migrated legacy Base64 media to IndexedDB');
    } catch (e) {
      console.warn('Migration save warning:', e);
    }
  }

  return state;
}

// Retrieve stored state with backward compatibility for all legacy versions
function getStoredCoupleData() {
  try {
    const primary = localStorage.getItem(PERMANENT_STORAGE_KEY);
    if (primary) {
      const rawData = sanitizeAppStateArrays(JSON.parse(primary));
      const data = migrateLegacyMediaToIndexedDB(rawData);
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
            const migrated = migrateLegacyMediaToIndexedDB(sanitized);
            const stripped = stripAndPersistMediaBlobs(migrated);
            localStorage.setItem(PERMANENT_STORAGE_KEY, JSON.stringify(stripped));
            return migrated;
          }
        } catch (e) {}
      }
    }
  } catch (err) {
    console.warn('Storage read warning:', err);
  }
  return null;
}

let saveAppStateDebounceTimer = null;
let hasPendingAppStateSave = false;

// Immediate flush of debounced state to disk (prevents any data loss on app close / backgrounding)
function flushPendingSaveAppState() {
  if (saveAppStateDebounceTimer) {
    clearTimeout(saveAppStateDebounceTimer);
    saveAppStateDebounceTimer = null;
  }
  if (!hasPendingAppStateSave || !appState) return;
  hasPendingAppStateSave = false;

  try {
    const storagePayload = stripAndPersistMediaBlobs(appState);
    localStorage.setItem(PERMANENT_STORAGE_KEY, JSON.stringify(storagePayload));
  } catch (e) {
    console.warn('LocalStorage save failed:', e);
  }
}

// Debounced saveAppState (1-second debounce prevents blocking the main thread while typing/syncing)
function saveAppState(newState, immediate = false) {
  if (!newState) return;
  sanitizeAppStateArrays(newState);
  appState = newState;
  hasPendingAppStateSave = true;

  if (immediate) {
    flushPendingSaveAppState();
    return;
  }

  if (saveAppStateDebounceTimer) {
    clearTimeout(saveAppStateDebounceTimer);
  }

  saveAppStateDebounceTimer = setTimeout(() => {
    flushPendingSaveAppState();
  }, 1000);
}

// Lifecycle listeners to flush saves immediately when switching apps or closing browser
if (typeof window !== 'undefined') {
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      flushPendingSaveAppState();
      if (typeof detachAllNonCoreFirebaseListeners === 'function') {
        detachAllNonCoreFirebaseListeners();
      }
    }
  });
  window.addEventListener('pagehide', () => {
    flushPendingSaveAppState();
    if (typeof detachAllNonCoreFirebaseListeners === 'function') {
      detachAllNonCoreFirebaseListeners();
    }
  });
  window.addEventListener('beforeunload', () => {
    flushPendingSaveAppState();
  });
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

  // 7. Preserve Chat Messages (Union by id, sorted strictly ascending by timestamp)
  const localMsgs = normalizeArray(local.chatMessages || local.chat_messages);
  const incMsgs = normalizeArray(incoming.chatMessages || incoming.chat_messages);
  const msgMap = new Map();
  incMsgs.forEach(m => { if (m && m.id) msgMap.set(m.id, m); });
  localMsgs.forEach(m => { if (m && m.id) msgMap.set(m.id, m); });
  merged.chatMessages = sortChatMessagesAscending(Array.from(msgMap.values())).slice(-250);



  // 9. Preserve Emergency App Pause State (Himanshu Master Control)
  if (incoming.pausedAt || local.pausedAt) {
    if ((incoming.pausedAt || 0) >= (local.pausedAt || 0)) {
      merged.isAppPaused = !!incoming.isAppPaused;
      merged.pausedBy = incoming.pausedBy || 'himanshu';
      merged.pausedAt = incoming.pausedAt;
    } else {
      merged.isAppPaused = !!local.isAppPaused;
      merged.pausedBy = local.pausedBy || 'himanshu';
      merged.pausedAt = local.pausedAt;
    }
  } else if (incoming.isAppPaused !== undefined) {
    merged.isAppPaused = !!incoming.isAppPaused;
    merged.pausedBy = incoming.pausedBy || 'himanshu';
    merged.pausedAt = incoming.pausedAt || Date.now();
  } else if (local.isAppPaused !== undefined) {
    merged.isAppPaused = !!local.isAppPaused;
    merged.pausedBy = local.pausedBy || 'himanshu';
    merged.pausedAt = local.pausedAt;
  }

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

function applyCloudLocations(locs) {
  if (!locs || typeof locs !== 'object') return;
  if (!appState) appState = JSON.parse(JSON.stringify(DEFAULT_APP_STATE));
  if (!appState.locations) appState.locations = {};

  const activeUser = currentUser || getAuthenticatedUser();
  let changed = false;

  ['himanshu', 'gullu'].forEach(userKey => {
    const incLoc = locs[userKey];
    if (incLoc && typeof incLoc === 'object') {
      const curLoc = appState.locations[userKey];
      // Prevent stale cloud echoes from overwriting active user's fresher local GPS coordinates
      if (userKey === activeUser && curLoc && curLoc.timestamp && incLoc.timestamp && curLoc.timestamp > incLoc.timestamp) {
        return;
      }
      appState.locations[userKey] = incLoc;
      changed = true;
    }
  });

  if (changed) {
    saveAppState(appState);
    updateCoupleLocationsUI();
  }
}

// ==========================================================================
// FIREBASE REALTIME LISTENER REGISTRY & LIFECYCLE MANAGER (STEP 4)
// ==========================================================================
const firebaseListenerRegistry = new Map();

function attachFirebaseListener(name, queryRef, eventType, callback, isCore = false) {
  if (!queryRef || !eventType || typeof callback !== 'function') return false;
  if (firebaseListenerRegistry.has(name)) {
    // Duplicate listener prevented!
    return false;
  }
  try {
    queryRef.on(eventType, callback);
    firebaseListenerRegistry.set(name, { ref: queryRef, eventType, callback, isCore });
    return true;
  } catch (err) {
    console.warn(`[Firebase Registry] Error attaching ${name}:`, err);
    return false;
  }
}

function detachFirebaseListener(name) {
  const entry = firebaseListenerRegistry.get(name);
  if (entry) {
    try {
      entry.ref.off(entry.eventType, entry.callback);
    } catch (e) {
      console.warn(`[Firebase Registry] Error detaching ${name}:`, e);
    }
    firebaseListenerRegistry.delete(name);
    return true;
  }
  return false;
}

function detachAllNonCoreFirebaseListeners() {
  for (const [name, entry] of firebaseListenerRegistry.entries()) {
    if (!entry.isCore) {
      try {
        entry.ref.off(entry.eventType, entry.callback);
      } catch (e) {}
      firebaseListenerRegistry.delete(name);
    }
  }
}

function detachAllFirebaseListeners() {
  for (const [name, entry] of firebaseListenerRegistry.entries()) {
    try {
      entry.ref.off(entry.eventType, entry.callback);
    } catch (e) {}
  }
  firebaseListenerRegistry.clear();
}

// --- Lazy / Tab-Scoped Listener Attachers ---
function attachPulsesListener() {
  if (!firebaseDb) return;
  attachFirebaseListener('pulses', firebaseDb.ref('our_story/pulses').limitToLast(5), 'child_added', (snapshot) => {
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
  }, false);
}

function attachLocationsListener() {
  if (!firebaseDb) return;
  attachFirebaseListener('locations', firebaseDb.ref('our_story/locations'), 'value', (snapshot) => {
    applyCloudLocations(snapshot.val());
  }, false);
}

function attachCurrentQAListener() {
  if (!firebaseDb) return;
  attachFirebaseListener('currentQA', firebaseDb.ref('our_story/currentQA'), 'value', (snapshot) => {
    const qa = snapshot.val();
    if (qa) {
      const prev = JSON.stringify(appState?.currentQA || {});
      if (JSON.stringify(qa) !== prev) {
        if (!appState) appState = JSON.parse(JSON.stringify(DEFAULT_APP_STATE));
        appState.currentQA = qa;
        saveAppState(appState);
        renderQA();
      }
    }
  }, false);
}

function attachCouponsListener() {
  if (!firebaseDb) return;
  attachFirebaseListener('coupons', firebaseDb.ref('our_story/coupons'), 'value', (snapshot) => {
    const coupons = snapshot.val();
    if (coupons && Array.isArray(coupons)) {
      const prev = JSON.stringify(appState?.coupons || []);
      if (JSON.stringify(coupons) !== prev) {
        if (!appState) appState = JSON.parse(JSON.stringify(DEFAULT_APP_STATE));
        appState.coupons = coupons;
        saveAppState(appState);
        renderCoupons();
      }
    }
  }, false);
}

function attachMemoriesListener() {
  if (!firebaseDb) return;
  attachFirebaseListener('memories', firebaseDb.ref('our_story/memories'), 'value', (snapshot) => {
    const mems = snapshot.val();
    if (mems) {
      const arr = Array.isArray(mems) ? mems : Object.values(mems);
      if (arr.length > 0) {
        const prev = JSON.stringify(appState?.memories || []);
        if (JSON.stringify(arr) !== prev) {
          if (!appState) appState = JSON.parse(JSON.stringify(DEFAULT_APP_STATE));
          appState.memories = arr;
          saveAppState(appState);
          renderVaultFeed();
        }
      }
    }
  }, false);
}

function attachTabScopedFirebaseListeners(tabId) {
  if (!tabId || !firebaseDb) return;
  if (tabId === 'panePulse') {
    attachLocationsListener();
    attachPulsesListener();
  } else if (tabId === 'paneVault') {
    attachMemoriesListener();
  } else if (tabId === 'paneCoupons') {
    attachCouponsListener();
  } else if (tabId === 'paneQA') {
    attachCurrentQAListener();
  }
}

function setupFirebaseRealtimeListeners() {
  if (!firebaseDb) return;

  // 1. Current Moods (Always-On Core: Header badge & fresh alert)
  attachFirebaseListener('currentMoods', firebaseDb.ref('our_story/currentMoods'), 'value', (snapshot) => {
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
  }, true);

  // 2. Dedicated Realtime Listener on our_story/latestPulse (Always-On Core: Fires within 50ms for live heartbeats)
  attachFirebaseListener('latestPulse', firebaseDb.ref('our_story/latestPulse'), 'value', (snapshot) => {
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
  }, true);

  // 3. Chat Messages - child_added (Always-On Core: incoming messages, photos, voice, docs)
  attachFirebaseListener('chat_messages_added', firebaseDb.ref('our_story/chat_messages').limitToLast(50), 'child_added', (snapshot) => {
    const msg = snapshot.val();
    if (msg && msg.id) {
      handleIncomingChatMessage(msg, false);
    }
  }, true);

  // 4. Chat Messages - child_changed (Always-On Core: ticks, edits, reactions, soft delete)
  attachFirebaseListener('chat_messages_changed', firebaseDb.ref('our_story/chat_messages').limitToLast(50), 'child_changed', (snapshot) => {
    const msg = snapshot.val();
    if (msg && msg.id) {
      handleIncomingChatMessage(msg, false);
    }
  }, true);

  // 5. Chat Messages - child_removed (Always-On Core: hard removal sync)
  attachFirebaseListener('chat_messages_removed', firebaseDb.ref('our_story/chat_messages').limitToLast(50), 'child_removed', (snapshot) => {
    const msg = snapshot.val();
    const msgId = (msg && msg.id) || snapshot.key;
    if (!msgId || !appState || !appState.chatMessages) return;
    const idx = appState.chatMessages.findIndex(m => m && m.id === msgId);
    if (idx !== -1) {
      appState.chatMessages.splice(idx, 1);
      saveAppState(appState);
      renderChatUI(true);
    }
  }, true);

  // 6. Chat Typing Indicator Realtime Listener (Always-On Core)
  const partnerKey = currentUser === 'himanshu' ? 'gullu' : 'himanshu';
  const typingEntry = firebaseListenerRegistry.get('chat_typing');
  if (typingEntry && typingEntry.ref.key !== partnerKey) {
    detachFirebaseListener('chat_typing');
  }
  attachFirebaseListener('chat_typing', firebaseDb.ref('our_story/chat_typing/' + partnerKey), 'value', (snapshot) => {
    const typingData = snapshot.val();
    if (typeof setPartnerTypingUI === 'function') {
      setPartnerTypingUI(typingData);
    }
  }, true);

  // 7. Realtime WebRTC Private Video & Audio Call Signaling (Always-On Core)
  attachFirebaseListener('callMeta', firebaseDb.ref('our_story/webrtc_call/callMeta'), 'value', (snapshot) => {
    const callMeta = snapshot.val();
    if (callMeta) {
      handleIncomingVCSignal(callMeta);
    }
  }, true);

  // 8. Emergency App Pause Realtime Sync (Always-On Core)
  attachFirebaseListener('appPause', firebaseDb.ref('our_story/appPause'), 'value', (snapshot) => {
    const pauseData = snapshot.val();
    if (pauseData && typeof pauseData === 'object') {
      handleIncomingAppPause(pauseData);
    }
  }, true);

  // Attach tab-scoped listeners for initially active tab
  const activePane = document.querySelector('.tab-pane.active');
  const activeTabId = activePane ? activePane.id : 'panePulse';
  attachTabScopedFirebaseListeners(activeTabId);
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

  // 2. Fetch Latest Chat Messages (Silent In-Place Reconciliation without freezing UI or full re-render)
  fetch(`${dbUrl}/our_story/chat_messages.json?t=` + Date.now())
    .then(r => r.ok ? r.json() : null)
    .then(msgs => {
      if (!msgs || typeof msgs !== 'object') return;
      const incomingList = Object.values(msgs);
      reconcileChatMessagesDOM(incomingList);
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
        const prevMemories = JSON.stringify(appState?.memories || []);
        const prevCoupons = JSON.stringify(appState?.coupons || []);
        const prevQA = JSON.stringify(appState?.currentQA || {});
        const prevMoods = JSON.stringify(appState?.currentMoods || {});
        const prevPulses = JSON.stringify(appState?.pulses || []);

        appState = mergePreservingUserData(appState, cloudData);
        saveAppState(appState);

        // Silently reconcile chat without full DOM wipe
        if (cloudData.chat_messages) {
          reconcileChatMessagesDOM(Object.values(cloudData.chat_messages));
        }

        // Only re-render tabs where actual data changes occurred
        if (JSON.stringify(appState.memories || []) !== prevMemories) {
          renderVaultFeed();
        }
        if (JSON.stringify(appState.coupons || []) !== prevCoupons) {
          renderCoupons();
        }
        if (JSON.stringify(appState.currentQA || {}) !== prevQA) {
          renderQA();
        }
        if (JSON.stringify(appState.currentMoods || {}) !== prevMoods) {
          renderMoods();
        }
        if (JSON.stringify(appState.pulses || []) !== prevPulses) {
          renderPulseHistory();
        }
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

  // Background Chat messages poller (Only active as fallback when Firebase WebSocket SDK is not connected)
  setInterval(() => {
    if (isFirebaseConnected && firebaseDb) return; // SDK WebSocket already provides sub-50ms live updates
    fetch(`${dbUrl}/our_story/chat_messages.json?t=` + Date.now())
      .then(r => r.ok ? r.json() : null)
      .then(msgs => {
        if (!msgs || typeof msgs !== 'object') return;
        const incomingList = Object.values(msgs);
        reconcileChatMessagesDOM(incomingList);
      })
      .catch(() => {});
  }, 6000);

  // Background Location Poller (Every 3.5s for Radar & Distance)
  setInterval(() => {
    fetch(`${dbUrl}/our_story/locations.json?t=` + Date.now())
      .then(r => r.ok ? r.json() : null)
      .then(locs => {
        applyCloudLocations(locs);
      })
      .catch(() => {});
  }, 3500);
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
      } else if (type === 'CHAT_RECEIPT_DELIVERED' || type === 'CHAT_RECEIPT_READ') {
        const newStatus = type === 'CHAT_RECEIPT_READ' ? 'read' : 'delivered';
        const timestampKey = newStatus + 'At';
        const msgIds = data.msgIds || (data.msgId ? [data.msgId] : []);
        msgIds.forEach(id => {
          firebaseDb.ref('our_story/chat_messages/' + id).update({
            status: newStatus,
            [timestampKey]: data[timestampKey] || Date.now()
          });
        });
      } else if (type === 'CHAT_TYPING') {
        firebaseDb.ref('our_story/chat_typing/' + currentUser).set(data);
      } else if (type === 'CHAT_EDIT') {
        firebaseDb.ref('our_story/chat_messages/' + data.msgId).update({
          text: data.newText,
          edited: true,
          editedAt: data.editedAt || Date.now()
        });
      } else if (type === 'CHAT_DELETE') {
        firebaseDb.ref('our_story/chat_messages/' + data.msgId).update({
          deleted: true,
          text: 'This message was deleted',
          deletedAt: data.deletedAt || Date.now()
        });
      } else if (type === 'CHAT_STAR') {
        firebaseDb.ref('our_story/chat_messages/' + data.msgId).update({
          starred: !!data.starred
        });
      } else if (type === 'CHAT_REACTION') {
        firebaseDb.ref('our_story/chat_messages/' + data.msgId).update({
          reaction: data.reaction || null
        });
      } else if (type === 'CHAT_DISAPPEARING_CONFIG') {
        firebaseDb.ref('our_story/disappearingTimer').set(data.timer || 0);
      } else if (type === 'VC_SIGNAL' || type === 'VC_CALL') {
        firebaseDb.ref('our_story/webrtc_call/callMeta').set(data);

      } else if (type === 'APP_PAUSE_STATUS') {
        firebaseDb.ref('our_story/appPause').set(data);
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
    } else if (type === 'CHAT_RECEIPT_DELIVERED' || type === 'CHAT_RECEIPT_READ') {
      const newStatus = type === 'CHAT_RECEIPT_READ' ? 'read' : 'delivered';
      const timestampKey = newStatus + 'At';
      const msgIds = data.msgIds || (data.msgId ? [data.msgId] : []);
      msgIds.forEach(id => {
        fetch(`${dbUrl}/our_story/chat_messages/${id}.json`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus, [timestampKey]: data[timestampKey] || Date.now() })
        }).catch(() => {});
      });
      return;
    } else if (type === 'CHAT_TYPING') {
      endpoint += `/chat_typing/${currentUser}.json`;
      method = 'PUT';
      body = data;
    } else if (type === 'CHAT_EDIT') {
      endpoint += `/chat_messages/${data.msgId}.json`;
      method = 'PATCH';
      body = { text: data.newText, edited: true, editedAt: data.editedAt || Date.now() };
    } else if (type === 'CHAT_DELETE') {
      endpoint += `/chat_messages/${data.msgId}.json`;
      method = 'PATCH';
      body = { deleted: true, text: 'This message was deleted', deletedAt: data.deletedAt || Date.now() };
    } else if (type === 'CHAT_STAR') {
      endpoint += `/chat_messages/${data.msgId}.json`;
      method = 'PATCH';
      body = { starred: !!data.starred };
    } else if (type === 'CHAT_REACTION') {
      endpoint += `/chat_messages/${data.msgId}.json`;
      method = 'PATCH';
      body = { reaction: data.reaction || null };
    } else if (type === 'CHAT_DISAPPEARING_CONFIG') {
      endpoint += `/disappearingTimer.json`;
      method = 'PUT';
      body = data.timer || 0;
    } else if (type === 'VC_SIGNAL' || type === 'VC_CALL') {
      endpoint += `/webrtc_call/callMeta.json`;
      method = 'PUT';
      body = data;

    } else if (type === 'APP_PAUSE_STATUS') {
      endpoint += `/appPause.json`;
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
      else if (type.startsWith('CHAT_')) subTopic = 'chat';
      else if (type === 'APP_PAUSE_STATUS') subTopic = 'pause';

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
      let previewText = data.text ? data.text.slice(0, 80) : '';
      let tags = ['speech_balloon', 'love_letter'];
      if (data.type === 'image') {
        previewText = '📷 Shared a romantic photo with you!';
        tags = ['camera', 'sparkles'];
      } else if (data.type === 'audio') {
        previewText = '🎙️ Sent you a sweet voice note (' + (data.duration || '0:05') + ')';
        tags = ['studio_microphone', 'musical_note'];
      } else if (data.type === 'call') {
        previewText = data.text || 'Call log';
        tags = ['phone', 'heart'];
      } else if (data.type === 'burst') {
        previewText = '💖 Sent a 10x Love Burst!';
        tags = ['sparkles', 'heart'];
      }

      sendClosedAppPushNotification(partnerUser, {
        title: `💬 New Message from ${myName}!`,
        message: `${myName}: "${previewText}"`,
        click: getAppNavUrl('#chat'),
        tags: tags,
        priority: 5
      });
    } else if (type === 'VC_CALL') {
      const isAudio = data.callType === 'audio';
      sendClosedAppPushNotification(partnerUser, {
        title: `${isAudio ? '📞 Voice' : '📹 Video'} Call from ${myName}!`,
        message: `${myName} is calling you... Tap to answer and connect! ❤️`,
        click: getAppNavUrl('#chat'),
        tags: isAudio ? ['telephone_receiver', 'phone'] : ['video_camera', 'phone'],
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
  } else if (payload.type === 'CHAT_RECEIPT_DELIVERED') {
    handleIncomingChatReceipt(payload.data, 'delivered');
  } else if (payload.type === 'CHAT_RECEIPT_READ') {
    handleIncomingChatReceipt(payload.data, 'read');
  } else if (payload.type === 'CHAT_TYPING') {
    if (typeof setPartnerTypingUI === 'function') {
      setPartnerTypingUI(payload.data);
    }
  } else if (payload.type === 'CHAT_EDIT') {
    if (typeof handleIncomingChatEdit === 'function') {
      handleIncomingChatEdit(payload.data);
    }
  } else if (payload.type === 'CHAT_DELETE') {
    if (typeof handleIncomingChatDelete === 'function') {
      handleIncomingChatDelete(payload.data);
    }
  } else if (payload.type === 'CHAT_STAR') {
    if (typeof handleIncomingChatStar === 'function') {
      handleIncomingChatStar(payload.data);
    }
  } else if (payload.type === 'CHAT_REACTION') {
    if (typeof handleIncomingChatReaction === 'function') {
      handleIncomingChatReaction(payload.data);
    }
  } else if (payload.type === 'CHAT_DISAPPEARING_CONFIG') {
    if (typeof handleIncomingDisappearingConfig === 'function') {
      handleIncomingDisappearingConfig(payload.data);
    }
  } else if (payload.type === 'VC_SIGNAL' || payload.type === 'VC_CALL') {
    handleIncomingVCSignal(payload.data);
  } else if (payload.type === 'VC_CANDIDATE') {
    handleIncomingVCCandidate(payload.data);
  } else if (payload.type === 'VC_HEART') {
    handleIncomingVCHeart(payload.data);

  } else if (payload.type === 'APP_PAUSE_STATUS') {
    handleIncomingAppPause(payload.data);
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
  enforceAppPauseUI();
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
  enforceAppPauseUI();
}

// ==========================================================================
// EXCLUSIVE HIMANSHU MASTER APP PAUSE & RESUME ENGINE ⏸️
// Gives Himanshu master power to freeze the app for Gullu and reactivate anytime
// ==========================================================================

const APP_PAUSE_STORAGE_KEY = 'our_story_app_pause_state';

function isAppCurrentlyPaused() {
  if (appState && typeof appState.isAppPaused === 'boolean') {
    return appState.isAppPaused;
  }
  try {
    const raw = localStorage.getItem(APP_PAUSE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return !!parsed.isPaused;
    }
  } catch (e) {}
  return false;
}

function setAppPauseState(shouldPause, actor = 'himanshu') {
  if (!appState) appState = JSON.parse(JSON.stringify(DEFAULT_APP_STATE));
  appState.isAppPaused = !!shouldPause;
  appState.pausedBy = actor;
  appState.pausedAt = Date.now();

  const pausePayload = {
    isPaused: !!shouldPause,
    pausedBy: actor,
    pausedAt: Date.now()
  };

  try {
    localStorage.setItem(APP_PAUSE_STORAGE_KEY, JSON.stringify(pausePayload));
  } catch (e) {}

  saveAppState(appState);

  // Broadcast in real-time to MQTT, Cross-Tab, and Firebase
  broadcastUpdate('APP_PAUSE_STATUS', pausePayload, true);

  if (firebaseDb) {
    try {
      firebaseDb.ref('our_story/appPause').set(pausePayload);
    } catch (e) {}
  }

  // Update UI immediately
  enforceAppPauseUI();

  if (shouldPause) {
    playTone(280, 0.35, 'sawtooth', 0.15);
    showToast('⏸️ App Paused! Gullu ke device par ab Error 104 show hoga.');
  } else {
    playCelebrationChime();
    showToast('✨ App Active! Gullu ke liye portal successfully unpause ho gaya hai.');
  }
}

function handleIncomingAppPause(data) {
  if (!data || typeof data !== 'object') return;
  const isPaused = !!data.isPaused;
  const pausedAt = data.pausedAt || Date.now();

  if (!appState) appState = JSON.parse(JSON.stringify(DEFAULT_APP_STATE));
  appState.isAppPaused = isPaused;
  appState.pausedBy = data.pausedBy || 'himanshu';
  appState.pausedAt = pausedAt;

  try {
    localStorage.setItem(APP_PAUSE_STORAGE_KEY, JSON.stringify({
      isPaused,
      pausedBy: data.pausedBy || 'himanshu',
      pausedAt
    }));
  } catch (e) {}

  saveAppState(appState);
  enforceAppPauseUI();

  if (isPaused) {
    if (currentUser === 'gullu' || !isHimanshuDevice()) {
      endActiveCallSilently();
      stopInAppMusic();
    }
  } else {
    // Unpaused: Gullu's Error 104 overlay quietly unlocks with no romantic hints
  }
}

function endActiveCallSilently() {
  try {
    if (typeof endActiveVideoCall === 'function') {
      endActiveVideoCall();
    }
  } catch (e) {}
}

function enforceAppPauseUI() {
  const paused = isAppCurrentlyPaused();
  const isHimanshu = currentUser === 'himanshu';
  const himanshuDev = isHimanshuDevice();

  // Populate dynamic current URL & host on Error 104 screen
  const urlEl = document.getElementById('error104PageUrl');
  if (urlEl) urlEl.textContent = window.location.href;
  const hostEl = document.getElementById('error104HostText');
  if (hostEl) hostEl.textContent = window.location.hostname || 'github.io';
  const tsEl = document.getElementById('error104Timestamp');
  if (tsEl) tsEl.textContent = new Date().toISOString();

  // 1. Exclusive Himanshu Toggle Button in Profile Bar (Header)
  const himanshuBtn = document.getElementById('himanshuPauseToggleBtn');
  const himanshuIcon = document.getElementById('himanshuPauseIcon');
  const himanshuLabel = document.getElementById('himanshuPauseLabel');

  if (himanshuBtn) {
    if (isHimanshu) {
      himanshuBtn.classList.remove('is-hidden');
      himanshuBtn.style.display = 'inline-flex';
      if (paused) {
        himanshuBtn.classList.add('is-paused');
        if (himanshuIcon) himanshuIcon.textContent = '▶️';
        if (himanshuLabel) himanshuLabel.textContent = 'Active App';
        himanshuBtn.title = 'App paused for Gullu (Error 104 active). Tap to activate app.';
      } else {
        himanshuBtn.classList.remove('is-paused');
        if (himanshuIcon) himanshuIcon.textContent = '⏸️';
        if (himanshuLabel) himanshuLabel.textContent = 'Pause App';
        himanshuBtn.title = 'Pause App (Shows Error 104 to Gullu) ⏸️';
      }
    } else {
      // STRICTLY HIDDEN FOR GULLU
      himanshuBtn.classList.add('is-hidden');
      himanshuBtn.style.display = 'none';
    }
  }

  // 2. Himanshu Master Pause Banner (Shown only inside Himanshu portal when paused)
  const himanshuBanner = document.getElementById('himanshuPauseBanner');
  if (himanshuBanner) {
    if (isHimanshu && paused) {
      himanshuBanner.classList.remove('is-hidden');
    } else {
      himanshuBanner.classList.add('is-hidden');
    }
  }

  // 3. Login Screen Alert (Visible ONLY to Himanshu on his recognized device)
  const loginAlert = document.getElementById('loginPausedAlert');
  if (loginAlert) {
    if (paused && himanshuDev) {
      loginAlert.classList.remove('is-hidden');
    } else {
      loginAlert.classList.add('is-hidden');
    }
  }

  // 4. Full-Screen Error 104 Overlay & Stealth Tab Title
  const gulluScreen = document.getElementById('gulluAppPausedScreen');
  const recoveryBar = document.getElementById('himanshuDeviceRecoveryBar');

  if (gulluScreen) {
    if (paused) {
      if (isHimanshu) {
        // Himanshu is logged in: he should NEVER see Error 104!
        gulluScreen.classList.add('is-hidden');
        document.title = "Our Story ✨ Himanshu & Gullu";
      } else if (himanshuDev && !currentUser) {
        // Himanshu's recognized device, but currently logged out:
        // Show Error 104 WITH persistent Himanshu 1-tap activation bar!
        gulluScreen.classList.remove('is-hidden');
        if (recoveryBar) recoveryBar.classList.remove('is-hidden');
        endActiveCallSilently();
        document.title = "This site can’t be reached";
      } else {
        // Gullu or unrecognized visitor: PURE ERROR 104 SCREEN (zero messages/hints)!
        gulluScreen.classList.remove('is-hidden');
        if (recoveryBar) recoveryBar.classList.add('is-hidden');
        endActiveCallSilently();
        stopInAppMusic();
        document.title = "This site can’t be reached";
      }
    } else {
      // Normal Active state
      gulluScreen.classList.add('is-hidden');
      if (recoveryBar) recoveryBar.classList.add('is-hidden');
      document.title = "Our Story ✨ Himanshu & Gullu";
    }
  }
}

function setupHimanshuPauseControl() {
  const himanshuBtn = document.getElementById('himanshuPauseToggleBtn');
  if (himanshuBtn) {
    himanshuBtn.addEventListener('click', () => {
      const isPaused = isAppCurrentlyPaused();
      if (!isPaused) {
        const ok = confirm("⏸️ KYA AAP APP KO TEMPORARILY PAUSE KARNA CHAHTE HAIN?\n\nIske baad Gullu ke device par Error 104 (Site can't be reached) show hoga aur koi message nahi dikhega. Aapke device par resume/active karne ka option hamesha rahega.");
        if (ok) {
          setAppPauseState(true, 'himanshu');
        }
      } else {
        setAppPauseState(false, 'himanshu');
      }
    });
  }

  const resumeBannerBtn = document.getElementById('himanshuResumeBannerBtn');
  if (resumeBannerBtn) {
    resumeBannerBtn.addEventListener('click', () => {
      setAppPauseState(false, 'himanshu');
    });
  }

  // Himanshu Device Direct Activation Button (on Error 104 screen)
  const deviceActiveBtn = document.getElementById('himanshuDeviceActiveBtn');
  if (deviceActiveBtn) {
    deviceActiveBtn.addEventListener('click', () => {
      setAppPauseState(false, 'himanshu');
      localStorage.setItem('our_story_device_role', 'himanshu');
      localStorage.setItem('our_story_is_himanshu_device', 'true');
      localStorage.setItem(AUTH_STORAGE_KEY, 'himanshu');
      sessionStorage.setItem(AUTH_STORAGE_KEY, 'himanshu');
      currentUser = 'himanshu';
      window.location.hash = 'himanshu';
      checkAuthGate();
    });
  }

  // Error 104 Reload Button (Simulates realistic browser reconnect attempt)
  const reloadBtn = document.getElementById('error104ReloadBtn');
  const reloadText = document.getElementById('error104ReloadBtnText');
  const reloadSpinner = document.getElementById('error104Spinner');
  if (reloadBtn) {
    reloadBtn.addEventListener('click', () => {
      if (reloadBtn.disabled) return;
      reloadBtn.disabled = true;
      if (reloadSpinner) reloadSpinner.classList.remove('is-hidden');
      if (reloadText) reloadText.textContent = 'Connecting...';

      setTimeout(() => {
        const stillPaused = isAppCurrentlyPaused();
        if (stillPaused) {
          if (reloadSpinner) reloadSpinner.classList.add('is-hidden');
          if (reloadText) reloadText.textContent = 'Reload';
          reloadBtn.disabled = false;
          const codeRow = document.querySelector('.error-104-code-row');
          if (codeRow) {
            codeRow.classList.add('error-shake');
            setTimeout(() => codeRow.classList.remove('error-shake'), 500);
          }
        } else {
          window.location.reload();
        }
      }, 1400);
    });
  }

  // Error 104 Details Toggle Button
  const detailsBtn = document.getElementById('error104DetailsBtn');
  const detailsBox = document.getElementById('error104DetailsBox');
  if (detailsBtn && detailsBox) {
    detailsBtn.addEventListener('click', () => {
      detailsBox.classList.toggle('is-hidden');
    });
  }

  // Secret Admin PIN Backdoor (Triple Tap on Error 104 code trigger)
  const codeTrigger = document.getElementById('error104CodeTrigger');
  let tapCount = 0;
  let tapTimer = null;
  if (codeTrigger) {
    codeTrigger.addEventListener('click', () => {
      tapCount++;
      clearTimeout(tapTimer);
      tapTimer = setTimeout(() => { tapCount = 0; }, 1000);
      if (tapCount >= 3) {
        tapCount = 0;
        const promptBox = document.getElementById('himanshuSecretPrompt');
        if (promptBox) {
          promptBox.classList.toggle('is-hidden');
          const passInput = document.getElementById('himanshuSecretPassInput');
          if (passInput) passInput.focus();
        }
      }
    });
  }

  // Secret Admin Unlock Buttons
  const secretUnlockBtn = document.getElementById('himanshuSecretUnlockBtn');
  const secretCancelBtn = document.getElementById('himanshuSecretCancelBtn');
  const secretPassInput = document.getElementById('himanshuSecretPassInput');
  const secretPrompt = document.getElementById('himanshuSecretPrompt');

  if (secretUnlockBtn && secretPassInput) {
    secretUnlockBtn.addEventListener('click', () => {
      const val = secretPassInput.value.trim();
      if (val === AUTH_CREDENTIALS.himanshu.pass) {
        localStorage.setItem('our_story_device_role', 'himanshu');
        localStorage.setItem('our_story_is_himanshu_device', 'true');
        localStorage.setItem(AUTH_STORAGE_KEY, 'himanshu');
        sessionStorage.setItem(AUTH_STORAGE_KEY, 'himanshu');
        currentUser = 'himanshu';
        setAppPauseState(false, 'himanshu');
        if (secretPrompt) secretPrompt.classList.add('is-hidden');
        window.location.hash = 'himanshu';
        checkAuthGate();
      } else {
        alert('Invalid Master Key');
        secretPassInput.value = '';
      }
    });
  }

  if (secretCancelBtn && secretPrompt) {
    secretCancelBtn.addEventListener('click', () => {
      secretPrompt.classList.add('is-hidden');
    });
  }

  // Periodic poll check every 4 seconds to guarantee state enforcement
  setInterval(enforceAppPauseUI, 4000);

  // Initial check
  enforceAppPauseUI();
}

// ==========================================================================
// COUPLE PRIVATE AUTHENTICATION & LOGIN GATE FUNCTIONS
// ==========================================================================

function checkAuthGate() {
  const loginScreen = document.getElementById('coupleLoginScreen');
  const appLayout = document.querySelector('.app-layout');
  const authUser = getAuthenticatedUser();
  const paused = isAppCurrentlyPaused();
  const himanshuDev = isHimanshuDevice();

  if (!authUser) {
    currentUser = null;
    if (appLayout) appLayout.classList.add('is-auth-locked');
    if (loginScreen) {
      loginScreen.classList.remove('is-hidden', 'login-success-fade');
      const prevUser = localStorage.getItem('our_story_current_user') || (himanshuDev ? 'himanshu' : 'gullu');
      selectLoginProfile(prevUser === 'gullu' ? 'Gullu' : 'Himanshu', false);
    }
    enforceAppPauseUI();
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
    enforceAppPauseUI();
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
    if (isAppCurrentlyPaused()) {
      // Pure Error 104 trigger with ZERO alerts or messages
      const gulluScreen = document.getElementById('gulluAppPausedScreen');
      if (gulluScreen) gulluScreen.classList.remove('is-hidden');
      document.title = "This site can’t be reached";
      return;
    }
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
  if (matchedUser === 'himanshu') {
    localStorage.setItem('our_story_device_role', 'himanshu');
    localStorage.setItem('our_story_is_himanshu_device', 'true');
  } else if (matchedUser === 'gullu') {
    localStorage.setItem('our_story_device_role', 'gullu');
    localStorage.setItem('our_story_is_himanshu_device', 'false');
  }
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
    setupFirebaseRealtimeListeners();
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
  if (typeof detachAllFirebaseListeners === 'function') {
    detachAllFirebaseListeners();
  }

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

  if (targetUser === 'gullu' && isAppCurrentlyPaused()) {
    showAppModal(
      '⏸️ App Paused Hai',
      'App abhi paused hai aur Gullu ke device par Error 104 dikh raha hai. Gullu portal me switch karne ke liye pehle app unpause karein.'
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

    const isChat = tabId === 'paneChat';
    document.documentElement.classList.toggle('chat-view-active', isChat);
    document.body.classList.toggle('chat-view-active', isChat);

    // Lazy-attach Firebase listeners for this specific tab (Memories, Coupons, Radar, Q&A)
    attachTabScopedFirebaseListeners(tabId);

    if (tabId === 'panePulse') {
      fetchLatestCloudSync();
      try { startAutoLocationSync(); } catch (e) {}
      setTimeout(() => {
        if (!coupleMap) initCoupleRadarMap();
        else if (coupleMap && typeof coupleMap.invalidateSize === 'function') coupleMap.invalidateSize();
      }, 200);
    } else if (tabId === 'paneChat') {
      const badge = document.getElementById('dockChatBadge');
      if (badge) badge.classList.add('is-hidden');
      renderedChatMessagesCount = CHAT_PAGE_SIZE;
      renderChatUI(false);
      fetchLatestCloudSync();
      markIncomingChatMessagesAsRead();
      if ('Notification' in window && Notification.permission === 'default') {
        try { Notification.requestPermission().catch(() => {}); } catch (e) {}
      }
      const listEl = document.getElementById('chatMessagesList');
      if (listEl) {
        listEl.scrollTop = listEl.scrollHeight;
        requestAnimationFrame(() => {
          listEl.scrollTop = listEl.scrollHeight;
        });
        setTimeout(() => {
          listEl.scrollTop = listEl.scrollHeight;
        }, 50);
        setTimeout(() => {
          listEl.scrollTop = listEl.scrollHeight;
        }, 220);
      }
    }
  }

  dockItems.forEach(item => {
    item.addEventListener('click', () => {
      const tabId = item.getAttribute('data-tab');
      switchTab(tabId);
      playTone(600, 0.1);
      if (tabId !== 'paneChat') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
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
  const ytBtn = document.getElementById('smartSongYtBtn');

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
  if (ytBtn) {
    const s = SONG_CATALOG[selectedSongIndex];
    if (s) {
      ytBtn.href = s.ytId ? `https://www.youtube.com/watch?v=${s.ytId}` : `https://www.youtube.com/results?search_query=${encodeURIComponent(s.title + ' ' + s.artist)}`;
    }
  }
}

// --- IN-APP MUSIC PLAYER (PLAYS CRYSTAL-CLEAR AUDIO DIRECTLY ON PAGE - NO BROKEN EMBEDS!) ---
let currentPlayingYtId = null;
let currentPlayingAudioUrl = null;

function formatMusicTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function getOrCreateAudioPlayer() {
  let player = document.getElementById('globalAudioPlayer');
  if (!player) {
    player = document.createElement('audio');
    player.id = 'globalAudioPlayer';
    player.preload = 'auto';
    player.setAttribute('playsinline', 'true');
    document.body.appendChild(player);
  }
  return player;
}

function startAudioStream(url, title, artist) {
  const player = getOrCreateAudioPlayer();
  const playPauseBtn = document.getElementById('musicPlayPauseBtn');
  const discArt = document.getElementById('musicDiscArt');
  const fill = document.getElementById('musicProgressFill');
  const curEl = document.getElementById('musicTimeCurrent');
  const totEl = document.getElementById('musicTimeTotal');

  if (!url) {
    const match = SONG_CATALOG.find(s => s.title.toLowerCase().includes((title || '').toLowerCase()));
    url = match ? match.audioUrl : (SONG_CATALOG[0] && SONG_CATALOG[0].audioUrl);
  }

  currentPlayingAudioUrl = url;

  if (fill) fill.style.width = '0%';
  if (curEl) curEl.textContent = '0:00';
  if (totEl) totEl.textContent = '0:30';

  if (player.src !== url) {
    player.src = url;
  }
  player.volume = 0.9;
  player.currentTime = 0;

  player.ontimeupdate = () => {
    const cur = player.currentTime || 0;
    const dur = player.duration || 30;
    const pct = Math.min(100, (cur / dur) * 100);
    if (fill) fill.style.width = pct + '%';
    if (curEl) curEl.textContent = formatMusicTime(cur);
    if (totEl && !isNaN(dur) && dur > 0) totEl.textContent = formatMusicTime(dur);
  };

  player.onended = () => {
    if (discArt) discArt.classList.remove('spinning');
    if (playPauseBtn) playPauseBtn.textContent = '▶';
    if (fill) fill.style.width = '100%';
  };

  const playPromise = player.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      if (discArt) discArt.classList.add('spinning');
      if (playPauseBtn) playPauseBtn.textContent = '⏸';
    }).catch(err => {
      console.warn('Audio auto-play prevented by browser policy (user gesture required):', err);
      if (playPauseBtn) playPauseBtn.textContent = '▶';
      if (discArt) discArt.classList.remove('spinning');
    });
  }
}

function toggleAudioPlayPause() {
  const player = getOrCreateAudioPlayer();
  const playPauseBtn = document.getElementById('musicPlayPauseBtn');
  const discArt = document.getElementById('musicDiscArt');

  if (!player.src && currentPlayingAudioUrl) {
    player.src = currentPlayingAudioUrl;
  }

  if (player.paused) {
    player.play().then(() => {
      if (playPauseBtn) playPauseBtn.textContent = '⏸';
      if (discArt) discArt.classList.add('spinning');
    }).catch(err => console.error('Play error:', err));
  } else {
    player.pause();
    if (playPauseBtn) playPauseBtn.textContent = '▶';
    if (discArt) discArt.classList.remove('spinning');
  }
}

function playSongInApp(title, artist, ytId, audioUrl) {
  const bar = document.getElementById('inAppMusicBar');
  const titleEl = document.getElementById('musicTrackTitle');
  const artistEl = document.getElementById('musicTrackArtist');
  const ytBtn = document.getElementById('musicYoutubeBtn');
  const spotifyBtn = document.getElementById('musicSpotifyBtn');
  const ytFallback = document.getElementById('musicYtDirectLink');
  const iframe = document.getElementById('musicIframe');
  const frameWrap = document.getElementById('musicPlayerFrameWrap');

  if (!bar) return;

  currentPlayingYtId = ytId;
  const songTitle = title || 'Romantic Track';
  const songArtist = artist || 'Our Story';

  if (titleEl) titleEl.textContent = songTitle;
  if (artistEl) artistEl.textContent = songArtist;

  // Direct app links
  const ytUrl = ytId ? `https://www.youtube.com/watch?v=${ytId}` : `https://www.youtube.com/results?search_query=${encodeURIComponent(songTitle + ' ' + songArtist)}`;
  const spotifyUrl = `https://open.spotify.com/search/${encodeURIComponent(songTitle + ' ' + songArtist)}`;

  if (ytBtn) ytBtn.href = ytUrl;
  if (spotifyBtn) spotifyBtn.href = spotifyUrl;
  if (ytFallback) ytFallback.href = ytUrl;

  // Keep video iframe hidden by default so user never sees YouTube "Video unavailable" error
  if (frameWrap) {
    frameWrap.classList.add('is-hidden');
    frameWrap.classList.remove('expanded');
  }
  if (iframe) {
    iframe.src = '';
  }

  // Find audio stream url if not passed
  if (!audioUrl) {
    const found = SONG_CATALOG.find(s => (ytId && s.ytId === ytId) || s.title.toLowerCase().includes(songTitle.toLowerCase()));
    if (found && found.audioUrl) {
      audioUrl = found.audioUrl;
    }
  }

  // Play direct audio stream in-app
  startAudioStream(audioUrl, songTitle, songArtist);

  bar.classList.remove('is-hidden');
  try {
    playTone(550, 0.15);
  } catch (e) {}
}

function stopInAppMusic() {
  const bar = document.getElementById('inAppMusicBar');
  const iframe = document.getElementById('musicIframe');
  const wrap = document.getElementById('musicPlayerFrameWrap');
  const playPauseBtn = document.getElementById('musicPlayPauseBtn');
  const discArt = document.getElementById('musicDiscArt');
  const player = document.getElementById('globalAudioPlayer');
  const fill = document.getElementById('musicProgressFill');

  if (player) {
    player.pause();
    player.currentTime = 0;
  }
  if (iframe) iframe.src = '';
  if (bar) bar.classList.add('is-hidden');
  if (wrap) {
    wrap.classList.remove('expanded');
    wrap.classList.add('is-hidden');
  }
  if (playPauseBtn) playPauseBtn.textContent = '▶';
  if (discArt) discArt.classList.remove('spinning');
  if (fill) fill.style.width = '0%';
  currentPlayingYtId = null;
  currentPlayingAudioUrl = null;
}

function setupInAppMusicPlayer() {
  const closeBtn = document.getElementById('musicCloseBtn');
  const expandBtn = document.getElementById('musicExpandBtn');
  const playPauseBtn = document.getElementById('musicPlayPauseBtn');
  const frameWrap = document.getElementById('musicPlayerFrameWrap');
  const iframe = document.getElementById('musicIframe');
  const progressWrap = document.querySelector('.music-progress-bar-wrap');

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      stopInAppMusic();
    });
  }

  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleAudioPlayPause();
    });
  }

  if (progressWrap) {
    progressWrap.addEventListener('click', (e) => {
      const player = document.getElementById('globalAudioPlayer');
      if (player && player.duration) {
        const rect = progressWrap.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const pct = Math.max(0, Math.min(1, clickX / rect.width));
        player.currentTime = pct * player.duration;
      }
    });
  }

  if (expandBtn && frameWrap) {
    expandBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isCurrentlyHidden = frameWrap.classList.contains('is-hidden');
      if (isCurrentlyHidden) {
        frameWrap.classList.remove('is-hidden');
        frameWrap.classList.add('expanded');
        expandBtn.textContent = '🔽';
        expandBtn.title = 'Minimize Video Player';
        if (iframe && currentPlayingYtId && !iframe.src) {
          iframe.src = `https://www.youtube-nocookie.com/embed/${currentPlayingYtId}?autoplay=1&enablejsapi=1&playsinline=1&controls=1&rel=0`;
        }
      } else {
        frameWrap.classList.add('is-hidden');
        frameWrap.classList.remove('expanded');
        expandBtn.textContent = '🎬';
        expandBtn.title = 'Open Video Player';
        if (iframe) iframe.src = '';
      }
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

    // Auto-play the suggested song immediately when photo is chosen/uploaded!
    const s = SONG_CATALOG[selectedSongIndex];
    if (s) {
      playSongInApp(s.title, s.artist, s.ytId, s.audioUrl);
    }

    try {
      playCelebrationChime();
    } catch (e) {}
  }

  // Photo Inputs (Camera, Gallery, Fallback) & Change Handlers
  const fileInputCam = document.getElementById('memoryFileInputCamera');
  const fileInputGal = document.getElementById('memoryFileInputGallery');
  const dropzoneCameraBtn = document.getElementById('dropzoneCameraBtn');
  const dropzoneGalleryBtn = document.getElementById('dropzoneGalleryBtn');
  const previewImgContainer = document.getElementById('previewImgContainer');

  const onFileInputSelected = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        handleLoadedPhoto(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (fileInput) fileInput.addEventListener('change', onFileInputSelected);
  if (fileInputCam) fileInputCam.addEventListener('change', onFileInputSelected);
  if (fileInputGal) fileInputGal.addEventListener('change', onFileInputSelected);

  if (dropzoneCameraBtn) {
    dropzoneCameraBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (fileInputCam) fileInputCam.click();
    });
  }

  if (dropzoneGalleryBtn) {
    dropzoneGalleryBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (fileInputGal) fileInputGal.click();
      else if (fileInput) fileInput.click();
    });
  }

  if (dropzone) {
    dropzone.addEventListener('click', (e) => {
      if (e.target.id === 'removePhotoBtn' || e.target.closest('#removePhotoBtn')) return;
      if (e.target.closest('#previewImgContainer') || e.target.id === 'previewImg') {
        if (currentPreviewBase64) {
          openPhotoLightbox(currentPreviewBase64, 'Preview Memory 📸', 'Selected Photo Preview', 'Ready to save in our scrapbook');
        }
        return;
      }
      if (!currentPreviewBase64) {
        promptPhotoSource('vault');
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

  if (previewImgContainer) {
    previewImgContainer.addEventListener('click', (e) => {
      e.stopPropagation();
      if (currentPreviewBase64) {
        openPhotoLightbox(currentPreviewBase64, 'Preview Memory 📸', 'Selected Photo Preview', 'Ready to save in our scrapbook');
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
      stopInAppMusic();
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
      const ytBtn = document.getElementById('smartSongYtBtn');
      if (songEl) {
        songEl.innerHTML = `<strong>${song.title}</strong> • ${song.artist} <span style="color:var(--text-muted); font-size:0.75rem;">(${song.vibe})</span>`;
      }
      if (ytBtn && song) {
        ytBtn.href = song.ytId ? `https://www.youtube.com/watch?v=${song.ytId}` : `https://www.youtube.com/results?search_query=${encodeURIComponent(song.title + ' ' + song.artist)}`;
      }
      playSongInApp(song.title, song.artist, song.ytId, song.audioUrl);
      playTone(680, 0.15);
    });
  }

  // Listen to Song Preview (Plays right inside the app!)
  if (listenSongBtn) {
    listenSongBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const song = SONG_CATALOG[selectedSongIndex];
      if (song) {
        playSongInApp(song.title, song.artist, song.ytId, song.audioUrl);
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

  // Download All Memories Button in Feed Header
  const downloadAllBtn = document.getElementById('downloadAllMemoriesBtn');
  if (downloadAllBtn) {
    downloadAllBtn.addEventListener('click', downloadAllMemories);
  }
}

// ==========================================================================
// UNIVERSAL PHOTO DOWNLOAD & EXPORT ENGINE 💾
// Allows Himanshu & Gullu to download and preserve any memory anytime
// ==========================================================================

function downloadPhotoFile(rawSrc, filename = 'OurStory_Memory.jpg', caption = '') {
  if (!rawSrc) {
    showToast('❌ Photo data not found!');
    return;
  }

  resolveMediaUrl(rawSrc).then(src => {
    if (!src) {
      showToast('❌ Photo data not found!');
      return;
    }

    try {
      let cleanName = (filename || 'OurStory_Memory.jpg').replace(/[^a-zA-Z0-9_\-\.]/g, '_');
      if (!cleanName.toLowerCase().endsWith('.jpg') && !cleanName.toLowerCase().endsWith('.png')) {
        cleanName += '.jpg';
      }

      if (src.startsWith('data:')) {
        const parts = src.split(',');
        const mimeMatch = parts[0].match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
        const bstr = atob(parts[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const blob = new Blob([u8arr], { type: mime });
        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = cleanName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);
      } else {
        fetch(src)
          .then(res => res.blob())
          .then(blob => {
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = cleanName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);
          })
          .catch(() => {
            const link = document.createElement('a');
            link.href = src;
            link.download = cleanName;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          });
      }

      playTone(720, 0.15);
      showToast(`⬇️ Photo download ho gayi! ("${cleanName}") 📸✨`);
    } catch (err) {
      console.error('Download error:', err);
      const link = document.createElement('a');
      link.href = src;
      link.download = filename || 'OurStory_Photo.jpg';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('⬇️ Photo download started! 📸');
    }
  });
}

async function sharePhotoFile(src, filename = 'OurStory_Memory.jpg', caption = '') {
  if (!src) return;

  if (navigator.share && src.startsWith('data:')) {
    try {
      const parts = src.split(',');
      const mime = (parts[0].match(/:(.*?);/) || [])[1] || 'image/jpeg';
      const bstr = atob(parts[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const blob = new Blob([u8arr], { type: mime });
      const file = new File([blob], filename, { type: mime });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: caption || 'Our Story Memory',
          text: caption || 'Himanshu & Gullu Memory 💖'
        });
        showToast('💖 Photo saved / shared successfully!');
        return;
      }
    } catch (e) {
      if (e.name !== 'AbortError') {
        console.warn('Native share failed, falling back to download', e);
      } else {
        return;
      }
    }
  }

  downloadPhotoFile(src, filename, caption);
}

function downloadMemoryPhoto(memoryId) {
  if (!appState || !appState.memories) return;
  const memory = appState.memories.find(m => m.id === memoryId);
  if (!memory || !memory.photoUrl) {
    showToast('❌ Memory photo not found!');
    return;
  }
  const cleanCap = (memory.caption || 'Memory').slice(0, 20).replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `OurStory_${memory.date || 'moment'}_${cleanCap}.jpg`;
  downloadPhotoFile(memory.photoUrl, filename, memory.caption);
}

async function downloadAllMemories() {
  if (!appState || !appState.memories || appState.memories.length === 0) {
    showToast('📖 Abhi tak koi saved memory nahi hai!');
    return;
  }

  const memoriesWithPhotos = appState.memories.filter(m => m && m.photoUrl);
  if (memoriesWithPhotos.length === 0) {
    showToast('📖 Memories me photos nahi mili!');
    return;
  }

  const confirmed = confirm(`Aapki sabhi ${memoriesWithPhotos.length} memories download karein? Ye photos aapke phone me save ho jayengi.`);
  if (!confirmed) return;

  showToast(`📥 Downloading ${memoriesWithPhotos.length} photos... 💾`);

  for (let i = 0; i < memoriesWithPhotos.length; i++) {
    const m = memoriesWithPhotos[i];
    const cleanCap = (m.caption || 'Memory').slice(0, 15).replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `OurStory_${m.date || 'moment'}_${i + 1}_${cleanCap}.jpg`;
    
    downloadPhotoFile(m.photoUrl, filename, m.caption);
    if (i < memoriesWithPhotos.length - 1) {
      await new Promise(r => setTimeout(r, 600));
    }
  }

  playCelebrationChime();
  showToast(`🎉 Sabhi ${memoriesWithPhotos.length} photos download ho gayi! Forever saved 💖`);
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
    const audioUrl = (m.song?.audioUrl || '').replace(/'/g, "\\'");
    const cleanCaption = (m.caption || 'Our Sweet Memory').replace(/'/g, "\\'");
    const cleanComp = (m.compliment || '').replace(/'/g, "\\'");
    const metaStr = `By ${m.author || 'Couple'} • ${m.date || 'Today'}`.replace(/'/g, "\\'");

    return `
      <div class="memory-item-card">
        <div class="memory-item-img-wrap" onclick="openPhotoLightbox('${m.photoUrl}', '${cleanCaption}', '${cleanComp}', '${metaStr}')" title="Tap to view fullscreen photo 🔍">
          <img src="${m.photoUrl}" alt="${m.caption}" loading="lazy">
          <span class="memory-mode-pill">${m.mode === 'together' ? '💑 Together' : '📱 Apart'}</span>
          <button type="button" class="memory-card-download-badge" onclick="event.stopPropagation(); downloadMemoryPhoto('${m.id}')" title="Download Photo to Phone 💾">⬇️ Save</button>
          <span class="memory-zoom-pill">🔍 Khol Ke Dekhein</span>
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
          <div class="memory-song-pill" onclick="playSongInApp('${cleanTitle}', '${cleanArtist}', '${ytId}', '${audioUrl}')">
            <span class="song-play-icon">▶</span>
            <span><strong>${m.song?.title || 'Enchanted'}</strong> • ${m.song?.artist || 'Taylor Swift'}</span>
            <span class="song-inline-badge">Listen in App 🎵</span>
          </div>
          <div class="memory-card-actions-row">
            <button type="button" class="memory-save-photo-btn" onclick="downloadMemoryPhoto('${m.id}')">
              <span class="action-icon">⬇️</span>
              <span>Download Photo</span>
            </button>
            <button type="button" class="memory-fullscreen-photo-btn" onclick="openPhotoLightbox('${m.photoUrl}', '${cleanCaption}', '${cleanComp}', '${metaStr}')">
              <span class="action-icon">🔍</span>
              <span>View Fullscreen</span>
            </button>
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

// --- Leaflet Dynamic Lazy Loader (Phase 2 Step 2A) ---
let isLeafletLoaded = false;
let leafletLoadPromise = null;

function loadLeafletAssets() {
  if (typeof L !== 'undefined' && isLeafletLoaded) {
    return Promise.resolve();
  }
  if (leafletLoadPromise) {
    return leafletLoadPromise;
  }

  leafletLoadPromise = new Promise((resolve, reject) => {
    if (typeof L !== 'undefined') {
      isLeafletLoaded = true;
      return resolve();
    }

    // 1. Dynamic CSS Link Injection
    if (!document.getElementById('leafletCssLink')) {
      const link = document.createElement('link');
      link.id = 'leafletCssLink';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // 2. Dynamic JS Script Injection
    const script = document.createElement('script');
    script.id = 'leafletJsScript';
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;

    script.onload = () => {
      isLeafletLoaded = true;
      resolve();
    };

    script.onerror = (err) => {
      leafletLoadPromise = null;
      reject(err);
    };

    document.body.appendChild(script);
  });

  return leafletLoadPromise;
}

function initCoupleRadarMap() {
  const mapEl = document.getElementById('coupleRadarMap');
  if (!mapEl || coupleMap) return;

  // If Leaflet is not loaded yet, inject on-demand and show loading indicator
  if (typeof L === 'undefined') {
    if (!document.getElementById('radarMapLoading')) {
      mapEl.innerHTML = `
        <div class="radar-map-loading" id="radarMapLoading">
          <span class="radar-map-spinner"></span>
          <span>Connecting Radar GPS Map... 📍</span>
        </div>
      `;
    }
    loadLeafletAssets().then(() => {
      if (document.getElementById('radarMapLoading')) {
        mapEl.innerHTML = '';
      }
      initCoupleRadarMap();
    }).catch((err) => {
      console.warn('Leaflet lazy load failed:', err);
      if (document.getElementById('radarMapLoading')) {
        mapEl.innerHTML = `
          <div class="radar-map-loading">
            <span>⚠️ Radar map offline. GPS distances active!</span>
          </div>
        `;
      }
    });
    return;
  }

  try {
    if (document.getElementById('radarMapLoading')) {
      mapEl.innerHTML = '';
    }

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
          deviceNoticeText.textContent = 'Dono profiles ek hi device se recorded hain (~14m). Partner jab apne alag phone se portal kholegi tab real-time distance auto-update ho jayega. Ya "Apart Mode" se test karein.';
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
    if (romanticMsg) romanticMsg.textContent = 'Live GPS auto-sync active... distance calculate ho rahi hai ❤️';
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

  isLocationSyncInProgress = true;

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      isLocationSyncInProgress = false;
      const permNotice = document.getElementById('radarPermNotice');
      if (permNotice) permNotice.classList.add('is-hidden');

      const livePill = document.getElementById('radarLivePill');
      if (livePill) {
        livePill.innerHTML = '<span class="live-pulse-dot"></span> Auto-Live (5s)';
        livePill.classList.remove('error');
      }

      await processAndBroadcastLocation(position, activeUser, silent);
    },
    (error) => {
      isLocationSyncInProgress = false;
      console.warn('Geolocation error:', error);
      
      if (error && error.code === 1) { // PERMISSION_DENIED
        const permNotice = document.getElementById('radarPermNotice');
        if (permNotice) permNotice.classList.remove('is-hidden');

        const livePill = document.getElementById('radarLivePill');
        if (livePill) {
          livePill.innerHTML = '⚠️ GPS Blocked';
          livePill.classList.add('error');
        }
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

  const livePill = document.getElementById('radarLivePill');
  if (livePill && !livePill.classList.contains('error')) {
    livePill.innerHTML = '<span class="live-pulse-dot"></span> Auto-Live (5s)';
  }

  // Run immediate update
  shareMyLocation(true);

  if (autoLocationSyncTimer) {
    clearInterval(autoLocationSyncTimer);
    autoLocationSyncTimer = null;
  }

  // 5-second interval timer
  autoLocationSyncTimer = setInterval(() => {
    const user = currentUser || getAuthenticatedUser();
    if (user && document.visibilityState === 'visible') {
      shareMyLocation(true);
    }
  }, 5000);

  // OS-level continuous watchPosition
  if (navigator.geolocation && navigator.geolocation.watchPosition && autoLocationWatchId === null) {
    try {
      autoLocationWatchId = navigator.geolocation.watchPosition(
        handleLiveGpsPosition,
        (err) => {
          console.warn('watchPosition warning:', err);
          if (err && err.code === 1) {
            const permNotice = document.getElementById('radarPermNotice');
            if (permNotice) permNotice.classList.remove('is-hidden');
          }
        },
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
  const enableGpsBtn = document.getElementById('radarEnableGpsBtn');
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

  if (enableGpsBtn) {
    enableGpsBtn.addEventListener('click', () => {
      shareMyLocation(false);
    });
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
let activeWaitingWorker = null;

function isUserBusyWithInteractiveTask() {
  // 1. WebRTC video or audio call is active, incoming, or outgoing
  if (typeof vcState !== 'undefined' && vcState && (vcState.status === 'active' || vcState.status === 'outgoing' || vcState.status === 'incoming')) {
    return true;
  }
  // 2. User is actively typing inside chat message input
  const chatTextInput = document.getElementById('chatTextInput');
  if (chatTextInput && chatTextInput.value && chatTextInput.value.trim().length > 0) {
    return true;
  }
  // 3. User is actively focused inside any text input or textarea
  if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) {
    return true;
  }
  // 4. User is actively recording a voice note
  const voiceRecBar = document.getElementById('chatVoiceRecordBar');
  if (voiceRecBar && !voiceRecBar.classList.contains('is-hidden') && voiceRecBar.style.display !== 'none') {
    return true;
  }
  return false;
}

function showAppUpdatePrompt(worker = null) {
  if (worker) activeWaitingWorker = worker;
  const banner = document.getElementById('appUpdateBanner');
  if (banner) {
    banner.classList.remove('is-hidden');
    banner.style.display = 'flex';
  }
}

function dismissAppUpdatePrompt() {
  const banner = document.getElementById('appUpdateBanner');
  if (banner) {
    banner.classList.add('is-hidden');
    banner.style.display = 'none';
  }
}

function setupPWAandUpdates() {
  // 1. Graceful PWA Auto-Update Engine with Call / Typing / Voice Note Safety
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then((registration) => {
      // Check if a worker is already waiting from previous session
      if (registration.waiting) {
        activeWaitingWorker = registration.waiting;
        showAppUpdatePrompt(registration.waiting);
      }

      // Detect when a newly downloaded service worker finishes installing
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // An active controller exists -> genuine new version installed & waiting
                activeWaitingWorker = newWorker;
                showAppUpdatePrompt(newWorker);
              }
            }
          });
        }
      });

      // Periodically check for updates silently in the background
      setInterval(() => {
        registration.update().catch(() => {});
      }, 45000);

      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          registration.update().catch(() => {});
          if (registration.waiting) {
            activeWaitingWorker = registration.waiting;
            showAppUpdatePrompt(registration.waiting);
          }
          if (typeof firebaseDb !== 'undefined' && firebaseDb) {
            try { firebaseDb.goOnline(); } catch (e) {}
          }
          if (typeof attachTabScopedFirebaseListeners === 'function') {
            const activePane = document.querySelector('.tab-pane.active');
            const activeTabId = activePane ? activePane.id : 'panePulse';
            attachTabScopedFirebaseListeners(activeTabId);
          }
          fetchLatestCloudSync();
          if (currentUser) {
            try { startAutoLocationSync(); } catch (e) {}
          }
          const chatPane = document.getElementById('paneChat');
          if (chatPane && chatPane.classList.contains('active')) {
            markIncomingChatMessagesAsRead();
          }
        } else if (document.visibilityState === 'hidden') {
          if (typeof detachAllNonCoreFirebaseListeners === 'function') {
            detachAllNonCoreFirebaseListeners();
          }
        }
      });

      window.addEventListener('focus', () => {
        if (typeof firebaseDb !== 'undefined' && firebaseDb) {
          try { firebaseDb.goOnline(); } catch (e) {}
        }
        if (typeof attachTabScopedFirebaseListeners === 'function') {
          const activePane = document.querySelector('.tab-pane.active');
          const activeTabId = activePane ? activePane.id : 'panePulse';
          attachTabScopedFirebaseListeners(activeTabId);
        }
        fetchLatestCloudSync();
        if (currentUser) {
          try { startAutoLocationSync(); } catch (e) {}
        }
        const chatPane = document.getElementById('paneChat');
        if (chatPane && chatPane.classList.contains('active')) {
          markIncomingChatMessagesAsRead();
        }
      });
    }).catch((err) => {
      console.warn('PWA Service Worker registration skipped:', err);
    });

    // When the new worker takes control (via user tapping update or next cold launch)
    let isRefreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (isRefreshing) return;
      // Guard: Never reload while in a call, actively typing, or recording voice note
      if (isUserBusyWithInteractiveTask()) {
        console.log('PWA: Service worker activated, reload deferred (user is busy with call/typing/voice)');
        showAppUpdatePrompt(activeWaitingWorker);
        return;
      }
      isRefreshing = true;
      if (appState) saveAppState(appState, true);
      console.log('App updated to new version ✨');
      window.location.reload();
    });
  }

  // 2. Hook up Update Prompt Buttons
  const updateBtn = document.getElementById('updateAppBtn');
  if (updateBtn) {
    updateBtn.addEventListener('click', () => {
      if (appState) saveAppState(appState, true);
      if (activeWaitingWorker) {
        activeWaitingWorker.postMessage({ type: 'SKIP_WAITING' });
      } else {
        window.location.reload();
      }
    });
  }

  const dismissBtn = document.getElementById('dismissUpdateBannerBtn');
  if (dismissBtn) {
    dismissBtn.addEventListener('click', () => {
      dismissAppUpdatePrompt();
    });
  }

  // 3. PWA "Add to Home Screen" Install Prompt Handler
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

// Automatic Cache Purge & Live Version Verifier (Safe Guarded)
async function checkAndApplyForcedAppUpdate() {
  try {
    const res = await fetch('./version.json?nocache=' + Date.now(), { cache: 'no-store' });
    if (!res.ok) return;
    const cloudData = await res.json();
    const storedVersion = localStorage.getItem('our_story_app_version');
    if (cloudData && cloudData.version) {
      if (storedVersion && storedVersion !== cloudData.version) {
        console.log(`[PWA Version Check] New version on server: ${cloudData.version} (stored: ${storedVersion})`);
        if (isUserBusyWithInteractiveTask()) {
          showAppUpdatePrompt(activeWaitingWorker);
          return;
        }
        localStorage.setItem('our_story_app_version', cloudData.version);
        if ('serviceWorker' in navigator) {
          const reg = await navigator.serviceWorker.getRegistration();
          if (reg) {
            reg.update().catch(() => {});
          }
        }
      } else {
        localStorage.setItem('our_story_app_version', cloudData.version);
      }
    }
  } catch (e) {
    console.warn('Auto version check skipped:', e);
  }
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

function formatChatDateDivider(timestamp) {
  if (!timestamp) return 'TODAY';
  const d = new Date(timestamp);
  const now = new Date();
  
  if (d.toDateString() === now.toDateString()) return 'TODAY';
  
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return 'YESTERDAY';
  
  const day = d.getDate();
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${day} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function linkifyChatText(text) {
  if (!text) return '';
  const escaped = escapeChatHtml(text);
  const urlRegex = /(https?:\/\/[^\s<]+)/gi;
  return escaped.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="chat-msg-link" onclick="event.stopPropagation()">${url}</a>`;
  });
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

// ==========================================================================
// COUPLE MESSAGING APP ENGINE (Voice Notes, Photos, Typing, Call Cards)
// ==========================================================================

let typingDebounceTimer = null;
let amICurrentlyTyping = false;
let isPartnerCurrentlyTyping = false;
let partnerTypingFadeTimeout = null;

function broadcastMyTypingStatus(isTyping) {
  if (amICurrentlyTyping === isTyping) return;
  amICurrentlyTyping = isTyping;
  broadcastUpdate('CHAT_TYPING', { user: currentUser, isTyping: isTyping });
}

function getPartnerLastActivityTimestamp() {
  const partnerUser = currentUser === 'himanshu' ? 'gullu' : 'himanshu';
  let latest = 0;
  
  if (appState && appState.locations && appState.locations[partnerUser] && appState.locations[partnerUser].timestamp) {
    const locTime = Number(appState.locations[partnerUser].timestamp) || 0;
    if (locTime > latest) latest = locTime;
  }
  
  if (appState && appState.chatMessages) {
    const msgs = appState.chatMessages;
    for (let i = msgs.length - 1; i >= 0; i--) {
      if (msgs[i].sender === partnerUser && msgs[i].timestamp) {
        const msgTime = Number(msgs[i].timestamp) || 0;
        if (msgTime > latest) latest = msgTime;
        break;
      }
    }
  }

  if (!latest) {
    latest = Date.now() - 45000;
  }
  return latest;
}

function formatChatLastSeen(timestamp) {
  if (!timestamp) return 'offline';
  const now = Date.now();
  if (now - timestamp < 90000) return 'online';
  
  const d = new Date(timestamp);
  const nowDate = new Date();
  const timeStr = formatChatTime(timestamp);
  
  if (d.toDateString() === nowDate.toDateString()) {
    return `last seen today at ${timeStr}`;
  }
  const yesterday = new Date(nowDate);
  yesterday.setDate(nowDate.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) {
    return `last seen yesterday at ${timeStr}`;
  }
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `last seen ${d.getDate()} ${months[d.getMonth()]} at ${timeStr}`;
}

function updatePartnerHeaderStatus() {
  const subHeading = document.getElementById('chatPartnerSub') || document.getElementById('chatPartnerSubtitle');
  const statusDot = document.getElementById('chatStatusDot');
  if (!subHeading) return;

  if (isPartnerCurrentlyTyping) {
    subHeading.innerHTML = '<span class="chat-typing-status">typing...</span>';
    if (statusDot) {
      statusDot.classList.add('pulse');
      statusDot.classList.remove('offline');
    }
    return;
  }

  const lastSeen = getPartnerLastActivityTimestamp();
  const isOnline = (Date.now() - lastSeen) < 90000;

  if (isOnline) {
    subHeading.innerHTML = '<span class="chat-online-badge">online</span>';
    if (statusDot) {
      statusDot.classList.add('pulse');
      statusDot.classList.remove('offline');
    }
  } else {
    subHeading.innerHTML = `<span class="chat-lastseen-text">${formatChatLastSeen(lastSeen)}</span>`;
    if (statusDot) {
      statusDot.classList.remove('pulse');
      statusDot.classList.add('offline');
    }
  }
}

function setPartnerTypingUI(data) {
  if (!data || data.user === currentUser) return;
  const bubble = document.getElementById('chatTypingBubble');
  const partnerAvatar = currentUser === 'himanshu' ? '🌸' : '☕';
  const typingAvatar = document.getElementById('typingPartnerAvatar');

  if (typingAvatar) typingAvatar.textContent = partnerAvatar;

  clearTimeout(partnerTypingFadeTimeout);

  if (data.isTyping) {
    isPartnerCurrentlyTyping = true;
    if (bubble) bubble.classList.remove('is-hidden');
    updatePartnerHeaderStatus();
    const listEl = document.getElementById('chatMessagesList');
    if (listEl) {
      const isNearBottom = listEl.scrollHeight - listEl.scrollTop - listEl.clientHeight < 150;
      if (isNearBottom) listEl.scrollTo({ top: listEl.scrollHeight, behavior: 'smooth' });
    }
    // Auto-clear after 4s in case partner paused typing or connection dropped
    partnerTypingFadeTimeout = setTimeout(() => {
      isPartnerCurrentlyTyping = false;
      if (bubble) bubble.classList.add('is-hidden');
      updatePartnerHeaderStatus();
    }, 4000);
  } else {
    isPartnerCurrentlyTyping = false;
    if (bubble) bubble.classList.add('is-hidden');
    updatePartnerHeaderStatus();
  }
}

// --- Voice Note Recording System (MediaRecorder API) ---
let voiceMediaRecorder = null;
let voiceAudioChunks = [];
let voiceRecordTimerInterval = null;
let voiceRecordSeconds = 0;
let voiceRecordStream = null;

async function startVoiceRecording() {
  if (voiceMediaRecorder && voiceMediaRecorder.state === 'recording') return;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    voiceRecordStream = stream;
    voiceAudioChunks = [];
    voiceRecordSeconds = 0;

    let mimeType = 'audio/webm';
    if (!MediaRecorder.isTypeSupported('audio/webm')) {
      mimeType = MediaRecorder.isTypeSupported('audio/mp4') ? 'audio/mp4' : '';
    }
    const options = mimeType ? { mimeType } : {};
    voiceMediaRecorder = new MediaRecorder(stream, options);

    voiceMediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        voiceAudioChunks.push(e.data);
      }
    };

    voiceMediaRecorder.start();

    const bar = document.getElementById('chatVoiceRecordBar');
    const timer = document.getElementById('voiceRecTimer');
    if (bar) bar.classList.remove('is-hidden');
    if (timer) timer.textContent = '00:00';

    clearInterval(voiceRecordTimerInterval);
    voiceRecordTimerInterval = setInterval(() => {
      voiceRecordSeconds++;
      const m = Math.floor(voiceRecordSeconds / 60).toString().padStart(2, '0');
      const s = (voiceRecordSeconds % 60).toString().padStart(2, '0');
      if (timer) timer.textContent = `${m}:${s}`;
    }, 1000);

    playTone(523.25, 0.08);
  } catch (err) {
    console.warn('Voice recording microphone error:', err);
    alert('Microphone access is required to record voice notes. Please grant permission in your browser! 🎙️');
  }
}

function cancelVoiceRecording() {
  if (voiceRecordTimerInterval) {
    clearInterval(voiceRecordTimerInterval);
    voiceRecordTimerInterval = null;
  }
  if (voiceMediaRecorder && voiceMediaRecorder.state !== 'inactive') {
    voiceMediaRecorder.onstop = null;
    voiceMediaRecorder.stop();
  }
  if (voiceRecordStream) {
    try { voiceRecordStream.getTracks().forEach(t => t.stop()); } catch (e) {}
    voiceRecordStream = null;
  }
  voiceAudioChunks = [];
  const bar = document.getElementById('chatVoiceRecordBar');
  if (bar) bar.classList.add('is-hidden');
  playTone(329.63, 0.1);
}

function finishAndSendVoiceRecording() {
  if (!voiceMediaRecorder || voiceMediaRecorder.state === 'inactive') return;
  const recordedDurationSec = Math.max(1, voiceRecordSeconds);
  const m = Math.floor(recordedDurationSec / 60);
  const s = (recordedDurationSec % 60).toString().padStart(2, '0');
  const durStr = `${m}:${s}`;

  if (voiceRecordTimerInterval) {
    clearInterval(voiceRecordTimerInterval);
    voiceRecordTimerInterval = null;
  }

  voiceMediaRecorder.onstop = () => {
    if (voiceRecordStream) {
      try { voiceRecordStream.getTracks().forEach(t => t.stop()); } catch (e) {}
      voiceRecordStream = null;
    }
    const mimeType = voiceMediaRecorder.mimeType || 'audio/webm';
    const blob = new Blob(voiceAudioChunks, { type: mimeType });
    voiceAudioChunks = [];

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Audio = reader.result;
      sendChatMessage('Voice Note 🎙️', 'audio', {
        audioData: base64Audio,
        duration: durStr
      });
    };
    reader.readAsDataURL(blob);
  };

  voiceMediaRecorder.stop();
  const bar = document.getElementById('chatVoiceRecordBar');
  if (bar) bar.classList.add('is-hidden');
}

// --- Image Attachment & Canvas Compression ---
function handleImageFileSelected(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const rawDataUrl = e.target.result;
    const img = new Image();
    img.onload = () => {
      const maxDim = 800;
      let w = img.width;
      let h = img.height;
      if (w > maxDim || h > maxDim) {
        if (w > h) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.72);

      const previewTray = document.getElementById('chatImagePreviewTray');
      const previewImg = document.getElementById('chatPreviewImage');
      const captionInput = document.getElementById('chatImageCaption');
      if (previewImg) previewImg.src = compressedDataUrl;
      if (captionInput) captionInput.value = '';
      if (previewTray) previewTray.classList.remove('is-hidden');
      if (captionInput) captionInput.focus();
    };
    img.src = rawDataUrl;
  };
  reader.readAsDataURL(file);
}

function sendSelectedChatImage() {
  const previewImg = document.getElementById('chatPreviewImage');
  const captionInput = document.getElementById('chatImageCaption');
  const previewTray = document.getElementById('chatImagePreviewTray');
  const fileInput = document.getElementById('chatImageInput');

  if (!previewImg || !previewImg.src) return;

  const base64Data = previewImg.src;
  const caption = captionInput ? captionInput.value.trim() : '';

  sendChatMessage(caption || 'Shared a photo 📷', 'image', {
    imageData: base64Data,
    caption: caption
  });

  if (previewTray) previewTray.classList.add('is-hidden');
  if (previewImg) previewImg.src = '';
  if (captionInput) captionInput.value = '';
  if (fileInput) fileInput.value = '';
}

// --- Voice Note Playback Manager ---
let currentActiveVoicePlayer = null;
let currentActiveVoiceBtn = null;

function handleVoicePlayClick(btn) {
  if (!btn) return;
  const rawAudioSrc = btn.getAttribute('data-audio-src');
  if (!rawAudioSrc) return;

  resolveMediaUrl(rawAudioSrc).then(audioSrc => {
    if (!audioSrc) return;

    const bubble = btn.closest('.chat-voice-bubble');
    const speedPill = bubble ? bubble.querySelector('.voice-speed-pill') : null;
    const speedRate = speedPill ? (parseFloat(speedPill.getAttribute('data-speed')) || 1.0) : 1.0;

    btn.classList.add('listened');

    if (currentActiveVoiceBtn === btn && currentActiveVoicePlayer) {
      if (currentActiveVoicePlayer.paused) {
        currentActiveVoicePlayer.playbackRate = speedRate;
        currentActiveVoicePlayer.play().then(() => {
          btn.textContent = '⏸';
          if (bubble) bubble.classList.add('playing');
        }).catch(() => {});
      } else {
        currentActiveVoicePlayer.pause();
        btn.textContent = '▶';
        if (bubble) bubble.classList.remove('playing');
      }
      return;
    }

    if (currentActiveVoicePlayer) {
      currentActiveVoicePlayer.pause();
      if (currentActiveVoiceBtn) {
        currentActiveVoiceBtn.textContent = '▶';
        const prevBubble = currentActiveVoiceBtn.closest('.chat-voice-bubble');
        if (prevBubble) prevBubble.classList.remove('playing');
      }
    }

    const player = new Audio(audioSrc);
    player.playbackRate = speedRate;
    currentActiveVoicePlayer = player;
    currentActiveVoiceBtn = btn;

    btn.textContent = '⏸';
    if (bubble) bubble.classList.add('playing');

    player.onended = () => {
      btn.textContent = '▶';
      if (bubble) bubble.classList.remove('playing');
      currentActiveVoicePlayer = null;
      currentActiveVoiceBtn = null;
    };

    player.onerror = () => {
      btn.textContent = '▶';
      if (bubble) bubble.classList.remove('playing');
      currentActiveVoicePlayer = null;
      currentActiveVoiceBtn = null;
    };

    player.play().catch(err => {
      console.warn('Voice playback failed:', err);
      btn.textContent = '▶';
      if (bubble) bubble.classList.remove('playing');
    });
  });
}

function handleVoiceSpeedPillClick(speedPill) {
  if (!speedPill) return;
  const currentRate = parseFloat(speedPill.getAttribute('data-speed')) || 1.0;
  let nextRate = 1.5;
  if (currentRate === 1.5) nextRate = 2.0;
  else if (currentRate === 2.0) nextRate = 1.0;
  speedPill.setAttribute('data-speed', String(nextRate));
  speedPill.textContent = `${nextRate}x`;
  speedPill.classList.toggle('active', nextRate > 1.0);
  const bubble = speedPill.closest('.chat-voice-bubble');
  const playBtn = bubble ? bubble.querySelector('.voice-play-btn') : null;
  if (currentActiveVoicePlayer && currentActiveVoiceBtn === playBtn) {
    currentActiveVoicePlayer.playbackRate = nextRate;
  }
}

function setupVoicePlayListener(btn) {
  if (!btn) return;
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    handleVoicePlayClick(btn);
  });
}

// ==========================================================================
// DELEGATED CHAT CONTAINER STATE & GESTURES (CONTAINER-LEVEL, ZERO PER-ROW CLOSURES)
// ==========================================================================
let chatTouchActiveRow = null;
let chatTouchActiveMsg = null;
let chatTouchReplyIcon = null;
let chatTouchStartX = 0;
let chatTouchStartY = 0;
let chatIsSwiping = false;
let chatDidLongPress = false;
let chatLongPressTimer = null;
let chatLastTapTime = 0;
let chatLastTapRow = null;

function handleChatBubbleDoubleTap(row) {
  if (!row) return;
  const isMe = row.classList.contains('me');
  const msgId = row.getAttribute('data-msg-id');
  if (!msgId) return;
  const reactionEmoji = isMe ? '❤️' : '😂';
  toggleMessageReaction(msgId, reactionEmoji);
  if (navigator.vibrate) {
    try { navigator.vibrate(30); } catch (e) {}
  }
}

function handleChatTouchStart(e) {
  if (!e.touches || !e.touches[0]) return;
  const target = e.target;

  // Ignore interactive controls to let direct clicks execute
  if (target.closest('button, a, input, .voice-speed-pill, .voice-play-btn, .chat-reaction-chip')) {
    return;
  }

  const row = target.closest('.chat-msg-row');
  if (!row) return;

  const msgId = row.getAttribute('data-msg-id');
  const msg = appState?.chatMessages?.find(m => m && m.id === msgId);
  if (!msg) return;

  // Quick consecutive double-tap reaction detection
  const now = Date.now();
  if (now - chatLastTapTime < 320 && chatLastTapRow === row) {
    if (chatLongPressTimer) {
      clearTimeout(chatLongPressTimer);
      chatLongPressTimer = null;
    }
    handleChatBubbleDoubleTap(row);
    chatLastTapTime = 0;
    chatLastTapRow = null;
    return;
  }
  chatLastTapTime = now;
  chatLastTapRow = row;

  chatTouchActiveRow = row;
  chatTouchActiveMsg = msg;
  chatTouchReplyIcon = row.querySelector('.swipe-reply-icon');
  chatTouchStartX = e.touches[0].clientX;
  chatTouchStartY = e.touches[0].clientY;
  chatIsSwiping = false;
  chatDidLongPress = false;

  if (chatLongPressTimer) {
    clearTimeout(chatLongPressTimer);
    chatLongPressTimer = null;
  }

  chatLongPressTimer = setTimeout(() => {
    chatDidLongPress = true;
    if (navigator.vibrate) {
      try { navigator.vibrate(35); } catch (err) {}
    }
    playTone(750, 0.06);
    openChatContextMenu(chatTouchActiveMsg, chatTouchActiveRow);
  }, 350);
}

function handleChatTouchMove(e) {
  if (!chatTouchActiveRow || !e.touches || !e.touches[0]) return;
  const currentX = e.touches[0].clientX;
  const currentY = e.touches[0].clientY;
  const dx = currentX - chatTouchStartX;
  const dy = currentY - chatTouchStartY;

  // Vertical scroll detection: immediately allow native list scroll without locking
  if (Math.abs(dy) > 14 && Math.abs(dy) > Math.abs(dx)) {
    if (chatLongPressTimer) {
      clearTimeout(chatLongPressTimer);
      chatLongPressTimer = null;
    }
    if (chatIsSwiping) {
      chatTouchActiveRow.style.transform = 'translateX(0px)';
      chatTouchActiveRow.classList.remove('swiping');
      if (chatTouchReplyIcon) {
        chatTouchReplyIcon.style.opacity = '';
        chatTouchReplyIcon.style.transform = '';
      }
      chatIsSwiping = false;
    }
    return;
  }

  // Cancel long-press on genuine movement
  if (Math.abs(dx) > 18 || Math.abs(dy) > 14) {
    if (chatLongPressTimer) {
      clearTimeout(chatLongPressTimer);
      chatLongPressTimer = null;
    }
  }

  // Horizontal slide-to-reply: swipe right on message bubble
  if (dx > 16 && dx > Math.abs(dy) * 1.15 && !chatDidLongPress) {
    chatIsSwiping = true;
    const moveX = Math.min(dx * 0.7, 72);
    chatTouchActiveRow.style.transform = `translateX(${moveX}px)`;
    chatTouchActiveRow.classList.add('swiping');
    if (chatTouchReplyIcon) {
      const progress = Math.min(dx / 50, 1);
      chatTouchReplyIcon.style.opacity = String(progress);
      chatTouchReplyIcon.style.transform = `translateY(-50%) scale(${0.6 + 0.4 * progress})`;
    }
  }
}

function handleChatTouchEnd(e) {
  if (chatLongPressTimer) {
    clearTimeout(chatLongPressTimer);
    chatLongPressTimer = null;
  }

  if (!chatTouchActiveRow) return;

  if (chatTouchReplyIcon) {
    chatTouchReplyIcon.style.opacity = '';
    chatTouchReplyIcon.style.transform = '';
  }

  if (chatDidLongPress) {
    chatTouchActiveRow.style.transform = 'translateX(0px)';
    chatTouchActiveRow.classList.remove('swiping');
    chatIsSwiping = false;
    chatTouchActiveRow = null;
    chatTouchActiveMsg = null;
    chatTouchReplyIcon = null;
    return;
  }

  if (chatIsSwiping) {
    const endX = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientX : chatTouchStartX;
    const finalDx = endX - chatTouchStartX;
    chatTouchActiveRow.style.transform = 'translateX(0px)';
    chatTouchActiveRow.classList.remove('swiping');
    if (finalDx > 35 && chatTouchActiveMsg) {
      setReplyTarget(chatTouchActiveMsg);
      if (navigator.vibrate) {
        try { navigator.vibrate(25); } catch (err) {}
      }
      playTone(850, 0.05);
    }
    chatIsSwiping = false;
  }

  chatTouchActiveRow = null;
  chatTouchActiveMsg = null;
  chatTouchReplyIcon = null;
}

function handleChatTouchCancel() {
  if (chatLongPressTimer) {
    clearTimeout(chatLongPressTimer);
    chatLongPressTimer = null;
  }
  if (chatTouchReplyIcon) {
    chatTouchReplyIcon.style.opacity = '';
    chatTouchReplyIcon.style.transform = '';
  }
  if (chatTouchActiveRow) {
    chatTouchActiveRow.style.transform = 'translateX(0px)';
    chatTouchActiveRow.classList.remove('swiping');
  }
  chatIsSwiping = false;
  chatDidLongPress = false;
  chatTouchActiveRow = null;
  chatTouchActiveMsg = null;
  chatTouchReplyIcon = null;
}

function handleChatListClick(e) {
  const target = e.target;

  // 1. Reaction chip click
  const reactionChip = target.closest('.chat-reaction-chip');
  if (reactionChip) {
    e.stopPropagation();
    const msgId = reactionChip.getAttribute('data-msg-id');
    const emoji = reactionChip.textContent.trim();
    if (msgId) toggleMessageReaction(msgId, emoji);
    return;
  }

  // 2. Quoted reply click-to-scroll
  const quoteEl = target.closest('.chat-reply-quote');
  if (quoteEl) {
    e.stopPropagation();
    const targetId = quoteEl.getAttribute('data-reply-target');
    if (targetId) scrollToChatMessage(targetId);
    return;
  }

  // 3. Quick bubble reply button
  const replyActionBtn = target.closest('.bubble-reply-action-btn');
  if (replyActionBtn) {
    e.stopPropagation();
    const row = replyActionBtn.closest('.chat-msg-row');
    const msgId = row?.getAttribute('data-msg-id');
    const msg = appState?.chatMessages?.find(m => m.id === msgId);
    if (msg) {
      setReplyTarget(msg);
      if (navigator.vibrate) {
        try { navigator.vibrate(20); } catch (err) {}
      }
      playTone(800, 0.05);
    }
    return;
  }

  // 4. Quick bubble edit button
  const editActionBtn = target.closest('.bubble-edit-action-btn');
  if (editActionBtn) {
    e.stopPropagation();
    const row = editActionBtn.closest('.chat-msg-row');
    const msgId = row?.getAttribute('data-msg-id');
    const msg = appState?.chatMessages?.find(m => m.id === msgId);
    if (msg) {
      openEditMessageModal(msg);
      if (navigator.vibrate) {
        try { navigator.vibrate(20); } catch (err) {}
      }
      playTone(800, 0.05);
    }
    return;
  }

  // 5. Voice play button
  const voicePlayBtn = target.closest('.voice-play-btn');
  if (voicePlayBtn) {
    e.stopPropagation();
    handleVoicePlayClick(voicePlayBtn);
    return;
  }

  // 6. Voice speed pill
  const voiceSpeedPill = target.closest('.voice-speed-pill');
  if (voiceSpeedPill) {
    e.stopPropagation();
    handleVoiceSpeedPillClick(voiceSpeedPill);
    return;
  }

  // 7. Image download button
  const dlBtn = target.closest('.chat-image-download-btn');
  if (dlBtn) {
    const row = dlBtn.closest('.chat-msg-row');
    const thumb = row?.querySelector('.chat-msg-image-thumb');
    if (thumb && thumb.src && dlBtn.tagName === 'BUTTON') {
      e.stopPropagation();
      const msgId = row.getAttribute('data-msg-id');
      const msg = appState?.chatMessages?.find(m => m.id === msgId);
      const cap = (msg && msg.caption) || ((msg && msg.text !== 'Shared a photo 📷') ? msg.text : '');
      downloadPhotoFile(thumb.src, `OurStory_Chat_${Date.now()}.jpg`, cap);
      return;
    }
    return;
  }

  // 8. Image thumbnail lightbox click
  const thumb = target.closest('.chat-msg-image-thumb');
  if (thumb) {
    e.stopPropagation();
    const row = thumb.closest('.chat-msg-row');
    const msgId = row?.getAttribute('data-msg-id');
    const msg = appState?.chatMessages?.find(m => m.id === msgId);
    const cap = (msg && msg.caption) || ((msg && msg.text !== 'Shared a photo 📷') ? msg.text : '');
    openChatImageLightbox(thumb.src, cap);
    return;
  }

  // 9. Call back button
  const callBackBtn = target.closest('.chat-call-back-btn');
  if (callBackBtn) {
    e.stopPropagation();
    const ct = callBackBtn.getAttribute('data-call-type');
    if (ct === 'video') startVideoCall('video');
    else startAudioCall();
    return;
  }

  // 10. Links inside messages (<a href="...">)
  if (target.closest('a')) {
    return;
  }

  // 11. Tap on row reveals quick action buttons (Reply & Edit)
  const row = target.closest('.chat-msg-row');
  if (row) {
    row.classList.add('show-reply-btn');
    setTimeout(() => {
      row.classList.remove('show-reply-btn');
    }, 3500);
  }
}

function handleChatListDblClick(e) {
  const bubble = e.target.closest('.chat-msg-bubble');
  if (!bubble) return;
  const row = bubble.closest('.chat-msg-row');
  if (!row) return;

  handleChatBubbleDoubleTap(row);
}

function handleChatListContextMenu(e) {
  const row = e.target.closest('.chat-msg-row');
  if (!row) return;

  e.preventDefault();
  const msgId = row.getAttribute('data-msg-id');
  const msg = appState?.chatMessages?.find(m => m.id === msgId);
  if (msg) openChatContextMenu(msg, row);
}

// --- Photo Lightbox Modal ---
function openChatImageLightbox(src, caption) {
  openPhotoLightbox(src, 'Shared Photo 📸', caption, 'Couple Chat');
}

function closeChatImageLightbox() {
  closePhotoLightbox();
}

// Global active reply target & search state
let activeReplyTarget = null;
let currentChatSearchMatches = [];
let currentChatSearchIndex = -1;

function setupChatUI() {
  const sendBtn = document.getElementById('chatSendBtn');
  const inputField = document.getElementById('chatTextInput');
  const heartBtn = document.getElementById('chatQuickHeartBtn');
  const burstBtn = document.getElementById('chatLoveBurstBtn');
  const chipsContainer = document.getElementById('chatQuickChips');
  const actionIcon = document.getElementById('chatActionIcon');

  // Mobile Back Button -> Switches back to Vault
  const backBtn = document.getElementById('chatBackBtn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      switchTab('paneVault');
    });
  }

  // Header Call Action Buttons
  const audioCallBtn = document.getElementById('chatStartAudioBtn');
  const vcCallBtn = document.getElementById('chatStartVcBtn');

  if (audioCallBtn) {
    audioCallBtn.addEventListener('click', () => {
      playTone(600, 0.1);
      startAudioCall();
    });
  }

  if (vcCallBtn) {
    vcCallBtn.addEventListener('click', () => {
      playTone(600, 0.1);
      startVideoCall('video');
    });
  }

  // WhatsApp Three-Dots Dropdown Menu
  const threeDotsBtn = document.getElementById('chatThreeDotsBtn');
  const menuDropdown = document.getElementById('chatMenuDropdown');
  if (threeDotsBtn && menuDropdown) {
    threeDotsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      menuDropdown.classList.toggle('is-hidden');
    });

    document.addEventListener('click', (e) => {
      if (!menuDropdown.contains(e.target) && e.target !== threeDotsBtn) {
        menuDropdown.classList.add('is-hidden');
      }
    });
  }

  // Menu Action: Search
  const menuSearchBtn = document.getElementById('chatMenuSearchBtn');
  const searchBar = document.getElementById('chatSearchBar');
  const searchInput = document.getElementById('chatSearchInput');
  const searchCloseBtn = document.getElementById('chatSearchCloseBtn');
  const searchClearBtn = document.getElementById('chatSearchClearBtn');
  const searchPrevBtn = document.getElementById('chatSearchPrevBtn');
  const searchNextBtn = document.getElementById('chatSearchNextBtn');

  if (menuSearchBtn && searchBar) {
    menuSearchBtn.addEventListener('click', () => {
      if (menuDropdown) menuDropdown.classList.add('is-hidden');
      searchBar.classList.remove('is-hidden');
      if (searchInput) {
        searchInput.focus();
        if (searchInput.value.trim()) executeChatSearch(searchInput.value.trim());
      }
    });
  }

  if (searchCloseBtn && searchBar) {
    searchCloseBtn.addEventListener('click', () => {
      searchBar.classList.add('is-hidden');
      clearChatSearchHighlights();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.trim();
      if (searchClearBtn) searchClearBtn.classList.toggle('is-hidden', !q);
      executeChatSearch(q);
    });
  }

  if (searchClearBtn && searchInput) {
    searchClearBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchClearBtn.classList.add('is-hidden');
      executeChatSearch('');
      searchInput.focus();
    });
  }

  if (searchPrevBtn) {
    searchPrevBtn.addEventListener('click', () => navigateChatSearch(-1));
  }
  if (searchNextBtn) {
    searchNextBtn.addEventListener('click', () => navigateChatSearch(1));
  }

  // Menu Action: Media, links, and docs
  const menuMediaBtn = document.getElementById('chatMenuMediaBtn');
  if (menuMediaBtn) {
    menuMediaBtn.addEventListener('click', () => {
      if (menuDropdown) menuDropdown.classList.add('is-hidden');
      openMediaDocsModal();
    });
  }

  const mediaModalCloseBtn = document.getElementById('chatMediaModalCloseBtn');
  const mediaDocsModal = document.getElementById('chatMediaDocsModal');
  if (mediaModalCloseBtn && mediaDocsModal) {
    mediaModalCloseBtn.addEventListener('click', () => {
      mediaDocsModal.classList.add('is-hidden');
    });
  }

  // Media Modal Tab Switchers
  const mediaTabBtns = document.querySelectorAll('.chat-media-tab-btn');
  mediaTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      switchMediaDocsTab(tab);
    });
  });

  // Menu Action: Mute / Unmute Notifications
  const menuMuteBtn = document.getElementById('chatMenuMuteBtn');
  if (menuMuteBtn) {
    menuMuteBtn.addEventListener('click', () => {
      if (menuDropdown) menuDropdown.classList.add('is-hidden');
      toggleChatMute();
    });
  }

  // Menu Action: Pin Message
  const menuPinBtn = document.getElementById('chatMenuPinBtn');
  if (menuPinBtn) {
    menuPinBtn.addEventListener('click', () => {
      if (menuDropdown) menuDropdown.classList.add('is-hidden');
      promptPinChatMessage();
    });
  }

  // Pinned Banner close button
  const pinnedCloseBtn = document.getElementById('chatPinnedCloseBtn');
  const pinnedBanner = document.getElementById('chatPinnedBanner');
  if (pinnedCloseBtn) {
    pinnedCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      unpinChatMessage();
    });
  }
  if (pinnedBanner) {
    pinnedBanner.addEventListener('click', () => {
      if (appState && appState.pinnedChatMessage && appState.pinnedChatMessage.id) {
        scrollToChatMessage(appState.pinnedChatMessage.id);
      }
    });
  }

  // Menu Action: Clear Chat
  const menuClearBtn = document.getElementById('chatMenuClearBtn');
  if (menuClearBtn) {
    menuClearBtn.addEventListener('click', () => {
      if (menuDropdown) menuDropdown.classList.add('is-hidden');
      const ok = confirm('Kya aap chat history clear karna chahte hain?');
      if (ok) {
        if (!appState) appState = JSON.parse(JSON.stringify(DEFAULT_APP_STATE));
        appState.chatMessages = [];
        saveAppState(appState);
        broadcastUpdate('CHAT_CLEAR', {}, true);
        renderChatUI();
        showToast('Chat history cleared 🗑️');
      }
    });
  }

  // Menu Action: Reload & Update App (Instant PWA Cache Purge)
  const menuRefreshBtn = document.getElementById('chatMenuRefreshBtn');
  if (menuRefreshBtn) {
    menuRefreshBtn.addEventListener('click', async () => {
      if (menuDropdown) menuDropdown.classList.add('is-hidden');
      showVcToast('Updating app... 🔄');
      try {
        if ('caches' in window) {
          const keys = await caches.keys();
          await Promise.all(keys.map(k => caches.delete(k)));
        }
        if ('serviceWorker' in navigator) {
          const regs = await navigator.serviceWorker.getRegistrations();
          for (const reg of regs) {
            await reg.unregister();
          }
        }
      } catch (e) {}
      setTimeout(() => {
        window.location.reload(true);
      }, 350);
    });
  }

  // Menu Action: Starred Messages
  const menuStarredBtn = document.getElementById('chatMenuStarredBtn');
  if (menuStarredBtn) {
    menuStarredBtn.addEventListener('click', () => {
      if (menuDropdown) menuDropdown.classList.add('is-hidden');
      openStarredMessagesModal();
    });
  }

  // Menu Action: Disappearing Messages
  const menuDisappearingBtn = document.getElementById('chatMenuDisappearingBtn');
  if (menuDisappearingBtn) {
    menuDisappearingBtn.addEventListener('click', () => {
      if (menuDropdown) menuDropdown.classList.add('is-hidden');
      openDisappearingModal();
    });
  }

  // Reply preview bar close button
  const replyCloseBtn = document.getElementById('chatReplyCloseBtn');
  if (replyCloseBtn) {
    replyCloseBtn.addEventListener('click', () => {
      clearReplyTarget();
    });
  }

  // WhatsApp Emoji Picker Drawer Toggle & Tab Switchers
  const emojiToggleBtn = document.getElementById('chatEmojiToggleBtn');
  if (emojiToggleBtn) {
    emojiToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleEmojiDrawer();
    });
  }

  document.querySelectorAll('.emoji-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.emoji-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-cat') || 'smileys';
      populateEmojiGrid(cat);
    });
  });

  // Direct Camera Button
  const directCamBtn = document.getElementById('chatDirectCameraBtn');
  const fileInputCam = document.getElementById('chatImageInputCamera');
  if (directCamBtn && fileInputCam) {
    directCamBtn.addEventListener('click', () => {
      fileInputCam.click();
    });
  }

  // WhatsApp Attachment Popup Sheet & Inputs
  const attachBtn = document.getElementById('chatAttachBtn');
  const attachMenu = document.getElementById('chatAttachMenu');
  const fileInput = document.getElementById('chatImageInput');
  const fileInputGal = document.getElementById('chatImageInputGallery');
  const fileInputDoc = document.getElementById('chatDocInput');
  const fileInputAud = document.getElementById('chatAudioInput');
  const previewRemoveBtn = document.getElementById('chatPreviewRemoveBtn');
  const previewSendBtn = document.getElementById('chatImageSendBtn');
  const previewTray = document.getElementById('chatImagePreviewTray');

  const onChatFileSelected = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFileSelected(e.target.files[0]);
    }
  };

  if (fileInput) fileInput.addEventListener('change', onChatFileSelected);
  if (fileInputCam) fileInputCam.addEventListener('change', onChatFileSelected);
  if (fileInputGal) fileInputGal.addEventListener('change', onChatFileSelected);

  if (fileInputDoc) {
    fileInputDoc.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleDocFileSelected(e.target.files[0]);
        e.target.value = '';
      }
    });
  }

  if (fileInputAud) {
    fileInputAud.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleAudioFileSelected(e.target.files[0]);
        e.target.value = '';
      }
    });
  }

  if (attachBtn) {
    attachBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleAttachMenu();
    });
  }

  const attachCameraBtn = document.getElementById('attachCameraBtn');
  const attachGalleryBtn = document.getElementById('attachGalleryBtn');
  const attachDocumentBtn = document.getElementById('attachDocumentBtn');
  const attachLocationBtn = document.getElementById('attachLocationBtn');
  const attachAudioBtn = document.getElementById('attachAudioBtn');

  if (attachCameraBtn && fileInputCam) {
    attachCameraBtn.addEventListener('click', () => {
      if (attachMenu) attachMenu.classList.add('is-hidden');
      fileInputCam.click();
    });
  }
  if (attachGalleryBtn && fileInputGal) {
    attachGalleryBtn.addEventListener('click', () => {
      if (attachMenu) attachMenu.classList.add('is-hidden');
      fileInputGal.click();
    });
  }
  if (attachDocumentBtn && fileInputDoc) {
    attachDocumentBtn.addEventListener('click', () => {
      if (attachMenu) attachMenu.classList.add('is-hidden');
      fileInputDoc.click();
    });
  }
  if (attachLocationBtn) {
    attachLocationBtn.addEventListener('click', () => {
      if (attachMenu) attachMenu.classList.add('is-hidden');
      shareLocationInChat();
    });
  }
  if (attachAudioBtn && fileInputAud) {
    attachAudioBtn.addEventListener('click', () => {
      if (attachMenu) attachMenu.classList.add('is-hidden');
      fileInputAud.click();
    });
  }

  // Floating Scroll to Bottom Button
  const scrollBottomBtn = document.getElementById('chatScrollBottomBtn');
  const chatList = document.getElementById('chatMessagesList');
  if (scrollBottomBtn && chatList) {
    scrollBottomBtn.addEventListener('click', () => {
      chatList.scrollTo({ top: chatList.scrollHeight, behavior: 'smooth' });
      clearScrollUnreadBadge();
      scrollBottomBtn.classList.add('is-hidden');
    });
    chatList.addEventListener('scroll', () => {
      updateScrollBottomButtonVisibility();
      handleChatPaginationScroll();
    }, { passive: true });

    // Delegated Container-Level Listeners for All Chat Rows (Click, DblClick, ContextMenu, Touch Gestures)
    if (!chatList._delegatedListenersAttached) {
      chatList._delegatedListenersAttached = true;
      chatList.addEventListener('click', handleChatListClick);
      chatList.addEventListener('dblclick', handleChatListDblClick);
      chatList.addEventListener('contextmenu', handleChatListContextMenu);
      chatList.addEventListener('touchstart', handleChatTouchStart, { passive: true });
      chatList.addEventListener('touchmove', handleChatTouchMove, { passive: true });
      chatList.addEventListener('touchend', handleChatTouchEnd);
      chatList.addEventListener('touchcancel', handleChatTouchCancel);
    }
  }

  // Context Menu Overlay & Actions
  const contextOverlay = document.getElementById('chatContextOverlay');
  if (contextOverlay) {
    contextOverlay.addEventListener('click', (e) => {
      if (e.target === contextOverlay) closeChatContextMenu();
    });
  }

  document.querySelectorAll('.context-react-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!activeContextMenuMsg) return;
      const emoji = btn.getAttribute('data-emoji');
      if (emoji) {
        toggleMessageReaction(activeContextMenuMsg.id, emoji);
      } else if (btn.id === 'contextMoreEmojiBtn') {
        const custom = prompt('Koi bhi emoji chunein:', '💖');
        if (custom && custom.trim()) {
          toggleMessageReaction(activeContextMenuMsg.id, custom.trim());
        }
      }
      closeChatContextMenu();
    });
  });

  const ctxReplyBtn = document.getElementById('contextReplyBtn');
  const ctxCopyBtn = document.getElementById('contextCopyBtn');
  const ctxStarBtn = document.getElementById('contextStarBtn');
  const ctxEditBtn = document.getElementById('contextEditBtn');
  const ctxPinBtn = document.getElementById('contextPinBtn');
  const ctxDeleteBtn = document.getElementById('contextDeleteBtn');

  if (ctxReplyBtn) {
    ctxReplyBtn.addEventListener('click', () => {
      if (activeContextMenuMsg) setReplyTarget(activeContextMenuMsg);
      closeChatContextMenu();
    });
  }

  if (ctxCopyBtn) {
    ctxCopyBtn.addEventListener('click', () => {
      if (activeContextMenuMsg && activeContextMenuMsg.text) {
        navigator.clipboard.writeText(activeContextMenuMsg.text).then(() => {
          showToast('Message copied 📋');
        }).catch(() => {
          showToast('Text copied');
        });
      }
      closeChatContextMenu();
    });
  }

  if (ctxStarBtn) {
    ctxStarBtn.addEventListener('click', () => {
      if (activeContextMenuMsg) toggleStarMessage(activeContextMenuMsg.id);
      closeChatContextMenu();
    });
  }

  if (ctxEditBtn) {
    ctxEditBtn.addEventListener('click', () => {
      const target = activeContextMenuMsg;
      closeChatContextMenu();
      if (target) openEditMessageModal(target);
    });
  }

  if (ctxPinBtn) {
    ctxPinBtn.addEventListener('click', () => {
      if (activeContextMenuMsg && activeContextMenuMsg.text) {
        pinChatMessage(activeContextMenuMsg.text, activeContextMenuMsg.id);
      }
      closeChatContextMenu();
    });
  }

  if (ctxDeleteBtn) {
    ctxDeleteBtn.addEventListener('click', () => {
      if (activeContextMenuMsg) openDeleteMessageModal(activeContextMenuMsg);
    });
  }

  // Edit Modal Buttons
  const editCancelBtn = document.getElementById('chatEditCancelBtn');
  const editSaveBtn = document.getElementById('chatEditSaveBtn');
  if (editCancelBtn) editCancelBtn.addEventListener('click', closeEditMessageModal);
  if (editSaveBtn) editSaveBtn.addEventListener('click', saveEditedMessage);

  // Delete Modal Buttons
  const delEveryoneBtn = document.getElementById('deleteForEveryoneBtn');
  const delForMeBtn = document.getElementById('deleteForMeBtn');
  const delCancelBtn = document.getElementById('deleteCancelBtn');
  if (delEveryoneBtn) delEveryoneBtn.addEventListener('click', deleteMessageForEveryone);
  if (delForMeBtn) delForMeBtn.addEventListener('click', deleteMessageForMe);
  if (delCancelBtn) delCancelBtn.addEventListener('click', closeDeleteMessageModal);

  // Starred Modal Close
  const starCloseBtn = document.getElementById('chatStarredCloseBtn');
  if (starCloseBtn) starCloseBtn.addEventListener('click', closeStarredMessagesModal);

  // Disappearing Modal Done
  const disDoneBtn = document.getElementById('disappearingDoneBtn');
  if (disDoneBtn) disDoneBtn.addEventListener('click', saveDisappearingConfig);

  // Global Outside Click Listener for Attach and Emoji Drawers
  document.addEventListener('click', (e) => {
    const attachPopup = document.getElementById('chatAttachMenu');
    const attachTrigger = document.getElementById('chatAttachBtn');
    if (attachPopup && !attachPopup.contains(e.target) && e.target !== attachTrigger && !attachTrigger?.contains(e.target)) {
      attachPopup.classList.add('is-hidden');
    }
    const emojiDrawer = document.getElementById('chatEmojiDrawer');
    const emojiTrigger = document.getElementById('chatEmojiToggleBtn');
    if (emojiDrawer && !emojiDrawer.contains(e.target) && e.target !== emojiTrigger && !emojiTrigger?.contains(e.target)) {
      emojiDrawer.classList.add('is-hidden');
    }
  });

  if (previewRemoveBtn) {
    previewRemoveBtn.addEventListener('click', () => {
      if (previewTray) previewTray.classList.add('is-hidden');
      const previewImg = document.getElementById('chatPreviewImage');
      if (previewImg) previewImg.src = '';
      if (fileInput) fileInput.value = '';
    });
  }

  if (previewSendBtn) {
    previewSendBtn.addEventListener('click', sendSelectedChatImage);
  }

  // Voice Note Recording Controls
  const voiceNoteBtn = document.getElementById('chatVoiceNoteBtn');
  const voiceRecCancelBtn = document.getElementById('voiceRecCancelBtn');
  const voiceRecSendBtn = document.getElementById('voiceRecSendBtn');

  if (voiceNoteBtn) {
    voiceNoteBtn.addEventListener('click', () => {
      const bar = document.getElementById('chatVoiceRecordBar');
      if (bar && !bar.classList.contains('is-hidden')) {
        finishAndSendVoiceRecording();
      } else {
        startVoiceRecording();
      }
    });
  }

  if (voiceRecCancelBtn) {
    voiceRecCancelBtn.addEventListener('click', cancelVoiceRecording);
  }

  if (voiceRecSendBtn) {
    voiceRecSendBtn.addEventListener('click', finishAndSendVoiceRecording);
  }

  // Text Messaging Controls, Dynamic Mic vs Send Icon, & Typing Detection
  const updateSendButtonMode = () => {
    if (!actionIcon) return;
    const hasText = inputField && inputField.value.trim().length > 0;
    if (hasText) {
      actionIcon.innerHTML = `
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
        </svg>
      `;
      actionIcon.classList.remove('mic-mode');
      actionIcon.classList.add('send-mode');
      if (sendBtn) sendBtn.title = 'Send Message';
    } else {
      actionIcon.innerHTML = `
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
        </svg>
      `;
      actionIcon.classList.remove('send-mode');
      actionIcon.classList.add('mic-mode');
      if (sendBtn) sendBtn.title = 'Voice note (Tap to record)';
    }
  };

  if (sendBtn && inputField) {
    sendBtn.addEventListener('click', () => {
      const text = inputField.value.trim();
      if (text) {
        sendChatMessage(text, 'text');
        inputField.value = '';
        inputField.style.height = 'auto';
        updateSendButtonMode();
        inputField.focus();
      } else {
        // Empty text -> Voice note toggle
        const bar = document.getElementById('chatVoiceRecordBar');
        if (bar && !bar.classList.contains('is-hidden')) {
          finishAndSendVoiceRecording();
        } else {
          startVoiceRecording();
        }
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
          updateSendButtonMode();
        }
      }
    });

    let lastTypingBroadcastTime = 0;
    inputField.addEventListener('input', () => {
      inputField.style.height = 'auto';
      inputField.style.height = Math.min(inputField.scrollHeight, 100) + 'px';
      updateSendButtonMode();

      const now = Date.now();
      if (now - lastTypingBroadcastTime > 3000) {
        lastTypingBroadcastTime = now;
        broadcastMyTypingStatus(true);
      }
      clearTimeout(typingDebounceTimer);
      typingDebounceTimer = setTimeout(() => {
        lastTypingBroadcastTime = 0;
        broadcastMyTypingStatus(false);
      }, 2500);
    });

    inputField.addEventListener('blur', () => {
      clearTimeout(typingDebounceTimer);
      lastTypingBroadcastTime = 0;
      broadcastMyTypingStatus(false);
    });

    inputField.addEventListener('focus', () => {
      setTimeout(() => {
        const listEl = document.getElementById('chatMessagesList');
        if (listEl) listEl.scrollTop = listEl.scrollHeight;
      }, 200);
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

function setReplyTarget(msg) {
  if (!msg) return;
  activeReplyTarget = msg;
  const replyBar = document.getElementById('chatReplyPreviewBar');
  const authorEl = document.getElementById('replyPreviewAuthor');
  const textEl = document.getElementById('replyPreviewText');
  const inputEl = document.getElementById('chatTextInput');

  if (replyBar && authorEl && textEl) {
    const isMe = msg.sender === currentUser;
    authorEl.textContent = isMe ? 'You' : (msg.senderName || (currentUser === 'himanshu' ? 'Gullu' : 'Himanshu'));
    authorEl.style.color = isMe ? '#25d366' : '#53bdeb';
    const borderEl = replyBar.querySelector('.reply-preview-border');
    if (borderEl) {
      borderEl.style.background = isMe ? '#25d366' : '#53bdeb';
    }
    let preview = msg.text || '';
    if (msg.type === 'image') preview = msg.caption ? ('📷 ' + msg.caption) : '📷 Photo';
    else if (msg.type === 'audio') preview = '🎙️ Voice note';
    else if (msg.type === 'call') preview = '📞 Call log';
    textEl.textContent = preview;
    replyBar.classList.remove('is-hidden');
  }

  if (inputEl) {
    inputEl.focus();
    inputEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function clearReplyTarget() {
  activeReplyTarget = null;
  const replyBar = document.getElementById('chatReplyPreviewBar');
  if (replyBar) replyBar.classList.add('is-hidden');
}

const CHAT_PAGE_SIZE = 30;
let renderedChatMessagesCount = 30;
let isLoadingOlderChatMessages = false;

function scrollToChatMessage(msgId) {
  if (!msgId) return;
  const listEl = document.getElementById('chatMessagesList');
  let targetRow = listEl ? listEl.querySelector(`[data-msg-id="${msgId}"]`) : null;

  if (!targetRow) {
    // Message is older and not currently rendered in DOM due to pagination
    let rawMsgs = normalizeArray(appState?.chatMessages || appState?.chat_messages);
    rawMsgs = rawMsgs.filter(m => !(m && m.hiddenFor && m.hiddenFor.includes(currentUser)));
    const msgs = sortChatMessagesAscending(rawMsgs);
    const targetIdx = msgs.findIndex(m => m && m.id === msgId);

    if (targetIdx !== -1) {
      // Load enough messages from the end to include this message plus a 10-message buffer
      const neededCount = (msgs.length - targetIdx) + 10;
      renderedChatMessagesCount = Math.max(renderedChatMessagesCount, neededCount);
      renderChatUI(true);
      targetRow = listEl ? listEl.querySelector(`[data-msg-id="${msgId}"]`) : null;
    }
  }

  if (targetRow) {
    targetRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
    targetRow.classList.add('msg-highlight-flash');
    setTimeout(() => targetRow.classList.remove('msg-highlight-flash'), 1500);
  }
}

let activeContextMenuMsg = null;
let scrollUnreadCount = 0;

// WhatsApp Message Tick Helpers (Single Grey Tick -> Double Grey Tick -> Double Blue Tick)
function getMessageStatus(msg) {
  if (msg && msg.status) return msg.status;
  // For older historical messages with no status, if older than 2 minutes, treat as read
  if (msg && msg.timestamp && (Date.now() - msg.timestamp > 120000)) {
    return 'read';
  }
  return 'sent';
}

function renderChatTicksHtml(msg, isMe) {
  if (!isMe) return '';
  const status = getMessageStatus(msg);
  if (status === 'read') {
    return `<span class="chat-msg-ticks tick-read" data-msg-id="${msg.id}" title="Read (Seen)">✓✓</span>`;
  } else if (status === 'delivered') {
    return `<span class="chat-msg-ticks tick-delivered" data-msg-id="${msg.id}" title="Delivered">✓✓</span>`;
  } else {
    return `<span class="chat-msg-ticks tick-sent" data-msg-id="${msg.id}" title="Sent">✓</span>`;
  }
}

function updateMessageTickDOM(msgId, newStatus) {
  const tickEl = document.querySelector(`.chat-msg-ticks[data-msg-id="${msgId}"]`);
  if (!tickEl) return;
  if (newStatus === 'read') {
    tickEl.className = 'chat-msg-ticks tick-read';
    tickEl.textContent = '✓✓';
    tickEl.title = 'Read (Seen)';
  } else if (newStatus === 'delivered' && !tickEl.classList.contains('tick-read')) {
    tickEl.className = 'chat-msg-ticks tick-delivered';
    tickEl.textContent = '✓✓';
    tickEl.title = 'Delivered';
  }
}

function updateMessageReactionDOM(msgId, reaction) {
  const row = document.querySelector(`.chat-msg-row[data-msg-id="${msgId}"]`);
  if (!row) return;
  const bubble = row.querySelector('.chat-msg-bubble');
  if (!bubble) return;
  let chip = row.querySelector('.chat-reaction-chip');
  if (reaction) {
    if (!chip) {
      chip = document.createElement('span');
      chip.className = 'chat-reaction-chip';
      chip.setAttribute('data-msg-id', msgId);
      bubble.appendChild(chip);
    }
    chip.textContent = reaction;
  } else if (chip) {
    chip.remove();
  }
}

function updateMessageEditDOM(msgId, newText, editedAt) {
  const row = document.querySelector(`.chat-msg-row[data-msg-id="${msgId}"]`);
  if (!row) return;
  const textEl = row.querySelector('.chat-msg-text');
  if (textEl) textEl.innerHTML = linkifyChatText(newText);
  const footer = row.querySelector('.chat-msg-footer');
  if (footer && !footer.querySelector('.chat-msg-edited-tag')) {
    const timeEl = footer.querySelector('.chat-msg-time');
    const editTag = document.createElement('span');
    editTag.className = 'chat-msg-edited-tag';
    editTag.textContent = 'edited';
    if (timeEl) footer.insertBefore(editTag, timeEl);
    else footer.appendChild(editTag);
  }
}

function updateMessageDeletedDOM(msgId) {
  const row = document.querySelector(`.chat-msg-row[data-msg-id="${msgId}"]`);
  if (!row) return;
  const bubble = row.querySelector('.chat-msg-bubble');
  if (bubble) {
    bubble.className = 'chat-msg-bubble chat-deleted-bubble';
    const timeStr = row.getAttribute('data-timestamp') ? formatChatTime(Number(row.getAttribute('data-timestamp'))) : '';
    bubble.innerHTML = `
      <p class="chat-msg-text deleted-msg"><em>🚫 This message was deleted</em></p>
      <div class="chat-msg-footer">
        <span class="chat-msg-time">${timeStr}</span>
      </div>
    `;
  }
}

function updateMessageStarDOM(msgId, isStarred) {
  const row = document.querySelector(`.chat-msg-row[data-msg-id="${msgId}"]`);
  if (!row) return;
  const footer = row.querySelector('.chat-msg-footer');
  if (!footer) return;
  const starEl = footer.querySelector('.chat-msg-star-badge');
  if (isStarred && !starEl) {
    const newStar = document.createElement('span');
    newStar.className = 'chat-msg-star-badge';
    newStar.title = 'Starred';
    newStar.textContent = '⭐';
    footer.insertBefore(newStar, footer.firstChild);
  } else if (!isStarred && starEl) {
    starEl.remove();
  }
}

function handleIncomingChatReceipt(data, targetStatus) {
  if (!data || !appState || !appState.chatMessages) return;
  const msgIds = data.msgIds || (data.msgId ? [data.msgId] : []);
  if (!msgIds.length) return;

  let stateChanged = false;
  msgIds.forEach(id => {
    const msg = appState.chatMessages.find(m => m.id === id);
    if (msg) {
      if (targetStatus === 'read') {
        if (msg.status !== 'read') {
          msg.status = 'read';
          msg.readAt = data.readAt || Date.now();
          stateChanged = true;
          updateMessageTickDOM(id, 'read');
        }
      } else if (targetStatus === 'delivered') {
        if (!msg.status || msg.status === 'sent') {
          msg.status = 'delivered';
          msg.deliveredAt = data.deliveredAt || Date.now();
          stateChanged = true;
          updateMessageTickDOM(id, 'delivered');
        }
      }
    }
  });

  if (stateChanged) {
    saveAppState(appState);
  }
}

function markIncomingChatMessagesAsRead() {
  if (!appState || !appState.chatMessages) return;
  const unreadMsgIds = [];
  const now = Date.now();

  appState.chatMessages.forEach(m => {
    if (m && m.sender !== currentUser && m.status !== 'read') {
      m.status = 'read';
      m.readAt = now;
      unreadMsgIds.push(m.id);
    }
  });

  if (unreadMsgIds.length > 0) {
    saveAppState(appState);
    broadcastUpdate('CHAT_RECEIPT_READ', {
      msgIds: unreadMsgIds,
      readBy: currentUser,
      readAt: now
    }, false);
  }
}

function updateScrollBottomButtonVisibility() {
  const btn = document.getElementById('chatScrollBottomBtn');
  const listEl = document.getElementById('chatMessagesList');
  if (!btn || !listEl) return;

  const distance = listEl.scrollHeight - listEl.scrollTop - listEl.clientHeight;
  if (distance > 140) {
    btn.classList.remove('is-hidden');
  } else {
    btn.classList.add('is-hidden');
    clearScrollUnreadBadge();
  }
}

function incrementScrollUnreadBadge() {
  scrollUnreadCount++;
  const badge = document.getElementById('chatScrollUnreadBadge');
  if (badge) {
    badge.textContent = scrollUnreadCount;
    badge.classList.remove('is-hidden');
  }
}

function clearScrollUnreadBadge() {
  scrollUnreadCount = 0;
  const badge = document.getElementById('chatScrollUnreadBadge');
  if (badge) {
    badge.textContent = '0';
    badge.classList.add('is-hidden');
  }
}

function handleChatPaginationScroll() {
  const listEl = document.getElementById('chatMessagesList');
  if (!listEl || isLoadingOlderChatMessages) return;

  // Trigger when scrolled near the top (within 80px)
  if (listEl.scrollTop <= 80) {
    let rawMsgs = normalizeArray(appState?.chatMessages || appState?.chat_messages);
    rawMsgs = rawMsgs.filter(m => !(m && m.hiddenFor && m.hiddenFor.includes(currentUser)));

    if (rawMsgs.length > renderedChatMessagesCount) {
      loadOlderChatMessages();
    }
  }
}

function loadOlderChatMessages() {
  if (isLoadingOlderChatMessages) return;
  isLoadingOlderChatMessages = true;

  const listEl = document.getElementById('chatMessagesList');
  const loader = document.getElementById('chatPaginationLoader');
  if (loader) loader.classList.remove('is-hidden');

  // Smooth micro-delay (100ms) for small spinner feedback
  setTimeout(() => {
    if (!listEl) {
      isLoadingOlderChatMessages = false;
      if (loader) loader.classList.add('is-hidden');
      return;
    }

    const oldScrollHeight = listEl.scrollHeight;
    const oldScrollTop = listEl.scrollTop;

    renderedChatMessagesCount += CHAT_PAGE_SIZE;
    renderChatUI(true);

    const newScrollHeight = listEl.scrollHeight;
    listEl.style.scrollBehavior = 'auto';
    listEl.scrollTop = oldScrollTop + (newScrollHeight - oldScrollHeight);
    requestAnimationFrame(() => {
      listEl.style.scrollBehavior = '';
    });

    if (loader) loader.classList.add('is-hidden');
    isLoadingOlderChatMessages = false;
  }, 100);
}

function pruneDisappearingMessages() {
  if (!appState || !appState.chatMessages || !appState.disappearingTimer) return;
  const cutoff = Date.now() - appState.disappearingTimer;
  appState.chatMessages = appState.chatMessages.filter(m => {
    return !m.timestamp || (m.timestamp >= cutoff);
  });
  saveAppState(appState);
}

function openChatContextMenu(msg, rowEl) {
  if (!msg) return;
  activeContextMenuMsg = msg;
  const overlay = document.getElementById('chatContextOverlay');
  const starLabel = document.getElementById('contextStarLabel');
  const editBtn = document.getElementById('contextEditBtn');
  const copyBtn = document.getElementById('contextCopyBtn');

  if (starLabel) {
    starLabel.textContent = msg.starred ? 'Unstar' : 'Star';
  }

  const replyBtn = document.getElementById('contextReplyBtn');
  if (replyBtn) {
    replyBtn.style.display = (!msg.deleted) ? 'flex' : 'none';
  }

  // Edit message: allowed for any text message sent by me (not deleted)
  const isMe = msg.sender === currentUser;
  const isTextMsg = msg.type === 'text' || !msg.type;
  if (editBtn) {
    editBtn.style.display = (isMe && isTextMsg && !msg.deleted) ? 'flex' : 'none';
  }

  if (copyBtn) {
    copyBtn.style.display = (msg.text && !msg.deleted) ? 'flex' : 'none';
  }

  if (overlay) {
    overlay.classList.remove('is-hidden');
  }
}

function closeChatContextMenu() {
  const overlay = document.getElementById('chatContextOverlay');
  if (overlay) overlay.classList.add('is-hidden');
  activeContextMenuMsg = null;
}

function openEditMessageModal(msg) {
  if (!msg) return;
  activeContextMenuMsg = msg;
  const modal = document.getElementById('chatEditModal');
  const textarea = document.getElementById('chatEditTextInput');
  if (textarea) {
    textarea.value = msg.text || '';
  }
  if (modal) modal.classList.remove('is-hidden');
  if (textarea) {
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    }, 60);
  }
}

function closeEditMessageModal() {
  const modal = document.getElementById('chatEditModal');
  if (modal) modal.classList.add('is-hidden');
}

function saveEditedMessage() {
  if (!activeContextMenuMsg) return;
  const textarea = document.getElementById('chatEditTextInput');
  const newText = textarea ? textarea.value.trim() : '';
  if (!newText) {
    showToast('Message empty nahi ho sakta');
    return;
  }

  const msgId = activeContextMenuMsg.id;
  const msg = appState.chatMessages.find(m => m.id === msgId);
  if (msg) {
    msg.text = newText;
    msg.edited = true;
    msg.editedAt = Date.now();
    saveAppState(appState);
    broadcastUpdate('CHAT_EDIT', {
      msgId: msg.id,
      newText: msg.text,
      editedAt: msg.editedAt
    }, true);
    updateMessageEditDOM(msg.id, msg.text, msg.editedAt);
    showToast('Message edited ✏️');
  }
  closeEditMessageModal();
  closeChatContextMenu();
}

function handleIncomingChatEdit(data) {
  if (!data || !data.msgId || !appState || !appState.chatMessages) return;
  const msg = appState.chatMessages.find(m => m.id === data.msgId);
  if (msg) {
    msg.text = data.newText;
    msg.edited = true;
    msg.editedAt = data.editedAt || Date.now();
    saveAppState(appState);
    updateMessageEditDOM(data.msgId, data.newText, data.editedAt);
  }
}

function openDeleteMessageModal(msg) {
  if (!msg) return;
  const modal = document.getElementById('chatDeleteModal');
  const deleteForEveryoneBtn = document.getElementById('deleteForEveryoneBtn');
  const desc = document.getElementById('chatDeleteDesc');

  const isMe = msg.sender === currentUser;
  if (deleteForEveryoneBtn) {
    deleteForEveryoneBtn.style.display = isMe ? 'block' : 'none';
  }
  if (desc) {
    desc.textContent = isMe
      ? 'Kya aap sabhi ke liye ya sirf apne liye delete karna chahte hain?'
      : 'Is message ko apne chat se delete karna chahte hain?';
  }

  if (modal) modal.classList.remove('is-hidden');
}

function closeDeleteMessageModal() {
  const modal = document.getElementById('chatDeleteModal');
  if (modal) modal.classList.add('is-hidden');
}

function deleteMessageForEveryone() {
  if (!activeContextMenuMsg) return;
  const msgId = activeContextMenuMsg.id;
  const msg = appState.chatMessages.find(m => m.id === msgId);
  if (msg) {
    msg.deleted = true;
    msg.text = 'This message was deleted';
    msg.deletedAt = Date.now();
    saveAppState(appState);
    broadcastUpdate('CHAT_DELETE', { msgId: msg.id, deletedAt: msg.deletedAt }, true);
    updateMessageDeletedDOM(msg.id);
    showToast('Message deleted for everyone 🗑️');
  }
  closeDeleteMessageModal();
  closeChatContextMenu();
}

function deleteMessageForMe() {
  if (!activeContextMenuMsg) return;
  const msgId = activeContextMenuMsg.id;
  const msg = appState.chatMessages.find(m => m.id === msgId);
  if (msg) {
    if (!msg.hiddenFor) msg.hiddenFor = [];
    if (!msg.hiddenFor.includes(currentUser)) msg.hiddenFor.push(currentUser);
    saveAppState(appState);
    const row = document.querySelector(`.chat-msg-row[data-msg-id="${msgId}"]`);
    if (row) row.remove();
    showToast('Message deleted for you 🗑️');
  }
  closeDeleteMessageModal();
  closeChatContextMenu();
}

function handleIncomingChatDelete(data) {
  if (!data || !data.msgId || !appState || !appState.chatMessages) return;
  const msg = appState.chatMessages.find(m => m.id === data.msgId);
  if (msg) {
    msg.deleted = true;
    msg.text = 'This message was deleted';
    msg.deletedAt = data.deletedAt || Date.now();
    saveAppState(appState);
    updateMessageDeletedDOM(data.msgId);
  }
}

function toggleStarMessage(msgId) {
  if (!msgId || !appState || !appState.chatMessages) return;
  const msg = appState.chatMessages.find(m => m.id === msgId);
  if (!msg) return;

  msg.starred = !msg.starred;
  saveAppState(appState);
  broadcastUpdate('CHAT_STAR', { msgId: msg.id, starred: msg.starred }, true);
  updateMessageStarDOM(msg.id, msg.starred);
  showToast(msg.starred ? 'Message starred ⭐' : 'Message unstarred');
}

function handleIncomingChatStar(data) {
  if (!data || !data.msgId || !appState || !appState.chatMessages) return;
  const msg = appState.chatMessages.find(m => m.id === data.msgId);
  if (msg) {
    msg.starred = !!data.starred;
    saveAppState(appState);
    updateMessageStarDOM(data.msgId, msg.starred);
  }
}

function openStarredMessagesModal() {
  const modal = document.getElementById('chatStarredModal');
  const listEl = document.getElementById('chatStarredList');
  const countEl = document.getElementById('starredCountPill');
  if (!modal || !listEl) return;

  const msgs = normalizeArray(appState?.chatMessages || appState?.chat_messages);
  const starredMsgs = msgs.filter(m => m && m.starred && !m.deleted);

  if (countEl) countEl.textContent = starredMsgs.length;
  listEl.innerHTML = '';

  if (starredMsgs.length === 0) {
    listEl.innerHTML = `
      <div style="text-align: center; color: #8696a0; padding: 40px 20px;">
        <span style="font-size: 2.2rem; display: block; margin-bottom: 8px;">⭐</span>
        <p>Koi starred message nahi hai</p>
        <span style="font-size: 0.8rem;">Kisi message par long press karke star karein</span>
      </div>
    `;
  } else {
    starredMsgs.slice().reverse().forEach(m => {
      const card = document.createElement('div');
      card.className = 'starred-item-card';
      const sender = m.sender === currentUser ? 'You' : (m.senderName || (currentUser === 'himanshu' ? 'Gullu' : 'Himanshu'));
      const timeStr = m.timestamp ? formatChatTime(m.timestamp) : '';
      let preview = m.text || '';
      if (m.type === 'image') preview = m.caption ? ('📷 ' + m.caption) : '📷 Photo';
      else if (m.type === 'audio') preview = '🎙️ Voice note';
      else if (m.type === 'location') preview = '📍 Location';
      else if (m.type === 'doc') preview = '📄 Document';

      card.innerHTML = `
        <div class="starred-item-meta">
          <strong>${escapeChatHtml(sender)}</strong>
          <span>${timeStr}</span>
        </div>
        <p class="starred-item-text">${escapeChatHtml(preview)}</p>
      `;
      card.addEventListener('click', () => {
        modal.classList.add('is-hidden');
        scrollToChatMessage(m.id);
      });
      listEl.appendChild(card);
    });
  }

  modal.classList.remove('is-hidden');
}

function closeStarredMessagesModal() {
  const modal = document.getElementById('chatStarredModal');
  if (modal) modal.classList.add('is-hidden');
}

function openDisappearingModal() {
  const modal = document.getElementById('chatDisappearingModal');
  if (!modal) return;
  const currentVal = String(appState?.disappearingTimer || 0);
  const radios = modal.querySelectorAll('input[name="disappearingTimer"]');
  radios.forEach(r => {
    r.checked = (r.value === currentVal);
  });
  modal.classList.remove('is-hidden');
}

function closeDisappearingModal() {
  const modal = document.getElementById('chatDisappearingModal');
  if (modal) modal.classList.add('is-hidden');
}

function saveDisappearingConfig() {
  const modal = document.getElementById('chatDisappearingModal');
  if (!modal) return;
  const checked = modal.querySelector('input[name="disappearingTimer"]:checked');
  const timer = checked ? Number(checked.value) : 0;
  if (!appState) appState = JSON.parse(JSON.stringify(DEFAULT_APP_STATE));
  appState.disappearingTimer = timer;
  saveAppState(appState);
  broadcastUpdate('CHAT_DISAPPEARING_CONFIG', { timer: timer }, true);
  closeDisappearingModal();

  const labels = {
    0: 'Off',
    86400000: '24 hours',
    604800000: '7 days',
    7776000000: '90 days'
  };
  showToast(`⏳ Disappearing messages: ${labels[timer] || 'Updated'}`);
  pruneDisappearingMessages();
  renderChatUI();
}

function handleIncomingDisappearingConfig(data) {
  if (!data || typeof data.timer === 'undefined') return;
  if (!appState) appState = JSON.parse(JSON.stringify(DEFAULT_APP_STATE));
  appState.disappearingTimer = Number(data.timer) || 0;
  saveAppState(appState);
  pruneDisappearingMessages();
  renderChatUI();
}

const EMOJI_CATEGORIES = {
  smileys: ['😊', '😂', '🥺', '🥰', '😍', '😘', '😅', '😆', '🤣', '😜', '😋', '😎', '🥳', '😇', '🤗', '🤫', '🤔', '😴', '😭', '😡', '😳', '🙄', '😬', '🤤'],
  love: ['❤️', '💖', '💕', '💗', '💓', '💘', '💝', '💟', '💌', '💍', '💐', '🌹', '🥀', '🌸', '🌺', '🌷', '🍫', '🧸', '💋', '💏', '💑', '👩‍❤️‍👨', '✨', '⭐'],
  hands: ['👍', '👎', '👏', '🙌', '🤝', '🫂', '✌️', '🤞', '🤙', '👊', '✊', '🤛', '🤜', '👈', '👉', '👆', '👇', '☝️', '🙏', '💅', '🫶', '👋', '💪', '👌'],
  fun: ['✨', '🔥', '💯', '🎉', '🎊', '🎈', '🎁', '🎀', '🎂', '☕', '🍕', '🍔', '🍦', '🍿', '🎵', '🎶', '🎮', '🚗', '✈️', '🌙', '🌞', '🐾', '🏖️', '🥂']
};

let currentEmojiCategory = 'smileys';

function populateEmojiGrid(cat = 'smileys') {
  currentEmojiCategory = cat;
  const grid = document.getElementById('chatEmojiGrid');
  if (!grid) return;
  grid.innerHTML = '';
  const emojis = EMOJI_CATEGORIES[cat] || EMOJI_CATEGORIES.smileys;
  const inputEl = document.getElementById('chatTextInput');

  emojis.forEach(emoji => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'emoji-pick-btn';
    btn.textContent = emoji;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (inputEl) {
        inputEl.value += emoji;
        inputEl.dispatchEvent(new Event('input'));
        inputEl.focus();
      }
    });
    grid.appendChild(btn);
  });
}

function toggleEmojiDrawer() {
  const drawer = document.getElementById('chatEmojiDrawer');
  const attachMenu = document.getElementById('chatAttachMenu');
  if (attachMenu) attachMenu.classList.add('is-hidden');
  if (!drawer) return;

  const isHidden = drawer.classList.contains('is-hidden');
  if (isHidden) {
    populateEmojiGrid(currentEmojiCategory);
    drawer.classList.remove('is-hidden');
  } else {
    drawer.classList.add('is-hidden');
  }
}

function toggleAttachMenu() {
  const attachMenu = document.getElementById('chatAttachMenu');
  const drawer = document.getElementById('chatEmojiDrawer');
  if (drawer) drawer.classList.add('is-hidden');
  if (!attachMenu) return;
  attachMenu.classList.toggle('is-hidden');
}

function shareLocationInChat() {
  const attachMenu = document.getElementById('chatAttachMenu');
  if (attachMenu) attachMenu.classList.add('is-hidden');
  showToast('Getting your live location... 📍');

  if (!navigator.geolocation) {
    showToast('Geolocation not supported on this device');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const mapsUrl = `https://maps.google.com/?q=${lat},${lng}`;
      sendChatMessage(`Shared live location 📍`, 'location', {
        lat: lat,
        lng: lng,
        mapsUrl: mapsUrl,
        address: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`
      });
      showToast('Live location shared in chat 📍');
    },
    (err) => {
      showToast('Location permission denied or unavailable');
    },
    { enableHighAccuracy: true, timeout: 12000 }
  );
}

function handleDocFileSelected(file) {
  if (!file) return;
  const fileName = file.name;
  const fileSizeKb = Math.round(file.size / 1024);
  const reader = new FileReader();
  reader.onload = (e) => {
    sendChatMessage(fileName, 'doc', {
      fileName: fileName,
      fileSize: `${fileSizeKb} KB`,
      docData: e.target.result
    });
    showToast('Document shared in chat 📄');
  };
  reader.readAsDataURL(file);
}

function handleAudioFileSelected(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    sendChatMessage('Shared audio track 🎵', 'audio', {
      audioData: e.target.result,
      duration: 'Audio'
    });
    showToast('Audio file shared in chat 🎵');
  };
  reader.readAsDataURL(file);
}

function createChatMessageDOMRow(msg, isConsecutive = false, hasTail = true) {
  const isMe = msg.sender === currentUser;
  const partnerAvatar = currentUser === 'himanshu' ? '🌸' : '☕';
  const senderDisplayName = isMe ? 'You' : (msg.senderName || (currentUser === 'himanshu' ? 'Gullu' : 'Himanshu'));

  const row = document.createElement('div');
  const msgTime = getMessageTimestamp(msg);
  row.setAttribute('data-msg-id', msg.id || ('msg_' + Date.now()));
  row.setAttribute('data-timestamp', String(msgTime));
  row.setAttribute('data-sender', msg.sender);
  row.className = `chat-msg-row ${isMe ? 'me' : 'partner'} ${hasTail ? 'has-tail' : ''} ${isConsecutive ? 'is-consecutive' : ''}`;

  const timeStr = msg.timestamp ? formatChatTime(msg.timestamp) : 'Just now';

  // Quoted reply markup
  let quoteHtml = '';
  if (msg.replyTo && (msg.replyTo.text || msg.replyTo.id)) {
    const isReplyMe = msg.replyTo.sender === currentUser || msg.replyTo.senderName === 'You';
    const authorName = isReplyMe ? 'You' : (msg.replyTo.senderName || (currentUser === 'himanshu' ? 'Gullu' : 'Himanshu'));
    quoteHtml = `
      <div class="chat-reply-quote ${isReplyMe ? 'quote-self' : 'quote-partner'}" data-reply-target="${msg.replyTo.id || ''}">
        <div class="reply-quote-content">
          <span class="reply-quote-author">${escapeChatHtml(authorName)}</span>
          <p class="reply-quote-text">${escapeChatHtml(msg.replyTo.text || 'Media')}</p>
        </div>
      </div>
    `;
  }

  if (msg.type === 'burst') {
    row.className = 'chat-msg-row burst-row';
    row.innerHTML = `
      <div class="chat-burst-card">
        <span class="burst-icon">✨</span>
        <span class="burst-text">${escapeChatHtml(msg.text)}</span>
        <span class="burst-icon">💖</span>
      </div>
    `;
    return row;
  }

  let bubbleInnerHtml = '';

  if (msg.deleted) {
    bubbleInnerHtml = `
      <div class="chat-msg-bubble chat-deleted-bubble">
        <p class="chat-msg-text deleted-msg"><em>🚫 This message was deleted</em></p>
        <div class="chat-msg-footer">
          <span class="chat-msg-time">${timeStr}</span>
        </div>
      </div>
    `;
    row.innerHTML = `
      ${!isMe ? `<div class="chat-msg-avatar" title="${escapeChatHtml(senderDisplayName)}">${partnerAvatar}</div>` : ''}
      ${bubbleInnerHtml}
    `;
    return row;
  }

  if (msg.type === 'call') {
    const callType = msg.callType || (msg.text && msg.text.includes('Video') ? 'video' : 'audio');
    const isAudio = callType === 'audio';
    const isMissed = !!msg.missed || (msg.text && msg.text.toLowerCase().includes('missed'));
    bubbleInnerHtml = `
      <div class="chat-msg-bubble chat-call-bubble">
        <button type="button" class="bubble-reply-action-btn" title="Reply ↩">↩</button>
        ${quoteHtml}
        ${!isMe && !isConsecutive ? `<span class="chat-msg-sender-name">${escapeChatHtml(senderDisplayName)}</span>` : ''}
        <div class="chat-call-card ${isAudio ? 'audio' : 'video'} ${isMissed ? 'missed' : ''}">
          <div class="chat-call-icon">${isMissed ? '📵' : (isAudio ? '📞' : '📹')}</div>
          <div class="chat-call-info">
            <span class="chat-call-title">${isMissed ? (isAudio ? 'Missed Voice Call' : 'Missed Video Call') : (isAudio ? 'Voice Call' : 'Video Call')}</span>
            <span class="chat-call-meta">${escapeChatHtml(msg.duration ? `${isAudio ? 'Voice' : 'Video'} • ${msg.duration}` : msg.text)}</span>
          </div>
          <button class="chat-call-back-btn" data-call-type="${callType}">Call back</button>
        </div>
        <div class="chat-msg-footer">
          ${msg.starred ? '<span class="chat-msg-star-badge" title="Starred">⭐</span>' : ''}
          <span class="chat-msg-time">${timeStr}</span>
          ${renderChatTicksHtml(msg, isMe)}
        </div>
      </div>
    `;
  } else if (msg.type === 'image') {
    const captionHtml = (msg.caption || (msg.text && msg.text !== 'Shared a photo 📷'))
      ? `<p class="chat-msg-caption">${escapeChatHtml(msg.caption || msg.text)}</p>`
      : '';
    let imageSrc = msg.imageData || msg.text || '';
    if (imageSrc.startsWith('[IDB]:')) {
      const key = imageSrc.replace('[IDB]:', '');
      imageSrc = mediaMemoryCache.get(key) || '';
    }
    bubbleInnerHtml = `
      <div class="chat-msg-bubble">
        <button type="button" class="bubble-reply-action-btn" title="Reply ↩">↩</button>
        ${quoteHtml}
        ${!isMe && !isConsecutive ? `<span class="chat-msg-sender-name">${escapeChatHtml(senderDisplayName)}</span>` : ''}
        <div class="chat-image-msg-bubble">
          <img class="chat-msg-image-thumb" src="${imageSrc}" alt="Shared photo" loading="lazy">
          <button type="button" class="chat-image-download-btn" title="Download Photo to Phone 💾">⬇️</button>
          ${captionHtml}
        </div>
        <div class="chat-msg-footer">
          ${msg.starred ? '<span class="chat-msg-star-badge" title="Starred">⭐</span>' : ''}
          <span class="chat-msg-time">${timeStr}</span>
          ${renderChatTicksHtml(msg, isMe)}
        </div>
      </div>
    `;
  } else if (msg.type === 'audio') {
    bubbleInnerHtml = `
      <div class="chat-msg-bubble">
        <button type="button" class="bubble-reply-action-btn" title="Reply ↩">↩</button>
        ${quoteHtml}
        ${!isMe && !isConsecutive ? `<span class="chat-msg-sender-name">${escapeChatHtml(senderDisplayName)}</span>` : ''}
        <div class="chat-voice-bubble">
          <button class="voice-play-btn ${msg.listened ? 'listened' : ''}" data-audio-src="${msg.audioData || ''}" title="Play Voice Note">▶</button>
          <div class="voice-waveform">
            <span class="voice-bar"></span><span class="voice-bar"></span><span class="voice-bar"></span>
            <span class="voice-bar"></span><span class="voice-bar"></span><span class="voice-bar"></span>
            <span class="voice-bar"></span><span class="voice-bar"></span><span class="voice-bar"></span>
            <span class="voice-bar"></span><span class="voice-bar"></span><span class="voice-bar"></span>
          </div>
          <button type="button" class="voice-speed-pill" data-speed="1" title="Playback speed">1x</button>
          <span class="voice-duration">${msg.duration || '0:05'}</span>
        </div>
        <div class="chat-msg-footer">
          ${msg.starred ? '<span class="chat-msg-star-badge" title="Starred">⭐</span>' : ''}
          <span class="chat-msg-time">${timeStr}</span>
          ${renderChatTicksHtml(msg, isMe)}
        </div>
      </div>
    `;
  } else if (msg.type === 'location') {
    const mapsUrl = msg.mapsUrl || `https://maps.google.com/?q=${msg.lat},${msg.lng}`;
    bubbleInnerHtml = `
      <div class="chat-msg-bubble">
        <button type="button" class="bubble-reply-action-btn" title="Reply ↩">↩</button>
        ${quoteHtml}
        ${!isMe && !isConsecutive ? `<span class="chat-msg-sender-name">${escapeChatHtml(senderDisplayName)}</span>` : ''}
        <div class="chat-location-card">
          <div class="chat-location-map-preview">
            <span class="location-map-pin">📍</span>
            <span class="location-map-label">Live GPS Location</span>
          </div>
          <div class="chat-location-details">
            <strong class="location-name">${escapeChatHtml(msg.address || 'Shared Location')}</strong>
            <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" class="location-open-link" onclick="event.stopPropagation()">
              Open in Google Maps ↗
            </a>
          </div>
        </div>
        <div class="chat-msg-footer">
          ${msg.starred ? '<span class="chat-msg-star-badge" title="Starred">⭐</span>' : ''}
          <span class="chat-msg-time">${timeStr}</span>
          ${renderChatTicksHtml(msg, isMe)}
        </div>
      </div>
    `;
  } else if (msg.type === 'doc') {
    bubbleInnerHtml = `
      <div class="chat-msg-bubble">
        <button type="button" class="bubble-reply-action-btn" title="Reply ↩">↩</button>
        ${quoteHtml}
        ${!isMe && !isConsecutive ? `<span class="chat-msg-sender-name">${escapeChatHtml(senderDisplayName)}</span>` : ''}
        <div class="chat-doc-card">
          <span class="chat-doc-icon">📄</span>
          <div class="chat-doc-details">
            <strong class="chat-doc-name">${escapeChatHtml(msg.fileName || msg.text || 'Document')}</strong>
            <span class="chat-doc-meta">${escapeChatHtml(msg.fileSize || 'File')}</span>
          </div>
          ${msg.docData ? `<a href="${msg.docData}" download="${escapeChatHtml(msg.fileName || 'file')}" class="chat-image-download-btn" title="Download Document 💾" onclick="event.stopPropagation()">⬇️</a>` : ''}
        </div>
        <div class="chat-msg-footer">
          ${msg.starred ? '<span class="chat-msg-star-badge" title="Starred">⭐</span>' : ''}
          <span class="chat-msg-time">${timeStr}</span>
          ${renderChatTicksHtml(msg, isMe)}
        </div>
      </div>
    `;
  } else {
    // Standard Text Message
    bubbleInnerHtml = `
      <div class="chat-msg-bubble">
        <button type="button" class="bubble-reply-action-btn" title="Reply ↩">↩</button>
        ${isMe && !msg.deleted ? `<button type="button" class="bubble-edit-action-btn" title="Edit message ✏️">✏️</button>` : ''}
        ${quoteHtml}
        ${!isMe && !isConsecutive ? `<span class="chat-msg-sender-name">${escapeChatHtml(senderDisplayName)}</span>` : ''}
        <p class="chat-msg-text">${linkifyChatText(msg.text)}</p>
        <div class="chat-msg-footer">
          ${msg.starred ? '<span class="chat-msg-star-badge" title="Starred">⭐</span>' : ''}
          ${msg.edited ? '<span class="chat-msg-edited-tag">edited</span>' : ''}
          <span class="chat-msg-time">${timeStr}</span>
          ${renderChatTicksHtml(msg, isMe)}
        </div>
      </div>
    `;
  }

  row.innerHTML = `
    ${!isMe ? `<div class="chat-msg-avatar" title="${escapeChatHtml(senderDisplayName)}">${partnerAvatar}</div>` : ''}
    ${bubbleInnerHtml}
  `;

  // Attach Reaction Chip
  if (msg.reaction) {
    const reactionBadge = document.createElement('span');
    reactionBadge.className = 'chat-reaction-chip';
    reactionBadge.setAttribute('data-msg-id', msg.id);
    reactionBadge.textContent = msg.reaction;
    row.querySelector('.chat-msg-bubble')?.appendChild(reactionBadge);
  }

  // Swipe Reply Icon Indicator (Mounted directly on bubble for authentic WhatsApp alignment)
  const bubble = row.querySelector('.chat-msg-bubble');
  const replyIcon = document.createElement('div');
  replyIcon.className = 'swipe-reply-icon';
  replyIcon.innerHTML = '↩';
  if (bubble) {
    bubble.appendChild(replyIcon);
  } else {
    row.appendChild(replyIcon);
  }

  // Asynchronous hydration for IndexedDB media references
  const thumb = row.querySelector('.chat-msg-image-thumb');
  if (msg.type === 'image' && msg.imageData && msg.imageData.startsWith('[IDB]:')) {
    const key = msg.imageData.replace('[IDB]:', '');
    if (!mediaMemoryCache.has(key)) {
      getMediaBlobFromIDB(key).then(actualUrl => {
        if (actualUrl && thumb) thumb.src = actualUrl;
      });
    }
  }
  if (msg.type === 'doc' && msg.docData && msg.docData.startsWith('[IDB]:')) {
    const key = msg.docData.replace('[IDB]:', '');
    if (!mediaMemoryCache.has(key)) {
      getMediaBlobFromIDB(key).then(actualUrl => {
        if (actualUrl) {
          const docLink = row.querySelector('.chat-doc-card a.chat-image-download-btn');
          if (docLink) docLink.href = actualUrl;
        }
      });
    }
  }

  return row;
}

let chatRenderPending = false;
let chatRenderPreserveScroll = false;
function scheduleRenderChatUI(preserveScroll = false) {
  if (preserveScroll) chatRenderPreserveScroll = true;
  if (chatRenderPending) return;
  chatRenderPending = true;
  requestAnimationFrame(() => {
    chatRenderPending = false;
    const shouldPreserve = chatRenderPreserveScroll;
    chatRenderPreserveScroll = false;
    renderChatUI(shouldPreserve);
  });
}

function renderChatUI(preserveScroll = false) {
  const partnerUser = currentUser === 'himanshu' ? 'gullu' : 'himanshu';
  const partnerName = currentUser === 'himanshu' ? 'Gullu 🌸' : 'Himanshu ☕';
  const partnerAvatar = currentUser === 'himanshu' ? '🌸' : '☕';

  const headingEl = document.getElementById('chatPartnerName');
  const avatarEl = document.getElementById('chatPartnerAvatar');
  const inputField = document.getElementById('chatTextInput');
  const typingAvatar = document.getElementById('typingPartnerAvatar');

  if (headingEl) headingEl.textContent = partnerName;
  if (avatarEl) avatarEl.textContent = partnerAvatar;
  if (typingAvatar) typingAvatar.textContent = partnerAvatar;
  if (inputField) {
    inputField.placeholder = `Message (${currentUser === 'himanshu' ? 'Gullu' : 'Himanshu'})... ✍️`;
  }

  updatePartnerHeaderStatus();
  updateChatMuteUI();
  renderPinnedBanner();

  const listEl = document.getElementById('chatMessagesList');
  if (!listEl) return;

  pruneDisappearingMessages();

  let rawMsgs = normalizeArray(appState?.chatMessages || appState?.chat_messages);
  // Filter out messages deleted for me
  rawMsgs = rawMsgs.filter(m => !(m && m.hiddenFor && m.hiddenFor.includes(currentUser)));

  // Ensure strict chronological sequence (oldest first at top, newest last at bottom)
  const msgs = sortChatMessagesAscending(rawMsgs);
  if (appState) appState.chatMessages = msgs;

  // Seed processedBurstMsgIds
  msgs.forEach(m => {
    if (m && m.type === 'burst' && m.id) {
      processedBurstMsgIds.add(m.id);
    }
  });

  const emptyState = document.getElementById('chatEmptyState');
  if (msgs.length === 0) {
    const existingItems = listEl.querySelectorAll('.chat-msg-row, .chat-date-divider');
    existingItems.forEach(r => r.remove());
    if (emptyState) emptyState.style.display = 'flex';
    return;
  }
  if (emptyState) emptyState.style.display = 'none';

  // PAGINATION: Render only the latest renderedChatMessagesCount messages
  if (!renderedChatMessagesCount || renderedChatMessagesCount < CHAT_PAGE_SIZE) {
    renderedChatMessagesCount = CHAT_PAGE_SIZE;
  }
  const visibleMsgs = msgs.slice(-renderedChatMessagesCount);

  // Capture metrics before updating DOM for accurate scroll compensation
  const oldScrollHeight = listEl.scrollHeight;
  const oldScrollTop = listEl.scrollTop;
  const distanceFromBottom = oldScrollHeight - oldScrollTop - listEl.clientHeight;
  const wasAtBottom = distanceFromBottom < 50;

  // Remove existing message rows and date dividers (preserve loader, empty state, typing bubble)
  const existingItems = listEl.querySelectorAll('.chat-msg-row, .chat-date-divider');
  existingItems.forEach(r => r.remove());

  let lastDateStr = null;
  let prevMsg = null;
  const typingBubble = document.getElementById('chatTypingBubble');

  visibleMsgs.forEach(msg => {
    const msgTime = getMessageTimestamp(msg);
    const dateStr = formatChatDateDivider(msgTime);
    if (dateStr !== lastDateStr) {
      const divider = document.createElement('div');
      divider.className = 'chat-date-divider';
      divider.setAttribute('data-date', dateStr);
      divider.innerHTML = `<span>${dateStr}</span>`;
      if (typingBubble && typingBubble.parentNode === listEl) {
        listEl.insertBefore(divider, typingBubble);
      } else {
        listEl.appendChild(divider);
      }
      lastDateStr = dateStr;
      prevMsg = null;
    }

    const prevTime = prevMsg ? getMessageTimestamp(prevMsg) : 0;
    const isConsecutive = !!(prevMsg && prevMsg.sender === msg.sender && Math.abs(msgTime - prevTime) < 300000 && prevMsg.type !== 'burst' && msg.type !== 'burst');
    const hasTail = !isConsecutive;

    const row = createChatMessageDOMRow(msg, isConsecutive, hasTail);
    if (typingBubble && typingBubble.parentNode === listEl) {
      listEl.insertBefore(row, typingBubble);
    } else {
      listEl.appendChild(row);
    }

    prevMsg = msg;
  });

  // Restore scroll position without jumping
  if (preserveScroll && !wasAtBottom) {
    const newScrollHeight = listEl.scrollHeight;
    listEl.style.scrollBehavior = 'auto';
    listEl.scrollTop = oldScrollTop + (newScrollHeight - oldScrollHeight);
    requestAnimationFrame(() => {
      listEl.style.scrollBehavior = '';
    });
  } else {
    listEl.scrollTop = listEl.scrollHeight;
  }

  updateScrollBottomButtonVisibility();
}

function appendChatMessageDOM(msg, shouldScroll = true) {
  const listEl = document.getElementById('chatMessagesList');
  if (!listEl) return;

  if (msg.hiddenFor && msg.hiddenFor.includes(currentUser)) return;

  const emptyState = document.getElementById('chatEmptyState');
  if (emptyState) emptyState.style.display = 'none';

  if (msg.id && listEl.querySelector(`[data-msg-id="${msg.id}"]`)) return;

  const msgTime = getMessageTimestamp(msg);
  const dateStr = formatChatDateDivider(msgTime);

  // Check last date divider in list
  const dividers = listEl.querySelectorAll('.chat-date-divider');
  const lastDivider = dividers.length > 0 ? dividers[dividers.length - 1] : null;
  const lastDateAttr = lastDivider ? lastDivider.getAttribute('data-date') : null;

  if (lastDateAttr !== dateStr) {
    const divider = document.createElement('div');
    divider.className = 'chat-date-divider';
    divider.setAttribute('data-date', dateStr);
    divider.innerHTML = `<span>${dateStr}</span>`;
    const typingBubble = document.getElementById('chatTypingBubble');
    if (typingBubble && typingBubble.parentNode === listEl) {
      listEl.insertBefore(divider, typingBubble);
    } else {
      listEl.appendChild(divider);
    }
  }

  // Determine consecutive grouping from last row
  const rows = listEl.querySelectorAll('.chat-msg-row');
  const lastRow = rows.length > 0 ? rows[rows.length - 1] : null;
  let isConsecutive = false;
  if (lastRow) {
    const prevSender = lastRow.getAttribute('data-sender');
    const prevTime = Number(lastRow.getAttribute('data-timestamp')) || 0;
    if (prevSender === msg.sender && Math.abs(msgTime - prevTime) < 300000 && msg.type !== 'burst') {
      isConsecutive = true;
    }
  }
  const hasTail = !isConsecutive;

  const row = createChatMessageDOMRow(msg, isConsecutive, hasTail);

  // Strict chronological insertion in DOM
  const existingRows = Array.from(listEl.querySelectorAll('.chat-msg-row'));
  let inserted = false;
  for (let i = 0; i < existingRows.length; i++) {
    const rTime = Number(existingRows[i].getAttribute('data-timestamp')) || 0;
    if (rTime > msgTime) {
      listEl.insertBefore(row, existingRows[i]);
      inserted = true;
      break;
    }
  }

  if (!inserted) {
    const typingBubble = document.getElementById('chatTypingBubble');
    if (typingBubble && typingBubble.parentNode === listEl) {
      listEl.insertBefore(row, typingBubble);
    } else {
      listEl.appendChild(row);
    }
  }

  renderedChatMessagesCount++;

  if (shouldScroll) {
    listEl.scrollTo({ top: listEl.scrollHeight, behavior: 'smooth' });
    clearScrollUnreadBadge();
  } else {
    const distance = listEl.scrollHeight - listEl.scrollTop - listEl.clientHeight;
    if (distance > 100) {
      incrementScrollUnreadBadge();
    }
  }
  updateScrollBottomButtonVisibility();
}

// SILENT CHAT RECONCILIATION ENGINE (Zero DOM Wipe, Strict ID-Matching, Zero Scroll Jump)
function reconcileChatMessagesDOM(incomingList) {
  if (!incomingList || !Array.isArray(incomingList) || incomingList.length === 0) return;
  const listEl = document.getElementById('chatMessagesList');
  if (!listEl) return;

  if (!appState) appState = JSON.parse(JSON.stringify(DEFAULT_APP_STATE));
  if (!appState.chatMessages) appState.chatMessages = [];

  // If chat is completely empty in DOM, render initial slice
  const currentRows = listEl.querySelectorAll('.chat-msg-row');
  if (currentRows.length === 0) {
    appState.chatMessages = sortChatMessagesAscending(incomingList).slice(-250);
    saveAppState(appState);
    renderChatUI();
    return;
  }

  // Capture metrics before updating DOM for accurate scroll compensation
  const oldScrollHeight = listEl.scrollHeight;
  const oldScrollTop = listEl.scrollTop;
  const distanceFromBottom = oldScrollHeight - oldScrollTop - listEl.clientHeight;
  const wasAtBottom = distanceFromBottom < 60;

  // Map existing local messages by ID (ID-based reconciliation, never index-based)
  const localMap = new Map();
  appState.chatMessages.forEach(m => {
    if (m && m.id) localMap.set(m.id, m);
  });

  let stateChanged = false;
  let domChanged = false;

  const sortedIncoming = sortChatMessagesAscending(incomingList);

  sortedIncoming.forEach(incoming => {
    if (!incoming || !incoming.id) return;
    if (incoming.hiddenFor && incoming.hiddenFor.includes(currentUser)) return;

    const existing = localMap.get(incoming.id);
    const inDOM = listEl.querySelector(`[data-msg-id="${incoming.id}"]`);

    if (!existing) {
      // 1. BRAND NEW MESSAGE
      localMap.set(incoming.id, incoming);
      stateChanged = true;

      const emptyState = document.getElementById('chatEmptyState');
      if (emptyState) emptyState.style.display = 'none';

      // Insert into DOM in strict timestamp order without auto-scrolling
      appendChatMessageDOM(incoming, false);
      domChanged = true;
    } else {
      // 2. EXISTING MESSAGE: in-place reconciliation
      let msgChanged = false;

      // Status / Ticks
      if (incoming.status === 'read' && existing.status !== 'read') {
        existing.status = 'read';
        existing.readAt = incoming.readAt || Date.now();
        msgChanged = true;
        updateMessageTickDOM(incoming.id, 'read');
      } else if (incoming.status === 'delivered' && (!existing.status || existing.status === 'sent')) {
        existing.status = 'delivered';
        existing.deliveredAt = incoming.deliveredAt || Date.now();
        msgChanged = true;
        updateMessageTickDOM(incoming.id, 'delivered');
      }

      // Edited
      if (incoming.edited && (!existing.edited || existing.text !== incoming.text)) {
        existing.edited = true;
        existing.text = incoming.text;
        existing.editedAt = incoming.editedAt || Date.now();
        msgChanged = true;
        updateMessageEditDOM(incoming.id, incoming.text, incoming.editedAt);
      }

      // Deleted
      if (incoming.deleted && !existing.deleted) {
        existing.deleted = true;
        existing.text = 'This message was deleted';
        msgChanged = true;
        updateMessageDeletedDOM(incoming.id);
      }

      // Reaction
      if (incoming.reaction !== existing.reaction) {
        existing.reaction = incoming.reaction;
        msgChanged = true;
        updateMessageReactionDOM(incoming.id, incoming.reaction);
      }

      // Starred
      if (!!incoming.starred !== !!existing.starred) {
        existing.starred = !!incoming.starred;
        msgChanged = true;
        updateMessageStarDOM(incoming.id, incoming.starred);
      }

      // If message existed in state but was not rendered in DOM (within current page slice)
      if (!inDOM && listEl.querySelectorAll('.chat-msg-row').length < renderedChatMessagesCount) {
        appendChatMessageDOM(incoming, false);
        domChanged = true;
      }

      if (msgChanged) {
        stateChanged = true;
      }
    }
  });

  if (stateChanged) {
    appState.chatMessages = sortChatMessagesAscending(Array.from(localMap.values())).slice(-250);
    saveAppState(appState);
  }

  // Restore scroll position with pixel precision (zero scroll jump)
  if (domChanged) {
    if (wasAtBottom) {
      listEl.scrollTop = listEl.scrollHeight;
      clearScrollUnreadBadge();
    } else {
      const newScrollHeight = listEl.scrollHeight;
      listEl.style.scrollBehavior = 'auto';
      listEl.scrollTop = oldScrollTop + (newScrollHeight - oldScrollHeight);
      requestAnimationFrame(() => {
        listEl.style.scrollBehavior = '';
      });
      incrementScrollUnreadBadge();
    }
  }

  updateScrollBottomButtonVisibility();
}

function sendChatMessage(text, type = 'text', extraData = {}) {
  if (!text || !text.trim()) return;
  if (!appState) appState = JSON.parse(JSON.stringify(DEFAULT_APP_STATE));
  if (!appState.chatMessages) appState.chatMessages = [];

  // Guarantee strictly monotonic timestamp so new messages NEVER appear above older messages
  let maxPrevTime = 0;
  for (let i = 0; i < appState.chatMessages.length; i++) {
    const t = getMessageTimestamp(appState.chatMessages[i]);
    if (t > maxPrevTime) maxPrevTime = t;
  }
  const safeTimestamp = Math.max(Date.now(), maxPrevTime + 1);

  const msgId = 'msg_' + safeTimestamp + '_' + Math.random().toString(36).substr(2, 6);
  const myName = currentUser === 'himanshu' ? 'Himanshu' : 'Gullu';

  let replyData = null;
  if (activeReplyTarget) {
    const isTargetMe = activeReplyTarget.sender === currentUser;
    let snippet = activeReplyTarget.text || '';
    if (activeReplyTarget.type === 'image') snippet = activeReplyTarget.caption ? ('📷 ' + activeReplyTarget.caption) : '📷 Photo';
    else if (activeReplyTarget.type === 'audio') snippet = '🎙️ Voice note';
    else if (activeReplyTarget.type === 'call') snippet = '📞 Call log';

    replyData = {
      id: activeReplyTarget.id,
      sender: activeReplyTarget.sender,
      senderName: isTargetMe ? 'You' : (activeReplyTarget.senderName || (currentUser === 'himanshu' ? 'Gullu' : 'Himanshu')),
      text: snippet
    };
    clearReplyTarget();
  }

  const msg = {
    id: msgId,
    sender: currentUser,
    senderName: myName,
    text: text.trim(),
    timestamp: safeTimestamp,
    type: type,
    status: 'sent', // Single grey tick initially
    ...(replyData ? { replyTo: replyData } : {}),
    ...extraData
  };

  appState.chatMessages.push(msg);
  appState.chatMessages = sortChatMessagesAscending(appState.chatMessages);
  if (appState.chatMessages.length > 250) {
    appState.chatMessages = appState.chatMessages.slice(-250);
  }

  saveAppState(appState);
  const listEl = document.getElementById('chatMessagesList');
  if (listEl && listEl.querySelectorAll('.chat-msg-row').length > 0) {
    appendChatMessageDOM(msg, true);
  } else {
    scheduleRenderChatUI();
  }

  // WhatsApp sent tick chime
  playTone(587.33, 0.08);
  setTimeout(() => playTone(880, 0.1), 80);

  // Stop typing indicator on message send
  broadcastMyTypingStatus(false);

  // Real-time broadcast
  broadcastUpdate('CHAT_MESSAGE', msg);
}

function handleIncomingChatMessage(msg, isLocalBroadcast = false) {
  if (!msg || !msg.id || (!msg.text && !msg.imageData && !msg.audioData && !msg.callType && !msg.docData && !msg.location)) return;
  if (!appState) appState = JSON.parse(JSON.stringify(DEFAULT_APP_STATE));
  if (!appState.chatMessages) appState.chatMessages = [];

  const existingMsg = appState.chatMessages.find(m => m.id === msg.id);
  const now = Date.now();
  const isFresh = msg.timestamp ? (Math.abs(now - getMessageTimestamp(msg)) < 25000) : false;

  if (existingMsg) {
    let tickChanged = false;
    if (msg.status === 'read' && existingMsg.status !== 'read') {
      existingMsg.status = 'read';
      existingMsg.readAt = msg.readAt || now;
      tickChanged = true;
      updateMessageTickDOM(msg.id, 'read');
    } else if (msg.status === 'delivered' && (!existingMsg.status || existingMsg.status === 'sent')) {
      existingMsg.status = 'delivered';
      existingMsg.deliveredAt = msg.deliveredAt || now;
      tickChanged = true;
      updateMessageTickDOM(msg.id, 'delivered');
    }
    if (msg.edited && (!existingMsg.edited || existingMsg.text !== msg.text)) {
      existingMsg.edited = true;
      existingMsg.text = msg.text;
      existingMsg.editedAt = msg.editedAt || now;
      tickChanged = true;
      updateMessageEditDOM(msg.id, msg.text, msg.editedAt);
    }
    if (msg.reaction !== existingMsg.reaction) {
      existingMsg.reaction = msg.reaction;
      tickChanged = true;
      updateMessageReactionDOM(msg.id, msg.reaction);
    }
    if (msg.deleted && !existingMsg.deleted) {
      existingMsg.deleted = true;
      existingMsg.text = 'This message was deleted';
      tickChanged = true;
      updateMessageDeletedDOM(msg.id);
    }
    if (tickChanged) {
      saveAppState(appState);
    }
  } else {
    // If incoming fresh message has timestamp <= last message due to partner's clock skew:
    if (isFresh && appState.chatMessages.length > 0) {
      let maxTime = 0;
      for (let i = 0; i < appState.chatMessages.length; i++) {
        const t = getMessageTimestamp(appState.chatMessages[i]);
        if (t > maxTime) maxTime = t;
      }
      const incTime = getMessageTimestamp(msg);
      if (incTime <= maxTime) {
        msg.timestamp = maxTime + 1;
      }
    }
    appState.chatMessages.push(msg);
    appState.chatMessages = sortChatMessagesAscending(appState.chatMessages);
    if (appState.chatMessages.length > 250) {
      appState.chatMessages = appState.chatMessages.slice(-250);
    }
    saveAppState(appState);
    const chatList = document.getElementById('chatMessagesList');
    if (chatList && chatList.querySelectorAll('.chat-msg-row').length > 0) {
      // Auto-scroll only if fresh and user is already near bottom (<= 120px)
      const distanceFromBottom = chatList.scrollHeight - chatList.scrollTop - chatList.clientHeight;
      const shouldScroll = isFresh && (distanceFromBottom <= 120);
      appendChatMessageDOM(msg, shouldScroll);
    } else {
      scheduleRenderChatUI(true);
    }
  }

  // Delivery & Read Receipt tracking when recipient receives partner's message
  if (msg.sender !== currentUser && !isLocalBroadcast) {
    const chatPane = document.getElementById('paneChat');
    const isChatActive = chatPane && chatPane.classList.contains('active') && !document.hidden;

    if (isChatActive) {
      // Partner is currently looking at the chat pane! -> Seen / Read (Double blue tick)
      if (msg.status !== 'read') {
        msg.status = 'read';
        msg.readAt = now;
        saveAppState(appState);
        broadcastUpdate('CHAT_RECEIPT_READ', {
          msgIds: [msg.id],
          readBy: currentUser,
          readAt: now
        }, false);
      }
    } else {
      // Partner device received message, net is ON -> Delivered (Double grey tick)
      if (!msg.status || msg.status === 'sent') {
        msg.status = 'delivered';
        msg.deliveredAt = now;
        saveAppState(appState);
        broadcastUpdate('CHAT_RECEIPT_DELIVERED', {
          msgIds: [msg.id],
          deliveredTo: currentUser,
          deliveredAt: now
        }, false);
      }
    }
  }

  if (existingMsg || !isFresh) {
    if (msg.type === 'burst') {
      processedBurstMsgIds.add(msg.id);
    }
    return;
  }

  // Active notification for brand-new live incoming messages only
  if (msg.sender !== currentUser && !isLocalBroadcast) {
    const chatPane = document.getElementById('paneChat');
    const isChatActive = chatPane && chatPane.classList.contains('active');
    const isMuted = !!(appState && appState.chatMuted);

    if (isChatActive) {
      if (!isMuted) {
        playTone(523.25, 0.08);
        setTimeout(() => playTone(659.25, 0.1), 90);
        if (navigator.vibrate) {
          try { navigator.vibrate([60, 40, 60]); } catch (e) {}
        }
      }
    } else {
      const badge = document.getElementById('dockChatBadge');
      if (badge) badge.classList.remove('is-hidden');

      if (!isMuted) {
        playTone(523.25, 0.08);
        setTimeout(() => playTone(659.25, 0.12), 100);

        sendSystemNotificationForChat(msg);

        // In-app banner toast with quick reply action
        showChatInAppNotification(msg);
      }
    }
  }

  // Trigger Love Burst animation if burst
  if (msg.type === 'burst' && msg.sender !== currentUser && !isLocalBroadcast) {
    if (!processedBurstMsgIds.has(msg.id)) {
      processedBurstMsgIds.add(msg.id);
      triggerLoveBurstAnimation(15);
    }
  }
}

function showChatInAppNotification(msg) {
  const existing = document.getElementById('chatInAppBanner');
  if (existing) existing.remove();

  const banner = document.createElement('div');
  banner.id = 'chatInAppBanner';
  banner.className = 'chat-in-app-toast';
  const sender = msg.senderName || (msg.sender === 'himanshu' ? 'Himanshu' : 'Gullu');
  const preview = msg.text || (msg.type === 'image' ? '📷 Photo' : '🎙️ Voice note');

  banner.innerHTML = `
    <div class="toast-avatar">${msg.sender === 'himanshu' ? '☕' : '🌸'}</div>
    <div class="toast-content">
      <strong>${escapeChatHtml(sender)}</strong>
      <p>${escapeChatHtml(preview)}</p>
    </div>
    <button type="button" class="toast-reply-btn" id="toastReplyActionBtn">Reply</button>
  `;

  document.body.appendChild(banner);

  const replyBtn = banner.querySelector('#toastReplyActionBtn');
  if (replyBtn) {
    replyBtn.addEventListener('click', () => {
      banner.remove();
      switchTab('paneChat');
    });
  }

  setTimeout(() => {
    banner.classList.add('fade-out');
    setTimeout(() => banner.remove(), 400);
  }, 4500);
}

function sendSystemNotificationForChat(msg) {
  if (!msg || !('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;
  if (appState && appState.chatMuted) return;

  const notifId = 'chat_' + (msg.id || msg.timestamp);
  if (hasAlreadyShownNotification(notifId)) return;
  if (msg.timestamp && Math.abs(Date.now() - msg.timestamp) > 90000) return;

  recordNotificationShown(notifId);

  const senderName = msg.sender === 'himanshu' ? 'Himanshu ☕' : 'Gullu 🌸';
  let preview = msg.text ? msg.text.slice(0, 80) : '';
  if (msg.type === 'image') preview = 'Shared a photo 📷';
  else if (msg.type === 'audio') preview = `Voice note 🎙️ (${msg.duration || '0:05'})`;
  else if (msg.type === 'call') preview = msg.text || 'Call log';

  const title = `💬 ${senderName}`;
  const options = {
    body: `${preview}`,
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
// WHATSAPP SEARCH, PINNED, MUTE, REACTIONS & MEDIA MODAL FUNCTIONS
// ==========================================================================

function executeChatSearch(query) {
  clearChatSearchHighlights();
  currentChatSearchMatches = [];
  currentChatSearchIndex = -1;

  const counterEl = document.getElementById('chatSearchCounter');
  if (!query || !query.trim()) {
    if (counterEl) counterEl.textContent = '0 of 0';
    return;
  }

  const q = query.trim().toLowerCase();

  // Check if there are matches in older unrendered messages
  let rawMsgs = normalizeArray(appState?.chatMessages || appState?.chat_messages);
  rawMsgs = rawMsgs.filter(m => !(m && m.hiddenFor && m.hiddenFor.includes(currentUser)));
  const msgs = sortChatMessagesAscending(rawMsgs);

  // Find the earliest matching message across full history
  let earliestMatchIdx = -1;
  for (let i = 0; i < msgs.length; i++) {
    const m = msgs[i];
    const matchText = ((m && m.text) || '') + ' ' + ((m && m.caption) || '') + ' ' + ((m && m.senderName) || '');
    if (matchText.toLowerCase().includes(q)) {
      earliestMatchIdx = i;
      break;
    }
  }

  if (earliestMatchIdx !== -1) {
    const neededCount = (msgs.length - earliestMatchIdx) + 10;
    if (neededCount > renderedChatMessagesCount) {
      renderedChatMessagesCount = neededCount;
      renderChatUI(true);
    }
  }

  const rows = document.querySelectorAll('.chat-msg-row');
  rows.forEach(r => {
    const textEl = r.querySelector('.chat-msg-text, .chat-msg-caption, .chat-call-meta');
    if (textEl && textEl.textContent.toLowerCase().includes(q)) {
      r.classList.add('search-matched');
      currentChatSearchMatches.push(r);
    }
  });

  if (currentChatSearchMatches.length > 0) {
    currentChatSearchIndex = currentChatSearchMatches.length - 1; // start on latest match
    highlightChatSearchMatch(currentChatSearchIndex);
  } else {
    if (counterEl) counterEl.textContent = 'No matches';
  }
}

function highlightChatSearchMatch(index) {
  currentChatSearchMatches.forEach(r => r.classList.remove('search-active-match'));
  const counterEl = document.getElementById('chatSearchCounter');

  if (index >= 0 && index < currentChatSearchMatches.length) {
    const activeRow = currentChatSearchMatches[index];
    activeRow.classList.add('search-active-match');
    activeRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (counterEl) counterEl.textContent = `${index + 1} of ${currentChatSearchMatches.length}`;
  }
}

function navigateChatSearch(direction) {
  if (currentChatSearchMatches.length === 0) return;
  currentChatSearchIndex += direction;
  if (currentChatSearchIndex < 0) currentChatSearchIndex = currentChatSearchMatches.length - 1;
  else if (currentChatSearchIndex >= currentChatSearchMatches.length) currentChatSearchIndex = 0;
  highlightChatSearchMatch(currentChatSearchIndex);
}

function clearChatSearchHighlights() {
  document.querySelectorAll('.chat-msg-row.search-matched, .chat-msg-row.search-active-match').forEach(r => {
    r.classList.remove('search-matched', 'search-active-match');
  });
  const counterEl = document.getElementById('chatSearchCounter');
  if (counterEl) counterEl.textContent = '0 of 0';
}

function toggleChatMute() {
  if (!appState) appState = JSON.parse(JSON.stringify(DEFAULT_APP_STATE));
  appState.chatMuted = !appState.chatMuted;
  saveAppState(appState);
  updateChatMuteUI();

  if (appState.chatMuted) {
    showToast('🔕 Chat notifications muted');
  } else {
    showToast('🔔 Chat notifications unmuted');
  }
}

function updateChatMuteUI() {
  const isMuted = !!(appState && appState.chatMuted);
  const muteBadge = document.getElementById('chatMutedIndicator');
  const menuMuteLabel = document.getElementById('chatMenuMuteLabel');
  const menuMuteIcon = document.getElementById('chatMenuMuteIcon');

  if (muteBadge) muteBadge.classList.toggle('is-hidden', !isMuted);
  if (menuMuteLabel) menuMuteLabel.textContent = isMuted ? 'Unmute notifications' : 'Mute notifications';
  if (menuMuteIcon) menuMuteIcon.textContent = isMuted ? '🔔' : '🔕';
}

function promptPinChatMessage() {
  const msgs = normalizeArray(appState?.chatMessages || appState?.chat_messages);
  const lastMsg = msgs.slice().reverse().find(m => m.text);
  const defaultText = lastMsg ? lastMsg.text : 'Important: Yaad rakhna ❤️';
  const customPin = prompt('📌 Chat me konsa message pin karna chahte hain?', defaultText);
  if (customPin && customPin.trim()) {
    pinChatMessage(customPin.trim(), lastMsg ? lastMsg.id : null);
  }
}

function pinChatMessage(text, id = null) {
  if (!appState) appState = JSON.parse(JSON.stringify(DEFAULT_APP_STATE));
  appState.pinnedChatMessage = {
    id: id || ('pin_' + Date.now()),
    text: text,
    pinnedBy: currentUser,
    timestamp: Date.now()
  };
  saveAppState(appState);
  broadcastUpdate('CHAT_PIN', appState.pinnedChatMessage, true);
  renderPinnedBanner();
  showToast('📌 Message pinned to chat top!');
}

function unpinChatMessage() {
  if (!appState) appState = JSON.parse(JSON.stringify(DEFAULT_APP_STATE));
  appState.pinnedChatMessage = null;
  saveAppState(appState);
  broadcastUpdate('CHAT_PIN', null, true);
  renderPinnedBanner();
  showToast('Message unpinned');
}

function renderPinnedBanner() {
  const banner = document.getElementById('chatPinnedBanner');
  const textEl = document.getElementById('chatPinnedText');
  if (!banner || !textEl) return;

  if (appState && appState.pinnedChatMessage && appState.pinnedChatMessage.text) {
    textEl.textContent = appState.pinnedChatMessage.text;
    banner.classList.remove('is-hidden');
  } else {
    banner.classList.add('is-hidden');
  }
}

function toggleMessageReaction(msgId, reactionEmoji = '❤️') {
  if (!msgId || !appState || !appState.chatMessages) return;
  const msg = appState.chatMessages.find(m => m.id === msgId);
  if (!msg) return;

  msg.reaction = msg.reaction === reactionEmoji ? null : reactionEmoji;
  saveAppState(appState);
  broadcastUpdate('CHAT_REACTION', { msgId, reaction: msg.reaction }, true);
  updateMessageReactionDOM(msgId, msg.reaction);
}

function handleIncomingChatReaction(data) {
  if (!data || !data.msgId || !appState || !appState.chatMessages) return;
  const msg = appState.chatMessages.find(m => m.id === data.msgId);
  if (msg) {
    msg.reaction = data.reaction || null;
    saveAppState(appState);
    updateMessageReactionDOM(data.msgId, msg.reaction);
  }
}

function openMediaDocsModal() {
  const modal = document.getElementById('chatMediaDocsModal');
  const partnerName = currentUser === 'himanshu' ? 'Gullu 🌸' : 'Himanshu ☕';
  const titleEl = document.getElementById('chatMediaModalTitle');
  if (titleEl) titleEl.textContent = partnerName;

  populateMediaDocsContent();
  switchMediaDocsTab('media');
  if (modal) modal.classList.remove('is-hidden');
}

function switchMediaDocsTab(tabName) {
  document.querySelectorAll('.chat-media-tab-btn').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-tab') === tabName);
  });
  const panePhotos = document.getElementById('chatMediaPanePhotos');
  const paneLinks = document.getElementById('chatMediaPaneLinks');
  const paneDocs = document.getElementById('chatMediaPaneDocs');

  if (panePhotos) panePhotos.classList.toggle('is-hidden', tabName !== 'media');
  if (paneLinks) paneLinks.classList.toggle('is-hidden', tabName !== 'links');
  if (paneDocs) paneDocs.classList.toggle('is-hidden', tabName !== 'docs');
}

function populateMediaDocsContent() {
  const msgs = normalizeArray(appState?.chatMessages || appState?.chat_messages);
  
  // 1. Photos
  const photos = msgs.filter(m => m.type === 'image' && (m.imageData || m.text));
  const mediaGrid = document.getElementById('chatMediaGrid');
  const mediaEmpty = document.getElementById('chatMediaEmpty');
  const mediaCount = document.getElementById('mediaCount');
  if (mediaCount) mediaCount.textContent = photos.length;

  if (mediaGrid) {
    mediaGrid.innerHTML = '';
    if (photos.length === 0) {
      if (mediaEmpty) mediaEmpty.classList.remove('is-hidden');
    } else {
      if (mediaEmpty) mediaEmpty.classList.add('is-hidden');
      photos.slice().reverse().forEach(p => {
        const item = document.createElement('div');
        item.className = 'media-grid-item';
        const src = p.imageData || p.text;
        item.innerHTML = `<img src="${src}" alt="Media" loading="lazy">`;
        item.addEventListener('click', () => {
          openChatImageLightbox(src, p.caption || '');
        });
        mediaGrid.appendChild(item);
      });
    }
  }

  // 2. Links
  const urlRegex = /(https?:\/\/[^\s]+)/gi;
  const links = [];
  msgs.forEach(m => {
    if (m.text && typeof m.text === 'string') {
      const found = m.text.match(urlRegex);
      if (found) {
        found.forEach(url => {
          links.push({ url, timestamp: m.timestamp, sender: m.sender });
        });
      }
    }
  });

  const linksList = document.getElementById('chatLinksList');
  const linksEmpty = document.getElementById('chatLinksEmpty');
  const linksCount = document.getElementById('linksCount');
  if (linksCount) linksCount.textContent = links.length;

  if (linksList) {
    linksList.innerHTML = '';
    if (links.length === 0) {
      if (linksEmpty) linksEmpty.classList.remove('is-hidden');
    } else {
      if (linksEmpty) linksEmpty.classList.add('is-hidden');
      links.slice().reverse().forEach(l => {
        const card = document.createElement('div');
        card.className = 'media-link-card';
        const timeStr = l.timestamp ? formatChatTime(l.timestamp) : '';
        card.innerHTML = `
          <span class="media-link-icon">🔗</span>
          <div class="media-link-info">
            <a href="${l.url}" target="_blank" rel="noopener noreferrer">${escapeChatHtml(l.url)}</a>
            <span class="media-link-meta">${timeStr}</span>
          </div>
        `;
        linksList.appendChild(card);
      });
    }
  }

  // 3. Docs & Voice Notes
  const docs = msgs.filter(m => m.type === 'audio' || m.type === 'doc');
  const docsList = document.getElementById('chatDocsList');
  const docsEmpty = document.getElementById('chatDocsEmpty');
  const docsCount = document.getElementById('docsCount');
  if (docsCount) docsCount.textContent = docs.length;

  if (docsList) {
    docsList.innerHTML = '';
    if (docs.length === 0) {
      if (docsEmpty) docsEmpty.classList.remove('is-hidden');
    } else {
      if (docsEmpty) docsEmpty.classList.add('is-hidden');
      docs.slice().reverse().forEach(d => {
        const card = document.createElement('div');
        card.className = 'media-doc-card';
        const timeStr = d.timestamp ? formatChatTime(d.timestamp) : '';
        card.innerHTML = `
          <button class="voice-play-btn" data-audio-src="${d.audioData || ''}" title="Play Voice Note">▶</button>
          <div class="media-doc-info">
            <strong class="media-doc-title">Voice Note (${d.duration || '0:05'})</strong>
            <span class="media-doc-meta">${timeStr}</span>
          </div>
        `;
        const playBtn = card.querySelector('.voice-play-btn');
        if (playBtn) setupVoicePlayListener(playBtn);
        docsList.appendChild(card);
      });
    }
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
    { urls: 'stun:stun4.l.google.com:19302' },
    { urls: 'stun:global.stun.twilio.com:3478' },
    {
      urls: [
        'turn:openrelay.metered.ca:80',
        'turn:openrelay.metered.ca:443',
        'turn:openrelay.metered.ca:443?transport=tcp'
      ],
      username: 'openrelayproject',
      credential: 'openrelayproject'
    }
  ],
  iceCandidatePoolSize: 10
};

let pendingIceCandidates = [];

function addReceivedIceCandidate(candData) {
  if (!candData) return;
  try {
    const candidate = new RTCIceCandidate(candData);
    if (vcState.peerConnection && vcState.peerConnection.remoteDescription && vcState.peerConnection.remoteDescription.type) {
      vcState.peerConnection.addIceCandidate(candidate).catch(err => {
        console.warn('addIceCandidate error:', err);
      });
    } else {
      pendingIceCandidates.push(candidate);
    }
  } catch (err) {
    console.warn('Invalid ICE candidate payload:', err);
  }
}

async function flushPendingIceCandidates() {
  if (!vcState.peerConnection || !vcState.peerConnection.remoteDescription) return;
  while (pendingIceCandidates.length > 0) {
    const cand = pendingIceCandidates.shift();
    try {
      await vcState.peerConnection.addIceCandidate(cand);
    } catch (err) {
      console.warn('Failed to add queued candidate:', err);
    }
  }
}

function handleIncomingVCCandidate(data) {
  if (!data || !data.candidate) return;
  if (data.to && data.to !== currentUser) return;
  if (vcState.callId && data.callId && vcState.callId !== data.callId) return;
  addReceivedIceCandidate(data.candidate);
}

let vcState = {
  callId: null,
  callType: 'video', // 'video' | 'audio'
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

function startAudioCall() {
  playTone(600, 0.1);
  startVideoCall('audio');
}

async function startVideoCall(callType = 'video') {
  vcState.callType = callType;
  const partnerUser = currentUser === 'himanshu' ? 'gullu' : 'himanshu';
  const partnerName = partnerUser === 'himanshu' ? 'Himanshu' : 'Gullu';
  const partnerAvatar = partnerUser === 'himanshu' ? '☕' : '🌸';
  const isAudioOnly = callType === 'audio';

  // Request Microphone, and Camera if video call
  let stream = null;
  try {
    if (isAudioOnly) {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } else {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: vcState.facingMode, width: { ideal: 640 }, height: { ideal: 480 } },
        audio: true
      });
    }
  } catch (err) {
    console.warn('getUserMedia failed with requested constraints:', err);
    if (!isAudioOnly) {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        vcState.callType = 'audio';
      } catch (e2) {
        showVcToast('⚠️ Permission blocked. Opening Backup Couple Room!');
        openJitsiFallbackRoom();
        return;
      }
    } else {
      showVcToast('⚠️ Microphone permission blocked.');
      return;
    }
  }

  vcState.localStream = stream;
  vcState.role = 'caller';
  vcState.callId = 'call_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
  vcState.status = 'outgoing';

  // Attach local stream to PiP if video
  const localVideo = document.getElementById('localVideo');
  if (localVideo) {
    if (!isAudioOnly && vcState.callType === 'video') {
      localVideo.srcObject = stream;
      localVideo.play().catch(() => {});
      localVideo.style.display = 'block';
    } else {
      localVideo.style.display = 'none';
    }
  }

  // Set screens
  const modal = document.getElementById('videoCallModal');
  const outgoingScreen = document.getElementById('vcOutgoingScreen');
  const incomingScreen = document.getElementById('vcIncomingScreen');
  const activeScreen = document.getElementById('vcActiveScreen');
  const audioActiveScreen = document.getElementById('vcAudioActiveScreen');
  const fallbackScreen = document.getElementById('vcFallbackScreen');

  const outAvatar = document.getElementById('vcOutgoingPartnerAvatar');
  const outName = document.getElementById('vcOutgoingPartnerName');
  const outStatus = document.getElementById('vcOutgoingStatusText');
  const outTypeTag = document.getElementById('vcOutgoingCallTypeTag');

  if (outAvatar) outAvatar.textContent = partnerAvatar;
  if (outName) outName.textContent = `Calling ${partnerName}...`;
  if (outStatus) outStatus.textContent = `Ringing ${partnerName}'s phone... 🔔`;
  if (outTypeTag) outTypeTag.textContent = vcState.callType === 'audio' ? '📞 Voice Call' : '📹 Video Call';

  const topAvatar = document.getElementById('vcTopBarAvatar');
  const topName = document.getElementById('vcTopBarName');
  const placeholderAvatar = document.getElementById('vcActivePartnerAvatar');
  if (topAvatar) topAvatar.textContent = partnerAvatar;
  if (topName) topName.textContent = partnerName;
  if (placeholderAvatar) placeholderAvatar.textContent = partnerAvatar;

  // Pre-fill audio partner info
  const audioPartnerAvatar = document.getElementById('vcAudioPartnerAvatar');
  const audioPartnerName = document.getElementById('vcAudioPartnerName');
  if (audioPartnerAvatar) audioPartnerAvatar.textContent = partnerAvatar;
  if (audioPartnerName) audioPartnerName.textContent = partnerName;

  if (outgoingScreen) outgoingScreen.classList.remove('is-hidden');
  if (incomingScreen) incomingScreen.classList.add('is-hidden');
  if (activeScreen) activeScreen.classList.add('is-hidden');
  if (audioActiveScreen) audioActiveScreen.classList.add('is-hidden');
  if (fallbackScreen) fallbackScreen.classList.add('is-hidden');
  if (modal) modal.classList.remove('is-hidden');

  startOutgoingRingtone();

  // 30-second unattended call timeout -> Missed call log
  if (vcState.callTimeoutTimer) clearTimeout(vcState.callTimeoutTimer);
  vcState.callTimeoutTimer = setTimeout(() => {
    if (vcState.status === 'outgoing') {
      endVideoCall('No answer from partner (30s) ⏳');
      const isAudio = vcState.callType === 'audio';
      sendChatMessage(isAudio ? 'Missed voice call 📞' : 'Missed video call 📹', 'call', {
        callType: vcState.callType,
        missed: true
      });
    }
  }, 30000);

  // Create WebRTC Peer Connection
  const pc = new RTCPeerConnection(RTC_CONFIG);
  vcState.peerConnection = pc;

  stream.getTracks().forEach(track => pc.addTrack(track, stream));

  pc.ontrack = (event) => {
    const remoteVideo = document.getElementById('remoteVideo');
    const remoteAudio = document.getElementById('remoteAudioStream');
    const placeholder = document.getElementById('remoteVideoPlaceholder');
    if (event.streams && event.streams[0]) {
      vcState.remoteStream = event.streams[0];
      if (remoteVideo) {
        remoteVideo.srcObject = event.streams[0];
        remoteVideo.play().catch(() => {});
      }
      if (remoteAudio) {
        remoteAudio.srcObject = event.streams[0];
        remoteAudio.play().catch(() => {});
      }
      if (placeholder) placeholder.style.display = 'none';
    }
  };

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      const candJSON = event.candidate.toJSON();
      if (firebaseDb) {
        firebaseDb.ref('our_story/webrtc_call/callerCandidates').push(candJSON);
      }
      broadcastUpdate('VC_CANDIDATE', {
        callId: vcState.callId,
        role: 'caller',
        candidate: candJSON,
        from: currentUser,
        to: partnerUser
      }, false);
    }
  };

  try {
    const offer = await pc.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: vcState.callType === 'video'
    });
    await pc.setLocalDescription(offer);

    const callPayload = {
      callId: vcState.callId,
      callType: vcState.callType,
      from: currentUser,
      to: partnerUser,
      status: 'calling',
      sdpOffer: JSON.stringify(offer),
      timestamp: Date.now()
    };

    // Clear candidates and write offer
    if (firebaseDb) {
      firebaseDb.ref('our_story/webrtc_call/callerCandidates').set(null);
      firebaseDb.ref('our_story/webrtc_call/calleeCandidates').set(null);
      firebaseDb.ref('our_story/webrtc_call/callMeta').set(callPayload);
    }

    // Broadcast for MQTT & push notification
    broadcastUpdate('VC_CALL', callPayload, false);

    // Listen for Callee candidates
    if (firebaseDb) {
      attachFirebaseListener('webrtc_callee_candidates', firebaseDb.ref('our_story/webrtc_call/calleeCandidates'), 'child_added', (snapshot) => {
        const candidateData = snapshot.val();
        if (candidateData) {
          addReceivedIceCandidate(candidateData);
        }
      }, false);
    }
  } catch (err) {
    console.error('Error starting video/audio call:', err);
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
  vcState.callType = callData.callType || 'video';
  vcState.role = 'callee';
  vcState.status = 'incoming';
  vcState.pendingOffer = callData.sdpOffer;

  const modal = document.getElementById('videoCallModal');
  const outgoingScreen = document.getElementById('vcOutgoingScreen');
  const incomingScreen = document.getElementById('vcIncomingScreen');
  const activeScreen = document.getElementById('vcActiveScreen');
  const audioActiveScreen = document.getElementById('vcAudioActiveScreen');
  const fallbackScreen = document.getElementById('vcFallbackScreen');

  const inAvatar = document.getElementById('vcIncomingPartnerAvatar');
  const inName = document.getElementById('vcIncomingPartnerName');
  const inTag = document.getElementById('vcIncomingCallTypeTag');
  const inStatus = document.getElementById('vcIncomingStatusText');

  if (inAvatar) inAvatar.textContent = callerAvatar;
  if (inName) inName.textContent = `${callerName} is calling!`;
  if (inTag) inTag.textContent = vcState.callType === 'audio' ? 'INCOMING VOICE CALL 📞' : 'INCOMING VIDEO CALL 📹';
  if (inStatus) inStatus.textContent = vcState.callType === 'audio'
    ? 'Hear the sweetness of your love... Voice Call ❤️'
    : 'Feel the warmth... Video call with your love ❤️';

  const topAvatar = document.getElementById('vcTopBarAvatar');
  const topName = document.getElementById('vcTopBarName');
  const placeholderAvatar = document.getElementById('vcActivePartnerAvatar');
  if (topAvatar) topAvatar.textContent = callerAvatar;
  if (topName) topName.textContent = callerName;
  if (placeholderAvatar) placeholderAvatar.textContent = callerAvatar;

  const audioPartnerAvatar = document.getElementById('vcAudioPartnerAvatar');
  const audioPartnerName = document.getElementById('vcAudioPartnerName');
  if (audioPartnerAvatar) audioPartnerAvatar.textContent = callerAvatar;
  if (audioPartnerName) audioPartnerName.textContent = callerName;

  if (outgoingScreen) outgoingScreen.classList.add('is-hidden');
  if (incomingScreen) incomingScreen.classList.remove('is-hidden');
  if (activeScreen) activeScreen.classList.add('is-hidden');
  if (audioActiveScreen) audioActiveScreen.classList.add('is-hidden');
  if (fallbackScreen) fallbackScreen.classList.add('is-hidden');
  if (modal) modal.classList.remove('is-hidden');

  startIncomingRingtone();
  showVcToast(`${vcState.callType === 'audio' ? '📞 Voice' : '📹 Video'} Call from ${callerName}! Tap Accept ❤️`);

  // 30-second unattended incoming call timeout -> Missed call log
  if (vcState.incomingTimeoutTimer) clearTimeout(vcState.incomingTimeoutTimer);
  vcState.incomingTimeoutTimer = setTimeout(() => {
    if (vcState.status === 'incoming') {
      declineIncomingCall();
      const isAudio = vcState.callType === 'audio';
      sendChatMessage(isAudio ? 'Missed voice call 📞' : 'Missed video call 📹', 'call', {
        callType: vcState.callType,
        missed: true
      });
    }
  }, 30000);
}

async function acceptIncomingCall() {
  stopIncomingRingtone();
  if (vcState.incomingTimeoutTimer) {
    clearTimeout(vcState.incomingTimeoutTimer);
    vcState.incomingTimeoutTimer = null;
  }

  const callerUser = currentUser === 'himanshu' ? 'gullu' : 'himanshu';
  const isAudioOnly = vcState.callType === 'audio';

  let stream = null;
  try {
    if (isAudioOnly) {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } else {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: vcState.facingMode, width: { ideal: 640 }, height: { ideal: 480 } },
        audio: true
      });
    }
  } catch (err) {
    console.warn('getUserMedia failed in acceptIncomingCall:', err);
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      vcState.callType = 'audio';
    } catch (e2) {
      showVcToast('⚠️ Permission blocked. Opening Backup Couple Room!');
      openJitsiFallbackRoom();
      return;
    }
  }

  vcState.localStream = stream;
  vcState.status = 'active';

  const localVideo = document.getElementById('localVideo');
  if (localVideo) {
    if (vcState.callType === 'video') {
      localVideo.srcObject = stream;
      localVideo.play().catch(() => {});
      localVideo.style.display = 'block';
    } else {
      localVideo.style.display = 'none';
    }
  }

  switchToActiveCallScreen();

  const pc = new RTCPeerConnection(RTC_CONFIG);
  vcState.peerConnection = pc;

  stream.getTracks().forEach(track => pc.addTrack(track, stream));

  pc.ontrack = (event) => {
    const remoteVideo = document.getElementById('remoteVideo');
    const remoteAudio = document.getElementById('remoteAudioStream');
    const placeholder = document.getElementById('remoteVideoPlaceholder');
    if (event.streams && event.streams[0]) {
      vcState.remoteStream = event.streams[0];
      if (remoteVideo) {
        remoteVideo.srcObject = event.streams[0];
        remoteVideo.play().catch(() => {});
      }
      if (remoteAudio) {
        remoteAudio.srcObject = event.streams[0];
        remoteAudio.play().catch(() => {});
      }
      if (placeholder) placeholder.style.display = 'none';
    }
  };

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      const candJSON = event.candidate.toJSON();
      if (firebaseDb) {
        firebaseDb.ref('our_story/webrtc_call/calleeCandidates').push(candJSON);
      }
      broadcastUpdate('VC_CANDIDATE', {
        callId: vcState.callId,
        role: 'callee',
        candidate: candJSON,
        from: currentUser,
        to: callerUser
      }, false);
    }
  };

  try {
    const offerObj = JSON.parse(vcState.pendingOffer);
    await pc.setRemoteDescription(new RTCSessionDescription(offerObj));
    await flushPendingIceCandidates();

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    if (firebaseDb) {
      firebaseDb.ref('our_story/webrtc_call/callMeta').update({
        status: 'accepted',
        callType: vcState.callType,
        sdpAnswer: JSON.stringify(answer)
      });
    }

    broadcastUpdate('VC_SIGNAL', {
      callId: vcState.callId,
      callType: vcState.callType,
      status: 'accepted',
      sdpAnswer: JSON.stringify(answer),
      from: currentUser,
      to: callerUser
    }, false);

    if (firebaseDb) {
      attachFirebaseListener('webrtc_caller_candidates', firebaseDb.ref('our_story/webrtc_call/callerCandidates'), 'child_added', (snapshot) => {
        const candidateData = snapshot.val();
        if (candidateData) {
          addReceivedIceCandidate(candidateData);
        }
      }, false);
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
  if (callData.callType) vcState.callType = callData.callType;
  switchToActiveCallScreen();

  if (callData.sdpAnswer && vcState.peerConnection) {
    try {
      const answerObj = JSON.parse(callData.sdpAnswer);
      await vcState.peerConnection.setRemoteDescription(new RTCSessionDescription(answerObj));
      await flushPendingIceCandidates();
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
  const audioActiveScreen = document.getElementById('vcAudioActiveScreen');
  const fallbackScreen = document.getElementById('vcFallbackScreen');

  if (outgoingScreen) outgoingScreen.classList.add('is-hidden');
  if (incomingScreen) incomingScreen.classList.add('is-hidden');
  if (fallbackScreen) fallbackScreen.classList.add('is-hidden');
  if (modal) modal.classList.remove('is-hidden');

  if (vcState.callType === 'audio') {
    if (activeScreen) activeScreen.classList.add('is-hidden');
    if (audioActiveScreen) audioActiveScreen.classList.remove('is-hidden');
  } else {
    if (audioActiveScreen) audioActiveScreen.classList.add('is-hidden');
    if (activeScreen) activeScreen.classList.remove('is-hidden');
  }

  startCallDurationTimer();
}

function startCallDurationTimer() {
  stopCallDurationTimer();
  vcState.callDurationSeconds = 0;
  const timerText = document.getElementById('vcCallTimerText');
  const audioTimerText = document.getElementById('vcAudioCallTimerText');
  const miniTimer = document.getElementById('vcMiniTimer');
  if (timerText) timerText.textContent = '00:00';
  if (audioTimerText) audioTimerText.textContent = '00:00';
  if (miniTimer) miniTimer.textContent = '00:00';

  vcState.timerInterval = setInterval(() => {
    vcState.callDurationSeconds++;
    const mins = Math.floor(vcState.callDurationSeconds / 60);
    const secs = vcState.callDurationSeconds % 60;
    const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    if (timerText) timerText.textContent = formatted;
    if (audioTimerText) audioTimerText.textContent = formatted;
    if (miniTimer) miniTimer.textContent = formatted;
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

  const partnerUser = currentUser === 'himanshu' ? 'gullu' : 'himanshu';
  const durationSec = vcState.callDurationSeconds;
  const currentCallType = vcState.callType;

  stopCallDurationTimer();

  // If call had active duration, log to couple chat!
  if (durationSec > 0) {
    const mins = Math.floor(durationSec / 60);
    const secs = durationSec % 60;
    const durFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    const callLabel = currentCallType === 'audio' ? '📞 Audio Call' : '📹 Video Call';
    sendChatMessage(`${callLabel} • ${durFormatted}`, 'call', {
      callType: currentCallType,
      duration: durFormatted
    });
  }

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
  detachFirebaseListener('webrtc_callee_candidates');
  detachFirebaseListener('webrtc_caller_candidates');

  if (vcState.callTimeoutTimer) {
    clearTimeout(vcState.callTimeoutTimer);
    vcState.callTimeoutTimer = null;
  }
  if (vcState.incomingTimeoutTimer) {
    clearTimeout(vcState.incomingTimeoutTimer);
    vcState.incomingTimeoutTimer = null;
  }
  stopOutgoingRingtone();
  stopIncomingRingtone();
  stopCallDurationTimer();
  pendingIceCandidates = [];

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
  const remoteAudio = document.getElementById('remoteAudioStream');
  const placeholder = document.getElementById('remoteVideoPlaceholder');
  const iframeContainer = document.getElementById('vcIframeContainer');

  if (localVideo) localVideo.srcObject = null;
  if (remoteVideo) remoteVideo.srcObject = null;
  if (remoteAudio) remoteAudio.srcObject = null;
  if (placeholder) placeholder.style.display = 'flex';
  if (iframeContainer) iframeContainer.innerHTML = '';

  const modal = document.getElementById('videoCallModal');
  const activeScreen = document.getElementById('vcActiveScreen');
  const audioActiveScreen = document.getElementById('vcAudioActiveScreen');
  const miniWidget = document.getElementById('vcMiniWidget');
  const filtersTray = document.getElementById('igFiltersTray');

  if (modal) modal.classList.add('is-hidden');
  if (activeScreen) activeScreen.classList.add('is-hidden');
  if (audioActiveScreen) audioActiveScreen.classList.add('is-hidden');
  if (miniWidget) miniWidget.classList.add('is-hidden');
  if (filtersTray) filtersTray.classList.add('is-hidden');

  applyVcFilter('normal');
  isVcSwapped = false;

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
  if (camIcon) camIcon.textContent = '📹';

  const audioMicBtn = document.getElementById('vcAudioToggleMicBtn');
  const audioMicIcon = document.getElementById('vcAudioMicIcon');
  if (audioMicBtn) audioMicBtn.classList.remove('active-off');
  if (audioMicIcon) audioMicIcon.textContent = '🎙️';
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

  const audioMicBtn = document.getElementById('vcAudioToggleMicBtn');
  const audioMicIcon = document.getElementById('vcAudioMicIcon');
  if (audioMicBtn) audioMicBtn.classList.toggle('active-off', vcState.isMicMuted);
  if (audioMicIcon) audioMicIcon.textContent = vcState.isMicMuted ? '🔇' : '🎙️';

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

async function switchAudioToVideoCall() {
  if (vcState.status !== 'active') return;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: vcState.facingMode, width: { ideal: 640 }, height: { ideal: 480 } }
    });
    const videoTrack = stream.getVideoTracks()[0];
    if (vcState.peerConnection) {
      const sender = vcState.peerConnection.getSenders().find(s => s.track && s.track.kind === 'video');
      if (sender) {
        sender.replaceTrack(videoTrack);
      } else {
        vcState.peerConnection.addTrack(videoTrack, vcState.localStream);
      }
    }
    if (vcState.localStream) {
      vcState.localStream.addTrack(videoTrack);
    }
    const localVideo = document.getElementById('localVideo');
    if (localVideo) {
      localVideo.srcObject = vcState.localStream;
      localVideo.play().catch(() => {});
      localVideo.style.display = 'block';
    }
    vcState.callType = 'video';
    switchToActiveCallScreen();
    showVcToast('📹 Switched to Video Call!');
  } catch (err) {
    console.warn('Switch to video error:', err);
    showVcToast('⚠️ Camera permission required for video');
  }
}

function sendLoveHeartTapInCall() {
  triggerFloatingHeartAnimation();
  const partnerUser = currentUser === 'himanshu' ? 'gullu' : 'himanshu';
  broadcastUpdate('VC_HEART', { from: currentUser, to: partnerUser }, false);
  playTone(880, 0.25, 'sine', 0.2);
}

// --- INSTAGRAM VIDEO CALL CONTROLS & EFFECTS ---
let isVcSwapped = false;
let currentVcFilter = 'normal';

function minimizeVideoCall() {
  const modal = document.getElementById('videoCallModal');
  const miniWidget = document.getElementById('vcMiniWidget');
  const miniAvatar = document.getElementById('vcMiniAvatar');
  const miniName = document.getElementById('vcMiniName');
  const miniTimer = document.getElementById('vcMiniTimer');
  const partnerUser = currentUser === 'himanshu' ? 'gullu' : 'himanshu';
  const partnerName = partnerUser === 'himanshu' ? 'Himanshu' : 'Gullu';
  const partnerAvatar = partnerUser === 'himanshu' ? '☕' : '🌸';

  if (miniAvatar) miniAvatar.textContent = partnerAvatar;
  if (miniName) miniName.textContent = partnerName;
  if (miniTimer) {
    const mins = Math.floor(vcState.callDurationSeconds / 60);
    const secs = vcState.callDurationSeconds % 60;
    miniTimer.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  if (modal) modal.classList.add('is-hidden');
  if (miniWidget) miniWidget.classList.remove('is-hidden');
  showVcToast('Call minimized. You can continue chatting! 📱');
}

function maximizeVideoCall() {
  const modal = document.getElementById('videoCallModal');
  const miniWidget = document.getElementById('vcMiniWidget');
  if (miniWidget) miniWidget.classList.add('is-hidden');
  if (modal) modal.classList.remove('is-hidden');
}

function swapVcCameraViews() {
  const localVideo = document.getElementById('localVideo');
  const remoteVideo = document.getElementById('remoteVideo');
  const pipBadge = document.querySelector('.ig-pip-overlay-badge');
  if (!localVideo || !remoteVideo) return;

  isVcSwapped = !isVcSwapped;
  if (isVcSwapped) {
    localVideo.srcObject = vcState.remoteStream;
    remoteVideo.srcObject = vcState.localStream;
    localVideo.style.transform = 'none';
    remoteVideo.style.transform = vcState.facingMode === 'user' ? 'scaleX(-1)' : 'none';
    if (pipBadge) pipBadge.textContent = currentUser === 'himanshu' ? 'Gullu' : 'Himanshu';
  } else {
    localVideo.srcObject = vcState.localStream;
    remoteVideo.srcObject = vcState.remoteStream;
    localVideo.style.transform = vcState.facingMode === 'user' ? 'scaleX(-1)' : 'none';
    remoteVideo.style.transform = 'none';
    if (pipBadge) pipBadge.textContent = 'You';
  }
  playTone(700, 0.1);
}

function applyVcFilter(filterName) {
  currentVcFilter = filterName || 'normal';
  const localVideo = document.getElementById('localVideo');
  const remoteVideo = document.getElementById('remoteVideo');
  const allFilterItems = document.querySelectorAll('.ig-filter-item');

  allFilterItems.forEach(item => {
    item.classList.toggle('active', item.dataset.filter === currentVcFilter);
  });

  const filterClass = `ig-filter-${currentVcFilter}`;
  const FILTER_CLASSES = ['ig-filter-normal', 'ig-filter-golden-hour', 'ig-filter-paris-blush', 'ig-filter-love-romance', 'ig-filter-vintage-90s', 'ig-filter-moody-bnw'];

  [localVideo, remoteVideo].forEach(el => {
    if (el) {
      FILTER_CLASSES.forEach(c => el.classList.remove(c));
      el.classList.add(filterClass);
    }
  });

  playTone(800, 0.08);
}

function triggerFloatingHeartAnimation() {
  const overlay = document.getElementById('vcHeartsOverlay');
  if (!overlay) return;

  const heartEmojis = ['❤️', '💖', '🔥', '😍', '🥰', '✨', '🌸', '💋', '💕'];
  for (let i = 0; i < 8; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'ig-floating-heart';
      el.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
      el.style.right = (16 + Math.random() * 55) + 'px';
      el.style.fontSize = (1.6 + Math.random() * 1.2) + 'rem';
      overlay.appendChild(el);

      setTimeout(() => el.remove(), 2300);
    }, i * 90);
  }
}

function openJitsiFallbackRoom() {
  const modal = document.getElementById('videoCallModal');
  const outgoingScreen = document.getElementById('vcOutgoingScreen');
  const incomingScreen = document.getElementById('vcIncomingScreen');
  const activeScreen = document.getElementById('vcActiveScreen');
  const audioActiveScreen = document.getElementById('vcAudioActiveScreen');
  const fallbackScreen = document.getElementById('vcFallbackScreen');
  const iframeContainer = document.getElementById('vcIframeContainer');

  stopOutgoingRingtone();
  stopIncomingRingtone();

  if (outgoingScreen) outgoingScreen.classList.add('is-hidden');
  if (incomingScreen) incomingScreen.classList.add('is-hidden');
  if (activeScreen) activeScreen.classList.add('is-hidden');
  if (audioActiveScreen) audioActiveScreen.classList.add('is-hidden');
  if (fallbackScreen) fallbackScreen.classList.remove('is-hidden');
  if (modal) modal.classList.remove('is-hidden');

  const myDisplayName = currentUser === 'himanshu' ? 'Himanshu' : 'Gullu';
  const roomName = 'OurStoryCoupleHimanshuGulluSecret2026';
  const jitsiUrl = `https://meet.jit.si/${roomName}#userInfo.displayName="${myDisplayName}"&config.prejoinPageEnabled=false&config.startWithAudioMuted=false&config.startWithVideoMuted=false`;

  if (iframeContainer) {
    iframeContainer.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;padding:20px;text-align:center;gap:14px;">
        <div style="font-size:3.2rem;">🔒📱</div>
        <h3 style="color:#f5c366;margin:0;font-size:1.25rem;">Private Couple Backup Call</h3>
        <p style="color:#d1d7db;font-size:0.92rem;max-width:320px;line-height:1.45;margin:0;">High-security backup room for Himanshu & Gullu. Connect instantly!</p>
        <button type="button" id="openExternalJitsiBtn" style="background:#00a884;color:#fff;border:none;padding:12px 24px;border-radius:22px;font-weight:700;font-size:0.95rem;cursor:pointer;box-shadow:0 6px 18px rgba(0,168,132,0.4);display:flex;align-items:center;gap:8px;">
          <span>📞 Join Private Backup Room</span>
        </button>
        <iframe src="${jitsiUrl}" allow="camera; microphone; fullscreen; display-capture; autoplay" style="width:100%;flex:1;border:none;border-radius:12px;min-height:220px;margin-top:6px;"></iframe>
      </div>
    `;
    const openBtn = iframeContainer.querySelector('#openExternalJitsiBtn');
    if (openBtn) {
      openBtn.addEventListener('click', () => {
        window.open(jitsiUrl, '_blank');
      });
    }
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
      startVideoCall('video');
    });
  }

  const chatAudioBtn = document.getElementById('chatStartAudioBtn');
  if (chatAudioBtn) {
    chatAudioBtn.addEventListener('click', () => {
      startAudioCall();
    });
  }

  const chatVcBtn = document.getElementById('chatStartVcBtn');
  if (chatVcBtn) {
    chatVcBtn.addEventListener('click', () => {
      playTone(600, 0.1);
      startVideoCall('video');
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

  // Video Active Screen Controls
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

  // Audio Active Screen Controls
  const audioMicBtn = document.getElementById('vcAudioToggleMicBtn');
  if (audioMicBtn) {
    audioMicBtn.addEventListener('click', toggleMicrophone);
  }

  const audioSpeakerBtn = document.getElementById('vcAudioSpeakerBtn');
  if (audioSpeakerBtn) {
    audioSpeakerBtn.addEventListener('click', () => {
      playTone(750, 0.15);
      showVcToast('🔊 High-definition audio speaker active');
    });
  }

  const audioSwitchVideoBtn = document.getElementById('vcAudioSwitchVideoBtn');
  if (audioSwitchVideoBtn) {
    audioSwitchVideoBtn.addEventListener('click', switchAudioToVideoCall);
  }

  const audioHeartBtn = document.getElementById('vcAudioSendHeartBtn');
  if (audioHeartBtn) {
    audioHeartBtn.addEventListener('click', sendLoveHeartTapInCall);
  }

  const audioEndBtn = document.getElementById('vcAudioEndCallBtn');
  if (audioEndBtn) {
    audioEndBtn.addEventListener('click', () => endVideoCall('Voice call ended with love ❤️'));
  }

  const jitsiBtn = document.getElementById('vcJitsiFallbackBtn');
  if (jitsiBtn) {
    jitsiBtn.addEventListener('click', openJitsiFallbackRoom);
  }

  const closeFallbackBtn = document.getElementById('vcCloseFallbackBtn');
  if (closeFallbackBtn) {
    closeFallbackBtn.addEventListener('click', () => cleanupCallState());
  }

  // Instagram VC specific listeners
  const minimizeBtn = document.getElementById('vcMinimizeBtn');
  if (minimizeBtn) {
    minimizeBtn.addEventListener('click', minimizeVideoCall);
  }

  const miniExpandBtn = document.getElementById('vcMiniExpandBtn');
  if (miniExpandBtn) {
    miniExpandBtn.addEventListener('click', maximizeVideoCall);
  }

  const miniEndBtn = document.getElementById('vcMiniEndBtn');
  if (miniEndBtn) {
    miniEndBtn.addEventListener('click', () => endVideoCall('Call ended with love ❤️'));
  }

  const localPip = document.getElementById('vcLocalPip');
  if (localPip) {
    localPip.addEventListener('click', swapVcCameraViews);
  }

  const filterToggleBtn = document.getElementById('vcFilterToggleBtn');
  if (filterToggleBtn) {
    filterToggleBtn.addEventListener('click', () => {
      const tray = document.getElementById('igFiltersTray');
      if (tray) tray.classList.toggle('is-hidden');
    });
  }

  const flipDockBtn = document.getElementById('vcFlipCamDockBtn');
  if (flipDockBtn) {
    flipDockBtn.addEventListener('click', flipCameraFacing);
  }

  document.querySelectorAll('.ig-filter-item').forEach(item => {
    item.addEventListener('click', () => {
      applyVcFilter(item.dataset.filter);
    });
  });
}

// ==========================================================================
// UNIVERSAL PHOTO LIGHTBOX & SOURCE SELECTOR
// ==========================================================================

let currentPhotoTarget = 'vault';

function promptPhotoSource(target = 'vault') {
  currentPhotoTarget = target;
  const modal = document.getElementById('photoSourceModal');
  if (modal) {
    modal.classList.remove('is-hidden');
    modal.classList.add('open');
  }
}

function closePhotoSourceModal() {
  const modal = document.getElementById('photoSourceModal');
  if (modal) {
    modal.classList.add('is-hidden');
    modal.classList.remove('open');
  }
}

function triggerPhotoSelection(sourceType) {
  closePhotoSourceModal();
  if (currentPhotoTarget === 'vault') {
    if (sourceType === 'camera') {
      const cam = document.getElementById('memoryFileInputCamera');
      if (cam) cam.click();
    } else {
      const gal = document.getElementById('memoryFileInputGallery') || document.getElementById('memoryFileInput');
      if (gal) gal.click();
    }
  } else if (currentPhotoTarget === 'chat') {
    if (sourceType === 'camera') {
      const cam = document.getElementById('chatImageInputCamera');
      if (cam) cam.click();
    } else {
      const gal = document.getElementById('chatImageInputGallery') || document.getElementById('chatImageInput');
      if (gal) gal.click();
    }
  }
}

function openPhotoLightbox(rawSrc, title = 'Our Memory 📸', caption = '', subText = '') {
  if (!rawSrc) return;
  const modal = document.getElementById('photoLightboxModal');
  const img = document.getElementById('photoLightboxImg');
  const cap = document.getElementById('photoLightboxCaption');
  const titleEl = document.getElementById('photoLightboxTitle');
  const subEl = document.getElementById('photoLightboxSub');
  const downloadBtn = document.getElementById('photoLightboxDownloadBtn');
  const footerDownloadBtn = document.getElementById('lightboxFooterDownloadBtn');
  const footerShareBtn = document.getElementById('lightboxFooterShareBtn');

  if (titleEl) titleEl.textContent = title;
  if (cap) cap.textContent = caption || '';
  if (subEl) subEl.textContent = subText || '';

  const cleanFilename = `OurStory_${Date.now()}.jpg`;

  if (downloadBtn) {
    downloadBtn.onclick = (e) => {
      e.preventDefault();
      downloadPhotoFile(rawSrc, cleanFilename, caption);
    };
  }

  if (footerDownloadBtn) {
    footerDownloadBtn.onclick = (e) => {
      e.preventDefault();
      downloadPhotoFile(rawSrc, cleanFilename, caption);
    };
  }

  if (footerShareBtn) {
    footerShareBtn.onclick = (e) => {
      e.preventDefault();
      sharePhotoFile(rawSrc, cleanFilename, caption);
    };
  }

  if (modal) {
    modal.classList.remove('is-hidden');
    modal.classList.add('open');
  }

  resolveMediaUrl(rawSrc).then(src => {
    if (src && img) img.src = src;
  });
}

function closePhotoLightbox() {
  const modal = document.getElementById('photoLightboxModal');
  if (modal) {
    modal.classList.add('is-hidden');
    modal.classList.remove('open');
  }
  const img = document.getElementById('photoLightboxImg');
  if (img) img.src = '';
}

function setupUniversalPhotoFeatures() {
  // 1. Photo Source Action Sheet Buttons
  const camBtn = document.getElementById('sourceCameraBtn');
  if (camBtn) camBtn.addEventListener('click', () => triggerPhotoSelection('camera'));

  const galBtn = document.getElementById('sourceGalleryBtn');
  if (galBtn) galBtn.addEventListener('click', () => triggerPhotoSelection('gallery'));

  const cancelBtn = document.getElementById('sourceCancelBtn');
  if (cancelBtn) cancelBtn.addEventListener('click', closePhotoSourceModal);

  const sourceModal = document.getElementById('photoSourceModal');
  if (sourceModal) {
    sourceModal.addEventListener('click', (e) => {
      if (e.target === sourceModal) closePhotoSourceModal();
    });
  }

  // 2. Lightbox Close Buttons
  const closeBtn = document.getElementById('closePhotoLightboxBtn');
  if (closeBtn) closeBtn.addEventListener('click', closePhotoLightbox);

  const lightboxModal = document.getElementById('photoLightboxModal');
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal || e.target.id === 'photoLightboxBody') closePhotoLightbox();
    });
  }

  // Escape key to dismiss modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closePhotoLightbox();
      closePhotoSourceModal();
    }
  });
}

// ==========================================================================
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
  safeInit('checkAndApplyForcedAppUpdate', checkAndApplyForcedAppUpdate);
  safeInit('setupChatUI', setupChatUI);
  safeInit('setupVideoCallEngine', setupVideoCallEngine);
  safeInit('setupUniversalPhotoFeatures', setupUniversalPhotoFeatures);
  safeInit('setupHimanshuPauseControl', setupHimanshuPauseControl);
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

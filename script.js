/* ==========================================================================
   OUR STORY ✨ - INTERACTIVE JAVASCRIPT
   Himanshu & Gullu Couple App
   ========================================================================== */

let currentUser = 'himanshu'; // 'himanshu' or 'gullu'
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
  { id: 'matargashti', title: "Matargashti", artist: "Mohit Chauhan", vibe: "Silly Pout & Banter 🤪", ytId: "6vKucgAeF_Q" },
  { id: 'cardigan', title: "Cardigan", artist: "Taylor Swift", vibe: "Cozy Weather & Warm Tea 🍂", ytId: "K-a8s8OLBSE" },
  { id: 'peeloon', title: "Pee Loon", artist: "Mohit Chauhan", vibe: "Soulful Eyes & Dimples 🌸", ytId: "yW8D_u2v0-w" },
  { id: 'untilifoundyou', title: "Until I Found You", artist: "Stephen Sanchez", vibe: "Retro Slow Dance 🕊️", ytId: "GxldQ9eX2wo" }
];

let selectedSongIndex = 0;

// --- CURATED AI COMPLIMENTS POOL ---
const COMPLIMENT_POOL = [
  "Pout Queen level 100! Smile itni bright ki cafe ki light bhi fail ho gayi. ☕✨",
  "Warning: Pout level critical! Ha wahi suar waala pout jispe sabse zyada pyaar aata hai. 🐷👑",
  "Kch galtiya me jan bujh k krta hu taki tum dato — aur aaj bhi daant padne wali hai! 😉❤️",
  "Woh signature dimple aur sparkling aankhein... room ki saari attention chura li inhone! 🌸",
  "Coffee thandi ho sakti hai, par aap dono ki chemistry hamesha 100°C rehti hai! 🔥☕",
  "Main character aura on point! Gullu exists and suddenly everything else feels secondary. 👸✨",
  "Tum mujhe khud se bhi zyada ache se jaanti ho — aur yeh photo wahi bond prove karti hai. ❤️",
  "Hum tum ek kamre me band ho aur chabhi kho jaye... is photo me wahi wali daydream vibe hai! 🗝️"
];

let selectedComplimentIndex = 0;

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

// --- FETCH & SYNC APP STATE ---
const CACHE_KEY = 'our_story_cache_v2';
// Invalidate any old cache from previous test runs (e.g., 28 days or 1 dummy memory)
if (localStorage.getItem('our_story_fresh_v2') !== 'done') {
  localStorage.removeItem('our_story_cache');
  localStorage.setItem('our_story_fresh_v2', 'done');
}

async function fetchState() {
  try {
    const res = await fetch('/api/state?t=' + Date.now());
    if (res.ok) {
      appState = await res.json();
      localStorage.setItem(CACHE_KEY, JSON.stringify(appState));
    }
  } catch (e) {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try { appState = JSON.parse(cached); } catch (err) {}
    }
  }
  if (appState) {
    renderAll();
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
}

// Switch Active Profile (Himanshu vs Gullu)
function setupProfileSwitcher() {
  const pillH = document.getElementById('pillHimanshu');
  const pillG = document.getElementById('pillGullu');

  if (pillH) {
    pillH.addEventListener('click', () => {
      currentUser = 'himanshu';
      playTone(440, 0.15);
      renderAll();
    });
  }

  if (pillG) {
    pillG.addEventListener('click', () => {
      currentUser = 'gullu';
      playTone(554.37, 0.15);
      renderAll();
    });
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

// --- 3. MEMORY VAULT LOGIC ---
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
  const saveMemoryBtn = document.getElementById('saveMemoryBtn');
  const smartCard = document.getElementById('smartMatchCard');

  // Mode Toggle
  if (modeTogether && modeApart) {
    modeTogether.addEventListener('click', () => {
      currentMode = 'together';
      modeTogether.classList.add('active');
      modeApart.classList.remove('active');
      if (currentPreviewBase64) pickRandomMatching(true);
    });

    modeApart.addEventListener('click', () => {
      currentMode = 'apart';
      modeApart.classList.add('active');
      modeTogether.classList.remove('active');
      if (currentPreviewBase64) pickRandomMatching(false);
    });
  }

  // Photo Input Trigger
  if (dropzone && fileInput) {
    dropzone.addEventListener('click', (e) => {
      if (e.target !== removePhotoBtn) fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          currentPreviewBase64 = event.target.result;
          previewImg.src = currentPreviewBase64;
          dropzoneEmpty.style.display = 'none';
          dropzonePreview.style.display = 'block';
          
          // REVEAL AI compliment & song matching ONLY when a picture is uploaded!
          if (smartCard) smartCard.style.display = 'flex';
          pickRandomMatching();
          playCelebrationChime();
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (removePhotoBtn) {
    removePhotoBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentPreviewBase64 = null;
      dropzonePreview.style.display = 'none';
      dropzoneEmpty.style.display = 'block';
      fileInput.value = '';
      // HIDE AI compliment & song when photo is removed
      if (smartCard) smartCard.style.display = 'none';
    });
  }

  if (shuffleComplimentBtn) {
    shuffleComplimentBtn.addEventListener('click', () => {
      selectedComplimentIndex = (selectedComplimentIndex + 1) % COMPLIMENT_POOL.length;
      document.getElementById('smartComplimentText').textContent = `"${COMPLIMENT_POOL[selectedComplimentIndex]}"`;
      playTone(520, 0.15);
    });
  }

  if (shuffleSongBtn) {
    shuffleSongBtn.addEventListener('click', () => {
      selectedSongIndex = (selectedSongIndex + 1) % SONG_CATALOG.length;
      const song = SONG_CATALOG[selectedSongIndex];
      document.getElementById('smartSongText').innerHTML = `<strong>${song.title}</strong> • ${song.artist} <span style="color:var(--text-muted); font-size:0.75rem;">(${song.vibe})</span>`;
      playTone(680, 0.15);
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
      const compliment = COMPLIMENT_POOL[selectedComplimentIndex];
      const song = SONG_CATALOG[selectedSongIndex];

      const payload = {
        mode: currentMode,
        author: currentMode === 'together' ? 'Himanshu & Gullu' : (currentUser === 'himanshu' ? 'Himanshu' : 'Gullu'),
        photoUrl: currentPreviewBase64,
        caption: caption,
        compliment: compliment,
        song: song
      };

      saveMemoryBtn.textContent = 'Saving to Vault... 💖';

      try {
        const res = await fetch('/api/memory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          playCelebrationChime();
          showAppModal('💖 Memory Saved!', `Your daily memory with "${song.title}" is permanently stored in your Forever Scrapbook!`);
          document.getElementById('memoryCaptionInput').value = '';
          if (smartCard) smartCard.style.display = 'none';
          if (removePhotoBtn) removePhotoBtn.click();
          fetchState();
        }
      } catch (err) {
        console.error("Save memory error:", err);
      } finally {
        saveMemoryBtn.textContent = '💖 Save to Our Forever Vault';
      }
    });
  }
}

function pickRandomMatching(isTogether = true) {
  selectedComplimentIndex = Math.floor(Math.random() * COMPLIMENT_POOL.length);
  selectedSongIndex = Math.floor(Math.random() * SONG_CATALOG.length);

  const compEl = document.getElementById('smartComplimentText');
  const songEl = document.getElementById('smartSongText');

  if (compEl) compEl.textContent = `"${COMPLIMENT_POOL[selectedComplimentIndex]}"`;
  if (songEl) {
    const s = SONG_CATALOG[selectedSongIndex];
    songEl.innerHTML = `<strong>${s.title}</strong> • ${s.artist} <span style="color:var(--text-muted); font-size:0.75rem;">(${s.vibe})</span>`;
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

  feedList.innerHTML = memories.map(m => `
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
          💌 ${m.compliment}
        </div>
        <div class="memory-song-pill" onclick="playSongInYouTube('${m.song?.ytId || 'igIfiqqVHtA'}')">
          <span class="song-play-icon">▶</span>
          <span><strong>${m.song?.title || 'Enchanted'}</strong> • ${m.song?.artist || 'Taylor Swift'}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function playSongInYouTube(ytId) {
  window.open(`https://www.youtube.com/watch?v=${ytId}`, '_blank');
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

  const userAns = qa.answers[currentUser];
  const partnerUser = currentUser === 'himanshu' ? 'gullu' : 'himanshu';
  const partnerAns = qa.answers[partnerUser];

  // If both have answered: REVEAL!
  if (qa.answers.himanshu && qa.answers.gullu) {
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
      if (userAns) {
        textarea.value = userAns;
        textarea.disabled = true;
        submitBtn.disabled = true;
        submitBtn.textContent = `🔒 Your Answer is Locked! Waiting for ${currentUser === 'himanshu' ? 'Gullu 🌸' : 'Himanshu ☕'}...`;
      } else {
        textarea.value = '';
        textarea.disabled = false;
        submitBtn.disabled = false;
        submitBtn.textContent = '🔒 Lock & Submit My Answer';
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

function setupQAHandlers() {
  const submitBtn = document.getElementById('submitQABtn');
  const newQuestionBtn = document.getElementById('newQuestionBtn');

  if (submitBtn) {
    submitBtn.addEventListener('click', async () => {
      const text = document.getElementById('qaTextarea').value.trim();
      if (!text) {
        alert("Please write your answer first! ❤️");
        return;
      }
      playTone(587.33, 0.25);
      try {
        const res = await fetch('/api/qa/answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user: currentUser, answer: text })
        });
        if (res.ok) {
          playCelebrationChime();
          fetchState();
        }
      } catch (e) {}
    });
  }

  if (newQuestionBtn) {
    newQuestionBtn.addEventListener('click', async () => {
      if (confirm("Roll a new random question for both of you?")) {
        playTone(600, 0.2);
        try {
          const res = await fetch('/api/qa/new', { method: 'POST' });
          if (res.ok) fetchState();
        } catch (e) {}
      }
    });
  }
}

// --- 5. ROMANTIC LOVE COUPONS LOGIC ---
function renderCoupons() {
  const grid = document.getElementById('couponsGrid');
  if (!grid || !appState || !appState.coupons) return;

  grid.innerHTML = appState.coupons.map(c => {
    const isRedeemed = c.redeemed;
    const canRedeem = !isRedeemed && (c.forUser === 'both' || c.forUser === currentUser);
    return `
      <div class="coupon-ticket">
        <div class="coupon-header">
          <span class="coupon-target">For: ${c.forUser === 'both' ? 'Both of Us 💑' : (c.forUser === 'gullu' ? 'Gullu 🌸' : 'Himanshu ☕')}</span>
          <span class="coupon-badge ${isRedeemed ? 'redeemed' : 'available'}">
            ${isRedeemed ? 'REDEEMED' : 'READY TO USE'}
          </span>
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
  const coupon = appState.coupons.find(c => c.id === couponId);
  if (!coupon) return;

  playCelebrationChime();
  try {
    const res = await fetch('/api/coupon/redeem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ couponId, user: currentUser })
    });
    if (res.ok) {
      const waMsg = `Oyeee! Maine app me yeh Love Coupon REDEEM kar liya: "${coupon.title}"! Ab tumhari baari hai ise poora karne ki! 😉☕❤️`;
      showAppModal('🎟️ Coupon Redeemed!', `${coupon.title} is now officially stamped! Tap below to notify Himanshu on WhatsApp:`, waMsg);
      fetchState();
    }
  } catch (e) {}
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

      try {
        await fetch('/api/pulse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user: currentUser === 'himanshu' ? 'Himanshu' : 'Gullu',
            note: `Sent a warm heartbeat pulse to ${partner} ❤️`
          })
        });
        fetchState();
      } catch (err) {}
    }, 1800);
  }

  function cancelHold() {
    clearTimeout(holdTimer);
    clearInterval(heartbeatAudioInterval);
    heart.classList.remove('holding');
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
  if (!logList || !appState || !appState.pulses) return;

  if (appState.pulses.length === 0) {
    logList.innerHTML = `<div class="pulse-log-item"><span class="pulse-item-text">Touch & hold the heart above to send your first pulse! ❤️</span></div>`;
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
      try {
        const res = await fetch('/api/mood', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user: currentUser,
            mood: selectedMoodKey,
            text: `${moodInfo.title} — "${note}"`
          })
        });
        if (res.ok) {
          showAppModal('🎭 Mood Updated!', `Your mood is now set to ${moodInfo.title}!`);
          customInput.value = '';
          fetchState();
        }
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
    gNote.textContent = g.text || 'Ha wahi suar waala pout 😉';
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

// --- INITIALIZE EVERYTHING ON LOAD ---
document.addEventListener('DOMContentLoaded', () => {
  setupProfileSwitcher();
  setupTabNavigation();
  setupMemoryVault();
  setupQAHandlers();
  setupPulseArena();
  setupMoodIndicator();
  setupModalDismiss();
  fetchState();

  // Poll state every 4 seconds for live sync between phones
  setInterval(fetchState, 4000);
});

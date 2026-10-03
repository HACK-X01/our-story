const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5200; // Distinct port from the confession site (5173)
const DATA_FILE = path.join(__dirname, 'data.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Initial seed data for Our Story (Fresh Start)
const DEFAULT_DATA = {
  profiles: {
    himanshu: { name: "Himanshu", emoji: "☕", nickname: "Coffee Partner" },
    gullu: { name: "Gullu", emoji: "🌸", nickname: "Pout Queen 🐷" }
  },
  stats: {
    startDate: "2026-10-03", // Day 1 - Fresh Start
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

function loadData() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_DATA, null, 2));
      return DEFAULT_DATA;
    }
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (e) {
    return DEFAULT_DATA;
  }
}

function saveData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Save error:", e);
  }
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = req.url.split('?')[0];

  // --- API ROUTES ---
  if (req.method === 'GET' && parsedUrl === '/api/state') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(loadData()));
    return;
  }

  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      let payload = {};
      try { payload = JSON.parse(body || '{}'); } catch (e) {}
      const data = loadData();

      // 1. Upload Memory
      if (parsedUrl === '/api/memory') {
        const newMemory = {
          id: 'm_' + Date.now(),
          date: new Date().toISOString().split('T')[0],
          timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          mode: payload.mode || 'together',
          author: payload.author || 'Himanshu',
          photoUrl: payload.photoUrl || '',
          caption: payload.caption || '',
          compliment: payload.compliment || 'Aap dono saath me sabse pyaare lagte ho! ❤️',
          song: payload.song || { title: "Lover", artist: "Taylor Swift", ytId: "-BjZmE2gtdo" },
          likes: 1
        };
        data.memories.unshift(newMemory);
        saveData(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, memory: newMemory }));
        return;
      }

      // 2. Answer Daily Q&A
      if (parsedUrl === '/api/qa/answer') {
        const user = payload.user; // 'himanshu' or 'gullu'
        const answer = payload.answer;
        if (user && answer) {
          data.currentQA.answers[user] = answer;
          saveData(data);
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, currentQA: data.currentQA }));
        return;
      }

      // 3. New Random Question
      if (parsedUrl === '/api/qa/new') {
        const pool = [
          "Agar hum dono ek kamre me band ho jayein aur chabhi kho jaye, toh sabse pehla kaam kya karenge? 😉🗝️",
          "Gullu ki aisi kaunsi aadat hai jispe Himanshu ko sabse zyada pyaar aata hai? 🥰",
          "Humari agli dream coffee date kahan honi chahiye? ☕✈️",
          "Pehli baar milte hi dil me kya khayal aaya tha? ✨",
          "Agar hum dono ek road-trip par nikle, toh car me sabse pehle kaunsa gaana bajega? 🚗🎶",
          "Gullu ka kaunsa pout expression sabse zyada dangerous/cute hai? 🐷",
          "Ek aisi baat jo tumne abhi tak mujhe khul ke nahi batai? 🤫❤️",
          "Agar hum dono ko 1 din bina phone ke bitana ho, toh hum kya karenge? 📱❌"
        ];
        // Move current to past if both had answered
        if (data.currentQA.answers.himanshu && data.currentQA.answers.gullu) {
          data.pastQAs.unshift(data.currentQA);
        }
        const randomQ = pool[Math.floor(Math.random() * pool.length)];
        data.currentQA = {
          id: Date.now(),
          date: new Date().toISOString().split('T')[0],
          question: randomQ,
          category: "Random Romance",
          answers: { himanshu: null, gullu: null }
        };
        saveData(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, currentQA: data.currentQA }));
        return;
      }

      // 4. Redeem Coupon
      if (parsedUrl === '/api/coupon/redeem') {
        const { couponId, user } = payload;
        const coupon = data.coupons.find(c => c.id === couponId);
        if (coupon && !coupon.redeemed) {
          coupon.redeemed = true;
          coupon.redeemedAt = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
          coupon.redeemedBy = user;
          saveData(data);
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, coupon }));
        return;
      }

      // 5. Update Mood
      if (parsedUrl === '/api/mood') {
        const { user, mood, text } = payload;
        if (user && data.currentMoods[user]) {
          data.currentMoods[user] = {
            mood,
            text: text || '',
            time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
          };
          saveData(data);
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, moods: data.currentMoods }));
        return;
      }

      // 6. Send Heartbeat Pulse
      if (parsedUrl === '/api/pulse') {
        const pulse = {
          from: payload.user || 'Himanshu',
          time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          note: payload.note || "Sent a warm heartbeat ❤️"
        };
        data.pulses.unshift(pulse);
        if (data.pulses.length > 20) data.pulses.pop();
        saveData(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, pulse }));
        return;
      }

      // 7. Base64 Image Upload to File
      if (parsedUrl === '/api/upload-image') {
        try {
          const { imageBase64, filename } = payload;
          if (!imageBase64) throw new Error("No image data");
          const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
          const safeName = 'img_' + Date.now() + '.jpg';
          const savePath = path.join(UPLOADS_DIR, safeName);
          fs.writeFileSync(savePath, base64Data, 'base64');
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, url: '/uploads/' + safeName }));
          return;
        } catch (err) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err.message }));
          return;
        }
      }

      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Endpoint not found' }));
    });
    return;
  }

  // --- STATIC FILE SERVING ---
  let reqPath = parsedUrl;
  if (reqPath === '/') reqPath = '/index.html';
  const safePath = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(__dirname, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✨ Our Story Couple App is running at:`);
  console.log(`  - Local:   http://localhost:${PORT}`);
  console.log(`  - Network: http://192.168.1.3:${PORT}`);
});

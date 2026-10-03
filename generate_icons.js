const fs = require('fs');
const zlib = require('zlib');

// Minimal pure Node.js PNG encoder for custom icons
function createPNG(size, bgHex, drawFn) {
  const width = size;
  const height = size;

  // Buffer: width * height * 4 (RGBA)
  const imgBuffer = Buffer.alloc(width * height * 4);

  // Parse bgHex (#1c0d29 -> r, g, b)
  const rBg = parseInt(bgHex.slice(1, 3), 16);
  const gBg = parseInt(bgHex.slice(3, 5), 16);
  const bBg = parseInt(bgHex.slice(5, 7), 16);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      
      // Default background with subtle radial glow
      const cx = width / 2;
      const cy = height / 2;
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2) / (width / 2);
      
      let r = rBg;
      let g = gBg;
      let b = bBg;

      // Romantic gradient toward gold/rose in the center
      if (dist < 1.0) {
        const glow = Math.max(0, 1 - dist);
        r = Math.min(255, Math.floor(rBg + glow * 80));
        g = Math.min(255, Math.floor(gBg + glow * 20));
        b = Math.min(255, Math.floor(bBg + glow * 50));
      }

      // Draw custom shapes (e.g. Heart shape)
      // Heart formula: (x^2 + y^2 - 1)^3 - x^2 * y^3 <= 0
      // Normalized coords from -1.3 to 1.3
      const nx = ((x - cx) / (width * 0.35));
      const ny = -((y - cy * 0.95) / (height * 0.35));
      const heartEq = (nx * nx + ny * ny - 1) ** 3 - (nx * nx) * (ny * ny * ny);

      if (heartEq <= 0) {
        // Inside heart: rich gold/rose gradient
        const heartDist = Math.abs(heartEq);
        r = Math.min(255, 245 + Math.floor(ny * 10));
        g = Math.max(0, 110 + Math.floor(ny * 40));
        b = Math.max(0, 140 + Math.floor(nx * 30));
      } else if (heartEq < 0.2) {
        // Golden glowing border
        r = 245;
        g = 195;
        b = 102;
      }

      imgBuffer[idx] = r;
      imgBuffer[idx + 1] = g;
      imgBuffer[idx + 2] = b;
      imgBuffer[idx + 3] = 255;
    }
  }

  // Convert to scanlines with filter type 0 (None)
  const scanlines = Buffer.alloc(height * (width * 4 + 1));
  for (let y = 0; y < height; y++) {
    const scanlineOffset = y * (width * 4 + 1);
    scanlines[scanlineOffset] = 0; // Filter None
    imgBuffer.copy(scanlines, scanlineOffset + 1, y * width * 4, (y + 1) * width * 4);
  }

  const compressed = zlib.deflateSync(scanlines);

  // CRC32 table
  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    crcTable[n] = c;
  }

  function crc32(buf) {
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function makeChunk(type, data) {
    const len = data.length;
    const buf = Buffer.alloc(12 + len);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4, 4, 'ascii');
    data.copy(buf, 8);
    const crc = crc32(buf.subarray(4, 8 + len));
    buf.writeUInt32BE(crc, 8 + len);
    return buf;
  }

  // PNG Header
  const header = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth: 8
  ihdr[9] = 6; // Color type: RGBA (6)
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace
  const ihdrChunk = makeChunk('IHDR', ihdr);

  // IDAT chunk
  const idatChunk = makeChunk('IDAT', compressed);

  // IEND chunk
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([header, ihdrChunk, idatChunk, iendChunk]);
}

const icon192 = createPNG(192, '#1c0d29');
const icon512 = createPNG(512, '#1c0d29');

fs.writeFileSync('icon-192.png', icon192);
fs.writeFileSync('icon-512.png', icon512);
fs.writeFileSync('apple-touch-icon.png', icon192);
console.log('✅ Generated icon-192.png, icon-512.png, apple-touch-icon.png successfully!');

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const EXTENSION_DIR = path.join(__dirname, 'extension', 'icons');
const STORE_DIR = path.join(__dirname, 'store-assets');

// Ensure directories exist
fs.mkdirSync(EXTENSION_DIR, { recursive: true });
fs.mkdirSync(STORE_DIR, { recursive: true });

// Colors
const GRADIENT_START = '#667eea';
const GRADIENT_END = '#764ba2';

// Icon SVG (notepad with pencil)
function createIconSVG(size) {
  const padding = size * 0.15;
  const iconSize = size - (padding * 2);

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${GRADIENT_START}"/>
          <stop offset="100%" style="stop-color:${GRADIENT_END}"/>
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#grad)"/>
      <g transform="translate(${padding}, ${padding})">
        <!-- Notepad -->
        <rect x="${iconSize * 0.15}" y="${iconSize * 0.1}"
              width="${iconSize * 0.6}" height="${iconSize * 0.75}"
              rx="${iconSize * 0.05}"
              fill="white" opacity="0.95"/>
        <!-- Lines on notepad -->
        <line x1="${iconSize * 0.25}" y1="${iconSize * 0.3}"
              x2="${iconSize * 0.6}" y2="${iconSize * 0.3}"
              stroke="${GRADIENT_START}" stroke-width="${iconSize * 0.03}"
              stroke-linecap="round" opacity="0.6"/>
        <line x1="${iconSize * 0.25}" y1="${iconSize * 0.45}"
              x2="${iconSize * 0.55}" y2="${iconSize * 0.45}"
              stroke="${GRADIENT_START}" stroke-width="${iconSize * 0.03}"
              stroke-linecap="round" opacity="0.6"/>
        <line x1="${iconSize * 0.25}" y1="${iconSize * 0.6}"
              x2="${iconSize * 0.5}" y2="${iconSize * 0.6}"
              stroke="${GRADIENT_START}" stroke-width="${iconSize * 0.03}"
              stroke-linecap="round" opacity="0.6"/>
        <!-- Pencil -->
        <g transform="translate(${iconSize * 0.5}, ${iconSize * 0.4}) rotate(45)">
          <rect x="0" y="0" width="${iconSize * 0.08}" height="${iconSize * 0.4}"
                rx="${iconSize * 0.02}" fill="#FFD700"/>
          <polygon points="${iconSize * 0.04},${iconSize * 0.4} 0,${iconSize * 0.5} ${iconSize * 0.08},${iconSize * 0.5}"
                   fill="#333"/>
          <rect x="0" y="0" width="${iconSize * 0.08}" height="${iconSize * 0.08}"
                rx="${iconSize * 0.02}" fill="#FF6B6B"/>
        </g>
      </g>
    </svg>
  `;
}

// Generate extension icons
async function generateIcons() {
  const sizes = [16, 48, 128];

  for (const size of sizes) {
    const svg = createIconSVG(size);
    await sharp(Buffer.from(svg))
      .png()
      .toFile(path.join(EXTENSION_DIR, `icon${size}.png`));
    console.log(`Created icon${size}.png`);
  }
}

// Store icon 128x128
async function generateStoreIcon() {
  const svg = createIconSVG(128);
  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(STORE_DIR, 'store-icon-128x128.png'));
  console.log('Created store-icon-128x128.png');
}

// Screenshot 1: Extension popup mockup (1280x800)
async function generateScreenshot1() {
  const width = 1280;
  const height = 800;

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1a1a2e"/>
          <stop offset="100%" style="stop-color:#16213e"/>
        </linearGradient>
        <linearGradient id="popup" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${GRADIENT_START}"/>
          <stop offset="100%" style="stop-color:${GRADIENT_END}"/>
        </linearGradient>
      </defs>

      <!-- Background -->
      <rect width="${width}" height="${height}" fill="url(#bg)"/>

      <!-- Title -->
      <text x="${width/2}" y="80" text-anchor="middle"
            font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="white">
        Quick Notes - Simple Browser Notepad
      </text>
      <text x="${width/2}" y="130" text-anchor="middle"
            font-family="Arial, sans-serif" font-size="24" fill="#aaa">
        Click, type, auto-saves instantly. No account needed.
      </text>

      <!-- Popup mockup -->
      <g transform="translate(${(width - 350) / 2}, 180)">
        <!-- Popup container -->
        <rect width="350" height="420" rx="12" fill="url(#popup)"/>

        <!-- Header -->
        <rect width="350" height="50" rx="12" fill="rgba(255,255,255,0.1)"/>
        <text x="20" y="32" font-family="Arial, sans-serif" font-size="16" font-weight="600" fill="white">
          Quick Notes
        </text>
        <circle cx="310" cy="25" r="5" fill="#90EE90"/>
        <text x="295" y="30" text-anchor="end" font-family="Arial, sans-serif" font-size="12" fill="#90EE90">
          Saved
        </text>

        <!-- Quick action buttons -->
        <g transform="translate(15, 60)">
          <rect width="60" height="30" rx="6" fill="rgba(255,255,255,0.15)"/>
          <text x="30" y="20" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" fill="white">Date</text>

          <rect x="70" width="60" height="30" rx="6" fill="rgba(255,255,255,0.15)"/>
          <text x="100" y="20" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" fill="white">Time</text>

          <rect x="140" width="70" height="30" rx="6" fill="rgba(255,255,255,0.15)"/>
          <text x="175" y="20" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" fill="white">Divider</text>
        </g>

        <!-- Note area -->
        <rect x="15" y="100" width="320" height="280" rx="12" fill="white"/>

        <!-- Sample notes -->
        <text x="30" y="130" font-family="Arial, sans-serif" font-size="13" fill="#333">
          [Mon, Jan 20, 2026]
        </text>
        <text x="30" y="155" font-family="Arial, sans-serif" font-size="13" fill="#333">
          Meeting notes:
        </text>
        <text x="30" y="180" font-family="Arial, sans-serif" font-size="13" fill="#666">
          - Review Q4 metrics
        </text>
        <text x="30" y="205" font-family="Arial, sans-serif" font-size="13" fill="#666">
          - Plan roadmap for Q1
        </text>
        <text x="30" y="230" font-family="Arial, sans-serif" font-size="13" fill="#666">
          - Schedule follow-ups
        </text>
        <text x="30" y="265" font-family="Arial, sans-serif" font-size="13" fill="#333">
          -------------------
        </text>
        <text x="30" y="290" font-family="Arial, sans-serif" font-size="13" fill="#333">
          [10:30 AM] Call with client
        </text>

        <!-- Footer -->
        <rect x="15" y="340" width="320" height="40" fill="#f5f5f5"
              style="clip-path: inset(0 0 0 0 round 0 0 12px 12px)"/>
        <text x="30" y="365" font-family="Arial, sans-serif" font-size="11" fill="#888">
          156 characters
        </text>
        <rect x="230" y="350" width="45" height="26" rx="6" fill="#f0f0f0"/>
        <text x="252" y="368" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" fill="#666">
          Clear
        </text>
        <rect x="280" y="350" width="45" height="26" rx="6" fill="${GRADIENT_START}"/>
        <text x="302" y="368" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" fill="white">
          Copy
        </text>
      </g>

      <!-- Features list -->
      <g transform="translate(100, 650)">
        <circle cx="20" cy="10" r="12" fill="#4CAF50"/>
        <text x="20" y="15" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="white">1</text>
        <text x="45" y="15" font-family="Arial, sans-serif" font-size="16" fill="white">Auto-saves instantly</text>
      </g>
      <g transform="translate(380, 650)">
        <circle cx="20" cy="10" r="12" fill="#4CAF50"/>
        <text x="20" y="15" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="white">2</text>
        <text x="45" y="15" font-family="Arial, sans-serif" font-size="16" fill="white">Works offline</text>
      </g>
      <g transform="translate(620, 650)">
        <circle cx="20" cy="10" r="12" fill="#4CAF50"/>
        <text x="20" y="15" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="white">3</text>
        <text x="45" y="15" font-family="Arial, sans-serif" font-size="16" fill="white">No account needed</text>
      </g>
      <g transform="translate(900, 650)">
        <circle cx="20" cy="10" r="12" fill="#4CAF50"/>
        <text x="20" y="15" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="white">4</text>
        <text x="45" y="15" font-family="Arial, sans-serif" font-size="16" fill="white">100% Private</text>
      </g>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(STORE_DIR, 'screenshot-1.png'));
  console.log('Created screenshot-1.png');
}

// Screenshot 2: Features overview (1280x800)
async function generateScreenshot2() {
  const width = 1280;
  const height = 800;

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1a1a2e"/>
          <stop offset="100%" style="stop-color:#16213e"/>
        </linearGradient>
      </defs>

      <!-- Background -->
      <rect width="${width}" height="${height}" fill="url(#bg2)"/>

      <!-- Title -->
      <text x="${width/2}" y="80" text-anchor="middle"
            font-family="Arial, sans-serif" font-size="42" font-weight="bold" fill="white">
        Everything You Need. Nothing You Don't.
      </text>

      <!-- Feature cards grid (3x2) -->
      <g transform="translate(80, 140)">
        <!-- Row 1 -->
        <!-- Card 1: Auto-save -->
        <g transform="translate(0, 0)">
          <rect width="350" height="180" rx="16" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
          <circle cx="40" cy="40" r="24" fill="${GRADIENT_START}"/>
          <text x="40" y="47" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="white">1</text>
          <text x="80" y="47" font-family="Arial, sans-serif" font-size="20" font-weight="600" fill="white">
            Instant Auto-Save
          </text>
          <text x="25" y="85" font-family="Arial, sans-serif" font-size="15" fill="#aaa">
            Every keystroke is saved automatically.
          </text>
          <text x="25" y="110" font-family="Arial, sans-serif" font-size="15" fill="#aaa">
            No save button, no data loss. Ever.
          </text>
        </g>

        <!-- Card 2: Offline -->
        <g transform="translate(380, 0)">
          <rect width="350" height="180" rx="16" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
          <circle cx="40" cy="40" r="24" fill="${GRADIENT_START}"/>
          <text x="40" y="47" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="white">2</text>
          <text x="80" y="47" font-family="Arial, sans-serif" font-size="20" font-weight="600" fill="white">
            Works Offline
          </text>
          <text x="25" y="85" font-family="Arial, sans-serif" font-size="15" fill="#aaa">
            No internet? No problem.
          </text>
          <text x="25" y="110" font-family="Arial, sans-serif" font-size="15" fill="#aaa">
            Your notes are stored locally.
          </text>
        </g>

        <!-- Card 3: Privacy -->
        <g transform="translate(760, 0)">
          <rect width="350" height="180" rx="16" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
          <circle cx="40" cy="40" r="24" fill="#4CAF50"/>
          <text x="40" y="47" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="white">3</text>
          <text x="80" y="47" font-family="Arial, sans-serif" font-size="20" font-weight="600" fill="white">
            100% Private
          </text>
          <text x="25" y="85" font-family="Arial, sans-serif" font-size="15" fill="#aaa">
            No accounts, no cloud, no tracking.
          </text>
          <text x="25" y="110" font-family="Arial, sans-serif" font-size="15" fill="#aaa">
            Your notes stay on your device.
          </text>
        </g>

        <!-- Row 2 -->
        <!-- Card 4: Quick Insert -->
        <g transform="translate(0, 210)">
          <rect width="350" height="180" rx="16" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
          <circle cx="40" cy="40" r="24" fill="${GRADIENT_END}"/>
          <text x="40" y="47" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="white">4</text>
          <text x="80" y="47" font-family="Arial, sans-serif" font-size="20" font-weight="600" fill="white">
            Quick Insert
          </text>
          <text x="25" y="85" font-family="Arial, sans-serif" font-size="15" fill="#aaa">
            One-click date, time, and dividers.
          </text>
          <text x="25" y="110" font-family="Arial, sans-serif" font-size="15" fill="#aaa">
            Perfect for timestamped notes.
          </text>
        </g>

        <!-- Card 5: Copy -->
        <g transform="translate(380, 210)">
          <rect width="350" height="180" rx="16" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
          <circle cx="40" cy="40" r="24" fill="${GRADIENT_END}"/>
          <text x="40" y="47" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="white">5</text>
          <text x="80" y="47" font-family="Arial, sans-serif" font-size="20" font-weight="600" fill="white">
            Copy to Clipboard
          </text>
          <text x="25" y="85" font-family="Arial, sans-serif" font-size="15" fill="#aaa">
            One click to copy all your notes.
          </text>
          <text x="25" y="110" font-family="Arial, sans-serif" font-size="15" fill="#aaa">
            Paste anywhere instantly.
          </text>
        </g>

        <!-- Card 6: Lightweight -->
        <g transform="translate(760, 210)">
          <rect width="350" height="180" rx="16" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
          <circle cx="40" cy="40" r="24" fill="#4CAF50"/>
          <text x="40" y="47" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="white">6</text>
          <text x="80" y="47" font-family="Arial, sans-serif" font-size="20" font-weight="600" fill="white">
            Lightweight
          </text>
          <text x="25" y="85" font-family="Arial, sans-serif" font-size="15" fill="#aaa">
            Under 10KB. Zero performance impact.
          </text>
          <text x="25" y="110" font-family="Arial, sans-serif" font-size="15" fill="#aaa">
            No bloat, just notes.
          </text>
        </g>
      </g>

      <!-- Bottom CTA -->
      <rect x="${(width - 300) / 2}" y="620" width="300" height="60" rx="30" fill="${GRADIENT_START}"/>
      <text x="${width/2}" y="658" text-anchor="middle"
            font-family="Arial, sans-serif" font-size="20" font-weight="600" fill="white">
        Add to Chrome - Free
      </text>

      <!-- Minimal permissions badge -->
      <text x="${width/2}" y="720" text-anchor="middle"
            font-family="Arial, sans-serif" font-size="16" fill="#888">
        Only requires storage permission - nothing else
      </text>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(STORE_DIR, 'screenshot-2.png'));
  console.log('Created screenshot-2.png');
}

// Small promo tile (440x280)
async function generateSmallPromo() {
  const width = 440;
  const height = 280;

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="promobg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${GRADIENT_START}"/>
          <stop offset="100%" style="stop-color:${GRADIENT_END}"/>
        </linearGradient>
      </defs>

      <rect width="${width}" height="${height}" fill="url(#promobg)"/>

      <!-- Icon -->
      <g transform="translate(${(width - 80) / 2}, 40)">
        <rect width="80" height="80" rx="16" fill="white"/>
        <rect x="15" y="12" width="40" height="50" rx="4" fill="${GRADIENT_START}" opacity="0.2"/>
        <line x1="22" y1="25" x2="48" y2="25" stroke="${GRADIENT_START}" stroke-width="3" stroke-linecap="round"/>
        <line x1="22" y1="35" x2="44" y2="35" stroke="${GRADIENT_START}" stroke-width="3" stroke-linecap="round"/>
        <line x1="22" y1="45" x2="40" y2="45" stroke="${GRADIENT_START}" stroke-width="3" stroke-linecap="round"/>
        <!-- Pencil -->
        <g transform="translate(45, 35) rotate(45)">
          <rect width="6" height="28" rx="2" fill="#FFD700"/>
          <polygon points="3,28 0,35 6,35" fill="#333"/>
        </g>
      </g>

      <!-- Title -->
      <text x="${width/2}" y="155" text-anchor="middle"
            font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="white">
        Quick Notes
      </text>

      <!-- Subtitle -->
      <text x="${width/2}" y="185" text-anchor="middle"
            font-family="Arial, sans-serif" font-size="16" fill="rgba(255,255,255,0.9)">
        Simple Browser Notepad
      </text>

      <!-- Features -->
      <text x="${width/2}" y="230" text-anchor="middle"
            font-family="Arial, sans-serif" font-size="14" fill="rgba(255,255,255,0.7)">
        Auto-save | Offline | Private
      </text>

      <!-- Badge -->
      <rect x="${(width - 60) / 2}" y="245" width="60" height="22" rx="11" fill="rgba(255,255,255,0.2)"/>
      <text x="${width/2}" y="260" text-anchor="middle"
            font-family="Arial, sans-serif" font-size="11" fill="white">
        FREE
      </text>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(STORE_DIR, 'small-promo-440x280.png'));
  console.log('Created small-promo-440x280.png');
}

// Marquee tile (1400x560)
async function generateMarquee() {
  const width = 1400;
  const height = 560;

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="marqueebg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${GRADIENT_START}"/>
          <stop offset="100%" style="stop-color:${GRADIENT_END}"/>
        </linearGradient>
      </defs>

      <rect width="${width}" height="${height}" fill="url(#marqueebg)"/>

      <!-- Large icon on left -->
      <g transform="translate(150, ${(height - 200) / 2})">
        <rect width="200" height="200" rx="40" fill="white" opacity="0.95"/>
        <rect x="35" y="30" width="100" height="130" rx="10" fill="${GRADIENT_START}" opacity="0.15"/>
        <line x1="55" y1="60" x2="115" y2="60" stroke="${GRADIENT_START}" stroke-width="8" stroke-linecap="round"/>
        <line x1="55" y1="85" x2="105" y2="85" stroke="${GRADIENT_START}" stroke-width="8" stroke-linecap="round"/>
        <line x1="55" y1="110" x2="95" y2="110" stroke="${GRADIENT_START}" stroke-width="8" stroke-linecap="round"/>
        <!-- Pencil -->
        <g transform="translate(110, 90) rotate(45)">
          <rect width="15" height="70" rx="4" fill="#FFD700"/>
          <polygon points="7.5,70 0,88 15,88" fill="#333"/>
        </g>
      </g>

      <!-- Text on right -->
      <g transform="translate(450, ${height/2 - 80})">
        <text font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="white">
          Quick Notes
        </text>
        <text y="70" font-family="Arial, sans-serif" font-size="32" fill="rgba(255,255,255,0.9)">
          The simplest notepad for your browser
        </text>

        <!-- Feature badges -->
        <g transform="translate(0, 110)">
          <rect width="140" height="44" rx="22" fill="rgba(255,255,255,0.2)"/>
          <text x="70" y="28" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="white">
            Auto-Save
          </text>

          <rect x="160" width="120" height="44" rx="22" fill="rgba(255,255,255,0.2)"/>
          <text x="220" y="28" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="white">
            Offline
          </text>

          <rect x="300" width="120" height="44" rx="22" fill="rgba(255,255,255,0.2)"/>
          <text x="360" y="28" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="white">
            Private
          </text>

          <rect x="440" width="100" height="44" rx="22" fill="rgba(76,175,80,0.8)"/>
          <text x="490" y="28" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="white">
            FREE
          </text>
        </g>
      </g>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(STORE_DIR, 'marquee-1400x560.png'));
  console.log('Created marquee-1400x560.png');
}

// Run all generators
async function main() {
  console.log('Generating assets...\n');

  await generateIcons();
  await generateStoreIcon();
  await generateScreenshot1();
  await generateScreenshot2();
  await generateSmallPromo();
  await generateMarquee();

  console.log('\nAll assets generated successfully!');
}

main().catch(console.error);

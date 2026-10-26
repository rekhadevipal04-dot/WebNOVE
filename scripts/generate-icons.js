import fs from 'fs';
import path from 'path';
import { Resvg } from '@resvg/resvg-js';

const svgPath = path.resolve('public/favicon.svg');
const svgContent = fs.readFileSync(svgPath, 'utf8');

// 1. Generate Favicon 64x64
const resvg64 = new Resvg(svgContent, { fitTo: { mode: 'width', value: 64 } });
fs.writeFileSync('public/favicon.png', resvg64.render().asPng());

// 2. Apple Touch Icon 180x180
const resvg180 = new Resvg(svgContent, { fitTo: { mode: 'width', value: 180 } });
fs.writeFileSync('public/apple-touch-icon.png', resvg180.render().asPng());

// 3. Android PWA & Google Search Icon 192x192
const resvg192 = new Resvg(svgContent, { fitTo: { mode: 'width', value: 192 } });
fs.writeFileSync('public/icon-192.png', resvg192.render().asPng());

// 4. Android PWA & Google Search Icon 512x512
const resvg512 = new Resvg(svgContent, { fitTo: { mode: 'width', value: 512 } });
fs.writeFileSync('public/icon-512.png', resvg512.render().asPng());

// 5. OpenGraph & Google Discover Banner 1200x630
const ogSvg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ogBg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#070D1F" />
      <stop offset="50%" stop-color="#0F172A" />
      <stop offset="100%" stop-color="#0B132B" />
    </linearGradient>
    <radialGradient id="ogGlow" cx="280" cy="315" r="350" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0284C7" stop-opacity="0.35" />
      <stop offset="60%" stop-color="#2563EB" stop-opacity="0.12" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#ogBg)" />
  <circle cx="280" cy="315" r="350" fill="url(#ogGlow)" />

  <!-- Logo Placed at x=140, y=175, size=280x280 -->
  <g transform="translate(140, 175) scale(2.8)">
    ${svgContent.replace(/<\/?svg[^>]*>/g, '')}
  </g>

  <!-- Title & Typography -->
  <text x="470" y="270" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="76" fill="#FFFFFF" letter-spacing="-1">
    WEB<tspan fill="#38BDF8">NOVA</tspan>
  </text>
  <text x="470" y="335" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="28" fill="#94A3B8" letter-spacing="1">
    DIGITAL MARKETING &amp; MODERN WEB AGENCY
  </text>
  <text x="470" y="390" font-family="system-ui, -apple-system, sans-serif" font-weight="400" font-size="20" fill="#64748B">
    High-Performance Websites • SEO Growth • Automated Booking
  </text>
  <text x="470" y="445" font-family="system-ui, -apple-system, sans-serif" font-weight="600" font-size="18" fill="#38BDF8">
    https://www.webnova.in
  </text>
</svg>
`;

const resvgOg = new Resvg(ogSvg, { fitTo: { mode: 'width', value: 1200 } });
fs.writeFileSync('public/og-image.png', resvgOg.render().asPng());

console.log('Successfully generated all icons and og-image.png!');

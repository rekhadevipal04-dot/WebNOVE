import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';

function saveFounderPhotoPlugin() {
  return {
    name: 'save-founder-photo',
    configureServer(server: any) {
      // Save Anand Pal Photo
      server.middlewares.use('/api/save-founder-photo', (req: any, res: any) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const { dataUrl } = JSON.parse(body);
              if (dataUrl && typeof dataUrl === 'string' && dataUrl.startsWith('data:image/')) {
                const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, '');
                const buffer = Buffer.from(base64Data, 'base64');
                fs.writeFileSync(path.resolve('public/anand-pal-default.jpg'), buffer);
                const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 800 1000" width="100%" height="100%">
  <image href="${dataUrl}" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
</svg>`;
                fs.writeFileSync(path.resolve('public/anand-pal-default.svg'), svgContent);
                const tsCode = `/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Anand Pal Founder & CEO Official Profile Photo
export const ANAND_PAL_PHOTO_DATA_URL =
  "${dataUrl}";
`;
                fs.writeFileSync(path.resolve('src/data/anandPalPhoto.ts'), tsCode);

                if (fs.existsSync('dist')) {
                  fs.writeFileSync(path.resolve('dist/anand-pal-default.jpg'), buffer);
                  fs.writeFileSync(path.resolve('dist/anand-pal-default.svg'), svgContent);
                }
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true }));
                return;
              }
            } catch (err) {
              console.error('Failed to save founder photo to disk:', err);
            }
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Invalid payload' }));
          });
        } else {
          res.statusCode = 405;
          res.end();
        }
      });

      // Save Surya Pal Photo (Permanent Disk & TS Code Persistence)
      server.middlewares.use('/api/save-surya-photo', (req: any, res: any) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const { dataUrl } = JSON.parse(body);
              if (dataUrl && typeof dataUrl === 'string' && dataUrl.startsWith('data:image/')) {
                const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, '');
                const buffer = Buffer.from(base64Data, 'base64');
                fs.writeFileSync(path.resolve('public/surya-pal-default.jpg'), buffer);
                fs.writeFileSync(path.resolve('public/surya-pal-default.png'), buffer);
                const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 800 1000" width="100%" height="100%">
  <image href="${dataUrl}" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
</svg>`;
                fs.writeFileSync(path.resolve('public/surya-pal-default.svg'), svgContent);

                const tsCode = `/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Surya Pal Co-Founder & Director Official Profile Photo (Base64 Data URI)
// Embedded directly to guarantee 100% fail-safe display across Netlify, CDNs, and all mobile/desktop browsers
export const SURYA_PAL_PHOTO_DATA_URL =
  "${dataUrl}";
`;
                fs.writeFileSync(path.resolve('src/data/suryaPalPhoto.ts'), tsCode);

                if (fs.existsSync('dist')) {
                  fs.writeFileSync(path.resolve('dist/surya-pal-default.jpg'), buffer);
                  fs.writeFileSync(path.resolve('dist/surya-pal-default.png'), buffer);
                  fs.writeFileSync(path.resolve('dist/surya-pal-default.svg'), svgContent);
                }

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true }));
                return;
              }
            } catch (err) {
              console.error('Failed to save Surya photo to disk:', err);
            }
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Invalid payload' }));
          });
        } else {
          res.statusCode = 405;
          res.end();
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), saveFounderPhotoPlugin()],
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  preview: {
    port: 3000,
    host: '0.0.0.0',
  },
});

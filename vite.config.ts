import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(({mode}) => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'api-simulate',
        configureServer(server) {
          server.middlewares.use('/api/simulate', async (req, res) => {
            if (req.method !== 'POST') {
              res.writeHead(405, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Method not allowed' }));
              return;
            }

            let body = '';
            req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
            req.on('end', async () => {
              try {
                const { GoogleGenAI } = await import('@google/genai');
                const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
                if (!apiKey) {
                  res.writeHead(500, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ error: 'API key not configured' }));
                  return;
                }

                const { roomImage, blindRefImage, blindName, blindDesc, colorName, colorHex } = JSON.parse(body);
                if (!roomImage || !blindRefImage) {
                  res.writeHead(400, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ error: 'Missing images' }));
                  return;
                }

                const ai = new GoogleGenAI({ apiKey });
                const prompt = `TASK: Edit the ROOM PHOTO to install the blind/curtain from the PRODUCT REFERENCE image.

WINDOW DETECTION (MOST IMPORTANT):
- ONLY place blinds on REAL WINDOWS — areas with visible glass, outdoor scenery, or natural light coming through.
- NEVER place blinds on: solid walls, doors, mirrors, paintings, TV screens, bookshelves, closets, or any surface that is NOT a window.
- If the room has 1 window, install on that 1 window ONLY. If it has 2 windows, install on those 2 ONLY. Count carefully.
- A window has a frame, glass, and usually shows the outside. Walls do NOT have these features.

INSTALLATION RULES:
1. Match the EXACT design/pattern from the PRODUCT REFERENCE image.
2. Apply color: "${colorName}" (${colorHex}).
3. Size the blind to fit each window's exact dimensions and perspective.
4. Keep EVERYTHING else in the room 100% unchanged — walls, floor, furniture, lighting, camera angle.
5. Add realistic shadows and natural light filtering through the blind.
6. NO text, NO watermarks, NO labels.

OUTPUT: One photorealistic edited room image. Do NOT add blinds anywhere except actual windows.`;

                const response = await ai.models.generateContent({
                  model: 'gemini-3.1-flash-image-preview',
                  contents: [{
                    role: 'user',
                    parts: [
                      { text: "ROOM PHOTO \u2014 install blinds on the windows in this room:" },
                      { inlineData: { data: roomImage, mimeType: 'image/jpeg' } },
                      { text: "PRODUCT REFERENCE \u2014 install this EXACT blind/curtain design onto the windows:" },
                      { inlineData: { data: blindRefImage, mimeType: 'image/jpeg' } },
                      { text: prompt }
                    ]
                  }],
                  config: {
                    responseModalities: ['TEXT', 'IMAGE'],
                    imageConfig: { imageSize: "1K" }
                  }
                });

                let outputImage = null;
                for (const part of response.candidates?.[0]?.content?.parts || []) {
                  if (part.inlineData) {
                    outputImage = part.inlineData.data;
                    break;
                  }
                }

                if (!outputImage) {
                  res.writeHead(500, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ error: 'AI failed to generate image' }));
                  return;
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ image: outputImage }));
              } catch (error: any) {
                console.error('Simulate error:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: error.message || 'Internal error' }));
              }
            });
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});

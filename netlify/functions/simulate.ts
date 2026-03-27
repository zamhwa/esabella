import { GoogleGenAI } from '@google/genai';
import type { Config } from '@netlify/functions';

export const config: Config = {
  path: '/api/simulate',
};

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key not configured' }), { status: 500 });
    }

    const {
      compositeImage,
      roomImage, blindRefImage,
      blindName, blindId,
      colorName, colorHex,
      windowWidthMm, windowHeightMm,
      backRowCount, frontRowCount
    } = await req.json();

    const ai = new GoogleGenAI({ apiKey });
    const parts: any[] = [];
    let prompt: string;

    if (blindId === 'free-blind' && compositeImage) {
      // ===== 프리블라인드: 이미 합성된 이미지 → AI는 리터칭만 =====
      const total = (backRowCount || 4) + (frontRowCount || 3);

      parts.push({ inlineData: { data: compositeImage, mimeType: 'image/jpeg' } });

      prompt = `이 사진에는 방 안 창문 위에 프리블라인드(반원형 아치 패턴)가 이미 합성되어 있습니다.

당신의 역할은 리터칭만 하는 것입니다:
1. 블라인드의 위치, 개수(${total}개), 크기, 배치를 절대 변경하지 마세요. 그대로 유지하세요.
2. 블라인드 원단을 반투명하게 만들어서 뒤의 바깥 풍경(나무, 하늘, 건물)이 비쳐 보이게 하세요.
3. 레일 아래에 자연스러운 그림자를 추가하세요.
4. 블라인드를 통과하는 자연광 효과를 추가하세요.
5. 블라인드와 주변 환경의 조명, 색감을 자연스럽게 블렌딩하세요.
6. 방의 가구, 벽, 바닥 등 나머지는 변경하지 마세요.

중요: 블라인드의 형태나 개수를 바꾸지 마세요. 이미 정확히 배치되어 있습니다. 자연스러운 리터칭만 하세요.

출력: 리터칭된 사실적인 방 사진 1장. 텍스트/워터마크 없음.`;

    } else if (roomImage && blindRefImage) {
      // ===== 다른 블라인드: 참조 이미지 기반 =====
      parts.push({ inlineData: { data: blindRefImage, mimeType: 'image/jpeg' } });
      parts.push({ inlineData: { data: roomImage, mimeType: 'image/jpeg' } });

      let sizeInfo = '';
      if (windowWidthMm || windowHeightMm) {
        sizeInfo = `\n창문 크기: ${windowWidthMm || '?'}mm × ${windowHeightMm || '?'}mm. 이 비율에 맞게 설치.`;
      }

      prompt = `첫 번째 이미지는 참조용 블라인드 사진이고, 두 번째 이미지는 시공 대상 방입니다.

두 번째 이미지의 실제 창문(유리+바깥 풍경이 보이는 곳)에 첫 번째 이미지의 "${blindName}"을 "${colorName}" (${colorHex}) 색상으로 설치하세요.
${sizeInfo}
- 참조 이미지 디자인을 정확히 복제.
- 창문 = 유리 + 바깥 풍경. 벽/문/TV에 절대 설치 금지.
- 방은 변경 금지. 사실적인 품질. 텍스트/워터마크 없음.`;
    } else {
      return new Response(JSON.stringify({ error: 'Missing required images' }), { status: 400 });
    }

    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: [{ role: 'user', parts }],
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
      return new Response(JSON.stringify({ error: 'AI가 이미지를 생성하지 못했습니다' }), { status: 500 });
    }

    return new Response(JSON.stringify({ image: outputImage }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Simulate error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal error' }), { status: 500 });
  }
};

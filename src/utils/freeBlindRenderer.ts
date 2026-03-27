/**
 * 프리블라인드 U자 유닛 렌더러
 * - 유닛 1개를 Canvas로 정밀하게 그림 (투명 PNG)
 * - 색상별로 캐시하여 재사용
 * - 주문 시 유닛을 개수만큼 배치한 레이아웃 이미지 생성
 */

// 유닛 크기 고정 (775mm 비율)
const UNIT_W = 200;
const UNIT_H = 300;
const RAIL_H = 10;
const PIPING = 2.5;
const OVERLAP_RATIO = 0.12; // 유닛 간 겹침 비율

// 색상별 유닛 캐시
const unitCache = new Map<string, HTMLCanvasElement>();

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

/** 프리블라인드 U자 유닛 1개를 Canvas에 그림 */
function renderUnit(colorHex: string): HTMLCanvasElement {
  // 캐시 확인
  if (unitCache.has(colorHex)) {
    return unitCache.get(colorHex)!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = UNIT_W;
  canvas.height = UNIT_H;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, UNIT_W, UNIT_H);

  const { r, g, b } = hexToRgb(colorHex);
  const arcRadius = (UNIT_W - 8) / 2;
  const cx = UNIT_W / 2;
  const arcCenterY = RAIL_H + UNIT_H * 0.55;

  // === 레일 ===
  const railGrad = ctx.createLinearGradient(0, 0, 0, RAIL_H);
  railGrad.addColorStop(0, '#A0927E');
  railGrad.addColorStop(0.5, '#8B7D6B');
  railGrad.addColorStop(1, '#7A6C5A');
  ctx.fillStyle = railGrad;
  ctx.beginPath();
  ctx.moveTo(5, 0);
  ctx.lineTo(UNIT_W - 5, 0);
  ctx.quadraticCurveTo(UNIT_W - 2, 0, UNIT_W - 2, 3);
  ctx.lineTo(UNIT_W - 2, RAIL_H);
  ctx.lineTo(2, RAIL_H);
  ctx.lineTo(2, 3);
  ctx.quadraticCurveTo(2, 0, 5, 0);
  ctx.fill();

  // 레일 하이라이트
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.fillRect(4, 1, UNIT_W - 8, 2);

  // === 원단 (사각형 + 하단 반원) ===
  ctx.beginPath();
  ctx.moveTo(4, RAIL_H);
  ctx.lineTo(4, arcCenterY);
  ctx.arc(cx, arcCenterY, arcRadius, Math.PI, 0, false);
  ctx.lineTo(UNIT_W - 4, RAIL_H);
  ctx.closePath();

  // 원단 그라데이션 (반투명)
  const fabricGrad = ctx.createLinearGradient(0, RAIL_H, 0, arcCenterY + arcRadius);
  fabricGrad.addColorStop(0, `rgba(${r},${g},${b},0.40)`);
  fabricGrad.addColorStop(0.4, `rgba(${r},${g},${b},0.32)`);
  fabricGrad.addColorStop(0.8, `rgba(${r},${g},${b},0.25)`);
  fabricGrad.addColorStop(1, `rgba(${r},${g},${b},0.18)`);
  ctx.fillStyle = fabricGrad;
  ctx.fill();

  // 원단 텍스처 (미세한 세로줄)
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(4, RAIL_H);
  ctx.lineTo(4, arcCenterY);
  ctx.arc(cx, arcCenterY, arcRadius, Math.PI, 0, false);
  ctx.lineTo(UNIT_W - 4, RAIL_H);
  ctx.closePath();
  ctx.clip();
  ctx.strokeStyle = `rgba(${r},${g},${b},0.06)`;
  ctx.lineWidth = 0.5;
  for (let x = 8; x < UNIT_W - 4; x += 5) {
    ctx.beginPath();
    ctx.moveTo(x, RAIL_H);
    ctx.lineTo(x, arcCenterY + arcRadius);
    ctx.stroke();
  }
  ctx.restore();

  // === U자 하단 파이핑 ===
  ctx.beginPath();
  ctx.arc(cx, arcCenterY, arcRadius, Math.PI, 0, false);
  const pipingGrad = ctx.createLinearGradient(4, arcCenterY, UNIT_W - 4, arcCenterY);
  pipingGrad.addColorStop(0, '#6B5D4E');
  pipingGrad.addColorStop(0.5, '#8B7D6B');
  pipingGrad.addColorStop(1, '#6B5D4E');
  ctx.strokeStyle = pipingGrad;
  ctx.lineWidth = PIPING;
  ctx.stroke();

  // 양쪽 세로 라인
  ctx.strokeStyle = 'rgba(107,93,78,0.25)';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(4, RAIL_H);
  ctx.lineTo(4, arcCenterY);
  ctx.moveTo(UNIT_W - 4, RAIL_H);
  ctx.lineTo(UNIT_W - 4, arcCenterY);
  ctx.stroke();

  // 캐시에 저장
  unitCache.set(colorHex, canvas);
  return canvas;
}

/**
 * 프리블라인드 레이아웃 이미지 생성
 * @param colorHex 색상 hex
 * @param backCount 뒷열 개수
 * @param frontCount 앞열 개수
 * @returns base64 PNG data URL
 */
export function generateFreeBlindLayout(
  colorHex: string,
  backCount: number,
  frontCount: number
): string {
  const unit = renderUnit(colorHex);
  const overlap = UNIT_W * OVERLAP_RATIO;
  const step = UNIT_W - overlap;

  // 전체 캔버스 크기
  const padding = 20;
  const totalWidth = padding * 2 + backCount * step + overlap;
  const totalHeight = UNIT_H + padding;

  const canvas = document.createElement('canvas');
  canvas.width = totalWidth;
  canvas.height = totalHeight;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, totalWidth, totalHeight);

  // 상단 연결 레일 (전체)
  const railGrad = ctx.createLinearGradient(0, 0, 0, RAIL_H);
  railGrad.addColorStop(0, '#A0927E');
  railGrad.addColorStop(0.5, '#8B7D6B');
  railGrad.addColorStop(1, '#7A6C5A');
  ctx.fillStyle = railGrad;
  ctx.fillRect(padding - 5, 0, totalWidth - padding * 2 + 10, RAIL_H);
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.fillRect(padding - 5, 1, totalWidth - padding * 2 + 10, 2);

  // 뒷열 그리기
  for (let i = 0; i < backCount; i++) {
    const x = padding + i * step;
    ctx.drawImage(unit, x, 0);
  }

  // 앞열 그리기 (반 간격 오프셋, 살짝 아래)
  const frontOffset = step / 2;
  for (let i = 0; i < frontCount; i++) {
    const x = padding + frontOffset + i * step;
    // 앞열은 살짝 더 진하게 (겹치기 효과)
    ctx.globalAlpha = 1.0;
    ctx.drawImage(unit, x, 5); // 5px 아래로 오프셋
  }
  ctx.globalAlpha = 1.0;

  return canvas.toDataURL('image/png');
}

/**
 * 유닛 미리보기 이미지 (단일 유닛)
 */
export function getUnitPreview(colorHex: string): string {
  const unit = renderUnit(colorHex);
  return unit.toDataURL('image/png');
}

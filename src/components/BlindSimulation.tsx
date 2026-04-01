import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, Upload, Check, Loader2, Sparkles, RotateCcw, Download, Move, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateFreeBlindLayout } from '../utils/freeBlindRenderer';

const BLIND_COLORS = [
  { name: '퓨어 화이트', hex: '#FFFFFF', id: 'pure-white' },
  { name: '밀크 화이트', hex: '#F5F0E8', id: 'milk-white' },
  { name: '아이보리', hex: '#EEDFCC', id: 'ivory' },
  { name: '크림', hex: '#F5E6C8', id: 'cream' },
  { name: '베이지', hex: '#D4C5A9', id: 'beige' },
  { name: '라떼', hex: '#C4A882', id: 'latte' },
  { name: '모카', hex: '#967259', id: 'mocha' },
  { name: '라이트 그레이', hex: '#D0CFC9', id: 'light-gray' },
  { name: '그레이', hex: '#9E9E9E', id: 'gray' },
  { name: '차콜', hex: '#5C5C5C', id: 'charcoal' },
];

const U_BLIND_WIDTH_MM = 775;

const BLIND_TYPES = [
  { name: '프리블라인드', id: 'free-blind', desc: '별도 문의 (010-0000-0000)', image: '/images/free-blind.jpg', inquiry: true },
  { name: '우드 블라인드', id: 'wood', desc: '천연 원목의 따뜻한 클래식', image: '/images/wood-blind-new.jpg' },
  { name: '콤비 블라인드', id: 'combi', desc: '채광과 프라이버시의 자유로운 조절', image: '/images/combi-blind-new.jpg' },
  { name: '허니콤 블라인드', id: 'honeycomb', desc: '탁월한 단열과 소음 차단', image: '/images/honeycomb-blind-new.jpg' },
  { name: '매직 블라인드', id: 'magic', desc: '플리츠 원단의 섬세한 채광 조절', image: '/images/blitz-blind.jpg' },
  { name: '롤 블라인드', id: 'roll', desc: '미니멀하고 깔끔한 디자인', image: '/images/roll-blind.jpg' },
  { name: '로만 블라인드', id: 'roman', desc: '접히는 원단의 클래식한 우아함', image: '/images/roman-blind.jpg' },
  { name: '트리플 쉐이드', id: 'triple', desc: '3중 구조의 정밀 채광 조절', image: '/images/triple-shade.jpg' },
];

// 창문 영역 드래그 선택 컴포넌트
function WindowSelector({ imageSrc, onSelect }: {
  imageSrc: string;
  onSelect: (rect: { x: number; y: number; w: number; h: number }) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [rect, setRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  const getRelPos = (e: React.MouseEvent | React.TouchEvent) => {
    const el = containerRef.current!;
    const bounds = el.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - bounds.left) / bounds.width,
      y: (clientY - bounds.top) / bounds.height,
    };
  };

  const handleDown = (e: React.MouseEvent | React.TouchEvent) => {
    const pos = getRelPos(e);
    setStart(pos);
    setRect(null);
    setDragging(true);
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragging) return;
    const pos = getRelPos(e);
    setRect({
      x: Math.min(start.x, pos.x),
      y: Math.min(start.y, pos.y),
      w: Math.abs(pos.x - start.x),
      h: Math.abs(pos.y - start.y),
    });
  };

  const handleUp = () => {
    setDragging(false);
    if (rect && rect.w > 0.02 && rect.h > 0.02) {
      onSelect(rect);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full select-none"
      onMouseDown={handleDown}
      onMouseMove={handleMove}
      onMouseUp={handleUp}
      onTouchStart={handleDown}
      onTouchMove={handleMove}
      onTouchEnd={handleUp}
      style={{ touchAction: 'none' }}
    >
      <img src={imageSrc} alt="Room" className="w-full h-full object-contain" draggable={false} />
      {/* 선택 영역 표시 */}
      {rect && (
        <div
          className="absolute border-2 border-amber-500 bg-amber-500/10"
          style={{
            left: `${rect.x * 100}%`,
            top: `${rect.y * 100}%`,
            width: `${rect.w * 100}%`,
            height: `${rect.h * 100}%`,
          }}
        >
          <span className="absolute -top-6 left-0 bg-amber-800 text-white text-[10px] px-2 py-0.5 rounded font-bold">
            창문 영역
          </span>
        </div>
      )}
      {!rect && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/60 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
            <Move className="h-4 w-4" /> 창문 영역을 드래그하세요
          </div>
        </div>
      )}
    </div>
  );
}

export default function BlindSimulation() {
  const [image, setImage] = useState<string | null>(null);
  const [imageNatural, setImageNatural] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const [selectedColor, setSelectedColor] = useState(BLIND_COLORS[0]);
  const [selectedType, setSelectedType] = useState(BLIND_TYPES[1]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [windowWidthMm, setWindowWidthMm] = useState<number>(0);
  const [windowHeightMm, setWindowHeightMm] = useState<number>(0);
  const [windowRect, setWindowRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [step, setStep] = useState<'upload' | 'select' | 'ready'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uBackRow = windowWidthMm > 0 ? Math.max(1, Math.round(windowWidthMm / U_BLIND_WIDTH_MM)) : 0;
  const uFrontRow = uBackRow > 1 ? uBackRow - 1 : 0;
  const uBlindCount = uBackRow + uFrontRow;

  const isFreeBlind = selectedType.id === 'free-blind';

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        setImage(src);
        setResultImage(null);
        setWindowRect(null);
        // 이미지 원본 크기 파악
        const img = new Image();
        img.onload = () => {
          setImageNatural({ w: img.naturalWidth, h: img.naturalHeight });
          if (isFreeBlind) {
            setStep('select');
          } else {
            setStep('ready');
          }
        };
        img.src = src;
      };
      reader.readAsDataURL(file);
    }
  };

  // 프리블라인드: 선택 모드 진입
  useEffect(() => {
    if (image && isFreeBlind && !windowRect) {
      setStep('select');
    } else if (image && !isFreeBlind) {
      setStep('ready');
    }
  }, [selectedType.id]);

  const handleWindowSelect = (rect: { x: number; y: number; w: number; h: number }) => {
    setWindowRect(rect);
    setStep('ready');
  };

  // Canvas에서 방 사진 위에 블라인드 레이아웃을 직접 합성
  const compositeBlindOnRoom = async (): Promise<string> => {
    return new Promise((resolve) => {
      const roomImg = new Image();
      roomImg.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = roomImg.naturalWidth;
        canvas.height = roomImg.naturalHeight;
        const ctx = canvas.getContext('2d')!;

        // 방 사진 그리기
        ctx.drawImage(roomImg, 0, 0);

        if (!windowRect) {
          resolve(canvas.toDataURL('image/jpeg', 0.9));
          return;
        }

        // 창문 영역 (픽셀 좌표)
        const wx = windowRect.x * canvas.width;
        const wy = windowRect.y * canvas.height;
        const ww = windowRect.w * canvas.width;
        const wh = windowRect.h * canvas.height;

        // 블라인드 레이아웃 생성
        const layoutDataUrl = generateFreeBlindLayout(selectedColor.hex, uBackRow, uFrontRow);
        const layoutImg = new Image();
        layoutImg.onload = () => {
          // 레이아웃을 창문 영역에 맞게 그리기
          ctx.drawImage(layoutImg, wx, wy, ww, wh);
          resolve(canvas.toDataURL('image/jpeg', 0.9));
        };
        layoutImg.src = layoutDataUrl;
      };
      roomImg.src = image!;
    });
  };

  const urlToBase64 = async (url: string): Promise<string> => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  };

  const runSimulation = async () => {
    if (!image) return;
    setIsProcessing(true);

    try {
      if (isFreeBlind && windowRect && uBackRow > 0) {
        // === 프리블라인드: 직접 합성 후 AI 리터칭 ===
        const composited = await compositeBlindOnRoom();
        const compositedBase64 = composited.split(',')[1];

        const response = await fetch('/api/simulate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            compositeImage: compositedBase64,
            blindId: 'free-blind',
            colorName: selectedColor.name,
            backRowCount: uBackRow,
            frontRowCount: uFrontRow,
          }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Simulation failed');
        if (data.image) {
          setResultImage(`data:image/png;base64,${data.image}`);
        }
      } else {
        // === 다른 블라인드: 기존 방식 ===
        let roomBase64: string;
        if (image.startsWith('data:')) {
          roomBase64 = image.split(',')[1];
        } else {
          const dataUrl = await urlToBase64(image);
          roomBase64 = dataUrl.split(',')[1];
        }

        const refDataUrl = await urlToBase64(selectedType.image);
        const blindRefBase64 = refDataUrl.split(',')[1];

        const response = await fetch('/api/simulate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            roomImage: roomBase64,
            blindRefImage: blindRefBase64,
            blindName: selectedType.name,
            blindId: selectedType.id,
            colorName: selectedColor.name,
            colorHex: selectedColor.hex,
            windowWidthMm: windowWidthMm > 0 ? windowWidthMm : undefined,
            windowHeightMm: windowHeightMm > 0 ? windowHeightMm : undefined,
          }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Simulation failed');
        if (data.image) {
          setResultImage(`data:image/png;base64,${data.image}`);
        }
      }
    } catch (error: any) {
      console.error('Simulation failed:', error);
      alert(`AI 시뮬레이션 오류: ${error.message || '다시 시도해주세요.'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadResult = () => {
    if (!resultImage) return;
    const a = document.createElement('a');
    a.href = resultImage;
    a.download = `esabella-${selectedType.id}-${selectedColor.id}.png`;
    a.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
      <div className="text-center mb-12">
        <span className="text-xs font-semibold tracking-[0.3em] text-amber-800 uppercase">AI Simulation</span>
        <h1 className="text-3xl md:text-5xl font-serif mt-3 mb-4 text-stone-900">이사벨라 AI 시뮬레이터</h1>
        <p className="text-stone-500 max-w-xl mx-auto text-sm sm:text-base">
          방 사진을 업로드하고 블라인드 종류와 색상을 고르면 AI가 설치된 모습을 보여드립니다.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Controls */}
        <div className="lg:col-span-4 space-y-6">

          {/* Step 1: Upload */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-4 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-[10px] flex items-center justify-center font-bold">1</span>
              내 공간 사진 업로드
            </h3>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-stone-300 rounded-xl p-6 text-center cursor-pointer hover:border-amber-800 hover:bg-amber-50/30 transition-all"
            >
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
              {image ? (
                <div className="flex items-center gap-3 justify-center">
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-stone-200">
                    <img src={image} alt="uploaded" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-stone-800">업로드 완료</p>
                    <p className="text-xs text-amber-800">클릭하여 변경</p>
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="mx-auto h-8 w-8 text-stone-300 mb-3" />
                  <p className="text-sm text-stone-600 font-medium">클릭하여 방 사진 업로드</p>
                  <p className="text-xs text-stone-400 mt-1">창문이 보이는 거실, 침실, 오피스 사진</p>
                </>
              )}
            </div>
          </section>

          {/* Step 2: Blind Type */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-4 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-[10px] flex items-center justify-center font-bold">2</span>
              블라인드 종류 선택
            </h3>
            <div className="grid grid-cols-2 gap-2 max-h-[360px] overflow-y-auto pr-1">
              {BLIND_TYPES.map((type) => (
                <button key={type.id} onClick={() => setSelectedType(type)}
                  className={`relative overflow-hidden rounded-xl border transition-all text-left ${
                    selectedType.id === type.id ? 'border-amber-800 ring-2 ring-amber-200' : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}>
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={type.image} alt={type.name} className="w-full h-full object-cover" draggable={false} />
                  </div>
                  <div className={`p-2 ${selectedType.id === type.id ? 'bg-amber-800' : 'bg-white'}`}>
                    <span className={`text-[11px] font-bold block ${selectedType.id === type.id ? 'text-white' : 'text-stone-900'}`}>{type.name}</span>
                    <span className={`text-[9px] block mt-0.5 leading-tight ${selectedType.id === type.id ? 'text-white/70' : 'text-stone-400'}`}>{type.desc}</span>
                  </div>
                  {selectedType.id === type.id && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-800 flex items-center justify-center shadow">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* 창문 크기 + U자 계산 */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-4 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-800 text-white text-[10px] flex items-center justify-center font-bold">★</span>
              창문 실측 크기
            </h3>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-600 block mb-1.5">가로 폭 (mm)</label>
                  <input type="number" value={windowWidthMm || ''} onChange={(e) => setWindowWidthMm(Number(e.target.value))} placeholder="예: 3100"
                    className="w-full px-3 py-2.5 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-amber-300 focus:border-amber-500 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-600 block mb-1.5">세로 높이 (mm)</label>
                  <input type="number" value={windowHeightMm || ''} onChange={(e) => setWindowHeightMm(Number(e.target.value))} placeholder="예: 2300"
                    className="w-full px-3 py-2.5 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-amber-300 focus:border-amber-500 outline-none" />
                </div>
              </div>
              {isFreeBlind && windowWidthMm > 0 && (
                <div className="bg-white rounded-lg p-3 border border-amber-100 space-y-1">
                  <div className="flex justify-between"><span className="text-xs text-stone-500">U자 1개 폭</span><span className="text-xs font-bold">775mm</span></div>
                  <div className="flex justify-between"><span className="text-xs text-stone-500">창문 폭</span><span className="text-xs font-bold">{windowWidthMm.toLocaleString()}mm</span></div>
                  <div className="flex justify-between"><span className="text-xs text-stone-500">뒷열</span><span className="text-xs font-bold">{uBackRow}개</span></div>
                  <div className="flex justify-between"><span className="text-xs text-stone-500">앞열 (뒷열-1)</span><span className="text-xs font-bold">{uFrontRow}개</span></div>
                  <div className="flex justify-between pt-1 border-t border-amber-100">
                    <span className="text-sm font-bold text-amber-800">총 필요 개수</span>
                    <span className="text-lg font-bold text-amber-800">{uBlindCount}개</span>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* 프리블라인드: 별도 문의 안내 */}
          {isFreeBlind && (
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-5 text-center space-y-3">
              <p className="text-sm font-bold text-amber-900">프리블라인드는 별도 문의로 안내드립니다</p>
              <p className="text-xs text-amber-700">프리블라인드 시뮬레이션은 전문 상담을 통해 진행됩니다.<br/>아래 연락처로 문의해 주세요.</p>
              <a href="tel:010-4132-9852" className="inline-flex items-center gap-2 bg-amber-800 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-amber-900 transition-colors">
                <Phone className="h-4 w-4" /> 010-4132-9852
              </a>
            </div>
          )}

          {/* Color */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-4 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-[10px] flex items-center justify-center font-bold">3</span>
              색상 선택
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {BLIND_COLORS.map((color) => (
                <button key={color.id} onClick={() => setSelectedColor(color)} className="group flex flex-col items-center" title={color.name}>
                  <div className={`w-10 h-10 rounded-full border-2 transition-all shadow-sm ${selectedColor.id === color.id ? 'border-amber-800 scale-110 shadow-md' : 'border-stone-200 hover:border-stone-400'}`}>
                    <div className="w-full h-full rounded-full" style={{ backgroundColor: color.hex }} />
                  </div>
                  <span className={`text-[8px] mt-1 font-medium ${selectedColor.id === color.id ? 'text-amber-800' : 'text-stone-400'}`}>
                    {color.name.length > 5 ? color.name.slice(0, 4) + '..' : color.name}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Generate */}
          <button
            disabled={!image || isProcessing || isFreeBlind || (isFreeBlind && (!windowRect || uBackRow === 0))}
            onClick={runSimulation}
            className="w-full py-4 bg-stone-900 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-800 transition-all shadow-lg"
          >
            {isProcessing ? (
              <><Loader2 className="h-5 w-5 animate-spin" /> AI 리터칭 중...</>
            ) : (
              <><Sparkles className="h-5 w-5" /> 시뮬레이션 시작</>
            )}
          </button>
        </div>

        {/* Right: Preview */}
        <div className="lg:col-span-8">
          <div className="bg-stone-100 rounded-2xl aspect-[4/3] relative overflow-hidden shadow-inner border border-stone-200 sticky top-24">
            {!image && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-400">
                <Camera className="h-16 w-16 mb-4 opacity-15" />
                <p className="text-sm font-medium">방 사진을 업로드하면 미리보기가 시작됩니다</p>
                <p className="text-xs text-stone-300 mt-1">창문이 보이는 거실, 침실, 오피스 사진을 올려주세요</p>
              </div>
            )}

            {/* 프리블라인드: 창문 영역 선택 모드 */}
            {image && isFreeBlind && step === 'select' && !resultImage && !isProcessing && (
              <WindowSelector imageSrc={image} onSelect={handleWindowSelect} />
            )}

            {/* 일반 미리보기 (선택 완료 or 다른 블라인드) */}
            {image && !resultImage && !isProcessing && !(isFreeBlind && step === 'select') && (
              <div className="relative h-full w-full">
                <img src={image} alt="Original" className="h-full w-full object-contain" />
                {/* 선택된 창문 영역 표시 */}
                {windowRect && (
                  <div className="absolute border-2 border-amber-500/60 bg-amber-500/5 pointer-events-none"
                    style={{
                      left: `${windowRect.x * 100}%`, top: `${windowRect.y * 100}%`,
                      width: `${windowRect.w * 100}%`, height: `${windowRect.h * 100}%`,
                    }} />
                )}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-stone-700 shadow-sm">
                  원본 사진 {windowRect && '(창문 영역 선택됨)'}
                </div>
              </div>
            )}

            {resultImage && (
              <AnimatePresence mode="wait">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative h-full w-full">
                  <img src={resultImage} alt="Simulated" className="h-full w-full object-contain" />
                  <div className="absolute top-4 left-4 bg-amber-800 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
                    <Sparkles className="h-3 w-3" /> AI 시뮬레이션 결과
                  </div>
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <button onClick={() => { setResultImage(null); if (isFreeBlind) setStep('select'); }} className="bg-white/90 backdrop-blur-sm text-stone-700 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg hover:bg-white">
                      <RotateCcw className="h-3.5 w-3.5" /> 다시하기
                    </button>
                    <button onClick={downloadResult} className="bg-stone-900/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg hover:bg-stone-900">
                      <Download className="h-3.5 w-3.5" /> 저장
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}

            {isProcessing && (
              <div className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                <Loader2 className="h-12 w-12 animate-spin mb-4" />
                <p className="font-bold text-lg">AI가 자연스럽게 다듬고 있습니다</p>
                <p className="text-sm text-white/60 mt-2">블라인드 합성 → 조명/그림자 리터칭 중...</p>
              </div>
            )}
          </div>

          {/* Info Cards */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="p-4 bg-white rounded-xl border border-stone-100 shadow-sm">
              <p className="text-[10px] uppercase tracking-wider text-stone-400 font-bold mb-1">제품</p>
              <p className="text-sm font-bold text-stone-800">{selectedType.name}</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-stone-100 shadow-sm">
              <p className="text-[10px] uppercase tracking-wider text-stone-400 font-bold mb-1">컬러</p>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border border-stone-200" style={{ backgroundColor: selectedColor.hex }} />
                <p className="text-sm font-bold text-stone-800">{selectedColor.name}</p>
              </div>
            </div>
            <div className="p-4 bg-white rounded-xl border border-stone-100 shadow-sm">
              <p className="text-[10px] uppercase tracking-wider text-stone-400 font-bold mb-1">
                {isFreeBlind ? 'U자 개수' : '스마트 홈'}
              </p>
              <p className="text-sm font-bold text-stone-800">
                {isFreeBlind ? (uBlindCount > 0 ? `${uBlindCount}개` : '크기 입력 필요') : 'IoT 연동 가능'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

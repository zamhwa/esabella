import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence, useMotionValue, animate } from 'motion/react';
import { ChevronDown, Shield, Cpu, Leaf, ArrowRight, Sparkles, Star, Phone, Mail, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import BookingCalendar from './BookingCalendar';

const HERO_SLIDES = [
  { image: '/images/free-blind.jpg', subtitle: 'U자형 곡선이 만드는 빛의 예술, 프리블라인드' },
  { image: '/images/free-blind-1.jpg', subtitle: '공간에 품격을 더하는 시그니처 디자인' },
  { image: '/images/free-blind-2.jpg', subtitle: '프리블라인드 — 당신의 창을 작품으로' },
];

const PRODUCTS = [
  { name: '프리블라인드', desc: '이사벨라 시그니처. U자형 곡선(775mm)이 빛을 부드럽게 확산시키며 공간에 품격을 더합니다. 독보적인 곡선미와 세련된 디자인으로 인테리어의 완성을 만듭니다.', image: '/images/free-blind.jpg', tag: 'SIGNATURE' },
  { name: '우드 블라인드', desc: '천연 원목의 따뜻한 질감이 클래식하면서도 모던한 분위기를 연출합니다. 슬랫 각도 조절로 채광과 프라이버시를 동시에 제어할 수 있습니다.', image: '/images/wood-blind-new.jpg', tag: 'CLASSIC' },
  { name: '콤비 블라인드', desc: '패브릭과 메쉬의 교차 구조로 채광과 프라이버시를 자유자재로 조절합니다. 부드러운 빛 조절이 가능해 거실과 침실 모두에 어울립니다.', image: '/images/combi-blind-new.jpg', tag: 'POPULAR' },
  { name: '허니콤 블라인드', desc: '벌집 구조의 우수한 단열 효과로 여름 냉방비와 겨울 난방비를 절감합니다. 소음 차단 효과까지 겸비한 에너지 절약형 블라인드입니다.', image: '/images/honeycomb-blind-new.jpg', tag: 'ECO' },
  { name: '매직 블라인드', desc: '플리츠 원단이 접히며 만드는 섬세한 주름으로 우아하고 부드러운 채광을 연출합니다. 커튼과 블라인드의 장점을 결합한 하이브리드 제품입니다.', image: '/images/blitz-blind.jpg', tag: 'HYBRID' },
  { name: '롤 블라인드', desc: '미니멀한 디자인으로 깔끔한 창가를 완성합니다. 다양한 원단과 차광률 선택이 가능해 어떤 공간에도 조화롭게 어울립니다.', image: '/images/roll-blind.jpg', tag: 'MINIMAL' },
  { name: '로만 블라인드', desc: '접히는 원단이 만드는 수평 주름이 클래식한 우아함을 더합니다. 패브릭의 따뜻한 느낌으로 공간에 포근함을 선사합니다.', image: '/images/roman-blind.jpg', tag: 'ELEGANT' },
  { name: '트리플 쉐이드', desc: '이중 망사 사이에 원단이 삽입된 3중 구조로 정밀한 채광 조절이 가능합니다. 탁 트인 전망과 완벽한 차단을 하나로 누릴 수 있습니다.', image: '/images/triple-shade.jpg', tag: 'PREMIUM' },
];

const PORTFOLIO = [
  { location: '강남구 도곡동 타워팰리스', title: '거실 프리블라인드 시공', desc: '이사벨라 시그니처 프리블라인드의 U자형 곡선이 넓은 거실에 품격과 우아함을 더했습니다.', image: '/images/free-blind.jpg', type: '프리블라인드' },
  { location: '용산구 한남동 더힐', title: '프리블라인드 + 커튼 조합 시공', desc: '프리블라인드와 쉬어 커튼의 레이어링으로 고급 호텔 같은 우아한 채광을 연출했습니다.', image: '/images/free-blind-1.jpg', type: '프리블라인드' },
  { location: '성동구 성수동 카페', title: '우드 블라인드로 완성한 감성 공간', desc: '월넛 컬러 우드 블라인드가 카페 인테리어와 자연스럽게 어우러져 따뜻하고 세련된 분위기를 완성했습니다.', image: '/images/wood-blind-new.jpg', type: '우드 블라인드' },
  { location: '해운대구 마린시티', title: '트리플 쉐이드로 완성한 오션뷰', desc: '탁 트인 바다 전망을 살리면서도 정밀한 채광 조절이 가능한 트리플 쉐이드를 설치했습니다.', image: '/images/triple-shade.jpg', type: '트리플 쉐이드' },
  { location: '분당구 판교동 오피스텔', title: '롤 블라인드로 미니멀 오피스 완성', desc: '화이트 롤 블라인드로 깔끔한 창가를 만들고 모니터 반사를 줄여 업무 효율을 높였습니다.', image: '/images/roll-blind.jpg', type: '롤 블라인드' },
  { location: '마포구 상수동 주택', title: '콤비 블라인드 시공', desc: '화이트 콤비 블라인드로 채광과 프라이버시를 동시에 잡아 쾌적한 주거 환경을 만들었습니다.', image: '/images/combi-blind-new.jpg', type: '콤비 블라인드' },
];

const REVIEWS = [
  { name: '김*현', rating: 5, text: '프리블라인드 정말 예뻐요! U자 곡선이 사진보다 실물이 훨씬 고급스럽습니다. 빛이 곡선 사이로 은은하게 들어오는 게 정말 좋아요.', date: '2026.02.15', product: '프리블라인드' },
  { name: '박*준', rating: 5, text: '프리블라인드 설치하고 집 분위기가 완전히 달라졌어요. 손님들이 올 때마다 어디서 했냐고 물어봐요. 강력 추천합니다!', date: '2026.02.10', product: '프리블라인드' },
  { name: '최*아', rating: 5, text: '상담부터 시공까지 정말 친절하셨어요. 우드 블라인드 색상 고르는 것도 꼼꼼하게 도와주셔서 만족스러운 결과를 얻었습니다.', date: '2026.01.28', product: '우드 블라인드' },
  { name: '정*우', rating: 5, text: '허니콤 블라인드 설치하고 난방비가 확실히 줄었어요. 단열 효과가 정말 좋고 디자인도 깔끔해서 대만족입니다.', date: '2026.01.20', product: '허니콤 블라인드' },
  { name: '이*영', rating: 5, text: '콤비 블라인드 추천받아 설치했는데 역시 전문가 의견은 다르네요. 트리플 쉐이드도 같이 했는데 공간이 완전히 달라 보여요!', date: '2026.01.15', product: '콤비 블라인드' },
];

const STATS = [
  { label: '시공 완료', value: 1200, suffix: '건+' },
  { label: '고객 만족도', value: 99, suffix: '%' },
  { label: '경력', value: 15, suffix: '년' },
  { label: '제휴 단지', value: 340, suffix: '곳+' },
];

// === Counter Animation ===
function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const motionVal = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (isInView) {
      const ctrl = animate(motionVal, value, { duration: 2, ease: 'easeOut' });
      const unsub = motionVal.on('change', (v) => setDisplay(Math.round(v)));
      return () => { ctrl.stop(); unsub(); };
    }
  }, [isInView, value]);

  return (
    <span ref={ref} className="counter-value">
      {display.toLocaleString()}{suffix}
    </span>
  );
}

// === Gold Divider ===
function GoldDivider() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <div ref={ref} className="flex justify-center py-2">
      <motion.div
        className="gold-divider max-w-md"
        initial={{ width: 0 }}
        animate={isInView ? { width: '100%' } : {}}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
        style={{ height: 1 }}
      />
    </div>
  );
}

// === Glowing Text Belt (서서히 빛나며 페이드) ===
function GlowBelt() {
  const phrases = ['ESABELLA', 'PREMIUM FREE BLIND', '프리블라인드', 'SINCE 2010', 'HANDCRAFTED ELEGANCE'];
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActiveIdx(prev => (prev + 1) % phrases.length), 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative py-8 bg-stone-950 border-y border-amber-900/20 overflow-hidden">
      {/* 배경 글로우 */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ opacity: [0.05, 0.15, 0.05] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-[500px] h-[80px] rounded-full" style={{ background: 'radial-gradient(ellipse, rgba(212,168,67,0.3) 0%, transparent 70%)' }} />
      </motion.div>

      {/* 텍스트 페이드 전환 */}
      <div className="relative h-8 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={activeIdx}
            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="absolute text-base md:text-lg font-serif tracking-[0.4em] font-bold"
            style={{
              background: 'linear-gradient(135deg, #B8860B, #FFD700, #D4A843, #FFD700, #B8860B)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {phrases[activeIdx]}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* 좌우 장식 라인 */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-stone-950 to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-stone-950 to-transparent z-10" />
    </div>
  );
}

// === Scroll Reveal Image ===
function ScrollRevealImage({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const clipPath = useTransform(scrollYProgress, [0.1, 0.4], ['inset(0 100% 0 0)', 'inset(0 0% 0 0)']);
  const scale = useTransform(scrollYProgress, [0.1, 0.5], [1.2, 1]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ clipPath }}>
        <motion.img src={src} alt={alt} className="w-full h-full object-cover" style={{ scale }} />
      </motion.div>
    </div>
  );
}

// === FIFA-style Circular 3D Carousel (infinite loop, items visible on both sides) ===
function FifaCarousel({ items, renderCard, height = 420 }: {
  items: any[];
  renderCard: (item: any, index: number, isCenter: boolean) => React.ReactNode;
  height?: number;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [sparkPos, setSparkPos] = useState<{ x: number; y: number } | null>(null);
  const dragStartX = useRef(0);
  const isDragging = useRef(false);
  const n = items.length;

  const goTo = useCallback((idx: number) => {
    setActiveIndex(((idx % n) + n) % n); // wrap around
  }, [n]);

  const handlePointerDown = (e: React.PointerEvent) => { dragStartX.current = e.clientX; isDragging.current = true; };
  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const dx = e.clientX - dragStartX.current;
    if (Math.abs(dx) > 50) goTo(activeIndex + (dx < 0 ? 1 : -1));
  };

  const handleCardClick = (idx: number, e: React.MouseEvent) => {
    if (idx === activeIndex) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setSparkPos({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    setTimeout(() => setSparkPos(null), 700);
    goTo(idx);
  };

  // Calculate circular offset: shortest path around the ring
  const circularOffset = (i: number) => {
    let diff = i - activeIndex;
    if (diff > n / 2) diff -= n;
    if (diff < -n / 2) diff += n;
    return diff;
  };

  return (
    <div className="relative select-none" style={{ height }}>
      <AnimatePresence>
        {sparkPos && (
          <motion.div initial={{ scale: 0, opacity: 1 }} animate={{ scale: 3, opacity: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }} className="fixed pointer-events-none z-50"
            style={{ left: sparkPos.x - 100, top: sparkPos.y - 100, width: 200, height: 200 }}>
            <div className="w-full h-full rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,215,0,0.6) 0%, rgba(212,168,67,0.3) 40%, rgba(184,134,11,0.1) 70%, transparent 100%)' }} />
          </motion.div>
        )}
      </AnimatePresence>

      <button onClick={() => goTo(activeIndex - 1)}
        className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/90 backdrop-blur-sm border border-stone-200 shadow-lg hover:bg-white transition-all">
        <ChevronLeft className="h-5 w-5 text-stone-700" />
      </button>
      <button onClick={() => goTo(activeIndex + 1)}
        className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/90 backdrop-blur-sm border border-stone-200 shadow-lg hover:bg-white transition-all">
        <ChevronRight className="h-5 w-5 text-stone-700" />
      </button>

      <div className="relative w-full h-full flex items-center justify-center overflow-hidden"
        onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} style={{ touchAction: 'pan-y' }}>
        {items.map((item, i) => {
          const offset = circularOffset(i);
          const absOffset = Math.abs(offset);
          if (absOffset > 3) return null;
          const isCenter = offset === 0;
          return (
            <motion.div key={i} className="absolute cursor-pointer"
              animate={{ x: offset * 220, scale: isCenter ? 1 : Math.max(0.55, 1 - absOffset * 0.18), rotateY: offset * -8, opacity: absOffset > 2 ? 0.3 : 1, filter: `blur(${isCenter ? 0 : absOffset * 1.5}px)` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{ zIndex: 10 - absOffset, transformStyle: 'preserve-3d', perspective: 1000 }}
              onClick={(e) => handleCardClick(i, e)}>
              {renderCard(item, i, isCenter)}
            </motion.div>
          );
        })}
      </div>

      <div className="flex justify-center gap-1.5 mt-4">
        {items.map((_, i) => (
          <button key={i} onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${i === activeIndex ? 'w-8 h-2 bg-amber-700' : 'w-2 h-2 bg-stone-300 hover:bg-stone-400'}`} />
        ))}
      </div>
    </div>
  );
}

// === Cards ===
function ProductCard({ product, isCenter }: { product: typeof PRODUCTS[0]; isCenter: boolean }) {
  return (
    <div className={`w-[240px] md:w-[280px] transition-all duration-300 ${isCenter ? 'drop-shadow-2xl' : 'drop-shadow-md'}`}>
      <div className={`rounded-2xl overflow-hidden bg-white border-2 transition-all duration-300 ${isCenter ? 'border-amber-500/50 shadow-[0_0_30px_rgba(212,168,67,0.3)]' : 'border-stone-200/50'}`}>
        <div className="aspect-[3/4] overflow-hidden">
          <img src={product.image} alt={product.name} className={`w-full h-full object-cover transition-transform duration-500 ${isCenter ? 'scale-105' : ''}`} draggable={false} />
        </div>
        <div className={`p-4 transition-all ${isCenter ? 'bg-gradient-to-b from-white to-amber-50/30' : 'bg-white'}`}>
          <span className={`text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full ${isCenter ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-500'}`}>{product.tag}</span>
          <h4 className={`font-bold mt-1 transition-colors ${isCenter ? 'text-lg text-stone-900' : 'text-sm text-stone-600'}`}>{product.name}</h4>
          <AnimatePresence>
            {isCenter && <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-stone-500 text-xs mt-2 leading-relaxed">{product.desc}</motion.p>}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function PortfolioCard({ item, isCenter }: { item: typeof PORTFOLIO[0]; isCenter: boolean }) {
  return (
    <div className={`w-[280px] md:w-[340px] transition-all duration-300 ${isCenter ? 'drop-shadow-2xl' : 'drop-shadow-md'}`}>
      <div className={`rounded-2xl overflow-hidden border-2 transition-all duration-300 ${isCenter ? 'border-amber-500/40 shadow-[0_0_25px_rgba(212,168,67,0.2)]' : 'border-stone-200/50'}`}>
        <div className="aspect-[4/5] overflow-hidden relative">
          <img src={item.image} alt={item.title} className={`w-full h-full object-cover transition-transform duration-500 ${isCenter ? 'scale-105' : ''}`} draggable={false} />
          <div className={`absolute inset-0 transition-opacity ${isCenter ? 'bg-gradient-to-t from-black/60 via-transparent to-transparent' : 'bg-black/20'}`} />
          <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[10px] font-bold tracking-wider text-stone-700 px-3 py-1.5 rounded-full">{item.type}</span>
          <AnimatePresence>
            {isCenter && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-[11px] font-semibold text-amber-300 mb-1 tracking-wide">{item.location}</p>
                <h4 className="text-white text-base font-bold leading-snug">{item.title}</h4>
                <p className="text-white/70 text-xs mt-1.5 leading-relaxed">{item.desc}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// === Stagger Text ===
function StaggerText({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <span ref={ref} className={`inline-flex flex-wrap ${className}`}>
      {text.split('').map((char, i) => (
        <motion.span key={i}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: i * 0.04, duration: 0.5, ease: 'easeOut' }}
          className={char === ' ' ? 'w-[0.3em]' : ''}
        >{char}</motion.span>
      ))}
    </span>
  );
}

// =====================
// MAIN HOME COMPONENT
// =====================
export default function Home({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  const [heroIndex, setHeroIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setHeroIndex(prev => (prev + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  // Parallax refs
  const parallaxRef = useRef(null);
  const { scrollYProgress: paraProgress } = useScroll({ target: parallaxRef, offset: ['start end', 'end start'] });
  const paraY = useTransform(paraProgress, [0, 1], ['-10%', '10%']);

  return (
    <div className="relative">
      {/* === HERO === */}
      <section className="relative h-screen bg-stone-900 overflow-hidden">
        {HERO_SLIDES.map((slide, i) => (
          <motion.div key={i} className="absolute inset-0"
            animate={{ opacity: i === heroIndex ? 1 : 0, scale: i === heroIndex ? 1.05 : 1 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}>
            <img src={slide.image} alt="Esabella" className="w-full h-full object-cover" />
          </motion.div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/70 z-[1]" />

        <motion.div style={{ opacity: heroOpacity }} className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="text-xs font-medium tracking-[0.4em] text-white/50 uppercase block mb-6">
              Premium Free Blind & Window Treatment
            </span>
            {/* Text mask — ESABELLA with image fill */}
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-serif font-bold mb-4 leading-[1.1]"
              style={{
                backgroundImage: `url(${HERO_SLIDES[heroIndex].image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'brightness(1.8) contrast(1.2)',
              }}>
              ESABELLA
            </h1>
            <motion.p key={heroIndex} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="text-lg md:text-xl text-white/70 font-light max-w-lg mx-auto leading-relaxed mb-12">
              {HERO_SLIDES[heroIndex].subtitle}
            </motion.p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex flex-col sm:flex-row gap-4">
            <button onClick={() => onNavigate('simulation')} className="px-8 py-4 bg-white text-stone-900 rounded-full font-bold text-sm hover:bg-white/90 transition-all inline-flex items-center gap-2">
              <Sparkles className="h-4 w-4" /> AI 시뮬레이션 체험
            </button>
            <a href="tel:010-0000-0000" className="px-8 py-4 border border-white/30 text-white rounded-full font-medium text-sm hover:bg-white/10 transition-all inline-flex items-center gap-2">
              <Phone className="h-4 w-4" /> 무료 상담 신청
            </a>
          </motion.div>

          <div className="absolute bottom-20 flex gap-2">
            {HERO_SLIDES.map((_, i) => (
              <button key={i} onClick={() => setHeroIndex(i)} className={`h-1 rounded-full transition-all duration-500 ${i === heroIndex ? 'w-10 bg-white' : 'w-2 bg-white/30'}`} />
            ))}
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="absolute bottom-8">
            <ChevronDown className="h-6 w-6 animate-bounce text-white/40" />
          </motion.div>
        </motion.div>
      </section>

      {/* === MARQUEE BELT === */}
      <GlowBelt />

      {/* === FIFA PRODUCT CAROUSEL === */}
      <section id="products" className="bg-stone-50 py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-[0.3em] text-amber-800 uppercase">Collection</span>
            <h2 className="text-3xl md:text-5xl font-serif mt-4 text-stone-900">
              <StaggerText text="제품 컬렉션" />
            </h2>
            <p className="text-stone-400 text-sm mt-3">좌우로 스와이프하여 제품을 둘러보세요</p>
          </div>
          <FifaCarousel items={PRODUCTS} height={520} renderCard={(item, i, isCenter) => <ProductCard product={item} isCenter={isCenter} />} />
        </div>
      </section>

      <GoldDivider />

      {/* === STATS COUNTER === */}
      <section className="bg-stone-900 py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="text-center">
              <p className="text-3xl md:text-4xl font-serif font-bold text-amber-400">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-white/50 text-xs mt-2 tracking-wider uppercase">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <GoldDivider />

      {/* === BRAND STORY with Parallax === */}
      <section ref={parallaxRef} className="bg-white py-28 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <span className="text-xs font-semibold tracking-[0.3em] text-amber-800 uppercase">About Esabella</span>
            <h2 className="text-3xl md:text-5xl font-serif mt-4 mb-8 text-stone-900 leading-tight">
              <StaggerText text="프리블라인드로 완성하는" /><br />
              <span className="italic text-stone-400">공간의 품격</span>
            </h2>
            <p className="text-stone-500 text-lg leading-relaxed max-w-2xl mx-auto">
              이사벨라의 시그니처 <strong className="text-stone-700">프리블라인드</strong>는 U자형 곡선이 빛을 부드럽게 확산시키며
              어떤 공간에도 독보적인 우아함을 선사합니다.
              프리블라인드를 포함한 프리미엄 윈도우 트리트먼트 전문 —
              무료 방문 상담, 맞춤 제작, 전문 시공, 완벽한 A/S까지 책임집니다.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {[
              { icon: Shield, title: '프리미엄 품질', desc: '변색과 뒤틀림이 없는 최고급 원단과 소재만을 엄선합니다.' },
              { icon: Cpu, title: '스마트 홈 연동', desc: '음성 제어, 일출/일몰 자동 스케줄링, 앱 원격 제어를 지원합니다.' },
              { icon: Leaf, title: '에너지 절감', desc: '우수한 단열 효과로 냉난방비를 절감하고 쾌적한 실내를 유지합니다.' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-8">
                <div className="h-14 w-14 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center mx-auto mb-5">
                  <item.icon className="h-6 w-6 text-stone-700" />
                </div>
                <h4 className="font-bold text-stone-900 mb-2 text-lg">{item.title}</h4>
                <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* === 프리블라인드 시그니처 — Scroll Reveal Image === */}
      <section className="bg-stone-50 py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold tracking-[0.3em] text-amber-800 uppercase">Signature</span>
            <h2 className="text-3xl md:text-5xl font-serif mt-4 text-stone-900">
              <StaggerText text="프리블라인드" />
            </h2>
            <p className="text-stone-400 text-sm mt-3 max-w-xl mx-auto">U자형 곡선(775mm)이 만드는 독보적인 디자인. 빛과 공간을 예술로 바꿉니다.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
              <h3 className="text-2xl font-serif font-bold text-stone-900">왜 프리블라인드인가?</h3>
              <div className="space-y-4">
                {[
                  { title: 'U자형 곡선 디자인', desc: '775mm 단위의 우아한 U자 곡선이 일반 블라인드와는 차원이 다른 고급스러움을 연출합니다.' },
                  { title: '부드러운 빛 확산', desc: 'U자 곡선이 직사광선을 부드럽게 분산시켜 눈부심 없는 자연스러운 채광을 만듭니다.' },
                  { title: '공간 품격 향상', desc: '설치 즉시 공간의 분위기가 달라집니다. 호텔, 펜트하우스급 인테리어를 완성합니다.' },
                  { title: '맞춤 시공', desc: '창문 크기를 정밀 실측하여 775mm 단위로 최적의 개수를 배치합니다.' },
                ].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex gap-4">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mt-0.5">
                      <span className="text-amber-800 text-xs font-bold">{i + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm">{item.title}</h4>
                      <p className="text-stone-500 text-sm leading-relaxed mt-0.5">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            {/* Scroll reveal image */}
            <div className="relative">
              <ScrollRevealImage src="/images/free-blind-2.jpg" alt="프리블라인드" className="aspect-[4/5] rounded-3xl shadow-2xl" />
              <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                className="absolute -bottom-4 -left-4 bg-stone-900 text-white px-6 py-3 rounded-2xl shadow-xl">
                <span className="text-amber-400 text-xs font-bold tracking-wider">UNIT SIZE</span>
                <p className="text-lg font-bold">775mm</p>
              </motion.div>
            </div>
          </div>

          {/* 색상표 */}
          <div className="mb-8">
            <h3 className="text-center text-2xl font-serif font-bold text-stone-900 mb-3">색상 컬렉션</h3>
            <p className="text-center text-stone-400 text-sm mb-10">프리블라인드는 다양한 색상으로 공간에 맞는 최적의 분위기를 연출합니다.</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-3 max-w-5xl mx-auto">
              {[
                { name: '퓨어 화이트', color: '#FFFFFF', border: true },
                { name: '밀크 화이트', color: '#F5F0E8', border: true },
                { name: '아이보리', color: '#EEDFCC' },
                { name: '크림', color: '#F5E6C8' },
                { name: '베이지', color: '#D4C5A9' },
                { name: '라떼', color: '#C4A882' },
                { name: '모카', color: '#967259' },
                { name: '라이트 그레이', color: '#D0CFC9' },
                { name: '그레이', color: '#9E9E9E' },
                { name: '차콜', color: '#5C5C5C' },
              ].map((c, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  className="flex flex-col items-center gap-2 group cursor-pointer">
                  <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl shadow-md group-hover:scale-110 group-hover:shadow-xl transition-all duration-300 ${'border' in c && c.border ? 'border border-stone-200' : ''}`}
                    style={{ backgroundColor: c.color }} />
                  <span className="text-[10px] text-stone-500 font-medium text-center leading-tight">{c.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <GoldDivider />

      {/* === AI CTA — Parallax Background === */}
      <section className="relative py-32 px-6 overflow-hidden">
        <motion.img src="/images/free-blind-1.jpg" alt="프리블라인드" className="absolute inset-0 w-full h-full object-cover" style={{ y: paraY }} />
        <div className="absolute inset-0 bg-stone-900/70" />
        <div className="relative z-10 max-w-3xl mx-auto text-center text-white">
          <Sparkles className="h-8 w-8 mx-auto mb-6 text-amber-400" />
          <h2 className="text-3xl md:text-5xl font-serif mb-6">
            <StaggerText text="우리 집에 어울릴까?" />
          </h2>
          <p className="text-white/70 text-lg mb-10 leading-relaxed">
            이사벨라 AI 시뮬레이션으로 방 사진에 블라인드를 미리 설치해보세요.
          </p>
          <button onClick={() => onNavigate('simulation')} className="inline-flex items-center gap-2 px-10 py-5 bg-white text-stone-900 rounded-full font-bold text-sm hover:bg-white/90 transition-all shadow-2xl">
            AI 시뮬레이션 체험하기 <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      {/* === MARQUEE BELT 2 === */}
      <GlowBelt />

      {/* === PORTFOLIO — Cinematic Grid with Hover Expand === */}
      <section id="portfolio" className="bg-white py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold tracking-[0.3em] text-amber-800 uppercase">Portfolio</span>
            <h2 className="text-3xl md:text-5xl font-serif mt-4 text-stone-900">
              <StaggerText text="시공 사례" />
            </h2>
            <p className="text-stone-400 max-w-md mx-auto text-sm mt-3">
              이사벨라 블라인드가 설치된 실제 공간입니다.
            </p>
          </div>

          {/* Masonry-style staggered grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-[280px]">
            {PORTFOLIO.map((item, i) => {
              // Varied grid spans for visual interest
              const spans = ['md:col-span-7', 'md:col-span-5', 'md:col-span-4', 'md:col-span-4', 'md:col-span-4', 'md:col-span-6 md:col-start-4'];
              const rowSpans = [' md:row-span-2', '', '', '', '', ' md:row-span-1'];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className={`group relative overflow-hidden rounded-2xl ${spans[i]}${rowSpans[i]} cursor-pointer`}
                >
                  {/* Image with parallax zoom on hover */}
                  <motion.img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
                  />
                  {/* Dark overlay that lightens on hover */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-700" />
                  {/* Gold border glow on hover */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-amber-500/40 rounded-2xl transition-all duration-500" />
                  {/* Type badge */}
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[10px] font-bold tracking-wider text-stone-700 px-3 py-1.5 rounded-full z-10">{item.type}</span>
                  {/* Content that slides up on hover */}
                  <div className="absolute inset-x-0 bottom-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-[11px] font-semibold text-amber-400 mb-1 tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{item.location}</p>
                    <h4 className="text-white text-lg font-bold leading-snug">{item.title}</h4>
                    <p className="text-white/60 text-xs mt-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200 max-w-sm">{item.desc}</p>
                    {/* Gold underline animation */}
                    <div className="h-0.5 w-0 group-hover:w-16 bg-gradient-to-r from-amber-400 to-amber-600 mt-3 transition-all duration-700 delay-300 rounded-full" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <GoldDivider />

      {/* === REVIEWS === */}
      <section className="bg-stone-900 py-28 px-6 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold tracking-[0.3em] text-amber-400 uppercase">Reviews</span>
            <h2 className="text-3xl md:text-5xl font-serif mt-4">고객님의 이야기</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REVIEWS.map((review, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="p-8 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/[0.08] transition-colors">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(review.rating)].map((_, j) => <Star key={j} className="h-4 w-4 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-white/80 text-sm mb-6 leading-relaxed">"{review.text}"</p>
                <div className="flex justify-between items-center border-t border-white/10 pt-4">
                  <div>
                    <span className="text-xs font-bold text-white/60">{review.name}님</span>
                    <span className="text-[10px] text-white/30 ml-2">{review.product}</span>
                  </div>
                  <span className="text-[10px] text-white/30">{review.date}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Calendar */}
      <BookingCalendar />

      {/* Contact */}
      <section className="bg-stone-50 py-28 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-semibold tracking-[0.3em] text-amber-800 uppercase">Contact</span>
          <h2 className="text-3xl md:text-5xl font-serif mt-4 mb-6 text-stone-900">무료 상담 신청</h2>
          <p className="text-stone-500 text-lg mb-12">전문 컨설턴트가 방문하여 공간에 맞는 최적의 블라인드를 제안해드립니다.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: Phone, label: '전화 상담', value: '010-0000-0000', href: 'tel:010-0000-0000' },
              { icon: Mail, label: '이메일', value: 'info@esabella.kr', href: 'mailto:info@esabella.kr' },
              { icon: MapPin, label: '쇼룸', value: '서울시 강남구', href: '#' },
            ].map((item, i) => (
              <a key={i} href={item.href} className="p-8 bg-white rounded-2xl border border-stone-100 hover:border-amber-200 hover:shadow-lg transition-all group">
                <item.icon className="h-6 w-6 text-amber-800 mx-auto mb-3" />
                <p className="text-xs text-stone-400 font-semibold uppercase tracking-wider mb-1">{item.label}</p>
                <p className="text-stone-900 font-bold group-hover:text-amber-800 transition-colors">{item.value}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <GoldDivider />

      {/* Footer */}
      <footer className="bg-stone-900 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
            <div>
              <h3 className="font-serif text-2xl font-bold tracking-wide mb-3"
                style={{ background: 'linear-gradient(135deg, #B8860B, #FFD700, #D4A843)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                ESABELLA
              </h3>
              <p className="text-sm text-white/40 max-w-xs leading-relaxed">프리블라인드와 함께 빛과 공간을 디자인하는 프리미엄 윈도우 트리트먼트 브랜드</p>
            </div>
            <div className="flex gap-12 text-sm">
              <div className="space-y-3">
                <p className="text-white/30 font-semibold text-xs uppercase tracking-wider">Products</p>
                <p className="text-white/60 hover:text-white cursor-pointer transition-colors font-semibold text-amber-400/80">프리블라인드</p>
                <p className="text-white/60 hover:text-white cursor-pointer transition-colors">우드 블라인드</p>
                <p className="text-white/60 hover:text-white cursor-pointer transition-colors">콤비 블라인드</p>
                <p className="text-white/60 hover:text-white cursor-pointer transition-colors">허니콤 블라인드</p>
              </div>
              <div className="space-y-3">
                <p className="text-white/30 font-semibold text-xs uppercase tracking-wider">Service</p>
                <p className="text-white/60 hover:text-white cursor-pointer transition-colors">무료 방문 상담</p>
                <p className="text-white/60 hover:text-white cursor-pointer transition-colors">맞춤 제작</p>
                <p className="text-white/60 hover:text-white cursor-pointer transition-colors">전문 시공</p>
                <p className="text-white/60 hover:text-white cursor-pointer transition-colors">A/S 지원</p>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-white/30">&copy; 2026 Esabella Blinds. All rights reserved.</p>
            <div className="flex gap-6 text-xs text-white/30">
              <span className="hover:text-white/60 cursor-pointer">개인정보처리방침</span>
              <span className="hover:text-white/60 cursor-pointer">이용약관</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

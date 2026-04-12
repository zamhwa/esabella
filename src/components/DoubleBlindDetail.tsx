import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'motion/react';
import { Phone, ChevronLeft, ChevronRight, X, ArrowRight, Sparkles } from 'lucide-react';

const GALLERY_IMAGES = Array.from({ length: 23 }, (_, i) => ({
  src: `/images/double-blind/img-${String(i + 1).padStart(2, '0')}.jpg`,
  alt: `더블블라인드 시공 사례 ${i + 1}`,
}));

const GALLERY_CATEGORIES = [
  { label: '전체', filter: 'all' },
];

const FEATURES = [
  {
    title: '더블 구조 시스템',
    desc: '앞면(채광 원단) + 뒷면(암막 원단) 이중 구조로 순서 변경도 가능합니다. 채광/암막/동시 사용까지 3가지 모드를 지원합니다.',
    icon: '◈',
  },
  {
    title: '1000+ 원단 조합',
    desc: '아이보리, 크림 등 다양한 컬러의 100% 암막 원단과 린넨 텍스처 썬스크린 & 콤비 원단 등 1000여 가지 조합이 가능합니다.',
    icon: '✦',
  },
  {
    title: '노코드 안전 설계',
    desc: '줄 없는 노코드 시스템으로 자녀방에도 안심 사용 가능합니다. 손 작동, 줄 작동, 전동까지 다양한 방식을 선택할 수 있습니다.',
    icon: '♡',
  },
  {
    title: '하단 바 자석 적용',
    desc: '하단 바 자석 적용 시 깔끔한 정렬이 가능합니다. 충전형 모션 전동 시스템으로 전기 공사 없이 설치할 수 있습니다.',
    icon: '⊕',
  },
];

const SPECS = [
  { label: '구조', value: '앞면 + 뒷면 이중 구조' },
  { label: '채광 원단', value: '썬스크린 / 콤비 / 린넨' },
  { label: '암막 원단', value: '100% 암막 다양한 컬러' },
  { label: '작동 방식', value: '노코드 / 줄 / 전동' },
  { label: '원단 조합', value: '1,000가지 이상' },
  { label: '옵션', value: '하단 바 자석 / 모션 전동' },
];

interface DoubleBlindDetailProps {
  onNavigate: (page: string) => void;
}

export default function DoubleBlindDetail({ onNavigate }: DoubleBlindDetailProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const filteredImages = activeCategory === 'all'
    ? GALLERY_IMAGES
    : GALLERY_IMAGES.filter((_, i) => GALLERY_IMAGES[i + 1] !== undefined);

  const openLightbox = (globalIdx: number) => setLightboxIdx(globalIdx);
  const closeLightbox = () => setLightboxIdx(null);
  const prevImage = () => setLightboxIdx((prev) => prev !== null ? (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length : null);
  const nextImage = () => setLightboxIdx((prev) => prev !== null ? (prev + 1) % GALLERY_IMAGES.length : null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (lightboxIdx === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIdx]);

  return (
    <div className="bg-white">
      {/* === Hero Section === */}
      <section ref={heroRef} className="relative h-[85vh] overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <img
            src="/images/double-blind/img-01.jpg"
            alt="더블블라인드 히어로"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70" />
        </motion.div>
        <motion.div className="relative h-full flex flex-col justify-end pb-16 px-6 md:px-16" style={{ opacity: heroOpacity }}>
          <div className="max-w-4xl">
            <motion.span
              className="inline-block text-amber-400 text-xs font-bold tracking-[0.3em] uppercase mb-4"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            >
              ESABELLA PREMIUM
            </motion.span>
            <motion.h1
              className="text-4xl md:text-7xl font-serif font-bold text-white mb-4 leading-tight"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
            >
              DOUBLE BLIND
            </motion.h1>
            <motion.p
              className="text-white/70 text-lg md:text-xl max-w-2xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            >
              하나로 두 가지 효과.<br className="hidden md:block" />
              낮과 밤 모두 만족시키는 이사벨라 더블 블라인드.
            </motion.p>
            <motion.div
              className="flex flex-wrap gap-3 mt-8"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
            >
              <a
                href="tel:010-4132-9852"
                className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white px-6 py-3 rounded-full font-bold text-sm transition-colors"
              >
                <Phone className="h-4 w-4" /> 상담 문의 010-4132-9852
              </a>
              <button
                onClick={() => onNavigate('simulation')}
                className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white px-6 py-3 rounded-full font-bold text-sm transition-colors border border-white/20"
              >
                <Sparkles className="h-4 w-4" /> AI 시뮬레이션
              </button>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* === 제품 소개 === */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionReveal>
                <span className="text-xs font-bold tracking-[0.3em] text-amber-800 uppercase">About Double Blind</span>
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-stone-900 mt-3 mb-6 leading-tight">
                  채광과 암막을<br />동시에 구현하다
                </h2>
                <div className="space-y-4 text-stone-600 leading-relaxed">
                  <p>
                    이사벨라의 프리미엄 <strong className="text-stone-800">더블 블라인드</strong>는
                    채광(썬스크린/콤비등) + 암막을 동시에 구현해 낮과 밤 모두 만족시키는 제품입니다.
                  </p>
                  <p>
                    앞면(채광 원단)과 뒷면(암막 원단)의 이중 구조로, 은은한 빛부터 완전 차광까지
                    상황에 따라 자유롭게 조절할 수 있습니다.
                  </p>
                  <p>
                    1000여 가지 원단 조합이 가능하며, 자연스러운 섬유결로 공간의 깊이감을 연출합니다.
                  </p>
                </div>
              </SectionReveal>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <SectionReveal delay={0.1}>
                <div className="aspect-[3/4] rounded-2xl overflow-hidden">
                  <img src="/images/double-blind/img-05.jpg" alt="더블블라인드" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              </SectionReveal>
              <SectionReveal delay={0.2}>
                <div className="aspect-[3/4] rounded-2xl overflow-hidden mt-8">
                  <img src="/images/double-blind/img-10.jpg" alt="더블블라인드" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              </SectionReveal>
            </div>
          </div>
        </div>
      </section>

      {/* === 특장점 === */}
      <section className="py-24 px-6 bg-stone-50">
        <div className="max-w-6xl mx-auto">
          <SectionReveal>
            <div className="text-center mb-16">
              <span className="text-xs font-bold tracking-[0.3em] text-amber-800 uppercase">Features</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mt-3">더블 블라인드의 특별함</h2>
            </div>
          </SectionReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map((f, i) => (
              <SectionReveal key={i} delay={i * 0.1}>
                <div className="bg-white rounded-2xl p-8 border border-stone-100 hover:shadow-lg hover:border-amber-200 transition-all group">
                  <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mb-5 group-hover:bg-amber-100 transition-colors">
                    <span className="text-amber-800 text-xl font-bold">{f.icon}</span>
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 mb-3">{f.title}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* === 와이드 이미지 브레이크 === */}
      <section className="relative h-[50vh] overflow-hidden">
        <ParallaxImage src="/images/double-blind/img-03.jpg" alt="더블블라인드 와이드" />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="text-center text-white">
            <p className="text-xs tracking-[0.4em] uppercase mb-3 text-white/60">Dual Functionality</p>
            <h3 className="text-3xl md:text-5xl font-serif font-bold">두 가지를 하나로</h3>
          </div>
        </div>
      </section>

      {/* === 제품 사양 === */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <SectionReveal>
            <div className="text-center mb-12">
              <span className="text-xs font-bold tracking-[0.3em] text-amber-800 uppercase">Specifications</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mt-3">제품 사양</h2>
            </div>
          </SectionReveal>
          <SectionReveal delay={0.1}>
            <div className="bg-stone-50 rounded-2xl border border-stone-100 overflow-hidden">
              {SPECS.map((s, i) => (
                <div key={i} className={`flex justify-between items-center px-8 py-5 ${i < SPECS.length - 1 ? 'border-b border-stone-100' : ''}`}>
                  <span className="text-stone-500 text-sm font-medium">{s.label}</span>
                  <span className="text-stone-900 font-bold text-sm">{s.value}</span>
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* === 시공 갤러리 === */}
      <section className="py-24 px-6 bg-stone-950" id="gallery">
        <div className="max-w-7xl mx-auto">
          <SectionReveal>
            <div className="text-center mb-12">
              <span className="text-xs font-bold tracking-[0.3em] text-amber-400 uppercase">Gallery</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mt-3 mb-8">시공 갤러리</h2>
              <div className="flex flex-wrap justify-center gap-2">
                {GALLERY_CATEGORIES.map((cat) => (
                  <button
                    key={cat.filter}
                    onClick={() => setActiveCategory(cat.filter)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                      activeCategory === cat.filter
                        ? 'bg-amber-700 text-white'
                        : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </SectionReveal>

          <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <AnimatePresence mode="popLayout">
              {filteredImages.map((img) => {
                const globalIdx = GALLERY_IMAGES.indexOf(img);
                return (
                  <motion.div
                    key={img.src}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="aspect-[3/4] rounded-xl overflow-hidden cursor-pointer group"
                    onClick={() => openLightbox(globalIdx)}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* === CTA === */}
      <section className="py-24 px-6 bg-gradient-to-b from-stone-100 to-white">
        <div className="max-w-3xl mx-auto text-center">
          <SectionReveal>
            <span className="text-xs font-bold tracking-[0.3em] text-amber-800 uppercase">Contact</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mt-3 mb-4">
              더블 블라인드 상담 문의
            </h2>
            <p className="text-stone-500 mb-10 leading-relaxed">
              전문 컨설턴트가 방문하여 공간에 맞는 최적의 더블 블라인드 구성을 제안해드립니다.<br />
              무료 방문 상담을 신청해 보세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:010-4132-9852"
                className="inline-flex items-center justify-center gap-2 bg-amber-800 hover:bg-amber-900 text-white px-8 py-4 rounded-full font-bold transition-colors shadow-lg"
              >
                <Phone className="h-5 w-5" /> 010-4132-9852
              </a>
              <button
                onClick={() => {
                  onNavigate('home');
                  setTimeout(() => {
                    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
                  }, 200);
                }}
                className="inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white px-8 py-4 rounded-full font-bold transition-colors shadow-lg"
              >
                방문 예약하기 <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-stone-400 mt-6">
              이사벨라 일산 | 경기도 고양시 일산서구 덕이로292번길 70, 1층 02호
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* === Lightbox === */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <button onClick={closeLightbox} className="absolute top-4 right-4 text-white/60 hover:text-white z-10 p-2">
              <X className="h-8 w-8" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-4 text-white/60 hover:text-white z-10 p-2">
              <ChevronLeft className="h-10 w-10" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-4 text-white/60 hover:text-white z-10 p-2">
              <ChevronRight className="h-10 w-10" />
            </button>
            <motion.img
              key={lightboxIdx}
              src={GALLERY_IMAGES[lightboxIdx].src}
              alt={GALLERY_IMAGES[lightboxIdx].alt}
              className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-4 text-white/40 text-sm">
              {lightboxIdx + 1} / {GALLERY_IMAGES.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// === Helper Components ===

function SectionReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

function ParallaxImage({ src, alt }: { src: string; alt: string }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-80, 80]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <motion.img src={src} alt={alt} className="w-full h-[120%] object-cover" style={{ y }} />
    </div>
  );
}

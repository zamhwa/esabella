import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'motion/react';
import { Phone, ChevronLeft, ChevronRight, X, ArrowRight, Sparkles } from 'lucide-react';

const GALLERY_IMAGES = Array.from({ length: 16 }, (_, i) => ({
  src: `/images/pebblesoft-curtain/img-${String(i + 1).padStart(2, '0')}.jpg`,
  alt: `페블소프트 암막커튼 시공 사례 ${i + 1}`,
}));

const GALLERY_CATEGORIES = [
  { label: '전체', filter: 'all' },
];

const FEATURES = [
  {
    title: '100% 완전 암막',
    desc: '빛을 완벽하게 차단하는 프리미엄 암막 원단으로 최적의 수면 환경을 만들어줍니다. 낮에도 밤처럼 편안한 공간을 연출합니다.',
    icon: '●',
  },
  {
    title: '회벽 질감 텍스처',
    desc: '페블(자갈) 표면처럼 자연스러운 요철감이 있는 텍스처로, 평면적이지 않은 입체적인 표면이 고급스러움을 더합니다.',
    icon: '◈',
  },
  {
    title: '보온 & 방음',
    desc: '두꺼운 암막 원단이 외부 소음을 차단하고 실내 온도를 유지하여 에너지 효율을 높여줍니다.',
    icon: '◉',
  },
  {
    title: '디아망 마감',
    desc: '다이아몬드에서 영감받은 디아망 마감으로 은은한 광택이 조명 아래에서 세련된 분위기를 연출합니다.',
    icon: '◇',
  },
];

const SPECS = [
  { label: '소재', value: '페블소프트 암막 원단' },
  { label: '차광률', value: '100% 완전 암막' },
  { label: '텍스처', value: '회벽 질감 (페블)' },
  { label: '마감', value: '디아망 (Diamant)' },
  { label: '세탁', value: '드라이클리닝' },
  { label: '보온', value: '단열 효과 우수' },
];

interface PebblesoftCurtainDetailProps {
  onNavigate: (page: string) => void;
}

export default function PebblesoftCurtainDetail({ onNavigate }: PebblesoftCurtainDetailProps) {
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
            src="/images/pebblesoft-curtain/img-01.jpg"
            alt="페블소프트 암막커튼 히어로"
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
              ESABELLA DIAMANT
            </motion.span>
            <motion.h1
              className="text-4xl md:text-7xl font-serif font-bold text-white mb-4 leading-tight"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
            >
              PEBBLESOFT CURTAIN
            </motion.h1>
            <motion.p
              className="text-white/70 text-lg md:text-xl max-w-2xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            >
              회벽 질감의 프리미엄 암막.<br className="hidden md:block" />
              완전한 차광으로 최적의 수면 환경을 만드는 이사벨라의 시그니처 암막 커튼.
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
                <span className="text-xs font-bold tracking-[0.3em] text-amber-800 uppercase">About Pebblesoft Curtain</span>
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-stone-900 mt-3 mb-6 leading-tight">
                  회벽 질감의<br />프리미엄 경험
                </h2>
                <div className="space-y-4 text-stone-600 leading-relaxed">
                  <p>
                    이사벨라 페블소프트 암막커튼(디아망커튼)은 회벽 질감의 텍스처가 살아있는 프리미엄 암막 커튼입니다.
                    100% 완전 차광으로 수면 환경을 최적화하면서도, 표면의 자연스러운 요철감이
                    차가운 느낌 없이 따뜻하고 세련된 공간을 연출합니다.
                  </p>
                  <p>
                    이사벨라를 대표하는 시그니처 암막 커튼으로, 다이아몬드에서 영감받은 디아망 마감이
                    조명 아래에서 은은한 광택으로 더욱 세련된 분위기를 만들어줍니다.
                  </p>
                  <p>
                    두꺼운 원단은 외부 소음을 차단하고 실내 온도를 유지하여 에너지 효율까지 높여줍니다.
                  </p>
                </div>
              </SectionReveal>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <SectionReveal delay={0.1}>
                <div className="aspect-[3/4] rounded-2xl overflow-hidden">
                  <img src="/images/pebblesoft-curtain/img-05.jpg" alt="페블소프트 암막커튼" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              </SectionReveal>
              <SectionReveal delay={0.2}>
                <div className="aspect-[3/4] rounded-2xl overflow-hidden mt-8">
                  <img src="/images/pebblesoft-curtain/img-10.jpg" alt="페블소프트 암막커튼" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
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
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mt-3">페블소프트 암막커튼의 특별함</h2>
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
        <ParallaxImage src="/images/pebblesoft-curtain/img-03.jpg" alt="페블소프트 암막커튼 와이드" />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="text-center text-white">
            <p className="text-xs tracking-[0.4em] uppercase mb-3 text-white/60">Premium Blackout</p>
            <h3 className="text-3xl md:text-5xl font-serif font-bold">완벽한 수면의 환경</h3>
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
              페블소프트 암막커튼 상담 문의
            </h2>
            <p className="text-stone-500 mb-10 leading-relaxed">
              전문 컨설턴트가 방문하여 공간에 완벽한 수면 환경을 만드는<br />
              페블소프트 암막커튼을 제안해드립니다. 무료 방문 상담을 신청해 보세요.
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

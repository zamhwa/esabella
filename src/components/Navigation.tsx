import React from 'react';
import { Sparkles, Menu, X, Phone, CalendarDays, ChevronDown } from 'lucide-react';

const PRODUCT_PAGES = [
  { key: 'free-blind', label: 'FREE BLIND', labelKr: '프리블라인드' },
  { key: 'double-blind', label: 'DOUBLE BLIND', labelKr: '더블블라인드' },
  { key: 'magic-blind', label: 'MAGIC BLIND', labelKr: '매직블라인드' },
  { key: 'volume-curtain', label: 'VOLUME CURTAIN', labelKr: '볼륨커튼' },
  { key: 'chiffon-curtain', label: 'CHIFFON CURTAIN', labelKr: '쉬폰커튼' },
  { key: 'pebblesoft-curtain', label: 'PEBBLESOFT', labelKr: '페블소프트 암막커튼' },
];

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [showProducts, setShowProducts] = React.useState(false);
  const [mobileProducts, setMobileProducts] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isProductPage = PRODUCT_PAGES.some(p => p.key === currentPage);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowProducts(true);
  };
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setShowProducts(false), 200);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-white/90 backdrop-blur-xl shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onNavigate('home')}
        >
          <span className={`font-serif text-2xl font-bold tracking-wide transition-colors ${
            scrolled ? 'text-stone-900' : 'text-white'
          }`}>
            ESABELLA
          </span>
          <span className={`text-[10px] font-medium tracking-[0.2em] uppercase transition-colors ${
            scrolled ? 'text-stone-400' : 'text-white/60'
          }`}>
            CURTAIN BLINDS
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => onNavigate('home')}
            className={`text-sm font-medium transition-colors ${
              scrolled
                ? (currentPage === 'home' ? 'text-stone-900' : 'text-stone-400 hover:text-stone-700')
                : (currentPage === 'home' ? 'text-white' : 'text-white/60 hover:text-white')
            }`}
          >
            HOME
          </button>

          {/* PRODUCTS dropdown */}
          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                scrolled
                  ? (isProductPage ? 'text-amber-800 font-bold' : 'text-stone-400 hover:text-stone-700')
                  : (isProductPage ? 'text-amber-400 font-bold' : 'text-white/60 hover:text-white')
              }`}
            >
              PRODUCTS
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showProducts ? 'rotate-180' : ''}`} />
            </button>

            {showProducts && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3">
                <div className="bg-white rounded-2xl shadow-xl border border-stone-100 py-2 min-w-[220px] overflow-hidden">
                  {PRODUCT_PAGES.map((p) => (
                    <button
                      key={p.key}
                      onClick={() => {
                        onNavigate(p.key);
                        setShowProducts(false);
                      }}
                      className={`block w-full text-left px-5 py-3 text-sm transition-colors ${
                        currentPage === p.key
                          ? 'bg-amber-50 text-amber-800 font-bold'
                          : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                      }`}
                    >
                      <span className="font-medium">{p.label}</span>
                      <span className="text-xs text-stone-400 ml-2">{p.labelKr}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              if (currentPage !== 'home') onNavigate('home');
              setTimeout(() => {
                document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className={`text-sm font-medium transition-colors ${
              scrolled ? 'text-stone-400 hover:text-stone-700' : 'text-white/60 hover:text-white'
            }`}
          >
            PORTFOLIO
          </button>
          <button
            onClick={() => {
              if (currentPage !== 'home') onNavigate('home');
              setTimeout(() => {
                document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className={`text-sm font-medium transition-colors ${
              scrolled ? 'text-stone-400 hover:text-stone-700' : 'text-white/60 hover:text-white'
            }`}
          >
            BOOKING
          </button>
          <button
            onClick={() => onNavigate('simulation')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
              currentPage === 'simulation'
              ? 'bg-amber-800 text-white shadow-lg'
              : scrolled
                ? 'bg-stone-900 text-white hover:bg-stone-800'
                : 'bg-white/15 text-white backdrop-blur-sm hover:bg-white/25 border border-white/20'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI SIMULATION
          </button>
        </div>

        <button
          className={`md:hidden p-2 ${scrolled ? 'text-stone-600' : 'text-white'}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-stone-100 p-6 space-y-2 max-h-[80vh] overflow-y-auto">
          <button
            onClick={() => { onNavigate('home'); setIsMenuOpen(false); }}
            className="block w-full text-left px-4 py-3 text-stone-700 font-medium rounded-xl hover:bg-stone-50"
          >
            HOME
          </button>

          {/* Products accordion */}
          <div>
            <button
              onClick={() => setMobileProducts(!mobileProducts)}
              className="flex items-center justify-between w-full text-left px-4 py-3 text-stone-700 font-medium rounded-xl hover:bg-stone-50"
            >
              <span>PRODUCTS</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${mobileProducts ? 'rotate-180' : ''}`} />
            </button>
            {mobileProducts && (
              <div className="ml-4 space-y-1 mt-1">
                {PRODUCT_PAGES.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => { onNavigate(p.key); setIsMenuOpen(false); setMobileProducts(false); }}
                    className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors ${
                      currentPage === p.key
                        ? 'bg-amber-50 text-amber-800 font-bold'
                        : 'text-stone-500 hover:bg-stone-50 hover:text-stone-700'
                    }`}
                  >
                    {p.labelKr}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => { onNavigate('simulation'); setIsMenuOpen(false); }}
            className="flex items-center gap-2 w-full text-left px-4 py-3 bg-stone-900 text-white rounded-xl font-bold"
          >
            <Sparkles className="h-4 w-4" />
            AI SIMULATION
          </button>
          <button
            onClick={() => {
              onNavigate('home');
              setIsMenuOpen(false);
              setTimeout(() => {
                document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="flex items-center gap-2 w-full text-left px-4 py-3 text-amber-800 font-medium rounded-xl hover:bg-amber-50"
          >
            <CalendarDays className="h-4 w-4" />
            방문 예약
          </button>
          <a
            href="tel:010-4132-9852"
            className="flex items-center gap-2 w-full text-left px-4 py-3 text-stone-500 font-medium rounded-xl hover:bg-stone-50"
          >
            <Phone className="h-4 w-4" />
            전화 상담
          </a>
        </div>
      )}
    </nav>
  );
}

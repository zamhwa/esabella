import React from 'react';
import { Sparkles, Menu, X, Phone, CalendarDays } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
            BLINDS
          </span>
        </div>

        <div className="hidden md:flex items-center gap-10">
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
          <button
            onClick={() => onNavigate('free-blind')}
            className={`text-sm font-medium transition-colors ${
              scrolled
                ? (currentPage === 'free-blind' ? 'text-amber-800 font-bold' : 'text-stone-400 hover:text-stone-700')
                : (currentPage === 'free-blind' ? 'text-amber-400 font-bold' : 'text-white/60 hover:text-white')
            }`}
          >
            FREE BLIND
          </button>
          <button
            onClick={() => {
              if (currentPage !== 'home') onNavigate('home');
              setTimeout(() => {
                document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className={`text-sm font-medium transition-colors ${
              scrolled ? 'text-stone-400 hover:text-stone-700' : 'text-white/60 hover:text-white'
            }`}
          >
            PRODUCTS
          </button>
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

      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-stone-100 p-6 space-y-3">
          <button
            onClick={() => { onNavigate('home'); setIsMenuOpen(false); }}
            className="block w-full text-left px-4 py-3 text-stone-700 font-medium rounded-xl hover:bg-stone-50"
          >
            HOME
          </button>
          <button
            onClick={() => { onNavigate('free-blind'); setIsMenuOpen(false); }}
            className="block w-full text-left px-4 py-3 text-amber-800 font-bold rounded-xl hover:bg-amber-50"
          >
            FREE BLIND
          </button>
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

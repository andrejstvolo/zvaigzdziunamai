import { useEffect, useRef, useState, createContext, useContext } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import { 
  MapPin, Droplets, Star, 
  Globe, Menu, X, Calendar, Clock,
  Info, Tent, ChevronDown, ChevronUp,
  User, LogOut, ShoppingBag,
  Bell, Sun, Moon
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CMS, getLocalized } from './cms';
import { authAPI } from './api';
import { BookingWizard } from './components/BookingWizard';
import { AdminDashboard } from './components/AdminDashboard';
import './i18n';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

// Theme Context
const ThemeContext = createContext({ isDark: true, toggleTheme: () => {} });

// Auth Context
interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role?: string;
}
interface Booking {
  id: string;
  type: 'accommodation' | 'sports';
  status: 'pending' | 'confirmed' | 'paid' | 'cancelled';
  total: number;
  date: string;
}
const AuthContext = createContext<{
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, name: string, phone?: string) => Promise<boolean>;
  loading: boolean;
}>({ user: null, login: async () => false, logout: () => {}, register: async () => false, loading: false });

// Special Offer Banner
const SpecialOfferBanner = ({ onClose }: { onClose: () => void }) => {
  const { i18n } = useTranslation();
  const offer = CMS.specialOffers.banner;
  if (!offer.enabled) return null;
  
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });
  
  useEffect(() => {
    const timer = setInterval(() => {
      const end = new Date(offer.validUntil).getTime();
      const now = new Date().getTime();
      const diff = end - now;
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        });
      }
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full py-3 px-4" style={{ backgroundColor: offer.bgColor }}>
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 flex-wrap">
        <span className="font-bold" style={{ color: offer.textColor }}>
          {getLocalized(offer.title, i18n.language)}
        </span>
        <span style={{ color: offer.textColor, opacity: 0.9 }}>
          {getLocalized(offer.subtitle, i18n.language)}
        </span>
        <div className="flex items-center gap-2 text-sm" style={{ color: offer.textColor }}>
          <Clock className="w-4 h-4" />
          <span>{timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m</span>
        </div>
        <Badge className="bg-white/20" style={{ color: offer.textColor }}>
          {offer.code}
        </Badge>
      </div>
      <button onClick={onClose} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: offer.textColor }}>
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

// Theme Toggle
const ThemeToggle = () => {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  return (
    <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
      {isDark ? <Sun className="w-5 h-5 text-gold" /> : <Moon className="w-5 h-5 text-[#0B0F17]" />}
    </button>
  );
};

// Navigation
const Navigation = ({ onLoginClick, bannerVisible = false }: { onLoginClick: () => void, bannerVisible?: boolean }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const { isDark } = useContext(ThemeContext);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'accommodation', label: t('nav.accommodation'), icon: Tent },
    { id: 'activities', label: t('nav.activities'), icon: Star },
    { id: 'sports', label: t('nav.sports'), icon: Droplets },
    { id: 'about', label: t('nav.about'), icon: Info },
    { id: 'gallery', label: t('nav.gallery'), icon: MapPin },
    { id: 'faq', label: t('nav.faq'), icon: Bell },
    { id: 'location', label: t('nav.location'), icon: MapPin },
  ];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <nav className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
      bannerVisible ? 'top-[48px]' : 'top-0'
    } ${
      scrolled ? (isDark ? 'bg-[#0B0F17]/95 backdrop-blur-md shadow-lg' : 'bg-white/95 backdrop-blur-md shadow-lg') : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => scrollTo('hero')} className="flex items-center gap-2 group">
            <div className={`relative h-10 px-2 py-1 rounded-lg transition-all ${scrolled ? '' : 'bg-black/30 backdrop-blur-sm'}`}>
              <img 
                src={isDark ? "/logo-gold.png" : "/logo-dark.png"} 
                alt="Žvaigždžių Namai" 
                className="h-8 w-auto object-contain" 
              />
            </div>
          </button>
          
          <div className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <button key={item.id} onClick={() => scrollTo(item.id)} 
                className={`text-sm transition-colors flex items-center gap-1 ${isDark ? 'text-slate hover:text-gold' : 'text-gray-600 hover:text-[#D4A24A]'}`}>
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
            <div className="h-6 w-px bg-white/20" />
            <LanguageSwitcher />
            <ThemeToggle />
            {user ? (
              <button onClick={onLoginClick} className="flex items-center gap-2 text-gold">
                <User className="w-5 h-5" />
                <span className="text-sm">{user.name}</span>
              </button>
            ) : (
              <button onClick={onLoginClick} className="text-sm text-slate hover:text-gold">
                {t('nav.login')}
              </button>
            )}
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className={`lg:hidden ${isDark ? 'text-ivory' : 'text-gray-800'}`}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className={`lg:hidden border-t ${isDark ? 'bg-[#0B0F17]/95 border-white/10' : 'bg-white/95 border-gray-200'}`}>
          {navItems.map((item) => (
            <button key={item.id} onClick={() => scrollTo(item.id)} 
              className={`block w-full px-4 py-3 text-left flex items-center gap-2 ${isDark ? 'text-ivory hover:bg-white/5' : 'text-gray-800 hover:bg-gray-100'}`}>
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
          <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      )}
    </nav>
  );
};

// Language Switcher
const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const languages = [
    { code: 'lt', name: 'LT', flag: '🇱🇹' },
    { code: 'en', name: 'EN', flag: '🇬🇧' },
    { code: 'ru', name: 'RU', flag: '🇷🇺' }
  ];

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-1 text-sm hover:text-gold transition-colors">
        <Globe className="w-4 h-4" />
        {i18n.language.toUpperCase()}
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 bg-[#141B24] border border-white/10 rounded-lg overflow-hidden z-50">
          {languages.map((lang) => (
            <button key={lang.code} onClick={() => { i18n.changeLanguage(lang.code); setIsOpen(false); }}
              className={`block w-full px-3 py-2 text-left text-sm hover:bg-white/5 ${i18n.language === lang.code ? 'text-gold' : 'text-ivory'}`}>
              {lang.flag} {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Hero Section
const HeroSection = ({ onBook }: { onBook: () => void }) => {
  const { t, i18n } = useTranslation();
  const { isDark } = useContext(ThemeContext);
  const heroRef = useRef<HTMLDivElement>(null);
  const content = CMS.content.hero;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-content', { y: 30, opacity: 0, duration: 1, delay: 0.3, ease: 'power2.out' });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" ref={heroRef} className="relative min-h-screen flex items-center justify-center">
      <div className="absolute inset-0">
        <img src={content.backgroundImage} alt="Glamping dome" className="w-full h-full object-cover" />
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-b from-[#0B0F17]/60 via-transparent to-[#0B0F17]' : 'bg-gradient-to-b from-black/40 via-transparent to-white'}`} />
      </div>
      
      <div className="hero-content relative z-10 text-center px-4 max-w-4xl mx-auto pt-20">
        <Badge className="mb-4 bg-gold/20 text-gold border-gold/30">{getLocalized(content.badge, i18n.language)}</Badge>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-ivory mb-6 leading-tight drop-shadow-lg">
          {getLocalized(content.title, i18n.language)}
        </h1>
        <p className="text-lg md:text-xl text-ivory/90 mb-8 max-w-2xl mx-auto drop-shadow">
          {getLocalized(content.subtitle, i18n.language)}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={onBook} size="lg" className="bg-gold text-[#0B0F17] hover:bg-gold/90 font-semibold px-8">
            <Calendar className="w-5 h-5 mr-2" />
            {t('hero.cta')}
          </Button>
          <Button onClick={() => document.getElementById('accommodation')?.scrollIntoView({ behavior: 'smooth' })} 
            size="lg" variant="outline" className="border-white/50 text-ivory hover:bg-white/10">
            <Info className="w-5 h-5 mr-2" />
            {t('hero.learnMore')}
          </Button>
        </div>
      </div>
    </section>
  );
};

// News Section
const NewsSection = () => {
  const { t, i18n } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isDark } = useContext(ThemeContext);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.news-card', { y: 30, opacity: 0, stagger: 0.15, duration: 0.5,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  if (!CMS.specialOffers.enabled || CMS.specialOffers.news.length === 0) return null;

  return (
    <section id="news" ref={sectionRef} className={`py-20 px-4 ${isDark ? 'bg-[#141B24]' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-ivory' : 'text-gray-900'}`}>{t('news.title')}</h2>
          <p className={`max-w-2xl mx-auto ${isDark ? 'text-slate' : 'text-gray-600'}`}>{t('news.subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {CMS.specialOffers.news.map((item) => (
            <Card key={item.id} className={`news-card overflow-hidden ${isDark ? 'bg-[#0B0F17] border-white/10' : 'bg-white border-gray-200'}`}>
              {item.image && (
                <div className="h-48 overflow-hidden">
                  <img src={item.image} alt={getLocalized(item.title, i18n.language)} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                </div>
              )}
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-gold border-gold/30">{item.date}</Badge>
                  {item.featured && <Badge className="bg-gold text-[#0B0F17]">{t('news.featured')}</Badge>}
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-ivory' : 'text-gray-900'}`}>
                  {getLocalized(item.title, i18n.language)}
                </h3>
                <p className={`${isDark ? 'text-slate' : 'text-gray-600'}`}>
                  {getLocalized(item.content, i18n.language)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

// User Dashboard Modal
const UserDashboardModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { t } = useTranslation();
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('bookings');
  const { isDark } = useContext(ThemeContext);

  if (!user) return null;

  const mockBookings: Booking[] = [
    { id: 'B001', type: 'accommodation', status: 'confirmed', total: 300, date: '2026-04-15' },
    { id: 'B002', type: 'sports', status: 'paid', total: 45, date: '2026-03-20' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-3xl max-h-[90vh] overflow-y-auto ${isDark ? 'bg-[#141B24] border-white/10 text-ivory' : 'bg-white border-gray-200 text-gray-900'}`}>
        <DialogHeader>
          <DialogTitle className={isDark ? 'text-ivory' : 'text-gray-900'}>{t('dashboard.title')}</DialogTitle>
        </DialogHeader>
        
        <div className="flex gap-4 mb-6 border-b border-white/10 pb-4">
          <button onClick={() => setActiveTab('bookings')} className={`pb-2 ${activeTab === 'bookings' ? 'text-gold border-b-2 border-gold' : 'text-slate'}`}>
            {t('dashboard.bookings')}
          </button>
          <button onClick={() => setActiveTab('orders')} className={`pb-2 ${activeTab === 'orders' ? 'text-gold border-b-2 border-gold' : 'text-slate'}`}>
            {t('dashboard.orders')}
          </button>
          <button onClick={() => setActiveTab('profile')} className={`pb-2 ${activeTab === 'profile' ? 'text-gold border-b-2 border-gold' : 'text-slate'}`}>
            {t('dashboard.profile')}
          </button>
        </div>

        {activeTab === 'bookings' && (
          <div className="space-y-4">
            {mockBookings.map((booking) => (
              <Card key={booking.id} className={`${isDark ? 'bg-[#0B0F17] border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gold font-semibold">#{booking.id}</p>
                      <p className={`text-sm ${isDark ? 'text-slate' : 'text-gray-600'}`}>{booking.type === 'accommodation' ? t('booking.accommodation') : t('booking.sports')}</p>
                      <p className={`text-sm ${isDark ? 'text-slate' : 'text-gray-600'}`}>{booking.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-ivory font-bold">{booking.total}€</p>
                      <Badge className={booking.status === 'paid' ? 'bg-green-500' : booking.status === 'confirmed' ? 'bg-blue-500' : 'bg-yellow-500'}>
                        {t(`status.${booking.status}`)}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" className="flex-1 border-white/10">
                      {t('dashboard.manage')}
                    </Button>
                    <Button size="sm" className="flex-1 bg-gold text-[#0B0F17]">
                      {t('dashboard.addExtras')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="text-center py-8">
            <ShoppingBag className="w-16 h-16 text-slate mx-auto mb-4" />
            <p className="text-slate">{t('dashboard.noOrders')}</p>
            <Button className="mt-4 bg-gold text-[#0B0F17]">{t('dashboard.orderMeals')}</Button>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div>
              <Label className="text-slate">{t('booking.name')}</Label>
              <Input value={user.name} readOnly className="bg-[#0B0F17] border-white/10" />
            </div>
            <div>
              <Label className="text-slate">{t('booking.email')}</Label>
              <Input value={user.email} readOnly className="bg-[#0B0F17] border-white/10" />
            </div>
            <Button onClick={logout} variant="outline" className="w-full border-red-500/30 text-red-400">
              <LogOut className="w-4 h-4 mr-2" />
              {t('dashboard.logout')}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

// Login Modal
const LoginModal = ({ isOpen, onClose, onSuccess }: { isOpen: boolean; onClose: () => void; onSuccess: () => void }) => {
  const { t } = useTranslation();
  const { login, register } = useContext(AuthContext);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { isDark } = useContext(ThemeContext);

  const handleSubmit = async () => {
    if (mode === 'login') {
      const success = await login(email, password);
      if (success) {
        onSuccess();
        onClose();
      }
    } else {
      const success = await register(email, password, name);
      if (success) {
        onSuccess();
        onClose();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-md ${isDark ? 'bg-[#141B24] border-white/10 text-ivory' : 'bg-white border-gray-200 text-gray-900'}`}>
        <DialogHeader>
          <DialogTitle className={isDark ? 'text-ivory' : 'text-gray-900'}>
            {mode === 'login' ? t('auth.login') : t('auth.register')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {mode === 'register' && (
            <Input 
              placeholder={t('booking.name')} 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className={`${isDark ? 'bg-[#0B0F17] border-white/10 text-ivory placeholder:text-slate' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500'}`} 
            />
          )}
          <Input 
            type="email" 
            placeholder={t('booking.email')} 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className={`${isDark ? 'bg-[#0B0F17] border-white/10 text-ivory placeholder:text-slate' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500'}`} 
          />
          <Input 
            type="password" 
            placeholder={t('auth.password')} 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className={`${isDark ? 'bg-[#0B0F17] border-white/10 text-ivory placeholder:text-slate' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500'}`} 
          />
          
          <Button onClick={handleSubmit} className="w-full bg-gold text-[#0B0F17]">
            {mode === 'login' ? t('auth.login') : t('auth.register')}
          </Button>
          
          <p className="text-center text-sm text-slate">
            {mode === 'login' ? t('auth.noAccount') : t('auth.hasAccount')}{' '}
            <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-gold hover:underline">
              {mode === 'login' ? t('auth.register') : t('auth.login')}
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// About Section
const AboutSection = () => {
  const { i18n } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isDark } = useContext(ThemeContext);
  const about = CMS.about;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about-content', { y: 30, opacity: 0, stagger: 0.15, duration: 0.6,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className={`py-20 px-4 ${isDark ? 'bg-[#0B0F17]' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-ivory' : 'text-gray-900'}`}>
            {getLocalized(about.title, i18n.language)}
          </h2>
          <p className={`${isDark ? 'text-slate' : 'text-gray-600'}`}>
            {getLocalized(about.subtitle, i18n.language)}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-center mb-16">
          <div className="about-content">
            <p className={`text-lg leading-relaxed mb-6 ${isDark ? 'text-ivory' : 'text-gray-800'}`}>
              {getLocalized(about.story, i18n.language)}
            </p>
            <p className={`leading-relaxed ${isDark ? 'text-slate' : 'text-gray-600'}`}>
              {getLocalized(about.mission, i18n.language)}
            </p>
          </div>
          <div className="about-content">
            <img src={about.image} alt="About" className="rounded-lg w-full h-80 object-cover" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {about.stats.map((stat, i) => (
            <div key={i} className={`about-content text-center p-6 rounded-lg ${isDark ? 'bg-[#141B24]' : 'bg-white'}`}>
              <p className="text-4xl font-bold text-gold mb-2">{stat.value}</p>
              <p className={`text-sm ${isDark ? 'text-slate' : 'text-gray-600'}`}>
                {getLocalized(stat.label, i18n.language)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// FAQ Section
const FAQSection = () => {
  const { i18n } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isDark } = useContext(ThemeContext);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faq = CMS.faq;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.faq-item', { y: 20, opacity: 0, stagger: 0.1, duration: 0.4,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="faq" ref={sectionRef} className={`py-20 px-4 ${isDark ? 'bg-[#141B24]' : 'bg-white'}`}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-ivory' : 'text-gray-900'}`}>
            {getLocalized(faq.title, i18n.language)}
          </h2>
          <p className={`${isDark ? 'text-slate' : 'text-gray-600'}`}>
            {getLocalized(faq.subtitle, i18n.language)}
          </p>
        </div>

        <div className="space-y-4">
          {faq.items.map((item, i) => (
            <div key={i} className={`faq-item rounded-lg overflow-hidden ${isDark ? 'bg-[#0B0F17]' : 'bg-gray-50'}`}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-6 py-4 flex items-center justify-between text-left"
              >
                <span className={`font-medium ${isDark ? 'text-ivory' : 'text-gray-900'}`}>
                  {getLocalized(item.question, i18n.language)}
                </span>
                {openIndex === i ? <ChevronUp className="w-5 h-5 text-gold" /> : <ChevronDown className="w-5 h-5 text-slate" />}
              </button>
              {openIndex === i && (
                <div className={`px-6 pb-4 ${isDark ? 'text-slate' : 'text-gray-600'}`}>
                  {getLocalized(item.answer, i18n.language)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Gallery Section
const GallerySection = () => {
  const { i18n } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isDark } = useContext(ThemeContext);
  const [filter, setFilter] = useState('all');
  const gallery = CMS.gallery;

  const categories = [
    { id: 'all', label: { lt: 'Visi', en: 'All', ru: 'Все' } },
    { id: 'domes', label: { lt: 'Kupolai', en: 'Domes', ru: 'Купола' } },
    { id: 'sports', label: { lt: 'Sportas', en: 'Sports', ru: 'Спорт' } },
    { id: 'nature', label: { lt: 'Gamta', en: 'Nature', ru: 'Природа' } },
    { id: 'amenities', label: { lt: 'Patogumai', en: 'Amenities', ru: 'Удобства' } },
  ];

  const filteredImages = filter === 'all' 
    ? gallery.images 
    : gallery.images.filter(img => img.category === filter);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.gallery-item', { scale: 0.9, opacity: 0, stagger: 0.05, duration: 0.4,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="gallery" ref={sectionRef} className={`py-20 px-4 ${isDark ? 'bg-[#0B0F17]' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-ivory' : 'text-gray-900'}`}>
            {getLocalized(gallery.title, i18n.language)}
          </h2>
          <p className={`${isDark ? 'text-slate' : 'text-gray-600'}`}>
            {getLocalized(gallery.subtitle, i18n.language)}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                filter === cat.id 
                  ? 'bg-gold text-[#0B0F17]' 
                  : isDark ? 'bg-[#141B24] text-slate hover:text-ivory' : 'bg-white text-gray-600 hover:text-gray-900'
              }`}
            >
              {getLocalized(cat.label, i18n.language)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((img, i) => (
            <div key={i} className="gallery-item relative group overflow-hidden rounded-lg aspect-square">
              <img 
                src={img.src} 
                alt={getLocalized(img.alt, i18n.language)} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end p-4">
                <p className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  {getLocalized(img.alt, i18n.language)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Main App
function App() {
  const [isDark, setIsDark] = useState(true);
  const [showBanner, setShowBanner] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authAPI.getMe()
        .then(data => setUser(data.user))
        .catch(() => localStorage.removeItem('token'));
    }
  }, []);

  // Theme detection
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(prefersDark);
    
    const listener = (e: MediaQueryListEvent) => setIsDark(e.matches);
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', listener);
    return () => window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', listener);
  }, []);

  // Auth functions with real API
  const login = async (email: string, password: string) => {
    setAuthLoading(true);
    try {
      const data = await authAPI.login(email, password);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const register = async (email: string, password: string, name: string, phone?: string) => {
    setAuthLoading(true);
    try {
      const data = await authAPI.register(email, password, name, phone);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      return true;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <AuthContext.Provider value={{ user, login, logout, register, loading: authLoading }}>
        <div className={`min-h-screen transition-colors ${isDark ? 'bg-[#0B0F17]' : 'bg-white'}`}>
          {showBanner && <SpecialOfferBanner onClose={() => setShowBanner(false)} />}
          <Navigation onLoginClick={() => user ? setIsDashboardOpen(true) : setIsLoginOpen(true)} bannerVisible={showBanner} />
          
          <main>
            <HeroSection onBook={() => setIsBookingOpen(true)} />
            <NewsSection />
            <AboutSection />
            <GallerySection />
            <FAQSection />
          </main>
          
          {/* Modals */}
          <BookingWizard isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
          
          <LoginModal 
            isOpen={isLoginOpen} 
            onClose={() => setIsLoginOpen(false)} 
            onSuccess={() => setIsDashboardOpen(true)} 
          />
          <UserDashboardModal isOpen={isDashboardOpen} onClose={() => setIsDashboardOpen(false)} />
          <AdminDashboard isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
        </div>
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}

export default App;

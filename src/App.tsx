import React, { useState, useEffect } from 'react';
import { 
  Leaf, 
  ShoppingCart, 
  Menu, 
  X, 
  ChevronRight, 
  Star, 
  Phone, 
  FileText, 
  ShieldCheck, 
  User, 
  ArrowLeft, 
  ArrowRight,
  CheckCircle,
  Plus,
  Minus,
  Trash2,
  Lock,
  Search,
  BookOpen,
  Calendar,
  Clock,
  HelpCircle,
  Award,
  Globe,
  MapPin,
  Check,
  ChevronDown,
  Package,
  Truck,
  CreditCard
} from 'lucide-react';
import { PRODUCTS, BLOG_POSTS, TESTIMONIALS, INGREDIENTS, GOOGLE_REVIEWS, EXPECTATIONS_LIST, QUIZ_QUESTIONS, Product, MOCK_ORDERS, Order } from './data';

// Custom router helper
const getHashParams = (hashStr: string) => {
  const parts = hashStr.split('?');
  const path = parts[0] || '#home';
  const query = parts[1] || '';
  const params: Record<string, string> = {};
  if (query) {
    query.split('&').forEach(param => {
      const [key, value] = param.split('=');
      params[key] = decodeURIComponent(value || '');
    });
  }
  return { path, params };
};

export default function App() {
  const [hash, setHash] = useState(window.location.hash || '#home');
  const [cart, setCart] = useState<{ product: Product; qty: number }[]>(() => {
    try {
      const saved = localStorage.getItem('agriic_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('agriic_orders');
      return saved ? JSON.parse(saved) : MOCK_ORDERS;
    } catch {
      return MOCK_ORDERS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('agriic_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  const toastTimeoutRef = React.useRef<any>(null);

  const [toast, setToast] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Timeline Tab State
  const [timelineTab, setTimelineTab] = useState<'vegetable' | 'ornamental'>('vegetable');

  // Auth Mode
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [currentUser, setCurrentUser] = useState<{ email: string; name?: string } | null>(() => {
    try {
      const saved = localStorage.getItem('agriic_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Quiz State
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Shop Filter
  const [productFilter, setProductFilter] = useState<string>('all');

  // Blog News Letter
  const [newsEmail, setNewsEmail] = useState('');

  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' });

  // Accordion Details Active Key
  const [openAccordion, setOpenAccordion] = useState<string | null>('benefits');

  // Checkout Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('card');

  // Counter simulation on landing page
  const [farmersCount, setFarmersCount] = useState(0);
  const [resultsPct, setResultsPct] = useState(0);
  const [ratingVal, setRatingVal] = useState(0);

  // Parse hash and params
  const { path: routePath, params: routeParams } = getHashParams(hash);

  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash || '#home');
      window.scrollTo(0, 0);
      setIsMobileMenuOpen(false);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    localStorage.setItem('agriic_cart', JSON.stringify(cart));
  }, [cart]);

  // Stat Counter Animation
  useEffect(() => {
    if (routePath === '#home') {
      const timer = setTimeout(() => {
        setFarmersCount(5); // Simulate 5L+
        setResultsPct(98);  // 98%
        setRatingVal(4.7);  // 4.7
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [routePath]);

  const showToastMsg = (msg: string) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast(null);
    setTimeout(() => {
      setToast(msg);
      toastTimeoutRef.current = setTimeout(() => {
        setToast(null);
      }, 3000);
    }, 40);
  };

  // Cart Management
  const addToCart = (product: Product, quantity = 1) => {
    const existingIndex = cart.findIndex(item => item.product.id === product.id);
    if (existingIndex >= 0) {
      const updated = [...cart];
      updated[existingIndex].qty += quantity;
      setCart(updated);
    } else {
      setCart([...cart, { product, qty: quantity }]);
    }
    showToastMsg(`${quantity}x ${product.name} added to cart!`);
  };

  const updateCartQty = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      setCart(cart.filter(item => item.product.id !== productId));
      showToastMsg(`Item removed from cart.`);
    } else {
      setCart(cart.map(item => item.product.id === productId ? { ...item, qty: newQty } : item));
    }
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('agriic_cart');
  };

  const getSubtotal = () => cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const getCartCount = () => cart.reduce((sum, item) => sum + item.qty, 0);

  // Authentication Helpers
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'login') {
      const mockUser = { email: 'farmer_user@agriic.com', name: 'Alok Patel' };
      localStorage.setItem('agriic_user', JSON.stringify(mockUser));
      setCurrentUser(mockUser);
      showToastMsg('Welcome back to Agriic.!');
    } else {
      const mockUser = { email: 'farmer_user@agriic.com', name: 'Alok Patel' };
      localStorage.setItem('agriic_user', JSON.stringify(mockUser));
      setCurrentUser(mockUser);
      showToastMsg('Account created successfully!');
    }
    window.location.hash = '#products';
  };

  const handleLogout = () => {
    localStorage.removeItem('agriic_user');
    setCurrentUser(null);
    showToastMsg('Logged out successfully.');
    window.location.hash = '#home';
  };

  // Navigation Links array
  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Science', href: '#science' },
    { label: 'Products', href: '#products' },
    { label: 'Soil Test™', href: '#soil-test' },
    { label: 'Blog', href: '#blog' },
    { label: 'About Us', href: '#about' },
    { label: 'Contact', href: '#contact' }
  ];

  return (
    <div className="min-h-screen flex flex-col font-display bg-white text-agri-charcoal relative">
      
      {/* Toast Notification */}
      {toast && (
        <>
          <style>{`
            @keyframes toastSlideDown {
              0% { transform: translate(-50%, -24px); opacity: 0; }
              100% { transform: translate(-50%, 0); opacity: 1; }
            }
            @keyframes toastShrink {
              0% { width: 100%; }
              100% { width: 0%; }
            }
            .animate-toast-slide-in {
              animation: toastSlideDown 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            .animate-toast-progress {
              animation: toastShrink 3000ms linear forwards;
            }
          `}</style>
          <div className="fixed top-24 left-1/2 z-50 bg-[#2b3a30] text-white px-5 py-3.5 rounded-xl border border-[#c2dd74]/35 shadow-2.5xl flex flex-col overflow-hidden animate-toast-slide-in backdrop-blur-md min-w-[280px] sm:min-w-[345px]">
            <div className="flex items-center space-x-3 mb-2.5">
              <CheckCircle className="w-4.5 h-4.5 text-[#c2dd74] shrink-0" />
              <span className="text-xs sm:text-sm font-semibold tracking-wide">{toast}</span>
            </div>
            <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
              <div className="bg-[#c2dd74] h-full animate-toast-progress" />
            </div>
          </div>
        </>
      )}

      {/* Floating Header */}
      <header className="sticky top-0 z-40 bg-[#2b3a30] border-b border-[#bad15a]/10 backdrop-blur-md px-4 md:px-8 py-3.5 flex items-center justify-between text-white shadow-md">
        <a href="#home" className="flex items-center space-x-2 shrink-0">
          <Leaf className="w-8 h-8 text-agri-lime fill-agri-lime" />
          <span className="text-2xl font-bold tracking-tight font-display text-white">
            Agriic<span className="text-agri-lime">.</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => {
            const isActive = routePath === link.href;
            return (
              <a 
                key={link.label}
                href={link.href}
                className={`text-[14px] font-medium tracking-wide transition-colors duration-200 hover:text-agri-lime ${
                  isActive ? 'text-agri-lime font-bold border-b-2 border-agri-lime pb-1' : 'text-white/80'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Right header icons */}
        <div className="flex items-center space-x-4">
          <a href="#cart" className="relative p-2 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center">
            <ShoppingCart className="w-5 h-5" />
            {getCartCount() > 0 && (
              <span className="absolute -top-1 -right-1 bg-agri-lime text-agri-deep text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#2b3a30]">
                {getCartCount()}
              </span>
            )}
          </a>

          {currentUser ? (
            <div className="flex items-center space-x-2">
              <a 
                href="#profile" 
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border transition-all ${
                  routePath === '#profile' 
                    ? 'bg-[#c2dd74]/20 border-[#c2dd74] text-[#c2dd74]' 
                    : 'bg-white/10 hover:bg-white/20 border-white/15 text-white/95'
                }`}
              >
                <User className="w-4.5 h-4.5 text-[#c2dd74]" />
                <span className="text-[12px] font-medium hidden sm:inline">{currentUser.name || 'Alok'}</span>
              </a>
              <button 
                onClick={handleLogout} 
                className="text-[11.5px] text-white/60 hover:text-red-400 font-bold px-2 py-1.5 rounded-md hover:bg-white/5 transition-all"
              >
                Exit
              </button>
            </div>
          ) : (
            <a href="#auth" className="flex items-center space-x-1.5 hover:text-agri-lime text-sm font-semibold transition px-3.5 py-1.5 rounded-full bg-white/10 border border-white/10">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Sign In</span>
            </a>
          )}

          {/* Mobile drawer toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-white hover:text-agri-lime transition"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-[60px] z-50 bg-[#2b3a30] text-white p-6 flex flex-col space-y-5 animate-fade-in lg:hidden">
          {navLinks.map((link) => {
            const isActive = routePath === link.href;
            return (
              <a 
                key={link.label} 
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-lg font-semibold border-b border-white/10 pb-2 flex justify-between items-center ${isActive ? 'text-agri-lime' : 'text-white'}`}
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-white/50" />
              </a>
            );
          })}
          <div className="pt-6 space-y-3">
            {currentUser && (
              <a 
                href="#profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center block bg-white/10 hover:bg-white/15 text-white font-extrabold tracking-wider py-4 rounded-xl border border-white/15"
              >
                VIEW MY PROFILE & ORDERS
              </a>
            )}
            <a 
              href="#soil-test"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center block bg-agri-lime text-[#1b3322] font-extrabold tracking-wider py-4 rounded-xl shadow-lg"
            >
              TAKE THE SOIL TEST™
            </a>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main id="page-content" className="flex-grow animate-fade-in">
        
        {/* VIEW 1: HOME */}
        {routePath === '#home' && (
          <div>
            {/* Section 1: Hero */}
            <section className="relative px-4 md:px-8 lg:px-12 pt-3 md:pt-8 pb-8 md:pb-16 bg-[#f7f6ee] z-10 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[55%] md:h-[65%] bg-[#2b3a30] z-0 rounded-b-[32px] md:rounded-b-[40px]"></div>
              
              <div className="w-full rounded-[24px] md:rounded-[32px] overflow-hidden relative flex flex-col min-h-[420px] md:min-h-[600px] shadow-2xl bg-[#1b251f] z-10 mx-auto max-w-[1440px]">
                {/* SVG Decor for desktop: slanted solid brown on the left side ONLY, leaving right image 100% bright and clear */}
                <div className="absolute inset-0 z-10 pointer-events-none hidden md:block">
                  <svg viewBox="0 0 1440 640" preserveAspectRatio="none" className="w-full h-full">
                    <path d="M0,0 L650,0 C 580,200 500,440 450,640 L0,640 Z" fill="#4e2b15" opacity="1"></path>
                  </svg>
                </div>
                
                {/* Image panel: positioned right-side, bright, clear, no overlay shade covering it on desktop */}
                <div className="absolute top-0 right-0 w-full md:w-[65%] h-full z-0">
                  <img 
                    src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1200&q=80" 
                    alt="Indian farming field with farmer family portrait theme" 
                    className="w-full h-full object-cover md:object-[center_top] object-[center_35%]"
                  />
                  {/* Gentle gradient for text visibility on mobile ONLY, completely transparent/hidden on desktop */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent md:hidden pointer-events-none"></div>
                </div>

                {/* Left side text */}
                <div className="relative z-20 w-full p-5 sm:p-10 md:p-16 flex flex-col justify-end md:justify-center h-full min-h-[420px] md:min-h-[600px]">
                  <div className="max-w-[530px] text-center md:text-left flex flex-col items-center md:items-start">
                    <span className="border border-[#c2dd74]/60 bg-[#c2dd74]/15 md:bg-[#c2dd74] text-[#c2dd74] md:text-[#1b3322] px-3.5 py-1.5 rounded-full text-[10px] md:text-[12px] font-bold tracking-widest uppercase mb-3 inline-block shadow-sm">
                      SCIENCE-LED PLANT NUTRITION SOLUTION
                    </span>
                    <h1 className="text-[28px] leading-[1.12] sm:text-4xl md:text-5xl lg:text-[54px] font-black text-white mb-4 md:mb-6 tracking-tight drop-shadow-md">
                      Know the root cause of your soil problems.
                    </h1>
                    <p className="text-white/85 text-xs md:text-base max-w-md mb-6 md:mb-8 leading-relaxed">
                      Unlock your soil's hidden potential for maximum crop yield. Take our diagnostic test and get customized organic kits. 
                    </p>
                    <a 
                      href="#soil-test" 
                      className="bg-agri-lime text-[#1b3322] font-black text-xs md:text-sm px-6 md:px-8 py-3.5 md:py-4.5 rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-transform block md:inline-block w-full md:w-auto text-center tracking-wider uppercase"
                    >
                      TAKE THE SOIL TEST™
                    </a>
                  </div>
                </div>
              </div>

              {/* Stats Bar: Compact, clean row on mobile that fits perfectly inside screen width */}
              <div className="relative z-20 max-w-[1440px] mx-auto mt-6 md:mt-12 w-full">
                <div className="flex flex-row justify-between gap-2.5 w-full">
                  <div className="bg-white rounded-2xl p-3 sm:p-5 text-center shadow-lg border-b-4 md:border-b-[6px] border-agri-red-accent flex-1">
                    <span className="block text-lg sm:text-3xl font-black text-gray-900 leading-none mb-1">
                      {farmersCount || 0}L+
                    </span>
                    <span className="text-[9px] sm:text-[11px] text-gray-500 font-extrabold uppercase tracking-wider block">Indian Farmers</span>
                  </div>
                  <div className="bg-white rounded-2xl p-3 sm:p-5 text-center shadow-lg border-b-4 md:border-b-[6px] border-agri-gold flex-1">
                    <span className="block text-lg sm:text-3xl font-black text-gray-900 leading-none mb-1">
                      {resultsPct || 0}%
                    </span>
                    <span className="text-[9px] sm:text-[11px] text-gray-500 font-extrabold uppercase tracking-wider block">Saw Yield Boost</span>
                  </div>
                  <div className="bg-white rounded-2xl p-3 sm:p-5 text-center shadow-lg border-b-4 md:border-b-[6px] border-[#369654] flex-1">
                    <span className="block text-lg sm:text-3xl font-black text-gray-900 leading-none mb-1">
                      {ratingVal ? ratingVal.toFixed(1) : '0.0'}
                    </span>
                    <span className="text-[9px] sm:text-[11px] text-gray-500 font-extrabold uppercase tracking-wider block">Google Rating</span>
                  </div>
                </div>
                <div className="flex justify-end pt-2 text-[9px] md:text-xs text-gray-400 italic">
                  *Based on long-term trial observations across Indian soil profiles, March 2026.
                </div>
              </div>
            </section>

            {/* Section 2: Testimonials Slider */}
            <section className="py-8 md:py-16 px-4 md:px-12 bg-white rounded-b-[32px] md:rounded-b-[40px] relative z-20 shadow-sm border-b border-gray-100">
              <div className="max-w-7xl mx-auto">
                <div className="mb-6 md:mb-10">
                  <span className="text-xs font-black text-agri-green-mid uppercase tracking-widest block mb-1">FARMER TESTIMONIALS</span>
                  <h2 className="text-2xl md:text-4xl font-extrabold text-gray-950">Real people, real soil recovery</h2>
                </div>

                <div className="flex space-x-5 overflow-x-auto no-scrollbar pb-6 slider-container snap-x snap-mandatory">
                  {TESTIMONIALS.map((t, index) => (
                    <div key={index} className="min-w-[280px] max-w-[280px] rounded-[24px] overflow-hidden shadow-md border border-gray-100 flex flex-col justify-between bg-white transform hover:scale-102 transition-transform snap-start">
                      <img src={t.img} className="h-44 w-full object-cover" alt="Farmer" />
                      <div className="p-5 bg-gradient-to-br from-agri-dark to-[#1b251f] text-white">
                        <div className="flex text-agri-lime mb-2">
                           {Array.from({ length: 5 }).map((_, starIdx) => (
                            <Star key={starIdx} className="w-3.5 h-3.5 fill-agri-lime" />
                          ))}
                        </div>
                        <p className="italic text-xs text-slate-100 leading-relaxed">"{t.quote}"</p>
                        <span className="block mt-3 text-xs font-bold text-agri-lime/95">— {t.name}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Soil Health Pillars: Custom slideable cards on mobile, grid on desktop */}
                <div className="mt-8 md:mt-16 pt-8 md:pt-12 border-t border-agri-cream-border">
                  <span className="text-xs font-extrabold text-agri-green-mid uppercase tracking-widest block mb-2">ROOT CAUSES</span>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 md:mb-8">
                    <h2 className="text-2xl md:text-4xl font-extrabold text-gray-950">Crop health starts from the soil</h2>
                    <p className="text-gray-500 mt-2 md:mt-0 text-xs md:text-sm max-w-md">Our specialized organic nutrition formula targets the five foundational columns of healthy plant ecosystems.</p>
                  </div>

                  <div className="flex flex-row overflow-x-auto no-scrollbar snap-x snap-mandatory gap-4 md:grid md:grid-cols-3 lg:grid-cols-5 pb-4">
                    {[
                      { title: 'Full Nutrition', desc: 'Providing the complete spectrum of macro and micro-nutrients for optimum plant cellular growth.' },
                      { title: 'Healthy Soil Biology', desc: 'Restoring native organic microbial activity to help dissolve bound soil phosphate.' },
                      { title: 'Deep Roots', desc: 'Stimulating primary and secondary capillary roots for maximum structural strength and nutrient uptake.' },
                      { title: 'Vigor & Defense', desc: 'Strengthening internal defense pathways to prevent pest infection and climate stress.' },
                      { title: 'Max Genetic Yield', desc: 'Activating specific floral and vegetative growth switches to optimize fruit mass and flavor.' }
                    ].map((p, i) => (
                      <div key={i} className="bg-agri-cream rounded-2xl p-3.5 text-center border border-agri-cream-border flex flex-col items-center min-w-[150px] max-w-[150px] md:min-w-0 flex-shrink-0 snap-start">
                        <div className="w-10 h-10 bg-agri-dark text-agri-lime rounded-full flex items-center justify-center font-bold mb-3 text-sm shrink-0">
                          0{i+1}
                        </div>
                        <h3 className="font-extrabold text-[11px] text-gray-900 mb-1 leading-tight line-clamp-1">{p.title}</h3>
                        <p className="text-[9px] text-gray-500 leading-normal line-clamp-5">{p.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Research Backed banner info */}
            <section className="w-full bg-gradient-to-r from-agri-deep to-agri-green-mid py-20 px-6 md:px-12 text-white relative overflow-hidden">
              <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between">
                <div className="w-full lg:w-1/2 mb-10 lg:mb-0">
                  <span className="text-xs font-black text-agri-lime uppercase tracking-widest block mb-3">RESEARCH BACKED SYSTEM</span>
                  <h2 className="text-3xl md:text-5xl font-extrabold mb-8 leading-tight tracking-tight">
                    93% saw greener,<br />healthier crop growth*
                  </h2>
                  <div className="space-y-4">
                    {[
                      '300 Controlled Farms under validation',
                      'Crops tested across 12 distinct Indian micro-climates',
                      'Active monitoring over 5+ seasonal planting cycles'
                    ].map((check, idx) => (
                      <div key={idx} className="flex items-center space-x-3 text-sm">
                        <Check className="w-5 h-5 text-agri-lime shrink-0" />
                        <span className="text-white/90">{check}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8">
                    <a href="#science" className="text-agri-lime font-bold inline-flex items-center space-x-2 group hover:underline text-sm">
                      <span>Explore Scientific Data</span>
                      <ChevronRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div className="w-full lg:w-1/2 flex justify-center">
                  <div className="relative p-2 bg-white/5 border border-white/10 rounded-3xl w-full max-w-md shadow-2xl">
                    <img 
                      src="https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80" 
                      alt="Greener crop leaf output" 
                      className="rounded-2xl w-full object-cover h-64"
                    />
                    <div className="absolute -bottom-4 right-4 bg-white text-agri-dark px-4 py-2.5 rounded-xl shadow-lg text-xs font-bold flex items-center space-x-2 border border-orange-150">
                      <Star className="w-4 h-4 fill-agri-gold text-agri-gold shrink-0" />
                      <span>Sustained leaf chlorophyll boost</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: Holistic Approach & Expectations */}
            <section className="py-8 md:py-16 px-4 md:px-12 bg-agri-cream border-t border-b border-agri-cream-border">
              <div className="max-w-7xl mx-auto">
                <span className="text-xs font-black text-agri-green-mid uppercase tracking-widest block mb-1">HOLISTIC METHOD</span>
                <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 mb-6">What comes inside the Agriic program?</h2>

                <div className="flex flex-row overflow-x-auto no-scrollbar snap-x snap-mandatory gap-4 md:grid md:grid-cols-3 mb-10 pb-4">
                  {[
                    { title: 'Customized Nutrient Mix', desc: 'A custom dry blend organic fertilizer tailored to your specific diagnostic results.', img: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=300&q=80' },
                    { title: 'Feeding & Watering Guide', desc: 'A step-by-step custom calendar drafted by botanists for your crop stage.', img: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=300&q=80' },
                    { title: 'Dedicated Crop Coach', desc: 'Direct chat line to our botany experts for monthly updates and emergency support.', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80' }
                  ].map((item, index) => (
                    <div key={index} className="bg-white p-3.5 md:p-5 rounded-2xl flex flex-col md:flex-row items-center md:items-start text-center md:text-left space-y-3 md:space-y-0 md:space-x-4 shadow-sm border border-gray-150 min-w-[150px] max-w-[150px] md:min-w-0 md:max-w-none flex-shrink-0 snap-start">
                      <img src={item.img} className="w-14 h-14 md:w-16 md:h-16 object-cover rounded-xl shrink-0" alt="Detail img" />
                      <div>
                        <h3 className="font-extrabold text-[11px] md:text-sm text-gray-900 mb-1 leading-tight line-clamp-1 md:line-clamp-none">{item.title}</h3>
                        <p className="text-[9px] md:text-xs text-gray-500 font-normal leading-relaxed line-clamp-3 md:line-clamp-none">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Brand Honesty/Expectations matrix */}
                <div>
                  <span className="text-[12px] font-black text-agri-green-mid uppercase tracking-widest block mb-1">HONEST EXPECTATIONS</span>
                  <h2 className="text-2xl font-extrabold text-slate-900 mb-3">No miracles. Only transparent science.</h2>
                  <p className="text-xs md:text-sm text-gray-600 mb-6 max-w-xl">
                    We only recommend plans for crops we know we can help. See exactly which situations are responsive to organic nutrients and which are beyond chemical rescue.
                  </p>

                  <div className="flex flex-row overflow-x-auto no-scrollbar snap-x snap-mandatory gap-4 md:grid md:grid-cols-5 pb-4">
                    {EXPECTATIONS_LIST.slice(0, 10).map((item, index) => (
                      <div key={index} className="bg-white p-3 rounded-2xl border border-gray-150 text-center relative flex flex-col justify-between min-w-[150px] max-w-[150px] md:min-w-0 flex-shrink-0 snap-start">
                        <div className="relative rounded-xl overflow-hidden aspect-square mb-2">
                          <img src={item.img} className="w-full h-full object-cover" alt={item.label} />
                          <span className={`absolute top-2 right-2 flex items-center justify-center text-white w-5 h-5 rounded-full text-[10px] font-extrabold border border-white ${item.ok ? 'bg-[#369654]' : 'bg-red-500'}`}>
                            {item.ok ? '✓' : '✕'}
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-gray-850 leading-tight block">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5: Timeline Tabs */}
            <section className="py-8 md:py-16 px-4 md:px-12 bg-white">
              <div className="max-w-5xl mx-auto">
                <div className="flex space-x-2.5 mb-5" id="timeline-tabs">
                  <button 
                    onClick={() => setTimelineTab('vegetable')}
                    className={`px-4 py-2 rounded-xl text-[11px] md:text-xs font-extrabold tracking-wide transition ${
                      timelineTab === 'vegetable' ? 'bg-[#2b3a30] text-[#c2dd74] shadow-md' : 'bg-agri-cream text-gray-600'
                    }`}
                  >
                    VEGETABLE TIMELINE
                  </button>
                  <button 
                    onClick={() => setTimelineTab('ornamental')}
                    className={`px-4 py-2 rounded-xl text-[11px] md:text-xs font-extrabold tracking-wide transition ${
                      timelineTab === 'ornamental' ? 'bg-[#2b3a30] text-[#c2dd74] shadow-md' : 'bg-agri-cream text-gray-600'
                    }`}
                  >
                    ORNAMENTAL TIMELINE
                  </button>
                </div>

                <h2 className="text-2xl font-extrabold mb-6 text-gray-900 tracking-tight">
                  When will your crops show change?
                </h2>

                <div className="flex flex-row overflow-x-auto no-scrollbar snap-x snap-mandatory gap-4 md:grid md:grid-cols-3 lg:grid-cols-6 pb-4">
                  {timelineTab === 'vegetable' ? (
                    <>
                      {[
                        { num: 'Month 1', label: 'Nutrient Intake', txt: 'Capillary roots begin absorbing direct seaweed proteins.' },
                        { num: 'Month 2', label: 'Root Branching', txt: 'Roots lock deep into soil, doubling nutrient coverage.' },
                        { num: 'Month 3', label: 'Stem Vigor', txt: 'Cellular walls harden, boosting stalk thickness and leaf surface.' },
                        { num: 'Month 4', label: 'Floral Boost', txt: 'Early bud division shows stronger and wider color structure.' },
                        { num: 'Month 5', label: 'Fruit Formation', txt: 'Consistent water and calcium delivery avoids leaf spot defaults.' },
                        { num: 'Month 6', label: 'Maximum Yield', txt: 'Harvest density peaks, retaining native botanical sugars.' }
                      ].map((step, i) => (
                        <div key={i} className="bg-agri-cream p-3 px-3.5 rounded-xl relative border border-agri-cream-border flex flex-col justify-between min-w-[150px] max-w-[150px] md:min-w-0 flex-shrink-0 snap-start">
                          <span className="text-[10px] font-black text-agri-green-mid block mb-1">{step.num}</span>
                          <h4 className="font-extrabold text-[11px] text-gray-900 mb-1 leading-tight line-clamp-1">{step.label}</h4>
                          <p className="text-[9px] text-gray-500 leading-normal line-clamp-4">{step.txt}</p>
                        </div>
                      ))}
                    </>
                  ) : (
                    <>
                      {[
                        { num: 'Week 2-4', label: 'Micellar Awaken', txt: 'Houseplant potting soil wakes up. Green foliage brightens.' },
                        { num: 'Month 1-2', label: 'New Offshoots', txt: 'Vibrant young red/green leaf nodes start splitting.' },
                        { num: 'Month 2-3', label: 'Deep Luster', txt: 'Vitamins supply robust leaf defense against household mites.' },
                        { num: 'Month 3-4', label: 'Active Budding', txt: 'Ornamental buds cluster densely along stalks.' },
                        { num: 'Month 4-5', label: 'Ext Blooming', txt: 'Flower duration extends by up to 2.5 times.' },
                        { num: 'Month 5-6', label: 'Sustained Beauty', txt: 'A resilient, gorgeous lush canopy is fully finalized.' }
                      ].map((step, i) => (
                        <div key={i} className="bg-agri-cream p-3 px-3.5 rounded-xl relative border border-agri-cream-border flex flex-col justify-between min-w-[150px] max-w-[150px] md:min-w-0 flex-shrink-0 snap-start">
                          <span className="text-[10px] font-black text-agri-green-mid block mb-1">{step.num}</span>
                          <h4 className="font-extrabold text-[11px] text-gray-900 mb-1 leading-tight line-clamp-1">{step.label}</h4>
                          <p className="text-[9px] text-gray-500 leading-normal line-clamp-4">{step.txt}</p>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </section>

            {/* Section 6: Big Brand Science banner */}
            <section className="bg-agri-dark text-white py-10 md:py-20 px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between">
              <div className="w-full lg:w-1/2 mb-8 lg:mb-0 max-w-xl">
                <span className="text-xs font-bold text-agri-lime tracking-widest uppercase block mb-2 font-mono">SOIL DISCIPLINE</span>
                <h2 className="text-2xl md:text-5xl font-extrabold mb-4 md:mb-6 leading-tight">Root development science is our priority.</h2>
                <p className="text-white/80 leading-relaxed text-xs md:text-base">
                  Most fertilizers only feed the leaf, forcing immediate growth on fragile stalks. Agriic works from the bottom up. We enrich root structures first, securing long-term nutrient storage. Healthy plants are merely the natural side-effect of rich soil.
                </p>
                <div className="mt-6 md:mt-8">
                  <a href="#soil-test" className="btn-primary inline-block text-xs md:text-sm">Diagnostic Soil Test</a>
                </div>
              </div>
              <div className="w-full lg:w-1/2 flex justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=700&q=80" 
                  alt="Root system structure photography" 
                  className="rounded-2xl md:rounded-3xl w-full max-w-md object-cover h-52 md:h-72 shadow-lg"
                />
              </div>
            </section>

            {/* Section 7: Ingredients Slider Overview */}
            <section className="py-8 md:py-16 bg-[#f7f6ee]">
              <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="mb-6 md:mb-10 text-center md:text-left">
                  <span className="text-xs font-black text-agri-green-mid uppercase tracking-widest block mb-1">PURE ESSENCES</span>
                  <h2 className="text-2xl font-extrabold text-gray-900">Ayurveda + Modern Plant Science</h2>
                  <p className="text-gray-500 text-xs mt-1 max-w-md">Every premium lot represents a clean, fully listed mixture of nutrient-dense bio-actives.</p>
                </div>

                <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-6 slider-container snap-x snap-mandatory">
                  {INGREDIENTS.map((item, index) => (
                    <div key={index} className="min-w-[150px] max-w-[150px] bg-white rounded-2xl p-3.5 shadow-sm border border-gray-150 flex flex-col items-center snap-start">
                      <img src={item.img} className="w-14 h-14 object-cover rounded-xl mb-3 border border-gray-100" alt="Ingredient" />
                      <h4 className="font-extrabold text-[11px] text-gray-900 text-center mb-1 leading-tight line-clamp-1">{item.name}</h4>
                      <p className="text-[9px] text-gray-500 text-center leading-normal line-clamp-2">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Section 8: Google Reviews */}
            <section className="py-8 md:py-16 bg-white border-t border-gray-100">
              <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="mb-6 md:mb-10 text-center">
                  <span className="text-xs font-extrabold text-[#e0b031] tracking-widest block uppercase mb-1">4.5★ GOOGLE PRESENCE</span>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900">What backyard growers are sharing</h2>
                </div>

                <div className="flex flex-row overflow-x-auto no-scrollbar snap-x snap-mandatory gap-4 md:grid md:grid-cols-3 pb-4">
                  {GOOGLE_REVIEWS.map((r, i) => (
                    <div key={i} className="bg-white p-3.5 rounded-2xl border border-gray-200 flex flex-col justify-between shadow-sm min-w-[150px] max-w-[150px] md:min-w-0 flex-shrink-0 snap-start">
                      <div>
                        <div className="flex text-yellow-505 text-[10px] tracking-widest mb-2">★★★★★</div>
                        <p className="text-[10px] text-gray-500 italic leading-relaxed line-clamp-5">"{r.text}"</p>
                      </div>
                      <span className="block font-bold text-[9px] text-slate-800 mt-2 border-t border-slate-100 pt-2 truncate">— {r.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Section 9: Quick Shop Panel */}
            <section className="py-8 md:py-16 px-4 md:px-12 bg-agri-cream">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 md:mb-10">
                  <div>
                    <span className="text-xs font-black text-agri-green-mid uppercase tracking-widest block mb-1">PRODUCTS DIRECT</span>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-[#2b3a30]">Plant nutrition concentrates</h2>
                  </div>
                  <a href="#products" className="text-agri-dark font-extrabold hover:underline text-xs md:text-sm mt-2 md:mt-0 flex items-center">
                    <span>View all products</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </a>
                </div>

                <div className="flex flex-row overflow-x-auto no-scrollbar snap-x snap-mandatory gap-4 md:grid md:grid-cols-2 lg:grid-cols-4 pb-4">
                  {PRODUCTS.slice(0, 4).map((p) => (
                    <div key={p.id} className="bg-white p-3.5 rounded-[20px] md:p-5 md:rounded-[24px] shadow-sm border border-transparent hover:border-gray-200 flex flex-col justify-between relative group transform hover:-translate-y-1 transition-all min-w-[150px] max-w-[150px] md:min-w-0 flex-shrink-0 snap-start">
                      <div>
                        <div className="relative rounded-xl overflow-hidden aspect-square mb-3 bg-gray-50 flex items-center justify-center p-2">
                          <img src={p.img} className="max-h-20 md:max-h-32 object-contain group-hover:scale-105 transition-transform" alt={p.name} />
                        </div>
                        <span className="text-[8px] md:text-[9px] font-bold text-agri-green-mid block mb-0.5 uppercase tracking-wide">{p.category}</span>
                        <h4 className="font-extrabold text-[10px] md:text-sm text-gray-900 mb-0.5 leading-tight line-clamp-1">{p.name}</h4>
                        <p className="text-[9px] md:text-[11px] text-gray-500 font-normal leading-relaxed mb-3 line-clamp-2">{p.desc}</p>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-extrabold text-[11px] md:text-sm text-gray-950">₹ {p.price}</span>
                          <span className="text-[9px] md:text-[10px] text-gray-400 line-through">₹ {Math.round(p.price * 1.25)}</span>
                        </div>
                        <button 
                          onClick={() => addToCart(p)}
                          className="w-full bg-[#2c2c2c] hover:bg-black text-white text-[9px] md:text-[11px] font-black tracking-wider py-1.5 md:py-2.5 rounded-lg transition-colors uppercase"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: SCIENCE */}
        {routePath === '#science' && (
          <div className="py-6 md:py-12 px-4 md:px-12 bg-white max-w-7xl mx-auto">
            <span className="text-xs font-black text-agri-green-mid tracking-widest block uppercase mb-1">RESEARCH METHODOLOGY</span>
            <h1 className="text-2xl md:text-5xl font-extrabold text-gray-950 mb-4 tracking-tight">
              Science and Field Validation
            </h1>
            <p className="text-gray-600 text-xs md:text-base max-w-2xl leading-relaxed mb-8">
              At Agriic, botanical biology is not a marketing hook. Read how we design precision soil restoration programs through active trial iterations.
            </p>

            <div className="flex flex-row overflow-x-auto no-scrollbar snap-x snap-mandatory gap-4 md:grid md:grid-cols-3 mb-10 pb-4">
              {[
                { title: 'Soil Extraction Map', text: 'We start by extracting complete trace element metrics—specifically evaluating primary mineral depletion levels.' },
                { title: 'Ayurvedic Hybrid Blends', text: 'We enrich active compound isolates (like cold-pressed seaweed micellar enzymes) directly into organic mineral bases.' },
                { title: 'Independent Verification', text: 'Third-party validation verifies final leaf health indexes, crop root weight expansion ratios, and lasting soil biomes.' }
              ].map((item, index) => (
                <div key={index} className="border border-gray-200 p-3.5 rounded-2xl shadow-sm bg-white hover:shadow-md transition min-w-[150px] max-w-[150px] md:min-w-0 flex-shrink-0 snap-start flex flex-col justify-between">
                  <div>
                    <span className="text-xl font-black text-agri-lime block mb-1">0{index + 1}</span>
                    <h3 className="font-extrabold text-[11px] text-slate-900 mb-1 leading-tight line-clamp-1">{item.title}</h3>
                    <p className="text-[9px] text-gray-505 leading-normal line-clamp-5">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Before after cards */}
            <div className="bg-agri-cream p-4 md:p-10 rounded-2xl md:rounded-[32px] mb-8">
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-4 md:mb-6 text-center md:text-left">Longitudinal Case Studies</h2>
              <div className="flex flex-row overflow-x-auto no-scrollbar snap-x snap-mandatory gap-4 md:grid md:grid-cols-2 pb-4">
                {[
                  { 
                    farmer: 'Amit Deshmukh (Pune District)', 
                    crop: 'Pomegranate Growth',
                    before: 'https://images.unsplash.com/photo-1508849789987-4e5333c12b78?auto=format&fit=crop&w=350&q=80',
                    after: 'https://images.unsplash.com/photo-1610341592771-74946011232f?auto=format&fit=crop&w=350&q=80',
                    desc: 'Soil pH recovery from 5.4 back to balanced 6.7 in just 120 days. Fruit output weight increased by active 42%.'
                  },
                  { 
                    farmer: 'Vikas Patel (Anand District)', 
                    crop: 'Leaf Nitrogen Density',
                    before: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=350&q=80',
                    after: 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=350&q=80',
                    desc: 'Nitrogen levels balanced. Soil moisture capacity increased by 33%, securing crops against dry hot bursts.'
                  }
                ].map((caseStudy, index) => (
                  <div key={index} className="bg-white p-3.5 rounded-xl shadow-sm border border-gray-150 flex flex-col justify-between min-w-[150px] max-w-[150px] md:min-w-0 flex-shrink-0 snap-start">
                    <div>
                      <h3 className="font-extrabold text-[11px] md:text-sm text-gray-900 mb-0.5 line-clamp-1">{caseStudy.farmer}</h3>
                      <span className="text-[9px] md:text-[11px] font-bold text-agri-green-mid block mb-2 leading-tight line-clamp-1">{caseStudy.crop}</span>
                      <div className="grid grid-cols-2 gap-1.5 mb-2">
                        <div>
                          <span className="text-[8px] text-slate-400 block mb-0.5 uppercase font-mono truncate">BEFORE</span>
                          <img src={caseStudy.before} className="rounded-lg h-14 md:h-24 w-full object-cover" alt="Before" />
                        </div>
                        <div>
                          <span className="text-[8px] text-slate-400 block mb-0.5 uppercase font-mono truncate font-semibold">AFTER</span>
                          <img src={caseStudy.after} className="rounded-lg h-14 md:h-24 w-full object-cover" alt="After" />
                        </div>
                      </div>
                    </div>
                    <p className="text-[9px] md:text-[11px] text-gray-600 leading-normal line-clamp-3 md:line-clamp-none">{caseStudy.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-agri-dark to-agri-green-mid text-white p-6 md:p-12 rounded-2xl md:rounded-3xl text-center">
              <h3 className="text-xl md:text-2xl font-extrabold mb-3">Ready to test your soil baseline?</h3>
              <p className="text-white/80 max-w-sm mx-auto text-[11px] md:text-xs leading-relaxed mb-5">Receive a custom mineral and composition breakdown analysis through our direct digital Soil Test™ quiz.</p>
              <a href="#soil-test" className="bg-agri-lime text-[#1b3322] font-black text-xs md:text-sm px-6 py-3.5 rounded-xl shadow-md hover:scale-105 active:scale-95 transition-transform inline-block uppercase">Start diagnostic free</a>
            </div>
          </div>
        )}

        {/* VIEW 3: ABOUT US */}
        {routePath === '#about' && (
          <div className="py-12 px-4 md:px-12 bg-white max-w-5xl mx-auto">
            <span className="text-xs font-black text-agri-green-mid tracking-widest block uppercase mb-2">OUR BOTANICS MISSION</span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-950 mb-6 tracking-tight">Rooted in science, grown for India</h1>
            
            <div className="prose prose-sm text-gray-600 leading-relaxed space-y-6 text-sm mb-12">
              <p>
                Agriic was established in Vapi, Gujarat with a primary mission: to provide Indian agriculture with customized, soil-specific organic plant nutrition solutions. 
              </p>
              <p>
                By avoiding typical synthetic nitrates that permanently crystallize the topsoil, our slow-release recipes integrate trace botanical enzymes to maintain soil porosity and balanced biological biomes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-agri-cream p-6 rounded-2xl border border-agri-cream-border">
                <h3 className="font-extrabold text-[#2b3a30] text-sm mb-2">Ayurvedic Insight</h3>
                <p className="text-xs text-gray-600 leading-relaxed font-normal">We utilize traditional plant food protocols like neem cake, mustard oil hulls, and alfalfa compounds to construct organic defense.</p>
              </div>
              <div className="bg-agri-cream p-6 rounded-2xl border border-agri-cream-border">
                <h3 className="font-extrabold text-[#2b3a30] text-sm mb-2">Contemporary Science</h3>
                <p className="text-xs text-gray-600 leading-relaxed font-normal">Controlled laboratory extractions of fulvic and humic chains ensure our mixes release micronutrients consistently.</p>
              </div>
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Our Journey</h2>
            <div className="space-y-6 relative border-l border-gray-200 pl-6 ml-2">
              {[
                { year: '2019', title: 'Founded with Soil Testing Focus', desc: 'Initially built custom testing kits for state-level co-ops.' },
                { year: '2021', title: 'Formulations validation', desc: 'Completed 300 controlled farm validation iterations with state botanical councils.' },
                { year: '2023', title: 'Farmer Network Reaches 5L', desc: 'Opened centers in Bangalore, Hyderabad, and Nagpur to meet direct requests.' },
                { year: '2026', title: 'Direct consumer launch', desc: 'Making professional agricultural-grade custom blends accessible directly to home gardeners.' }
              ].map((milestone, idx) => (
                <div key={idx} className="relative">
                  <span className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-agri-green-mid border-2 border-white ring-4 ring-agri-cream"></span>
                  <span className="block text-xs font-black text-agri-green-mid mb-1">{milestone.year}</span>
                  <h4 className="font-bold text-sm text-gray-900 mb-1">{milestone.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed mb-4">{milestone.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 4: PRODUCTS */}
        {routePath === '#products' && (
          <div className="py-12 px-4 md:px-12 bg-white max-w-7xl mx-auto">
            <div className="mb-8">
              <span className="text-xs font-black text-agri-green-mid tracking-widest block uppercase mb-2">SHOP THE CATALOG</span>
              <h1 className="text-3xl md:text-5xl font-extrabold text-gray-950 tracking-tight">Science-backed organic products</h1>
            </div>

            {/* Filter Pills */}
            <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-4 mb-8">
              {[
                { key: 'all', label: 'All Mixtures' },
                { key: 'nutrition', label: 'Nutrition' },
                { key: 'soil-health', label: 'Soil Health' },
                { key: 'pest-control', label: 'Pest Control' },
                { key: 'tools', label: 'Testing Tools' }
              ].map((pill) => (
                <button
                  key={pill.key}
                  onClick={() => setProductFilter(pill.key)}
                  className={`px-4.5 py-2.5 rounded-xl text-xs font-black tracking-wide transition whitespace-nowrap ${
                    productFilter === pill.key 
                      ? 'bg-agri-dark text-white shadow-md' 
                      : 'bg-agri-cream text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PRODUCTS.filter(p => productFilter === 'all' || p.category === productFilter).map((p) => (
                <div key={p.id} className="bg-white p-5 rounded-[24px] shadow-sm border border-[#e2e1d7]/60 flex flex-col justify-between group transform hover:-translate-y-1 transition-all">
                  <div>
                    <a href={`#product?id=${p.id}`} className="block">
                      <div className="relative rounded-xl overflow-hidden aspect-square mb-4 bg-gray-50 flex items-center justify-center p-4">
                        <img src={p.img} className="max-h-36 object-contain group-hover:scale-105 transition-transform" alt={p.name} />
                      </div>
                      <span className="text-[10px] font-bold text-agri-green-mid block mb-1 uppercase tracking-wider">{p.category}</span>
                      <h4 className="font-extrabold text-sm text-gray-900 mb-1 leading-tight group-hover:text-agri-green-mid transition-colors">{p.name}</h4>
                      <p className="text-[11px] text-gray-500 font-normal leading-relaxed mb-4 line-clamp-2">{p.desc}</p>
                    </a>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-extrabold text-[#2b3a30] text-sm">₹ {p.price}</span>
                      <span className="text-[11px] text-gray-400 line-through">₹ {Math.round(p.price * 1.25)}</span>
                    </div>
                    <button 
                      onClick={() => addToCart(p)}
                      className="w-full bg-[#1b3322] hover:bg-black text-white text-[11px] tracking-widest font-black py-3 rounded-lg transition-colors"
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 5: PRODUCT DETAIL */}
        {routePath === '#product' && (
          <div className="py-12 px-4 md:px-12 bg-white max-w-6xl mx-auto">
            {(() => {
              const prodId = routeParams.id;
              const product = PRODUCTS.find(p => p.id === prodId);
              
              if (!product) {
                return (
                  <div className="text-center py-16">
                    <HelpCircle className="w-12 h-12 text-slate-350 mx-auto mb-4" />
                    <h2 className="text-xl font-bold mb-2">Product Not Found</h2>
                    <p className="text-sm text-gray-550 mb-6">The item you searched for could not be traced.</p>
                    <a href="#products" className="btn-primary">Browse All Products</a>
                  </div>
                );
              }

              // Related products
              const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);
              
              return (
                <div>
                  <a href="#products" className="inline-flex items-center space-x-1.5 text-xs font-semibold text-agri-green-mid hover:underline mb-8">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to shop catalog</span>
                  </a>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 mb-16">
                    {/* Left side Image container */}
                    <div className="bg-agri-cream rounded-[32px] p-8 flex items-center justify-center min-h-[300px] md:min-h-[400px]">
                      <img src={product.img} className="max-h-72 object-contain drop-shadow-xl" alt={product.name} />
                    </div>

                    {/* Right side detail fields */}
                    <div className="flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-black text-agri-green-mid tracking-widest block uppercase mb-2">{product.category}</span>
                        <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4 tracking-tight">{product.name}</h1>
                        
                        <div className="flex items-center space-x-3 mb-6">
                          <div className="flex text-agri-gold">
                            {Array.from({ length: 5 }).map((_, starIdx) => (
                              <Star key={starIdx} className="w-4 h-4 fill-agri-gold" />
                            ))}
                          </div>
                          <span className="text-xs text-gray-400 font-medium">Verified trial reports</span>
                        </div>

                        <div className="flex items-end space-x-2.5 mb-6">
                          <span className="text-2xl font-black text-gray-905">₹ {product.price}</span>
                          <span className="text-xs text-gray-400 line-through mb-1">₹ {Math.round(product.price * 1.25)}</span>
                          <span className="text-xs text-red-500 font-bold ml-2">(20% discount applied)</span>
                        </div>

                        <p className="text-sm text-gray-650 leading-relaxed font-normal mb-8">
                          {product.desc} Every Agriic concentration goes through rigorous quality control checks and is organic certified, protecting local water basins against synthetic run-off.
                        </p>
                      </div>

                      <div className="border-t border-gray-100 pt-6">
                        <button 
                          onClick={() => addToCart(product, 1)}
                          className="w-full bg-agri-dark text-white font-extrabold py-4 rounded-xl shadow-lg hover:bg-black transition text-sm tracking-wider uppercase"
                        >
                          ADD TO CART • ₹ {product.price}
                        </button>
                      </div>

                      {/* Accordions */}
                      <div className="mt-8 space-y-3.5">
                        {[
                          { id: 'benefits', title: 'Nutrient Bio-availability & Benefits', txt: 'Restores the nitrogen framework with slow solubility, ensuring local capillary root branches absorb macro complexes without cell burning risk.' },
                          { id: 'usage', title: 'Specific Application Directions', txt: 'Apply 15g evenly around houseplants or 1 bag per 100 sq ft for field cultivation. Water immediately. Repeat once every 24 days.' },
                          { id: 'shipping', title: 'Safe Delivery & Traceability', txt: 'Eco-packed and traced within 24 hours. Free dispatch for carts above ₹499.' }
                        ].map(acc => {
                          const isOpen = openAccordion === acc.id;
                          return (
                            <div key={acc.id} className="border-b border-slate-100 pb-3">
                              <button 
                                onClick={() => setOpenAccordion(isOpen ? null : acc.id)}
                                className="w-full flex items-center justify-between text-left focus:outline-none py-2"
                              >
                                <span className="font-bold text-xs tracking-wide text-slate-800 uppercase">{acc.title}</span>
                                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                              </button>
                              {isOpen && (
                                <p className="text-xs text-gray-550 leading-relaxed mt-2 animate-fade-in pl-1">
                                  {acc.txt}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Related items */}
                  {related.length > 0 && (
                    <div>
                      <h3 className="text-lg font-black text-gray-900 mb-6">Other target organic mixtures</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {related.map((rp) => (
                          <div key={rp.id} className="bg-[#f7f6ee] p-4 rounded-2xl flex flex-col justify-between hover:shadow-sm transition">
                            <a href={`#product?id=${rp.id}`} className="block">
                              <img src={rp.img} className="h-28 mx-auto object-contain rounded-lg mb-2" alt={rp.name} />
                              <h4 className="font-extrabold text-xs text-gray-900 group-hover:text-agri-green-mid leading-tight line-clamp-1">{rp.name}</h4>
                            </a>
                            <div className="flex items-center justify-between mt-3">
                              <span className="font-bold text-xs text-gray-800">₹ {rp.price}</span>
                              <button 
                                onClick={() => addToCart(rp)}
                                className="bg-white hover:bg-gray-100 border border-gray-250 px-2.5 py-1.5 rounded-lg text-[10px] font-bold"
                              >
                                Add item
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* VIEW 6: SOIL TEST */}
        {routePath === '#soil-test' && (
          <div className="py-12 px-4 md:px-12 bg-white max-w-3xl mx-auto">
            {!quizCompleted ? (
              <div className="bg-[#f7f6ee] p-6 md:p-10 rounded-[32px] border border-agri-cream-border shadow-sm">
                <span className="text-xs font-black text-agri-green-mid tracking-widest block uppercase mb-1">DIAGNOSTIC TEST</span>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950 mb-3 tracking-tight">The Soil Test™</h1>
                <p className="text-xs text-gray-550 mb-8 max-w-md leading-relaxed">
                  Analyze your baseline nutrient deficiencies to generate a customized kit recommendation. Answer 5 easy questions.
                </p>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 h-2 rounded-full mb-2 overflow-hidden">
                  <div 
                    className="bg-agri-lime-alt h-full transition-all duration-300"
                    style={{ width: `${((quizStep + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[11px] text-gray-400 font-bold mb-8">
                  <span>STEP {quizStep + 1} OF 5</span>
                  <span>{Math.round(((quizStep + 1) / QUIZ_QUESTIONS.length) * 100)}% COMPLETE</span>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg md:text-xl font-black text-gray-900 mb-6">{QUIZ_QUESTIONS[quizStep].question}</h3>
                  <div className="space-y-3">
                    {QUIZ_QUESTIONS[quizStep].options.map((opt, optIdx) => {
                      const isSelected = quizAnswers[quizStep] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => {
                            const updated = [...quizAnswers];
                            updated[quizStep] = optIdx;
                            setQuizAnswers(updated);
                          }}
                          className={`w-full text-left p-4.5 rounded-xl border text-xs font-bold leading-tight transition-all flex items-center justify-between ${
                            isSelected 
                              ? 'bg-white border-agri-lime text-agri-dark ring-2 ring-agri-lime/20' 
                              : 'bg-white border-gray-250 hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <span>{opt}</span>
                          <span className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center ${isSelected ? 'border-agri-lime bg-agri-lime' : 'border-gray-300'}`}>
                            {isSelected && <span className="w-2 h-2 rounded-full bg-[#1b3322]"></span>}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-between items-center-pt-4">
                  {quizStep > 0 ? (
                    <button 
                      onClick={() => setQuizStep(quizStep - 1)}
                      className="text-xs font-bold text-gray-500 hover:text-black transition"
                    >
                      ← Back
                    </button>
                  ) : <div></div>}

                  <button
                    onClick={() => {
                      if (quizStep < QUIZ_QUESTIONS.length - 1) {
                        setQuizStep(quizStep + 1);
                      } else {
                        setQuizCompleted(true);
                      }
                    }}
                    disabled={quizAnswers[quizStep] === undefined}
                    className={`px-6 py-3.5 rounded-xl text-xs font-extrabold tracking-wider ${
                      quizAnswers[quizStep] !== undefined 
                        ? 'bg-agri-dark text-white cursor-pointer hover:bg-black' 
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {quizStep === QUIZ_QUESTIONS.length - 1 ? 'See Recommendations' : 'Next Question →'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 p-6 md:p-10 rounded-[32px] text-center shadow-lg animate-fade-in text-gray-900">
                <div className="w-16 h-16 bg-agri-lime/30 rounded-full flex items-center justify-center text-agri-dark mx-auto mb-6">
                  <Check className="w-8 h-8 text-agri-dark" />
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3">Diagnostic Analysis Complete!</h1>
                <p className="text-xs text-gray-650 max-w-sm mx-auto mb-8 leading-normal">
                  Our system matched your answers to target deficiencies. We recommend the following starter mixture based on your crop selections.
                </p>

                <div className="border border-[#e2e1d7] p-5 rounded-2xl bg-slate-50 text-left mb-8 max-w-md mx-auto">
                  <div className="flex items-center space-x-3 mb-4">
                    <img src={PRODUCTS[0].img} className="w-12 h-12 object-cover rounded-lg bg-white p-1 border" alt="Core NPK" />
                    <div>
                      <h4 className="font-extrabold text-sm text-gray-900">{PRODUCTS[0].name}</h4>
                      <p className="text-[11px] text-gray-500 line-clamp-1">{PRODUCTS[0].desc}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center-pt-2 border-t border-slate-100 mt-2">
                    <span className="font-extrabold text-slate-800 text-sm">₹ {PRODUCTS[0].price}</span>
                    <button 
                      onClick={() => addToCart(PRODUCTS[0], 1)}
                      className="bg-[#2b3a30] text-agri-lime hover:bg-black font-black text-[10px] tracking-wider px-3 py-1.5 rounded-md"
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <button 
                    onClick={() => {
                      setQuizStep(0);
                      setQuizAnswers([]);
                      setQuizCompleted(false);
                    }}
                    className="text-xs text-gray-550 hover:text-black tracking-wide font-extrabold underline"
                  >
                    Retake Soil Test™
                  </button>
                  <span>|</span>
                  <a href="#products" className="text-xs text-agri-green-mid hover:underline font-extrabold">Shop complete kit</a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 7: GROWING BLOG */}
        {routePath === '#blog' && (
          <div className="py-12 px-4 md:px-12 bg-white max-w-7xl mx-auto">
            <span className="text-xs font-black text-agri-green-mid tracking-widest block uppercase mb-2">EDUCATIONAL HUB</span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-950 mb-4 tracking-tight">Stay rooted in botany</h1>
            <p className="text-sm text-gray-600 max-w-md leading-relaxed mb-12">Learn top gardening practices, soil microbial mechanics, and seasonal vegetable timing from our specialists.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {BLOG_POSTS.map((post, index) => (
                <div key={index} className="border border-gray-150 rounded-[24px] overflow-hidden bg-white shadow-sm hover:shadow-md transition">
                  <img src={post.img} className="h-48 w-full object-cover" alt={post.title} />
                  <div className="p-6">
                    <div className="flex items-center space-x-2 text-[10px] font-extrabold text-agri-green-mid mb-2 uppercase tracking-widest bg-agri-cream px-2 py-0.5 rounded w-fit">
                      <span>{post.category}</span>
                    </div>
                    <h3 className="font-extrabold text-sm text-gray-905 mb-2 leading-tight">{post.title}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed mb-4">{post.excerpt}</p>
                    <div className="flex justify-between items-center text-[10px] text-gray-400 pt-3 border-t border-slate-50 font-semibold">
                      <span>{post.date}</span>
                      <span>{post.readTime} read</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Newsletter Subscription */}
            <div className="bg-[#f7f6ee] p-8 md:p-12 rounded-[32px] mt-16 text-center max-w-3xl mx-auto border border-[#e2e1d7]/60">
              <h3 className="text-xl font-extrabold text-slate-900 mb-2">Subscribe to Agriic Digest</h3>
              <p className="text-xs text-gray-550 max-w-md mx-auto mb-6">Receive seasonal crop guidance, localized soil alerts, and exclusive discounts directly in your inbox.</p>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newsEmail) {
                    showToastMsg('Subscription success! Check your inbox soon.');
                    setNewsEmail('');
                  }
                }}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input 
                  type="email" 
                  value={newsEmail}
                  onChange={(e) => setNewsEmail(e.target.value)}
                  placeholder="Enter email address" 
                  className="bg-white border border-gray-300 px-4 py-3 rounded-xl flex-1 text-slate-800 text-xs font-semibold focus:outline-none" 
                  required
                />
                <button 
                  type="submit" 
                  className="bg-agri-dark text-white font-extrabold text-xs px-6 py-3.5 rounded-xl hover:bg-black transition whitespace-nowrap"
                >
                  Join Newsletter
                </button>
              </form>
            </div>
          </div>
        )}

        {/* VIEW 8: ABOUT / HOW TO CONTACT */}
        {routePath === '#contact' && (
          <div className="py-12 px-4 md:px-12 bg-white max-w-5xl mx-auto">
            <span className="text-xs font-black text-agri-green-mid uppercase tracking-widest block mb-2">DIRECT COMMUNICATION</span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-950 mb-4 tracking-tight">Consult with our advisors</h1>
            <p className="text-sm text-gray-600 mb-10 max-w-md lead-relaxed">We provide responsive, direct advice. Send a custom enquiry about crop health or order problems.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              
              {/* Form panel */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  showToastMsg('Message received. Our advisor will return with research data soon.');
                  setContactForm({ name: '', phone: '', email: '', subject: '', message: '' });
                }}
                className="space-y-4"
              >
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">Your Name</label>
                  <input 
                    type="text" 
                    value={contactForm.name} 
                    onChange={e => setContactForm({ ...contactForm, name: e.target.value })} 
                    placeholder="Enter name" 
                    className="w-full bg-slate-50 border border-gray-250 p-3 text-xs font-semibold rounded-xl focus:bg-white focus:outline-none" 
                    required 
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">Email</label>
                    <input 
                      type="email" 
                      value={contactForm.email} 
                      onChange={e => setContactForm({ ...contactForm, email: e.target.value })} 
                      placeholder="you@example.com" 
                      className="w-full bg-slate-50 border border-gray-250 p-3 text-xs font-semibold rounded-xl focus:bg-white focus:outline-none" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">Phone (Format)</label>
                    <input 
                      type="tel" 
                      value={contactForm.phone} 
                      onChange={e => setContactForm({ ...contactForm, phone: e.target.value })} 
                      placeholder="+91" 
                      className="w-full bg-slate-50 border border-gray-250 p-3 text-xs font-semibold rounded-xl focus:bg-white focus:outline-none" 
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">Subject</label>
                  <select 
                    value={contactForm.subject}
                    onChange={e => setContactForm({ ...contactForm, subject: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-250 p-3 text-xs font-semibold rounded-xl focus:bg-white focus:outline-none"
                    required
                  >
                    <option value="">Choose a subject...</option>
                    <option value="soil">Soil test support enquiries</option>
                    <option value="product">Product composition questions</option>
                    <option value="wholesale">Commercial and bulk purchases</option>
                    <option value="delivery">Shipping query</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">Enquiry</label>
                  <textarea 
                    value={contactForm.message} 
                    onChange={e => setContactForm({ ...contactForm, message: e.target.value })} 
                    placeholder="Provide details about your soil or crop type..." 
                    rows={4} 
                    className="w-full bg-slate-50 border border-gray-250 p-3 text-xs font-semibold rounded-xl focus:bg-white focus:outline-none" 
                    required 
                  />
                </div>
                <button 
                  type="submit" 
                  className="bg-agri-dark text-[#c2dd74] font-black tracking-wider text-xs px-6 py-4.5 rounded-xl hover:bg-black transition-colors"
                >
                  SEND ADVICE ENQUIRY
                </button>
              </form>

              {/* Direct ways details */}
              <div className="space-y-6">
                <div className="bg-[#f7f6ee] p-6 rounded-2xl border border-[#e2e1d7]">
                  <h3 className="font-extrabold text-sm text-[#2b3a30] mb-2 flex items-center space-x-1.5">
                    <Phone className="w-4 h-4 text-agri-green-mid" />
                    <span>WhatsApp support centre</span>
                  </h3>
                  <p className="text-xs text-gray-650 leading-relaxed font-normal mb-4">
                    Send photos of your crops directly to our botanical advisors. We will review leaf spot damages immediately.
                  </p>
                  <a 
                    href="https://wa.me/918047863601" 
                    target="_blank" 
                    rel="noopener"
                    className="bg-[#25D366] text-white font-extrabold text-xs px-5 py-2.5 rounded-lg inline-flex items-center space-x-2 shadow-sm"
                  >
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>

                <div>
                  <h4 className="font-extrabold text-xs text-slate-900 mb-3">Service Locations</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Bengaluru', 'Pune', 'Nagpur', 'Chennai', 'Vapi (Regd. Office)', 'Mumbai (HQ)'].map((city, idx) => (
                      <span key={idx} className="bg-agri-cream text-gray-700 border border-agri-cream-border text-[11px] font-semibold px-3.5 py-1.5 rounded-md">
                        {city}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  <p className="font-bold">Agriic Solutions Pvt. Ltd.</p>
                  <p className="mt-1">Unit no - 101, B wing, building - 16, Interface, Off Link Road, Malad (West), Mumbai - 400064</p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* VIEW 9: CART */}
        {routePath === '#cart' && (
          <div className="py-12 px-4 md:px-12 bg-white max-w-4xl mx-auto">
            <h1 className="text-2xl md:text-3.5xl font-extrabold text-[#2b3a30] mb-2 tracking-tight">Shopping Cart</h1>
            <p className="text-xs text-gray-500 mb-8">{getCartCount()} items in basket</p>

            {cart.length === 0 ? (
              <div className="text-center py-16 bg-[#f7f6ee] rounded-3xl p-6 border">
                <ShoppingCart className="w-12 h-12 text-slate-350 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Cart is empty</h3>
                <p className="text-xs text-gray-500 mb-6">Explore our diagnostic mixtures to start crop recovery.</p>
                <a href="#products" className="btn-primary">Browse Shop Products</a>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="divide-y divide-gray-150">
                  {cart.map((item) => (
                    <div key={item.product.id} className="py-4.5 flex items-center justify-between gap-4">
                      <img src={item.product.img} className="w-16 h-16 object-contain rounded-lg bg-gray-50 p-1" alt={item.product.name} />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-extrabold text-sm text-gray-900 truncate">{item.product.name}</h4>
                        <span className="text-[11px] text-gray-500 font-bold uppercase">{item.product.category}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 bg-slate-50 px-2 py-1 rounded-lg border border-gray-200">
                        <button 
                          onClick={() => updateCartQty(item.product.id, item.qty - 1)}
                          className="p-1 hover:text-red-500 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold">{item.qty}</span>
                        <button 
                          onClick={() => updateCartQty(item.product.id, item.qty + 1)}
                          className="p-1 hover:text-agri-green-mid transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right w-20">
                        <span className="font-extrabold text-sm text-gray-950 block">₹ {item.product.price * item.qty}</span>
                        <span className="text-[10px] text-slate-400">₹ {item.product.price}/ea</span>
                      </div>

                      <button 
                        onClick={() => updateCartQty(item.product.id, 0)}
                        className="text-gray-300 hover:text-red-500 p-1 transition-colors"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Free shipping banner */}
                <div className="bg-agri-cream p-4 rounded-xl border border-agri-cream-border text-xs flex justify-between items-center">
                  {getSubtotal() >= 499 ? (
                    <span className="text-agri-green-mid font-bold flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4 shrink-0" />
                      <span>Order qualifies for free secure shipping!</span>
                    </span>
                  ) : (
                    <span className="text-gray-650">
                      Add <strong>₹ {499 - getSubtotal()}</strong> more to unlock <strong>FREE secure shipping</strong>
                    </span>
                  )}
                  <span className="font-semibold text-slate-400">Secure packing guaranteed</span>
                </div>

                <div className="bg-[#f7f6ee] rounded-2xl p-6 md:p-8 mt-4 border border-[#e2e1d7] max-w-sm ml-auto">
                  <h3 className="font-black text-sm text-gray-900 border-b border-[#e2e1d7] pb-3 mb-4 uppercase">Subtotal Summary</h3>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal ({getCartCount()} items)</span>
                      <span className="font-bold text-gray-900">₹ {getSubtotal()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Estimated shipping</span>
                      <span className="font-bold text-gray-900">
                        {getSubtotal() >= 499 ? <span className="text-agri-green-mid">FREE</span> : '₹ 49'}
                      </span>
                    </div>
                    <div className="border-t border-[#e2e1d7] pt-3 flex justify-between font-black text-sm text-gray-950">
                      <span>Total Invoice</span>
                      <span>₹ {getSubtotal() + (getSubtotal() >= 499 ? 0 : 49)}</span>
                    </div>
                  </div>

                  <a 
                    href="#checkout" 
                    className="w-full text-center block bg-agri-dark text-white font-extrabold text-xs py-4.5 rounded-xl shadow-lg hover:bg-black transition-colors uppercase mt-6"
                  >
                    PROCEED TO CHECKOUT
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 10: CHECKOUT */}
        {routePath === '#checkout' && (
          <div className="py-12 px-4 md:px-12 bg-white max-w-5xl mx-auto">
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-lg font-bold mb-2">Cart is empty</h3>
                <a href="#products" className="btn-primary">Go to products</a>
              </div>
            ) : (
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-8">Secure Checkout</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Side forms */}
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const email = formData.get('email') as string || 'farmer@agriic.com';
                      const fullname = formData.get('fullname') as string || 'Alok Patel';
                      const street = formData.get('street') as string || '';
                      const pincode = formData.get('pincode') as string || '';
                      const city = formData.get('city') as string || '';
                      const state = formData.get('state') as string || '';

                      const newOrder: Order = {
                        id: `AGR-${Math.floor(10000 + Math.random() * 90000)}`,
                        date: new Date().toLocaleDateString('en-US', {
                          month: 'short',
                          day: '2-digit',
                          year: 'numeric'
                        }),
                        items: cart.map(item => ({
                          productId: item.product.id,
                          name: item.product.name,
                          price: item.product.price,
                          qty: item.qty,
                          img: item.product.img
                        })),
                        total: getSubtotal() + (getSubtotal() >= 499 ? 0 : 49),
                        status: 'Processing',
                        paymentMethod: paymentMethod,
                        address: `${street}, ${city}, ${state} - ${pincode}`
                      };

                      setOrders([newOrder, ...orders]);
                      showToastMsg('Order placed successfully! Redirecting to tracking center.');
                      clearCart();
                      window.location.hash = '#profile';
                    }}
                    className="lg:col-span-2 space-y-6"
                  >
                    {/* Contact details */}
                    <div className="border border-gray-200 p-6 rounded-2xl space-y-4">
                      <h3 className="font-extrabold text-slate-900 text-sm border-b pb-2 mb-2">Contact Details</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-bold text-gray-500 block mb-1">Email</label>
                          <input name="email" type="email" placeholder="farmer@agriic.com" className="w-full border p-3 text-xs font-semibold rounded-xl" required />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-gray-500 block mb-1">Mobile Phone</label>
                          <input name="phone" type="tel" placeholder="+91" className="w-full border p-3 text-xs font-semibold rounded-xl" required />
                        </div>
                      </div>
                    </div>

                    {/* Delivery Destination */}
                    <div className="border border-gray-200 p-6 rounded-2xl space-y-4">
                      <h3 className="font-extrabold text-slate-900 text-sm border-b pb-2 mb-2">Shipping Destination</h3>
                      <div>
                        <label className="text-[11px] font-bold text-gray-500 block mb-1">Complete Full Name</label>
                        <input name="fullname" type="text" placeholder="Add name" className="w-full border p-3 text-xs font-semibold rounded-xl" required />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-gray-500 block mb-1">Street Address</label>
                        <input name="street" type="text" placeholder="Apartment, block, area details" className="w-full border p-3 text-xs font-semibold rounded-xl" required />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-[11px] font-bold text-gray-500 block mb-1">Pin Code</label>
                          <input name="pincode" type="text" placeholder="400001" className="w-full border p-3 text-xs font-semibold rounded-xl" required />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-gray-500 block mb-1">City</label>
                          <input name="city" type="text" placeholder="Mumbai" className="w-full border p-3 text-xs font-semibold rounded-xl" required />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-gray-500 block mb-1">State</label>
                          <input name="state" type="text" placeholder="Maharashtra" className="w-full border p-3 text-xs font-semibold rounded-xl" required />
                        </div>
                      </div>
                    </div>

                    {/* Billing Method selection */}
                    <div className="border border-gray-200 p-6 rounded-2xl space-y-4">
                      <h3 className="font-extrabold text-slate-900 text-sm border-b pb-2 mb-2">Billing Method</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <button 
                          type="button" 
                          onClick={() => setPaymentMethod('card')}
                          className={`p-4 rounded-xl border text-xs font-bold transition text-center ${paymentMethod === 'card' ? 'border-agri-lime bg-[#f7f6ee]' : 'border-gray-250 bg-white'}`}
                        >
                          Credit / Debit Card
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setPaymentMethod('upi')}
                          className={`p-4 rounded-xl border text-xs font-bold transition text-center ${paymentMethod === 'upi' ? 'border-agri-lime bg-[#f7f6ee]' : 'border-gray-250 bg-white'}`}
                        >
                          UPI / QR Instant
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setPaymentMethod('cod')}
                          className={`p-4 rounded-xl border text-xs font-bold transition text-center ${paymentMethod === 'cod' ? 'border-agri-lime bg-[#f7f6ee]' : 'border-gray-250 bg-white'}`}
                        >
                          Cash on Delivery (COD)
                        </button>
                      </div>

                      {paymentMethod === 'card' && (
                        <div className="space-y-3.5 bg-slate-50 p-4 rounded-xl border border-dashed mt-4">
                          <div>
                            <input type="text" placeholder="Card owner name" className="w-full border bg-white p-3 text-xs font-semibold rounded-xl" required />
                          </div>
                          <div>
                            <input type="text" placeholder="16-digit Card Number" className="w-full border bg-white p-3 text-xs font-semibold rounded-xl" required />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <input type="text" placeholder="MM/YY" className="w-full border bg-white p-3 text-xs font-semibold rounded-xl" required />
                            <input type="password" placeholder="CVV" className="w-full border bg-white p-3 text-xs font-semibold rounded-xl" required />
                          </div>
                        </div>
                      )}

                      {paymentMethod === 'upi' && (
                        <div className="p-4 bg-[#f7f6ee] text-center rounded-xl font-bold text-xs text-agri-dark mt-4 border border-agri-cream-border">
                          🔒 Pay via GooglePay or PhonePe UPI address on the next interactive prompt.
                        </div>
                      )}

                      {paymentMethod === 'cod' && (
                        <div className="p-4 bg-yellow-50 text-center rounded-xl font-bold text-xs text-[#4e2b15] mt-4 border border-yellow-150">
                          📦 Pay securely when the local courier delivers bags to your destination.
                        </div>
                      )}
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-[#1b3322] hover:bg-black text-white py-4 rounded-xl font-extrabold text-sm tracking-wide transition-all shadow-md"
                    >
                      PLACE SECURED ORDER • ₹ {getSubtotal() + (getSubtotal() >= 499 ? 0 : 49)}
                    </button>
                  </form>

                  {/* Right Side summary */}
                  <div>
                    <div className="bg-agri-cream p-6 rounded-2xl border border-agri-cream-border sticky top-24">
                      <h3 className="font-extrabold text-sm text-[#2b3a30] mb-4 uppercase border-b border-agri-cream-border pb-2">Items Summary</h3>
                      <div className="space-y-4 max-h-60 overflow-y-auto pr-2 no-scrollbar mb-4">
                        {cart.map(item => (
                          <div key={item.product.id} className="flex justify-between items-center text-xs">
                            <div className="flex items-center space-x-2">
                              <img src={item.product.img} className="w-8 h-8 object-cover rounded bg-white p-0.5 border" alt="Cart item pr" />
                              <span className="font-semibold text-gray-850 truncate max-w-32">{item.product.name}</span>
                              <span className="text-gray-400 font-bold ml-1">x{item.qty}</span>
                            </div>
                            <span className="font-bold text-slate-900">₹ {item.product.price * item.qty}</span>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-agri-cream-border pt-4 text-xs space-y-2">
                        <div className="flex justify-between text-gray-600">
                          <span>Subtotal</span>
                          <span>₹ {getSubtotal()}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>Estimated shipping</span>
                          <span>{getSubtotal() >= 499 ? 'FREE' : '₹ 49'}</span>
                        </div>
                        <div className="flex justify-between text-gray-600 font-bold text-slate-800 pt-1 border-t">
                          <span>Total to pay</span>
                          <span>₹ {getSubtotal() + (getSubtotal() >= 499 ? 0 : 49)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 11: AUTHENTICATION */}
        {routePath === '#auth' && (
          <div className="py-12 px-4 md:px-12 bg-white max-w-sm mx-auto">
            <div className="bg-agri-cream p-6 rounded-3xl border border-agri-cream-border shadow-md">
              <h1 className="text-xl font-black text-gray-905 mb-2 text-center uppercase tracking-wide">
                {authMode === 'login' ? 'Sign In Back' : 'Create accounts'}
              </h1>
              <p className="text-[11px] text-gray-500 text-center mb-6 leading-normal">
                {authMode === 'login' ? 'Access trace logs, orders histories, and Soil Test™ data.' : 'Join the science-led farming nutrition network today.'}
              </p>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {authMode === 'signup' && (
                  <div>
                    <label className="text-[11px] font-bold text-gray-750 block mb-1">Indian State / Location</label>
                    <input type="text" placeholder="Enter State (e.g. Maharashtra)" className="w-full border bg-white p-3 text-xs font-semibold rounded-xl focus:outline-none" required />
                  </div>
                )}
                <div>
                  <label className="text-[11px] font-bold text-gray-750 block mb-1">Email address</label>
                  <input type="email" placeholder="you@example.com" className="w-full border bg-white p-3 text-xs font-semibold rounded-xl focus:outline-none" required />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-750 block mb-1">Enter your Password</label>
                  <input type="password" placeholder="••••••••" className="w-full border bg-white p-3 text-xs font-semibold rounded-xl focus:outline-none" required />
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-[#1b3322] hover:bg-black text-white font-extrabold text-xs py-3.5 rounded-xl transition-all shadow"
                >
                  {authMode === 'login' ? 'LOGIN USER' : 'CREATE FREE USER'}
                </button>
              </form>

              <div className="mt-6 border-t pt-4 text-center">
                {authMode === 'login' ? (
                  <button 
                    onClick={() => setAuthMode('signup')}
                    className="text-xs text-agri-green-mid hover:underline font-bold"
                  >
                    Don't have an account? Sign up here
                  </button>
                ) : (
                  <button 
                    onClick={() => setAuthMode('login')}
                    className="text-xs text-agri-green-mid hover:underline font-bold"
                  >
                    Already have an account? Log in here
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 11.5: PROFILE & ORDERS TRACKING */}
        {routePath === '#profile' && (
          <div className="py-12 px-4 md:px-8 lg:px-12 bg-white max-w-5xl mx-auto animate-fade-in text-slate-800">
            {/* Header info card */}
            <div className="bg-gradient-to-br from-[#2b3a30] to-[#1b251f] rounded-3xl p-6 md:p-8 text-white shadow-xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
              <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none"></div>
              
              <div className="flex items-center space-x-5 relative z-10">
                <div className="w-16 h-16 rounded-full bg-[#c2dd74] text-[#1b3322] flex items-center justify-center font-black text-2xl border-4 border-white/10 shadow-md">
                  {(currentUser?.name || 'Alok')[0].toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center space-x-2.5">
                    <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">
                      {currentUser?.name || 'Alok Patel'}
                    </h1>
                    {!currentUser && (
                      <span className="bg-amber-500/20 text-amber-300 text-[10px] uppercase font-black px-2 py-0.5 rounded border border-amber-500/30">
                        Demo Sandbox
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/70 mt-1">{currentUser?.email || 'alok.patel@agrimail.in'}</p>
                  <p className="text-[11px] text-[#c2dd74]/90 font-medium mt-1 flex items-center space-x-1.5">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span>Registered Address: Maharashtra • Member since Jan 2026</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 relative z-10">
                {!currentUser ? (
                  <a href="#auth" className="bg-[#c2dd74] text-[#1b3322] text-xs font-black px-4.5 py-3 rounded-xl hover:bg-white transition-all shadow-md uppercase tracking-wider">
                    Sign in to Account
                  </a>
                ) : (
                  <button 
                    onClick={handleLogout}
                    className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-white/10 transition-all"
                  >
                    Exit Profile
                  </button>
                )}
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-[#f7f6ee] border border-[#e2e1d7] p-5 rounded-2xl">
                <span className="text-[10px] text-gray-400 font-extrabold block uppercase tracking-wider">Total Purchases</span>
                <span className="text-2xl font-extrabold text-[#2b3a30] block mt-1">{orders.length}</span>
              </div>
              <div className="bg-[#f7f6ee] border border-[#e2e1d7] p-5 rounded-2xl">
                <span className="text-[10px] text-gray-400 font-extrabold block uppercase tracking-wider">Active Deliveries</span>
                <span className="text-2xl font-extrabold text-amber-600 block mt-1">
                  {orders.filter(o => o.status !== 'Delivered').length}
                </span>
              </div>
              <div className="bg-[#c2dd74]/10 border border-[#c2dd74]/30 p-5 rounded-2xl">
                <span className="text-[10px] text-[#2b3a30] font-extrabold block uppercase tracking-wider">Arrived Safely</span>
                <span className="text-2xl font-extrabold text-[#2b3a30] block mt-1">
                  {orders.filter(o => o.status === 'Delivered').length}
                </span>
              </div>
              <div className="bg-[#f7f6ee] border border-[#e2e1d7] p-5 rounded-2xl">
                <span className="text-[10px] text-gray-400 font-extrabold block uppercase tracking-wider">AgriPoints Balance</span>
                <span className="text-2xl font-extrabold text-[#2b3a30] block mt-1">
                  {orders.reduce((acc, curr) => acc + Math.floor(curr.total / 10), 0) + 180} pts
                </span>
              </div>
            </div>

            {/* Orders Section Head */}
            <div className="border-b pb-4 mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center space-x-2">
                  <Package className="w-5 h-5 text-[#2b3a30] shrink-0" />
                  <span>My Active & Historical Orders</span>
                </h2>
                <p className="text-xs text-gray-400 mt-1">Real-time dynamic transit checkpoints for formulation dispatch logs.</p>
              </div>
              <span className="text-[10px] font-bold text-[#c2dd74] bg-[#2b3a30] px-3 py-1.5 rounded-full uppercase tracking-wider">
                Live Feed
              </span>
            </div>

            {/* Orders Stack */}
            {orders.length === 0 ? (
              <div className="text-center py-16 border rounded-3xl bg-slate-50 border-dashed">
                <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-base font-bold text-slate-800">No orders placed yet</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">Build your soil health list, add recipes to cart, and checkout to view active statuses here.</p>
                <a href="#products" className="btn-primary inline-block mt-4 text-xs font-black uppercase">Browse Shop</a>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => {
                  return (
                    <div key={order.id} className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition duration-200">
                      
                      {/* Top Order Row */}
                      <div className="bg-slate-50/80 px-5 py-4 border-b border-gray-150 flex flex-wrap justify-between items-center gap-3">
                        <div className="flex items-center space-x-3.5">
                          <div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">ID</span>
                            <span className="font-extrabold text-sm text-slate-800">{order.id}</span>
                          </div>
                          <div className="h-6 w-px bg-slate-200"></div>
                          <div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Ordered On</span>
                            <span className="text-xs font-bold text-slate-700">{order.date}</span>
                          </div>
                          <div className="h-6 w-px bg-slate-200"></div>
                          <div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Invoice Amount</span>
                            <span className="text-xs font-extrabold text-slate-800">₹ {order.total}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button 
                            title="Simulate step transitions"
                            onClick={() => {
                              const nextStatusMap: Record<string, 'Processing' | 'In-Transit' | 'Delivered'> = {
                                'Processing': 'In-Transit',
                                'In-Transit': 'Delivered',
                                'Delivered': 'Processing'
                              };
                              const nextStatus = nextStatusMap[order.status];
                              setOrders(orders.map(o => o.id === order.id ? { ...o, status: nextStatus } : o));
                              showToastMsg(`Demo order status upgraded to: ${nextStatus}`);
                            }}
                            className="text-[10px] bg-white hover:bg-slate-100 text-slate-800 font-bold px-2.5 py-1.5 rounded-lg border border-gray-200 transition shrink-0 flex items-center space-x-1 shadow-sm"
                          >
                            <span>🔄 Upgrade Status</span>
                          </button>
                        </div>
                      </div>

                      <div className="p-5 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Status tracker steps */}
                        <div className="lg:col-span-7 border-b lg:border-b-0 lg:border-r border-gray-150 pb-6 lg:pb-0 lg:pr-8 flex flex-col justify-center">
                          <span className="text-[10px] font-bold text-gray-400 block mb-5 uppercase tracking-wider">Live Delivery Milestones</span>
                          
                          {/* Steps tracker UI */}
                          <div className="relative flex items-center justify-between w-full px-4">
                            
                            {/* Connector bar background */}
                            <div className="absolute top-4.5 left-8 right-8 h-1 bg-gray-200 -z-10 rounded-full" />
                            
                            {/* Connector bar active fill */}
                            <div 
                              className="absolute top-4.5 left-8 h-1 bg-[#2b3a30] -z-10 rounded-full transition-all duration-500" 
                              style={{ 
                                width: order.status === 'Processing' ? '0%' : order.status === 'In-Transit' ? '50%' : '100%' 
                              }}
                            />

                            {/* Milestone 1 : Processing */}
                            <div className="flex flex-col items-center">
                              <div 
                                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                                  order.status === 'Processing'
                                    ? 'bg-amber-50 border-amber-600 text-amber-700 font-bold ring-4 ring-amber-100 scale-105 shadow-md'
                                    : 'bg-[#2b3a30] border-[#2b3a30] text-[#c2dd74]'
                                }`}
                              >
                                <Clock className="w-4 h-4" />
                              </div>
                              <span className="text-[11px] font-bold mt-2 text-center text-slate-800">Processing</span>
                              <span className="text-[9px] text-gray-400 mt-0.5">Scanned</span>
                            </div>

                            {/* Milestone 2 : In-Transit */}
                            <div className="flex flex-col items-center">
                              <div 
                                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                                  order.status === 'In-Transit'
                                    ? 'bg-amber-50 border-amber-600 text-amber-700 ring-4 ring-amber-100 scale-105 shadow-md'
                                    : order.status === 'Delivered'
                                      ? 'bg-[#2b3a30] border-[#2b3a30] text-[#c2dd74]'
                                      : 'bg-white border-gray-200 text-gray-350'
                                }`}
                              >
                                <Truck className="w-4.5 h-4.5" />
                              </div>
                              <span className={`text-[11px] font-bold mt-2 text-center ${
                                order.status === 'Processing' ? 'text-gray-400' : 'text-slate-800'
                              }`}>In Transit</span>
                              <span className="text-[9px] text-gray-400 mt-0.5">Underway</span>
                            </div>

                            {/* Milestone 3 : Delivered */}
                            <div className="flex flex-col items-center">
                              <div 
                                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                                  order.status === 'Delivered'
                                    ? 'bg-emerald-50 border-emerald-600 text-emerald-800 font-bold ring-4 ring-emerald-100 scale-105 shadow-md'
                                    : 'bg-white border-gray-200 text-gray-350'
                                }`}
                              >
                                <CheckCircle className="w-4.5 h-4.5" />
                              </div>
                              <span className={`text-[11px] font-bold mt-2 text-center ${
                                order.status !== 'Delivered' ? 'text-gray-400' : 'text-slate-800'
                              }`}>Delivered</span>
                              <span className="text-[9px] text-gray-400 mt-0.5">Arrived</span>
                            </div>

                          </div>

                          {/* Extra status report banner */}
                          <div className="mt-8 bg-[#f7f6ee]/80 p-4 rounded-xl border border-gray-150 flex items-start space-x-3 text-xs">
                            <span className="text-base shrink-0 mt-0.5">
                              {order.status === 'Processing' ? '⚙️' : order.status === 'In-Transit' ? '🚚' : '📦'}
                            </span>
                            <div>
                              <p className="font-extrabold text-[#1b3322]">
                                {order.status === 'Processing' && 'Formulation and raw-ingredient testing checks are active. Bagged and sealed.'}
                                {order.status === 'In-Transit' && 'En-route past central transport corridors. Expected delivery in 32 Hours.'}
                                {order.status === 'Delivered' && 'Checkpoints clear. Delivery verified successfully.'}
                              </p>
                              <p className="text-[11px] text-gray-400 mt-1 leading-normal">
                                Ship destination: <strong className="text-gray-700 font-normal">{order.address}</strong>
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Order item lists */}
                        <div className="lg:col-span-5 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 block mb-3.5 uppercase tracking-wider">Itemized Breakdown</span>
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-slate-50 border border-gray-150 rounded-xl p-2.5">
                                  <div className="flex items-center space-x-2.5 min-w-0">
                                    <img src={item.img} className="w-8.5 h-8.5 object-cover rounded bg-white p-0.5 border shrink-0" alt="Order product" />
                                    <div className="min-w-0">
                                      <span className="text-xs font-bold text-slate-800 block truncate leading-tight">{item.name}</span>
                                      <span className="text-[9px] font-semibold text-gray-400 mt-0.5 block">₹ {item.price} • qty {item.qty}</span>
                                    </div>
                                  </div>
                                  <span className="text-xs font-bold text-slate-800 shrink-0">₹ {item.price * item.qty}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="mt-5 pt-3.5 border-t border-gray-150/80 flex justify-between items-center">
                            <div className="flex items-center space-x-1.5 text-xs text-gray-400">
                              <CreditCard className="w-4 h-4 text-slate-400" />
                              <span className="capitalize font-bold text-slate-500">Method: {order.paymentMethod.toUpperCase()}</span>
                            </div>
                            <span className="text-[10px] text-gray-400 italic">Signature scan on record</span>
                          </div>
                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>
            )}

            {/* Quick reference block */}
            <div className="mt-12 bg-[#2b3a30] text-white p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-black text-[#c2dd74] uppercase tracking-wide">Need Delivery Interventions?</h4>
                <p className="text-xs text-white/70 leading-normal">Our organic dispatches are temperature-controlled. Contact regional helpline for reroutes.</p>
              </div>
              <a href="#contact" className="bg-[#c2dd74] text-[#1b3322] hover:bg-white text-xs font-black uppercase px-4 py-2.5 rounded-xl transition-all whitespace-nowrap shadow-sm text-center">
                Contact Desk
              </a>
            </div>

          </div>
        )}

        {/* VIEW 12: PRIVACY POLICY */}
        {routePath === '#privacy' && (
          <div className="py-12 px-4 md:px-12 bg-white max-w-4xl mx-auto text-gray-700 leading-relaxed text-sm">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Privacy Policy</h1>
            <p className="mb-4">Last Updated: June 17, 2026</p>
            <p className="mb-4">
              At Agriic Solutions Pvt. Ltd., we understand that information regarding crop coordinates, chemical soil composition ranges, and direct address identifiers are extremely private. We secure all diagnostic findings to guarantee soil baseline security.
            </p>
            <h3 className="font-bold text-gray-900 mt-6 mb-2">1. Collected Metrics</h3>
            <p className="mb-4">
              We collect information provided explicitly by you—including crop variants, symptoms entered into the quiz module, address parameters, contact emails, and card transaction tokens processed securely via our bank gateways.
            </p>
          </div>
        )}

        {/* VIEW 13: TERMS */}
        {routePath === '#terms' && (
          <div className="py-12 px-4 md:px-12 bg-white max-w-4xl mx-auto text-gray-700 leading-relaxed text-sm">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Terms of Service</h1>
            <p className="mb-4">Last Updated: June 17, 2026</p>
            <p className="mb-4">
              By accessing the Agriic website and taking the Soil Test™ diagnostic, you agree to be bound by standard state rules and the following guidelines.
            </p>
            <h3 className="font-bold text-gray-900 mt-6 mb-2">1. Formulation Intent & Claims</h3>
            <p className="mb-4">
              Our organic mixtures are created using carefully researched plant compounds. Outcomes depend significantly on moisture levels, regional seasonal changes, local insect pressures, and potting structure. If soil shows zero recovery, use the contact advisor panel to apply our Money-Back guidelines.
            </p>
          </div>
        )}

      </main>

      {/* Persistent Footer */}
      <footer className="bg-agri-dark text-white pt-10 pb-6 px-6 md:px-12 border-t border-[#bad15a]/10 relative z-30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8">
          
          {/* Logo column */}
          <div className="space-y-3">
            <a href="#home" className="flex items-center space-x-2">
              <Leaf className="w-6 h-6 text-agri-lime fill-agri-lime" />
              <span className="text-lg font-bold text-white tracking-widest font-display">Agriic<span className="text-agri-lime">.</span></span>
            </a>
            <p className="text-[11px] text-white/70 leading-relaxed max-w-xs font-normal">
              Science-led, Ayurveda-inspired organic nutrition blends customized for Indian soils. Securing sustainable crop harvests since 2019.
            </p>
            <div className="flex space-x-3 text-white/55 text-[10px] font-semibold pt-1">
              <span>Mumbai</span>•<span>GUJARAT</span>•<span>VAPI</span>
            </div>
          </div>

          {/* Nav quick links */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-black tracking-widest text-[#bad15a] uppercase">Explore</h4>
            <div className="grid grid-cols-2 gap-1.5 text-[11px] text-white/80">
              <a href="#home" className="hover:text-agri-lime transition">Home page</a>
              <a href="#products" className="hover:text-agri-lime transition">Product catalog</a>
              <a href="#science" className="hover:text-agri-lime transition">Scientific research</a>
              <a href="#soil-test" className="hover:text-agri-lime transition">Soil Test™ Quiz</a>
              <a href="#blog" className="hover:text-agri-lime transition">Growing Blog</a>
              <a href="#about" className="hover:text-agri-lime transition">Our journey</a>
            </div>
          </div>

          {/* Botanical support links */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-black tracking-widest text-[#bad15a] uppercase">Support</h4>
            <div className="space-y-1.5 text-[11px] text-white/80">
              <a href="#contact" className="block hover:text-agri-lime transition">Direct Support request</a>
              <a href="https://wa.me/918047863601" target="_blank" rel="noopener" className="block hover:text-agri-lime transition">Chat on WhatsApp</a>
              <a href="#privacy" className="block hover:text-agri-lime transition">Privacy Policy</a>
              <a href="#terms" className="block hover:text-agri-lime transition">Terms of Service</a>
            </div>
          </div>
        </div>

        {/* Bottom credits */}
        <div className="max-w-7xl mx-auto pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-[10px] md:text-[11px] text-white/55 space-y-3 md:space-y-0">
          <p>© {new Date().getFullYear()} Agriic Solutions Private Limited. All mineral data secured.</p>
          <p className="text-white/70">
            Made by <a href="https://vexoritsolutions.site" target="_blank" rel="noopener noreferrer" className="text-agri-lime font-bold hover:underline tracking-wide hover:text-white transition-colors">VEXOR IT SOLUTIONS</a>
          </p>
          <p className="text-white/45">Unit 101, B Wing, Off Link Road, Malad West, Mumbai, MH - 400064</p>
        </div>
      </footer>
    </div>
  );
}

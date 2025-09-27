import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import PublicResolved from './pages/PublicResolved';
import AdminDashboard from './pages/AdminDashboard';
import './i18n';
import { useTranslation } from 'react-i18next';
import { getStoredUser, logout } from './lib/api';
import { useEffect, useState } from 'react';
import SubmitPage from './pages/Submit';
import { setLanguage } from './i18n';
import RegisterPage from './pages/Register';
import UniversityFooter from './components/universityFooter';
import { 
  Home, 
  Send, 
  Eye, 
  Settings, 
  UserPlus, 
  LogOut, 
  Menu, 
  X, 
  Globe,
  ChevronDown 
} from 'lucide-react';
import CollegeDataForm from './pages/collegeForm';

const queryClient = new QueryClient();

function Header() {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState(getStoredUser());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onStorage = () => setUser(getStoredUser());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  async function onLogout() {
    await logout();
    setUser(null);
    navigate('/');
    setIsMobileMenuOpen(false);
  }

  const navigationItems = [
    { path: '/', label: t('nav.home'), icon: Home },
    { path: '/submit', label: 'Submit a Feedback', icon: Send },
    { path: '/public', label: t('nav.public'), icon: Eye },
    { path: '/admin', label: t('nav.admin'), icon: Settings },
    { path: '/register', label: 'Register', icon: UserPlus },
    {path:'/college-form', label: 'College Form', icon: Settings}
  ];

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 transform hover:scale-105 transition-transform duration-200">
      <img src="/TUImage.png" alt="University Logo" className="h-10 w-auto sm:h-12 md:h-14" />

            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link key={item.path} to={item.path}>
                    <Button 
                      variant={isActivePath(item.path) ? "default" : "ghost"}
                      className={`
                        relative flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all duration-200
                        ${isActivePath(item.path) 
                          ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700' 
                          : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                        }
                      `}
                    >
                      <IconComponent className="w-4 h-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Controls */}
            <div className="hidden lg:flex items-center space-x-3">
              {/* Language Selector */}
              <Select
                defaultValue={i18n.language}
                onValueChange={(v) => setLanguage(v)}
              >
                <SelectTrigger className="w-[130px] border-gray-200 hover:border-indigo-300 focus:border-indigo-500">
                  <Globe className="w-4 h-4 mr-2 text-gray-500" />
                  <SelectValue placeholder={t('nav.language')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">🇺🇸 English</SelectItem>
                  <SelectItem value="ne">🇳🇵 नेपाली</SelectItem>
                </SelectContent>
              </Select>




              {/* Logout Button */}
              {user && (
                <Button 
                  variant="outline" 
                  onClick={onLogout}
                  className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                >
                  <LogOut className="w-4 h-4" />
                  {t('nav.logout')}
                </Button>
              )}
            </div>

            {/* Mobile Menu Button - Enhanced */}
            <div className="lg:hidden flex items-center space-x-2">
              {/* Mobile Language Selector */}
              <Select
                defaultValue={i18n.language}
                onValueChange={(v) => setLanguage(v)}
              >
                <SelectTrigger className="w-[60px] border-gray-200 p-2 hover:border-indigo-300 transition-colors duration-200">
                  <Globe className="w-4 h-4 text-gray-500" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">🇺🇸 EN</SelectItem>
                  <SelectItem value="ne">🇳🇵 NE</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`
                  p-2 rounded-lg transition-all duration-300 transform z-60 relative
                  ${isMobileMenuOpen 
                    ? 'bg-indigo-100 text-indigo-600 rotate-180 scale-110' 
                    : 'hover:bg-gray-100 hover:scale-105'
                  }
                `}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Navigation Menu */}
      <div className={`
        lg:hidden fixed inset-0 z-40 bg-white transform transition-all duration-300 ease-out
        ${isMobileMenuOpen 
          ? 'opacity-100 translate-x-0 visible' 
          : 'opacity-0 translate-x-full invisible'
        }
      `}>
        {/* Background with subtle gradient */}
        <div className="absolute inset-0 bg-white"></div>
        
        {/* Content */}
        <div className="relative h-full flex flex-col">
          {/* Header space to account for fixed header */}
          <div className="h-16 flex-shrink-0"></div>
          
          {/* Navigation Content */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="max-w-sm mx-auto space-y-2">
              {navigationItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <Link key={item.path} to={item.path}>
                    <div 
                      className={`
                        transform transition-all duration-300 ease-out
                        ${isMobileMenuOpen 
                          ? 'translate-x-0 opacity-100' 
                          : 'translate-x-8 opacity-0'
                        }
                      `}
                      style={{ 
                        transitionDelay: isMobileMenuOpen ? `${index * 80}ms` : '0ms' 
                      }}
                    >
                      <div className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-sans
                        ${isActivePath(item.path)
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }
                      `}>
                        <div className={`
                          w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200
                          ${isActivePath(item.path)
                            ? 'bg-white/20'
                            : 'bg-gray-100 text-gray-600'
                          }
                        `}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <span className="text-base font-medium">{item.label}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}

              {/* Mobile Logout Button */}
              {user && (
                <div 
                  className={`
                    transform transition-all duration-300 ease-out border-t border-gray-200/60 pt-4 mt-6
                    ${isMobileMenuOpen 
                      ? 'translate-x-0 opacity-100' 
                      : 'translate-x-8 opacity-0'
                    }
                  `}
                  style={{ 
                    transitionDelay: isMobileMenuOpen ? `${(navigationItems.length) * 80}ms` : '0ms' 
                  }}
                >
                  <div 
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-sans text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center transition-all duration-200">
                      <LogOut className="w-5 h-5" />
                    </div>
                    <span className="text-base font-medium">{t('nav.logout')}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom decoration */}
          <div className="flex-shrink-0 flex justify-center pb-6">
            <div 
              className={`
                w-12 h-0.5 bg-gray-300 rounded-full transform transition-all duration-500
                ${isMobileMenuOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
              `}
              style={{ 
                transitionDelay: isMobileMenuOpen ? `${(navigationItems.length + 1) * 80}ms` : '0ms' 
              }}
            />
          </div>
        </div>

        {/* Simple decorative elements */}
        <div className="absolute top-24 left-8 w-1.5 h-1.5 bg-gray-300 rounded-full opacity-40"></div>
        <div className="absolute top-40 right-12 w-1 h-1 bg-gray-400 rounded-full opacity-30"></div>
        <div className="absolute bottom-40 left-16 w-1.5 h-1.5 bg-gray-300 rounded-full opacity-40"></div>
      </div>

      {/* Backdrop overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30 transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/submit" element={<SubmitPage />} />
              <Route path="/public" element={<PublicResolved />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
                            <Route path="/college-form" element={<CollegeDataForm />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <UniversityFooter />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
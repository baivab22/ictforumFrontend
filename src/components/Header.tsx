import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe, Menu, X, Facebook, Twitter, Linkedin, Youtube, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Header = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'np' : 'en';
    i18n.changeLanguage(newLang);
  };

  const navItems = [
    { key: 'home', path: '/' },
    { key: 'news', path: '/news' },
    { key: 'about', path: '/about' },
    { key: 'contact', path: '/contact' },
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/profile.php?id=61580003008206&sk=friends', color: 'text-blue-600' },
    // { icon: Twitter, href: '#', color: 'text-sky-500' },
    // { icon: Linkedin, href: '#', color: 'text-blue-700' },
    { icon: Youtube, href: 'https://www.youtube.com/@Krish_ICT', color: 'text-red-600' },
    // { icon: Instagram, href: '#', color: 'text-pink-600' },
  ];

  return (
    <header className="bg-white shadow-lg border-b-4 border-gradient-to-r from-blue-600 via-green-500 to-teal-500">
      {/* Top bar with social links */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-teal-800 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="text-sm">{t('contact.followUs')}:</span>
            <div className="flex space-x-2">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="hover:text-green-300 transition-colors duration-200"
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="text-white hover:text-green-300 hover:bg-blue-800"
            >
              <Globe size={16} className="mr-1" />
              {i18n.language === 'en' ? '🇳🇵 नेपाली' : '🇬🇧 English'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img
              src="/assets/images/WhatsApp Image 2025-09-26 at 8.50.23 PM (1).jpeg"
              alt="ICT Forum Nepal"
              className="h-12 w-12 rounded-full object-cover border-2 border-green-500"
            />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                ICT Forum Nepal
              </h1>
              <p className="text-xs text-gray-600">Digital Transformation</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.key}
                to={item.path}
                className={`text-lg font-medium transition-all duration-200 hover:text-green-600 relative group ${
                  location.pathname === item.path
                    ? 'text-blue-600'
                    : 'text-gray-700'
                }`}
              >
                {t(`nav.${item.key}`)}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-green-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
            <Link
              to="/admin"
              className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {t('nav.admin')}
            </Link>
          </nav>

          {/* Mobile menu button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.key}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`text-lg font-medium p-3 rounded-lg transition-all duration-200 ${
                      location.pathname === item.path
                        ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {t(`nav.${item.key}`)}
                  </Link>
                ))}
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-3 rounded-lg text-center font-medium"
                >
                  {t('nav.admin')}
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
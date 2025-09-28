import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Youtube, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();

  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/profile.php?id=61580003008206&sk=friends', color: 'hover:text-blue-600', label: 'Facebook' },
    { icon: Twitter, href: '#', color: 'hover:text-sky-500', label: 'Twitter' },
    { icon: Linkedin, href: '#', color: 'hover:text-blue-700', label: 'LinkedIn' },
    { icon: Youtube, href: '#', color: 'hover:text-red-600', label: 'YouTube' },
    { icon: Instagram, href: '#', color: 'hover:text-pink-600', label: 'Instagram' },
  ];

  const quickLinks = [
    { key: 'home', path: '/' },
    { key: 'news', path: '/news' },
    { key: 'about', path: '/about' },
    { key: 'contact', path: '/contact' },
  ];

  const categories = [
    'technology',
    'digitalTransformation',
    'socialJustice',
    'events',
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-teal-900 text-white">
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <img
                src="/assets/images/WhatsApp Image 2025-09-26 at 8.50.23 PM (1).jpeg"
                alt="ICT Forum Nepal"
                className="h-12 w-12 rounded-full object-cover border-2 border-green-400"
              />
              <div>
                <h3 className="text-xl font-bold text-white">ICT Forum Nepal</h3>
                <p className="text-sm text-green-300">Est. 2024</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              {t('hero.description')}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={`text-gray-400 ${social.color} transition-colors duration-200 p-2 rounded-full bg-gray-800 hover:bg-gray-700`}
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-green-300">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center"
                  >
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    {t(`nav.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-green-300">Categories</h4>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category}>
                  <Link
                    to={`/news?category=${category}`}
                    className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center"
                  >
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    {t(`categories.${category}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          {/* <div>
            <h4 className="text-lg font-semibold mb-6 text-green-300">{t('contact.getInTouch')}</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="text-green-400 mt-1 flex-shrink-0" size={18} />
                <div>
                  <p className="text-gray-300">Kathmandu, Nepal</p>
                  <p className="text-sm text-gray-400">Digital Innovation Hub</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="text-green-400 flex-shrink-0" size={18} />
                <a href="mailto:info@ictforumnepal.org" className="text-gray-300 hover:text-white transition-colors">
                  info@ictforumnepal.org
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="text-green-400 flex-shrink-0" size={18} />
                <a href="tel:+977-1-4444444" className="text-gray-300 hover:text-white transition-colors">
                  +977-1-4444444
                </a>
              </div>
            </div>
          </div> */}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700 bg-gray-900">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 ICT Forum Nepal. All rights reserved. | ICT for Social Justice and Digital Transformation
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
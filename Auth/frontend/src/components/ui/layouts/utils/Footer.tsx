import { useNavigate } from 'react-router-dom'; 
import { useTranslation } from '@/i18n';
import logo from '@/assets/images/logo.png';
import { 
  Mail, 
  Phone, 
  MapPin,
  Twitter,
  Linkedin,
  Github,
  Sparkles
} from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Navigation handler
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // Get current language for RTL support
  const currentLanguage = localStorage.getItem('language') || 'en';
  const isRTL = currentLanguage === 'ar';

  // Translated features
  const features:any[]=[];

  // Translated company links
  const companyLinks = [
    { label: t('footer.company.about'), href: '/about' },
    { label: t('footer.company.careers'), href: '/careers' },
    { label: t('footer.company.press'), href: '/press' },
    { label: t('footer.company.blog'), href: '/blog' },
  ];

  // Translated support links
  const supportLinks = [
    { label: t('footer.support.help'), href: '/help' },
    { label: t('footer.support.contact'), href: '/contact' },
    { label: t('footer.support.privacy'), href: '/privacy-policy' },
    { label: t('footer.support.terms'), href: '/terms' },
  ];

  // Social links (no translation needed)
  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Github, href: '#', label: 'GitHub' },
  ];

  return (
    <footer 
      className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 border-t border-border"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-r from-orange-200 to-blue-200 dark:from-orange-900/20 dark:to-blue-900/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full blur-3xl opacity-50" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(100,116,139,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(100,116,139,0.05)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-1 space-y-6">
            <div 
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => handleNavigation('/')}
            >
              <div className="w-10 h-10 bg-linear-to-br from-orange-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <img src={logo} alt="OptraVerse Logo" className="w-10 h-10 object-contain" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
                 BOUR<span className="font-light">SETNA</span>
              </span>
            </div>
         

            {/* Newsletter Subscription */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                {t('footer.newsletter.title')}
              </h4>
          
            </div>
          </div>
          {/* Features Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-orange-500" />
              <span>{t('footer.features.title')}</span>
            </h3>
            <ul className="space-y-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <li key={index}>
                    <button
                      onClick={() => handleNavigation(feature.href)}
                      className="flex items-center space-x-3 text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-200 group w-full text-left"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium">{feature.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('footer.company.title')}
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleNavigation(link.href)}
                    className="text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-200 font-medium hover:translate-x-1 transform transition-transform inline-block"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Contact */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('footer.support.title')}
            </h3>
            <ul className="space-y-3">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleNavigation(link.href)}
                    className="text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-200 font-medium hover:translate-x-1 transform transition-transform inline-block"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>

            {/* Contact Info */}
            <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
                <Mail className="w-4 h-4 text-orange-500" />
                <span>boursetna@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
                <Phone className="w-4 h-4 text-orange-500" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
                <MapPin className="w-4 h-4 text-orange-500" />
                <span>{t('footer.contact.location')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            {/* Copyright */}
            <div className="text-gray-500 dark:text-gray-400 text-sm">
              © {new Date().getFullYear()} OptraVerse. {t('footer.copyright')}
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 hover:border-orange-300 dark:hover:border-orange-600 hover:shadow-lg transition-all duration-200 transform hover:scale-110"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>

            {/* Additional Links */}
            <div className="flex space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <button
                onClick={() => handleNavigation('/privacy-policy')}
                className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
              >
                {t('footer.links.privacy')}
              </button>
              <button
                onClick={() => handleNavigation('/terms')}
                className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
              >
                {t('footer.links.terms')}
              </button>
              <button
                onClick={() => handleNavigation('/cookies')}
                className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
              >
                {t('footer.links.cookies')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
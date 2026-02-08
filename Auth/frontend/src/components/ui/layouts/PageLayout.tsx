import { useTheme } from "next-themes";
import { Moon, Sun, Languages, ChevronDown } from "lucide-react";
import { LanguageContext } from '@/i18n';
import { useContext, useState, useEffect } from 'react';

interface PageLayoutProps {
  children: any;
  showLanguageSelector?: boolean;
  showThemeToggle?: boolean;
}

export default function PageLayout({ 
  children, 
  showLanguageSelector = true, 
  showThemeToggle = true 
}: PageLayoutProps) {
  const { language: currentLanguage, setLanguage } = useContext(LanguageContext);
  const { theme, setTheme } = useTheme();
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [mounted, setMounted] = useState(false);

  const changeLanguage = (lng: string) => {
    setLanguage(lng);
    setShowLanguageDropdown(false);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const languages = [
    { value: 'fr', label: 'Français', flag: '🇫🇷' },
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'ar', label: 'العربية', flag: '🇸🇦' }
  ];

  const currentLanguageInfo = languages.find(lang => lang.value === currentLanguage) || languages[0];

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col relative overflow-hidden transition-colors duration-300">
      {(showLanguageSelector || showThemeToggle) && (
        <div className="fixed flex top-2 right-5 items-center gap-2 z-20">
          {showLanguageSelector && (
            <div className="relative">
              <button
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className="flex items-center gap-1 px-2 py-1 bg-background/80 backdrop-blur-lg border border-border/50 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-sm"
              >
                <Languages className="w-3 h-3 text-primary" />
                <span className="font-medium text-foreground">
                  {currentLanguageInfo.value.toUpperCase()}
                </span>
                <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform duration-200 ${showLanguageDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showLanguageDropdown && (
                <div className="absolute top-full mt-1 right-0 bg-background/95 backdrop-blur-lg border border-border/50 rounded-md shadow-xl py-1 z-50 min-w-[50px]">
                  {languages.map((language) => (
                    <button
                      key={language.value}
                      onClick={() => changeLanguage(language.value)}
                      className={`flex items-center justify-center w-full px-2 py-1 transition-colors duration-150 text-sm ${currentLanguage === language.value
                        ? 'bg-primary/20 text-primary font-medium'
                        : 'text-foreground hover:bg-accent/50'
                        }`}
                    >
                      {language.value.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {showThemeToggle && (
            <Button
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-8 h-8 bg-white/90 backdrop-blur-lg border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 dark:bg-background/80 dark:border-border/50"
            >
              {theme === "dark" ? <Sun size={16} className="text-amber-500" /> : <Moon size={16} className="text-slate-600" />}
            </Button>
          )}
        </div>
      )}

      <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
        {children}
      </div>
    </div>
  );
}

function Button({ 
  size = "default", 
  onClick, 
  className = "", 
  children 
}: { 
  size?: "default" | "icon";
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors 
        focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring 
        disabled:pointer-events-none disabled:opacity-50
        ${size === "icon" ? "h-8 w-8" : "h-9 px-4 py-2"}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
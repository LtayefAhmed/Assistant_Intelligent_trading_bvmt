import { useEffect, useState, useRef, useContext } from "react";
import logo from "@/assets/images/logo.png"
import { useTheme } from "next-themes";
import { LanguageContext, useTranslation } from '@/i18n';

interface SplashScreenProps {
  onFinish?: () => void;
}

export default function SplashScreen({ onFinish = () => {} }: SplashScreenProps) {
  const [progress, setProgress] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const progressRef = useRef<number>(0);
  const { theme, resolvedTheme } = useTheme();
  const { t } = useTranslation();
  const { language: currentLanguage } = useContext(LanguageContext);
  
  const currentTheme = resolvedTheme || theme;
  const isRTL = currentLanguage === 'ar';

  useEffect(() => {
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    const durationMs = 1800;
    const startTime = performance.now();
    let rafId: number | null = null;

    const animate = (currentTime: DOMHighResTimeStamp) => {
      const elapsed = currentTime - startTime;
      const rawProgress = Math.min(1, elapsed / durationMs);

      // Smooth ease-out progression
      const easedProgress = 1 - Math.pow(1 - rawProgress, 2);
      
      const currentProgress = Math.floor(easedProgress * 100);

      if (currentProgress !== progressRef.current) {
        progressRef.current = currentProgress;
        setProgress(currentProgress);
      }

      if (rawProgress < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        setProgress(100);
        setIsComplete(true);

        // Add a small delay for completion animation
        setTimeout(() => {
          setIsVisible(false);
          setTimeout(() => {
            document.documentElement.style.overflow = prevOverflow || "";
            onFinish();
          }, 300);
        }, 500);
      }
    };

    setTimeout(() => {
      rafId = requestAnimationFrame(animate);
    }, 100);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      document.documentElement.style.overflow = prevOverflow || "";
    };
  }, [onFinish]);

  if (!isVisible) return null;

  const isDark = currentTheme === 'dark';
  
  // Get status message based on progress
  const getStatusMessage = () => {
    if (progress < 30) return t('splash.status.initializing');
    if (progress >= 30 && progress < 70) return t('splash.status.loading');
    if (progress >= 70 && progress < 90) return t('splash.status.almostReady');
    return t('splash.status.finalizing');
  };

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={t('splash.ariaLabel')}
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-700 ${
        isComplete 
          ? 'opacity-0 scale-110 pointer-events-none' 
          : 'opacity-100 scale-100'
      } ${
        isDark 
          ? 'bg-gradient-to-br from-gray-900 via-blue-900/20 to-orange-900/10' 
          : 'bg-gradient-to-br from-blue-50 via-orange-50/50 to-white'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-1/2 -left-1/2 w-full h-full ${
          isDark 
            ? 'bg-gradient-to-r from-orange-500/5 via-blue-500/10 to-transparent' 
            : 'bg-gradient-to-r from-orange-200/20 via-blue-200/30 to-transparent'
        } animate-pulse`} />
        
        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full ${
              isDark 
                ? 'bg-gradient-to-r from-orange-400/10 to-blue-400/10' 
                : 'bg-gradient-to-r from-orange-200/40 to-blue-200/40'
            }`}
            style={{
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 6 + 4}s infinite ${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative w-full max-w-md px-8 transform transition-all duration-500">
        <div className="flex flex-col items-center space-y-10">
          {/* Logo Container with Glass Morphism */}
          <div className={`relative transform transition-all duration-1000 ${
            progress > 30 ? 'scale-105 rotate-1' : 'scale-100 rotate-0'
          }`}>
            {/* Background Glow */}
            <div className={`absolute inset-0 -z-10 rounded-3xl blur-xl ${
              isDark 
                ? 'bg-gradient-to-r from-orange-500/20 to-blue-500/20' 
                : 'bg-gradient-to-r from-orange-300/30 to-blue-300/30'
            } transition-all duration-1000 ${
              progress > 50 ? 'scale-110 opacity-70' : 'scale-100 opacity-50'
            }`} />
            
            {/* Glass Container */}
            <div className={`
              relative rounded-2xl p-6 backdrop-blur-sm border
              ${isDark 
                ? 'bg-gray-900/40 border-gray-700/50 shadow-2xl' 
                : 'bg-white/60 border-white/80 shadow-xl'
              }
              transition-all duration-500
            `}>
              <div className="w-35 h-35 md:w-80 md:h-80 flex items-center justify-center">
                <img 
                  src={logo} 
                  alt={t('splash.logoAlt')}
                  className="w-full h-full object-contain drop-shadow-lg"
                />
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="w-full space-y-6">
            {/* Progress Bar Container */}
            <div className="space-y-3">
              <div
                className={`w-full rounded-2xl overflow-hidden backdrop-blur-sm border ${
                  isDark 
                    ? 'bg-gray-800/40 border-gray-600/50 shadow-inner' 
                    : 'bg-white/50 border-gray-200/80 shadow-sm'
                }`}
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={t('splash.progressLabel')}
              >
                <div
                  className="h-2.5 rounded-full transition-all duration-200 ease-out relative overflow-hidden"
                  style={{
                    width: `${progress}%`,
                    background: "var(--gradient-primary)",
                    boxShadow: isDark 
                      ? '0 2px 8px rgba(249, 115, 22, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.1)'
                      : '0 2px 8px rgba(59, 130, 246, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.6)',
                  }}
                >
                  {/* Shimmer Effect */}
                  <div
                    className="absolute inset-0 bg-linear-to-r from-transparent via-white/50 to-transparent transform -skew-x-12"
                    style={{ 
                      animation: 'shimmer 2s infinite',
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)'
                    }}
                  />
                </div>
              </div>

              {/* Percentage and Text */}
              <div className={`flex justify-between items-center px-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className={`text-sm font-medium transition-colors ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {t('splash.loading')}
                </span>
                <span 
                  className="text-lg font-bold bg-clip-text text-transparent"
                  style={{ background: 'var(--gradient-primary)' }}
                >
                  {progress}%
                </span>
              </div>
            </div>

            {/* Loading Indicator */}
            <div className="flex flex-col items-center space-y-4">
              <div className="flex space-x-2">
                {[0, 1, 2].map((index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-500 ${
                      progress > 25 * (index + 1)
                        ? 'scale-125 opacity-100'
                        : 'scale-100 opacity-40'
                    }`}
                    style={{
                      background: progress > 25 * (index + 1) 
                        ? 'var(--gradient-primary)' 
                        : (isDark ? '#4B5563' : '#9CA3AF'),
                      animation: `pulse 1.5s infinite ${index * 0.3}s`
                    }}
                  />
                ))}
              </div>
              
              {/* Status Message */}
              <p className={`text-sm font-medium transition-colors ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {getStatusMessage()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style >{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        
        @keyframes pulse {
          0%, 100% { 
            opacity: 1; 
            transform: scale(1); 
          }
          50% { 
            opacity: 0.6; 
            transform: scale(0.95); 
          }
        }
        
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          33% { 
            transform: translateY(-10px) rotate(120deg); 
          }
          66% { 
            transform: translateY(5px) rotate(240deg); 
          }
        }
      `}</style>
    </div>
  );
}
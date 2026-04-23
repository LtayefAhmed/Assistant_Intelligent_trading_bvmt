import { useState, useRef, useCallback } from "react";
import {
  Brain,
  TrendingUp,
  Shield,
  PieChart,
  Award,
  CheckCircle,
  ArrowLeft,
  Sparkles,

  Zap,
  Rocket,
  ChevronLeft,
  ChevronRight,
  BarChart,
} from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring, animate } from "framer-motion";
import { useTranslation } from "@/i18n";
import logo from "@/assets/images/logo.png"
const onboardingSteps = [
  {
    id: 1,
    title: "tradingAssistant",
    description: "tradingAssistantDesc",
    icon: Brain,
    emoji: "🤖",
    tags: ["intelligentTrading", "marketAnalysis", "realTimeData"],
    gradient: "from-blue-500 to-indigo-600",
    accentColor: "#3b82f6",
    features: [
      "Recommandations personnalisées",
      "Analyse de sentiment marché",
      "Alertes en temps réel"
    ]
  },
  {
    id: 2,
    title: "pricePrediction",
    description: "pricePredictionDesc",
    icon: TrendingUp,
    emoji: "📈",
    tags: ["aiForecasts", "technicalAnalysis", "marketTrends"],
    gradient: "from-emerald-500 to-teal-600",
    accentColor: "#10b981",
    features: [
      "Prédictions LSTM & Prophet",
      "Intervalles de confiance",
      "Analyse technique avancée"
    ]
  },
  {
    id: 3,
    title: "anomalyDetection",
    description: "anomalyDetectionDesc",
    icon: Shield,
    emoji: "🛡️",
    tags: ["marketSurveillance", "fraudPrevention", "riskManagement"],
    gradient: "from-violet-500 to-purple-600",
    accentColor: "#8b5cf6",
    features: [
      "Détection manipulations",
      "Alertes niveau priorité",
      "Protection investisseurs"
    ]
  },
  {
    id: 4,
    title: "portfolioManager",
    description: "portfolioManagerDesc",
    icon: PieChart,
    emoji: "📊",
    tags: ["assetAllocation", "riskOptimization", "performanceTracking"],
    gradient: "from-amber-500 to-orange-600",
    accentColor: "#f59e0b",
    features: [
      "Optimisation portefeuille",
      "Simulation stratégies",
      "Métriques performance"
    ]
  },
  {
    id: 5,
    title: "regulatoryCompliance",
    description: "regulatoryComplianceDesc",
    icon: Award,
    emoji: "⚖️",
    tags: ["cmfCompliant", "auditTrail", "transparentReporting"],
    gradient: "from-rose-500 to-pink-600",
    accentColor: "#f43f5e",
    features: [
      "Conforme CMF",
      "Journalisation complète",
      "Rapports réglementaires"
    ]
  },
];

interface OnboardingFlowProps {
  onComplete: () => void;
  onSkip: () => void;
}

export default function OnboardingFlow({
  onComplete,
  onSkip,
}: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [showSwipeArrows, setShowSwipeArrows] = useState(true);
  const touchStartRef = useRef<number | null>(null);
  const totalSteps = onboardingSteps.length;
  const { t } = useTranslation();

  const currentStepData = onboardingSteps[currentStep];
  const IconComponent = currentStepData.icon;

  // Motion values for smooth animations
  const x = useMotionValue(0);
  const rotateY = useSpring(0, { stiffness: 300, damping: 30 });
  const scale = useSpring(1, { stiffness: 300, damping: 30 });

  // Enhanced touch gesture handlers with animations
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsSwiping(true);
    touchStartRef.current = e.targetTouches[0].clientX;
    setSwipeProgress(0);

    // Hide swipe arrows after first interaction
    setShowSwipeArrows(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    const touchCurrent = e.targetTouches[0].clientX;
    const deltaX = touchCurrent - touchStartRef.current;

    // Calculate swipe progress for visual feedback
    const progress = Math.min(Math.max(deltaX / 150, -1), 1);
    setSwipeProgress(progress);

    // Update motion values for real-time animations
    x.set(deltaX * 0.5);
    rotateY.set(deltaX * 0.1);
    scale.set(1 - Math.abs(progress) * 0.05);

    // Particle effects based on swipe direction
    if (Math.abs(deltaX) > 30) {
      createSwipeParticles(deltaX > 0);
    }
  };

  const handleTouchEnd = () => {
    if (!touchStartRef.current) return;

    setIsSwiping(false);
    const finalProgress = swipeProgress;

    // Animate back to center
    animate(x, 0, { type: "spring", stiffness: 300, damping: 30 });
    animate(rotateY, 0, { type: "spring", stiffness: 300, damping: 30 });
    animate(scale, 1, { type: "spring", stiffness: 300, damping: 30 });

    // Check if swipe should trigger navigation
    if (Math.abs(finalProgress) > 0.3) {
      if (finalProgress > 0) {
        handlePrevious();
      } else {
        handleNext();
      }
    }

    setSwipeProgress(0);
    touchStartRef.current = null;
  };

  // Create particle effects during swipe
  const createSwipeParticles = (isRightSwipe: boolean) => {
    const container = document.getElementById('swipe-container');
    if (!container) return;

    const particleCount = 3;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = `absolute w-2 h-2 rounded-full ${isRightSwipe ? 'bg-blue-400' : 'bg-orange-400'
        } opacity-70`;

      const startX = isRightSwipe ? '20%' : '80%';

      particle.style.left = startX;
      particle.style.top = `${50 + (Math.random() - 0.5) * 40}%`;

      container.appendChild(particle);

      // Animate particle
      particle.animate([
        {
          transform: 'scale(1) translateY(0)',
          opacity: 0.7
        },
        {
          transform: `scale(0.5) translateX(${isRightSwipe ? '100px' : '-100px'}) translateY(${(Math.random() - 0.5) * 50}px)`,
          opacity: 0
        }
      ], {
        duration: 600,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
      });

      // Remove particle after animation
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 600);
    }
  };

  const handleNext = useCallback(() => {
    setDirection(1);
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  }, [currentStep, totalSteps, onComplete]);

  const handlePrevious = useCallback(() => {
    setDirection(-1);
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const handleDotClick = (index: number) => {
    setDirection(index > currentStep ? 1 : -1);
    setCurrentStep(index);
  };



  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-900 dark:to-blue-900/20 transition-colors duration-700 relative overflow-hidden"
      id="swipe-container"
    >
      {/* Animated Background Elements with Finance Theme */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Stock chart lines */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px h-20 bg-gradient-to-b from-blue-400/20 to-transparent"
            style={{
              left: `${(i + 1) * 6.66}%`,
              top: `${30 + Math.sin(i) * 20}%`,
            }}
            animate={{
              height: [20, 80, 20],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: Math.random() * 4 + 2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}

        {/* Floating currency symbols */}
        {['$', '€', '£', '¥', 'د.ت'].map((symbol, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl font-bold text-blue-400/10 dark:text-blue-500/10"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              rotate: [0, 360, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: i * 2,
            }}
          >
            {symbol}
          </motion.div>
        ))}

        {/* Gradient orbs */}
        <motion.div
          className="absolute top-1/4 -left-20 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 bg-gradient-to-r from-blue-400 to-emerald-400"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Header */}
      <header className="flex justify-between items-center w-full max-w-5xl px-4 sm:px-8 py-4 sm:py-6 relative z-10">
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative">
            <motion.div
              className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <img src={logo} alt="" />
            </motion.div>
            <Sparkles className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              BOURSETNA
            </h1>
          </div>
        </motion.div>

        <motion.div
          className="flex items-center gap-3 sm:gap-4 text-sm font-medium"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="px-2 sm:px-3 py-1 rounded-full backdrop-blur-sm border border-white/20 text-foreground text-xs sm:text-sm">
            {currentStep + 1}/{totalSteps}
          </span>
          <button
            onClick={onSkip}
            className="px-3 sm:px-4 py-1 rounded-lg border border-white/20 backdrop-blur-sm hover:bg-white/10 transition-all text-foreground text-xs sm:text-sm"
          >
            {t('onboarding.skip')}
          </button>
        </motion.div>
      </header>

      {/* Main content with enhanced swipe area */}
      <div className="flex-1 flex items-center justify-center w-full px-4 relative z-10">
        <div
          className="w-full max-w-2xl touch-pan-y relative"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Animated swipe arrows */}
          <AnimatePresence>
            {showSwipeArrows && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute -top-12 left-0 right-0 flex justify-between px-8"
              >
                <motion.div
                  animate={{ x: [-5, 5, -5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="flex items-center gap-2 text-blue-600 dark:text-blue-400"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span className="text-sm font-medium">{t('onboarding.swipeBack')}</span>
                </motion.div>

                <motion.div
                  animate={{ x: [5, -5, 5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                  className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400"
                >
                  <span className="text-sm font-medium">{t('onboarding.swipeNext')}</span>
                  <ChevronRight className="w-5 h-5" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Swipe progress indicator */}
          {isSwiping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute -bottom-8 left-0 right-0 flex justify-center"
            >
              <div className="w-32 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
                  style={{ width: `${Math.abs(swipeProgress) * 100}%` }}
                  animate={{
                    backgroundPosition: ['0%', '100%'],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </div>
            </motion.div>
          )}

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              initial="enter"
              animate="center"
              exit="exit"
              style={{
                x,
                rotateY,
                scale,
              }}
            >
              <motion.div
                className="p-6 sm:p-8 rounded-3xl backdrop-blur-xl border border-white/20 shadow-2xl text-center relative overflow-hidden bg-white/80 dark:bg-gray-800/80"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Swipe glow effect */}
                {isSwiping && (
                  <motion.div
                    className="absolute inset-0 rounded-3xl pointer-events-none"
                    style={{
                      background: `linear-gradient(90deg, 
                        ${swipeProgress > 0 ? currentStepData.accentColor : 'transparent'}20,
                        transparent,
                        ${swipeProgress < 0 ? currentStepData.accentColor : 'transparent'}20)`,
                    }}
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                    }}
                  />
                )}

                {/* Background accent */}
                <div
                  className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r"
                  style={{ background: `linear-gradient(135deg, ${currentStepData.accentColor}40, ${currentStepData.accentColor}20)` }}
                />

                {/* Animated Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{
                    scale: 1,
                    rotate: isSwiping ? [0, swipeProgress * 5] : 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    delay: 0.2,
                    rotate: { duration: 0.2 }
                  }}
                  className="mb-6 sm:mb-8 flex justify-center"
                >
                  <div className="relative">
                    <motion.div
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-2xl"
                      style={{
                        background: `linear-gradient(135deg, ${currentStepData.accentColor}40, ${currentStepData.accentColor}20)`,
                        border: `2px solid ${currentStepData.accentColor}30`
                      }}
                      whileHover={{
                        scale: 1.1,
                        rotate: 5,
                        transition: { type: "spring", stiffness: 300 }
                      }}
                    >
                      <IconComponent
                        className="w-12 h-12 sm:w-14 sm:h-14"
                        style={{ color: currentStepData.accentColor }}
                      />

                      {/* Floating emoji */}
                      <motion.div
                        className="absolute -top-2 -right-2 text-3xl sm:text-4xl"
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{
                          scale: 1,
                          rotate: 0,
                          x: isSwiping ? swipeProgress * 10 : 0,
                          y: isSwiping ? Math.abs(swipeProgress) * 5 : 0,
                        }}
                        transition={{
                          delay: 0.5,
                          type: "spring",
                          x: { duration: 0.1 },
                          y: { duration: 0.1 }
                        }}
                      >
                        {currentStepData.emoji}
                      </motion.div>

                      {/* Pulsing ring */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl border-2"
                        style={{ borderColor: currentStepData.accentColor }}
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 0, 0.5]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </motion.div>

                    {/* Floating financial symbols */}
                    {[...Array(4)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute text-blue-400/50"
                        style={{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                        }}
                        animate={{
                          y: [0, -30, 0],
                          rotate: [0, 180, 360],
                          scale: [0, 1, 0],
                        }}
                        transition={{
                          duration: 4,
                          delay: i * 0.3,
                          repeat: Infinity,
                          repeatDelay: 1
                        }}
                      >
                        <BarChart className="w-3 h-3 sm:w-4 sm:h-4" />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Title & description */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    x: isSwiping ? swipeProgress * 20 : 0,
                  }}
                  transition={{
                    delay: 0.3,
                    x: { duration: 0.1 }
                  }}
                  className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent"
                >
                  {t(`onboarding.steps.${currentStepData.title}`)}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: isSwiping ? 1 - Math.abs(swipeProgress) * 0.5 : 1,
                    y: 0,
                    x: isSwiping ? swipeProgress * 15 : 0,
                  }}
                  transition={{
                    delay: 0.4,
                    x: { duration: 0.1 },
                    opacity: { duration: 0.1 }
                  }}
                  className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed font-medium"
                >
                  {t(`onboarding.steps.${currentStepData.description}`)}
                </motion.p>

                {/* Features list */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mb-6 sm:mb-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-md mx-auto">
                    {currentStepData.features.map((feature, i) => (
                      <motion.div
                        key={i}
                        className="flex items-center gap-2 p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                        whileHover={{ scale: 1.05 }}
                        animate={{
                          x: isSwiping ? swipeProgress * (5 + i) : 0,
                        }}
                        transition={{
                          x: { duration: 0.1 }
                        }}
                      >
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {feature}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Tags */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex justify-center flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8"
                >
                  {currentStepData.tags.map((tagKey, i) => (
                    <motion.span
                      key={i}
                      className="px-3 py-1 sm:px-4 sm:py-2 rounded-full border text-xs sm:text-sm font-semibold backdrop-blur-sm shadow-lg"
                      style={{
                        backgroundColor: `${currentStepData.accentColor}15`,
                        color: currentStepData.accentColor,
                        borderColor: `${currentStepData.accentColor}30`
                      }}
                      whileHover={{
                        scale: 1.1,
                        backgroundColor: `${currentStepData.accentColor}25`,
                        transition: { type: "spring", stiffness: 400 }
                      }}
                      animate={{
                        x: isSwiping ? swipeProgress * (10 + i * 2) : 0,
                        y: isSwiping ? Math.abs(swipeProgress) * (5 + i) : 0,
                      }}
                      transition={{
                        x: { duration: 0.1 },
                        y: { duration: 0.1 }
                      }}
                    >
                      {t(`onboarding.tags.${tagKey}`)}
                    </motion.span>
                  ))}
                </motion.div>

                {/* Progress bar with stock chart style */}
                <div className="w-full bg-white/50 dark:bg-gray-700/50 rounded-full h-2 sm:h-3 overflow-hidden backdrop-blur-sm">
                  <motion.div
                    className="h-2 sm:h-3 rounded-full relative overflow-hidden shadow-lg"
                    style={{
                      background: `linear-gradient(90deg, ${currentStepData.accentColor}, ${currentStepData.accentColor}80)`,
                      width: `${((currentStep + 1) / totalSteps) * 100}%`
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                      animate={{ x: [-100, 100] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-5xl px-4 sm:px-8 py-4 sm:py-6 border-t border-white/20 backdrop-blur-lg bg-white/50 dark:bg-gray-800/50 relative z-10">
        {/* Dots */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center gap-2 sm:gap-3 mb-4 sm:mb-6"
        >
          {onboardingSteps.map((step, i) => (
            <motion.button
              key={i}
              onClick={() => handleDotClick(i)}
              className={`relative w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 ${i === currentStep ? "scale-125" : ""
                }`}
              style={{
                background: i === currentStep
                  ? step.accentColor
                  : `${step.accentColor}80`,
                opacity: i === currentStep ? 1 : i < currentStep ? 0.8 : 0.4
              }}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
            >
              {i < currentStep && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Navigation buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex gap-3 sm:gap-4"
        >
          {currentStep > 0 && (
            <motion.button
              onClick={handlePrevious}
              className="flex-1 py-3 sm:py-4 border rounded-xl sm:rounded-2xl backdrop-blur-sm text-foreground hover:bg-white/20 transition-all flex items-center justify-center gap-2 sm:gap-3 font-semibold shadow-lg text-sm sm:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              {t('onboarding.back')}
            </motion.button>
          )}

          <motion.button
            onClick={handleNext}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`py-3 sm:py-4 rounded-xl sm:rounded-2xl text-white font-semibold shadow-2xl flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base ${currentStep > 0 ? 'flex-1' : 'w-full'
              }`}
            style={{
              background: `linear-gradient(135deg, ${currentStepData.accentColor}, ${currentStepData.accentColor}80)`,
              boxShadow: `0 8px 32px ${currentStepData.accentColor}40`
            }}
          >
            {currentStep === totalSteps - 1 ? (
              <>
                <Rocket className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{t('onboarding.getStarted')}</span>
              </>
            ) : (
              <>
                <span>{t('onboarding.continue')}</span>
                <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
              </>
            )}
          </motion.button>
        </motion.div>
      </footer>
    </div>
  );
}
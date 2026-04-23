import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import ConnexionPage from './pages/Auth/ConnexionPage';
import { LanguageProvider, useTranslation } from "./i18n";
import { ThemeProvider } from "./contexts/ThemeProvider";
import { useTheme } from 'next-themes';
import SplashScreen from './components/ui/layouts/utils/splashScreen';
import OnboardingFlow from './components/ui/layouts/utils/steps';
import NotFoundPage from './components/ui/layouts/utils/not_found';
import PrivacyPolicy from './components/ui/layouts/privay_policy';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './AuthStore/store';
import EmailVerification from './pages/Auth/EmailVerification';
import PublicRoute from './guard/publicRoutes';
import UnauthorizedPage from './pages/Auth/UnauthorizedPage';
import InstallPrompt from './components/ui/layouts/utils/InstallPrompt';


type AppView = 'splash' | 'onboarding' | 'main';

interface AppState {
  currentView: AppView;
  isLoading: boolean;
  hasSeenOnboarding: boolean;
}

function AppContent() {
  const [appState, setAppState] = useState<AppState>({
    currentView: 'splash',
    isLoading: true,
    hasSeenOnboarding: false
  });

  const { theme } = useTheme();
  const isAuth = false;
  const navigate = useNavigate();
  const location = useLocation();

  const isEmailVerificationUrl = () => {
    return location.pathname === '/auth/verify-email' &&
      (location.search.includes('success=true') || location.search.includes('success=false'));
  };

  const isForgetPassword = () => location.search.includes('token');

  useEffect(() => {
    const initializeApp = async () => {
      try {
        if (isEmailVerificationUrl() || isForgetPassword()) {
          setAppState(prev => ({
            ...prev,
            currentView: 'main',
            hasSeenOnboarding: true,
            isLoading: false
          }));
          return;
        }

        await new Promise(resolve => setTimeout(resolve, 800));

        const onboardingCompleted = localStorage.getItem('onboardingCompleted') === 'true';
        const hasSeenSplash = sessionStorage.getItem('hasSeenSplash') === 'true';

        if (isAuth) {
          setAppState(prev => ({
            ...prev,
            currentView: 'main',
            hasSeenOnboarding: true
          }));
          return;
        }

        if (onboardingCompleted) {
          setAppState(prev => ({
            ...prev,
            currentView: hasSeenSplash ? 'main' : 'splash',
            hasSeenOnboarding: true
          }));
        } else {
          setAppState(prev => ({
            ...prev,
            currentView: 'splash',
            hasSeenOnboarding: false
          }));
        }
      } catch (error) {
        setAppState(prev => ({
          ...prev,
          currentView: 'main',
          isLoading: false
        }));
      } finally {
        setAppState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initializeApp();
  }, [isAuth, location]);

  const handleSplashFinish = () => {
    sessionStorage.setItem('hasSeenSplash', 'true');
    setAppState(prev => ({ ...prev, currentView: 'onboarding' }));
  };

  const { t } = useTranslation();

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    setAppState(prev => ({
      ...prev,
      currentView: 'main',
      hasSeenOnboarding: true
    }));
  };

  const handleOnboardingSkip = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    setAppState(prev => ({
      ...prev,
      currentView: 'main',
      hasSeenOnboarding: true
    }));
  };

  if (appState.isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-background"
        role="status"
        aria-label={t('loading.ariaLabel')}
      >
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-primary rounded-full animate-ping"></div>
            </div>
          </div>
          <p className="text-muted-foreground font-medium">
            {t('loading.title')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'dark bg-background' : 'bg-background'}`}>
      {appState.currentView === 'splash' && (
        <SplashScreen onFinish={handleSplashFinish} />
      )}

      {appState.currentView === 'onboarding' && (
        <OnboardingFlow
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      )}

      {appState.currentView === 'main' && (
        <LanguageProvider>
          <Routes>
            <Route element={<PublicRoute />}>
              <Route path="/" element={<ConnexionPage />} />
              <Route path="/login" element={<ConnexionPage />} />
              <Route path="/register" element={<ConnexionPage />} />
            </Route>
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<PrivacyPolicy />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/auth/verify-email" element={<EmailVerification />} />
            <Route
              path="/onboarding"
              element={
                <OnboardingFlow
                  onComplete={() => navigate('/')}
                  onSkip={() => navigate('/')}
                />
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </LanguageProvider>
      )}
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <InstallPrompt />
        <Router>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <AppContent />
          </ThemeProvider>
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;

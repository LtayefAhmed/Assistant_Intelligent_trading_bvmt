import { useState, useEffect, useContext } from "react";
import {useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Phone, IdCard, AlertCircle, Languages, ChevronDown, PlayCircle } from "lucide-react";
import logo from "@/assets/images/logo.png";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { LanguageContext, useTranslation } from '@/i18n';
import FooterComponent from "@/components/ui/layouts/utils/Footer";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { login, register, resendVerificationEmail } from '@/services/auth/auth_service';
import type { LoginCredentials } from "@/models/AuthModels";
import { useAuth } from "@/contexts/AuthContext";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import CommentsButton from "@/Giscus/CommentsButton";

export default function ConnexionPage() {
    const { t } = useTranslation();
    const { language: currentLanguage, setLanguage } = useContext(LanguageContext);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const { theme, setTheme } = useTheme();
    const { LoginUser } = useAuth();
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
    const [mounted, setMounted] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        cin: '',
        date_of_birth: '',
        address: '',
        city: '',
        country: 'Tunisia',
        postal_code: '',
        user_type: 'beginner' as 'beginner' | 'trader' | 'regulator',
        risk_profile: 'moderate' as 'conservative' | 'moderate' | 'aggressive',
        initial_capital: 0,
        investment_experience: 'none' as 'none' | 'low' | 'medium' | 'high',
        investment_objective: 'growth' as 'growth' | 'income' | 'preservation',
        investment_horizon: 'medium' as 'short' | 'medium' | 'long',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [backendError, setBackendError] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [authView, setAuthView] = useState<'login' | 'register' | 'forgot-password' | 'reset-password'>('login');
    const [searchParams] = useSearchParams();
    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            setAuthView('reset-password');
        }
    }, [searchParams]);

    const changeLanguage = (lng: string) => {
        setLanguage(lng);
        setShowLanguageDropdown(false);
    };

    useEffect(() => {
        setIsLoaded(true);
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    const languages = [
        { value: 'fr', label: 'Français', flag: '🇫🇷' },
        { value: 'en', label: 'English', flag: '🇺🇸' },
        { value: 'ar', label: 'العربية', flag: '🇸🇦' }
    ];

    const currentLanguageInfo = languages.find(lang => lang.value === currentLanguage) || languages[0];

    const showOnboardingSteps = () => {
        navigate('/onboarding');
    };

    const isRTL = currentLanguage === 'ar';

    const handleShowForgotPassword = () => {
        setAuthView('forgot-password');
    };

    const handleShowResetPassword = (email: string) => {
       console.log(email);
    };

    const handleBackToLogin = () => {
        setAuthView('login');
      
        setBackendError('');
        setErrors({});
    };

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

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone: string) => {
        const phoneRegex = /^[0-9]{8}$/;
        return phoneRegex.test(phone);
    };

    const validateCIN = (cin: string) => {
        return cin.length >= 6;
    };

    const validateRequired = (value: string) => {
        return value.trim().length > 0;
    };

    const handleInputChange = (field: string, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
        if (backendError) {
            setBackendError('');
        }
    };


    const validateLoginForm = () => {
        const newErrors: Record<string, string> = {};

        if (!validateRequired(formData.email)) {
            newErrors.email = t('validation.emailRequired');
        } else if (!validateEmail(formData.email)) {
            newErrors.email = t('forms.invalidEmail');
        }

        if (!validateRequired(formData.password)) {
            newErrors.password = t('validation.passwordRequired');
        } else if (formData.password.length < 6) {
            newErrors.password = t('forms.passwordLength');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateRegistrationForm = () => {
        const newErrors: Record<string, string> = {};

        if (!validateRequired(formData.name)) newErrors.name = t('validation.nameRequired');
        if (!validateRequired(formData.email)) {
            newErrors.email = t('validation.emailRequired');
        } else if (!validateEmail(formData.email)) {
            newErrors.email = t('forms.invalidEmail');
        }
        if (!validateRequired(formData.password)) {
            newErrors.password = t('validation.passwordRequired');
        } else if (formData.password.length < 6) {
            newErrors.password = t('forms.passwordLength');
        }
        if (!validateRequired(formData.phone)) {
            newErrors.phone = t('validation.phoneRequired');
        } else if (!validatePhone(formData.phone)) {
            newErrors.phone = t('forms.invalidPhone');
        }
        if (!validateRequired(formData.cin)) {
            newErrors.cin = t('validation.cinRequired');
        } else if (!validateCIN(formData.cin)) {
            newErrors.cin = t('forms.cinLength');
        }
        // Add date of birth validation if needed
        if (formData.date_of_birth) {
            const dob = new Date(formData.date_of_birth);
            const today = new Date();
            const age = today.getFullYear() - dob.getFullYear();
            if (age < 18) {
                newErrors.date_of_birth = t('forms.mustBe18');
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleResendVerification = async (email: string) => {
        try {
            await resendVerificationEmail(email);
            setBackendError('Verification email sent! Please check your inbox.');
        } catch (error) {
            setBackendError('Failed to resend verification email. Please try again.');
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setBackendError('');
        if (validateLoginForm()) {
            setLoading(true);
            try {
                const credentials: LoginCredentials = {
                    email: formData.email,
                    password: formData.password
                };
                const response = await login(credentials);
                LoginUser(response.user);

            } catch (error: any) {
                console.error('Login error:', error);
                if (error.response) {
                    const errorMessage = error.response.data?.message ||
                        error.response.data?.error ||
                        'Login error';
                    setBackendError(errorMessage);
                    if (errorMessage.includes('verify your email') || error.response.status === 403) {
                        setBackendError('Please verify your email address before logging in. Check your inbox for the verification link.');
                    } else {
                        setBackendError(errorMessage);
                    }
                    if (error.response.data?.errors) {
                        const fieldErrors = error.response.data.errors;
                        setErrors(fieldErrors);
                    }
                } else if (error.request) {
                    setBackendError('Network error. Please check your connection.');
                } else {
                    setBackendError('An unexpected error occurred.');
                }
            } finally {
                setLoading(false);
            }
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setBackendError('');

        if (validateRegistrationForm()) {
            setLoading(true);
            try {
                const userData = {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    password_confirmation: formData.password,
                    phone: formData.phone,
                    cin: formData.cin,
                    date_of_birth: formData.date_of_birth || null,
                    address: formData.address || null,
                    city: formData.city || null,
                    country: formData.country,
                    postal_code: formData.postal_code || null,
                    user_type: formData.user_type,
                    risk_profile: formData.risk_profile,
                    initial_capital: formData.initial_capital,
                    investment_experience: formData.investment_experience,
                    investment_objective: formData.investment_objective,
                    investment_horizon: formData.investment_horizon,
                };

                const response = await register(userData);
                console.log('Registration successful:', response);

                // Show success message and redirect to login
                setBackendError('Registration successful! Please check your email to verify your account.');
                setTimeout(() => {
                    setAuthView('login');
                    resetForm();
                }, 3000);

            } catch (error: any) {
                console.error('Registration error:', error);
                if (error.response) {
                    const errorData = error.response.data;
                    const errorMessage = errorData?.message ||
                        errorData?.error ||
                        "Registration error";
                    setBackendError(errorMessage);

                    if (errorData.errors) {
                        const fieldErrors: Record<string, string> = {};
                        Object.keys(errorData.errors).forEach(field => {
                            // Map field names if needed
                            fieldErrors[field] = errorData.errors[field][0];
                        });
                        setErrors(fieldErrors);
                    }

                    if (errorMessage.includes('email') || errorMessage.includes('Email')) {
                        setErrors(prev => ({ ...prev, email: 'This email is already used' }));
                    }
                    if (errorMessage.includes('cin') || errorMessage.includes('CIN')) {
                        setErrors(prev => ({ ...prev, cin: 'This CIN is already used' }));
                    }

                } else if (error.request) {
                    setBackendError('Network error. Please check your connection.');
                } else {
                    setBackendError("An unexpected error occurred during registration.");
                }
            } finally {
                setLoading(false);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            password: '',
            phone: '',
            cin: '',
            date_of_birth: '',
            address: '',
            city: '',
            country: 'Tunisia',
            postal_code: '',
            user_type: 'beginner',
            risk_profile: 'moderate',
            initial_capital: 0,
            investment_experience: 'none',
            investment_objective: 'growth',
            investment_horizon: 'medium',
        });
        setErrors({});
        setBackendError('');
    };

    return (
        <div
            className={`min-h-screen bg-gradient-hero flex flex-col relative overflow-hidden transition-colors duration-300 ${isRTL ? 'rtl' : 'ltr'}`}
            dir={isRTL ? 'rtl' : 'ltr'}
        >
            <CommentsButton />
            <div className={`fixed flex top-2 ${isRTL ? 'left-5' : 'right-5'} items-center gap-2 z-20`}>
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
                        <div className={`absolute top-full mt-1 ${isRTL ? 'left-0' : 'right-0'} bg-background/95 backdrop-blur-lg border border-border/50 rounded-md shadow-xl py-1 z-50 min-w-[50px]`}>
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

                <Button
                    size="icon"
                    onClick={toggleTheme}
                    className="w-8 h-8 bg-white/90 backdrop-blur-lg border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 dark:bg-background/80 dark:border-border/50"
                >
                    {theme === "dark" ? <Sun size={16} className="text-amber-500" /> : <Moon size={16} className="text-slate-600" />}
                </Button>
            </div>

            <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
                <div className={`w-full max-w-md transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                    <div className="text-center mb-12">
                        <div className="relative mb-6">
                            <div className=" w-24 h-24 mx-auto rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 hover:scale-105">
                                <img
                                    src={logo}
                                    alt="OptraVerse Logo"
                                    className="w-50 h-50 object-contain"
                                />
                            </div>
                        </div>
                        <h1 className="app-title text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-3">
                            BOUR<span className="font-light">SETNA</span>
                        </h1>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex justify-center"
                        >
                            <button
                                onClick={showOnboardingSteps}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-400 to-blue-600 hover:from-orange-500 hover:to-blue-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                                <PlayCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                <span>{t('auth.discoverFeatures')}</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    </div>

                    <div className="form-container card-glass rounded-xl shadow-xl border text-center p-5 transition-colors duration-300">
                        {authView === 'forgot-password' ? (
                            <ForgotPassword
                                onBackToLogin={handleBackToLogin}
                                onShowReset={handleShowResetPassword}
                            />
                        ) : authView === 'reset-password' ? (
                            <ResetPassword
                                token={searchParams.get('token') || ''}
                                onBackToLogin={handleBackToLogin}
                            />
                        ) : (
                            <>
                                <div className="toggle-container rounded-2xl p-1.5 mb-8 transition-colors duration-300">
                                    <button
                                        onClick={() => { setAuthView('login'); resetForm(); }}
                                        className={`toggle-btn flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${authView === 'login'
                                            ? 'toggle-btn-active shadow-sm'
                                            : 'toggle-btn-inactive'
                                            }`}
                                    >
                                        {t('auth.login')}
                                    </button>
                                    <button
                                        onClick={() => { setAuthView('register'); resetForm(); }}
                                        className={`toggle-btn flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${authView === 'register'
                                            ? 'toggle-btn-active shadow-sm'
                                            : 'toggle-btn-inactive'
                                            }`}
                                    >
                                        {t('auth.register')}
                                    </button>
                                </div>

                                {backendError && (
                                    <div className={`alert-message mb-6 p-4 rounded-xl flex items-center space-x-3 ${backendError.includes('success')
                                        ? 'alert-success'
                                        : 'alert-error'
                                        }`}>
                                        <AlertCircle className="alert-icon w-5 h-5 shrink-0" />
                                        <p className="alert-text text-sm font-medium">{backendError}</p>
                                    </div>
                                )}
                                {backendError && backendError.includes('verify your email') && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                                        <div className="flex items-center gap-3">
                                            <Mail className="w-5 h-5 text-blue-500" />
                                            <div className="flex-1">
                                                <p className="text-blue-800 text-sm">
                                                    Didn't receive the verification email?
                                                </p>
                                                <Button
                                                    onClick={() => handleResendVerification(formData.email)}
                                                    variant="outline"
                                                    size="sm"
                                                    className="mt-2 text-blue-600 border-blue-300 hover:bg-blue-100"
                                                >
                                                    Resend Verification Email
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {authView === 'login' ? (
                                    <form onSubmit={handleLogin} className="space-y-5">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <div className="relative">
                                                    <Mail className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
                                                    <input
                                                        type="email"
                                                        placeholder={t('auth.email')}
                                                        value={formData.email}
                                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                                        className={`input-field w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 rounded-2xl transition-all duration-300 ${errors.email
                                                            ? 'input-error'
                                                            : 'input-normal'
                                                            }`}
                                                    />
                                                </div>
                                                {errors.email && (
                                                    <p className="error-text text-red-500 text-sm mt-1 text-left">{errors.email}</p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <div className="relative">
                                                    <Lock className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder={t('auth.password')}
                                                        value={formData.password}
                                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                                        className={`input-field w-full ${isRTL ? 'pr-12 pl-12' : 'pl-12 pr-12'} py-4 rounded-2xl transition-all duration-300 ${errors.password
                                                            ? 'input-error'
                                                            : 'input-normal'
                                                            }`}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className={`password-toggle-btn absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors`}
                                                    >
                                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                    </button>
                                                </div>
                                                {errors.password && (
                                                    <p className="error-text text-red-500 text-sm mt-1 text-left">{errors.password}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Forgot Password */}
                                        <div className={`text-${isRTL ? 'left' : 'right'}`}>
                                            <button
                                                type="button"
                                                onClick={handleShowForgotPassword}
                                                className="forgot-password-btn text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                                            >
                                                {t('auth.forgotPassword')}
                                            </button>
                                        </div>

                                        {/* Login Button */}
                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="login-btn w-full bg-gradient-primary text-white py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? (
                                                <div className="flex items-center justify-center">
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                    <span>{t('buttons.signingIn')}</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <span>{t('auth.signIn')}</span>
                                                    <ArrowRight className={`ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180' : ''}`} />
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                ) : (
                                    /* Registration Flow */
                                    <div className="space-y-6">
                                        {/* Role Selection */}

                                        <form onSubmit={handleRegister} className="space-y-4">
                                            <div className="space-y-2">
                                                <input
                                                    type="text"
                                                    placeholder={t('auth.fullName')}
                                                    value={formData.name}
                                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                                    className={`input-field w-full px-4 py-3 rounded-xl transition-all duration-300 ${errors.name
                                                        ? 'input-error'
                                                        : 'input-normal'
                                                        }`}
                                                />
                                                {errors.name && <p className="error-text text-red-500 text-sm mt-1">{errors.name}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <div className="relative">
                                                    <Mail className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
                                                    <input
                                                        type="email"
                                                        placeholder={t('auth.email')}
                                                        value={formData.email}
                                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                                        className={`input-field w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 rounded-xl transition-all duration-300 ${errors.email
                                                            ? 'input-error'
                                                            : 'input-normal'
                                                            }`}
                                                    />
                                                </div>
                                                {errors.email && <p className="error-text text-red-500 text-sm mt-1">{errors.email}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <div className="relative">
                                                    <Lock className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder={t('auth.password')}
                                                        value={formData.password}
                                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                                        className={`input-field w-full ${isRTL ? 'pr-12 pl-12' : 'pl-12 pr-12'} py-3 rounded-xl transition-all duration-300 ${errors.password
                                                            ? 'input-error'
                                                            : 'input-normal'
                                                            }`}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className={`password-toggle-btn absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors`}
                                                    >
                                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                    </button>
                                                </div>
                                                {errors.password && <p className="error-text text-red-500 text-sm mt-1">{errors.password}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <div className="relative">
                                                    <Phone className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
                                                    <input
                                                        type="tel"
                                                        placeholder={t('auth.phone')}
                                                        value={formData.phone}
                                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                                        className={`input-field w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 rounded-xl transition-all duration-300 ${errors.phone
                                                            ? 'input-error'
                                                            : 'input-normal'
                                                            }`}
                                                    />
                                                </div>
                                                {errors.phone && <p className="error-text text-red-500 text-sm mt-1">{errors.phone}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <div className="relative">
                                                    <IdCard className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
                                                    <input
                                                        type="text"
                                                        placeholder={t('forms.cin')}
                                                        value={formData.cin}
                                                        onChange={(e) => handleInputChange('cin', e.target.value)}
                                                        className={`input-field w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 rounded-xl transition-all duration-300 ${errors.cin
                                                            ? 'input-error'
                                                            : 'input-normal'
                                                            }`}
                                                    />
                                                </div>
                                                {errors.cin && <p className="error-text text-red-500 text-sm mt-1">{errors.cin}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <input
                                                    type="text"
                                                    placeholder={t('forms.address')}
                                                    value={formData.address}
                                                    onChange={(e) => handleInputChange('address', e.target.value)}
                                                    className={`input-field w-full px-4 py-3 rounded-xl transition-all duration-300 input-normal`}
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <input
                                                        type="text"
                                                        placeholder={t('forms.city')}
                                                        value={formData.city}
                                                        onChange={(e) => handleInputChange('city', e.target.value)}
                                                        className={`input-field w-full px-4 py-3 rounded-xl transition-all duration-300 input-normal`}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <input
                                                        type="text"
                                                        placeholder={t('forms.postalCode')}
                                                        value={formData.postal_code}
                                                        onChange={(e) => handleInputChange('postal_code', e.target.value)}
                                                        className={`input-field w-full px-4 py-3 rounded-xl transition-all duration-300 input-normal`}
                                                    />
                                                </div>
                                            </div>
                                            {/* Additional fields */}
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-foreground">{t('forms.dateOfBirth')}</label>
                                                    <input
                                                        type="date"
                                                        value={formData.date_of_birth}
                                                        onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                                                        className={`input-field w-full px-4 py-3 rounded-xl transition-all duration-300 ${errors.date_of_birth
                                                            ? 'input-error'
                                                            : 'input-normal'
                                                            }`}
                                                    />
                                                    {errors.date_of_birth && <p className="error-text text-red-500 text-sm mt-1">{errors.date_of_birth}</p>}
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-foreground">{t('forms.userType')}</label>
                                                    <select
                                                        value={formData.user_type}
                                                        onChange={(e) => handleInputChange('user_type', e.target.value)}
                                                        className="input-field w-full px-4 py-3 rounded-xl transition-all duration-300 input-normal"
                                                    >
                                                        <option value="beginner">Beginner</option>
                                                        <option value="trader">Trader</option>
                                                        <option value="regulator">Regulator</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="space-y-4 border-t pt-4">
                                                <h4 className="text-sm font-semibold text-foreground">{t('forms.investmentPreferences')}</h4>

                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-foreground">{t('forms.riskProfile')}</label>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleInputChange('risk_profile', 'conservative')}
                                                            className={`px-3 py-2 rounded-lg text-sm ${formData.risk_profile === 'conservative'
                                                                ? 'bg-green-100 text-green-800 border border-green-300'
                                                                : 'bg-gray-100 text-gray-600 border border-gray-200'
                                                                }`}
                                                        >
                                                            {t('forms.conservative')}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleInputChange('risk_profile', 'moderate')}
                                                            className={`px-3 py-2 rounded-lg text-sm ${formData.risk_profile === 'moderate'
                                                                ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                                                                : 'bg-gray-100 text-gray-600 border border-gray-200'
                                                                }`}
                                                        >
                                                            {t('forms.moderate')}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleInputChange('risk_profile', 'aggressive')}
                                                            className={`px-3 py-2 rounded-lg text-sm ${formData.risk_profile === 'aggressive'
                                                                ? 'bg-red-100 text-red-800 border border-red-300'
                                                                : 'bg-gray-100 text-gray-600 border border-gray-200'
                                                                }`}
                                                        >
                                                            {t('forms.aggressive')}
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-foreground">{t('forms.initialCapital')}</label>
                                                    <input
                                                        type="number"
                                                        placeholder="0.00"
                                                        value={formData.initial_capital}
                                                        onChange={(e) => handleInputChange('initial_capital', parseFloat(e.target.value))}
                                                        min="0"
                                                        step="0.01"
                                                        className="input-field w-full px-4 py-3 rounded-xl transition-all duration-300 input-normal"
                                                    />
                                                </div>
                                            </div>

                                            {/* Terms and Agreement */}
                                            <div className="terms-agreement text-center text-sm text-muted-foreground">
                                                {t('legal.agreement')}{" "}
                                                <button type="button" className="terms-link font-medium text-primary hover:text-primary/80 transition-colors">
                                                    {t('legal.terms')}
                                                </button>{" "}
                                                {t('common.and')}{" "}
                                                <button type="button" className="terms-link font-medium text-primary hover:text-primary/80 transition-colors">
                                                    {t('legal.privacyPolicy')}
                                                </button>
                                            </div>

                                            <Button
                                                type="submit"
                                                disabled={loading}
                                                className="register-btn w-full bg-gradient-primary text-white py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {loading ? (
                                                    <div className="flex items-center justify-center">
                                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                        <span>{t('buttons.registering')}</span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <span>{t('buttons.createAccount')}</span>
                                                        <ArrowRight className={`ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180' : ''}`} />
                                                    </>
                                                )}
                                            </Button>
                                        </form>

                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {authView !== 'forgot-password' && authView !== 'reset-password' && (
                        <div className="text-center mt-8">
                            <p className="auth-switch-text text-sm text-muted-foreground">
                                {authView === 'login' ? t('auth.noAccount') : t('auth.hasAccount')}{" "}
                                <button
                                    onClick={() => {
                                        setAuthView(authView === 'login' ? 'register' : 'login');
                                        resetForm();
                                    }}
                                    className="auth-switch-btn font-medium text-primary hover:text-primary/80 transition-colors"
                                >
                                    {authView === 'login' ? t('auth.signUp') : t('auth.signIn')}
                                </button>
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <FooterComponent />
        </div >
    );
}
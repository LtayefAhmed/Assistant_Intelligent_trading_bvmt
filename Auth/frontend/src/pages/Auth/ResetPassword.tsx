// components/auth/ResetPassword.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { resetPassword, verifyResetToken } from "@/services/auth/auth_service";
import { useTranslation } from "@/i18n";
import { motion } from "framer-motion";

interface ResetPasswordProps {
  token: string;
  onBackToLogin: () => void;
}

export default function ResetPassword({ token, onBackToLogin }: ResetPasswordProps) {
  const [formData, setFormData] = useState({
    password: "",
    password_confirmation: ""
  });
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await verifyResetToken(token);
        setEmail(res.email);
        setTokenValid(true);
      } catch (err) {
        setTokenValid(false);
        setError("Invalid or expired reset token");
      } finally {
        setVerifying(false);
      }
    };

    if (token) {
      verifyToken();
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.password_confirmation) {
      setError(t('validation.passwordsDoNotMatch'));
      return;
    }

    if (formData.password.length < 6) {
      setError(t('forms.passwordLength'));
      return;
    }

    setLoading(true);

    try {
      await resetPassword(email,token, formData.password, formData.password_confirmation);
      setSuccess(true);
      
      setTimeout(() => {
        onBackToLogin();
      }, 3000);
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        "Failed to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">{t('loading.verifyingToken')}</p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <div className="alert-error p-4 rounded-xl flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-medium">{t('auth.invalidToken')}</p>
            <p className="text-sm opacity-90 mt-1">
              {t('auth.requestNewLink')}
            </p>
          </div>
        </div>
        
        <Button
          onClick={onBackToLogin}
          className="w-full"
        >
          {t('auth.backToLogin')}
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onBackToLogin}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold text-foreground">
          {t('auth.resetPassword')}
        </h2>
      </div>

      {success ? (
        <div className="alert-success p-4 rounded-xl flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-medium">{t('auth.passwordResetSuccess')}</p>
            <p className="text-sm opacity-90 mt-1">
              {t('auth.redirectingToLogin')}
            </p>
          </div>
        </div>
      ) : (
        <>
          <p className="text-muted-foreground text-sm">
            {t('auth.resetPasswordInstructions')}
          </p>

          {error && (
            <div className="alert-error p-4 rounded-xl flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="alert-text text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={t('auth.newPassword')}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  required
                  className="input-field w-full pl-12 pr-12 py-3 rounded-xl transition-all duration-300 input-normal"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={t('auth.confirmNewPassword')}
                  value={formData.password_confirmation}
                  onChange={(e) => setFormData(prev => ({ ...prev, password_confirmation: e.target.value }))}
                  required
                  className="input-field w-full pl-12 pr-12 py-3 rounded-xl transition-all duration-300 input-normal"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-primary text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {t('buttons.resetting')}
                </div>
              ) : (
                t('buttons.resetPassword')
              )}
            </Button>
          </form>
        </>
      )}
    </motion.div>
  );
}
// components/auth/ForgotPassword.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import { forgotPassword } from "@/services/auth/auth_service";
import { useTranslation } from "@/i18n";
import { motion } from "framer-motion";

interface ForgotPasswordProps {
  onBackToLogin: () => void;
  onShowReset: (email: string) => void;
}

export default function ForgotPassword({ onBackToLogin, onShowReset }: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await forgotPassword(email);
      setSuccess(true);
      onShowReset(email);
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        "Failed to send reset email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
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
          {t('auth.forgotPassword')}
        </h2>
      </div>

      <p className="text-muted-foreground text-sm">
        {t('auth.forgotPasswordInstructions')}
      </p>

      {error && (
        <div className="alert-error p-4 rounded-xl flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="alert-text text-sm font-medium">{error}</p>
        </div>
      )}

      {success ? (
        <div className="alert-success p-4 rounded-xl flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-medium">{t('auth.resetEmailSent')}</p>
            <p className="text-sm opacity-90 mt-1">
              {t('auth.checkYourEmail')}
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                placeholder={t('auth.email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field w-full pl-12 pr-4 py-3 rounded-xl transition-all duration-300 input-normal"
              />
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
                {t('buttons.sending')}
              </div>
            ) : (
              t('buttons.sendResetLink')
            )}
          </Button>
        </form>
      )}

      <div className="text-center">
        <button
          onClick={onBackToLogin}
          className="text-primary hover:text-primary/80 font-medium text-sm transition-colors"
        >
          {t('auth.backToLogin')}
        </button>
      </div>
    </motion.div>
  );
}
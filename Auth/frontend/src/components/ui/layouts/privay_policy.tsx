// pages/Legal/PrivacyPolicy.tsx
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, Mail, User, Calendar, ArrowLeft } from 'lucide-react';
import { useEffect, useContext } from 'react';
import { useTranslation } from '@/i18n';
import { LanguageContext } from '@/i18n';

export default function PrivacyPolicy() {
  const { t } = useTranslation();
  const { language: currentLanguage } = useContext(LanguageContext);
  const isRTL = currentLanguage === 'ar';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const lastUpdated = {
    en: "December 1, 2024",
    fr: "1 Décembre 2024", 
    ar: "1 ديسمبر 2024"
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-950"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Link
              to="/"
              className={`flex items-center space-x-3 text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
              <span>{t('privacy.backToHome')}</span>
            </Link>
            
            <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Shield className="w-8 h-8 text-orange-500" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('privacy.title')}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header Card */}
          <div className="bg-gradient-to-r from-orange-500 to-blue-500 p-8 text-white">
            <div className={`flex items-center space-x-4 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <h1 className="text-3xl font-bold">{t('privacy.title')}</h1>
                <p className={`text-orange-100 flex items-center space-x-2 mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Calendar className="w-4 h-4" />
                  <span>{t('privacy.lastUpdated')}: {lastUpdated[currentLanguage as keyof typeof lastUpdated]}</span>
                </p>
              </div>
            </div>
            <p className="text-orange-100 text-lg">
              {t('privacy.headerDescription')}
            </p>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Introduction */}
            <section className="space-y-4">
              <h2 className={`text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <User className="w-6 h-6 text-orange-500" />
                <span>1. {t('privacy.sections.introduction.title')}</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {t('privacy.sections.introduction.content')}
              </p>
            </section>

            {/* Data Collection */}
            <section className="space-y-4">
              <h2 className={`text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Eye className="w-6 h-6 text-orange-500" />
                <span>2. {t('privacy.sections.dataCollection.title')}</span>
              </h2>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('privacy.sections.dataCollection.personalData')}
                </h3>
                <ul className={`list-disc space-y-2 text-gray-600 dark:text-gray-300 ${isRTL ? 'list-inside pr-4' : 'list-inside pl-4'}`}>
                  <li>{t('privacy.sections.dataCollection.identityData')}</li>
                  <li>{t('privacy.sections.dataCollection.contactData')}</li>
                  <li>{t('privacy.sections.dataCollection.profileData')}</li>
                  <li>{t('privacy.sections.dataCollection.careerData')}</li>
                  <li>{t('privacy.sections.dataCollection.technicalData')}</li>
                </ul>
              </div>
            </section>

            {/* How We Use Data */}
            <section className="space-y-4">
              <h2 className={`text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Mail className="w-6 h-6 text-orange-500" />
                <span>3. {t('privacy.sections.dataUsage.title')}</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-200 dark:border-orange-800">
                  <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">
                    {t('privacy.sections.dataUsage.serviceDelivery.title')}
                  </h4>
                  <p className="text-sm text-orange-700 dark:text-orange-400">
                    {t('privacy.sections.dataUsage.serviceDelivery.description')}
                  </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                    {t('privacy.sections.dataUsage.personalization.title')}
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    {t('privacy.sections.dataUsage.personalization.description')}
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                    {t('privacy.sections.dataUsage.communication.title')}
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    {t('privacy.sections.dataUsage.communication.description')}
                  </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
                  <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">
                    {t('privacy.sections.dataUsage.analytics.title')}
                  </h4>
                  <p className="text-sm text-purple-700 dark:text-purple-400">
                    {t('privacy.sections.dataUsage.analytics.description')}
                  </p>
                </div>
              </div>
            </section>

            {/* Data Sharing */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                4. {t('privacy.sections.dataSharing.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {t('privacy.sections.dataSharing.intro')}
              </p>
              <ul className={`list-disc space-y-2 text-gray-600 dark:text-gray-300 ${isRTL ? 'list-inside pr-4' : 'list-inside pl-4'}`}>
                <li><strong>{t('privacy.sections.dataSharing.employers')}:</strong> {t('privacy.sections.dataSharing.employersDesc')}</li>
                <li><strong>{t('privacy.sections.dataSharing.serviceProviders')}:</strong> {t('privacy.sections.dataSharing.serviceProvidersDesc')}</li>
                <li><strong>{t('privacy.sections.dataSharing.legalRequirements')}:</strong> {t('privacy.sections.dataSharing.legalRequirementsDesc')}</li>
                <li><strong>{t('privacy.sections.dataSharing.businessTransfers')}:</strong> {t('privacy.sections.dataSharing.businessTransfersDesc')}</li>
              </ul>
            </section>

            {/* Data Security */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                5. {t('privacy.sections.dataSecurity.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {t('privacy.sections.dataSecurity.content')}
              </p>
            </section>

            {/* Your Rights */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                6. {t('privacy.sections.yourRights.title')}
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl">
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                  <li className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span><strong>{t('privacy.sections.yourRights.access')}:</strong> {t('privacy.sections.yourRights.accessDesc')}</span>
                  </li>
                  <li className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span><strong>{t('privacy.sections.yourRights.correction')}:</strong> {t('privacy.sections.yourRights.correctionDesc')}</span>
                  </li>
                  <li className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span><strong>{t('privacy.sections.yourRights.erasure')}:</strong> {t('privacy.sections.yourRights.erasureDesc')}</span>
                  </li>
                  <li className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span><strong>{t('privacy.sections.yourRights.objection')}:</strong> {t('privacy.sections.yourRights.objectionDesc')}</span>
                  </li>
                  <li className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span><strong>{t('privacy.sections.yourRights.portability')}:</strong> {t('privacy.sections.yourRights.portabilityDesc')}</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Contact */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                7. {t('privacy.sections.contact.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {t('privacy.sections.contact.intro')}
              </p>
              <div className="bg-gradient-to-r from-orange-50 to-blue-50 dark:from-orange-900/20 dark:to-blue-900/20 p-6 rounded-xl border border-orange-200 dark:border-orange-800">
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>{t('privacy.sections.contact.email')}:</strong> privacy@careerboost.com<br />
                  <strong>{t('privacy.sections.contact.address')}:</strong> 123 Career Street, Tech City, TC 12345<br />
                  <strong>{t('privacy.sections.contact.phone')}:</strong> +1 (555) 123-4567
                </p>
              </div>
            </section>

            {/* Changes to Policy */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                8. {t('privacy.sections.changes.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {t('privacy.sections.changes.content')}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
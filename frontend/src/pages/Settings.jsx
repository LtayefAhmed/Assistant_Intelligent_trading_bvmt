import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Moon, RefreshCw, Trash2, Database, Brain, Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import RiskQuestionnaire from '../components/RiskQuestionnaire';

const Settings = () => {
    const { t, i18n } = useTranslation();
    const [showQuiz, setShowQuiz] = useState(false);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{t('settings.title')}</h2>

            {showQuiz ? (
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-gray-900 dark:text-gray-100">AI Risk Assessment</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RiskQuestionnaire onComplete={() => setShowQuiz(false)} />
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* User Profile Settings */}
                    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                <Brain size={20} /> {t('settings.userProfile')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">{t('settings.riskTolerance')}</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[{ key: 'Conservative', label: t('settings.conservative') }, { key: 'Moderate', label: t('settings.moderate') }, { key: 'Aggressive', label: t('settings.aggressive') }].map((profile) => (
                                        <button
                                            key={profile.key}
                                            onClick={() => {
                                                localStorage.setItem('userProfile', profile.key);
                                                window.location.reload();
                                            }}
                                            className={`py-2 px-1 text-sm rounded border ${(localStorage.getItem('userProfile') || 'Moderate') === profile.key
                                                ? 'bg-indigo-600 dark:bg-indigo-700 text-white border-indigo-600 dark:border-indigo-700'
                                                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                                                }`}
                                        >
                                            {profile.label}
                                        </button>
                                    ))}
                                </div>
                                <div className="pt-4">
                                    <button
                                        onClick={() => setShowQuiz(true)}
                                        className="w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 text-white rounded-md font-medium shadow-md hover:shadow-lg transition-all"
                                    >
                                        ✨ {t('settings.aiDetect')}
                                    </button>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 pt-2 text-center">
                                        {t('settings.aiDetectDesc')}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Data Management */}
                    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                <Database size={20} /> {t('settings.dataManagement')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <button className="w-full flex items-center gap-2 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                                <RefreshCw size={18} />
                                <div className="text-left flex-1">
                                    <div className="font-medium">{t('settings.reloadData')}</div>
                                    <div className="text-xs text-blue-600 dark:text-blue-400">{t('settings.reloadDataDesc')}</div>
                                </div>
                            </button>
                            <button className="w-full flex items-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                                <Trash2 size={18} />
                                <div className="text-left flex-1">
                                    <div className="font-medium">{t('settings.resetPortfolio')}</div>
                                    <div className="text-xs text-red-600 dark:text-red-400">{t('settings.resetPortfolioDesc')}</div>
                                </div>
                            </button>
                        </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                <Moon size={20} /> {t('settings.appearance')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="font-medium text-gray-900 dark:text-gray-100">{t('settings.darkMode')}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">{t('settings.darkModeDesc')}</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={localStorage.getItem('darkMode') === 'true'}
                                        onChange={(e) => {
                                            localStorage.setItem('darkMode', e.target.checked);
                                            document.documentElement.classList.toggle('dark', e.target.checked);
                                            window.location.reload();
                                        }}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                                <div>
                                    <div className="font-medium text-gray-900 dark:text-gray-100">{t('settings.language')}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">{t('settings.languageDesc')}</div>
                                </div>
                                <select
                                    value={i18n.language}
                                    onChange={(e) => {
                                        i18n.changeLanguage(e.target.value);
                                        window.location.reload();
                                    }}
                                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                                >
                                    <option value="en">English</option>
                                    <option value="fr">Français</option>
                                    <option value="ar">العربية</option>
                                </select>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default Settings;

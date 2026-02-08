import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { AlertTriangle, AlertOctagon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

const Alerts = () => {
    const { t } = useTranslation();
    const [anomalies, setAnomalies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnomalies = async () => {
            try {
                const res = await fetch('/api/anomalies');
                const data = await res.json();
                setAnomalies(data);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAnomalies();
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="text-gray-500 animate-pulse">{t('common.loading') || "Loading Alerts..."}</p>
        </div>
    );
    if (error) return (
        <div className="p-8 text-center space-y-4">
            <div className="text-red-500 dark:text-red-400 font-bold text-xl">{t('common.error') || "Alerts Error"}</div>
            {error && <p className="text-sm text-gray-500 font-mono bg-gray-50 dark:bg-gray-900 p-2 rounded">{error}</p>}
            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all">
                Try Again
            </button>
        </div>
    );

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{t('alerts.title')}</h2>
            <p className="text-gray-500 dark:text-gray-400">{t('alerts.description')}</p>

            <div className="space-y-4">
                {anomalies.length === 0 ? (
                    <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                        <CardContent className="p-6 text-center text-green-800 dark:text-green-300">
                            {t('alerts.noAnomalies')}
                        </CardContent>
                    </Card>
                ) : (
                    anomalies.map((anomaly, index) => (
                        <Card key={index} className="border-l-4 border-l-red-500 dark:border-l-red-600 shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-4 flex items-start gap-4">
                                <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
                                    <AlertTriangle className="text-red-600 dark:text-red-400" size={24} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">{anomaly.symbol}</h3>
                                        <span className={cn("px-2 py-1 rounded text-xs font-bold uppercase",
                                            anomaly.severity === 'High' ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300" : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300")}>
                                            {anomaly.severity || 'Medium'} {t('alerts.severity')}
                                        </span>
                                    </div>
                                    <p className="font-medium text-red-700 dark:text-red-400 mt-1">{anomaly.reason}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{anomaly.details}</p>

                                    <div className="mt-3">
                                        <Link to={`/stock/${encodeURIComponent(anomaly.symbol)}`} className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">
                                            {t('alerts.viewDetails')} &rarr;
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default Alerts;

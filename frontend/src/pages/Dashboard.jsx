import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';

// Mock Data for now
const data = [
    { name: 'Mon', SFBT: 12.4, BIAT: 88.5 },
    { name: 'Tue', SFBT: 12.6, BIAT: 89.0 },
    { name: 'Wed', SFBT: 12.5, BIAT: 88.2 },
    { name: 'Thu', SFBT: 12.8, BIAT: 89.5 },
    { name: 'Fri', SFBT: 13.0, BIAT: 90.1 },
];

const Dashboard = () => {
    const { t } = useTranslation();
    const [marketSummary, setMarketSummary] = useState(null);
    const [marketMood, setMarketMood] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const [summaryRes, moodRes] = await Promise.all([
                    fetch('/api/market-summary'),
                    fetch('/api/market-mood')
                ]);

                if (summaryRes.ok) setMarketSummary(await summaryRes.json());
                if (moodRes.ok) setMarketMood(await moodRes.json());
            } catch (err) {
                console.error("Dashboard fetch error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="text-gray-500 animate-pulse">{t('common.loading') || "Loading Insights..."}</p>
        </div>
    );
    if (!marketSummary) return (
        <div className="p-8 text-center space-y-4">
            <div className="text-red-500 dark:text-red-400 font-bold text-xl">{t('common.error') || "Connection Error"}</div>
            {error && <p className="text-sm text-gray-500 font-mono bg-gray-50 dark:bg-gray-900 p-2 rounded">{error}</p>}
            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all">
                Try Again
            </button>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{t('dashboard.title')}</h2>
                <div className="text-sm text-gray-500 dark:text-gray-400">Last updated: {new Date().toLocaleTimeString()}</div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard
                    title={t('dashboard.index') || "Market Index"}
                    value={marketSummary.index_value}
                    change={`${marketSummary.index_change}%`}
                    positive={marketSummary.index_change >= 0}
                    icon={Activity}
                />
                <KpiCard
                    title={t('dashboard.volume') || "Total Volume"}
                    value={marketSummary.volume_value}
                    change={`${marketSummary.volume_change}%`}
                    positive={marketSummary.volume_change >= 0}
                    icon={DollarSign}
                />
                <KpiCard
                    title={t('dashboard.topGainers')}
                    value={marketSummary.gainers_count}
                    change="Daily"
                    positive={true}
                    icon={TrendingUp}
                />
                <KpiCard
                    title={t('dashboard.topLosers')}
                    value={marketSummary.losers_count}
                    change="Daily"
                    positive={false}
                    icon={TrendingDown}
                />
            </div>

            {/* Market Mood & Alerts row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Global Sentiment (New Requirement) */}
                <Card className="lg:col-span-1 bg-gradient-to-br from-indigo-50 to-white dark:from-gray-800 dark:to-gray-900 border-indigo-100 dark:border-indigo-950 shadow-md">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2 text-indigo-900 dark:text-indigo-400">
                            <Activity size={20} /> {t('dashboard.marketMood') || "Global Market Mood"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center py-6">
                        {marketMood ? (
                            <>
                                <div className={cn("text-4xl font-black mb-2 transition-all",
                                    marketMood.score > 0.1 ? "text-green-600 dark:text-green-400" :
                                        marketMood.score < -0.1 ? "text-red-600 dark:text-red-400" : "text-yellow-600 dark:text-yellow-400")}>
                                    {marketMood.label}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 italic text-center px-4">
                                    "{marketMood.representative_news && marketMood.representative_news[0] ? marketMood.representative_news[0].title : 'Stable market environment.'}"
                                </div>
                                <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                                    <div
                                        className={cn("h-full transition-all duration-1000",
                                            marketMood.score > 0.1 ? "bg-green-500" : marketMood.score < -0.1 ? "bg-red-500" : "bg-yellow-500")}
                                        style={{ width: `${((marketMood.score + 1) / 2) * 100}%` }}
                                    />
                                </div>
                            </>
                        ) : <p className="text-gray-400 italic">Calculating mood...</p>}
                    </CardContent>
                </Card>

                {/* Main Trend Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">{t('dashboard.volumeTrend') || 'Market Volume Trend (30 Days)'}</h3>
                    <div className="h-48 lg:h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={marketSummary.market_trends}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-gray-700" />
                                <XAxis dataKey="name" stroke="#888888" className="dark:stroke-gray-400" tickFormatter={(v) => v.slice(5)} />
                                <YAxis stroke="#888888" className="dark:stroke-gray-400" />
                                <Tooltip contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }} />
                                <Line type="monotone" dataKey="value" name="Volume" stroke="#3b82f6" strokeWidth={3} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top Movers */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">{t('dashboard.topMovers') || "Top Movers"}</h3>
                    <div className="space-y-2">
                        {marketSummary.top_gainers && marketSummary.top_gainers.map((stock) => (
                            <Link key={stock.Symbol} to={`/stock/${encodeURIComponent(stock.Symbol)}`} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-600">
                                <span className="font-bold text-gray-800 dark:text-gray-200">{stock.Symbol}</span>
                                <span className="text-green-600 dark:text-green-400 flex items-center font-bold">
                                    <TrendingUp size={16} className="mr-1" /> +{stock.diff.toFixed(2)}
                                </span>
                            </Link>
                        ))}
                        {marketSummary.top_losers && marketSummary.top_losers.map((stock) => (
                            <Link key={stock.Symbol} to={`/stock/${encodeURIComponent(stock.Symbol)}`} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-600">
                                <span className="font-bold text-gray-800 dark:text-gray-200">{stock.Symbol}</span>
                                <span className="text-red-600 dark:text-red-400 flex items-center font-bold">
                                    <TrendingDown size={16} className="mr-1" /> {stock.diff.toFixed(2)}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Anomalies Panel */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold mb-4 text-red-600 dark:text-red-400 flex items-center gap-2">
                        <Activity size={20} /> {t('dashboard.recentAnomalies')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {marketSummary.recent_anomalies && marketSummary.recent_anomalies.length > 0 ? (
                            marketSummary.recent_anomalies.map((anomaly, index) => (
                                <AnomalyItem key={index} {...anomaly} />
                            ))
                        ) : (
                            <div className="col-span-2 text-gray-500 dark:text-gray-400 text-sm italic py-4 text-center border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-xl">
                                {t('alerts.noAnomalies')}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const KpiCard = ({ title, value, change, positive, icon: Icon }) => (
    <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</h3>
                    <p className={`text-sm mt-1 ${positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {change}
                    </p>
                </div>
                <div className={`p-3 rounded-full ${positive ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                    <Icon className={positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} size={24} />
                </div>
            </div>
        </CardContent>
    </Card>
);

const AnomalyItem = ({ symbol, time, type, detail }) => (
    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
        <div>
            <div className="font-bold text-gray-900">{symbol}</div>
            <div className="text-xs text-gray-500">{time}</div>
        </div>
        <div className="text-right">
            <div className="text-sm font-medium text-red-700">{type}</div>
            <div className="text-xs text-red-600">{detail}</div>
        </div>
    </div>
);

export default Dashboard;

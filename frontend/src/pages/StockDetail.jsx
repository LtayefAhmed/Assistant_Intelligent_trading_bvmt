import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ArrowUp, ArrowDown, Activity, DollarSign, Newspaper, Info } from 'lucide-react';
import { cn } from '../lib/utils';
import { useTranslation } from 'react-i18next';

const StockDetail = () => {
    const { t, i18n } = useTranslation();
    const { symbol } = useParams();
    const [history, setHistory] = useState([]);
    const [prediction, setPrediction] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const histRes = await fetch(`/api/stocks/${symbol}/history`);
                if (!histRes.ok) throw new Error('Failed to fetch history');
                const histData = await histRes.json();

                const profile = localStorage.getItem('userProfile') || 'Moderate';
                const agentRes = await fetch(`/api/agent/analyze/${symbol}?profile=${profile}`);
                if (agentRes.ok) {
                    const agentData = await agentRes.json();
                    setAnalysis(agentData);
                }

                const predRes = await fetch(`/api/stocks/${symbol}/predict?days=7`);
                if (predRes.ok) {
                    setPrediction(await predRes.json());
                }

                setHistory(histData);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (symbol) fetchData();
    }, [symbol]);

    if (loading) return <div className="p-8 text-gray-900 dark:text-gray-100">{t('common.loading')}</div>;

    const latestDate = history.length > 0 && history[history.length - 1].Date
        ? new Date(history[history.length - 1].Date)
        : new Date();

    const chartHistory = history.map(h => ({
        date: h.Date ? String(h.Date).slice(0, 10) : '',
        close: h.Close,
        volume: h.Volume,
        type: 'Historical'
    }));

    const chartPrediction = prediction && prediction.forecast ? prediction.forecast.map(p => {
        const d = new Date(latestDate);
        d.setDate(d.getDate() + p.day);
        return {
            date: d.toISOString().slice(0, 10),
            predicted: p.price,
            predictedVol: p.volume,
            type: 'Predicted'
        };
    }) : [];

    let combinedData = [...chartHistory];
    if (chartHistory.length > 0 && chartPrediction.length > 0) {
        const lastHist = chartHistory[chartHistory.length - 1];
        combinedData[combinedData.length - 1] = {
            ...lastHist,
            predicted: lastHist.close,
            predictedVol: lastHist.volume
        };
        combinedData = [...combinedData, ...chartPrediction];
    }

    const latestClose = history.length > 0 ? (history[history.length - 1].Close || 0) : 0;
    const prevClose = history.length > 1 ? (history[history.length - 2].Close || latestClose) : latestClose;
    const change = latestClose - prevClose;
    const percentChange = prevClose !== 0 ? (change / prevClose) * 100 : 0;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white uppercase">{symbol}</h2>
                    <p className="text-gray-500 dark:text-gray-400">{t('stock.detailSub') || 'Advanced AI Analysis & Accurate Forecasting'}</p>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">{latestClose.toFixed(2)} TND</div>
                    <div className={cn("flex items-center justify-end text-sm font-medium", change >= 0 ? "text-green-600" : "text-red-600")}>
                        {change >= 0 ? <ArrowUp size={16} className="mr-1" /> : <ArrowDown size={16} className="mr-1" />}
                        {Math.abs(change).toFixed(2)} ({Math.abs(percentChange).toFixed(2)}%)
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Price Forecast Chart */}
                    <Card className="bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('stock.chartTitle') || 'Price Forecast'}</h3>
                            {analysis?.forecast_metrics?.price && (
                                <div className="text-[10px] text-gray-400 font-mono flex gap-3">
                                    <span>RMSE: {analysis.forecast_metrics.price.rmse || 'N/A'}</span>
                                    <span>MAE: {analysis.forecast_metrics.price.mae || 'N/A'}</span>
                                </div>
                            )}
                        </div>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={combinedData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={i18n.language === 'dark' ? '#374151' : '#f0f0f0'} />
                                    <XAxis dataKey="date" stroke="#888888" minTickGap={40} tick={{ fontSize: 10 }} />
                                    <YAxis domain={['auto', 'auto']} stroke="#888888" tick={{ fontSize: 10 }} />
                                    <Tooltip contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }} />
                                    <Legend wrapperStyle={{ fontSize: 10 }} />
                                    <Line type="monotone" dataKey="close" name={t('stock.historical') || 'Historical Price'} stroke="#2563eb" strokeWidth={3} dot={false} />
                                    <Line type="monotone" dataKey="predicted" name={t('stock.predicted') || 'AI Forecast'} stroke="#ec4899" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* Volume Forecast Chart */}
                    <Card className="bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">{t('stock.volumeForecast') || 'Liquidity & Volume Projection'}</h3>
                        <div className="h-32">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={combinedData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={i18n.language === 'dark' ? '#374151' : '#f0f0f0'} />
                                    <XAxis dataKey="date" hide />
                                    <YAxis hide />
                                    <Tooltip />
                                    <Line type="step" dataKey="volume" name="Volume" stroke="#94a3b8" fill="#94a3b8" strokeWidth={1} dot={false} />
                                    <Line type="step" dataKey="predictedVol" name="Pred Volume" stroke="#fbbf24" strokeWidth={2} strokeDasharray="3 3" dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-6">
                    {/* Agent Insight Panel */}
                    {analysis && (
                        <Card className={cn("border shadow-lg",
                            (analysis.recommendation || "").includes('BUY') ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800" :
                                (analysis.recommendation || "").includes('SELL') ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800" : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700")}>
                            <CardHeader>
                                <CardTitle className={cn("flex items-center justify-between text-xl",
                                    (analysis.recommendation || "").includes('BUY') ? "text-green-800 dark:text-green-300" :
                                        (analysis.recommendation || "").includes('SELL') ? "text-red-800 dark:text-red-300" : "text-gray-800 dark:text-gray-200")}>
                                    <div className="flex items-center gap-2">
                                        <Activity size={24} /> {analysis.recommendation}
                                    </div>
                                    <span className="text-sm opacity-60 font-mono">{analysis.confidence}%</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm font-medium opacity-90">{t('stock.reasoning')}:</p>
                                <ul className="text-sm space-y-2">
                                    {analysis.reasoning && analysis.reasoning.map((r, i) => (
                                        <li key={i} className="flex gap-2 text-gray-700 dark:text-gray-300">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                            {r}
                                        </li>
                                    ))}
                                </ul>

                                {analysis?.indicators && (
                                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                                        <IndicatorStat label="RSI (14)" value={analysis.indicators.rsi ?? 'N/A'} />
                                        <IndicatorStat label="MACD" value={analysis.indicators.macd ?? 'N/A'} />
                                        <IndicatorStat label="Volume Index" value={analysis.indicators.volume_ratio ? (analysis.indicators.volume_ratio + "x") : 'N/A'} />
                                        <IndicatorStat label="Sentiment" value={analysis.indicators.sentiment_score ?? 'N/A'} />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Trade Panel */}
                    <Card className="border-indigo-100 dark:border-indigo-900 shadow-md">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-indigo-900 dark:text-indigo-300 flex items-center gap-2 text-lg">
                                <DollarSign size={20} /> {t('trade.title') || "Execute Trade"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <TradePanel symbol={symbol} currentPrice={latestClose} onTradeComplete={() => {
                                alert(t('trade.success') || "Transaction Successful!");
                            }} />
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Sentiment Detail Section */}
            {analysis && analysis.sentiment && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2 dark:text-white">
                                <Activity size={20} className="text-blue-500" />
                                {t('stock.sentiment') || "Market Sentiment"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-8">
                                <div className="relative w-32 h-32 flex items-center justify-center">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100 dark:text-gray-700" />
                                        <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent"
                                            strokeDasharray={364}
                                            strokeDashoffset={364 - (364 * (analysis.sentiment.score + 1) / 2)}
                                            className={cn(analysis.sentiment.score > 0.1 ? "text-green-500" : analysis.sentiment.score < -0.1 ? "text-red-500" : "text-yellow-500")}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-2xl font-bold dark:text-white">{analysis.sentiment.score}</span>
                                        <span className="text-[10px] text-gray-500 uppercase">{t('stock.score')}</span>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className={cn("text-2xl font-bold mb-2",
                                        analysis.sentiment.score > 0.1 ? "text-green-600 dark:text-green-400" :
                                            analysis.sentiment.score < -0.1 ? "text-red-600 dark:text-red-400" : "text-yellow-600 dark:text-yellow-400")}>
                                        {analysis.sentiment.label}
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm italic">
                                        "{analysis.sentiment.news && analysis.sentiment.news[0] ? analysis.sentiment.news[0].title : ''}"
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2 dark:text-white">
                                <Newspaper size={20} className="text-blue-500" />
                                {t('stock.news') || "Latest Headines"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {analysis.sentiment.news && analysis.sentiment.news.map((item, idx) => (
                                    <div key={idx} className="border-b dark:border-gray-700 last:border-0 pb-3 last:pb-0">
                                        <div className="text-sm font-semibold hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer dark:text-gray-100">{item.title}</div>
                                        <div className="flex justify-between items-center mt-1 text-[11px] text-gray-400 uppercase">
                                            <span>{item.source}</span>
                                            <span>{item.date}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

const IndicatorStat = ({ label, value }) => (
    <div className="p-2 bg-white/50 dark:bg-gray-900/50 rounded border border-gray-100 dark:border-gray-800">
        <div className="text-[9px] uppercase font-bold text-gray-400 mb-1">{label}</div>
        <div className="text-sm font-bold text-gray-900 dark:text-gray-100">{value}</div>
    </div>
);

const TradePanel = ({ symbol, currentPrice, onTradeComplete }) => {
    const { t } = useTranslation();
    const [quantity, setQuantity] = useState(1);
    const [type, setType] = useState('BUY');
    const [loading, setLoading] = useState(false);

    const handleTrade = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/portfolio/transaction', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type, symbol,
                    quantity: parseInt(quantity),
                    price: currentPrice
                })
            });
            if (!res.ok) alert("Transaction Failed");
            else if (onTradeComplete) onTradeComplete();
        } catch (e) {
            alert("Network Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <button onClick={() => setType('BUY')} className={cn("flex-1 py-1.5 rounded font-medium", type === 'BUY' ? "bg-green-600 text-white" : "bg-gray-100 dark:bg-gray-800")}>{t('trade.buy')}</button>
                <button onClick={() => setType('SELL')} className={cn("flex-1 py-1.5 rounded font-medium", type === 'SELL' ? "bg-red-600 text-white" : "bg-gray-100 dark:bg-gray-800")}>{t('trade.sell')}</button>
            </div>
            <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} className="w-full p-2 rounded border dark:bg-gray-900 dark:border-gray-700" />
            <button onClick={handleTrade} disabled={loading} className="w-full py-2 bg-indigo-600 text-white rounded font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all">{loading ? t('common.loading') : t('trade.execute')}</button>
        </div>
    );
};

export default StockDetail;

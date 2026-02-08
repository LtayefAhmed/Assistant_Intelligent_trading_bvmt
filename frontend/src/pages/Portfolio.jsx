import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, PieChart as PieIcon, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const Portfolio = () => {
    const { t } = useTranslation();
    const [portfolio, setPortfolio] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [testAmount, setTestAmount] = useState('');
    const [adviceLoading, setAdviceLoading] = useState(false);
    const [showAdvice, setShowAdvice] = useState(false);

    const fetchPortfolioData = async () => {
        try {
            const pRes = await fetch('/api/portfolio');
            if (pRes.ok) setPortfolio(await pRes.json());
        } catch (err) {
            console.error("Portfolio fetch error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getAIAdvice = async () => {
        setAdviceLoading(true);
        setShowAdvice(true);
        try {
            const profile = localStorage.getItem('userProfile') || 'Moderate';
            const sRes = await fetch(`/api/portfolio/optimization?profile=${profile}${testAmount ? `&amount=${testAmount}` : ''}`);
            if (sRes.ok) {
                const sData = await sRes.json();
                setSuggestions(sData.suggestions || []);
            }
        } catch (err) {
            console.error("Advice fetch error:", err);
        } finally {
            setAdviceLoading(false);
        }
    };

    useEffect(() => {
        fetchPortfolioData();
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="text-gray-500 animate-pulse">{t('common.loading') || "Loading Portfolio..."}</p>
        </div>
    );
    if (!portfolio || error) return (
        <div className="p-8 text-center space-y-4">
            <div className="text-red-500 dark:text-red-400 font-bold text-xl">{t('common.error') || "Portfolio Error"}</div>
            {error && <p className="text-sm text-gray-500 font-mono bg-gray-50 dark:bg-gray-900 p-2 rounded">{error}</p>}
            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all">
                Try Again
            </button>
        </div>
    );

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

    const pieData = portfolio.holdings.map(h => ({
        name: h.symbol,
        value: h.market_value
    }));

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{t('portfolio.title')}</h2>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Value</CardTitle>
                        <DollarSign className="text-gray-400" size={20} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{portfolio.total_value.toLocaleString()} TND</div>
                        <p className="text-xs text-gray-500">Current Market Value</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Cost</CardTitle>
                        <PieIcon className="text-gray-400" size={20} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{portfolio.total_cost.toLocaleString()} TND</div>
                        <p className="text-xs text-gray-500">Invested Capital</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total P/L</CardTitle>
                        {portfolio.total_pl >= 0 ?
                            <TrendingUp className="text-green-500" size={20} /> :
                            <TrendingDown className="text-red-500" size={20} />
                        }
                    </CardHeader>
                    <CardContent>
                        <div className={cn("text-2xl font-bold", portfolio.total_pl >= 0 ? "text-green-600" : "text-red-600")}>
                            {portfolio.total_pl >= 0 ? '+' : ''}{portfolio.total_pl.toLocaleString()} TND
                        </div>
                        <p className="text-xs text-gray-500">Unrealized Gain/Loss</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Holdings Table */}
                <div className="lg:col-span-2">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Current Holdings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b text-left text-gray-500">
                                            <th className="pb-3">Symbol</th>
                                            <th className="pb-3 text-right">Qty</th>
                                            <th className="pb-3 text-right">Avg Cost</th>
                                            <th className="pb-3 text-right">Current Price</th>
                                            <th className="pb-3 text-right">Value</th>
                                            <th className="pb-3 text-right">P/L</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {portfolio.holdings.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="py-4 text-center text-gray-500">No holdings yet.</td>
                                            </tr>
                                        ) : (
                                            portfolio.holdings.map(h => (
                                                <tr key={h.symbol} className="hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors">
                                                    <td className="py-3 font-medium">
                                                        <Link to={`/stock/${encodeURIComponent(h.symbol)}`} className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">
                                                            {h.symbol}
                                                        </Link>
                                                    </td>
                                                    <td className="py-3 text-right">{h.quantity}</td>
                                                    <td className="py-3 text-right">{h.avg_cost.toFixed(2)}</td>
                                                    <td className="py-3 text-right">{h.current_price.toFixed(2)}</td>
                                                    <td className="py-3 text-right font-medium">{h.market_value.toLocaleString()}</td>
                                                    <td className={cn("py-3 text-right font-medium", h.unrealized_pl >= 0 ? "text-green-600" : "text-red-600")}>
                                                        {h.unrealized_pl >= 0 ? '+' : ''}{h.unrealized_pl.toFixed(2)}
                                                        <span className="text-xs ml-1 opacity-70">({h.pl_percent.toFixed(2)}%)</span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}

                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Allocation Chart */}
                <div>
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Allocation</CardTitle>
                        </CardHeader>
                        <CardContent className="h-64">
                            {portfolio.holdings.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell - ${index} `} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(val) => val.toLocaleString() + " TND"} />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-400">
                                    No Data
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* AI Optimization Suggestions (New Requirement) */}
                <Card className="border-indigo-100 dark:border-indigo-950 bg-gradient-to-br from-white to-indigo-50/30 dark:from-gray-800 dark:to-indigo-950/10 shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-indigo-900 dark:text-indigo-400">
                            <Activity size={20} /> {t('portfolio.optimizationTitle') || "AI Strategy Advisor"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Interactive Amount Input */}
                        <div className="mb-4 flex gap-2">
                            <input
                                type="number"
                                placeholder="Enter amount to invest (e.g. 5000)"
                                value={testAmount}
                                onChange={(e) => setTestAmount(e.target.value)}
                                className="flex-1 p-2 text-sm rounded-lg border border-indigo-200 dark:bg-gray-900 dark:border-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                                onClick={getAIAdvice}
                                disabled={adviceLoading}
                                className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-sm disabled:opacity-50"
                            >
                                {adviceLoading ? "..." : "Get Advice"}
                            </button>
                        </div>
                        <div className="space-y-3">
                            {adviceLoading ? (
                                <div className="flex items-center justify-center p-4">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                                </div>
                            ) : showAdvice && suggestions.length > 0 ? (
                                suggestions.map((s, i) => (
                                    <div key={i} className="flex items-start gap-3 p-3 bg-white/60 dark:bg-gray-900/40 rounded-lg border border-indigo-50 dark:border-indigo-900/50 text-sm">
                                        <div className="mt-1 p-1 bg-indigo-100 dark:bg-indigo-900 rounded-full text-indigo-600 dark:text-indigo-400">
                                            <TrendingUp size={12} />
                                        </div>
                                        <span className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{s}</span>
                                    </div>
                                ))
                            ) : showAdvice ? (
                                <p className="text-sm text-gray-500 italic p-2 text-center">No specific optimizations found for this amount.</p>
                            ) : (
                                <p className="text-sm text-gray-400 italic p-2 text-center opacity-70">Enter an amount and click "Get Advice" to see AI recommendations.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Transactions */}
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">{t('portfolio.transactions') || "Activity Log"}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {portfolio.transactions.slice().reverse().map((t, i) => (
                                <div key={i} className="flex justify-between items-center border-b dark:border-gray-800 pb-2 last:border-0 last:pb-0">
                                    <div>
                                        <div className="font-semibold flex items-center gap-2">
                                            <span className={cn("px-2 py-0.5 rounded text-[10px] font-black tracking-tighter", t.type === 'BUY' ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400" : "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400")}>
                                                {t.type}
                                            </span>
                                            <span className="dark:text-gray-200">{t.symbol}</span>
                                        </div>
                                        <div className="text-[10px] text-gray-500 mt-1">{new Date(t.date).toLocaleDateString()} {new Date(t.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-gray-900 dark:text-gray-100">{t.quantity} @ {t.price.toFixed(2)}</div>
                                        <div className="text-[10px] text-gray-500 font-mono">Total: {t.total.toLocaleString()} TND</div>
                                    </div>
                                </div>
                            ))}
                            {portfolio.transactions.length === 0 && (
                                <div className="text-center text-gray-500 py-8 italic">No transaction history.</div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

        </div>
    );
};

export default Portfolio;

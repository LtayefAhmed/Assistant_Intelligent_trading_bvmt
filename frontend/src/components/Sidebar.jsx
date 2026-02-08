import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, AlertTriangle, PieChart, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';
import logo from '../assets/logo.png';

const Sidebar = () => {
    const { t } = useTranslation();

    const navItems = [
        { name: t('nav.dashboard'), path: '/', icon: LayoutDashboard },
        { name: t('nav.market'), path: '/market', icon: TrendingUp },
        { name: t('nav.portfolio'), path: '/portfolio', icon: PieChart },
        { name: t('nav.alerts'), path: '/alerts', icon: AlertTriangle },
        { name: t('nav.settings'), path: '/settings', icon: Settings },
    ];

    return (
        <aside className="w-64 bg-gray-900 dark:bg-gray-950 text-white min-h-screen p-4 flex flex-col border-r border-gray-800 dark:border-gray-900">
            <div className="mb-6 flex flex-col items-center justify-center gap-3">
                <div className="bg-white rounded-xl shadow-md p-2 inline-block">
                    <img
                        src={logo}
                        alt="BOURSETNA Logo"
                        className="h-auto object-contain"
                        style={{ width: '80px' }}
                    />
                </div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
                    BOURSETNA
                </h1>
            </div>

            <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                                isActive
                                    ? "bg-blue-600 dark:bg-blue-700 text-white shadow-lg shadow-blue-500/30"
                                    : "text-gray-400 dark:text-gray-500 hover:bg-gray-800 dark:hover:bg-gray-900 hover:text-white"
                            )
                        }
                    >
                        <item.icon size={20} />
                        <span className="font-medium">{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="mt-auto px-4 py-4 bg-gray-800 dark:bg-gray-900 rounded-lg">
                <p className="text-xs text-gray-400 dark:text-gray-500">Status: Connected</p>
                <div className="flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs font-mono text-gray-300 dark:text-gray-400">Live Data</span>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;

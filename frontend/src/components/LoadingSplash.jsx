import React, { useEffect, useState } from 'react';
import logo from "../assets/logo.png";
const LoadingSplash = ({ onLoadComplete }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => onLoadComplete && onLoadComplete(), 300);
                    return 100;
                }
                return prev + 10;
            });
        }, 150);

        return () => clearInterval(interval);
    }, [onLoadComplete]);

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-teal-900 flex items-center justify-center z-50">
            <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
                {/* Logo */}
                <div className="flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-teal-400 blur-2xl opacity-50 animate-pulse"></div>
                        <div className="relative bg-white backdrop-blur-sm p-1 rounded-3xl border border-white/20 shadow-2xl">
                            <img
                                src={logo}
                                alt="BOURSETNA Logo"
                                width="300px"
                                height="300px"
                            />
                        </div>
                    </div>
                </div>

                {/* Brand Name */}
                <div>
                    <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-teal-400 to-blue-400 animate-gradient">
                        BOURSETNA
                    </h1>
                    <p className="text-blue-200 text-lg mt-2 font-light tracking-wide">
                        Intelligent Trading Assistant
                    </p>
                </div>

                {/* Loading Bar */}
                <div className="w-80 mx-auto">
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                        <div
                            className="h-full bg-gradient-to-r from-blue-400 to-teal-400 transition-all duration-300 ease-out rounded-full shadow-lg shadow-blue-500/50"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <p className="text-blue-300 text-sm mt-3 font-medium">
                        Loading market data... {progress}%
                    </p>
                </div>


            </div>

            <style jsx>{`
                @keyframes gradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradient 3s ease infinite;
                }
            `}</style>
        </div>
    );
};

export default LoadingSplash;

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Zap,  } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ChatroomProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Chatroom({ isOpen, onClose }: ChatroomProps) {
    const [onlineUsers, setOnlineUsers] = useState(1);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Simulate random online users
        const interval = setInterval(() => {
            setOnlineUsers(prev => Math.max(1, prev + Math.floor(Math.random() * 3) - 1));
        }, 10000);
        
        return () => clearInterval(interval);
    }, []);

    if (!mounted) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />

                    {/* Chatroom Window - Full Height */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20 border border-green-200/60 dark:border-green-700/60 rounded-none lg:rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden m-0"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-green-200/60 dark:border-green-700/60 bg-green-100/50 dark:bg-green-900/30 backdrop-blur-sm flex-shrink-0">
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/25">
                                        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-green-900 shadow-lg animate-pulse" />
                                </div>
                                <div>
                                    <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                        Live Chat
                                    </h1>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 text-xs font-medium">
                                            <Zap className="w-3 h-3 mr-1" />
                                            {onlineUsers} Online
                                        </Badge>
                                        <div className="w-1 h-1 rounded-full bg-green-400" />
                                        <span className="text-xs text-green-600 dark:text-green-400">Real-time</span>
                                    </div>
                                </div>
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="rounded-xl hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 h-9 w-9 sm:h-10 sm:w-10 transition-all duration-200 hover:scale-110"
                            >
                                <X className="w-4 h-4 sm:w-5 sm:h-5" />
                            </Button>
                        </div>

                        {/* Chat Instructions */}
                        <div className="p-4 border-b border-green-200/60 dark:border-green-700/60 bg-amber-50/80 dark:bg-amber-900/20 flex-shrink-0">
                            <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-white text-xs font-bold">!</span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                                        Quick Start Guide
                                    </p>
                                    <p className="text-xs text-amber-700/80 dark:text-amber-300/80 mt-1">
                                        Enter any nickname to join the chat. No registration required!
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* tlk.io Chatroom Embed - Full Height */}
                        <div className="flex-1 min-h-0 overflow-hidden">
                            <iframe
                                src="https://tlk.io/optraverse"
                                className="w-full h-full border-0"
                                title="OptraVerse Live Chat"
                                loading="lazy"
                                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                                style={{ height: '100vh' }}
                            />
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-green-200/60 dark:border-green-700/60 bg-green-100/30 dark:bg-green-900/20 backdrop-blur-sm flex-shrink-0">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2 text-sm text-green-700 dark:text-green-300">
                                    <div className="flex items-center space-x-1">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                        <span className="text-xs font-medium">Live Chat Active</span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 text-xs text-green-600 dark:text-green-400">
                                    <span>Powered by tlk.io</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
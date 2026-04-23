import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Github, Users,  Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Giscus from '@giscus/react';
import { useTheme } from 'next-themes';

interface CommentsSectionProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CommentsSection({ isOpen, onClose }: CommentsSectionProps) {
    const [activeTab, setActiveTab] = useState('comments');
    const [mounted, setMounted] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    const giscusConfig = {
        repo: 'xunknownxunknown0/OptraVerse_Comments' as const,
        repoId: 'R_kgDOQWwsXQ',
        category: 'Announcements',
        categoryId: 'DIC_kwDOQWwsXc4Cx2Yg',
        mapping: 'pathname' as const,
        strict: '0' as const,
        reactionsEnabled: '1' as const,
        emitMetadata: '0' as const,
        inputPosition: 'bottom' as const,
        theme: theme === 'dark' ? 'dark' : 'light',
        lang: 'en',
        loading: 'lazy' as const,
        crossorigin: 'anonymous' as const,
        async: 'true' as const,
    };

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
                        className="fixed inset-0 bg-black/60 backdrop-blur-lg z-50"
                        onClick={onClose}
                    />

                    {/* Comments Window */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed inset-2 sm:inset-4 md:inset-8 lg:inset-12 xl:inset-20 2xl:inset-32 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900/20 border border-slate-200/80 dark:border-slate-700/60 rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex-shrink-0">
                            <div className="flex items-center space-x-3 sm:space-x-4">
                                <div className="relative">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                                        <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-900 shadow-lg animate-pulse" />
                                </div>
                                <div>
                                    <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                        Community Hub
                                    </h1>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-xs font-medium">
                                            <Github className="w-3 h-3 mr-1" />
                                            Live Discussions
                                        </Badge>
                                        <div className="w-1 h-1 rounded-full bg-slate-400" />
                                        <span className="text-xs text-slate-600 dark:text-slate-400">Powered by Giscus</span>
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

                        {/* Tabs Navigation */}
                        <div className="border-b border-slate-200/60 dark:border-slate-700/60 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm ">
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="w-full grid grid-cols-2 p-2 bg-transparent">
                                    <TabsTrigger 
                                        value="comments" 
                                        className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:border data-[state=active]:border-slate-200 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:border-slate-600 rounded-xl transition-all duration-200"
                                    >
                                        <MessageSquare className="w-4 h-4" />
                                        <span className="font-medium">Comments</span>
                                        <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                                            Live
                                        </Badge>
                                    </TabsTrigger>
                                    <TabsTrigger 
                                        value="about" 
                                        className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:border data-[state=active]:border-slate-200 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:border-slate-600 rounded-xl transition-all duration-200"
                                    >
                                        <Users className="w-4 h-4" />
                                        <span className="font-medium">About</span>
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>

                        {/* Main Content Area - This is the scrollable container */}
                        <div className="flex-1 overflow-hidden">
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
                                
                                {/* Comments Tab */}
                                <TabsContent value="comments" className="h-full m-0 p-0 data-[state=active]:block">
                                    <div className="h-full flex flex-col">
                                        {/* Giscus Content - Scrollable Area */}
                                        <div className="flex-1 min-h-0 overflow-hidden">
                                            <div className="h-full overflow-y-auto custom-scrollbar p-4">
                                                <div className="min-h-full bg-white/50 dark:bg-slate-800/30 rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-4">
                                                    <Giscus
                                                        {...giscusConfig}
                                                        key="comments"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* About Tab */}
                                <TabsContent value="about" className="h-full m-0 p-0 overflow-hidden data-[state=active]:block">
                                    <div className="h-full overflow-y-auto custom-scrollbar">
                                        <div className="p-4 sm:p-6 space-y-6">
                                            {/* Feature Cards */}
                                            <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
                                                <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/60 dark:border-blue-700/60 shadow-sm hover:shadow-md transition-shadow duration-200">
                                                    <CardHeader className="pb-3">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                                                                <Github className="w-5 h-5 text-white" />
                                                            </div>
                                                            <CardTitle className="text-lg text-blue-900 dark:text-blue-100">
                                                                GitHub Powered
                                                            </CardTitle>
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <p className="text-sm text-blue-800/80 dark:text-blue-200/80 leading-relaxed">
                                                            Real-time discussions powered by GitHub. Every comment becomes a GitHub discussion thread, 
                                                            ensuring transparency and permanence.
                                                        </p>
                                                    </CardContent>
                                                </Card>

                                                <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/60 dark:border-green-700/60 shadow-sm hover:shadow-md transition-shadow duration-200">
                                                    <CardHeader className="pb-3">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25">
                                                                <Users className="w-5 h-5 text-white" />
                                                            </div>
                                                            <CardTitle className="text-lg text-green-900 dark:text-green-100">
                                                                Community First
                                                            </CardTitle>
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <p className="text-sm text-green-800/80 dark:text-green-200/80 leading-relaxed">
                                                            Join thousands of job seekers, recruiters, and career enthusiasts sharing experiences, 
                                                            opportunities, and valuable insights.
                                                        </p>
                                                    </CardContent>
                                                </Card>
                                            </div>

                                            {/* How it Works */}
                                            <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700/50 border-slate-200/60 dark:border-slate-600/60">
                                                <CardHeader>
                                                    <CardTitle className="flex items-center text-lg">
                                                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-purple-500/25">
                                                            <Star className="w-4 h-4 text-white" />
                                                        </div>
                                                        How It Works
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    {[
                                                        {
                                                            step: "1",
                                                            title: "GitHub Account",
                                                            description: "Sign in with your GitHub account to participate in discussions.",
                                                            color: "from-blue-500 to-blue-600"
                                                        },
                                                        {
                                                            step: "2",
                                                            title: "Join Conversations",
                                                            description: "Comment, react, and engage with community members in real-time.",
                                                            color: "from-purple-500 to-purple-600"
                                                        },
                                                        {
                                                            step: "3",
                                                            title: "Build Reputation",
                                                            description: "Earn recognition through valuable contributions and helpful insights.",
                                                            color: "from-pink-500 to-pink-600"
                                                        }
                                                    ].map((item, index) => (
                                                        <div key={index} className="flex items-start space-x-4 p-3 rounded-lg bg-white/50 dark:bg-slate-700/30 hover:bg-white/70 dark:hover:bg-slate-700/50 transition-colors duration-200">
                                                            <div className={`w-8 h-8 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg`}>
                                                                <span className="text-white font-bold text-sm">{item.step}</span>
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-slate-900 dark:text-white text-sm">{item.title}</p>
                                                                <p className="text-slate-600 dark:text-slate-400 text-xs mt-1">{item.description}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </div>
                                </TabsContent>

                              
                            </Tabs>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex-shrink-0">
                            <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
                                <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                                    <div className="flex items-center space-x-1 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                        <span className="text-xs font-medium text-green-700 dark:text-green-300">Live</span>
                                    </div>
                                    <span>Connected to GitHub Discussions</span>
                                </div>
                                <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-500">
                                    <span>Secure • Transparent • Community-Driven</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Custom Scrollbar Styles */}
                    <style  >{`
                        .custom-scrollbar {
                            scrollbar-width: thin;
                            scrollbar-color: rgb(148 163 184) transparent;
                        }
                        .custom-scrollbar::-webkit-scrollbar {
                            width: 8px;
                        }
                        .custom-scrollbar::-webkit-scrollbar-track {
                            background: transparent;
                            border-radius: 4px;
                        }
                        .custom-scrollbar::-webkit-scrollbar-thumb {
                            background: rgb(148 163 184);
                            border-radius: 4px;
                        }
                        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                            background: rgb(100 116 139);
                        }
                        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                            background: rgb(71 85 105);
                        }
                        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                            background: rgb(100 116 139);
                        }
                    `}</style>
                </>
            )}
        </AnimatePresence>
    );
}
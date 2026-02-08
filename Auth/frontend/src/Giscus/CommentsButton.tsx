import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CommentsSection from './CommentsSection';

export default function CommentsButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [notification, setNotification] = useState(true);

    const toggleComments = () => {
        setIsOpen(!isOpen);
        if (notification) {
            setNotification(false);
        }
    };

    return (
        <>
            {/* Comments Button */}
            <motion.div
                className="fixed bottom-4 right-6 z-40"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 2.5 // Staggered appearance after chatbot
                }}
            >
                <Button
                    onClick={toggleComments}
                    className="relative w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 group"
                    size="icon"
                >
                    <AnimatePresence>
                        {notification && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                className="absolute -top-1 -right-1"
                            >
                                <Badge className="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full animate-pulse">
                                    <Users className="w-2 h-2" />
                                </Badge>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.div
                        animate={{
                            rotate: isOpen ? 90 : 0,
                            scale: isOpen ? 1.1 : 1
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        {isOpen ? (
                            <X className="w-6 h-6 text-white" />
                        ) : (
                            <MessageSquare className="w-6 h-6 text-white" />
                        )}
                    </motion.div>

                    {/* Tooltip */}
                    <div className="absolute -top-12 right-0 bg-slate-900 text-white text-xs py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        Community Discussions
                        <div className="absolute bottom-0 right-3 transform translate-y-1/2 rotate-45 w-2 h-2 bg-slate-900"></div>
                    </div>
                </Button>
            </motion.div>

            {/* Comments Section */}
            <CommentsSection isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
}
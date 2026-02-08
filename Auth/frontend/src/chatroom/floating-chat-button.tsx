import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Chatroom from './chatroom';
import { motion } from "framer-motion";

export default function FloatingChatButton() {
    const [isChatOpen, setIsChatOpen] = useState(false);
    return (
        <>
            {/* Floating Button */}
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
                    onClick={() => setIsChatOpen(true)}
                    className="relative h-14 w-14 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-2xl shadow-green-500/25 border-0"
                    size="icon"
                >
                    <MessageCircle className="w-6 h-6 text-white" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse">
                        <span className="sr-only">Live</span>
                    </div>
                </Button>
            </motion.div>
            {/* Chatroom Component */}
            {isChatOpen && (
                <div className="fixed inset-0 z-50">
                    <Chatroom
                        isOpen={isChatOpen}
                        onClose={() => setIsChatOpen(false)}
                    />
                </div>
            )}
        </>
    );
}
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { PlayerRole } from '@/app/actions/game';
import { Eye, EyeOff } from 'lucide-react';

interface RoleRevealProps {
    players: PlayerRole[];
    onComplete: () => void;
}

export default function RoleReveal({ players, onComplete }: RoleRevealProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isRevealing, setIsRevealing] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(true); // "Pass phone to player X"

    const currentPlayer = players[currentIndex];
    const isLastPlayer = currentIndex === players.length - 1;

    const handleStartReveal = () => {
        setShowConfirmation(false);
    };

    const handleNext = () => {
        setIsRevealing(false);
        if (isLastPlayer) {
            onComplete();
        } else {
            setCurrentIndex(prev => prev + 1);
            setShowConfirmation(true);
        }
    };

    return (
        <div className="w-full max-w-md h-[80vh] flex flex-col items-center justify-center p-6 text-center">
            <AnimatePresence mode="wait">
                {showConfirmation ? (
                    <motion.div
                        key="wait"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="space-y-8"
                    >
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold text-indigo-400">{players[currentIndex].name}</h2>
                            <p className="text-slate-300 text-xl">Toma el teléfono</p>
                        </div>
                        <div className="text-6xl">📱</div>
                        <Button size="xl" onClick={handleStartReveal} className="w-full">
                            ¡Soy yo!
                        </Button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="reveal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full h-full flex flex-col justify-between py-10"
                    >
                        <div className="space-y-2">
                            <h3 className="text-slate-400">{currentPlayer.name}</h3>
                            <p className="text-sm text-slate-500">Mantén presionado para ver tu rol</p>
                        </div>

                        <button
                            className="flex-1 my-8 rounded-3xl bg-slate-800 border-2 border-slate-700 flex items-center justify-center active:bg-slate-700 transition-colors touch-none select-none"
                            onPointerDown={() => setIsRevealing(true)}
                            onPointerUp={() => setIsRevealing(false)}
                            onPointerLeave={() => setIsRevealing(false)}
                            style={{ WebkitUserSelect: 'none' }} // Prevent text selection on hold
                        >
                            <AnimatePresence mode="wait">
                                {isRevealing ? (
                                    <motion.div
                                        key="content"
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.5, opacity: 0 }}
                                        className="space-y-4"
                                    >
                                        {currentPlayer.isImpostor ? (
                                            <>
                                                <span className="text-6xl">🕵️</span>
                                                <h2 className="text-4xl font-extrabold text-red-500 tracking-wider">
                                                    IMPOSTOR
                                                </h2>
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-6xl">⚽</span>
                                                <h2 className="text-4xl font-extrabold text-green-400 tracking-wider">
                                                    {currentPlayer.word}
                                                </h2>
                                            </>
                                        )}
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="hidden"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex flex-col items-center text-slate-500"
                                    >
                                        <Eye className="w-16 h-16 mb-4 opacity-50" />
                                        <span className="text-lg font-medium">Mantén presionado</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </button>

                        <Button
                            size="lg"
                            variant="secondary"
                            onClick={handleNext}
                            fullWidth
                        >
                            {isLastPlayer ? '¡A Jugar!' : 'Listo, siguiente jugador'}
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

interface GameActiveProps {
    secretWord: string;
    onReset: () => void;
}

export default function GameActive({ secretWord, onReset }: GameActiveProps) {
    const [revealed, setRevealed] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md flex flex-col items-center justify-center space-y-12 p-6 text-center"
        >
            <div className="space-y-4">
                <h1 className="text-5xl font-black bg-gradient-to-tr from-green-400 to-emerald-600 bg-clip-text text-transparent transform -skew-y-3">
                    ¡A JUGAR!
                </h1>
                <p className="text-slate-400 text-lg">Debaten quién es el impostor.</p>
            </div>

            <div className="w-full p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
                <h3 className="text-slate-500 font-medium">Palabra Secreta</h3>

                {revealed ? (
                    <motion.div
                        initial={{ filter: 'blur(10px)' }}
                        animate={{ filter: 'blur(0px)' }}
                        className="text-4xl font-bold text-white"
                    >
                        {secretWord}
                    </motion.div>
                ) : (
                    <div className="h-12 flex items-center justify-center">
                        <span className="text-slate-700 text-sm">Oculta</span>
                    </div>
                )}

                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setRevealed(!revealed)}
                    className="w-full"
                >
                    {revealed ? 'Ocultar' : 'Ver Palabra (Fin del juego)'}
                </Button>
            </div>

            <Button
                variant="primary"
                size="xl"
                fullWidth
                onClick={onReset}
                className="bg-indigo-600 hover:bg-indigo-500"
            >
                Nueva Partida
            </Button>
        </motion.div>
    );
}

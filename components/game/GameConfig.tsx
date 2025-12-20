'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { getCategories, getDifficulties, startGame, PlayerRole } from '@/app/actions/game';

interface GameConfigProps {
    onStart: (data: { players: PlayerRole[]; secretWord: string }) => void;
}

export default function GameConfig({ onStart }: GameConfigProps) {
    const [categories, setCategories] = useState<string[]>([]);
    const [difficulties, setDifficulties] = useState<string[]>([]);

    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('');
    const [playerCount, setPlayerCount] = useState(4);
    const [impostorCount, setImpostorCount] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Initial fetch
    useEffect(() => {
        getCategories().then(setCategories).catch(console.error);
    }, []);

    // Fetch difficulties when category changes
    useEffect(() => {
        if (selectedCategory) {
            getDifficulties(selectedCategory).then(d => {
                setDifficulties(d);
                if (d.length > 0) setSelectedDifficulty(d[0]);
            });
        } else {
            setDifficulties([]);
        }
    }, [selectedCategory]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (impostorCount >= playerCount) {
            setError('Debe haber menos impostores que jugadores.');
            return;
        }

        setLoading(true);
        try {
            const data = await startGame({
                category: selectedCategory,
                difficulty: selectedDifficulty,
                players: playerCount,
                impostors: impostorCount
            });
            onStart(data);
        } catch (err: any) {
            setError(err.message || 'Error al iniciar el juego');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md space-y-6 bg-slate-900/50 p-6 rounded-2xl backdrop-blur-sm border border-slate-800"
        >
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    El Impostor
                </h1>
                <p className="text-slate-400">Configura tu partida</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Jugadores"
                        type="number"
                        min={3}
                        max={20}
                        value={playerCount}
                        onChange={(e) => setPlayerCount(Number(e.target.value))}
                    />
                    <Input
                        label="Impostores"
                        type="number"
                        min={1}
                        max={playerCount - 1}
                        value={impostorCount}
                        onChange={(e) => setImpostorCount(Number(e.target.value))}
                    />
                </div>

                <Select
                    label="Categoría"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    options={categories.map(c => ({ value: c, label: c }))}
                    required
                />

                <Select
                    label="Dificultad"
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    options={difficulties.map(d => ({ value: d, label: d }))}
                    disabled={!selectedCategory}
                    required
                />

                {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-200 text-sm">
                        {error}
                    </div>
                )}

                <Button
                    type="submit"
                    fullWidth
                    size="lg"
                    variant="primary"
                    disabled={loading || !selectedCategory}
                    className="shadow-lg shadow-indigo-500/20"
                >
                    {loading ? 'Preparando...' : 'JUGAR'}
                </Button>
            </form>
        </motion.div>
    );
}

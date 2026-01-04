'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { getCategories, getDifficulties, startGame, PlayerRole } from '@/app/actions/game';
import { selectStartingPlayerSequential, selectStartingPlayerWeighted } from '@/lib/playerStartCounter';

interface GameConfigProps {
    onStart: (data: { players: PlayerRole[]; secretWord: string; category: string }) => void;
}

export default function GameConfig({ onStart }: GameConfigProps) {
    const [categories, setCategories] = useState<string[]>([]);
    const [difficulties, setDifficulties] = useState<string[]>([]);

    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('');
    const [startingOrder, setStartingOrder] = useState<'sequential' | 'random'>('sequential');
    const [playerCount, setPlayerCount] = useState(4);
    const [impostorCount, setImpostorCount] = useState(1);
    const [playerNames, setPlayerNames] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);

    // Initial fetch
    useEffect(() => {
        getCategories().then(setCategories).catch(console.error);
    }, []);

    // Load settings from localStorage on mount
    useEffect(() => {
        try {
            const savedPlayers = localStorage.getItem('impostor_game_players');
            const savedImpostors = localStorage.getItem('impostor_game_impostors');
            const savedNames = localStorage.getItem('impostor_game_names');
            const savedCategory = localStorage.getItem('impostor_game_category');
            const savedDifficulty = localStorage.getItem('impostor_game_difficulty');
            const savedOrder = localStorage.getItem('impostor_game_order');

            if (savedPlayers) setPlayerCount(Number(savedPlayers));
            if (savedImpostors) setImpostorCount(Number(savedImpostors));
            if (savedNames) {
                try {
                    setPlayerNames(JSON.parse(savedNames));
                } catch (e) {
                    console.error('Error parsing saved names', e);
                }
            }
            if (savedCategory) setSelectedCategory(savedCategory);

            // Note: Difficulty handling is partly in the category effect, but we set it here too
            if (savedDifficulty) setSelectedDifficulty(savedDifficulty);
            if (savedOrder === 'random' || savedOrder === 'sequential') setStartingOrder(savedOrder);
        } catch (e) {
            console.error('Error loading settings', e);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    // Save settings to localStorage when they change - ONLY after loading
    useEffect(() => {
        if (!isLoaded) return;
        localStorage.setItem('impostor_game_players', String(playerCount));
    }, [playerCount, isLoaded]);

    useEffect(() => {
        if (!isLoaded) return;
        localStorage.setItem('impostor_game_impostors', String(impostorCount));
    }, [impostorCount, isLoaded]);

    useEffect(() => {
        if (!isLoaded) return;
        localStorage.setItem('impostor_game_names', JSON.stringify(playerNames));
    }, [playerNames, isLoaded]);

    useEffect(() => {
        if (!isLoaded) return;
        if (selectedCategory) localStorage.setItem('impostor_game_category', selectedCategory);
    }, [selectedCategory, isLoaded]);

    useEffect(() => {
        if (!isLoaded) return;
        if (selectedDifficulty) localStorage.setItem('impostor_game_difficulty', selectedDifficulty);
    }, [selectedDifficulty, isLoaded]);

    useEffect(() => {
        if (!isLoaded) return;
        localStorage.setItem('impostor_game_order', startingOrder);
    }, [startingOrder, isLoaded]);

    // Sync player names with player count
    useEffect(() => {
        // Only run sync details if we are loaded, OR strictly rely on defaults.
        // If we are loading, we explicitly setNames.
        // However, if we change playerCount manually, we want this to run.
        if (!isLoaded) return;

        setPlayerNames(prev => {
            const newNames = [...prev];
            // If we need more names
            if (playerCount > prev.length) {
                for (let i = prev.length; i < playerCount; i++) {
                    newNames.push(`Jugador ${i + 1}`);
                }
            }
            // If we need fewer names
            else if (playerCount < prev.length) {
                // If we are cutting off, we just slice
                newNames.length = playerCount;
            }
            return newNames;
        });
    }, [playerCount, isLoaded]);

    // Fetch difficulties when category changes
    useEffect(() => {
        if (selectedCategory) {
            getDifficulties(selectedCategory).then(d => {
                setDifficulties(d);
                // Try to keep selected difficulty if valid, otherwise select first
                // We use a functional update or check current state to decide
                // But we can't easily access the "latest" selectedDifficulty inside this callback without deps or refs
                // However, we can use the saved value from localStorage if we want to be persistent
                // But simplified: default to first, unless we just loaded a saved one?
                // The issue: "Load settings" runs once. "Fetch difficulties" runs on category change.
                // If I load category "A", this effect runs. It fetches diffs.
                // Then it sets difficulty to d[0].
                // IF I had a saved difficulty "Hard", it gets overwritten by d[0] unless I check.

                // Let's improve this logic:
                // Check if the current selectedDifficulty (which might be from localStorage) is in the new list d.
                // But `selectedDifficulty` state might still be empty if the load effect hasn't run or if it ran before.
                // Actually, if load effect runs first, `selectedCategory` and `selectedDifficulty` are set.
                // Then `selectedCategory` change triggers this effect.
                // We need to check if we should override.

                setSelectedDifficulty(prev => {
                    if (d.includes(prev)) return prev;
                    if (d.includes(localStorage.getItem('impostor_game_difficulty') || '')) {
                        return localStorage.getItem('impostor_game_difficulty') || d[0];
                    }
                    return d.length > 0 ? d[0] : '';
                });
            });
        } else {
            setDifficulties([]);
        }
    }, [selectedCategory]);

    const handleNameChange = (index: number, value: string) => {
        const newNames = [...playerNames];
        newNames[index] = value;
        setPlayerNames(newNames);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (impostorCount >= playerCount) {
            setError('Debe haber menos impostores que jugadores.');
            return;
        }

        // Validate unique names
        // Normalize names (trim) for comparison, but keep original for display if we wanted to be strict
        // Here we just check exact matches for simplicity, or maybe case-insensitive?
        // Let's do case-insensitive trim check for better UX
        const normalizedNames = playerNames.map(n => n.trim().toLowerCase());
        const uniqueNames = new Set(normalizedNames);
        if (uniqueNames.size !== normalizedNames.length) {
            setError('Los nombres de los jugadores deben ser únicos.');
            return;
        }

        setLoading(true);
        try {
            // Determine starting player index based on mode
            let startingPlayerIndex = 0;
            if (startingOrder === 'sequential') {
                startingPlayerIndex = selectStartingPlayerSequential(playerNames);
            } else {
                startingPlayerIndex = selectStartingPlayerWeighted(playerNames);
            }

            // Rotate player names so the selected player is first
            let rotatedPlayerNames = playerNames;
            if (startingPlayerIndex > 0) {
                const firstPart = playerNames.slice(startingPlayerIndex);
                const secondPart = playerNames.slice(0, startingPlayerIndex);
                rotatedPlayerNames = [...firstPart, ...secondPart];
            }

            const data = await startGame({
                category: selectedCategory,
                difficulty: selectedDifficulty,
                players: playerCount,
                impostors: impostorCount,
                playerNames: rotatedPlayerNames,
                startingOrder: startingOrder
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
            className="w-full max-w-sm space-y-4 bg-slate-900/50 p-4 rounded-2xl backdrop-blur-sm border border-slate-800 my-4"
        >
            <div className="text-center space-y-1">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    El Impostor
                </h1>
                <p className="text-slate-400 text-sm">Configura tu partida</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <Input
                        label="Jugadores"
                        type="number"
                        min={3}
                        max={20}
                        value={playerCount}
                        onChange={(e) => setPlayerCount(Number(e.target.value))}
                        className="py-2 text-base"
                    />
                    <Input
                        label="Impostores"
                        type="number"
                        min={1}
                        max={playerCount - 1}
                        value={impostorCount}
                        onChange={(e) => setImpostorCount(Number(e.target.value))}
                        className="py-2 text-base"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-300">Nombres</label>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                        {playerNames.map((name, index) => (
                            <Input
                                key={index}
                                value={name}
                                onChange={(e) => handleNameChange(index, e.target.value)}
                                placeholder={`Jugador ${index + 1}`}
                                className="bg-slate-800/50 py-1.5 text-sm"
                            />
                        ))}
                    </div>
                </div>

                <Select
                    label="Categoría"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    options={categories.map(c => ({ value: c, label: c }))}
                    required
                    className="py-2 text-base"
                />

                <div className="grid grid-cols-2 gap-3">
                    <Select
                        label="Dificultad"
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                        options={difficulties.map(d => ({ value: d, label: d }))}
                        disabled={!selectedCategory}
                        required
                        className="py-2 text-sm"
                    />

                    <Select
                        label="Orden"
                        value={startingOrder}
                        onChange={(e) => setStartingOrder(e.target.value as 'sequential' | 'random')}
                        options={[
                            { value: 'sequential', label: 'Secuencial' },
                            { value: 'random', label: 'Aleatorio' }
                        ]}
                        required
                        className="py-2 text-sm"
                    />
                </div>

                {error && (
                    <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/50 text-red-200 text-xs">
                        {error}
                    </div>
                )}

                <Button
                    type="submit"
                    fullWidth
                    size="lg" // Keep large for ease of tap, but maybe reduce padding in Button component later if needed. Use 'lg' is okay, 'xl' was huge.
                    variant="primary"
                    disabled={loading || !selectedCategory}
                    className="shadow-lg shadow-indigo-500/20 py-3 text-lg"
                >
                    {loading ? 'Preparando...' : 'JUGAR'}
                </Button>
            </form>
        </motion.div>
    );
}

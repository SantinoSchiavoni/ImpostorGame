'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import GameConfig from './GameConfig';
import { PlayerRole } from '@/app/actions/game';
import RoleReveal from './RoleReveal';
import GameActive from './GameActive';
import { incrementPlayerStartCount } from '@/lib/playerStartCounter';

type GameState = 'CONFIG' | 'REVEAL' | 'PLAYING';

export default function GameManager() {
    const [gameState, setGameState] = useState<GameState>('CONFIG');
    const [gameData, setGameData] = useState<{ players: PlayerRole[], secretWord: string, category: string } | null>(null);

    const handleGameStart = (data: { players: PlayerRole[], secretWord: string, category: string }) => {
        setGameData(data);
        setGameState('REVEAL');
    };

    const handleRevealComplete = () => {
        setGameState('PLAYING');
    };

    const handleReset = () => {
        // Increment the start count for the player who started this game
        if (gameData && gameData.players.length > 0) {
            const startingPlayerName = gameData.players[0].name;
            incrementPlayerStartCount(startingPlayerName);
        }

        setGameState('CONFIG');
        setGameData(null);
    };

    return (
        <div className="w-full flex justify-center">
            <AnimatePresence mode="wait">
                {gameState === 'CONFIG' && (
                    <GameConfig key="config" onStart={handleGameStart} />
                )}
                {gameState === 'REVEAL' && gameData && (
                    <RoleReveal
                        key="reveal"
                        players={gameData.players}
                        category={gameData.category}
                        onComplete={handleRevealComplete}
                    />
                )}
                {gameState === 'PLAYING' && gameData && (
                    <GameActive
                        key="playing"
                        secretWord={gameData.secretWord}
                        onReset={handleReset}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

'use server';

import connectToDatabase from '@/lib/mongodb';
import Category from '@/models/Category';

export async function getCategories() {
    await connectToDatabase();
    const categories = await Category.distinct('name');
    return categories as string[];
}

export async function getDifficulties(categoryName: string) {
    await connectToDatabase();
    const difficulties = await Category.distinct('difficulty', { name: categoryName });
    return difficulties as string[];
}

interface GameConfig {
    category: string;
    difficulty: string;
    players: number;
    impostors: number;
    playerNames?: string[];
    startingOrder?: 'sequential' | 'random';
}

export interface PlayerRole {
    id: number;
    name: string;
    isImpostor: boolean;
    word: string; // The word shown to the player (or "IMPOSTOR" technically logic handled by client but server provides truth)
}

export async function startGame(config: GameConfig) {
    await connectToDatabase();

    // 1. Fetch category data
    const categoryDoc = await Category.findOne({
        name: config.category,
        difficulty: config.difficulty
    });

    if (!categoryDoc) {
        throw new Error('Category or difficulty not found');
    }

    // 2. Select random word
    const words = categoryDoc.words;
    if (!words || words.length === 0) {
        throw new Error('No words found in this category');
    }
    const secretWord = words[Math.floor(Math.random() * words.length)];

    // 3. Generate roles
    const totalPlayers = config.players;
    const impostorCount = config.impostors;

    if (impostorCount >= totalPlayers) {
        throw new Error('Impostors must be fewer than total players');
    }

    const roles: ('Impostor' | 'Citizen')[] = [
        ...Array(impostorCount).fill('Impostor'),
        ...Array(totalPlayers - impostorCount).fill('Citizen')
    ];

    // 4. Shuffle (Fisher-Yates)
    for (let i = roles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [roles[i], roles[j]] = [roles[j], roles[i]];
    }

    // 5. Assign to players
    // If names provided, use them. Otherwise default.
    const names = config.playerNames && config.playerNames.length === totalPlayers
        ? config.playerNames
        : Array.from({ length: totalPlayers }, (_, i) => `Jugador ${i + 1}`);

    const players = roles.map((role, index) => ({
        id: index,
        name: names[index],
        isImpostor: role === 'Impostor',
        word: role === 'Impostor' ? 'IMPOSTOR' : secretWord
    }));

    // Player order is already determined by the client
    // The first player in the names array is the starting player

    return {
        players,
        secretWord // Secret word returned for Game Over reveal, not shown to Impostor
    };
}

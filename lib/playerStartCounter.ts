const STORAGE_KEY = 'impostor_player_start_counts';

/**
 * Get the start counts for all players from localStorage
 * Returns a record with player names as keys and their start counts as values
 */
export function getPlayerStartCounts(playerNames: string[]): Record<string, number> {
    if (typeof window === 'undefined') return {};

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const allCounts: Record<string, number> = stored ? JSON.parse(stored) : {};

        // Initialize counts for any new players
        const counts: Record<string, number> = {};
        playerNames.forEach(name => {
            counts[name] = allCounts[name] || 0;
        });

        return counts;
    } catch (error) {
        console.error('Error reading player start counts:', error);
        return {};
    }
}

/**
 * Increment the start count for a specific player
 */
export function incrementPlayerStartCount(playerName: string): void {
    if (typeof window === 'undefined') return;

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const allCounts: Record<string, number> = stored ? JSON.parse(stored) : {};

        allCounts[playerName] = (allCounts[playerName] || 0) + 1;

        localStorage.setItem(STORAGE_KEY, JSON.stringify(allCounts));
    } catch (error) {
        console.error('Error incrementing player start count:', error);
    }
}

/**
 * Select starting player using round-robin (sequential mode)
 * Returns the index of the player who should start
 */
export function selectStartingPlayerSequential(playerNames: string[]): number {
    if (playerNames.length === 0) return 0;

    const counts = getPlayerStartCounts(playerNames);

    // Find the player with the minimum count
    let minCount = Infinity;
    let minIndex = 0;

    playerNames.forEach((name, index) => {
        const count = counts[name] || 0;
        if (count < minCount) {
            minCount = count;
            minIndex = index;
        }
    });

    // If multiple players have the same minimum count, pick the first one in order
    // This creates a natural round-robin effect
    return minIndex;
}

/**
 * Select starting player using weighted random selection
 * Players with fewer starts have higher probability
 * Weight formula: 1 / (startCount + 1)
 */
export function selectStartingPlayerWeighted(playerNames: string[]): number {
    if (playerNames.length === 0) return 0;
    if (playerNames.length === 1) return 0;

    const counts = getPlayerStartCounts(playerNames);

    // Calculate weights (inverse of start count + 1)
    const weights = playerNames.map(name => {
        const count = counts[name] || 0;
        return 1 / (count + 1);
    });

    // Calculate total weight
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

    // Generate random number between 0 and totalWeight
    let random = Math.random() * totalWeight;

    // Select player based on weighted probability
    for (let i = 0; i < weights.length; i++) {
        random -= weights[i];
        if (random <= 0) {
            return i;
        }
    }

    // Fallback (should never reach here)
    return 0;
}

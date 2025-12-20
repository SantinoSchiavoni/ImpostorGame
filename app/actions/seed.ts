'use server';

import connectToDatabase from '@/lib/mongodb';
import Category from '@/models/Category';

const INITIAL_DATA = [
    {
        name: "Fútbol Argentino",
        difficulty: "Facil",
        words: ["Messi", "Riquelme", "Dibu Martínez", "Palermo", "Tevez", "Maradona", "Kun Agüero", "Di María"]
    },
    {
        name: "Fútbol Argentino",
        difficulty: "Medio",
        words: ["Lucas Zelarayan", "Rolando Martinez", "Ruben Botta", "Nicolas Tripichio", "Pity Martinez", "Enzo Pérez", "Scocco", "Pratto"]
    },
    {
        name: "Fútbol Argentino",
        difficulty: "Dificil",
        words: ["Nestor Breitenbruch", "Juan Manuel Garcia", "Cristian Tarragona", "Juan Pintado", "Malcorra", "Fatura Broun", "Gigotti", "Lema"]
    }
];

export async function seedDatabase() {
    try {
        await connectToDatabase();

        // Clear existing (optional, but good for reset)
        await Category.deleteMany({});

        // Insert new
        await Category.insertMany(INITIAL_DATA);

        return { success: true, message: 'Database seeded successfully!' };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

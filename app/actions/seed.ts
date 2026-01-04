'use server';

import connectToDatabase from '@/lib/mongodb';
import Category from '@/models/Category';
import fs from 'fs/promises';
import path from 'path';

interface CategoryData {
    categoryName: string;
    difficulty: string;
    words: string[];
}

interface CategoryDocument {
    name: string;
    difficulty: string;
    words: string[];
}

/**
 * Reads all category JSON files from the /data/categories directory
 * and returns them in the format expected by MongoDB
 */
async function loadCategoriesFromFiles(): Promise<CategoryDocument[]> {
    const categoriesPath = path.join(process.cwd(), 'data', 'categories');
    const categories: CategoryDocument[] = [];

    try {
        // Read all folders in the categories directory
        const categoryFolders = await fs.readdir(categoriesPath, { withFileTypes: true });

        for (const folder of categoryFolders) {
            // Skip files, only process directories
            if (!folder.isDirectory()) continue;

            const folderPath = path.join(categoriesPath, folder.name);

            // Read all JSON files in this category folder
            const files = await fs.readdir(folderPath);
            const jsonFiles = files.filter(file => file.endsWith('.json'));

            for (const file of jsonFiles) {
                const filePath = path.join(folderPath, file);

                try {
                    const fileContent = await fs.readFile(filePath, 'utf-8');
                    const data: CategoryData = JSON.parse(fileContent);

                    // Validate the structure
                    if (!data.categoryName || !data.difficulty || !Array.isArray(data.words)) {
                        console.warn(`⚠️  Invalid structure in ${folder.name}/${file} - skipping`);
                        continue;
                    }

                    if (data.words.length === 0) {
                        console.warn(`⚠️  Empty words array in ${folder.name}/${file} - skipping`);
                        continue;
                    }

                    // Transform to MongoDB format
                    categories.push({
                        name: data.categoryName,
                        difficulty: data.difficulty,
                        words: data.words
                    });

                    console.log(`✅ Loaded: ${data.categoryName} - ${data.difficulty} (${data.words.length} words)`);
                } catch (error) {
                    console.error(`❌ Error reading ${folder.name}/${file}:`, error);
                }
            }
        }

        return categories;
    } catch (error) {
        console.error('❌ Error loading categories from files:', error);
        throw new Error('Failed to load category files. Make sure /data/categories exists.');
    }
}

export async function seedDatabase() {
    try {
        console.log('🌱 Starting database seed...');

        // Load categories from JSON files
        const categories = await loadCategoriesFromFiles();

        if (categories.length === 0) {
            return {
                success: false,
                message: 'No valid categories found in /data/categories. Please check your JSON files.'
            };
        }

        console.log(`📦 Found ${categories.length} category entries to seed`);

        // Connect to database
        await connectToDatabase();

        // Clear existing data
        await Category.deleteMany({});
        console.log('🗑️  Cleared existing categories');

        // Insert new data
        await Category.insertMany(categories);
        console.log('✨ Successfully inserted all categories');

        return {
            success: true,
            message: `Database seeded successfully! Loaded ${categories.length} category entries.`
        };
    } catch (error: any) {
        console.error('❌ Seed error:', error);
        return {
            success: false,
            message: `Error: ${error.message}`
        };
    }
}

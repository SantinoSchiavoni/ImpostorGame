import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategory extends Document {
    name: string;
    difficulty: 'Facil' | 'Medio' | 'Dificil';
    words: string[];
}

const CategorySchema: Schema = new Schema({
    name: { type: String, required: true },
    difficulty: {
        type: String,
        required: true,
        enum: ['Facil', 'Medio', 'Dificil']
    },
    words: { type: [String], required: true },
});

// Prevent model recompilation error in Next.js hot reload
const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;

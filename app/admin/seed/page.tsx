'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { seedDatabase } from '@/app/actions/seed'; // We need to create this action

export default function SeedPage() {
    const [status, setStatus] = useState('Idle');

    const handleSeed = async () => {
        setStatus('Seeding...');
        try {
            const result = await seedDatabase(); // Call server action
            setStatus(result.message);
        } catch (error: any) {
            setStatus('Error: ' + error.message);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-4">
            <h1 className="text-2xl font-bold mb-4">Database Seeder</h1>
            <p className="mb-8 text-slate-400">Click below to populate the database with initial data.</p>
            <Button onClick={handleSeed} disabled={status === 'Seeding...'}>
                Populate DB (Argentine Football)
            </Button>
            <p className="mt-4 text-sm font-mono text-indigo-400">{status}</p>
        </div>
    );
}

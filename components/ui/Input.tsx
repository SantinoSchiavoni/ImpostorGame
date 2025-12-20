import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from './Button'; // Reusing cn utility

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="w-full space-y-2">
                {label && (
                    <label className="text-sm font-medium text-slate-300">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={cn(
                        'flex w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-lg text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
                        error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
                        className
                    )}
                    {...props}
                />
                {error && <p className="text-sm text-red-400">{error}</p>}
            </div>
        );
    }
);
Input.displayName = 'Input';

export { Input };

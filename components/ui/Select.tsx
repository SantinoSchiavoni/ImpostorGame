import { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from './Button';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, error, options, ...props }, ref) => {
        return (
            <div className="w-full space-y-2">
                {label && (
                    <label className="text-sm font-medium text-slate-300">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <select
                        ref={ref}
                        className={cn(
                            'flex w-full appearance-none rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-lg text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
                            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
                            className
                        )}
                        {...props}
                    >
                        <option value="" disabled className="bg-slate-800 text-slate-500">
                            Seleccionar...
                        </option>
                        {options.map((opt) => (
                            <option key={opt.value} value={opt.value} className="bg-slate-800 text-white">
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <ChevronDown className="h-5 w-5" />
                    </div>
                </div>
                {error && <p className="text-sm text-red-400">{error}</p>}
            </div>
        );
    }
);
Select.displayName = 'Select';

export { Select };

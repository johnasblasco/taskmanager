import { useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import type { ColumnConfig, Task } from '@/mock/MockData';

interface ColumnManagerProps {
    columns: ColumnConfig[];
    onToggleColumn: (columnId: keyof Task) => void;
    onClose: () => void;
}

export function ColumnManager({ columns, onToggleColumn, onClose }: ColumnManagerProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                onClose();
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    return (
        <div
            ref={ref}
            className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200/60 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
        >
            <div className="px-4 py-2 border-b border-gray-100">
                <h3 className="text-gray-900 text-sm">Show/Hide Columns</h3>
            </div>

            <div className="py-1 max-h-96 overflow-y-auto">
                {columns.map((column) => (
                    <button
                        key={column.id}
                        onClick={() => !column.required && onToggleColumn(column.id)}
                        disabled={column.required}
                        className={`w-full px-4 py-2.5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors ${column.required ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                            }`}
                    >
                        <span className="text-gray-700 text-sm">{column.label}</span>

                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${column.visible
                            ? 'bg-blue-600 border-blue-600'
                            : 'border-gray-300'
                            }`}>
                            {column.visible && (
                                <Check className="w-3 h-3 text-white" strokeWidth={3} />
                            )}
                        </div>
                    </button>
                ))}
            </div>

            <div className="px-4 py-2 border-t border-gray-100 text-xs text-gray-500">
                {columns.filter(c => c.visible).length} of {columns.length} visible
            </div>
        </div>
    );
}

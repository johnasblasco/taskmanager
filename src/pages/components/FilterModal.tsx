import { useState, useEffect, useRef } from 'react';
import { X, Check } from 'lucide-react';

export interface FilterOptions {
    completed: string[]; // 'completed' or 'incomplete'
    assignedTo: string[];
}

interface FilterModalProps {
    onClose: () => void;
    onApply: (filters: FilterOptions) => void;
    currentFilters: FilterOptions;
    availableAssignees: string[];
}

export function FilterModal({ onClose, onApply, currentFilters, availableAssignees }: FilterModalProps) {
    const [filters, setFilters] = useState<FilterOptions>(currentFilters);
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

    const handleCompletedToggle = (value: 'completed' | 'incomplete') => {
        setFilters(prev => ({
            ...prev,
            completed: prev.completed.includes(value)
                ? prev.completed.filter(s => s !== value)
                : [...prev.completed, value]
        }));
    };

    const handleAssigneeToggle = (assignee: string) => {
        setFilters(prev => ({
            ...prev,
            assignedTo: prev.assignedTo.includes(assignee)
                ? prev.assignedTo.filter(e => e !== assignee)
                : [...prev.assignedTo, assignee]
        }));
    };

    const handleClearAll = () => {
        setFilters({
            completed: [],
            assignedTo: []
        });
    };

    const handleApply = () => {
        onApply(filters);
        onClose();
    };

    const completedOptions: Array<{ value: 'completed' | 'incomplete', label: string }> = [
        { value: 'completed', label: 'Completed' },
        { value: 'incomplete', label: 'Incomplete' }
    ];

    const getAssigneeDisplayName = (assignee: string) => {
        switch (assignee) {
            case 'hxHGVRb1YJUscrCB8eXK':
                return 'User 1';
            case 'jane_smith':
                return 'Jane Smith';
            case 'alex_jones':
                return 'Alex Jones';
            case 'sarah_wilson':
                return 'Sarah Wilson';
            default:
                return assignee;
        }
    };

    const activeFilterCount = filters.completed.length + filters.assignedTo.length;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div
                ref={ref}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h2 className="text-gray-900">Filter Tasks</h2>
                        {activeFilterCount > 0 && (
                            <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs">
                                {activeFilterCount} active
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-140px)] px-6 py-6">
                    <div className="space-y-6">
                        {/* Status Filter */}
                        <div>
                            <h3 className="text-gray-900 mb-3">Status</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {completedOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => handleCompletedToggle(option.value)}
                                        className={`px-4 py-2.5 rounded-lg border-2 transition-all text-left flex items-center justify-between ${filters.completed.includes(option.value)
                                            ? 'border-blue-600 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <span className="text-sm text-gray-700">{option.label}</span>
                                        {filters.completed.includes(option.value) && (
                                            <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center">
                                                <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Assignee Filter */}
                        {availableAssignees.length > 0 && (
                            <div>
                                <h3 className="text-gray-900 mb-3">Assigned To</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {availableAssignees.map((assignee) => (
                                        <button
                                            key={assignee}
                                            onClick={() => handleAssigneeToggle(assignee)}
                                            className={`px-4 py-2.5 rounded-lg border-2 transition-all text-left flex items-center justify-between ${filters.assignedTo.includes(assignee)
                                                ? 'border-blue-600 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs">
                                                    {assignee.slice(0, 2).toUpperCase()}
                                                </div>
                                                <div className="text-left">
                                                    <div className="text-sm text-gray-700">{getAssigneeDisplayName(assignee)}</div>
                                                    <div className="text-xs text-gray-400 truncate max-w-[120px]">
                                                        {assignee}
                                                    </div>
                                                </div>
                                            </div>
                                            {filters.assignedTo.includes(assignee) && (
                                                <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center">
                                                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
                    <button
                        onClick={handleClearAll}
                        className="px-4 py-2.5 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Clear all
                    </button>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2.5 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleApply}
                            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
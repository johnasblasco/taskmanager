import { X, Edit, Trash2, Copy, Move, Calendar, User } from 'lucide-react';
import { useState } from 'react';
import type { Task } from '@/mock/MockData';

interface ActionBarProps {
    selectedCount: number;
    selectedTasks: Set<string>;
    tasks: Task[];
    onClearSelection: () => void;
    onUpdateSelectedTasks: (updates: Partial<Task>) => void;
    onDeleteSelectedTasks: () => void;
    onDuplicateSelectedTasks: () => void;
    onAssignSelected: (assignee: string) => void;
    onSetDateSelected: (date: string) => void;
    onSetStatusSelected: (completed: boolean) => void;
}

export function ActionBar({
    selectedCount,
    selectedTasks,
    tasks,
    onClearSelection,
    onUpdateSelectedTasks,
    onDeleteSelectedTasks,
    onDuplicateSelectedTasks,
    onAssignSelected,
    onSetDateSelected,
    onSetStatusSelected
}: ActionBarProps) {
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showDateModal, setShowDateModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [editValue, setEditValue] = useState('');
    const [editField, setEditField] = useState<'title' | 'body'>('title');

    // Get unique assignees from all tasks for the assign dropdown
    const allAssignees = Array.from(new Set(tasks.map(task => task.assignedTo)));

    const handleEditClick = () => {
        setEditField('title');
        setEditValue('');
        setShowEditModal(true);
    };

    const handleAssignClick = () => {
        setShowAssignModal(true);
    };

    const handleDateClick = () => {
        setShowDateModal(true);
    };

    const handleStatusClick = () => {
        setShowStatusModal(true);
    };

    const handleApplyEdit = () => {
        if (editValue.trim()) {
            onUpdateSelectedTasks({ [editField]: editValue });
            setShowEditModal(false);
            setEditValue('');
        }
    };

    const handleAssign = (assignee: string) => {
        onAssignSelected(assignee);
        setShowAssignModal(false);
    };

    const handleSetDate = (date: string) => {
        onSetDateSelected(date);
        setShowDateModal(false);
    };

    const handleSetStatus = (completed: boolean) => {
        onSetStatusSelected(completed);
        setShowStatusModal(false);
    };

    const getAssigneeDisplayName = (id: string) => {
        const names: Record<string, string> = {
            'hxHGVRb1YJUscrCB8eXK': 'User 1',
            'jane_smith': 'Jane Smith',
            'alex_jones': 'Alex Jones',
            'sarah_wilson': 'Sarah Wilson'
        };
        return names[id] || id;
    };

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete ${selectedCount} task${selectedCount !== 1 ? 's' : ''}?`)) {
            onDeleteSelectedTasks();
        }
    };

    const handleDuplicate = () => {
        onDuplicateSelectedTasks();
    };

    const formatDateForInput = (dateString: string) => {
        if (!dateString) return new Date().toISOString().split('T')[0];
        try {
            const date = new Date(dateString);
            return date.toISOString().split('T')[0];
        } catch {
            return new Date().toISOString().split('T')[0];
        }
    };

    return (
        <>
            <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-8 pointer-events-none">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-2xl rounded-2xl max-w-5xl w-full pointer-events-auto animate-in slide-in-from-bottom duration-300">
                    <div className="px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-3 text-white">
                                    <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                                        <span>{selectedCount}</span>
                                    </div>
                                    <span>selected</span>
                                </div>

                                <div className="h-8 w-px bg-white/20" />

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleEditClick}
                                        className="px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-all flex items-center gap-2 backdrop-blur-sm"
                                    >
                                        <Edit className="w-4 h-4" />
                                        <span className="text-sm">Edit</span>
                                    </button>

                                    <button
                                        onClick={handleAssignClick}
                                        className="px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-all flex items-center gap-2 backdrop-blur-sm"
                                    >
                                        <User className="w-4 h-4" />
                                        <span className="text-sm">Assign</span>
                                    </button>

                                    <button
                                        onClick={handleDateClick}
                                        className="px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-all flex items-center gap-2 backdrop-blur-sm"
                                    >
                                        <Calendar className="w-4 h-4" />
                                        <span className="text-sm">Set Date</span>
                                    </button>

                                    <button
                                        onClick={handleStatusClick}
                                        className="px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-all flex items-center gap-2 backdrop-blur-sm"
                                    >
                                        <Move className="w-4 h-4" />
                                        <span className="text-sm">Status</span>
                                    </button>

                                    <button
                                        onClick={handleDuplicate}
                                        className="px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-all flex items-center gap-2 backdrop-blur-sm"
                                    >
                                        <Copy className="w-4 h-4" />
                                        <span className="text-sm">Duplicate</span>
                                    </button>

                                    <div className="h-8 w-px bg-white/20 mx-1" />

                                    <button
                                        onClick={handleDelete}
                                        className="px-4 py-2 text-white hover:bg-red-500/90 rounded-lg transition-all flex items-center gap-2 backdrop-blur-sm"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        <span className="text-sm">Delete</span>
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={onClearSelection}
                                className="p-2 text-white hover:bg-white/10 rounded-lg transition-all ml-4"
                                aria-label="Clear selection"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">Edit Selected Tasks</h2>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Edit Field</label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setEditField('title')}
                                        className={`px-4 py-2 rounded-lg transition-colors ${editField === 'title' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                    >
                                        Title
                                    </button>
                                    <button
                                        onClick={() => setEditField('body')}
                                        className={`px-4 py-2 rounded-lg transition-colors ${editField === 'body' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                    >
                                        Description
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">New Value</label>
                                {editField === 'body' ? (
                                    <textarea
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        placeholder={`Enter new ${editField}...`}
                                        rows={3}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        autoFocus
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        placeholder={`Enter new ${editField}...`}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        autoFocus
                                    />
                                )}
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleApplyEdit}
                                disabled={!editValue.trim()}
                                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Apply to {selectedCount} task{selectedCount !== 1 ? 's' : ''}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Assign Modal */}
            {showAssignModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">Assign Tasks</h2>
                            <button
                                onClick={() => setShowAssignModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                {allAssignees.map((assignee) => (
                                    <button
                                        key={assignee}
                                        onClick={() => handleAssign(assignee)}
                                        className="px-4 py-3 border border-gray-200 hover:border-blue-500 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-3"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs">
                                            {assignee.slice(0, 2).toUpperCase()}
                                        </div>
                                        <div className="text-left">
                                            <div className="text-sm font-medium text-gray-700">
                                                {getAssigneeDisplayName(assignee)}
                                            </div>
                                            <div className="text-xs text-gray-500 truncate max-w-[120px]">
                                                {assignee}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                            <button
                                onClick={() => setShowAssignModal(false)}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Date Modal */}
            {showDateModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">Set Due Date</h2>
                            <button
                                onClick={() => setShowDateModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-700">Select Date</label>
                                <input
                                    type="date"
                                    defaultValue={formatDateForInput(new Date().toISOString())}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Quick Options</label>
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        onClick={() => {
                                            const today = new Date();
                                            handleSetDate(today.toISOString().split('T')[0] + 'T12:00:00Z');
                                        }}
                                        className="px-3 py-2 text-sm border border-gray-200 hover:border-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        Today
                                    </button>
                                    <button
                                        onClick={() => {
                                            const tomorrow = new Date();
                                            tomorrow.setDate(tomorrow.getDate() + 1);
                                            handleSetDate(tomorrow.toISOString().split('T')[0] + 'T12:00:00Z');
                                        }}
                                        className="px-3 py-2 text-sm border border-gray-200 hover:border-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        Tomorrow
                                    </button>
                                    <button
                                        onClick={() => {
                                            const nextWeek = new Date();
                                            nextWeek.setDate(nextWeek.getDate() + 7);
                                            handleSetDate(nextWeek.toISOString().split('T')[0] + 'T12:00:00Z');
                                        }}
                                        className="px-3 py-2 text-sm border border-gray-200 hover:border-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        Next Week
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                            <button
                                onClick={() => setShowDateModal(false)}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
                                    if (dateInput?.value) {
                                        handleSetDate(dateInput.value + 'T12:00:00Z');
                                    }
                                }}
                                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
                            >
                                Apply to {selectedCount} task{selectedCount !== 1 ? 's' : ''}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Status Modal */}
            {showStatusModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">Update Status</h2>
                            <button
                                onClick={() => setShowStatusModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => handleSetStatus(false)}
                                    className="px-6 py-4 border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 rounded-xl transition-all flex flex-col items-center gap-3"
                                >
                                    <div className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center">
                                        <span className="text-gray-600 text-lg">○</span>
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">Pending</div>
                                        <div className="text-sm text-gray-500">Mark as incomplete</div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => handleSetStatus(true)}
                                    className="px-6 py-4 border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 rounded-xl transition-all flex flex-col items-center gap-3"
                                >
                                    <div className="w-12 h-12 rounded-full border-2 border-green-300 bg-green-100 flex items-center justify-center">
                                        <span className="text-green-600 text-lg">✓</span>
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">Completed</div>
                                        <div className="text-sm text-gray-500">Mark as done</div>
                                    </div>
                                </button>
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                            <button
                                onClick={() => setShowStatusModal(false)}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
import { Check, X, Pencil, Trash2, CheckCircle, Circle, MessageSquare, Paperclip, MoreVertical } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import type { Task, ColumnConfig, Comment } from '@/mock/MockData';
import { CommentsSidebar } from './CommentsSidebar';

interface TaskTableProps {
    tasks: Task[];
    selectedTasks: Set<string>;
    columns: ColumnConfig[];
    onSelectAll: (checked: boolean) => void;
    onSelectTask: (taskId: string, checked: boolean) => void;
    isAddingNew: boolean;
    newTask: Partial<Task>;
    editingTaskId: string | null;
    onAddTask: () => void;
    onCancelAdd: () => void;
    onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
    onDeleteTask: (taskId: string) => void;
    onStartEdit: (task: Task) => void;
    onCancelEdit: () => void;
    onNewTaskChange: (task: Partial<Task>) => void;
    availableAssignees: string[];
    onAddComment: (taskId: string, comment: Comment) => void;
    onUpdateComment: (taskId: string, commentId: string, text: string) => void;
    onDeleteComment: (taskId: string, commentId: string) => void;
}

export function TaskTable({
    tasks,
    selectedTasks,
    columns,
    onSelectAll,
    onSelectTask,
    isAddingNew,
    newTask,
    editingTaskId,
    onAddTask,
    onCancelAdd,
    onUpdateTask,
    onDeleteTask,
    onStartEdit,
    onCancelEdit,
    onNewTaskChange,
    availableAssignees,
    onAddComment,
    onUpdateComment,
    onDeleteComment,
}: TaskTableProps) {
    const allSelected = tasks.length > 0 && tasks.every(task => selectedTasks.has(task.id));
    const someSelected = tasks.some(task => selectedTasks.has(task.id)) && !allSelected;
    const [editingValues, setEditingValues] = useState<Partial<Task>>({});
    const [commentsTaskId, setCommentsTaskId] = useState<string | null>(null);
    const [showCommentsCount, setShowCommentsCount] = useState<string | null>(null);
    const editRefs = useRef<{ [key: string]: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null }>({});

    const visibleColumns = columns.filter(col => col.visible);

    // Find the task with comments open
    const commentsTask = tasks.find(task => task.id === commentsTaskId);

    // Focus first input when editing starts
    useEffect(() => {
        if (editingTaskId && editRefs.current[editingTaskId]) {
            editRefs.current[editingTaskId]?.focus();
        }
    }, [editingTaskId]);

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Invalid date';
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return 'Invalid date';
        }
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

    const getCommentCount = (task: Task) => {
        return task.comments ? task.comments.filter(c => !c.parentId).length : 0;
    };

    const getTotalCommentCount = (task: Task) => {
        return task.comments ? task.comments.length : 0;
    };

    const renderCellContent = (task: Task, columnId: keyof Task) => {
        const value: any = task[columnId];

        switch (columnId) {
            case 'title':
                return (
                    <div className="flex items-center gap-3">
                        <div className="text-gray-900 font-medium">{value}</div>
                        {getCommentCount(task) > 0 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowCommentsCount(showCommentsCount === task.id ? null : task.id);
                                }}
                                className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full hover:bg-blue-100 transition-colors"
                            >
                                <MessageSquare className="w-3 h-3" />
                                {getCommentCount(task)}
                                {showCommentsCount === task.id && (
                                    <span className="ml-1 text-xs text-gray-500">
                                        ({getTotalCommentCount(task)} total)
                                    </span>
                                )}
                            </button>
                        )}
                    </div>
                );

            case 'body':
                return (
                    <div className="flex items-start justify-between">
                        <div className="text-gray-600 text-sm line-clamp-2 flex-1 mr-2">
                            {value}
                        </div>
                        <div className="relative">
                            <button
                                onClick={() => setCommentsTaskId(task.id)}
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex-shrink-0"
                                title="Comments"
                            >
                                <MessageSquare className="w-4 h-4" />
                                {getCommentCount(task) > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                                        {getCommentCount(task)}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                );

            case 'dueDate':
                if (!value) return <span className="text-gray-400 text-sm">No date</span>;

                try {
                    const date = new Date(value as string);
                    const isOverdue = date < new Date() && !task.completed;
                    return (
                        <div className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-700'}`}>
                            {formatDate(value as string)}
                            {isOverdue && (
                                <span className="ml-2 px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full">
                                    Overdue
                                </span>
                            )}
                        </div>
                    );
                } catch {
                    return <span className="text-red-500 text-sm">Invalid date</span>;
                }

            case 'completed':
                return (
                    <div className="flex items-center gap-2">
                        {value ? (
                            <div className="flex items-center gap-2 text-green-700">
                                <CheckCircle className="w-5 h-5" />
                                <span className="text-sm">Completed</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-gray-600">
                                <Circle className="w-5 h-5" />
                                <span className="text-sm">Pending</span>
                            </div>
                        )}
                    </div>
                );

            case 'assignedTo':
                return (
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-medium">
                            {(value as string).slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <div className="text-gray-700 text-sm font-medium">
                                {getAssigneeDisplayName(value as string)}
                            </div>
                            <div className="text-gray-400 text-xs truncate max-w-[120px]">
                                {value}
                            </div>
                        </div>
                    </div>
                );

            default:
                return <span className="text-gray-600 text-sm">{value?.toString() || '-'}</span>;
        }
    };

    const handleEditChange = (taskId: string, field: keyof Task, value: string | boolean) => {
        if (editingTaskId === taskId) {
            setEditingValues(prev => ({
                ...prev,
                [field]: value
            }));
            onUpdateTask(taskId, { [field]: value });
        }
    };

    const handleSaveEdit = (taskId: string) => {
        onCancelEdit();
        setEditingValues({});
    };

    const handleStartEditWithFocus = (task: Task) => {
        onStartEdit(task);
        setEditingValues({});
    };

    const renderEditCell = (task: Task, columnId: keyof Task) => {
        const value = editingValues[columnId] !== undefined ? editingValues[columnId] : task[columnId];

        switch (columnId) {
            case 'title':
                return (
                    <input
                        ref={(el: any) => editRefs.current[task.id] = el}
                        type="text"
                        value={value as string}
                        onChange={(e) => handleEditChange(task.id, columnId, e.target.value)}
                        placeholder="Enter task title..."
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    />
                );

            case 'body':
                return (
                    <textarea
                        ref={(el: any) => editRefs.current[task.id] = el}
                        value={value as string}
                        onChange={(e) => handleEditChange(task.id, columnId, e.target.value)}
                        placeholder="Enter description..."
                        rows={2}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                );

            case 'dueDate':
                let dateValue = '';
                let timeValue = '12:00';

                if (value) {
                    try {
                        const date = new Date(value as string);
                        if (!isNaN(date.getTime())) {
                            dateValue = date.toISOString().split('T')[0];
                            timeValue = date.toTimeString().slice(0, 5);
                        }
                    } catch (e) {
                        console.error('Invalid date:', e);
                    }
                }

                const handleDateTimeChange = (date: string, time: string) => {
                    const dateTime = `${date}T${time}:00Z`;
                    handleEditChange(task.id, columnId, dateTime);
                };

                return (
                    <div className="space-y-2">
                        <input
                            type="date"
                            value={dateValue}
                            onChange={(e) => handleDateTimeChange(e.target.value, timeValue)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                        <input
                            type="time"
                            value={timeValue}
                            onChange={(e) => handleDateTimeChange(dateValue, e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                );

            case 'completed':
                return (
                    <div className="flex items-center gap-3">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={value as boolean}
                                onChange={(e) => handleEditChange(task.id, columnId, e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                                {value ? 'Completed' : 'Incomplete'}
                            </span>
                        </label>
                    </div>
                );

            case 'assignedTo':
                return (
                    <select
                        ref={(el: any) => editRefs.current[task.id] = el}
                        value={value as string}
                        onChange={(e) => handleEditChange(task.id, columnId, e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        {availableAssignees.map((assignee) => (
                            <option key={assignee} value={assignee}>
                                {getAssigneeDisplayName(assignee)}
                            </option>
                        ))}
                    </select>
                );

            default:
                return (
                    <input
                        ref={(el: any) => editRefs.current[task.id] = el}
                        type="text"
                        value={value as string}
                        onChange={(e) => handleEditChange(task.id, columnId, e.target.value)}
                        placeholder={`Enter ${columnId}...`}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                );
        }
    };

    const renderNewTaskCell = (columnId: keyof Task) => {
        const value = newTask[columnId] || '';

        const handleChange = (newValue: string | boolean) => {
            onNewTaskChange({ ...newTask, [columnId]: newValue });
        };

        switch (columnId) {
            case 'title':
                return (
                    <input
                        type="text"
                        value={value as string}
                        onChange={(e) => handleChange(e.target.value)}
                        placeholder="Enter task title..."
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                        autoFocus
                    />
                );

            case 'body':
                return (
                    <textarea
                        value={value as string}
                        onChange={(e) => handleChange(e.target.value)}
                        placeholder="Enter description..."
                        rows={2}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                );

            case 'dueDate':
                let dateValue = '';
                let timeValue = '12:00';

                if (value) {
                    try {
                        const date = new Date(value as string);
                        if (!isNaN(date.getTime())) {
                            dateValue = date.toISOString().split('T')[0];
                            timeValue = date.toTimeString().slice(0, 5);
                        }
                    } catch (e) {
                        console.error('Invalid date:', e);
                    }
                }

                const handleDateTimeChange = (date: string, time: string) => {
                    const dateTime = `${date}T${time}:00Z`;
                    handleChange(dateTime);
                };

                return (
                    <div className="space-y-2">
                        <input
                            type="date"
                            value={dateValue}
                            onChange={(e) => handleDateTimeChange(e.target.value, timeValue)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                        <input
                            type="time"
                            value={timeValue}
                            onChange={(e) => handleDateTimeChange(dateValue, e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                );

            case 'completed':
                return (
                    <div className="flex items-center gap-3">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={value as boolean}
                                onChange={(e) => handleChange(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                                {value ? 'Completed' : 'Incomplete'}
                            </span>
                        </label>
                    </div>
                );

            case 'assignedTo':
                return (
                    <select
                        value={value as string}
                        onChange={(e) => handleChange(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        {availableAssignees.map((assignee) => (
                            <option key={assignee} value={assignee}>
                                {getAssigneeDisplayName(assignee)}
                            </option>
                        ))}
                    </select>
                );

            default:
                return (
                    <input
                        type="text"
                        value={value as string}
                        onChange={(e) => handleChange(e.target.value)}
                        placeholder={`Enter ${columnId}...`}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                );
        }
    };

    const getColumnMinWidth = (columnId: keyof Task) => {
        const widths: Record<string, string> = {
            title: '200px',
            body: '250px',
            dueDate: '180px',
            completed: '140px',
            assignedTo: '180px',
        };
        return widths[columnId] || '150px';
    };

    const handleAddCommentToTask = (comment: Comment) => {
        if (commentsTaskId) {
            onAddComment(commentsTaskId, comment);
        }
    };

    const handleUpdateCommentInTask = (commentId: string, text: string) => {
        if (commentsTaskId) {
            onUpdateComment(commentsTaskId, commentId, text);
        }
    };

    const handleDeleteCommentInTask = (commentId: string) => {
        if (commentsTaskId) {
            onDeleteComment(commentsTaskId, commentId);
        }
    };

    return (
        <>
            <div className="bg-white rounded-xl border border-gray-200/60 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/80 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left w-12">
                                    <input
                                        type="checkbox"
                                        checked={allSelected}
                                        ref={(input: any) => {
                                            if (input) {
                                                input.indeterminate = someSelected;
                                            }
                                        }}
                                        onChange={(e) => onSelectAll(e.target.checked)}
                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                    />
                                </th>
                                {visibleColumns.map((column) => (
                                    <th
                                        key={column.id}
                                        className="px-6 py-4 text-left text-gray-600 text-xs uppercase tracking-wider"
                                        style={{ minWidth: getColumnMinWidth(column.id) }}
                                    >
                                        {column.label}
                                    </th>
                                ))}
                                <th className="px-6 py-4 w-24"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {/* Add New Row */}
                            {isAddingNew && (
                                <tr className="bg-blue-50/50 border-b border-blue-100">
                                    <td className="px-6 py-4">
                                        <div className="w-5 h-5"></div>
                                    </td>
                                    {visibleColumns.map((column) => (
                                        <td key={column.id} className="px-6 py-3">
                                            {renderNewTaskCell(column.id)}
                                        </td>
                                    ))}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={onAddTask}
                                                disabled={!newTask.title?.trim() || !newTask.dueDate}
                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                title="Save"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={onCancelAdd}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Cancel"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {/* Existing Tasks */}
                            {tasks.map((task) => (
                                <tr
                                    key={task.id}
                                    className={`hover:bg-gray-50/50 transition-colors ${selectedTasks.has(task.id) ? 'bg-blue-50/50' : ''
                                        }`}
                                >
                                    <td className="px-6 py-4">
                                        {editingTaskId === task.id ? (
                                            <div className="w-5 h-5"></div>
                                        ) : (
                                            <input
                                                type="checkbox"
                                                checked={selectedTasks.has(task.id)}
                                                onChange={(e) => onSelectTask(task.id, e.target.checked)}
                                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                            />
                                        )}
                                    </td>
                                    {visibleColumns.map((column) => (
                                        <td key={column.id} className="px-6 py-3">
                                            {editingTaskId === task.id ? (
                                                renderEditCell(task, column.id)
                                            ) : (
                                                renderCellContent(task, column.id)
                                            )}
                                        </td>
                                    ))}
                                    <td className="px-6 py-4">
                                        {editingTaskId === task.id ? (
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleSaveEdit(task.id)}
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                    title="Save"
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={onCancelEdit}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Cancel"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleStartEditWithFocus(task)}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => onDeleteTask(task.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Comments Sidebar */}
            {commentsTask && (
                <CommentsSidebar
                    task={commentsTask}
                    isOpen={true}
                    onClose={() => setCommentsTaskId(null)}
                    onAddComment={handleAddCommentToTask}
                    onUpdateComment={handleUpdateCommentInTask}
                    onDeleteComment={handleDeleteCommentInTask}
                />
            )}
        </>
    );
}
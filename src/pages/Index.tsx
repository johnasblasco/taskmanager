import { useState } from 'react';
import { TaskTable } from './components/TaskTable';
import { ActionBar } from './components/ActionBar';
import { ColumnManager } from './components/ColumnManager';
import { FilterModal, type FilterOptions } from './components/FilterModal';
import { Plus, Search, Filter, Columns3 } from 'lucide-react';
import type { Task, ColumnConfig, Comment } from '@/mock/MockData';
import { mockTasks } from '@/mock/MockData'

const defaultColumns: ColumnConfig[] = [
    { id: 'title', label: 'Title', visible: true, required: true },
    { id: 'body', label: 'Description', visible: true },
    { id: 'dueDate', label: 'Due Date', visible: true, required: true },
    { id: 'completed', label: 'Status', visible: true, required: true },
    { id: 'assignedTo', label: 'Assigned To', visible: true },
];

export default function TaskManagementApp() {
    const [tasks, setTasks] = useState<Task[]>(mockTasks);
    const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState('');
    const [columns, setColumns] = useState<ColumnConfig[]>(defaultColumns);
    const [showColumnManager, setShowColumnManager] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filters, setFilters] = useState<FilterOptions>({
        completed: [],
        assignedTo: []
    });
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [newTask, setNewTask] = useState<Partial<Task>>({
        title: '',
        body: '',
        dueDate: '',
        completed: false,
        assignedTo: 'hxHGVRb1YJUscrCB8eXK'
    });

    // Comment handlers
    const handleAddComment = (taskId: string, comment: Comment) => {
        setTasks(prev => prev.map(task =>
            task.id === taskId
                ? {
                    ...task,
                    comments: [...(task.comments || []), comment]
                }
                : task
        ));
    };

    const handleUpdateComment = (taskId: string, commentId: string, text: string) => {
        setTasks(prev => prev.map(task =>
            task.id === taskId
                ? {
                    ...task,
                    comments: (task.comments || []).map(comment =>
                        comment.id === commentId
                            ? { ...comment, text }
                            : comment
                    )
                }
                : task
        ));
    };

    const handleDeleteComment = (taskId: string, commentId: string) => {
        setTasks(prev => prev.map(task =>
            task.id === taskId
                ? {
                    ...task,
                    comments: (task.comments || []).filter(comment => comment.id !== commentId)
                }
                : task
        ));
    };

    // Bulk operation handlers
    const handleUpdateSelectedTasks = (updates: Partial<Task>) => {
        setTasks(prev =>
            prev.map(task =>
                selectedTasks.has(task.id) ? { ...task, ...updates } : task
            )
        );
    };

    const handleDeleteSelectedTasks = () => {
        setTasks(prev =>
            prev.filter(task => !selectedTasks.has(task.id))
        );
        setSelectedTasks(new Set());
    };

    const handleDuplicateSelectedTasks = () => {
        const selectedTaskList = tasks.filter(task => selectedTasks.has(task.id));
        const duplicatedTasks = selectedTaskList.map(task => ({
            ...task,
            id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            title: `Copy of ${task.title}`
        }));

        setTasks(prev => [...duplicatedTasks, ...prev]);
    };

    const handleAssignSelected = (assignee: string) => {
        handleUpdateSelectedTasks({ assignedTo: assignee });
    };

    const handleSetDateSelected = (date: string) => {
        handleUpdateSelectedTasks({ dueDate: date });
    };

    const handleSetStatusSelected = (completed: boolean) => {
        handleUpdateSelectedTasks({ completed });
    };

    // Selection handlers
    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedTasks(new Set(filteredTasks.map(task => task.id)));
        } else {
            setSelectedTasks(new Set());
        }
    };

    const handleSelectTask = (taskId: string, checked: boolean) => {
        const newSelected = new Set(selectedTasks);
        if (checked) {
            newSelected.add(taskId);
        } else {
            newSelected.delete(taskId);
        }
        setSelectedTasks(newSelected);
    };

    const handleClearSelection = () => {
        setSelectedTasks(new Set());
    };

    // Column handlers
    const handleToggleColumn = (columnId: keyof Task) => {
        setColumns(prev =>
            prev.map(col =>
                col.id === columnId ? { ...col, visible: !col.visible } : col
            )
        );
    };

    // Task CRUD operations
    const handleAddTask = () => {
        if (!newTask.title?.trim() || !newTask.dueDate) return;

        const task: Task = {
            id: `task_${Date.now()}`,
            title: newTask.title || '',
            body: newTask.body || '',
            dueDate: newTask.dueDate,
            completed: newTask.completed || false,
            assignedTo: newTask.assignedTo || 'hxHGVRb1YJUscrCB8eXK',
            comments: [],
        };

        setTasks(prev => [task, ...prev]);
        handleCancelAdd();
    };

    const handleCancelAdd = () => {
        setIsAddingNew(false);
        setNewTask({
            title: '',
            body: '',
            dueDate: '',
            completed: false,
            assignedTo: 'hxHGVRb1YJUscrCB8eXK'
        });
    };

    const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
        setTasks(prev => prev.map(task =>
            task.id === taskId ? { ...task, ...updates } : task
        ));
        setEditingTaskId(null);
    };

    const handleDeleteTask = (taskId: string) => {
        setTasks(prev => prev.filter(task => task.id !== taskId));
        setSelectedTasks(prev => {
            const newSelected = new Set(prev);
            newSelected.delete(taskId);
            return newSelected;
        });
    };

    const handleStartEdit = (task: Task) => {
        setEditingTaskId(task.id);
    };

    const handleCancelEdit = () => {
        setEditingTaskId(null);
    };

    // Filter handlers
    const handleApplyFilters = (newFilters: FilterOptions) => {
        setFilters(newFilters);
        setShowFilterModal(false);
    };

    // Get unique assigned users
    const availableAssignees = Array.from(new Set(tasks.map(task => task.assignedTo)));

    // Apply filters and search
    const filteredTasks = tasks.filter(task => {
        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchesSearch =
                task.title.toLowerCase().includes(query) ||
                task.body.toLowerCase().includes(query) ||
                task.assignedTo.toLowerCase().includes(query);
            if (!matchesSearch) return false;
        }

        // Status filter
        if (filters.completed.length > 0) {
            const showCompleted = filters.completed.includes('completed');
            const showIncomplete = filters.completed.includes('incomplete');

            if (showCompleted && showIncomplete) {
                // Show all - do nothing
            } else if (showCompleted && !task.completed) {
                return false;
            } else if (showIncomplete && task.completed) {
                return false;
            }
        }

        // Assignee filter
        if (filters.assignedTo.length > 0 && !filters.assignedTo.includes(task.assignedTo)) {
            return false;
        }

        return true;
    });

    const activeFilterCount = filters.completed.length + filters.assignedTo.length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-10">
                <div className="max-w-screen-2xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
                            <p className="text-gray-500 text-sm mt-1">Manage your tasks and assignments</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-screen-2xl mx-auto">
                {/* Toolbar */}
                <div className="mb-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Primary Actions */}
                        <div className="flex flex-wrap gap-3 items-center">
                            <button
                                onClick={() => setIsAddingNew(true)}
                                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow flex items-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isAddingNew}
                            >
                                <Plus className="w-4 h-4" />
                                New Task
                            </button>

                            {/* Mobile Search */}
                            <div className="lg:hidden w-full">
                                <div className="relative">
                                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search tasks..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Search and Filters */}
                        <div className="flex-1 flex flex-col sm:flex-row gap-3">
                            {/* Desktop Search */}
                            <div className="hidden lg:block flex-1 max-w-xl">
                                <div className="relative">
                                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search tasks..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            {/* Filter Buttons */}
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => setShowFilterModal(true)}
                                    className="px-4 py-2.5 bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap"
                                >
                                    <Filter className="w-4 h-4" />
                                    Filter
                                    {activeFilterCount > 0 && (
                                        <span className="ml-1 px-2 py-0.5 bg-blue-600 text-white rounded-full text-xs">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                </button>

                                <div className="relative">
                                    <button
                                        onClick={() => setShowColumnManager(!showColumnManager)}
                                        className="px-4 py-2.5 bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap"
                                    >
                                        <Columns3 className="w-4 h-4" />
                                        Columns
                                    </button>

                                    {showColumnManager && (
                                        <div className="absolute right-0 z-50 mt-2">
                                            <ColumnManager
                                                columns={columns}
                                                onToggleColumn={handleToggleColumn}
                                                onClose={() => setShowColumnManager(false)}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Container */}
                <div>
                    {filteredTasks.length === 0 && !isAddingNew ? (
                        <div className="bg-white rounded-xl border border-gray-200/60 overflow-hidden shadow-sm p-8 sm:p-12 text-center">
                            <div className="text-gray-400 mb-4">
                                <Filter className="w-12 h-12 mx-auto" />
                            </div>
                            <h3 className="text-gray-900 text-lg font-semibold mb-2">No tasks found</h3>
                            <p className="text-gray-500 text-sm">
                                {searchQuery || activeFilterCount > 0
                                    ? 'Try adjusting your search or filters'
                                    : 'Create your first task to get started'}
                            </p>
                        </div>
                    ) : (
                        <TaskTable
                            tasks={filteredTasks}
                            selectedTasks={selectedTasks}
                            columns={columns}
                            onSelectAll={handleSelectAll}
                            onSelectTask={handleSelectTask}
                            isAddingNew={isAddingNew}
                            newTask={newTask}
                            editingTaskId={editingTaskId}
                            onAddTask={handleAddTask}
                            onCancelAdd={handleCancelAdd}
                            onUpdateTask={handleUpdateTask}
                            onDeleteTask={handleDeleteTask}
                            onStartEdit={handleStartEdit}
                            onCancelEdit={handleCancelEdit}
                            onNewTaskChange={setNewTask}
                            availableAssignees={availableAssignees}
                            onAddComment={handleAddComment}
                            onUpdateComment={handleUpdateComment}
                            onDeleteComment={handleDeleteComment}
                        />
                    )}
                </div>
            </div>

            {/* Action Bar */}
            {selectedTasks.size > 0 && (
                <ActionBar
                    selectedCount={selectedTasks.size}
                    selectedTasks={selectedTasks}
                    tasks={tasks}
                    onClearSelection={handleClearSelection}
                    onUpdateSelectedTasks={handleUpdateSelectedTasks}
                    onDeleteSelectedTasks={handleDeleteSelectedTasks}
                    onDuplicateSelectedTasks={handleDuplicateSelectedTasks}
                    onAssignSelected={handleAssignSelected}
                    onSetDateSelected={handleSetDateSelected}
                    onSetStatusSelected={handleSetStatusSelected}
                />
            )}

            {/* Filter Modal */}
            {showFilterModal && (
                <FilterModal
                    onClose={() => setShowFilterModal(false)}
                    onApply={handleApplyFilters}
                    currentFilters={filters}
                    availableAssignees={availableAssignees}
                />
            )}
        </div>
    );
}
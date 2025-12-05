import { X, Pencil, Trash2, MessageSquare, Paperclip, MoreVertical } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import type { Task, Comment } from '@/mock/MockData';

interface CommentsSidebarProps {
    task: Task;
    isOpen: boolean;
    onClose: () => void;
    onAddComment: (comment: Comment) => void;
    onUpdateComment: (commentId: string, text: string) => void;
    onDeleteComment: (commentId: string) => void;
    currentUserId?: string;
}

export function CommentsSidebar({
    task,
    isOpen,
    onClose,
    onAddComment,
    onUpdateComment,
    onDeleteComment,
    currentUserId = 'hxHGVRb1YJUscrCB8eXK'
}: CommentsSidebarProps) {
    const [newComment, setNewComment] = useState('');
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editText, setEditText] = useState('');
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');

    const commentsEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom when comments change
    useEffect(() => {
        if (isOpen && commentsEndRef.current) {
            commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [isOpen, task.comments]);

    const handleAddComment = () => {
        if (!newComment.trim()) return;

        const comment: Comment = {
            id: `comment_${Date.now()}`,
            taskId: task.id,
            userId: currentUserId,
            text: newComment,
            timestamp: new Date().toISOString(),
        };

        onAddComment(comment);
        setNewComment('');
    };

    const handleAddReply = (parentId: string) => {
        if (!replyText.trim()) return;

        const comment: Comment = {
            id: `comment_${Date.now()}`,
            taskId: task.id,
            userId: currentUserId,
            text: replyText,
            timestamp: new Date().toISOString(),
            parentId,
        };

        onAddComment(comment);
        setReplyText('');
        setReplyingTo(null);
    };

    const handleStartEdit = (comment: Comment) => {
        setEditingCommentId(comment.id);
        setEditText(comment.text);
    };

    const handleSaveEdit = () => {
        if (editingCommentId && editText.trim()) {
            onUpdateComment(editingCommentId, editText);
            setEditingCommentId(null);
            setEditText('');
        }
    };

    const handleDeleteComment = (commentId: string) => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            onDeleteComment(commentId);
        }
    };

    const getCommentReplies = (commentId: string) => {
        return (task.comments || []).filter(c => c.parentId === commentId);
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

    const renderComment = (comment: Comment, level = 0) => {
        const replies = getCommentReplies(comment.id);
        const isOwner = comment.userId === currentUserId;

        return (
            <div key={comment.id} className={`${level > 0 ? 'ml-8 mt-3' : 'mb-4'}`}>
                <div className={`bg-gray-50 rounded-lg p-3 ${level > 0 ? 'border-l-2 border-blue-200' : ''}`}>
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs">
                                {comment.userId.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <div className="text-xs font-medium text-gray-700">
                                    {getAssigneeDisplayName(comment.userId)}
                                </div>
                                <div className="text-xs text-gray-400">
                                    {new Date(comment.timestamp).toLocaleDateString()} at{' '}
                                    {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>

                        {isOwner && (
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => handleStartEdit(comment)}
                                    className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                    title="Edit"
                                >
                                    <Pencil className="w-3 h-3" />
                                </button>
                                <button
                                    onClick={() => handleDeleteComment(comment.id)}
                                    className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        )}
                    </div>

                    {editingCommentId === comment.id ? (
                        <div className="mt-2 space-y-2">
                            <textarea
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                rows={2}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                autoFocus
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSaveEdit}
                                    disabled={!editText.trim()}
                                    className="px-3 py-1 text-xs bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setEditingCommentId(null)}
                                    className="px-3 py-1 text-xs border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <p className="mt-2 text-sm text-gray-700">{comment.text}</p>
                            <div className="mt-2 flex items-center gap-3">
                                <button
                                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                                    className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                >
                                    <MessageSquare className="w-3 h-3" />
                                    Reply
                                </button>
                                {replies.length > 0 && (
                                    <span className="text-xs text-gray-400">
                                        {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
                                    </span>
                                )}
                            </div>
                        </>
                    )}

                    {replyingTo === comment.id && (
                        <div className="mt-3 ml-2 space-y-2">
                            <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Write a reply..."
                                rows={2}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                autoFocus
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleAddReply(comment.id)}
                                    disabled={!replyText.trim()}
                                    className="px-3 py-1 text-xs bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    Add Reply
                                </button>
                                <button
                                    onClick={() => {
                                        setReplyingTo(null);
                                        setReplyText('');
                                    }}
                                    className="px-3 py-1 text-xs border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Render replies */}
                {replies.map(reply => renderComment(reply, level + 1))}
            </div>
        );
    };

    const comments = task.comments || [];
    const topLevelComments = comments.filter(c => !c.parentId);

    return (
        <div
            className={`fixed right-0 top-0 h-full w-96 bg-white border-l border-gray-200 shadow-2xl z-[100] transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
            {/* Sidebar Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-gray-900">Comments</h3>
                    <p className="text-sm text-gray-500">{task.title}</p>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>
            </div>

            {/* Comments List */}
            <div className="h-[calc(100vh-180px)] overflow-y-auto px-6 py-4">
                {topLevelComments.length === 0 ? (
                    <div className="text-center py-8">
                        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No comments yet</p>
                        <p className="text-sm text-gray-400 mt-1">Be the first to comment on this task</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {topLevelComments.map(comment => renderComment(comment))}
                    </div>
                )}
                <div ref={commentsEndRef} />
            </div>

            {/* New Comment Input */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
                <div className="flex items-start gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs flex-shrink-0">
                        {currentUserId.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            rows={2}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.ctrlKey) {
                                    handleAddComment();
                                }
                            }}
                        />
                        <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                                <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
                                    <Paperclip className="w-4 h-4" />
                                </button>
                                <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                            </div>
                            <button
                                onClick={handleAddComment}
                                disabled={!newComment.trim()}
                                className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Comment
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
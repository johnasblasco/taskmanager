export interface Task {
    id: string;
    title: string;
    body: string;
    dueDate: string;
    completed: boolean;
    assignedTo: string;
    comments: Comment[];
}

export interface Comment {
    id: string;
    taskId: string;
    userId: string;
    text: string;
    timestamp: string;
    parentId?: string; // For threaded replies
    replies?: Comment[];
}

export interface ColumnConfig {
    id: keyof Task;
    label: string;
    visible: boolean;
    required?: boolean;
}

export const mockTasks: Task[] = [
    {
        id: '1',
        title: 'Complete project proposal',
        body: 'Draft and finalize the project proposal document with all requirements',
        dueDate: '2024-12-15T14:30:00Z',
        completed: false,
        assignedTo: 'hxHGVRb1YJUscrCB8eXK',
        comments: [
            {
                id: 'comment_1',
                taskId: '9',
                userId: 'hxHGVRb1YJUscrCB8eXK',
                text: 'This is the first comment on this task.',
                timestamp: '2024-12-01T10:30:00Z'
            },
            {
                id: 'comment_2',
                taskId: '9',
                userId: 'jane_smith',
                text: 'I think we need to add more features.',
                timestamp: '2024-12-01T11:15:00Z',
                parentId: 'comment_1'
            }
        ]
    },
    {
        id: '2',
        title: 'Team meeting',
        body: 'Weekly team sync to discuss progress and blockers',
        dueDate: '2024-12-10T10:00:00Z',
        completed: true,
        assignedTo: 'jane_smith',
        comments: [
            {
                id: 'comment_1',
                taskId: '9',
                userId: 'hxHGVRb1YJUscrCB8eXK',
                text: 'This is the first comment on this task.',
                timestamp: '2024-12-01T10:30:00Z'
            },
            {
                id: 'comment_2',
                taskId: '9',
                userId: 'jane_smith',
                text: 'I think we need to add more features.',
                timestamp: '2024-12-01T11:15:00Z',
                parentId: 'comment_1'
            }
        ]
    },
    {
        id: '3',
        title: 'Code review',
        body: 'Review PR #123 for the new authentication system',
        dueDate: '2024-12-08T16:00:00Z',
        completed: false,
        assignedTo: 'alex_jones',
        comments: [
            {
                id: 'comment_1',
                taskId: '9',
                userId: 'hxHGVRb1YJUscrCB8eXK',
                text: 'This is the first comment on this task.',
                timestamp: '2024-12-01T10:30:00Z'
            },
            {
                id: 'comment_2',
                taskId: '9',
                userId: 'jane_smith',
                text: 'I think we need to add more features.',
                timestamp: '2024-12-01T11:15:00Z',
                parentId: 'comment_1'
            }
        ]
    },
    {
        id: '4',
        title: 'Update documentation',
        body: 'Update API documentation for version 2.0 release',
        dueDate: '2024-12-20T12:00:00Z',
        completed: false,
        assignedTo: 'sarah_wilson',
        comments: [
            {
                id: 'comment_1',
                taskId: '9',
                userId: 'hxHGVRb1YJUscrCB8eXK',
                text: 'This is the first comment on this task.',
                timestamp: '2024-12-01T10:30:00Z'
            },
            {
                id: 'comment_2',
                taskId: '9',
                userId: 'jane_smith',
                text: 'I think we need to add more features.',
                timestamp: '2024-12-01T11:15:00Z',
                parentId: 'comment_1'
            }
        ]
    },
    {
        id: '5',
        title: 'Bug fix - login issue',
        body: 'Fix the intermittent login issue on mobile devices',
        dueDate: '2024-12-05T18:00:00Z',
        completed: true,
        assignedTo: 'hxHGVRb1YJUscrCB8eXK',
        comments: [
            {
                id: 'comment_1',
                taskId: '9',
                userId: 'hxHGVRb1YJUscrCB8eXK',
                text: 'This is the first comment on this task.',
                timestamp: '2024-12-01T10:30:00Z'
            },
            {
                id: 'comment_2',
                taskId: '9',
                userId: 'jane_smith',
                text: 'I think we need to add more features.',
                timestamp: '2024-12-01T11:15:00Z',
                parentId: 'comment_1'
            }
        ]
    },
    {
        id: '6',
        title: 'Prepare presentation',
        body: 'Create slides for quarterly business review',
        dueDate: '2024-12-12T09:00:00Z',
        completed: false,
        assignedTo: 'jane_smith',
        comments: [
            {
                id: 'comment_1',
                taskId: '9',
                userId: 'hxHGVRb1YJUscrCB8eXK',
                text: 'This is the first comment on this task.',
                timestamp: '2024-12-01T10:30:00Z'
            },
            {
                id: 'comment_2',
                taskId: '9',
                userId: 'jane_smith',
                text: 'I think we need to add more features.',
                timestamp: '2024-12-01T11:15:00Z',
                parentId: 'comment_1'
            }
        ]
    },
    {
        id: '7',
        title: 'Setup CI/CD pipeline',
        body: 'Configure automated testing and deployment pipeline',
        dueDate: '2024-12-25T23:59:00Z',
        completed: false,
        assignedTo: 'alex_jones',
        comments: [
            {
                id: 'comment_1',
                taskId: '9',
                userId: 'hxHGVRb1YJUscrCB8eXK',
                text: 'This is the first comment on this task.',
                timestamp: '2024-12-01T10:30:00Z'
            },
            {
                id: 'comment_2',
                taskId: '9',
                userId: 'jane_smith',
                text: 'I think we need to add more features.',
                timestamp: '2024-12-01T11:15:00Z',
                parentId: 'comment_1'
            }
        ]
    },
    {
        id: '8',
        title: 'Customer feedback analysis',
        body: 'Analyze Q4 customer feedback and prepare report',
        dueDate: '2024-12-07T15:00:00Z',
        completed: true,
        assignedTo: 'sarah_wilson',
        comments: [
            {
                id: 'comment_1',
                taskId: '9',
                userId: 'hxHGVRb1YJUscrCB8eXK',
                text: 'This is the first comment on this task.',
                timestamp: '2024-12-01T10:30:00Z'
            },
            {
                id: 'comment_2',
                taskId: '9',
                userId: 'jane_smith',
                text: 'I think we need to add more features.',
                timestamp: '2024-12-01T11:15:00Z',
                parentId: 'comment_1'
            }
        ]
    }
];
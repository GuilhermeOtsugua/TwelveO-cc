export const northlineDemoDelay = 2800;
export const northlineDemoStepDelay = 3600;
export const northlineAutoDemoEnabled = false;

export const northlineIconMap = {
    upload: 'upload_file',
    quiz: 'quiz',
    grade: 'edit_note',
    message: 'mark_chat_unread',
    pen: 'history_edu',
    code: 'match_case',
    calendar: 'event_available',
    archive: 'inventory_2',
};

export const northlineStudentsFilterCycle = [null, 'late-submissions', 'alerts'];

export const northlineStudentsFilterLabels = {
    null: 'All students',
    'late-submissions': 'Late submissions',
    alerts: 'Student alerts',
};

export const northlineViewMeta = {
    dashboard: {
        getTitle: (classroom) => classroom.dashboardTitle,
        getDescription: (classroom) => classroom.dashboardDescription,
        actions: [],
    },
    documents: {
        getTitle: () => 'Class Materials & Documents',
        getDescription: () => 'Publish, replace, and share the current class materials without leaving Northline.',
        actions: [{ kind: 'workflow', value: 'post-materials', label: 'Post materials', tone: 'teal' }],
    },
    exams: {
        getTitle: () => 'Assessment Planning',
        getDescription: (_, state) => state.examsFilter === 'next-24h'
            ? 'Upcoming due work for the current class.'
            : 'Create, schedule, and review assessments for the current class.',
        actions: [{ kind: 'workflow', value: 'create-exam', label: 'Create exam', tone: 'coral' }],
    },
    students: {
        getTitle: () => 'Roster & Student Support',
        getDescription: (_, state) => {
            if (state.studentsFilter === 'late-submissions') {
                return 'Students with late submissions for the current class, ready for a quick follow-up.';
            }

            if (state.studentsFilter === 'alerts') {
                return 'Current alerts and check-in suggestions for the selected class.';
            }

            return 'Track attendance, support notes, and follow-up actions for the current class roster.';
        },
        actions: [{ kind: 'workflow', value: 'class-message', label: 'Class message', tone: 'slate' }],
    },
};

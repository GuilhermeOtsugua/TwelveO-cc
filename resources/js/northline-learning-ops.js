import {
    northlineAutoDemoEnabled,
    northlineDemoDelay,
    northlineDemoStepDelay,
    northlineStudentsFilterCycle,
    northlineStudentsFilterLabels,
    northlineViewMeta,
} from './northline/config';
import { initializeNorthlineRollingText } from './northline/rolling-text';
import {
    escapeNorthlineHtml,
    renderNorthlineContextChip,
    renderNorthlineActionButton,
    renderNorthlineDashboard,
    renderNorthlineCheckInSection,
    renderNorthlineReachCard,
    renderNorthlineDocumentsView,
    renderNorthlineExamsView,
    renderNorthlineStudentsView,
    renderNorthlineGradingOverlay,
    renderNorthlineMessageOverlay,
} from './northline/renderers';

let northlineCheckInRotationTimer = null;
let northlineCheckInResizeHandler = null;

function stopNorthlineCheckInRotation() {
    if (northlineCheckInRotationTimer !== null) {
        window.clearInterval(northlineCheckInRotationTimer);
        northlineCheckInRotationTimer = null;
    }

    if (northlineCheckInResizeHandler !== null) {
        window.removeEventListener('resize', northlineCheckInResizeHandler);
        northlineCheckInResizeHandler = null;
    }
}

function initializeNorthlineCheckInRotation(root) {
    stopNorthlineCheckInRotation();

    const rotator = root.querySelector('[data-northline-checkin-rotator]');

    if (!(rotator instanceof HTMLElement)) {
        return;
    }

    const track = root.querySelector('[data-northline-checkin-track]');

    if (!(track instanceof HTMLElement)) {
        return;
    }

    const slides = Array.from(track.querySelectorAll('[data-northline-checkin-slide]')).filter((slide) => slide instanceof HTMLElement);

    if (slides.length < 2) {
        return;
    }

    let activeIndex = slides.findIndex((slide) => slide.classList.contains('is-active'));

    if (activeIndex < 0) {
        activeIndex = 0;
    }

    const setSlideState = (slide, state) => {
        slide.classList.remove('is-active', 'is-entering', 'is-leaving', 'is-idle');
        slide.classList.add(`is-${state}`);
        slide.setAttribute('aria-hidden', state === 'active' ? 'false' : 'true');
    };

    slides.forEach((slide, index) => {
        setSlideState(slide, index === activeIndex ? 'active' : 'idle');
    });

    const cycleSlides = () => {
        const currentSlide = slides[activeIndex];
        const nextIndex = (activeIndex + 1) % slides.length;
        const nextSlide = slides[nextIndex];

        if (!(currentSlide instanceof HTMLElement) || !(nextSlide instanceof HTMLElement)) {
            return;
        }

        setSlideState(currentSlide, 'leaving');
        setSlideState(nextSlide, 'entering');

        requestAnimationFrame(() => {
            setSlideState(nextSlide, 'active');
            window.setTimeout(() => {
                setSlideState(currentSlide, 'idle');
                activeIndex = nextIndex;
            }, 380);
        });
    };

    northlineCheckInRotationTimer = window.setInterval(cycleSlides, 4800);
}

document.querySelectorAll('[data-northline-slice]').forEach((slice) => {
    if (!(slice instanceof HTMLElement)) {
        return;
    }

    const stateScript = slice.querySelector('[data-northline-state]');

    if (!(stateScript instanceof HTMLScriptElement)) {
        return;
    }

    let payload;

    try {
        payload = JSON.parse(stateScript.textContent ?? '{}');
    } catch {
        return;
    }

    const classrooms = Array.isArray(payload.classes) ? payload.classes : [];
    const workflowActions = Array.isArray(payload.workflowActions) ? payload.workflowActions : [];

    if (classrooms.length === 0) {
        return;
    }

    const panels = {
        dashboard: slice.querySelector('[data-northline-view-panel="dashboard"]'),
        documents: slice.querySelector('[data-northline-view-panel="documents"]'),
        exams: slice.querySelector('[data-northline-view-panel="exams"]'),
        students: slice.querySelector('[data-northline-view-panel="students"]'),
    };
    const viewTitle = slice.querySelector('[data-northline-view-title]');
    const viewDescription = slice.querySelector('[data-northline-view-description]');
    const headerContext = slice.querySelector('[data-northline-header-context]');
    const headerFilter = slice.querySelector('[data-northline-header-filter]');
    const headerActions = slice.querySelector('[data-northline-header-actions]');
    const classTrigger = slice.querySelector('[data-northline-class-trigger]');
    const classMenu = slice.querySelector('[data-northline-class-menu]');
    const overlayLayer = slice.querySelector('[data-northline-overlay-layer]');
    const gradingOverlay = slice.querySelector('[data-northline-overlay="grading"]');
    const messageOverlay = slice.querySelector('[data-northline-overlay="message"]');

    let resumeTimer = null;
    let demoTimer = null;
    let rollingTextFrame = null;

    const state = {
        view: 'dashboard',
        selectedClassId: payload.defaultClassId ?? classrooms[0].id,
        studentsFilter: null,
        examsFilter: null,
        overlay: null,
        selectedDocumentId: null,
        selectedExamId: null,
        selectedStudentId: null,
        selectedAssignmentId: null,
        selectedSubmissionId: null,
        selectedGrade: null,
        messageSubject: '',
        messageBody: '',
        demoStep: 0,
    };

    const getCurrentClassroom = () => classrooms.find((item) => item.id === state.selectedClassId) ?? classrooms[0];
    const getSelectedDocument = () => getCurrentClassroom().documents.find((item) => item.id === state.selectedDocumentId) ?? getCurrentClassroom().documents[0] ?? null;
    const getSelectedExam = () => getCurrentClassroom().exams.find((item) => item.id === state.selectedExamId) ?? getCurrentClassroom().exams[0] ?? null;
    const getSelectedAssignment = () => getCurrentClassroom().gradingQueue.find((item) => item.id === state.selectedAssignmentId) ?? getCurrentClassroom().gradingQueue[0] ?? null;
    const getSelectedSubmission = () => getSelectedAssignment()?.students.find((item) => item.id === state.selectedSubmissionId) ?? getSelectedAssignment()?.students[0] ?? null;
    const getVisibleStudents = () => {
        const students = getCurrentClassroom().students;

        if (state.studentsFilter === 'late-submissions') {
            return students.filter((student) => student.lateWork !== 'No late work');
        }

        if (state.studentsFilter === 'alerts') {
            return students.filter((student) => Array.isArray(student.alerts) && student.alerts.length > 0);
        }

        return students;
    };
    const getSelectedStudent = () => getVisibleStudents().find((item) => item.id === state.selectedStudentId) ?? getVisibleStudents()[0] ?? null;
    const ensureMessageDraft = () => {
        const classroom = getCurrentClassroom();

        if (state.messageSubject === '') {
            state.messageSubject = `Update for ${classroom.label} • ${classroom.name}`;
        }

        if (state.messageBody === '') {
            state.messageBody = `Hi class,\n\nHere is a quick update for ${classroom.name}.\n\nPlease check the latest materials and deadlines in Northline.\n\nThank you.`;
        }
    };
    const resetSelections = () => {
        const classroom = getCurrentClassroom();
        state.selectedDocumentId = classroom.documents[0]?.id ?? null;
        state.selectedExamId = classroom.exams[0]?.id ?? null;
        state.selectedStudentId = classroom.students[0]?.id ?? null;
        state.selectedAssignmentId = classroom.gradingQueue[0]?.id ?? null;
        state.selectedSubmissionId = classroom.gradingQueue[0]?.students[0]?.id ?? null;
        state.selectedGrade = classroom.gradingQueue[0]?.students[0]?.defaultGrade ?? null;
        state.messageSubject = '';
        state.messageBody = '';
    };
    const pauseDemo = () => {
        if (resumeTimer) {
            window.clearTimeout(resumeTimer);
            resumeTimer = null;
        }

        if (demoTimer) {
            window.clearTimeout(demoTimer);
            demoTimer = null;
        }
    };
    const scheduleDemo = () => {
        pauseDemo();

        if (!northlineAutoDemoEnabled) {
            return;
        }

        if (state.overlay !== null || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        resumeTimer = window.setTimeout(() => {
            const steps = [
                () => { const currentIndex = classrooms.findIndex((item) => item.id === state.selectedClassId); state.selectedClassId = classrooms[(currentIndex + 1) % classrooms.length].id; resetSelections(); },
                () => { state.view = 'documents'; state.examsFilter = null; state.studentsFilter = null; },
                () => { state.view = 'students'; state.studentsFilter = 'alerts'; },
                () => { state.view = 'exams'; state.examsFilter = 'next-24h'; state.studentsFilter = null; },
                () => { state.view = 'dashboard'; state.examsFilter = null; state.studentsFilter = null; },
            ];

            steps[state.demoStep % steps.length]();
            state.demoStep += 1;
            render();
            demoTimer = window.setTimeout(scheduleDemo, northlineDemoStepDelay);
        }, northlineDemoDelay);
    };
    const findAssignmentByStudentId = (studentId) => getCurrentClassroom().gradingQueue.find((assignment) => assignment.students.some((student) => student.id === studentId)) ?? getCurrentClassroom().gradingQueue[0] ?? null;
    const openGradingWorkbench = (assignmentId = null) => {
        const fallbackAssignment = getCurrentClassroom().gradingQueue[0] ?? null;
        const nextAssignment = getCurrentClassroom().gradingQueue.find((item) => item.id === assignmentId) ?? fallbackAssignment;

        state.selectedAssignmentId = nextAssignment?.id ?? null;
        state.selectedSubmissionId = nextAssignment?.students[0]?.id ?? null;
        state.selectedGrade = nextAssignment?.students[0]?.defaultGrade ?? null;
        state.overlay = 'grading';
        render();
    };
    const openMessageComposer = () => {
        ensureMessageDraft();
        state.overlay = 'message';
        render();
    };
    const clearOverlay = () => {
        state.overlay = null;
        render();
    };
    const scheduleRollingTextRefresh = () => {
        if (rollingTextFrame !== null) {
            window.cancelAnimationFrame(rollingTextFrame);
        }

        rollingTextFrame = window.requestAnimationFrame(() => {
            initializeNorthlineRollingText(slice);
            rollingTextFrame = null;
        });
    };
    const setView = (view, options = {}) => {
        state.view = view;
        state.studentsFilter = options.studentsFilter ?? (view === 'students' ? state.studentsFilter : null);
        state.examsFilter = options.examsFilter ?? (view === 'exams' ? state.examsFilter : null);
        render();
    };
    const render = () => {
        const classroom = getCurrentClassroom();
        const viewMeta = northlineViewMeta[state.view];
        const selectedDocument = getSelectedDocument();
        const selectedExam = getSelectedExam();
        const selectedStudent = getSelectedStudent();
        const selectedAssignment = getSelectedAssignment();
        const selectedSubmission = getSelectedSubmission();

        if (viewTitle) {
            viewTitle.textContent = viewMeta.getTitle(classroom, state);
        }

        if (viewDescription) {
            viewDescription.textContent = viewMeta.getDescription(classroom, state);
        }

        if (headerContext instanceof HTMLElement) {
            headerContext.innerHTML = renderNorthlineContextChip(classroom);
        }

        if (headerActions instanceof HTMLElement) {
            headerActions.innerHTML = viewMeta.actions.map(renderNorthlineActionButton).join('');
        }

        if (headerFilter instanceof HTMLElement) {
            if (state.examsFilter === 'next-24h') {
                headerFilter.innerHTML = `
                    <button type="button" class="northline-filter-chip northline-filter-chip--inline is-active" data-northline-clear-filter>
                        <span class="northline-filter-chip__eyebrow">Filter</span>
                        <strong class="northline-filter-chip__value">Due soon</strong>
                    </button>
                `;
            } else {
                headerFilter.innerHTML = '';
            }
        }

        if (classMenu instanceof HTMLElement) {
            classMenu.innerHTML = classrooms.map((item) => `
                <button type="button" class="northline-class-option ${item.id === state.selectedClassId ? 'is-active' : ''}" data-northline-class-option="${escapeNorthlineHtml(item.id)}">
                    <span>${escapeNorthlineHtml(item.label)}</span>
                    <strong>${escapeNorthlineHtml(item.name)}</strong>
                </button>
            `).join('');
        }

        if (panels.dashboard instanceof HTMLElement) {
            panels.dashboard.innerHTML = renderNorthlineDashboard(classroom, workflowActions);
            panels.dashboard.querySelector('[data-northline-critical-command]')?.replaceChildren();
            panels.dashboard.querySelector('[data-northline-reach-card]')?.replaceChildren();
            const checkIns = panels.dashboard.querySelector('[data-northline-critical-command]');
            const reachCard = panels.dashboard.querySelector('[data-northline-reach-card]');
            if (checkIns instanceof HTMLElement) {
                checkIns.innerHTML = renderNorthlineCheckInSection(classroom);
                initializeNorthlineCheckInRotation(checkIns);
            }
            if (reachCard instanceof HTMLElement) {
                reachCard.innerHTML = renderNorthlineReachCard(classroom);
            }
        }

        if (panels.documents instanceof HTMLElement) {
            panels.documents.innerHTML = renderNorthlineDocumentsView(classroom, selectedDocument);
        }

        if (panels.exams instanceof HTMLElement) {
            panels.exams.innerHTML = renderNorthlineExamsView(classroom, selectedExam, state);
        }

        if (panels.students instanceof HTMLElement) {
            panels.students.innerHTML = renderNorthlineStudentsView(classroom, getVisibleStudents(), selectedStudent, state);
        }

        Object.entries(panels).forEach(([name, panel]) => {
            if (panel instanceof HTMLElement) {
                panel.classList.toggle('hidden', name !== state.view);
            }
        });

        slice.querySelectorAll('[data-northline-nav]').forEach((button) => {
            if (!(button instanceof HTMLElement)) {
                return;
            }

            button.classList.toggle('northline-nav-pill--active', button.dataset.northlineNav === state.view);
        });

        if (overlayLayer instanceof HTMLElement && gradingOverlay instanceof HTMLElement && messageOverlay instanceof HTMLElement) {
            overlayLayer.classList.toggle('hidden', state.overlay === null);
            overlayLayer.classList.toggle('pointer-events-none', state.overlay === null);
            overlayLayer.classList.toggle('pointer-events-auto', state.overlay !== null);
            gradingOverlay.classList.toggle('hidden', state.overlay !== 'grading');
            messageOverlay.classList.toggle('hidden', state.overlay !== 'message');
            gradingOverlay.innerHTML = state.overlay === 'grading' ? renderNorthlineGradingOverlay(classroom, selectedAssignment, selectedSubmission, state.selectedGrade) : '';
            messageOverlay.innerHTML = state.overlay === 'message' ? renderNorthlineMessageOverlay(classroom, state.messageSubject, state.messageBody) : '';
        }

        scheduleRollingTextRefresh();
    };

    resetSelections();
    render();
    scheduleDemo();
    window.addEventListener('resize', scheduleRollingTextRefresh);

    if (document.fonts?.ready) {
        document.fonts.ready.then(scheduleRollingTextRefresh).catch(() => {});
    }

    ['pointerdown', 'pointerenter', 'focusin', 'keydown', 'touchstart'].forEach((eventName) => {
        slice.addEventListener(eventName, () => {
            pauseDemo();
            scheduleDemo();
        }, { passive: eventName !== 'keydown' });
    });

    document.addEventListener('click', (event) => {
        if (!(event.target instanceof Node) || !(classMenu instanceof HTMLElement) || !(classTrigger instanceof HTMLElement)) {
            return;
        }

        if (!slice.contains(event.target)) {
            classMenu.classList.add('hidden');
            classTrigger.setAttribute('aria-expanded', 'false');
            return;
        }

        if (!classMenu.contains(event.target) && !classTrigger.contains(event.target)) {
            classMenu.classList.add('hidden');
            classTrigger.setAttribute('aria-expanded', 'false');
        }
    });

    slice.addEventListener('click', (event) => {
        const target = event.target instanceof Element ? event.target.closest('[data-northline-nav], [data-northline-class-trigger], [data-northline-class-option], [data-northline-trigger-alerts], [data-northline-workflow-action], [data-northline-open-grading], [data-northline-open-event], [data-northline-document-option], [data-northline-exam-option], [data-northline-student-option], [data-northline-clear-filter], [data-northline-overlay-close], [data-northline-grade-option], [data-northline-student-action], [data-northline-metric], [data-northline-cycle-students-filter]') : null;

        if (!(target instanceof HTMLElement)) {
            return;
        }

        if (target.dataset.northlineNav) {
            setView(target.dataset.northlineNav, { studentsFilter: null, examsFilter: null });
            return;
        }

        if (target.hasAttribute('data-northline-class-trigger') && classMenu instanceof HTMLElement && classTrigger instanceof HTMLElement) {
            const shouldOpen = classMenu.classList.contains('hidden');
            classMenu.classList.toggle('hidden', !shouldOpen);
            classTrigger.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
            return;
        }

        if (target.dataset.northlineClassOption) {
            state.selectedClassId = target.dataset.northlineClassOption;
            state.studentsFilter = null;
            state.examsFilter = null;
            resetSelections();
            classMenu?.classList.add('hidden');
            classTrigger?.setAttribute('aria-expanded', 'false');
            render();
            return;
        }

        if (target.hasAttribute('data-northline-trigger-alerts')) {
            setView('students', { studentsFilter: 'alerts', examsFilter: null });
            return;
        }

        if (target.dataset.northlineWorkflowAction === 'post-materials') {
            setView('documents', { studentsFilter: null, examsFilter: null });
            return;
        }

        if (target.dataset.northlineWorkflowAction === 'create-exam') {
            setView('exams', { studentsFilter: null, examsFilter: null });
            return;
        }

        if (target.dataset.northlineWorkflowAction === 'bulk-grading') {
            openGradingWorkbench();
            return;
        }

        if (target.dataset.northlineWorkflowAction === 'class-message') {
            openMessageComposer();
            return;
        }

        if (target.dataset.northlineMetric === 'pending-grade' || target.dataset.northlineOpenGrading) {
            openGradingWorkbench(target.dataset.northlineOpenGrading ?? undefined);
            return;
        }

        if (target.dataset.northlineMetric === 'late-submits') {
            setView('students', { studentsFilter: 'late-submissions', examsFilter: null });
            return;
        }

        if (target.dataset.northlineMetric === 'deadlines' || target.dataset.northlineOpenEvent) {
            setView('exams', { studentsFilter: null, examsFilter: 'next-24h' });
            return;
        }

        if (target.dataset.northlineDocumentOption) {
            state.selectedDocumentId = target.dataset.northlineDocumentOption;
            render();
            return;
        }

        if (target.dataset.northlineExamOption) {
            state.selectedExamId = target.dataset.northlineExamOption;
            render();
            return;
        }

        if (target.dataset.northlineStudentOption) {
            state.selectedStudentId = target.dataset.northlineStudentOption;
            render();
            return;
        }

        if (target.hasAttribute('data-northline-clear-filter')) {
            state.studentsFilter = null;
            state.examsFilter = null;
            render();
            return;
        }

        if (target.hasAttribute('data-northline-cycle-students-filter')) {
            const currentIndex = northlineStudentsFilterCycle.indexOf(state.studentsFilter);
            const nextFilter = northlineStudentsFilterCycle[(currentIndex + 1) % northlineStudentsFilterCycle.length];
            state.studentsFilter = nextFilter;
            state.selectedStudentId = getVisibleStudents()[0]?.id ?? null;
            render();
            return;
        }

        if (target.hasAttribute('data-northline-overlay-close')) {
            clearOverlay();
            return;
        }

        if (target.dataset.northlineGradeOption) {
            state.selectedGrade = target.dataset.northlineGradeOption;
            render();
            return;
        }

        if (target.dataset.northlineStudentAction === 'View submission' && getSelectedStudent()) {
            const assignment = findAssignmentByStudentId(getSelectedStudent().id);
            openGradingWorkbench(assignment?.id ?? null);
        }
    });

    slice.addEventListener('change', (event) => {
        const target = event.target;

        if (!(target instanceof HTMLElement)) {
            return;
        }

        if (target.matches('[data-northline-grading-assignment]') && target instanceof HTMLSelectElement) {
            state.selectedAssignmentId = target.value;
            state.selectedSubmissionId = getSelectedAssignment()?.students[0]?.id ?? null;
            state.selectedGrade = getSelectedAssignment()?.students[0]?.defaultGrade ?? null;
            render();
        }

        if (target.matches('[data-northline-grading-student]') && target instanceof HTMLSelectElement) {
            state.selectedSubmissionId = target.value;
            state.selectedGrade = getSelectedSubmission()?.defaultGrade ?? null;
            render();
        }

        if (target.matches('[data-northline-grade-select]') && target instanceof HTMLSelectElement) {
            state.selectedGrade = target.value;
            render();
        }

        if (target.matches('[data-northline-message-subject]') && target instanceof HTMLInputElement) {
            state.messageSubject = target.value;
        }

        if (target.matches('[data-northline-message-body]') && target instanceof HTMLTextAreaElement) {
            state.messageBody = target.value;
        }
    });
});

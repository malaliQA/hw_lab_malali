// A single task stored in the Firestore "tasks" collection.
// id is optional because a new task has no id until Firestore assigns one on insert.
export interface TaskItem {
    id?: string;
    name: string;
    assignedTo: string;
    dueDate: Date;
    dateAdded: Date;
    completed: boolean;
}

// Returns true when both the task name and the assignee contain at least one
// non-whitespace character. Shared by the New Task and Edit Task screens.
export function isValidTask(name: string, assignedTo: string): boolean {
    return name.trim().length > 0 && assignedTo.trim().length > 0;
}

// Comparator for Array.prototype.sort(): orders tasks alphabetically by name.
export function compareTasksByName(a: TaskItem, b: TaskItem): number {
    return a.name.localeCompare(b.name);
}

// Comparator for Array.prototype.sort(): orders tasks by due date, earliest first.
export function compareTasksByDueDate(a: TaskItem, b: TaskItem): number {
    return a.dueDate.getTime() - b.dueDate.getTime();
}

// Two tasks are "equal" when name, assignee and due date match.
// id, dateAdded and completed are deliberately ignored.
export function areTasksEqual(a: TaskItem, b: TaskItem): boolean {
    return (
        a.name === b.name &&
        a.assignedTo === b.assignedTo &&
        a.dueDate.getTime() === b.dueDate.getTime()
    );
}

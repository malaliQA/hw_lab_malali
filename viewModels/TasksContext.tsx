import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
    collection,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { TaskItem } from '../models/TaskItem';

const COLLECTION = 'tasks';

// Everything a screen can read or call through useTasks().
type TasksContextValue = {
    tasks: TaskItem[];
    loading: boolean;
    addTask: (task: Omit<TaskItem, 'id'>) => Promise<void>;
    updateTask: (task: TaskItem) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    toggleCompleted: (task: TaskItem) => Promise<void>;
};

const TasksContext = createContext<TasksContextValue | undefined>(undefined);

// Provider that owns the single Firestore subscription for the whole app and
// exposes the task list plus CRUD operations to every screen beneath it.
export function TasksProvider({ children }: { children: ReactNode }) {
    const [tasks, setTasks] = useState<TaskItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Subscribe to real-time updates from Firestore. The unsubscribe returned
    // by onSnapshot is what we call on unmount to tear the listener down --
    // the RN equivalent of the Swift version removing its ListenerRegistration
    // in deinit.
    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, COLLECTION),
            // Success callback: convert each Firestore document into a TaskItem
            // (Timestamps -> Dates), sort the list, and publish it to state.
            (snapshot) => {
                const next: TaskItem[] = snapshot.docs.map((d) => {
                    const data = d.data();
                    return {
                        id: d.id,
                        name: data.name,
                        assignedTo: data.assignedTo,
                        dueDate: data.dueDate?.toDate() ?? new Date(),
                        dateAdded: data.dateAdded?.toDate() ?? new Date(),
                        completed: data.completed ?? false,
                    };
                });
                // Incomplete first, then by due date ascending.
                next.sort((a, b) => {
                    if (a.completed !== b.completed) return a.completed ? 1 : -1;
                    return a.dueDate.getTime() - b.dueDate.getTime();
                });
                setTasks(next);
                setLoading(false);
            },
            // Error callback: log the problem (often expired test-mode rules)
            // and stop showing the spinner.
            (error) => {
                console.error('Firestore listener error:', error);
                setLoading(false);
            }
        );
        return unsubscribe;
    }, []);

    // Insert a new task document; Firestore generates the id. Dates are
    // converted to Firestore Timestamps on the way in.
    const addTask = async (task: Omit<TaskItem, 'id'>) => {
        await addDoc(collection(db, COLLECTION), {
            ...task,
            dueDate: Timestamp.fromDate(task.dueDate),
            dateAdded: Timestamp.fromDate(task.dateAdded),
        });
    };

    // Overwrite the editable fields of an existing task document.
    const updateTask = async (task: TaskItem) => {
        if (!task.id) throw new Error('Cannot update a task without an id');
        await updateDoc(doc(db, COLLECTION, task.id), {
            name: task.name,
            assignedTo: task.assignedTo,
            dueDate: Timestamp.fromDate(task.dueDate),
            completed: task.completed,
        });
    };

    // Remove the task document with the given id.
    const deleteTask = async (id: string) => {
        await deleteDoc(doc(db, COLLECTION, id));
    };

    // Flip only the completed flag of a task (used by the row checkbox).
    const toggleCompleted = async (task: TaskItem) => {
        if (!task.id) throw new Error('Cannot toggle a task without an id');
        await updateDoc(doc(db, COLLECTION, task.id), { completed: !task.completed });
    };

    return (
        <TasksContext.Provider value={{ tasks, loading, addTask, updateTask, deleteTask, toggleCompleted }}>
            {children}
        </TasksContext.Provider>
    );
}

// Hook screens use to reach the shared task store. Throws if a component
// calls it outside of TasksProvider, which would otherwise fail silently.
export function useTasks(): TasksContextValue {
    const ctx = useContext(TasksContext);
    if (!ctx) throw new Error('useTasks must be used inside a TasksProvider');
    return ctx;
}

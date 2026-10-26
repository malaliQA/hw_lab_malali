import type { TaskItem } from './models/TaskItem';

// Screens in the stack nested inside the Tasks tab. TaskDetails receives only
// the id and looks up the freshest copy of the task from context.
export type TasksStackParamList = {
    TasksList: undefined;
    TaskDetails: { taskId: string };
};

// Screens in the bottom tab bar.
export type RootTabParamList = {
    Tasks: undefined;
    NewTask: undefined;
};

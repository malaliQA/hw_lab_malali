import { Alert, Platform } from 'react-native';
import { isValidTask } from '../models/TaskItem';

// Formats a date for display, e.g. "January 15, 2026".
export function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
    });
}

// Builds the onChange handler for DateTimePicker: hides the picker on Android
// (keeps it open on iOS) and passes the chosen date to onPick.
export function makeDateChangeHandler(
    setShowPicker: (show: boolean) => void,
    onPick: (date: Date) => void,
) {
    // Called by DateTimePicker whenever the user picks or dismisses.
    return (_event: unknown, selected?: Date) => {
        // Android auto-dismisses; iOS stays open until we set it to false ourselves.
        setShowPicker(Platform.OS === 'ios');
        if (selected) onPick(selected);
    };
}

// Validates the form, runs the save, then calls onDone on success.
// Shows an alert for invalid input or a failed save.
export async function saveWithValidation(
    name: string,
    assignedTo: string,
    save: () => Promise<void>,
    onDone: () => void,
) {
    if (!isValidTask(name, assignedTo)) {
        Alert.alert('Validation Error', 'Please fill in both name and assignee.');
        return;
    }
    try {
        await save();
        onDone();
    } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to save task.');
    }
}

// Asks the user to confirm a delete; if they confirm, runs performDelete and
// then onDone. Shows an alert if the delete fails.
export function confirmDelete(
    performDelete: () => Promise<void>,
    onDone: () => void,
) {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
        { text: 'Cancel', style: 'cancel' },
        {
            text: 'Delete',
            style: 'destructive',
            // Runs when the user taps the destructive "Delete" button.
            onPress: async () => {
                try {
                    await performDelete();
                    onDone();
                } catch (error) {
                    console.error(error);
                    Alert.alert('Error', 'Failed to delete task.');
                }
            },
        },
    ]);
}

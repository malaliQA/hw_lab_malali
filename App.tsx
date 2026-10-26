import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { TasksProvider } from './viewModels/TasksContext';
import TasksView from './views/TasksView';
import NewTaskView from './views/NewTaskView';
import TaskDetailsView from './views/TaskDetailsView';
import type { TasksStackParamList, RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();
const TasksStack = createNativeStackNavigator<TasksStackParamList>();

// Stack shown inside the Tasks tab: the list, plus the details screen pushed on top.
function TasksStackScreen() {
    return (
        <TasksStack.Navigator>
            <TasksStack.Screen name="TasksList" component={TasksView} options={{ title: 'Arbeit' }} />
            <TasksStack.Screen name="TaskDetails" component={TaskDetailsView} options={{ title: 'Task Details' }} />
        </TasksStack.Navigator>
    );
}

// Root component. TasksProvider wraps navigation so every tab and screen
// shares the same task store and Firestore subscription.
export default function App() {
    return (
        <TasksProvider>
            <NavigationContainer>
                <Tab.Navigator
                    screenOptions={({ route }) => ({
                        headerShown: false,
                        // Pick the tab bar icon based on which tab is being drawn.
                        tabBarIcon: ({ color, size }) => {
                            const icon = route.name === 'Tasks' ? 'checkmark-done-circle' : 'add-circle';
                            return <Ionicons name={icon} size={size} color={color} />;
                        },
                    })}
                >
                    <Tab.Screen name="Tasks" component={TasksStackScreen} />
                    <Tab.Screen name="NewTask" component={NewTaskView} options={{ title: 'New Task', headerShown: true }} />
                </Tab.Navigator>
            </NavigationContainer>
        </TasksProvider>
    );
}

// Screens in the root stack. Map takes no params because it reads the saved
// coordinate from LocationContext, which avoids passing a possibly-stale copy.
export type RootStackParamList = {
    Home: undefined;
    Map: undefined;
};

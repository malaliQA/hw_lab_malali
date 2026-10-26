import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Config values for the "ArbeitRN" web app registered in the Firebase console
// (Project settings -> Your apps -> SDK setup and configuration).
const firebaseConfig = {
    apiKey: 'AIzaSyDaRwjHDFSjIe6pI5-y6g5N-YjsI20iq2w',
    authDomain: 'arbeit-76e7b.firebaseapp.com',
    projectId: 'arbeit-76e7b',
    storageBucket: 'arbeit-76e7b.firebasestorage.app',
    messagingSenderId: '274720629732',
    appId: '1:274720629732:web:b4b35cf46d2d416b60ddf1',
};

// Initialize the Firebase app once and export the Firestore handle that the
// rest of the app (TasksProvider) uses for reads and writes.
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';

let laser: ReturnType<typeof createAudioPlayer> | null = null;

// Sets the audio mode and loads the laser sound once for the whole app session.
export async function initSound() {
    if (laser) return; // already loaded -- don't create a new player every level
    await setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: false });
    laser = createAudioPlayer(require('../assets/sounds/laser.mp3'));
}

// Plays the laser sound from the start (does nothing if it hasn't loaded yet).
export function playLaser() {
    if (!laser) return;
    laser.seekTo(0);
    laser.play();
}

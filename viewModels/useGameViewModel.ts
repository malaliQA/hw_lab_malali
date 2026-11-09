import { useEffect, useReducer, useState } from 'react';
import { EmojiSearchStatus } from '../models/Emoji';
import { gameReducer, initialGameState } from './gameReducer';

// Hook that wraps gameReducer, runs the one-second countdown, and exposes the
// game state plus the actions the views can trigger.
export function useGameViewModel() {
    const [state, dispatch] = useReducer(gameReducer, initialGameState);
    const [tensorLoaded, setTensorLoaded] = useState(false);

    // Countdown: only tick while we're actively searching *and* the ML model
    // has finished loading (no fair burning the clock while MobileNet is still
    // spinning up).
    useEffect(() => {
        if (!tensorLoaded) return;
        if (state.emojiStatus !== EmojiSearchStatus.Searching) return;

        const id = setInterval(() => dispatch({ type: 'tick' }), 1000);
        return () => clearInterval(id);
    }, [tensorLoaded, state.emojiStatus]);

    return {
        ...state,
        tensorLoaded,
        setTensorLoaded,
        // Called by the camera when it recognizes the target object.
        foundEmoji: () => dispatch({ type: 'foundEmoji' }),
        // Called by the NEXT button to move to the next emoji.
        startNext: () => dispatch({ type: 'nextEmoji' }),
        // Called by the GAME OVER button to start over from level 0.
        restart: () => dispatch({ type: 'restart' }),
    };
}

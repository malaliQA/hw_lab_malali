import { EmojiSearchStatus, emojiObjects } from '../models/Emoji';

export const ROUND_DURATION = 10;

// Everything the game needs to know about the current round.
export type GameState = {
    currentLevel: number;
    timeRemaining: number;
    emojiStatus: EmojiSearchStatus;
    showNext: boolean;
};

// State at the start of a new game: first level, full timer, searching.
export const initialGameState: GameState = {
    currentLevel: 0,
    timeRemaining: ROUND_DURATION,
    emojiStatus: EmojiSearchStatus.Searching,
    showNext: false,
};

// The events that can change the game state.
export type GameAction =
    | { type: 'tick' }
    | { type: 'foundEmoji' }
    | { type: 'nextEmoji' }
    | { type: 'restart' };

// Pure state machine for the game: given the current state and an action,
// returns the next state without touching React, timers or the camera.
export function gameReducer(state: GameState, action: GameAction): GameState {
    switch (action.type) {
        case 'tick':
            // Ticks are ignored unless we're actively searching.
            if (state.emojiStatus !== EmojiSearchStatus.Searching) return state;
            if (state.timeRemaining > 1) {
                return { ...state, timeRemaining: state.timeRemaining - 1 };
            }
            return {
                ...state,
                timeRemaining: 0,
                emojiStatus: EmojiSearchStatus.NotFound,
                showNext: true,
            };

        case 'foundEmoji':
            // Only "found" while we're actively searching; ignore late callbacks.
            if (state.emojiStatus !== EmojiSearchStatus.Searching) return state;
            return { ...state, emojiStatus: EmojiSearchStatus.Found, showNext: true };

        case 'nextEmoji':
            if (state.currentLevel >= emojiObjects.length - 1) {
                return { ...state, emojiStatus: EmojiSearchStatus.GameOver };
            }
            return {
                ...state,
                currentLevel: state.currentLevel + 1,
                timeRemaining: ROUND_DURATION,
                emojiStatus: EmojiSearchStatus.Searching,
                showNext: false,
            };

        case 'restart':
            return initialGameState;
    }
}

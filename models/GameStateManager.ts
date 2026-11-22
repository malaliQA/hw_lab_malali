import { Constants } from './Constants';

// Singleton that keeps the level, score and lives alive across screen
// navigations (Game -> LevelComplete -> Game).
class GameStateManager {
    private static _instance: GameStateManager | null = null;

    private _currentLevel = 1;
    private _score = 0;
    private _lives: number = Constants.Player.startingLives;

    // Private so the only way to get a manager is through `instance`.
    private constructor() {}

    // Returns the one shared manager, creating it on first use.
    static get instance(): GameStateManager {
        if (!this._instance) this._instance = new GameStateManager();
        return this._instance;
    }

    // Read-only access to the current level number (starts at 1).
    get currentLevel() { return this._currentLevel; }

    // Read-only access to the running score.
    get score() { return this._score; }

    // Read-only access to the lives the player has left.
    get lives() { return this._lives; }

    // Moves on to the next level.
    advanceToNextLevel() { this._currentLevel += 1; }

    // Puts the level back to 1 without touching score or lives.
    resetLevel() { this._currentLevel = 1; }

    // True once the player has gone past the last level.
    isMaxLevelReached() { return this._currentLevel > Constants.Game.maxLevels; }

    // Adds points to the score.
    addScore(points: number) { this._score += points; }

    // Takes away one life and returns how many are left.
    loseLife(): number { this._lives -= 1; return this._lives; }

    // Starts a brand-new game: level 1, zero score, full lives.
    resetGame() {
        this._currentLevel = 1;
        this._score = 0;
        this._lives = Constants.Player.startingLives;
    }
}

export default GameStateManager;

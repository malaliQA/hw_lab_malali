import { Constants } from './Constants';
import type { Bounds } from './Bullet';

// The player's ship: tilt-driven movement, firing cooldown, sprite toggle and life state.
export class Player {
    id = 'player';
    width = Constants.Player.width;
    height = Constants.Player.height;
    x: number;
    y: number;
    velocityX = 0;
    isAlive = true;
    lastFireTime = 0;
    imageIndex: 1 | 2 = 1;
    private screenWidth: number;
    private screenHeight: number;

    // Starts the ship centered horizontally near the bottom of the screen.
    constructor(screenWidth: number, screenHeight: number) {
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.x = (screenWidth - this.width) / 2;
        this.y = screenHeight - this.height - Constants.Player.bottomOffset;
    }

    // Turns the accelerometer's x reading into a horizontal speed, capped at maxSpeed.
    setVelocity(accelerationX: number) {
        const raw = accelerationX * Constants.Input.tiltSensitivity;
        const cap = Constants.Input.maxSpeed / Constants.Game.fps;
        this.velocityX = Math.max(-cap, Math.min(cap, raw));
    }

    // Moves the ship one frame and keeps it inside the left and right bounds.
    update() {
        this.x += this.velocityX;
        const rightBound = this.screenWidth - this.width - 20;
        this.x = Math.max(Constants.Layout.leftBound, Math.min(rightBound, this.x));
    }

    // True (and starts the cooldown) if enough time has passed since the last shot.
    canFire(): boolean {
        const now = Date.now();
        if (now - this.lastFireTime > Constants.Player.fireCooldown) {
            this.lastFireTime = now;
            return true;
        }
        return false;
    }

    // Where a player bullet should start: centered on the top edge of the ship.
    getBulletSpawnPosition() {
        return { x: this.x + this.width / 2, y: this.y };
    }

    // Swaps between the two ship sprites so firing looks animated.
    toggleImage() { this.imageIndex = this.imageIndex === 1 ? 2 : 1; }

    // The ship's bounding box, used for collision checks.
    getBounds(): Bounds {
        return { left: this.x, right: this.x + this.width, top: this.y, bottom: this.y + this.height };
    }

    // Marks the ship as destroyed so it stops drawing and taking hits.
    kill() { this.isAlive = false; }

    // Brings the ship back at its starting spot after losing a life.
    respawn() {
        this.x = (this.screenWidth - this.width) / 2;
        this.y = this.screenHeight - this.height - Constants.Player.bottomOffset;
        this.velocityX = 0;
        this.isAlive = true;
        this.imageIndex = 1;
    }
}

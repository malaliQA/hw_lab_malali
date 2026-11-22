// An axis-aligned bounding box in screen coordinates.
export type Bounds = { left: number; right: number; top: number; bottom: number };

// Base class for anything fired in the game. A positive speed moves the
// bullet down the screen, a negative speed moves it up.
export class Bullet {
    id: string;
    x: number;
    y: number;
    speed: number;
    width: number;
    height: number;
    color: string;
    shouldRemove = false;

    // Creates a bullet centered horizontally on x, with its top edge at y.
    constructor(x: number, y: number, speed: number, width: number, height: number, color: string) {
        this.id = `bullet_${Date.now()}_${Math.random()}`;
        this.x = x - width / 2;
        this.y = y;
        this.speed = speed;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    // Moves the bullet one frame along its direction of travel.
    update() { this.y += this.speed; }

    // True once the bullet has fully left the top or bottom of the screen.
    isOffScreen(screenHeight: number): boolean {
        return this.y < -this.height || this.y > screenHeight + this.height;
    }

    // The bullet's bounding box, used for collision checks.
    getBounds(): Bounds {
        return { left: this.x, right: this.x + this.width, top: this.y, bottom: this.y + this.height };
    }
}

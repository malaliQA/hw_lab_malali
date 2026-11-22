import { Constants } from './Constants';
import type { Bounds } from './Bullet';

// One invader in the marching grid.
export class Invader {
    id: string;
    row: number;
    column: number;
    x: number;
    y: number;
    width = Constants.Invader.width;
    height = Constants.Invader.height;
    imageType: 1 | 2 | 3;
    shouldRemove = false;

    // Places the invader at its grid slot and picks one of the three invader images at random.
    constructor(row: number, column: number, x: number, y: number) {
        this.id = `invader_${row}_${column}`;
        this.row = row;
        this.column = column;
        this.x = x;
        this.y = y;
        const [min, max] = Constants.Invader.imageTypeRange;
        this.imageType = (Math.floor(Math.random() * (max - min + 1)) + min) as 1 | 2 | 3;
    }

    // Shifts the invader by dx horizontally and dy vertically.
    move(dx: number, dy = 0) {
        this.x += dx;
        this.y += dy;
    }

    // True when the invader has crossed the left or right edge of the play area.
    isAtEdge(leftBound: number, rightBound: number): boolean {
        return this.x < leftBound || this.x + this.width > rightBound;
    }

    // Where a bullet fired by this invader should start: centered just below it.
    getBulletSpawnPosition() {
        return { x: this.x + this.width / 2, y: this.y + this.height };
    }

    // The invader's bounding box, used for collision checks.
    getBounds(): Bounds {
        return { left: this.x, right: this.x + this.width, top: this.y, bottom: this.y + this.height };
    }
}

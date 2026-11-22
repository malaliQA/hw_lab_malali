import { Bullet } from './Bullet';
import { Constants } from './Constants';

// A red bullet fired by an invader that travels down the screen.
export class InvaderBullet extends Bullet {
    // Creates the bullet at (x, y) with the invader bullet settings and a positive (downward) speed.
    constructor(x: number, y: number) {
        const { speed, width, height, color } = Constants.InvaderBullet;
        super(x, y, speed, width, height, color);
    }
}

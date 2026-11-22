import type { Bounds } from '../models/Bullet';

// Classic AABB check: true when the two boxes overlap. Boxes that only touch
// along an edge do not count.
export function boundsOverlap(a: Bounds, b: Bounds): boolean {
    return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

export type Collision<A, B> = { a: A; b: B };

// Returns every (a, b) pair from the two lists whose bounding boxes overlap.
export function findCollisions<A extends { getBounds(): Bounds }, B extends { getBounds(): Bounds }>(
    as: A[], bs: B[],
): Collision<A, B>[] {
    const out: Collision<A, B>[] = [];
    for (const a of as) {
        const ab = a.getBounds();
        for (const b of bs) {
            if (boundsOverlap(ab, b.getBounds())) out.push({ a, b });
        }
    }
    return out;
}

// Returns the first item in bs that overlaps a, or null if none do.
export function firstCollision<A extends { getBounds(): Bounds }, B extends { getBounds(): Bounds }>(
    a: A, bs: B[],
): B | null {
    const ab = a.getBounds();
    for (const b of bs) if (boundsOverlap(ab, b.getBounds())) return b;
    return null;
}

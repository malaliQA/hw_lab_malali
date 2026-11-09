// The states a round of the game can be in.
export enum EmojiSearchStatus {
    Searching = 'Searching',
    Found = 'Found',
    NotFound = 'NotFound',
    GameOver = 'GameOver',
}

// A target emoji plus the MobileNet label names that count as finding it.
export interface Emoji {
    emoji: string;
    emojiNames: string[]; // exact MobileNet label names that count for this emoji
}

// The levels of the game, in order.
export const emojiObjects: Emoji[] = [
    { emoji: '💻', emojiNames: ['laptop', 'laptop computer', 'notebook', 'notebook computer'] },
    { emoji: '📱', emojiNames: ['cellular telephone', 'cellular phone', 'cellphone', 'cell', 'mobile phone'] },
    { emoji: '🖊️', emojiNames: ['ballpoint', 'ballpoint pen', 'ballpen', 'biro', 'fountain pen', 'quill pen'] },
    { emoji: '📖', emojiNames: ['book jacket', 'dust cover', 'dust jacket', 'dust wrapper', 'comic book'] },
    { emoji: '🎒', emojiNames: ['backpack', 'back pack', 'knapsack', 'packsack', 'rucksack', 'haversack'] },
];

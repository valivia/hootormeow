function hashStringToSeed(str: string): number {
    let hash = 2166136261; // FNV-1a
    for (let i = 0; i < str.length; i++) {
        hash ^= str.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0; // unsigned 32-bit
}


function seededRandom(seed: number) {
    return function () {
        let t = seed += 0x6D2B79F5;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

export function shuffle<T>(array: T[], seed: number | string): T[] {
    if (typeof seed === "string") {
        seed = hashStringToSeed(seed);
    }
    const random = seededRandom(seed);

    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

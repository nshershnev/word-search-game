interface Level {
    source_language: string;
    word: string;
    character_grid: string[][];
    word_locations: Object;
    target_language: string;
}

interface VectorPoint {
    x: number;
    y: number;
}
import { a as PuzzleID, P as PuzzleLoader, E as ExperimentalStickering, S as StickeringMask } from '../TwizzleLink-f8f2c814.js';
export { P as PuzzleLoader } from '../TwizzleLink-f8f2c814.js';
import { g as PuzzleSpecificSimplifyOptions } from '../Alg-c6770822.js';
import { a as KPuzzle, P as PuzzleGeometry } from '../KState-8f0d81ea.js';
import 'three';
import '../parseAlg-d2c83795.js';

interface EventInfo {
    puzzleID: PuzzleID;
    eventName: string;
}
declare const wcaEvents: Record<string, EventInfo>;
/** @category Event Info */
declare function wcaEventInfo(event: string): EventInfo | null;
declare const twizzleEvents: Record<string, EventInfo>;
/** @category Event Info */
declare function eventInfo(event: string): EventInfo | null;

/** @category Specific Puzzles */
declare const cube2x2x2: PuzzleLoader;

/** @category Specific Puzzles */
declare const cube3x3x3: {
    id: string;
    fullName: string;
    inventedBy: string[];
    inventionYear: number;
    kpuzzle: () => Promise<KPuzzle>;
    svg: () => Promise<string>;
    llSVG: () => Promise<string>;
    pg: () => Promise<PuzzleGeometry>;
    stickeringMask: (stickering: ExperimentalStickering) => Promise<StickeringMask>;
    stickerings: () => Promise<string[]>;
    puzzleSpecificSimplifyOptions: PuzzleSpecificSimplifyOptions;
};

/** @category All Puzzles */
declare const puzzles: Record<string, PuzzleLoader>;

export { cube2x2x2, cube3x3x3, eventInfo, puzzles, twizzleEvents, wcaEventInfo, wcaEvents };

import type { Move, QuantumMove } from "../alg-nodes";

// TODO: enums?
const DEFAULT_DIRECTIONAL = "any-direction";
DEFAULT_DIRECTIONAL;
export type QuantumDirectionalCancellation =
  | typeof DEFAULT_DIRECTIONAL // Cancel any moves with the same quantum.
  | "same-direction" // Cancel two quantums when have non-zero amounts of the same sign (positive/negative). An amount of 0 always counts as the same direction as any other amount.
  | "none";

// Example input: `R7' . R6' . R5' . R6` on a cube.
const DEFAULT_MOD_WRAP = "canonical-centered"; // R . R2 . R' . R2
export type ModWrap =
  | typeof DEFAULT_MOD_WRAP
  | "none"
  | "gravity" // R . R2' . R' . R2
  | "canonical-positive" // R . R2 . R3 . R2
  | "preserve-sign"; // R3' . R2' . R' . R2

// TODO: preserve single moves?
export interface AppendOptions {
  cancel?:
    | true // Use defaults
    | {
      directional?: QuantumDirectionalCancellation; // default:
      puzzleSpecificModWrap?: ModWrap; // default: "gravity"
    };
  puzzleSpecific?: PuzzleSpecificAppendOptions;
}

export class AppendOptionsHelper {
  constructor(public config: AppendOptions = {}) {}

  cancelQuantum(): QuantumDirectionalCancellation {
    const { cancel } = this.config;
    if (cancel === true) {
      return DEFAULT_DIRECTIONAL;
    }
    return cancel?.directional ?? DEFAULT_DIRECTIONAL;
  }

  cancelAny() {
    return this.config.cancel && this.cancelQuantum() !== "none";
  }

  cancelPuzzleSpecificModWrap(): ModWrap {
    if (this.config.cancel === true) {
      return DEFAULT_MOD_WRAP;
    }
    return this.config.cancel?.puzzleSpecificModWrap ?? DEFAULT_MOD_WRAP;
  }
}

export interface SimplifyOptions extends AppendOptions {
  depth?: number | null; // TODO: test
}

export interface PuzzleSpecificAxisAppendInfo {
  // All moves on the same axis *must* commute.
  areQuantumMovesSameAxis: (
    quantumMove1: QuantumMove,
    quantumMove2: QuantumMove,
  ) => boolean;
  simplifySameAxisMoves: (moves: Move[]) => Move[];
}

// TOOD: allow "normal" "twisty" puzzles to hardcode axis concepts without hardcoding too much in `Alg` that's not relevant to all puzzles.
export interface PuzzleSpecificAppendOptions {
  quantumMoveOrder?: (quantumMove: QuantumMove) => number;
  // TODO: implement cancellation for non-axis commuting moves (e.g. Megaminx: `BL R BL'` → `R`)
  // // Commutation is not transitive. For example, on Megaminx: BR and BL both commute with F, but not with each other.
  // doQuantumMovesCommute?: (
  //   quantumMove1: QuantumMove,
  //   quantumMove2: QuantumMove,
  // ) => boolean;
  axis?: PuzzleSpecificAxisAppendInfo;
}

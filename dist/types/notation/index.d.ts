import { a as Alg } from '../Alg-c6770822.js';
import { P as PuzzleLoader } from '../TwizzleLink-f8f2c814.js';
import 'three';
import '../parseAlg-d2c83795.js';
import '../KState-8f0d81ea.js';

declare enum CommonMetric {
    OuterBlockTurnMetric = "OBTM",
    RangeBlockTurnMetric = "RBTM",
    SingleSliceTurnMetric = "SSTM",
    OuterBlockQuantumTurnMetric = "OBQTM",
    RangeBlockQuantumTurnMetric = "RBQTM",
    SingleSliceQuantumTurnMetric = "SSQTM",
    ExecutionTurnMetric = "ETM"
}
declare enum CommonMetricAlias {
    QuantumTurnMetric = "OBQTM",
    HandTurnMetric = "OBTM",
    SliceTurnMetric = "RBTM"
}

declare const countMoves: (alg: Alg) => number;
declare const countMovesETM: (alg: Alg) => number;
declare const countQuantumMoves: (alg: Alg) => number;
/**
 * Only implemented so far:
 *
 * - 3x3x3: OBTM, RBTM, ETM
 */
declare function countMetricMoves(puzzle: PuzzleLoader, metric: CommonMetric, alg: Alg): number;

declare const countAnimatedLeaves: (alg: Alg) => number;

export { CommonMetric as ExperimentalCommonMetric, CommonMetricAlias as ExperimentalCommonMetricAlias, countAnimatedLeaves as experimentalCountAnimatedLeaves, countMetricMoves as experimentalCountMetricMoves, countMoves as experimentalCountMoves, countMovesETM as experimentalCountMovesETM, countQuantumMoves as experimentalCountQuantumMoves };

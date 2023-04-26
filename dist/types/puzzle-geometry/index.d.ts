import { g as Perm } from '../KState-8f0d81ea.js';
export { v as EXPERIMENTAL_PUZZLE_BASE_SHAPES, t as EXPERIMENTAL_PUZZLE_CUT_TYPES, q as ExperimentalPGNotation, w as ExperimentalPuzzleBaseShape, r as ExperimentalPuzzleCutDescription, u as ExperimentalPuzzleCutType, s as ExperimentalPuzzleDescription, P as PuzzleGeometry, Q as Quat, S as StickerDat, l as StickerDatAxis, m as StickerDatFace, n as StickerDatSticker, k as getPG3DNamedPuzzles, h as getPuzzleDescriptionString, i as getPuzzleGeometryByDesc, j as getPuzzleGeometryByName, o as parseOptions, p as parsePuzzleDescription } from '../KState-8f0d81ea.js';
import '../Alg-c6770822.js';

declare function schreierSims(g: Perm[], disp: (s: string) => void): bigint;

export { schreierSims };

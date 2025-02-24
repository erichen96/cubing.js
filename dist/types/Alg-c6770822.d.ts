declare enum IterationDirection {
    Forwards = 1,
    Backwards = -1
}

interface QuantumMoveModifications {
    outerLayer?: number;
    innerLayer?: number;
    family?: string;
}
declare class QuantumMove extends Comparable {
    #private;
    constructor(family: string, innerLayer?: number | null, outerLayer?: number | null);
    static fromString(s: string): QuantumMove;
    modified(modifications: QuantumMoveModifications): QuantumMove;
    isIdentical(other: QuantumMove): boolean;
    /** @deprecated */
    get family(): string;
    /** @deprecated */
    get outerLayer(): number | null;
    /** @deprecated */
    get innerLayer(): number | null;
    experimentalExpand(): Generator<AlgLeaf>;
    toString(): string;
}
interface MoveModifications {
    outerLayer?: number;
    innerLayer?: number;
    family?: string;
    amount?: number;
}
/** @category Alg Nodes */
declare class Move extends AlgCommon<Move> {
    #private;
    constructor(...args: [QuantumMove] | [QuantumMove, number] | [string] | [string, number]);
    isIdentical(other: Comparable): boolean;
    invert(): Move;
    experimentalExpand(iterDir?: IterationDirection): Generator<AlgLeaf>;
    get quantum(): QuantumMove;
    modified(modifications: MoveModifications): Move;
    static fromString(s: string): Move;
    get amount(): number;
    /** @deprecated */
    get type(): string;
    /** @deprecated */
    get family(): string;
    /** @deprecated */
    get outerLayer(): number | undefined;
    /** @deprecated */
    get innerLayer(): number | undefined;
    toString(): string;
}

/** @category Alg Nodes */
declare class LineComment extends AlgCommon<LineComment> {
    #private;
    constructor(commentText: string);
    get text(): string;
    isIdentical(other: Comparable): boolean;
    invert(): LineComment;
    experimentalExpand(_iterDir?: IterationDirection, _depth?: number): Generator<AlgLeaf>;
    toString(): string;
}

/** @category Alg Nodes */
declare class Commutator extends AlgCommon<Commutator> {
    #private;
    constructor(aSource: FlexibleAlgSource, bSource: FlexibleAlgSource);
    get A(): Alg;
    get B(): Alg;
    isIdentical(other: Comparable): boolean;
    invert(): Commutator;
    experimentalExpand(iterDir?: IterationDirection, depth?: number): Generator<AlgLeaf>;
    toString(): string;
}

/** @category Alg Nodes */
declare class Conjugate extends AlgCommon<Conjugate> {
    #private;
    constructor(aSource: FlexibleAlgSource, bSource: FlexibleAlgSource);
    get A(): Alg;
    get B(): Alg;
    isIdentical(other: Comparable): boolean;
    invert(): Conjugate;
    experimentalExpand(iterDir: IterationDirection, depth?: number): Generator<AlgLeaf>;
    toString(): string;
}

/** @category Alg Nodes */
declare class Newline extends AlgCommon<Newline> {
    toString(): string;
    isIdentical(other: Comparable): boolean;
    invert(): Newline;
    experimentalExpand(_iterDir?: IterationDirection, _depth?: number): Generator<AlgLeaf>;
}

/** @category Alg Nodes */
declare class Pause extends AlgCommon<Pause> {
    experimentalNISSGrouping?: Grouping;
    toString(): string;
    isIdentical(other: Comparable): boolean;
    invert(): Pause;
    experimentalExpand(_iterDir?: IterationDirection, _depth?: number): Generator<AlgLeaf>;
}

/** @category Alg Nodes */
declare class Grouping extends AlgCommon<Grouping> {
    #private;
    experimentalNISSPlaceholder?: Pause;
    constructor(algSource: FlexibleAlgSource, amount?: number);
    isIdentical(other: Comparable): boolean;
    get alg(): Alg;
    get amount(): number;
    /** @deprecated */
    get experimentalRepetitionSuffix(): string;
    invert(): Grouping;
    experimentalExpand(iterDir?: IterationDirection, depth?: number): Generator<AlgLeaf>;
    static fromString(): Grouping;
    toString(): string;
    experimentalAsSquare1Tuple(): [moveU: Move, moveD: Move] | null;
}

/** @category Alg Nodes */
type AlgLeaf = Move | LineComment | Newline | Pause;
/** @category Alg Nodes */
type AlgBranch = Grouping | Conjugate | Commutator;
/** @category Alg Nodes */
type AlgNode = AlgLeaf | AlgBranch;

declare abstract class Comparable {
    is(c: any): boolean;
    as<T>(c: new (...args: any) => T): T | null;
    abstract isIdentical(other: Comparable): boolean;
}
interface Repeatable extends Comparable {
    experimentalExpand(iterDir?: IterationDirection, depth?: number): Generator<AlgLeaf>;
}
declare abstract class AlgCommon<T extends Alg | AlgNode> extends Comparable implements Repeatable {
    constructor();
    get log(): (message?: any) => void;
    abstract toString(): string;
    abstract invert(): T;
    abstract experimentalExpand(iterDir: IterationDirection): Generator<AlgLeaf>;
}

declare const DEFAULT_DIRECTIONAL = "any-direction";
type QuantumDirectionalCancellation = typeof DEFAULT_DIRECTIONAL | "same-direction" | "none";
type ModWrap = "none" | "gravity" | "canonical-centered" | "canonical-positive" | "preserve-sign";
interface AppendCancelOptions {
    directional?: QuantumDirectionalCancellation;
    puzzleSpecificModWrap?: ModWrap;
}
interface AppendOptions {
    cancel?: boolean | AppendCancelOptions;
    puzzleLoader?: {
        puzzleSpecificSimplifyOptions?: PuzzleSpecificSimplifyOptions;
    };
    puzzleSpecificSimplifyOptions?: PuzzleSpecificSimplifyOptions;
}
interface SimplifyOptions extends AppendOptions {
    depth?: number | null;
}
interface PuzzleSpecificAxisSimplifyInfo {
    areQuantumMovesSameAxis: (quantumMove1: QuantumMove, quantumMove2: QuantumMove) => boolean;
    simplifySameAxisMoves: (moves: Move[], quantumMod: boolean) => Move[];
}
interface PuzzleSpecificSimplifyOptions {
    quantumMoveOrder?: (quantumMove: QuantumMove) => number;
    axis?: PuzzleSpecificAxisSimplifyInfo;
}

type FlexibleAlgSource = string | Iterable<AlgNode> | Alg;
/**
 * `Alg` is a class that encapsulates a structured alg. To create an `Alg` from a string, use:
 *
 *     new Alg("R U R'"); // Convenient
 *     Alg.fromString(dynamicString); // Recommended when the string input is user-provided.
 *
 * Once you have an `Alg`, you can call methods to transform it:
 *
 *     new Alg("[[R: U], R U R2']").expand().experimentalSimplify({cancel: true}).invert().log()
 *
 * To convert an `Alg` to a string, use .toString():
 *
 *     new Alg("R U F").invert().toString();
 *
 * If you need to debug, you may also find it convenient to use .log():
 *
 *     if (alg.isIdentical(alg.invert())) {
 *       alg.log("A self-inverse!")
 *     }
 *
 * For more information, see: {@link https://js.cubing.net/cubing/alg/}
 *
 * @category Alg
 */
declare class Alg extends AlgCommon<Alg> {
    #private;
    constructor(alg?: FlexibleAlgSource);
    /**
     * Checks whether this Alg is structurally identical to another Alg. This
     * essentially means that they are written identically apart from whitespace.
     *
     *     const alg1 = new Alg("R U L'");
     *     const alg2 = new Alg("L U' R'").invert();
     *     // true
     *     alg1.isIdentical(alg2);
     *
     *     // false
     *     new Alg("[R, U]").isIdentical(new Alg("R U R' U'"));
     *     // true
     *     new Alg("[R, U]").expand().isIdentical(new Alg("R U R' U'"));
     *
     * Note that .isIdentical() efficiently compares algorithms, but mainly exists
     * to help optimize code when the structure of an algorithm hasn't changed.
     * There are many ways to write the "same" alg on most puzzles, but is
     * *highly* recommended to avoid expanding two Alg instances to compare them,
     * since that can easily slow your program to a crawl if someone inputs an alg
     * containing a large repetition. In general, you should use `cubing/kpuzzle`
     * to compare if two algs have the same effect on a puzzle.
     *
     * Also note that parser annotations are not taken into account while comparing
     * algs:
     *
     *     const alg = new Alg([new Move("R"), new Move("U2")]);
     *     // true, even though one of the algs has parser annotations
     *     alg.isIdentical(new Alg("R U2"))
     *
     */
    isIdentical(other: Comparable): boolean;
    /**
     * Returns the inverse of the given alg.
     *
     * Note that that this does not make any assumptions about what puzzle the alg
     * is for. For example, U2 is its own inverse on a cube, but U2' has the same
     * effect U3 (and not U2) on Megaminx:
     *
     *     // Outputs: R U2' L'
     *     new Alg("L U2 R'").invert().log();
     */
    invert(): Alg;
    /** @deprecated Use {@link Alg.expand} instead. */
    experimentalExpand(iterDir?: IterationDirection, depth?: number): Generator<AlgLeaf>;
    /**
     * Expands all Grouping, Commutator, and Conjugate parts nested inside the
     * alg.
     *
     *     // F R U R' U' F'
     *     new Alg("[F: [R, U]]").expand().log();
     *
     *     // F [R, U] F'
     *     new Alg("[F: [R, U]]").expand(({ depth: 1 }).log();
     *
     * Avoid calling this on a user-provided alg unless the user explicitly asks
     * to see the expanded alg. Otherwise, it's easy to make your program freeze
     * when someone passes in an alg like: (R U)10000000
     *
     * Generally, if you want to perform an operation on an entire alg, you'll
     * want to use something based on the `Traversal` mechanism, like countMoves()
     * from `cubing/notation`.
     */
    expand(options?: {
        depth?: number;
    }): Alg;
    /** @deprecated */
    experimentalLeafMoves(): Generator<Move>;
    concat(input: FlexibleAlgSource): Alg;
    /** @deprecated */
    experimentalIsEmpty(): boolean;
    static fromString(s: string): Alg;
    /** @deprecated */
    units(): Generator<AlgNode>;
    childAlgNodes(): Generator<AlgNode>;
    /** @deprecated */
    experimentalNumUnits(): number;
    experimentalNumChildAlgNodes(): number;
    /** @deprecated */
    get type(): string;
    /**
     * Converts the Alg to a string:
     *
     *     const alg = new Alg([new Move("R"), new Move("U2"), new Move("L")])
     *     // R U2 L
     *     console.log(alg.toString())
     */
    toString(): string;
    /**
     * `experimentalSimplify` can perform several mostly-syntactic simplifications on an alg:
     *
     *     // Logs: R' U3
     *     import { Alg } from "cubing/alg";
     *     new Alg("R R2' U U2").experimentalSimplify({ cancel: true }).log()
     *
     * You can pass in a `PuzzleLoader` (currently only for 3x3x3) for puzzle-specific simplifications:
     *
     *     // Logs: R' U'
     *     import { Alg } from "cubing/alg";
     *     import { cube3x3x3 } from "cubing/puzzles";
     *     new Alg("R R2' U U2").experimentalSimplify({ cancel: true, puzzleLoader: cube3x3x3 }).log()
     *
     * You can also cancel only moves that are in the same direction:
     *
     *     // Logs: R R2' U'
     *     import { Alg } from "cubing/alg";
     *     import { cube3x3x3 } from "cubing/puzzles";
     *     new Alg("R R2' U U2").experimentalSimplify({
     *       cancel: { directional: "same-direction" },
     *       puzzleLoader: cube3x3x3
     *     }).log()
     *
     * Additionally, you can specify how moves are "wrapped":
     *
     *     import { Alg } from "cubing/alg";
     *     import { cube3x3x3 } from "cubing/puzzles";
     *
     *     function example(puzzleSpecificModWrap) {
     *       alg.experimentalSimplify({
     *         cancel: { puzzleSpecificModWrap },
     *         puzzleLoader: cube3x3x3
     *       }).log()
     *     }
     *
     *     const alg = new Alg("R7' . R6' . R5' . R6")
     *     example("none")               // R7' . R6' . R5' . R6
     *     example("gravity")            // R . R2' . R' . R2
     *     example("canonical-centered") // R . R2 . R' . R2
     *     example("canonical-positive") // R . R2 . R3 . R2
     *     example("preserve-sign")      // R3' . R2' . R' . R2
     *
     * Same-axis and simultaneous move canonicalization is not implemented yet:
     *
     *     // Logs: R L R
     *     import { Alg } from "cubing/alg";
     *     import { cube3x3x3 } from "cubing/puzzles";
     *     new Alg("R L R").experimentalSimplify({ cancel: true, puzzleLoader: cube3x3x3 }).log()
     */
    experimentalSimplify(options?: SimplifyOptions): Alg;
    /** @deprecated See {@link experimentalSimplify} */
    simplify(options?: SimplifyOptions): Alg;
}

export { AlgNode as A, Commutator as C, Grouping as G, IterationDirection as I, LineComment as L, Move as M, Newline as N, Pause as P, QuantumMove as Q, SimplifyOptions as S, Alg as a, AppendOptions as b, Conjugate as c, AlgLeaf as d, MoveModifications as e, AlgBranch as f, PuzzleSpecificSimplifyOptions as g, AppendCancelOptions as h };

import { A as AlgNode, a as Alg, M as Move, b as AppendOptions, G as Grouping, C as Commutator, c as Conjugate, P as Pause, N as Newline, L as LineComment, d as AlgLeaf } from '../Alg-c6770822.js';
export { a as Alg, f as AlgBranch, d as AlgLeaf, A as AlgNode, h as AppendCancelOptions, C as Commutator, c as Conjugate, G as Grouping, L as LineComment, M as Move, e as MoveModifications, N as Newline, P as Pause, g as PuzzleSpecificSimplifyOptions, Q as QuantumMove, S as SimplifyOptions } from '../Alg-c6770822.js';
export { P as ExperimentalParsed } from '../parseAlg-d2c83795.js';

/** @deprecated */
type Unit = AlgNode;

declare function experimentalAppendMove(alg: Alg, addedMove: Move, options?: AppendOptions): Alg;

/** @category Alg */
declare class AlgBuilder {
    #private;
    push(u: AlgNode): void;
    /** @deprecated */
    experimentalPushAlg(alg: Alg): void;
    experimentalNumAlgNodes(): number;
    toAlg(): Alg;
    reset(): void;
}

declare abstract class TraversalDownUp<DataDown, DataAlgUp, DataAlgNodeUp = DataAlgUp> {
    traverseAlgNode(algNode: AlgNode, dataDown: DataDown): DataAlgNodeUp;
    traverseIntoAlgNode(algNode: AlgNode, dataDown: DataDown): AlgNode;
    abstract traverseAlg(alg: Alg, dataDown: DataDown): DataAlgUp;
    abstract traverseGrouping(grouping: Grouping, dataDown: DataDown): DataAlgNodeUp;
    abstract traverseMove(move: Move, dataDown: DataDown): DataAlgNodeUp;
    abstract traverseCommutator(commutator: Commutator, dataDown: DataDown): DataAlgNodeUp;
    abstract traverseConjugate(conjugate: Conjugate, dataDown: DataDown): DataAlgNodeUp;
    abstract traversePause(pause: Pause, dataDown: DataDown): DataAlgNodeUp;
    abstract traverseNewline(newline: Newline, dataDown: DataDown): DataAlgNodeUp;
    abstract traverseLineComment(comment: LineComment, dataDown: DataDown): DataAlgNodeUp;
}
declare abstract class TraversalUp<DataAlgUp, DataAlgNodeUp = DataAlgUp> extends TraversalDownUp<undefined, DataAlgUp, DataAlgNodeUp> {
    traverseAlgNode(algNode: AlgNode): DataAlgNodeUp;
    traverseIntoAlgNode(algNode: AlgNode): AlgNode;
    abstract traverseAlg(alg: Alg): DataAlgUp;
    abstract traverseGrouping(grouping: Grouping): DataAlgNodeUp;
    abstract traverseMove(move: Move): DataAlgNodeUp;
    abstract traverseCommutator(commutator: Commutator): DataAlgNodeUp;
    abstract traverseConjugate(conjugate: Conjugate): DataAlgNodeUp;
    abstract traversePause(pause: Pause): DataAlgNodeUp;
    abstract traverseNewline(newline: Newline): DataAlgNodeUp;
    abstract traverseLineComment(comment: LineComment): DataAlgNodeUp;
}
declare function functionFromTraversal<DataDown, DataAlgUp, ConstructorArgs extends unknown[]>(traversalConstructor: {
    new (...args: ConstructorArgs): TraversalDownUp<DataDown, DataAlgUp, any>;
}, constructorArgs?: ConstructorArgs): undefined extends DataDown ? (alg: Alg) => DataAlgUp : (alg: Alg, v: DataDown) => DataAlgUp;

declare const Example: {
    Sune: Alg;
    AntiSune: Alg;
    SuneCommutator: Alg;
    Niklas: Alg;
    EPerm: Alg;
    FURURFCompact: Alg;
    APermCompact: Alg;
    FURURFMoves: Alg;
    TPerm: Alg;
    HeadlightSwaps: Alg;
    TriplePause: Alg;
};

declare function keyToMove(e: KeyboardEvent): AlgLeaf | null;

interface AlgCubingNetOptions {
    alg?: Alg;
    setup?: Alg;
    title?: string;
    puzzle?: "1x1x1" | "2x2x2" | "3x3x3" | "4x4x4" | "5x5x5" | "6x6x6" | "7x7x7" | "8x8x8" | "9x9x9" | "10x10x10" | "11x11x11" | "12x12x12" | "13x13x13" | "14x14x14" | "16x16x16" | "17x17x17";
    stage?: "full" | "cross" | "F2L" | "LL" | "OLL" | "PLL" | "CLS" | "ELS" | "L6E" | "CMLL" | "WV" | "ZBLL" | "void";
    view?: "editor" | "playback" | "fullscreen";
    type?: "moves" | "reconstruction" | "alg" | "reconstruction-end-with-setup";
}
/** @deprecated */
declare function experimentalAlgCubingNetLink(options: AlgCubingNetOptions): string;

declare function experimentalIs(v: any, c: typeof Alg | typeof Grouping | typeof LineComment | typeof Commutator | typeof Conjugate | typeof Move | typeof Newline | typeof Pause): boolean;

declare function setAlgDebug(options: {
    caretNISSNotationEnabled?: boolean;
}): void;

export { AlgBuilder, AlgCubingNetOptions, Example, TraversalDownUp, TraversalUp, Unit, experimentalAlgCubingNetLink, experimentalAppendMove, experimentalIs, functionFromTraversal, keyToMove, setAlgDebug };

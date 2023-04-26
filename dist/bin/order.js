var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/cubing/alg/common.ts
var writeAlgDebugField, Comparable, AlgCommon;
var init_common = __esm({
  "src/cubing/alg/common.ts"() {
    "use strict";
    writeAlgDebugField = false;
    Comparable = class {
      is(c) {
        return this instanceof c;
      }
      as(c) {
        return this instanceof c ? this : null;
      }
    };
    AlgCommon = class extends Comparable {
      constructor() {
        super();
        if (writeAlgDebugField) {
          Object.defineProperty(this, "_debugStr", {
            get: () => {
              return this.toString();
            }
          });
        }
      }
      get log() {
        return console.log.bind(console, this, this.toString());
      }
    };
  }
});

// src/cubing/alg/iteration.ts
function toggleDirection(iterationDirection, flip = true) {
  if (!flip) {
    return iterationDirection;
  }
  switch (iterationDirection) {
    case 1 /* Forwards */:
      return -1 /* Backwards */;
    case -1 /* Backwards */:
      return 1 /* Forwards */;
  }
}
function direct(g, iterDir) {
  return iterDir === -1 /* Backwards */ ? Array.from(g).reverse() : g;
}
function reverse(g) {
  return Array.from(g).reverse();
}
var init_iteration = __esm({
  "src/cubing/alg/iteration.ts"() {
    "use strict";
  }
});

// src/cubing/alg/limits.ts
var MAX_INT, MAX_INT_DESCRIPTION, MIN_INT;
var init_limits = __esm({
  "src/cubing/alg/limits.ts"() {
    "use strict";
    MAX_INT = 2147483647;
    MAX_INT_DESCRIPTION = "2^31 - 1";
    MIN_INT = -2147483648;
  }
});

// src/cubing/alg/AlgBuilder.ts
var AlgBuilder;
var init_AlgBuilder = __esm({
  "src/cubing/alg/AlgBuilder.ts"() {
    "use strict";
    init_Alg();
    AlgBuilder = class {
      #algNodes = [];
      push(u) {
        this.#algNodes.push(u);
      }
      // TODO: Allow FlexibleAlgSource?
      /** @deprecated */
      experimentalPushAlg(alg) {
        for (const u of alg.childAlgNodes()) {
          this.push(u);
        }
      }
      // TODO: can we guarantee this to be fast in the permanent API?
      experimentalNumAlgNodes() {
        return this.#algNodes.length;
      }
      // can be called multiple times, even if you push alg nodes inbetween.
      toAlg() {
        return new Alg(this.#algNodes);
      }
      reset() {
        this.#algNodes = [];
      }
    };
  }
});

// src/cubing/alg/debug.ts
var algDebugGlobals;
var init_debug = __esm({
  "src/cubing/alg/debug.ts"() {
    "use strict";
    algDebugGlobals = {
      caretNISSNotationEnabled: true
    };
  }
});

// src/cubing/alg/alg-nodes/containers/Commutator.ts
var Commutator;
var init_Commutator = __esm({
  "src/cubing/alg/alg-nodes/containers/Commutator.ts"() {
    "use strict";
    init_Alg();
    init_common();
    init_iteration();
    Commutator = class extends AlgCommon {
      #A;
      #B;
      constructor(aSource, bSource) {
        super();
        this.#A = experimentalEnsureAlg(aSource);
        this.#B = experimentalEnsureAlg(bSource);
      }
      get A() {
        return this.#A;
      }
      get B() {
        return this.#B;
      }
      isIdentical(other) {
        const otherAsCommutator = other.as(Commutator);
        return !!(otherAsCommutator?.A.isIdentical(this.A) && otherAsCommutator?.B.isIdentical(this.B));
      }
      invert() {
        return new Commutator(this.#B, this.#A);
      }
      *experimentalExpand(iterDir = 1 /* Forwards */, depth) {
        depth ?? (depth = Infinity);
        if (depth === 0) {
          yield iterDir === 1 /* Forwards */ ? this : this.invert();
        } else {
          if (iterDir === 1 /* Forwards */) {
            yield* this.A.experimentalExpand(
              1 /* Forwards */,
              depth - 1
            );
            yield* this.B.experimentalExpand(
              1 /* Forwards */,
              depth - 1
            );
            yield* this.A.experimentalExpand(
              -1 /* Backwards */,
              depth - 1
            );
            yield* this.B.experimentalExpand(
              -1 /* Backwards */,
              depth - 1
            );
          } else {
            yield* this.B.experimentalExpand(
              1 /* Forwards */,
              depth - 1
            );
            yield* this.A.experimentalExpand(
              1 /* Forwards */,
              depth - 1
            );
            yield* this.B.experimentalExpand(
              -1 /* Backwards */,
              depth - 1
            );
            yield* this.A.experimentalExpand(
              -1 /* Backwards */,
              depth - 1
            );
          }
        }
      }
      toString() {
        return `[${this.#A.toString()}, ${this.#B.toString()}]`;
      }
    };
  }
});

// src/cubing/alg/alg-nodes/containers/Conjugate.ts
var Conjugate;
var init_Conjugate = __esm({
  "src/cubing/alg/alg-nodes/containers/Conjugate.ts"() {
    "use strict";
    init_Alg();
    init_common();
    init_iteration();
    Conjugate = class extends AlgCommon {
      #A;
      #B;
      constructor(aSource, bSource) {
        super();
        this.#A = experimentalEnsureAlg(aSource);
        this.#B = experimentalEnsureAlg(bSource);
      }
      get A() {
        return this.#A;
      }
      get B() {
        return this.#B;
      }
      isIdentical(other) {
        const otherAsConjugate = other.as(Conjugate);
        return !!(otherAsConjugate?.A.isIdentical(this.A) && otherAsConjugate?.B.isIdentical(this.B));
      }
      invert() {
        return new Conjugate(this.#A, this.#B.invert());
      }
      *experimentalExpand(iterDir, depth) {
        depth ?? (depth = Infinity);
        if (depth === 0) {
          yield iterDir === 1 /* Forwards */ ? this : this.invert();
        } else {
          yield* this.A.experimentalExpand(1 /* Forwards */, depth - 1);
          yield* this.B.experimentalExpand(iterDir, depth - 1);
          yield* this.A.experimentalExpand(-1 /* Backwards */, depth - 1);
        }
      }
      toString() {
        return `[${this.A}: ${this.B}]`;
      }
    };
  }
});

// src/cubing/alg/alg-nodes/leaves/LineComment.ts
var LineComment;
var init_LineComment = __esm({
  "src/cubing/alg/alg-nodes/leaves/LineComment.ts"() {
    "use strict";
    init_common();
    init_iteration();
    LineComment = class extends AlgCommon {
      #text;
      constructor(commentText) {
        super();
        if (commentText.includes("\n") || commentText.includes("\r")) {
          throw new Error("LineComment cannot contain newline");
        }
        this.#text = commentText;
      }
      get text() {
        return this.#text;
      }
      isIdentical(other) {
        const otherAsLineComment = other;
        return other.is(LineComment) && this.#text === otherAsLineComment.#text;
      }
      invert() {
        return this;
      }
      *experimentalExpand(_iterDir = 1 /* Forwards */, _depth = Infinity) {
        yield this;
      }
      toString() {
        return `//${this.#text}`;
      }
      // toJSON(): LineCommentJSON {
      //   return {
      //     type: "comment",
      //     text: this.#text,
      //   };
      // }
    };
  }
});

// src/cubing/alg/alg-nodes/leaves/Newline.ts
var Newline;
var init_Newline = __esm({
  "src/cubing/alg/alg-nodes/leaves/Newline.ts"() {
    "use strict";
    init_common();
    init_iteration();
    Newline = class extends AlgCommon {
      toString() {
        return "\n";
      }
      isIdentical(other) {
        return other.is(Newline);
      }
      invert() {
        return this;
      }
      *experimentalExpand(_iterDir = 1 /* Forwards */, _depth = Infinity) {
        yield this;
      }
    };
  }
});

// src/cubing/alg/alg-nodes/leaves/Pause.ts
var Pause;
var init_Pause = __esm({
  "src/cubing/alg/alg-nodes/leaves/Pause.ts"() {
    "use strict";
    init_common();
    init_iteration();
    Pause = class extends AlgCommon {
      // TODO: tie this to the alg
      toString() {
        return ".";
      }
      isIdentical(other) {
        return other.is(Pause);
      }
      invert() {
        return this;
      }
      *experimentalExpand(_iterDir = 1 /* Forwards */, _depth = Infinity) {
        yield this;
      }
    };
  }
});

// src/cubing/alg/parseAlg.ts
function parseIntWithEmptyFallback(n, emptyFallback) {
  return n ? parseInt(n) : emptyFallback;
}
function parseAlg(s) {
  return new AlgParser().parseAlg(s);
}
function parseMove(s) {
  return new AlgParser().parseMove(s);
}
function parseQuantumMove(s) {
  return new AlgParser().parseQuantumMove(s);
}
function addCharIndices(t, startCharIndex, endCharIndex) {
  const parsedT = t;
  parsedT.startCharIndex = startCharIndex;
  parsedT.endCharIndex = endCharIndex;
  return parsedT;
}
function transferCharIndex(from2, to) {
  if ("startCharIndex" in from2) {
    to.startCharIndex = from2.startCharIndex;
  }
  if ("endCharIndex" in from2) {
    to.endCharIndex = from2.endCharIndex;
  }
  return to;
}
var AMOUNT_REGEX, MOVE_START_REGEX, QUANTUM_MOVE_REGEX, COMMENT_TEXT_REGEX, SQUARE1_PAIR_START_REGEX, SQUARE1_PAIR_END_REGEX, AlgParser;
var init_parseAlg = __esm({
  "src/cubing/alg/parseAlg.ts"() {
    "use strict";
    init_Alg();
    init_AlgBuilder();
    init_debug();
    init_Commutator();
    init_Conjugate();
    init_Grouping();
    init_LineComment();
    init_Move();
    init_Newline();
    init_Pause();
    AMOUNT_REGEX = /^(\d+)?('?)/;
    MOVE_START_REGEX = /^[_\dA-Za-z]/;
    QUANTUM_MOVE_REGEX = /^((([1-9]\d*)-)?([1-9]\d*))?([_A-Za-z]+)?/;
    COMMENT_TEXT_REGEX = /^[^\n]*/;
    SQUARE1_PAIR_START_REGEX = /^(-?\d+), ?/;
    SQUARE1_PAIR_END_REGEX = /^(-?\d+)\)/;
    AlgParser = class {
      #input = "";
      #idx = 0;
      #nissQueue = [];
      parseAlg(input) {
        this.#input = input;
        this.#idx = 0;
        const alg = this.parseAlgWithStopping([]);
        this.mustBeAtEndOfInput();
        const algNodes = Array.from(alg.childAlgNodes());
        if (this.#nissQueue.length > 0) {
          for (const nissGrouping of this.#nissQueue.reverse()) {
            algNodes.push(nissGrouping);
          }
        }
        const newAlg = new Alg(algNodes);
        const { startCharIndex, endCharIndex } = alg;
        addCharIndices(newAlg, startCharIndex, endCharIndex);
        return newAlg;
      }
      parseMove(input) {
        this.#input = input;
        this.#idx = 0;
        const move = this.parseMoveImpl();
        this.mustBeAtEndOfInput();
        return move;
      }
      parseQuantumMove(input) {
        this.#input = input;
        this.#idx = 0;
        const quantumMove = this.parseQuantumMoveImpl();
        this.mustBeAtEndOfInput();
        return quantumMove;
      }
      mustBeAtEndOfInput() {
        if (this.#idx !== this.#input.length) {
          throw new Error("parsing unexpectedly ended early");
        }
      }
      parseAlgWithStopping(stopBefore) {
        let algStartIdx = this.#idx;
        let algEndIdx = this.#idx;
        const algBuilder = new AlgBuilder();
        let crowded = false;
        const mustNotBeCrowded = (idx) => {
          if (crowded) {
            throw new Error(
              `Unexpected character at index ${idx}. Are you missing a space?`
            );
          }
        };
        mainLoop:
          while (this.#idx < this.#input.length) {
            const savedCharIndex = this.#idx;
            if (stopBefore.includes(this.#input[this.#idx])) {
              return addCharIndices(algBuilder.toAlg(), algStartIdx, algEndIdx);
            }
            if (this.tryConsumeNext(" ")) {
              crowded = false;
              if (algBuilder.experimentalNumAlgNodes() === 0) {
                algStartIdx = this.#idx;
              }
              continue mainLoop;
            } else if (MOVE_START_REGEX.test(this.#input[this.#idx])) {
              mustNotBeCrowded(savedCharIndex);
              const move = this.parseMoveImpl();
              algBuilder.push(move);
              crowded = true;
              algEndIdx = this.#idx;
              continue mainLoop;
            } else if (this.tryConsumeNext("(")) {
              mustNotBeCrowded(savedCharIndex);
              const sq1PairStartMatch = this.tryRegex(SQUARE1_PAIR_START_REGEX);
              if (sq1PairStartMatch) {
                const topAmountString = sq1PairStartMatch[1];
                const savedCharIndexD = this.#idx;
                const sq1PairEndMatch = this.parseRegex(SQUARE1_PAIR_END_REGEX);
                const uMove = addCharIndices(
                  new Move(new QuantumMove("U_SQ_"), parseInt(topAmountString)),
                  savedCharIndex + 1,
                  savedCharIndex + 1 + topAmountString.length
                );
                const dMove = addCharIndices(
                  new Move(new QuantumMove("D_SQ_"), parseInt(sq1PairEndMatch[1])),
                  savedCharIndexD,
                  this.#idx - 1
                );
                const alg = addCharIndices(
                  new Alg([uMove, dMove]),
                  savedCharIndex + 1,
                  this.#idx - 1
                );
                algBuilder.push(
                  addCharIndices(new Grouping(alg), savedCharIndex, this.#idx)
                );
                crowded = true;
                algEndIdx = this.#idx;
                continue mainLoop;
              } else {
                const alg = this.parseAlgWithStopping([")"]);
                this.mustConsumeNext(")");
                const amount = this.parseAmount();
                algBuilder.push(
                  addCharIndices(
                    new Grouping(alg, amount),
                    savedCharIndex,
                    this.#idx
                  )
                );
                crowded = true;
                algEndIdx = this.#idx;
                continue mainLoop;
              }
            } else if (this.tryConsumeNext("^")) {
              if (!algDebugGlobals.caretNISSNotationEnabled) {
                throw new Error(
                  "Alg contained a caret but caret NISS notation is not enabled."
                );
              }
              this.mustConsumeNext("(");
              const alg = this.parseAlgWithStopping([")"]);
              this.popNext();
              const grouping = new Grouping(alg, -1);
              const placeholder = new Pause();
              grouping.experimentalNISSPlaceholder = placeholder;
              placeholder.experimentalNISSGrouping = grouping;
              this.#nissQueue.push(grouping);
              algBuilder.push(placeholder);
            } else if (this.tryConsumeNext("[")) {
              mustNotBeCrowded(savedCharIndex);
              const A = this.parseAlgWithStopping([",", ":"]);
              const separator = this.popNext();
              const B = this.parseAlgWithStopping(["]"]);
              this.mustConsumeNext("]");
              switch (separator) {
                case ":": {
                  algBuilder.push(
                    addCharIndices(new Conjugate(A, B), savedCharIndex, this.#idx)
                  );
                  crowded = true;
                  algEndIdx = this.#idx;
                  continue mainLoop;
                }
                case ",": {
                  algBuilder.push(
                    addCharIndices(new Commutator(A, B), savedCharIndex, this.#idx)
                  );
                  crowded = true;
                  algEndIdx = this.#idx;
                  continue mainLoop;
                }
                default:
                  throw new Error("unexpected parsing error");
              }
            } else if (this.tryConsumeNext("\n")) {
              algBuilder.push(
                addCharIndices(new Newline(), savedCharIndex, this.#idx)
              );
              crowded = false;
              algEndIdx = this.#idx;
              continue mainLoop;
            } else if (this.tryConsumeNext("/")) {
              if (this.tryConsumeNext("/")) {
                mustNotBeCrowded(savedCharIndex);
                const [text] = this.parseRegex(COMMENT_TEXT_REGEX);
                algBuilder.push(
                  addCharIndices(new LineComment(text), savedCharIndex, this.#idx)
                );
                crowded = false;
                algEndIdx = this.#idx;
                continue mainLoop;
              } else {
                algBuilder.push(
                  addCharIndices(new Move("_SLASH_"), savedCharIndex, this.#idx)
                );
                crowded = true;
                algEndIdx = this.#idx;
                continue mainLoop;
              }
            } else if (this.tryConsumeNext(".")) {
              mustNotBeCrowded(savedCharIndex);
              algBuilder.push(addCharIndices(new Pause(), savedCharIndex, this.#idx));
              crowded = true;
              algEndIdx = this.#idx;
              continue mainLoop;
            } else {
              throw new Error(`Unexpected character: ${this.popNext()}`);
            }
          }
        if (this.#idx !== this.#input.length) {
          throw new Error("did not finish parsing?");
        }
        if (stopBefore.length > 0) {
          throw new Error("expected stopping");
        }
        return addCharIndices(algBuilder.toAlg(), algStartIdx, algEndIdx);
      }
      parseQuantumMoveImpl() {
        const [, , , outerLayerStr, innerLayerStr, family] = this.parseRegex(QUANTUM_MOVE_REGEX);
        return new QuantumMove(
          family,
          parseIntWithEmptyFallback(innerLayerStr, void 0),
          parseIntWithEmptyFallback(outerLayerStr, void 0)
        );
      }
      parseMoveImpl() {
        const savedCharIndex = this.#idx;
        if (this.tryConsumeNext("/")) {
          return addCharIndices(new Move("_SLASH_"), savedCharIndex, this.#idx);
        }
        let quantumMove = this.parseQuantumMoveImpl();
        let [amount, hadEmptyAbsAmount] = this.parseAmountAndTrackEmptyAbsAmount();
        const suffix = this.parseMoveSuffix();
        if (suffix) {
          if (amount < 0) {
            throw new Error("uh-oh");
          }
          if ((suffix === "++" || suffix === "--") && amount !== 1) {
            throw new Error(
              "Pochmann ++ or -- moves cannot have an amount other than 1."
            );
          }
          if ((suffix === "++" || suffix === "--") && !hadEmptyAbsAmount) {
            throw new Error(
              "Pochmann ++ or -- moves cannot have an amount written as a number."
            );
          }
          if ((suffix === "+" || suffix === "-") && hadEmptyAbsAmount) {
            throw new Error(
              "Clock dial moves must have an amount written as a natural number followed by + or -."
            );
          }
          if (suffix.startsWith("+")) {
            quantumMove = quantumMove.modified({
              family: `${quantumMove.family}_${suffix === "+" ? "PLUS" : "PLUSPLUS"}_`
              // TODO
            });
          }
          if (suffix.startsWith("-")) {
            quantumMove = quantumMove.modified({
              family: `${quantumMove.family}_${suffix === "-" ? "PLUS" : "PLUSPLUS"}_`
              // TODO
            });
            amount *= -1;
          }
        }
        const move = addCharIndices(
          new Move(quantumMove, amount),
          savedCharIndex,
          this.#idx
        );
        return move;
      }
      parseMoveSuffix() {
        if (this.tryConsumeNext("+")) {
          if (this.tryConsumeNext("+")) {
            return "++";
          }
          return "+";
        }
        if (this.tryConsumeNext("-")) {
          if (this.tryConsumeNext("-")) {
            return "--";
          }
          return "-";
        }
        return null;
      }
      parseAmountAndTrackEmptyAbsAmount() {
        const savedIdx = this.#idx;
        const [, absAmountStr, primeStr] = this.parseRegex(AMOUNT_REGEX);
        if (absAmountStr?.startsWith("0") && absAmountStr !== "0") {
          throw new Error(
            `Error at char index ${savedIdx}: An amount can only start with 0 if it's exactly the digit 0.`
          );
        }
        return [
          parseIntWithEmptyFallback(absAmountStr, 1) * (primeStr === "'" ? -1 : 1),
          !absAmountStr
        ];
      }
      parseAmount() {
        const savedIdx = this.#idx;
        const [, absAmountStr, primeStr] = this.parseRegex(AMOUNT_REGEX);
        if (absAmountStr?.startsWith("0") && absAmountStr !== "0") {
          throw new Error(
            `Error at char index ${savedIdx}: An amount number can only start with 0 if it's exactly the digit 0.`
          );
        }
        return parseIntWithEmptyFallback(absAmountStr, 1) * (primeStr === "'" ? -1 : 1);
      }
      parseRegex(regex) {
        const arr = regex.exec(this.remaining());
        if (arr === null) {
          throw new Error("internal parsing error");
        }
        this.#idx += arr[0].length;
        return arr;
      }
      // TOD: can we avoid this?
      tryRegex(regex) {
        const arr = regex.exec(this.remaining());
        if (arr === null) {
          return null;
        }
        this.#idx += arr[0].length;
        return arr;
      }
      remaining() {
        return this.#input.slice(this.#idx);
      }
      popNext() {
        const next = this.#input[this.#idx];
        this.#idx++;
        return next;
      }
      tryConsumeNext(expected) {
        if (this.#input[this.#idx] === expected) {
          this.#idx++;
          return true;
        }
        return false;
      }
      mustConsumeNext(expected) {
        const next = this.popNext();
        if (next !== expected) {
          throw new Error(
            `expected \`${expected}\` while parsing, encountered ${next}`
          );
        }
        return next;
      }
    };
  }
});

// src/cubing/alg/warnOnce.ts
function warnOnce(s) {
  if (!warned.has(s)) {
    console.warn(s);
    warned.add(s);
  }
}
var warned;
var init_warnOnce = __esm({
  "src/cubing/alg/warnOnce.ts"() {
    "use strict";
    warned = /* @__PURE__ */ new Set();
  }
});

// src/cubing/alg/alg-nodes/QuantumWithAmount.ts
var QuantumWithAmount;
var init_QuantumWithAmount = __esm({
  "src/cubing/alg/alg-nodes/QuantumWithAmount.ts"() {
    "use strict";
    init_iteration();
    init_limits();
    QuantumWithAmount = class {
      constructor(quantum, amount = 1) {
        this.quantum = quantum;
        this.amount = amount;
        if (!Number.isInteger(this.amount) || this.amount < MIN_INT || this.amount > MAX_INT) {
          throw new Error(
            `AlgNode amount absolute value must be a non-negative integer below ${MAX_INT_DESCRIPTION}.`
          );
        }
      }
      suffix() {
        let s = "";
        const absAmount = Math.abs(this.amount);
        if (absAmount !== 1) {
          s += absAmount;
        }
        if (this.amount < 0) {
          s += "'";
        }
        return s;
      }
      isIdentical(other) {
        return this.quantum.isIdentical(other.quantum) && this.amount === other.amount;
      }
      // TODO: `Conjugate` and `Commutator` decrement `depth` inside the quantum, `Grouping` has to do it outside the quantum.
      *experimentalExpand(iterDir, depth) {
        const absAmount = Math.abs(this.amount);
        const newIterDir = toggleDirection(iterDir, this.amount < 0);
        for (let i = 0; i < absAmount; i++) {
          yield* this.quantum.experimentalExpand(newIterDir, depth);
        }
      }
    };
  }
});

// src/cubing/alg/alg-nodes/leaves/Move.ts
var QuantumMove, Move;
var init_Move = __esm({
  "src/cubing/alg/alg-nodes/leaves/Move.ts"() {
    "use strict";
    init_common();
    init_iteration();
    init_limits();
    init_parseAlg();
    init_warnOnce();
    init_QuantumWithAmount();
    QuantumMove = class extends Comparable {
      #family;
      #innerLayer;
      #outerLayer;
      constructor(family, innerLayer, outerLayer) {
        super();
        this.#family = family;
        this.#innerLayer = innerLayer ?? null;
        this.#outerLayer = outerLayer ?? null;
        Object.freeze(this);
        if (this.#innerLayer !== null && (!Number.isInteger(this.#innerLayer) || this.#innerLayer < 1 || this.#innerLayer > MAX_INT)) {
          throw new Error(
            `QuantumMove inner layer must be a positive integer below ${MAX_INT_DESCRIPTION}.`
          );
        }
        if (this.#outerLayer !== null && (!Number.isInteger(this.#outerLayer) || this.#outerLayer < 1 || this.#outerLayer > MAX_INT)) {
          throw new Error(
            `QuantumMove outer layer must be a positive integer below ${MAX_INT_DESCRIPTION}.`
          );
        }
        if (this.#outerLayer !== null && this.#innerLayer !== null && this.#innerLayer <= this.#outerLayer) {
          throw new Error(
            "QuantumMove outer layer must be smaller than inner layer."
          );
        }
        if (this.#outerLayer !== null && this.#innerLayer === null) {
          throw new Error(
            "QuantumMove with an outer layer must have an inner layer"
          );
        }
      }
      static fromString(s) {
        return parseQuantumMove(s);
      }
      // TODO: `modify`?
      modified(modifications) {
        return new QuantumMove(
          modifications.family ?? this.#family,
          modifications.innerLayer ?? this.#innerLayer,
          modifications.outerLayer ?? this.#outerLayer
        );
      }
      isIdentical(other) {
        const otherAsQuantumMove = other;
        return other.is(QuantumMove) && this.#family === otherAsQuantumMove.#family && this.#innerLayer === otherAsQuantumMove.#innerLayer && this.#outerLayer === otherAsQuantumMove.#outerLayer;
      }
      // TODO: provide something more useful on average.
      /** @deprecated */
      get family() {
        return this.#family;
      }
      // TODO: provide something more useful on average.
      /** @deprecated */
      get outerLayer() {
        return this.#outerLayer;
      }
      // TODO: provide something more useful on average.
      /** @deprecated */
      get innerLayer() {
        return this.#innerLayer;
      }
      experimentalExpand() {
        throw new Error(
          "experimentalExpand() cannot be called on a `QuantumMove` directly."
        );
      }
      toString() {
        let s = this.#family;
        if (this.#innerLayer !== null) {
          s = String(this.#innerLayer) + s;
          if (this.#outerLayer !== null) {
            s = `${String(this.#outerLayer)}-${s}`;
          }
        }
        return s;
      }
    };
    Move = class extends AlgCommon {
      #quantumWithAmount;
      constructor(...args) {
        super();
        if (typeof args[0] === "string") {
          if (args[1] ?? null) {
            this.#quantumWithAmount = new QuantumWithAmount(
              QuantumMove.fromString(args[0]),
              args[1]
            );
            return;
          } else {
            return Move.fromString(args[0]);
          }
        }
        this.#quantumWithAmount = new QuantumWithAmount(
          args[0],
          args[1]
        );
      }
      isIdentical(other) {
        const otherAsMove = other.as(Move);
        return !!otherAsMove && this.#quantumWithAmount.isIdentical(otherAsMove.#quantumWithAmount);
      }
      invert() {
        return transferCharIndex(
          this,
          new Move(this.#quantumWithAmount.quantum, -this.amount)
        );
      }
      *experimentalExpand(iterDir = 1 /* Forwards */) {
        if (iterDir === 1 /* Forwards */) {
          yield this;
        } else {
          yield this.modified({
            amount: -this.amount
          });
        }
      }
      get quantum() {
        return this.#quantumWithAmount.quantum;
      }
      // TODO: `modify`?
      modified(modifications) {
        return new Move(
          this.#quantumWithAmount.quantum.modified(modifications),
          modifications.amount ?? this.amount
        );
      }
      static fromString(s) {
        return parseMove(s);
      }
      get amount() {
        return this.#quantumWithAmount.amount;
      }
      /** @deprecated */
      get type() {
        warnOnce("deprecated: type");
        return "blockMove";
      }
      /** @deprecated */
      get family() {
        return this.#quantumWithAmount.quantum.family ?? void 0;
      }
      /** @deprecated */
      get outerLayer() {
        return this.#quantumWithAmount.quantum.outerLayer ?? void 0;
      }
      /** @deprecated */
      get innerLayer() {
        return this.#quantumWithAmount.quantum.innerLayer ?? void 0;
      }
      toString() {
        if (this.family === "_SLASH_") {
          return "/";
        }
        if (this.family.endsWith("_PLUS_")) {
          return this.#quantumWithAmount.quantum.toString().slice(0, -6) + Math.abs(this.amount) + (this.amount < 0 ? "-" : "+");
        }
        if (this.family.endsWith("_PLUSPLUS_")) {
          const absAmount = Math.abs(this.amount);
          return this.#quantumWithAmount.quantum.toString().slice(0, -10) + (absAmount === 1 ? "" : absAmount) + (this.amount < 0 ? "--" : "++");
        }
        return this.#quantumWithAmount.quantum.toString() + this.#quantumWithAmount.suffix();
      }
      // // TODO: Serialize as a string?
      // toJSON(): MoveJSON {
      //   return {
      //     type: "move",
      //     family: this.family,
      //     innerLayer: this.innerLayer,
      //     outerLayer: this.outerLayer,
      //   };
      // }
    };
  }
});

// src/cubing/alg/alg-nodes/containers/Grouping.ts
var Square1TupleFormatter, square1TupleFormatterInstance, Grouping;
var init_Grouping = __esm({
  "src/cubing/alg/alg-nodes/containers/Grouping.ts"() {
    "use strict";
    init_Alg();
    init_common();
    init_iteration();
    init_Move();
    init_QuantumWithAmount();
    Square1TupleFormatter = class {
      constructor() {
        this.quantumU_SQ_ = null;
        this.quantumD_SQ_ = null;
      }
      format(grouping) {
        if (grouping.amount !== 1) {
          return null;
        }
        const amounts = this.tuple(grouping);
        if (!amounts) {
          return null;
        }
        return `(${amounts.map((move) => move.amount).join(", ")})`;
      }
      tuple(grouping) {
        if (grouping.amount !== 1) {
          return null;
        }
        this.quantumU_SQ_ || (this.quantumU_SQ_ = new QuantumMove("U_SQ_"));
        this.quantumD_SQ_ || (this.quantumD_SQ_ = new QuantumMove("D_SQ_"));
        const quantumAlg = grouping.alg;
        if (quantumAlg.experimentalNumChildAlgNodes() === 2) {
          const [U, D] = quantumAlg.childAlgNodes();
          if (U.as(Move)?.quantum.isIdentical(this.quantumU_SQ_) && D.as(Move)?.quantum.isIdentical(this.quantumD_SQ_)) {
            return [U, D];
          }
        }
        return null;
      }
    };
    square1TupleFormatterInstance = new Square1TupleFormatter();
    Grouping = class extends AlgCommon {
      // TODO: tie this to the alg
      constructor(algSource, amount) {
        super();
        const alg = experimentalEnsureAlg(algSource);
        this.#quantumWithAmount = new QuantumWithAmount(alg, amount);
      }
      #quantumWithAmount;
      isIdentical(other) {
        const otherAsGrouping = other;
        return other.is(Grouping) && this.#quantumWithAmount.isIdentical(otherAsGrouping.#quantumWithAmount);
      }
      get alg() {
        return this.#quantumWithAmount.quantum;
      }
      get amount() {
        return this.#quantumWithAmount.amount;
      }
      /** @deprecated */
      get experimentalRepetitionSuffix() {
        return this.#quantumWithAmount.suffix();
      }
      invert() {
        const amounts = square1TupleFormatterInstance.tuple(this);
        if (amounts) {
          const [moveU, moveD] = amounts;
          return new Grouping(new Alg([moveU.invert(), moveD.invert()]));
        }
        return new Grouping(
          this.#quantumWithAmount.quantum,
          -this.#quantumWithAmount.amount
        );
      }
      *experimentalExpand(iterDir = 1 /* Forwards */, depth) {
        depth ?? (depth = Infinity);
        if (depth === 0) {
          yield iterDir === 1 /* Forwards */ ? this : this.invert();
        } else {
          yield* this.#quantumWithAmount.experimentalExpand(iterDir, depth - 1);
        }
      }
      static fromString() {
        throw new Error("unimplemented");
      }
      toString() {
        return square1TupleFormatterInstance.format(this) ?? `(${this.#quantumWithAmount.quantum.toString()})${this.#quantumWithAmount.suffix()}`;
      }
      experimentalAsSquare1Tuple() {
        return square1TupleFormatterInstance.tuple(this);
      }
      // toJSON(): GroupingJSON {
      //   return {
      //     type: "grouping",
      //     alg: this.#quanta.quantum.toJSON(),
      //   };
      // }
    };
  }
});

// src/cubing/alg/alg-nodes/index.ts
var init_alg_nodes = __esm({
  "src/cubing/alg/alg-nodes/index.ts"() {
    "use strict";
    init_Grouping();
    init_LineComment();
    init_Commutator();
    init_Conjugate();
    init_Move();
    init_Newline();
    init_Pause();
  }
});

// src/cubing/alg/is.ts
function experimentalIs(v, c) {
  return v instanceof c;
}
function experimentalIsAlgNode(v) {
  return experimentalIs(v, Grouping) || experimentalIs(v, LineComment) || experimentalIs(v, Commutator) || experimentalIs(v, Conjugate) || experimentalIs(v, Move) || experimentalIs(v, Newline) || experimentalIs(v, Pause);
}
var init_is = __esm({
  "src/cubing/alg/is.ts"() {
    "use strict";
    init_alg_nodes();
  }
});

// src/cubing/alg/traversal.ts
function dispatch(t, algNode, dataDown) {
  if (algNode.is(Grouping)) {
    return t.traverseGrouping(algNode, dataDown);
  }
  if (algNode.is(Move)) {
    return t.traverseMove(algNode, dataDown);
  }
  if (algNode.is(Commutator)) {
    return t.traverseCommutator(algNode, dataDown);
  }
  if (algNode.is(Conjugate)) {
    return t.traverseConjugate(algNode, dataDown);
  }
  if (algNode.is(Pause)) {
    return t.traversePause(algNode, dataDown);
  }
  if (algNode.is(Newline)) {
    return t.traverseNewline(algNode, dataDown);
  }
  if (algNode.is(LineComment)) {
    return t.traverseLineComment(algNode, dataDown);
  }
  throw new Error("unknown AlgNode");
}
function mustBeAlgNode(t) {
  if (t.is(Grouping) || t.is(Move) || t.is(Commutator) || t.is(Conjugate) || t.is(Pause) || t.is(Newline) || t.is(LineComment)) {
    return t;
  }
  throw new Error("internal error: expected AlgNode");
}
function functionFromTraversal(traversalConstructor, constructorArgs) {
  const instance = new traversalConstructor(
    ...constructorArgs ?? []
  );
  return instance.traverseAlg.bind(instance);
}
var TraversalDownUp;
var init_traversal = __esm({
  "src/cubing/alg/traversal.ts"() {
    "use strict";
    init_Commutator();
    init_Conjugate();
    init_Grouping();
    init_LineComment();
    init_Move();
    init_Newline();
    init_Pause();
    TraversalDownUp = class {
      // Immediate subclasses should overwrite this.
      traverseAlgNode(algNode, dataDown) {
        return dispatch(this, algNode, dataDown);
      }
      traverseIntoAlgNode(algNode, dataDown) {
        return mustBeAlgNode(this.traverseAlgNode(algNode, dataDown));
      }
    };
  }
});

// src/cubing/alg/simplify/options.ts
var DEFAULT_DIRECTIONAL, AppendOptionsHelper;
var init_options = __esm({
  "src/cubing/alg/simplify/options.ts"() {
    "use strict";
    DEFAULT_DIRECTIONAL = "any-direction";
    AppendOptionsHelper = class {
      constructor(config = {}) {
        this.config = config;
      }
      cancelQuantum() {
        const { cancel } = this.config;
        if (cancel === true) {
          return DEFAULT_DIRECTIONAL;
        }
        if (cancel === false) {
          return "none";
        }
        return cancel?.directional ?? "none";
      }
      cancelAny() {
        return this.config.cancel && this.cancelQuantum() !== "none";
      }
      cancelPuzzleSpecificModWrap() {
        const { cancel } = this.config;
        if (cancel === true || cancel === false) {
          return "canonical-centered";
        }
        if (cancel?.puzzleSpecificModWrap) {
          return cancel?.puzzleSpecificModWrap;
        }
        return cancel?.directional === "same-direction" ? "preserve-sign" : "canonical-centered";
      }
      puzzleSpecificSimplifyOptions() {
        return this.config.puzzleLoader?.puzzleSpecificSimplifyOptions ?? this.config.puzzleSpecificSimplifyOptions;
      }
    };
  }
});

// src/cubing/alg/simplify/append.ts
function areSameDirection(direction, move2) {
  return direction * Math.sign(move2.amount) >= 0;
}
function offsetMod(x, positiveMod, offset) {
  return ((x - offset) % positiveMod + positiveMod) % positiveMod + offset;
}
function experimentalAppendMove(alg, addedMove, options) {
  const optionsHelper = new AppendOptionsHelper(options);
  const outputPrefix = Array.from(alg.childAlgNodes());
  let outputSuffix = [addedMove];
  function output() {
    return new Alg([...outputPrefix, ...outputSuffix]);
  }
  function modMove(move) {
    if (optionsHelper.cancelPuzzleSpecificModWrap() === "none") {
      return move;
    }
    const quantumMoveOrder = optionsHelper.puzzleSpecificSimplifyOptions()?.quantumMoveOrder;
    if (!quantumMoveOrder) {
      return move;
    }
    const mod = quantumMoveOrder(addedMove.quantum);
    let offset;
    switch (optionsHelper.cancelPuzzleSpecificModWrap()) {
      case "gravity": {
        offset = -Math.floor((mod - (move.amount < 0 ? 0 : 1)) / 2);
        break;
      }
      case "canonical-centered": {
        offset = -Math.floor((mod - 1) / 2);
        break;
      }
      case "canonical-positive": {
        offset = 0;
        break;
      }
      case "preserve-sign": {
        offset = move.amount < 0 ? 1 - mod : 0;
        break;
      }
      default: {
        throw new Error("Unknown mod wrap");
      }
    }
    const offsetAmount = offsetMod(move.amount, mod, offset);
    return move.modified({ amount: offsetAmount });
  }
  if (optionsHelper.cancelAny()) {
    let canCancelMoveBasedOnQuantum;
    const axis = optionsHelper.puzzleSpecificSimplifyOptions()?.axis;
    if (axis) {
      canCancelMoveBasedOnQuantum = (move) => axis.areQuantumMovesSameAxis(addedMove.quantum, move.quantum);
    } else {
      const newMoveQuantumString = addedMove.quantum.toString();
      canCancelMoveBasedOnQuantum = (move) => move.quantum.toString() === newMoveQuantumString;
    }
    const sameDirectionOnly = optionsHelper.cancelQuantum() === "same-direction";
    const quantumDirections = /* @__PURE__ */ new Map();
    quantumDirections.set(
      addedMove.quantum.toString(),
      Math.sign(addedMove.amount)
    );
    let i;
    for (i = outputPrefix.length - 1; i >= 0; i--) {
      const move = outputPrefix[i].as(Move);
      if (!move) {
        break;
      }
      if (!canCancelMoveBasedOnQuantum(move)) {
        break;
      }
      const quantumKey = move.quantum.toString();
      if (sameDirectionOnly) {
        const existingQuantumDirectionOnAxis = quantumDirections.get(quantumKey);
        if (existingQuantumDirectionOnAxis && // Short-circuits, but that's actually okay here.
        !areSameDirection(existingQuantumDirectionOnAxis, move)) {
          break;
        }
        quantumDirections.set(quantumKey, Math.sign(move.amount));
      }
    }
    const suffix = [...outputPrefix.splice(i + 1), addedMove];
    if (axis) {
      outputSuffix = axis.simplifySameAxisMoves(
        suffix,
        optionsHelper.cancelPuzzleSpecificModWrap() !== "none"
      );
    } else {
      const amount = suffix.reduce(
        (sum, move) => sum + move.amount,
        0
      );
      if (quantumDirections.size !== 1) {
        throw new Error(
          "Internal error: multiple quantums when one was expected"
        );
      }
      outputSuffix = [new Move(addedMove.quantum, amount)];
    }
  }
  outputSuffix = outputSuffix.map((m) => modMove(m)).filter((move) => move.amount !== 0);
  return output();
}
function experimentalAppendNode(alg, leaf, options) {
  const maybeMove = leaf.as(Move);
  if (maybeMove) {
    return experimentalAppendMove(alg, maybeMove, options);
  } else {
    return new Alg([...alg.childAlgNodes(), leaf]);
  }
}
var init_append = __esm({
  "src/cubing/alg/simplify/append.ts"() {
    "use strict";
    init_Alg();
    init_Move();
    init_options();
  }
});

// src/cubing/alg/simplify/simplify.ts
var Simplify, simplify;
var init_simplify = __esm({
  "src/cubing/alg/simplify/simplify.ts"() {
    "use strict";
    init_Alg();
    init_Commutator();
    init_Conjugate();
    init_Grouping();
    init_Move();
    init_Pause();
    init_traversal();
    init_append();
    init_options();
    Simplify = class extends TraversalDownUp {
      #newPlaceholderAssociationsMap;
      #newPlaceholderAssociations() {
        return this.#newPlaceholderAssociationsMap ?? (this.#newPlaceholderAssociationsMap = /* @__PURE__ */ new Map());
      }
      // TODO: avoid allocations?
      #descendOptions(options) {
        return {
          ...options,
          depth: options.depth ? options.depth - 1 : null
        };
      }
      // TODO: Handle
      *traverseAlg(alg, options) {
        if (options.depth === 0) {
          yield* alg.childAlgNodes();
          return;
        }
        let output = [];
        const newOptions = this.#descendOptions(options);
        for (const algNode of alg.childAlgNodes()) {
          for (const traversedNode of this.traverseAlgNode(algNode, newOptions)) {
            output = Array.from(
              experimentalAppendNode(
                new Alg(output),
                traversedNode,
                newOptions
              ).childAlgNodes()
            );
          }
        }
        for (const newAlgNode of output) {
          yield newAlgNode;
        }
      }
      *traverseGrouping(grouping, options) {
        if (options.depth === 0) {
          yield grouping;
          return;
        }
        if (grouping.amount === 0) {
          return;
        }
        const newGrouping = new Grouping(
          this.traverseAlg(grouping.alg, this.#descendOptions(options)),
          grouping.amount
        );
        if (newGrouping.alg.experimentalIsEmpty()) {
          return;
        }
        const newPlaceholder = this.#newPlaceholderAssociations().get(grouping);
        if (newPlaceholder) {
          newGrouping.experimentalNISSPlaceholder = newPlaceholder;
          newPlaceholder.experimentalNISSGrouping = newGrouping;
        }
        yield newGrouping;
      }
      *traverseMove(move, _options) {
        yield move;
      }
      #doChildrenCommute(A, B, options) {
        if (A.experimentalNumChildAlgNodes() === 1 && B.experimentalNumChildAlgNodes() === 1) {
          const aMove = Array.from(A.childAlgNodes())[0]?.as(Move);
          const bMove = Array.from(B.childAlgNodes())[0]?.as(Move);
          if (!(aMove && bMove)) {
            return false;
          }
          if (bMove.quantum.isIdentical(aMove.quantum)) {
            return true;
          }
          const appendOptionsHelper = new AppendOptionsHelper(options);
          if (appendOptionsHelper.puzzleSpecificSimplifyOptions()?.axis?.areQuantumMovesSameAxis(aMove.quantum, bMove.quantum)) {
            return true;
          }
        }
        return false;
      }
      *traverseCommutator(commutator, options) {
        if (options.depth === 0) {
          yield commutator;
          return;
        }
        const newOptions = this.#descendOptions(options);
        const newCommutator = new Commutator(
          this.traverseAlg(commutator.A, newOptions),
          this.traverseAlg(commutator.B, newOptions)
        );
        if (newCommutator.A.experimentalIsEmpty() || newCommutator.B.experimentalIsEmpty() || newCommutator.A.isIdentical(newCommutator.B) || newCommutator.A.isIdentical(newCommutator.B.invert()) || this.#doChildrenCommute(newCommutator.A, newCommutator.B, options)) {
          return;
        }
        yield newCommutator;
      }
      *traverseConjugate(conjugate, options) {
        if (options.depth === 0) {
          yield conjugate;
          return;
        }
        const newOptions = this.#descendOptions(options);
        const newConjugate = new Conjugate(
          this.traverseAlg(conjugate.A, newOptions),
          this.traverseAlg(conjugate.B, newOptions)
        );
        if (newConjugate.B.experimentalIsEmpty()) {
          return;
        }
        if (newConjugate.A.experimentalIsEmpty() || newConjugate.A.isIdentical(newConjugate.B) || newConjugate.A.isIdentical(newConjugate.B.invert()) || this.#doChildrenCommute(newConjugate.A, newConjugate.B, options)) {
          yield* conjugate.B.childAlgNodes();
          return;
        }
        yield newConjugate;
      }
      *traversePause(pause, _options) {
        if (pause.experimentalNISSGrouping) {
          const newPause = new Pause();
          this.#newPlaceholderAssociations().set(
            pause.experimentalNISSGrouping,
            newPause
          );
          yield newPause;
        } else {
          yield pause;
        }
      }
      *traverseNewline(newline, _options) {
        yield newline;
      }
      *traverseLineComment(comment, _options) {
        yield comment;
      }
    };
    simplify = functionFromTraversal(Simplify);
  }
});

// src/cubing/alg/simplify/index.ts
var init_simplify2 = __esm({
  "src/cubing/alg/simplify/index.ts"() {
    "use strict";
    init_simplify();
    init_append();
  }
});

// src/cubing/alg/Alg.ts
function toIterable(input) {
  if (!input) {
    return [];
  }
  if (experimentalIs(input, Alg)) {
    return input.childAlgNodes();
  }
  if (typeof input === "string") {
    return parseAlg(input).childAlgNodes();
  }
  const iter = input;
  if (typeof iter[Symbol.iterator] === "function") {
    return iter;
  }
  throw new Error("Invalid AlgNode");
}
function experimentalEnsureAlg(alg) {
  if (experimentalIs(alg, Alg)) {
    return alg;
  }
  return new Alg(alg);
}
function spaceBetween(u1, u2) {
  if (u1.is(Newline) || u2.is(Newline)) {
    return "";
  }
  if (u2.as(Grouping)?.experimentalNISSPlaceholder) {
    return "";
  }
  if (u1.is(LineComment) && !u2.is(Newline)) {
    return "\n";
  }
  return " ";
}
var Alg;
var init_Alg = __esm({
  "src/cubing/alg/Alg.ts"() {
    "use strict";
    init_common();
    init_is();
    init_iteration();
    init_parseAlg();
    init_simplify2();
    init_alg_nodes();
    init_LineComment();
    init_Move();
    init_Newline();
    init_warnOnce();
    Alg = class extends AlgCommon {
      // #debugString: string;
      #algNodes;
      // TODO: freeze?
      constructor(alg) {
        super();
        this.#algNodes = Array.from(toIterable(alg));
        for (const algNode of this.#algNodes) {
          if (!experimentalIsAlgNode(algNode)) {
            throw new Error("An alg can only contain alg nodes.");
          }
        }
      }
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
      isIdentical(other) {
        const otherAsAlg = other;
        if (!other.is(Alg)) {
          return false;
        }
        const l1 = Array.from(this.#algNodes);
        const l2 = Array.from(otherAsAlg.#algNodes);
        if (l1.length !== l2.length) {
          return false;
        }
        for (let i = 0; i < l1.length; i++) {
          if (!l1[i].isIdentical(l2[i])) {
            return false;
          }
        }
        return true;
      }
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
      invert() {
        return new Alg(reverse(Array.from(this.#algNodes).map((u) => u.invert())));
      }
      /** @deprecated Use {@link Alg.expand} instead. */
      *experimentalExpand(iterDir = 1 /* Forwards */, depth) {
        depth ?? (depth = Infinity);
        for (const algNode of direct(this.#algNodes, iterDir)) {
          yield* algNode.experimentalExpand(iterDir, depth);
        }
      }
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
      expand(options) {
        return new Alg(
          this.experimentalExpand(
            1 /* Forwards */,
            options?.depth ?? Infinity
          )
        );
      }
      /** @deprecated */
      *experimentalLeafMoves() {
        for (const leaf of this.experimentalExpand()) {
          if (leaf.is(Move)) {
            yield leaf;
          }
        }
      }
      concat(input) {
        return new Alg(
          Array.from(this.#algNodes).concat(Array.from(toIterable(input)))
        );
      }
      /** @deprecated */
      experimentalIsEmpty() {
        for (const _ of this.#algNodes) {
          return false;
        }
        return true;
      }
      static fromString(s) {
        return parseAlg(s);
      }
      /** @deprecated */
      units() {
        return this.childAlgNodes();
      }
      *childAlgNodes() {
        for (const algNode of this.#algNodes) {
          yield algNode;
        }
      }
      /** @deprecated */
      experimentalNumUnits() {
        return this.experimentalNumChildAlgNodes();
      }
      experimentalNumChildAlgNodes() {
        return Array.from(this.#algNodes).length;
      }
      /** @deprecated */
      get type() {
        warnOnce("deprecated: type");
        return "sequence";
      }
      /**
       * Converts the Alg to a string:
       *
       *     const alg = new Alg([new Move("R"), new Move("U2"), new Move("L")])
       *     // R U2 L
       *     console.log(alg.toString())
       */
      toString() {
        let output = "";
        let previousVisibleAlgNode = null;
        for (const algNode of this.#algNodes) {
          if (previousVisibleAlgNode) {
            output += spaceBetween(previousVisibleAlgNode, algNode);
          }
          const nissGrouping = algNode.as(Pause)?.experimentalNISSGrouping;
          if (nissGrouping) {
            if (nissGrouping.amount !== -1) {
              throw new Error("Invalid NISS Grouping amount!");
            }
            output += `^(${nissGrouping.alg.toString()})`;
          } else if (algNode.as(Grouping)?.experimentalNISSPlaceholder) {
          } else {
            output += algNode.toString();
          }
          previousVisibleAlgNode = algNode;
        }
        return output;
      }
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
      experimentalSimplify(options) {
        return new Alg(simplify(this, options ?? {}));
      }
      /** @deprecated See {@link experimentalSimplify} */
      simplify(options) {
        return this.experimentalSimplify(options);
      }
    };
  }
});

// src/cubing/alg/example.ts
var Example;
var init_example = __esm({
  "src/cubing/alg/example.ts"() {
    "use strict";
    init_Alg();
    init_alg_nodes();
    init_Commutator();
    init_Conjugate();
    init_Move();
    init_Pause();
    Example = {
      Sune: new Alg([
        new Move("R", 1),
        new Move("U", 1),
        new Move("R", -1),
        new Move("U", 1),
        new Move("R", 1),
        new Move("U", -2),
        new Move("R", -1)
      ]),
      AntiSune: new Alg([
        new Move("R", 1),
        new Move("U", 2),
        new Move("R", -1),
        new Move("U", -1),
        new Move("R", 1),
        new Move("U", -1),
        new Move("R", -1)
      ]),
      SuneCommutator: new Alg([
        new Commutator(
          new Alg([new Move("R", 1), new Move("U", 1), new Move("R", -2)]),
          new Alg([
            new Conjugate(new Alg([new Move("R", 1)]), new Alg([new Move("U", 1)]))
          ])
        )
      ]),
      Niklas: new Alg([
        new Move("R", 1),
        new Move("U", -1),
        new Move("L", -1),
        new Move("U", 1),
        new Move("R", -1),
        new Move("U", -1),
        new Move("L", 1),
        new Move("U", 1)
      ]),
      EPerm: new Alg([
        new Move("x", -1),
        new Commutator(
          new Alg([
            new Conjugate(
              new Alg([new Move("R", 1)]),
              new Alg([new Move("U", -1)])
            )
          ]),
          new Alg([new Move("D", 1)])
        ),
        new Commutator(
          new Alg([
            new Conjugate(new Alg([new Move("R", 1)]), new Alg([new Move("U", 1)]))
          ]),
          new Alg([new Move("D", 1)])
        ),
        new Move("x", 1)
      ]),
      FURURFCompact: new Alg([
        new Conjugate(
          new Alg([new Move("F", 1)]),
          new Alg([
            new Commutator(
              new Alg([new Move("U", 1)]),
              new Alg([new Move("R", 1)])
            )
          ])
        )
      ]),
      APermCompact: new Alg([
        new Conjugate(
          new Alg([new Move("R", 2)]),
          new Alg([
            new Commutator(
              new Alg([new Move("F", 2)]),
              new Alg([new Move("R", -1), new Move("B", -1), new Move("R", 1)])
            )
          ])
        )
      ]),
      FURURFMoves: new Alg([
        new Move("F", 1),
        new Move("U", 1),
        new Move("R", 1),
        new Move("U", -1),
        new Move("R", -1),
        new Move("F", -1)
      ]),
      TPerm: new Alg([
        new Move("R", 1),
        new Move("U", 1),
        new Move("R", -1),
        new Move("U", -1),
        new Move("R", -1),
        new Move("F", 1),
        new Move("R", 2),
        new Move("U", -1),
        new Move("R", -1),
        new Move("U", -1),
        new Move("R", 1),
        new Move("U", 1),
        new Move("R", -1),
        new Move("F", -1)
      ]),
      HeadlightSwaps: new Alg([
        new Conjugate(
          new Alg([new Move("F", 1)]),
          new Alg([
            new Grouping(
              new Alg([
                new Commutator(
                  new Alg([new Move("R", 1)]),
                  new Alg([new Move("U", 1)])
                )
              ]),
              3
            )
          ])
        )
      ]),
      TriplePause: new Alg([new Pause(), new Pause(), new Pause()])
      // AllAlgParts: [
      //   new Alg([new Move("R", 1), new Move("U", -1)]),
      //   new Grouping(new Alg([new Move("F", 1)]), 2),
      //   // new Rotation("y", -1),
      //   new Move("R", 2),
      //   new Commutator(new Alg([new Move("R", 2)]), new Alg([new Move("U", 2)]), 2),
      //   new Conjugate(new Alg([new Move("L", 2)]), new Alg([new Move("D", -1)]), 2),
      //   new Pause(),
      //   new Newline(),
      //   new LineComment("line comment"),
      // ],
    };
  }
});

// src/cubing/alg/keyboard.ts
var cubeKeyMapping;
var init_keyboard = __esm({
  "src/cubing/alg/keyboard.ts"() {
    "use strict";
    init_alg_nodes();
    init_Move();
    cubeKeyMapping = {
      73: new Move("R"),
      75: new Move("R'"),
      87: new Move("B"),
      79: new Move("B'"),
      83: new Move("D"),
      76: new Move("D'"),
      68: new Move("L"),
      69: new Move("L'"),
      74: new Move("U"),
      70: new Move("U'"),
      72: new Move("F"),
      71: new Move("F'"),
      78: new Move("x'"),
      67: new Move("l"),
      82: new Move("l'"),
      85: new Move("r"),
      77: new Move("r'"),
      88: new Move("d"),
      188: new Move("d'"),
      84: new Move("x"),
      89: new Move("x"),
      66: new Move("x'"),
      186: new Move("y"),
      59: new Move("y"),
      65: new Move("y'"),
      // 186 is WebKit, 59 is Mozilla; see http://unixpapa.com/js/key.html
      80: new Move("z"),
      81: new Move("z'"),
      90: new Move("M'"),
      190: new Move("M'"),
      192: new Pause()
    };
  }
});

// src/cubing/alg/url.ts
var init_url = __esm({
  "src/cubing/alg/url.ts"() {
    "use strict";
  }
});

// src/cubing/alg/index.ts
var init_alg = __esm({
  "src/cubing/alg/index.ts"() {
    "use strict";
    init_Alg();
    init_AlgBuilder();
    init_traversal();
    init_example();
    init_keyboard();
    init_alg_nodes();
    init_url();
    init_simplify2();
    init_is();
    init_debug();
  }
});

// src/cubing/puzzle-geometry/FaceNameSwizzler.ts
var FaceNameSwizzler;
var init_FaceNameSwizzler = __esm({
  "src/cubing/puzzle-geometry/FaceNameSwizzler.ts"() {
    "use strict";
    FaceNameSwizzler = class {
      constructor(facenames, gripnames_arg) {
        this.facenames = facenames;
        this.prefixFree = true;
        this.gripnames = [];
        if (gripnames_arg) {
          this.gripnames = gripnames_arg;
        }
        for (let i = 0; this.prefixFree && i < facenames.length; i++) {
          for (let j = 0; this.prefixFree && j < facenames.length; j++) {
            if (i !== j && facenames[i].startsWith(facenames[j])) {
              this.prefixFree = false;
            }
          }
        }
      }
      setGripNames(names) {
        this.gripnames = names;
      }
      // split a string into face names and return a list of
      // indices.
      splitByFaceNames(s) {
        const r = [];
        let at = 0;
        while (at < s.length) {
          if (at > 0 && at < s.length && s[at] === "_") {
            at++;
          }
          let currentMatch = -1;
          for (let i = 0; i < this.facenames.length; i++) {
            if (s.substr(at).startsWith(this.facenames[i]) && (currentMatch < 0 || this.facenames[i].length > this.facenames[currentMatch].length)) {
              currentMatch = i;
            }
          }
          if (currentMatch >= 0) {
            r.push(currentMatch);
            at += this.facenames[currentMatch].length;
          } else {
            throw new Error(`Could not split ${s} into face names.`);
          }
        }
        return r;
      }
      // cons a grip from an array of numbers.
      joinByFaceIndices(list) {
        let sep = "";
        const r = [];
        for (let i = 0; i < list.length; i++) {
          r.push(sep);
          r.push(this.facenames[list[i]]);
          if (!this.prefixFree) {
            sep = "_";
          }
        }
        return r.join("");
      }
      /*
       *   Try to match something the user gave us with some geometric
       *   feature.  We used to have strict requirements:
       *
       *      a)  The set of face names are prefix free
       *      b)  When specifying a corner, all coincident planes were
       *          specified
       *
       *   But, to allow megaminx to have more reasonable and
       *   conventional names, and to permit shorter canonical
       *   names, we are relaxing these requirements and adding
       *   new syntax.  Now:
       *
       *      a)  Face names need not be syntax free.
       *      b)  When parsing a geometric name, we use greedy
       *          matching, so the longest name that matches the
       *          user string at the current position is the one
       *          assumed to match.
       *      c)  Underscores are permitted to separate face names
       *          (both in user input and in geometric
       *          descriptions).
       *      d)  Default names of corner moves where corners have
       *          more than three corners, need only include three
       *          of the corners.
       *
       *   This code is not performance-sensitive so we can do it a
       *   slow and simple way.
       */
      spinmatch(userinput, longname) {
        if (userinput === longname) {
          return true;
        }
        try {
          const e1 = this.splitByFaceNames(userinput);
          const e2 = this.splitByFaceNames(longname);
          if (e1.length !== e2.length && e1.length < 3) {
            return false;
          }
          for (let i = 0; i < e1.length; i++) {
            for (let j = 0; j < i; j++) {
              if (e1[i] === e1[j]) {
                return false;
              }
            }
            let found = false;
            for (let j = 0; j < e2.length; j++) {
              if (e1[i] === e2[j]) {
                found = true;
                break;
              }
            }
            if (!found) {
              return false;
            }
          }
          return true;
        } catch (e) {
          return false;
        }
      }
      /* same as above, but permit both to have v's on the end. */
      spinmatchv(userinput, longname) {
        if (userinput.endsWith("v") && longname.endsWith("v")) {
          return this.spinmatch(
            userinput.slice(0, userinput.length - 1),
            longname.slice(0, longname.length - 1)
          );
        } else {
          return this.spinmatch(userinput, longname);
        }
      }
      unswizzle(s) {
        if ((s.endsWith("v") || s.endsWith("w")) && s[0] <= "Z") {
          s = s.slice(0, s.length - 1);
        }
        const upperCaseGrip = s.toUpperCase();
        for (let i = 0; i < this.gripnames.length; i++) {
          const g = this.gripnames[i];
          if (this.spinmatch(upperCaseGrip, g)) {
            return g;
          }
        }
        return s;
      }
    };
  }
});

// src/cubing/puzzle-geometry/notation-mapping/NullMapper.ts
var NullMapper;
var init_NullMapper = __esm({
  "src/cubing/puzzle-geometry/notation-mapping/NullMapper.ts"() {
    "use strict";
    NullMapper = class {
      notationToInternal(move) {
        return move;
      }
      notationToExternal(move) {
        return move;
      }
    };
  }
});

// src/cubing/puzzle-geometry/notation-mapping/FTONotationMapper.ts
var FTONotationMapper;
var init_FTONotationMapper = __esm({
  "src/cubing/puzzle-geometry/notation-mapping/FTONotationMapper.ts"() {
    "use strict";
    init_alg();
    FTONotationMapper = class {
      constructor(child, sw) {
        this.child = child;
        this.sw = sw;
      }
      notationToInternal(move) {
        if (move.family === "T" && move.innerLayer === void 0 && move.outerLayer === void 0) {
          return new Move(
            new QuantumMove("FLRv", move.innerLayer, move.outerLayer),
            move.amount
          );
        } else {
          const r = this.child.notationToInternal(move);
          return r;
        }
      }
      // we never rewrite click moves to these moves.
      notationToExternal(move) {
        let fam = move.family;
        if (fam.length > 0 && fam[fam.length - 1] === "v") {
          fam = fam.substring(0, fam.length - 1);
        }
        if (this.sw.spinmatch(fam, "FLUR")) {
          return new Move(
            new QuantumMove("T", move.innerLayer, move.outerLayer),
            move.amount
          );
        }
        return this.child.notationToExternal(move);
      }
    };
  }
});

// src/cubing/puzzle-geometry/notation-mapping/FaceRenamingMapper.ts
var FaceRenamingMapper;
var init_FaceRenamingMapper = __esm({
  "src/cubing/puzzle-geometry/notation-mapping/FaceRenamingMapper.ts"() {
    "use strict";
    init_alg();
    FaceRenamingMapper = class {
      constructor(internalNames, externalNames) {
        this.internalNames = internalNames;
        this.externalNames = externalNames;
      }
      // TODO:  consider putting a cache in front of this
      convertString(grip, a, b) {
        let suffix = "";
        if ((grip.endsWith("v") || grip.endsWith("v")) && grip <= "_") {
          suffix = grip.slice(grip.length - 1);
          grip = grip.slice(0, grip.length - 1);
        }
        const upper = grip.toUpperCase();
        let isLowerCase = false;
        if (grip !== upper) {
          isLowerCase = true;
          grip = upper;
        }
        grip = b.joinByFaceIndices(a.splitByFaceNames(grip));
        if (isLowerCase) {
          grip = grip.toLowerCase();
        }
        return grip + suffix;
      }
      convert(move, a, b) {
        const grip = move.family;
        const ngrip = this.convertString(grip, a, b);
        if (grip === ngrip) {
          return move;
        } else {
          return new Move(
            new QuantumMove(ngrip, move.innerLayer, move.outerLayer),
            move.amount
          );
        }
      }
      notationToInternal(move) {
        const r = this.convert(move, this.externalNames, this.internalNames);
        return r;
      }
      notationToExternal(move) {
        return this.convert(move, this.internalNames, this.externalNames);
      }
    };
  }
});

// src/cubing/puzzle-geometry/notation-mapping/MegaminxScramblingNotationMapper.ts
var MegaminxScramblingNotationMapper;
var init_MegaminxScramblingNotationMapper = __esm({
  "src/cubing/puzzle-geometry/notation-mapping/MegaminxScramblingNotationMapper.ts"() {
    "use strict";
    init_alg();
    MegaminxScramblingNotationMapper = class {
      constructor(child) {
        this.child = child;
      }
      notationToInternal(move) {
        if (move.innerLayer === void 0 && move.outerLayer === void 0) {
          if (Math.abs(move.amount) === 1) {
            if (move.family === "R++") {
              return new Move(new QuantumMove("L", 3, 2), -2 * move.amount);
            } else if (move.family === "R--") {
              return new Move(new QuantumMove("L", 3, 2), 2 * move.amount);
            } else if (move.family === "D++") {
              return new Move(new QuantumMove("U", 3, 2), -2 * move.amount);
            } else if (move.family === "D--") {
              return new Move(new QuantumMove("U", 3, 2), 2 * move.amount);
            }
            if (move.family === "R_PLUSPLUS_") {
              return new Move(new QuantumMove("L", 3, 2), -2 * move.amount);
            } else if (move.family === "D_PLUSPLUS_") {
              return new Move(new QuantumMove("U", 3, 2), -2 * move.amount);
            }
          }
          if (move.family === "y") {
            return new Move("Uv", move.amount);
          }
          if (move.family === "x" && Math.abs(move.amount) === 2) {
            return new Move("DRRv", move.amount / 2);
          }
        }
        return this.child.notationToInternal(move);
      }
      // we never rewrite click moves to these moves.
      notationToExternal(move) {
        if (move.family === "DRRv" && Math.abs(move.amount) === 1) {
          return new Move(
            new QuantumMove("x", move.innerLayer, move.outerLayer),
            move.amount * 2
          );
        }
        if (move.family === "DLLv" && Math.abs(move.amount) === 1) {
          return new Move(
            new QuantumMove("x", move.innerLayer, move.outerLayer),
            -move.amount * 2
          );
        }
        if (move.family === "Uv") {
          return new Move(
            new QuantumMove("y", move.innerLayer, move.outerLayer),
            move.amount
          );
        }
        if (move.family === "DDv") {
          return new Move("y", -move.amount);
        }
        return this.child.notationToExternal(move);
      }
    };
  }
});

// src/cubing/puzzle-geometry/notation-mapping/NxNxNCubeMapper.ts
var NxNxNCubeMapper;
var init_NxNxNCubeMapper = __esm({
  "src/cubing/puzzle-geometry/notation-mapping/NxNxNCubeMapper.ts"() {
    "use strict";
    init_alg();
    NxNxNCubeMapper = class {
      constructor(slices) {
        this.slices = slices;
      }
      notationToInternal(move) {
        const grip = move.family;
        if (!(move.innerLayer || move.outerLayer)) {
          if (grip === "x") {
            move = new Move("Rv", move.amount);
          } else if (grip === "y") {
            move = new Move("Uv", move.amount);
          } else if (grip === "z") {
            move = new Move("Fv", move.amount);
          }
          if ((this.slices & 1) === 1) {
            if (grip === "E") {
              move = new Move(
                new QuantumMove("D", (this.slices + 1) / 2),
                move.amount
              );
            } else if (grip === "M") {
              move = new Move(
                new QuantumMove("L", (this.slices + 1) / 2),
                move.amount
              );
            } else if (grip === "S") {
              move = new Move(
                new QuantumMove("F", (this.slices + 1) / 2),
                move.amount
              );
            }
          }
          if (this.slices > 2) {
            if (grip === "e") {
              move = new Move(
                new QuantumMove("D", this.slices - 1, 2),
                move.amount
              );
            } else if (grip === "m") {
              move = new Move(
                new QuantumMove("L", this.slices - 1, 2),
                move.amount
              );
            } else if (grip === "s") {
              move = new Move(
                new QuantumMove("F", this.slices - 1, 2),
                move.amount
              );
            }
          }
        }
        return move;
      }
      // do we want to map slice moves to E/M/S instead of 2U/etc.?
      notationToExternal(move) {
        const grip = move.family;
        if (!(move.innerLayer || move.outerLayer)) {
          if (grip === "Rv") {
            return new Move("x", move.amount);
          } else if (grip === "Uv") {
            return new Move("y", move.amount);
          } else if (grip === "Fv") {
            return new Move("z", move.amount);
          } else if (grip === "Lv") {
            return new Move("x", -move.amount);
          } else if (grip === "Dv") {
            return new Move("y", -move.amount);
          } else if (grip === "Bv") {
            return new Move("z", -move.amount);
          }
        }
        return move;
      }
    };
  }
});

// src/cubing/puzzle-geometry/notation-mapping/PyraminxNotationMapper.ts
var pyraminxFamilyMap, tetraminxFamilyMap, pyraminxFamilyMapWCA, pyraminxExternalQuantumY, pyraminxInternalQuantumY, PyraminxNotationMapper, TetraminxNotationMapper;
var init_PyraminxNotationMapper = __esm({
  "src/cubing/puzzle-geometry/notation-mapping/PyraminxNotationMapper.ts"() {
    "use strict";
    init_alg();
    pyraminxFamilyMap = {
      U: "frl",
      L: "fld",
      R: "fdr",
      B: "dlr",
      u: "FRL",
      l: "FLD",
      r: "FDR",
      b: "DLR",
      Uv: "FRLv",
      Lv: "FLDv",
      Rv: "FDRv",
      Bv: "DLRv",
      D: "D",
      F: "F",
      BL: "L",
      BR: "R"
    };
    tetraminxFamilyMap = {
      U: "FRL",
      L: "FLD",
      R: "FDR",
      B: "DLR",
      u: "frl",
      l: "fld",
      r: "fdr",
      b: "dlr",
      Uv: "FRLv",
      Lv: "FLDv",
      Rv: "FDRv",
      Bv: "DLRv",
      D: "D",
      F: "F",
      BL: "L",
      BR: "R",
      d: "d",
      f: "f",
      bl: "l",
      br: "r"
    };
    pyraminxFamilyMapWCA = {
      U: "FRL",
      L: "FLD",
      R: "FDR",
      B: "DLR"
    };
    pyraminxExternalQuantumY = new QuantumMove("y");
    pyraminxInternalQuantumY = new QuantumMove("Dv");
    PyraminxNotationMapper = class {
      constructor(child) {
        this.child = child;
        this.wcaHack = false;
        this.map = pyraminxFamilyMap;
      }
      notationToInternal(move) {
        if (this.wcaHack && move.innerLayer === 2 && move.outerLayer === null) {
          const newFamilyWCA = pyraminxFamilyMapWCA[move.family];
          if (newFamilyWCA) {
            return new Move(
              new QuantumMove(newFamilyWCA, move.innerLayer, move.outerLayer),
              move.amount
            );
          }
        }
        const newFamily = this.map[move.family];
        if (newFamily) {
          return new Move(
            new QuantumMove(newFamily, move.innerLayer, move.outerLayer),
            move.amount
          );
        } else if (pyraminxExternalQuantumY.isIdentical(move.quantum)) {
          return new Move(pyraminxInternalQuantumY, -move.amount);
        } else {
          return null;
        }
      }
      // we never rewrite click moves to these moves.
      notationToExternal(move) {
        if (this.wcaHack && move.innerLayer === 2 && move.outerLayer === null) {
          for (const [external, internal] of Object.entries(pyraminxFamilyMapWCA)) {
            if (this.child.spinmatch(move.family, internal)) {
              return new Move(
                new QuantumMove(external, move.innerLayer, move.outerLayer),
                move.amount
              );
            }
          }
        }
        for (const [external, internal] of Object.entries(this.map)) {
          if (this.child.spinmatch(move.family, internal)) {
            return new Move(
              new QuantumMove(external, move.innerLayer, move.outerLayer),
              move.amount
            );
          }
        }
        if (pyraminxInternalQuantumY.isIdentical(move.quantum)) {
          return new Move(pyraminxExternalQuantumY, -move.amount);
        } else {
          return null;
        }
      }
    };
    TetraminxNotationMapper = class extends PyraminxNotationMapper {
      constructor(child) {
        super(child);
        this.wcaHack = true;
        this.map = tetraminxFamilyMap;
      }
    };
  }
});

// src/cubing/puzzle-geometry/notation-mapping/SkewbNotationMapper.ts
var skewbFamilyMap, skewbExternalQuantumX, skewbInternalQuantumX, skewbInternalQuantumXPrime, skewbExternalQuantumY, skewbInternalQuantumY, skewbInternalQuantumYPrime, skewbExternalQuantumZ, skewbInternalQuantumZ, skewbInternalQuantumZPrime, SkewbNotationMapper;
var init_SkewbNotationMapper = __esm({
  "src/cubing/puzzle-geometry/notation-mapping/SkewbNotationMapper.ts"() {
    "use strict";
    init_alg();
    skewbFamilyMap = {
      U: "UBL",
      UL: "ULF",
      F: "UFR",
      UR: "URB",
      B: "DBL",
      D: "DFR",
      L: "DLF",
      R: "DRB",
      Uv: "UBLv",
      ULv: "ULFv",
      Fv: "UFRv",
      URv: "URBv",
      Bv: "DBLv",
      Dv: "DFRv",
      Lv: "DLFv",
      Rv: "DRBv"
    };
    skewbExternalQuantumX = new QuantumMove("x");
    skewbInternalQuantumX = new QuantumMove("Rv");
    skewbInternalQuantumXPrime = new QuantumMove("Lv");
    skewbExternalQuantumY = new QuantumMove("y");
    skewbInternalQuantumY = new QuantumMove("Uv");
    skewbInternalQuantumYPrime = new QuantumMove("Dv");
    skewbExternalQuantumZ = new QuantumMove("z");
    skewbInternalQuantumZ = new QuantumMove("Fv");
    skewbInternalQuantumZPrime = new QuantumMove("Bv");
    SkewbNotationMapper = class {
      constructor(child) {
        this.child = child;
      }
      notationToInternal(move) {
        if (move.innerLayer || move.outerLayer) {
          return null;
        }
        const newFamily = skewbFamilyMap[move.family];
        if (newFamily) {
          return new Move(
            new QuantumMove(newFamily, move.outerLayer, move.innerLayer),
            move.amount
          );
        }
        if (skewbExternalQuantumX.isIdentical(move.quantum)) {
          return new Move(skewbInternalQuantumX, move.amount);
        }
        if (skewbExternalQuantumY.isIdentical(move.quantum)) {
          return new Move(skewbInternalQuantumY, move.amount);
        }
        if (skewbExternalQuantumZ.isIdentical(move.quantum)) {
          return new Move(skewbInternalQuantumZ, move.amount);
        }
        return null;
      }
      // we never rewrite click moves to these moves.
      notationToExternal(move) {
        for (const [external, internal] of Object.entries(skewbFamilyMap)) {
          if (this.child.spinmatchv(move.family, internal)) {
            return new Move(
              new QuantumMove(external, move.innerLayer, move.outerLayer),
              move.amount
            );
          }
        }
        if (skewbInternalQuantumX.isIdentical(move.quantum)) {
          return new Move(skewbExternalQuantumX, move.amount);
        }
        if (skewbInternalQuantumXPrime.isIdentical(move.quantum)) {
          return new Move(skewbExternalQuantumX, -move.amount);
        }
        if (skewbInternalQuantumY.isIdentical(move.quantum)) {
          return new Move(skewbExternalQuantumY, move.amount);
        }
        if (skewbInternalQuantumYPrime.isIdentical(move.quantum)) {
          return new Move(skewbExternalQuantumY, -move.amount);
        }
        if (skewbInternalQuantumZ.isIdentical(move.quantum)) {
          return new Move(skewbExternalQuantumZ, move.amount);
        }
        if (skewbInternalQuantumZPrime.isIdentical(move.quantum)) {
          return new Move(skewbExternalQuantumZ, -move.amount);
        }
        return null;
      }
    };
  }
});

// src/cubing/puzzle-geometry/notation-mapping/index.ts
var init_notation_mapping = __esm({
  "src/cubing/puzzle-geometry/notation-mapping/index.ts"() {
    "use strict";
    init_NullMapper();
    init_FTONotationMapper();
    init_FaceRenamingMapper();
    init_MegaminxScramblingNotationMapper();
    init_NxNxNCubeMapper();
    init_PyraminxNotationMapper();
    init_SkewbNotationMapper();
  }
});

// src/cubing/puzzle-geometry/Options.ts
function parseOptions(argv) {
  let argp = 0;
  const options = {};
  while (argp < argv.length && argv[argp][0] === "-") {
    const option = argv[argp++];
    if (option === "--rotations") {
      options.addRotations = true;
    } else if (option === "--allmoves") {
      options.allMoves = true;
    } else if (option === "--outerblockmoves") {
      options.outerBlockMoves = true;
    } else if (option === "--vertexmoves") {
      options.vertexMoves = true;
    } else if (option === "--nocorners") {
      options.includeCornerOrbits = false;
    } else if (option === "--noedges") {
      options.includeEdgeOrbits = false;
    } else if (option === "--noorientation") {
      options.fixedOrientation = true;
    } else if (option === "--nocenters") {
      options.includeCenterOrbits = false;
    } else if (option === "--omit") {
      options.excludeOrbits = argv[argp].split(",");
      argp++;
    } else if (option === "--moves") {
      options.moveList = argv[argp].split(",");
      argp++;
    } else if (option === "--optimize") {
      options.optimizeOrbits = true;
    } else if (option === "--scramble") {
      options.scrambleAmount = 100;
    } else if (option === "--fixcorner") {
      options.fixedPieceType = "v";
    } else if (option === "--fixedge") {
      options.fixedPieceType = "e";
    } else if (option === "--fixcenter") {
      options.fixedPieceType = "f";
    } else if (option === "--orientcenters") {
      options.orientCenters = true;
    } else if (option === "--puzzleorientation") {
      options.puzzleOrientation = JSON.parse(argv[argp]);
      argp++;
    } else {
      throw new Error(`Bad option: ${option}`);
    }
  }
  const puzzleDescription = parsePuzzleDescription(argv.slice(argp).join(" "));
  return { puzzleDescription, options };
}
var PuzzleGeometryFullOptions;
var init_Options = __esm({
  "src/cubing/puzzle-geometry/Options.ts"() {
    "use strict";
    init_PuzzleGeometry();
    PuzzleGeometryFullOptions = class {
      // scramble?
      constructor(options = {}) {
        this.verbosity = 0;
        // verbosity (console.log)
        this.allMoves = false;
        // generate outer block moves
        this.vertexMoves = false;
        // generate vertex moves
        this.addRotations = false;
        // add symmetry information to ksolve output
        this.moveList = null;
        // move list to generate
        this.fixedOrientation = false;
        // eliminate any orientations
        this.fixedPieceType = null;
        // fix a piece?
        this.orientCenters = false;
        // orient centers?
        // TODO: Group these into a single object?
        this.includeCornerOrbits = true;
        // include corner orbits
        this.includeCenterOrbits = true;
        // include center orbits
        this.includeEdgeOrbits = true;
        // include edge orbits
        // Overrides the previous options.
        this.excludeOrbits = [];
        // exclude these orbits
        this.optimizeOrbits = false;
        // optimize PermOri
        this.grayCorners = false;
        // make corner sets gray
        this.grayCenters = false;
        // make center sets gray
        this.grayEdges = false;
        // make edge sets gray
        this.puzzleOrientation = null;
        // single puzzle orientation from options
        this.puzzleOrientations = null;
        // puzzle orientation override object from options // TODO: is this needed?
        this.scrambleAmount = 0;
        Object.assign(this, options);
      }
    };
  }
});

// src/cubing/puzzle-geometry/Perm.ts
function zeros(n) {
  if (!zeroCache[n]) {
    const c = Array(n);
    for (let i = 0; i < n; i++) {
      c[i] = 0;
    }
    zeroCache[n] = c;
  }
  return zeroCache[n];
}
function iota(n) {
  if (!iotaCache[n]) {
    const c = Array(n);
    for (let i = 0; i < n; i++) {
      c[i] = i;
    }
    iotaCache[n] = c;
  }
  return iotaCache[n];
}
function identity(n) {
  return new Perm(iota(n));
}
function factorial(a) {
  let r = BigInt(1);
  while (a > 1) {
    r *= BigInt(a);
    a--;
  }
  return r;
}
function gcd2(a, b) {
  if (a > b) {
    const t = a;
    a = b;
    b = t;
  }
  while (a > 0) {
    const m = b % a;
    b = a;
    a = m;
  }
  return b;
}
function lcm(a, b) {
  return a / gcd2(a, b) * b;
}
var zeroCache, iotaCache, Perm;
var init_Perm = __esm({
  "src/cubing/puzzle-geometry/Perm.ts"() {
    "use strict";
    zeroCache = [];
    iotaCache = [];
    Perm = class {
      // The permutation itself
      constructor(a) {
        this.n = a.length;
        this.p = a;
      }
      toString() {
        return `Perm[${this.p.join(" ")}]`;
      }
      mul(p2) {
        const c = Array(this.n);
        for (let i = 0; i < this.n; i++) {
          c[i] = p2.p[this.p[i]];
        }
        return new Perm(c);
      }
      rmul(p2) {
        const c = Array(this.n);
        for (let i = 0; i < this.n; i++) {
          c[i] = this.p[p2.p[i]];
        }
        return new Perm(c);
      }
      inv() {
        const c = Array(this.n);
        for (let i = 0; i < this.n; i++) {
          c[this.p[i]] = i;
        }
        return new Perm(c);
      }
      compareTo(p2) {
        for (let i = 0; i < this.n; i++) {
          if (this.p[i] !== p2.p[i]) {
            return this.p[i] - p2.p[i];
          }
        }
        return 0;
      }
      toGap() {
        const cyc = new Array();
        const seen = new Array(this.n);
        for (let i = 0; i < this.p.length; i++) {
          if (seen[i] || this.p[i] === i) {
            continue;
          }
          const incyc = new Array();
          for (let j = i; !seen[j]; j = this.p[j]) {
            incyc.push(1 + j);
            seen[j] = true;
          }
          cyc.push(`(${incyc.join(",")})`);
        }
        return cyc.join("");
      }
      order() {
        let r = 1;
        const seen = new Array(this.n);
        for (let i = 0; i < this.p.length; i++) {
          if (seen[i] || this.p[i] === i) {
            continue;
          }
          let cs = 0;
          for (let j = i; !seen[j]; j = this.p[j]) {
            cs++;
            seen[j] = true;
          }
          r = lcm(r, cs);
        }
        return r;
      }
    };
  }
});

// src/cubing/puzzle-geometry/PermOriSet.ts
function externalName(mapper, moveString) {
  const mv = Move.fromString(moveString);
  const mv2 = mapper.notationToExternal(mv);
  if (mv2 === null || mv === mv2) {
    return moveString;
  }
  return mv2.toString();
}
function showcanon(g, disp) {
  const n = g.moveops.length;
  if (n > 30) {
    throw new Error("Canon info too big for bitmask");
  }
  const orders = [];
  const commutes = [];
  for (let i = 0; i < n; i++) {
    const permA = g.moveops[i];
    orders.push(permA.order());
    let bits = 0;
    for (let j = 0; j < n; j++) {
      if (j === i) {
        continue;
      }
      const permB = g.moveops[j];
      if (permA.mul(permB).equal(permB.mul(permA))) {
        bits |= 1 << j;
      }
    }
    commutes.push(bits);
  }
  let curlev = {};
  curlev[0] = 1;
  for (let d = 0; d < 100; d++) {
    let sum = 0;
    const nextlev = {};
    let uniq = 0;
    for (const sti in curlev) {
      const st = +sti;
      const cnt = curlev[st];
      sum += cnt;
      uniq++;
      for (let mv = 0; mv < orders.length; mv++) {
        if ((st >> mv & 1) === 0 && (st & commutes[mv] & (1 << mv) - 1) === 0) {
          const nst = st & commutes[mv] | 1 << mv;
          if (nextlev[nst] === void 0) {
            nextlev[nst] = 0;
          }
          nextlev[nst] += (orders[mv] - 1) * cnt;
        }
      }
    }
    disp(`${d}: canonseq ${sum} states ${uniq}`);
    curlev = nextlev;
  }
}
var PGOrbitDef, lastGlobalDefinitionCounter, PGOrbitsDef, _PGOrbit, PGOrbit, PGTransformBase, PGTransform, VisibleState, DisjointUnion;
var init_PermOriSet = __esm({
  "src/cubing/puzzle-geometry/PermOriSet.ts"() {
    "use strict";
    init_alg();
    init_notation_mapping();
    init_Perm();
    PGOrbitDef = class {
      constructor(size, mod) {
        this.size = size;
        this.mod = mod;
      }
      reassemblySize() {
        return factorial(this.size) * BigInt(this.mod) ** BigInt(this.size);
      }
    };
    lastGlobalDefinitionCounter = 0;
    PGOrbitsDef = class {
      constructor(orbitnames, orbitdefs, solved, movenames, moveops, isRotation, forcenames) {
        this.orbitnames = orbitnames;
        this.orbitdefs = orbitdefs;
        this.solved = solved;
        this.movenames = movenames;
        this.moveops = moveops;
        this.isRotation = isRotation;
        this.forcenames = forcenames;
      }
      transformToKTransformationData(t) {
        const mp = {};
        for (let j = 0; j < this.orbitnames.length; j++) {
          mp[this.orbitnames[j]] = t.orbits[j].toKPuzzle();
        }
        return mp;
      }
      static transformToKTransformationData(orbitnames, t) {
        const mp = {};
        for (let j = 0; j < orbitnames.length; j++) {
          mp[orbitnames[j]] = t.orbits[j].toKPuzzle();
        }
        return mp;
      }
      describeSet(s, r, mapper) {
        const n = this.orbitdefs[s].size;
        const m = new Array(n);
        for (let i = 0; i < n; i++) {
          m[i] = [];
        }
        for (let i = 0; i < this.movenames.length; i++) {
          if (this.isRotation[i]) {
            continue;
          }
          let mvname = this.movenames[i];
          if (!this.forcenames[i]) {
            mvname = externalName(mapper, mvname);
            if (mvname[mvname.length - 1] === "'") {
              mvname = mvname.substring(0, mvname.length - 1);
            }
          }
          const pd = this.moveops[i].orbits[s];
          for (let j = 0; j < n; j++) {
            if (pd.perm[j] !== j || pd.ori[j] !== 0) {
              m[j].push(mvname);
            }
          }
        }
        for (let j = 0; j < n; j++) {
          r.push(`# ${j + 1} ${m[j].join(" ")}`);
        }
      }
      toKsolve(name, mapper = new NullMapper()) {
        const result = [];
        result.push(`Name ${name}`);
        result.push("");
        for (let i = 0; i < this.orbitnames.length; i++) {
          result.push(
            `Set ${this.orbitnames[i]} ${this.orbitdefs[i].size} ${this.orbitdefs[i].mod}`
          );
          this.describeSet(i, result, mapper);
        }
        result.push("");
        result.push("Solved");
        for (let i = 0; i < this.orbitnames.length; i++) {
          this.solved.orbits[i].appendDefinition(
            result,
            this.orbitnames[i],
            false,
            false
          );
        }
        result.push("End");
        for (let i = 0; i < this.movenames.length; i++) {
          result.push("");
          let name2 = this.movenames[i];
          if (!this.forcenames[i]) {
            name2 = externalName(mapper, this.movenames[i]);
          }
          let doinv = false;
          if (name2[name2.length - 1] === "'") {
            doinv = true;
            name2 = name2.substring(0, name2.length - 1);
          }
          result.push(`Move ${name2}`);
          for (let j = 0; j < this.orbitnames.length; j++) {
            if (doinv) {
              this.moveops[i].orbits[j].inv().appendDefinition(result, this.orbitnames[j], true);
            } else {
              this.moveops[i].orbits[j].appendDefinition(
                result,
                this.orbitnames[j],
                true
              );
            }
          }
          result.push("End");
        }
        return result;
      }
      // TODO: return type.
      toKPuzzleDefinition(includemoves) {
        const orbits = {};
        const start = {};
        for (let i = 0; i < this.orbitnames.length; i++) {
          orbits[this.orbitnames[i]] = {
            numPieces: this.orbitdefs[i].size,
            numOrientations: this.orbitdefs[i].mod
          };
          const startTransformation = this.solved.orbits[i].toKPuzzle();
          start[this.orbitnames[i]] = {
            pieces: startTransformation.permutation,
            orientation: startTransformation.orientation
          };
        }
        const moves = {};
        if (includemoves) {
          for (let i = 0; i < this.movenames.length; i++) {
            moves[this.movenames[i]] = this.transformToKTransformationData(
              this.moveops[i]
            );
          }
        }
        return {
          name: `PG3D #${++lastGlobalDefinitionCounter}`,
          orbits,
          startStateData: start,
          moves
        };
      }
      optimize() {
        const neworbitnames = [];
        const neworbitdefs = [];
        const newsolved = [];
        const newmoveops = [];
        for (let j = 0; j < this.moveops.length; j++) {
          newmoveops.push([]);
        }
        for (let i = 0; i < this.orbitdefs.length; i++) {
          const om = this.orbitdefs[i].mod;
          const n = this.orbitdefs[i].size;
          const du = new DisjointUnion(n);
          const changed = new Array(this.orbitdefs[i].size);
          for (let k = 0; k < n; k++) {
            changed[k] = false;
          }
          for (let j = 0; j < this.moveops.length; j++) {
            for (let k = 0; k < n; k++) {
              if (this.moveops[j].orbits[i].perm[k] !== k || this.moveops[j].orbits[i].ori[k] !== 0) {
                if (!this.isRotation[j]) {
                  changed[k] = true;
                }
                du.union(k, this.moveops[j].orbits[i].perm[k]);
              }
            }
          }
          let keepori = true;
          if (om > 1) {
            keepori = false;
            const duo = new DisjointUnion(this.orbitdefs[i].size * om);
            for (let j = 0; j < this.moveops.length; j++) {
              for (let k = 0; k < n; k++) {
                if (this.moveops[j].orbits[i].perm[k] !== k || this.moveops[j].orbits[i].ori[k] !== 0) {
                  for (let o = 0; o < om; o++) {
                    duo.union(
                      k * om + o,
                      this.moveops[j].orbits[i].perm[k] * om + (o + this.moveops[j].orbits[i].ori[k]) % om
                    );
                  }
                }
              }
            }
            for (let j = 0; !keepori && j < n; j++) {
              for (let o = 1; o < om; o++) {
                if (duo.find(j * om) === duo.find(j * om + o)) {
                  keepori = true;
                }
              }
            }
            for (let j = 0; !keepori && j < n; j++) {
              for (let k = 0; k < j; k++) {
                if (this.solved.orbits[i].perm[j] === this.solved.orbits[i].perm[k]) {
                  keepori = true;
                }
              }
            }
          }
          let nontriv = -1;
          let multiple = false;
          for (let j = 0; j < this.orbitdefs[i].size; j++) {
            if (changed[j]) {
              const h = du.find(j);
              if (nontriv < 0) {
                nontriv = h;
              } else if (nontriv !== h) {
                multiple = true;
              }
            }
          }
          for (let j = 0; j < this.orbitdefs[i].size; j++) {
            if (!changed[j]) {
              continue;
            }
            const h = du.find(j);
            if (h !== j) {
              continue;
            }
            const no = [];
            const on = [];
            let nv = 0;
            for (let k = 0; k < this.orbitdefs[i].size; k++) {
              if (du.find(k) === j) {
                no[nv] = k;
                on[k] = nv;
                nv++;
              }
            }
            if (multiple) {
              neworbitnames.push(`${this.orbitnames[i]}_p${j}`);
            } else {
              neworbitnames.push(this.orbitnames[i]);
            }
            if (keepori) {
              neworbitdefs.push(new PGOrbitDef(nv, this.orbitdefs[i].mod));
              newsolved.push(this.solved.orbits[i].remapVS(no, nv));
              for (let k = 0; k < this.moveops.length; k++) {
                newmoveops[k].push(this.moveops[k].orbits[i].remap(no, on, nv));
              }
            } else {
              neworbitdefs.push(new PGOrbitDef(nv, 1));
              newsolved.push(this.solved.orbits[i].remapVS(no, nv).killOri());
              for (let k = 0; k < this.moveops.length; k++) {
                newmoveops[k].push(
                  this.moveops[k].orbits[i].remap(no, on, nv).killOri()
                );
              }
            }
          }
        }
        return new PGOrbitsDef(
          neworbitnames,
          neworbitdefs,
          new VisibleState(newsolved),
          this.movenames,
          newmoveops.map((_) => new PGTransform(_)),
          this.isRotation,
          this.forcenames
        );
      }
      // replace the solved state with a new scrambled state.
      scramble(n) {
        this.solved = this.solved.mul(this.getScrambleTransformation(n));
      }
      // generate a new "random" position based on an entropy pool
      // this should be significantly faster and more random than just
      // doing a large number of random moves, especially on big puzzles.
      getScrambleTransformation(n) {
        if (n < 100) {
          n = 100;
        }
        const pool = [];
        for (let i = 0; i < this.moveops.length; i++) {
          pool[i] = this.moveops[i];
        }
        for (let i = 0; i < pool.length; i++) {
          const j = Math.floor(Math.random() * pool.length);
          const t = pool[i];
          pool[i] = pool[j];
          pool[j] = t;
        }
        if (n < pool.length) {
          n = pool.length;
        }
        for (let i = 0; i < n; i++) {
          const ri = Math.floor(Math.random() * pool.length);
          const rj = Math.floor(Math.random() * pool.length);
          const rm = Math.floor(Math.random() * this.moveops.length);
          pool[ri] = pool[ri].mul(pool[rj]).mul(this.moveops[rm]);
          if (Math.random() < 0.1) {
            pool[ri] = pool[ri].mul(this.moveops[rm]);
          }
        }
        let s = pool[0];
        for (let i = 1; i < pool.length; i++) {
          s = s.mul(pool[i]);
        }
        return s;
      }
      reassemblySize() {
        let n = BigInt(1);
        for (let i = 0; i < this.orbitdefs.length; i++) {
          n *= this.orbitdefs[i].reassemblySize();
        }
        return n;
      }
    };
    _PGOrbit = class {
      constructor(perm, ori, orimod) {
        this.perm = perm;
        this.ori = ori;
        this.orimod = orimod;
      }
      static e(n, mod) {
        return new _PGOrbit(iota(n), zeros(n), mod);
      }
      mul(b) {
        const n = this.perm.length;
        const newPerm = new Array(n);
        if (this.orimod === 1) {
          for (let i = 0; i < n; i++) {
            newPerm[i] = this.perm[b.perm[i]];
          }
          return new _PGOrbit(newPerm, this.ori, this.orimod);
        } else {
          const newOri = new Array(n);
          for (let i = 0; i < n; i++) {
            newPerm[i] = this.perm[b.perm[i]];
            newOri[i] = (this.ori[b.perm[i]] + b.ori[i]) % this.orimod;
          }
          return new _PGOrbit(newPerm, newOri, this.orimod);
        }
      }
      inv() {
        const n = this.perm.length;
        const newPerm = new Array(n);
        const newOri = new Array(n);
        for (let i = 0; i < n; i++) {
          newPerm[this.perm[i]] = i;
          newOri[this.perm[i]] = (this.orimod - this.ori[i]) % this.orimod;
        }
        return new _PGOrbit(newPerm, newOri, this.orimod);
      }
      equal(b) {
        const n = this.perm.length;
        for (let i = 0; i < n; i++) {
          if (this.perm[i] !== b.perm[i] || this.ori[i] !== b.ori[i]) {
            return false;
          }
        }
        return true;
      }
      // in-place mutator
      killOri() {
        const n = this.perm.length;
        for (let i = 0; i < n; i++) {
          this.ori[i] = 0;
        }
        this.orimod = 1;
        return this;
      }
      toPerm() {
        const o = this.orimod;
        if (o === 1) {
          return new Perm(this.perm);
        }
        const n = this.perm.length;
        const newPerm = new Array(n * o);
        for (let i = 0; i < n; i++) {
          for (let j = 0; j < o; j++) {
            newPerm[i * o + j] = o * this.perm[i] + (this.ori[i] + j) % o;
          }
        }
        return new Perm(newPerm);
      }
      // returns tuple of sets of identical pieces in this orbit
      identicalPieces() {
        const done = [];
        const n = this.perm.length;
        const r = [];
        for (let i = 0; i < n; i++) {
          const v = this.perm[i];
          if (done[v] === void 0) {
            const s = [i];
            done[v] = true;
            for (let j = i + 1; j < n; j++) {
              if (this.perm[j] === v) {
                s.push(j);
              }
            }
            r.push(s);
          }
        }
        return r;
      }
      order() {
        return this.toPerm().order();
      }
      isIdentity() {
        const n = this.perm.length;
        if (this.perm === iota(n) && this.ori === zeros(n)) {
          return true;
        }
        for (let i = 0; i < n; i++) {
          if (this.perm[i] !== i || this.ori[i] !== 0) {
            return false;
          }
        }
        return true;
      }
      zeroOris() {
        const n = this.perm.length;
        if (this.ori === zeros(n)) {
          return true;
        }
        for (let i = 0; i < n; i++) {
          if (this.ori[i] !== 0) {
            return false;
          }
        }
        return true;
      }
      remap(no, on, nv) {
        const newPerm = new Array(nv);
        const newOri = new Array(nv);
        for (let i = 0; i < nv; i++) {
          newPerm[i] = on[this.perm[no[i]]];
          newOri[i] = this.ori[no[i]];
        }
        return new _PGOrbit(newPerm, newOri, this.orimod);
      }
      remapVS(no, nv) {
        const newPerm = new Array(nv);
        const newOri = new Array(nv);
        let nextNew = 0;
        const reassign = [];
        for (let i = 0; i < nv; i++) {
          const ov = this.perm[no[i]];
          if (reassign[ov] === void 0) {
            reassign[ov] = nextNew++;
          }
          newPerm[i] = reassign[ov];
          newOri[i] = this.ori[no[i]];
        }
        return new _PGOrbit(newPerm, newOri, this.orimod);
      }
      appendDefinition(result, name, useVS, concise = true) {
        if (concise && this.isIdentity()) {
          return;
        }
        result.push(name);
        result.push(this.perm.map((_) => _ + 1).join(" "));
        if (!this.zeroOris()) {
          if (useVS) {
            const newori = new Array(this.ori.length);
            for (let i = 0; i < newori.length; i++) {
              newori[this.perm[i]] = this.ori[i];
            }
            result.push(newori.join(" "));
          } else {
            result.push(this.ori.join(" "));
          }
        }
      }
      // TODO: return type
      toKPuzzle() {
        const n = this.perm.length;
        if (this.isIdentity()) {
          if (!_PGOrbit.kcache[n]) {
            _PGOrbit.kcache[n] = { permutation: iota(n), orientation: zeros(n) };
          }
          return _PGOrbit.kcache[n];
        } else {
          return { permutation: this.perm, orientation: this.ori };
        }
      }
    };
    PGOrbit = _PGOrbit;
    PGOrbit.kcache = [];
    PGTransformBase = class {
      constructor(orbits) {
        this.orbits = orbits;
      }
      internalMul(b) {
        const newOrbits = [];
        for (let i = 0; i < this.orbits.length; i++) {
          newOrbits.push(this.orbits[i].mul(b.orbits[i]));
        }
        return newOrbits;
      }
      internalInv() {
        const newOrbits = [];
        for (const orbit of this.orbits) {
          newOrbits.push(orbit.inv());
        }
        return newOrbits;
      }
      equal(b) {
        for (let i = 0; i < this.orbits.length; i++) {
          if (!this.orbits[i].equal(b.orbits[i])) {
            return false;
          }
        }
        return true;
      }
      killOri() {
        for (const orbit of this.orbits) {
          orbit.killOri();
        }
        return this;
      }
      toPerm() {
        const perms = new Array();
        let n = 0;
        for (const orbit of this.orbits) {
          const p = orbit.toPerm();
          perms.push(p);
          n += p.n;
        }
        const newPerm = new Array(n);
        n = 0;
        for (const p of perms) {
          for (let j = 0; j < p.n; j++) {
            newPerm[n + j] = n + p.p[j];
          }
          n += p.n;
        }
        return new Perm(newPerm);
      }
      identicalPieces() {
        const r = [];
        let n = 0;
        for (const orbit of this.orbits) {
          const o = orbit.orimod;
          const s = orbit.identicalPieces();
          for (let j = 0; j < s.length; j++) {
            r.push(s[j].map((_) => _ * o + n));
          }
          n += o * orbit.perm.length;
        }
        return r;
      }
      order() {
        let r = 1;
        for (const orbit of this.orbits) {
          r = lcm(r, orbit.order());
        }
        return r;
      }
    };
    PGTransform = class extends PGTransformBase {
      constructor(orbits) {
        super(orbits);
      }
      mul(b) {
        return new PGTransform(this.internalMul(b));
      }
      mulScalar(n) {
        if (n === 0) {
          return this.e();
        }
        let t = this;
        if (n < 0) {
          t = t.inv();
          n = -n;
        }
        while ((n & 1) === 0) {
          t = t.mul(t);
          n >>= 1;
        }
        if (n === 1) {
          return t;
        }
        let s = t;
        let r = this.e();
        while (n > 0) {
          if (n & 1) {
            r = r.mul(s);
          }
          if (n > 1) {
            s = s.mul(s);
          }
          n >>= 1;
        }
        return r;
      }
      inv() {
        return new PGTransform(this.internalInv());
      }
      e() {
        return new PGTransform(
          this.orbits.map((_) => PGOrbit.e(_.perm.length, _.orimod))
        );
      }
    };
    VisibleState = class extends PGTransformBase {
      constructor(orbits) {
        super(orbits);
      }
      mul(b) {
        return new VisibleState(this.internalMul(b));
      }
    };
    DisjointUnion = class {
      constructor(n) {
        this.n = n;
        this.heads = new Array(n);
        for (let i = 0; i < n; i++) {
          this.heads[i] = i;
        }
      }
      find(v) {
        let h = this.heads[v];
        if (this.heads[h] === h) {
          return h;
        }
        h = this.find(this.heads[h]);
        this.heads[v] = h;
        return h;
      }
      union(a, b) {
        const ah = this.find(a);
        const bh = this.find(b);
        if (ah < bh) {
          this.heads[bh] = ah;
        } else if (ah > bh) {
          this.heads[ah] = bh;
        }
      }
    };
  }
});

// src/cubing/puzzle-geometry/PGPuzzles.ts
var PGPuzzles;
var init_PGPuzzles = __esm({
  "src/cubing/puzzle-geometry/PGPuzzles.ts"() {
    "use strict";
    PGPuzzles = {
      "2x2x2": "c f 0",
      "3x3x3": "c f 0.333333333333333",
      "4x4x4": "c f 0.5 f 0",
      "5x5x5": "c f 0.6 f 0.2",
      "6x6x6": "c f 0.666666666666667 f 0.333333333333333 f 0",
      "7x7x7": "c f 0.714285714285714 f 0.428571428571429 f 0.142857142857143",
      "8x8x8": "c f 0.75 f 0.5 f 0.25 f 0",
      "9x9x9": "c f 0.777777777777778 f 0.555555555555556 f 0.333333333333333 f 0.111111111111111",
      "10x10x10": "c f 0.8 f 0.6 f 0.4 f 0.2 f 0",
      "11x11x11": "c f 0.818181818181818 f 0.636363636363636 f 0.454545454545455 f 0.272727272727273 f 0.0909090909090909",
      "12x12x12": "c f 0.833333333333333 f 0.666666666666667 f 0.5 f 0.333333333333333 f 0.166666666666667 f 0",
      "13x13x13": "c f 0.846153846153846 f 0.692307692307692 f 0.538461538461538 f 0.384615384615385 f 0.230769230769231 f 0.0769230769230769",
      "20x20x20": "c f 0 f .1 f .2 f .3 f .4 f .5 f .6 f .7 f .8 f .9",
      "30x30x30": "c f 0 f .066667 f .133333 f .2 f .266667 f .333333 f .4 f .466667 f .533333 f .6 f .666667 f .733333 f .8 f .866667 f .933333",
      "40x40x40": "c f 0 f .05 f .1 f .15 f .2 f .25 f .3 f .35 f .4 f .45 f .5 f .55 f .6 f .65 f .7 f .75 f .8 f .85 f .9 f .95",
      skewb: "c v 0",
      "master skewb": "c v 0.275",
      "professor skewb": "c v 0 v 0.38",
      "compy cube": "c v 0.915641442663986",
      helicopter: "c e 0.707106781186547",
      "curvy copter": "c e 0.83",
      dino: "c v 0.577350269189626",
      "little chop": "c e 0",
      pyramorphix: "t e 0",
      mastermorphix: "t e 0.346184634065199",
      pyraminx: "t v 0.333333333333333 v 1.66666666666667",
      tetraminx: "t v 0.333333333333333",
      "master pyraminx": "t v 0 v 1 v 2",
      "master tetraminx": "t v 0 v 1",
      "professor pyraminx": "t v -0.2 v 0.6 v 1.4 v 2.2",
      "professor tetraminx": "t v -0.2 v 0.6 v 1.4",
      "Jing pyraminx": "t f 0",
      "master pyramorphix": "t e 0.866025403784437",
      megaminx: "d f 0.7",
      gigaminx: "d f 0.64 f 0.82",
      teraminx: "d f 0.64 f 0.76 f 0.88",
      petaminx: "d f 0.64 f 0.73 f 0.82 f 0.91",
      examinx: "d f 0.64 f 0.712 f 0.784 f 0.856 f 0.928",
      zetaminx: "d f 0.64 f 0.7 f 0.76 f 0.82 f 0.88 f 0.94",
      yottaminx: "d f 0.64 f 0.6914 f 0.7429 f 0.7943 f 0.8457 f 0.8971 f 0.9486",
      pentultimate: "d f 0",
      "master pentultimate": "d f 0.1",
      "elite pentultimate": "d f 0 f 0.145905",
      // exact value for starminx is sqrt(5(5-2 sqrt(5))/3)
      starminx: "d v 0.937962370425399",
      "starminx 2": "d f 0.23606797749979",
      "pyraminx crystal": "d f 0.447213595499989",
      chopasaurus: "d v 0",
      "big chop": "d e 0",
      "skewb diamond": "o f 0",
      FTO: "o f 0.333333333333333",
      "master FTO": "o f 0.5 f 0",
      "Christopher's jewel": "o v 0.577350269189626",
      octastar: "o e 0",
      "Trajber's octahedron": "o v 0.433012701892219",
      "radio chop": "i f 0",
      icosamate: "i v 0",
      "icosahedron 2": "i v 0.18759247376021",
      "icosahedron 3": "i v 0.18759247376021 e 0",
      "icosahedron static faces": "i v 0.84",
      "icosahedron moving faces": "i v 0.73",
      "Eitan's star": "i f 0.61803398874989",
      "2x2x2 + dino": "c f 0 v 0.577350269189626",
      "2x2x2 + little chop": "c f 0 e 0",
      "dino + little chop": "c v 0.577350269189626 e 0",
      "2x2x2 + dino + little chop": "c f 0 v 0.577350269189626 e 0",
      "megaminx + chopasaurus": "d f 0.61803398875 v 0",
      "starminx combo": "d f 0.23606797749979 v 0.937962370425399"
    };
  }
});

// src/cubing/puzzle-geometry/Quat.ts
function centermassface(face) {
  let s = new Quat(0, 0, 0, 0);
  for (let i = 0; i < face.length; i++) {
    s = s.sum(face[i]);
  }
  return s.smul(1 / face.length);
}
function solvethreeplanes(p1, p2, p3, planes) {
  const p = planes[p1].intersect3(planes[p2], planes[p3]);
  if (!p) {
    return p;
  }
  for (let i = 0; i < planes.length; i++) {
    if (i !== p1 && i !== p2 && i !== p3) {
      const dt = planes[i].b * p.b + planes[i].c * p.c + planes[i].d * p.d;
      if (planes[i].a > 0 && dt > planes[i].a || planes[i].a < 0 && dt < planes[i].a) {
        return false;
      }
    }
  }
  return p;
}
var eps, Quat;
var init_Quat = __esm({
  "src/cubing/puzzle-geometry/Quat.ts"() {
    "use strict";
    eps = 1e-9;
    Quat = class {
      constructor(a, b, c, d) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
      }
      mul(q) {
        return new Quat(
          this.a * q.a - this.b * q.b - this.c * q.c - this.d * q.d,
          this.a * q.b + this.b * q.a + this.c * q.d - this.d * q.c,
          this.a * q.c - this.b * q.d + this.c * q.a + this.d * q.b,
          this.a * q.d + this.b * q.c - this.c * q.b + this.d * q.a
        );
      }
      toString() {
        return `Q[${this.a},${this.b},${this.c},${this.d}]`;
      }
      dist(q) {
        return Math.hypot(this.a - q.a, this.b - q.b, this.c - q.c, this.d - q.d);
      }
      len() {
        return Math.hypot(this.a, this.b, this.c, this.d);
      }
      cross(q) {
        return new Quat(
          0,
          this.c * q.d - this.d * q.c,
          this.d * q.b - this.b * q.d,
          this.b * q.c - this.c * q.b
        );
      }
      dot(q) {
        return this.b * q.b + this.c * q.c + this.d * q.d;
      }
      normalize() {
        const d = Math.sqrt(this.dot(this));
        return new Quat(this.a / d, this.b / d, this.c / d, this.d / d);
      }
      makenormal() {
        return new Quat(0, this.b, this.c, this.d).normalize();
      }
      normalizeplane() {
        const d = Math.hypot(this.b, this.c, this.d);
        return new Quat(this.a / d, this.b / d, this.c / d, this.d / d);
      }
      smul(m) {
        return new Quat(this.a * m, this.b * m, this.c * m, this.d * m);
      }
      sum(q) {
        return new Quat(this.a + q.a, this.b + q.b, this.c + q.c, this.d + q.d);
      }
      sub(q) {
        return new Quat(this.a - q.a, this.b - q.b, this.c - q.c, this.d - q.d);
      }
      angle() {
        return 2 * Math.acos(this.a);
      }
      invrot() {
        return new Quat(this.a, -this.b, -this.c, -this.d);
      }
      det3x3(a00, a01, a02, a10, a11, a12, a20, a21, a22) {
        return a00 * (a11 * a22 - a12 * a21) + a01 * (a12 * a20 - a10 * a22) + a02 * (a10 * a21 - a11 * a20);
      }
      rotateplane(q) {
        const t = q.mul(new Quat(0, this.b, this.c, this.d)).mul(q.invrot());
        t.a = this.a;
        return t;
      }
      // return any vector orthogonal to the given one.  Find the smallest
      // component (in absolute value) and return the cross product of that
      // axis with the given vector.
      orthogonal() {
        const ab = Math.abs(this.b);
        const ac = Math.abs(this.c);
        const ad = Math.abs(this.d);
        if (ab < ac && ab < ad) {
          return this.cross(new Quat(0, 1, 0, 0)).normalize();
        } else if (ac < ab && ac < ad) {
          return this.cross(new Quat(0, 0, 1, 0)).normalize();
        } else {
          return this.cross(new Quat(0, 0, 0, 1)).normalize();
        }
      }
      // return the Quaternion that will rotate the this vector
      // to the b vector through rotatepoint.
      pointrotation(b) {
        const a = this.normalize();
        b = b.normalize();
        if (a.sub(b).len() < eps) {
          return new Quat(1, 0, 0, 0);
        }
        let h = a.sum(b);
        if (h.len() < eps) {
          h = h.orthogonal();
        } else {
          h = h.normalize();
        }
        const r = a.cross(h);
        r.a = a.dot(h);
        return r;
      }
      // given two vectors, return the portion of the first that
      // is not in the direction of the second.
      unproject(b) {
        return this.sum(b.smul(-this.dot(b) / (this.len() * b.len())));
      }
      rotatepoint(q) {
        return q.mul(this).mul(q.invrot());
      }
      rotateface(face) {
        return face.map((_) => _.rotatepoint(this));
      }
      intersect3(p2, p3) {
        const det = this.det3x3(
          this.b,
          this.c,
          this.d,
          p2.b,
          p2.c,
          p2.d,
          p3.b,
          p3.c,
          p3.d
        );
        if (Math.abs(det) < eps) {
          return false;
        }
        return new Quat(
          0,
          this.det3x3(this.a, this.c, this.d, p2.a, p2.c, p2.d, p3.a, p3.c, p3.d) / det,
          this.det3x3(this.b, this.a, this.d, p2.b, p2.a, p2.d, p3.b, p3.a, p3.d) / det,
          this.det3x3(this.b, this.c, this.a, p2.b, p2.c, p2.a, p3.b, p3.c, p3.a) / det
        );
      }
      side(x) {
        if (x > eps) {
          return 1;
        }
        if (x < -eps) {
          return -1;
        }
        return 0;
      }
      /**
       * Cuts a face by this plane, or returns null if there
       * is no intersection.
       * @param face The face to cut.
       */
      cutface(face) {
        const d = this.a;
        let seen = 0;
        let r = null;
        for (let i = 0; i < face.length; i++) {
          seen |= 1 << this.side(face[i].dot(this) - d) + 1;
        }
        if ((seen & 5) === 5) {
          r = [];
          const inout = face.map((_) => this.side(_.dot(this) - d));
          for (let s = -1; s <= 1; s += 2) {
            const nface = [];
            for (let k = 0; k < face.length; k++) {
              if (inout[k] === s || inout[k] === 0) {
                nface.push(face[k]);
              }
              const kk = (k + 1) % face.length;
              if (inout[k] + inout[kk] === 0 && inout[k] !== 0) {
                const vk = face[k].dot(this) - d;
                const vkk = face[kk].dot(this) - d;
                const r2 = vk / (vk - vkk);
                const pt = face[k].smul(1 - r2).sum(face[kk].smul(r2));
                nface.push(pt);
              }
            }
            r.push(nface);
          }
        }
        return r;
      }
      cutfaces(faces) {
        const nfaces = [];
        for (let j = 0; j < faces.length; j++) {
          const face = faces[j];
          const t = this.cutface(face);
          if (t) {
            nfaces.push(t[0]);
            nfaces.push(t[1]);
          } else {
            nfaces.push(face);
          }
        }
        return nfaces;
      }
      faceside(face) {
        const d = this.a;
        for (let i = 0; i < face.length; i++) {
          const s = this.side(face[i].dot(this) - d);
          if (s !== 0) {
            return s;
          }
        }
        throw new Error("Could not determine side of plane in faceside");
      }
      sameplane(p) {
        const a = this.normalize();
        const b = p.normalize();
        return a.dist(b) < eps || a.dist(b.smul(-1)) < eps;
      }
      makecut(r) {
        return new Quat(r, this.b, this.c, this.d);
      }
    };
  }
});

// src/cubing/puzzle-geometry/PlatonicGenerator.ts
function cube() {
  const s5 = Math.sqrt(0.5);
  return [new Quat(s5, s5, 0, 0), new Quat(s5, 0, s5, 0)];
}
function tetrahedron() {
  return [new Quat(0.5, 0.5, 0.5, 0.5), new Quat(0.5, 0.5, 0.5, -0.5)];
}
function dodecahedron() {
  const d36 = 2 * Math.PI / 10;
  let dx = 0.5 + 0.3 * Math.sqrt(5);
  let dy = 0.5 + 0.1 * Math.sqrt(5);
  const dd = Math.sqrt(dx * dx + dy * dy);
  dx /= dd;
  dy /= dd;
  return [
    new Quat(Math.cos(d36), dx * Math.sin(d36), dy * Math.sin(d36), 0),
    new Quat(0.5, 0.5, 0.5, 0.5)
  ];
}
function icosahedron() {
  let dx = 1 / 6 + Math.sqrt(5) / 6;
  let dy = 2 / 3 + Math.sqrt(5) / 3;
  const dd = Math.sqrt(dx * dx + dy * dy);
  dx /= dd;
  dy /= dd;
  const ang = 2 * Math.PI / 6;
  return [
    new Quat(Math.cos(ang), dx * Math.sin(ang), dy * Math.sin(ang), 0),
    new Quat(Math.cos(ang), -dx * Math.sin(ang), dy * Math.sin(ang), 0)
  ];
}
function octahedron() {
  const s5 = Math.sqrt(0.5);
  return [new Quat(0.5, 0.5, 0.5, 0.5), new Quat(s5, 0, 0, s5)];
}
function closure(g) {
  const q = [new Quat(1, 0, 0, 0)];
  for (let i = 0; i < q.length; i++) {
    for (let j = 0; j < g.length; j++) {
      const ns = g[j].mul(q[i]);
      const negns = ns.smul(-1);
      let wasseen = false;
      for (let k = 0; k < q.length; k++) {
        if (ns.dist(q[k]) < eps2 || negns.dist(q[k]) < eps2) {
          wasseen = true;
          break;
        }
      }
      if (!wasseen) {
        q.push(ns);
      }
    }
  }
  return q;
}
function uniqueplanes(p, g) {
  const planes = [];
  const planerot = [];
  for (let i = 0; i < g.length; i++) {
    const p2 = p.rotateplane(g[i]);
    let wasseen = false;
    for (let j = 0; j < planes.length; j++) {
      if (p2.dist(planes[j]) < eps2) {
        wasseen = true;
        break;
      }
    }
    if (!wasseen) {
      planes.push(p2);
      planerot.push(g[i]);
    }
  }
  return planerot;
}
function getface(planes) {
  const face = [];
  for (let i = 1; i < planes.length; i++) {
    for (let j = i + 1; j < planes.length; j++) {
      const p = solvethreeplanes(0, i, j, planes);
      if (p) {
        let wasseen = false;
        for (let k = 0; k < face.length; k++) {
          if (p.dist(face[k]) < eps2) {
            wasseen = true;
            break;
          }
        }
        if (!wasseen) {
          face.push(p);
        }
      }
    }
  }
  for (; ; ) {
    let changed = false;
    for (let i = 0; i < face.length; i++) {
      const j = (i + 1) % face.length;
      if (planes[0].dot(face[i].cross(face[j])) < 0) {
        const t = face[i];
        face[i] = face[j];
        face[j] = t;
        changed = true;
      }
    }
    if (!changed) {
      break;
    }
  }
  return face;
}
var eps2;
var init_PlatonicGenerator = __esm({
  "src/cubing/puzzle-geometry/PlatonicGenerator.ts"() {
    "use strict";
    init_Quat();
    eps2 = 1e-9;
  }
});

// src/cubing/puzzle-geometry/SchreierSims.ts
function schreierSims(g, disp) {
  const n = g[0].p.length;
  const e = identity(n);
  let sgs = [];
  let sgsi = [];
  let sgslen = [];
  let Tk = [];
  let Tklen = [];
  function resolve(p) {
    for (let i = p.p.length - 1; i >= 0; i--) {
      const j = p.p[i];
      if (j !== i) {
        if (!sgs[i][j]) {
          return false;
        }
        p = p.mul(sgsi[i][j]);
      }
    }
    return true;
  }
  function knutha(k, p, len) {
    Tk[k].push(p);
    Tklen[k].push(len);
    for (let i = 0; i < sgs[k].length; i++) {
      if (sgs[k][i]) {
        knuthb(k, sgs[k][i].mul(p), len + sgslen[k][i]);
      }
    }
  }
  function knuthb(k, p, len) {
    const j = p.p[k];
    if (!sgs[k][j]) {
      sgs[k][j] = p;
      sgsi[k][j] = p.inv();
      sgslen[k][j] = len;
      for (let i = 0; i < Tk[k].length; i++) {
        knuthb(k, p.mul(Tk[k][i]), len + Tklen[k][i]);
      }
      return;
    }
    const p2 = p.mul(sgsi[k][j]);
    if (!resolve(p2)) {
      knutha(k - 1, p2, len + sgslen[k][j]);
    }
  }
  function getsgs() {
    sgs = [];
    sgsi = [];
    Tk = [];
    sgslen = [];
    Tklen = [];
    for (let i = 0; i < n; i++) {
      sgs.push([]);
      sgsi.push([]);
      sgslen.push([]);
      Tk.push([]);
      Tklen.push([]);
      sgs[i][i] = e;
      sgsi[i][i] = e;
      sgslen[i][i] = 0;
    }
    let none = 0;
    let sz = BigInt(1);
    for (let i = 0; i < g.length; i++) {
      knutha(n - 1, g[i], 1);
      sz = BigInt(1);
      let tks = 0;
      let sollen = 0;
      const avgs = [];
      const mults = new FactoredNumber();
      for (let j = 0; j < n; j++) {
        let cnt = 0;
        let lensum = 0;
        for (let k = 0; k < n; k++) {
          if (sgs[j][k]) {
            cnt++;
            lensum += sgslen[j][k];
            if (j !== k) {
              none++;
            }
          }
        }
        tks += Tk[j].length;
        sz *= BigInt(cnt);
        if (cnt > 1) {
          mults.multiply(cnt);
        }
        const avg = lensum / cnt;
        avgs.push(avg);
        sollen += avg;
      }
      disp(
        `${i}: sz ${sz} T ${tks} sol ${sollen} none ${none} mults ${mults.toString()}`
      );
    }
    return sz;
  }
  return getsgs();
}
var FactoredNumber;
var init_SchreierSims = __esm({
  "src/cubing/puzzle-geometry/SchreierSims.ts"() {
    "use strict";
    init_Perm();
    FactoredNumber = class {
      constructor() {
        this.mult = [];
      }
      multiply(n) {
        for (let f = 2; f * f <= n; f++) {
          while (n % f === 0) {
            if (void 0 !== this.mult[f]) {
              this.mult[f]++;
            } else {
              this.mult[f] = 1;
            }
            n /= f;
          }
        }
        if (n > 1) {
          if (void 0 !== this.mult[n]) {
            this.mult[n]++;
          } else {
            this.mult[n] = 1;
          }
        }
      }
      toString() {
        let r = "";
        for (let i = 0; i < this.mult.length; i++) {
          if (void 0 !== this.mult[i]) {
            if (r !== "") {
              r += "*";
            }
            r += i;
            if (this.mult[i] > 1) {
              r += `^${this.mult[i]}`;
            }
          }
        }
        return r;
      }
    };
  }
});

// src/cubing/puzzle-geometry/PuzzleGeometry.ts
function tstart(s) {
  return s;
}
function tend(_) {
}
function expandfaces(rots, faces) {
  const nfaces = [];
  for (const rot of rots) {
    for (const face of faces) {
      nfaces.push(face.rotate(rot));
    }
  }
  return nfaces;
}
function defaultnets() {
  return {
    // four faces: tetrahedron
    4: [["F", "D", "L", "R"]],
    // six faces: cube
    6: [
      ["F", "D", "L", "U", "R"],
      ["R", "F", "", "B", ""]
    ],
    // eight faces: octahedron
    8: [
      ["F", "D", "L", "R"],
      ["D", "F", "BR", ""],
      ["BR", "D", "", "BB"],
      ["BB", "BR", "U", "BL"]
    ],
    // twelve faces:  dodecahedron; U/F/R/F/BL/BR from megaminx
    12: [
      ["U", "FF", "", "", "", ""],
      ["FF", "U", "R", "FR", "FL", "L"],
      ["R", "FF", "", "", "DR", ""],
      ["DR", "R", "", "BB", "", ""],
      ["BB", "DR", "BR", "BL", "DL", "DD"]
    ],
    // twenty faces: icosahedron
    20: [
      ["R", "C", "F", "E"],
      ["F", "R", "L", "U"],
      ["L", "F", "A", ""],
      ["E", "R", "G", "I"],
      ["I", "E", "S", "H"],
      ["S", "I", "J", "B"],
      ["B", "S", "K", "D"],
      ["K", "B", "M", "O"],
      ["O", "K", "P", "N"],
      ["P", "O", "Q", ""]
    ]
  };
}
function defaultcolors() {
  return {
    // the colors should use the same naming convention as the nets, above.
    4: {
      F: "#56b4e9" /* Green */,
      D: "#ffffff" /* Yellow */,
      L: "#d55e00" /* Red */,
      R: "#009e73" /* Blue */
    },
    6: {
      U: "#f0e442" /* White */,
      F: "#56b4e9" /* Green */,
      R: "#d55e00" /* Red */,
      D: "#ffffff" /* Yellow */,
      B: "#009e73" /* Blue */,
      L: "#cc79a7" /* Orange */
    },
    8: {
      U: "#f0e442" /* White */,
      F: "#d55e00" /* Red */,
      R: "#56b4e9" /* Green */,
      D: "#ffffff" /* Yellow */,
      BB: "#009e73" /* Blue */,
      L: "#8800dd" /* Purple */,
      BL: "#cc79a7" /* Orange */,
      BR: "#aaaaaa" /* Gray */
    },
    12: {
      U: "#f0e442" /* White */,
      FF: "#008800" /* DarkGreen */,
      R: "#d55e00" /* Red */,
      FR: "#ffffd0" /* Cream */,
      FL: "#3399ff" /* Aqua */,
      L: "#8800dd" /* Purple */,
      DR: "#ff66cc" /* Pink */,
      BB: "#99ff00" /* Lime */,
      BR: "#0000ff" /* DarkBlue */,
      BL: "#ffffff" /* Yellow */,
      DL: "#cc79a7" /* Orange */,
      DD: "#aaaaaa" /* Gray */
    },
    20: {
      R: "#db69f0",
      C: "#178fde",
      F: "#23238b",
      E: "#9cc726",
      L: "#2c212d",
      U: "#177fa7",
      A: "#e0de7f",
      G: "#2b57c0",
      I: "#41126b",
      S: "#4b8c28",
      H: "#7c098d",
      J: "#7fe7b4",
      B: "#85fb74",
      K: "#3f4bc3",
      D: "#0ff555",
      M: "#f1c2c8",
      O: "#58d340",
      P: "#c514f2",
      N: "#14494e",
      Q: "#8b1be1"
    }
  };
}
function defaultOrientations() {
  return {
    4: [
      ["FLR", [0, 1, 0]],
      ["F", [0, 0, 1]]
    ],
    // FLR towards viewer
    6: [
      ["U", [0, 1, 0]],
      ["F", [0, 0, 1]]
    ],
    // URF towards viewer
    8: [
      ["U", [0, 1, 0]],
      ["F", [0, 0, 1]]
    ],
    // FLUR towards viewer
    12: [
      ["U", [0, 1, 0]],
      ["FF", [0, 0, 1]]
    ],
    // F towards viewer
    20: [
      ["GUQMJ", [0, 1, 0]],
      ["F", [0, 0, 1]]
    ]
    // F towards viewer
  };
}
function findelement(a, p) {
  for (let i = 0; i < a.length; i++) {
    if (a[i][0].dist(p) < eps3) {
      return i;
    }
  }
  throw new Error("Element not found");
}
function getPG3DNamedPuzzles() {
  return PGPuzzles;
}
function getPuzzleDescriptionString(puzzleName2) {
  return PGPuzzles[puzzleName2];
}
function parsePuzzleDescription(s) {
  const a = s.split(/ /).filter(Boolean);
  if (a.length % 2 === 0) {
    return null;
  }
  const shape = a[0];
  if (shape !== "o" && shape !== "c" && shape !== "i" && shape !== "d" && shape !== "t") {
    return null;
  }
  const cuts = [];
  for (let i = 1; i < a.length; i += 2) {
    if (a[i] !== "f" && a[i] !== "v" && a[i] !== "e") {
      return null;
    }
    cuts.push({
      cutType: a[i],
      distance: parseFloat(a[i + 1])
    });
  }
  return { shape, cuts };
}
function getPuzzleGeometryByDesc(desc, options = {}) {
  const parsed = parsePuzzleDescription(desc);
  if (parsed === null) {
    throw new Error("Could not parse the puzzle description");
  }
  const pg = new PuzzleGeometry(
    parsed,
    Object.assign({}, { allMoves: true }, options)
  );
  pg.allstickers();
  pg.genperms();
  return pg;
}
function getPuzzleGeometryByName(puzzleName2, options) {
  return getPuzzleGeometryByDesc(PGPuzzles[puzzleName2], options);
}
function getmovename(geo, bits, slices) {
  let inverted = false;
  if (slices - bits[1] < bits[0]) {
    geo = [geo[2], geo[3], geo[0], geo[1]];
    bits = [slices - bits[1], slices - bits[0]];
    inverted = true;
  }
  let movenameFamily = geo[0];
  let movenamePrefix = "";
  if (bits[0] === 0 && bits[1] === slices) {
    movenameFamily = `${movenameFamily}v`;
  } else if (bits[0] === bits[1]) {
    if (bits[1] > 0) {
      movenamePrefix = String(bits[1] + 1);
    }
  } else if (bits[0] === 0) {
    movenameFamily = movenameFamily.toLowerCase();
    if (bits[1] > 1) {
      movenamePrefix = String(bits[1] + 1);
    }
  } else {
    throw new Error(
      `We only support slice and outer block moves right now. ${bits}`
    );
  }
  return [movenamePrefix + movenameFamily, inverted];
}
function splitByFaceNames(s, facenames) {
  const r = [];
  let at = 0;
  while (at < s.length) {
    if (at > 0 && at < s.length && s[at] === "_") {
      at++;
    }
    let currentMatch = "";
    for (const facename of facenames) {
      if (s.substr(at).startsWith(facename[1]) && facename[1].length > currentMatch.length) {
        currentMatch = facename[1];
      }
    }
    if (currentMatch !== "") {
      r.push(currentMatch);
      at += currentMatch.length;
    } else {
      throw new Error(`Could not split ${s} into face names.`);
    }
  }
  return r;
}
function toCoords(q, maxdist) {
  return [q.b / maxdist, -q.c / maxdist, q.d / maxdist];
}
function toFaceCoords(q, maxdist) {
  const r = [];
  const n = q.length;
  for (let i = 0; i < n; i++) {
    const pt = toCoords(q.get(n - i - 1), maxdist);
    r[3 * i] = pt[0];
    r[3 * i + 1] = pt[1];
    r[3 * i + 2] = pt[2];
  }
  return r;
}
var Face, FaceTree, eps3, copyright, permissivieMoveParsing, orientationDefaults, PUZZLE_BASE_SHAPES, PUZZLE_CUT_TYPES, PuzzleGeometry, PGNotation;
var init_PuzzleGeometry = __esm({
  "src/cubing/puzzle-geometry/PuzzleGeometry.ts"() {
    "use strict";
    init_alg();
    init_FaceNameSwizzler();
    init_notation_mapping();
    init_Options();
    init_Perm();
    init_PermOriSet();
    init_PGPuzzles();
    init_PlatonicGenerator();
    init_Quat();
    init_SchreierSims();
    Face = class {
      constructor(q) {
        this.coords = new Array(q.length * 3);
        for (let i = 0; i < q.length; i++) {
          this.coords[3 * i] = q[i].b;
          this.coords[3 * i + 1] = q[i].c;
          this.coords[3 * i + 2] = q[i].d;
        }
        this.length = q.length;
      }
      get(off) {
        return new Quat(
          0,
          this.coords[3 * off],
          this.coords[3 * off + 1],
          this.coords[3 * off + 2]
        );
      }
      centermass() {
        let sx = 0;
        let sy = 0;
        let sz = 0;
        for (let i = 0; i < this.length; i++) {
          sx += this.coords[3 * i];
          sy += this.coords[3 * i + 1];
          sz += this.coords[3 * i + 2];
        }
        return new Quat(0, sx / this.length, sy / this.length, sz / this.length);
      }
      rotate(q) {
        const a = [];
        for (let i = 0; i < this.length; i++) {
          a.push(this.get(i).rotatepoint(q));
        }
        return new Face(a);
      }
      rotateforward() {
        const a = [];
        for (let i = 1; i < this.length; i++) {
          a.push(this.get(i));
        }
        a.push(this.get(0));
        return new Face(a);
      }
    };
    FaceTree = class {
      constructor(face, left, right) {
        this.face = face;
        this.left = left;
        this.right = right;
      }
      split(q) {
        const t = q.cutface(this.face);
        if (t !== null) {
          if (this.left === void 0) {
            this.left = new FaceTree(t[0]);
            this.right = new FaceTree(t[1]);
          } else {
            this.left = this.left?.split(q);
            this.right = this.right?.split(q);
          }
        }
        return this;
      }
      collect(arr, leftfirst) {
        if (this.left === void 0) {
          arr.push(new Face(this.face));
        } else if (leftfirst) {
          this.left?.collect(arr, false);
          this.right?.collect(arr, true);
        } else {
          this.right?.collect(arr, false);
          this.left?.collect(arr, true);
        }
        return arr;
      }
    };
    eps3 = 1e-9;
    copyright = "PuzzleGeometry 0.1 Copyright 2018 Tomas Rokicki.";
    permissivieMoveParsing = false;
    orientationDefaults = {
      4: {
        v: ["DFR", "DLF", "DRL", "FLR"],
        e: ["FR", "LF", "DF", "DL", "RD", "RL"],
        c: ["DF", "FD", "RL", "LR"]
      },
      6: {
        v: ["URF", "UBR", "ULB", "UFL", "DFR", "DRB", "DBL", "DLF"],
        e: ["UF", "UR", "UB", "UL", "DF", "DR", "DB", "DL", "FR", "FL", "BR", "BL"],
        c: ["UB", "LU", "FU", "RU", "BU", "DF"]
      },
      8: {
        v: ["UBBBRR", "URFL", "ULBLBB", "DBRBBBL", "DBLLF", "DFRBR"],
        e: [
          "UL",
          "UBB",
          "UR",
          "BRD",
          "BLD",
          "FD",
          "BRR",
          "FR",
          "FL",
          "BLL",
          "BLBB",
          "BRBB"
        ],
        c: ["BBU", "LU", "RU", "BRD", "FD", "BLD", "DF", "UBB"]
      },
      12: {
        v: [
          "URFF",
          "UFFL",
          "ULBL",
          "UBLBR",
          "UBRR",
          "DDDRBB",
          "DDBBDL",
          "DDDLFL",
          "DDFLFR",
          "DDFRDR",
          "LFLDL",
          "FLLFF",
          "FFFRFL",
          "FRFFR",
          "RDRFR",
          "DRRBR",
          "BRBBDR",
          "BBBRBL",
          "BLDLBB",
          "DLBLL"
        ],
        e: [
          "UFF",
          "UR",
          "UBR",
          "UBL",
          "UL",
          "DRR",
          "DRBR",
          "DRBB",
          "DRDD",
          "DRFR",
          "DLBB",
          "DLBL",
          "DLL",
          "DLFL",
          "DLDD",
          "FLFR",
          "FRFF",
          "FFFL",
          "BBBR",
          "BRBL",
          "BLBB",
          "FRDD",
          "FLDD",
          "FLL",
          "FFL",
          "FFR",
          "FRR",
          "BBDD",
          "BRR",
          "BLL"
        ],
        c: [
          "UFF",
          "FFU",
          "DDBB",
          "BBDD",
          "FLDD",
          "FRDD",
          "BRU",
          "BLU",
          "LFL",
          "RFL",
          "DRBR",
          "DLBL"
        ]
      },
      20: {
        v: [
          "FLPQU",
          "FUGER",
          "FRCAL",
          "HCREI",
          "ISBDH",
          "JSIEG",
          "BSJMK",
          "MQPOK",
          "ONDBK",
          "NOPLA",
          "UQMJG",
          "DNACH"
        ],
        e: [
          "FU",
          "FL",
          "FR",
          "EG",
          "ER",
          "EI",
          "SJ",
          "SI",
          "SB",
          "KM",
          "KB",
          "KO",
          "PQ",
          "PO",
          "PL",
          "UG",
          "JG",
          "MQ",
          "UQ",
          "HC",
          "HD",
          "ND",
          "NA",
          "JM",
          "CA",
          "AL",
          "CR",
          "HI",
          "DB",
          "NO"
        ],
        c: [
          "FU",
          "UF",
          "GE",
          "EG",
          "JS",
          "SJ",
          "MK",
          "KM",
          "QP",
          "PQ",
          "LA",
          "AL",
          "RC",
          "CR",
          "IH",
          "HI",
          "BD",
          "DB",
          "ON",
          "NO"
        ]
      }
    };
    PUZZLE_BASE_SHAPES = ["c", "t", "o", "d", "i"];
    PUZZLE_CUT_TYPES = ["f", "v", "e"];
    PuzzleGeometry = class {
      constructor(puzzleDescription, options) {
        this.puzzleDescription = puzzleDescription;
        // cubies in each cubie set
        this.cmovesbyslice = [];
        // parsed move list
        this.duplicatedFaces = [];
        // which faces are duplicated
        this.duplicatedCubies = [];
        // which cubies are duplicated
        this.fixedCubie = -1;
        // fixed cubie, if any
        this.net = [];
        this.colors = [];
        this.notationMapper = new NullMapper();
        this.addNotationMapper = "";
        this.setReidOrder = false;
        const t1 = tstart("genperms");
        this.options = new PuzzleGeometryFullOptions(options);
        if (this.options.verbosity > 0) {
          console.log(this.header("# "));
        }
        this.create(puzzleDescription);
        tend(t1);
      }
      create(puzzleDescription) {
        const { shape, cuts } = puzzleDescription;
        this.moveplanes = [];
        this.moveplanes2 = [];
        this.faces = [];
        this.cubies = [];
        let g = null;
        switch (shape) {
          case "c": {
            g = cube();
            break;
          }
          case "o": {
            g = octahedron();
            break;
          }
          case "i": {
            g = icosahedron();
            break;
          }
          case "t": {
            g = tetrahedron();
            break;
          }
          case "d": {
            g = dodecahedron();
            break;
          }
          default:
            throw new Error(`Bad shape argument: ${shape}`);
        }
        this.rotations = closure(g);
        if (this.options.verbosity) {
          console.log(`# Rotations: ${this.rotations.length}`);
        }
        const baseplane = g[0];
        this.baseplanerot = uniqueplanes(baseplane, this.rotations);
        const baseplanes = this.baseplanerot.map((_) => baseplane.rotateplane(_));
        this.baseplanes = baseplanes;
        this.baseFaceCount = baseplanes.length;
        const net = defaultnets()[baseplanes.length];
        this.net = net;
        this.colors = defaultcolors()[baseplanes.length];
        if (this.options.verbosity > 0) {
          console.log(`# Base planes: ${baseplanes.length}`);
        }
        const baseface = getface(baseplanes);
        const zero = new Quat(0, 0, 0, 0);
        if (this.options.verbosity > 0) {
          console.log(`# Face vertices: ${baseface.length}`);
        }
        const facenormal = baseplanes[0].makenormal();
        const edgenormal = baseface[0].sum(baseface[1]).makenormal();
        const vertexnormal = baseface[0].makenormal();
        const boundary = new Quat(1, facenormal.b, facenormal.c, facenormal.d);
        if (this.options.verbosity > 0) {
          console.log(`# Boundary is ${boundary}`);
        }
        const planerot = uniqueplanes(boundary, this.rotations);
        const planes = planerot.map((_) => boundary.rotateplane(_));
        const firstface = getface(planes);
        this.edgedistance = firstface[0].sum(firstface[1]).smul(0.5).dist(zero);
        this.vertexdistance = firstface[0].dist(zero);
        const cutplanes = [];
        const intersects = [];
        let sawface = false;
        let sawedge = false;
        let sawvertex = false;
        for (const cut of cuts) {
          let normal = null;
          let distance = 0;
          switch (cut.cutType) {
            case "f": {
              normal = facenormal;
              distance = 1;
              sawface = true;
              break;
            }
            case "v": {
              normal = vertexnormal;
              distance = this.vertexdistance;
              sawvertex = true;
              break;
            }
            case "e": {
              normal = edgenormal;
              distance = this.edgedistance;
              sawedge = true;
              break;
            }
            default:
              throw new Error(`Bad cut argument: ${cut.cutType}`);
          }
          cutplanes.push(normal.makecut(cut.distance));
          intersects.push(cut.distance < distance);
        }
        if (this.options.addRotations) {
          if (!sawface) {
            cutplanes.push(facenormal.makecut(10));
          }
          if (!sawvertex) {
            cutplanes.push(vertexnormal.makecut(10));
          }
          if (!sawedge) {
            cutplanes.push(edgenormal.makecut(10));
          }
        }
        this.basefaces = [];
        for (const baseplanerot of this.baseplanerot) {
          const face = baseplanerot.rotateface(firstface);
          this.basefaces.push(new Face(face));
        }
        const facenames = [];
        const faceplanes = [];
        const vertexnames = [];
        const edgenames = [];
        const edgesperface = firstface.length;
        function searchaddelement(a, p, name) {
          for (const el of a) {
            if (el[0].dist(p) < eps3) {
              el.push(name);
              return;
            }
          }
          a.push([p, name]);
        }
        for (let i = 0; i < this.baseplanerot.length; i++) {
          const face = this.baseplanerot[i].rotateface(firstface);
          for (let j = 0; j < face.length; j++) {
            const jj = (j + 1) % face.length;
            const midpoint = face[j].sum(face[jj]).smul(0.5);
            searchaddelement(edgenames, midpoint, i);
          }
        }
        const otherfaces = [];
        for (let i = 0; i < this.baseplanerot.length; i++) {
          const face = this.baseplanerot[i].rotateface(firstface);
          const facelist = [];
          for (let j = 0; j < face.length; j++) {
            const jj = (j + 1) % face.length;
            const midpoint = face[j].sum(face[jj]).smul(0.5);
            const el = edgenames[findelement(edgenames, midpoint)];
            if (i === el[1]) {
              facelist.push(el[2]);
            } else if (i === el[2]) {
              facelist.push(el[1]);
            } else {
              throw new Error("Could not find edge");
            }
          }
          otherfaces.push(facelist);
        }
        const facenametoindex = {};
        const faceindextoname = [];
        faceindextoname.push(net[0][0]);
        facenametoindex[net[0][0]] = 0;
        faceindextoname[otherfaces[0][0]] = net[0][1];
        facenametoindex[net[0][1]] = otherfaces[0][0];
        for (const neti of net) {
          const f0 = neti[0];
          const fi = facenametoindex[f0];
          if (fi === void 0) {
            throw new Error("Bad edge description; first edge not connected");
          }
          let ii = -1;
          for (let j = 0; j < otherfaces[fi].length; j++) {
            const fn2 = faceindextoname[otherfaces[fi][j]];
            if (fn2 !== void 0 && fn2 === neti[1]) {
              ii = j;
              break;
            }
          }
          if (ii < 0) {
            throw new Error("First element of a net not known");
          }
          for (let j = 2; j < neti.length; j++) {
            if (neti[j] === "") {
              continue;
            }
            const of = otherfaces[fi][(j + ii - 1) % edgesperface];
            const fn2 = faceindextoname[of];
            if (fn2 !== void 0 && fn2 !== neti[j]) {
              throw new Error("Face mismatch in net");
            }
            faceindextoname[of] = neti[j];
            facenametoindex[neti[j]] = of;
          }
        }
        for (let i = 0; i < this.baseplanerot.length; i++) {
          const face = this.baseplanerot[i].rotateface(firstface);
          const faceplane = boundary.rotateplane(this.baseplanerot[i]);
          const facename = faceindextoname[i];
          facenames.push([face, facename]);
          faceplanes.push([faceplane, facename]);
        }
        for (let i = 0; i < this.baseplanerot.length; i++) {
          const face = this.baseplanerot[i].rotateface(firstface);
          const facename = faceindextoname[i];
          for (let j = 0; j < face.length; j++) {
            const jj = (j + 1) % face.length;
            const midpoint = face[j].sum(face[jj]).smul(0.5);
            const jjj = (j + 2) % face.length;
            const midpoint2 = face[jj].sum(face[jjj]).smul(0.5);
            const e1 = findelement(edgenames, midpoint);
            const e2 = findelement(edgenames, midpoint2);
            searchaddelement(vertexnames, face[jj], [facename, e2, e1]);
          }
        }
        this.swizzler = new FaceNameSwizzler(facenames.map((_) => _[1]));
        const sep = this.swizzler.prefixFree ? "" : "_";
        const oridata = orientationDefaults[this.baseFaceCount];
        const markedface = [];
        for (let i = 0; i < this.baseFaceCount; i++) {
          markedface[1 << i] = i;
        }
        {
          const oriprefs = oridata["v"];
          for (const name of oriprefs) {
            const fn = this.swizzler.splitByFaceNames(name);
            let bits = 0;
            for (const i of fn) {
              bits |= 1 << i;
            }
            markedface[bits] = fn[0];
          }
        }
        {
          const oriprefs = oridata["e"];
          for (const name of oriprefs) {
            const fn = this.swizzler.splitByFaceNames(name);
            let bits = 0;
            for (const i of fn) {
              bits |= 1 << i;
            }
            markedface[bits] = fn[0];
          }
        }
        {
          const oriprefs = oridata["c"];
          for (const name of oriprefs) {
            const fn = this.swizzler.splitByFaceNames(name);
            const bits = 1 << fn[0] | 1 << this.baseFaceCount;
            markedface[bits] = fn[1];
          }
        }
        for (let i = 0; i < edgenames.length; i++) {
          if (edgenames[i].length !== 3) {
            throw new Error(`Bad length in edge names ${edgenames[i]}`);
          }
          const f1 = edgenames[i][1];
          const f2 = edgenames[i][2];
          let c1 = faceindextoname[f1];
          const c2 = faceindextoname[f2];
          const bits = 1 << f1 | 1 << f2;
          if (markedface[bits] === f1) {
            c1 = c1 + sep + c2;
          } else {
            c1 = c2 + sep + c1;
          }
          edgenames[i] = [edgenames[i][0], c1];
        }
        for (let i = 0; i < vertexnames.length; i++) {
          let bits = 0;
          if (vertexnames[i].length < 4) {
            throw new Error("Bad length in vertex names");
          }
          for (let j = 1; j < vertexnames[i].length; j++) {
            bits |= 1 << facenametoindex[vertexnames[i][j][0]];
          }
          const fi = markedface[bits];
          let st = -1;
          for (let j = 1; j < vertexnames[i].length; j++) {
            if (fi === facenametoindex[vertexnames[i][j][0]]) {
              st = j;
            }
          }
          if (st < 0) {
            throw new Error(
              "Internal error; couldn't find face name when fixing corners"
            );
          }
          let r = "";
          for (let j = 1; j < vertexnames[i].length; j++) {
            if (j === 1) {
              r = vertexnames[i][st][0];
            } else {
              r = r + sep + vertexnames[i][st][0];
            }
            for (let k = 1; k < vertexnames[i].length; k++) {
              if (vertexnames[i][st][1] === vertexnames[i][k][2]) {
                st = k;
                break;
              }
            }
          }
          vertexnames[i] = [vertexnames[i][0], r];
        }
        this.markedface = markedface;
        if (this.options.verbosity > 1) {
          console.log(`# Face names: ${facenames.map((_) => _[1]).join(" ")}`);
          console.log(`# Edge names: ${edgenames.map((_) => _[1]).join(" ")}`);
          console.log(`# Vertex names: ${vertexnames.map((_) => _[1]).join(" ")}`);
        }
        const geonormals = [];
        for (const faceplane of faceplanes) {
          geonormals.push([faceplane[0].makenormal(), faceplane[1], "f"]);
        }
        for (const edgename of edgenames) {
          geonormals.push([edgename[0].makenormal(), edgename[1], "e"]);
        }
        for (const vertexname of vertexnames) {
          geonormals.push([vertexname[0].makenormal(), vertexname[1], "v"]);
        }
        this.facenames = facenames;
        this.faceplanes = faceplanes;
        this.edgenames = edgenames;
        this.vertexnames = vertexnames;
        this.geonormals = geonormals;
        const geonormalnames = geonormals.map((_) => _[1]);
        this.swizzler.setGripNames(geonormalnames);
        if (this.options.verbosity > 0) {
          console.log(
            `# Distances: face ${1} edge ${this.edgedistance} vertex ${this.vertexdistance}`
          );
        }
        for (let c = 0; c < cutplanes.length; c++) {
          for (const rotation of this.rotations) {
            const q = cutplanes[c].rotateplane(rotation);
            let wasseen = false;
            for (const moveplane of this.moveplanes) {
              if (q.sameplane(moveplane)) {
                wasseen = true;
                break;
              }
            }
            if (!wasseen) {
              this.moveplanes.push(q);
              if (intersects[c]) {
                this.moveplanes2.push(q);
              }
            }
          }
        }
        let ft = new FaceTree(firstface);
        const tar = this.moveplanes2.slice();
        let rval = 31;
        for (let i = 0; i < tar.length; i++) {
          const j = i + Math.floor((tar.length - i) * (rval / 65536));
          ft = ft.split(tar[j]);
          tar[j] = tar[i];
          rval = (rval * 1657 + 101) % 65536;
        }
        const faces = ft.collect([], true);
        this.faces = faces;
        if (this.options.verbosity > 0) {
          console.log(`# Faces is now ${faces.length}`);
        }
        this.stickersperface = faces.length;
        const simplerot = [];
        const cm = centermassface(firstface);
        for (const rotation of this.rotations) {
          const f = rotation.rotateface(firstface);
          if (cm.dist(centermassface(f)) < eps3) {
            simplerot.push(rotation);
          }
        }
        const finished = new Array(faces.length);
        const sortme = [];
        for (let i = 0; i < faces.length; i++) {
          const cm2 = faces[i].centermass();
          sortme.push([cm.dist(cm2), cm2, i]);
        }
        sortme.sort((a, b) => a[0] - b[0]);
        for (let ii = 0; ii < faces.length; ii++) {
          const i = sortme[ii][2];
          if (!finished[i]) {
            finished[i] = true;
            for (const rot of simplerot) {
              const f2 = faces[i].rotate(rot);
              const cm2 = f2.centermass();
              for (let kk = ii + 1; kk < faces.length; kk++) {
                if (sortme[kk][0] - sortme[ii][0] > eps3) {
                  break;
                }
                const k = sortme[kk][2];
                if (!finished[k] && cm2.dist(sortme[kk][1]) < eps3) {
                  finished[k] = true;
                  faces[k] = f2;
                  break;
                }
              }
            }
          }
        }
        this.shortedge = 1e99;
        for (const face of faces) {
          for (let j = 0; j < face.length; j++) {
            const k = (j + 1) % face.length;
            const t = face.get(j).dist(face.get(k));
            if (t < this.shortedge) {
              this.shortedge = t;
            }
          }
        }
        if (this.options.verbosity > 0) {
          console.log(`# Short edge is ${this.shortedge}`);
        }
        if (shape === "c" && sawface && !sawedge && !sawvertex) {
          this.addNotationMapper = "NxNxNCubeMapper";
          this.setReidOrder = true;
        }
        if (shape === "c" && sawvertex && !sawface && !sawedge) {
          this.addNotationMapper = "SkewbMapper";
        }
        if (shape === "t" && (sawvertex || sawface) && !sawedge) {
          this.addNotationMapper = "PyraminxOrTetraminxMapper";
        }
        if (shape === "o" && sawface) {
          this.notationMapper = new FaceRenamingMapper(
            this.swizzler,
            new FaceNameSwizzler(["F", "D", "L", "BL", "R", "U", "BR", "B"])
          );
          if (!(sawedge || sawvertex)) {
            this.addNotationMapper = "FTOMapper";
          }
        }
        if (shape === "d" && sawface) {
          this.addNotationMapper = "MegaminxMapper";
          this.notationMapper = new FaceRenamingMapper(
            this.swizzler,
            new FaceNameSwizzler([
              "U",
              "F",
              "L",
              "BL",
              "BR",
              "R",
              "FR",
              "FL",
              "DL",
              "B",
              "DR",
              "D"
            ])
          );
        }
      }
      keyface(face) {
        return this.keyface2(face.centermass());
      }
      keyface2(cm) {
        let s = "";
        const sfcc = String.fromCharCode;
        for (const moveplaneset of this.moveplanesets) {
          if (moveplaneset.length > 0) {
            const dv = cm.dot(moveplaneset[0]);
            let t = 0;
            let b = 1;
            while (b * 2 <= moveplaneset.length) {
              b *= 2;
            }
            for (; b > 0; b >>= 1) {
              if (t + b <= moveplaneset.length && dv > moveplaneset[t + b - 1].a) {
                t += b;
              }
            }
            if (t < 47) {
              s = s + sfcc(33 + t);
            } else if (t < 47 + 47 * 47) {
              s = s + sfcc(33 + 47 + Math.floor(t / 47) - 1) + sfcc(33 + t % 47);
            } else if (t < 47 + 47 * 47 + 47 * 47 * 47) {
              s = s + sfcc(33 + 47 + Math.floor((t - 47) / (47 * 47) - 1)) + sfcc(33 + 47 + Math.floor((t - 47) / 47) % 47) + sfcc(33 + t % 47);
            } else {
              throw Error("Too many slices for cubie encoding");
            }
          }
        }
        return s;
      }
      // same as above, but instead of returning an encoded string, return
      // an array with offsets.
      keyface3(face) {
        const cm = face.centermass();
        const r = [];
        for (const moveplaneset of this.moveplanesets) {
          if (moveplaneset.length > 0) {
            const dv = cm.dot(moveplaneset[0]);
            let t = 0;
            let b = 1;
            while (b * 2 <= moveplaneset.length) {
              b *= 2;
            }
            for (; b > 0; b >>= 1) {
              if (t + b <= moveplaneset.length && dv > moveplaneset[t + b - 1].a) {
                t += b;
              }
            }
            r.push(t);
          }
        }
        return r;
      }
      findface(cm) {
        const key = this.keyface2(cm);
        const arr = this.facelisthash.get(key);
        if (arr.length === 1) {
          return arr[0];
        }
        for (let i = 0; i + 1 < arr.length; i++) {
          const face2 = this.facelisthash.get(key)[i];
          if (Math.abs(cm.dist(this.facecentermass[face2])) < eps3) {
            return face2;
          }
        }
        return arr[arr.length - 1];
      }
      project2d(facen, edgen, targvec) {
        const face = this.facenames[facen][0];
        const edgen2 = (edgen + 1) % face.length;
        const plane = this.baseplanes[facen];
        let x0 = face[edgen2].sub(face[edgen]);
        const olen = x0.len();
        x0 = x0.normalize();
        const y0 = x0.cross(plane).normalize();
        let delta = targvec[1].sub(targvec[0]);
        const len = delta.len() / olen;
        delta = delta.normalize();
        const cosr = delta.b;
        const sinr = delta.c;
        const x1 = x0.smul(cosr).sub(y0.smul(sinr)).smul(len);
        const y1 = y0.smul(cosr).sum(x0.smul(sinr)).smul(len);
        const off = new Quat(
          0,
          targvec[0].b - x1.dot(face[edgen]),
          targvec[0].c - y1.dot(face[edgen]),
          0
        );
        return [x1, y1, off];
      }
      allstickers() {
        const t1 = tstart("allstickers");
        this.faces = expandfaces(this.baseplanerot, this.faces);
        if (this.options.verbosity > 0) {
          console.log(`# Total stickers is now ${this.faces.length}`);
        }
        this.facecentermass = new Array(this.faces.length);
        for (let i = 0; i < this.faces.length; i++) {
          this.facecentermass[i] = this.faces[i].centermass();
        }
        const moveplanesets = [];
        const moveplanenormals = [];
        for (const q of this.moveplanes) {
          const qnormal = q.makenormal();
          let wasseen = false;
          for (const moveplanenormal of moveplanenormals) {
            if (qnormal.sameplane(moveplanenormal.makenormal())) {
              wasseen = true;
            }
          }
          if (!wasseen) {
            moveplanenormals.push(qnormal);
            moveplanesets.push([]);
          }
        }
        for (const q of this.moveplanes2) {
          const qnormal = q.makenormal();
          for (let j = 0; j < moveplanenormals.length; j++) {
            if (qnormal.sameplane(moveplanenormals[j])) {
              moveplanesets[j].push(q);
              break;
            }
          }
        }
        for (let i = 0; i < moveplanesets.length; i++) {
          const q = moveplanesets[i].map((_) => _.normalizeplane());
          const goodnormal = moveplanenormals[i];
          for (let j = 0; j < q.length; j++) {
            if (q[j].makenormal().dist(goodnormal) > eps3) {
              q[j] = q[j].smul(-1);
            }
          }
          q.sort((a, b) => a.a - b.a);
          moveplanesets[i] = q;
        }
        this.moveplanesets = moveplanesets;
        this.moveplanenormals = moveplanenormals;
        const sizes = moveplanesets.map((_) => _.length);
        if (this.options.verbosity > 0) {
          console.log(`# Move plane sets: ${sizes}`);
        }
        const moverotations = [];
        for (let i = 0; i < moveplanesets.length; i++) {
          moverotations.push([]);
        }
        for (const q of this.rotations) {
          if (Math.abs(Math.abs(q.a) - 1) < eps3) {
            continue;
          }
          const qnormal = q.makenormal();
          for (let j = 0; j < moveplanesets.length; j++) {
            if (qnormal.sameplane(moveplanenormals[j])) {
              moverotations[j].push(q);
              break;
            }
          }
        }
        this.moverotations = moverotations;
        for (let i = 0; i < moverotations.length; i++) {
          const r = moverotations[i];
          const goodnormal = r[0].makenormal();
          for (let j = 0; j < r.length; j++) {
            if (goodnormal.dist(r[j].makenormal()) > eps3) {
              r[j] = r[j].smul(-1);
            }
          }
          r.sort((a, b) => a.angle() - b.angle());
          if (moverotations[i][0].dot(moveplanenormals[i]) < 0) {
            r.reverse();
          }
        }
        const sizes2 = moverotations.map((_) => 1 + _.length);
        this.movesetorders = sizes2;
        const movesetgeos = [];
        let gtype = "?";
        for (let i = 0; i < moveplanesets.length; i++) {
          const p0 = moveplanenormals[i];
          let neg = null;
          let pos = null;
          for (const geonormal of this.geonormals) {
            const d = p0.dot(geonormal[0]);
            if (Math.abs(d - 1) < eps3) {
              pos = [geonormal[1], geonormal[2]];
              gtype = geonormal[2];
            } else if (Math.abs(d + 1) < eps3) {
              neg = [geonormal[1], geonormal[2]];
              gtype = geonormal[2];
            }
          }
          if (pos === null || neg === null) {
            throw new Error("Saw positive or negative sides as null");
          }
          movesetgeos.push([
            pos[0],
            pos[1],
            neg[0],
            neg[1],
            1 + moveplanesets[i].length
          ]);
          if (this.addNotationMapper === "NxNxNCubeMapper" && gtype === "f") {
            this.notationMapper = new NxNxNCubeMapper(1 + moveplanesets[i].length);
            this.addNotationMapper = "";
          }
          if (this.addNotationMapper === "SkewbMapper" && moveplanesets[0].length === 1) {
            this.notationMapper = new SkewbNotationMapper(this.swizzler);
            this.addNotationMapper = "";
          }
          if (this.addNotationMapper === "PyraminxOrTetraminxMapper") {
            if (moveplanesets[0].length === 2 && moveplanesets[0][0].a === 0.333333333333333 && moveplanesets[0][1].a === 1.66666666666667) {
              this.notationMapper = new PyraminxNotationMapper(this.swizzler);
              this.addNotationMapper = "";
            } else {
              this.notationMapper = new TetraminxNotationMapper(this.swizzler);
              this.addNotationMapper = "";
            }
          }
          if (this.addNotationMapper === "MegaminxMapper" && gtype === "f") {
            if (1 + moveplanesets[i].length === 3) {
              this.notationMapper = new MegaminxScramblingNotationMapper(
                this.notationMapper
              );
            }
            this.addNotationMapper = "";
          }
          if (this.addNotationMapper === "FTOMapper" && gtype === "f") {
            if (1 + moveplanesets[i].length === 3) {
              this.notationMapper = new FTONotationMapper(
                this.notationMapper,
                this.swizzler
              );
            }
            this.addNotationMapper = "";
          }
        }
        this.movesetgeos = movesetgeos;
        const facelisthash = /* @__PURE__ */ new Map();
        const faces = this.faces;
        for (let i = 0; i < faces.length; i++) {
          const face = faces[i];
          const s = this.keyface(face);
          if (!facelisthash.get(s)) {
            facelisthash.set(s, [i]);
          } else {
            const arr = facelisthash.get(s);
            arr.push(i);
            if (arr.length === this.baseFaceCount) {
              if (this.options.verbosity > 0) {
                console.log("# Splitting core.");
              }
              for (let suff = 0; suff < arr.length; suff++) {
                const s2 = `${s} ${suff}`;
                facelisthash.set(s2, [arr[suff]]);
              }
            }
          }
        }
        this.facelisthash = facelisthash;
        if (this.options.verbosity > 0) {
          console.log(`# Cubies: ${facelisthash.size}`);
        }
        const cubies = [];
        const facetocubie = [];
        const facetoord = [];
        for (const facelist of facelisthash.values()) {
          if (facelist.length === this.baseFaceCount) {
            continue;
          }
          if (facelist.length > 1) {
            const cm = facelist.map((_) => faces[_].centermass());
            const cmall = centermassface(cm);
            for (let looplimit = 0; facelist.length > 2; looplimit++) {
              let changed = false;
              for (let i = 0; i < facelist.length; i++) {
                const j = (i + 1) % facelist.length;
                if (cmall.dot(cm[i].cross(cm[j])) < 0) {
                  const u = cm[i];
                  cm[i] = cm[j];
                  cm[j] = u;
                  const v = facelist[i];
                  facelist[i] = facelist[j];
                  facelist[j] = v;
                  changed = true;
                }
              }
              if (!changed) {
                break;
              }
              if (looplimit > 1e3) {
                throw new Error("Bad epsilon math; too close to border");
              }
            }
            let bits = 0;
            for (const f of facelist) {
              bits |= 1 << Math.floor(f / this.stickersperface);
            }
            const markedface = this.markedface[bits];
            let mini = -1;
            for (let i = 0; i < facelist.length; i++) {
              if (Math.floor(facelist[i] / this.stickersperface) === markedface) {
                mini = i;
              }
            }
            if (mini < 0) {
              throw new Error("Could not find marked face in list");
            }
            if (mini !== 0) {
              const ofacelist = facelist.slice();
              for (let i = 0; i < facelist.length; i++) {
                facelist[i] = ofacelist[(mini + i) % facelist.length];
              }
            }
          }
          for (let j = 0; j < facelist.length; j++) {
            const k = facelist[j];
            facetocubie[k] = cubies.length;
            facetoord[k] = j;
          }
          cubies.push(facelist);
        }
        this.cubies = cubies;
        this.facetocubie = facetocubie;
        this.facetoord = facetoord;
        const typenames = ["?", "CENTERS", "EDGES", "CORNERS", "C4RNER", "C5RNER"];
        const cubiesetnames = [];
        const cubietypecounts = [0, 0, 0, 0, 0, 0];
        const orbitoris = [];
        const seen = [];
        let cubiesetnum = 0;
        const cubiesetnums = [];
        const cubieordnums = [];
        const cubieords = [];
        const cubievaluemap = [];
        const getcolorkey = (cubienum) => {
          return cubies[cubienum].map((_) => this.getfaceindex(_)).join(" ");
        };
        const cubiesetcubies = [];
        for (let i = 0; i < cubies.length; i++) {
          const cubie = cubies[i];
          if (cubie.length === 0) {
            continue;
          }
          if (seen[i]) {
            continue;
          }
          const cubiekeymap = {};
          let cubievalueid = 0;
          cubieords.push(0);
          cubiesetcubies.push([]);
          const facecnt = cubie.length;
          const typectr = cubietypecounts[facecnt]++;
          let typename = typenames[facecnt];
          if (typename === void 0 || facecnt === this.baseFaceCount) {
            typename = "CORE";
          }
          typename = typename + (typectr === 0 ? "" : typectr + 1);
          cubiesetnames[cubiesetnum] = typename;
          orbitoris[cubiesetnum] = facecnt;
          const queue = [i];
          let qg = 0;
          seen[i] = true;
          while (qg < queue.length) {
            const cind = queue[qg++];
            const cubiecolorkey = getcolorkey(cind);
            if (cubie.length > 1 || cubiekeymap[cubiecolorkey] === void 0) {
              cubiekeymap[cubiecolorkey] = cubievalueid++;
            }
            cubievaluemap[cind] = cubiekeymap[cubiecolorkey];
            cubiesetnums[cind] = cubiesetnum;
            cubiesetcubies[cubiesetnum].push(cind);
            cubieordnums[cind] = cubieords[cubiesetnum]++;
            if (queue.length < this.rotations.length) {
              const cm = this.facecentermass[cubies[cind][0]];
              for (const moverotation of moverotations) {
                const tq = this.facetocubie[this.findface(cm.rotatepoint(moverotation[0]))];
                if (!seen[tq]) {
                  queue.push(tq);
                  seen[tq] = true;
                }
              }
            }
          }
          cubiesetnum++;
        }
        if (this.setReidOrder && 4 <= this.stickersperface && this.stickersperface <= 9) {
          const reidorder = [
            [
              "UF",
              "UR",
              "UB",
              "UL",
              "DF",
              "DR",
              "DB",
              "DL",
              "FR",
              "FL",
              "BR",
              "BL"
            ],
            ["UFR", "URB", "UBL", "ULF", "DRF", "DFL", "DLB", "DBR"],
            ["U", "L", "F", "R", "B", "D"]
          ];
          const reidmap = {};
          for (const cubie of reidorder) {
            for (let j = 0; j < cubie.length; j++) {
              let mask = 0;
              for (let k = 0; k < cubie[j].length; k++) {
                mask |= 1 << cubie[j].charCodeAt(k) - 65;
              }
              reidmap[mask] = j;
            }
          }
          for (const cubieset of cubiesetcubies) {
            for (const cubienum of cubieset) {
              let mask = 0;
              for (const cubie of cubies[cubienum]) {
                mask |= 1 << this.facenames[this.getfaceindex(cubie)][1].charCodeAt(0) - 65;
              }
              cubieordnums[cubienum] = reidmap[mask];
            }
          }
        }
        this.cubiesetnums = cubiesetnums;
        this.cubieordnums = cubieordnums;
        this.cubiesetnames = cubiesetnames;
        this.cubieords = cubieords;
        this.orbitoris = orbitoris;
        this.cubievaluemap = cubievaluemap;
        this.cubiesetcubies = cubiesetcubies;
        if (this.options.fixedPieceType !== null) {
          for (let i = 0; i < cubies.length; i++) {
            if (this.options.fixedPieceType === "v" && cubies[i].length > 2 || this.options.fixedPieceType === "e" && cubies[i].length === 2 || this.options.fixedPieceType === "f" && cubies[i].length === 1) {
              this.fixedCubie = i;
              break;
            }
          }
          if (this.fixedCubie < 0) {
            throw new Error(
              `Could not find a cubie of type ${this.options.fixedPieceType} to fix.`
            );
          }
        }
        if (this.options.verbosity > 0) {
          console.log(`# Cubie orbit sizes ${cubieords}`);
        }
        tend(t1);
      }
      unswizzle(mv) {
        const newmv = this.notationMapper.notationToInternal(mv);
        if (newmv === null) {
          return null;
        }
        return newmv.modified({ family: this.swizzler.unswizzle(newmv.family) });
      }
      // We use an extremely permissive parse here; any character but
      // digits are allowed in a family name.
      stringToBlockMove(mv) {
        const re = RegExp("^(([0-9]+)-)?([0-9]+)?([^0-9]+)([0-9]+'?)?$");
        const p = mv.match(re);
        if (p === null) {
          throw new Error(`Bad move passed ${mv}`);
        }
        const grip = p[4];
        let loslice = void 0;
        let hislice = void 0;
        if (p[2] !== void 0) {
          if (p[3] === void 0) {
            throw new Error("Missing second number in range");
          }
          loslice = parseInt(p[2], 10);
        }
        if (p[3] !== void 0) {
          hislice = parseInt(p[3], 10);
        }
        let amountstr = "1";
        let amount = 1;
        if (p[5] !== void 0) {
          amountstr = p[5];
          if (amountstr[0] === "'") {
            amountstr = `-${amountstr.substring(1)}`;
          }
          amount = parseInt(amountstr, 10);
        }
        return new Move(new QuantumMove(grip, hislice, loslice), amount);
      }
      parseMove(move) {
        const bm = this.notationMapper.notationToInternal(move);
        if (bm === null) {
          throw new Error(`Bad move ${move.family}`);
        }
        move = bm;
        let grip = move.family;
        let fullrotation = false;
        if (grip.endsWith("v") && grip[0] <= "Z") {
          if (move.innerLayer !== void 0 || move.outerLayer !== void 0) {
            throw new Error("Cannot use a prefix with full cube rotations");
          }
          grip = grip.slice(0, -1);
          fullrotation = true;
        }
        if (grip.endsWith("w") && grip[0] <= "Z") {
          grip = grip.slice(0, -1).toLowerCase();
        }
        let geo;
        let msi = -1;
        const geoname = this.swizzler.unswizzle(grip);
        let firstgrip = false;
        for (let i = 0; i < this.movesetgeos.length; i++) {
          const g = this.movesetgeos[i];
          if (geoname === g[0]) {
            firstgrip = true;
            geo = g;
            msi = i;
          }
          if (geoname === g[2]) {
            firstgrip = false;
            geo = g;
            msi = i;
          }
        }
        let loslice = 1;
        let hislice = 1;
        if (grip.toUpperCase() !== grip) {
          hislice = 2;
        }
        if (geo === void 0) {
          throw new Error(`Bad grip in move ${move.family}`);
        }
        if (move.outerLayer !== void 0) {
          loslice = move.outerLayer;
        }
        if (move.innerLayer !== void 0) {
          if (move.outerLayer === void 0) {
            hislice = move.innerLayer;
            if (grip <= "Z") {
              loslice = hislice;
            } else {
              loslice = 1;
            }
          } else {
            hislice = move.innerLayer;
          }
        }
        loslice--;
        hislice--;
        if (fullrotation) {
          loslice = 0;
          hislice = this.moveplanesets[msi].length;
        }
        if (loslice < 0 || loslice > this.moveplanesets[msi].length || hislice < 0 || hislice > this.moveplanesets[msi].length) {
          throw new Error(
            `Bad slice spec ${loslice} ${hislice} vs ${this.moveplanesets[msi].length}`
          );
        }
        if (!permissivieMoveParsing && loslice === 0 && hislice === this.moveplanesets[msi].length && !fullrotation) {
          throw new Error(
            "! full puzzle rotations must be specified with v suffix."
          );
        }
        return [void 0, msi, loslice, hislice, firstgrip, move.amount];
      }
      parsemove(mv) {
        const r = this.parseMove(this.stringToBlockMove(mv));
        r[0] = mv;
        return r;
      }
      genperms() {
        const t1 = tstart("genperms");
        if (this.cmovesbyslice.length > 0) {
          return;
        }
        const cmovesbyslice = [];
        if (this.options.orientCenters) {
          for (let k = 0; k < this.cubies.length; k++) {
            if (this.cubies[k].length === 1) {
              const kk = this.cubies[k][0];
              const i = this.getfaceindex(kk);
              const center = this.basefaces[i].centermass();
              if (center.dist(this.facecentermass[kk]) < eps3) {
                const bits = 1 << i | 1 << this.baseFaceCount;
                const towards = this.markedface[bits];
                const normal = this.baseplanes[towards].makenormal();
                let hiv = -1;
                let hii = -1;
                for (let ii = 0; ii < this.faces[kk].length; ii++) {
                  const pt = this.faces[kk].get(ii);
                  const t = normal.dot(pt.sub(center));
                  if (t > hiv) {
                    hiv = t;
                    hii = ii;
                  }
                }
                const hii2 = (hii + 1) % this.faces[kk].length;
                if (Math.abs(normal.dot(this.faces[kk].get(hii2).sub(center)) - hiv) < eps3) {
                  hii = hii2;
                }
                if (hii !== 0) {
                  const qs = [];
                  for (let ii = 0; ii < this.faces[kk].length; ii++) {
                    qs.push(this.faces[kk].get((ii + hii) % this.faces[kk].length));
                  }
                  this.faces[kk] = new Face(qs);
                }
                const o = this.basefaces[i].length;
                for (let m = 1; m < o; m++) {
                  this.cubies[k].push(this.cubies[k][m - 1]);
                }
                this.duplicatedFaces[kk] = o;
                this.duplicatedCubies[k] = o;
                this.orbitoris[this.cubiesetnums[k]] = o;
              }
            }
          }
        }
        for (let k = 0; k < this.moveplanesets.length; k++) {
          const moveplaneset = this.moveplanesets[k];
          const slicenum = [];
          const slicecnts = [moveplaneset.length + 1, 0];
          let bhi = 1;
          while (bhi * 2 <= moveplaneset.length) {
            bhi *= 2;
          }
          for (let i = 0; i < this.faces.length; i++) {
            let t = 0;
            if (moveplaneset.length > 0) {
              const dv = this.facecentermass[i].dot(moveplaneset[0]);
              for (let b = bhi; b > 0; b >>= 1) {
                if (t + b <= moveplaneset.length && dv > moveplaneset[t + b - 1].a) {
                  t += b;
                }
              }
              t = moveplaneset.length - t;
            }
            slicenum.push(t);
            while (slicecnts.length <= t) {
              slicecnts.push(0);
            }
            slicecnts[t]++;
          }
          const axiscmoves = new Array(slicecnts.length);
          for (let sc = 0; sc < slicecnts.length; sc++) {
            axiscmoves[sc] = [];
          }
          const cubiedone = [];
          for (let i = 0; i < this.faces.length; i++) {
            if (slicenum[i] < 0) {
              continue;
            }
            const b = [this.facetocubie[i], this.facetoord[i]];
            let cm = this.facecentermass[i];
            const ocm = cm;
            let fi2 = i;
            const sc = slicenum[fi2];
            for (; ; ) {
              slicenum[fi2] = -1;
              const cm2 = cm.rotatepoint(this.moverotations[k][0]);
              if (cm2.dist(ocm) < eps3) {
                break;
              }
              fi2 = this.findface(cm2);
              b.push(this.facetocubie[fi2], this.facetoord[fi2]);
              cm = cm2;
            }
            if (b.length > 2 && this.options.orientCenters && (this.cubies[b[0]].length === 1 || this.duplicatedCubies[b[0]] > 1)) {
              if (this.facecentermass[i].dist(
                this.basefaces[this.getfaceindex(i)].centermass()
              ) < eps3) {
                let face1 = this.faces[this.cubies[b[0]][0]];
                for (let ii = 0; ii < b.length; ii += 2) {
                  const face0 = this.faces[this.cubies[b[ii]][0]];
                  let o = -1;
                  for (let jj = 0; jj < face1.length; jj++) {
                    if (face0.get(jj).dist(face1.get(0)) < eps3) {
                      o = jj;
                      break;
                    }
                  }
                  if (o < 0) {
                    throw new Error(
                      "Couldn't find rotation of center faces; ignoring for now."
                    );
                  } else {
                    b[ii + 1] = o;
                    face1 = face1.rotate(this.moverotations[k][0]);
                  }
                }
              }
            }
            if (b.length === 2 && this.options.orientCenters) {
              for (let ii = 1; ii < this.movesetorders[k]; ii++) {
                if (sc === 0) {
                  b.push(b[0], ii);
                } else {
                  b.push(
                    b[0],
                    (this.movesetorders[k] - ii) % this.movesetorders[k]
                  );
                }
              }
            }
            if (b.length > 2 && !cubiedone[b[0]]) {
              if (b.length !== 2 * this.movesetorders[k]) {
                throw new Error("Bad length in perm gen");
              }
              for (const v of b) {
                axiscmoves[sc].push(v);
              }
            }
            for (let j = 0; j < b.length; j += 2) {
              cubiedone[b[j]] = true;
            }
          }
          for (let kk = 0; kk < axiscmoves.length; kk++) {
            axiscmoves[kk] = axiscmoves[kk].slice();
          }
          cmovesbyslice.push(axiscmoves);
        }
        this.cmovesbyslice = cmovesbyslice;
        if (this.options.moveList) {
          const parsedmovelist = [];
          for (const moveString of this.options.moveList) {
            parsedmovelist.push(this.parsemove(moveString));
          }
          this.parsedmovelist = parsedmovelist;
        }
        this.facelisthash.clear();
        this.facecentermass = [];
        tend(t1);
      }
      getboundarygeometry() {
        return {
          baseplanes: this.baseplanes,
          facenames: this.facenames,
          faceplanes: this.faceplanes,
          vertexnames: this.vertexnames,
          edgenames: this.edgenames,
          geonormals: this.geonormals
        };
      }
      getmovesets(k) {
        const slices = this.moveplanesets[k].length;
        let r = [];
        if (this.parsedmovelist !== void 0) {
          for (const parsedmove of this.parsedmovelist) {
            if (parsedmove[1] !== k) {
              continue;
            }
            if (parsedmove[4]) {
              r.push([parsedmove[2], parsedmove[3]]);
            } else {
              r.push([slices - parsedmove[3], slices - parsedmove[2]]);
            }
            r.push(parsedmove[5]);
          }
        } else if (this.options.vertexMoves && !this.options.allMoves) {
          const msg = this.movesetgeos[k];
          if (msg[1] !== msg[3]) {
            for (let i = 0; i < slices; i++) {
              if (msg[1] !== "v") {
                if (this.options.outerBlockMoves) {
                  r.push([i + 1, slices]);
                } else {
                  r.push([i + 1]);
                }
                r.push(1);
              } else {
                if (this.options.outerBlockMoves) {
                  r.push([0, i]);
                } else {
                  r.push([i, i]);
                }
                r.push(1);
              }
            }
          }
        } else {
          for (let i = 0; i <= slices; i++) {
            if (!this.options.allMoves && i + i === slices) {
              continue;
            }
            if (this.options.outerBlockMoves) {
              if (i + i > slices) {
                r.push([i, slices]);
              } else {
                r.push([0, i]);
              }
            } else {
              r.push([i, i]);
            }
            r.push(1);
          }
        }
        if (this.fixedCubie >= 0) {
          const dep = this.keyface3(this.faces[this.cubies[this.fixedCubie][0]])[k];
          const newr = [];
          for (let i = 0; i < r.length; i += 2) {
            let o = r[i];
            if (dep >= o[0] && dep <= o[1]) {
              if (o[0] === 0) {
                o = [o[1] + 1, slices];
              } else if (slices === o[1]) {
                o = [0, o[0] - 1];
              } else {
                throw Error("fixed cubie option would disconnect move");
              }
            }
            let found = false;
            for (let j = 0; j < newr.length; j += 2) {
              if (newr[j][0] === o[0] && newr[j][1] === o[1] && newr[j + 1] === r[i + 1]) {
                found = true;
                break;
              }
            }
            if (!found) {
              newr.push(o);
              newr.push(r[i + 1]);
            }
          }
          r = newr;
        }
        return r;
      }
      graybyori(cubie) {
        let ori = this.cubies[cubie].length;
        if (this.duplicatedCubies[cubie]) {
          ori = 1;
        }
        return ori === 1 && (this.options.grayCenters || !this.options.includeCenterOrbits) || ori === 2 && (this.options.grayEdges || !this.options.includeEdgeOrbits) || ori > 2 && (this.options.grayCorners || !this.options.includeCornerOrbits);
      }
      skipbyori(cubie) {
        let ori = this.cubies[cubie].length;
        if (this.duplicatedCubies[cubie]) {
          ori = 1;
        }
        return ori === 1 && !this.options.includeCenterOrbits || ori === 2 && !this.options.includeEdgeOrbits || ori > 2 && !this.options.includeCornerOrbits;
      }
      skipcubie(fi) {
        return this.skipbyori(fi);
      }
      header(comment) {
        return comment + copyright + "\n" + comment + "\n";
      }
      writegap() {
        const os = this.getOrbitsDef(false);
        const r = [];
        const mvs = [];
        for (let i = 0; i < os.moveops.length; i++) {
          let movename = `M_${externalName(this.notationMapper, os.movenames[i])}`;
          let doinv = false;
          if (movename[movename.length - 1] === "'") {
            movename = movename.substring(0, movename.length - 1);
            doinv = true;
          }
          mvs.push(movename);
          if (doinv) {
            r.push(`${movename}:=${os.moveops[i].toPerm().inv().toGap()};`);
          } else {
            r.push(`${movename}:=${os.moveops[i].toPerm().toGap()};`);
          }
        }
        r.push("Gen:=[");
        r.push(mvs.join(","));
        r.push("];");
        const ip = os.solved.identicalPieces();
        r.push(
          `ip:=[${ip.map((_) => `[${_.map((__) => __ + 1).join(",")}]`).join(",")}];`
        );
        r.push("# Size(Group(Gen));");
        r.push("# Size(Stabilizer(Group(Gen), ip, OnTuplesSets));");
        r.push("");
        return this.header("# ") + r.join("\n");
      }
      writeksolve(name = "PuzzleGeometryPuzzle") {
        const od = this.getOrbitsDef(false);
        return this.header("# ") + od.toKsolve(name, this.notationMapper).join("\n");
      }
      getKPuzzleDefinition(fortwisty = true, includemoves = true) {
        const od = this.getOrbitsDef(fortwisty, includemoves);
        const internalDefinition = od.toKPuzzleDefinition(includemoves);
        internalDefinition.experimentalPuzzleDescription = this.puzzleDescription;
        if (!internalDefinition) {
          throw new Error("Missing definition!");
        }
        return internalDefinition;
      }
      getMoveFromBits(moverange, amount, inverted, axiscmoves, setmoves, movesetorder) {
        const moveorbits = [];
        const perms = [];
        const oris = [];
        for (const len of this.cubieords) {
          perms.push(iota(len));
          oris.push(zeros(len));
        }
        for (let m = moverange[0]; m <= moverange[1]; m++) {
          const slicecmoves = axiscmoves[m];
          for (let j = 0; j < slicecmoves.length; j += 2 * movesetorder) {
            const mperm = slicecmoves.slice(j, j + 2 * movesetorder);
            const setnum = this.cubiesetnums[mperm[0]];
            for (let ii = 0; ii < mperm.length; ii += 2) {
              mperm[ii] = this.cubieordnums[mperm[ii]];
            }
            let inc = 2;
            let oinc = 3;
            if (inverted) {
              inc = mperm.length - 2;
              oinc = mperm.length - 1;
            }
            if (perms[setnum] === iota(this.cubieords[setnum])) {
              perms[setnum] = perms[setnum].slice();
              if (this.orbitoris[setnum] > 1 && !this.options.fixedOrientation) {
                oris[setnum] = oris[setnum].slice();
              }
            }
            for (let ii = 0; ii < mperm.length; ii += 2) {
              perms[setnum][mperm[(ii + inc) % mperm.length]] = mperm[ii];
              if (this.orbitoris[setnum] > 1 && !this.options.fixedOrientation) {
                oris[setnum][mperm[ii]] = (mperm[(ii + oinc) % mperm.length] - mperm[(ii + 1) % mperm.length] + 2 * this.orbitoris[setnum]) % this.orbitoris[setnum];
              }
            }
          }
        }
        let lastId = new PGOrbit(iota(24), zeros(24), 1);
        for (let ii = 0; ii < this.cubiesetnames.length; ii++) {
          if (setmoves && !setmoves[ii]) {
            continue;
          }
          if (this.orbitoris[ii] === 1 || this.options.fixedOrientation) {
            if (perms[ii] === iota(lastId.perm.length)) {
              if (perms[ii] !== lastId.perm) {
                lastId = new PGOrbit(perms[ii], oris[ii], 1);
              }
              moveorbits.push(lastId);
            } else {
              moveorbits.push(new PGOrbit(perms[ii], oris[ii], 1));
            }
          } else {
            const no = new Array(oris[ii].length);
            for (let jj = 0; jj < perms[ii].length; jj++) {
              no[jj] = oris[ii][perms[ii][jj]];
            }
            moveorbits.push(new PGOrbit(perms[ii], no, this.orbitoris[ii]));
          }
        }
        let mv = new PGTransform(moveorbits);
        if (amount !== 1) {
          mv = mv.mulScalar(amount);
        }
        return mv;
      }
      omitSet(name) {
        for (const excludedSet of this.options.excludeOrbits) {
          if (excludedSet === name) {
            return true;
          }
        }
        return false;
      }
      diffmvsets(a, b, slices, neg) {
        for (let i = 0; i < a.length; i += 2) {
          let found = false;
          for (let j = 0; !found && j < b.length; j += 2) {
            if (neg) {
              if (a[i][0] + b[j][1] === slices && a[i][1] + b[j][0] === slices && a[i + 1] === b[j + 1]) {
                found = true;
              }
            } else {
              if (a[i][0] === b[j][0] && a[i][1] === b[j][1] && a[i + 1] === b[j + 1]) {
                found = true;
              }
            }
          }
          if (!found) {
            return true;
          }
        }
        return false;
      }
      // TODO: This is only public for testing; can we make it private again?
      getOrbitsDef(fortwisty, includemoves = true) {
        const setmoves = [];
        if (fortwisty) {
          for (let i = 0; i < this.cubiesetnames.length; i++) {
            setmoves.push(1);
          }
        }
        const setnames = [];
        const setdefs = [];
        const mps = [];
        const addrot = [];
        for (let k = 0; k < this.moveplanesets.length; k++) {
          const moveset = this.getmovesets(k);
          mps.push(moveset);
          if (this.options.addRotations) {
            addrot.push(1);
          } else {
            addrot.push(0);
          }
        }
        const hasrotation = [];
        for (let k = 0; k < this.moveplanesets.length; k++) {
          const slices = this.moveplanesets[k].length;
          let sawone = false;
          const moveset = mps[k];
          for (let i = 0; i < moveset.length; i += 2) {
            if (moveset[i][0] === 0 && moveset[i][1] === slices) {
              sawone = true;
            }
          }
          hasrotation[k] = sawone;
        }
        if (this.options.addRotations && (this.options.moveList || this.options.fixedPieceType !== null)) {
          for (let i = 0; i < this.moverotations.length; i++) {
            addrot[i] = 0;
          }
          for (let k = 0; k < this.moveplanesets.length; k++) {
            if (hasrotation[k]) {
              addrot[k] = 3;
              continue;
            }
            for (let i = 0; i < this.moverotations.length; i++) {
              let nn = this.moveplanenormals[k];
              for (let ii = 1; ii * 2 <= this.movesetorders[i]; ii++) {
                nn = nn.rotatepoint(this.moverotations[i][0]);
                if (addrot[i] & ii) {
                  continue;
                }
                let found = -1;
                let neg = false;
                for (let j = 0; j < this.moveplanenormals.length; j++) {
                  if (nn.dist(this.moveplanenormals[j]) < eps3) {
                    found = j;
                    break;
                  } else if (nn.dist(this.moveplanenormals[j].smul(-1)) < eps3) {
                    found = j;
                    neg = true;
                    break;
                  }
                }
                if (found < 0) {
                  throw new Error("Could not find rotation");
                }
                const cmp = mps[found];
                if (cmp.length !== mps[k].length || this.moveplanesets[k].length !== this.moveplanesets[found].length || this.diffmvsets(
                  cmp,
                  mps[k],
                  this.moveplanesets[found].length,
                  neg
                )) {
                  addrot[i] |= ii;
                }
              }
            }
          }
          for (let i = 0; i < this.moverotations.length; i++) {
            if (addrot[i] === 0) {
              addrot[i] = 1;
            } else if (addrot[i] === 1) {
              if (this.movesetorders[i] > 3) {
                addrot[i] = 2;
              } else {
                addrot[i] = 0;
              }
            } else if (addrot[i] === 3) {
              addrot[i] = 0;
            } else {
              throw new Error("Impossible addrot val");
            }
          }
        }
        for (let k = 0; k < this.moveplanesets.length; k++) {
          if (addrot[k] !== 0 && !hasrotation[k]) {
            mps[k].push([0, this.moveplanesets[k].length]);
            mps[k].push(addrot[k]);
          }
        }
        for (let k = 0; k < this.moveplanesets.length; k++) {
          const moveset = mps[k];
          const movesetorder = this.movesetorders[k];
          for (let i = 0; i < moveset.length; i += 2) {
            for (let j = 0; j < i; j += 2) {
              if (moveset[i][0] === moveset[j][0] && moveset[i][1] === moveset[j][1]) {
                throw new Error("Redundant moves in moveset.");
              }
            }
          }
          const allbits = [];
          for (let i = 0; i < moveset.length; i += 2) {
            for (let j = moveset[i][0]; j <= moveset[i][1]; j++) {
              allbits[j] = 1;
            }
          }
          const axiscmoves = this.cmovesbyslice[k];
          for (let i = 0; i < axiscmoves.length; i++) {
            if (allbits[i] !== 1) {
              continue;
            }
            const slicecmoves = axiscmoves[i];
            for (let j = 0; j < slicecmoves.length; j += 2 * movesetorder) {
              if (this.skipcubie(slicecmoves[j])) {
                continue;
              }
              const ind = this.cubiesetnums[slicecmoves[j]];
              setmoves[ind] = 1;
            }
          }
        }
        for (let i = 0; i < this.cubiesetnames.length; i++) {
          if (!setmoves[i]) {
            continue;
          }
          if (this.omitSet(this.cubiesetnames[i])) {
            setmoves[i] = 0;
            continue;
          }
          setnames.push(this.cubiesetnames[i]);
          setdefs.push(
            new PGOrbitDef(
              this.cubieords[i],
              this.options.fixedOrientation ? 1 : this.orbitoris[i]
            )
          );
        }
        const solved = [];
        for (let i = 0; i < this.cubiesetnames.length; i++) {
          if (!setmoves[i]) {
            continue;
          }
          if (this.omitSet(this.cubiesetnames[i])) {
            continue;
          }
          const p = [];
          const o = [];
          for (let j = 0; j < this.cubieords[i]; j++) {
            if (fortwisty) {
              p.push(j);
            } else {
              const cubie = this.cubiesetcubies[i][j];
              p.push(this.cubievaluemap[cubie]);
            }
            o.push(0);
          }
          solved.push(
            new PGOrbit(
              p,
              o,
              this.options.fixedOrientation ? 1 : this.orbitoris[i]
            )
          );
        }
        const movenames = [];
        const forcenames = [];
        const moves = [];
        const isrots = [];
        if (includemoves) {
          for (let k = 0; k < this.moveplanesets.length; k++) {
            const moveplaneset = this.moveplanesets[k];
            const slices = moveplaneset.length;
            const moveset = mps[k];
            const movesetgeo = this.movesetgeos[k];
            for (let i = 0; i < moveset.length; i += 2) {
              const movebits = moveset[i];
              let nameoverride;
              let inverted = false;
              if (this.parsedmovelist !== void 0) {
                for (const parsedmove of this.parsedmovelist) {
                  if (parsedmove[1] !== k) {
                    continue;
                  }
                  let r2 = [];
                  if (parsedmove[4]) {
                    r2 = [parsedmove[2], parsedmove[3]];
                  } else {
                    r2 = [slices - parsedmove[3], slices - parsedmove[2]];
                  }
                  if (r2[0] === movebits[0] && r2[1] === movebits[1]) {
                    nameoverride = parsedmove[0];
                    inverted = !parsedmove[4];
                  }
                }
              }
              if (nameoverride) {
                movenames.push(nameoverride);
                forcenames.push(true);
              } else {
                const mna = getmovename(movesetgeo, movebits, slices);
                inverted = mna[1];
                const movename = mna[0];
                if (moveset[i + 1] === 1) {
                  movenames.push(movename);
                } else {
                  movenames.push(movename + moveset[i + 1]);
                }
                forcenames.push(false);
              }
              isrots.push(movebits[0] === 0 && movebits[1] === slices);
              const mv = this.getMoveFromBits(
                movebits,
                moveset[i + 1],
                inverted,
                this.cmovesbyslice[k],
                setmoves,
                this.movesetorders[k]
              );
              moves.push(mv);
            }
          }
        }
        let r = new PGOrbitsDef(
          setnames,
          setdefs,
          new VisibleState(solved),
          movenames,
          moves,
          isrots,
          forcenames
        );
        if (this.options.optimizeOrbits) {
          r = r.optimize();
        }
        if (this.options.scrambleAmount !== 0) {
          r.scramble(this.options.scrambleAmount);
        }
        return r;
      }
      getScramble(n = 0) {
        const od = this.getOrbitsDef(false);
        return od.transformToKTransformationData(od.getScrambleTransformation(n));
      }
      getMovesAsPerms() {
        return this.getOrbitsDef(false).moveops.map((_) => _.toPerm());
      }
      showcanon(disp) {
        showcanon(this.getOrbitsDef(false), disp);
      }
      getsolved() {
        const r = [];
        for (let i = 0; i < this.baseFaceCount; i++) {
          for (let j = 0; j < this.stickersperface; j++) {
            r.push(i);
          }
        }
        return new Perm(r);
      }
      // Given a rotation description that says to align feature1
      // with a given vector, and then as much as possible feature2
      // with another given vector, return a Quaternion that
      // performs this rotation.
      getOrientationRotation(desiredRotation) {
        const [feature1name, [x1, y1, z1]] = desiredRotation[0];
        const direction1 = new Quat(0, x1, -y1, z1);
        const [feature2name, [x2, y2, z2]] = desiredRotation[1];
        const direction2 = new Quat(0, x2, -y2, z2);
        let feature1 = null;
        let feature2 = null;
        const feature1geoname = this.swizzler.unswizzle(feature1name);
        const feature2geoname = this.swizzler.unswizzle(feature2name);
        for (const gn of this.geonormals) {
          if (feature1geoname === gn[1]) {
            feature1 = gn[0];
          }
          if (feature2geoname === gn[1]) {
            feature2 = gn[0];
          }
        }
        if (!feature1) {
          throw new Error(`Could not find feature ${feature1name}`);
        }
        if (!feature2) {
          throw new Error(`Could not find feature ${feature2name}`);
        }
        const r1 = feature1.pointrotation(direction1);
        const feature2rot = feature2.rotatepoint(r1);
        const r2 = feature2rot.unproject(direction1).pointrotation(direction2.unproject(direction1));
        return r2.mul(r1);
      }
      getInitial3DRotation() {
        const basefacecount = this.baseFaceCount;
        let orientationDescription = null;
        if (this.options.puzzleOrientation) {
          orientationDescription = this.options.puzzleOrientation;
        } else if (this.options.puzzleOrientations) {
          orientationDescription = this.options.puzzleOrientations[basefacecount];
        }
        if (!orientationDescription) {
          orientationDescription = defaultOrientations()[basefacecount];
        }
        if (!orientationDescription) {
          throw new Error("No default orientation?");
        }
        return this.getOrientationRotation(orientationDescription);
      }
      generate2dmapping(w = 800, h = 500, trim = 10, threed = false, twodshrink = 0.92) {
        w -= 2 * trim;
        h -= 2 * trim;
        function extendedges(a, n) {
          let dx = a[1][0] - a[0][0];
          let dy = a[1][1] - a[0][1];
          const ang = 2 * Math.PI / n;
          const cosa = Math.cos(ang);
          const sina = Math.sin(ang);
          for (let i = 2; i < n; i++) {
            const ndx = dx * cosa + dy * sina;
            dy = dy * cosa - dx * sina;
            dx = ndx;
            a.push([a[i - 1][0] + dx, a[i - 1][1] + dy]);
          }
        }
        this.genperms();
        const boundarygeo = this.getboundarygeometry();
        const face0 = boundarygeo.facenames[0][0];
        const polyn = face0.length;
        const net = this.net;
        if (net === null) {
          throw new Error("No net?");
        }
        const edges = {};
        let minx = 0;
        let miny = 0;
        let maxx = 1;
        let maxy = 0;
        edges[net[0][0]] = [
          [1, 0],
          [0, 0]
        ];
        extendedges(edges[net[0][0]], polyn);
        for (const neti of net) {
          const f0 = neti[0];
          if (!edges[f0]) {
            throw new Error("Bad edge description; first edge not connected.");
          }
          for (let j = 1; j < neti.length; j++) {
            const f1 = neti[j];
            if (f1 === "" || edges[f1]) {
              continue;
            }
            edges[f1] = [edges[f0][j % polyn], edges[f0][(j + polyn - 1) % polyn]];
            extendedges(edges[f1], polyn);
          }
        }
        for (const f in edges) {
          const es = edges[f];
          for (const esi of es) {
            minx = Math.min(minx, esi[0]);
            maxx = Math.max(maxx, esi[0]);
            miny = Math.min(miny, esi[1]);
            maxy = Math.max(maxy, esi[1]);
          }
        }
        const sc = Math.min(w / (maxx - minx), h / (maxy - miny));
        const xoff = 0.5 * (w - sc * (maxx + minx));
        const yoff = 0.5 * (h - sc * (maxy + miny));
        const geos = {};
        const bg = this.getboundarygeometry();
        const edges2 = {};
        const initv = [
          [sc + xoff, yoff],
          [xoff, yoff]
        ];
        edges2[net[0][0]] = initv;
        extendedges(edges2[net[0][0]], polyn);
        geos[this.facenames[0][1]] = this.project2d(0, 0, [
          new Quat(0, initv[0][0], initv[0][1], 0),
          new Quat(0, initv[1][0], initv[1][1], 0)
        ]);
        const connectat = [];
        connectat[0] = 0;
        for (const neti of net) {
          const f0 = neti[0];
          if (!edges2[f0]) {
            throw new Error("Bad edge description; first edge not connected.");
          }
          let gfi = -1;
          for (let j = 0; j < bg.facenames.length; j++) {
            if (f0 === bg.facenames[j][1]) {
              gfi = j;
              break;
            }
          }
          if (gfi < 0) {
            throw new Error(`Could not find first face name ${f0}`);
          }
          const thisface = bg.facenames[gfi][0];
          for (let j = 1; j < neti.length; j++) {
            const f1 = neti[j];
            if (f1 === "" || edges2[f1]) {
              continue;
            }
            edges2[f1] = [
              edges2[f0][j % polyn],
              edges2[f0][(j + polyn - 1) % polyn]
            ];
            extendedges(edges2[f1], polyn);
            const caf0 = connectat[gfi];
            const mp = thisface[(caf0 + j) % polyn].sum(thisface[(caf0 + j + polyn - 1) % polyn]).smul(0.5);
            const epi = findelement(bg.edgenames, mp);
            const edgename = bg.edgenames[epi][1];
            const el = splitByFaceNames(edgename, this.facenames);
            const gf1 = el[f0 === el[0] ? 1 : 0];
            let gf1i = -1;
            for (let k = 0; k < bg.facenames.length; k++) {
              if (gf1 === bg.facenames[k][1]) {
                gf1i = k;
                break;
              }
            }
            if (gf1i < 0) {
              throw new Error("Could not find second face name");
            }
            const otherface = bg.facenames[gf1i][0];
            for (let k = 0; k < otherface.length; k++) {
              const mp2 = otherface[k].sum(otherface[(k + 1) % polyn]).smul(0.5);
              if (mp2.dist(mp) <= eps3) {
                const p1 = edges2[f0][(j + polyn - 1) % polyn];
                const p2 = edges2[f0][j % polyn];
                connectat[gf1i] = k;
                geos[gf1] = this.project2d(gf1i, k, [
                  new Quat(0, p2[0], p2[1], 0),
                  new Quat(0, p1[0], p1[1], 0)
                ]);
                break;
              }
            }
          }
        }
        let hix = 0;
        let hiy = 0;
        const rot = this.getInitial3DRotation();
        for (let face of this.faces) {
          if (threed) {
            face = face.rotate(rot);
          }
          for (let j = 0; j < face.length; j++) {
            hix = Math.max(hix, Math.abs(face.get(j).b));
            hiy = Math.max(hiy, Math.abs(face.get(j).c));
          }
        }
        const sc2 = Math.min(h / hiy / 2, (w - trim) / hix / 4);
        const mappt2d = (fn, q) => {
          if (threed) {
            q = q.rotatepoint(rot);
            const xoff2 = 0.5 * trim + 0.25 * w;
            const xmul = this.baseplanes[fn].rotateplane(rot).d < 0 ? 1 : -1;
            return [
              trim + w * 0.5 + xmul * (xoff2 - q.b * sc2),
              trim + h * 0.5 + q.c * sc2
            ];
          } else {
            const g = geos[this.facenames[fn][1]];
            return [
              trim + twodshrink * q.dot(g[0]) + g[2].b,
              trim + h - twodshrink * q.dot(g[1]) - g[2].c
            ];
          }
        };
        return mappt2d;
      }
      generatesvg(w = 800, h = 500, trim = 10, threed = false) {
        const mappt2d = this.generate2dmapping(w, h, trim, threed);
        function drawedges(id, pts, color) {
          return `<polygon id="${id}" class="sticker" style="fill: ${color}" points="${pts.map((p) => `${p[0]} ${p[1]}`).join(" ")}"/>
`;
        }
        const pos = this.getsolved();
        const colormap = [];
        const facegeo = [];
        for (let i = 0; i < this.baseFaceCount; i++) {
          colormap[i] = this.colors[this.facenames[i][1]];
        }
        for (let i = 0; i < this.faces.length; i++) {
          const face = this.faces[i];
          const facenum = Math.floor(i / this.stickersperface);
          const fg = [];
          for (let j = 0; j < face.length; j++) {
            fg.push(mappt2d(facenum, face.get(j)));
          }
          facegeo.push(fg);
        }
        const svg = [];
        for (let j = 0; j < this.baseFaceCount; j++) {
          svg.push("<g>");
          svg.push(`<title>${this.facenames[j][1]}</title>
`);
          for (let ii = 0; ii < this.stickersperface; ii++) {
            const i = j * this.stickersperface + ii;
            const cubie = this.facetocubie[i];
            const cubieori = this.facetoord[i];
            const cubiesetnum = this.cubiesetnums[cubie];
            const cubieord = this.cubieordnums[cubie];
            const color = this.graybyori(cubie) ? "#808080" : colormap[pos.p[i]];
            let id = `${this.cubiesetnames[cubiesetnum]}-l${cubieord}-o${cubieori}`;
            svg.push(drawedges(id, facegeo[i], color));
            if (this.duplicatedFaces[i]) {
              for (let jj = 1; jj < this.duplicatedFaces[i]; jj++) {
                id = `${this.cubiesetnames[cubiesetnum]}-l${cubieord}-o${jj}`;
                svg.push(drawedges(id, facegeo[i], color));
              }
            }
          }
          svg.push("</g>");
        }
        const html = `<svg id="svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 800 500">
<style type="text/css"><![CDATA[.sticker { stroke: #000000; stroke-width: 1px; }]]></style>
${svg.join(
          ""
        )}</svg>`;
        return html;
      }
      // The colorfrac parameter says how much of the face should be
      // colored (vs dividing lines); we default to 0.77 which seems
      // to work pretty well.  It should be a number between probably
      // 0.4 and 0.9.
      get3d(options) {
        const stickers = [];
        const rot = this.getInitial3DRotation();
        const faces = [];
        const maxdist = 0.52 * this.basefaces[0].get(0).len();
        for (let i = 0; i < this.basefaces.length; i++) {
          const coords = this.basefaces[i].rotate(rot);
          const name = this.facenames[i][1];
          faces.push({ coords: toFaceCoords(coords, maxdist), name });
        }
        for (let i = 0; i < this.faces.length; i++) {
          const facenum = Math.floor(i / this.stickersperface);
          const cubie = this.facetocubie[i];
          const cubieori = this.facetoord[i];
          const cubiesetnum = this.cubiesetnums[cubie];
          const cubieord = this.cubieordnums[cubie];
          let color = this.graybyori(cubie) ? options?.darkIgnoredOrbits ? "#222222" : "#808080" : this.colors[this.facenames[facenum][1]];
          if (options?.stickerColors) {
            color = options.stickerColors[i];
          }
          const coords = this.faces[i].rotate(rot);
          stickers.push({
            coords: toFaceCoords(coords, maxdist),
            color,
            orbit: this.cubiesetnames[cubiesetnum],
            ord: cubieord,
            ori: cubieori,
            face: facenum
          });
          let fcoords = coords;
          if (this.duplicatedFaces[i]) {
            const rotdist = fcoords.length / this.duplicatedFaces[i];
            for (let jj = 1; jj < this.duplicatedFaces[i]; jj++) {
              for (let k = 0; k < rotdist; k++) {
                fcoords = fcoords.rotateforward();
              }
              stickers.push({
                coords: toFaceCoords(fcoords, maxdist),
                color,
                orbit: this.cubiesetnames[cubiesetnum],
                ord: cubieord,
                ori: jj,
                face: facenum,
                isDup: true
              });
            }
          }
        }
        const grips = [];
        for (let i = 0; i < this.movesetgeos.length; i++) {
          const msg = this.movesetgeos[i];
          const order2 = this.movesetorders[i];
          for (const gn of this.geonormals) {
            if (msg[0] === gn[1] && msg[1] === gn[2]) {
              grips.push({
                coordinates: toCoords(gn[0].rotatepoint(rot), 1),
                quantumMove: new Move(msg[0]),
                order: order2
              });
              grips.push({
                coordinates: toCoords(gn[0].rotatepoint(rot).smul(-1), 1),
                quantumMove: new Move(msg[2]),
                order: order2
              });
            }
          }
        }
        const twodmapper = this.generate2dmapping(2880, 2160, 0, false, 1);
        const g = function() {
          const irot = rot.invrot();
          return function(facenum, coords) {
            let q = new Quat(
              0,
              coords[0] * maxdist,
              -coords[1] * maxdist,
              coords[2] * maxdist
            );
            q = q.rotatepoint(irot);
            const x = twodmapper(facenum, q);
            x[0] /= 2880;
            x[1] = 1 - x[1] / 2160;
            return x;
          };
        }().bind(this);
        return {
          stickers,
          faces,
          axis: grips,
          unswizzle: this.unswizzle.bind(this),
          notationMapper: this.notationMapper,
          textureMapper: { getuv: g }
        };
      }
      //  From the name of a geometric element (face, vertex, edge), get a
      //  normal vector respecting the default orientation.  This is useful
      //  to define the initial position of the camera in a 3D scene.  The
      //  return value is normalized, so multiply it by the camera distance.
      //  Returns undefined if no such geometric element.
      getGeoNormal(geoname) {
        const rot = this.getInitial3DRotation();
        const grip = this.swizzler.unswizzle(geoname);
        for (const gn of this.geonormals) {
          if (grip === gn[1]) {
            const r = toCoords(gn[0].rotatepoint(rot), 1);
            if (Math.abs(r[0]) < eps3 && Math.abs(r[2]) < eps3) {
              r[0] = 0;
              r[2] = 1e-6;
            }
            return r;
          }
        }
        return void 0;
      }
      getfaceindex(facenum) {
        const divid = this.stickersperface;
        return Math.floor(facenum / divid);
      }
      textForTwizzleExplorer() {
        return `Faces ${this.baseplanerot.length}
Stickers per face ${this.stickersperface}
Short edge ${this.shortedge}
Cubies ${this.cubies.length}
Edge distance ${this.edgedistance}
Vertex distance ${this.vertexdistance}`;
      }
      writeSchreierSims(tw) {
        const os = this.getOrbitsDef(false);
        const as = os.reassemblySize();
        tw(`Reassembly size is ${as}`);
        const ss = schreierSims(this.getMovesAsPerms(), tw);
        const r = as / ss;
        tw(`Ratio is ${r}`);
      }
    };
    PGNotation = class {
      constructor(pg, od) {
        this.pg = pg;
        this.orbitNames = od.orbitnames;
      }
      lookupMove(move) {
        const mv = this.pg.parseMove(move);
        if (this.pg.parsedmovelist) {
          let found = false;
          for (const parsedmove of this.pg.parsedmovelist) {
            if (parsedmove[1] === mv[1] && parsedmove[2] === mv[2] && parsedmove[3] === mv[3] && parsedmove[4] === mv[4]) {
              found = true;
            }
          }
          if (!found) {
            return null;
          }
        }
        let bits = [mv[2], mv[3]];
        if (!mv[4]) {
          const slices = this.pg.moveplanesets[mv[1]].length;
          bits = [slices - mv[3], slices - mv[2]];
        }
        const pgmv = this.pg.getMoveFromBits(
          bits,
          mv[5],
          !mv[4],
          this.pg.cmovesbyslice[mv[1]],
          void 0,
          this.pg.movesetorders[mv[1]]
        );
        const r = PGOrbitsDef.transformToKTransformationData(this.orbitNames, pgmv);
        return r;
      }
    };
  }
});

// src/cubing/puzzle-geometry/index.ts
var puzzle_geometry_exports = {};
__export(puzzle_geometry_exports, {
  EXPERIMENTAL_PUZZLE_BASE_SHAPES: () => PUZZLE_BASE_SHAPES,
  EXPERIMENTAL_PUZZLE_CUT_TYPES: () => PUZZLE_CUT_TYPES,
  ExperimentalPGNotation: () => PGNotation,
  PuzzleGeometry: () => PuzzleGeometry,
  Quat: () => Quat,
  getPG3DNamedPuzzles: () => getPG3DNamedPuzzles,
  getPuzzleDescriptionString: () => getPuzzleDescriptionString,
  getPuzzleGeometryByDesc: () => getPuzzleGeometryByDesc,
  getPuzzleGeometryByName: () => getPuzzleGeometryByName,
  parseOptions: () => parseOptions,
  parsePuzzleDescription: () => parsePuzzleDescription,
  schreierSims: () => schreierSims
});
var init_puzzle_geometry = __esm({
  "src/cubing/puzzle-geometry/index.ts"() {
    "use strict";
    init_PuzzleGeometry();
    init_Options();
    init_Quat();
    init_SchreierSims();
    init_PuzzleGeometry();
    init_PuzzleGeometry();
  }
});

// src/cubing/puzzles/implementations/dynamic/side-events/2x2x2.kpuzzle.json.ts
var cube2x2x2JSON;
var init_x2x2_kpuzzle_json = __esm({
  "src/cubing/puzzles/implementations/dynamic/side-events/2x2x2.kpuzzle.json.ts"() {
    "use strict";
    cube2x2x2JSON = {
      name: "2x2x2",
      orbits: {
        CORNERS: { numPieces: 8, numOrientations: 3 }
      },
      startStateData: {
        CORNERS: {
          pieces: [0, 1, 2, 3, 4, 5, 6, 7],
          orientation: [0, 0, 0, 0, 0, 0, 0, 0]
        }
      },
      moves: {
        U: {
          CORNERS: {
            permutation: [1, 2, 3, 0, 4, 5, 6, 7],
            orientation: [0, 0, 0, 0, 0, 0, 0, 0]
          }
        },
        x: {
          CORNERS: {
            permutation: [4, 0, 3, 5, 7, 6, 2, 1],
            orientation: [2, 1, 2, 1, 1, 2, 1, 2]
          }
        },
        y: {
          CORNERS: {
            permutation: [1, 2, 3, 0, 7, 4, 5, 6],
            orientation: [0, 0, 0, 0, 0, 0, 0, 0]
          }
        }
      },
      experimentalDerivedMoves: {
        z: "[x: y]",
        L: "[z: U]",
        F: "[x: U]",
        R: "[z': U]",
        B: "[x': U]",
        D: "[x2: U]",
        Uv: "y",
        Lv: "x'",
        Fv: "z",
        Rv: "x",
        Bv: "z'",
        Dv: "y'"
      }
    };
  }
});

// src/cubing/puzzles/implementations/dynamic/side-events/2x2x2.kpuzzle.svg.ts
var cube2x2x2SVG;
var init_x2x2_kpuzzle_svg = __esm({
  "src/cubing/puzzles/implementations/dynamic/side-events/2x2x2.kpuzzle.svg.ts"() {
    "use strict";
    cube2x2x2SVG = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN"
       "http://www.w3.org/TR/2001/REC-SVG-20050904/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 530 394" preserveAspectRatio="xMidYMid meet">
  <title>2x2x2</title>
  <defs>
    <g id="sticker">
        <rect x="0" y="0" width="1" height="1" stroke="black" stroke-width="0.04px" />
    </g>
  </defs>
  <g id="puzzle" transform="translate(5, 5) scale(60)">
    <use id="CORNERS-l0-o0" xlink:href="#sticker" transform="translate(3.2, 1)" style="fill: white"/>
    <use id="CORNERS-l0-o1" xlink:href="#sticker" transform="translate(4.4, 2.2)" style="fill: red"/>
    <use id="CORNERS-l0-o2" xlink:href="#sticker" transform="translate(3.2, 2.2)" style="fill: limegreen"/>

    <use id="CORNERS-l1-o0" xlink:href="#sticker" transform="translate(3.2, 0)" style="fill: white"/>
    <use id="CORNERS-l1-o1" xlink:href="#sticker" transform="translate(6.6, 2.2)" style="fill: #26f"/>
    <use id="CORNERS-l1-o2" xlink:href="#sticker" transform="translate(5.4, 2.2)" style="fill: red"/>

    <use id="CORNERS-l2-o0" xlink:href="#sticker" transform="translate(2.2, 0)" style="fill: white"/>
    <use id="CORNERS-l2-o1" xlink:href="#sticker" transform="translate(0, 2.2)" style="fill: orange"/>
    <use id="CORNERS-l2-o2" xlink:href="#sticker" transform="translate(7.6, 2.2)" style="fill: #26f"/>

    <use id="CORNERS-l3-o0" xlink:href="#sticker" transform="translate(2.2, 1)" style="fill: white"/>
    <use id="CORNERS-l3-o1" xlink:href="#sticker" transform="translate(2.2, 2.2)" style="fill: limegreen"/>
    <use id="CORNERS-l3-o2" xlink:href="#sticker" transform="translate(1, 2.2)" style="fill: orange"/>

    <use id="CORNERS-l4-o0" xlink:href="#sticker" transform="translate(3.2, 4.4)" style="fill: yellow"/>
    <use id="CORNERS-l4-o1" xlink:href="#sticker" transform="translate(3.2, 3.2)" style="fill: limegreen"/>
    <use id="CORNERS-l4-o2" xlink:href="#sticker" transform="translate(4.4, 3.2)" style="fill: red"/>

    <use id="CORNERS-l5-o0" xlink:href="#sticker" transform="translate(2.2, 4.4)" style="fill: yellow"/>
    <use id="CORNERS-l5-o1" xlink:href="#sticker" transform="translate(1, 3.2)" style="fill: orange"/>
    <use id="CORNERS-l5-o2" xlink:href="#sticker" transform="translate(2.2, 3.2)" style="fill: limegreen"/>

    <use id="CORNERS-l6-o0" xlink:href="#sticker" transform="translate(2.2, 5.4)" style="fill: yellow"/>
    <use id="CORNERS-l6-o1" xlink:href="#sticker" transform="translate(7.6, 3.2)" style="fill: #26f"/>
    <use id="CORNERS-l6-o2" xlink:href="#sticker" transform="translate(0, 3.2)"  style="fill: orange"/>

    <use id="CORNERS-l7-o0" xlink:href="#sticker" transform="translate(3.2, 5.4)" style="fill: yellow"/>
    <use id="CORNERS-l7-o1" xlink:href="#sticker" transform="translate(5.4, 3.2)" style="fill: red"/>
    <use id="CORNERS-l7-o2" xlink:href="#sticker" transform="translate(6.6, 3.2)" style="fill: #26f"/>
  </g>

</svg>`;
  }
});

// src/cubing/puzzles/implementations/dynamic/side-events/2x2x2-ll.kpuzzle.svg.ts
var cube2x2x2LLSVG;
var init_x2x2_ll_kpuzzle_svg = __esm({
  "src/cubing/puzzles/implementations/dynamic/side-events/2x2x2-ll.kpuzzle.svg.ts"() {
    "use strict";
    cube2x2x2LLSVG = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN"
       "http://www.w3.org/TR/2001/REC-SVG-20050904/DTD/svg11.dtd">
    <svg width="288px" height="288px" viewBox="-16 -16 288 288" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
       <title>2x2x2 LL</title>
  <defs>
    <g id="sticker">
        <rect x="0" y="0" width="1" height="1" stroke="black" stroke-width="0.04px" />
    </g>
  </defs>
  <g id="2x2x2-LL" stroke="#000000" stroke-width="4" style="none" stroke-linejoin="round">
    <rect    id="CORNERS-l0-o0" style="fill: white" x="128" y="128" width="76" height="76"></rect>
    <polygon id="CORNERS-l0-o1" style="fill: red" points="204 128 252 128 252 252 204 204"></polygon>
    <polygon id="CORNERS-l0-o2" style="fill: limegreen" transform="translate(206, 238) scale(1, -1) rotate(-90) translate(-206, -238) " points="172 160 220 160 220 284 172 236"></polygon>
    <rect    id="CORNERS-l1-o0" style="fill: white" x="128" y="52" width="76" height="76"></rect>
    <polygon id="CORNERS-l1-o1" style="fill: #26f" transform="translate(206, 18) rotate(-90) translate(-206, -18) " points="172 -60 220 -60 220 64 172 16"></polygon>
    <polygon id="CORNERS-l1-o2" style="fill: red" transform="translate(238, 50) scale(1, -1) translate(-238, -50) " points="204 -28 252 -28 252 96 204 48"></polygon>
    <rect    id="CORNERS-l2-o0" style="fill: white" x="52" y="52" width="76" height="76"></rect>
    <polygon id="CORNERS-l2-o1" style="fill: orange" transform="translate(18, 50) scale(-1, -1) translate(-18, -50) " points="-16 -28 32 -28 32 96 -16 48"></polygon>
    <polygon id="CORNERS-l2-o2" style="fill: #26f" transform="translate(50, 18) scale(1, -1) rotate(90) translate(-50, -18) " points="16 -60 64 -60 64 64 16 16"></polygon>
    <rect    id="CORNERS-l3-o0" style="fill: white" x="52" y="128" width="76" height="76"></rect>
    <polygon id="CORNERS-l3-o1" style="fill: limegreen" transform="translate(50, 238) rotate(90) translate(-50, -238) " points="16 160 64 160 64 284 16 236"></polygon>
    <polygon id="CORNERS-l3-o2" style="fill: orange" transform="translate(18, 206) scale(-1, 1) translate(-18, -206) " points="-16 128 32 128 32 252 -16 204"></polygon>
  </g>
  <g style="opacity: 0">
    <use id="CORNERS-l4-o0" xlink:href="#sticker" style="fill: yellow"/>
    <use id="CORNERS-l4-o1" xlink:href="#sticker" style="fill: limegreen"/>
    <use id="CORNERS-l4-o2" xlink:href="#sticker" style="fill: red"/>

    <use id="CORNERS-l5-o0" xlink:href="#sticker" style="fill: yellow"/>
    <use id="CORNERS-l5-o1" xlink:href="#sticker" style="fill: orange"/>
    <use id="CORNERS-l5-o2" xlink:href="#sticker" style="fill: limegreen"/>

    <use id="CORNERS-l6-o0" xlink:href="#sticker" style="fill: yellow"/>
    <use id="CORNERS-l6-o1" xlink:href="#sticker" style="fill: #26f"/>
    <use id="CORNERS-l6-o2" xlink:href="#sticker"  style="fill: orange"/>

    <use id="CORNERS-l7-o0" xlink:href="#sticker" style="fill: yellow"/>
    <use id="CORNERS-l7-o1" xlink:href="#sticker" style="fill: red"/>
    <use id="CORNERS-l7-o2" xlink:href="#sticker" style="fill: #26f"/>
  </g>
</svg>`;
  }
});

// src/cubing/puzzles/implementations/dynamic/side-events/clock.kpuzzle.json.ts
var clockJSON;
var init_clock_kpuzzle_json = __esm({
  "src/cubing/puzzles/implementations/dynamic/side-events/clock.kpuzzle.json.ts"() {
    "use strict";
    clockJSON = {
      name: "clock",
      orbits: {
        DIALS: { numPieces: 18, numOrientations: 12 },
        FACES: { numPieces: 18, numOrientations: 1 },
        FRAME: { numPieces: 1, numOrientations: 2 }
      },
      startStateData: {
        DIALS: {
          pieces: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
          orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        FACES: {
          pieces: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
          orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        FRAME: { pieces: [0], orientation: [0] }
      },
      moves: {
        UR_PLUS_: {
          DIALS: {
            permutation: [
              0,
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              12,
              13,
              14,
              15,
              16,
              17
            ],
            orientation: [0, 1, 1, 0, 1, 1, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0]
          },
          FACES: {
            permutation: [
              0,
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              12,
              13,
              14,
              15,
              16,
              17
            ],
            orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          },
          FRAME: { permutation: [0], orientation: [0] }
        },
        DR_PLUS_: {
          DIALS: {
            permutation: [
              0,
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              12,
              13,
              14,
              15,
              16,
              17
            ],
            orientation: [0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 11, 0, 0]
          },
          FACES: {
            permutation: [
              0,
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              12,
              13,
              14,
              15,
              16,
              17
            ],
            orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          },
          FRAME: { permutation: [0], orientation: [0] }
        },
        DL_PLUS_: {
          DIALS: {
            permutation: [
              0,
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              12,
              13,
              14,
              15,
              16,
              17
            ],
            orientation: [0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11]
          },
          FACES: {
            permutation: [
              0,
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              12,
              13,
              14,
              15,
              16,
              17
            ],
            orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          },
          FRAME: { permutation: [0], orientation: [0] }
        },
        UL_PLUS_: {
          DIALS: {
            permutation: [
              0,
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              12,
              13,
              14,
              15,
              16,
              17
            ],
            orientation: [1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0]
          },
          FACES: {
            permutation: [
              0,
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              12,
              13,
              14,
              15,
              16,
              17
            ],
            orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          },
          FRAME: { permutation: [0], orientation: [0] }
        },
        U_PLUS_: {
          DIALS: {
            permutation: [
              0,
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              12,
              13,
              14,
              15,
              16,
              17
            ],
            orientation: [1, 1, 1, 1, 1, 1, 0, 0, 0, 11, 0, 11, 0, 0, 0, 0, 0, 0]
          },
          FACES: {
            permutation: [
              0,
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              12,
              13,
              14,
              15,
              16,
              17
            ],
            orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          },
          FRAME: { permutation: [0], orientation: [0] }
        },
        R_PLUS_: {
          DIALS: {
            permutation: [
              0,
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              12,
              13,
              14,
              15,
              16,
              17
            ],
            orientation: [0, 1, 1, 0, 1, 1, 0, 1, 1, 11, 0, 0, 0, 0, 0, 11, 0, 0]
          },
          FACES: {
            permutation: [
              0,
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              12,
              13,
              14,
              15,
              16,
              17
            ],
            orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          },
          FRAME: { permutation: [0], orientation: [0] }
        },
        D_PLUS_: {
          DIALS: {
            permutation: [
              0,
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              12,
              13,
              14,
              15,
              16,
              17
            ],
            orientation: [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 11, 0, 11]
          },
          FACES: {
            permutation: [
              0,
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              12,
              13,
              14,
              15,
              16,
              17
            ],
            orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          },
          FRAME: { permutation: [0], orientation: [0] }
        },
        L_PLUS_: {
          DIALS: {
            permutation: [
              0,
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              12,
              13,
              14,
              15,
              16,
              17
            ],
            orientation: [1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 11, 0, 0, 0, 0, 0, 11]
          },
          FACES: {
            permutation: [
              0,
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              12,
              13,
              14,
              15,
              16,
              17
            ],
            orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          },
          FRAME: { permutation: [0], orientation: [0] }
        },
        ALL_PLUS_: {
          DIALS: {
            permutation: [
              0,
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              12,
              13,
              14,
              15,
              16,
              17
            ],
            orientation: [1, 1, 1, 1, 1, 1, 1, 1, 1, 11, 0, 11, 0, 0, 0, 11, 0, 11]
          },
          FACES: {
            permutation: [
              0,
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              12,
              13,
              14,
              15,
              16,
              17
            ],
            orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          },
          FRAME: { permutation: [0], orientation: [0] }
        },
        y2: {
          DIALS: {
            permutation: [
              9,
              10,
              11,
              12,
              13,
              14,
              15,
              16,
              17,
              0,
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8
            ],
            orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          },
          FACES: {
            permutation: [
              9,
              10,
              11,
              12,
              13,
              14,
              15,
              16,
              17,
              0,
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8
            ],
            orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          },
          FRAME: { permutation: [0], orientation: [1] }
        },
        UL: {
          // TODO: define "pin up" as something other than a normal move.
          DIALS: {
            permutation: [
              0,
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              12,
              13,
              14,
              15,
              16,
              17
            ],
            orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          },
          FACES: {
            permutation: [
              0,
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              12,
              13,
              14,
              15,
              16,
              17
            ],
            orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          },
          FRAME: { permutation: [0], orientation: [0] }
        },
        UR: {
          // TODO: define "pin up" as something other than a normal move.
          DIALS: {
            permutation: [
              0,
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              12,
              13,
              14,
              15,
              16,
              17
            ],
            orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          },
          FACES: {
            permutation: [
              0,
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              12,
              13,
              14,
              15,
              16,
              17
            ],
            orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          },
          FRAME: { permutation: [0], orientation: [0] }
        },
        DL: {
          // TODO: define "pin up" as something other than a normal move.
          DIALS: {
            permutation: [
              0,
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              12,
              13,
              14,
              15,
              16,
              17
            ],
            orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          },
          FACES: {
            permutation: [
              0,
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              12,
              13,
              14,
              15,
              16,
              17
            ],
            orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          },
          FRAME: { permutation: [0], orientation: [0] }
        },
        DR: {
          // TODO: define "pin up" as something other than a normal move.
          DIALS: {
            permutation: [
              0,
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              12,
              13,
              14,
              15,
              16,
              17
            ],
            orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          },
          FACES: {
            permutation: [
              0,
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              12,
              13,
              14,
              15,
              16,
              17
            ],
            orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          },
          FRAME: { permutation: [0], orientation: [0] }
        }
      },
      experimentalDerivedMoves: {
        // TODO: moves with diagonally opposite pins?
        B_PLUS_: "[y2: ALL_PLUS_']",
        BU_PLUS_: "[y2: U_PLUS_']",
        BR_PLUS_: "[y2: L_PLUS_']",
        BD_PLUS_: "[y2: D_PLUS_']",
        BL_PLUS_: "[y2: R_PLUS_']",
        BUR_PLUS_: "[y2: UL_PLUS_']",
        BUL_PLUS_: "[y2: UR_PLUS_']",
        BDL_PLUS_: "[y2: DR_PLUS_']",
        BDR_PLUS_: "[y2: DL_PLUS_']"
      }
    };
  }
});

// src/cubing/puzzles/implementations/dynamic/side-events/clock.kpuzzle.svg.ts
var clockSVG;
var init_clock_kpuzzle_svg = __esm({
  "src/cubing/puzzles/implementations/dynamic/side-events/clock.kpuzzle.svg.ts"() {
    "use strict";
    clockSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 480 240" preserveAspectRatio="xMidYMid meet">
  <title>clock</title>
  <defs>
    <g id="hand" transform="translate(-20, -20)">
      <path d="M19.9995197,2.22079449 L23.8791657,19.0203611 C23.9580836,19.3338406 24,19.6620253 24,20 C24,22.209139 22.209139,24 20,24 C17.790861,24 16,22.209139 16,20 C16,19.6620253 16.0419164,19.3338406 16.1208343,19.0203611 L19.9995197,2.22079449 Z"></path>
    </g>
    <g id="cardinal_hours" style="fill: #FFFFFF">
      <circle cx="0" cy="24" r="2"></circle>
      <circle cx="-24" cy="0" r="2"></circle>
      <circle cx="24" cy="0" r="2"></circle>
      <circle cx="0" cy="-24" r="2"></circle>
    </g>
    <g id="face_hours">
      <g>
        <use xlink:href="#cardinal_hours"/>
      </g>
      <g transform="rotate(30)">
        <use xlink:href="#cardinal_hours"/>
      </g>
      <g  transform="rotate(60)">
        <use xlink:href="#cardinal_hours"/>
      </g>
    </g>
    <g id="pegs" stroke="#000000" style="fill: #FFD000">
      <circle id="PEG4" cx="90" cy="90" r="10"></circle>
      <circle id="PEG3" cx="30" cy="90" r="10"></circle>
      <circle id="PEG2" cx="90" cy="30" r="10"></circle>
      <circle id="PEG1" cx="30" cy="30" r="10"></circle>
    </g>
    <g id="frame" transform="translate(-24, -24)">
      <path stroke="#000000" d="M120,20 C137.495665,20 153.941932,24.4930026 168.247913,32.3881183 C171.855881,30.8514056 175.828512,30 180,30 C196.568542,30 210,43.4314575 210,60 C210,64.1714878 209.148594,68.1441192 207.610077,71.7536009 C215.506997,86.0580678 220,102.504335 220,120 C220,137.495665 215.506997,153.941932 207.611882,168.247913 C209.148594,171.855881 210,175.828512 210,180 C210,196.568542 196.568542,210 180,210 C175.828512,210 171.855881,209.148594 168.246399,207.610077 C153.941932,215.506997 137.495665,220 120,220 C102.504335,220 86.0580678,215.506997 71.7520869,207.611882 C68.1441192,209.148594 64.1714878,210 60,210 C43.4314575,210 30,196.568542 30,180 C30,175.828512 30.8514056,171.855881 32.3899234,168.246399 C24.4930026,153.941932 20,137.495665 20,120 C20,102.504335 24.4930026,86.0580678 32.3881183,71.7520869 C30.8514056,68.1441192 30,64.1714878 30,60 C30,43.4314575 43.4314575,30 60,30 C64.1714878,30 68.1441192,30.8514056 71.7536009,32.3899234 C86.0580678,24.4930026 102.504335,20 120,20 Z"></path>
    </g>
  </defs>
  <g>
    <g transform="translate(24, 24)">
      <use xlink:href="#frame" id="FRAME-l0-o0" style="fill: #0C5093"/>
      <use xlink:href="#pegs" transform="translate(36, 36)"/>
      <g transform="translate(36, 36)">
        <circle id="FACES-l0-o0" stroke="#000000" style="fill: #90B8DF" r="20"></circle>
        <use xlink:href="#face_hours"/>
        <g>
          <use id="DIALS-l0-o0"  xlink:href="#hand" transform="rotate(0)" style="fill: #FFD000"/>
          <use id="DIALS-l0-o1"  xlink:href="#hand" transform="rotate(30)" style="fill: #0000"/>
          <use id="DIALS-l0-o2"  xlink:href="#hand" transform="rotate(60)" style="fill: #0000"/>
          <use id="DIALS-l0-o3"  xlink:href="#hand" transform="rotate(90)" style="fill: #0000"/>
          <use id="DIALS-l0-o4"  xlink:href="#hand" transform="rotate(120)" style="fill: #0000"/>
          <use id="DIALS-l0-o5"  xlink:href="#hand" transform="rotate(150)" style="fill: #0000"/>
          <use id="DIALS-l0-o6"  xlink:href="#hand" transform="rotate(180)" style="fill: #0000"/>
          <use id="DIALS-l0-o7"  xlink:href="#hand" transform="rotate(210)" style="fill: #0000"/>
          <use id="DIALS-l0-o8"  xlink:href="#hand" transform="rotate(240)" style="fill: #0000"/>
          <use id="DIALS-l0-o9"  xlink:href="#hand" transform="rotate(270)" style="fill: #0000"/>
          <use id="DIALS-l0-o10" xlink:href="#hand" transform="rotate(300)" style="fill: #0000"/>
          <use id="DIALS-l0-o11" xlink:href="#hand" transform="rotate(330)" style="fill: #0000"/>
        </g>
      </g>
      <g transform="translate(96, 36)">
        <circle id="FACES-l1-o0" stroke="#000000" style="fill: #90B8DF" r="20"></circle>
        <use xlink:href="#face_hours"/>
        <g>
          <use id="DIALS-l1-o0"  xlink:href="#hand" transform="rotate(0)" style="fill: #FFD000"/>
          <use id="DIALS-l1-o1"  xlink:href="#hand" transform="rotate(30)" style="fill: #0000"/>
          <use id="DIALS-l1-o2"  xlink:href="#hand" transform="rotate(60)" style="fill: #0000"/>
          <use id="DIALS-l1-o3"  xlink:href="#hand" transform="rotate(90)" style="fill: #0000"/>
          <use id="DIALS-l1-o4"  xlink:href="#hand" transform="rotate(120)" style="fill: #0000"/>
          <use id="DIALS-l1-o5"  xlink:href="#hand" transform="rotate(150)" style="fill: #0000"/>
          <use id="DIALS-l1-o6"  xlink:href="#hand" transform="rotate(180)" style="fill: #0000"/>
          <use id="DIALS-l1-o7"  xlink:href="#hand" transform="rotate(210)" style="fill: #0000"/>
          <use id="DIALS-l1-o8"  xlink:href="#hand" transform="rotate(240)" style="fill: #0000"/>
          <use id="DIALS-l1-o9"  xlink:href="#hand" transform="rotate(270)" style="fill: #0000"/>
          <use id="DIALS-l1-o10" xlink:href="#hand" transform="rotate(300)" style="fill: #0000"/>
          <use id="DIALS-l1-o11" xlink:href="#hand" transform="rotate(330)" style="fill: #0000"/>
        </g>
      </g>
      <g transform="translate(156, 36)">
        <circle id="FACES-l2-o0" stroke="#000000" style="fill: #90B8DF" r="20"></circle>
        <use xlink:href="#face_hours"/>
        <g>
          <use id="DIALS-l2-o0"  xlink:href="#hand" transform="rotate(0)" style="fill: #FFD000"/>
          <use id="DIALS-l2-o1"  xlink:href="#hand" transform="rotate(30)" style="fill: #0000"/>
          <use id="DIALS-l2-o2"  xlink:href="#hand" transform="rotate(60)" style="fill: #0000"/>
          <use id="DIALS-l2-o3"  xlink:href="#hand" transform="rotate(90)" style="fill: #0000"/>
          <use id="DIALS-l2-o4"  xlink:href="#hand" transform="rotate(120)" style="fill: #0000"/>
          <use id="DIALS-l2-o5"  xlink:href="#hand" transform="rotate(150)" style="fill: #0000"/>
          <use id="DIALS-l2-o6"  xlink:href="#hand" transform="rotate(180)" style="fill: #0000"/>
          <use id="DIALS-l2-o7"  xlink:href="#hand" transform="rotate(210)" style="fill: #0000"/>
          <use id="DIALS-l2-o8"  xlink:href="#hand" transform="rotate(240)" style="fill: #0000"/>
          <use id="DIALS-l2-o9"  xlink:href="#hand" transform="rotate(270)" style="fill: #0000"/>
          <use id="DIALS-l2-o10" xlink:href="#hand" transform="rotate(300)" style="fill: #0000"/>
          <use id="DIALS-l2-o11" xlink:href="#hand" transform="rotate(330)" style="fill: #0000"/>
        </g>
      </g>
      <g transform="translate(36, 96)">
        <circle id="FACES-l3-o0" stroke="#000000" style="fill: #90B8DF" r="20"></circle>
        <use xlink:href="#face_hours"/>
        <g>
          <use id="DIALS-l3-o0"  xlink:href="#hand" transform="rotate(0)" style="fill: #FFD000"/>
          <use id="DIALS-l3-o1"  xlink:href="#hand" transform="rotate(30)" style="fill: #0000"/>
          <use id="DIALS-l3-o2"  xlink:href="#hand" transform="rotate(60)" style="fill: #0000"/>
          <use id="DIALS-l3-o3"  xlink:href="#hand" transform="rotate(90)" style="fill: #0000"/>
          <use id="DIALS-l3-o4"  xlink:href="#hand" transform="rotate(120)" style="fill: #0000"/>
          <use id="DIALS-l3-o5"  xlink:href="#hand" transform="rotate(150)" style="fill: #0000"/>
          <use id="DIALS-l3-o6"  xlink:href="#hand" transform="rotate(180)" style="fill: #0000"/>
          <use id="DIALS-l3-o7"  xlink:href="#hand" transform="rotate(210)" style="fill: #0000"/>
          <use id="DIALS-l3-o8"  xlink:href="#hand" transform="rotate(240)" style="fill: #0000"/>
          <use id="DIALS-l3-o9"  xlink:href="#hand" transform="rotate(270)" style="fill: #0000"/>
          <use id="DIALS-l3-o10" xlink:href="#hand" transform="rotate(300)" style="fill: #0000"/>
          <use id="DIALS-l3-o11" xlink:href="#hand" transform="rotate(330)" style="fill: #0000"/>
        </g>
      </g>
      <g transform="translate(96, 96)">
        <circle id="FACES-l4-o0" stroke="#000000" style="fill: #90B8DF" r="20"></circle>
        <use xlink:href="#face_hours"/>
        <g>
          <use id="DIALS-l4-o0"  xlink:href="#hand" transform="rotate(0)" style="fill: #FFD000"/>
          <use id="DIALS-l4-o1"  xlink:href="#hand" transform="rotate(30)" style="fill: #0000"/>
          <use id="DIALS-l4-o2"  xlink:href="#hand" transform="rotate(60)" style="fill: #0000"/>
          <use id="DIALS-l4-o3"  xlink:href="#hand" transform="rotate(90)" style="fill: #0000"/>
          <use id="DIALS-l4-o4"  xlink:href="#hand" transform="rotate(120)" style="fill: #0000"/>
          <use id="DIALS-l4-o5"  xlink:href="#hand" transform="rotate(150)" style="fill: #0000"/>
          <use id="DIALS-l4-o6"  xlink:href="#hand" transform="rotate(180)" style="fill: #0000"/>
          <use id="DIALS-l4-o7"  xlink:href="#hand" transform="rotate(210)" style="fill: #0000"/>
          <use id="DIALS-l4-o8"  xlink:href="#hand" transform="rotate(240)" style="fill: #0000"/>
          <use id="DIALS-l4-o9"  xlink:href="#hand" transform="rotate(270)" style="fill: #0000"/>
          <use id="DIALS-l4-o10" xlink:href="#hand" transform="rotate(300)" style="fill: #0000"/>
          <use id="DIALS-l4-o11" xlink:href="#hand" transform="rotate(330)" style="fill: #0000"/>
        </g>
      </g>
      <g transform="translate(156, 96)">
        <circle id="FACES-l5-o0" stroke="#000000" style="fill: #90B8DF" r="20"></circle>
        <use xlink:href="#face_hours"/>
        <g>
          <use id="DIALS-l5-o0"  xlink:href="#hand" transform="rotate(0)" style="fill: #FFD000"/>
          <use id="DIALS-l5-o1"  xlink:href="#hand" transform="rotate(30)" style="fill: #0000"/>
          <use id="DIALS-l5-o2"  xlink:href="#hand" transform="rotate(60)" style="fill: #0000"/>
          <use id="DIALS-l5-o3"  xlink:href="#hand" transform="rotate(90)" style="fill: #0000"/>
          <use id="DIALS-l5-o4"  xlink:href="#hand" transform="rotate(120)" style="fill: #0000"/>
          <use id="DIALS-l5-o5"  xlink:href="#hand" transform="rotate(150)" style="fill: #0000"/>
          <use id="DIALS-l5-o6"  xlink:href="#hand" transform="rotate(180)" style="fill: #0000"/>
          <use id="DIALS-l5-o7"  xlink:href="#hand" transform="rotate(210)" style="fill: #0000"/>
          <use id="DIALS-l5-o8"  xlink:href="#hand" transform="rotate(240)" style="fill: #0000"/>
          <use id="DIALS-l5-o9"  xlink:href="#hand" transform="rotate(270)" style="fill: #0000"/>
          <use id="DIALS-l5-o10" xlink:href="#hand" transform="rotate(300)" style="fill: #0000"/>
          <use id="DIALS-l5-o11" xlink:href="#hand" transform="rotate(330)" style="fill: #0000"/>
        </g>
      </g>
      <g transform="translate(36, 156)">
        <circle id="FACES-l6-o0" stroke="#000000" style="fill: #90B8DF" r="20"></circle>
        <use xlink:href="#face_hours"/>
        <g>
          <use id="DIALS-l6-o0"  xlink:href="#hand" transform="rotate(0)" style="fill: #FFD000"/>
          <use id="DIALS-l6-o1"  xlink:href="#hand" transform="rotate(30)" style="fill: #0000"/>
          <use id="DIALS-l6-o2"  xlink:href="#hand" transform="rotate(60)" style="fill: #0000"/>
          <use id="DIALS-l6-o3"  xlink:href="#hand" transform="rotate(90)" style="fill: #0000"/>
          <use id="DIALS-l6-o4"  xlink:href="#hand" transform="rotate(120)" style="fill: #0000"/>
          <use id="DIALS-l6-o5"  xlink:href="#hand" transform="rotate(150)" style="fill: #0000"/>
          <use id="DIALS-l6-o6"  xlink:href="#hand" transform="rotate(180)" style="fill: #0000"/>
          <use id="DIALS-l6-o7"  xlink:href="#hand" transform="rotate(210)" style="fill: #0000"/>
          <use id="DIALS-l6-o8"  xlink:href="#hand" transform="rotate(240)" style="fill: #0000"/>
          <use id="DIALS-l6-o9"  xlink:href="#hand" transform="rotate(270)" style="fill: #0000"/>
          <use id="DIALS-l6-o10" xlink:href="#hand" transform="rotate(300)" style="fill: #0000"/>
          <use id="DIALS-l6-o11" xlink:href="#hand" transform="rotate(330)" style="fill: #0000"/>
        </g>
      </g>
      <g transform="translate(96, 156)">
        <circle id="FACES-l7-o0" stroke="#000000" style="fill: #90B8DF" r="20"></circle>
        <use xlink:href="#face_hours"/>
        <g>
          <use id="DIALS-l7-o0"  xlink:href="#hand" transform="rotate(0)" style="fill: #FFD000"/>
          <use id="DIALS-l7-o1"  xlink:href="#hand" transform="rotate(30)" style="fill: #0000"/>
          <use id="DIALS-l7-o2"  xlink:href="#hand" transform="rotate(60)" style="fill: #0000"/>
          <use id="DIALS-l7-o3"  xlink:href="#hand" transform="rotate(90)" style="fill: #0000"/>
          <use id="DIALS-l7-o4"  xlink:href="#hand" transform="rotate(120)" style="fill: #0000"/>
          <use id="DIALS-l7-o5"  xlink:href="#hand" transform="rotate(150)" style="fill: #0000"/>
          <use id="DIALS-l7-o6"  xlink:href="#hand" transform="rotate(180)" style="fill: #0000"/>
          <use id="DIALS-l7-o7"  xlink:href="#hand" transform="rotate(210)" style="fill: #0000"/>
          <use id="DIALS-l7-o8"  xlink:href="#hand" transform="rotate(240)" style="fill: #0000"/>
          <use id="DIALS-l7-o9"  xlink:href="#hand" transform="rotate(270)" style="fill: #0000"/>
          <use id="DIALS-l7-o10" xlink:href="#hand" transform="rotate(300)" style="fill: #0000"/>
          <use id="DIALS-l7-o11" xlink:href="#hand" transform="rotate(330)" style="fill: #0000"/>
        </g>
      </g>
      <g transform="translate(156, 156)">
        <circle id="FACES-l8-o0" stroke="#000000" style="fill: #90B8DF" r="20"></circle>
        <use xlink:href="#face_hours"/>
        <g>
          <use id="DIALS-l8-o0"  xlink:href="#hand" transform="rotate(0)" style="fill: #FFD000"/>
          <use id="DIALS-l8-o1"  xlink:href="#hand" transform="rotate(30)" style="fill: #0000"/>
          <use id="DIALS-l8-o2"  xlink:href="#hand" transform="rotate(60)" style="fill: #0000"/>
          <use id="DIALS-l8-o3"  xlink:href="#hand" transform="rotate(90)" style="fill: #0000"/>
          <use id="DIALS-l8-o4"  xlink:href="#hand" transform="rotate(120)" style="fill: #0000"/>
          <use id="DIALS-l8-o5"  xlink:href="#hand" transform="rotate(150)" style="fill: #0000"/>
          <use id="DIALS-l8-o6"  xlink:href="#hand" transform="rotate(180)" style="fill: #0000"/>
          <use id="DIALS-l8-o7"  xlink:href="#hand" transform="rotate(210)" style="fill: #0000"/>
          <use id="DIALS-l8-o8"  xlink:href="#hand" transform="rotate(240)" style="fill: #0000"/>
          <use id="DIALS-l8-o9"  xlink:href="#hand" transform="rotate(270)" style="fill: #0000"/>
          <use id="DIALS-l8-o10" xlink:href="#hand" transform="rotate(300)" style="fill: #0000"/>
          <use id="DIALS-l8-o11" xlink:href="#hand" transform="rotate(330)" style="fill: #0000"/>
        </g>
      </g>
    </g>
    <g transform="translate(264, 24)">
      <use xlink:href="#frame" id="FRAME-l0-o1" style="fill: #90B8DF"/>
      <use xlink:href="#pegs" transform="translate(36, 36)"/>
      <g transform="translate(36, 36)">
        <circle id="FACES-l9-o0" stroke="#000000" style="fill: #0C5093" r="20"></circle>
        <use xlink:href="#face_hours"/>
        <g>
          <use id="DIALS-l9-o0"  xlink:href="#hand" transform="rotate(0)" style="fill: #FFD000"/>
          <use id="DIALS-l9-o1"  xlink:href="#hand" transform="rotate(30)" style="fill: #0000"/>
          <use id="DIALS-l9-o2"  xlink:href="#hand" transform="rotate(60)" style="fill: #0000"/>
          <use id="DIALS-l9-o3"  xlink:href="#hand" transform="rotate(90)" style="fill: #0000"/>
          <use id="DIALS-l9-o4"  xlink:href="#hand" transform="rotate(120)" style="fill: #0000"/>
          <use id="DIALS-l9-o5"  xlink:href="#hand" transform="rotate(150)" style="fill: #0000"/>
          <use id="DIALS-l9-o6"  xlink:href="#hand" transform="rotate(180)" style="fill: #0000"/>
          <use id="DIALS-l9-o7"  xlink:href="#hand" transform="rotate(210)" style="fill: #0000"/>
          <use id="DIALS-l9-o8"  xlink:href="#hand" transform="rotate(240)" style="fill: #0000"/>
          <use id="DIALS-l9-o9"  xlink:href="#hand" transform="rotate(270)" style="fill: #0000"/>
          <use id="DIALS-l9-o10" xlink:href="#hand" transform="rotate(300)" style="fill: #0000"/>
          <use id="DIALS-l9-o11" xlink:href="#hand" transform="rotate(330)" style="fill: #0000"/>
        </g>
      </g>
      <g transform="translate(96, 36)">
        <circle id="FACES-l10-o0" stroke="#000000" style="fill: #0C5093" r="20"></circle>
        <use xlink:href="#face_hours"/>
        <g>
          <use id="DIALS-l10-o0"  xlink:href="#hand" transform="rotate(0)" style="fill: #FFD000"/>
          <use id="DIALS-l10-o1"  xlink:href="#hand" transform="rotate(30)" style="fill: #0000"/>
          <use id="DIALS-l10-o2"  xlink:href="#hand" transform="rotate(60)" style="fill: #0000"/>
          <use id="DIALS-l10-o3"  xlink:href="#hand" transform="rotate(90)" style="fill: #0000"/>
          <use id="DIALS-l10-o4"  xlink:href="#hand" transform="rotate(120)" style="fill: #0000"/>
          <use id="DIALS-l10-o5"  xlink:href="#hand" transform="rotate(150)" style="fill: #0000"/>
          <use id="DIALS-l10-o6"  xlink:href="#hand" transform="rotate(180)" style="fill: #0000"/>
          <use id="DIALS-l10-o7"  xlink:href="#hand" transform="rotate(210)" style="fill: #0000"/>
          <use id="DIALS-l10-o8"  xlink:href="#hand" transform="rotate(240)" style="fill: #0000"/>
          <use id="DIALS-l10-o9"  xlink:href="#hand" transform="rotate(270)" style="fill: #0000"/>
          <use id="DIALS-l10-o10" xlink:href="#hand" transform="rotate(300)" style="fill: #0000"/>
          <use id="DIALS-l10-o11" xlink:href="#hand" transform="rotate(330)" style="fill: #0000"/>
        </g>
      </g>
      <g transform="translate(156, 36)">
        <circle id="FACES-l11-o0" stroke="#000000" style="fill: #0C5093" r="20"></circle>
        <use xlink:href="#face_hours"/>
        <g>
          <use id="DIALS-l11-o0"  xlink:href="#hand" transform="rotate(0)" style="fill: #FFD000"/>
          <use id="DIALS-l11-o1"  xlink:href="#hand" transform="rotate(30)" style="fill: #0000"/>
          <use id="DIALS-l11-o2"  xlink:href="#hand" transform="rotate(60)" style="fill: #0000"/>
          <use id="DIALS-l11-o3"  xlink:href="#hand" transform="rotate(90)" style="fill: #0000"/>
          <use id="DIALS-l11-o4"  xlink:href="#hand" transform="rotate(120)" style="fill: #0000"/>
          <use id="DIALS-l11-o5"  xlink:href="#hand" transform="rotate(150)" style="fill: #0000"/>
          <use id="DIALS-l11-o6"  xlink:href="#hand" transform="rotate(180)" style="fill: #0000"/>
          <use id="DIALS-l11-o7"  xlink:href="#hand" transform="rotate(210)" style="fill: #0000"/>
          <use id="DIALS-l11-o8"  xlink:href="#hand" transform="rotate(240)" style="fill: #0000"/>
          <use id="DIALS-l11-o9"  xlink:href="#hand" transform="rotate(270)" style="fill: #0000"/>
          <use id="DIALS-l11-o10" xlink:href="#hand" transform="rotate(300)" style="fill: #0000"/>
          <use id="DIALS-l11-o11" xlink:href="#hand" transform="rotate(330)" style="fill: #0000"/>
        </g>
      </g>
      <g transform="translate(36, 96)">
        <circle id="FACES-l12-o0" stroke="#000000" style="fill: #0C5093" r="20"></circle>
        <use xlink:href="#face_hours"/>
        <g>
          <use id="DIALS-l12-o0"  xlink:href="#hand" transform="rotate(0)" style="fill: #FFD000"/>
          <use id="DIALS-l12-o1"  xlink:href="#hand" transform="rotate(30)" style="fill: #0000"/>
          <use id="DIALS-l12-o2"  xlink:href="#hand" transform="rotate(60)" style="fill: #0000"/>
          <use id="DIALS-l12-o3"  xlink:href="#hand" transform="rotate(90)" style="fill: #0000"/>
          <use id="DIALS-l12-o4"  xlink:href="#hand" transform="rotate(120)" style="fill: #0000"/>
          <use id="DIALS-l12-o5"  xlink:href="#hand" transform="rotate(150)" style="fill: #0000"/>
          <use id="DIALS-l12-o6"  xlink:href="#hand" transform="rotate(180)" style="fill: #0000"/>
          <use id="DIALS-l12-o7"  xlink:href="#hand" transform="rotate(210)" style="fill: #0000"/>
          <use id="DIALS-l12-o8"  xlink:href="#hand" transform="rotate(240)" style="fill: #0000"/>
          <use id="DIALS-l12-o9"  xlink:href="#hand" transform="rotate(270)" style="fill: #0000"/>
          <use id="DIALS-l12-o10" xlink:href="#hand" transform="rotate(300)" style="fill: #0000"/>
          <use id="DIALS-l12-o11" xlink:href="#hand" transform="rotate(330)" style="fill: #0000"/>
        </g>
      </g>
      <g transform="translate(96, 96)">
        <circle id="FACES-l13-o0" stroke="#000000" style="fill: #0C5093" r="20"></circle>
        <use xlink:href="#face_hours"/>
        <g>
          <use id="DIALS-l13-o0"  xlink:href="#hand" transform="rotate(0)" style="fill: #FFD000"/>
          <use id="DIALS-l13-o1"  xlink:href="#hand" transform="rotate(30)" style="fill: #0000"/>
          <use id="DIALS-l13-o2"  xlink:href="#hand" transform="rotate(60)" style="fill: #0000"/>
          <use id="DIALS-l13-o3"  xlink:href="#hand" transform="rotate(90)" style="fill: #0000"/>
          <use id="DIALS-l13-o4"  xlink:href="#hand" transform="rotate(120)" style="fill: #0000"/>
          <use id="DIALS-l13-o5"  xlink:href="#hand" transform="rotate(150)" style="fill: #0000"/>
          <use id="DIALS-l13-o6"  xlink:href="#hand" transform="rotate(180)" style="fill: #0000"/>
          <use id="DIALS-l13-o7"  xlink:href="#hand" transform="rotate(210)" style="fill: #0000"/>
          <use id="DIALS-l13-o8"  xlink:href="#hand" transform="rotate(240)" style="fill: #0000"/>
          <use id="DIALS-l13-o9"  xlink:href="#hand" transform="rotate(270)" style="fill: #0000"/>
          <use id="DIALS-l13-o10" xlink:href="#hand" transform="rotate(300)" style="fill: #0000"/>
          <use id="DIALS-l13-o11" xlink:href="#hand" transform="rotate(330)" style="fill: #0000"/>
        </g>
      </g>
      <g transform="translate(156, 96)">
        <circle id="FACES-l14-o0" stroke="#000000" style="fill: #0C5093" r="20"></circle>
        <use xlink:href="#face_hours"/>
        <g>
          <use id="DIALS-l14-o0"  xlink:href="#hand" transform="rotate(0)" style="fill: #FFD000"/>
          <use id="DIALS-l14-o1"  xlink:href="#hand" transform="rotate(30)" style="fill: #0000"/>
          <use id="DIALS-l14-o2"  xlink:href="#hand" transform="rotate(60)" style="fill: #0000"/>
          <use id="DIALS-l14-o3"  xlink:href="#hand" transform="rotate(90)" style="fill: #0000"/>
          <use id="DIALS-l14-o4"  xlink:href="#hand" transform="rotate(120)" style="fill: #0000"/>
          <use id="DIALS-l14-o5"  xlink:href="#hand" transform="rotate(150)" style="fill: #0000"/>
          <use id="DIALS-l14-o6"  xlink:href="#hand" transform="rotate(180)" style="fill: #0000"/>
          <use id="DIALS-l14-o7"  xlink:href="#hand" transform="rotate(210)" style="fill: #0000"/>
          <use id="DIALS-l14-o8"  xlink:href="#hand" transform="rotate(240)" style="fill: #0000"/>
          <use id="DIALS-l14-o9"  xlink:href="#hand" transform="rotate(270)" style="fill: #0000"/>
          <use id="DIALS-l14-o10" xlink:href="#hand" transform="rotate(300)" style="fill: #0000"/>
          <use id="DIALS-l14-o11" xlink:href="#hand" transform="rotate(330)" style="fill: #0000"/>
        </g>
      </g>
      <g transform="translate(36, 156)">
        <circle id="FACES-l15-o0" stroke="#000000" style="fill: #0C5093" r="20"></circle>
        <use xlink:href="#face_hours"/>
        <g>
          <use id="DIALS-l15-o0"  xlink:href="#hand" transform="rotate(0)" style="fill: #FFD000"/>
          <use id="DIALS-l15-o1"  xlink:href="#hand" transform="rotate(30)" style="fill: #0000"/>
          <use id="DIALS-l15-o2"  xlink:href="#hand" transform="rotate(60)" style="fill: #0000"/>
          <use id="DIALS-l15-o3"  xlink:href="#hand" transform="rotate(90)" style="fill: #0000"/>
          <use id="DIALS-l15-o4"  xlink:href="#hand" transform="rotate(120)" style="fill: #0000"/>
          <use id="DIALS-l15-o5"  xlink:href="#hand" transform="rotate(150)" style="fill: #0000"/>
          <use id="DIALS-l15-o6"  xlink:href="#hand" transform="rotate(180)" style="fill: #0000"/>
          <use id="DIALS-l15-o7"  xlink:href="#hand" transform="rotate(210)" style="fill: #0000"/>
          <use id="DIALS-l15-o8"  xlink:href="#hand" transform="rotate(240)" style="fill: #0000"/>
          <use id="DIALS-l15-o9"  xlink:href="#hand" transform="rotate(270)" style="fill: #0000"/>
          <use id="DIALS-l15-o10" xlink:href="#hand" transform="rotate(300)" style="fill: #0000"/>
          <use id="DIALS-l15-o11" xlink:href="#hand" transform="rotate(330)" style="fill: #0000"/>
        </g>
      </g>
      <g transform="translate(96, 156)">
        <circle id="FACES-l16-o0" stroke="#000000" style="fill: #0C5093" r="20"></circle>
        <use xlink:href="#face_hours"/>
        <g>
          <use id="DIALS-l16-o0"  xlink:href="#hand" transform="rotate(0)" style="fill: #FFD000"/>
          <use id="DIALS-l16-o1"  xlink:href="#hand" transform="rotate(30)" style="fill: #0000"/>
          <use id="DIALS-l16-o2"  xlink:href="#hand" transform="rotate(60)" style="fill: #0000"/>
          <use id="DIALS-l16-o3"  xlink:href="#hand" transform="rotate(90)" style="fill: #0000"/>
          <use id="DIALS-l16-o4"  xlink:href="#hand" transform="rotate(120)" style="fill: #0000"/>
          <use id="DIALS-l16-o5"  xlink:href="#hand" transform="rotate(150)" style="fill: #0000"/>
          <use id="DIALS-l16-o6"  xlink:href="#hand" transform="rotate(180)" style="fill: #0000"/>
          <use id="DIALS-l16-o7"  xlink:href="#hand" transform="rotate(210)" style="fill: #0000"/>
          <use id="DIALS-l16-o8"  xlink:href="#hand" transform="rotate(240)" style="fill: #0000"/>
          <use id="DIALS-l16-o9"  xlink:href="#hand" transform="rotate(270)" style="fill: #0000"/>
          <use id="DIALS-l16-o10" xlink:href="#hand" transform="rotate(300)" style="fill: #0000"/>
          <use id="DIALS-l16-o11" xlink:href="#hand" transform="rotate(330)" style="fill: #0000"/>
        </g>
      </g>
      <g transform="translate(156, 156)">
        <circle id="FACES-l17-o0" stroke="#000000" style="fill: #0C5093" r="20"></circle>
        <use xlink:href="#face_hours"/>
        <g>
          <use id="DIALS-l17-o0"  xlink:href="#hand" transform="rotate(0)" style="fill: #FFD000"/>
          <use id="DIALS-l17-o1"  xlink:href="#hand" transform="rotate(30)" style="fill: #0000"/>
          <use id="DIALS-l17-o2"  xlink:href="#hand" transform="rotate(60)" style="fill: #0000"/>
          <use id="DIALS-l17-o3"  xlink:href="#hand" transform="rotate(90)" style="fill: #0000"/>
          <use id="DIALS-l17-o4"  xlink:href="#hand" transform="rotate(120)" style="fill: #0000"/>
          <use id="DIALS-l17-o5"  xlink:href="#hand" transform="rotate(150)" style="fill: #0000"/>
          <use id="DIALS-l17-o6"  xlink:href="#hand" transform="rotate(180)" style="fill: #0000"/>
          <use id="DIALS-l17-o7"  xlink:href="#hand" transform="rotate(210)" style="fill: #0000"/>
          <use id="DIALS-l17-o8"  xlink:href="#hand" transform="rotate(240)" style="fill: #0000"/>
          <use id="DIALS-l17-o9"  xlink:href="#hand" transform="rotate(270)" style="fill: #0000"/>
          <use id="DIALS-l17-o10" xlink:href="#hand" transform="rotate(300)" style="fill: #0000"/>
          <use id="DIALS-l17-o11" xlink:href="#hand" transform="rotate(330)" style="fill: #0000"/>
        </g>
      </g>
    </g>
  </g>
</svg>`;
  }
});

// src/cubing/puzzles/implementations/dynamic/side-events/pyraminx.kpuzzle.svg.ts
var pyraminxSVG;
var init_pyraminx_kpuzzle_svg = __esm({
  "src/cubing/puzzles/implementations/dynamic/side-events/pyraminx.kpuzzle.svg.ts"() {
    "use strict";
    pyraminxSVG = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN"
       "http://www.w3.org/TR/2001/REC-SVG-20050904/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-20 -20 546 480" preserveAspectRatio="xMidYMid meet">
  <defs>
  </defs>
  <title>pyraminx</title>
  <defs>
    <g id="stickerA" transform="scale(1, 0.577350269)">
      <path
         d="m 0,1.732050808 1,-1.732050808 1,1.732050808 z"
         stroke="black" stroke-width="0.04px" stroke-linecap="butt" stroke-linejoin="round"
      />
    </g>
    <g id="stickerV" transform="scale(1, 0.577350269)">
      <path
         d="m 0,0 1,1.732050808 1,-1.732050808 z"
         stroke="black" stroke-width="0.04px" stroke-linecap="butt" stroke-linejoin="round"
      />
    </g>
  </defs>

<!--        0 1 2 3 4 5 6 7 8 9 10   -->
<!--        | | | | | | | | | | |    -->
<!--    0 - L L L L L F R R R R R    -->
<!--    1 -   L L L F F F R R R      -->
<!--    2 -     L F F F F F R        -->
<!--    3 -       D D D D D          -->
<!--    4 -         D D D            -->
<!--    5 -           D              -->

  <g id="puzzle" transform="translate(5, 5) scale(40, 69.28203232)">
    <!-- CORNERS -->
    <use id="CORNERS-l0-o0" xlink:href="#stickerV" transform="translate(5.2, 1.066666667)" style="fill: limegreen"/>
    <use id="CORNERS-l0-o1" xlink:href="#stickerA" transform="translate(3, 0)" style="fill: red"/>
    <use id="CORNERS-l0-o2" xlink:href="#stickerA" transform="translate(7.4, 0)" style="fill: blue"/>

    <use id="CORNERS-l3-o0" xlink:href="#stickerA" transform="translate(4.2, 3.2)" style="fill: yellow"/>
    <use id="CORNERS-l3-o1" xlink:href="#stickerA" transform="translate(2, 1)" style="fill: red"/>
    <use id="CORNERS-l3-o2" xlink:href="#stickerV" transform="translate(4.2, 2.066666667)" style="fill: limegreen"/>

    <use id="CORNERS-l2-o0" xlink:href="#stickerA" transform="translate(6.2, 3.2)" style="fill: yellow"/>
    <use id="CORNERS-l2-o1" xlink:href="#stickerV" transform="translate(6.2, 2.066666667)" style="fill: limegreen"/>
    <use id="CORNERS-l2-o2" xlink:href="#stickerA" transform="translate(8.4, 1)" style="fill: blue"/>

    <use id="CORNERS-l1-o1" xlink:href="#stickerA" transform="translate(9.4, 0)" style="fill: blue"/>
    <use id="CORNERS-l1-o2" xlink:href="#stickerA" transform="translate(1, 0)" style="fill: red"/>
    <use id="CORNERS-l1-o0" xlink:href="#stickerA" transform="translate(5.2, 4.2)" style="fill: yellow"/>

    <!-- "TIPS" -->
    <!-- CORNERS2 -->
    <use id="CORNERS2-l0-o0" xlink:href="#stickerA" transform="translate(5.2, 0.066666667)" style="fill: limegreen"/>
    <use id="CORNERS2-l0-o1" xlink:href="#stickerV" transform="translate(4, 0)" style="fill: red"/>
    <use id="CORNERS2-l0-o2" xlink:href="#stickerV" transform="translate(6.4, 0)" style="fill: blue"/>

    <use id="CORNERS2-l3-o0" xlink:href="#stickerV" transform="translate(3.2, 3.2)" style="fill: yellow"/>
    <use id="CORNERS2-l3-o1" xlink:href="#stickerV" transform="translate(2, 2)" style="fill: red"/>
    <use id="CORNERS2-l3-o2" xlink:href="#stickerA" transform="translate(3.2, 2.066666667)" style="fill: limegreen"/>

    <use id="CORNERS2-l2-o0" xlink:href="#stickerV" transform="translate(7.2, 3.2)" style="fill: yellow"/>
    <use id="CORNERS2-l2-o1" xlink:href="#stickerA" transform="translate(7.2, 2.066666667)" style="fill: limegreen"/>
    <use id="CORNERS2-l2-o2" xlink:href="#stickerV" transform="translate(8.4, 2)" style="fill: blue"/>

    <use id="CORNERS2-l1-o1" xlink:href="#stickerV" transform="translate(10.4,0)" style="fill: blue"/>
    <use id="CORNERS2-l1-o2" xlink:href="#stickerV" transform="translate(0, 0)" style="fill: red"/>
    <use id="CORNERS2-l1-o0" xlink:href="#stickerV" transform="translate(5.2, 5.2)" style="fill: yellow"/>

    <!-- EDGES -->
    <use id="EDGES-l0-o0" xlink:href="#stickerV" transform="translate(3, 1)" style="fill: red"/>
    <use id="EDGES-l0-o1" xlink:href="#stickerA" transform="translate(4.2, 1.066666667)" style="fill: limegreen"/>

    <use id="EDGES-l5-o0" xlink:href="#stickerA" transform="translate(6.2, 1.066666667)" style="fill: limegreen"/>
    <use id="EDGES-l5-o1" xlink:href="#stickerV" transform="translate(7.4, 1)" style="fill: blue"/>

    <use id="EDGES-l1-o0" xlink:href="#stickerV" transform="translate(8.4, 0)" style="fill: blue"/>
    <use id="EDGES-l1-o1" xlink:href="#stickerV" transform="translate(2, 0)" style="fill: red"/>

    <use id="EDGES-l2-o0" xlink:href="#stickerV" transform="translate(5.2, 3.2)" style="fill: yellow"/>
    <use id="EDGES-l2-o1" xlink:href="#stickerA" transform="translate(5.2, 2.066666667)" style="fill: limegreen"/>

    <use id="EDGES-l3-o0" xlink:href="#stickerV" transform="translate(9.4, 1)" style="fill: blue"/>
    <use id="EDGES-l3-o1" xlink:href="#stickerV" transform="translate(6.2, 4.2)" style="fill: yellow"/>

    <use id="EDGES-l4-o0" xlink:href="#stickerV" transform="translate(4.2, 4.2)" style="fill: yellow"/>
    <use id="EDGES-l4-o1" xlink:href="#stickerV" transform="translate(1, 1)" style="fill: red"/>
  </g>

</svg>`;
  }
});

// src/cubing/puzzles/implementations/dynamic/side-events/sq1-hyperorbit.kpuzzle.json.ts
var sq1HyperOrbitJSON;
var init_sq1_hyperorbit_kpuzzle_json = __esm({
  "src/cubing/puzzles/implementations/dynamic/side-events/sq1-hyperorbit.kpuzzle.json.ts"() {
    "use strict";
    sq1HyperOrbitJSON = {
      name: "Square-1",
      orbits: {
        WEDGES: { numPieces: 24, numOrientations: 9 },
        EQUATOR: { numPieces: 2, numOrientations: 6 }
      },
      startStateData: {
        WEDGES: {
          pieces: [
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            19,
            20,
            21,
            22,
            23
          ],
          orientation: [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
          ]
        },
        EQUATOR: { pieces: [0, 1], orientation: [0, 0] }
      },
      moves: {
        U_SQ_: {
          WEDGES: {
            permutation: [
              11,
              0,
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              12,
              13,
              14,
              15,
              16,
              17,
              18,
              19,
              20,
              21,
              22,
              23
            ],
            orientation: [
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0
            ]
          },
          EQUATOR: { permutation: [0, 1], orientation: [0, 0] }
        },
        D_SQ_: {
          WEDGES: {
            permutation: [
              0,
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              23,
              12,
              13,
              14,
              15,
              16,
              17,
              18,
              19,
              20,
              21,
              22
            ],
            orientation: [
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0
            ]
          },
          EQUATOR: { permutation: [0, 1], orientation: [0, 0] }
        },
        _SLASH_: {
          WEDGES: {
            permutation: [
              0,
              1,
              2,
              3,
              4,
              5,
              12,
              13,
              14,
              15,
              16,
              17,
              6,
              7,
              8,
              9,
              10,
              11,
              18,
              19,
              20,
              21,
              22,
              23
            ],
            orientation: [
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0
            ]
          },
          EQUATOR: { permutation: [0, 1], orientation: [0, 3] }
        }
      }
    };
  }
});

// src/cubing/puzzles/implementations/dynamic/side-events/sq1-hyperorbit.kpuzzle.svg.ts
var sq1HyperOrbitSVG;
var init_sq1_hyperorbit_kpuzzle_svg = __esm({
  "src/cubing/puzzles/implementations/dynamic/side-events/sq1-hyperorbit.kpuzzle.svg.ts"() {
    "use strict";
    sq1HyperOrbitSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="360px" height="552px" viewBox="0 0 360 552" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: Sketch 59.1 (86144) - https://sketch.com -->
    <title>sq1-fancy</title>
    <desc>Created with Sketch.</desc>
    <!-- stroke="none" -->
    <g id="sq1-fancy" stroke="#888" stroke-width="0.25" fill="none" fill-rule="evenodd">
        <g id="EQUATOR" transform="translate(24.000000, 264.000000)">
            <rect id="EQUATOR-l1-o3" style="fill: red" x="168" y="0" width="24" height="24"></rect>
            <rect id="EQUATOR-l1-o4" style="fill: red" x="192" y="0" width="24" height="24"></rect>
            <rect id="EQUATOR-l1-o5" style="fill: limegreen" x="216" y="0" width="24" height="24"></rect>
            <rect id="EQUATOR-l1-o2" style="fill: limegreen" x="240" y="0" width="24" height="24"></rect>
            <rect id="EQUATOR-l1-o1" style="fill: limegreen" x="264" y="0" width="24" height="24"></rect>
            <rect id="EQUATOR-l1-o0" style="fill: orange" x="288" y="0" width="24" height="24"></rect>
            <rect id="EQUATOR-l0-o3" style="fill: orange" x="0" y="0" width="24" height="24"></rect>
            <rect id="EQUATOR-l0-o4" style="fill: orange" x="24" y="0" width="24" height="24"></rect>
            <rect id="EQUATOR-l0-o5" style="fill: #26f" x="48" y="0" width="24" height="24"></rect>
            <rect id="EQUATOR-l0-o2" style="fill: #26f" x="72" y="0" width="24" height="24"></rect>
            <rect id="EQUATOR-l0-o1" style="fill: #26f" x="96" y="0" width="24" height="24"></rect>
            <rect id="EQUATOR-l0-o0" style="fill: red" x="120" y="0" width="24" height="24"></rect>
        </g>
        <g id="BOTTOM" transform="translate(41.000000, 257.000000)" stroke-linejoin="round">
            <g id="WEDGES-23" transform="translate(130.000000, 88.588457) rotate(120.000000) translate(-130.000000, -88.588457) translate(82.000000, 22.588457)">
                <polygon id="WEDGES-l23-o8" style="fill: #D8D8D8" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l23-o7" style="fill: red" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l23-o6" style="fill: red" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l23-o5" style="fill: red" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l23-o4" style="fill: red" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l23-o3" style="fill: white" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l23-o2" style="fill: white" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l23-o1" style="fill: white" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l23-o0" style="fill: red" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-22" transform="translate(97.157677, 115.157677) rotate(90.000000) translate(-97.157677, -115.157677) translate(49.157677, 49.157677)">
                <polygon id="WEDGES-l22-o8" style="fill: #26f" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l22-o7" style="fill: #D8D8D8" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l22-o6" style="fill: #26f" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l22-o5" style="fill: #26f" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l22-o4" style="fill: white" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l22-o3" style="fill: #26f" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l22-o2" style="fill: white" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l22-o1" style="fill: white" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l22-o0" style="fill: #26f" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-21" transform="translate(82.000000, 154.588457) rotate(60.000000) translate(-82.000000, -154.588457) translate(34.000000, 88.588457)">
                <polygon id="WEDGES-l21-o8" style="fill: #D8D8D8" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l21-o7" style="fill: #D8D8D8" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l21-o6" style="fill: #D8D8D8" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l21-o5" style="fill: #26f" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l21-o4" style="fill: #26f" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l21-o3" style="fill: #26f" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l21-o2" style="fill: #26f" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l21-o1" style="fill: white" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l21-o0" style="fill: #26f" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-20" transform="translate(88.588457, 196.315353) rotate(30.000000) translate(-88.588457, -196.315353) translate(40.588457, 130.315353)">
                <polygon id="WEDGES-l20-o8" style="fill: #D8D8D8" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l20-o7" style="fill: #26f" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l20-o6" style="fill: #26f" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l20-o5" style="fill: #26f" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l20-o4" style="fill: #26f" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l20-o3" style="fill: white" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l20-o2" style="fill: white" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l20-o1" style="fill: white" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l20-o0" style="fill: #26f" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-19" transform="translate(67.157677, 163.157677)">
                <polygon id="WEDGES-l19-o8" style="fill: orange" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l19-o7" style="fill: #D8D8D8" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l19-o6" style="fill: orange" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l19-o5" style="fill: orange" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l19-o4" style="fill: white" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l19-o3" style="fill: orange" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l19-o2" style="fill: white" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l19-o1" style="fill: white" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l19-o0" style="fill: orange" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-18" transform="translate(154.588457, 244.315353) scale(-1, -1) rotate(150.000000) translate(-154.588457, -244.315353) translate(106.588457, 178.315353)">
                <polygon id="WEDGES-l18-o8" style="fill: #D8D8D8" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l18-o7" style="fill: #D8D8D8" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l18-o6" style="fill: #D8D8D8" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l18-o5" style="fill: orange" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l18-o4" style="fill: orange" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l18-o3" style="fill: orange" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l18-o2" style="fill: orange" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l18-o1" style="fill: white" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l18-o0" style="fill: orange" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-17" transform="translate(196.315353, 237.726896) scale(-1, -1) rotate(120.000000) translate(-196.315353, -237.726896) translate(148.315353, 171.726896)">
                <polygon id="WEDGES-l17-o8" style="fill: #D8D8D8" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l17-o7" style="fill: orange" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l17-o6" style="fill: orange" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l17-o5" style="fill: orange" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l17-o4" style="fill: orange" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l17-o3" style="fill: white" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l17-o2" style="fill: white" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l17-o1" style="fill: white" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l17-o0" style="fill: orange" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-16" transform="translate(229.157677, 211.157677) scale(-1, -1) rotate(90.000000) translate(-229.157677, -211.157677) translate(181.157677, 145.157677)">
                <polygon id="WEDGES-l16-o8" style="fill: limegreen" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l16-o7" style="fill: #D8D8D8" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l16-o6" style="fill: limegreen" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l16-o5" style="fill: limegreen" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l16-o4" style="fill: white" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l16-o3" style="fill: limegreen" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l16-o2" style="fill: white" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l16-o1" style="fill: white" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l16-o0" style="fill: limegreen" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-15" transform="translate(244.315353, 171.726896) scale(-1, -1) rotate(60.000000) translate(-244.315353, -171.726896) translate(196.315353, 105.726896)">
                <polygon id="WEDGES-l15-o8" style="fill: #D8D8D8" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l15-o7" style="fill: #D8D8D8" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l15-o6" style="fill: #D8D8D8" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l15-o5" style="fill: limegreen" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l15-o4" style="fill: limegreen" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l15-o3" style="fill: limegreen" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l15-o2" style="fill: limegreen" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l15-o1" style="fill: white" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l15-o0" style="fill: limegreen" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-14" transform="translate(237.726896, 130.000000) scale(-1, -1) rotate(30.000000) translate(-237.726896, -130.000000) translate(189.726896, 64.000000)">
                <polygon id="WEDGES-l14-o8" style="fill: #D8D8D8" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l14-o7" style="fill: limegreen" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l14-o6" style="fill: limegreen" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l14-o5" style="fill: limegreen" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l14-o4" style="fill: limegreen" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l14-o3" style="fill: white" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l14-o2" style="fill: white" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l14-o1" style="fill: white" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l14-o0" style="fill: limegreen" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-13" transform="translate(211.157677, 97.157677) scale(-1, -1) translate(-211.157677, -97.157677) translate(163.157677, 31.157677)">
                <polygon id="WEDGES-l13-o8" style="fill: red" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l13-o7" style="fill: #D8D8D8" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l13-o6" style="fill: red" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l13-o5" style="fill: red" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l13-o4" style="fill: white" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l13-o3" style="fill: red" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l13-o2" style="fill: white" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l13-o1" style="fill: white" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l13-o0" style="fill: red" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-12" transform="translate(171.726896, 82.000000) rotate(150.000000) translate(-171.726896, -82.000000) translate(123.726896, 16.000000)">
                <polygon id="WEDGES-l12-o8" style="fill: #D8D8D8" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l12-o7" style="fill: #D8D8D8" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l12-o6" style="fill: #D8D8D8" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l12-o5" style="fill: red" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l12-o4" style="fill: red" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l12-o3" style="fill: red" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l12-o2" style="fill: red" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l12-o1" style="fill: white" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l12-o0" style="fill: red" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
        </g>
        <g id="TOP" transform="translate(41.000000, -31.000000)" stroke-linejoin="round">
            <g id="WEDGES-11" transform="translate(154.588457, 244.315353) scale(-1, -1) rotate(150.000000) translate(-154.588457, -244.315353) translate(106.588457, 178.315353)">
                <polygon id="WEDGES-l11-o8" style="fill: #D8D8D8" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l11-o7" style="fill: #D8D8D8" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l11-o6" style="fill: #D8D8D8" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l11-o5" style="fill: red" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l11-o4" style="fill: red" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l11-o3" style="fill: red" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l11-o2" style="fill: red" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l11-o1" style="fill: yellow" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l11-o0" style="fill: red" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-10" transform="translate(196.315353, 237.726896) scale(-1, -1) rotate(120.000000) translate(-196.315353, -237.726896) translate(148.315353, 171.726896)">
                <polygon id="WEDGES-l10-o8" style="fill: #D8D8D8" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l10-o7" style="fill: red" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l10-o6" style="fill: red" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l10-o5" style="fill: red" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l10-o4" style="fill: red" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l10-o3" style="fill: yellow" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l10-o2" style="fill: yellow" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l10-o1" style="fill: yellow" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l10-o0" style="fill: red" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-9" transform="translate(229.157677, 211.157677) scale(-1, -1) rotate(90.000000) translate(-229.157677, -211.157677) translate(181.157677, 145.157677)">
                <polygon id="WEDGES-l9-o8" style="fill: limegreen" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l9-o7" style="fill: #D8D8D8" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l9-o6" style="fill: limegreen" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l9-o5" style="fill: limegreen" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l9-o4" style="fill: yellow" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l9-o3" style="fill: limegreen" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l9-o2" style="fill: yellow" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l9-o1" style="fill: yellow" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l9-o0" style="fill: limegreen" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-8" transform="translate(244.315353, 171.726896) scale(-1, -1) rotate(60.000000) translate(-244.315353, -171.726896) translate(196.315353, 105.726896)">
                <polygon id="WEDGES-l8-o8" style="fill: #D8D8D8" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l8-o7" style="fill: #D8D8D8" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l8-o6" style="fill: #D8D8D8" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l8-o5" style="fill: limegreen" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l8-o4" style="fill: limegreen" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l8-o3" style="fill: limegreen" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l8-o2" style="fill: limegreen" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l8-o1" style="fill: yellow" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l8-o0" style="fill: limegreen" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-7" transform="translate(237.726896, 130.000000) scale(-1, -1) rotate(30.000000) translate(-237.726896, -130.000000) translate(189.726896, 64.000000)">
                <polygon id="WEDGES-l7-o8" style="fill: #D8D8D8" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l7-o7" style="fill: limegreen" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l7-o6" style="fill: limegreen" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l7-o5" style="fill: limegreen" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l7-o4" style="fill: limegreen" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l7-o3" style="fill: yellow" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l7-o2" style="fill: yellow" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l7-o1" style="fill: yellow" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l7-o0" style="fill: limegreen" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-6" transform="translate(211.157677, 97.157677) scale(-1, -1) translate(-211.157677, -97.157677) translate(163.157677, 31.157677)">
                <polygon id="WEDGES-l6-o8" style="fill: orange" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l6-o7" style="fill: #D8D8D8" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l6-o6" style="fill: orange" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l6-o5" style="fill: orange" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l6-o4" style="fill: yellow" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l6-o3" style="fill: orange" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l6-o2" style="fill: yellow" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l6-o1" style="fill: yellow" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l6-o0" style="fill: orange" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-5" transform="translate(171.726896, 82.000000) rotate(150.000000) translate(-171.726896, -82.000000) translate(123.726896, 16.000000)">
                <polygon id="WEDGES-l5-o8" style="fill: #D8D8D8" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l5-o7" style="fill: #D8D8D8" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l5-o6" style="fill: #D8D8D8" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l5-o5" style="fill: orange" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l5-o4" style="fill: orange" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l5-o3" style="fill: orange" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l5-o2" style="fill: orange" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l5-o1" style="fill: yellow" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l5-o0" style="fill: orange" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-4" transform="translate(130.000000, 88.588457) rotate(120.000000) translate(-130.000000, -88.588457) translate(82.000000, 22.588457)">
                <polygon id="WEDGES-l4-o8" style="fill: #D8D8D8" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l4-o7" style="fill: orange" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l4-o6" style="fill: orange" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l4-o5" style="fill: orange" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l4-o4" style="fill: orange" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l4-o3" style="fill: yellow" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l4-o2" style="fill: yellow" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l4-o1" style="fill: yellow" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l4-o0" style="fill: orange" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-3" transform="translate(97.157677, 115.157677) rotate(90.000000) translate(-97.157677, -115.157677) translate(49.157677, 49.157677)">
                <polygon id="WEDGES-l3-o8" style="fill: #26f" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l3-o7" style="fill: #D8D8D8" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l3-o6" style="fill: #26f" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l3-o5" style="fill: #26f" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l3-o4" style="fill: yellow" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l3-o3" style="fill: #26f" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l3-o2" style="fill: yellow" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l3-o1" style="fill: yellow" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l3-o0" style="fill: #26f" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-2" transform="translate(82.000000, 154.588457) rotate(60.000000) translate(-82.000000, -154.588457) translate(34.000000, 88.588457)">
                <polygon id="WEDGES-l2-o8" style="fill: #D8D8D8" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l2-o7" style="fill: #D8D8D8" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l2-o6" style="fill: #D8D8D8" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l2-o5" style="fill: #26f" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l2-o4" style="fill: #26f" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l2-o3" style="fill: #26f" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l2-o2" style="fill: #26f" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l2-o1" style="fill: yellow" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l2-o0" style="fill: #26f" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-1" transform="translate(88.588457, 196.315353) rotate(30.000000) translate(-88.588457, -196.315353) translate(40.588457, 130.315353)">
                <polygon id="WEDGES-l1-o8" style="fill: #D8D8D8" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l1-o7" style="fill: #26f" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l1-o6" style="fill: #26f" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l1-o5" style="fill: #26f" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l1-o4" style="fill: #26f" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l1-o3" style="fill: yellow" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l1-o2" style="fill: yellow" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l1-o1" style="fill: yellow" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l1-o0" style="fill: #26f" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-0" transform="translate(67.157677, 163.157677)">
                <polygon id="WEDGES-l0-o8" style="fill: red" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l0-o7" style="fill: #D8D8D8" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l0-o6" style="fill: red" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l0-o5" style="fill: red" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l0-o4" style="fill: yellow" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l0-o3" style="fill: red" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l0-o2" style="fill: yellow" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l0-o1" style="fill: yellow" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l0-o0" style="fill: red" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
        </g>
        <g id="DIAGONALS" transform="translate(168.861561, 1.019238)" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
            <line x1="0" y1="287.842323" x2="70.2768775" y2="550.119201" id="BOTTOM"></line>
            <line x1="0.15767665" y1="262.276878" x2="70.4345542" y2="2.27488928e-16" id="TOP"></line>
        </g>
    </g>
</svg>`;
  }
});

// src/cubing/puzzles/implementations/dynamic/side-events/melindas2x2x2x2.kpuzzle.json.ts
var orientation, range, melindas2x2x2x2OrbitJSON;
var init_melindas2x2x2x2_kpuzzle_json = __esm({
  "src/cubing/puzzles/implementations/dynamic/side-events/melindas2x2x2x2.kpuzzle.json.ts"() {
    "use strict";
    orientation = new Array(64).fill(0);
    range = orientation.map((_, i) => i);
    melindas2x2x2x2OrbitJSON = {
      name: "Melinda's 2x2x2x2",
      orbits: {
        CORNERS: { numPieces: 64, numOrientations: 1 }
      },
      startStateData: {
        CORNERS: {
          pieces: range,
          orientation
        }
      },
      moves: {
        Rx: {
          CORNERS: {
            permutation: [
              16,
              19,
              17,
              18,
              20,
              22,
              23,
              21,
              4,
              7,
              5,
              6,
              0,
              2,
              3,
              1,
              28,
              30,
              31,
              29,
              24,
              27,
              25,
              26,
              8,
              10,
              11,
              9,
              12,
              15,
              13,
              14,
              32,
              33,
              34,
              35,
              36,
              37,
              38,
              39,
              40,
              41,
              42,
              43,
              44,
              45,
              46,
              47,
              48,
              49,
              50,
              51,
              52,
              53,
              54,
              55,
              56,
              57,
              58,
              59,
              60,
              61,
              62,
              63
            ],
            orientation
          }
        },
        Ry: {
          CORNERS: {
            permutation: [
              12,
              13,
              14,
              15,
              0,
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              28,
              29,
              30,
              31,
              16,
              17,
              18,
              19,
              20,
              21,
              22,
              23,
              24,
              25,
              26,
              27,
              32,
              33,
              34,
              35,
              36,
              37,
              38,
              39,
              40,
              41,
              42,
              43,
              44,
              45,
              46,
              47,
              48,
              49,
              50,
              51,
              52,
              53,
              54,
              55,
              56,
              57,
              58,
              59,
              60,
              61,
              62,
              63
            ],
            orientation
          }
        },
        Rz: {
          CORNERS: {
            permutation: [
              4,
              6,
              7,
              5,
              20,
              23,
              21,
              22,
              24,
              26,
              27,
              25,
              8,
              11,
              9,
              10,
              0,
              3,
              1,
              2,
              16,
              18,
              19,
              17,
              28,
              31,
              29,
              30,
              12,
              14,
              15,
              13,
              32,
              33,
              34,
              35,
              36,
              37,
              38,
              39,
              40,
              41,
              42,
              43,
              44,
              45,
              46,
              47,
              48,
              49,
              50,
              51,
              52,
              53,
              54,
              55,
              56,
              57,
              58,
              59,
              60,
              61,
              62,
              63
            ],
            orientation
          }
        },
        Lx: {
          CORNERS: {
            permutation: [
              0,
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              12,
              13,
              14,
              15,
              16,
              17,
              18,
              19,
              20,
              21,
              22,
              23,
              24,
              25,
              26,
              27,
              28,
              29,
              30,
              31,
              48,
              51,
              49,
              50,
              52,
              54,
              55,
              53,
              36,
              39,
              37,
              38,
              32,
              34,
              35,
              33,
              60,
              62,
              63,
              61,
              56,
              59,
              57,
              58,
              40,
              42,
              43,
              41,
              44,
              47,
              45,
              46
            ],
            orientation
          }
        },
        Ly: {
          CORNERS: {
            permutation: [
              0,
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              12,
              13,
              14,
              15,
              16,
              17,
              18,
              19,
              20,
              21,
              22,
              23,
              24,
              25,
              26,
              27,
              28,
              29,
              30,
              31,
              44,
              45,
              46,
              47,
              32,
              33,
              34,
              35,
              36,
              37,
              38,
              39,
              40,
              41,
              42,
              43,
              60,
              61,
              62,
              63,
              48,
              49,
              50,
              51,
              52,
              53,
              54,
              55,
              56,
              57,
              58,
              59
            ],
            orientation
          }
        },
        Lz: {
          CORNERS: {
            permutation: [
              0,
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              12,
              13,
              14,
              15,
              16,
              17,
              18,
              19,
              20,
              21,
              22,
              23,
              24,
              25,
              26,
              27,
              28,
              29,
              30,
              31,
              36,
              38,
              39,
              37,
              52,
              55,
              53,
              54,
              56,
              58,
              59,
              57,
              40,
              43,
              41,
              42,
              32,
              35,
              33,
              34,
              48,
              50,
              51,
              49,
              60,
              63,
              61,
              62,
              44,
              46,
              47,
              45
            ],
            orientation
          }
        },
        Mx: {
          CORNERS: {
            permutation: [
              0,
              1,
              2,
              3,
              20,
              22,
              23,
              21,
              4,
              7,
              5,
              6,
              12,
              13,
              14,
              15,
              16,
              17,
              18,
              19,
              24,
              27,
              25,
              26,
              8,
              10,
              11,
              9,
              28,
              29,
              30,
              31,
              48,
              51,
              49,
              50,
              36,
              37,
              38,
              39,
              40,
              41,
              42,
              43,
              32,
              34,
              35,
              33,
              60,
              62,
              63,
              61,
              52,
              53,
              54,
              55,
              56,
              57,
              58,
              59,
              44,
              47,
              45,
              46
            ],
            orientation
          }
        },
        My: {
          CORNERS: {
            permutation: [
              0,
              1,
              2,
              3,
              9,
              8,
              11,
              10,
              45,
              44,
              47,
              46,
              12,
              13,
              14,
              15,
              16,
              17,
              18,
              19,
              25,
              24,
              27,
              26,
              61,
              60,
              63,
              62,
              28,
              29,
              30,
              31,
              5,
              4,
              7,
              6,
              36,
              37,
              38,
              39,
              40,
              41,
              42,
              43,
              33,
              32,
              35,
              34,
              21,
              20,
              23,
              22,
              52,
              53,
              54,
              55,
              56,
              57,
              58,
              59,
              49,
              48,
              51,
              50
            ],
            orientation
          }
        },
        Mz: {
          CORNERS: {
            permutation: [
              0,
              1,
              2,
              3,
              34,
              33,
              35,
              32,
              47,
              45,
              44,
              46,
              12,
              13,
              14,
              15,
              16,
              17,
              18,
              19,
              7,
              5,
              4,
              6,
              10,
              9,
              11,
              8,
              28,
              29,
              30,
              31,
              51,
              49,
              48,
              50,
              36,
              37,
              38,
              39,
              40,
              41,
              42,
              43,
              62,
              61,
              63,
              60,
              22,
              21,
              23,
              20,
              52,
              53,
              54,
              55,
              56,
              57,
              58,
              59,
              27,
              25,
              24,
              26
            ],
            orientation
          }
        },
        Ox: {
          CORNERS: {
            permutation: [
              16,
              19,
              17,
              18,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              0,
              2,
              3,
              1,
              28,
              30,
              31,
              29,
              20,
              21,
              22,
              23,
              24,
              25,
              26,
              27,
              12,
              15,
              13,
              14,
              32,
              33,
              34,
              35,
              52,
              54,
              55,
              53,
              36,
              39,
              37,
              38,
              44,
              45,
              46,
              47,
              48,
              49,
              50,
              51,
              56,
              59,
              57,
              58,
              40,
              42,
              43,
              41,
              60,
              61,
              62,
              63
            ],
            orientation
          }
        },
        Oy: {
          CORNERS: {
            permutation: [
              37,
              36,
              39,
              38,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              1,
              0,
              3,
              2,
              53,
              52,
              55,
              54,
              20,
              21,
              22,
              23,
              24,
              25,
              26,
              27,
              17,
              16,
              19,
              18,
              32,
              33,
              34,
              35,
              41,
              40,
              43,
              42,
              13,
              12,
              15,
              14,
              44,
              45,
              46,
              47,
              48,
              49,
              50,
              51,
              57,
              56,
              59,
              58,
              29,
              28,
              31,
              30,
              60,
              61,
              62,
              63
            ],
            orientation
          }
        },
        Oz: {
          CORNERS: {
            permutation: [
              19,
              17,
              16,
              18,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              30,
              29,
              31,
              28,
              54,
              53,
              55,
              52,
              20,
              21,
              22,
              23,
              24,
              25,
              26,
              27,
              59,
              57,
              56,
              58,
              32,
              33,
              34,
              35,
              2,
              1,
              3,
              0,
              15,
              13,
              12,
              14,
              44,
              45,
              46,
              47,
              48,
              49,
              50,
              51,
              39,
              37,
              36,
              38,
              42,
              41,
              43,
              40,
              60,
              61,
              62,
              63
            ],
            orientation
          }
        },
        U2: {
          CORNERS: {
            permutation: [
              40,
              41,
              42,
              43,
              44,
              45,
              46,
              47,
              32,
              33,
              34,
              35,
              36,
              37,
              38,
              39,
              16,
              17,
              18,
              19,
              20,
              21,
              22,
              23,
              24,
              25,
              26,
              27,
              28,
              29,
              30,
              31,
              8,
              9,
              10,
              11,
              12,
              13,
              14,
              15,
              0,
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              48,
              49,
              50,
              51,
              52,
              53,
              54,
              55,
              56,
              57,
              58,
              59,
              60,
              61,
              62,
              63
            ],
            orientation
          }
        },
        D2: {
          CORNERS: {
            permutation: [
              0,
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              12,
              13,
              14,
              15,
              56,
              57,
              58,
              59,
              60,
              61,
              62,
              63,
              48,
              49,
              50,
              51,
              52,
              53,
              54,
              55,
              32,
              33,
              34,
              35,
              36,
              37,
              38,
              39,
              40,
              41,
              42,
              43,
              44,
              45,
              46,
              47,
              24,
              25,
              26,
              27,
              28,
              29,
              30,
              31,
              16,
              17,
              18,
              19,
              20,
              21,
              22,
              23
            ],
            orientation
          }
        },
        F2: {
          CORNERS: {
            permutation: [
              52,
              53,
              54,
              55,
              48,
              49,
              50,
              51,
              8,
              9,
              10,
              11,
              12,
              13,
              14,
              15,
              36,
              37,
              38,
              39,
              32,
              33,
              34,
              35,
              24,
              25,
              26,
              27,
              28,
              29,
              30,
              31,
              20,
              21,
              22,
              23,
              16,
              17,
              18,
              19,
              40,
              41,
              42,
              43,
              44,
              45,
              46,
              47,
              4,
              5,
              6,
              7,
              0,
              1,
              2,
              3,
              56,
              57,
              58,
              59,
              60,
              61,
              62,
              63
            ],
            orientation
          }
        },
        B2: {
          CORNERS: {
            permutation: [
              0,
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              60,
              61,
              62,
              63,
              56,
              57,
              58,
              59,
              16,
              17,
              18,
              19,
              20,
              21,
              22,
              23,
              44,
              45,
              46,
              47,
              40,
              41,
              42,
              43,
              32,
              33,
              34,
              35,
              36,
              37,
              38,
              39,
              28,
              29,
              30,
              31,
              24,
              25,
              26,
              27,
              48,
              49,
              50,
              51,
              52,
              53,
              54,
              55,
              12,
              13,
              14,
              15,
              8,
              9,
              10,
              11
            ],
            orientation
          }
        },
        y2: {
          CORNERS: {
            permutation: [
              40,
              41,
              42,
              43,
              44,
              45,
              46,
              47,
              32,
              33,
              34,
              35,
              36,
              37,
              38,
              39,
              56,
              57,
              58,
              59,
              60,
              61,
              62,
              63,
              48,
              49,
              50,
              51,
              52,
              53,
              54,
              55,
              8,
              9,
              10,
              11,
              12,
              13,
              14,
              15,
              0,
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              24,
              25,
              26,
              27,
              28,
              29,
              30,
              31,
              16,
              17,
              18,
              19,
              20,
              21,
              22,
              23
            ],
            orientation
          }
        },
        z2: {
          CORNERS: {
            permutation: [
              52,
              53,
              54,
              55,
              48,
              49,
              50,
              51,
              60,
              61,
              62,
              63,
              56,
              57,
              58,
              59,
              36,
              37,
              38,
              39,
              32,
              33,
              34,
              35,
              44,
              45,
              46,
              47,
              40,
              41,
              42,
              43,
              20,
              21,
              22,
              23,
              16,
              17,
              18,
              19,
              28,
              29,
              30,
              31,
              24,
              25,
              26,
              27,
              4,
              5,
              6,
              7,
              0,
              1,
              2,
              3,
              12,
              13,
              14,
              15,
              8,
              9,
              10,
              11
            ],
            orientation
          }
        }
      },
      experimentalDerivedMoves: {
        x: "Lx Rx"
        // y2: "U2 D2", // TODO
        // z2: "F2 B2", // TODO
      }
    };
  }
});

// src/cubing/puzzles/implementations/dynamic/side-events/melindas2x2x2x2.kpuzzle.svg.ts
var melindas2x2x2x2OrbitSVG;
var init_melindas2x2x2x2_kpuzzle_svg = __esm({
  "src/cubing/puzzles/implementations/dynamic/side-events/melindas2x2x2x2.kpuzzle.svg.ts"() {
    "use strict";
    melindas2x2x2x2OrbitSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 180 80" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<title>melindas2x2x2x2</title>
<defs>
  <g id="sticker-UL">
    <path d="m 0,0 10,0 -10,10 z" stroke-width="0.75px" stroke="black" stroke-linecap="butt" stroke-linejoin="round" />
  </g>
  <g id="sticker-UR">
    <path d="m 0,0 10,0 0,10 z" stroke-width="0.75px" stroke="black" stroke-linecap="butt" stroke-linejoin="round" />
  </g>
  <g id="sticker-DR">
    <path d="m 10,0 0,10 -10,0 z" stroke-width="0.75px" stroke="black" stroke-linecap="butt" stroke-linejoin="round" />
  </g>
  <g id="sticker-DL">
    <path d="m 00,0 10,10 -10,0 z" stroke-width="0.75px" stroke="black" stroke-linecap="butt" stroke-linejoin="round" />
  </g>
  <g id="squished-sticker-UL">
    <path d="m 0,0 5,0 -5,10 z" stroke-width="0.75px" stroke="black" stroke-linecap="butt" stroke-linejoin="round" />
  </g>
  <g id="squished-sticker-UR">
    <path d="m 0,0 5,0 0,10 z" stroke-width="0.75px" stroke="black" stroke-linecap="butt" stroke-linejoin="round" />
  </g>
  <g id="squished-sticker-DR">
    <path d="m 5,0 0,10 -5,0 z" stroke-width="0.75px" stroke="black" stroke-linecap="butt" stroke-linejoin="round" />
  </g>
  <g id="squished-sticker-DL">
    <path d="m 00,0 5,10 -5,0 z" stroke-width="0.75px" stroke="black" stroke-linecap="butt" stroke-linejoin="round" />
  </g>
</defs>
<g>
<g id="UL" transform="translate(45, 10)">
  <use id="CORNERS-l40-o0" xlink:href="#sticker-UL" transform="translate( 0,  0)" style="fill: orange"/>
  <use id="CORNERS-l41-o0" xlink:href="#sticker-DR" transform="translate( 0,  0)" style="fill: white"/>
  <use id="CORNERS-l45-o0" xlink:href="#sticker-DL" transform="translate(10,  0)" style="fill: white"/>
  <use id="CORNERS-l44-o0" xlink:href="#sticker-UR" transform="translate(10,  0)" style="fill: orange"/>
  <use id="CORNERS-l36-o0" xlink:href="#sticker-DL" transform="translate( 0, 10)" style="fill: orange"/>
  <use id="CORNERS-l37-o0" xlink:href="#sticker-UR" transform="translate( 0, 10)" style="fill: white"/>
  <use id="CORNERS-l33-o0" xlink:href="#sticker-UL" transform="translate(10, 10)" style="fill: white"/>
  <use id="CORNERS-l32-o0" xlink:href="#sticker-DR" transform="translate(10, 10)" style="fill: orange"/>
</g>
<g id="UR" transform="translate(65, 10)">
  <use id="CORNERS-l8-o0" xlink:href="#sticker-UL" transform="translate( 0,  0)" style="fill: red"/>
  <use id="CORNERS-l9-o0" xlink:href="#sticker-DR" transform="translate( 0,  0)" style="fill: white"/>
  <use id="CORNERS-l13-o0" xlink:href="#sticker-DL" transform="translate(10,  0)" style="fill: white"/>
  <use id="CORNERS-l12-o0" xlink:href="#sticker-UR" transform="translate(10,  0)" style="fill: red"/>
  <use id="CORNERS-l4-o0" xlink:href="#sticker-DL" transform="translate( 0, 10)" style="fill: red"/>
  <use id="CORNERS-l5-o0" xlink:href="#sticker-UR" transform="translate( 0, 10)" style="fill: white"/>
  <use id="CORNERS-l1-o0" xlink:href="#sticker-UL" transform="translate(10, 10)" style="fill: white"/>
  <use id="CORNERS-l0-o0" xlink:href="#sticker-DR" transform="translate(10, 10)" style="fill: red"/>
</g>

<g id="L" transform="translate(10, 35)">
  <use data-copy-id="CORNERS-l40-o0" xlink:href="#sticker-UL" transform="translate( 0,  0)" style="fill: orange"/>
  <use id="CORNERS-l43-o0" xlink:href="#sticker-DR" transform="translate( 0,  0)" style="fill: pink"/>
  <use id="CORNERS-l38-o0" xlink:href="#sticker-DL" transform="translate(10,  0)" style="fill: pink"/>
  <use data-copy-id="CORNERS-l36-o0" xlink:href="#sticker-UR" transform="translate(10,  0)" style="fill: orange"/>
  <use id="CORNERS-l56-o0" xlink:href="#sticker-DL" transform="translate( 0, 10)" style="fill: orange"/>
  <use id="CORNERS-l58-o0" xlink:href="#sticker-UR" transform="translate( 0, 10)" style="fill: pink"/>
  <use id="CORNERS-l55-o0" xlink:href="#sticker-UL" transform="translate(10, 10)" style="fill: pink"/>
  <use id="CORNERS-l52-o0" xlink:href="#sticker-DR" transform="translate(10, 10)" style="fill: orange"/>
</g>

<g id="FL" transform="translate(35, 35)">
  <use data-copy-id="CORNERS-l36-o0" xlink:href="#sticker-UL" transform="translate( 0,  0)" style="fill: orange"/>
  <use id="CORNERS-l39-o0" xlink:href="#sticker-DR" transform="translate( 0,  0)" style="fill: limegreen"/>
  <use id="CORNERS-l34-o0" xlink:href="#sticker-DL" transform="translate(10,  0)" style="fill: limegreen"/>
  <use data-copy-id="CORNERS-l32-o0" xlink:href="#sticker-UR" transform="translate(10,  0)" style="fill: orange"/>
  <use data-copy-id="CORNERS-l52-o0" xlink:href="#sticker-DL" transform="translate( 0, 10)" style="fill: orange"/>
  <use id="CORNERS-l54-o0" xlink:href="#sticker-UR" transform="translate( 0, 10)" style="fill: limegreen"/>
  <use id="CORNERS-l51-o0" xlink:href="#sticker-UL" transform="translate(10, 10)" style="fill: limegreen"/>
  <use id="CORNERS-l48-o0" xlink:href="#sticker-DR" transform="translate(10, 10)" style="fill: orange"/>
</g>
<g id="FR" transform="translate(75, 35)">
  <use data-copy-id="CORNERS-l4-o0" xlink:href="#sticker-UL" transform="translate( 0,  0)" style="fill: red"/>
  <use id="CORNERS-l7-o0" xlink:href="#sticker-DR" transform="translate( 0,  0)" style="fill: limegreen"/>
  <use id="CORNERS-l2-o0" xlink:href="#sticker-DL" transform="translate(10,  0)" style="fill: limegreen"/>
  <use data-copy-id="CORNERS-l0-o0" xlink:href="#sticker-UR" transform="translate(10,  0)" style="fill: red"/>
  <use id="CORNERS-l20-o0" xlink:href="#sticker-DL" transform="translate( 0, 10)" style="fill: red"/>
  <use id="CORNERS-l22-o0" xlink:href="#sticker-UR" transform="translate( 0, 10)" style="fill: limegreen"/>
  <use id="CORNERS-l19-o0" xlink:href="#sticker-UL" transform="translate(10, 10)" style="fill: limegreen"/>
  <use id="CORNERS-l16-o0" xlink:href="#sticker-DR" transform="translate(10, 10)" style="fill: red"/>
</g>

<g id="R" transform="translate(100, 35)">
  <use data-copy-id="CORNERS-l0-o0" xlink:href="#sticker-UL" transform="translate( 0,  0)" style="fill: red"/>
  <use id="CORNERS-l3-o0" xlink:href="#sticker-DR" transform="translate( 0,  0)" style="fill: pink"/>
  <use id="CORNERS-l14-o0" xlink:href="#sticker-DL" transform="translate(10,  0)" style="fill: pink"/>
  <use data-copy-id="CORNERS-l12-o0" xlink:href="#sticker-UR" transform="translate(10,  0)" style="fill: red"/>
  <use data-copy-id="CORNERS-l16-o0" xlink:href="#sticker-DL" transform="translate( 0, 10)" style="fill: red"/>
  <use id="CORNERS-l18-o0" xlink:href="#sticker-UR" transform="translate( 0, 10)" style="fill: pink"/>
  <use id="CORNERS-l31-o0" xlink:href="#sticker-UL" transform="translate(10, 10)" style="fill: pink"/>
  <use id="CORNERS-l28-o0" xlink:href="#sticker-DR" transform="translate(10, 10)" style="fill: red"/>
</g>

<g id="BR" transform="translate(125, 35)">
  <use data-copy-id="CORNERS-l12-o0" xlink:href="#sticker-UL" transform="translate( 0,  0)" style="fill: red"/>
  <use id="CORNERS-l15-o0" xlink:href="#sticker-DR" transform="translate( 0,  0)" style="fill: #26f"/>
  <use id="CORNERS-l10-o0" xlink:href="#sticker-DL" transform="translate(10,  0)" style="fill: #26f"/>
  <use data-copy-id="CORNERS-l8-o0" xlink:href="#sticker-UR" transform="translate(10,  0)" style="fill: red"/>
  <use data-copy-id="CORNERS-l28-o0" xlink:href="#sticker-DL" transform="translate( 0, 10)" style="fill: red"/>
  <use id="CORNERS-l30-o0" xlink:href="#sticker-UR" transform="translate( 0, 10)" style="fill: #26f"/>
  <use id="CORNERS-l27-o0" xlink:href="#sticker-UL" transform="translate(10, 10)" style="fill: #26f"/>
  <use id="CORNERS-l24-o0" xlink:href="#sticker-DR" transform="translate(10, 10)" style="fill: red"/>
</g>
<g id="BL" transform="translate(145, 35)">
  <use data-copy-id="CORNERS-l44-o0" xlink:href="#sticker-UL" transform="translate( 0,  0)" style="fill: orange"/>
  <use id="CORNERS-l47-o0" xlink:href="#sticker-DR" transform="translate( 0,  0)" style="fill: #26f"/>
  <use id="CORNERS-l42-o0" xlink:href="#sticker-DL" transform="translate(10,  0)" style="fill: #26f"/>
  <use data-copy-id="CORNERS-l40-o0" xlink:href="#sticker-UR" transform="translate(10,  0)" style="fill: orange"/>
  <use id="CORNERS-l60-o0" xlink:href="#sticker-DL" transform="translate( 0, 10)" style="fill: orange"/>
  <use id="CORNERS-l62-o0" xlink:href="#sticker-UR" transform="translate( 0, 10)" style="fill: #26f"/>
  <use id="CORNERS-l59-o0" xlink:href="#sticker-UL" transform="translate(10, 10)" style="fill: #26f"/>
  <use data-copy-id="CORNERS-l56-o0" xlink:href="#sticker-DR" transform="translate(10, 10)" style="fill: orange"/>
</g>

<g id="DL" transform="translate(45, 60)">
  <use data-copy-id="CORNERS-l52-o0" xlink:href="#sticker-UL" transform="translate( 0,  0)" style="fill: orange"/>
  <use id="CORNERS-l53-o0" xlink:href="#sticker-DR" transform="translate( 0,  0)" style="fill: yellow"/>
  <use id="CORNERS-l49-o0" xlink:href="#sticker-DL" transform="translate(10,  0)" style="fill: yellow"/>
  <use data-copy-id="CORNERS-l48-o0" xlink:href="#sticker-UR" transform="translate(10,  0)" style="fill: orange"/>
  <use data-copy-id="CORNERS-l56-o0" xlink:href="#sticker-DL" transform="translate( 0, 10)" style="fill: orange"/>
  <use id="CORNERS-l57-o0" xlink:href="#sticker-UR" transform="translate( 0, 10)" style="fill: yellow"/>
  <use id="CORNERS-l61-o0" xlink:href="#sticker-UL" transform="translate(10, 10)" style="fill: yellow"/>
  <use data-copy-id="CORNERS-l60-o0" xlink:href="#sticker-DR" transform="translate(10, 10)" style="fill: orange"/>
</g>
<g id="DR" transform="translate(65, 60)">
  <use data-copy-id="CORNERS-l20-o0" xlink:href="#sticker-UL" transform="translate( 0,  0)" style="fill: red"/>
  <use id="CORNERS-l21-o0" xlink:href="#sticker-DR" transform="translate( 0,  0)" style="fill: yellow"/>
  <use id="CORNERS-l17-o0" xlink:href="#sticker-DL" transform="translate(10,  0)" style="fill: yellow"/>
  <use data-copy-id="CORNERS-l16-o0" xlink:href="#sticker-UR" transform="translate(10,  0)" style="fill: red"/>
  <use data-copy-id="CORNERS-l24-o0" xlink:href="#sticker-DL" transform="translate( 0, 10)" style="fill: red"/>
  <use id="CORNERS-l25-o0" xlink:href="#sticker-UR" transform="translate( 0, 10)" style="fill: yellow"/>
  <use id="CORNERS-l29-o0" xlink:href="#sticker-UL" transform="translate(10, 10)" style="fill: yellow"/>
  <use data-copy-id="CORNERS-l28-o0" xlink:href="#sticker-DR" transform="translate(10, 10)" style="fill: red"/>
</g>

<g style="opacity: 0.3;">
<g id="IL" transform="translate(55, 35)">
  <use data-copy-id="CORNERS-l32-o0" xlink:href="#squished-sticker-UL" transform="translate( 0,  0)" style="fill: orange"/>
  <use id="CORNERS-l35-o0" xlink:href="#squished-sticker-DR" transform="translate( 0,  0)" style="fill: purple"/>
  <use id="CORNERS-l46-o0" xlink:href="#squished-sticker-DL" transform="translate(5,  0)" style="fill: purple"/>
  <use data-copy-id="CORNERS-l44-o0" xlink:href="#squished-sticker-UR" transform="translate(5,  0)" style="fill: orange"/>
  <use data-copy-id="CORNERS-l48-o0" xlink:href="#squished-sticker-DL" transform="translate( 0, 10)" style="fill: orange"/>
  <use id="CORNERS-l50-o0" xlink:href="#squished-sticker-UR" transform="translate( 0, 10)" style="fill: purple"/>
  <use id="CORNERS-l63-o0" xlink:href="#squished-sticker-UL" transform="translate(5, 10)" style="fill: purple"/>
  <use data-copy-id="CORNERS-l60-o0" xlink:href="#squished-sticker-DR" transform="translate(5, 10)" style="fill: orange"/>
</g>
<g id="IR" transform="translate(65, 35)">
  <use data-copy-id="CORNERS-l8-o0" xlink:href="#squished-sticker-UL" transform="translate( 0,  0)" style="fill: red"/>
  <use id="CORNERS-l11-o0" xlink:href="#squished-sticker-DR" transform="translate( 0,  0)" style="fill: purple"/>
  <use id="CORNERS-l6-o0" xlink:href="#squished-sticker-DL" transform="translate(5,  0)" style="fill: purple"/>
  <use data-copy-id="CORNERS-l4-o0" xlink:href="#squished-sticker-UR" transform="translate(5,  0)" style="fill: red"/>
  <use data-copy-id="CORNERS-l24-o0" xlink:href="#squished-sticker-DL" transform="translate( 0, 10)" style="fill: red"/>
  <use id="CORNERS-l26-o0" xlink:href="#squished-sticker-UR" transform="translate( 0, 10)" style="fill: purple"/>
  <use id="CORNERS-l23-o0" xlink:href="#squished-sticker-UL" transform="translate(5, 10)" style="fill: purple"/>
  <use data-copy-id="CORNERS-l20-o0" xlink:href="#squished-sticker-DR" transform="translate(5, 10)" style="fill: red"/>
</g>
</g>
</g>
</svg>`;
  }
});

// src/cubing/puzzles/implementations/dynamic/side-events/puzzles-dynamic-side-events.ts
var puzzles_dynamic_side_events_exports = {};
__export(puzzles_dynamic_side_events_exports, {
  clockJSON: () => clockJSON,
  clockSVG: () => clockSVG,
  cube2x2x2JSON: () => cube2x2x2JSON,
  cube2x2x2LLSVG: () => cube2x2x2LLSVG,
  cube2x2x2SVG: () => cube2x2x2SVG,
  melindas2x2x2x2OrbitJSON: () => melindas2x2x2x2OrbitJSON,
  melindas2x2x2x2OrbitSVG: () => melindas2x2x2x2OrbitSVG,
  pyraminxSVG: () => pyraminxSVG,
  sq1HyperOrbitJSON: () => sq1HyperOrbitJSON,
  sq1HyperOrbitSVG: () => sq1HyperOrbitSVG
});
var init_puzzles_dynamic_side_events = __esm({
  "src/cubing/puzzles/implementations/dynamic/side-events/puzzles-dynamic-side-events.ts"() {
    "use strict";
    init_x2x2_kpuzzle_json();
    init_x2x2_kpuzzle_svg();
    init_x2x2_ll_kpuzzle_svg();
    init_clock_kpuzzle_json();
    init_clock_kpuzzle_svg();
    init_pyraminx_kpuzzle_svg();
    init_sq1_hyperorbit_kpuzzle_json();
    init_sq1_hyperorbit_kpuzzle_svg();
    init_melindas2x2x2x2_kpuzzle_json();
    init_melindas2x2x2x2_kpuzzle_svg();
  }
});

// src/cubing/puzzles/implementations/dynamic/3x3x3/3x3x3.kpuzzle.svg.ts
var cube3x3x3SVG;
var init_x3x3_kpuzzle_svg = __esm({
  "src/cubing/puzzles/implementations/dynamic/3x3x3/3x3x3.kpuzzle.svg.ts"() {
    "use strict";
    cube3x3x3SVG = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN"
       "http://www.w3.org/TR/2001/REC-SVG-20050904/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 518 440" preserveAspectRatio="xMidYMid meet">
  <title>3x3x3</title>
  <defs>
    <g id="sticker">
        <rect x="0" y="0" width="1" height="1" stroke="black" stroke-width="0.04px" />
    </g>
    <g id="sticker-thin-v">
        <rect x="0" y="0" width="0.5" height="1" stroke="black" stroke-width="0.04px" style="opacity: 0.3;" />
    </g>
    <g id="sticker-thin-h">
        <rect x="0" y="0" width="1" height="0.5" stroke="black" stroke-width="0.04px" style="opacity: 0.3;" />
    </g>
  </defs>

<!--        0 1 2 3 4 5 6 7 8 9 10 11  -->
<!--        | | | | | | | | | | | |<-  -->
<!--    0 -       . . .                -->
<!--    1 -       . . .                -->
<!--    2 -       . . .                -->
<!--    3 - . . . . . . . . . . . .    -->
<!--    4 - . . . . . . . . . . . .    -->
<!--    5 - . . . . . . . . . . . .    -->
<!--    6 -       . . .                -->
<!--    7 -       . . .                -->
<!--    8 -       . . .                -->

  <g id="puzzle" transform="translate(5,40) scale(40)">
    <!-- Hints -->
    <use data-copy-id="CORNERS-l0-o1" xlink:href="#sticker-thin-v" transform="translate(6.5,2.1)" style="fill: red"/>
    <use data-copy-id="EDGES-l1-o1"   xlink:href="#sticker-thin-v" transform="translate(6.5,1.1)" style="fill: red"/>
    <use data-copy-id="CORNERS-l1-o2" xlink:href="#sticker-thin-v" transform="translate(6.5,0.1)" style="fill: red"/>

    <use data-copy-id="CORNERS-l2-o2" xlink:href="#sticker-thin-h" transform="translate(3.3,-0.6)" style="fill: #26f"/>
    <use data-copy-id="EDGES-l2-o1"   xlink:href="#sticker-thin-h" transform="translate(4.3,-0.6)" style="fill: #26f"/>
    <use data-copy-id="CORNERS-l1-o1" xlink:href="#sticker-thin-h" transform="translate(5.3,-0.6)" style="fill: #26f"/>

    <use data-copy-id="CORNERS-l3-o2" xlink:href="#sticker-thin-v" transform="translate(2.6,2.1)" style="fill: orange"/>
    <use data-copy-id="EDGES-l3-o1"   xlink:href="#sticker-thin-v" transform="translate(2.6,1.1)" style="fill: orange"/>
    <use data-copy-id="CORNERS-l2-o1" xlink:href="#sticker-thin-v" transform="translate(2.6,0.1)" style="fill: orange"/>

    <!-- CORNERS -->
    <use id="CORNERS-l0-o0" xlink:href="#sticker" transform="translate(5.3,2.1)" style="fill: white"/>
    <use id="CORNERS-l0-o1" xlink:href="#sticker" transform="translate(6.5,3.3)" style="fill: red"/>
    <use id="CORNERS-l0-o2" xlink:href="#sticker" transform="translate(5.3,3.3)" style="fill: limegreen"/>

    <use id="CORNERS-l1-o0" xlink:href="#sticker" transform="translate(5.3,0.1)" style="fill: white"/>
    <use id="CORNERS-l1-o1" xlink:href="#sticker" transform="translate(9.7,3.3)" style="fill: #26f"/>
    <use id="CORNERS-l1-o2" xlink:href="#sticker" transform="translate(8.5,3.3)" style="fill: red"/>

    <use id="CORNERS-l2-o0" xlink:href="#sticker" transform="translate(3.3,0.1)" style="fill: white"/>
    <use id="CORNERS-l2-o1" xlink:href="#sticker" transform="translate(0.1,3.3)" style="fill: orange"/>
    <use id="CORNERS-l2-o2" xlink:href="#sticker" transform="translate(11.7,3.3)" style="fill: #26f"/>

    <use id="CORNERS-l3-o0" xlink:href="#sticker" transform="translate(3.3,2.1)" style="fill: white"/>
    <use id="CORNERS-l3-o1" xlink:href="#sticker" transform="translate(3.3,3.3)" style="fill: limegreen"/>
    <use id="CORNERS-l3-o2" xlink:href="#sticker" transform="translate(2.1,3.3)" style="fill: orange"/>

    <use id="CORNERS-l4-o0" xlink:href="#sticker" transform="translate(5.3,6.5)" style="fill: yellow"/>
    <use id="CORNERS-l4-o1" xlink:href="#sticker" transform="translate(5.3,5.3)" style="fill: limegreen"/>
    <use id="CORNERS-l4-o2" xlink:href="#sticker" transform="translate(6.5,5.3)" style="fill: red"/>

    <use id="CORNERS-l5-o0" xlink:href="#sticker" transform="translate(3.3,6.5)" style="fill: yellow"/>
    <use id="CORNERS-l5-o1" xlink:href="#sticker" transform="translate(2.1,5.3)" style="fill: orange"/>
    <use id="CORNERS-l5-o2" xlink:href="#sticker" transform="translate(3.3,5.3)" style="fill: limegreen"/>

    <use id="CORNERS-l6-o0" xlink:href="#sticker" transform="translate(3.3,8.5)" style="fill: yellow"/>
    <use id="CORNERS-l6-o1" xlink:href="#sticker" transform="translate(11.7,5.3)" style="fill: #26f"/>
    <use id="CORNERS-l6-o2" xlink:href="#sticker" transform="translate(0.1,5.3)"  style="fill: orange"/>

    <use id="CORNERS-l7-o0" xlink:href="#sticker" transform="translate(5.3,8.5)" style="fill: yellow"/>
    <use id="CORNERS-l7-o1" xlink:href="#sticker" transform="translate(8.5,5.3)" style="fill: red"/>
    <use id="CORNERS-l7-o2" xlink:href="#sticker" transform="translate(9.7,5.3)" style="fill: #26f"/>

    <!-- EDGES -->
    <use id="EDGES-l0-o0"  xlink:href="#sticker" transform="translate(4.3,2.1)" style="fill: white"/>
    <use id="EDGES-l0-o1"  xlink:href="#sticker" transform="translate(4.3,3.3)" style="fill: limegreen"/>

    <use id="EDGES-l1-o0"  xlink:href="#sticker" transform="translate(5.3,1.1)" style="fill: white"/>
    <use id="EDGES-l1-o1"  xlink:href="#sticker" transform="translate(7.5,3.3)" style="fill: red"/>

    <use id="EDGES-l2-o0"  xlink:href="#sticker" transform="translate(4.3,0.1)" style="fill: white"/>
    <use id="EDGES-l2-o1"  xlink:href="#sticker" transform="translate(10.7,3.3)" style="fill: #26f"/>

    <use id="EDGES-l3-o0"  xlink:href="#sticker" transform="translate(3.3,1.1)" style="fill: white"/>
    <use id="EDGES-l3-o1"  xlink:href="#sticker" transform="translate(1.1,3.3)" style="fill: orange"/>

    <use id="EDGES-l4-o0"  xlink:href="#sticker" transform="translate(4.3,6.5)" style="fill: yellow"/>
    <use id="EDGES-l4-o1"  xlink:href="#sticker" transform="translate(4.3,5.3)" style="fill: limegreen"/>

    <use id="EDGES-l5-o0" xlink:href="#sticker" transform="translate(5.3,7.5)" style="fill: yellow"/>
    <use id="EDGES-l5-o1" xlink:href="#sticker" transform="translate(7.5,5.3)" style="fill: red"/>

    <use id="EDGES-l6-o0" xlink:href="#sticker" transform="translate(4.3,8.5)" style="fill: yellow"/>
    <use id="EDGES-l6-o1" xlink:href="#sticker" transform="translate(10.7,5.3)" style="fill: #26f"/>

    <use id="EDGES-l7-o0"  xlink:href="#sticker" transform="translate(3.3,7.5)" style="fill: yellow"/>
    <use id="EDGES-l7-o1"  xlink:href="#sticker" transform="translate(1.1,5.3)" style="fill: orange"/>

    <use id="EDGES-l8-o0"  xlink:href="#sticker" transform="translate(5.3,4.3)" style="fill: limegreen"/>
    <use id="EDGES-l8-o1"  xlink:href="#sticker" transform="translate(6.5,4.3)" style="fill: red"/>

    <use id="EDGES-l9-o0"  xlink:href="#sticker" transform="translate(3.3,4.3)" style="fill: limegreen"/>
    <use id="EDGES-l9-o1"  xlink:href="#sticker" transform="translate(2.1,4.3)" style="fill: orange"/>

    <use id="EDGES-l10-o0" xlink:href="#sticker" transform="translate(9.7,4.3)" style="fill: #26f"/>
    <use id="EDGES-l10-o1" xlink:href="#sticker" transform="translate(8.5,4.3)" style="fill: red"/>

    <use id="EDGES-l11-o0" xlink:href="#sticker" transform="translate(11.7,4.3)" style="fill: #26f"/>
    <use id="EDGES-l11-o1" xlink:href="#sticker" transform="translate(0.1,4.3)" style="fill: orange"/>

    <!-- CENTERS -->
    <!-- TODO: Allow the same sticker to be reused for multiple orientations -->
    <use id="CENTERS-l0-o0" xlink:href="#sticker" transform="translate(4.3,1.1)" style="fill: white"/>
    <use id="CENTERS-l0-o1" xlink:href="#sticker" transform="translate(4.3,1.1)" style="fill: white"/>
    <use id="CENTERS-l0-o2" xlink:href="#sticker" transform="translate(4.3,1.1)" style="fill: white"/>
    <use id="CENTERS-l0-o3" xlink:href="#sticker" transform="translate(4.3,1.1)" style="fill: white"/>

    <use id="CENTERS-l1-o0" xlink:href="#sticker" transform="translate(1.1,4.3)" style="fill: orange"/>
    <use id="CENTERS-l1-o1" xlink:href="#sticker" transform="translate(1.1,4.3)" style="fill: orange"/>
    <use id="CENTERS-l1-o2" xlink:href="#sticker" transform="translate(1.1,4.3)" style="fill: orange"/>
    <use id="CENTERS-l1-o3" xlink:href="#sticker" transform="translate(1.1,4.3)" style="fill: orange"/>

    <use id="CENTERS-l2-o0" xlink:href="#sticker" transform="translate(4.3,4.3)" style="fill: limegreen"/>
    <use id="CENTERS-l2-o1" xlink:href="#sticker" transform="translate(4.3,4.3)" style="fill: limegreen"/>
    <use id="CENTERS-l2-o2" xlink:href="#sticker" transform="translate(4.3,4.3)" style="fill: limegreen"/>
    <use id="CENTERS-l2-o3" xlink:href="#sticker" transform="translate(4.3,4.3)" style="fill: limegreen"/>

    <use id="CENTERS-l3-o0" xlink:href="#sticker" transform="translate(7.5,4.3)" style="fill: red"/>
    <use id="CENTERS-l3-o1" xlink:href="#sticker" transform="translate(7.5,4.3)" style="fill: red"/>
    <use id="CENTERS-l3-o2" xlink:href="#sticker" transform="translate(7.5,4.3)" style="fill: red"/>
    <use id="CENTERS-l3-o3" xlink:href="#sticker" transform="translate(7.5,4.3)" style="fill: red"/>

    <use id="CENTERS-l4-o0" xlink:href="#sticker" transform="translate(10.7,4.3)" style="fill: #26f"/>
    <use id="CENTERS-l4-o1" xlink:href="#sticker" transform="translate(10.7,4.3)" style="fill: #26f"/>
    <use id="CENTERS-l4-o2" xlink:href="#sticker" transform="translate(10.7,4.3)" style="fill: #26f"/>
    <use id="CENTERS-l4-o3" xlink:href="#sticker" transform="translate(10.7,4.3)" style="fill: #26f"/>

    <use id="CENTERS-l5-o0" xlink:href="#sticker" transform="translate(4.3,7.5)" style="fill: yellow"/>
    <use id="CENTERS-l5-o1" xlink:href="#sticker" transform="translate(4.3,7.5)" style="fill: yellow"/>
    <use id="CENTERS-l5-o2" xlink:href="#sticker" transform="translate(4.3,7.5)" style="fill: yellow"/>
    <use id="CENTERS-l5-o3" xlink:href="#sticker" transform="translate(4.3,7.5)" style="fill: yellow"/>
  </g>

</svg>
`;
  }
});

// src/cubing/puzzles/implementations/dynamic/3x3x3/3x3x3-ll.kpuzzle.svg.ts
var cube3x3x3LLSVG;
var init_x3x3_ll_kpuzzle_svg = __esm({
  "src/cubing/puzzles/implementations/dynamic/3x3x3/3x3x3-ll.kpuzzle.svg.ts"() {
    "use strict";
    cube3x3x3LLSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="288px" height="288px" viewBox="-16 -16 288 288" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <title>3x3x3 LL</title>
  <defs>
    <g id="sticker">
        <rect x="-10" y="-10" width="1" height="1" stroke="black" stroke-width="0.04px" />
    </g>
  </defs>
  <g id="3x3x3-LL" stroke="none" stroke-width="4" style="none" stroke-linejoin="round">
    <rect id="CENTERS-l0-o0" stroke="#000000" style="fill: white" x="96" y="96" width="64" height="64"></rect>
    <rect id="CENTERS-l0-o1" stroke="#000000" style="fill: white" x="96" y="96" width="64" height="64"></rect>
    <rect id="CENTERS-l0-o2" stroke="#000000" style="fill: white" x="96" y="96" width="64" height="64"></rect>
    <rect id="CENTERS-l0-o3" stroke="#000000" style="fill: white" x="96" y="96" width="64" height="64"></rect>

    <rect    id="CORNERS-l0-o0" stroke="#000000" style="fill: white" x="160" y="160" width="64" height="64"></rect>
    <polygon id="CORNERS-l0-o1" stroke="#000000" style="fill: red" points="224 160 252 160 252 252 224 224"></polygon>
    <polygon id="CORNERS-l0-o2" stroke="#000000" style="fill: limegreen" transform="translate(206, 238) scale(1, -1) rotate(-90) translate(-206, -238) " points="192 192 220 192 220 284 192 256"></polygon>
    <rect    id="CORNERS-l1-o0" stroke="#000000" style="fill: white" x="160" y="32" width="64" height="64"></rect>
    <polygon id="CORNERS-l1-o1" stroke="#000000" style="fill: #26f" transform="translate(206, 18) rotate(-90) translate(-206, -18) " points="192 -28 220 -28 220 64 192 36"></polygon>
    <polygon id="CORNERS-l1-o2" stroke="#000000" style="fill: red" transform="translate(238, 50) scale(1, -1) translate(-238, -50) " points="224 4 252 4 252 96 224 68"></polygon>
    <rect    id="CORNERS-l2-o0" stroke="#000000" style="fill: white" x="32" y="32" width="64" height="64"></rect>
    <polygon id="CORNERS-l2-o1" stroke="#000000" style="fill: orange" transform="translate(18, 50) scale(-1, -1) translate(-18, -50) " points="4 4 32 4 32 96 4 68"></polygon>
    <polygon id="CORNERS-l2-o2" stroke="#000000" style="fill: #26f" transform="translate(50, 18) scale(1, -1) rotate(90) translate(-50, -18) " points="36 -28 64 -28 64 64 36 36"></polygon>
    <rect    id="CORNERS-l3-o0" stroke="#000000" style="fill: white" x="32" y="160" width="64" height="64"></rect>
    <polygon id="CORNERS-l3-o1" stroke="#000000" style="fill: limegreen" transform="translate(50, 238) rotate(90) translate(-50, -238) " points="36 192 64 192 64 284 36 256"></polygon>
    <polygon id="CORNERS-l3-o2" stroke="#000000" style="fill: orange" transform="translate(18, 206) scale(-1, 1) translate(-18, -206) " points="4 160 32 160 32 252 4 224"></polygon>

    <rect id="EDGES-l0-o0" stroke="#000000" style="fill: white" x="96" y="160" width="64" height="64"></rect>
    <rect id="EDGES-l0-o1" stroke="#000000" style="fill: limegreen" transform="translate(128, 238) scale(1, -1) rotate(90) translate(-128, -238) " x="114" y="206" width="28" height="64"></rect>
    <rect id="EDGES-l1-o0" stroke="#000000" style="fill: white" x="160" y="96" width="64" height="64"></rect>
    <rect id="EDGES-l1-o1" stroke="#000000" style="fill: red" x="224" y="96" width="28" height="64"></rect>
    <rect id="EDGES-l2-o0" stroke="#000000" style="fill: white" x="96" y="32" width="64" height="64"></rect>
    <rect id="EDGES-l2-o1" stroke="#000000" style="fill: #26f" transform="translate(128, 18) scale(1, -1) rotate(90) translate(-128, -18) " x="114" y="-14" width="28" height="64"></rect>
    <rect id="EDGES-l3-o0" stroke="#000000" style="fill: white" x="32" y="96" width="64" height="64"></rect>
    <rect id="EDGES-l3-o1" stroke="#000000" style="fill: orange" x="4" y="96" width="28" height="64"></rect>

  </g>
  <g style="opacity: 0">
    <!-- CORNERS -->
    <use id="CORNERS-l4-o0" xlink:href="#sticker" style="fill: yellow"/>
    <use id="CORNERS-l4-o1" xlink:href="#sticker" style="fill: limegreen"/>
    <use id="CORNERS-l4-o2" xlink:href="#sticker" style="fill: red"/>

    <use id="CORNERS-l5-o0" xlink:href="#sticker" style="fill: yellow"/>
    <use id="CORNERS-l5-o1" xlink:href="#sticker" style="fill: orange"/>
    <use id="CORNERS-l5-o2" xlink:href="#sticker" style="fill: limegreen"/>

    <use id="CORNERS-l6-o0" xlink:href="#sticker" style="fill: yellow"/>
    <use id="CORNERS-l6-o1" xlink:href="#sticker" style="fill: #26f"/>
    <use id="CORNERS-l6-o2" xlink:href="#sticker"  style="fill: orange"/>

    <use id="CORNERS-l7-o0" xlink:href="#sticker" style="fill: yellow"/>
    <use id="CORNERS-l7-o1" xlink:href="#sticker" style="fill: red"/>
    <use id="CORNERS-l7-o2" xlink:href="#sticker" style="fill: #26f"/>

    <!-- EDGES -->
    <use id="EDGES-l4-o0"  xlink:href="#sticker" style="fill: yellow"/>
    <use id="EDGES-l4-o1"  xlink:href="#sticker" style="fill: limegreen"/>

    <use id="EDGES-l5-o0" xlink:href="#sticker" style="fill: yellow"/>
    <use id="EDGES-l5-o1" xlink:href="#sticker" style="fill: red"/>

    <use id="EDGES-l6-o0" xlink:href="#sticker" style="fill: yellow"/>
    <use id="EDGES-l6-o1" xlink:href="#sticker" style="fill: #26f"/>

    <use id="EDGES-l7-o0"  xlink:href="#sticker" style="fill: yellow"/>
    <use id="EDGES-l7-o1"  xlink:href="#sticker" style="fill: orange"/>

    <use id="EDGES-l8-o0"  xlink:href="#sticker" style="fill: limegreen"/>
    <use id="EDGES-l8-o1"  xlink:href="#sticker" style="fill: red"/>

    <use id="EDGES-l9-o0"  xlink:href="#sticker" style="fill: limegreen"/>
    <use id="EDGES-l9-o1"  xlink:href="#sticker" style="fill: orange"/>

    <use id="EDGES-l10-o0" xlink:href="#sticker" style="fill: #26f"/>
    <use id="EDGES-l10-o1" xlink:href="#sticker" style="fill: red"/>

    <use id="EDGES-l11-o0" xlink:href="#sticker" style="fill: #26f"/>
    <use id="EDGES-l11-o1" xlink:href="#sticker" style="fill: orange"/>

    <!-- CENTERS -->
    <!-- TODO: Allow the same sticker to be reused for multiple orientations -->
    <use id="CENTERS-l1-o0" xlink:href="#sticker" style="fill: orange"/>
    <use id="CENTERS-l1-o1" xlink:href="#sticker" style="fill: orange"/>
    <use id="CENTERS-l1-o2" xlink:href="#sticker" style="fill: orange"/>
    <use id="CENTERS-l1-o3" xlink:href="#sticker" style="fill: orange"/>

    <use id="CENTERS-l2-o0" xlink:href="#sticker" style="fill: limegreen"/>
    <use id="CENTERS-l2-o1" xlink:href="#sticker" style="fill: limegreen"/>
    <use id="CENTERS-l2-o2" xlink:href="#sticker" style="fill: limegreen"/>
    <use id="CENTERS-l2-o3" xlink:href="#sticker" style="fill: limegreen"/>

    <use id="CENTERS-l3-o0" xlink:href="#sticker" style="fill: red"/>
    <use id="CENTERS-l3-o1" xlink:href="#sticker" style="fill: red"/>
    <use id="CENTERS-l3-o2" xlink:href="#sticker" style="fill: red"/>
    <use id="CENTERS-l3-o3" xlink:href="#sticker" style="fill: red"/>

    <use id="CENTERS-l4-o0" xlink:href="#sticker" style="fill: #26f"/>
    <use id="CENTERS-l4-o1" xlink:href="#sticker" style="fill: #26f"/>
    <use id="CENTERS-l4-o2" xlink:href="#sticker" style="fill: #26f"/>
    <use id="CENTERS-l4-o3" xlink:href="#sticker" style="fill: #26f"/>

    <use id="CENTERS-l5-o0" xlink:href="#sticker" style="fill: yellow"/>
    <use id="CENTERS-l5-o1" xlink:href="#sticker" style="fill: yellow"/>
    <use id="CENTERS-l5-o2" xlink:href="#sticker" style="fill: yellow"/>
    <use id="CENTERS-l5-o3" xlink:href="#sticker" style="fill: yellow"/>
  </g>
</svg>`;
  }
});

// src/cubing/puzzles/implementations/dynamic/3x3x3/puzzles-dynamic-3x3x3.ts
var puzzles_dynamic_3x3x3_exports = {};
__export(puzzles_dynamic_3x3x3_exports, {
  cube3x3x3LLSVG: () => cube3x3x3LLSVG,
  cube3x3x3SVG: () => cube3x3x3SVG
});
var init_puzzles_dynamic_3x3x3 = __esm({
  "src/cubing/puzzles/implementations/dynamic/3x3x3/puzzles-dynamic-3x3x3.ts"() {
    "use strict";
    init_x3x3_kpuzzle_svg();
    init_x3x3_ll_kpuzzle_svg();
  }
});

// src/cubing/puzzles/implementations/dynamic/unofficial/fto.kpuzzle.svg.ts
var ftoSVG;
var init_fto_kpuzzle_svg = __esm({
  "src/cubing/puzzles/implementations/dynamic/unofficial/fto.kpuzzle.svg.ts"() {
    "use strict";
    ftoSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="2368px" height="1216px" viewBox="0 0 2368 1216" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>fto</title>
    <g id="fto" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linejoin="round">
        <g id="BL" transform="translate(2040.000000, 608.000000) scale(-1, -1) rotate(90.000000) translate(-2040.000000, -608.000000) translate(1560.000000, 368.000000)" stroke="#000000" stroke-width="12">
            <polygon id="C4RNER-l4-o3" style="fill: #FF7F00;" points="480 0 640 160 320 160"></polygon>
            <polygon id="EDGES-l9-o0" style="fill: #FF7F00;" points="640 160 800 320 480 320"></polygon>
            <polygon id="CENTERS-l16-o0" style="fill: #FF7F00;" transform="translate(480.000000, 240.000000) scale(1, -1) translate(-480.000000, -240.000000) " points="480 160 640 320 320 320"></polygon>
            <polygon id="EDGES-l3-o0" style="fill: #FF7F00;" points="320 160 480 320 160 320"></polygon>
            <polygon id="C4RNER-l3-o2" style="fill: #FF7F00;" points="800 320 960 480 640 480"></polygon>
            <polygon id="CENTERS-l19-o0" style="fill: #FF7F00;" transform="translate(640.000000, 400.000000) scale(1, -1) translate(-640.000000, -400.000000) " points="640 320 800 480 480 480"></polygon>
            <polygon id="EDGES-l7-o0" style="fill: #FF7F00;" points="480 320 640 480 320 480"></polygon>
            <polygon id="CENTERS-l3-o0" style="fill: #FF7F00;" transform="translate(320.000000, 400.000000) scale(1, -1) translate(-320.000000, -400.000000) " points="320 320 480 480 160 480"></polygon>
            <polygon id="C4RNER-l0-o1" style="fill: #FF7F00;" points="160 320 320 480 0 480"></polygon>
        </g>
        <g id="D" transform="translate(1280.000000, 648.000000)" stroke="#000000" stroke-width="12">
            <polygon id="C4RNER-l4-o0" style="fill: #FFFF00;" points="480 0 640 160 320 160"></polygon>
            <polygon id="EDGES-l3-o1" style="fill: #FFFF00;" points="640 160 800 320 480 320"></polygon>
            <polygon id="CENTERS-l8-o0" style="fill: #FFFF00;" transform="translate(480.000000, 240.000000) scale(1, -1) translate(-480.000000, -240.000000) " points="480 160 640 320 320 320"></polygon>
            <polygon id="EDGES-l5-o1" style="fill: #FFFF00;" points="320 160 480 320 160 320"></polygon>
            <polygon id="C4RNER-l0-o0" style="fill: #FFFF00;" points="800 320 960 480 640 480"></polygon>
            <polygon id="CENTERS-l17-o0" style="fill: #FFFF00;" transform="translate(640.000000, 400.000000) scale(1, -1) translate(-640.000000, -400.000000) " points="640 320 800 480 480 480"></polygon>
            <polygon id="EDGES-l1-o1" style="fill: #FFFF00;" points="480 320 640 480 320 480"></polygon>
            <polygon id="CENTERS-l6-o0" style="fill: #FFFF00;" transform="translate(320.000000, 400.000000) scale(1, -1) translate(-320.000000, -400.000000) " points="320 320 480 480 160 480"></polygon>
            <polygon id="C4RNER-l2-o0" style="fill: #FFFF00;" points="160 320 320 480 0 480"></polygon>
        </g>
        <g id="BR" transform="translate(1480.000000, 608.000000) scale(1, -1) rotate(90.000000) translate(-1480.000000, -608.000000) translate(1000.000000, 368.000000)" stroke="#000000" stroke-width="12">
            <polygon id="C4RNER-l4-o1" style="fill: #7F7F7F;" points="480 0 640 160 320 160"></polygon>
            <polygon id="EDGES-l2-o0" style="fill: #7F7F7F;" points="640 160 800 320 480 320"></polygon>
            <polygon id="CENTERS-l15-o0" style="fill: #7F7F7F;" transform="translate(480.000000, 240.000000) scale(1, -1) translate(-480.000000, -240.000000) " points="480 160 640 320 320 320"></polygon>
            <polygon id="EDGES-l5-o0" style="fill: #7F7F7F;" points="320 160 480 320 160 320"></polygon>
            <polygon id="C4RNER-l5-o2" style="fill: #7F7F7F;" points="800 320 960 480 640 480"></polygon>
            <polygon id="CENTERS-l2-o0" style="fill: #7F7F7F;" transform="translate(640.000000, 400.000000) scale(1, -1) translate(-640.000000, -400.000000) " points="640 320 800 480 480 480"></polygon>
            <polygon id="EDGES-l4-o0" style="fill: #7F7F7F;" points="480 320 640 480 320 480"></polygon>
            <polygon id="CENTERS-l4-o0" style="fill: #7F7F7F;" transform="translate(320.000000, 400.000000) scale(1, -1) translate(-320.000000, -400.000000) " points="320 320 480 480 160 480"></polygon>
            <polygon id="C4RNER-l2-o3" style="fill: #7F7F7F;" points="160 320 320 480 0 480"></polygon>
        </g>
        <g id="B" transform="translate(1760.000000, 328.000000) scale(1, -1) translate(-1760.000000, -328.000000) translate(1280.000000, 88.000000)" stroke="#000000" stroke-width="12">
            <polygon id="C4RNER-l4-o2" style="fill: #0000FF;" points="480 0 640 160 320 160"></polygon>
            <polygon id="EDGES-l9-o1" style="fill: #0000FF;" points="640 160 800 320 480 320"></polygon>
            <polygon id="CENTERS-l13-o0" style="fill: #0000FF;" transform="translate(480.000000, 240.000000) scale(1, -1) translate(-480.000000, -240.000000) " points="480 160 640 320 320 320"></polygon>
            <polygon id="EDGES-l2-o1" style="fill: #0000FF;" points="320 160 480 320 160 320"></polygon>
            <polygon id="C4RNER-l3-o3" style="fill: #0000FF;" points="800 320 960 480 640 480"></polygon>
            <polygon id="CENTERS-l12-o0" style="fill: #0000FF;" transform="translate(640.000000, 400.000000) scale(1, -1) translate(-640.000000, -400.000000) " points="640 320 800 480 480 480"></polygon>
            <polygon id="EDGES-l8-o1" style="fill: #0000FF;" points="480 320 640 480 320 480"></polygon>
            <polygon id="CENTERS-l10-o0" style="fill: #0000FF;" transform="translate(320.000000, 400.000000) scale(1, -1) translate(-320.000000, -400.000000) " points="320 320 480 480 160 480"></polygon>
            <polygon id="C4RNER-l5-o1" style="fill: #0000FF;" points="160 320 320 480 0 480"></polygon>
        </g>
        <g id="R" transform="translate(888.000000, 608.000000) scale(-1, -1) rotate(90.000000) translate(-888.000000, -608.000000) translate(408.000000, 368.000000)" stroke="#000000" stroke-width="12">
            <polygon id="C4RNER-l1-o1" style="fill: #32CD32;" points="480 0 640 160 320 160"></polygon>
            <polygon id="EDGES-l6-o1" style="fill: #32CD32;" points="640 160 800 320 480 320"></polygon>
            <polygon id="CENTERS-l7-o0" style="fill: #32CD32;" transform="translate(480.000000, 240.000000) scale(1, -1) translate(-480.000000, -240.000000) " points="480 160 640 320 320 320"></polygon>
            <polygon id="EDGES-l0-o1" style="fill: #32CD32;" points="320 160 480 320 160 320"></polygon>
            <polygon id="C4RNER-l5-o3" style="fill: #32CD32;" points="800 320 960 480 640 480"></polygon>
            <polygon id="CENTERS-l5-o0" style="fill: #32CD32;" transform="translate(640.000000, 400.000000) scale(1, -1) translate(-640.000000, -400.000000) " points="640 320 800 480 480 480"></polygon>
            <polygon id="EDGES-l4-o1" style="fill: #32CD32;" points="480 320 640 480 320 480"></polygon>
            <polygon id="CENTERS-l11-o0" style="fill: #32CD32;" transform="translate(320.000000, 400.000000) scale(1, -1) translate(-320.000000, -400.000000) " points="320 320 480 480 160 480"></polygon>
            <polygon id="C4RNER-l2-o2" style="fill: #32CD32;" points="160 320 320 480 0 480"></polygon>
        </g>
        <g id="F" transform="translate(128.000000, 648.000000)" stroke="#000000" stroke-width="12">
            <polygon id="C4RNER-l1-o2" style="fill: #FF0000;" points="480 0 640 160 320 160"></polygon>
            <polygon id="EDGES-l0-o0" style="fill: #FF0000;" points="640 160 800 320 480 320"></polygon>
            <polygon id="CENTERS-l0-o0" style="fill: #FF0000;" transform="translate(480.000000, 240.000000) scale(1, -1) translate(-480.000000, -240.000000) " points="480 160 640 320 320 320"></polygon>
            <polygon id="EDGES-l10-o0" style="fill: #FF0000;" points="320 160 480 320 160 320"></polygon>
            <polygon id="C4RNER-l2-o1" style="fill: #FF0000;" points="800 320 960 480 640 480"></polygon>
            <polygon id="CENTERS-l1-o0" style="fill: #FF0000;" transform="translate(640.000000, 400.000000) scale(1, -1) translate(-640.000000, -400.000000) " points="640 320 800 480 480 480"></polygon>
            <polygon id="EDGES-l1-o0" style="fill: #FF0000;" points="480 320 640 480 320 480"></polygon>
            <polygon id="CENTERS-l14-o0" style="fill: #FF0000;" transform="translate(320.000000, 400.000000) scale(1, -1) translate(-320.000000, -400.000000) " points="320 320 480 480 160 480"></polygon>
            <polygon id="C4RNER-l0-o3" style="fill: #FF0000;" points="160 320 320 480 0 480"></polygon>
        </g>
        <g id="L" transform="translate(328.000000, 608.000000) scale(1, -1) rotate(90.000000) translate(-328.000000, -608.000000) translate(-152.000000, 368.000000)" stroke="#000000" stroke-width="12">
            <polygon id="C4RNER-l1-o3" style="fill: #7F007F;" points="480 0 640 160 320 160"></polygon>
            <polygon id="EDGES-l11-o1" style="fill: #7F007F;" points="640 160 800 320 480 320"></polygon>
            <polygon id="CENTERS-l21-o0" style="fill: #7F007F;" transform="translate(480.000000, 240.000000) scale(1, -1) translate(-480.000000, -240.000000) " points="480 160 640 320 320 320"></polygon>
            <polygon id="EDGES-l10-o1" style="fill: #7F007F;" points="320 160 480 320 160 320"></polygon>
            <polygon id="C4RNER-l3-o1" style="fill: #7F007F;" points="800 320 960 480 640 480"></polygon>
            <polygon id="CENTERS-l18-o0" style="fill: #7F007F;" transform="translate(640.000000, 400.000000) scale(1, -1) translate(-640.000000, -400.000000) " points="640 320 800 480 480 480"></polygon>
            <polygon id="EDGES-l7-o1" style="fill: #7F007F;" points="480 320 640 480 320 480"></polygon>
            <polygon id="CENTERS-l9-o0" style="fill: #7F007F;" transform="translate(320.000000, 400.000000) scale(1, -1) translate(-320.000000, -400.000000) " points="320 320 480 480 160 480"></polygon>
            <polygon id="C4RNER-l0-o2" style="fill: #7F007F;" points="160 320 320 480 0 480"></polygon>
        </g>
        <g id="U" transform="translate(608.000000, 328.000000) scale(1, -1) translate(-608.000000, -328.000000) translate(128.000000, 88.000000)" stroke="#000000" stroke-width="12">
            <polygon id="C4RNER-l1-o0" style="fill: #FFFFFF;" points="480 0 640 160 320 160"></polygon>
            <polygon id="EDGES-l6-o0" style="fill: #FFFFFF;" points="640 160 800 320 480 320"></polygon>
            <polygon id="CENTERS-l20-o0" style="fill: #FFFFFF;" transform="translate(480.000000, 240.000000) scale(1, -1) translate(-480.000000, -240.000000) " points="480 160 640 320 320 320"></polygon>
            <polygon id="EDGES-l11-o0" style="fill: #FFFFFF;" points="320 160 480 320 160 320"></polygon>
            <polygon id="C4RNER-l5-o0" style="fill: #FFFFFF;" points="800 320 960 480 640 480"></polygon>
            <polygon id="CENTERS-l23-o0" style="fill: #FFFFFF;" transform="translate(640.000000, 400.000000) scale(1, -1) translate(-640.000000, -400.000000) " points="640 320 800 480 480 480"></polygon>
            <polygon id="EDGES-l8-o0" style="fill: #FFFFFF;" points="480 320 640 480 320 480"></polygon>
            <polygon id="CENTERS-l22-o0" style="fill: #FFFFFF;" transform="translate(320.000000, 400.000000) scale(1, -1) translate(-320.000000, -400.000000) " points="320 320 480 480 160 480"></polygon>
            <polygon id="C4RNER-l3-o0" style="fill: #FFFFFF;" points="160 320 320 480 0 480"></polygon>
        </g>
    </g>
</svg>
`;
  }
});

// src/cubing/puzzles/implementations/dynamic/unofficial/kilominx.kpuzzle.svg.ts
var kilominxSVG;
var init_kilominx_kpuzzle_svg = __esm({
  "src/cubing/puzzles/implementations/dynamic/unofficial/kilominx.kpuzzle.svg.ts"() {
    "use strict";
    kilominxSVG = `<svg id="svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 800 500">
<style type="text/css"><![CDATA[.sticker { stroke: #000000; stroke-width: 1px; }]]></style>
<g><title>U</title>
<polygon id="CORNERS-l0-o0" class="sticker" style="fill: #ffffff" points="247.941 89.861 283.500 115.696 269.918 157.499 212.382 138.805"/>
<polygon id="CORNERS-l10-o0" class="sticker" style="fill: #ffffff" points="154.845 157.499 141.263 115.696 176.822 89.861 212.382 138.805"/>
<polygon id="CORNERS-l5-o0" class="sticker" style="fill: #ffffff" points="176.822 89.861 212.381 64.025 247.941 89.861 212.382 138.805"/>
<polygon id="CORNERS-l4-o0" class="sticker" style="fill: #ffffff" points="212.381 199.301 168.427 199.301 154.845 157.499 212.382 138.805"/>
<polygon id="CORNERS-l1-o0" class="sticker" style="fill: #ffffff" points="269.918 157.499 256.335 199.301 212.381 199.301 212.382 138.805"/>
</g><g><title>F</title>
<polygon id="CORNERS-l7-o0" class="sticker" style="fill: #006633" points="247.941 319.263 212.381 345.098 176.822 319.263 212.382 270.32"/>
<polygon id="CORNERS-l1-o2" class="sticker" style="fill: #006633" points="212.381 209.823 256.335 209.823 269.918 251.625 212.382 270.32"/>
<polygon id="CORNERS-l3-o1" class="sticker" style="fill: #006633" points="269.918 251.625 283.500 293.428 247.941 319.263 212.382 270.32"/>
<polygon id="CORNERS-l4-o1" class="sticker" style="fill: #006633" points="154.845 251.625 168.427 209.823 212.381 209.823 212.382 270.32"/>
<polygon id="CORNERS-l9-o2" class="sticker" style="fill: #006633" points="176.822 319.263 141.263 293.428 154.845 251.625 212.382 270.32"/>
</g><g><title>L</title>
<polygon id="CORNERS-l13-o0" class="sticker" style="fill: #660099" points="87.302 290.176 43.349 290.176 29.766 248.374 87.303 229.68"/>
<polygon id="CORNERS-l4-o2" class="sticker" style="fill: #660099" points="122.862 180.736 158.421 206.571 144.839 248.374 87.303 229.68"/>
<polygon id="CORNERS-l9-o1" class="sticker" style="fill: #660099" points="144.839 248.374 131.256 290.176 87.302 290.176 87.303 229.68"/>
<polygon id="CORNERS-l10-o1" class="sticker" style="fill: #660099" points="51.743 180.736 87.302 154.901 122.862 180.736 87.303 229.68"/>
<polygon id="CORNERS-l11-o2" class="sticker" style="fill: #660099" points="29.766 248.374 16.184 206.571 51.743 180.736 87.303 229.68"/>
</g><g><title>BL</title>
<polygon id="CORNERS-l15-o0" class="sticker" style="fill: #ffff00" points="700.480 172.224 664.921 198.059 629.361 172.224 664.921 123.281"/>
<polygon id="CORNERS-l10-o2" class="sticker" style="fill: #ffff00" points="664.921 62.784 708.874 62.784 722.457 104.586 664.921 123.281"/>
<polygon id="CORNERS-l11-o1" class="sticker" style="fill: #ffff00" points="722.457 104.586 736.039 146.389 700.480 172.224 664.921 123.281"/>
<polygon id="CORNERS-l5-o1" class="sticker" style="fill: #ffff00" points="607.384 104.586 620.967 62.784 664.921 62.784 664.921 123.281"/>
<polygon id="CORNERS-l19-o2" class="sticker" style="fill: #ffff00" points="629.361 172.224 593.802 146.389 607.384 104.586 664.921 123.281"/>
</g><g><title>BR</title>
<polygon id="CORNERS-l12-o0" class="sticker" style="fill: #0000ff" points="545.874 172.224 510.315 198.059 474.755 172.224 510.315 123.281"/>
<polygon id="CORNERS-l5-o2" class="sticker" style="fill: #0000ff" points="510.315 62.784 554.269 62.784 567.851 104.586 510.315 123.281"/>
<polygon id="CORNERS-l19-o1" class="sticker" style="fill: #0000ff" points="567.851 104.586 581.433 146.389 545.874 172.224 510.315 123.281"/>
<polygon id="CORNERS-l0-o1" class="sticker" style="fill: #0000ff" points="452.779 104.586 466.361 62.784 510.315 62.784 510.315 123.281"/>
<polygon id="CORNERS-l6-o2" class="sticker" style="fill: #0000ff" points="474.755 172.224 439.196 146.389 452.779 104.586 510.315 123.281"/>
</g><g><title>R</title>
<polygon id="CORNERS-l6-o1" class="sticker" style="fill: #ff0000" points="373.019 180.736 408.579 206.571 394.996 248.374 337.461 229.68"/>
<polygon id="CORNERS-l1-o1" class="sticker" style="fill: #ff0000" points="279.924 248.374 266.341 206.571 301.901 180.736 337.461 229.68"/>
<polygon id="CORNERS-l0-o2" class="sticker" style="fill: #ff0000" points="301.901 180.736 337.460 154.901 373.019 180.736 337.461 229.68"/>
<polygon id="CORNERS-l3-o2" class="sticker" style="fill: #ff0000" points="337.460 290.176 293.506 290.176 279.924 248.374 337.461 229.68"/>
<polygon id="CORNERS-l2-o0" class="sticker" style="fill: #ff0000" points="394.996 248.374 381.414 290.176 337.460 290.176 337.461 229.68"/>
</g><g><title>C</title>
<polygon id="CORNERS-l8-o1" class="sticker" style="fill: #ffffd0" points="347.220 395.413 333.638 437.215 289.684 437.215 289.685 376.719"/>
<polygon id="CORNERS-l3-o0" class="sticker" style="fill: #ffffd0" points="254.125 327.775 289.684 301.940 325.244 327.775 289.685 376.719"/>
<polygon id="CORNERS-l2-o2" class="sticker" style="fill: #ffffd0" points="325.244 327.775 360.803 353.610 347.220 395.413 289.685 376.719"/>
<polygon id="CORNERS-l7-o1" class="sticker" style="fill: #ffffd0" points="232.148 395.413 218.566 353.610 254.125 327.775 289.685 376.719"/>
<polygon id="CORNERS-l17-o2" class="sticker" style="fill: #ffffd0" points="289.684 437.215 245.730 437.215 232.148 395.413 289.685 376.719"/>
</g><g><title>A</title>
<polygon id="CORNERS-l17-o1" class="sticker" style="fill: #3399ff" points="192.615 395.413 179.032 437.215 135.078 437.215 135.079 376.719"/>
<polygon id="CORNERS-l9-o0" class="sticker" style="fill: #3399ff" points="99.519 327.775 135.078 301.940 170.638 327.775 135.079 376.719"/>
<polygon id="CORNERS-l7-o2" class="sticker" style="fill: #3399ff" points="170.638 327.775 206.197 353.610 192.615 395.413 135.079 376.719"/>
<polygon id="CORNERS-l13-o1" class="sticker" style="fill: #3399ff" points="77.542 395.413 63.960 353.610 99.519 327.775 135.079 376.719"/>
<polygon id="CORNERS-l14-o2" class="sticker" style="fill: #3399ff" points="135.078 437.215 91.125 437.215 77.542 395.413 135.079 376.719"/>
</g><g><title>I</title>
<polygon id="CORNERS-l18-o2" class="sticker" style="fill: #ff6633" points="677.137 319.263 641.578 293.428 655.160 251.625 712.697 270.32"/>
<polygon id="CORNERS-l13-o2" class="sticker" style="fill: #ff6633" points="770.233 251.625 783.815 293.428 748.256 319.263 712.697 270.32"/>
<polygon id="CORNERS-l14-o1" class="sticker" style="fill: #ff6633" points="748.256 319.263 712.697 345.098 677.137 319.263 712.697 270.32"/>
<polygon id="CORNERS-l11-o0" class="sticker" style="fill: #ff6633" points="712.697 209.823 756.650 209.823 770.233 251.625 712.697 270.32"/>
<polygon id="CORNERS-l15-o1" class="sticker" style="fill: #ff6633" points="655.160 251.625 668.743 209.823 712.697 209.823 712.697 270.32"/>
</g><g><title>BF</title>
<polygon id="CORNERS-l16-o2" class="sticker" style="fill: #99ff00" points="587.618 290.176 543.664 290.176 530.081 248.374 587.618 229.68"/>
<polygon id="CORNERS-l15-o2" class="sticker" style="fill: #99ff00" points="623.177 180.736 658.736 206.571 645.154 248.374 587.618 229.68"/>
<polygon id="CORNERS-l18-o1" class="sticker" style="fill: #99ff00" points="645.154 248.374 631.572 290.176 587.618 290.176 587.618 229.68"/>
<polygon id="CORNERS-l19-o0" class="sticker" style="fill: #99ff00" points="552.058 180.736 587.618 154.901 623.177 180.736 587.618 229.68"/>
<polygon id="CORNERS-l12-o1" class="sticker" style="fill: #99ff00" points="530.081 248.374 516.499 206.571 552.058 180.736 587.618 229.68"/>
</g><g><title>E</title>
<polygon id="CORNERS-l8-o2" class="sticker" style="fill: #ff66cc" points="498.098 319.263 462.539 345.098 426.980 319.263 462.539 270.32"/>
<polygon id="CORNERS-l12-o2" class="sticker" style="fill: #ff66cc" points="462.539 209.823 506.493 209.823 520.075 251.625 462.539 270.32"/>
<polygon id="CORNERS-l16-o1" class="sticker" style="fill: #ff66cc" points="520.075 251.625 533.658 293.428 498.098 319.263 462.539 270.32"/>
<polygon id="CORNERS-l6-o0" class="sticker" style="fill: #ff66cc" points="405.003 251.625 418.585 209.823 462.539 209.823 462.539 270.32"/>
<polygon id="CORNERS-l2-o1" class="sticker" style="fill: #ff66cc" points="426.980 319.263 391.420 293.428 405.003 251.625 462.539 270.32"/>
</g><g><title>D</title>
<polygon id="CORNERS-l18-o0" class="sticker" style="fill: #999999" points="587.618 300.698 631.572 300.698 645.154 342.500 587.618 361.195"/>
<polygon id="CORNERS-l8-o0" class="sticker" style="fill: #999999" points="552.058 410.138 516.499 384.303 530.081 342.500 587.618 361.195"/>
<polygon id="CORNERS-l16-o0" class="sticker" style="fill: #999999" points="530.081 342.500 543.664 300.698 587.618 300.698 587.618 361.195"/>
<polygon id="CORNERS-l17-o0" class="sticker" style="fill: #999999" points="623.177 410.138 587.618 435.974 552.058 410.138 587.618 361.195"/>
<polygon id="CORNERS-l14-o0" class="sticker" style="fill: #999999" points="645.154 342.500 658.736 384.303 623.177 410.138 587.618 361.195"/>
</g></svg>
`;
  }
});

// src/cubing/puzzles/implementations/dynamic/unofficial/redi_cube.kpuzzle.json.ts
var rediCubeJSON;
var init_redi_cube_kpuzzle_json = __esm({
  "src/cubing/puzzles/implementations/dynamic/unofficial/redi_cube.kpuzzle.json.ts"() {
    "use strict";
    rediCubeJSON = {
      name: "redi_cube",
      orbits: {
        EDGES: { numPieces: 12, numOrientations: 2 },
        CORNERS: { numPieces: 8, numOrientations: 3 }
      },
      startStateData: {
        EDGES: {
          pieces: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        CORNERS: {
          pieces: [0, 1, 2, 3, 4, 5, 6, 7],
          orientation: [0, 0, 0, 0, 0, 0, 0, 0]
        }
      },
      moves: {
        F: {
          EDGES: {
            permutation: [8, 0, 2, 3, 4, 5, 6, 7, 1, 9, 10, 11],
            orientation: [0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]
          },
          CORNERS: {
            permutation: [0, 1, 2, 3, 4, 5, 6, 7],
            orientation: [1, 0, 0, 0, 0, 0, 0, 0]
          }
        },
        x: {
          EDGES: {
            permutation: [4, 8, 0, 9, 6, 10, 2, 11, 5, 7, 1, 3],
            orientation: [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0]
          },
          CORNERS: {
            permutation: [4, 0, 3, 5, 7, 6, 2, 1],
            orientation: [2, 1, 2, 1, 1, 2, 1, 2]
          }
        },
        y: {
          EDGES: {
            permutation: [1, 2, 3, 0, 5, 6, 7, 4, 10, 8, 11, 9],
            orientation: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1]
          },
          CORNERS: {
            permutation: [1, 2, 3, 0, 7, 4, 5, 6],
            orientation: [0, 0, 0, 0, 0, 0, 0, 0]
          }
        }
      },
      experimentalDerivedMoves: {
        z: "[x: y]",
        UR: "[y: F]",
        U: "[y2: F]",
        UL: "[y': F]",
        D: "[x: F]",
        L: "[z2: F]",
        R: "[x2: F]",
        B: "[y2 x: F]"
      }
    };
  }
});

// src/cubing/puzzles/implementations/dynamic/unofficial/redi_cube.kpuzzle.svg.ts
var rediCubeSVG;
var init_redi_cube_kpuzzle_svg = __esm({
  "src/cubing/puzzles/implementations/dynamic/unofficial/redi_cube.kpuzzle.svg.ts"() {
    "use strict";
    rediCubeSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="546px" height="418px" viewBox="-20 -20 546 418" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<title>redi-cube</title>
<g istroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
  <g transform="translate(1.000000, 1.000000)" fill-rule="nonzero" stroke="#000000" stroke-width="1.6">
    <g id="CORNERS-l0-o0" transform="translate(208.000000, 80.000000)" style="fill: #FFFFFF;">
      <rect id="Rectangle" x="0" y="0" width="40" height="40"></rect>
    </g>
    <g id="CORNERS-l0-o1" transform="translate(256.000000, 128.000000)" style="fill: #FF0000;">
      <rect id="Rectangle" x="0" y="0" width="40" height="40"></rect>
    </g>
    <g id="CORNERS-l0-o2" transform="translate(208.000000, 128.000000)" style="fill: #32CD32;">
      <rect id="Rectangle" x="0" y="0" width="40" height="40"></rect>
    </g>
    <g id="CORNERS-l1-o0" transform="translate(208.000000, 0.000000)" style="fill: #FFFFFF;">
      <rect id="Rectangle" x="0" y="0" width="40" height="40"></rect>
    </g>
    <g id="CORNERS-l1-o1" transform="translate(384.000000, 128.000000)" style="fill: #2266FF;">
      <rect id="Rectangle" x="0" y="0" width="40" height="40"></rect>
    </g>
    <g id="CORNERS-l1-o2" transform="translate(336.000000, 128.000000)" style="fill: #FF0000;">
      <rect id="Rectangle" x="0" y="0" width="40" height="40"></rect>
    </g>
    <g id="CORNERS-l2-o0" transform="translate(128.000000, 0.000000)" style="fill: #FFFFFF;">
      <rect id="Rectangle" x="0" y="0" width="40" height="40"></rect>
    </g>
    <g id="CORNERS-l2-o1" transform="translate(0.000000, 128.000000)" style="fill: #FFA500;">
      <rect id="Rectangle" x="0" y="0" width="40" height="40"></rect>
    </g>
    <g id="CORNERS-l2-o2" transform="translate(464.000000, 128.000000)" style="fill: #2266FF;">
      <rect id="Rectangle" x="0" y="0" width="40" height="40"></rect>
    </g>
    <g id="CORNERS-l3-o0" transform="translate(128.000000, 80.000000)" style="fill: #FFFFFF;">
      <rect id="Rectangle" x="0" y="0" width="40" height="40"></rect>
    </g>
    <g id="CORNERS-l3-o1" transform="translate(128.000000, 128.000000)" style="fill: #32CD32;">
      <rect id="Rectangle" x="0" y="0" width="40" height="40"></rect>
    </g>
    <g id="CORNERS-l3-o2" transform="translate(80.000000, 128.000000)" style="fill: #FFA500;">
      <rect id="Rectangle" x="0" y="0" width="40" height="40"></rect>
    </g>
    <g id="CORNERS-l4-o0" transform="translate(208.000000, 256.000000)" style="fill: #FFFF00;">
      <rect id="Rectangle" x="0" y="0" width="40" height="40"></rect>
    </g>
    <g id="CORNERS-l4-o1" transform="translate(208.000000, 208.000000)" style="fill: #32CD32;">
      <rect id="Rectangle" x="0" y="0" width="40" height="40"></rect>
    </g>
    <g id="CORNERS-l4-o2" transform="translate(256.000000, 208.000000)" style="fill: #FF0000;">
      <rect id="Rectangle" x="0" y="0" width="40" height="40"></rect>
    </g>
    <g id="CORNERS-l5-o0" transform="translate(128.000000, 256.000000)" style="fill: #FFFF00;">
      <rect id="Rectangle" x="0" y="0" width="40" height="40"></rect>
    </g>
    <g id="CORNERS-l5-o1" transform="translate(80.000000, 208.000000)" style="fill: #FFA500;">
      <rect id="Rectangle" x="0" y="0" width="40" height="40"></rect>
    </g>
    <g id="CORNERS-l5-o2" transform="translate(128.000000, 208.000000)" style="fill: #32CD32;">
      <rect id="Rectangle" x="0" y="0" width="40" height="40"></rect>
    </g>
    <g id="CORNERS-l6-o0" transform="translate(128.000000, 336.000000)" style="fill: #FFFF00;">
      <rect id="Rectangle" x="0" y="0" width="40" height="40"></rect>
    </g>
    <g id="CORNERS-l6-o1" transform="translate(464.000000, 208.000000)" style="fill: #2266FF;">
      <rect id="Rectangle" x="0" y="0" width="40" height="40"></rect>
    </g>
    <g id="CORNERS-l6-o2" transform="translate(0.000000, 208.000000)" style="fill: #FFA500;">
      <rect id="Rectangle" x="0" y="0" width="40" height="40"></rect>
    </g>
    <g id="CORNERS-l7-o0" transform="translate(208.000000, 336.000000)" style="fill: #FFFF00;">
      <rect id="Rectangle" x="0" y="0" width="40" height="40"></rect>
    </g>
    <g id="CORNERS-l7-o1" transform="translate(336.000000, 208.000000)" style="fill: #FF0000;">
      <rect id="Rectangle" x="0" y="0" width="40" height="40"></rect>
    </g>
    <g id="CORNERS-l7-o2" transform="translate(384.000000, 208.000000)" style="fill: #2266FF;">
      <rect id="Rectangle" x="0" y="0" width="40" height="40"></rect>
    </g>
    <g id="EDGES-l0-o0" transform="translate(168.000000, 60.000000)" style="fill: #FFFFFF;">
      <polygon id="Rectangle" points="0 20 20 -8.8817842e-16 40 20 40 60 0 60"></polygon>
    </g>
    <g id="EDGES-l0-o1" transform="translate(168.000000, 128.000000)" style="fill: #32CD32;">
      <polygon id="Rectangle" points="0 0 40 0 40 40 20 60 0 40"></polygon>
    </g>
    <g id="EDGES-l1-o0" transform="translate(188.000000, 40.000000)" style="fill: #FFFFFF;">
      <polygon id="Rectangle" points="20 0 60 0 60 40 20 40 0 20"></polygon>
    </g>
    <g id="EDGES-l1-o1" transform="translate(296.000000, 128.000000)" style="fill: #FF0000;">
      <polygon id="Rectangle" points="0 0 40 0 40 40 20 60 0 40"></polygon>
    </g>
    <g id="EDGES-l2-o0" transform="translate(168.000000, 0.000000)" style="fill: #FFFFFF;">
      <polygon id="Rectangle" points="0 0 40 0 40 40 20 60 0 40"></polygon>
    </g>
    <g id="EDGES-l2-o1" transform="translate(424.000000, 128.000000)" style="fill: #2266FF;">
      <polygon id="Rectangle" points="0 0 40 0 40 40 20 60 0 40"></polygon>
    </g>
    <g id="EDGES-l3-o0" transform="translate(128.000000, 40.000000)" style="fill: #FFFFFF;">
      <polygon id="Rectangle" points="0 0 40 0 60 20 40 40 0 40"></polygon>
    </g>
    <g id="EDGES-l3-o1" transform="translate(40.000000, 128.000000)" style="fill: #FFA500;">
      <polygon id="Rectangle" points="0 0 40 0 40 40 20 60 0 40"></polygon>
    </g>
    <g id="EDGES-l4-o0" transform="translate(168.000000, 256.000000)" style="fill: #FFFF00;">
      <polygon id="Rectangle" points="0 0 40 0 40 40 20 60 0 40"></polygon>
    </g>
    <g id="EDGES-l4-o1" transform="translate(168.000000, 188.000000)" style="fill: #32CD32;">
      <polygon id="Rectangle" points="0 20 20 0 40 20 40 60 0 60"></polygon>
    </g>
    <g id="EDGES-l5-o0" transform="translate(188.000000, 296.000000)" style="fill: #FFFF00;">
      <polygon id="Rectangle" points="20 0 60 0 60 40 20 40 0 20"></polygon>
    </g>
    <g id="EDGES-l5-o1" transform="translate(296.000000, 188.000000)" style="fill: #FF0000;">
      <polygon id="Rectangle" points="0 20 20 0 40 20 40 60 0 60"></polygon>
    </g>
    <g id="EDGES-l6-o0" transform="translate(168.000000, 316.000000)" style="fill: #FFFF00;">
      <polygon id="Rectangle" points="0 20 20 -5.32907052e-14 40 20 40 60 0 60"></polygon>
    </g>
    <g id="EDGES-l6-o1" transform="translate(424.000000, 188.000000)" style="fill: #2266FF;">
      <polygon id="Rectangle" points="0 20 20 -1.77635684e-15 40 20 40 60 0 60"></polygon>
    </g>
    <g id="EDGES-l7-o0" transform="translate(128.000000, 296.000000)" style="fill: #FFFF00;">
      <polygon id="Rectangle" points="0 0 40 0 60 20 40 40 0 40"></polygon>
    </g>
    <g id="EDGES-l7-o1" transform="translate(40.000000, 188.000000)" style="fill: #FFA500;">
      <polygon id="Rectangle" points="0 20 20 0 40 20 40 60 0 60"></polygon>
    </g>
    <g id="EDGES-l8-o0" transform="translate(188.000000, 168.000000)" style="fill: #32CD32;">
      <polygon id="Rectangle" points="20 0 60 0 60 40 20 40 2.66453526e-14 20"></polygon>
    </g>
    <g id="EDGES-l8-o1" transform="translate(256.000000, 168.000000)" style="fill: #FF0000;">
      <polygon id="Rectangle" points="0 0 40 0 60 20 40 40 0 40"></polygon>
    </g>
    <g id="EDGES-l9-o0" transform="translate(128.000000, 168.000000)" style="fill: #32CD32;">
      <polygon id="Rectangle" points="0 0 40 0 60 20 40 40 0 40"></polygon>
    </g>
    <g id="EDGES-l9-o1" transform="translate(60.000000, 168.000000)" style="fill: #FFA500;">
      <polygon id="Rectangle" points="20 0 60 0 60 40 20 40 0 20"></polygon>
    </g>
    <g id="EDGES-l10-o0" transform="translate(384.000000, 168.000000)" style="fill: #2266FF;">
      <polygon id="Rectangle" points="0 0 40 0 60 20 40 40 0 40"></polygon>
    </g>
    <g id="EDGES-l10-o1" transform="translate(316.000000, 168.000000)" style="fill: #FF0000;">
      <polygon id="Rectangle" points="20 0 60 0 60 40 20 40 5.32907052e-14 20"></polygon>
    </g>
    <g id="EDGES-l11-o0" transform="translate(444.000000, 168.000000)" style="fill: #2266FF;">
      <polygon id="Rectangle" points="20 0 60 0 60 40 20 40 -3.55271368e-15 20"></polygon>
    </g>
    <g id="EDGES-l11-o1" transform="translate(0.000000, 168.000000)" style="fill: #FFA500;">
      <polygon id="Rectangle" points="0 0 40 0 60 20 40 40 0 40"></polygon>
    </g>
  </g>
</g>
</svg>
`;
  }
});

// src/cubing/puzzles/implementations/dynamic/unofficial/puzzles-dynamic-unofficial.ts
var puzzles_dynamic_unofficial_exports = {};
__export(puzzles_dynamic_unofficial_exports, {
  ftoSVG: () => ftoSVG,
  kilominxSVG: () => kilominxSVG,
  rediCubeJSON: () => rediCubeJSON,
  rediCubeSVG: () => rediCubeSVG
});
var init_puzzles_dynamic_unofficial = __esm({
  "src/cubing/puzzles/implementations/dynamic/unofficial/puzzles-dynamic-unofficial.ts"() {
    "use strict";
    init_fto_kpuzzle_svg();
    init_kilominx_kpuzzle_svg();
    init_redi_cube_kpuzzle_json();
    init_redi_cube_kpuzzle_svg();
  }
});

// src/cubing/puzzles/implementations/dynamic/megaminx/megaminx-ll.kpuzzle.svg.ts
var megaminxLLSVG;
var init_megaminx_ll_kpuzzle_svg = __esm({
  "src/cubing/puzzles/implementations/dynamic/megaminx/megaminx-ll.kpuzzle.svg.ts"() {
    "use strict";
    megaminxLLSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="360px" height="343px" viewBox="0 0 360 343" version="1.1">
  <title>Megaminx LL</title>
  <defs>
    <g id="bogus">
        <rect x="-10" y="-10" width="1" height="1" stroke="black" stroke-width="0.04px" />
    </g>
  </defs>
  <g fill="none" fill-rule="nonzero" stroke="#000">
    <g style="stroke: black; stroke-width: 6; stroke-linecap: butt; stroke-linejoin: round;">
      <path id="CENTERS-l0-o0" style="fill: white;" d="M 179.5 143.480469 L 137.082031 174.296875 L 153.285156 224.164062 L 205.714844 224.164062 L 221.917969 174.296875 Z M 179.5 143.480469 "/>  />

      <path id="CORNERS-l6-o0" style="fill: white;" d="M 140.175781 92.605469 L 179.5 143.480469 L 218.824219 92.605469 L 179.5 64.035156 Z M 140.175781 92.605469 "/>  />
      <path id="CORNERS-l6-o1" style="fill: yellow;" d="M 125.15625 46.378906 L 140.175781 92.605469 L 179.5 64.035156 L 179.5 6.894531 Z M 125.15625 46.378906 "/> />
      <path id="CORNERS-l6-o2" style="fill: rgb(34, 102, 255);" d="M 179.5 64.035156 L 218.824219 92.605469 L 233.84375 46.378906 L 179.5 6.894531 Z M 179.5 64.035156 "/>  />

      <path id="EDGES-l26-o0" style="fill: white;" d="M 100.851562 121.175781 L 137.082031 174.296875 L 179.5 143.480469 L 140.175781 92.605469 Z M 100.851562 121.175781 "/> />
      <path id="EDGES-l26-o1" style="fill: yellow;" d="M 61.527344 92.605469 L 100.851562 121.175781 L 140.175781 92.605469 L 125.15625 46.378906 Z M 61.527344 92.605469 "/> />

      <path id="CORNERS-l1-o0" style="fill: white;" d="M 76.546875 195.976562 L 137.082031 174.296875 L 100.851562 121.175781 L 61.527344 149.75 Z M 76.546875 195.976562 "/> />
      <path id="CORNERS-l1-o1" style="fill: purple;" d="M 27.9375 195.976562 L 76.546875 195.976562 L 61.527344 149.75 L 7.179688 132.089844 Z M 27.9375 195.976562 "/>  />
      <path id="CORNERS-l1-o2" style="fill: yellow;" d="M 61.527344 149.75 L 100.851562 121.175781 L 61.527344 92.605469 L 7.179688 132.089844 Z M 61.527344 149.75 "/> />

      <path id="EDGES-l1-o0" style="fill: white;" d="M 91.566406 242.207031 L 153.285156 224.164062 L 137.082031 174.296875 L 76.546875 195.976562 Z M 91.566406 242.207031 "/> />
      <path id="EDGES-l1-o1" style="fill: purple;" d="M 52.242188 270.777344 L 91.566406 242.207031 L 76.546875 195.976562 L 27.9375 195.976562 Z M 52.242188 270.777344 "/> />

      <path id="CORNERS-l0-o0" style="fill: white;" d="M 155.195312 288.4375 L 153.285156 224.164062 L 91.566406 242.207031 L 106.585938 288.4375 Z M 155.195312 288.4375 "/> />
      <path id="CORNERS-l0-o1" style="fill: limegreen;" d="M 140.175781 334.664062 L 155.195312 288.4375 L 106.585938 288.4375 L 73 334.664062 Z M 140.175781 334.664062 "/>  />
      <path id="CORNERS-l0-o2" style="fill: purple;" d="M 106.585938 288.4375 L 91.566406 242.207031 L 52.242188 270.777344 L 73 334.664062 Z M 106.585938 288.4375 "/>  />

      <path id="EDGES-l0-o0" style="fill: white;" d="M 203.804688 288.4375 L 205.714844 224.164062 L 153.285156 224.164062 L 155.195312 288.4375 Z M 203.804688 288.4375 "/>  />
      <path id="EDGES-l0-o1" style="fill: limegreen;" d="M 218.824219 334.664062 L 203.804688 288.4375 L 155.195312 288.4375 L 140.175781 334.664062 Z M 218.824219 334.664062 "/>  />

      <path id="CORNERS-l2-o0" style="fill: white;" d="M 267.433594 242.207031 L 205.714844 224.164062 L 203.804688 288.4375 L 252.414062 288.4375 Z M 267.433594 242.207031 "/>  />
      <path id="CORNERS-l2-o1" style="fill: red;" d="M 306.757812 270.777344 L 267.433594 242.207031 L 252.414062 288.4375 L 286 334.664062 Z M 306.757812 270.777344 "/> />
      <path id="CORNERS-l2-o2" style="fill: limegreen;" d="M 252.414062 288.4375 L 203.804688 288.4375 L 218.824219 334.664062 L 286 334.664062 Z M 252.414062 288.4375 "/> />

      <path id="EDGES-l7-o0" style="fill: white;" d="M 282.453125 195.976562 L 221.917969 174.296875 L 205.714844 224.164062 L 267.433594 242.207031 Z M 282.453125 195.976562 "/>  />
      <path id="EDGES-l7-o1" style="fill: red;" d="M 331.0625 195.976562 L 282.453125 195.976562 L 267.433594 242.207031 L 306.757812 270.777344 Z M 331.0625 195.976562 "/>  />

      <path id="CORNERS-l7-o0" style="fill: white;" d="M 258.148438 121.175781 L 221.917969 174.296875 L 282.453125 195.976562 L 297.472656 149.75 Z M 258.148438 121.175781 "/>  />
      <path id="CORNERS-l7-o1" style="fill: rgb(34, 102, 255);" d="M 297.472656 92.605469 L 258.148438 121.175781 L 297.472656 149.75 L 351.820312 132.089844 Z M 297.472656 92.605469 "/>  />
      <path id="CORNERS-l7-o2" style="fill: red;" d="M 297.472656 149.75 L 282.453125 195.976562 L 331.0625 195.976562 L 351.820312 132.089844 Z M 297.472656 149.75 "/>  />

      <path id="EDGES-l6-o0" style="fill: white;" d="M 218.824219 92.605469 L 179.5 143.480469 L 221.917969 174.296875 L 258.148438 121.175781 Z M 218.824219 92.605469 "/> />
      <path id="EDGES-l6-o1" style="fill: rgb(34, 102, 255);" d="M 233.84375 46.378906 L 218.824219 92.605469 L 258.148438 121.175781 L 297.472656 92.605469 Z M 233.84375 46.378906 "/>  />
    </g>
    <g opacity="0">
      <g><title>U</title>
      <polygon id="CENTERS-l0-o1" xlink:href="#bogus" style="fill: white"/>
      <polygon id="CENTERS-l0-o2" xlink:href="#bogus" style="fill: white"/>
      <polygon id="CENTERS-l0-o3" xlink:href="#bogus" style="fill: white"/>
      <polygon id="CENTERS-l0-o4" xlink:href="#bogus" style="fill: white"/>
      </g><g><title>F</title>
      <polygon id="EDGES-l8-o0" xlink:href="#bogus" style="fill: limegreen"/>
      <polygon id="EDGES-l2-o0" xlink:href="#bogus" style="fill: limegreen"/>
      <polygon id="CENTERS-l2-o0" xlink:href="#bogus" style="fill: limegreen"/>
      <polygon id="CENTERS-l2-o1" xlink:href="#bogus" style="fill: limegreen"/>
      <polygon id="CENTERS-l2-o2" xlink:href="#bogus" style="fill: limegreen"/>
      <polygon id="CENTERS-l2-o3" xlink:href="#bogus" style="fill: limegreen"/>
      <polygon id="CENTERS-l2-o4" xlink:href="#bogus" style="fill: limegreen"/>
      <polygon id="EDGES-l27-o1" xlink:href="#bogus" style="fill: limegreen"/>
      <polygon id="CORNERS-l19-o1" xlink:href="#bogus" style="fill: limegreen"/>
      <polygon id="CORNERS-l8-o0" xlink:href="#bogus" style="fill: limegreen"/>
      <polygon id="EDGES-l3-o0" xlink:href="#bogus" style="fill: limegreen"/>
      <polygon id="CORNERS-l3-o2" xlink:href="#bogus" style="fill: limegreen"/>
      </g><g><title>L</title>
      <polygon id="EDGES-l5-o1" xlink:href="#bogus" style="fill: #660099"/>
      <polygon id="EDGES-l8-o1" xlink:href="#bogus" style="fill: #660099"/>
      <polygon id="CENTERS-l3-o0" xlink:href="#bogus" style="fill: #660099"/>
      <polygon id="CENTERS-l3-o1" xlink:href="#bogus" style="fill: #660099"/>
      <polygon id="CENTERS-l3-o2" xlink:href="#bogus" style="fill: #660099"/>
      <polygon id="CENTERS-l3-o3" xlink:href="#bogus" style="fill: #660099"/>
      <polygon id="CENTERS-l3-o4" xlink:href="#bogus" style="fill: #660099"/>
      <polygon id="EDGES-l4-o1" xlink:href="#bogus" style="fill: #660099"/>
      <polygon id="CORNERS-l3-o1" xlink:href="#bogus" style="fill: #660099"/>
      <polygon id="CORNERS-l4-o0" xlink:href="#bogus" style="fill: #660099"/>
      <polygon id="EDGES-l10-o1" xlink:href="#bogus" style="fill: #660099"/>
      <polygon id="CORNERS-l5-o2" xlink:href="#bogus" style="fill: #660099"/>
      </g><g><title>BL</title>
      <polygon id="EDGES-l14-o1" xlink:href="#bogus" style="fill: yellow"/>
      <polygon id="EDGES-l5-o0" xlink:href="#bogus" style="fill: yellow"/>
      <polygon id="CENTERS-l4-o0" xlink:href="#bogus" style="fill: yellow"/>
      <polygon id="CENTERS-l4-o1" xlink:href="#bogus" style="fill: yellow"/>
      <polygon id="CENTERS-l4-o2" xlink:href="#bogus" style="fill: yellow"/>
      <polygon id="CENTERS-l4-o3" xlink:href="#bogus" style="fill: yellow"/>
      <polygon id="CENTERS-l4-o4" xlink:href="#bogus" style="fill: yellow"/>
      <polygon id="EDGES-l12-o1" xlink:href="#bogus" style="fill: yellow"/>
      <polygon id="CORNERS-l5-o1" xlink:href="#bogus" style="fill: yellow"/>
      <polygon id="CORNERS-l10-o0" xlink:href="#bogus" style="fill: yellow"/>
      <polygon id="EDGES-l16-o0" xlink:href="#bogus" style="fill: yellow"/>
      <polygon id="CORNERS-l11-o2" xlink:href="#bogus" style="fill: yellow"/>
      </g><g><title>BR</title>
      <polygon id="EDGES-l21-o0" xlink:href="#bogus" style="fill: rgb(34, 102, 255)"/>
      <polygon id="EDGES-l14-o0" xlink:href="#bogus" style="fill: rgb(34, 102, 255)"/>
      <polygon id="CENTERS-l5-o0" xlink:href="#bogus" style="fill: rgb(34, 102, 255)"/>
      <polygon id="CENTERS-l5-o1" xlink:href="#bogus" style="fill: rgb(34, 102, 255)"/>
      <polygon id="CENTERS-l5-o2" xlink:href="#bogus" style="fill: rgb(34, 102, 255)"/>
      <polygon id="CENTERS-l5-o3" xlink:href="#bogus" style="fill: rgb(34, 102, 255)"/>
      <polygon id="CENTERS-l5-o4" xlink:href="#bogus" style="fill: rgb(34, 102, 255)"/>
      <polygon id="EDGES-l18-o1" xlink:href="#bogus" style="fill: rgb(34, 102, 255)"/>
      <polygon id="CORNERS-l11-o1" xlink:href="#bogus" style="fill: rgb(34, 102, 255)"/>
      <polygon id="CORNERS-l13-o0" xlink:href="#bogus" style="fill: rgb(34, 102, 255)"/>
      <polygon id="EDGES-l28-o1" xlink:href="#bogus" style="fill: rgb(34, 102, 255)"/>
      <polygon id="CORNERS-l12-o2" xlink:href="#bogus" style="fill: rgb(34, 102, 255)"/>
      </g><g><title>R</title>
      <polygon id="CORNERS-l19-o2" xlink:href="#bogus" style="fill: red"/>
      <polygon id="EDGES-l19-o1" xlink:href="#bogus" style="fill: red"/>
      <polygon id="CENTERS-l1-o0" xlink:href="#bogus" style="fill: red"/>
      <polygon id="CENTERS-l1-o1" xlink:href="#bogus" style="fill: red"/>
      <polygon id="CENTERS-l1-o2" xlink:href="#bogus" style="fill: red"/>
      <polygon id="CENTERS-l1-o3" xlink:href="#bogus" style="fill: red"/>
      <polygon id="CENTERS-l1-o4" xlink:href="#bogus" style="fill: red"/>
      <polygon id="EDGES-l2-o1" xlink:href="#bogus" style="fill: red"/>
      <polygon id="EDGES-l21-o1" xlink:href="#bogus" style="fill: red"/>
      <polygon id="CORNERS-l12-o1" xlink:href="#bogus" style="fill: red"/>
      <polygon id="EDGES-l15-o1" xlink:href="#bogus" style="fill: red"/>
      <polygon id="CORNERS-l14-o0" xlink:href="#bogus" style="fill: red"/>
      </g><g><title>C</title>
      <polygon id="CORNERS-l8-o1" xlink:href="#bogus" style="fill: #ffffd0"/>
      <polygon id="EDGES-l9-o1" xlink:href="#bogus" style="fill: #ffffd0"/>
      <polygon id="CORNERS-l19-o0" xlink:href="#bogus" style="fill: #ffffd0"/>
      <polygon id="EDGES-l19-o0" xlink:href="#bogus" style="fill: #ffffd0"/>
      <polygon id="CENTERS-l6-o0" xlink:href="#bogus" style="fill: #ffffd0"/>
      <polygon id="CENTERS-l6-o1" xlink:href="#bogus" style="fill: #ffffd0"/>
      <polygon id="CENTERS-l6-o2" xlink:href="#bogus" style="fill: #ffffd0"/>
      <polygon id="CENTERS-l6-o3" xlink:href="#bogus" style="fill: #ffffd0"/>
      <polygon id="CENTERS-l6-o4" xlink:href="#bogus" style="fill: #ffffd0"/>
      <polygon id="EDGES-l27-o0" xlink:href="#bogus" style="fill: #ffffd0"/>
      <polygon id="EDGES-l29-o1" xlink:href="#bogus" style="fill: #ffffd0"/>
      <polygon id="CORNERS-l14-o2" xlink:href="#bogus" style="fill: #ffffd0"/>
      <polygon id="CORNERS-l16-o1" xlink:href="#bogus" style="fill: #ffffd0"/>
      <polygon id="EDGES-l22-o0" xlink:href="#bogus" style="fill: #ffffd0"/>
      <polygon id="CORNERS-l17-o2" xlink:href="#bogus" style="fill: #ffffd0"/>
      </g><g><title>A</title>
      <polygon id="CORNERS-l4-o1" xlink:href="#bogus" style="fill: #3399ff"/>
      <polygon id="EDGES-l13-o1" xlink:href="#bogus" style="fill: #3399ff"/>
      <polygon id="CORNERS-l3-o0" xlink:href="#bogus" style="fill: #3399ff"/>
      <polygon id="EDGES-l3-o1" xlink:href="#bogus" style="fill: #3399ff"/>
      <polygon id="CENTERS-l7-o0" xlink:href="#bogus" style="fill: #3399ff"/>
      <polygon id="CENTERS-l7-o1" xlink:href="#bogus" style="fill: #3399ff"/>
      <polygon id="CENTERS-l7-o2" xlink:href="#bogus" style="fill: #3399ff"/>
      <polygon id="CENTERS-l7-o3" xlink:href="#bogus" style="fill: #3399ff"/>
      <polygon id="CENTERS-l7-o4" xlink:href="#bogus" style="fill: #3399ff"/>
      <polygon id="EDGES-l4-o0" xlink:href="#bogus" style="fill: #3399ff"/>
      <polygon id="EDGES-l9-o0" xlink:href="#bogus" style="fill: #3399ff"/>
      <polygon id="CORNERS-l8-o2" xlink:href="#bogus" style="fill: #3399ff"/>
      <polygon id="CORNERS-l17-o1" xlink:href="#bogus" style="fill: #3399ff"/>
      <polygon id="EDGES-l11-o0" xlink:href="#bogus" style="fill: #3399ff"/>
      <polygon id="CORNERS-l9-o2" xlink:href="#bogus" style="fill: #3399ff"/>
      </g><g><title>I</title>
      <polygon id="CORNERS-l5-o0" xlink:href="#bogus" style="fill: #ff6633"/>
      <polygon id="EDGES-l12-o0" xlink:href="#bogus" style="fill: #ff6633"/>
      <polygon id="CORNERS-l4-o2" xlink:href="#bogus" style="fill: #ff6633"/>
      <polygon id="EDGES-l13-o0" xlink:href="#bogus" style="fill: #ff6633"/>
      <polygon id="CENTERS-l8-o0" xlink:href="#bogus" style="fill: #ff6633"/>
      <polygon id="CENTERS-l8-o1" xlink:href="#bogus" style="fill: #ff6633"/>
      <polygon id="CENTERS-l8-o2" xlink:href="#bogus" style="fill: #ff6633"/>
      <polygon id="CENTERS-l8-o3" xlink:href="#bogus" style="fill: #ff6633"/>
      <polygon id="CENTERS-l8-o4" xlink:href="#bogus" style="fill: #ff6633"/>
      <polygon id="EDGES-l10-o0" xlink:href="#bogus" style="fill: #ff6633"/>
      <polygon id="EDGES-l23-o0" xlink:href="#bogus" style="fill: #ff6633"/>
      <polygon id="CORNERS-l9-o1" xlink:href="#bogus" style="fill: #ff6633"/>
      <polygon id="CORNERS-l18-o2" xlink:href="#bogus" style="fill: #ff6633"/>
      <polygon id="EDGES-l17-o0" xlink:href="#bogus" style="fill: #ff6633"/>
      <polygon id="CORNERS-l10-o1" xlink:href="#bogus" style="fill: #ff6633"/>
      </g><g><title>BF</title>
      <polygon id="CORNERS-l11-o0" xlink:href="#bogus" style="fill: #99ff00"/>
      <polygon id="EDGES-l18-o0" xlink:href="#bogus" style="fill: #99ff00"/>
      <polygon id="CORNERS-l10-o2" xlink:href="#bogus" style="fill: #99ff00"/>
      <polygon id="EDGES-l17-o1" xlink:href="#bogus" style="fill: #99ff00"/>
      <polygon id="CENTERS-l10-o0" xlink:href="#bogus" style="fill: #99ff00"/>
      <polygon id="CENTERS-l10-o1" xlink:href="#bogus" style="fill: #99ff00"/>
      <polygon id="CENTERS-l10-o2" xlink:href="#bogus" style="fill: #99ff00"/>
      <polygon id="CENTERS-l10-o3" xlink:href="#bogus" style="fill: #99ff00"/>
      <polygon id="CENTERS-l10-o4" xlink:href="#bogus" style="fill: #99ff00"/>
      <polygon id="EDGES-l16-o1" xlink:href="#bogus" style="fill: #99ff00"/>
      <polygon id="EDGES-l20-o0" xlink:href="#bogus" style="fill: #99ff00"/>
      <polygon id="CORNERS-l18-o1" xlink:href="#bogus" style="fill: #99ff00"/>
      <polygon id="CORNERS-l15-o2" xlink:href="#bogus" style="fill: #99ff00"/>
      <polygon id="EDGES-l24-o1" xlink:href="#bogus" style="fill: #99ff00"/>
      <polygon id="CORNERS-l13-o1" xlink:href="#bogus" style="fill: #99ff00"/>
      </g><g><title>E</title>
      <polygon id="CORNERS-l12-o0" xlink:href="#bogus" style="fill: #ff66cc"/>
      <polygon id="EDGES-l15-o0" xlink:href="#bogus" style="fill: #ff66cc"/>
      <polygon id="CORNERS-l13-o2" xlink:href="#bogus" style="fill: #ff66cc"/>
      <polygon id="EDGES-l24-o0" xlink:href="#bogus" style="fill: #ff66cc"/>
      <polygon id="CENTERS-l9-o0" xlink:href="#bogus" style="fill: #ff66cc"/>
      <polygon id="CENTERS-l9-o1" xlink:href="#bogus" style="fill: #ff66cc"/>
      <polygon id="CENTERS-l9-o2" xlink:href="#bogus" style="fill: #ff66cc"/>
      <polygon id="CENTERS-l9-o3" xlink:href="#bogus" style="fill: #ff66cc"/>
      <polygon id="CENTERS-l9-o4" xlink:href="#bogus" style="fill: #ff66cc"/>
      <polygon id="EDGES-l28-o0" xlink:href="#bogus" style="fill: #ff66cc"/>
      <polygon id="EDGES-l25-o0" xlink:href="#bogus" style="fill: #ff66cc"/>
      <polygon id="CORNERS-l15-o1" xlink:href="#bogus" style="fill: #ff66cc"/>
      <polygon id="CORNERS-l16-o2" xlink:href="#bogus" style="fill: #ff66cc"/>
      <polygon id="EDGES-l29-o0" xlink:href="#bogus" style="fill: #ff66cc"/>
      <polygon id="CORNERS-l14-o1" xlink:href="#bogus" style="fill: #ff66cc"/>
      </g><g><title>D</title>
      <polygon id="CORNERS-l17-o0" xlink:href="#bogus" style="fill: #999999"/>
      <polygon id="EDGES-l11-o1" xlink:href="#bogus" style="fill: #999999"/>
      <polygon id="CORNERS-l16-o0" xlink:href="#bogus" style="fill: #999999"/>
      <polygon id="EDGES-l25-o1" xlink:href="#bogus" style="fill: #999999"/>
      <polygon id="CENTERS-l11-o0" xlink:href="#bogus" style="fill: #999999"/>
      <polygon id="CENTERS-l11-o1" xlink:href="#bogus" style="fill: #999999"/>
      <polygon id="CENTERS-l11-o2" xlink:href="#bogus" style="fill: #999999"/>
      <polygon id="CENTERS-l11-o3" xlink:href="#bogus" style="fill: #999999"/>
      <polygon id="CENTERS-l11-o4" xlink:href="#bogus" style="fill: #999999"/>
      <polygon id="EDGES-l22-o1" xlink:href="#bogus" style="fill: #999999"/>
      <polygon id="EDGES-l20-o1" xlink:href="#bogus" style="fill: #999999"/>
      <polygon id="CORNERS-l15-o0" xlink:href="#bogus" style="fill: #999999"/>
      <polygon id="CORNERS-l18-o0" xlink:href="#bogus" style="fill: #999999"/>
      <polygon id="EDGES-l23-o1" xlink:href="#bogus" style="fill: #999999"/>
      <polygon id="CORNERS-l9-o0" xlink:href="#bogus" style="fill: #999999"/>
      </g>
    </g>
  </g>
</svg>
`;
  }
});

// src/cubing/puzzles/implementations/dynamic/megaminx/puzzles-dynamic-megaminx.ts
var puzzles_dynamic_megaminx_exports = {};
__export(puzzles_dynamic_megaminx_exports, {
  megaminxLLSVG: () => megaminxLLSVG
});
var init_puzzles_dynamic_megaminx = __esm({
  "src/cubing/puzzles/implementations/dynamic/megaminx/puzzles-dynamic-megaminx.ts"() {
    "use strict";
    init_megaminx_ll_kpuzzle_svg();
  }
});

// src/cubing/puzzles/implementations/dynamic/4x4x4/4x4x4-ll.kpuzzle.svg.ts
var cube4x4x4LLSVG;
var init_x4x4_ll_kpuzzle_svg = __esm({
  "src/cubing/puzzles/implementations/dynamic/4x4x4/4x4x4-ll.kpuzzle.svg.ts"() {
    "use strict";
    cube4x4x4LLSVG = `<svg
  height="256"
  viewBox="0 0 256 256"
  width="256"
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
>
  <g fill="none" fill-rule="nonzero" stroke="#000">
    <g stroke-linejoin="round" stroke-width="3" transform="translate(17 17)">
      <!-- U -->
      <path id="CORNERS-l1-o0" d="m184.6 147.8v36.8h-36.8v-36.8z" style="fill: white" />
      <path id="EDGES-l10-o0" d="m147.8 184.6h-36.8v-36.8h36.8z" style="fill: white" />
      <path id="EDGES-l0-o0" d="m111 147.8v36.8h-36.8v-36.8z" style="fill: white" />
      <path id="CORNERS-l0-o0" d="m74.2 184.6h-36.8v-36.8h36.8z" style="fill: white" />
      <path id="EDGES-l6-o0" d="m37.4 147.8v-36.8h36.8v36.8z" style="fill: white" />
      <path id="CENTERS-l10-o0" d="m74.2 111h36.8v36.8h-36.8z" style="fill: white" />
      <path id="CENTERS-l21-o0" d="m111 147.8v-36.8h36.8v36.8z" style="fill: white" />
      <path id="EDGES-l2-o0" d="m147.8 111h36.8v36.8h-36.8z" style="fill: white" />
      <path id="EDGES-l21-o0" d="m184.6 74.2v36.8h-36.8v-36.8z" style="fill: white" />
      <path id="CENTERS-l15-o0" d="m147.8 111h-36.8v-36.8h36.8z" style="fill: white" />
      <path id="CENTERS-l6-o0" d="m111 74.2v36.8h-36.8v-36.8z" style="fill: white" />
      <path id="EDGES-l22-o0" d="m74.2 111h-36.8v-36.8h36.8z" style="fill: white" />
      <path id="CORNERS-l6-o0" d="m37.4 74.2v-36.8h36.8v36.8z" style="fill: white" />
      <path id="EDGES-l15-o0" d="m74.2 37.4h36.8v36.8h-36.8z" style="fill: white" />
      <path id="EDGES-l18-o0" d="m111 74.2v-36.8h36.8v36.8z" style="fill: white" />
      <path id="CORNERS-l3-o0" d="m147.8 37.4h36.8v36.8h-36.8z" style="fill: white" />

      <path id="CORNERS-l0-o1" d="m.6000061 221.399997 36.7999939-36.8h36.8v36.8z" style="fill: limegreen" />
      <path id="EDGES-l0-o1" d="m74.2 184.599997h36.8v36.8h-36.8z" style="fill: limegreen" />
      <path id="EDGES-l10-o1" d="m111 221.399997v-36.8h36.8v36.8z" style="fill: limegreen" />
      <path id="CORNERS-l1-o2" d="m147.8 184.599997h36.8l36.799994 36.8h-73.599994z" style="fill: limegreen" />

      <path id="CORNERS-l0-o2" d="m-17.7999969 166.2h36.8l36.7999938 36.8h-73.5999938z" style="fill: orange" transform="matrix(0 1 -1 0 203.600003 165.599997)" />
      <path id="EDGES-l6-o1" d="m.60000305 147.8v-36.8h36.80000005v36.8z" style="fill: orange" transform="matrix(0 1 -1 0 148.400003 110.399997)" />
      <path id="EDGES-l22-o1" d="m.60000305 74.2h36.80000005v36.8h-36.80000005z" style="fill: orange" transform="matrix(0 1 -1 0 111.600003 73.599997)" />
      <path id="CORNERS-l6-o1" d="m-17.7999966 55.8 36.7999997-36.8h36.8v36.8z" style="fill: orange" transform="matrix(0 1 -1 0 56.400003 18.399997)" />

      <path id="CORNERS-l3-o1" d="m147.800006 37.3999992 36.799994-36.79999996h36.8v36.79999996z" style="fill: #26f" transform="matrix(-1 0 0 -1 369.2 37.999998)" />
      <path id="EDGES-l18-o1" d="m111 .59999924h36.8v36.79999996h-36.8z" style="fill: #26f" transform="matrix(-1 0 0 -1 258.8 37.999998)" />
      <path id="EDGES-l15-o1" d="m74.2 37.3999992v-36.79999996h36.8v36.79999996z" style="fill: #26f" transform="matrix(-1 0 0 -1 185.2 37.999998)" />
      <path id="CORNERS-l6-o2" d="m.6.59999924h36.8l36.7999939 36.79999996h-73.5999939z" style="fill: #26f" transform="matrix(-1 0 0 -1 74.8 37.999998)" />

      <path id="CORNERS-l1-o1" d="m166.200018 203 36.799994-36.8h36.8v36.8z" style="fill: red" transform="matrix(0 -1 1 0 18.400012 387.600012)" />
      <path id="EDGES-l2-o1" d="m184.600012 111h36.8v36.8h-36.8z" style="fill: red" transform="matrix(0 -1 1 0 73.600012 332.400012)" />
      <path id="EDGES-l21-o1" d="m184.600012 111v-36.8h36.8v36.8z" style="fill: red" transform="matrix(0 -1 1 0 110.400012 295.600012)" />
      <path id="CORNERS-l3-o2" d="m166.200012 19h36.8l36.8 36.8h-73.6z" style="fill: red" transform="matrix(0 -1 1 0 165.600012 240.400012)" />
    </g>
    <g opacity="0" transform="translate(17 242)">
      <path id="EDGES-l1-o0" d="m12 0v1h-1v-1z" style="fill: limegreen" />
      <path id="CENTERS-l0-o0" d="m10 1h-1v-1h1z" style="fill: limegreen" />
      <path id="CENTERS-l23-o0" d="m9 0v1h-1v-1z" style="fill: limegreen" />
      <path id="EDGES-l20-o0" d="m7 1h-1v-1h1z" style="fill: limegreen" />
      <path id="EDGES-l23-o0" d="m6 2v-1h1v1z" style="fill: limegreen" />
      <path id="CENTERS-l14-o0" d="m8 1h1v1h-1z" style="fill: limegreen" />
      <path id="CENTERS-l1-o0" d="m9 2v-1h1v1z" style="fill: limegreen" />
      <path id="EDGES-l7-o0" d="m11 1h1v1h-1z" style="fill: limegreen" />
      <path id="CORNERS-l4-o1" d="m12 3v1h-1v-1z" style="fill: limegreen" />
      <path id="EDGES-l14-o1" d="m10 4h-1v-1h1z" style="fill: limegreen" />
      <path id="EDGES-l3-o1" d="m9 3v1h-1v-1z" style="fill: limegreen" />
      <path id="CORNERS-l2-o2" d="m7 4h-1v-1h1z" style="fill: limegreen" />

      <path id="CORNERS-l2-o0" d="m6 6v-1h1v1z" style="fill: yellow"/>
      <path id="EDGES-l3-o0" d="m8 5h1v1h-1z" style="fill: yellow"/>
      <path id="EDGES-l14-o0" d="m9 6v-1h1v1z" style="fill: yellow"/>
      <path id="CORNERS-l4-o0" d="m11 5h1v1h-1z" style="fill: yellow"/>
      <path id="EDGES-l5-o0" d="m12 7v1h-1v-1z" style="fill: yellow"/>
      <path id="CENTERS-l3-o0" d="m10 8h-1v-1h1z" style="fill: yellow"/>
      <path id="CENTERS-l16-o0" d="m9 7v1h-1v-1z" style="fill: yellow"/>
      <path id="EDGES-l9-o0" d="m7 8h-1v-1h1z" style="fill: yellow"/>
      <path id="EDGES-l16-o0" d="m6 9v-1h1v1z" style="fill: yellow"/>
      <path id="CENTERS-l8-o0" d="m8 8h1v1h-1z" style="fill: yellow"/>
      <path id="CENTERS-l5-o0" d="m9 9v-1h1v1z" style="fill: yellow"/>
      <path id="EDGES-l12-o0" d="m11 8h1v1h-1z" style="fill: yellow"/>
      <path id="CORNERS-l5-o0" d="m12 10v1h-1v-1z" style="fill: yellow"/>
      <path id="EDGES-l8-o0" d="m10 11h-1v-1h1z" style="fill: yellow"/>
      <path id="EDGES-l19-o0" d="m9 10v1h-1v-1z" style="fill: yellow"/>
      <path id="CORNERS-l7-o0" d="m7 11h-1v-1h1z" style="fill: yellow"/>

      <path id="EDGES-l9-o1" d="m5 0v1h-1v-1z" style="fill: orange" />
      <path id="CENTERS-l20-o0" d="m4 1h1v1h-1z" style="fill: orange" />
      <path id="CENTERS-l22-o0" d="m5 3v1h-1v-1z" style="fill: orange" />
      <path id="EDGES-l20-o1" d="m4 4h-1v-1h1z" style="fill: orange" />
      <path id="EDGES-l23-o1" d="m3 2v-1h1v1z" style="fill: orange" />
      <path id="CENTERS-l17-o0" d="m4 1h-1v-1h1z" style="fill: orange" />
      <path id="CENTERS-l9-o0" d="m2 0v1h-1v-1z" style="fill: orange" />
      <path id="EDGES-l16-o1" d="m1 1h1v1h-1z" style="fill: orange" />
      <path id="CORNERS-l7-o2" d="m2 3v1h-1v-1z" style="fill: orange" />
      <path id="EDGES-l17-o1" d="m1 4h-1v-1h1z" style="fill: orange" />
      <path id="EDGES-l13-o1" d="m0 2v-1h1v1z" style="fill: orange" />
      <path id="CORNERS-l2-o1" d="m1 1h-1v-1h1z" style="fill: orange" />

      <path id="EDGES-l11-o0" d="m25 3v1h-1v-1z" style="fill: #26f" />
      <path id="CENTERS-l19-o0" d="m23 4h-1v-1h1z" style="fill: #26f" />
      <path id="CENTERS-l13-o0" d="m22 3v1h-1v-1z" style="fill: #26f" />
      <path id="EDGES-l17-o0" d="m20 4h-1v-1h1z" style="fill: #26f" />
      <path id="EDGES-l13-o0" d="m19 2v-1h1v1z" style="fill: #26f" />
      <path id="CENTERS-l18-o0" d="m21 1h1v1h-1z" style="fill: #26f" />
      <path id="CENTERS-l11-o0" d="m22 2v-1h1v1z" style="fill: #26f" />
      <path id="EDGES-l4-o0" d="m24 1h1v1h-1z" style="fill: #26f" />
      <path id="CORNERS-l7-o1" d="m25 0v1h-1v-1z" style="fill: #26f" />
      <path id="EDGES-l19-o1" d="m23 1h-1v-1h1z" style="fill: #26f" />
      <path id="EDGES-l8-o1" d="m22 0v1h-1v-1z" style="fill: #26f" />
      <path id="CORNERS-l5-o2" d="m20 1h-1v-1h1z" style="fill: #26f" />

      <path id="EDGES-l7-o1" d="m14 4h-1v-1h1z" style="fill: red" />
      <path id="CENTERS-l7-o0" d="m13 2v-1h1v1z" style="fill: red" />
      <path id="CENTERS-l12-o0" d="m14 1h-1v-1h1z" style="fill: red" />
      <path id="EDGES-l5-o1" d="m15 0v1h-1v-1z" style="fill: red" />
      <path id="EDGES-l12-o1" d="m14 1h1v1h-1z" style="fill: red" />
      <path id="CENTERS-l4-o0" d="m15 3v1h-1v-1z" style="fill: red" />
      <path id="CENTERS-l2-o0" d="m17 4h-1v-1h1z" style="fill: red" />
      <path id="EDGES-l1-o1" d="m16 2v-1h1v1z" style="fill: red" />
      <path id="CORNERS-l4-o2" d="m17 1h-1v-1h1z" style="fill: red" />
      <path id="EDGES-l4-o1" d="m18 0v1h-1v-1z" style="fill: red" />
      <path id="EDGES-l11-o1" d="m17 1h1v1h-1z" style="fill: red" />
      <path id="CORNERS-l5-o1" d="m18 3v1h-1v-1z" style="fill: red" />
    </g>
  </g>
</svg>`;
  }
});

// src/cubing/puzzles/implementations/dynamic/4x4x4/puzzles-dynamic-4x4x4.ts
var puzzles_dynamic_4x4x4_exports = {};
__export(puzzles_dynamic_4x4x4_exports, {
  cube4x4x4LLSVG: () => cube4x4x4LLSVG
});
var init_puzzles_dynamic_4x4x4 = __esm({
  "src/cubing/puzzles/implementations/dynamic/4x4x4/puzzles-dynamic-4x4x4.ts"() {
    "use strict";
    init_x4x4_ll_kpuzzle_svg();
  }
});

// src/cubing/kpuzzle/KPuzzle.ts
init_alg();

// src/cubing/kpuzzle/calculate.ts
init_alg();
init_alg();

// src/cubing/kpuzzle/combine.ts
function combineTransformationData(definition, transformationData1, transformationData2) {
  const newTransformationData = {};
  for (const orbitName in definition.orbits) {
    const orbitDefinition = definition.orbits[orbitName];
    const orbit1 = transformationData1[orbitName];
    const orbit2 = transformationData2[orbitName];
    if (isOrbitTransformationDataIdentityUncached(
      orbitDefinition.numOrientations,
      orbit2
    )) {
      newTransformationData[orbitName] = orbit1;
    } else if (isOrbitTransformationDataIdentityUncached(
      orbitDefinition.numOrientations,
      orbit1
    )) {
      newTransformationData[orbitName] = orbit2;
    } else {
      const newPerm = new Array(orbitDefinition.numPieces);
      if (orbitDefinition.numOrientations === 1) {
        for (let idx = 0; idx < orbitDefinition.numPieces; idx++) {
          newPerm[idx] = orbit1.permutation[orbit2.permutation[idx]];
        }
        newTransformationData[orbitName] = {
          permutation: newPerm,
          orientation: orbit1.orientation
        };
      } else {
        const newOri = new Array(orbitDefinition.numPieces);
        for (let idx = 0; idx < orbitDefinition.numPieces; idx++) {
          newOri[idx] = (orbit1.orientation[orbit2.permutation[idx]] + orbit2.orientation[idx]) % orbitDefinition.numOrientations;
          newPerm[idx] = orbit1.permutation[orbit2.permutation[idx]];
        }
        newTransformationData[orbitName] = {
          permutation: newPerm,
          orientation: newOri
        };
      }
    }
  }
  return newTransformationData;
}
function applyTransformationDataToStateData(definition, stateData, transformationData) {
  const newStateData = {};
  for (const orbitName in definition.orbits) {
    const orbitDefinition = definition.orbits[orbitName];
    const orbit1 = stateData[orbitName];
    const orbit2 = transformationData[orbitName];
    if (isOrbitTransformationDataIdentityUncached(
      orbitDefinition.numOrientations,
      orbit2
    )) {
      newStateData[orbitName] = orbit1;
    } else {
      const newPieces = new Array(orbitDefinition.numPieces);
      if (orbitDefinition.numOrientations === 1) {
        for (let idx = 0; idx < orbitDefinition.numPieces; idx++) {
          newPieces[idx] = orbit1.pieces[orbit2.permutation[idx]];
        }
        newStateData[orbitName] = {
          pieces: newPieces,
          orientation: orbit1.orientation
        };
      } else {
        const newOri = new Array(orbitDefinition.numPieces);
        for (let idx = 0; idx < orbitDefinition.numPieces; idx++) {
          newOri[idx] = (orbit1.orientation[orbit2.permutation[idx]] + orbit2.orientation[idx]) % orbitDefinition.numOrientations;
          newPieces[idx] = orbit1.pieces[orbit2.permutation[idx]];
        }
        newStateData[orbitName] = {
          pieces: newPieces,
          orientation: newOri
        };
      }
    }
  }
  return newStateData;
}

// src/cubing/kpuzzle/construct.ts
var FREEZE = false;
var identityOrbitCache = /* @__PURE__ */ new Map();
function constructIdentityOrbitTransformation(numPieces) {
  const cached = identityOrbitCache.get(numPieces);
  if (cached) {
    return cached;
  }
  const newPermutation = new Array(numPieces);
  const newOrientation = new Array(numPieces);
  for (let i = 0; i < numPieces; i++) {
    newPermutation[i] = i;
    newOrientation[i] = 0;
  }
  const orbitTransformation = {
    permutation: newPermutation,
    orientation: newOrientation
  };
  if (FREEZE) {
    Object.freeze(newPermutation);
    Object.freeze(newOrientation);
    Object.freeze(orbitTransformation);
  }
  identityOrbitCache.set(numPieces, orbitTransformation);
  return orbitTransformation;
}
function constructIdentityTransformationDataUncached(definition) {
  const transformation = {};
  for (const [orbitName, orbitDefinition] of Object.entries(
    definition.orbits
  )) {
    transformation[orbitName] = constructIdentityOrbitTransformation(
      orbitDefinition.numPieces
    );
  }
  if (FREEZE) {
    Object.freeze(transformation);
  }
  return transformation;
}
function moveToTransformationUncached(kpuzzle2, move) {
  const quantumKey = move.quantum.toString();
  let quantumMoveDefinition = kpuzzle2.definition.moves[quantumKey];
  if (!quantumMoveDefinition) {
    const derivedFrom = kpuzzle2.definition.experimentalDerivedMoves?.[quantumKey];
    if (derivedFrom) {
      quantumMoveDefinition = kpuzzle2.algToTransformation(derivedFrom).transformationData;
    }
  }
  if (quantumMoveDefinition) {
    return repeatTransformationUncached(
      kpuzzle2,
      quantumMoveDefinition,
      move.amount
    );
  }
  const moveDefinition = kpuzzle2.definition.moves[move.toString()];
  if (moveDefinition) {
    return moveDefinition;
  }
  const inverseMoveDefinition = kpuzzle2.definition.moves[move.invert().toString()];
  if (inverseMoveDefinition) {
    return repeatTransformationUncached(kpuzzle2, inverseMoveDefinition, -1);
  }
  throw new Error(`Invalid move for KPuzzle (${kpuzzle2.name()}): ${move}`);
}

// src/cubing/kpuzzle/KState.ts
var KState = class {
  constructor(kpuzzle2, stateData) {
    this.kpuzzle = kpuzzle2;
    this.stateData = stateData;
  }
  toJSON() {
    return {
      experimentalPuzzleName: this.kpuzzle.name(),
      stateData: this.stateData
    };
  }
  static fromTransformation(transformation) {
    const newStateData = applyTransformationDataToStateData(
      transformation.kpuzzle.definition,
      transformation.kpuzzle.definition.startStateData,
      transformation.transformationData
    );
    return new KState(transformation.kpuzzle, newStateData);
  }
  // Convenience function
  /** @deprecated */
  apply(source) {
    return this.applyTransformation(this.kpuzzle.toTransformation(source));
  }
  applyTransformation(transformation) {
    if (transformation.isIdentityTransformation()) {
      return new KState(this.kpuzzle, this.stateData);
    }
    const newStateData = applyTransformationDataToStateData(
      this.kpuzzle.definition,
      this.stateData,
      transformation.transformationData
    );
    return new KState(this.kpuzzle, newStateData);
  }
  applyMove(move) {
    return this.applyTransformation(this.kpuzzle.moveToTransformation(move));
  }
  applyAlg(alg) {
    return this.applyTransformation(this.kpuzzle.algToTransformation(alg));
  }
  /** @deprecated */
  experimentalToTransformation() {
    if (!this.kpuzzle.canConvertStateToUniqueTransformation()) {
      return null;
    }
    const transformationData = {};
    for (const [orbitName, stateOrbitData] of Object.entries(this.stateData)) {
      const transformationOrbit = {
        permutation: stateOrbitData.pieces,
        orientation: stateOrbitData.orientation
      };
      transformationData[orbitName] = transformationOrbit;
    }
    return new KTransformation(this.kpuzzle, transformationData);
  }
  experimentalIsSolved(options) {
    if (!this.kpuzzle.definition.experimentalIsStateSolved) {
      throw new Error(
        "`KState.experimentalIsSolved()` is not supported for this puzzle at the moment."
      );
    }
    return this.kpuzzle.definition.experimentalIsStateSolved(this, options);
  }
};

// src/cubing/kpuzzle/KTransformation.ts
var KTransformation = class {
  constructor(kpuzzle2, transformationData) {
    this.kpuzzle = kpuzzle2;
    this.transformationData = transformationData;
  }
  toJSON() {
    return {
      experimentalPuzzleName: this.kpuzzle.name(),
      transformationData: this.transformationData
    };
  }
  invert() {
    return new KTransformation(
      this.kpuzzle,
      invertTransformation(this.kpuzzle, this.transformationData)
    );
  }
  // For optimizations, we want to make it cheap to rely on optimizations when a
  // transformation is an identity. Here, we try to make it cheaper by:
  // - only calculating when needed, and
  // - caching the result.
  #cachedIsIdentity;
  // TODO: is `null` worse here?
  isIdentityTransformation() {
    return this.#cachedIsIdentity ?? (this.#cachedIsIdentity = this.isIdentical(
      this.kpuzzle.identityTransformation()
    ));
  }
  /** @deprecated */
  static experimentalConstructIdentity(kpuzzle2) {
    const transformation = new KTransformation(
      kpuzzle2,
      constructIdentityTransformationDataUncached(kpuzzle2.definition)
    );
    transformation.#cachedIsIdentity = true;
    return transformation;
  }
  isIdentical(t2) {
    return isTransformationDataIdentical(
      this.kpuzzle,
      this.transformationData,
      t2.transformationData
    );
  }
  // Convenience function
  /** @deprecated */
  apply(source) {
    return this.applyTransformation(this.kpuzzle.toTransformation(source));
  }
  applyTransformation(t2) {
    if (this.kpuzzle !== t2.kpuzzle) {
      throw new Error(
        `Tried to apply a transformation for a KPuzzle (${t2.kpuzzle.name()}) to a different KPuzzle (${this.kpuzzle.name()}).`
      );
    }
    if (this.#cachedIsIdentity) {
      return new KTransformation(this.kpuzzle, t2.transformationData);
    }
    if (t2.#cachedIsIdentity) {
      return new KTransformation(this.kpuzzle, this.transformationData);
    }
    return new KTransformation(
      this.kpuzzle,
      combineTransformationData(
        this.kpuzzle.definition,
        this.transformationData,
        t2.transformationData
      )
    );
  }
  applyMove(move) {
    return this.applyTransformation(this.kpuzzle.moveToTransformation(move));
  }
  applyAlg(alg) {
    return this.applyTransformation(this.kpuzzle.algToTransformation(alg));
  }
  // Convenience. Useful for chaining.
  toKState() {
    return KState.fromTransformation(this);
  }
  repetitionOrder() {
    return transformationRepetitionOrder(this.kpuzzle.definition, this);
  }
  selfMultiply(amount) {
    return new KTransformation(
      this.kpuzzle,
      repeatTransformationUncached(
        this.kpuzzle,
        this.transformationData,
        amount
      )
    );
  }
};

// src/cubing/kpuzzle/calculate.ts
function isOrbitTransformationDataIdentityUncached(numOrientations, orbitTransformationData) {
  const { permutation } = orbitTransformationData;
  const numPieces = permutation.length;
  for (let idx = 0; idx < numPieces; idx++) {
    if (permutation[idx] !== idx) {
      return false;
    }
  }
  if (numOrientations > 1) {
    const { orientation: orientation2 } = orbitTransformationData;
    for (let idx = 0; idx < numPieces; idx++) {
      if (orientation2[idx] !== 0) {
        return false;
      }
    }
  }
  return true;
}
function isOrbitTransformationDataIdentical(orbitDefinition, orbitTransformationData1, orbitTransformationData2, options = {}) {
  for (let idx = 0; idx < orbitDefinition.numPieces; idx++) {
    if (!options?.ignoreOrientation && orbitTransformationData1.orientation[idx] !== orbitTransformationData2.orientation[idx]) {
      return false;
    }
    if (!options?.ignorePermutation && orbitTransformationData1.permutation[idx] !== orbitTransformationData2.permutation[idx]) {
      return false;
    }
  }
  return true;
}
function isTransformationDataIdentical(kpuzzle2, transformationData1, transformationData2) {
  for (const [orbitName, orbitDefinition] of Object.entries(
    kpuzzle2.definition.orbits
  )) {
    if (!isOrbitTransformationDataIdentical(
      orbitDefinition,
      transformationData1[orbitName],
      transformationData2[orbitName]
    )) {
      return false;
    }
  }
  return true;
}
function invertTransformation(kpuzzle2, transformationData) {
  const newTransformationData = {};
  for (const orbitName in kpuzzle2.definition.orbits) {
    const orbitDefinition = kpuzzle2.definition.orbits[orbitName];
    const orbitTransformationData = transformationData[orbitName];
    if (isOrbitTransformationDataIdentityUncached(
      orbitDefinition.numOrientations,
      orbitTransformationData
    )) {
      newTransformationData[orbitName] = orbitTransformationData;
    } else if (orbitDefinition.numOrientations === 1) {
      const newPerm = new Array(orbitDefinition.numPieces);
      for (let idx = 0; idx < orbitDefinition.numPieces; idx++) {
        newPerm[orbitTransformationData.permutation[idx]] = idx;
      }
      newTransformationData[orbitName] = {
        permutation: newPerm,
        orientation: orbitTransformationData.orientation
      };
    } else {
      const newPerm = new Array(orbitDefinition.numPieces);
      const newOri = new Array(orbitDefinition.numPieces);
      for (let idx = 0; idx < orbitDefinition.numPieces; idx++) {
        const fromIdx = orbitTransformationData.permutation[idx];
        newPerm[fromIdx] = idx;
        newOri[fromIdx] = (orbitDefinition.numOrientations - orbitTransformationData.orientation[idx] + orbitDefinition.numOrientations) % orbitDefinition.numOrientations;
      }
      newTransformationData[orbitName] = {
        permutation: newPerm,
        orientation: newOri
      };
    }
  }
  return newTransformationData;
}
function repeatTransformationUncached(kpuzzle2, transformationData, amount) {
  if (amount === 1) {
    return transformationData;
  }
  if (amount < 0) {
    return repeatTransformationUncached(
      kpuzzle2,
      invertTransformation(kpuzzle2, transformationData),
      -amount
    );
  }
  if (amount === 0) {
    const { transformationData: transformationData2 } = kpuzzle2.identityTransformation();
    return transformationData2;
  }
  let halfish = transformationData;
  if (amount !== 2) {
    halfish = repeatTransformationUncached(
      kpuzzle2,
      transformationData,
      Math.floor(amount / 2)
    );
  }
  const twiceHalfish = combineTransformationData(
    kpuzzle2.definition,
    halfish,
    halfish
  );
  if (amount % 2 === 0) {
    return twiceHalfish;
  } else {
    return combineTransformationData(
      kpuzzle2.definition,
      transformationData,
      twiceHalfish
    );
  }
}
var AlgToTransformationTraversal = class extends TraversalDownUp {
  traverseAlg(alg, kpuzzle2) {
    let transformation = null;
    for (const algNode of alg.childAlgNodes()) {
      if (transformation) {
        transformation = transformation.applyTransformation(
          this.traverseAlgNode(algNode, kpuzzle2)
        );
      } else {
        transformation = this.traverseAlgNode(algNode, kpuzzle2);
      }
    }
    return transformation ?? kpuzzle2.identityTransformation();
  }
  traverseGrouping(grouping, kpuzzle2) {
    const algTransformation = this.traverseAlg(grouping.alg, kpuzzle2);
    return new KTransformation(
      kpuzzle2,
      repeatTransformationUncached(
        kpuzzle2,
        algTransformation.transformationData,
        grouping.amount
      )
    );
  }
  traverseMove(move, kpuzzle2) {
    return kpuzzle2.moveToTransformation(move);
  }
  traverseCommutator(commutator, kpuzzle2) {
    const aTransformation = this.traverseAlg(commutator.A, kpuzzle2);
    const bTransformation = this.traverseAlg(commutator.B, kpuzzle2);
    return aTransformation.applyTransformation(bTransformation).applyTransformation(aTransformation.invert()).applyTransformation(bTransformation.invert());
  }
  traverseConjugate(conjugate, kpuzzle2) {
    const aTransformation = this.traverseAlg(conjugate.A, kpuzzle2);
    const bTransformation = this.traverseAlg(conjugate.B, kpuzzle2);
    return aTransformation.applyTransformation(bTransformation).applyTransformation(aTransformation.invert());
  }
  traversePause(_, kpuzzle2) {
    return kpuzzle2.identityTransformation();
  }
  traverseNewline(_, kpuzzle2) {
    return kpuzzle2.identityTransformation();
  }
  traverseLineComment(_, kpuzzle2) {
    return kpuzzle2.identityTransformation();
  }
};
var algToTransformation = functionFromTraversal(
  AlgToTransformationTraversal
);
function gcd(a, b) {
  if (b) {
    return gcd(b, a % b);
  }
  return a;
}
function transformationRepetitionOrder(definition, transformation) {
  let order2 = 1;
  for (const orbitName in definition.orbits) {
    const orbitDefinition = definition.orbits[orbitName];
    const transformationOrbit = transformation.transformationData[orbitName];
    const orbitPieces = new Array(orbitDefinition.numPieces);
    for (let startIdx = 0; startIdx < orbitDefinition.numPieces; startIdx++) {
      if (!orbitPieces[startIdx]) {
        let currentIdx = startIdx;
        let orientationSum = 0;
        let cycleLength = 0;
        for (; ; ) {
          orbitPieces[currentIdx] = true;
          orientationSum = orientationSum + transformationOrbit.orientation[currentIdx];
          cycleLength = cycleLength + 1;
          currentIdx = transformationOrbit.permutation[currentIdx];
          if (currentIdx === startIdx) {
            break;
          }
        }
        if (orientationSum !== 0) {
          cycleLength = cycleLength * orbitDefinition.numOrientations / gcd(orbitDefinition.numOrientations, Math.abs(orientationSum));
        }
        order2 = order2 * cycleLength / gcd(order2, cycleLength);
      }
    }
  }
  return order2;
}

// src/cubing/kpuzzle/KPuzzle.ts
var KPuzzle = class {
  constructor(definition, options) {
    this.definition = definition;
    this.#moveToTransformationDataCache = /* @__PURE__ */ new Map();
    this.experimentalPGNotation = options?.experimentalPGNotation;
  }
  name() {
    return this.definition.name;
  }
  identityTransformation() {
    return KTransformation.experimentalConstructIdentity(this);
  }
  #moveToTransformationDataCache;
  moveToTransformation(move) {
    if (typeof move === "string") {
      move = new Move(move);
    }
    const cacheKey = move.toString();
    const cachedTransformationData = this.#moveToTransformationDataCache.get(cacheKey);
    if (cachedTransformationData) {
      return new KTransformation(this, cachedTransformationData);
    }
    if (this.experimentalPGNotation) {
      const transformationData2 = this.experimentalPGNotation.lookupMove(move);
      if (!transformationData2) {
        throw new Error(`could not map to internal move: ${move}`);
      }
      this.#moveToTransformationDataCache.set(cacheKey, transformationData2);
      return new KTransformation(this, transformationData2);
    }
    const transformationData = moveToTransformationUncached(this, move);
    this.#moveToTransformationDataCache.set(cacheKey, transformationData);
    return new KTransformation(this, transformationData);
  }
  algToTransformation(alg) {
    if (typeof alg === "string") {
      alg = new Alg(alg);
    }
    return algToTransformation(alg, this);
  }
  /** @deprecated */
  toTransformation(source) {
    if (typeof source === "string") {
      return this.algToTransformation(source);
    } else if (source?.is?.(Alg)) {
      return this.algToTransformation(source);
    } else if (source?.is?.(Move)) {
      return this.moveToTransformation(source);
    } else {
      return source;
    }
  }
  startState() {
    return new KState(this, this.definition.startStateData);
  }
  #cachedCanConvertStateToUniqueTransformation;
  // TODO: Handle incomplete start state data
  canConvertStateToUniqueTransformation() {
    return this.#cachedCanConvertStateToUniqueTransformation ?? (this.#cachedCanConvertStateToUniqueTransformation = (() => {
      for (const [orbitName, orbitDefinition] of Object.entries(
        this.definition.orbits
      )) {
        const pieces = new Array(orbitDefinition.numPieces).fill(false);
        for (const piece of this.definition.startStateData[orbitName].pieces) {
          pieces[piece] = true;
        }
        for (const piece of pieces) {
          if (!piece) {
            return false;
          }
        }
      }
      return true;
    })());
  }
};

// src/bin/order.ts
init_puzzle_geometry();

// src/cubing/puzzles/events.ts
var wcaEvents = {
  "333": { puzzleID: "3x3x3", eventName: "3x3x3 Cube" },
  "222": { puzzleID: "2x2x2", eventName: "2x2x2 Cube" },
  "444": { puzzleID: "4x4x4", eventName: "4x4x4 Cube" },
  "555": { puzzleID: "5x5x5", eventName: "5x5x5 Cube" },
  "666": { puzzleID: "6x6x6", eventName: "6x6x6 Cube" },
  "777": { puzzleID: "7x7x7", eventName: "7x7x7 Cube" },
  "333bf": { puzzleID: "3x3x3", eventName: "3x3x3 Blindfolded" },
  "333fm": { puzzleID: "3x3x3", eventName: "3x3x3 Fewest Moves" },
  "333oh": { puzzleID: "3x3x3", eventName: "3x3x3 One-Handed" },
  clock: { puzzleID: "clock", eventName: "Clock" },
  minx: { puzzleID: "megaminx", eventName: "Megaminx" },
  pyram: { puzzleID: "pyraminx", eventName: "Pyraminx" },
  skewb: { puzzleID: "skewb", eventName: "Skewb" },
  sq1: { puzzleID: "square1", eventName: "Square-1" },
  "444bf": { puzzleID: "4x4x4", eventName: "4x4x4 Blindfolded" },
  "555bf": { puzzleID: "5x5x5", eventName: "5x5x5 Blindfolded" },
  "333mb": { puzzleID: "3x3x3", eventName: "3x3x3 Multi-Blind" }
};
var twizzleEvents = {
  ...wcaEvents,
  fto: { puzzleID: "fto", eventName: "Face-Turning Octahedron" },
  master_tetraminx: {
    puzzleID: "master_tetraminx",
    eventName: "Master Tetraminx"
  },
  kilominx: {
    puzzleID: "kilominx",
    eventName: "Kilominx"
  },
  redi_cube: {
    puzzleID: "redi_cube",
    eventName: "Redi Cube"
  }
};

// src/cubing/puzzles/stickerings/mask.ts
var PieceAnnotation = class {
  constructor(kpuzzle2, defaultValue) {
    this.stickerings = /* @__PURE__ */ new Map();
    for (const [orbitName, orbitDef] of Object.entries(
      kpuzzle2.definition.orbits
    )) {
      this.stickerings.set(
        orbitName,
        new Array(orbitDef.numPieces).fill(defaultValue)
      );
    }
  }
};
var regular = "regular";
var ignored = "ignored";
var oriented = "oriented";
var invisible = "invisible";
var dim = "dim";
var pieceStickerings = {
  // regular
  ["Regular" /* Regular */]: {
    // r
    facelets: [regular, regular, regular, regular, regular]
  },
  // ignored
  ["Ignored" /* Ignored */]: {
    // i
    facelets: [ignored, ignored, ignored, ignored, ignored]
  },
  // oriented stickers
  ["OrientationStickers" /* OrientationStickers */]: {
    // o
    facelets: [oriented, oriented, oriented, oriented, oriented]
  },
  // "OLL"
  ["IgnoreNonPrimary" /* IgnoreNonPrimary */]: {
    // riiii
    facelets: [regular, ignored, ignored, ignored, ignored]
  },
  // invisible
  ["Invisible" /* Invisible */]: {
    // invisiblePiece
    facelets: [invisible, invisible, invisible, invisible, invisible]
  },
  // "PLL"
  ["PermuteNonPrimary" /* PermuteNonPrimary */]: {
    // drrrr
    facelets: [dim, regular, regular, regular, regular]
  },
  // ignored
  ["Dim" /* Dim */]: {
    // d
    facelets: [dim, dim, dim, dim, dim]
  },
  // "OLL"
  ["Ignoriented" /* Ignoriented */]: {
    // diiii
    facelets: [dim, ignored, ignored, ignored, ignored]
  },
  ["OrientationWithoutPermutation" /* OrientationWithoutPermutation */]: {
    // oiiii
    facelets: [oriented, ignored, ignored, ignored, ignored]
  }
};
function getPieceStickeringMask(pieceStickering) {
  return pieceStickerings[pieceStickering];
}
var PuzzleStickering = class extends PieceAnnotation {
  constructor(kpuzzle2) {
    super(kpuzzle2, "Regular" /* Regular */);
  }
  set(pieceSet, pieceStickering) {
    for (const [orbitName, pieces] of this.stickerings.entries()) {
      for (let i = 0; i < pieces.length; i++) {
        if (pieceSet.stickerings.get(orbitName)[i]) {
          pieces[i] = pieceStickering;
        }
      }
    }
    return this;
  }
  toStickeringMask() {
    const stickeringMask = { orbits: {} };
    for (const [orbitName, pieceStickerings2] of this.stickerings.entries()) {
      const pieces = [];
      const orbitStickeringMask = {
        pieces
      };
      stickeringMask.orbits[orbitName] = orbitStickeringMask;
      for (const pieceStickering of pieceStickerings2) {
        pieces.push(getPieceStickeringMask(pieceStickering));
      }
    }
    return stickeringMask;
  }
};
var StickeringManager = class {
  constructor(kpuzzle2) {
    this.kpuzzle = kpuzzle2;
  }
  and(pieceSets) {
    const newPieceSet = new PieceAnnotation(this.kpuzzle, false);
    for (const [orbitName, orbitDef] of Object.entries(
      this.kpuzzle.definition.orbits
    )) {
      pieceLoop:
        for (let i = 0; i < orbitDef.numPieces; i++) {
          newPieceSet.stickerings.get(orbitName)[i] = true;
          for (const pieceSet of pieceSets) {
            if (!pieceSet.stickerings.get(orbitName)[i]) {
              newPieceSet.stickerings.get(orbitName)[i] = false;
              continue pieceLoop;
            }
          }
        }
    }
    return newPieceSet;
  }
  or(pieceSets) {
    const newPieceSet = new PieceAnnotation(this.kpuzzle, false);
    for (const [orbitName, orbitDef] of Object.entries(
      this.kpuzzle.definition.orbits
    )) {
      pieceLoop:
        for (let i = 0; i < orbitDef.numPieces; i++) {
          newPieceSet.stickerings.get(orbitName)[i] = false;
          for (const pieceSet of pieceSets) {
            if (pieceSet.stickerings.get(orbitName)[i]) {
              newPieceSet.stickerings.get(orbitName)[i] = true;
              continue pieceLoop;
            }
          }
        }
    }
    return newPieceSet;
  }
  not(pieceSet) {
    const newPieceSet = new PieceAnnotation(this.kpuzzle, false);
    for (const [orbitName, orbitDef] of Object.entries(
      this.kpuzzle.definition.orbits
    )) {
      for (let i = 0; i < orbitDef.numPieces; i++) {
        newPieceSet.stickerings.get(orbitName)[i] = !pieceSet.stickerings.get(orbitName)[i];
      }
    }
    return newPieceSet;
  }
  all() {
    return this.and(this.moves([]));
  }
  move(moveSource) {
    const transformation = this.kpuzzle.moveToTransformation(moveSource);
    const newPieceSet = new PieceAnnotation(this.kpuzzle, false);
    for (const [orbitName, orbitDef] of Object.entries(
      this.kpuzzle.definition.orbits
    )) {
      for (let i = 0; i < orbitDef.numPieces; i++) {
        if (transformation.transformationData[orbitName].permutation[i] !== i || transformation.transformationData[orbitName].orientation[i] !== 0) {
          newPieceSet.stickerings.get(orbitName)[i] = true;
        }
      }
    }
    return newPieceSet;
  }
  moves(moveSources) {
    return moveSources.map((moveSource) => this.move(moveSource));
  }
  orbits(orbitNames) {
    const pieceSet = new PieceAnnotation(this.kpuzzle, false);
    for (const orbitName of orbitNames) {
      pieceSet.stickerings.get(orbitName).fill(true);
    }
    return pieceSet;
  }
  orbitPrefix(orbitPrefix) {
    const pieceSet = new PieceAnnotation(this.kpuzzle, false);
    for (const orbitName in this.kpuzzle.definition.orbits) {
      if (orbitName.startsWith(orbitPrefix)) {
        pieceSet.stickerings.get(orbitName).fill(true);
      }
    }
    return pieceSet;
  }
  // trueCounts(pieceSet: PieceSet): Record<string, number> {
  //   const counts: Record<string, number> = {};
  //   for (const [orbitName, orbitDef] of Object.entries(this.def.orbits)) {
  //     let count = 0;
  //     for (let i = 0; i < orbitDef.numPieces; i++) {
  //       if (pieceSet.stickerings.get(orbitName)![i]) {
  //         count++;
  //       }
  //     }
  //     counts[orbitName] = count;
  //   }
  //   return counts;
  // }
};

// src/cubing/puzzles/stickerings/puzzle-stickerings.ts
var LL = "Last Layer";
var LS = "Last Slot";
var megaAnd3x3x3LL = {
  "3x3x3": LL,
  megaminx: LL
};
var megaAnd3x3x3LS = {
  "3x3x3": LS,
  megaminx: LS
};
var experimentalStickerings = {
  full: { groups: { "3x3x3": "Stickering", megaminx: "Stickering" } },
  // default
  OLL: { groups: megaAnd3x3x3LL },
  PLL: { groups: megaAnd3x3x3LL },
  LL: { groups: megaAnd3x3x3LL },
  EOLL: { groups: megaAnd3x3x3LL },
  COLL: { groups: megaAnd3x3x3LL },
  OCLL: { groups: megaAnd3x3x3LL },
  CPLL: { groups: megaAnd3x3x3LL },
  CLL: { groups: megaAnd3x3x3LL },
  EPLL: { groups: megaAnd3x3x3LL },
  ELL: { groups: megaAnd3x3x3LL },
  ZBLL: { groups: megaAnd3x3x3LL },
  LS: { groups: megaAnd3x3x3LS },
  ELS: { groups: megaAnd3x3x3LS },
  CLS: { groups: megaAnd3x3x3LS },
  ZBLS: { groups: megaAnd3x3x3LS },
  VLS: { groups: megaAnd3x3x3LS },
  WVLS: { groups: megaAnd3x3x3LS },
  F2L: { groups: { "3x3x3": "CFOP (Fridrich)" } },
  Daisy: { groups: { "3x3x3": "CFOP (Fridrich)" } },
  Cross: { groups: { "3x3x3": "CFOP (Fridrich)" } },
  EO: { groups: { "3x3x3": "ZZ" } },
  EOline: { groups: { "3x3x3": "ZZ" } },
  EOcross: { groups: { "3x3x3": "ZZ" } },
  CMLL: { groups: { "3x3x3": "Roux" } },
  L10P: { groups: { "3x3x3": "Roux" } },
  L6E: { groups: { "3x3x3": "Roux" } },
  L6EO: { groups: { "3x3x3": "Roux" } },
  "2x2x2": { groups: { "3x3x3": "Petrus" } },
  "2x2x3": { groups: { "3x3x3": "Petrus" } },
  L2C: {
    groups: {
      "4x4x4": "Reduction",
      "5x5x5": "Reduction",
      "6x6x6": "Reduction"
    }
  },
  PBL: {
    groups: {
      "2x2x2": "Ortega"
    }
  },
  "Void Cube": { groups: { "3x3x3": "Miscellaneous" } },
  invisible: { groups: { "3x3x3": "Miscellaneous" } },
  picture: { groups: { "3x3x3": "Miscellaneous" } },
  "centers-only": { groups: { "3x3x3": "Miscellaneous" } },
  // TODO
  "experimental-centers-U": {},
  "experimental-centers-U-D": {},
  "experimental-centers-U-L-D": {},
  "experimental-centers-U-L-B-D": {},
  "experimental-centers": {},
  "experimental-fto-fc": { groups: { fto: "Bencisco" } },
  "experimental-fto-f2t": { groups: { fto: "Bencisco" } },
  "experimental-fto-sc": { groups: { fto: "Bencisco" } },
  "experimental-fto-l2c": { groups: { fto: "Bencisco" } },
  "experimental-fto-lbt": { groups: { fto: "Bencisco" } },
  "experimental-fto-l3t": { groups: { fto: "Bencisco" } }
};

// src/cubing/puzzles/stickerings/cube-like-stickerings.ts
async function cubeLikeStickeringMask(puzzleLoader, stickering) {
  const kpuzzle2 = await puzzleLoader.kpuzzle();
  const puzzleStickering = new PuzzleStickering(kpuzzle2);
  const m = new StickeringManager(kpuzzle2);
  const LL2 = () => m.move("U");
  const orUD = () => m.or(m.moves(["U", "D"]));
  const orLR = () => m.or(m.moves(["L", "R"]));
  const M = () => m.not(orLR());
  const F2L = () => m.not(LL2());
  const CENTERS = () => m.orbitPrefix("CENTER");
  const EDGES = () => m.orbitPrefix("EDGE");
  const CORNERS = () => m.or([
    m.orbitPrefix("CORNER"),
    m.orbitPrefix("C4RNER"),
    m.orbitPrefix("C5RNER")
  ]);
  const L6E = () => m.or([M(), m.and([LL2(), EDGES()])]);
  const centerLL = () => m.and([LL2(), CENTERS()]);
  const edgeFR = () => m.and([m.and(m.moves(["F", "R"])), EDGES()]);
  const cornerDFR = () => m.and([m.and(m.moves(["F", "R"])), CORNERS(), m.not(LL2())]);
  const slotFR = () => m.or([cornerDFR(), edgeFR()]);
  function dimF2L() {
    puzzleStickering.set(F2L(), "Dim" /* Dim */);
  }
  function setPLL() {
    puzzleStickering.set(LL2(), "PermuteNonPrimary" /* PermuteNonPrimary */);
    puzzleStickering.set(centerLL(), "Dim" /* Dim */);
  }
  function setOLL() {
    puzzleStickering.set(LL2(), "IgnoreNonPrimary" /* IgnoreNonPrimary */);
    puzzleStickering.set(centerLL(), "Regular" /* Regular */);
  }
  function dimOLL() {
    puzzleStickering.set(LL2(), "Ignoriented" /* Ignoriented */);
    puzzleStickering.set(centerLL(), "Dim" /* Dim */);
  }
  switch (stickering) {
    case "corner": {
      puzzleStickering.set(EDGES(), "Ignored" /* Ignored */);
      break;
    }
    case "edges": {
      puzzleStickering.set(CORNERS(), "Ignored" /* Ignored */);
      break;
    }
    case "full":
      break;
    case "PLL": {
      dimF2L();
      setPLL();
      break;
    }
    case "CLS": {
      dimF2L();
      puzzleStickering.set(cornerDFR(), "Regular" /* Regular */);
      puzzleStickering.set(LL2(), "Ignoriented" /* Ignoriented */);
      puzzleStickering.set(m.and([LL2(), CENTERS()]), "Dim" /* Dim */);
      puzzleStickering.set(
        m.and([LL2(), CORNERS()]),
        "IgnoreNonPrimary" /* IgnoreNonPrimary */
      );
      break;
    }
    case "OLL": {
      dimF2L();
      setOLL();
      break;
    }
    case "EOLL": {
      dimF2L();
      setOLL();
      puzzleStickering.set(m.and([LL2(), CORNERS()]), "Ignored" /* Ignored */);
      break;
    }
    case "COLL": {
      dimF2L();
      puzzleStickering.set(m.and([LL2(), EDGES()]), "Ignoriented" /* Ignoriented */);
      puzzleStickering.set(m.and([LL2(), CENTERS()]), "Dim" /* Dim */);
      puzzleStickering.set(m.and([LL2(), CORNERS()]), "Regular" /* Regular */);
      break;
    }
    case "OCLL": {
      dimF2L();
      dimOLL();
      puzzleStickering.set(
        m.and([LL2(), CORNERS()]),
        "IgnoreNonPrimary" /* IgnoreNonPrimary */
      );
      break;
    }
    case "CPLL": {
      dimF2L();
      puzzleStickering.set(
        m.and([CORNERS(), LL2()]),
        "PermuteNonPrimary" /* PermuteNonPrimary */
      );
      puzzleStickering.set(
        m.and([m.not(CORNERS()), LL2()]),
        "Dim" /* Dim */
      );
      break;
    }
    case "CLL": {
      dimF2L();
      puzzleStickering.set(
        m.not(m.and([CORNERS(), LL2()])),
        "Dim" /* Dim */
      );
      break;
    }
    case "EPLL": {
      dimF2L();
      puzzleStickering.set(LL2(), "Dim" /* Dim */);
      puzzleStickering.set(
        m.and([LL2(), EDGES()]),
        "PermuteNonPrimary" /* PermuteNonPrimary */
      );
      break;
    }
    case "ELL": {
      dimF2L();
      puzzleStickering.set(LL2(), "Dim" /* Dim */);
      puzzleStickering.set(m.and([LL2(), EDGES()]), "Regular" /* Regular */);
      break;
    }
    case "ELS": {
      dimF2L();
      setOLL();
      puzzleStickering.set(m.and([LL2(), CORNERS()]), "Ignored" /* Ignored */);
      puzzleStickering.set(edgeFR(), "Regular" /* Regular */);
      puzzleStickering.set(cornerDFR(), "Ignored" /* Ignored */);
      break;
    }
    case "LL": {
      dimF2L();
      break;
    }
    case "F2L": {
      puzzleStickering.set(LL2(), "Ignored" /* Ignored */);
      break;
    }
    case "ZBLL": {
      dimF2L();
      puzzleStickering.set(LL2(), "PermuteNonPrimary" /* PermuteNonPrimary */);
      puzzleStickering.set(centerLL(), "Dim" /* Dim */);
      puzzleStickering.set(m.and([LL2(), CORNERS()]), "Regular" /* Regular */);
      break;
    }
    case "ZBLS": {
      dimF2L();
      puzzleStickering.set(slotFR(), "Regular" /* Regular */);
      setOLL();
      puzzleStickering.set(m.and([LL2(), CORNERS()]), "Ignored" /* Ignored */);
      break;
    }
    case "VLS": {
      dimF2L();
      puzzleStickering.set(slotFR(), "Regular" /* Regular */);
      setOLL();
      break;
    }
    case "WVLS": {
      dimF2L();
      puzzleStickering.set(slotFR(), "Regular" /* Regular */);
      puzzleStickering.set(m.and([LL2(), EDGES()]), "Ignoriented" /* Ignoriented */);
      puzzleStickering.set(m.and([LL2(), CENTERS()]), "Dim" /* Dim */);
      puzzleStickering.set(
        m.and([LL2(), CORNERS()]),
        "IgnoreNonPrimary" /* IgnoreNonPrimary */
      );
      break;
    }
    case "LS": {
      dimF2L();
      puzzleStickering.set(slotFR(), "Regular" /* Regular */);
      puzzleStickering.set(LL2(), "Ignored" /* Ignored */);
      puzzleStickering.set(centerLL(), "Dim" /* Dim */);
      break;
    }
    case "EO": {
      puzzleStickering.set(CORNERS(), "Ignored" /* Ignored */);
      puzzleStickering.set(
        EDGES(),
        "OrientationWithoutPermutation" /* OrientationWithoutPermutation */
      );
      break;
    }
    case "EOline": {
      puzzleStickering.set(CORNERS(), "Ignored" /* Ignored */);
      puzzleStickering.set(
        EDGES(),
        "OrientationWithoutPermutation" /* OrientationWithoutPermutation */
      );
      puzzleStickering.set(m.and(m.moves(["D", "M"])), "Regular" /* Regular */);
      break;
    }
    case "EOcross": {
      puzzleStickering.set(
        EDGES(),
        "OrientationWithoutPermutation" /* OrientationWithoutPermutation */
      );
      puzzleStickering.set(m.move("D"), "Regular" /* Regular */);
      puzzleStickering.set(CORNERS(), "Ignored" /* Ignored */);
      break;
    }
    case "CMLL": {
      puzzleStickering.set(F2L(), "Dim" /* Dim */);
      puzzleStickering.set(L6E(), "Ignored" /* Ignored */);
      puzzleStickering.set(m.and([LL2(), CORNERS()]), "Regular" /* Regular */);
      break;
    }
    case "L10P": {
      puzzleStickering.set(m.not(L6E()), "Dim" /* Dim */);
      puzzleStickering.set(m.and([CORNERS(), LL2()]), "Regular" /* Regular */);
      break;
    }
    case "L6E": {
      puzzleStickering.set(m.not(L6E()), "Dim" /* Dim */);
      break;
    }
    case "L6EO": {
      puzzleStickering.set(m.not(L6E()), "Dim" /* Dim */);
      puzzleStickering.set(
        L6E(),
        "OrientationWithoutPermutation" /* OrientationWithoutPermutation */
      );
      puzzleStickering.set(
        m.and([CENTERS(), orUD()]),
        "OrientationStickers" /* OrientationStickers */
      );
      break;
    }
    case "Daisy": {
      puzzleStickering.set(m.all(), "Ignored" /* Ignored */);
      puzzleStickering.set(CENTERS(), "Dim" /* Dim */);
      puzzleStickering.set(
        m.and([m.move("D"), CENTERS()]),
        "Regular" /* Regular */
      );
      puzzleStickering.set(
        m.and([m.move("U"), EDGES()]),
        "IgnoreNonPrimary" /* IgnoreNonPrimary */
      );
      break;
    }
    case "Cross": {
      puzzleStickering.set(m.all(), "Ignored" /* Ignored */);
      puzzleStickering.set(CENTERS(), "Dim" /* Dim */);
      puzzleStickering.set(
        m.and([m.move("D"), CENTERS()]),
        "Regular" /* Regular */
      );
      puzzleStickering.set(
        m.and([m.move("D"), EDGES()]),
        "Regular" /* Regular */
      );
      break;
    }
    case "2x2x2": {
      puzzleStickering.set(
        m.or(m.moves(["U", "F", "R"])),
        "Ignored" /* Ignored */
      );
      puzzleStickering.set(
        m.and([m.or(m.moves(["U", "F", "R"])), CENTERS()]),
        "Dim" /* Dim */
      );
      break;
    }
    case "2x2x3": {
      puzzleStickering.set(m.all(), "Dim" /* Dim */);
      puzzleStickering.set(
        m.or(m.moves(["U", "F", "R"])),
        "Ignored" /* Ignored */
      );
      puzzleStickering.set(
        m.and([m.or(m.moves(["U", "F", "R"])), CENTERS()]),
        "Dim" /* Dim */
      );
      puzzleStickering.set(
        m.and([m.move("F"), m.not(m.or(m.moves(["U", "R"])))]),
        "Regular" /* Regular */
      );
      break;
    }
    case "L2C": {
      puzzleStickering.set(
        m.or(m.moves(["L", "R", "B", "D"])),
        "Dim" /* Dim */
      );
      puzzleStickering.set(m.not(CENTERS()), "Ignored" /* Ignored */);
      break;
    }
    case "PBL": {
      puzzleStickering.set(m.all(), "Ignored" /* Ignored */);
      puzzleStickering.set(
        m.or(m.moves(["U", "D"])),
        "PermuteNonPrimary" /* PermuteNonPrimary */
      );
      break;
    }
    case "Void Cube": {
      puzzleStickering.set(CENTERS(), "Invisible" /* Invisible */);
      break;
    }
    case "picture":
    case "invisible": {
      puzzleStickering.set(m.all(), "Invisible" /* Invisible */);
      break;
    }
    case "centers-only": {
      puzzleStickering.set(m.not(CENTERS()), "Ignored" /* Ignored */);
      break;
    }
    default:
      console.warn(
        `Unsupported stickering for ${puzzleLoader.id}: ${stickering}. Setting all pieces to dim.`
      );
      puzzleStickering.set(m.and(m.moves([])), "Dim" /* Dim */);
  }
  return puzzleStickering.toStickeringMask();
}
async function cubeLikeStickeringList(puzzleID, options) {
  const stickerings = [];
  const stickeringsFallback = [];
  for (const [name, info] of Object.entries(experimentalStickerings)) {
    if (info.groups) {
      if (puzzleID in info.groups) {
        stickerings.push(name);
      } else if (options?.use3x3x3Fallbacks && "3x3x3" in info.groups) {
        stickeringsFallback.push(name);
      }
    }
  }
  return stickerings.concat(stickeringsFallback);
}

// src/cubing/puzzles/async/lazy-cached.ts
function getCached(getValue) {
  let cachedPromise = null;
  return () => {
    return cachedPromise ?? (cachedPromise = getValue());
  };
}

// src/cubing/puzzles/async/async-pg3d.ts
init_alg();

// src/cubing/vendor/mit/p-lazy/p-lazy.ts
var PLazy = class extends Promise {
  constructor(executor) {
    super((resolve) => {
      resolve();
    });
    this._executor = executor;
  }
  static from(function_) {
    return new PLazy((resolve) => {
      resolve(function_());
    });
  }
  static resolve(value) {
    return new PLazy((resolve) => {
      resolve(value);
    });
  }
  static reject(error) {
    return new PLazy((_resolve, reject) => {
      reject(error);
    });
  }
  then(onFulfilled, onRejected) {
    this._promise = this._promise || new Promise(this._executor);
    return this._promise.then(onFulfilled, onRejected);
  }
  catch(onRejected) {
    this._promise = this._promise || new Promise(this._executor);
    return this._promise.catch(onRejected);
  }
};
function from(function_) {
  return new PLazy((resolve) => {
    resolve(function_());
  });
}

// src/cubing/puzzles/async/async-pg3d.ts
async function asyncGetPuzzleGeometry(puzzleName2) {
  const puzzleGeometry = await Promise.resolve().then(() => (init_puzzle_geometry(), puzzle_geometry_exports));
  return puzzleGeometry.getPuzzleGeometryByName(puzzleName2, {
    allMoves: true,
    orientCenters: true,
    addRotations: true
  });
}
async function asyncGetKPuzzle(pgPromise, puzzleName2) {
  const pg = await pgPromise;
  const kpuzzleDefinition = pg.getKPuzzleDefinition(true);
  kpuzzleDefinition.name = puzzleName2;
  const puzzleGeometry = await Promise.resolve().then(() => (init_puzzle_geometry(), puzzle_geometry_exports));
  const pgNotation = new puzzleGeometry.ExperimentalPGNotation(
    pg,
    pg.getOrbitsDef(true)
  );
  return new KPuzzle(kpuzzleDefinition, {
    experimentalPGNotation: pgNotation
  });
}
var PGPuzzleLoader = class {
  constructor(info) {
    this.puzzleSpecificSimplifyOptionsPromise = puzzleSpecificSimplifyOptionsPromise(
      this.kpuzzle.bind(this)
    );
    this.pgId = info.pgID;
    this.id = info.id;
    this.fullName = info.fullName;
    this.inventedBy = info.inventedBy;
    this.inventionYear = info.inventionYear;
  }
  #cachedPG;
  pg() {
    return this.#cachedPG ?? (this.#cachedPG = asyncGetPuzzleGeometry(this.pgId ?? this.id));
  }
  #cachedKPuzzle;
  kpuzzle() {
    return this.#cachedKPuzzle ?? (this.#cachedKPuzzle = asyncGetKPuzzle(this.pg(), this.id));
  }
  #cachedSVG;
  svg() {
    return this.#cachedSVG ?? (this.#cachedSVG = (async () => (await this.pg()).generatesvg())());
  }
};
var CubePGPuzzleLoader = class extends PGPuzzleLoader {
  constructor() {
    super(...arguments);
    this.stickerings = () => cubeLikeStickeringList(this.id, { use3x3x3Fallbacks: true });
  }
  stickeringMask(stickering) {
    return cubeLikeStickeringMask(this, stickering);
  }
};
function puzzleSpecificSimplifyOptionsPromise(kpuzzlePromiseFn) {
  return new PLazy(
    async (resolve) => {
      const kpuzzle2 = await kpuzzlePromiseFn();
      resolve({
        quantumMoveOrder: (m) => {
          return kpuzzle2.moveToTransformation(new Move(m)).repetitionOrder();
        }
      });
    }
  );
}

// src/cubing/puzzles/implementations/2x2x2/index.ts
var cube2x2x2 = {
  id: "2x2x2",
  fullName: "2\xD72\xD72 Cube",
  kpuzzle: getCached(
    async () => new KPuzzle(
      (await Promise.resolve().then(() => (init_puzzles_dynamic_side_events(), puzzles_dynamic_side_events_exports))).cube2x2x2JSON
    )
  ),
  svg: async () => (await Promise.resolve().then(() => (init_puzzles_dynamic_side_events(), puzzles_dynamic_side_events_exports))).cube2x2x2SVG,
  llSVG: getCached(
    async () => (await Promise.resolve().then(() => (init_puzzles_dynamic_side_events(), puzzles_dynamic_side_events_exports))).cube2x2x2LLSVG
  ),
  pg: getCached(async () => {
    return asyncGetPuzzleGeometry("2x2x2");
  }),
  stickeringMask: (stickering) => cubeLikeStickeringMask(cube2x2x2, stickering),
  stickerings: () => cubeLikeStickeringList("2x2x2", { use3x3x3Fallbacks: true })
};

// src/cubing/puzzles/implementations/dynamic/3x3x3/3x3x3.kpuzzle.json.ts
var cube3x3x3KPuzzleDefinition = {
  name: "3x3x3",
  orbits: {
    EDGES: { numPieces: 12, numOrientations: 2 },
    CORNERS: { numPieces: 8, numOrientations: 3 },
    CENTERS: { numPieces: 6, numOrientations: 4 }
  },
  startStateData: {
    EDGES: {
      pieces: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    CORNERS: {
      pieces: [0, 1, 2, 3, 4, 5, 6, 7],
      orientation: [0, 0, 0, 0, 0, 0, 0, 0]
    },
    CENTERS: {
      pieces: [0, 1, 2, 3, 4, 5],
      orientation: [0, 0, 0, 0, 0, 0]
    }
  },
  moves: {
    U: {
      EDGES: {
        permutation: [1, 2, 3, 0, 4, 5, 6, 7, 8, 9, 10, 11],
        orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      CORNERS: {
        permutation: [1, 2, 3, 0, 4, 5, 6, 7],
        orientation: [0, 0, 0, 0, 0, 0, 0, 0]
      },
      CENTERS: {
        permutation: [0, 1, 2, 3, 4, 5],
        orientation: [1, 0, 0, 0, 0, 0]
      }
    },
    y: {
      EDGES: {
        permutation: [1, 2, 3, 0, 5, 6, 7, 4, 10, 8, 11, 9],
        orientation: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1]
      },
      CORNERS: {
        permutation: [1, 2, 3, 0, 7, 4, 5, 6],
        orientation: [0, 0, 0, 0, 0, 0, 0, 0]
      },
      CENTERS: {
        permutation: [0, 2, 3, 4, 1, 5],
        orientation: [1, 0, 0, 0, 0, 3]
      }
    },
    x: {
      EDGES: {
        permutation: [4, 8, 0, 9, 6, 10, 2, 11, 5, 7, 1, 3],
        orientation: [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0]
      },
      CORNERS: {
        permutation: [4, 0, 3, 5, 7, 6, 2, 1],
        orientation: [2, 1, 2, 1, 1, 2, 1, 2]
      },
      CENTERS: {
        permutation: [2, 1, 5, 3, 0, 4],
        orientation: [0, 3, 0, 1, 2, 2]
      }
    },
    L: {
      EDGES: {
        permutation: [0, 1, 2, 11, 4, 5, 6, 9, 8, 3, 10, 7],
        orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      CORNERS: {
        permutation: [0, 1, 6, 2, 4, 3, 5, 7],
        orientation: [0, 0, 2, 1, 0, 2, 1, 0]
      },
      CENTERS: {
        permutation: [0, 1, 2, 3, 4, 5],
        orientation: [0, 1, 0, 0, 0, 0]
      }
    },
    F: {
      EDGES: {
        permutation: [9, 1, 2, 3, 8, 5, 6, 7, 0, 4, 10, 11],
        orientation: [1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0]
      },
      CORNERS: {
        permutation: [3, 1, 2, 5, 0, 4, 6, 7],
        orientation: [1, 0, 0, 2, 2, 1, 0, 0]
      },
      CENTERS: {
        permutation: [0, 1, 2, 3, 4, 5],
        orientation: [0, 0, 1, 0, 0, 0]
      }
    },
    R: {
      EDGES: {
        permutation: [0, 8, 2, 3, 4, 10, 6, 7, 5, 9, 1, 11],
        orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      CORNERS: {
        permutation: [4, 0, 2, 3, 7, 5, 6, 1],
        orientation: [2, 1, 0, 0, 1, 0, 0, 2]
      },
      CENTERS: {
        permutation: [0, 1, 2, 3, 4, 5],
        orientation: [0, 0, 0, 1, 0, 0]
      }
    },
    B: {
      EDGES: {
        permutation: [0, 1, 10, 3, 4, 5, 11, 7, 8, 9, 6, 2],
        orientation: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1]
      },
      CORNERS: {
        permutation: [0, 7, 1, 3, 4, 5, 2, 6],
        orientation: [0, 2, 1, 0, 0, 0, 2, 1]
      },
      CENTERS: {
        permutation: [0, 1, 2, 3, 4, 5],
        orientation: [0, 0, 0, 0, 1, 0]
      }
    },
    D: {
      EDGES: {
        permutation: [0, 1, 2, 3, 7, 4, 5, 6, 8, 9, 10, 11],
        orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      CORNERS: {
        permutation: [0, 1, 2, 3, 5, 6, 7, 4],
        orientation: [0, 0, 0, 0, 0, 0, 0, 0]
      },
      CENTERS: {
        permutation: [0, 1, 2, 3, 4, 5],
        orientation: [0, 0, 0, 0, 0, 1]
      }
    },
    z: {
      EDGES: {
        permutation: [9, 3, 11, 7, 8, 1, 10, 5, 0, 4, 2, 6],
        orientation: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
      },
      CORNERS: {
        permutation: [3, 2, 6, 5, 0, 4, 7, 1],
        orientation: [1, 2, 1, 2, 2, 1, 2, 1]
      },
      CENTERS: {
        permutation: [1, 5, 2, 0, 4, 3],
        orientation: [1, 1, 1, 1, 3, 1]
      }
    },
    M: {
      EDGES: {
        permutation: [2, 1, 6, 3, 0, 5, 4, 7, 8, 9, 10, 11],
        orientation: [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0]
      },
      CORNERS: {
        permutation: [0, 1, 2, 3, 4, 5, 6, 7],
        orientation: [0, 0, 0, 0, 0, 0, 0, 0]
      },
      CENTERS: {
        permutation: [4, 1, 0, 3, 5, 2],
        orientation: [2, 0, 0, 0, 2, 0]
      }
    },
    E: {
      EDGES: {
        permutation: [0, 1, 2, 3, 4, 5, 6, 7, 9, 11, 8, 10],
        orientation: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1]
      },
      CORNERS: {
        permutation: [0, 1, 2, 3, 4, 5, 6, 7],
        orientation: [0, 0, 0, 0, 0, 0, 0, 0]
      },
      CENTERS: {
        permutation: [0, 4, 1, 2, 3, 5],
        orientation: [0, 0, 0, 0, 0, 0]
      }
    },
    S: {
      EDGES: {
        permutation: [0, 3, 2, 7, 4, 1, 6, 5, 8, 9, 10, 11],
        orientation: [0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0]
      },
      CORNERS: {
        permutation: [0, 1, 2, 3, 4, 5, 6, 7],
        orientation: [0, 0, 0, 0, 0, 0, 0, 0]
      },
      CENTERS: {
        permutation: [1, 5, 2, 0, 4, 3],
        orientation: [1, 1, 0, 1, 0, 1]
      }
    },
    u: {
      EDGES: {
        permutation: [1, 2, 3, 0, 4, 5, 6, 7, 10, 8, 11, 9],
        orientation: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1]
      },
      CORNERS: {
        permutation: [1, 2, 3, 0, 4, 5, 6, 7],
        orientation: [0, 0, 0, 0, 0, 0, 0, 0]
      },
      CENTERS: {
        permutation: [0, 2, 3, 4, 1, 5],
        orientation: [1, 0, 0, 0, 0, 0]
      }
    },
    l: {
      EDGES: {
        permutation: [2, 1, 6, 11, 0, 5, 4, 9, 8, 3, 10, 7],
        orientation: [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0]
      },
      CORNERS: {
        permutation: [0, 1, 6, 2, 4, 3, 5, 7],
        orientation: [0, 0, 2, 1, 0, 2, 1, 0]
      },
      CENTERS: {
        permutation: [4, 1, 0, 3, 5, 2],
        orientation: [2, 1, 0, 0, 2, 0]
      }
    },
    f: {
      EDGES: {
        permutation: [9, 3, 2, 7, 8, 1, 6, 5, 0, 4, 10, 11],
        orientation: [1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0]
      },
      CORNERS: {
        permutation: [3, 1, 2, 5, 0, 4, 6, 7],
        orientation: [1, 0, 0, 2, 2, 1, 0, 0]
      },
      CENTERS: {
        permutation: [1, 5, 2, 0, 4, 3],
        orientation: [1, 1, 1, 1, 0, 1]
      }
    },
    r: {
      EDGES: {
        permutation: [4, 8, 0, 3, 6, 10, 2, 7, 5, 9, 1, 11],
        orientation: [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0]
      },
      CORNERS: {
        permutation: [4, 0, 2, 3, 7, 5, 6, 1],
        orientation: [2, 1, 0, 0, 1, 0, 0, 2]
      },
      CENTERS: {
        permutation: [2, 1, 5, 3, 0, 4],
        orientation: [0, 0, 0, 1, 2, 2]
      }
    },
    b: {
      EDGES: {
        permutation: [0, 5, 10, 1, 4, 7, 11, 3, 8, 9, 6, 2],
        orientation: [0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1]
      },
      CORNERS: {
        permutation: [0, 7, 1, 3, 4, 5, 2, 6],
        orientation: [0, 2, 1, 0, 0, 0, 2, 1]
      },
      CENTERS: {
        permutation: [3, 0, 2, 5, 4, 1],
        orientation: [3, 3, 0, 3, 1, 3]
      }
    },
    d: {
      EDGES: {
        permutation: [0, 1, 2, 3, 7, 4, 5, 6, 9, 11, 8, 10],
        orientation: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1]
      },
      CORNERS: {
        permutation: [0, 1, 2, 3, 5, 6, 7, 4],
        orientation: [0, 0, 0, 0, 0, 0, 0, 0]
      },
      CENTERS: {
        permutation: [0, 4, 1, 2, 3, 5],
        orientation: [0, 0, 0, 0, 0, 1]
      }
    }
  },
  experimentalDerivedMoves: {
    Uw: "u",
    Lw: "l",
    Fw: "f",
    Rw: "r",
    Bw: "b",
    Dw: "d",
    Uv: "y",
    Lv: "x'",
    Fv: "z",
    Rv: "x",
    Bv: "z'",
    Dv: "y'",
    "2U": "u U'",
    "2L": "l L'",
    "2F": "f F'",
    "2R": "r R'",
    "2B": "b B'",
    "2D": "d D'"
  }
};

// src/cubing/puzzles/implementations/dynamic/3x3x3/puzzle-orientation.ts
init_alg();
function puzzleOrientation3x3x3Idx(state) {
  const idxU = state.stateData["CENTERS"].pieces[0];
  const idxD = state.stateData["CENTERS"].pieces[5];
  const unadjustedIdxL = state.stateData["CENTERS"].pieces[1];
  let idxL = unadjustedIdxL;
  if (idxU < unadjustedIdxL) {
    idxL--;
  }
  if (idxD < unadjustedIdxL) {
    idxL--;
  }
  return [idxU, idxL];
}
var puzzleOrientationCacheRaw = new Array(6).fill(0).map(() => {
  return new Array(6);
});
var puzzleOrientationCacheInitialized = false;
function puzzleOrientation3x3x3Cache() {
  if (!puzzleOrientationCacheInitialized) {
    {
      const uAlgs = ["", "z", "x", "z'", "x'", "x2"].map(
        (s) => Alg.fromString(s)
      );
      const yAlg = new Alg("y");
      for (const uAlg of uAlgs) {
        let transformation = experimental3x3x3KPuzzle.algToTransformation(uAlg);
        for (let i = 0; i < 4; i++) {
          transformation = transformation.applyAlg(yAlg);
          const [idxU, idxL] = puzzleOrientation3x3x3Idx(
            transformation.toKState()
          );
          puzzleOrientationCacheRaw[idxU][idxL] = transformation.invert();
        }
      }
    }
  }
  return puzzleOrientationCacheRaw;
}
function normalize3x3x3Orientation(state) {
  const [idxU, idxL] = puzzleOrientation3x3x3Idx(state);
  const orientationTransformation = puzzleOrientation3x3x3Cache()[idxU][idxL];
  return state.applyTransformation(orientationTransformation);
}
function experimentalIs3x3x3Solved(state, options) {
  if (options.ignorePuzzleOrientation) {
    state = normalize3x3x3Orientation(state);
  }
  if (options.ignoreCenterOrientation) {
    state = new KState(state.kpuzzle, {
      EDGES: state.stateData.EDGES,
      CORNERS: state.stateData.CORNERS,
      CENTERS: {
        pieces: state.stateData.CENTERS.pieces,
        orientation: new Array(6).fill(0)
      }
    });
  }
  return !!state.experimentalToTransformation()?.isIdentityTransformation();
}

// src/cubing/puzzles/implementations/dynamic/2x2x2/puzzle-orientation.ts
init_alg();
var puzzleOrientationCacheRaw2 = new Array(24);

// src/cubing/puzzles/customPGPuzzleLoader.ts
async function descAsyncGetPuzzleGeometry(desc, options) {
  const puzzleGeometry = await Promise.resolve().then(() => (init_puzzle_geometry(), puzzle_geometry_exports));
  return puzzleGeometry.getPuzzleGeometryByDesc(desc, {
    allMoves: true,
    orientCenters: true,
    addRotations: true,
    ...options
  });
}
async function asyncGetKPuzzle2(desc, options) {
  const pg = await descAsyncGetPuzzleGeometry(desc, options);
  const kpuzzleDefinition = pg.getKPuzzleDefinition(true);
  kpuzzleDefinition.name = `description: ${desc}`;
  const puzzleGeometry = await Promise.resolve().then(() => (init_puzzle_geometry(), puzzle_geometry_exports));
  const pgNotation = new puzzleGeometry.ExperimentalPGNotation(
    pg,
    pg.getOrbitsDef(true)
  );
  return new KPuzzle(kpuzzleDefinition, {
    experimentalPGNotation: pgNotation
  });
}

// src/cubing/puzzles/cubing-private/index.ts
var experimental3x3x3KPuzzle = new KPuzzle(
  cube3x3x3KPuzzleDefinition
);
cube3x3x3KPuzzleDefinition.experimentalIsStateSolved = experimentalIs3x3x3Solved;

// src/cubing/puzzles/implementations/3x3x3/puzzle-specific-simplifications.ts
init_alg();
function makeSourceInfo(moveStrings, type, from2, to) {
  const output = [];
  for (const moveString of moveStrings) {
    const move = Move.fromString(moveString);
    const { family, amount: direction } = move;
    if (![-1, 1].includes(direction)) {
      throw new Error("Invalid config move");
    }
    output.push({ family, direction, type, from: from2, to });
  }
  return output;
}
var axisInfos = {
  ["x axis" /* X */]: {
    sliceDiameter: 3,
    extendsThroughEntirePuzzle: true,
    moveSourceInfos: [
      ...makeSourceInfo(["R"], 0 /* INDEXABLE_SLICE_NEAR */, 0, 3),
      ...makeSourceInfo(["L'"], 1 /* INDEXABLE_SLICE_FAR */, 0, 3),
      ...makeSourceInfo(["r", "Rw"], 2 /* INDEXABLE_WIDE_NEAR */, 0, 2),
      ...makeSourceInfo(["l'", "Lw'"], 3 /* INDEXABLE_WIDE_FAR */, 0, 2),
      ...makeSourceInfo(["M'"], 4 /* SPECIFIC_SLICE */, 1, 2),
      // TODO: remove some indices?
      ...makeSourceInfo(["x", "Uv", "Dv'"], 5 /* ROTATION */, 0, 3)
      // TODO: remove some indices?
    ]
  },
  ["y axis" /* Y */]: {
    sliceDiameter: 3,
    extendsThroughEntirePuzzle: true,
    moveSourceInfos: [
      ...makeSourceInfo(["U"], 0 /* INDEXABLE_SLICE_NEAR */, 0, 3),
      ...makeSourceInfo(["D'"], 1 /* INDEXABLE_SLICE_FAR */, 0, 3),
      ...makeSourceInfo(["u", "Uw"], 2 /* INDEXABLE_WIDE_NEAR */, 0, 2),
      ...makeSourceInfo(["d'", "Dw'"], 3 /* INDEXABLE_WIDE_FAR */, 0, 2),
      ...makeSourceInfo(["E'"], 4 /* SPECIFIC_SLICE */, 1, 2),
      // TODO: remove some indices?
      ...makeSourceInfo(["y", "Uv", "Dv'"], 5 /* ROTATION */, 0, 3)
      // TODO: remove some indices?
    ]
  },
  ["z axis" /* Z */]: {
    sliceDiameter: 3,
    extendsThroughEntirePuzzle: true,
    moveSourceInfos: [
      ...makeSourceInfo(["F"], 0 /* INDEXABLE_SLICE_NEAR */, 0, 3),
      ...makeSourceInfo(["B'"], 1 /* INDEXABLE_SLICE_FAR */, 0, 3),
      ...makeSourceInfo(["f", "Fw"], 2 /* INDEXABLE_WIDE_NEAR */, 0, 3),
      ...makeSourceInfo(["b'", "Bw'"], 3 /* INDEXABLE_WIDE_FAR */, 0, 3),
      ...makeSourceInfo(["S"], 4 /* SPECIFIC_SLICE */, 1, 2),
      // TODO: remove some indices?
      ...makeSourceInfo(["z", "Fv", "Bv'"], 5 /* ROTATION */, 0, 3)
      // TODO: remove some indices?
    ]
  }
};
var byFamily = {};
for (const [axis, info] of Object.entries(axisInfos)) {
  for (const moveSourceInfo of info.moveSourceInfos) {
    byFamily[moveSourceInfo.family] = { axis, moveSourceInfo };
  }
}
var byAxisThenType = {};
var _a;
for (const axis of Object.keys(axisInfos)) {
  const entry = {};
  byAxisThenType[axis] = entry;
  for (const moveSourceInfo of axisInfos[axis].moveSourceInfos) {
    (entry[_a = moveSourceInfo.type] ?? (entry[_a] = [])).push(moveSourceInfo);
  }
}
var byAxisThenSpecificSlices = {};
for (const axis of Object.keys(axisInfos)) {
  const entry = /* @__PURE__ */ new Map();
  byAxisThenSpecificSlices[axis] = entry;
  for (const moveSourceInfo of axisInfos[axis].moveSourceInfos) {
    if (!entry.get(moveSourceInfo.from)) {
      entry.set(moveSourceInfo.from, moveSourceInfo);
    }
  }
}
function firstOfType(axis, moveSourceType) {
  const entry = byAxisThenType[axis][moveSourceType]?.[0];
  if (!entry) {
    throw new Error(
      `Could not find a reference move (axis: ${axis}, move source type: ${moveSourceType})`
    );
  }
  return entry;
}
var areQuantumMovesSameAxis = (quantumMove1, quantumMove2) => {
  return byFamily[quantumMove1.family].axis === byFamily[quantumMove2.family].axis;
};
function simplestMove(axis, from2, to, directedAmount) {
  if (from2 + 1 === to) {
    const sliceSpecificInfo = byAxisThenSpecificSlices[axis].get(from2);
    if (sliceSpecificInfo) {
      return new Move(
        new QuantumMove(sliceSpecificInfo.family),
        directedAmount * sliceSpecificInfo.direction
      );
    }
  }
  const axisInfo = axisInfos[axis];
  const { sliceDiameter } = axisInfo;
  if (from2 === 0 && to === sliceDiameter) {
    const moveSourceInfo2 = firstOfType(axis, 5 /* ROTATION */);
    return new Move(
      new QuantumMove(moveSourceInfo2.family),
      directedAmount * moveSourceInfo2.direction
    );
  }
  const far = from2 + to > sliceDiameter;
  if (far) {
    [from2, to] = [sliceDiameter - to, sliceDiameter - from2];
  }
  let outerLayer = from2 + 1;
  let innerLayer = to;
  const slice = outerLayer === innerLayer;
  if (slice) {
    innerLayer = null;
  }
  if (outerLayer === 1) {
    outerLayer = null;
  }
  if (slice && outerLayer === 1) {
    innerLayer = null;
  }
  if (!slice && innerLayer === 2) {
    innerLayer = null;
  }
  const moveSourceType = slice ? far ? 1 /* INDEXABLE_SLICE_FAR */ : 0 /* INDEXABLE_SLICE_NEAR */ : far ? 3 /* INDEXABLE_WIDE_FAR */ : 2 /* INDEXABLE_WIDE_NEAR */;
  const moveSourceInfo = firstOfType(axis, moveSourceType);
  return new Move(
    new QuantumMove(moveSourceInfo.family, innerLayer, outerLayer),
    directedAmount * moveSourceInfo.direction
  );
}
function simplifySameAxisMoves(moves, quantumMod = true) {
  if (moves.length === 0) {
    return [];
  }
  const axis = byFamily[moves[0].family].axis;
  const axisInfo = axisInfos[axis];
  const { sliceDiameter } = axisInfo;
  const sliceDeltas = /* @__PURE__ */ new Map();
  let lastCandidateRange = null;
  function adjustValue(idx, relativeDelta) {
    let newDelta = (sliceDeltas.get(idx) ?? 0) + relativeDelta;
    if (quantumMod) {
      newDelta = newDelta % 4 + 5 % 4 - 1;
    }
    if (newDelta === 0) {
      sliceDeltas.delete(idx);
    } else {
      sliceDeltas.set(idx, newDelta);
    }
  }
  let suffixLength = 0;
  for (const move of Array.from(moves).reverse()) {
    suffixLength++;
    const { moveSourceInfo } = byFamily[move.family];
    const directedAmount2 = move.amount * moveSourceInfo.direction;
    switch (moveSourceInfo.type) {
      case 0 /* INDEXABLE_SLICE_NEAR */: {
        const idx = (move.innerLayer ?? 1) - 1;
        adjustValue(idx, directedAmount2);
        adjustValue(idx + 1, -directedAmount2);
        break;
      }
      case 1 /* INDEXABLE_SLICE_FAR */: {
        const idx = sliceDiameter - (move.innerLayer ?? 1);
        adjustValue(idx, directedAmount2);
        adjustValue(idx + 1, -directedAmount2);
        break;
      }
      case 2 /* INDEXABLE_WIDE_NEAR */: {
        adjustValue((move.outerLayer ?? 1) - 1, directedAmount2);
        adjustValue(move.innerLayer ?? 2, -directedAmount2);
        break;
      }
      case 3 /* INDEXABLE_WIDE_FAR */: {
        adjustValue(sliceDiameter - (move.innerLayer ?? 2), directedAmount2);
        adjustValue(
          sliceDiameter - ((move.outerLayer ?? 1) - 1),
          -directedAmount2
        );
        break;
      }
      case 4 /* SPECIFIC_SLICE */: {
        adjustValue(moveSourceInfo.from, directedAmount2);
        adjustValue(moveSourceInfo.to, -directedAmount2);
        break;
      }
      case 5 /* ROTATION */: {
        adjustValue(0, directedAmount2);
        adjustValue(sliceDiameter, -directedAmount2);
        break;
      }
    }
    if ([0, 2].includes(sliceDeltas.size)) {
      lastCandidateRange = { suffixLength, sliceDeltas: new Map(sliceDeltas) };
    }
  }
  if (sliceDeltas.size === 0) {
    return [];
  }
  if (!lastCandidateRange) {
    return moves;
  }
  let [from2, to] = lastCandidateRange.sliceDeltas.keys();
  if (from2 > to) {
    [from2, to] = [to, from2];
  }
  const directedAmount = lastCandidateRange.sliceDeltas.get(from2);
  return [
    ...moves.slice(0, -lastCandidateRange.suffixLength),
    ...directedAmount !== 0 ? [simplestMove(axis, from2, to, directedAmount)] : []
  ];
}
var puzzleSpecificSimplifyOptions333 = {
  quantumMoveOrder: () => 4,
  // doQuantumMovesCommute: areQuantumMovesSameAxis,
  axis: { areQuantumMovesSameAxis, simplifySameAxisMoves }
};

// src/cubing/puzzles/implementations/3x3x3/index.ts
var cube3x3x3 = {
  id: "3x3x3",
  fullName: "3\xD73\xD73 Cube",
  inventedBy: ["Ern\u0151 Rubik"],
  inventionYear: 1974,
  // https://en.wikipedia.org/wiki/Rubik%27s_Cube#Conception_and_development
  kpuzzle: getCached(async () => {
    return experimental3x3x3KPuzzle;
  }),
  svg: getCached(async () => {
    return (await Promise.resolve().then(() => (init_puzzles_dynamic_3x3x3(), puzzles_dynamic_3x3x3_exports))).cube3x3x3SVG;
  }),
  llSVG: getCached(async () => {
    return (await Promise.resolve().then(() => (init_puzzles_dynamic_3x3x3(), puzzles_dynamic_3x3x3_exports))).cube3x3x3LLSVG;
  }),
  pg: getCached(async () => {
    return asyncGetPuzzleGeometry("3x3x3");
  }),
  stickeringMask: (stickering) => cubeLikeStickeringMask(cube3x3x3, stickering),
  stickerings: () => cubeLikeStickeringList("3x3x3"),
  puzzleSpecificSimplifyOptions: puzzleSpecificSimplifyOptions333
};

// src/cubing/puzzles/implementations/clock/index.ts
var clock = {
  id: "clock",
  fullName: "Clock",
  inventedBy: ["Christopher C. Wiggs", "Christopher J. Taylor"],
  inventionYear: 1988,
  // Patent application year: https://www.jaapsch.net/puzzles/patents/us4869506.pdf
  kpuzzle: getCached(
    async () => new KPuzzle(
      (await Promise.resolve().then(() => (init_puzzles_dynamic_side_events(), puzzles_dynamic_side_events_exports))).clockJSON
    )
  ),
  svg: getCached(async () => {
    return (await Promise.resolve().then(() => (init_puzzles_dynamic_side_events(), puzzles_dynamic_side_events_exports))).clockSVG;
  })
};

// src/cubing/puzzles/stickerings/fto-stickerings.ts
async function ftoStickering(puzzleLoader, stickering) {
  const kpuzzle2 = await puzzleLoader.kpuzzle();
  const puzzleStickering = new PuzzleStickering(kpuzzle2);
  const m = new StickeringManager(kpuzzle2);
  const experimentalFTO_FC = () => m.and([m.move("U"), m.not(m.or(m.moves(["F", "BL", "BR"])))]);
  const experimentalFTO_F2T = () => m.and([m.move("U"), m.not(m.move("F"))]);
  const experimentalFTO_SC = () => m.or([
    experimentalFTO_F2T(),
    m.and([m.move("F"), m.not(m.or(m.moves(["U", "BL", "BR"])))])
  ]);
  const experimentalFTO_L2C = () => m.not(
    m.or([
      m.and([m.move("U"), m.move("F")]),
      m.and([m.move("F"), m.move("BL")]),
      m.and([m.move("F"), m.move("BR")]),
      m.and([m.move("BL"), m.move("BR")])
    ])
  );
  const experimentalFTO_LBT = () => m.not(
    m.or([
      m.and([m.move("F"), m.move("BL")]),
      m.and([m.move("F"), m.move("BR")]),
      m.and([m.move("BL"), m.move("BR")])
    ])
  );
  switch (stickering) {
    case "full":
      break;
    case "experimental-fto-fc": {
      puzzleStickering.set(
        m.not(experimentalFTO_FC()),
        "Ignored" /* Ignored */
      );
      break;
    }
    case "experimental-fto-f2t": {
      puzzleStickering.set(
        m.not(experimentalFTO_F2T()),
        "Ignored" /* Ignored */
      );
      puzzleStickering.set(experimentalFTO_FC(), "Dim" /* Dim */);
      break;
    }
    case "experimental-fto-sc": {
      puzzleStickering.set(
        m.not(experimentalFTO_SC()),
        "Ignored" /* Ignored */
      );
      puzzleStickering.set(experimentalFTO_F2T(), "Dim" /* Dim */);
      break;
    }
    case "experimental-fto-l2c": {
      puzzleStickering.set(
        m.not(experimentalFTO_L2C()),
        "Ignored" /* Ignored */
      );
      puzzleStickering.set(experimentalFTO_SC(), "Dim" /* Dim */);
      break;
    }
    case "experimental-fto-lbt": {
      puzzleStickering.set(
        m.not(experimentalFTO_LBT()),
        "Ignored" /* Ignored */
      );
      puzzleStickering.set(experimentalFTO_L2C(), "Dim" /* Dim */);
      break;
    }
    case "experimental-fto-l3t": {
      puzzleStickering.set(experimentalFTO_LBT(), "Dim" /* Dim */);
      break;
    }
    default:
      console.warn(
        `Unsupported stickering for ${puzzleLoader.id}: ${stickering}. Setting all pieces to dim.`
      );
      puzzleStickering.set(m.and(m.moves([])), "Dim" /* Dim */);
  }
  return puzzleStickering.toStickeringMask();
}
async function ftoStickerings() {
  return [
    "full",
    "experimental-fto-fc",
    "experimental-fto-f2t",
    "experimental-fto-sc",
    "experimental-fto-l2c",
    "experimental-fto-lbt",
    "experimental-fto-l3t"
  ];
}

// src/cubing/puzzles/implementations/fto/index.ts
var FTOPuzzleLoader = class extends PGPuzzleLoader {
  constructor() {
    super({
      pgID: "FTO",
      id: "fto",
      fullName: "Face-Turning Octahedron",
      inventedBy: ["Karl Rohrbach", "David Pitcher"],
      // http://twistypuzzles.com/cgi-bin/puzzle.cgi?pkey=1663
      inventionYear: 1983
      // http://twistypuzzles.com/cgi-bin/puzzle.cgi?pkey=1663
    });
    this.stickerings = ftoStickerings;
    this.svg = getCached(async () => {
      return (await Promise.resolve().then(() => (init_puzzles_dynamic_unofficial(), puzzles_dynamic_unofficial_exports))).ftoSVG;
    });
  }
  stickeringMask(stickering) {
    return ftoStickering(this, stickering);
  }
};
var fto = new FTOPuzzleLoader();

// src/cubing/puzzles/stickerings/megaminx-stickerings.ts
async function megaminxStickeringMask(puzzleLoader, stickering) {
  if ((await megaminxStickerings()).includes(stickering)) {
    return cubeLikeStickeringMask(puzzleLoader, stickering);
  }
  console.warn(
    `Unsupported stickering for ${puzzleLoader.id}: ${stickering}. Setting all pieces to dim.`
  );
  return cubeLikeStickeringMask(puzzleLoader, "full");
}
var megaminxStickeringListPromise = from(
  () => cubeLikeStickeringList("megaminx")
);
function megaminxStickerings() {
  return megaminxStickeringListPromise;
}

// src/cubing/puzzles/implementations/megaminx/index.ts
var MegaminxPuzzleLoader = class extends PGPuzzleLoader {
  constructor() {
    super({
      id: "megaminx",
      fullName: "Megaminx",
      // Too many simultaneous inventors to name.
      inventionYear: 1981
      // Earliest date from https://www.jaapsch.net/puzzles/megaminx.htm
    });
    this.stickerings = megaminxStickerings;
    this.llSVG = getCached(async () => {
      return (await Promise.resolve().then(() => (init_puzzles_dynamic_megaminx(), puzzles_dynamic_megaminx_exports))).megaminxLLSVG;
    });
  }
  stickeringMask(stickering) {
    return megaminxStickeringMask(this, stickering);
  }
};
var megaminx = new MegaminxPuzzleLoader();

// src/cubing/puzzles/implementations/pyraminx/index.ts
var PyraminxPuzzleLoader = class extends PGPuzzleLoader {
  constructor() {
    super({
      id: "pyraminx",
      fullName: "Pyraminx",
      inventedBy: ["Uwe Meffert"]
    });
    this.svg = getCached(async () => {
      return (await Promise.resolve().then(() => (init_puzzles_dynamic_side_events(), puzzles_dynamic_side_events_exports))).pyraminxSVG;
    });
  }
};
var pyraminx = new PyraminxPuzzleLoader();

// src/cubing/puzzles/implementations/square1/index.ts
var square1 = {
  id: "square1",
  fullName: "Square-1",
  inventedBy: ["Karel Hr\u0161el", "Vojtech Kopsk\xFD"],
  inventionYear: 1990,
  // Czech patent application year: http://spisy.upv.cz/Patents/FullDocuments/277/277266.pdf
  kpuzzle: getCached(
    async () => new KPuzzle(
      (await Promise.resolve().then(() => (init_puzzles_dynamic_side_events(), puzzles_dynamic_side_events_exports))).sq1HyperOrbitJSON
    )
  ),
  svg: getCached(async () => {
    return (await Promise.resolve().then(() => (init_puzzles_dynamic_side_events(), puzzles_dynamic_side_events_exports))).sq1HyperOrbitSVG;
  })
};

// src/cubing/puzzles/implementations/kilominx/index.ts
var KILOMINX_PUZZLE_DESCRIPTION = "d f 0.56";
var kilominx = {
  id: "kilominx",
  fullName: "Kilominx",
  kpuzzle: getCached(
    () => asyncGetKPuzzle2(KILOMINX_PUZZLE_DESCRIPTION, {
      includeCenterOrbits: false,
      includeEdgeOrbits: false
    })
  ),
  pg: () => descAsyncGetPuzzleGeometry(KILOMINX_PUZZLE_DESCRIPTION, {
    includeCenterOrbits: false,
    includeEdgeOrbits: false
  }),
  svg: getCached(async () => {
    return (await Promise.resolve().then(() => (init_puzzles_dynamic_unofficial(), puzzles_dynamic_unofficial_exports))).kilominxSVG;
  })
};

// src/cubing/puzzles/implementations/redi-cube/index.ts
var rediCube = {
  id: "redi_cube",
  fullName: "Redi Cube",
  // Announced 2009-07-21: https://www.youtube.com/watch?v=cjfMzA1u3vM
  // https://twistypuzzles.com/cgi-bin/puzzle.cgi?pkey=1520
  inventedBy: ["Oskar van Deventer"],
  inventionYear: 2009,
  kpuzzle: getCached(
    async () => new KPuzzle(
      (await Promise.resolve().then(() => (init_puzzles_dynamic_unofficial(), puzzles_dynamic_unofficial_exports))).rediCubeJSON
    )
  ),
  svg: async () => {
    return (await Promise.resolve().then(() => (init_puzzles_dynamic_unofficial(), puzzles_dynamic_unofficial_exports))).rediCubeSVG;
  }
};

// src/cubing/puzzles/implementations/4x4x4/index.ts
var cube4x4x4 = new CubePGPuzzleLoader({
  id: "4x4x4",
  fullName: "4\xD74\xD74 Cube"
});
cube4x4x4.llSVG = getCached(async () => {
  return (await Promise.resolve().then(() => (init_puzzles_dynamic_4x4x4(), puzzles_dynamic_4x4x4_exports))).cube4x4x4LLSVG;
});

// src/cubing/puzzles/implementations/melindas2x2x2x2/index.ts
var melindas2x2x2x2 = {
  id: "melindas2x2x2x2",
  fullName: "Melinda's 2\xD72\xD72\xD72",
  inventedBy: ["Melinda Green"],
  // inventionYear: 20__, // TODO
  kpuzzle: getCached(
    async () => new KPuzzle(
      (await Promise.resolve().then(() => (init_puzzles_dynamic_side_events(), puzzles_dynamic_side_events_exports))).melindas2x2x2x2OrbitJSON
    )
  ),
  svg: getCached(async () => {
    return (await Promise.resolve().then(() => (init_puzzles_dynamic_side_events(), puzzles_dynamic_side_events_exports))).melindas2x2x2x2OrbitSVG;
  })
};

// src/cubing/puzzles/index.ts
var puzzles = {
  /******** Start of WCA Puzzles *******/
  "3x3x3": cube3x3x3,
  "2x2x2": cube2x2x2,
  "4x4x4": cube4x4x4,
  "5x5x5": new CubePGPuzzleLoader({ id: "5x5x5", fullName: "5\xD75\xD75 Cube" }),
  "6x6x6": new CubePGPuzzleLoader({ id: "6x6x6", fullName: "6\xD76\xD76 Cube" }),
  "7x7x7": new CubePGPuzzleLoader({ id: "7x7x7", fullName: "7\xD77\xD77 Cube" }),
  "40x40x40": new CubePGPuzzleLoader({
    id: "40x40x40",
    fullName: "40\xD740\xD740 Cube"
  }),
  // 3x3x3 Blindfolded
  // 3x3x3 Fewest Moves
  // 3x3x3 One-Handed
  clock,
  megaminx,
  pyraminx,
  skewb: new PGPuzzleLoader({
    id: "skewb",
    fullName: "Skewb",
    inventedBy: ["Tony Durham"]
    // https://www.jaapsch.net/puzzles/skewb.htm
    // inventionYear: 1982, // 1982 is actually the year of Hofstadter's column.
  }),
  square1,
  // 4x4x4 Blindfolded
  // 5x5x5 Blindfolded
  /******** End of WCA puzzles ********/
  fto,
  gigaminx: new PGPuzzleLoader({
    id: "gigaminx",
    fullName: "Gigaminx",
    inventedBy: ["Tyler Fox"],
    inventionYear: 2006
    // Earliest date from https://www.twistypuzzles.com/cgi-bin/puzzle.cgi?pkey=1475
  }),
  master_tetraminx: new PGPuzzleLoader({
    pgID: "master tetraminx",
    id: "master_tetraminx",
    fullName: "Master Tetraminx",
    inventedBy: ["Katsuhiko Okamoto"],
    // Using master pyraminx: https://twistypuzzles.com/cgi-bin/puzzle.cgi?pkey=1352
    inventionYear: 2002
    // Using master pyraminx: https://twistypuzzles.com/cgi-bin/puzzle.cgi?pkey=1352
  }),
  kilominx,
  redi_cube: rediCube,
  melindas2x2x2x2
};

// src/bin/order.ts
var puzzleName = process.argv[2];
var algString = process.argv[3];
if (!(puzzleName && algString)) {
  console.log("Usage: order <puzzle-geometry-id> <alg>");
  console.log("");
  console.log(`Example: order 3x3x3 "R U R' U R U2' R'"`);
  process.exit(0);
}
var kpuzzle = await puzzles[puzzleName].kpuzzle();
if (!kpuzzle) {
  const pg = getPuzzleGeometryByName(puzzleName, { allMoves: true });
  kpuzzle = new KPuzzle(pg.getKPuzzleDefinition(true));
}
var order = kpuzzle.algToTransformation(algString).repetitionOrder();
console.log(order);

import {
  Alg,
  Move,
  TraversalDownUp,
  functionFromTraversal
} from "./chunk-2OZSC5I6.js";

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
function moveToTransformationUncached(kpuzzle, move) {
  const quantumKey = move.quantum.toString();
  let quantumMoveDefinition = kpuzzle.definition.moves[quantumKey];
  if (!quantumMoveDefinition) {
    const derivedFrom = kpuzzle.definition.experimentalDerivedMoves?.[quantumKey];
    if (derivedFrom) {
      quantumMoveDefinition = kpuzzle.algToTransformation(derivedFrom).transformationData;
    }
  }
  if (quantumMoveDefinition) {
    return repeatTransformationUncached(
      kpuzzle,
      quantumMoveDefinition,
      move.amount
    );
  }
  const moveDefinition = kpuzzle.definition.moves[move.toString()];
  if (moveDefinition) {
    return moveDefinition;
  }
  const inverseMoveDefinition = kpuzzle.definition.moves[move.invert().toString()];
  if (inverseMoveDefinition) {
    return repeatTransformationUncached(kpuzzle, inverseMoveDefinition, -1);
  }
  throw new Error(`Invalid move for KPuzzle (${kpuzzle.name()}): ${move}`);
}

// src/cubing/kpuzzle/KState.ts
var KState = class {
  constructor(kpuzzle, stateData) {
    this.kpuzzle = kpuzzle;
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
  constructor(kpuzzle, transformationData) {
    this.kpuzzle = kpuzzle;
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
  static experimentalConstructIdentity(kpuzzle) {
    const transformation = new KTransformation(
      kpuzzle,
      constructIdentityTransformationDataUncached(kpuzzle.definition)
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
    const { orientation } = orbitTransformationData;
    for (let idx = 0; idx < numPieces; idx++) {
      if (orientation[idx] !== 0) {
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
function isTransformationDataIdentical(kpuzzle, transformationData1, transformationData2) {
  for (const [orbitName, orbitDefinition] of Object.entries(
    kpuzzle.definition.orbits
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
function invertTransformation(kpuzzle, transformationData) {
  const newTransformationData = {};
  for (const orbitName in kpuzzle.definition.orbits) {
    const orbitDefinition = kpuzzle.definition.orbits[orbitName];
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
function repeatTransformationUncached(kpuzzle, transformationData, amount) {
  if (amount === 1) {
    return transformationData;
  }
  if (amount < 0) {
    return repeatTransformationUncached(
      kpuzzle,
      invertTransformation(kpuzzle, transformationData),
      -amount
    );
  }
  if (amount === 0) {
    const { transformationData: transformationData2 } = kpuzzle.identityTransformation();
    return transformationData2;
  }
  let halfish = transformationData;
  if (amount !== 2) {
    halfish = repeatTransformationUncached(
      kpuzzle,
      transformationData,
      Math.floor(amount / 2)
    );
  }
  const twiceHalfish = combineTransformationData(
    kpuzzle.definition,
    halfish,
    halfish
  );
  if (amount % 2 === 0) {
    return twiceHalfish;
  } else {
    return combineTransformationData(
      kpuzzle.definition,
      transformationData,
      twiceHalfish
    );
  }
}
var AlgToTransformationTraversal = class extends TraversalDownUp {
  traverseAlg(alg, kpuzzle) {
    let transformation = null;
    for (const algNode of alg.childAlgNodes()) {
      if (transformation) {
        transformation = transformation.applyTransformation(
          this.traverseAlgNode(algNode, kpuzzle)
        );
      } else {
        transformation = this.traverseAlgNode(algNode, kpuzzle);
      }
    }
    return transformation ?? kpuzzle.identityTransformation();
  }
  traverseGrouping(grouping, kpuzzle) {
    const algTransformation = this.traverseAlg(grouping.alg, kpuzzle);
    return new KTransformation(
      kpuzzle,
      repeatTransformationUncached(
        kpuzzle,
        algTransformation.transformationData,
        grouping.amount
      )
    );
  }
  traverseMove(move, kpuzzle) {
    return kpuzzle.moveToTransformation(move);
  }
  traverseCommutator(commutator, kpuzzle) {
    const aTransformation = this.traverseAlg(commutator.A, kpuzzle);
    const bTransformation = this.traverseAlg(commutator.B, kpuzzle);
    return aTransformation.applyTransformation(bTransformation).applyTransformation(aTransformation.invert()).applyTransformation(bTransformation.invert());
  }
  traverseConjugate(conjugate, kpuzzle) {
    const aTransformation = this.traverseAlg(conjugate.A, kpuzzle);
    const bTransformation = this.traverseAlg(conjugate.B, kpuzzle);
    return aTransformation.applyTransformation(bTransformation).applyTransformation(aTransformation.invert());
  }
  traversePause(_, kpuzzle) {
    return kpuzzle.identityTransformation();
  }
  traverseNewline(_, kpuzzle) {
    return kpuzzle.identityTransformation();
  }
  traverseLineComment(_, kpuzzle) {
    return kpuzzle.identityTransformation();
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
  let order = 1;
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
        order = order * cycleLength / gcd(order, cycleLength);
      }
    }
  }
  return order;
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

export {
  KState,
  KTransformation,
  KPuzzle
};
//# sourceMappingURL=chunk-UIGRNWPE.js.map

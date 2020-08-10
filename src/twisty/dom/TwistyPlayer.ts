import { Vector3 } from "three";
import { countMoves } from "../../../app/twizzle/move-counter";
import { BlockMove, experimentalAppendBlockMove, Sequence } from "../../alg";
import { KPuzzle, KPuzzleDefinition, Puzzles } from "../../kpuzzle";
import {
  getPuzzleGeometryByName,
  PuzzleGeometry,
  StickerDat,
} from "../../puzzle-geometry";
import { Cube3D } from "../3D/puzzles/Cube3D";
import { PG3D } from "../3D/puzzles/PG3D";
import { Twisty3DPuzzle } from "../3D/puzzles/Twisty3DPuzzle";
import { Twisty3DScene } from "../3D/Twisty3DScene";
import { AlgCursor } from "../animation/alg/AlgCursor";
import { Timeline } from "../animation/Timeline";
import { TwistyControlButtonPanel } from "./controls/buttons";
import { TwistyControlElement } from "./controls/TwistyControlElement.ts";
import { TwistyScrubber } from "./controls/TwistyScrubber";
import { ManagedCustomElement } from "./element/ManagedCustomElement";
import { twistyPlayerCSS } from "./TwistyPlayer.css";
import {
  BackgroundTheme,
  ControlsLocation,
  PuzzleID,
  TwistyPlayerConfig,
  TwistyPlayerConfigInitialValues,
  VisualizationFormat,
} from "./TwistyPlayerConfig";
import { Twisty2DSVG } from "./viewers/Twisty2DSVG";
import { Twisty3DCanvas } from "./viewers/Twisty3DCanvas";
import { TwistyViewerElement } from "./viewers/TwistyViewerElement";
import {
  BackViewLayout,
  TwistyViewerWrapper,
} from "./viewers/TwistyViewerWrapper";

export interface LegacyExperimentalPG3DViewConfig {
  def: KPuzzleDefinition;
  stickerDat: StickerDat;
  experimentalPolarVantages?: boolean;
  sideBySide?: boolean;
  showFoundation?: boolean;
  experimentalInitialVantagePosition?: Vector3;
}

function createPG(puzzleName: string): PuzzleGeometry {
  const pg = getPuzzleGeometryByName(puzzleName, [
    "allmoves",
    "true",
    "orientcenters",
    "true",
    "puzzleorientation",
    JSON.stringify(["U", [0, 1, 0], "F", [0, 0, 1]]),
  ]);
  const kpuzzleDef = pg.writekpuzzle();
  const worker = new KPuzzle(kpuzzleDef);

  // Wide move / rotation hack
  worker.setFaceNames(pg.facenames.map((_: any) => _[1]));
  const mps = pg.movesetgeos;
  for (const mp of mps) {
    const grip1 = mp[0] as string;
    const grip2 = mp[2] as string;
    // angle compatibility hack
    worker.addGrip(grip1, grip2, mp[4] as number);
  }
  return pg;
}

// <twisty-player>
export class TwistyPlayer extends ManagedCustomElement {
  #config: TwistyPlayerConfig;

  viewerElems: TwistyViewerElement[];
  controlElems: TwistyControlElement[];
  timeline: Timeline;
  #viewerWrapper: TwistyViewerWrapper;
  #cursor: AlgCursor;
  #cachedTwisty3DScene: Twisty3DScene | null = null;
  #cachedTwisty3DPuzzle: Twisty3DPuzzle | null = null;
  public legacyExperimentalCoalesceModFunc: (mv: BlockMove) => number = (
    _mv: BlockMove,
  ): number => 0;

  public legacyExperimentalPG3D: PG3D | null = null;
  // TODO: support config from DOM.
  constructor(
    initialConfig: TwistyPlayerConfigInitialValues = {},
    private legacyExperimentalPG3DViewConfig: LegacyExperimentalPG3DViewConfig | null = null,
  ) {
    super();
    this.#config = new TwistyPlayerConfig(initialConfig);

    this.legacyExperimentalPG3DViewConfig = legacyExperimentalPG3DViewConfig;
  }

  set alg(v: Sequence) {
    this.#config.attributes["alg"].setValue(v);
  }

  get alg(): Sequence {
    return this.#config.attributes["alg"].value;
  }

  set puzzle(v: PuzzleID) {
    this.#config.attributes["puzzle"].setValue(v);
  }

  get puzzle(): PuzzleID {
    return this.#config.attributes["puzzle"].value as PuzzleID;
  }

  set visualization(v: VisualizationFormat) {
    this.#config.attributes["visualization"].setValue(v);
  }

  get visualization(): VisualizationFormat {
    return this.#config.attributes["visualization"]
      .value as VisualizationFormat;
  }

  set background(v: BackgroundTheme) {
    this.#config.attributes["background"].setValue(v);
  }

  get background(): BackgroundTheme {
    return this.#config.attributes["background"].value as BackgroundTheme;
  }

  set controls(v: ControlsLocation) {
    this.#config.attributes["controls"].setValue(v);
  }

  get controls(): ControlsLocation {
    return this.#config.attributes["controls"].value as ControlsLocation;
  }

  set backView(v: BackViewLayout) {
    this.#config.attributes["back-view"].setValue(v);
  }

  get backView(): BackViewLayout {
    return this.#config.attributes["back-view"].value as BackViewLayout;
  }

  set cameraPosition(v: Vector3) {
    this.#config.attributes["camera-position"].setValue(v);
  }

  get cameraPosition(): Vector3 {
    return this.#config.attributes["camera-position"].value;
  }

  protected connectedCallback(): void {
    this.processAttributes();

    this.timeline = new Timeline();

    const viewers = this.createViewers(
      this.timeline,
      this.alg,
      this.visualization,
      this.puzzle,
      this.backView !== "none",
    );
    const scrubber = new TwistyScrubber(this.timeline);
    const controlButtonGrid = new TwistyControlButtonPanel(this.timeline, this);

    this.viewerElems = viewers;
    this.controlElems = [scrubber, controlButtonGrid];

    // TODO: specify exactly when back views are possible.
    // TODO: Are there any SVGs where we'd want a separate back view?
    const setBackView: boolean = this.backView && this.visualization !== "2D";
    const backView = setBackView ? this.backView : "none";
    this.#viewerWrapper = new TwistyViewerWrapper({
      checkered: this.background === "checkered",
      backView,
    });
    this.addElement(this.#viewerWrapper);

    this.contentWrapper.classList.add(`controls-${this.controls}`);

    this.viewerElems.map((el) => this.#viewerWrapper.addElement(el));
    this.addElement(this.controlElems[0]);
    this.addElement(this.controlElems[1]);

    this.addCSS(twistyPlayerCSS);
  }

  protected createViewers(
    timeline: Timeline,
    alg: Sequence,
    visualization: VisualizationFormat,
    puzzleName: string,
    backView: boolean,
  ): TwistyViewerElement[] {
    switch (visualization) {
      case "2D":
        try {
          this.#cursor = new AlgCursor(timeline, Puzzles[puzzleName], alg);
        } catch (e) {
          // TODO: Deduplicate fallback.
          this.#cursor = new AlgCursor(
            timeline,
            Puzzles[puzzleName],
            new Sequence([]),
          );
        }
        this.timeline.addCursor(this.#cursor);
        this.timeline.jumpToEnd();
        return [new Twisty2DSVG(this.#cursor, Puzzles[puzzleName])];
      case "3D":
        if (puzzleName === "3x3x3") {
          // TODO: fold 3D and PG3D into this.
          try {
            this.#cursor = new AlgCursor(timeline, Puzzles[puzzleName], alg);
          } catch (e) {
            // TODO: Deduplicate fallback.
            this.#cursor = new AlgCursor(
              timeline,
              Puzzles[puzzleName],
              new Sequence([]),
            );
          }
          const scene = new Twisty3DScene();
          const cube3d = new Cube3D(
            this.#cursor,
            scene.scheduleRender.bind(scene),
          );
          scene.addTwisty3DPuzzle(cube3d);
          const viewers = [new Twisty3DCanvas(scene)];
          if (backView) {
            viewers.push(
              new Twisty3DCanvas(scene, {
                // cameraPosition, // TODO
                negateCameraPosition: true,
              }),
            );
          }
          this.timeline.addCursor(this.#cursor);
          this.timeline.jumpToEnd();
          return viewers;
        }
      // fallthrough for 3D when not 3x3x3
      case "PG3D": {
        const [kpuzzleDef, stickerDat, cameraPosition] = this.pgHelper(
          puzzleName,
        );

        try {
          this.#cursor = new AlgCursor(timeline, kpuzzleDef, alg);
        } catch (e) {
          // TODO: Deduplicate fallback.
          this.#cursor = new AlgCursor(timeline, kpuzzleDef, new Sequence([]));
        }

        this.#cachedTwisty3DScene = new Twisty3DScene();
        const pg3d = new PG3D(
          this.#cursor,
          this.#cachedTwisty3DScene.scheduleRender.bind(
            this.#cachedTwisty3DScene,
          ),
          kpuzzleDef,
          stickerDat,
          this.legacyExperimentalPG3DViewConfig?.showFoundation ?? true,
        );
        this.#cachedTwisty3DPuzzle = pg3d;
        this.legacyExperimentalPG3D = pg3d;
        this.#cachedTwisty3DScene.addTwisty3DPuzzle(this.#cachedTwisty3DPuzzle);
        const viewers = [
          new Twisty3DCanvas(this.#cachedTwisty3DScene, { cameraPosition }),
        ];
        if (backView) {
          viewers.push(
            new Twisty3DCanvas(this.#cachedTwisty3DScene, {
              cameraPosition,
              negateCameraPosition: true,
            }),
          );
        }
        this.timeline.addCursor(this.#cursor);
        this.timeline.jumpToEnd();
        return viewers;
      }
    }
  }

  // TODO: Distribute this code better.
  private pgHelper(
    puzzleName: string,
  ): [KPuzzleDefinition, StickerDat, Vector3 | undefined] {
    let kpuzzleDef: KPuzzleDefinition;
    let stickerDat: StickerDat;
    let cameraPosition: Vector3 | undefined = undefined;
    if (this.legacyExperimentalPG3DViewConfig) {
      kpuzzleDef = this.legacyExperimentalPG3DViewConfig.def;
      stickerDat = this.legacyExperimentalPG3DViewConfig.stickerDat;
      // experimentalPolarVantages ?: boolean;
      // sideBySide ?: boolean;
      // showFoundation ?: boolean;
      cameraPosition = this.legacyExperimentalPG3DViewConfig
        .experimentalInitialVantagePosition;
    } else {
      const pg = createPG(puzzleName);
      stickerDat = pg.get3d(0.0131);
      kpuzzleDef = pg.writekpuzzle();
    }
    return [kpuzzleDef, stickerDat, cameraPosition];
  }

  // TODO: combine with alg setter? Or tie to callback from setter?
  setAlg(alg: Sequence): void {
    this.alg = alg;
    this.#cursor.setAlg(this.alg);
  }

  getAlg(): Sequence {
    return this.alg;
  }

  setPuzzle(
    puzzleName: string,
    legacyExperimentalPG3DViewConfig?: LegacyExperimentalPG3DViewConfig,
  ): void {
    this.puzzle = puzzleName as PuzzleID;
    this.legacyExperimentalPG3DViewConfig =
      legacyExperimentalPG3DViewConfig ?? null;
    switch (this.visualization) {
      // TODO: Swap out both 3D implementations with each other.
      case "PG3D": {
        console.log("pg3d");
        const scene = this.#cachedTwisty3DScene!;
        scene.remove(this.#cachedTwisty3DPuzzle!);
        this.#cursor.removePositionListener(this.#cachedTwisty3DPuzzle!);
        const [def, dat /*, _*/] = this.pgHelper(this.puzzle);
        const pg3d = new PG3D(
          this.#cursor,
          scene.scheduleRender.bind(scene),
          def,
          dat,
          this.legacyExperimentalPG3DViewConfig?.showFoundation,
        );
        scene.addTwisty3DPuzzle(pg3d);
        this.#cursor.setPuzzle(def);
        this.#cachedTwisty3DPuzzle = pg3d;
        for (const viewer of this.viewerElems) {
          viewer.scheduleRender();
        }
        return;
      }

      // this.#cursor.set
      // return;
    }

    // Fallback
    const oldCursor = this.#cursor;
    const viewers = this.createViewers(
      this.timeline,
      this.alg,
      this.visualization,
      puzzleName,
      this.backView !== "none",
    );
    this.timeline.removeCursor(oldCursor);
    this.timeline.removeTimestampListener(oldCursor);
    for (const oldViewer of this.viewerElems) {
      this.#viewerWrapper.removeElement(oldViewer);
    }
    for (const viewer of viewers.reverse()) {
      this.#viewerWrapper.prependElement(viewer);
    }
    this.viewerElems = viewers;
  }

  // TODO: Handle playing the new move vs. just modying the alg.
  experimentalAddMove(move: BlockMove, coalesce: boolean = false): void {
    const oldNumMoves = countMoves(this.alg); // TODO
    const newAlg = experimentalAppendBlockMove(
      this.alg,
      move,
      coalesce,
      this.legacyExperimentalCoalesceModFunc(move),
    );

    this.setAlg(newAlg);
    // TODO
    if (oldNumMoves <= countMoves(newAlg)) {
      this.timeline.experimentalJumpToLastMove();
    } else {
      this.timeline.jumpToEnd();
    }
    this.timeline.play();
  }

  fullscreen(): void {
    this.requestFullscreen();
  }

  private processAttributes(): void {
    this.#config.processAttributes(this);
  }
}

if (typeof customElements !== "undefined") {
  customElements.define("twisty-player", TwistyPlayer);
}

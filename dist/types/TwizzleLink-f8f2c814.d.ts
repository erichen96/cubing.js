import { Texture, Object3D, Raycaster, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { g as PuzzleSpecificSimplifyOptions, M as Move, a as Alg, P as Pause, h as AppendCancelOptions, d as AlgLeaf, b as AppendOptions, A as AlgNode, I as IterationDirection } from './Alg-c6770822.js';
import { P as Parsed } from './parseAlg-d2c83795.js';
import { a as KPuzzle, P as PuzzleGeometry, K as KState, e as KTransformation, f as PuzzleDescriptionString } from './KState-8f0d81ea.js';

type FaceletMeshStickeringMask = "regular" | "dim" | "oriented" | "ignored" | "invisible";
type FaceletStickeringMask = {
    mask: FaceletMeshStickeringMask;
    hintMask?: FaceletMeshStickeringMask;
};
type PieceStickeringMask = {
    facelets: (FaceletMeshStickeringMask | FaceletStickeringMask | null)[];
};
type OrbitStickeringMask = {
    pieces: (PieceStickeringMask | null)[];
};
type StickeringMask = {
    specialBehaviour?: "picture";
    name?: string;
    orbits: Record<string, OrbitStickeringMask>;
};

interface PuzzleLoader {
    id: string;
    fullName: string;
    inventedBy?: string[];
    inventionYear?: number;
    /** @deprecated */
    def?: never;
    kpuzzle: () => Promise<KPuzzle>;
    svg: () => Promise<string>;
    llSVG?: () => Promise<string>;
    pg?: () => Promise<PuzzleGeometry>;
    stickeringMask?: (stickering: ExperimentalStickering) => Promise<StickeringMask>;
    stickerings?: () => Promise<ExperimentalStickering[]>;
    puzzleSpecificSimplifyOptions?: PuzzleSpecificSimplifyOptions;
    puzzleSpecificSimplifyOptionsPromise?: Promise<PuzzleSpecificSimplifyOptions>;
}

declare const experimentalStickerings: Record<string, {
    groups?: Partial<Record<PuzzleID, string>>;
}>;

type MillisecondTimestamp = number;
type Duration = MillisecondTimestamp;
type Timestamp = MillisecondTimestamp;
declare enum Direction {
    Forwards = 1,
    Paused = 0,
    Backwards = -1
}
interface MoveInProgress {
    move: Move;
    direction: Direction;
    fraction: number;
}
type PuzzlePosition = {
    state: KState;
    movesInProgress: MoveInProgress[];
};
declare enum BoundaryType {
    Move = "move",
    EntireTimeline = "entire-timeline"
}
interface TimeRange {
    start: MillisecondTimestamp;
    end: MillisecondTimestamp;
}

interface UserVisibleError {
    errors: string[];
}
declare class UserVisibleErrorTracker extends SimpleTwistyPropSource<UserVisibleError> {
    getDefaultValue(): UserVisibleError;
    reset(): void;
    protected canReuseValue(_v1: UserVisibleError, _v2: UserVisibleError): boolean;
}

type InputRecord = {};
type InputProps<T extends InputRecord> = {
    [s in keyof T]: TwistyPropParent<T[s]>;
};
interface SourceEventDetail<OutputType> {
    sourceProp: TwistyPropSource<OutputType, any>;
    value: Promise<OutputType>;
    generation: number;
}
type SourceEvent<T> = CustomEvent<SourceEventDetail<T>>;
type PromiseOrValue<T> = T | Promise<T>;
declare abstract class TwistyPropParent<T> {
    #private;
    abstract get(): Promise<T>;
    canReuse(v1: T, v2: T): boolean;
    protected canReuseValue(_v1: T, _v2: T): boolean;
    debugGetChildren(): TwistyPropDerived<any, any>[];
    protected addChild(child: TwistyPropDerived<any, any>): void;
    protected removeChild(child: TwistyPropDerived<any, any>): void;
    protected lastSourceGeneration: number;
    protected markStale(sourceEvent: SourceEvent<any>): void;
    /** @deprecated */
    addRawListener(listener: () => void, options?: {
        initial: boolean;
    }): void;
    /** @deprecated */
    removeRawListener(listener: () => void): void;
    addFreshListener(listener: (value: T) => void): void;
    removeFreshListener(listener: (value: T) => void): void;
}
declare abstract class TwistyPropSource<OutputType, InputType = OutputType> extends TwistyPropParent<OutputType> {
    #private;
    abstract getDefaultValue(): PromiseOrValue<OutputType>;
    constructor(initialValue?: PromiseOrValue<InputType>);
    set(input: PromiseOrValue<InputType>): void;
    get(): Promise<OutputType>;
    protected deriveFromPromiseOrValue(input: PromiseOrValue<InputType>, oldValuePromise: Promise<OutputType>): Promise<OutputType>;
    protected abstract derive(input: InputType, oldValuePromise: Promise<OutputType>): PromiseOrValue<OutputType>;
}
declare abstract class SimpleTwistyPropSource<SimpleType> extends TwistyPropSource<SimpleType> {
    protected derive(input: SimpleType): PromiseOrValue<SimpleType>;
}
declare const NO_VALUE: unique symbol;
type NoValueType = typeof NO_VALUE;
declare abstract class TwistyPropDerived<InputTypes extends InputRecord, OutputType> extends TwistyPropParent<OutputType> {
    #private;
    protected userVisibleErrorTracker?: UserVisibleErrorTracker | undefined;
    constructor(parents: InputProps<InputTypes>, userVisibleErrorTracker?: UserVisibleErrorTracker | undefined);
    get(): Promise<OutputType>;
    protected abstract derive(input: InputTypes): PromiseOrValue<OutputType>;
}

type SimpleDirection = Direction.Forwards | Direction.Backwards;
interface PlayingInfo {
    playing: boolean;
    direction: SimpleDirection;
    untilBoundary: BoundaryType;
    loop: boolean;
}
declare class PlayingInfoProp extends TwistyPropSource<PlayingInfo, Partial<PlayingInfo>> {
    getDefaultValue(): Promise<PlayingInfo>;
    protected derive(newInfo: Partial<PlayingInfo>, oldValuePromise: Promise<PlayingInfo>): Promise<PlayingInfo>;
    protected canReuseValue(v1: PlayingInfo, v2: PlayingInfo): boolean;
}

declare class ArbitraryStringProp extends SimpleTwistyPropSource<string | null> {
    getDefaultValue(): string | null;
}

declare class URLProp extends TwistyPropSource<URL | null, URL | string | null> {
    getDefaultValue(): URL | null;
    derive(input: URL | string | null): URL | null;
}

declare class AlgIssues {
    readonly warnings: readonly string[];
    readonly errors: readonly string[];
    constructor(issues?: {
        warnings?: string[];
        errors?: string[];
    });
    add(issues?: {
        warnings?: string[];
        errors?: string[];
    }): AlgIssues;
    /** @deprecated */
    log(): void;
}
interface AlgWithIssues {
    alg: Alg;
    issues: AlgIssues;
}
declare class AlgProp extends TwistyPropSource<AlgWithIssues, Alg | string> {
    getDefaultValue(): AlgWithIssues;
    protected canReuseValue(v1: AlgWithIssues, v2: AlgWithIssues): boolean;
    protected derive(newAlg: Alg | string): Promise<AlgWithIssues>;
}

type AlgTransformationPropInputs = {
    setupAlg: AlgWithIssues;
    kpuzzle: KPuzzle;
};
declare class AlgTransformationProp extends TwistyPropDerived<AlgTransformationPropInputs, KTransformation> {
    derive(input: AlgTransformationPropInputs): KTransformation;
}

type AnimatedLeafAlgNode = Move | Pause;

interface CurrentMove {
    move: Move;
    direction: Direction;
    fraction: number;
    startTimestamp: MillisecondTimestamp;
    endTimestamp: MillisecondTimestamp;
}
interface CurrentMoveInfo {
    stateIndex: number;
    currentMoves: CurrentMove[];
    movesFinishing: CurrentMove[];
    movesFinished: CurrentMove[];
    movesStarting: CurrentMove[];
    latestStart: number;
    earliestEnd: number;
}
interface AlgIndexer {
    getAnimLeaf(index: number): AnimatedLeafAlgNode | null;
    indexToMoveStartTimestamp(index: number): Timestamp;
    stateAtIndex(index: number, startSTate?: KState): KState;
    transformationAtIndex(index: number): KTransformation;
    numAnimatedLeaves(): number;
    timestampToIndex(timestamp: Timestamp): number;
    algDuration(): Duration;
    moveDuration(index: number): number;
    timestampToPosition?: (timestamp: Timestamp, startState?: KState) => PuzzlePosition;
    currentMoveInfo?: (timestamp: Timestamp) => CurrentMoveInfo;
}

declare const setupToLocations: {
    start: boolean;
    end: boolean;
};
type SetupToLocation = keyof typeof setupToLocations;
declare class SetupAnchorProp extends SimpleTwistyPropSource<SetupToLocation> {
    getDefaultValue(): SetupToLocation;
}

interface AnchorTransformationPropInputs {
    setupTransformation: KTransformation | null;
    setupAnchor: SetupToLocation;
    setupAlgTransformation: KTransformation;
    indexer: AlgIndexer;
}
declare class AnchorTransformationProp extends TwistyPropDerived<AnchorTransformationPropInputs, KTransformation> {
    derive(inputs: AnchorTransformationPropInputs): KTransformation;
}

interface CatchUpMove {
    move: Move | null;
    amount: number;
}
declare class CatchUpMoveProp extends SimpleTwistyPropSource<CatchUpMove> {
    getDefaultValue(): CatchUpMove;
    protected canReuseValue(v1: CatchUpMove, v2: CatchUpMove): boolean;
}

interface CurrentLeavesSimplifiedPropInputs {
    currentMoveInfo: CurrentMoveInfo;
}
interface CurrentLeavesSimplified {
    stateIndex: number;
    movesFinishing: Move[];
    movesFinished: Move[];
}
declare class CurrentLeavesSimplifiedProp extends TwistyPropDerived<CurrentLeavesSimplifiedPropInputs, CurrentLeavesSimplified> {
    protected derive(inputs: CurrentLeavesSimplifiedPropInputs): CurrentLeavesSimplified;
    protected canReuseValue(v1: CurrentLeavesSimplified, v2: CurrentLeavesSimplified): boolean;
}

declare const smartTimestamps: {
    auto: boolean;
    start: boolean;
    end: boolean;
    anchor: boolean;
    "opposite-anchor": boolean;
};
type TimestampRequest = MillisecondTimestamp | keyof typeof smartTimestamps;
declare class TimestampRequestProp extends SimpleTwistyPropSource<TimestampRequest> {
    getDefaultValue(): TimestampRequest;
    set(v: PromiseOrValue<TimestampRequest>): void;
    protected validInput(v: TimestampRequest): boolean;
}

interface DetailedTimelineInfoInputs {
    timestampRequest: TimestampRequest;
    timeRange: TimeRange;
    setupAnchor: SetupToLocation;
    setupAlg: AlgWithIssues;
}
interface DetailedTimelineInfo {
    timestamp: MillisecondTimestamp;
    timeRange: TimeRange;
    atStart: boolean;
    atEnd: boolean;
}
declare class DetailedTimelineInfoProp extends TwistyPropDerived<DetailedTimelineInfoInputs, DetailedTimelineInfo> {
    #private;
    protected derive(inputs: DetailedTimelineInfoInputs): DetailedTimelineInfo;
    protected canReuseValue(v1: DetailedTimelineInfo, v2: DetailedTimelineInfo): boolean;
}

interface PositionPropInputs {
    indexer: AlgIndexer;
    detailedTimelineInfo: DetailedTimelineInfo;
    catchUpMove: CatchUpMove;
}
declare class CurrentMoveInfoProp extends TwistyPropDerived<PositionPropInputs, CurrentMoveInfo> {
    derive(inputs: PositionPropInputs): CurrentMoveInfo;
}

interface CurrentTransformationPropInputs {
    anchoredStart: KTransformation;
    currentLeavesSimplified: CurrentLeavesSimplified;
    indexer: AlgIndexer;
}
declare class CurrentStateProp extends TwistyPropDerived<CurrentTransformationPropInputs, KState> {
    derive(inputs: CurrentTransformationPropInputs): KState;
}

declare const visualizationFormats: {
    "3D": boolean;
    "2D": boolean;
    "experimental-2D-LL": boolean;
    PG3D: boolean;
};
type VisualizationFormat = keyof typeof visualizationFormats;
type VisualizationFormatWithAuto = VisualizationFormat | "auto";
declare class VisualizationFormatProp extends SimpleTwistyPropSource<VisualizationFormatWithAuto> {
    getDefaultValue(): VisualizationFormatWithAuto;
}

type VisualizationStrategyPropInputs = {
    visualizationRequest: VisualizationFormatWithAuto;
    puzzleID: PuzzleID;
};
type VisualizationStrategy = "Cube3D" | "2D" | "experimental-2D-LL" | "PG3D";
declare class VisualizationStrategyProp extends TwistyPropDerived<VisualizationStrategyPropInputs, VisualizationStrategy> {
    derive(inputs: VisualizationStrategyPropInputs): VisualizationStrategy;
}

declare const puzzleIDs: {
    "3x3x3": boolean;
    custom: boolean;
    "2x2x2": boolean;
    "4x4x4": boolean;
    "5x5x5": boolean;
    "6x6x6": boolean;
    "7x7x7": boolean;
    "40x40x40": boolean;
    megaminx: boolean;
    pyraminx: boolean;
    square1: boolean;
    clock: boolean;
    skewb: boolean;
    fto: boolean;
    gigaminx: boolean;
    master_tetraminx: boolean;
    kilominx: boolean;
    redi_cube: boolean;
    melindas2x2x2x2: boolean;
};
type PuzzleID = keyof typeof puzzleIDs;
declare class PuzzleIDRequestProp extends SimpleTwistyPropSource<PuzzleID | NoValueType> {
    getDefaultValue(): PuzzleID | NoValueType;
}

declare const indexerStrategyNames: {
    auto: boolean;
    simple: boolean;
    tree: boolean;
    simultaneous: boolean;
};
type IndexerStrategyName = keyof typeof indexerStrategyNames;
declare class IndexerConstructorRequestProp extends SimpleTwistyPropSource<IndexerStrategyName> {
    getDefaultValue(): IndexerStrategyName;
}

type IndexerConstructor = new (kpuzzle: KPuzzle, alg: Alg) => AlgIndexer;
interface IndexerConstructorPropInputs {
    puzzle: PuzzleID;
    alg: AlgWithIssues;
    visualizationStrategy: VisualizationStrategy;
    indexerConstructorRequest: IndexerStrategyName;
}
declare class IndexerConstructorProp extends TwistyPropDerived<IndexerConstructorPropInputs, IndexerConstructor> {
    derive(inputs: IndexerConstructorPropInputs): IndexerConstructor;
}

type IndexerPropInputs = {
    indexerConstructor: IndexerConstructor;
    algWithIssues: AlgWithIssues;
    kpuzzle: KPuzzle;
};
declare class IndexerProp extends TwistyPropDerived<IndexerPropInputs, AlgIndexer> {
    derive(input: IndexerPropInputs): AlgIndexer;
}

interface LegacyPositionPropInputs {
    currentMoveInfo: CurrentMoveInfo;
    state: KState;
}
declare class LegacyPositionProp extends TwistyPropDerived<LegacyPositionPropInputs, PuzzlePosition> {
    derive(inputs: LegacyPositionPropInputs): PuzzlePosition;
}

declare class PuzzleAlgProp extends TwistyPropDerived<{
    algWithIssues: AlgWithIssues;
    kpuzzle: KPuzzle;
}, AlgWithIssues> {
    derive(inputs: {
        algWithIssues: AlgWithIssues;
        kpuzzle: KPuzzle;
    }): Promise<AlgWithIssues>;
}

declare class SetupTransformationProp extends SimpleTwistyPropSource<KTransformation | null> {
    getDefaultValue(): KTransformation | null;
}

declare class KPuzzleProp extends TwistyPropDerived<{
    puzzleLoader: PuzzleLoader;
}, KPuzzle> {
    derive(inputs: {
        puzzleLoader: PuzzleLoader;
    }): Promise<KPuzzle>;
}

declare class PGPuzzleDescriptionStringProp extends SimpleTwistyPropSource<PuzzleDescriptionString | NoValueType> {
    getDefaultValue(): PuzzleDescriptionString | NoValueType;
}

declare class PuzzleIDProp extends TwistyPropDerived<{
    puzzleLoader: PuzzleLoader;
}, PuzzleID> {
    derive(inputs: {
        puzzleLoader: PuzzleLoader;
    }): Promise<PuzzleID>;
}

interface PuzzleLoaderPropInputs {
    puzzleIDRequest: PuzzleID | NoValueType;
    puzzleDescriptionRequest: PuzzleDescriptionString | NoValueType;
}
declare class PuzzleLoaderProp extends TwistyPropDerived<PuzzleLoaderPropInputs, PuzzleLoader> {
    derive(inputs: PuzzleLoaderPropInputs): PuzzleLoader;
}

declare let HTMLElementShim: typeof HTMLElement;

declare class CSSSource {
    private sourceText;
    constructor(sourceText: string);
    getAsString(): string;
}
declare class ManagedCustomElement extends HTMLElementShim {
    #private;
    readonly shadow: ShadowRoot;
    readonly contentWrapper: HTMLDivElement;
    constructor(options?: {
        mode: "open" | "closed";
    });
    addCSS(cssSource: CSSSource): HTMLStyleElement;
    removeCSS(cssSource: CSSSource): void;
    addElement<T extends Node>(element: T): T;
    prependElement<T extends Node>(element: T): void;
    removeElement<T extends Node>(element: T): T;
}

declare const viewerLinkPages: {
    twizzle: boolean;
    "experimental-twizzle-explorer": boolean;
    none: boolean;
};
type ViewerLinkPage = keyof typeof viewerLinkPages;
type ViewerLinkPageWithAuto = ViewerLinkPage | "auto";
declare class ViewerLinkProp extends SimpleTwistyPropSource<ViewerLinkPageWithAuto> {
    getDefaultValue(): ViewerLinkPageWithAuto;
}

declare const buttonIcons: string[];
type ButtonIcon = typeof buttonIcons[number];
interface ButtonAppearance {
    enabled: boolean;
    icon: ButtonIcon;
    title: string;
    hidden?: boolean;
}
type ButtonAppearances = Record<ButtonCommand, ButtonAppearance>;
interface ButtonAppearancePropInputs {
    coarseTimelineInfo: CoarseTimelineInfo;
    viewerLink: ViewerLinkPageWithAuto;
}
declare class ButtonAppearanceProp extends TwistyPropDerived<ButtonAppearancePropInputs, ButtonAppearances> {
    derive(inputs: ButtonAppearancePropInputs): ButtonAppearances;
}

declare class TwistyPlayerController {
    private model;
    animationController: TwistyAnimationController;
    constructor(model: TwistyPlayerModel, delegate: TwistyAnimationControllerDelegate);
    jumpToStart(options?: {
        flash: boolean;
    }): void;
    jumpToEnd(options?: {
        flash: boolean;
    }): void;
    togglePlay(play?: boolean): void;
    visitTwizzleLink(): Promise<void>;
}

declare const colorSchemes: {
    light: boolean;
    dark: boolean;
};
type ColorScheme = keyof typeof colorSchemes;
type ColorSchemeWithAuto = ColorScheme | "auto";
declare class ColorSchemeRequstProp extends SimpleTwistyPropSource<ColorSchemeWithAuto> {
    getDefaultValue(): ColorSchemeWithAuto;
}

declare const buttonCommands: {
    fullscreen: boolean;
    "jump-to-start": boolean;
    "play-step-backwards": boolean;
    "play-pause": boolean;
    "play-step": boolean;
    "jump-to-end": boolean;
    "twizzle-link": boolean;
};
type ButtonCommand = keyof typeof buttonCommands;
declare class TwistyButtons extends ManagedCustomElement {
    #private;
    model?: TwistyPlayerModel | undefined;
    controller?: TwistyPlayerController | undefined;
    private defaultFullscreenElement?;
    buttons: Record<ButtonCommand, TwistyButton> | null;
    constructor(model?: TwistyPlayerModel | undefined, controller?: TwistyPlayerController | undefined, defaultFullscreenElement?: HTMLElement | undefined);
    connectedCallback(): void;
    onFullscreenButton(): Promise<void>;
    update(buttonAppearances: ButtonAppearances): Promise<void>;
    updateColorScheme(colorScheme: ColorScheme): void;
}
declare class TwistyButton extends ManagedCustomElement {
    #private;
    htmlButton: HTMLButtonElement;
    updateColorScheme(colorScheme: ColorScheme): void;
    connectedCallback(): void;
    setIcon(iconName: ButtonIcon): void;
}

interface CoarseTimelineInfoInputs {
    playingInfo: PlayingInfo;
    detailedTimelineInfo: DetailedTimelineInfo;
}
interface CoarseTimelineInfo {
    playing: boolean;
    atStart: boolean;
    atEnd: boolean;
}
declare class CoarseTimelineInfoProp extends TwistyPropDerived<CoarseTimelineInfoInputs, CoarseTimelineInfo> {
    protected derive(inputs: CoarseTimelineInfoInputs): CoarseTimelineInfo;
    protected canReuseValue(v1: CoarseTimelineInfo, v2: CoarseTimelineInfo): boolean;
}

declare class TempoScaleProp extends TwistyPropSource<number, number> {
    getDefaultValue(): number;
    derive(v: number): number;
}

declare const backViewLayouts: {
    none: boolean;
    "side-by-side": boolean;
    "top-right": boolean;
};
type BackViewLayout = keyof typeof backViewLayouts;
type BackViewLayoutWithAuto = BackViewLayout | "auto";
declare class BackViewProp extends SimpleTwistyPropSource<BackViewLayoutWithAuto> {
    getDefaultValue(): BackViewLayoutWithAuto;
}

declare const controlsLocations: {
    "bottom-row": boolean;
    none: boolean;
};
type ControlsLocation = keyof typeof controlsLocations;
type ControlPanelThemeWithAuto = ControlsLocation | "auto";
declare class ControlPanelProp extends SimpleTwistyPropSource<ControlPanelThemeWithAuto> {
    getDefaultValue(): ControlPanelThemeWithAuto;
}

declare class TimeRangeProp extends TwistyPropDerived<{
    indexer: AlgIndexer;
}, TimeRange> {
    derive(inputs: {
        indexer: AlgIndexer;
    }): TimeRange;
}

type FaceletScale = "auto" | number;
declare class FaceletScaleProp extends SimpleTwistyPropSource<FaceletScale> {
    getDefaultValue(): FaceletScale;
}

type FoundationDisplay = "auto" | "opaque" | "none";
declare class FoundationDisplayProp extends SimpleTwistyPropSource<FoundationDisplay> {
    getDefaultValue(): FoundationDisplay;
}

declare const hintFaceletStyles: {
    floating: boolean;
    none: boolean;
};
type HintFaceletStyle = keyof typeof hintFaceletStyles;
type HintFaceletStyleWithAuto = HintFaceletStyle | "auto";
declare class HintFaceletProp extends SimpleTwistyPropSource<HintFaceletStyleWithAuto> {
    getDefaultValue(): HintFaceletStyleWithAuto;
}

type InitialHintFaceletsAnimation = "auto" | "always" | "none";
declare class InitialHintFaceletsAnimationProp extends SimpleTwistyPropSource<InitialHintFaceletsAnimation> {
    getDefaultValue(): InitialHintFaceletsAnimation;
}

type SpritePropInputs = {
    spriteURL: URL | null;
};
declare class SpriteProp extends TwistyPropDerived<SpritePropInputs, Texture | null> {
    derive(inputs: SpritePropInputs): Promise<Texture | null>;
}

type ExperimentalStickering = keyof typeof experimentalStickerings;
declare class StickeringRequestProp extends SimpleTwistyPropSource<ExperimentalStickering | null> {
    getDefaultValue(): ExperimentalStickering | null;
}

interface StickeringMaskPropInputs {
    stickeringMaskRequest: StickeringMask | null;
    stickeringRequest: ExperimentalStickering | null;
    puzzleLoader: PuzzleLoader;
}
declare class StickeringMaskProp extends TwistyPropDerived<StickeringMaskPropInputs, StickeringMask> {
    getDefaultValue(): StickeringMask;
    derive(inputs: StickeringMaskPropInputs): Promise<StickeringMask>;
}

declare class StickeringMaskRequestProp extends TwistyPropSource<StickeringMask | null, string | StickeringMask | null> {
    getDefaultValue(): StickeringMask | null;
    derive(input: string | StickeringMask | null): StickeringMask | null;
}

declare const dragInputModes: {
    auto: boolean;
    none: boolean;
};
type DragInputMode = keyof typeof dragInputModes;
declare class DragInputProp extends SimpleTwistyPropSource<DragInputMode> {
    getDefaultValue(): DragInputMode;
}

declare class MovePressCancelOptions extends SimpleTwistyPropSource<AppendCancelOptions> {
    getDefaultValue(): AppendCancelOptions;
}

declare const movePressInputNames: {
    auto: boolean;
    none: boolean;
    basic: boolean;
};
type MovePressInput = keyof typeof movePressInputNames;
declare class MovePressInputProp extends SimpleTwistyPropSource<MovePressInput> {
    getDefaultValue(): MovePressInput;
}

declare const backgroundThemes: {
    checkered: boolean;
    "checkered-transparent": boolean;
    none: boolean;
};
type BackgroundTheme = keyof typeof backgroundThemes;
type BackgroundThemeWithAuto = BackgroundTheme | "auto";
declare class BackgroundProp extends SimpleTwistyPropSource<BackgroundThemeWithAuto> {
    getDefaultValue(): BackgroundThemeWithAuto;
}

interface ColorSchemePropInputs {
    colorSchemeRequest: ColorSchemeWithAuto;
}
declare class ColorSchemeProp extends TwistyPropDerived<ColorSchemePropInputs, ColorScheme> {
    protected derive(inputs: ColorSchemePropInputs): ColorScheme;
}

declare class DOMElementReferenceProp extends SimpleTwistyPropSource<Element | null> {
    getDefaultValue(): Element | null;
}

type CoordinateDegrees = number;
interface OrbitCoordinates {
    latitude: CoordinateDegrees;
    longitude: CoordinateDegrees;
    distance: number;
}
type OrbitCoordinatesRequest = Partial<OrbitCoordinates> | "auto";
declare class OrbitCoordinatesRequestProp extends TwistyPropSource<OrbitCoordinatesRequest, Partial<OrbitCoordinates> | "auto"> {
    getDefaultValue(): OrbitCoordinatesRequest;
    protected canReuseValue(v1: OrbitCoordinates, v2: OrbitCoordinates): boolean;
    protected derive(newCoordinates: Partial<OrbitCoordinates> | "auto", oldValuePromise: Promise<OrbitCoordinatesRequest>): Promise<OrbitCoordinatesRequest>;
}

declare class LatitudeLimitProp extends SimpleTwistyPropSource<CoordinateDegrees> {
    getDefaultValue(): CoordinateDegrees;
}

interface OrbitCoordinatesPropInputs {
    orbitCoordinatesRequest: OrbitCoordinatesRequest;
    latitudeLimit: CoordinateDegrees;
    puzzleID: PuzzleID;
    strategy: VisualizationStrategy;
}
declare class OrbitCoordinatesProp extends TwistyPropDerived<OrbitCoordinatesPropInputs, OrbitCoordinates> {
    canReuseValue(v1: OrbitCoordinates, v2: OrbitCoordinates): boolean;
    derive(inputs: OrbitCoordinatesPropInputs): Promise<OrbitCoordinates>;
}

declare class TwistySceneModel {
    twistyPlayerModel: TwistyPlayerModel;
    background: BackgroundProp;
    colorSchemeRequest: ColorSchemeRequstProp;
    dragInput: DragInputProp;
    foundationDisplay: FoundationDisplayProp;
    foundationStickerSpriteURL: URLProp;
    fullscreenElement: DOMElementReferenceProp;
    hintFacelet: HintFaceletProp;
    hintStickerSpriteURL: URLProp;
    initialHintFaceletsAnimation: InitialHintFaceletsAnimationProp;
    latitudeLimit: LatitudeLimitProp;
    movePressInput: MovePressInputProp;
    movePressCancelOptions: MovePressCancelOptions;
    orbitCoordinatesRequest: OrbitCoordinatesRequestProp;
    stickeringMaskRequest: StickeringMaskRequestProp;
    stickeringRequest: StickeringRequestProp;
    faceletScale: FaceletScaleProp;
    colorScheme: ColorSchemeProp;
    foundationStickerSprite: SpriteProp;
    hintStickerSprite: SpriteProp;
    orbitCoordinates: OrbitCoordinatesProp;
    stickeringMask: StickeringMaskProp;
    constructor(twistyPlayerModel: TwistyPlayerModel);
}

type Without<T, K extends string[]> = Pick<T, Exclude<keyof T, K[number]>>;
declare class TwistyPlayerModel {
    userVisibleErrorTracker: UserVisibleErrorTracker;
    alg: AlgProp;
    backView: BackViewProp;
    controlPanel: ControlPanelProp;
    catchUpMove: CatchUpMoveProp;
    indexerConstructorRequest: IndexerConstructorRequestProp;
    playingInfo: PlayingInfoProp;
    puzzleDescriptionRequest: PGPuzzleDescriptionStringProp;
    puzzleIDRequest: PuzzleIDRequestProp;
    setupAnchor: SetupAnchorProp;
    setupAlg: AlgProp;
    setupTransformation: SetupTransformationProp;
    tempoScale: TempoScaleProp;
    timestampRequest: TimestampRequestProp;
    viewerLink: ViewerLinkProp;
    visualizationFormat: VisualizationFormatProp;
    title: ArbitraryStringProp;
    videoURL: URLProp;
    competitionID: ArbitraryStringProp;
    puzzleLoader: PuzzleLoaderProp;
    kpuzzle: KPuzzleProp;
    puzzleID: PuzzleIDProp;
    puzzleAlg: PuzzleAlgProp;
    puzzleSetupAlg: PuzzleAlgProp;
    visualizationStrategy: VisualizationStrategyProp;
    indexerConstructor: IndexerConstructorProp;
    setupAlgTransformation: AlgTransformationProp;
    indexer: IndexerProp;
    anchorTransformation: AnchorTransformationProp;
    timeRange: TimeRangeProp;
    detailedTimelineInfo: DetailedTimelineInfoProp;
    coarseTimelineInfo: CoarseTimelineInfoProp;
    currentMoveInfo: CurrentMoveInfoProp;
    buttonAppearance: ButtonAppearanceProp;
    currentLeavesSimplified: CurrentLeavesSimplifiedProp;
    currentState: CurrentStateProp;
    legacyPosition: LegacyPositionProp;
    twistySceneModel: TwistySceneModel;
    twizzleLink(): Promise<string>;
    experimentalAddAlgLeaf(algLeaf: AlgLeaf, options?: AppendOptions): void;
    experimentalAddMove(flexibleMove: Move | string, options?: Without<AppendOptions, [
        "puzzleLoader",
        "puzzleSpecificSimplifyOptions"
    ]>): void;
    experimentalRemoveFinalChild(): void;
}

interface TwistyAnimationControllerDelegate {
    flash(): void;
}
declare class TwistyAnimationController {
    #private;
    private delegate;
    private playing;
    private direction;
    private catchUpHelper;
    private model;
    private lastDatestamp;
    private lastTimestampPromise;
    private scheduler;
    constructor(model: TwistyPlayerModel, delegate: TwistyAnimationControllerDelegate);
    onPlayingProp(playingInfo: PlayingInfo): Promise<void>;
    onCatchUpMoveProp(catchUpMove: CatchUpMove): Promise<void>;
    jumpToStart(options?: {
        flash: boolean;
    }): void;
    jumpToEnd(options?: {
        flash: boolean;
    }): void;
    playPause(): void;
    play(options?: {
        direction?: SimpleDirection;
        untilBoundary?: BoundaryType;
        autoSkipToOtherEndIfStartingAtBoundary?: boolean;
        loop?: boolean;
    }): Promise<void>;
    pause(): void;
    animFrame(frameDatestamp: MillisecondTimestamp): Promise<void>;
}

/**
 * @author mrdoob / http://mrdoob.com/
 * ESM conversion by Lucas Garron, 2021-12-21
 */
declare class Stats {
    mode: number;
    dom: HTMLDivElement;
    constructor();
    addPanel(panel: StatsPanel): StatsPanel;
    showPanel(id: number): void;
    beginTime: number;
    prevTime: number;
    frames: number;
    fpsPanel: StatsPanel;
    msPanel: StatsPanel;
    memPanel: StatsPanel | null;
    REVISION: number;
    begin(): void;
    end(): number;
    update(): void;
}
declare class StatsPanel {
    private name;
    private fg;
    private bg;
    min: number;
    max: number;
    dom: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    constructor(name: string, fg: string, bg: string);
    update(value: number, maxValue: number): void;
}

interface Schedulable {
    scheduleRender(): void;
}

interface DragMovementInfo {
    attachedInfo: Record<any, any>;
    movementX: number;
    movementY: number;
    elapsedMs: number;
}
interface PressInfo {
    normalizedX: number;
    normalizedY: number;
    rightClick: boolean;
    keys: {
        altKey: boolean;
        ctrlOrMetaKey: boolean;
        shiftKey: boolean;
    };
}
declare class DragTracker extends EventTarget {
    #private;
    readonly target: HTMLElement;
    constructor(target: HTMLElement);
    start(): void;
    stop(): void;
    addTargetListener(eventType: string, listener: (e: MouseEvent) => any): void;
    private onPointerDown;
    private onPointerMove;
    private onPointerUp;
}

interface Twisty3DPuzzle extends Object3D {
    onPositionChange(position: PuzzlePosition): void;
    setStickeringMask(stickeringMask: StickeringMask): void;
}

declare class Twisty3DPuzzleWrapper extends EventTarget implements Schedulable {
    #private;
    private model;
    schedulable: Schedulable;
    private puzzleLoader;
    private visualizationStrategy;
    constructor(model: TwistyPlayerModel, schedulable: Schedulable, puzzleLoader: PuzzleLoader, visualizationStrategy: VisualizationStrategy);
    disconnect(): void;
    scheduleRender(): void;
    twisty3DPuzzle(): Promise<Twisty3DPuzzle>;
    raycastMove(raycasterPromise: Promise<Raycaster>, transformations: {
        invert: boolean;
        depth?: "secondSlice" | "rotation" | "none";
    }): Promise<void>;
}

declare class Twisty3DSceneWrapper extends ManagedCustomElement implements Schedulable {
    #private;
    model?: TwistyPlayerModel | undefined;
    disconnect(): void;
    constructor(model?: TwistyPlayerModel | undefined);
    connectedCallback(): Promise<void>;
    setBackView(backView: BackViewLayout): void;
    onBackView(backView: BackViewLayout): void;
    onPress(e: CustomEvent<{
        pressInfo: PressInfo;
        cameraPromise: Promise<PerspectiveCamera>;
    }>): Promise<void>;
    scene(): Promise<Scene>;
    addVantage(vantage: Twisty3DVantage): void;
    removeVantage(vantage: Twisty3DVantage): void;
    experimentalVantages(): Iterable<Twisty3DVantage>;
    scheduleRender(): void;
    setCurrentTwisty3DPuzzleWrapper(scene: Scene, twisty3DPuzzleWrapper: Twisty3DPuzzleWrapper): Promise<void>;
    /** @deprecated */
    experimentalTwisty3DPuzzleWrapper(): Promise<Twisty3DPuzzleWrapper>;
    onPuzzle(inputs: [
        puzzleLoader: PuzzleLoader,
        visualizationStrategy: VisualizationStrategy
    ]): Promise<void>;
}

declare class TwistyOrbitControls {
    private model;
    private mirror;
    private canvas;
    private dragTracker;
    /** @deprecated */
    experimentalInertia: boolean;
    private onMovementBound;
    experimentalHasBeenMoved: boolean;
    constructor(model: TwistyPlayerModel, mirror: boolean, canvas: HTMLCanvasElement, dragTracker: DragTracker);
    temperMovement(f: number): number;
    onMove(e: CustomEvent<DragMovementInfo>): void;
    onMovement(movementX: number, movementY: number): {
        temperedX: number;
        temperedY: number;
    };
    onUp(e: CustomEvent<DragMovementInfo>): void;
}

declare class Twisty3DVantage extends ManagedCustomElement {
    #private;
    private model?;
    private options?;
    scene: Twisty3DSceneWrapper | null;
    stats: Stats | null;
    private rendererIsShared;
    loadingElement: HTMLDivElement | null;
    constructor(model?: TwistyPlayerModel | undefined, scene?: Twisty3DSceneWrapper, options?: {
        backView?: boolean | undefined;
    } | undefined);
    connectedCallback(): Promise<void>;
    clearCanvas(): Promise<void>;
    renderer(): Promise<WebGLRenderer>;
    canvasInfo(): Promise<{
        canvas: HTMLCanvasElement;
        context: CanvasRenderingContext2D;
    }>;
    camera(): Promise<PerspectiveCamera>;
    orbitControls(): Promise<TwistyOrbitControls>;
    addListener<T>(prop: TwistyPropParent<T>, listener: (value: T) => void): void;
    disconnect(): void;
    experimentalNextRenderFinishedCallback(callback: () => void): void;
    render(): Promise<void>;
    scheduleRender(): void;
}

declare abstract class TwistyPlayerSettable extends ManagedCustomElement {
    experimentalModel: TwistyPlayerModel;
    set alg(newAlg: Alg | string);
    get alg(): never;
    set experimentalSetupAlg(newSetup: Alg | string);
    get experimentalSetupAlg(): never;
    set experimentalSetupAnchor(anchor: SetupToLocation);
    get experimentalSetupAnchor(): never;
    set puzzle(puzzleID: PuzzleID);
    get puzzle(): never;
    set experimentalPuzzleDescription(puzzleDescription: PuzzleDescriptionString);
    get experimentalPuzzleDescription(): never;
    set timestamp(timestamp: TimestampRequest);
    get timestamp(): never;
    set hintFacelets(hintFaceletStyle: HintFaceletStyleWithAuto);
    get hintFacelets(): never;
    set experimentalStickering(stickering: ExperimentalStickering);
    get experimentalStickering(): never;
    set experimentalStickeringMaskOrbits(stickeringMask: string | StickeringMask);
    get experimentalStickeringMaskOrbits(): never;
    set experimentalFaceletScale(faceletScale: FaceletScale);
    get experimentalFaceletScale(): never;
    set backView(backView: BackViewLayoutWithAuto);
    get backView(): never;
    set background(backgroundTheme: BackgroundThemeWithAuto);
    get background(): never;
    set colorScheme(colorScheme: ColorSchemeWithAuto);
    get colorScheme(): never;
    set controlPanel(newControlPanel: ControlPanelThemeWithAuto);
    get controlPanel(): never;
    set visualization(visualizationFormat: VisualizationFormatWithAuto);
    get visualization(): never;
    set experimentalTitle(title: string | null);
    get experimentalTitle(): never;
    set experimentalVideoURL(videoURL: string | null);
    get experimentalVideoURL(): never;
    set experimentalCompetitionID(competitionID: string | null);
    get experimentalCompetitionID(): never;
    set viewerLink(viewerLinkPage: ViewerLinkPageWithAuto);
    get viewerLink(): never;
    set experimentalMovePressInput(movePressInput: MovePressInput);
    get experimentalMovePressInput(): never;
    set experimentalMovePressCancelOptions(movePressCancelOptions: AppendCancelOptions);
    get experimentalMovePressCancelOptions(): never;
    set cameraLatitude(latitude: number);
    get cameraLatitude(): never;
    set cameraLongitude(longitude: number);
    get cameraLongitude(): never;
    set cameraDistance(distance: number);
    get cameraDistance(): never;
    set cameraLatitudeLimit(latitudeLimit: number);
    get cameraLatitudeLimit(): never;
    set indexer(indexer: IndexerStrategyName);
    get indexer(): never;
    set tempoScale(newTempoScale: number);
    get tempoScale(): never;
    set experimentalSprite(url: string | URL);
    get experimentalSprite(): never;
    set experimentalHintSprite(url: string | URL);
    get experimentalHintSprite(): never;
    set fullscreenElement(element: Element | null);
    get fullscreenElement(): never;
    set experimentalInitialHintFaceletsAnimation(anim: InitialHintFaceletsAnimation);
    get experimentalInitialHintFaceletsAnimation(): never;
    set experimentalDragInput(dragInputMode: DragInputMode);
    get experimentalDragInput(): never;
    experimentalGet: ExperimentalGetters;
}
declare class ExperimentalGetters {
    private model;
    constructor(model: TwistyPlayerModel);
    alg(): Promise<Alg>;
    setupAlg(): Promise<Alg>;
    puzzleID(): Promise<PuzzleID>;
    timestamp(): Promise<MillisecondTimestamp>;
}

/**
 * The config argument passed to {@link TwistyPlayer} when calling the
 * constructor. This interface type be useful for avoiding bugs when you would
 * like to create a {@link TwistyPlayer} using a dynamic config, or by combining
 * configs.
 *
 * ```js
 * import { TwistyPlayer, type TwistyPlayerConfig } from "cubing/twisty";
 *
 * const MY_DEFAULT_CONFIG: TwistyPlayerConfig = {
 *   puzzle: "megaminx",
 *   alg: "R U R'"
 * };
 * export function createTwistyPlayer(overrideConfig: TwistyPlayerConfig) {
 *   const options = { ...MY_DEFAULT_CONFIG, ...overrideConfig };
 *   return new TwistyPlayer(options);
 * }
 *
 * // Example: if the current page is https://alpha.twizzle.net/edit/?alg=M2+E2+S2
 * // then this gives us the "alg" param value "M2 E2 S2".
 * const myOverrideConfig: TwistyPlayerConfig = {};
 * const algParam = new URL(location.href).searchParams.get("alg");
 * if (algParam) {
 *   myOverrideConfig.alg = algParam;
 * }
 * createTwistyPlayer(myOverrideConfig);
 * ```
 *
 * @category TwistyPlayer
 */
interface TwistyPlayerConfig {
    alg?: Alg | string;
    experimentalSetupAlg?: Alg | string;
    experimentalSetupAnchor?: SetupToLocation;
    puzzle?: PuzzleID;
    experimentalPuzzleDescription?: PuzzleDescriptionString;
    visualization?: VisualizationFormatWithAuto;
    hintFacelets?: HintFaceletStyleWithAuto;
    experimentalStickering?: ExperimentalStickering;
    experimentalStickeringMaskOrbits?: StickeringMask | string;
    background?: BackgroundThemeWithAuto;
    colorScheme?: ColorSchemeWithAuto;
    controlPanel?: ControlPanelThemeWithAuto;
    backView?: BackViewLayoutWithAuto;
    experimentalInitialHintFaceletsAnimation?: InitialHintFaceletsAnimation;
    viewerLink?: ViewerLinkPageWithAuto;
    experimentalMovePressInput?: MovePressInput;
    experimentalDragInput?: DragInputMode;
    experimentalTitle?: string | null;
    experimentalVideoURL?: string;
    experimentalCompetitionID?: string;
    cameraLatitude?: number;
    cameraLongitude?: number;
    cameraDistance?: number;
    cameraLatitudeLimit?: number;
    tempoScale?: number;
    experimentalSprite?: string | null;
    experimentalHintSprite?: string | null;
    experimentalMovePressCancelOptions?: AppendCancelOptions;
}
/**
 * TwistyPlayer is the heart of `cubing.js`. It can be used to display a puzzle on a web page like this:
 *
 *     <script src="path/to/cubing/twisty" type="module"></script>
 *     <twisty-player alg="R U R'"></twisty-player>
 *
 * You can also construct it directly in JavaScript:
 *
 * ```js
 * import { TwistyPlayer } from "cubing/twisty";
 * const twistyPlayer = new TwistyPlayer({alg: "R U R'"});
 * // Once the page has loaded, you can do this:
 * document.body.appendChild(twistyPlayer);
 * ```
 *
 * See {@link https://js.cubing.net/cubing/} for more examples.
 *
 * @category TwistyPlayer
 */
declare class TwistyPlayer extends TwistyPlayerSettable implements TwistyAnimationControllerDelegate {
    #private;
    controller: TwistyPlayerController;
    buttons: TwistyButtons;
    experimentalCanvasClickCallback: (...args: any) => void;
    constructor(config?: TwistyPlayerConfig);
    connectedCallback(): Promise<void>;
    /** @deprecated */
    experimentalSetFlashLevel(newLevel: "auto" | "none"): void;
    flash(): void;
    experimentalCurrentVantages(): Promise<Iterable<Twisty3DVantage>>;
    experimentalCurrentCanvases(): Promise<HTMLCanvasElement[]>;
    /**
     * Get the first available puzzle `Object3D`. This can be inserted into
     * another `three.js` scene, essentially "adopting" it from the
     * `TwistyPlayer`'s scenes while still allowing the `TwistyPlayer` to animate
     * it. The function returns a `Promise` that returns if and when the
     * `Object3D` is available, and accepts a callback that is called whenever a
     * render is scheduled for the puzzle (essentially, if something about the
     * puzzle has changed, like its appearance or current animated state).
     *
     * Note:
     * - This may never resolve if the player never creates the relevant 3D object
     *   under the hood (e.g. if the config is set to 2D, or is not valid for
     *   rendering a puzzle)
     * - The architecture of `cubing.js` may change significantly, so it is not
     *   guaranteed that a `three.js` `Object3D` will be available from the main
     *   thread in the future.
     * - This function only returns the current `three.js` puzzle object (once one
     *   exists). If you change e.g. the `puzzle` config for the player, then the
     *   object will currently become stale. This may be replaced with more
     *   convenient behaviour in the future.
     *
     * @deprecated */
    experimentalCurrentThreeJSPuzzleObject(puzzleRenderScheduledCallback?: () => void): Promise<Object3D>;
    jumpToStart(options?: {
        flash: boolean;
    }): void;
    jumpToEnd(options?: {
        flash: boolean;
    }): void;
    play(): void;
    pause(): void;
    togglePlay(play?: boolean): void;
    experimentalAddMove(flexibleMove: Move | string, options?: AppendOptions): void;
    experimentalAddAlgLeaf(algLeaf: AlgLeaf, options?: AppendOptions): void;
    static get observedAttributes(): string[];
    experimentalRemoveFinalChild(): void;
    attributeChangedCallback(attributeName: string, _oldValue: string, newValue: string): void;
    experimentalScreenshot(options?: {
        width: number;
        height: number;
    }): Promise<string>;
    experimentalDownloadScreenshot(filename?: string): Promise<void>;
}
declare global {
    interface HTMLElementTagNameMap {
        "twisty-player": TwistyPlayer;
    }
}

declare class DataDown {
    earliestMoveIndex: number;
    twistyAlgViewer: TwistyAlgViewer;
    direction: IterationDirection;
}
declare class DataUp {
    moveCount: number;
    element: TwistyAlgWrapperElem | TwistyAlgLeafElem;
}
declare class TwistyAlgLeafElem extends ManagedCustomElement {
    algOrAlgNode: Alg | AlgNode;
    constructor(className: string, text: string, dataDown: DataDown, algOrAlgNode: Alg | AlgNode, offsetIntoMove: boolean, clickable: boolean);
    pathToIndex(_index: number): (TwistyAlgWrapperElem | TwistyAlgLeafElem)[];
    setCurrentMove(current: boolean): void;
}
declare class TwistyAlgWrapperElem extends HTMLElementShim {
    algOrAlgNode: Alg | AlgNode;
    private queue;
    constructor(className: string, algOrAlgNode: Alg | AlgNode);
    addString(str: string): void;
    addElem(dataUp: DataUp): number;
    flushQueue(direction?: IterationDirection): void;
    pathToIndex(_index: number): (TwistyAlgWrapperElem | TwistyAlgLeafElem)[];
}
declare class MoveHighlighter {
    moveCharIndexMap: Map<number, TwistyAlgLeafElem>;
    currentElem: TwistyAlgLeafElem | null;
    addMove(charIndex: number, elem: TwistyAlgLeafElem): void;
    set(move: Parsed<Move> | null): void;
}
/** @category Other Custom Elements */
declare class TwistyAlgViewer extends HTMLElementShim {
    #private;
    highlighter: MoveHighlighter;
    lastClickTimestamp: number | null;
    constructor(options?: {
        twistyPlayer?: TwistyPlayer;
    });
    protected connectedCallback(): void;
    private setAlg;
    get twistyPlayer(): TwistyPlayer | null;
    set twistyPlayer(twistyPlayer: TwistyPlayer | null);
    jumpToIndex(index: number, offsetIntoMove: boolean): Promise<void>;
    protected attributeChangedCallback(attributeName: string, _oldValue: string, newValue: string): Promise<void>;
    static get observedAttributes(): string[];
}
declare global {
    interface HTMLElementTagNameMap {
        "twisty-alg-viewer": TwistyAlgViewer;
    }
}

type AnimatedLeafAlgNodeInfo = {
    leaf: Parsed<AnimatedLeafAlgNode>;
    idx: number;
};
type OrderedLeafTokens = AnimatedLeafAlgNodeInfo[];

declare class TwistyAlgEditorValueProp extends SimpleTwistyPropSource<string> {
    getDefaultValue(): string;
}
interface AlgEditorAlgWithIssuesPropInput {
    value: string;
}
declare class AlgEditorAlgWithIssuesProp extends TwistyPropDerived<AlgEditorAlgWithIssuesPropInput, AlgWithIssues> {
    derive(input: AlgEditorAlgWithIssuesPropInput): AlgWithIssues;
}
interface SelectionInfoPropInput {
    selectionStart: number;
    selectionEnd: number;
}
interface SelectionInfo extends SelectionInfoPropInput {
    endChangedMostRecently: boolean;
}
declare class TwistyAlgEditorSelectionProp extends TwistyPropSource<SelectionInfo, SelectionInfoPropInput> {
    getDefaultValue(): {
        selectionStart: number;
        selectionEnd: number;
        endChangedMostRecently: boolean;
    };
    derive(input: SelectionInfoPropInput, oldValue: Promise<SelectionInfo>): Promise<SelectionInfo>;
}
interface TargetCharPropInputs {
    selectionInfo: SelectionInfo;
}
declare class TargetCharProp extends TwistyPropDerived<TargetCharPropInputs, number> {
    derive(inputs: TargetCharPropInputs): number;
}
interface LeafTokensPropInputs {
    algWithIssues: AlgWithIssues;
}
declare class LeafTokensProp extends TwistyPropDerived<LeafTokensPropInputs, OrderedLeafTokens> {
    derive(inputs: LeafTokensPropInputs): OrderedLeafTokens;
}
interface LeafToHighlightPropInputs {
    targetChar: number;
    leafTokens: OrderedLeafTokens;
}
type HighlightWhere = "before" | "start" | "inside" | "end" | "after";
interface HighlightInfo {
    leafInfo: AnimatedLeafAlgNodeInfo;
    where: HighlightWhere;
}
declare class LeafToHighlightProp extends TwistyPropDerived<LeafToHighlightPropInputs, HighlightInfo | null> {
    derive(inputs: LeafToHighlightPropInputs): HighlightInfo | null;
}
declare class TwistyAlgEditorModel {
    valueProp: TwistyAlgEditorValueProp;
    selectionProp: TwistyAlgEditorSelectionProp;
    targetCharProp: TargetCharProp;
    algEditorAlgWithIssues: AlgEditorAlgWithIssuesProp;
    leafTokensProp: LeafTokensProp;
    leafToHighlight: LeafToHighlightProp;
}

/**
 * Warning: the current implementation of <twisty-alg-editor> is *not good*,
 * but it is *good enough*. The important parts is that:
 *
 * - The editor can be used in apps without much effort.
 * - The editor handles alg validation and move highlighting *okay* when not
 *   connected to a `<twisty-player>`.
 * - The editor stays in sync if it's connected to a `<twisty-player>`.
 *
 * The current implementation still has some race conditions and edge cases. A
 * proper rewrite with a better model would be very welcome.
 */

type TwistyPlayerAlgProp = "alg" | "setupAlg";
/** @category Other Custom Elements */
declare class TwistyAlgEditor extends ManagedCustomElement {
    #private;
    model: TwistyAlgEditorModel;
    debugNeverRequestTimestamp: boolean;
    constructor(options?: {
        twistyPlayer?: TwistyPlayer;
        twistyPlayerProp?: TwistyPlayerAlgProp;
    });
    set algString(s: string);
    get algString(): string;
    set placeholder(placeholderText: string);
    onInput(): void;
    onSelectionChange(): Promise<void>;
    onBlur(): Promise<void>;
    setAlgIssueClassForPuzzle(issues: "none" | "warning" | "error"): void;
    highlightLeaf(leaf: Parsed<Move | Pause> | null): void;
    get twistyPlayer(): TwistyPlayer | null;
    set twistyPlayer(twistyPlayer: TwistyPlayer | null);
    protected attributeChangedCallback(attributeName: string, _oldValue: string, newValue: string): void;
    static get observedAttributes(): string[];
}
declare global {
    interface HTMLElementTagNameMap {
        "twisty-alg-editor": TwistyAlgEditor;
    }
}

declare class TwizzleLink extends ManagedCustomElement {
    #private;
    private options?;
    twistyPlayer: TwistyPlayer | null;
    a: HTMLAnchorElement | null;
    constructor(options?: {
        cdnForumTweaks?: boolean | undefined;
        colorScheme?: boolean | undefined;
    } | undefined);
    fallback(): void;
    connectedCallback(): Promise<void>;
    addHeading(text: string, getTextToCopy?: () => Promise<string | null>): HTMLElement;
}
declare global {
    interface HTMLElementTagNameMap {
        "twizzle-link": TwizzleLink;
    }
}

export { AlgIndexer as A, BackViewLayout as B, Duration as D, ExperimentalStickering as E, MillisecondTimestamp as M, NO_VALUE as N, PuzzleLoader as P, StickeringMask as S, Timestamp as T, VisualizationFormat as V, PuzzleID as a, TwistyPlayer as b, TwistyAlgViewer as c, TwistyAlgEditor as d, TwistyPlayerConfig as e, backViewLayouts as f, TwizzleLink as g };

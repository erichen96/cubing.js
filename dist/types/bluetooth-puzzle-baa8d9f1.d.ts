import { d as AlgLeaf } from './Alg-c6770822.js';
import { K as KState } from './KState-8f0d81ea.js';

interface StreamTransformer {
    transformAlgLeaf(algLeafEvent: AlgLeafEvent): void;
    transformOrientation(orientationEvent: OrientationEvent): void;
}

/******** BluetoothPuzzle ********/
/** @category Smart Puzzles */
interface AlgLeafEvent {
    latestAlgLeaf: AlgLeaf;
    timeStamp: number;
    debug?: Record<string, unknown>;
    state?: KState;
    quaternion?: any;
}
/** @category Smart Puzzles */
interface OrientationEvent {
    quaternion: {
        x: number;
        y: number;
        z: number;
        w: number;
    };
    timeStamp: number;
    debug?: Record<string, unknown>;
}
/** @category Smart Puzzles */
declare abstract class BluetoothPuzzle extends EventTarget {
    transformers: StreamTransformer[];
    protected listeners: Array<(e: AlgLeafEvent) => void>;
    protected orientationListeners: Array<(e: OrientationEvent) => void>;
    abstract name(): string | undefined;
    abstract disconnect(): void;
    getState(): Promise<KState>;
    addAlgLeafListener(listener: (e: AlgLeafEvent) => void): void;
    addOrientationListener(listener: (e: OrientationEvent) => void): void;
    experimentalAddBasicRotationTransformer(): void;
    protected dispatchAlgLeaf(algLeaf: AlgLeafEvent): void;
    protected dispatchOrientation(orientationEvent: OrientationEvent): void;
}

export { AlgLeafEvent as A, BluetoothPuzzle as B, OrientationEvent as O };

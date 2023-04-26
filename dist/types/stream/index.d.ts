import { A as AlgLeafEvent, O as OrientationEvent } from '../bluetooth-puzzle-baa8d9f1.js';
import '../Alg-c6770822.js';
import '../KState-8f0d81ea.js';

interface ProxyMoveEvent {
    event: "move";
    data: AlgLeafEvent;
}
interface ProxyOrientationEvent {
    event: "orientation";
    data: OrientationEvent;
}
interface ProxyResetEvent {
    event: "reset";
}
type ProxyEvent = ProxyMoveEvent | ProxyOrientationEvent | ProxyResetEvent;

declare class WebSocketProxySender {
    protected websocket: WebSocket;
    constructor(url: string);
    sendMoveEvent(e: AlgLeafEvent): void;
    sendOrientationEvent(e: OrientationEvent): void;
    sendResetEvent(): void;
    protected sendProxyEvent(proxyEvent: ProxyEvent): void;
    protected onopen(): void;
    protected onerror(error: Error): void;
    protected onmessage(_e: MessageEvent): void;
}
declare abstract class WebSocketProxyReceiver {
    protected websocket: WebSocket;
    constructor(url: string, socketOrigin?: string);
    protected onopen(): void;
    protected onerror(error: Error): void;
    protected onmessage(e: MessageEvent): void;
    abstract onProxyEvent(e: ProxyEvent): void;
}

declare class TwizzleStream extends EventTarget {
    socket: WebSocket;
    constructor(url: string);
    onMessage(msg: MessageEvent): void;
}
type StreamsField = {
    streamID: string;
    senders: {
        name: string;
        twizzleUserID: string;
        wcaID: string | null;
    }[];
}[];
declare class TwizzleStreamServer {
    streams(): Promise<StreamsField>;
    connect(streamID: string): TwizzleStream;
}

export { ProxyEvent as ExperimentalProxyEvent, ProxyMoveEvent as ExperimentalProxyMoveEvent, ProxyOrientationEvent as ExperimentalProxyOrientationEvent, ProxyResetEvent as ExperimentalProxyResetEvent, TwizzleStreamServer as ExperimentalTwizzleStreamServer, WebSocketProxyReceiver as ExperimentalWebSocketProxyReceiver, WebSocketProxySender as ExperimentalWebSocketProxySender };

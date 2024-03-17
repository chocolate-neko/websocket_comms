declare const websocket = "ws://localhost:8888";
declare const ws: WebSocket;
declare enum MessageType {
    USER_JOIN = 0,
    USER_LEAVE = 1,
    MESSAGE = 2
}
interface Message {
    message: string;
    uuid?: string;
    timestamp: number;
    type: MessageType;
}
declare const sendBtn: HTMLButtonElement;
//# sourceMappingURL=index.d.ts.map
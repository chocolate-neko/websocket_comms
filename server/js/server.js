"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importStar(require("ws"));
var MessageType;
(function (MessageType) {
    MessageType[MessageType["USER_JOIN"] = 0] = "USER_JOIN";
    MessageType[MessageType["USER_LEAVE"] = 1] = "USER_LEAVE";
    MessageType[MessageType["MESSAGE"] = 2] = "MESSAGE";
})(MessageType || (MessageType = {}));
const LISTENING_PORT = 8888;
const wss = new ws_1.WebSocketServer({
    port: LISTENING_PORT,
    clientTracking: true,
});
wss.on('connection', (client) => {
    let client_uuid = '';
    client_uuid = generate_uuid();
    console.log(`Client connected: ${client_uuid}`);
    send_message({
        message: `Hello ${client_uuid}!`,
        uuid: 'SERVER-MESSAGE',
        timestamp: Date.now(),
        type: MessageType.USER_JOIN,
    }, client);
    broadcast({
        message: `${client_uuid} joined the chat`,
        uuid: 'SERVER-MESSAGE',
        timestamp: Date.now(),
        type: MessageType.USER_JOIN,
    });
    client.on('message', (message) => {
        broadcast({
            message: `${message}`,
            uuid: client_uuid,
            timestamp: Date.now(),
            type: MessageType.MESSAGE,
        });
    });
    client.on('close', () => {
        console.log(`Client disconnected: ${client_uuid}`);
        broadcast({
            message: `${client_uuid} left the chat`,
            uuid: 'SERVER-MESSAGE',
            timestamp: Date.now(),
            type: MessageType.USER_LEAVE,
        });
    });
});
function generate_uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0, v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
function send_message(message, ws_client) {
    ws_client.send(JSON.stringify(message));
}
function broadcast(message) {
    wss.clients.forEach((client) => {
        if (client.readyState === ws_1.default.OPEN)
            send_message(message, client);
    });
}
console.log(`server listening on port ${LISTENING_PORT}`);
//# sourceMappingURL=server.js.map
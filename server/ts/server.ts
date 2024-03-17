import ws, { WebSocketServer } from 'ws';

enum MessageType {
    USER_JOIN,
    USER_LEAVE,
    MESSAGE,
}

interface Message {
    message: string;
    uuid?: string;
    timestamp: number;
    type: MessageType;
}

const LISTENING_PORT = 8888;

const wss = new WebSocketServer({
    port: LISTENING_PORT,
    clientTracking: true,
});

wss.on('connection', (client) => {
    let client_uuid = '';
    client_uuid = generate_uuid();

    console.log(`Client connected: ${client_uuid}`);
    send_message(
        {
            message: `Hello ${client_uuid}!`,
            uuid: 'SERVER-MESSAGE',
            timestamp: Date.now(),
            type: MessageType.USER_JOIN,
        },
        client
    );

    client.on('message', (message) => {
        broadcast({
            message: `${message}`,
            uuid: client_uuid,
            timestamp: Date.now(),
            type: MessageType.MESSAGE,
        });
    });
});

function generate_uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        function (c) {
            var r = (Math.random() * 16) | 0,
                v = c == 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        }
    );
}

function send_message(message: Message, ws_client: ws) {
    ws_client.send(JSON.stringify(message));
}

function broadcast(message: Message) {
    wss.clients.forEach((client) => {
        if (client.readyState === ws.OPEN) send_message(message, client);
    });
}

console.log(`server listening on port ${LISTENING_PORT}`);

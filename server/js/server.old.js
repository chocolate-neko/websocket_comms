import ws, { WebSocketServer } from 'ws';

const LISTENING_PORT = 8888;

const wss = new WebSocketServer({ port: LISTENING_PORT, clientTracking: true });

wss.on('connection', (client) => {
    let uuid = '';
    uuid = random_uuid();

    console.log(`Client connected: ${uuid}`);
    client.send(
        JSON.stringify({
            message: `Hello ${uuid}!`,
            uuid: uuid,
            timestamp: Date.now(),
            type: 'join-message',
        })
    );
    broadcast(
        JSON.stringify({
            message: `${uuid} joined the chat`,
            uuid: uuid,
            timestamp: Date.now(),
            type: 'join-message',
        })
    );

    client.on('message', (message) => {
        console.log(`Message: ${message}`);

        broadcast(
            JSON.stringify({
                message: message,
                uuid: uuid,
                timestamp: Date.now(),
                type: 'message',
            })
        );
    });

    client.on('close', () => {
        console.log(`Client disconnected: ${uuid}`);
        broadcast({
            message: `${uuid} left the chat`,
            uuid: uuid,
            timestamp: Date.now(),
            type: 'join-message',
        });
    });
});

/**
 *
 * @param {{
 *    message: string
 *    uuid: string
 *    timestamp: number
 *    type: string
 * }} message
 */
function broadcast(message) {
    wss.clients.forEach((client) => {
        if (client.readyState === ws.OPEN) client.send(message);
    });
}

function random_uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        function (c) {
            var r = (Math.random() * 16) | 0,
                v = c == 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        }
    );
}

console.log(`server listening on port ${LISTENING_PORT}`);

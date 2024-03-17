const websocket = 'ws://localhost:8888';
const ws = new WebSocket(websocket);

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

ws.addEventListener('open', () => {
    console.log('Connected');
});

ws.addEventListener('message', (message) => {
    if (message.data instanceof Blob) {
        console.log('Data is blob');
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            const output = document.getElementById('output') as HTMLDivElement;

            if (output) {
                output.innerHTML += `<p>${reader.result}</p>`;
            }
        });

        let blobData = new Blob([message.data], { type: 'application/json' });
        blobData.text().then((text) => {
            console.log(JSON.parse(text));
            reader.readAsText(JSON.parse(text).message);
        });
    } else {
        let blobData = new Blob([message.data], { type: 'application/json' });
        blobData.text().then((text) => {
            console.log(JSON.parse(text));
            const output = document.getElementById('output') as HTMLDivElement;

            if (output) {
                output.innerHTML += `<p>${
                    (JSON.parse(text) as Message).message
                }</p>`;
            }
        });
    }
});

const sendBtn = document.getElementById('send') as HTMLButtonElement;

if (sendBtn) {
    sendBtn.addEventListener('click', () => {
        const input = document.getElementById('message') as HTMLInputElement;

        if (input) {
            // send random data
            ws.send(
                JSON.stringify({
                    message: input.value,
                    timestamp: Date.now(),
                    type: MessageType.MESSAGE,
                })
            );
            // ws.send(input.value);
        }
    });
}

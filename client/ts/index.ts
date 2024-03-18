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

const message_template = (message: string, uuid: string, timestamp: number) => {
    return `
<div class="message">
    <span class="message-uuid">${uuid}</span>
    <span class="message-timestamp">@${new Date(
        timestamp
    ).toLocaleString()}</span>
    <span class="message-message">${message}</span>
</div>
`;
};

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
                let message = JSON.parse(text) as Message;
                output.innerHTML += message_template(
                    message.message,
                    message.uuid ? message.uuid : 'unknown',
                    message.timestamp
                );
            }
        });
    }
});

const textInput = document.getElementById('message') as HTMLInputElement;

if (textInput) {
    textInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            sendBtn.click();
        }
    });
}

const sendBtn = document.getElementById('send') as HTMLButtonElement;

if (sendBtn) {
    sendBtn.addEventListener('click', () => {
        ws.send(textInput.value);
        textInput.value = '';
    });
}

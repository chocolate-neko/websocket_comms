"use strict";
const websocket = 'ws://localhost:8888';
const ws = new WebSocket(websocket);
var MessageType;
(function (MessageType) {
    MessageType[MessageType["USER_JOIN"] = 0] = "USER_JOIN";
    MessageType[MessageType["USER_LEAVE"] = 1] = "USER_LEAVE";
    MessageType[MessageType["MESSAGE"] = 2] = "MESSAGE";
})(MessageType || (MessageType = {}));
ws.addEventListener('open', () => {
    console.log('Connected');
});
ws.addEventListener('message', (message) => {
    if (message.data instanceof Blob) {
        console.log('Data is blob');
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            const output = document.getElementById('output');
            if (output) {
                output.innerHTML += `<p>${reader.result}</p>`;
            }
        });
        let blobData = new Blob([message.data], { type: 'application/json' });
        blobData.text().then((text) => {
            console.log(JSON.parse(text));
            reader.readAsText(JSON.parse(text).message);
        });
    }
    else {
        let blobData = new Blob([message.data], { type: 'application/json' });
        blobData.text().then((text) => {
            console.log(JSON.parse(text));
            const output = document.getElementById('output');
            if (output) {
                output.innerHTML += `<p>${JSON.parse(text).message}</p>`;
            }
        });
    }
});
const sendBtn = document.getElementById('send');
if (sendBtn) {
    sendBtn.addEventListener('click', () => {
        const input = document.getElementById('message');
        if (input) {
            // send random data
            ws.send(JSON.stringify({
                message: input.value,
                timestamp: Date.now(),
                type: MessageType.MESSAGE,
            }));
            // ws.send(input.value);
        }
    });
}
//# sourceMappingURL=index.js.map
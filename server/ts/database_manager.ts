import mongoose from 'mongoose';
import { MessageType, Message } from '../ts/interfaces';

const Schema = mongoose.Schema;
const MessageSchema = new Schema({
    message_id: Schema.ObjectId,
    message: String,
    uuid: String,
    timestamp: Number,
    type: String,
});

export class DatabaseManager {
    private _url: string;

    constructor(url: string) {
        this._url = url;
    }

    async connect(): Promise<void> {
        await mongoose.connect(this._url);
    }

    async disconnect(): Promise<void> {
        await mongoose.disconnect();
    }

    async saveMessage(message: Message) {
        const Message = mongoose.model('Message', MessageSchema);
        const newMessage = new Message({
            message_id: new mongoose.Types.ObjectId(),
            message: message.message,
            uuid: message.uuid,
            timestamp: message.timestamp,
            type: message.type,
        });
        await newMessage.save();
    }

    async getMessages() {
        const Message = mongoose.model('Message', MessageSchema);
        const messages = await Message.find();
        return messages;
    }
}

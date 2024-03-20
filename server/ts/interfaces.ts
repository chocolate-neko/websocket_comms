export enum MessageType {
    USER_JOIN,
    USER_LEAVE,
    MESSAGE,
}

export interface Message {
    message: string;
    uuid?: string;
    timestamp: number;
    type: MessageType;
}

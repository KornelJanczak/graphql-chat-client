import { User } from "./user";

export interface Chat {
  id: number;
  name: string;
  creator: number;
  members: User[];
  createdAt: string;
}

export interface Message {
  id: string;
  content: string;
  createdAt: string;
}

export interface MessageWithAuthor extends Message {
  author: User;
}

export interface TypingUser {
  chatId: number;
  typing: boolean;
  author: {
    id: number;
    email: string;
  };
}

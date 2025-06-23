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
  sender: string;
}

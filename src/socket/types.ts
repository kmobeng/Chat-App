export interface SendMessagePayload {
  content: string;
}

export interface SendReactionPayload {
  emoji: string;
}

export interface NewMessagePayload {
  from: string;
  content: string;
  timestamp: string;
}

export interface NewReactionPayload {
  from: string;
  emoji: string;
}

export interface UserJoinedPayload {
  username: string;
  activeUsers: string[];
}

export interface UserLeftPayload {
  username: string;
  activeUsers: string[];
}

export interface RoomHistoryMessage {
  id: string;
  username: string;
  content: string;
  createdAt: string;
}

export interface RoomHistoryPayload {
  messages: RoomHistoryMessage[];
}

export interface ErrorPayload {
  message: string;
}

export interface ClientToServerEvents {
  send_message: (payload: SendMessagePayload) => void;
  send_reaction: (payload: SendReactionPayload) => void;
}

export interface ServerToClientEvents {
  new_message: (payload: NewMessagePayload) => void;
  new_reaction: (payload: NewReactionPayload) => void;
  user_joined: (payload: UserJoinedPayload) => void;
  user_left: (payload: UserLeftPayload) => void;
  room_history: (payload: RoomHistoryPayload) => void;
  error: (payload: ErrorPayload) => void;
}

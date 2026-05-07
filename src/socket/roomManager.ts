type RoomId = string;
type SocketId = string;
type Username = string;

const rooms = new Map<RoomId, Map<SocketId, Username>>();

export const addUser = (
  roomId: RoomId,
  socketId: SocketId,
  username: Username,
) => {
  const room = rooms.get(roomId) ?? new Map<SocketId, Username>();
  room.set(socketId, username);
  rooms.set(roomId, room);
};

export const removeUser = (roomId: RoomId, socketId: SocketId) => {
  const room = rooms.get(roomId);
  if (!room) {
    return undefined;
  }

  const username = room.get(socketId);
  room.delete(socketId);

  if (room.size === 0) {
    rooms.delete(roomId);
  } else {
    rooms.set(roomId, room);
  }

  return username;
};

export const getActiveUsernames = (roomId: RoomId) => {
  const room = rooms.get(roomId);
  if (!room) {
    return [] as string[];
  }

  return Array.from(room.values());
};

export const cleanupRoom = (roomId: RoomId) => {
  const room = rooms.get(roomId);
  if (room && room.size === 0) {
    rooms.delete(roomId);
  }
};

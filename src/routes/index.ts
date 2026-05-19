import { Router } from "express";
import {
  createRoom,
  getRoomById,
  getRooms,
} from "../controllers/room.controller";
import { getMessagesByRoom } from "../controllers/message.controller";

const router = Router();

router.post("/rooms", createRoom);
router.get("/rooms", getRooms);
router.get("/rooms/:id", getRoomById);
router.get("/rooms/:id/messages", getMessagesByRoom);

export default router;

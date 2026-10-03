import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../constants/constants.js";
import User from "../models/user.model.js";
import logger from "../utils/logger.js";

let io = null;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: [
        "http://localhost:3000",
        "http://localhost:3001",
        process.env.CLIENT_URL,
        process.env.ADMIN_URL,
      ].filter(Boolean),
      methods: ["GET", "POST", "PATCH"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  // Authentication Middleware for Socket Connections
  io.use(async (socket, next) => {
    try {
      const rawToken =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization;

      if (!rawToken) {
        return next(new Error("Authentication token required"));
      }

      const token = rawToken.startsWith("Bearer ")
        ? rawToken.slice(7).trim()
        : rawToken.trim();

      const decoded = jwt.verify(token, jwtSecret);
      const user = await User.findById(decoded.id)
        .select("-password -refreshToken -resetToken")
        .populate("role", "name");

      if (!user || !user.isActive) {
        return next(new Error("User account invalid or deactivated"));
      }

      socket.user = user;
      return next();
    } catch (err) {
      logger.warn(`Socket authentication failed: ${err.message}`);
      return next(new Error("Unauthorized socket connection"));
    }
  });

  io.on("connection", (socket) => {
    const user = socket.user;
    const roleName = user?.role?.name;

    logger.info(
      `Socket connected: ${socket.id} (User: ${user?.name}, Role: ${roleName})`
    );

    // If user is super-admin, auto-join admin notification room
    if (roleName === "super-admin") {
      socket.join("admin-notifications");
      logger.info(`Socket ${socket.id} joined "admin-notifications" room`);
    }

    // Join personal user room for direct notifications
    if (user?._id) {
      socket.join(`user:${user._id.toString()}`);
    }

    socket.on("disconnect", (reason) => {
      logger.info(`Socket disconnected: ${socket.id}, reason: ${reason}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    logger.warn("Socket.io has not been initialized yet");
  }
  return io;
};

export const emitToAdmins = (event, payload) => {
  if (!io) {
    logger.warn(`Cannot emit "${event}": Socket.io is not initialized`);
    return;
  }
  io.to("admin-notifications").emit(event, payload);
};

export const emitToUser = (userId, event, payload) => {
  if (!io || !userId) {
    logger.warn(`Cannot emit "${event}" to user: Socket.io not initialized or missing userId`);
    return;
  }
  io.to(`user:${userId.toString()}`).emit(event, payload);
};

export default {
  initSocket,
  getIO,
  emitToAdmins,
  emitToUser,
};

import http from "http";
import app from "./src/app.js";
import logger from "./src/utils/logger.js";
import dbConnect from "./src/config/dbConnect.js";
import redis from "./src/config/redisConfig.js";
import { initSocket } from "./src/socket/index.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await dbConnect();
    await redis.ping();

    const server = http.createServer(app);
    initSocket(server);

    server.listen(PORT, () => {
      logger.info(`Server is running with Socket.io on port: ${PORT}`);
    });
  } catch (error) {
    logger.error("Error starting the server:", error);
  }
};

startServer();

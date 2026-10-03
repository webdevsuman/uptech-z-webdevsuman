import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import apiRouter from "./routes/index.js";
import transporter from "./config/mailConfig.js";

const app = express();

//For Nginx, Docker etc rate limitings
app.set("trust proxy", 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        "script-src": ["'self'", "http://localhost:5173"],
        "style-src": null,
      },
    },
  }),
);

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://uptech-z-webdevsuman.vercel.app",
  "https://uptech-z-webdevsuman-admin.vercel.app",
  process.env.CLIENT_URL,
  process.env.ADMIN_URL,
  process.env.FRONTEND_BASE_URL,
].filter(Boolean);

const isOriginAllowed = (origin) => {
  if (!origin) return true;
  const normalizedOrigin = origin.replace(/\/$/, "");
  if (
    allowedOrigins.some(
      (allowed) => allowed.replace(/\/$/, "") === normalizedOrigin
    )
  ) {
    return true;
  }
  // Allow all Vercel production and preview deployments for uptech-z
  if (
    /^https:\/\/uptech-z-webdevsuman.*\.vercel\.app$/.test(normalizedOrigin) ||
    /^https:\/\/.*-webdevsuman.*\.vercel\.app$/.test(normalizedOrigin)
  ) {
    return true;
  }
  return false;
};

const corsOptions = {
  origin: function (origin, callback) {
    if (isOriginAllowed(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "x-access-token",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use("/api", apiRouter);

export default app;

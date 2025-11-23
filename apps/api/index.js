import express from "express";
import cookieParser from "cookie-parser";
import csrf from "csurf";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import config from "./config/index.js";
import errorHandler from "./error/errorMiddleware.js";

// ----- IMPORTING ROUTES -----

import mobileRouter from "./routes/mobile/index.js";

import { authRouter } from "./routes/auth/index.js";
import { applicationRouter } from "./routes/application/index.js";
import { profileRouter } from "./routes/profile/index.js";
import { adminRouter } from "./routes/admin.js";
import { fileRouter } from "./routes/file/index.js";
import { projectRouter } from "./routes/project/index.js";

// ----- DECLARE CONSTANTS -----

const PORT = config.next.port;
const HOST = config.next.host;
const ORIGIN = config.next.origin;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ----- DECLARING VARIABLES ROUTES -----

const app = express();
const csrfProtection = csrf({ cookie: true });

// ----- REGISTER THIRD PARTY MIDDLEWARES -----

app.use(cookieParser());
app.use(
  cors({
    origin: ORIGIN === "*" ? true : ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));

// ----- REGISTER LOGGER <<DEV ONLY>> -----

app.use((req, res, next) => {
  // 1. Store the original send function
  const originalSend = res.send;

  // 2. Initialize a variable to store the response body
  let responseBody;

  // 3. Override res.send to capture the body
  res.send = function (body) {
    responseBody = body; // Capture the body here
    return originalSend.apply(this, arguments); // Pass control back to original function
  };

  // 4. Listen for the request to finish
  res.on("finish", () => {
    // --- GATHER DATA ---
    const method = req.method;
    const url = req.originalUrl;
    const statusCode = res.statusCode;

    // --- LOGGING ---
    console.log(`\n--- [${method}] ${url} ---`);
    console.log(`Status Code: ${statusCode}`);

    // Log Request Body (if exists and not empty)
    if (req.body && Object.keys(req.body).length > 0) {
      console.log("Request Body:", JSON.stringify(req.body, null, 2));
    }

    // Log Response/Result
    // Try to parse JSON strings for cleaner logging, otherwise log as is
    try {
      const parsedResponse =
        typeof responseBody === "string"
          ? JSON.parse(responseBody)
          : responseBody;
      console.log("Response Body:", JSON.stringify(parsedResponse, null, 2));
    } catch (e) {
      console.log("Response Body:", responseBody);
    }

    console.log("--------------------------\n");
  });

  next();
});

// ----- REGISTER ROUTES -----

// Namespace mobile routes
app.use("/mobile", mobileRouter);

// Routes Auth
app.use("/auth", authRouter);

// Routes Project
app.use("/application", applicationRouter);

// Routes Admin
app.use("/admin", adminRouter);

// Routes Outsider
app.use("/profile", profileRouter);

// Routes File
app.use("/file", fileRouter);

// Routes Project
app.use("/project", projectRouter);

// Routes base
app.get("/", (req, res) => {
  res.send("Hello Word!!!");
});

app.get("/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

const docsPath = path.join(__dirname, "docs");
if (fs.existsSync(docsPath)) {
  app.use("/docs", express.static(docsPath));
} else {
  console.warn(`[WARNING] Documentation directory not found at ${docsPath}.`);
  console.warn('Run "pnpm run docs:build" to generate the documentation.');
}

// ----- REGISTER CENTRALIZED ERROR HANDLER -----

app.use(errorHandler);

// ----- INIT NEXT JS -----

app.listen(PORT, HOST, () => {
  console.log(`Servidor corriendo en http://${HOST}:${PORT}`);
});

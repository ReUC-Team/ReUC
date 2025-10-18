import express from "express";
import cookieParser from "cookie-parser";
import csrf from "csurf";
import cors from "cors";
import config from "./config/index.js";
import errorHandler from "./middleware/errorHandler.js";

// ----- IMPORTING ROUTES -----

import mobileRouter from "./routes/mobile/index.js";

import { authRouter } from "./routes/auth/index.js";
import { applicationRouter } from "./routes/application/index.js";
import { profileRouter } from "./routes/profile/index.js";
import { adminRouter } from "./routes/admin.js";
import { fileRouter } from "./routes/file/index.js";

// ----- DECLARE CONSTANTS -----

const PORT = config.next.port;
const HOST = config.next.host;
const ORIGIN = config.next.origin;

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
  console.log(`[${req.method}] ${req.originalUrl}`);
  if (typeof req.body !== "undefined" && Object.keys(req.body).length) {
    console.log("Body:", req.body);
  }
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

// Routes base
app.get("/", (req, res) => {
  res.send("Hello Word!!!");
});

app.get("/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// ----- REGISTER CENTRALIZED ERROR HANDLER -----

app.use(errorHandler);

// ----- INIT NEXT JS -----

app.listen(PORT, HOST, () => {
  console.log(`Servidor corriendo en http://${HOST}:${PORT}`);
});

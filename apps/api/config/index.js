import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = [
  "JWT_TICKET_SECRET",
  "VIEWING_TICKET_EXPIRES",
  "DOWNLOAD_TICKET_EXPIRES",
  "MOBILE_API_KEY",
  "JWT_AUTH_SECRET",
  "AUTH_TOKEN_EXPIRES",
  "JWT_REFRESH_SECRET",
  "REFRESH_TOKEN_EXPIRES",
  "REFRESH_TOKEN_EXPIRES_INT",
];

// Validate that all required environment variables are set
for (const varName of requiredEnvVars) {
  if (!process.env[varName]) {
    console.error(
      `Environment variable ${varName} is not set. The application cannot start.`
    );
    process.exit(1);
  }
}

// Parse and export the configuration as a frozen (read-only) object
const config = Object.freeze({
  next: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || "0.0.0.0",
    origin: process.env.CORS_ORIGIN || "*",
  },
  mobileApiKey: process.env.MOBILE_API_KEY,
  jwt: {
    ticketSecret: process.env.JWT_TICKET_SECRET,
    ticketExpiresIn: {
      viewing: process.env.VIEWING_TICKET_EXPIRES,
      download: process.env.DOWNLOAD_TICKET_EXPIRES,
    },
    accessSecret: process.env.JWT_AUTH_SECRET,
    accessExpiresIn: process.env.AUTH_TOKEN_EXPIRES,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES,
    refreshExpiresInInt: parseInt(process.env.REFRESH_TOKEN_EXPIRES_INT),
  },
});

export default config;

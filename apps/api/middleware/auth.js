import session from "@reuc/application/auth/index.js";
import { ValidationError } from "@reuc/application/errors/ValidationError.js";

/**
 * @description Authenticates a user by validating a JWT Bearer token from the Authorization header.
 * It also validates the token against the request's IP and User-Agent for added security.
 * On success, it attaches the decoded token payload to `req.user`.
 *
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The Express next middleware function.
 *
 * @returns {void} Calls `next()` if authentication is successful.
 * @throws {401} If the token is missing, invalid, or expired.
 * @throws {403} If the token fails a specific validation rule (e.g., IP mismatch).
 * @property {object} req.user - The decoded JWT payload containing user information.
 */
export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: "Falta el token de autorización o esta mal formado.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedPayload = session.auth(
      token,
      req.ip,
      req.headers["user-agent"]
    );

    req.user = decodedPayload;

    next();
  } catch (err) {
    if (err instanceof ValidationError)
      return res.status(403).json({ success: false, error: err.message });

    return res
      .status(401)
      .json({ success: false, error: "Token inválido o expirado." });
  }
}

/**
 * @description Middleware to ensure a request originates from a client identifying as 'mobile'.
 *
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The Express next middleware function.
 *
 * @returns {void} Calls `next()` if the client type is 'mobile'.
 * @throws {403} If the 'x-client-type' header is not 'mobile'.
 */
export function requireMobileClient(req, res, next) {
  /**
   * TODO: Refactor this middleware to use a secure API Key instead of the current header check.
   * The current implementation checking `x-client-type` is insecure because this header
   * can be easily spoofed by any HTTP client, granting unauthorized access to mobile-only routes.
   *
   * Proposed Solution: Shared Secret API Key
   *
   * 1.  **Backend:**
   * - Generate a long, random, and secret string to act as the `MOBILE_API_KEY`.
   * - Store this key securely in the server's environment variables (e.g., in a .env file).
   * - Update this function to check for the key in a request header (e.g., `req.headers['x-api-key']`)
   * and validate it against the environment variable.
   *
   * 2.  **Mobile Client (React Native):**
   * - Store the same API key securely in the mobile app's environment configuration (e.g., using react-native-dotenv).
   * - Configure the mobile app's HTTP client (e.g., Axios) to automatically include this key
   * in a custom header (`X-API-Key`) for every request sent to the backend.
   */
  const clientType = req.headers["x-client-type"];
  if (clientType !== "mobile") {
    return res
      .status(403)
      .json({ error: "Acceso denegado: se requiere cliente móvil" });
  }
  next();
}

/**
 * @description Middleware that verifies the authenticated user has the 'outsider' role.
 * It assumes `authMiddleware` has already run and populated `req.user`.
 * It parses the role string (e.g., "outsider:uuid") and attaches the details to `req.outsider`.
 *
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The Express next middleware function.
 *
 * @returns {void} Calls `next()` if the user is an 'outsider'.
 * @throws {403} If the user does not have the 'outsider' role.
 * @property {object} req.outsider - An object with { role, uuid_outsider } for the validated user.
 */
export const requireOutsider = (req, res, next) => {
  if (!req.user || !req.user.role) {
    return res.status(403).json({
      success: false,
      error: "Acceso denegado. Rol del usuario no pudo ser encontrado.",
    });
  }

  const [role, uuid_outsider] = req.user.role.split(":") || [];

  if (role !== "outsider") {
    return res.status(403).json({
      success: false,
      err: "Sin acceso a estas funcionalidades",
    });
  }

  req.outsider = { role, uuid_outsider };

  next();
};

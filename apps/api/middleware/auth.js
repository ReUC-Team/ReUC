import crypto from "crypto";
import config from "../config/index.js";
import session from "@reuc/application/auth/index.js";
import * as ApplicationError from "@reuc/application/errors/index.js";

const MOBILE_API_KEY = config.mobileApiKey;
const TOKEN_CONFIG = config.jwt;

if (!MOBILE_API_KEY) {
  console.error("MOBILE_API_KEY environment variable is not set.");
  process.exit(1);
}

/**
 * @description Authenticates a user by validating a JWT Bearer token from the Authorization header.
 * On success, attaches the decoded payload to `req.user`.
 * On failure, throws an ApplicationError.AuthenticationError.
 */
export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      new ApplicationError.AuthenticationError(
        "Authorization header is missing or malformed."
      )
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedPayload = session.authenticate({
      token,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      tokenConfig: TOKEN_CONFIG,
    });

    req.user = decodedPayload;

    next();
  } catch (err) {
    next(err);
  }
}

/**
 * @description Secures mobile-only routes by validating a shared secret API key.
 * On failure, throws an ApplicationError.AuthenticationError.
 */
export function requireMobileClient(req, res, next) {
  const providedApiKey = req.headers["x-api-key"];

  if (!providedApiKey)
    return next(
      new ApplicationError.AuthenticationError("Mobile API key is missing.")
    );

  const providedBuffer = Buffer.from(providedApiKey);
  const expectedBuffer = Buffer.from(MOBILE_API_KEY);

  if (
    providedBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    return next(
      new ApplicationError.AuthenticationError("Invalid mobile API key.")
    );
  }

  next();
}

/**
 * @description  Middleware factory to ensure the authenticated user has an allowed role.
 * It ensures the authenticated user has one of the specified roles and parses the role's associated UUID.
 * It parses the role string (e.g., "outsider:uuid") and attaches the details to `req.role`.
 * On failure, throws an ApplicationError.AuthorizationError.
 * This should be used AFTER authMiddleware.
 *
 * @param {Array<'admin' | 'student' | 'outsider' | 'professor'> | 'admin' | 'student' | 'outsider' | 'professor'} allowedRoles  - A single role or an array of roles to permit.
 */
export function requireRole(allowedRoles) {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  if (roles.length === 0) {
    throw new Error("requireRole() middleware must have at least one role.");
  }

  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return next(
        new ApplicationError.AuthorizationError(
          "User role could not be determined."
        )
      );
    }

    const [userRole, roleUuid] = req.user.role.split(":") || [];

    if (!userRole || !roles.includes(userRole)) {
      return next(
        new ApplicationError.AuthorizationError(
          "User does not have the required role for this action."
        )
      );
    }

    req.role = {
      name: userRole,
      uuid: roleUuid,
    };

    next();
  };
}

/**
 * @description Express middleware that authorizes access to a file using a one-time ticket.
 *
 * On success, attaches the decoded payload to `req.user`.
 * On failure, throws an ApplicationError.AuthenticationError.
 */
export function authFileTicketMiddleware(req, res, next) {
  try {
    const { model, purpose, uuidmodel } = req.params;

    // 1. Get the business rule from your shared module
    const rule = getFileRule(model, purpose);

    if (!rule || !rule.context) {
      throw new ApplicationError.ValidationError(
        `File purpose '${purpose}' is not available for the model '${model}'.`,
        {
          details: {
            rule: "invalid_model_purpose_combination",
            modelTarget: model,
            purpose,
          },
        }
      );
    }

    // 2. Use the rule's context as the expected audience
    const expectedAudience = rule.context;
    const ticket = req.query.ticket;

    if (!ticket) {
      throw new ApplicationError.AuthenticationError(
        "A valid file ticket is required."
      );
    }

    const fileIdentifier = `file/${model}/${purpose}/${uuidmodel}`;

    // 3. Validate the ticket
    const decodedPayload = session.authTicket({
      token: String(ticket),
      fileIdentifier,
      audience: expectedAudience,
      tokenConfig: TOKEN_CONFIG,
    });

    req.user = { uuid_user: decodedPayload.sub };
    return next();
  } catch (err) {
    return next(err);
  }
}

import config from "../../config/index.js";
import session from "@reuc/application/auth/index.js";

const REFRESH_TOKEN_MAX_AGE = config.jwt.refreshExpiresInInt;

/**
 * A factory that creates a registration handler for either web or mobile clients.
 */
export function registerHandler(isWeb = true) {
  return async (req, res) => {
    const { user, tokens } = await session.register({
      body: req.body,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      tokenConfig: config.jwt,
    });

    if (isWeb) {
      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: REFRESH_TOKEN_MAX_AGE,
      });

      return res.status(201).json({
        success: true,
        data: { user, accessToken: tokens.accessToken },
      });
    }

    return res.status(201).json({
      success: true,
      data: { user, tokens },
    });
    c;
  };
}

/**
 * A factory that creates a login handler for either web or mobile clients.
 */
export function loginHandler(isWeb = true) {
  return async (req, res) => {
    const { user, tokens } = await session.login({
      data: req.body,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      tokenConfig: config.jwt,
    });

    if (isWeb) {
      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: REFRESH_TOKEN_MAX_AGE,
      });

      return res.status(200).json({
        success: true,
        data: { user, accessToken: tokens.accessToken },
      });
    }

    return res.status(200).json({
      success: true,
      data: { user, tokens },
    });
  };
}

/**
 * Handles user logout by clearing the refresh token cookie.
 */
export function logoutHandler(req, res) {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });

  res.status(200).json({ success: true, message: "Logout successful." });
}

/**
 * Returns the authenticated user's session and role information.
 */
export function roleStatusHandler(req, res) {
  res.status(200).json({
    success: true,
    data: {
      user: req.user,
      role: req.role,
    },
  });
}

/**
 * A factory that creates a token refresh handler for either web or mobile clients.
 */
export function refreshHandler(isWeb = true) {
  return async (req, res) => {
    const refreshToken = isWeb
      ? req.cookies?.refreshToken
      : req.body?.refreshToken;

    const { accessToken } = await session.refresh({
      token: refreshToken,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      tokenConfig: config.jwt,
    });

    res.status(200).json({ success: true, data: { accessToken } });
  };
}

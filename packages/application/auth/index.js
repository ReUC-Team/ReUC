import { login } from "./login.js";
import { register } from "./register.js";
import { authenticate } from "./authenticate.js";
import { refresh } from "./refresh.js";
import { authenticateTicket } from "./authenticateTicket.js";

/**
 * The 'auth' entity in the application layer, grouping all authentication
 * and session management use cases.
 */
const auth = {
  login,
  register,
  authenticate,
  refresh,
  authTicket: authenticateTicket,
};

export default auth;

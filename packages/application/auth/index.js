import { login } from "./login.js";
import { register } from "./register.js";
import { authenticate } from "./authenticate.js";
import { refresh } from "./refresh.js";

/**
 * The 'auth' entity in the application layer, grouping all authentication
 * and session management use cases.
 */
const auth = {
  login,
  register,
  authenticate,
  refresh,
};

export default auth;

// This can come from an auth library like passport.js
import { Code, ConnectError, Interceptor } from "@connectrpc/connect";
import logger from "../utils/logger";
import "dotenv/config";

// Setup child logger
const cLog = logger.child({ context: "authenticator" });

/**
 * Simple authenticator interceptor to validate API key.
 *
 * For more info, check link below.
 * @link https://connectrpc.com/docs/node/interceptors#example
 */
export const authenticator: Interceptor = (next) => async (req) => {
  cLog.info("Authenticating new request");
  // Get auth header
  const authHeader = req.header.get("Authorization");
  // validate auth header
  if (!authHeader) {
    cLog.error("Invalid authorization header");
    throw new ConnectError(
      "Invalid authorization header",
      Code.Unauthenticated
    );
  }

  // extract values
  const [type, token] = authHeader.split(" ");
  // validate token type
  if (type !== "Bearer") {
    cLog.error("Invalid token type");
    throw new ConnectError("Invalid token type", Code.Unauthenticated);
  }

  // authenticate token
  if (token != process.env.TRANSAC_AI_IGS_API_KEY) {
    cLog.error("Invalid API key");
    throw new ConnectError("Invalid API key", Code.Unauthenticated);
  }

  cLog.info("Request authenticated");
  // call next interceptor
  return await next(req);
};

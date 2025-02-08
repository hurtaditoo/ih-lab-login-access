const Session = require("../models/session.model");
const createError = require("http-errors");

module.exports.checkSession = (req, res, next) => {
  // find session id from cookie. imagine cookie is "session=1234; other=5678"
  const sessionId = req.headers.cookie
    ?.split(";")
    ?.find((cookie) => cookie.includes("session_id="))
    ?.split("=")?.[1];

  if (!sessionId) {
    return next(createError(401, "missing session from cookie header"));
  }

  // 1. find session by ID
  // 2. populate user field
  // 3. update session last access
  // 5. save session
  // 6. leave user on req object
  // 7. leave session on req object
  // 8. continue to next middleware or controller
  // 9. handle errors with 401 code
  Session.findById(sessionId)
    .populate("user")
    .then((session) => {
      if (session) {
        if (session.user) {
          // update last access time to keep session alive
          session.lastAccess = new Date();

          // save session
          // session.save();

          // leave user and session on req object so next middlewares can access to it
          req.session = session;
          req.user = session.user;

          // continue to next middleware or controller
          next();
        } else {
          next(createError(401, "unauthorized. wrong user"));
        }
      } else {
        next(createError(401, "unauthorized. session not found"));
      }
    })
    .catch(next);

  // TODO: remove this line when done
};

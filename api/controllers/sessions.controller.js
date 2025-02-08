const Session = require("../models/session.model");
const User = require("../models/user.model");
const createError = require("http-errors");

module.exports.create = (req, res, next) => {
  const { email, password } = req.body;

  // 1. find user by email
  // 2. check password
  // 3. create session
  // 4. send session id in a cookie
  User.findOne({ email }) 
    .then((user) => {

      if (user) {
        user
          .checkPassword(password)
          .then((match) => {
            if (match) {
              Session.create({ user: user.id })
                .then((session) => {
                  res.setHeader(
                    "Set-Cookie",
                    `session_id=${session._id}; HttpOnly`
                  )
                  res.json(user);
                })
                .catch(next);
            } else {
              next(createError(401, "bad credentials (wrong password)"))
            }
          })
          .catch(next);

      } else {
        next(createError(401, "bad credentials (user not found)"))
      }

    })
    .catch(next);
};

module.exports.destroy = (req, res, next) => {
  // access current request session. remove and send 204 status
  const sessionId = req.cookies.session_id;

  if (!sessionId) {
    return next(createError(400, "Session not found"));
  } 

  Session.findByIdAndDelete(sessionId)
  .then(() => {
    res.clearCookie("session_id", {
      path: "/api/v1", 
    });
    res.sendStatus(204).send();
  })
  .catch(next);
  
};

const { verifySignup, authJWT } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.post(
    "/auth/signup",
    [
      // authJWT.isAdmin,  TODO: enable and disallow creating the admin user
      verifySignup.checkDuplicateUsernameOrEmail,
      verifySignup.checkRoles,
    ],
    controller.signUp
  );

  app.post("/auth/signin", controller.signIn);

  app.post(
    "/auth/roles",
    [
      authJWT.verifyToken,
      authJWT.userIsAdmin,
      authJWT.checkAndFilterExistingRoles,
    ],
    controller.createRoles
  );
};

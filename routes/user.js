const { authJWT } = require("../middleware");
const controller = require("../controllers/user");

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header({
      "Access-Control-Allow-Headers": "Origin, Content-Type, Accept",
      "Access-Control-Allow-Origin": req.header("Origin"),
      "Access-Control-Allow-Credentials": true,
    });
    next();
  });

  app.get(
    "/myRoles",
    [authJWT.verifyToken, authJWT.getUserRoles],
    controller.returnRoles
  );

  app.get(
    "/hasRole",
    [
      authJWT.verifyToken,
      authJWT.userIsAdmin, // TODO: include role CLIENT_APP
      authJWT.userHasRole,
    ],
    controller.confirmRole
  );
};

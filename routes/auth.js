const { verifySignup, authJWT } = require("../middleware");
const controller = require("../controllers/auth");

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header({
      "Access-Control-Allow-Headers": "Origin, Content-Type, Accept",
      "Access-Control-Allow-Origin": req.header("Origin"),
      "Access-Control-Allow-Credentials": true,
    });
    next();
  });

  app.post(
    "/auth/signup",
    [
      authJWT.verifyToken,
      authJWT.userIsAdmin, // admin users can only be created by existing admin, migrate the first
      verifySignup.checkDuplicateUsernameOrEmail,
      verifySignup.checkRoles,
    ],
    controller.signUp
  );

  app.options("/auth/signin", (req, res) => {
    res.header("Access-Control-Allow-Methods", "POST");
    res.status(200).send();
  });

  app.post("/auth/signin", controller.signIn);

  app.options("/auth/changepwd", (req, res) => {
    res.header("Access-Control-Allow-Methods", "POST");
    res.status(200).send();
  });

  app.post("/auth/changepwd", authJWT.verifyToken, controller.changePWD);

  app.post(
    "/auth/roles",
    [
      authJWT.verifyToken,
      authJWT.userIsAdmin,
      authJWT.checkAndFilterExistingRoles,
    ],
    controller.createRoles
  );

  app.post("/auth/signout", (req, res) => {
    res
      .clearCookie("jwt", {
        httpOnly: true,
        secure: process.env.SECURE_COOKIE === "true", // true requires https
        sameSite: process.env.SAME_SITE_COOKIE ?? "none", // none value requires secure to be true
      })
      .status(200)
      .send();
  });
};

const { authJWT } = require('../middleware');
const controller = require('../controllers/user.controller');

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );
    next();
  });

  app.get(
    '/myRoles',
    [
      authJWT.verifyToken,
      authJWT.getUserRoles,
    ],
    controller.returnRoles
  );

  app.post(
    '/hasRole',
    [
      authJWT.verifyToken,
      authJWT.userIsAdmin, // TODO: include role CLIENT_APP
      authJWT.userHasRole,
    ],
    controller.confirmRole
  );
};

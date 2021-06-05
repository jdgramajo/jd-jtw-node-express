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
    '/roles',
    [
      authJWT.verifyToken,
      authJWT.getUserRoles,
    ],
    controller.returnRoles
  );

  app.post(
    '/hasRoles',
    [
      authJWT.verifyToken,
      authJWT.userHasRole,
    ],
    controller.confirmRole
  );
};

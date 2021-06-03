const { verifySignup, authJWT } = require('../middleware');
const controller = require('../controllers/auth.controller');

module.exports = (app) => {

  app.use((req, res, next) => {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );
    next();
  });

  app.post(
    '/auth/signup',
    [
      // authJWT.isAdmin,
      verifySignup.checkDuplicateUsernameOrEmail,
      verifySignup.checkRoles,
    ],
    controller.signUp
  );

  app.post('/auth/signin', controller.signIn);

  app.post(
    '/auth/roles',
    [
      authJWT.verifyToken,
      authJWT.userIsAdmin,
      authJWT.roleDoesNotExist
    ],
    controller.createRole
  );

};

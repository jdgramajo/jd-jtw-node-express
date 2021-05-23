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

  app.get('/api/test/all', controller.allAccess);

  app.get(
    '/api/test/user',
    [authJWT.verifyToken],
    controller.userBoard
  );

  app.get(
    '/api/test/mod',
    [authJWT.verifyToken, authJWT.isModerator],
    controller.moderatorBoard
  );

  app.get(
    '/api/test/admin',
    [authJWT.verifyToken, authJWT.isAdmin],
    controller.adminBoard
  );
};

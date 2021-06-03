const jwt = require('jsonwebtoken');
const config = require('../config/auth.config.js');
const db = require('../models');
const User = db.User;
const Role = db.Role;

const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(401).send({
      message: 'Unauthorized'
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(403).send({
        message: 'Unauthorized'
      });
    }
    req.userId = decoded.id;
    next();
  });
};

const getUserRoles = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(userRoles => {
      const roles = [];
      userRoles.map(role => roles.push(role.name));
      req.roles = roles;
      next();
    });
  }).catch(err => {
    res.status(404).send();
  });
}

const userHasRole = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(userRoles => {
      const roles = [];
      userRoles.map(role => roles.push(role.name));
      req.hasRole = roles.includes(req.body.role);
      next();
    });
  }).catch(err => {
    res.status(404).send();
  });
}

const userIsAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(userRoles => {
      const roles = [];
      userRoles.map(role => roles.push(role.name));
      if (!roles.includes('JWTING_ADMIN')) res.status(403).send();
      next();
    });
  }).catch(err => {
    res.status(404).send();
  });
}

const roleDoesNotExist = async (req, res, next) => {
  const newRole = req.body.role;
  if (!newRole) {
    res.status(422).send()
    return;
  };

  const existingRolesObjects = await Role.findAll({ attributes: [ 'name' ] });
  const existingRolesArray = [];
  existingRolesObjects.map(roleObject => existingRolesArray.push(roleObject.name));

  if (existingRolesArray.includes(newRole)) {
    res.status(422).send({ message: `Role ${role} already exists`});
    return;
  }

  next();
};

const authJWT = {
  verifyToken,
  getUserRoles,
  userHasRole,
  userIsAdmin,
  roleDoesNotExist
};

module.exports = authJWT;

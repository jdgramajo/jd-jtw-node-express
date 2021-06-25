const jwt = require("jsonwebtoken");
const config = require("../config/auth.js");
const db = require("../models");
const User = db.User;
const Role = db.Role;

const verifyToken = (req, res, next) => {
  const token = req.cookies?.jwt;

  if (!token) {
    return res.status(401).send({
      message: "Error: Unauthorized",
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(403).send({
        message: "Error: Unauthorized",
      });
    }
    req.userId = decoded.id;
    next();
  });
};

const getUserRoles = (req, res, next) => {
  User.findByPk(req.userId)
    .then((user) => {
      user.getRoles().then((userRoles) => {
        const roles = [];
        userRoles.map((role) => roles.push(role.name));
        req.roles = roles;
        next();
      });
    })
    .catch((err) => {
      res.status(404).send();
    });
};

const userHasRole = (req, res, next) => {
  if (!req.body.username) {
    res.status(422).send({ message: "Error: must specify username." });
    return;
  }
  User.findAll({
    where: {
      username: req.body.username,
      deleted: false,
    },
    include: Role,
  })
    .then((user) => {
      if (!user?.length) {
        res.status(404).send({ message: "Error: User not found." });
        return;
      }
      if (!user[0]?.roles?.length) {
        res.status(404).send({ message: "Error: User has no roles." });
        return;
      }
      const roleNamesArray = [];
      user[0]?.roles?.map((role) => roleNamesArray.push(role.name));
      req.hasRole = roleNamesArray.includes(req.body.role);
      next();
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

const userIsAdmin = (req, res, next) => {
  User.findByPk(req.userId)
    .then((user) => {
      const roles = [];
      user.getRoles().then((userRoles) => {
        userRoles.map((role) => roles.push(role.name));
        if (!roles.includes("JWTING_ADMIN")) {
          res.status(403).send("Error: Unauthorized");
          return;
        }
        next();
      });
    })
    .catch((err) => {
      res.status(404).send();
    });
};

const checkAndFilterExistingRoles = async (req, res, next) => {
  const newRoles = req.body.roles;
  if (!newRoles?.length) {
    res.status(422).send({ message: "Error: must supply an array of roles." });
    return;
  }

  const existingRolesObjects = await Role.findAll({ attributes: ["name"] });
  const existingRolesArray = [];
  existingRolesObjects.map((roleObject) =>
    existingRolesArray.push(roleObject.name)
  );

  const nonRepeatedRoles = newRoles.filter(
    (role) => !existingRolesArray.includes(role)
  );

  if (!nonRepeatedRoles?.length) {
    res
      .status(422)
      .send({ message: "Error: all supplied roles already exist." });
    return;
  } else {
    req.body.roles = nonRepeatedRoles;
  }

  next();
};

const authJWT = {
  verifyToken,
  getUserRoles,
  userHasRole,
  userIsAdmin,
  checkAndFilterExistingRoles,
};

module.exports = authJWT;

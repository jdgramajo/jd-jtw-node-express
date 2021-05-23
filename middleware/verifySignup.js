const db = require("../models");
const ROLES = db.ROLES;
const User = db.User;

const checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  User.findOne({
    where: {
      username: req.body.username
    }
  }).then(user => {
    if (user) {
      res.status(422).send({
        message: "Error: Username taken"
      });
      return;
    }

    // Email
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(user => {
      if (user) {
        res.status(422).send({
          message: "Error: Email taken"
        });
        return;
      }

      next();
    });
  });
};

const checkRoles = (req, res, next) => {
  if (req.body.roles) {
    req.body.roles.map((role) => {
      if (!ROLES.includes(role)) {
        res.status(422).send({
          message: `Error: Role ${role} is not valid`
        });
        return;
      }
    })
  }
  
  next();
};

module.exports = {
  checkDuplicateUsernameOrEmail,
  checkRoles
};

const db = require("../models");
const Role = db.Role;
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

const containsAll = (parent, child) => child.every(e => parent.includes(e));

const checkRoles = async (req, res, next) => {
  const newRoles = req.body.roles;
  if (!newRoles) {
    res.status(422).send({ message: 'Must specify a role or roles for the user.' });
    return;
  }
  const dedupedRoles = [...new Set(newRoles)];

  const existingRolesObjects = await Role.findAll({ attributes: [ 'name' ] });
  const existingRolesArray = [];
  existingRolesObjects.map(roleObject => existingRolesArray.push(roleObject.name));

  if (!containsAll(existingRolesArray, dedupedRoles)) {
    res.status(422).send({ message: `Not all specified roles in ${JSON.stringify(dedupedRoles)} are valid.` });
    return;
  } else {
    next();
  }
};

module.exports = {
  checkDuplicateUsernameOrEmail,
  checkRoles
};

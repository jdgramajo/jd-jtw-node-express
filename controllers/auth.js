const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const db = require("../models");
const config = require("../config/auth");
const User = db.User;
const Role = db.Role;

const Op = db.Sequelize.Op;

const signUp = (req, res) => {
  // Safety first
  if (!req.body.password) {
    res.status(422).send({ message: "Error: must supply a password." });
    return;
  }
  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    isActive: true,
    deleted: false,
    password: bcrypt.hashSync(req.body.password, 8),
  })
    .then((user) => {
      if (req.body.roles && req.body.roles.length) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles,
            },
          },
        }).then((roles) => {
          user.setRoles(roles).then(() => {
            res.status(200).send({ message: "User registered successfully." });
          });
        });
      } else {
        res
          .status(422)
          .send({ message: "Valid roles must be specified for signup." });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

const signIn = (req, res) => {
  // Safety first
  if (!req.body.username || !req.body.password) {
    res
      .status(422)
      .send({ message: "Error: must supply both user and password." });
    return;
  }
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(401).send({ message: "Bad credentials." });
      }

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({ message: "Bad credentials." });
      }

      const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 60, // 1 minute
      });

      res.cookie("jwt", token, {
        httpOnly: true,
        secure: false, // true requires https
        maxAge: 60000,
        sameSite: "none", // "none" will require secure field to be true
      });

      res.status(200).send();
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

const createRoles = async (req, res) => {
  const roles = req.body.roles;
  const rolesBulk = roles.map((role) => {
    return { name: role };
  });
  await Role.bulkCreate(rolesBulk);
  res.status(200).send({ message: `${roles} roles created successfully.` });
};

module.exports = { signUp, signIn, createRoles };

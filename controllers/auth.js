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
        return;
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
      return;
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
        res.status(401).send({ message: "Bad credentials." });
        return;
      }

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        res.status(401).send({ message: "Bad credentials." });
        return;
      }

      const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 60, // 1 minute
      });

      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.SECURE_COOKIE === "true", // true requires https
        maxAge: 60000, // 1 minute
        sameSite: process.env.SAME_SITE_COOKIE ?? "none", // none value requires secure to be true
      });

      res.status(200).send();
      return;
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
      return;
    });
};

const changePWD = async (req, res) => {
  // Safety first
  if (!req.body.newPassword || !req.body.confirmPassword) {
    res.status(422).send({ message: "Error: missing data." });
    return;
  }

  // Check passwords match
  if (req.body.newPassword !== req.body.confirmPassword) {
    res.status(422).send({ message: "Error: passwords don't match." });
    return;
  }

  try {
    const user = await User.findByPk(req.userId);
    user.password = bcrypt.hashSync(req.body.newPassword, 8);
    await user.save();

    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 60, // 1 minute
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.SECURE_COOKIE === "true", // true requires https
      maxAge: 60000, // 1 minute
      sameSite: process.env.SAME_SITE_COOKIE ?? "none", // none value requires secure to be true
    });

    res
      .status(200)
      .send({ message: `Password updated for user ${user.username}.` });
    return;
  } catch (err) {
    res.status(500).send(`${err}`);
    return;
  }
};

const createRoles = async (req, res) => {
  const roles = req.body.roles;
  const rolesBulk = roles.map((role) => {
    return { name: role };
  });
  await Role.bulkCreate(rolesBulk);
  res.status(200).send({ message: `${roles} roles created successfully.` });
  return;
};

module.exports = { signUp, signIn, changePWD, createRoles };

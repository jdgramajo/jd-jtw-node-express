const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = require('../models');
const config = require('../config/auth.config');
const User = db.User;
const Role = db.Role;

const Op = db.Sequelize.Op;

const signUp = (req, res) => {
  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  }).then((user) => {
    console.log(`req.body.roles: ${req.body.roles}`);
    if (req.body.roles && req.body.roles.length) {
      Role.findAll({
        where: {
          name: {
            [Op.or]: req.body.roles
          }
        }
      }).then((roles) => {
        user.setRoles(roles).then(() => {
          res.send({ message: 'User registered successfully!' });
        });
      });
    } else {
      // user role = 0
      user.setRoles([0]).then(() => {
        res.send({ message: 'User registered successfully!' });
      });
    }
  }).catch((err) => {
    res.status(500).send({ message: err.message });
  });
};

const signIn = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  }).then(user => {
    if (!user) {
      return res.status(403).send({
        accessToken: null,
        message: 'Bad credentials.'
      });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: 'Bad credentials.'
      });
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 900 // 15 minutes
    });

    const authorities = [];
    user.getRoles().then(roles => {
      roles.map((role) => {
        authorities.push(`ROLE_${role.name.toUpperCase()}`);
      });
      res.status(200).send({
        id: user.id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token
      });
    });
  }).catch(err => {
    res.status(500).send({ message: err.message });
  });
};

module.exports = { signUp, signIn }

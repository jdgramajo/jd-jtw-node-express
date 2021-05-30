const Sequelize = require('sequelize');

const { schema, user, password, connection } = require('../config/db.config');
const sequelize = new Sequelize(schema, user, password, connection );

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user.model')(sequelize, Sequelize);
db.Role = require('./role.model')(sequelize, Sequelize);

db.Role.belongsToMany(db.User, {
  through: 'user_roles',
  foreignKey: 'roleId',
  otherKey: 'userId'
});
db.User.belongsToMany(db.Role, {
  through: 'user_roles',
  foreignKey: 'userId',
  otherKey: 'roleId'
});

db.ROLES = [ 'JWTING_ADMIN', 'JWTING_ADVANCED_USER', 'BEURZEN_ADMIN', 'BEURZEN_ADVANCED_USER', 'BEURZEN_BASIC_USER' ];

module.exports = db;

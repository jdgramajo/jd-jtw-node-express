module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('user', {
    username: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    isActive: {
      type: Sequelize.BOOLEAN
    },
    deleted: {
      type: Sequelize.BOOLEAN
    }
  });

  return User;
}

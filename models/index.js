const Sequelize = require("sequelize");

const { schema, user, password, connection } = require("../config/db");
const sequelize = new Sequelize(schema, user, password, connection);

// Ref: https://codewithhugo.com/using-es6-classes-for-sequelize-4-models/
const models = {
  User: require("./user")(sequelize, Sequelize),
  Role: require("./role")(sequelize, Sequelize),
};

// Run `.associate` if it exists,
// ie create relationships in the ORM
Object.values(models)
  .filter((model) => typeof model.associate === "function")
  .forEach((model) => model.associate(models));

const db = {
  ...models,
  sequelize,
  Sequelize,
};

module.exports = db;

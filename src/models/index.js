"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

// load model class files
const modelFiles = fs
  .readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  );

const modelClasses = {};
for (const file of modelFiles) {
  const modelClass = require(path.join(__dirname, file));
  // skip index.js itself
  modelClasses[file.replace(".js", "")] = modelClass;
}

// init all models
for (const key of Object.keys(modelClasses)) {
  const modelClass = modelClasses[key];
  // call static init to register model
  const modelInstance = modelClass.init(sequelize, Sequelize.DataTypes);
  db[modelInstance.name] = modelInstance;
}

// call associate on each model if exists
for (const modelName of Object.keys(db)) {
  if (typeof db[modelName].associate === "function") {
    db[modelName].associate(db);
  }
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

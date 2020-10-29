const dotenv = require("dotenv");

dotenv.config();

const config = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: "gebeya-e-commerce",
    host: "127.0.0.1",
    dialect: "mysql",
    operatorsAliases: false,
    logging: false,
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: "gebeya-e-commerce-test",
    host: "127.0.0.1",
    dialect: "mysql",
    operatorsAliases: false,
  },
  production: {
    username: process.env.DB_USERNAME_PRO,
    password: process.env.DB_PASSWORD_PRO,
    database: process.env.DB_NAME_PRO,
    host: process.env.DB_HOST_PRO,
    dialect: "mysql",
    operatorsAliases: false,
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true,
      },
    },
  },
};

module.exports = config;

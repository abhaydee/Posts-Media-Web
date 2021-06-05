require("dotenv").config();

module.exports = {
  MONGODB: process.env.mongodbUrl,
  secretKey: process.env.secretKeyToken,
};

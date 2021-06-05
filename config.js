const path = require("path");
require("dotenv").config({ path: ".env" });
module.exports = {
  MONGODB: process.env.mongodbUrl,
  secretKey: process.env.secretKeyToken,
};

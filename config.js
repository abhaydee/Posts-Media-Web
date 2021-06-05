const path = require("path");
require("dotenv").config({ path: require("./env") });
module.exports = {
  MONGODB: process?.env?.mongodbUrl,
  secretKey: process?.env?.secretKeyToken,
};

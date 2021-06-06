require("dotenv").config();
module.exports = {
  MONGODB: `mongodb+srv://${process?.env?.mongodbUsername}:${process?.env?.password}@test-cluster.qcll2.mongodb.net/merng?retryWrites=true&w=majority`,
  secretKey: process?.env?.secretToken,
};

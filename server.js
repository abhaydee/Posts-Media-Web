const express = require("express");
const { ApolloServer, gql, UserInputError } = require("apollo-server-express");
const mongoose = require("mongoose");
const { MONGODB, secretKey } = require("./config");
const postModel = require("./src/models/Posts");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userModal = require("./src/models/User");
require("dotenv").config;
const typeDefs = gql`
  type Post {
    id: ID!
    body: String!
    createdAt: String!
  }
  type Query {
    getPosts: [Post]
  }
  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
  }
  type Mutation {
    register(input: RegisterInput): User
  }
`;
let users = [];
const resolvers = {
  Query: {
    getPosts: async function () {
      try {
        const posts = await postModel.find();
        return posts;
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Mutation: {
    register: async function (
      parent,
      { input: { username, email, password, confirmPassword } },
      context,
      info
    ) {
      password = await bcrypt.hash(password, 12);
      const oldUser = userModal.findOne({ username });
      if (!oldUser) {
        const newUser = new userModal({
          email,
          password,
          confirmPassword,
          username,
          createdAt: new Date().toISOString(),
        });
        const res = await newUser.save();
        const token = await jwt.sign(
          {
            username: res.username,
            id: res.id,
            email: res.email,
          },
          secretKey,
          { expiresIn: "1h" }
        );
        return {
          ...res._doc,
          id: res._id,
          token,
        };
      } else {
        throw new UserInputError(
          "Username is already token, create a new user"
        );
      }
    },
  },
};
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});
const app = express();
apolloServer.applyMiddleware({ app });
app.get("/rest", (req, res) => {
  res.json({
    data: "API is working",
  });
});
mongoose
  .connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(process.env.PORT || "3000", () => {
      console.log(`server is running at PORT 3000 and database is connected`);
    });
  });

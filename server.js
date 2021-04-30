const express = require("express");
const {
  ApolloServer,
  gql,
  UserInputError,
  AuthenticationError,
} = require("apollo-server-express");
const mongoose = require("mongoose");
const { MONGODB, secretKey } = require("./config");
const postModel = require("./src/models/Posts");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userModal = require("./src/models/User");
const {
  registerValidation,
  loginValidation,
} = require("./src/utils/validation");
const Posts = require("./src/models/Posts");
const checkAuth = require("./src/utils/authcheck");
require("dotenv").config;
const generateToken = async (user) => {
  console.log("sending the user", user);
  return await jwt.sign(
    {
      username: user.username,
      id: user.id,
      email: user.email,
    },
    secretKey,
    { expiresIn: "1h" }
  );
};
const typeDefs = gql`
  type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
  }
  type Query {
    getPosts: [Post]
    getPost(postId: ID!): Post!
  }
  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
  input LoginInput {
    email: String!
    password: String!
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
    login(input: LoginInput): User
    createPost(body: String!): Post
    deletePost(postId: ID!): String!
  }
`;
let users = [];
const resolvers = {
  Query: {
    getPosts: async function () {
      try {
        const posts = await postModel.find().sort({ createdAt: -1 });
        console.log("the posts", posts);
        return posts;
      } catch (error) {
        throw new Error(error);
      }
    },
    getPost: async function (_, { postId }) {
      try {
        const post = await postModel.findById(postId);
        if (post) {
          console.log("the post", postId);
          return post;
        } else {
          return "Post not found";
        }
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
      const { errors, valid } = registerValidation(
        username,
        email,
        password,
        confirmPassword
      );
      console.log("the fourth console", email);
      if (!valid) {
        throw new UserInputError("errors", { errors: errors });
      }
      password = await bcrypt.hash(password, 12);
      const oldUser = await userModal.findOne({ username });
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
          "Username is already token, create a new user",
          {
            errors: {
              username: "this username has already been taken",
            },
          }
        );
      }
    },
    login: async function (
      parent,
      { input: { email, password } },
      context,
      info
    ) {
      console.log("args", email, password);
      const { errors, valid } = loginValidation(email, password);
      if (!valid) {
        throw new UserInputError("errors", { errors: errors });
      }
      const userdata = await userModal.findOne({ email });
      if (!userdata) {
        throw new UserInputError("user not found");
      }
      const match = bcrypt.compare(password, userModal.password);
      if (!match) {
        errors.general = "wrong credentials";
        throw new UserInputError("Wrong credentials", { errors: errors });
      }
      const token = generateToken(userdata);
      console.log("the token", token);
      return {
        ...userdata._doc,
        id: userdata._id,
        token,
      };
    },
    createPost: async function (parent, { body }, context) {
      console.log("the body", body);
      const authResult = checkAuth(context);
      const newPost = new Posts({
        body,
        user: authResult.id,
        username: authResult.username,
        createdAt: new Date().toISOString(),
      });
      const post = newPost.save();
      console.log("---the authresults---", authResult);
      console.log("---post---", post);
      return post;
    },
    deletePost: async function (parent, { postId }, context) {
      try {
        const authResult = checkAuth(context);
        const post = await Posts.findById(postId);
        console.log(
          "--authresult-username && post-username",
          authResult.username,
          post.username
        );
        if (authResult.username === post.username) {
          await post.delete();
          return "Post deleted successfully";
        } else {
          throw new AuthenticationError(
            "Your are not the owner of this post,hence cannot delete it"
          );
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
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

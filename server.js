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
    comments: [comments]!
    likes: [likes]!
  }
  type comments {
    id: ID!
    body: String!
    username: String!
    createdAt: String!
  }
  type likes {
    id: ID!
    username: String!
    createdAt: String!
  }
  type Query {
    getPosts: [Post!]
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
    createComment(postId: ID!, body: String): Post!
    deleteComment(postId: ID!, commentId: String): Post!
    likePost(postId: ID!): Post!
  }
`;
let users = [];
const resolvers = {
  Query: {
    getPosts: async function () {
      console.log("get all posts");
      try {
        const posts = await postModel.find().sort({ createdAt: -1 });
        return posts;
      } catch (error) {
        throw new Error(error);
      }
    },
    getPost: async function (_, { postId }) {
      console.log("getpost");
      try {
        const post = await postModel.findById(postId);
        if (post) {
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
      return {
        ...userdata._doc,
        id: userdata._id,
        token,
      };
    },
    createPost: async function (parent, { body }, context) {
      console.log("createpost", body);
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
    createComment: async function (parent, { postId, body }, context) {
      const { username } = checkAuth(context);
      if (body.trim === "") {
        return new UserInputError("Empty comment", {
          errors: {
            body: "comment body cannot be empty",
          },
        });
      }
      const post = await postModel.findById(postId);
      console.log("-----the post returning----", post);
      if (post) {
        post.comments.unshift({
          body,
          username,
          createdAt: new Date().toISOString(),
        });
        await post.save();
        return post;
      } else {
        throw new UserInputError("post does not exist", {
          errors: {
            body: "posts does not exist , Please create one and perform operations",
          },
        });
      }
    },
    deleteComment: async function (parent, { postId, commentId }, context) {
      const { username } = checkAuth(context);
      const post = await postModel.findById(postId);
      if (post) {
        const commentIndex = post.comments.findIndex(
          (item) => item.id === commentId
        );
        if ((post.comments[commentIndex].username = username)) {
          post.comments.splice(commentIndex, 1);
          await post.save();
          return post;
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } else {
        throw new UserInputError("post does not exist", {
          errors: {
            body: "Post does not exist,hence cannot delete the comments",
          },
        });
      }
    },
    // if the likes array has a username , then post is already liked.
    //if the likes array does not have an username , then post is not yet likes
    likePost: async function (parent, { postId }, context) {
      const { username } = checkAuth(context);
      const post = await postModel.findById(postId);
      if (post) {
        if (post.likes.find((like) => like.username === username)) {
          post.likes = post.likes.filter((like) => {
            return like.username !== username;
          });
        } else {
          post.likes.push({
            username,
            createdAt: new Date().toISOString(),
          });
        }
        await post.save();
        return post;
      } else {
        throw new UserInputError("Post not found", {
          errors: {
            body: "Post not found:- Please add new posts",
          },
        });
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
    app.listen(process.env.PORT || "8000", () => {
      console.log(`server is running at PORT 8000 and database is connected`);
    });
  })
  .catch((err) => {
    console.log("database could not be connected", err);
  });

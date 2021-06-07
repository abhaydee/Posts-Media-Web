# Social Media Web

## About the Project

Social-Media-Web:- This Repository contains the code for the Full Stack Social Media Web. It has a secured login and registration system setup from scratch. The users are stored in the database. You can perform some of the basic boilerplate functionality that we use daily use in Social Media.

You can check the project live here:- [https://social-media-web.netlify.app](https://social-media-web.netlify.app/)

## 1. Pre-requisites

    a)  Just have nodejs installed on your systems.  You can download and install it from here ([https://nodejs.org/en/](https://nodejs.org/en/)). Preferred Versions (Version 14 and above)

    b) Install a package manager (NPM or YARN)

## 2. Front-End:-

    Clone the project from this repository  ( [https://github.com/abhaydee/Posts-Media-Web](https://github.com/abhaydee/Posts-Media-Web))

      a) Check out the front-end to access the code
      b) Go ahead and run the npm install to  install all the dependencies required for the Front-End Web App
      c) Run npm start to run the client-side frontend code
      d) Currently, the apollo client is pointing to the live backend server which is hosted, you can switch it to your local server depending upon your needs.

## 3. Back-End:-

      a) Checkout to the master to access the backend code
      b) Use the npm install to install all the dependencies required for the backend-servers
      c) Run npm start to run the backend server

## 4) MongoDb:-

     a) I have currently used MongoDB Atlas. This is the simplest for all the newbies to start with.  ([https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas))

     b) Create the collections based on the schema specified in the Backend code.

     c) You should have  a config.js file, in which you can  configure your MongoDB connection URLs and secret-keys along with .env

     d) For steps to configure your MongoDB database , please refer to MongoDB atlas documentation ([https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas))

## 5) Libraries and tools used for development

     a) React
     b) Semantic UI
     c) ApolloClient (Graphql Consuming Side)
     d) NodeJS  (Express Framework)
     e) Apollo Server (Graphql Creation Side)
     f) Mongodb (Database)
     g) VS Code as Code Editor

## 6) State Management

     a) Global State Management for this App has been handled using React Context API and React Hooks. Check out React Context for the latest updates
     b) I have used the Apollo In-Memory Cache to reduce the state mutations and management since the Apollo In-Memory Cache has really good features that you can utilize to optimise the performance

## 7) Cloud Deployment

    a). The Backend part of the application is hosted in Heroku in a separate server
    b) The Frontend part of the application is hosted in Netlify

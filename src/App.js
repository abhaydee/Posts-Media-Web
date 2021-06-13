import { BrowserRouter as Router, Route } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import { Container } from "semantic-ui-react";
import "./App.css";
import Home from "./Components/Home";
import Login from "./Components/Login";
import MenuBar from "./Components/Menubar";
import Register from "./Components/Register";
import SinglePost from "./Components/SinglePost.jsx";
import { AuthProvider } from "./utils/context";
import AuthRoute from "./Components/AuthRoute";
function App() {
  return (
    <AuthProvider>
      <Router>
        <Container>
          <MenuBar />
          <Route exact path="/" component={Home} />
          <AuthRoute exact path="/register" component={Register} />
          <AuthRoute exact path="/login" component={Login} />
          <Route exact path="/posts/:postId" component={SinglePost} />
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;

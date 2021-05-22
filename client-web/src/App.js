import { BrowserRouter as Router, Route } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import { Container } from "semantic-ui-react";
import "./App.css";
import Home from "./Components/Home";
import Login from "./Components/Login";
import MenuBar from "./Components/Menubar";
import Register from "./Components/Register";

function App() {
  return (
    <Router>
      <Container>
        <MenuBar />
        <Route exact path="/" component={Home} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
      </Container>
    </Router>
  );
}

export default App;

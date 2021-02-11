import NavBar from "./components/navbar";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import HomePage from "./pages/home";
import ExamplePage from "./pages/examples";

import "./app.css";

function App() {
  return (
    <div id="app">
      <NavBar></NavBar>

      <Router>
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route path="/examples/:exampleId?">
            <ExamplePage />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;

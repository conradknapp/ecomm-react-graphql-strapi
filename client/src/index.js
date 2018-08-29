import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import "gestalt/dist/gestalt.css";
import App from "./components/App";
import Checkout from "./components/Checkout";
import Dishes from "./components/Dishes";
import Signin from "./components/Auth/Signin";
import Signup from "./components/Auth/Signup";
import Navbar from "./components/Navbar";

import { getToken } from "./utils";

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      getToken() !== null ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/signin",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

const Root = () => (
  <Router>
    <React.Fragment>
      <Navbar />
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/signin" component={Signin} />
        <Route path="/signup" component={Signup} />
        <PrivateRoute path="/checkout" component={Checkout} />
        <Route path="/:id" component={Dishes} />
      </Switch>
    </React.Fragment>
  </Router>
);

if (module.hot) {
  module.hot.accept();
}

ReactDOM.render(<Root />, document.getElementById("root"));

import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import "./index.css";
import "gestalt/dist/gestalt.css";
import App from "./components/App";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Dishes from "./components/Dishes";
import Signin from "./components/Auth/Signin";
import Signup from "./components/Auth/Signup";
import Navbar from "./components/Navbar";

import { getToken } from "./utils";

const ProtectedRoute = ({ component: Component, ...rest }) => (
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

class Root extends React.Component {
  render() {
    return (
      <Router>
        <React.Fragment>
          <Navbar />
          <Switch>
            <Route exact path="/" component={App} />
            <Route path="/signin" component={Signin} />
            <Route path="/signup" component={Signup} />
            <Route path="/checkout" component={Checkout} />
            <ProtectedRoute path="/cart" component={Cart} />
            <Route path="/:id" component={Dishes} />
          </Switch>
        </React.Fragment>
      </Router>
    );
  }
}

if (module.hot) {
  module.hot.accept();
}

ReactDOM.render(<Root />, document.getElementById("root"));

import React from "react";
import { NavLink } from "react-router-dom";

import { getToken } from "../utils";

class Navbar extends React.Component {
  render() {
    return getToken() !== null ? <AuthNav /> : <UnAuthNav />;
  }
}

const AuthNav = () => (
  <nav
    style={{
      padding: "1em .5em",
      display: "flex",
      justifyContent: "space-around",
      background: "lightblue"
    }}
  >
    <NavLink to="/">Home</NavLink>
    <NavLink to="/cart">Cart</NavLink>
    {/* <NavLink to="/signout">Sign out</NavLink> */}
  </nav>
);

const UnAuthNav = () => (
  <nav
    style={{
      padding: "1em .5em",
      display: "flex",
      justifyContent: "space-around",
      background: "lightgrey"
    }}
  >
    <NavLink to="/">Home</NavLink>
    <NavLink to="/signin">Sign in</NavLink>
    <NavLink to="/signup">Sign up</NavLink>
  </nav>
);

export default Navbar;

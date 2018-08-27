import React from "react";
import { NavLink } from "react-router-dom";
import { Box, Text } from "gestalt";

import { getToken } from "../utils";

class Navbar extends React.Component {
  render() {
    return getToken() !== null ? <AuthNav /> : <UnAuthNav />;
  }
}

const AuthNav = () => (
  <Box
    height={60}
    color="midnight"
    padding={1}
    alignItems="center"
    shape="roundedBottom"
    justifyContent="around"
    direction="row"
    display="flex"
  >
    <NavLink to="/">
      <Text size="xl" color="white">
        Home
      </Text>
    </NavLink>
    <NavLink to="/checkout">
      <Text size="xl" color="white">
        Cart
      </Text>
    </NavLink>
  </Box>
);

const UnAuthNav = () => (
  <Box
    height={60}
    color="midnight"
    padding={1}
    alignItems="center"
    shape="roundedBottom"
    justifyContent="around"
    direction="row"
    display="flex"
  >
    <NavLink to="/">
      <Text size="xl" color="white">
        Home
      </Text>
    </NavLink>
    <NavLink to="/signin">
      <Text size="xl" color="white">
        Sign in
      </Text>
    </NavLink>
    <NavLink to="/signup">
      <Text size="xl" color="white">
        Sign up
      </Text>
    </NavLink>
  </Box>
);

export default Navbar;

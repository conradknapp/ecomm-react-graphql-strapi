import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import { Box, Text, Heading, Image, Button } from "gestalt";

import { clearUserInfo, getToken, clearToken, clearCart } from "../utils";

class Navbar extends React.Component {
  handleSignout = () => {
    clearUserInfo();
    clearToken();
    clearCart();
    this.props.history.push("/");
  };

  render() {
    return getToken() !== null ? (
      <AuthNav handleSignout={this.handleSignout} />
    ) : (
      <UnAuthNav />
    );
  }
}

const AuthNav = ({ handleSignout }) => (
  <Box
    height={70}
    color="midnight"
    padding={1}
    alignItems="center"
    shape="roundedBottom"
    justifyContent="around"
    direction="row"
    display="flex"
  >
    {/* Checkout Link */}
    <NavLink activeClassName="active" to="/checkout">
      <Text size="xl" color="white">
        Checkout
      </Text>
    </NavLink>

    {/* Logo and Title */}
    <NavLink exact activeClassName="active" to="/">
      <Box display="flex" alignItems="center">
        <Box margin={2} height={50} width={50}>
          <Image
            alt="BrewHaha Logo"
            fit="contain"
            naturalHeight={1}
            naturalWidth={1}
            src="./icons/logo.svg"
          />
        </Box>
        <div className="logo">
          <Heading size="xs" color="orange">
            BrewHaha
          </Heading>
        </div>
      </Box>
    </NavLink>

    {/* Signout Button */}
    <Button
      color="transparent"
      text="Sign Out"
      inline
      size="md"
      onClick={handleSignout}
    />
  </Box>
);

const UnAuthNav = () => (
  <Box
    height={70}
    color="midnight"
    padding={1}
    alignItems="center"
    shape="roundedBottom"
    justifyContent="around"
    direction="row"
    display="flex"
  >
    {/* Signin Link */}
    <NavLink activeClassName="active" to="/signin">
      <Text size="xl" color="white">
        Sign In
      </Text>
    </NavLink>

    {/* Logo and Title */}
    <NavLink exact activeClassName="active" to="/">
      <Box display="flex" alignItems="center">
        <Box margin={2} height={50} width={50}>
          <Image
            alt="BrewHaha Logo"
            fit="contain"
            naturalHeight={1}
            naturalWidth={1}
            src="./icons/logo.svg"
          />
        </Box>
        <div className="logo">
          <Heading size="xs" color="orange">
            BrewHaha
          </Heading>
        </div>
      </Box>
    </NavLink>

    {/* Signup Link */}
    <NavLink activeClassName="active" to="/signup">
      <Text size="xl" color="white">
        Sign Up
      </Text>
    </NavLink>
  </Box>
);

export default withRouter(Navbar);

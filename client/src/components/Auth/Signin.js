import React from "react";
import Strapi from "strapi-sdk-javascript/build/main";
import { TextField, Button, Heading, Link, Toast, Box } from "gestalt";
import { setToken, setUserInfo } from "../../utils";
const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

class Signin extends React.Component {
  state = {
    username: "",
    password: "",
    loading: false,
    errorToast: false,
    errorMessage: "",
    googleProviderUrl: "http://localhost:1337/connect/google"
  };

  handleChange = ({ event, value }) => {
    event.persist();
    this.setState({ [event.target.name]: value });
  };

  handleSubmit = async event => {
    event.preventDefault();
    const { username, password } = this.state;

    try {
      this.setState({ loading: true });
      const response = await strapi.login(username, password);
      this.setState({ loading: false });
      console.log(response.user);
      this.props.history.push("/");
    } catch (err) {
      this.setState({ loading: false });
      this.showErrorToast(err.message);
      // alert(err.message || "An error occurred.");
    }
  };

  showErrorToast = (errorMessage = "An error occurred") => {
    this.setState({ errorToast: true, errorMessage });
    setTimeout(
      () => this.setState({ errorToast: false, errorMessage: "" }),
      5000
    );
  };

  async componentDidMount() {
    try {
      // window.location = strapi.getProviderAuthenticationUrl("google");
      const response = await strapi.authenticateProvider("google");
      setToken(response.jwt);
      setUserInfo(response.user);
      this.redirectUser("/");
    } catch (err) {
      console.error(err);
      this.setState({ loading: false });
      this.showErrorToast(err.message);
      this.redirectUser("/signin");
    }
  }

  redirectUser = path => this.props.history.push(path);

  render() {
    const { loading, errorToast, errorMessage, googleProviderUrl } = this.state;

    return (
      <React.Fragment>
        <form
          style={{
            display: "flex",
            marginTop: "5em",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}
          onSubmit={this.handleSubmit}
        >
          <Heading>Sign In</Heading>
          <TextField
            id="username"
            type="text"
            name="username"
            placeholder="username"
            onChange={this.handleChange}
          />
          <TextField
            id="password"
            type="password"
            name="password"
            placeholder="Password"
            onChange={this.handleChange}
          />
          <Button inline text="Submit" type="submit" disabled={loading} />
          <Link href={googleProviderUrl}>Sign in with Google</Link>
          {errorToast && (
            <Box
              fit
              dangerouslySetInlineStyle={{
                __style: {
                  bottom: 250,
                  left: "50%",
                  transform: "translateX(-50%)"
                }
              }}
              paddingX={1}
              position="fixed"
            >
              <Toast color="orange" text={errorMessage} />
            </Box>
          )}
        </form>
      </React.Fragment>
    );
  }
}

export default Signin;

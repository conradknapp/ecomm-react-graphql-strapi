import React from "react";
import Strapi from "strapi-sdk-javascript/build/main";
// prettier-ignore
import { Container, Box, TextField, Text, Button, Heading, Link } from "gestalt";
import ToastMessage from "../ToastMessage";
import { setToken, setUserInfo } from "../../utils";
const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

class Signin extends React.Component {
  state = {
    username: "",
    password: "",
    loading: false,
    toast: false,
    toastMessage: "",
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

  showErrorToast = (toastMessage = "An error occurred") => {
    this.setState({ toast: true, toastMessage });
    setTimeout(
      () => this.setState({ toast: false, toastMessage: "" }),
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
      this.showErrorToast("Please Sign In");
      this.redirectUser("/signin");
    }
  }

  redirectUser = path => this.props.history.push(path);

  render() {
    const { loading, toast, toastMessage, googleProviderUrl } = this.state;

    return (
      <Container>
        <Box>
          <form
            style={{
              display: "inlineBlock",
              textAlign: "center"
            }}
            onSubmit={this.handleSubmit}
          >
            <Heading color="midnight">Sign In</Heading>
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
            <Button
              color="blue"
              inline
              text="Submit"
              type="submit"
              disabled={loading}
            />
            <Text color="red">
              {/* to give a Link color, wrap it in Text component and set color prop on it */}
              <Link href={googleProviderUrl}>Sign in with Google</Link>
            </Text>
            {/* {errorToast && (
            <Box
            color="gray"
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
          )} */}
            <ToastMessage show={toast} message={toastMessage} />
          </form>
        </Box>
      </Container>
    );
  }
}

export default Signin;

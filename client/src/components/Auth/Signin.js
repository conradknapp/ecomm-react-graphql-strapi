import React from "react";
import Strapi from "strapi-sdk-javascript/build/main";
// prettier-ignore
import { Image, Container, Box, TextField, Text, Button, Heading, Link } from "gestalt";
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

  async componentDidMount() {
    try {
      // window.location = strapi.getProviderAuthenticationUrl("google");
      const response = await strapi.authenticateProvider("google");
      setToken(response.jwt);
      setUserInfo(response.user);
      this.redirectUser("/");
    } catch (err) {
      console.error(err);
      this.showToast("Please Sign In");
      this.redirectUser("/signin");
    }
  }

  isFormEmpty = ({ username, email }) => {
    return !username || !email;
  };

  handleChange = ({ event, value }) => {
    event.persist();
    this.setState({ [event.target.name]: value });
  };

  handleSubmit = async event => {
    event.preventDefault();
    const { username, password } = this.state;

    if (this.isFormEmpty(this.state)) {
      this.showToast("Fill in all fields");
      return;
    }

    try {
      this.setState({ loading: true });
      const response = await strapi.login(username, password);
      this.setState({ loading: false });
      console.log(response.user);
      this.redirectUser("/");
    } catch (err) {
      this.setState({ loading: false });
      this.showToast(err.message);
    }
  };

  showToast = toastMessage => {
    this.setState({ toast: true, toastMessage });
    setTimeout(() => this.setState({ toast: false, toastMessage: "" }), 5000);
  };

  redirectUser = path => this.props.history.push(path);

  render() {
    const { loading, toast, toastMessage, googleProviderUrl } = this.state;

    return (
      <Container>
        <Box
          dangerouslySetInlineStyle={{
            __style: {
              backgroundColor: "#D6A3B1"
            }
          }}
          shape="rounded"
          padding={4}
          margin={4}
          display="flex"
          justifyContent="center"
        >
          <form
            style={{
              display: "inlineBlock",
              textAlign: "center",
              maxWidth: 450
            }}
            onSubmit={this.handleSubmit}
          >
            <Box>
              <Heading color="midnight">Welcome Back!</Heading>
            </Box>

            {/* Google Sign In */}
            <Box
              shape="rounded"
              margin={2}
              justifyContent="center"
              color="darkWash"
              display="flex"
              alignItems="center"
            >
              <Box margin={2} height={25} width={25}>
                <Image
                  alt="BrewHaha Logo"
                  fit="contain"
                  naturalHeight={1}
                  naturalWidth={1}
                  src="./icons/google.svg"
                />
              </Box>
              <Text color="red">
                {/* to give a Link color, wrap it in Text component and set color prop on it */}
                <Link href={googleProviderUrl}>Sign in with Google</Link>
              </Text>
            </Box>

            {/* Sign in Inputs */}
            <TextField
              id="username"
              type="text"
              name="username"
              placeholder="Username"
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
            <ToastMessage show={toast} message={toastMessage} />
          </form>
        </Box>
      </Container>
    );
  }
}

export default Signin;

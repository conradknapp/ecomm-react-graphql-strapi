import React from "react";
import Strapi from "strapi-sdk-javascript/build/main";
import { Container, Box, Button, Heading, TextField } from "gestalt";
const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

class Signup extends React.Component {
  state = {
    username: "",
    email: "",
    password: "",
    loading: false
  };

  handleChange = ({ event, value }) => {
    event.persist();
    this.setState({ [event.target.name]: value });
  };

  handleSubmit = async event => {
    event.preventDefault();
    const { username, email, password } = this.state;

    try {
      this.setState({ loading: true });
      const response = await strapi.register(username, email, password);
      this.setState({ loading: false });
      console.log(response.user);
      this.props.history.push("/");
    } catch (err) {
      this.setState({ loading: false });
      alert(err.message || "An error occurred.");
    }
  };

  render() {
    const { loading } = this.state;

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
            <Heading color="orange">Signup</Heading>
            <TextField
              type="text"
              name="username"
              placeholder="username"
              onChange={this.handleChange}
            />
            <TextField
              type="email"
              name="email"
              placeholder="Email"
              onChange={this.handleChange}
            />
            <TextField
              type="password"
              name="password"
              placeholder="Password"
              onChange={this.handleChange}
            />
            <Button inline text="Submit" type="submit" disabled={loading} />
          </form>
        </Box>
      </Container>
    );
  }
}

export default Signup;

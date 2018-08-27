import React from "react";
import Strapi from "strapi-sdk-javascript/build/main";
import { TextField, Button, Heading } from "gestalt";
const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

class Signin extends React.Component {
  state = {
    username: "",
    password: "",
    loading: false
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
      alert(err.message || "An error occurred.");
    }
  };

  render() {
    const { loading } = this.state;

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
            type="text"
            name="username"
            placeholder="username"
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
      </React.Fragment>
    );
  }
}

export default Signin;

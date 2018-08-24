import React from "react";
import Strapi from "strapi-sdk-javascript/build/main";
const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

class Signin extends React.Component {
  state = {
    username: "",
    password: "",
    loading: false
  };

  handleChange = ({ target }) => {
    this.setState({ [target.name]: target.value });
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
          <h1>Signin</h1>
          <input
            type="text"
            name="username"
            placeholder="username"
            onChange={this.handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={this.handleChange}
          />
          <button type="submit" disabled={loading}>
            Submit
          </button>
        </form>
      </React.Fragment>
    );
  }
}

export default Signin;

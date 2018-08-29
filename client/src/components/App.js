import React, { Component } from "react";
import "./App.css";
import { Container, Box, Heading, SearchField } from "gestalt";
import Loader from "./Loader";
import Restaurant from "./Restaurant";
import Strapi from "strapi-sdk-javascript/build/main";
const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

class App extends Component {
  state = {
    list: [],
    searchTerm: "",
    loading: true
  };

  async componentDidMount() {
    const response = await strapi.request("post", "/graphql", {
      data: {
        query: `query {
            restaurants {
              _id
              name
              description
              image {
                url
              }
            }
          }
          `
      }
    });
    console.log(response);
    this.setState({
      list: response.data.restaurants || [],
      loading: false
    });
  }

  handleChange = ({ value }) => {
    this.setState({ searchTerm: value });
    // this.setState({ searchTerm: value }, () => this.searchRestaurants());
  };

  filteredList = () => {
    const { list, searchTerm } = this.state;

    return list.filter(restaurant => {
      return restaurant.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
  };

  // searchRestaurants = async () => {
  //   const response = await strapi.request("post", "/graphql", {
  //     data: {
  //       query: `query  {
  //         restaurants(where: {
  //           name_contains: "${this.state.searchTerm}"
  //         }) {
  //           name
  //         }
  //       }`
  //     }
  //   });
  //   console.log(this.state.searchTerm, response.data.restaurants);
  // this.setState({
  //   list: response.data.restaurants || [],
  //   loading: false
  // });
  // };

  render() {
    const { searchTerm, loading } = this.state;

    return (
      <Container>
        <Box
          color="white"
          shape="rounded"
          padding={3}
          display="flex"
          direction="row"
          justifyContent="center"
        >
          <SearchField
            accessibilityLabel="Restaurants Search Field"
            id="searchField"
            onChange={this.handleChange}
            placeholder="Search Restaurants"
            value={searchTerm}
          />
        </Box>
        <Box padding={2}>
          <Box
            display="flex"
            direction="row"
            justifyContent="center"
            marginBottom={1}
          >
            <Heading color="midnight" size="md">
              Restaurants
            </Heading>
          </Box>
          <Box>
            <Loader show={loading} />
            {/* <Spinner
              show={this.state.loading}
              accessibilityLabel="Loading spinner"
            /> */}
            {this.filteredList().map(restaurant => (
              <Restaurant key={restaurant._id} restaurant={restaurant} />
            ))}
          </Box>
        </Box>
      </Container>
    );
  }
}

export default App;

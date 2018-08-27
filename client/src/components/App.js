import React, { Component } from "react";
import "./App.css";
import { Link } from "react-router-dom";
import { Box, Card, Heading, SearchField, Text, Spinner, Image } from "gestalt";
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
  };

  filteredList = () => {
    const { list, searchTerm } = this.state;

    return list.filter(restaurant => {
      return restaurant.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
  };

  render() {
    const { searchTerm } = this.state;
    return (
      <Box>
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
            <Spinner
              show={this.state.loading}
              accessibilityLabel="Loading spinner"
            />
            {this.filteredList().map(el => (
              <Restaurant key={el._id} restaurant={el} />
            ))}
          </Box>
        </Box>
      </Box>
    );
  }
}

const Restaurant = ({ restaurant }) => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    direction="column"
    column={3}
  >
    <Card
      image={
        <Box
          color="darkGray"
          height={200}
          width={200}
          marginLeft={4}
          marginRight={4}
        >
          <Image
            alt="tall"
            color="#000"
            fit="cover"
            naturalHeight={1}
            naturalWidth={1}
            src={`${apiUrl}${restaurant.image.url}`}
          />
        </Box>
      }
    >
      <Text bold size="xl" align="center">
        {restaurant.name}
      </Text>
      <Text align="center">{restaurant.description}</Text>
      <Text bold size="xl" align="center" color="eggplant">
        <Link to={`/${restaurant._id}`}>See Dishes</Link>
      </Text>
    </Card>
  </Box>
);

export default App;

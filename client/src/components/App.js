import React, { Component } from "react";
import "./App.css";
import { Avatar, Container, Box, Heading, SearchField, Icon } from "gestalt";
import Loader from "./Loader";
import Brand from "./Brand";
import Strapi from "strapi-sdk-javascript/build/main";
import { getUserInfo } from "../utils";
const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

class App extends Component {
  state = {
    brands: [],
    searchTerm: "",
    loadingBrands: true,
    userInfo: null
  };

  async componentDidMount() {
    try {
      const response = await strapi.request("POST", "/graphql", {
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
      // console.log(response);
      this.setState({
        brands: response.data.restaurants || [],
        loadingBrands: false,
        userInfo: getUserInfo()
      });
    } catch (err) {
      console.error(err);
    }
  }

  handleChange = ({ value }) => {
    this.setState({ searchTerm: value });
    // this.setState({ searchTerm: value }, () => this.searchBrands());
  };

  filteredList = () => {
    const { brands, searchTerm } = this.state;

    return brands.filter(brand => {
      return (
        brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brand.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  };

  // searchBrands = async () => {
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
  //   brands: response.data.restaurants || [],
  //   loadingBrands: false
  // });
  // };

  render() {
    const { userInfo, searchTerm, loadingBrands } = this.state;
    return (
      <Container>
        {/* Search Input */}
        <Box
          dangerouslySetInlineStyle={{
            __style: {
              backgroundColor: "#f6f9fc"
            }
          }}
          shape="rounded"
          padding={3}
          display="flex"
          direction="row"
          justifyContent="center"
        >
          <Box marginRight={4}>
            {userInfo && <Avatar name={userInfo.username} size="md" verified />}
          </Box>
          <SearchField
            accessibilityLabel="Brands Search Field"
            id="searchField"
            onChange={this.handleChange}
            placeholder="Search Brands"
            value={searchTerm}
          />
          <Box margin={3}>
            <Icon
              icon="filter"
              color={searchTerm ? "orange" : "gray"}
              size={20}
              accessibilityLabel="Filter"
            />
          </Box>
        </Box>

        {/* Brands Section */}
        <Box>
          <Box
            display="flex"
            direction="row"
            justifyContent="center"
            marginBottom={1}
          >
            {/* Brands Header */}
            <Heading color="midnight" size="md">
              Brew Brands
            </Heading>
          </Box>

          {/* Brands */}
          <Box
            dangerouslySetInlineStyle={{
              __style: {
                backgroundColor: "#d6c8ec"
              }
            }}
            shape="rounded"
            display="flex"
            justifyContent="around"
            wrap
          >
            {this.filteredList().map(brand => (
              <Brand key={brand._id} brand={brand} />
            ))}
            {/* <Spinner
              show={this.state.loadingBrands}
              accessibilityLabel="Loading spinner"
            /> */}
            <Loader show={loadingBrands} />
          </Box>
        </Box>
      </Container>
    );
  }
}

export default App;

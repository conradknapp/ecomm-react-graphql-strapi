import React, { Component } from "react";
import "./App.css";
import { Link } from "react-router-dom";
import Strapi from "strapi-sdk-javascript/build/main";
const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

class App extends Component {
  state = {
    list: [],
    searchTerm: ""
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
    this.setState({ list: response.data.restaurants || [] });
  }

  handleChange = ({ target }) => {
    this.setState({ [target.name]: target.value });
  };

  filteredList = () => {
    const { list, searchTerm } = this.state;

    return list.filter(restaurant => {
      return restaurant.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
  };

  render() {
    return (
      <div className="App">
        <input
          name="searchTerm"
          onChange={this.handleChange}
          placeholder="Search Restaurants"
          type="text"
        />
        <div>
          <h1>Restaurants</h1>
          <ul>
            {this.filteredList().map((el, i) => (
              <li key={i}>
                <p>{el.name}</p>
                <img
                  height="200px"
                  src={`${apiUrl}${el.image.url}`}
                  alt="Restaurant"
                />
                <p>{el.description}</p>
                <button>
                  <Link to={`/${el._id}`}>See Dishes</Link>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default App;

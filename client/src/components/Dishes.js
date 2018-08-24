import React from "react";
import Strapi from "strapi-sdk-javascript/build/main";
import { Link } from 'react-router-dom'
import { loadCart, displayPrice } from "../utils";
const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

class Dishes extends React.Component {
  state = {
    dishes: [],
    cartItems: []
  };

  async componentDidMount() {
    this.setState({ cartItems: loadCart() });
    const response = await strapi.request("post", "/graphql", {
      data: {
        query: `query {
            restaurant(id: "${this.props.match.params.id}") {
              _id
              name
              dishes {
                _id
                name
                description
                price
                image {
                  url
                }
              }
            }
          }
          `
      }
    });
    this.setState({ dishes: response.data.restaurant.dishes });
  }

  addToStorage = () =>
    localStorage.setItem("cart", JSON.stringify(this.state.cartItems));

  addToCart = dish => {
    const alreadyInCart = this.state.cartItems.findIndex(
      el => el.id === dish.id
    );

    if (alreadyInCart === -1) {
      this.setState(
        {
          cartItems: [...this.state.cartItems, { ...dish, quantity: 1 }]
        },
        () => this.addToStorage()
      );
    } else {
      const updatedItems = [...this.state.cartItems];
      updatedItems[alreadyInCart].quantity += 1;
      this.setState({ cartItems: updatedItems }, () => this.addToStorage());
    }
  };

  render() {
    const { cartItems } = this.state;

    return (
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
        <ul>
          <h1>Dishes</h1>
          {this.state.dishes.map((el, i) => (
            <li key={i}>
              <p>{el.name}</p>
              <img
                height="200px"
                src={`${apiUrl}${el.image.url}`}
                alt="Restaurant"
              />
              <p>{el.description}</p>
              <p>{el.price}</p>
              <button onClick={() => this.addToCart(el)}>Add To Cart</button>
            </li>
          ))}
        </ul>
        <div style={{ marginLeft: "2em", border: "black 1px solid" }}>
          <div>
            <h5>Card</h5>
            <p>{cartItems.length} items selected:</p>
            <ul />
            <h5>Total: {displayPrice(cartItems)}</h5>
            {cartItems.length === 0 && <p>Please select some items</p>}
            <button><Link to="/checkout">Order</Link></button>
          </div>
        </div>
      </div>
    );
  }
}

export default Dishes;

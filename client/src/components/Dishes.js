import React from "react";
import Strapi from "strapi-sdk-javascript/build/main";
import { Link } from "react-router-dom";
import { Box, Button, Heading, Text, Image, Mask } from "gestalt";
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
      item => item._id === dish._id
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
      <Box display="flex" alignItems="center">
        <Box column={8} display="flex" direction="column">
          <Heading>Dishes</Heading>
          {this.state.dishes.map(dish => (
            <Dish key={dish._id} dish={dish} addToCart={this.addToCart} />
          ))}
        </Box>
        <Box margin={2} column={4}>
          <Mask shape="rounded" wash>
            <Box
              display="flex"
              direction="column"
              alignItems="center"
              padding={3}
            >
              <Heading align="center" size="sm">
                Your Cart
              </Heading>
              <Text color="gray" italic>
                {cartItems.length} items selected
              </Text>
              <ul>
                {cartItems.map((item, i) => (
                  <li key={i}>
                    <Text>
                      {item.name} x {item.quantity} - $
                      {item.quantity * item.price}
                    </Text>
                  </li>
                ))}
              </ul>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                direction="column"
              >
                <Text size="lg">Total: {displayPrice(cartItems)}</Text>
                {cartItems.length === 0 && (
                  <Text>Please select some items</Text>
                )}
                <Text>
                  <Link to="/checkout">Checkout</Link>
                </Text>
              </Box>
            </Box>
          </Mask>
        </Box>
      </Box>
    );
  }
}

const Dish = ({ dish, addToCart }) => (
  <Box>
    <Text size="lg">{dish.name}</Text>
    <Box height={300} width={300}>
      <Image
        alt="Dish"
        src={`${apiUrl}${dish.image.url}`}
        naturalWidth={1}
        naturalHeight={1}
        fit="cover"
      />
    </Box>
    <Text>{dish.description}</Text>
    <Text color="olive">{dish.price}</Text>
    <Button
      inline
      color="blue"
      onClick={() => addToCart(dish)}
      text="Add to Cart"
    />
  </Box>
);

export default Dishes;

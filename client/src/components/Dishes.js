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
      <Box display="flex" alignItems="center">
        <Box column={8} display="flex" direction="column">
          <Heading>Dishes</Heading>
          {this.state.dishes.map(el => (
            <Dish key={el._id} dish={el} addToCart={this.addToCart} />
          ))}
        </Box>
        <Box margin={2} column={4}>
          <Mask shape="rounded" wash>
            <Box padding={3}>
              <Heading size="sm">Card</Heading>
              <Text>{cartItems.length} items selected:</Text>
              <ul>
                {cartItems.map((el, i) => (
                  <li key={i}>
                    <Text>
                      {el.name} x {el.quantity} - ${el.quantity * el.price}
                    </Text>
                  </li>
                ))}
              </ul>
              <Text size="lg">Total: {displayPrice(cartItems)}</Text>
              {cartItems.length === 0 && <p>Please select some items</p>}
              <Text>
                <Link to="/checkout">Checkout</Link>
              </Text>
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

import React from "react";
import Strapi from "strapi-sdk-javascript/build/main";
import { Link } from "react-router-dom";
// prettier-ignore
import { Box, Button, Heading, Text, IconButton, Image, Mask, Card } from "gestalt";
import { setCart, getCart, displayPrice } from "../utils";
const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

class Brews extends React.Component {
  state = {
    brand: "",
    brews: [],
    cartItems: []
  };

  async componentDidMount() {
    this.setState({ cartItems: getCart() });
    try {
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
      this.setState({
        brand: response.data.restaurant.name,
        brews: response.data.restaurant.dishes
      });
    } catch (err) {
      console.error(err);
    }
  }

  addItemToCart = brew => {
    const alreadyInCart = this.state.cartItems.findIndex(
      item => item._id === brew._id
    );

    if (alreadyInCart === -1) {
      const updatedItems = this.state.cartItems.concat({
        ...brew,
        quantity: 1
      });
      this.setState(
        {
          cartItems: updatedItems
        },
        () => setCart(updatedItems)
      );
    } else {
      const updatedItems = [...this.state.cartItems];
      updatedItems[alreadyInCart].quantity += 1;
      this.setState({ cartItems: updatedItems }, () => setCart(updatedItems));
    }
  };

  deleteItemFromCart = itemId => {
    const updatedItems = this.state.cartItems.filter(
      item => item._id !== itemId
    );
    this.setState({ cartItems: updatedItems }, () => setCart(updatedItems));
  };

  render() {
    const { cartItems, brews, brand } = this.state;

    return (
      <Box
        dangerouslySetInlineStyle={{
          __style: {
            flexWrap: "wrap-reverse"
          }
        }}
        marginTop={5}
        display="flex"
        justifyContent="center"
        alignItems="start"
      >
        {/* Brews Section */}
        <Box display="flex" direction="column" alignItems="center">
          {/* Brews Heading */}
          <Box margin={2}>
            <Heading color="orchid">{brand}</Heading>
          </Box>

          {/* Brews */}
          <Box
            dangerouslySetInlineStyle={{
              __style: {
                backgroundColor: "#BDCDD9"
              }
            }}
            shape="rounded"
            display="flex"
            justifyContent="around"
            wrap
          >
            {brews.map(brew => (
              <Brew
                key={brew._id}
                brew={brew}
                addItemToCart={this.addItemToCart}
              />
            ))}
          </Box>
        </Box>

        {/* User Cart */}
        <Box alignSelf="end" marginTop={2} marginLeft={8}>
          <Mask shape="rounded" wash>
            <Box
              display="flex"
              direction="column"
              alignItems="center"
              padding={2}
            >
              {/* User Cart Heading */}
              <Heading align="center" size="sm">
                Your Cart
              </Heading>
              <Text color="gray" italic>
                {cartItems.length} items selected
              </Text>

              {/* Cart Items */}
              {cartItems.map((item, i) => (
                <Box key={i} display="flex" alignItems="center">
                  <Text>
                    {item.name} x {item.quantity} - $
                    {(item.quantity * item.price).toFixed(2)}
                  </Text>
                  <IconButton
                    accessibilityLabel="Delete Item"
                    icon="cancel"
                    size="sm"
                    iconColor="red"
                    onClick={() => this.deleteItemFromCart(item._id)}
                  />
                </Box>
              ))}

              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                direction="column"
              >
                <Box margin={2}>
                  {cartItems.length === 0 && (
                    <Text color="red">Please select some items</Text>
                  )}
                </Box>
                <Text size="lg">Total: {displayPrice(cartItems)}</Text>
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

const Brew = ({ brew, addItemToCart }) => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    direction="column"
    // have to set width of each child element/component for flex-wrap to work
    width={210}
    marginRight={4}
    marginLeft={4}
    padding={4}
  >
    <Card
      image={
        <Box height={250} width={200}>
          <Image
            alt="tall"
            color="midnight"
            fit="cover"
            naturalHeight={1}
            naturalWidth={1}
            src={`${apiUrl}${brew.image.url}`}
          />
        </Box>
      }
    >
      <Box display="flex" direction="column" alignItems="center">
        <Box margin={2}>
          <Text bold size="xl">
            {brew.name}
          </Text>
        </Box>
        <Text>{brew.description}</Text>
        <Text color="orchid">${brew.price}</Text>
        <Box marginTop={2}>
          <Button
            inline
            color="blue"
            onClick={() => addItemToCart(brew)}
            text="Add to Cart"
          />
        </Box>
      </Box>
    </Card>
  </Box>
);

export default Brews;

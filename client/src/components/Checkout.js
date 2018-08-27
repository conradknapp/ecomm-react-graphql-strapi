import React from "react";
import {
  Elements,
  StripeProvider,
  CardElement,
  injectStripe
} from "react-stripe-elements";
import { loadCart, displayPrice } from "../utils";
import Strapi from "strapi-sdk-javascript/build/main";
import { Heading, Box, TextField, Text } from "gestalt";
const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

class _CheckoutForm extends React.Component {
  state = {
    address: "",
    postalCode: "",
    city: "",
    loading: false,
    cartItems: []
  };

  componentDidMount() {
    this.setState({ cartItems: loadCart() });
  }

  handleChange = ({ event, value }) => {
    event.persist();
    this.setState({ [event.target.name]: value });
  };

  handleSubmit = async event => {
    const { address, postalCode, city, cardItems } = this.state;

    event.preventDefault();
    this.setState({ loading: true });
    let token;
    try {
      const response = await this.props.stripe.createToken();
      token = response.token.id;
    } catch (err) {
      alert("An error occurred.");
      this.setState({ loading: false });
      return;
    }
    try {
      await strapi.createEntry("order", {
        amount: "999",
        dishes: cardItems,
        address,
        postalCode,
        city,
        token
      });
      alert("Your order has been successfully submitted.");
      // redirect to home page
    } catch (err) {
      this.setState({ loading: false });
      alert("An error occurred.");
    }
  };

  render() {
    const { loading, cartItems } = this.state;

    return (
      <Box display="flex" justifyContent="center">
        <form
          style={{
            display: "inlineBlock",
            textAlign: "center"
          }}
          onSubmit={this.handleSubmit}
        >
          <Box>
            <Heading>Checkout</Heading>
            <Text>Total: ${displayPrice(cartItems)}</Text>
            <TextField
              id="address"
              type="text"
              name="address"
              placeholder="Address"
              onChange={this.handleChange}
            />
            <TextField
              id="postalCode"
              type="number"
              name="postalCode"
              placeholder="Postal Code"
              onChange={this.handleChange}
            />
            <TextField
              id="city"
              type="text"
              name="city"
              placeholder="Enter your city"
              onChange={this.handleChange}
            />
            <CardElement id="stripe__input" onReady={el => el.focus()} />
            <button id="stripe__button" type="submit" disabled={loading}>
              Submit
            </button>
          </Box>
        </form>
      </Box>
    );
  }
}

const CheckoutForm = injectStripe(_CheckoutForm);

class Checkout extends React.Component {
  render() {
    return (
      <StripeProvider apiKey="pk_test_PSflbJm1TRGI2aN9aJ2pq6Yp">
        <Elements>
          <CheckoutForm />
        </Elements>
      </StripeProvider>
    );
  }
}

export default Checkout;

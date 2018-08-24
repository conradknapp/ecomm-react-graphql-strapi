import React from "react";
import {
  Elements,
  StripeProvider,
  CardElement,
  injectStripe
} from "react-stripe-elements";
import { loadCart, displayPrice } from "../utils";
import Strapi from "strapi-sdk-javascript/build/main";
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

  handleChange = ({ target }) => {
    this.setState({ [target.name]: target.value });
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
      <form onSubmit={this.handleSubmit}>
        <h1>Checkout</h1>
        <p>Total: ${displayPrice(cartItems)}</p>
        <input
          type="text"
          name="address"
          placeholder="Address"
          onChange={this.handleChange}
        />
        <input
          type="text"
          name="postalCode"
          placeholder="Postal Code"
          onChange={this.handleChange}
        />
        <input
          type="text"
          name="city"
          placeholder="Enter your city"
          onChange={this.handleChange}
        />
        <label>
          Card details
          <CardElement onReady={el => el.focus()} />
        </label>
        <button type="submit" disabled={loading}>
          Submit
        </button>
      </form>
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

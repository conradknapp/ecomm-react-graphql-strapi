import React from "react";
import {
  Elements,
  StripeProvider,
  CardElement,
  injectStripe
} from "react-stripe-elements";
import ToastMessage from "./ToastMessage";
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
    confirmationEmailAddress: "",
    loading: false,
    cartItems: [],
    modal: false,
    toast: false,
    toastMessage: ""
  };

  componentDidMount() {
    this.setState({ cartItems: loadCart() });
  }

  handleChange = ({ event, value }) => {
    event.persist();
    this.setState({ [event.target.name]: value });
  };

  isFormEmpty = ({ address, postalCode, city, confirmationEmailAddress }) => {
    return !address || !postalCode || !city || !confirmationEmailAddress;
  };

  handleConfirmOrder = event => {
    event.preventDefault();
    if (this.isFormEmpty(this.state)) {
      this.showToast("Fill in all fields");
      return;
    }
    // this.setState({ modal: true });
    this.handleSubmitOrder();
  };

  showToast = (toastMessage = "An error occurred") => {
    this.setState({ toast: true, toastMessage });
    setTimeout(() => this.setState({ toast: false, toastMessage: "" }), 5000);
  };

  handleSubmitOrder = async () => {
    const { address, postalCode, city, cardItems } = this.state;

    // event.preventDefault();
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
        amount: "9.99",
        dishes: cardItems,
        address,
        postalCode,
        city,
        token
      });
      await strapi.request("POST", "/email", {
        from: "contact@company.com", // Optional : sender (defaults to `strapi.config.smtp.from`).
        to: ["john@doe.com"], // Recipients list.
        html: "<p>Hello John</p>", // HTML version of the email content.
        text: "Hello John" // Text version of the email content.
      });

      // await strapi.plugins["email"].services.email.send({
      //   email: "admin@strapi.io",
      //   from: "robbot@strapi.io",
      //   replyTo: "no-reply@strapi.io",
      //   subject: "Use strapi email provider successfully",
      //   text: "Hello world!",
      //   html: "Hello world!"
      // });
      // await strapi.request("post", "/", {
      //   to: "conrad.knapp@outlook.com",
      //   from: "robot@strapi.io",
      //   replyTo: "no-reply@strapi.io",
      //   subject: "The Eatery - Order Confirmation",
      //   text: "Your order was successfully sent!",
      //   html: "Hello world!"
      // });
      this.showToast("Your order has been successfully submitted.");

      // redirect to home page
    } catch (err) {
      this.setState({ loading: false });
      console.error(err.message);
      this.showToast(err.message);
    }
  };

  render() {
    const { loading, cartItems, toast, toastMessage } = this.state;

    return (
      <Box
        display="flex"
        justifyContent="center"
        direction="column"
        alignItems="center"
      >
        <Heading>Checkout</Heading>
        <Text>{cartItems.length} items selected:</Text>
        <ul>
          {cartItems.map((item, i) => (
            <li key={i}>
              <Text>
                {item.name} x {item.quantity} - ${item.quantity * item.price}
              </Text>
            </li>
          ))}
        </ul>
        <Text>Total: ${displayPrice(cartItems)}</Text>
        <Box maxWidth={450}>
          <form
            style={{
              display: "inlineBlock",
              textAlign: "center"
            }}
            onSubmit={this.handleConfirmOrder}
          >
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
            <TextField
              id="confirmationEmailAddress"
              type="email"
              name="confirmationEmailAddress"
              placeholder="Email Address for Order Confirmation"
              onChange={this.handleChange}
            />
            <CardElement id="stripe__input" onReady={input => input.focus()} />
            <button id="stripe__button" type="submit" disabled={loading}>
              Submit
            </button>
            <ToastMessage show={toast} message={toastMessage} />
          </form>
        </Box>
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

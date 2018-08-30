import React from "react";
import {
  Elements,
  StripeProvider,
  CardElement,
  injectStripe
} from "react-stripe-elements";
import ToastMessage from "./ToastMessage";
import { loadCart, displayPrice, clearCart } from "../utils";
import { withRouter } from "react-router-dom";
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

  getCurrentDate = () => {
    return new Date(Date.now()).toLocaleDateString("us");
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

  showToast = (toastMessage = "An error occurred", redirect = false) => {
    this.setState({ toast: true, toastMessage });
    setTimeout(
      () =>
        this.setState(
          { toast: false, toastMessage: "" },
          () => redirect && this.props.history.push("/")
        ),
      5000
    );
    // setTimeout(() => redirect && this.props.history.push("/"), 0);
  };

  handleSubmitOrder = async () => {
    const {
      address,
      postalCode,
      city,
      cardItems,
      confirmationEmailAddress
    } = this.state;

    // event.preventDefault();
    this.setState({ loading: true });
    let token;
    try {
      const response = await this.props.stripe.createToken();
      token = response.token.id;
    } catch (err) {
      this.showToast(err.message);
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
        data: {
          to: confirmationEmailAddress,
          subject: `Order Confirmation - The Eatery, ${this.getCurrentDate()}`,
          text: "Your order has been submitted!",
          html: "Hello world!"
        }
      });

      this.showToast("Your order has been successfully submitted!", true);
      clearCart();
    } catch (err) {
      console.error(err.message);
      this.setState({ loading: false });
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

const CheckoutForm = withRouter(injectStripe(_CheckoutForm));

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

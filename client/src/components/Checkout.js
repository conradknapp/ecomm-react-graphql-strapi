import React from "react";
import {
  Elements,
  StripeProvider,
  CardElement,
  injectStripe
} from "react-stripe-elements";
import ToastMessage from "./ToastMessage";
import { withRouter } from "react-router-dom";
import { getCart, displayPrice, clearCart } from "../utils";
import Strapi from "strapi-sdk-javascript/build/main";
// prettier-ignore
import { Container, Heading, Box, TextField, Text, Modal, Button } from "gestalt";
const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

class _CheckoutForm extends React.Component {
  state = {
    address: "",
    postalCode: "",
    city: "",
    confirmationEmailAddress: "",
    orderProcessing: false,
    cartItems: [],
    confirmationModal: false,
    toast: false,
    toastMessage: ""
  };

  componentDidMount() {
    this.setState({ cartItems: getCart() });
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
    this.setState({ confirmationModal: true });
  };

  closeModal = () => this.setState({ confirmationModal: false });

  showToast = (toastMessage = "An error occurred", redirect = false) => {
    this.setState({ toast: true, toastMessage });
    setTimeout(
      () =>
        this.setState(
          { toast: false, toastMessage: "" },
          // redirect to home if second argument passed is true
          () => redirect && this.props.history.push("/")
        ),
      5000
    );
  };

  handleSubmitOrder = async () => {
    const {
      address,
      postalCode,
      city,
      cardItems,
      confirmationEmailAddress
    } = this.state;

    this.setState({ orderProcessing: true });
    let token;
    try {
      const response = await this.props.stripe.createToken();
      token = response.token.id;
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
      this.setState({ orderProcessing: false, confirmationModal: false });
      this.showToast("Your order has been successfully submitted!", true);
      clearCart();
    } catch (err) {
      this.setState({ orderProcessing: false, confirmationModal: false });
      this.showToast(err.message);
    }
  };

  render() {
    const {
      orderProcessing,
      cartItems,
      toast,
      toastMessage,
      confirmationModal
    } = this.state;

    return (
      <Container>
        <Box
          display="flex"
          justifyContent="center"
          direction="column"
          alignItems="center"
          shape="rounded"
          margin={8}
          padding={4}
          color="lightWash"
        >
          <Heading color="midnight">Checkout</Heading>

          {/* User Cart */}
          {cartItems.length > 0 ? (
            <React.Fragment>
              <Box
                margin={2}
                display="flex"
                justifyContent="center"
                alignItems="center"
                direction="column"
              >
                <Text italic>{cartItems.length} Items for Checkout</Text>
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
                <Text>Total Amount: {displayPrice(cartItems)}</Text>
              </Box>

              {/* Checkout Form */}
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
                    placeholder="Shipping Address"
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
                    placeholder="City"
                    onChange={this.handleChange}
                  />
                  <TextField
                    id="confirmationEmailAddress"
                    type="email"
                    name="confirmationEmailAddress"
                    placeholder="Email Address for Order Confirmation"
                    onChange={this.handleChange}
                  />
                  <CardElement
                    id="stripe__input"
                    onReady={input => input.focus()}
                  />
                  <button
                    id="stripe__button"
                    type="submit"
                    disabled={orderProcessing}
                  >
                    Submit
                  </button>

                  {/* Confirmation Modal */}
                  {confirmationModal && (
                    <ConfirmationModal
                      orderProcessing={orderProcessing}
                      handleSubmitOrder={this.handleSubmitOrder}
                      closeModal={this.closeModal}
                    />
                  )}
                  <ToastMessage show={toast} message={toastMessage} />
                </form>
              </Box>
            </React.Fragment>
          ) : (
            // Default Text if No Items in Cart
            <Box color="darkWash" shape="rounded" padding={4}>
              <Heading align="center" color="watermelon" size="xs">
                Your cart is empty
              </Heading>
              <Text align="center" italic color="green">
                Add some brews!
              </Text>
            </Box>
          )}
        </Box>
      </Container>
    );
  }
}

const ConfirmationModal = ({
  closeModal,
  handleSubmitOrder,
  orderProcessing
}) => (
  <Modal
    accessibilityCloseLabel="close"
    accessibilityModalLabel="Confirm Your Order"
    heading="Confirm Your Order"
    onDismiss={closeModal}
    footer={
      <Box display="flex" marginLeft={-1} marginRight={-1} justifyContent="end">
        <Box padding={1}>
          <Button
            size="lg"
            color="red"
            text="Submit"
            disabled={orderProcessing}
            onClick={handleSubmitOrder}
          />
        </Box>
        <Box padding={1}>
          <Button
            size="lg"
            text="Cancel"
            disabled={orderProcessing}
            onClick={closeModal}
          />
        </Box>
      </Box>
    }
    role="alertdialog"
    size="sm"
  >
    <Box paddingX={4} paddingY={2}>
      <Text>click Submit to Process Your Order</Text>
      <Text italic>Check your email for receipt</Text>
    </Box>
  </Modal>
);

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

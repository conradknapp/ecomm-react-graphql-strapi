import React from "react";
import { loadCart, displayPrice } from "../utils";

class Cart extends React.Component {
  state = {
    cartItems: []
  };

  componentDidMount() {
    this.setState({ cartItems: loadCart() });
  }

  render() {
    const { cartItems } = this.state;

    return (
      <div>
        <h1>Cart</h1>
        <ul>
          {cartItems.map((el, i) => (
            <li key={i}>
              <p>
                {el.name} - <span>{el.quantity}</span>
              </p>
            </li>
          ))}
        </ul>
        <p>Total {displayPrice(cartItems)}</p>
      </div>
    );
  }
}

export default Cart;

import React from "react";
import { displayPrice } from "../utils";

const Cart = ({ cartItems }) => (
  <Mask shape="rounded" wash>
    <Box display="flex" direction="column" alignItems="center" padding={3}>
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
              {item.name} x {item.quantity} - ${item.quantity * item.price}
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
        {cartItems.length === 0 && <Text>Please select some items</Text>}
        <Text>
          <Link to="/checkout">Checkout</Link>
        </Text>
      </Box>
    </Box>
  </Mask>
);

export default Cart;

export const getToken = () => {
  if (localStorage && localStorage.jwt) {
    return JSON.parse(localStorage.getItem("jwt"));
  } else {
    return null;
  }
};

export const loadCart = () => {
  if (localStorage.cart) {
    return JSON.parse(localStorage.getItem("cart"));
  } else {
    return [];
  }
};

export const displayPrice = items => {
  return items.reduce(
    (accumulator, item) => accumulator + item.price * item.quantity,
    0
  );
};

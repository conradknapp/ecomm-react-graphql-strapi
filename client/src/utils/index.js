const USER_KEY = "userInfo";
const CART_KEY = "cart";
const TOKEN_KEY = "jwt";

/* Auth Token */
export const getToken = (tokenKey = TOKEN_KEY) => {
  if (localStorage) {
    return JSON.parse(localStorage.getItem(tokenKey)) || null;
  }
};

export const setToken = (value, tokenKey = TOKEN_KEY) => {
  if (localStorage) {
    return localStorage.setItem(tokenKey, JSON.stringify(value));
  }
};

export const clearToken = (tokenKey = TOKEN_KEY) => {
  if (localStorage) {
    return localStorage.removeItem(tokenKey);
  }
};

/* User Info */
export const getUserInfo = (userKey = USER_KEY) => {
  if (localStorage) {
    return JSON.parse(localStorage.getItem(userKey)) || null;
  }
};

export const setUserInfo = (value, userKey = USER_KEY) => {
  if (localStorage) {
    return localStorage.setItem(userKey, JSON.stringify(value));
  }
};

export const clearUserInfo = (userKey = USER_KEY) => {
  if (localStorage) {
    return localStorage.removeItem(userKey);
  }
};

/* Cart */
export const getCart = (cartKey = CART_KEY) => {
  if (localStorage) {
    return JSON.parse(localStorage.getItem(cartKey)) || [];
  }
};

export const setCart = (value, cartKey = CART_KEY) => {
  if (localStorage) {
    return localStorage.setItem(cartKey, JSON.stringify(value));
  }
};

export const clearCart = (cartKey = CART_KEY) => {
  if (localStorage) {
    localStorage.removeItem(cartKey);
  }
};

export const displayPrice = items => {
  return `$${items
    .reduce((acc, item) => acc + item.price * item.quantity, 0)
    .toFixed(2)}`;
};

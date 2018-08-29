const USER_INFO = "userInfo";
const TOKEN_KEY = "jwtToken";

export const getToken = () => {
  if (localStorage) {
    return JSON.parse(localStorage.getItem("jwt"));
  } else {
    return null;
  }
};

export const setToken = (value = "", tokenKey = TOKEN_KEY) => {
  if (localStorage) {
    return localStorage.setItem(tokenKey, JSON.stringify(value));
  }
  return null;
};

export const setUserInfo = (value = "", userInfo = USER_INFO) => {
  if (localStorage) {
    return localStorage.setItem(userInfo, JSON.stringify(value));
  }
  return null;
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

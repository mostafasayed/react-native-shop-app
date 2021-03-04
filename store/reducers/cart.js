import CartItem from "../../models/cart-item";
import { ADD_TO_CART, REMOVE_FROM_CART } from "../actions/cart";
import { ADD_ORDER } from "../actions/orders";
import { DELETE_PRODUCT } from "../actions/products";

const initialState = {
  items: {},
  totalAmount: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const addedProd = action.product;
      const prodPrice = addedProd.price;
      const prodTitle = addedProd.title;
      if (state.items[addedProd.id]) {
        const updatedCartItem = new CartItem(
          state.items[addedProd.id].quantity + 1,
          prodPrice,
          prodTitle,
          state.items[addedProd.id].sum + prodPrice
        );
        return {
          ...state,
          items: { ...state.items, [addedProd.id]: updatedCartItem },
          totalAmount: state.totalAmount + prodPrice,
        };
      } else {
        const newCartItem = new CartItem(1, prodPrice, prodTitle, prodPrice);
        return {
          ...state,
          items: { ...state.items, [addedProd.id]: newCartItem },
          totalAmount: state.totalAmount + prodPrice,
        };
      }
    case REMOVE_FROM_CART:
      const selectedItem = state.items[action.pid];
      const currentQty = selectedItem.quantity;
      const currentPrice = selectedItem.productPrice;
      let updatedCartItems;
      if (currentQty > 1) {
        const updatedCartItem = new CartItem(
          currentQty - 1,
          currentPrice,
          selectedItem.productTitle,
          selectedItem.sum - currentPrice
        );
        updatedCartItems = { ...state.items, [action.pid]: updatedCartItem };
      } else {
        updatedCartItems = { ...state.items };
        delete updatedCartItems[action.pid];
      }
      return {
        ...state,
        items: updatedCartItems,
        totalAmount: state.totalAmount - currentPrice,
      };
    case DELETE_PRODUCT:
      if (!state.items[action.pid]) {
        return state;
      }
      const updatedItems = { ...state.items };
      const itemTotal = updatedItems[action.pid].sum;
      delete updatedItems[action.pid];
      return {
        ...state,
        items: updatedItems,
        totalAmount: state.totalAmount - itemTotal,
      };
    case ADD_ORDER:
      return initialState;
    default:
      return state;
  }
};

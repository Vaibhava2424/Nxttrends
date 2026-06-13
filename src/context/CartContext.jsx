import { useReducer, useEffect } from 'react';
import Cookies from 'js-cookie';
import { CartContext } from './CartContextCreate';

const CART_COOKIE_KEY = 'nxttrends_cart';

const getInitialState = () => {
  try {
    const savedCart = Cookies.get(CART_COOKIE_KEY);
    if (savedCart) {
      return JSON.parse(savedCart);
    }
  } catch (error) {
    console.error('Error reading cart from cookies:', error);
  }
  return {
    items: [],
    totalPrice: 0,
    totalItems: 0,
  };
};

const initialState = getInitialState();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      const quantityToAdd = action.payload.quantity || 1;

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + quantityToAdd }
              : item
          ),
          totalItems: state.totalItems + quantityToAdd,
          totalPrice:
            state.totalPrice + action.payload.price * quantityToAdd,
        };
      }

      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: quantityToAdd }],
        totalItems: state.totalItems + quantityToAdd,
        totalPrice: state.totalPrice + action.payload.price * quantityToAdd,
      };
    }

    case 'REMOVE_FROM_CART': {
      const itemToRemove = state.items.find(
        (item) => item.id === action.payload
      );
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
        totalItems: state.totalItems - (itemToRemove?.quantity || 1),
        totalPrice:
          state.totalPrice -
          (itemToRemove?.price * itemToRemove?.quantity || 0),
      };
    }

    case 'UPDATE_QUANTITY': {
      const item = state.items.find(
        (item) => item.id === action.payload.id
      );
      const quantityDifference = action.payload.quantity - item.quantity;

      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        totalItems: state.totalItems + quantityDifference,
        totalPrice: state.totalPrice + item.price * quantityDifference,
      };
    }

    case 'CLEAR_CART':
      return {
        items: [],
        totalPrice: 0,
        totalItems: 0,
      };

    case 'LOAD_FROM_COOKIE':
      return action.payload;

    default:
      return state;
  }
};

 const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Save to cookies whenever state changes
  useEffect(() => {
    try {
      Cookies.set(CART_COOKIE_KEY, JSON.stringify(state), { expires: 7 });
    } catch (error) {
      console.error('Error saving cart to cookies:', error);
    }
  }, [state]);

  const addToCart = (product) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: product,
    });
  };

  const removeFromCart = (productId) => {
    dispatch({
      type: 'REMOVE_FROM_CART',
      payload: productId,
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity > 0) {
      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: { id: productId, quantity },
      });
    }
  };

  const clearCart = () => {
    dispatch({
      type: 'CLEAR_CART',
    });
  };

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        totalPrice: state.totalPrice,
        totalItems: state.totalItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
import Product from "../../models/product";
import { firebaseUrl } from "../../constants/API";
export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const SET_PRODUCTS = "SET_PRODUCTS";

export const fetchProducts = () => {
  return async (dispatch) => {
    try {
      const response = await fetch(`${firebaseUrl}/products.json`);
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const responseData = await response.json();
      const loadedProducts = [];
      for (const key in responseData) {
        loadedProducts.push(
          new Product(
            key,
            "u1",
            responseData[key].title,
            responseData[key].imageUrl,
            responseData[key].description,
            responseData[key].price
          )
        );
      }
      return dispatch({
        type: SET_PRODUCTS,
        products: loadedProducts,
      });
    } catch (error) {
      throw error;
    }
  };
};

export const deleteProduct = (productId) => {
  return async (dispatch) => {
    const response = await fetch(`${firebaseUrl}/products/${productId}.json`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Some error occured!");
    }
    dispatch({ type: DELETE_PRODUCT, pid: productId });
  };
};

export const createProduct = (title, imageUrl, description, price) => {
  return async (dispatch) => {
    const response = await fetch(`${firebaseUrl}/products.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, imageUrl, description, price }),
    });
    if (!response.ok) {
      throw new Error("Some error occured!");
    }
    const responseData = await response.json();
    return dispatch({
      type: CREATE_PRODUCT,
      productData: {
        id: responseData.name,
        title,
        imageUrl,
        description,
        price,
      },
    });
  };
};

export const updateProduct = (id, title, imageUrl, description) => {
  return async (dispatch) => {
    const response = await fetch(`${firebaseUrl}/products/${id}.json`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, imageUrl, description }),
    });
    if (!response.ok) {
      throw new Error("Some thing went wrong!");
    }
    dispatch({
      type: UPDATE_PRODUCT,
      productData: { id, title, imageUrl, description },
    });
  };
};

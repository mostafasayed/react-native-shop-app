import React, { useState, useCallback, useEffect, useReducer } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import HeaderButton from "../../components/UI/HeaderButton";
import Input from "../../components/UI/Input";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { createProduct, updateProduct } from "../../store/actions/products";
import Colors from "../../constants/Colors";

const formReducer = (state, action) => {
  if (action.type === "UPDATE") {
    const updatesValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatesValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updateFormIsValid = true;
    for (const key in updatesValidities) {
      updateFormIsValid = updateFormIsValid && updatesValidities[key];
    }
    return {
      inputValues: updatesValues,
      inputValidities: updatesValidities,
      formIsValid: updateFormIsValid,
    };
  }
  return state;
};

const EditProductScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const productId = props.navigation.getParam("productId");

  const editedProduct = useSelector((state) =>
    state.products.userProducts.find((product) => product.id == productId)
  );

  const [formState, reducerDispatch] = useReducer(formReducer, {
    inputValues: {
      title: editedProduct ? editedProduct.title : "",
      imageUrl: editedProduct ? editedProduct.imageUrl : "",
      description: editedProduct ? editedProduct.description : "",
      price: "",
    },
    inputValidities: {
      title: editedProduct ? true : false,
      imageUrl: editedProduct ? true : false,
      description: editedProduct ? true : false,
      price: editedProduct ? true : false,
    },
    formIsValid: editedProduct ? true : false,
  });

  const textChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValid) => {
      reducerDispatch({
        type: "UPDATE",
        value: inputValue,
        isValid: inputValid,
        input: inputIdentifier,
      });
    },
    [reducerDispatch]
  );

  const dispatch = useDispatch();

  const submitHandler = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert("Worng Inputs", "Please check error messages", [
        { text: "Okay" },
      ]);
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      if (editedProduct) {
        await dispatch(
          updateProduct(
            productId,
            formState.inputValues.title,
            formState.inputValues.imageUrl,
            formState.inputValues.description
          )
        );
      } else {
        await dispatch(
          createProduct(
            formState.inputValues.title,
            formState.inputValues.imageUrl,
            formState.inputValues.description,
            +formState.inputValues.price
          )
        );
      }
      props.navigation.goBack();
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  }, [dispatch, productId, formState]);

  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);

  useEffect(() => {
    if (error) Alert.alert("Error", error, [{ text: "Ok" }]);
  }, [error]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  return (
    <ScrollView>
      <View style={styles.form}>
        <Input
          keyboardType="default"
          autoCapitalize="sentences"
          id="title"
          label="Title"
          errorText="Please write a valid title"
          onInputChange={textChangeHandler}
          initialValue={editedProduct ? editedProduct.title : ""}
          initiallyValid={!!editedProduct}
          required
        />
        <Input
          keyboardType="default"
          returnKeyType="next"
          id="imageUrl"
          label="Image URL"
          errorText="Please write a valid Image URL"
          onInputChange={textChangeHandler}
          initialValue={editedProduct ? editedProduct.imageUrl : ""}
          initiallyValid={!!editedProduct}
          required
        />
        {editedProduct ? null : (
          <Input
            keyboardType="decimal-pad"
            returnKeyType="next"
            id="price"
            label="Price"
            errorText="Please write a valid price"
            onInputChange={textChangeHandler}
            autoCorrect
            required
            min={0.1}
          />
        )}
        <Input
          keyboardType="default"
          autoCapitalize="sentences"
          id="description"
          label="Description"
          errorText="Please write a valid Description"
          onInputChange={textChangeHandler}
          initialValue={editedProduct ? editedProduct.description : ""}
          initiallyValid={!!editedProduct}
          required
          multiline
          numberOfLines={3}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  form: {
    margin: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

EditProductScreen.navigationOptions = (navData) => {
  const submitFn = navData.navigation.getParam("submit");
  return {
    headerTitle: navData.navigation.getParam("productId")
      ? "Edit Product"
      : "Add Product",
    headerRight: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Save"
          iconName="md-checkmark"
          size={24}
          onPress={submitFn}
        />
      </HeaderButtons>
    ),
  };
};
export default EditProductScreen;

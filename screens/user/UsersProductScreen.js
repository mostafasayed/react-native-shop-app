import React, { useState, useEffect } from "react";
import { FlatList, Button, Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { deleteProduct } from "../../store/actions/products";
import HeaderButton from "../../components/UI/HeaderButton";
import ProductItem from "../../components/shop/ProductItem";
import Colors from "../../constants/Colors";

const UsersProductScreen = (props) => {
  const [error, setError] = useState();
  const userProducts = useSelector((state) => state.products.userProducts);
  const dispatch = useDispatch();

  const deleteHandler = (id) => {
    Alert.alert("Are you sure!", "Do you really want to delete it", [
      { text: "No", style: "default" },
      {
        text: "Yes",
        style: "destructive",
        onPress: async () => {
          try {
            await dispatch(deleteProduct(id));
          } catch (err) {
            setError(err.message);
          }
        },
      },
    ]);
  };
  useEffect(() => {
    if (error) Alert.alert("Error", error, [{ text: "Ok" }]);
  }, [error]);
  return (
    <FlatList
      data={userProducts}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <ProductItem
          imageUrl={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() =>
            props.navigation.navigate("EditProduct", {
              productId: itemData.item.id,
            })
          }
        >
          <Button
            color={Colors.primary}
            title="Delete"
            onPress={deleteHandler.bind(this, itemData.item.id)}
          />
          <Button
            color={Colors.primary}
            title="Edit"
            onPress={() =>
              props.navigation.navigate("EditProduct", {
                productId: itemData.item.id,
              })
            }
          />
        </ProductItem>
      )}
    />
  );
};

UsersProductScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Your Products",
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="menu"
          iconName="md-menu"
          onPress={() => navData.navigation.toggleDrawer()}
        />
      </HeaderButtons>
    ),
    headerRight: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="add"
          iconName="md-create"
          onPress={() => navData.navigation.navigate("EditProduct")}
        />
      </HeaderButtons>
    ),
  };
};
export default UsersProductScreen;

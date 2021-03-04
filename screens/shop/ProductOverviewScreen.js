import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";
import { addToCart } from "../../store/actions/cart";
import ProductItem from "../../components/shop/ProductItem";
import Colors from "../../constants/Colors";
import { fetchProducts } from "../../store/actions/products";

const ProductsOverviewScreen = (props) => {
  const [isLoading, setIsLoaded] = useState(false);
  const [error, setError] = useState();

  const onSelectHandler = (id, title) => {
    props.navigation.navigate("ProdcutDetail", {
      productId: id,
      productTitle: title,
    });
  };

  const products = useSelector((state) => state.products.availableProducts);

  const dispatch = useDispatch();

  const loadedProducts = useCallback(async () => {
    try {
      setError();
      setIsLoaded(true);
      await dispatch(fetchProducts());
      setIsLoaded(false);
    } catch (err) {
      setError(err.message);
    }
  }, [dispatch, setIsLoaded, setError]);

  useEffect(() => {
    const willFocusEvent = props.navigation.addListener(
      "willFocus",
      loadedProducts
    );
    return () => {
      willFocusEvent.remove();
    };
  }, [loadedProducts]);

  useEffect(() => {
    loadedProducts();
  }, [dispatch, loadedProducts]);

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Something went wrong!</Text>
        <Button
          title="Try Again"
          onPress={loadedProducts}
          color={Colors.primary}
        />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!isLoading && products.length == 0) {
    return (
      <View style={styles.centered}>
        <Text>No products available, Go and add some</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      renderItem={(itemData) => (
        <ProductItem
          imageUrl={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => {
            onSelectHandler(itemData.item.id, itemData.item.title);
          }}
        >
          <Button
            color={Colors.primary}
            title="View Details"
            onPress={() => {
              onSelectHandler(itemData.item.id, itemData.item.title);
            }}
          />
          <Button
            color={Colors.primary}
            title="To Cart"
            onPress={() => {
              dispatch(addToCart(itemData.item));
            }}
          />
        </ProductItem>
      )}
    />
  );
};

ProductsOverviewScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "All Products",
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
          title="cart"
          iconName="md-cart"
          onPress={() => navData.navigation.navigate("Cart")}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProductsOverviewScreen;

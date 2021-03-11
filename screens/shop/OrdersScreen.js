import React, { useState, useEffect } from "react";
import {
  Alert,
  FlatList,
  View,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";
import OrderItem from "../../components/shop/OrderItem";
import { fetchOrders } from "../../store/actions/orders";
import Colors from "../../constants/Colors";

const OrdersScreen = (props) => {
  const [isLoading, setIsLoaded] = useState(false);
  const [error, setError] = useState();
  const orders = useSelector((state) => state.orders.orders);

  const dispatch = useDispatch();

  const loadOrdersHandler = async () => {
    setError();
    setIsLoaded(true);
    try {
      await dispatch(fetchOrders());
    } catch (err) {
      setError(err.message);
    }
    setIsLoaded(false);
  };
  useEffect(() => {
    loadOrdersHandler();
  }, [dispatch]);

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
    <FlatList
      data={orders}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <OrderItem
          amount={itemData.item.totalAmount}
          date={itemData.item.readableDate}
          items={itemData.item.items}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

OrdersScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Your Order",
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="menu"
          iconName="md-menu"
          onPress={() => navData.navigation.toggleDrawer()}
        />
      </HeaderButtons>
    ),
  };
};

export default OrdersScreen;

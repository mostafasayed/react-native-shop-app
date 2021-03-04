import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import { createDrawerNavigator } from "react-navigation-drawer";
import { createAppContainer } from "react-navigation";
import ProductsOverviewScreen from "../screens/shop/ProductOverviewScreen";
import ProuctDetailScreen from "../screens/shop/ProdcutDetailScreen";
import CartScreen from "../screens/shop/CartScreen";
import OrdersScreen from "../screens/shop/OrdersScreen";
import UsersProductScreen from "../screens/user/UsersProductScreen";
import EditProductScreen from "../screens/user/EditProductScreen";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";

const stackNavigationOptions = {
  headerTintColor: "white",
  headerStyle: {
    backgroundColor: Colors.primary,
  },
  headerTitleStyle: {
    fontFamily: "open-sans-bold",
  },
  headerBackTitleStyle: {
    fontFamily: "open-sans",
  },
};

const ProductsNavigator = createStackNavigator(
  {
    ProductOverview: ProductsOverviewScreen,
    ProdcutDetail: ProuctDetailScreen,
    Cart: CartScreen,
  },
  {
    navigationOptions: {
      drawerIcon: (drawerConfig) => (
        <Ionicons name="md-create" size={24} color={drawerConfig.tintColor} />
      ),
    },
    defaultNavigationOptions: stackNavigationOptions,
  }
);

const OrdersNavigator = createStackNavigator(
  {
    Orders: OrdersScreen,
  },
  {
    navigationOptions: {
      drawerIcon: (drawerConfig) => (
        <Ionicons name="md-cart" size={24} color={drawerConfig.tintColor} />
      ),
    },
    defaultNavigationOptions: stackNavigationOptions,
  }
);

const AdminNavigator = createStackNavigator(
  {
    UserProducts: UsersProductScreen,
    EditProduct: EditProductScreen,
  },
  {
    navigationOptions: {
      drawerIcon: (drawerConfig) => (
        <Ionicons name="md-cart" size={24} color={drawerConfig.tintColor} />
      ),
    },
    defaultNavigationOptions: stackNavigationOptions,
  }
);

const ShopNavigator = createDrawerNavigator(
  {
    Products: ProductsNavigator,
    Orders: OrdersNavigator,
    Admin: AdminNavigator,
  },
  {
    contentOptions: {
      activeTintColor: Colors.primary,
    },
  }
);

export default createAppContainer(ShopNavigator);

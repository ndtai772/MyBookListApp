import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { routesName } from "./routes";
import { unAuthentication } from "../features/unauthentication";
import { NavigationContainer } from "@react-navigation/native";
import BottomTabBars from "./bottomNavigation";
import { bottom } from "../features/authentication";
import CategoryScreen from "../features/authentication/discovery/CategoryView";
import SearchScreen from "../features/authentication/home/SearchView";
const Stack = createStackNavigator();

const RootStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={routesName.LOGIN_SCREEN}
      >
        <Stack.Screen name={routesName.BOTTOM_BAR} component={BottomTabBars} />

        <Stack.Screen
          name={routesName.EDIT_PROFILE_SCREEN}
          component={bottom.EditProfileScreen}
        />
        <Stack.Screen
          name={routesName.CATEGORY_DETAIL_SCREEN}
          component={CategoryScreen}
        />
        <Stack.Screen
          name={routesName.SEARCH_SCREEN}
          component={SearchScreen}
        />
        <Stack.Screen
          name={routesName.CHANGE_PASSWORD_SCREEN}
          component={bottom.ChangePasswordScreen}
        />
        <Stack.Screen
          name={routesName.BOOK_DETAIL_SCREEN}
          component={bottom.BookDetail}
        />

        <Stack.Screen
          name={routesName.LOGIN_SCREEN}
          component={unAuthentication.LOGIN_SCREEN}
        />
        <Stack.Screen
          name={routesName.SIGNUP_SCREEN}
          component={unAuthentication.SIGNUP_SCREEN}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootStack;

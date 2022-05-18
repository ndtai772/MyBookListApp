import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { routesName } from "./routes";
import { unAuthentication } from "../features/unauthentication";
import { NavigationContainer } from "@react-navigation/native";
import BottomTabBars from "./bottomNavigation";
import { bottom } from "../features/authentication";
import { sdk } from "../core";
const Stack = createStackNavigator();

const RootStack = () => {
  const [initialRoute, setInitialRoute] = useState(routesName.LOGIN_SCREEN);

  useEffect(() => {
    sdk.renewAccessToken()
      .catch(_ => setInitialRoute(routesName.LOGIN_SCREEN))
  }, [])

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={initialRoute}
      >
        <Stack.Screen name={routesName.BOTTOM_BAR} component={BottomTabBars} />

        <Stack.Screen
          name={routesName.EDIT_PROFILE_SCREEN}
          component={bottom.EditProfileScreen}
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

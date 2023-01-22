import * as React from "react";
import MainContainer from "./navigation/MainContainer";
import SignUpScreen from "./navigation/screens/SignUpScreen";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={SignUpScreen}
          options={{
            headerTransparent: true,
            headerTitle: "",
            headerBackTitleVisible: false,
            detachPreviousScreen: true,
          }}
        />
        <Stack.Screen
          name="Main"
          component={MainContainer}
          options={{
            headerTransparent: true,
            headerTitle: "",
            headerBackTitleVisible: false,
            detachPreviousScreen: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

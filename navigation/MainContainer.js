import * as React from "react";
import { StyleSheet, View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

// Screens
import MoodScreen from "./screens/MoodScreen";
import SocialScreen from "./screens/SocialScreen";

const Tab = createBottomTabNavigator();

function MainContainer() {
  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color }) => {
            let iconName;

            if (route.name === "Mood") {
              iconName = focused ? "happy" : "happy-outline";
            } else if (route.name === "Social") {
              iconName = focused ? "people" : "people-outline";
            }

            // You can return any component that you like here!
            return (
              <Ionicons
                name={iconName}
                color={color}
                size={25}
                style={{ justifyContent: "space-between" }}
              />
            );
          },
          tabBarActiveTintColor: "black",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            bottom: 35,
            left: 40,
            right: 40,
            position: "absolute",
            borderRadius: 15,
            backgroundColor: "#ffffff",
            ...styles.shadow,
          },
        })}
      >
        <Tab.Screen
          name="Mood"
          component={MoodScreen}
          options={{
            headerTransparent: true,
            headerBackTitleVisible: false,
          }}
        />
        <Tab.Screen
          name="Social"
          component={SocialScreen}
          options={{
            headerTransparent: true,
            headerBackTitleVisible: false,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});

export default MainContainer;

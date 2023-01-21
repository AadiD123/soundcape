import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

// Screens
import MoodScreen from "./screens/MoodScreen";
import SocialScreen from "./screens/SocialScreen";

const Tab = createBottomTabNavigator();

function MainContainer() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Mood") {
              iconName = focused ? "happy" : "happy-outline";
            } else if (route.name === "Social") {
              iconName = focused ? "people" : "people-outline";
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen name="Mood" component={MoodScreen} />
        <Tab.Screen name="Social" component={SocialScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default MainContainer;

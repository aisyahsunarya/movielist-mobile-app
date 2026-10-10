import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./screens/HomeScreen";
import DetailScreen from "./screens/DetailScreen";
import CreateScreen from "./screens/CreateScreen";
import EditScreen from "./screens/EditScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={{ title: "Movie Detail" }}
        />

        <Stack.Screen
          name="Create"
          component={CreateScreen}
          options={{ title: "Add Movie" }}
        />

        <Stack.Screen
          name="Edit"
          component={EditScreen}
          options={{ title: "Edit Movie" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
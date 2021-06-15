import React from "react";
import { NativeModules, Platform, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import ScannerScreen from "../screens/ScannerScreen";
import InvoicesScreen from "../screens/InvoicesScreen";
import SettingsButton from "../components/SettingsButton";
import SettingsScreen from "../screens/SettingsScreen";
import LanguagesScreen from "../screens/LanguageScreen";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import useLanguageState from "../hooks/useLanguageState";

const Stack = createStackNavigator();

interface RootNavigatorProps {}

const RootNavigator: React.FC<RootNavigatorProps> = () => {
  const [, , loaded] = useLanguageState(); // init language from app locale

  if (!loaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Scanner"
          component={ScannerScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Invoices"
          component={InvoicesScreen}
          options={{ headerRight: () => <SettingsButton /> }}
        />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Language" component={LanguagesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({});

export default RootNavigator;

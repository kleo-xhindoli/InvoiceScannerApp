import React from "react";
import { View, StyleSheet } from "react-native";
import IconButton from "./ui/IconButton";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

interface SettingsButtonProps {}

const SettingsButton: React.FC<SettingsButtonProps> = () => {
  const navigation = useNavigation();

  const navToSettings = () => {
    navigation.navigate("Settings");
  };

  return (
    <IconButton onPress={navToSettings}>
      <Feather name="settings" size={20} />
    </IconButton>
  );
};

const styles = StyleSheet.create({});

export default SettingsButton;

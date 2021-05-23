import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  Text,
} from "react-native";
import Colors from "../../constants/theme/Colors";
import FontSizes from "../../constants/theme/FontSizes";
import FontWeights from "../../constants/theme/FontWeights";
import Spacing from "../../constants/theme/Spacing";
import { FeatherIcon } from "../../types/icons";

interface TextButtonProps {
  label: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  color?: string;
  leftIcon?: FeatherIcon;
  iconSize?: number;
}

export default function TextButton({
  label,
  onPress,
  style,
  color,
  leftIcon,
  iconSize = 18,
}: TextButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
      {leftIcon && (
        <Feather
          name={leftIcon}
          size={iconSize}
          color={color}
          style={{ marginRight: Spacing[2] }}
        />
      )}
      <Text style={[styles.text, { color: color || Colors.gray[800] }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing[6],
    paddingVertical: Spacing[3],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    textAlign: "center",
    fontWeight: FontWeights.bold,
    fontSize: FontSizes.base.size,
  },
});

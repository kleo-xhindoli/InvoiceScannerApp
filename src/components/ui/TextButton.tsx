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

interface TextButtonProps {
  label: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  color?: string;
}

export default function TextButton({
  label,
  onPress,
  style,
  color,
}: TextButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
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

  },
  text: {
    textAlign: "center",
    fontWeight: FontWeights.bold,
    fontSize: FontSizes.base.size,
  },
});

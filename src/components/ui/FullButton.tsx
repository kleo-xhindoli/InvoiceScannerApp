import React from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  Text,
  TouchableOpacityProps,
} from "react-native";
import Radii from "../../constants/theme/Radii";
import Spacing from "../../constants/theme/Spacing";
import Colors from "../../constants/theme/Colors";
import FontWeights from "../../constants/theme/FontWeights";
import FontSizes from "../../constants/theme/FontSizes";

interface FullButtonProps extends TouchableOpacityProps {
  bgColor?: string;
  text?: string;
  textColor?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export default function FullButton({
  icon,
  bgColor = Colors.brand[600],
  text,
  textColor = Colors.white,
  style,
  children,
  ...rest
}: FullButtonProps) {
  const styles = makeStyles(bgColor, textColor);
  return (
    <TouchableOpacity style={[styles.button, style]} {...rest}>
      {icon}
      {text ? <Text style={styles.text}>{text}</Text> : children}
    </TouchableOpacity>
  );
}

const makeStyles = (bgCol: string, txtCol: string) =>
  StyleSheet.create({
    button: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: bgCol,
      paddingHorizontal: Spacing[6],
      paddingVertical: Spacing[3],
      borderRadius: Radii.full,
      // borderWidth: 1,
      // borderColor: Colors.gray[200],
      textAlign: "center",
    },
    text: {
      color: txtCol,
      fontWeight: FontWeights.medium,
      fontSize: FontSizes.base.size,
    },
  });

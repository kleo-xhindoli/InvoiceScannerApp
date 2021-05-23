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
import { FeatherIcon } from "../../types/icons";
import { Feather } from "@expo/vector-icons";

interface FullButtonProps extends TouchableOpacityProps {
  bgColor?: string;
  label?: string;
  labelColor?: string;
  leftIcon?: FeatherIcon;
  iconSize?: number;
  children?: React.ReactNode;
}

export default function FullButton({
  leftIcon,
  iconSize = 18,
  bgColor = Colors.brand[600],
  label,
  labelColor = Colors.white,
  style,
  children,
  ...rest
}: FullButtonProps) {
  const styles = makeStyles(bgColor, labelColor);
  return (
    <TouchableOpacity style={[styles.button, style]} {...rest}>
      {leftIcon && (
        <Feather
          name={leftIcon}
          size={iconSize}
          color={labelColor}
          style={{ marginRight: Spacing[2] }}
        />
      )}
      {label ? <Text style={styles.text}>{label}</Text> : children}
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

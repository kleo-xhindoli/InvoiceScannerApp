import React from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  Text,
  TouchableOpacityProps,
  ActivityIndicator,
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
  isLoading?: boolean;
  children?: React.ReactNode;
}

export default function FullButton({
  leftIcon,
  iconSize = 18,
  bgColor = Colors.brand[600],
  label,
  labelColor = Colors.white,
  isLoading,
  style,
  disabled,
  children,
  ...rest
}: FullButtonProps) {
  const styles = makeStyles(bgColor, labelColor);
  const isDisabled = disabled || isLoading;
  return (
    <TouchableOpacity
      style={[styles.button, isDisabled && styles.disabled, style]}
      disabled={isDisabled}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={Colors.white}
          style={{ marginRight: Spacing[2] }}
        />
      ) : (
        leftIcon && (
          <Feather
            name={leftIcon}
            size={iconSize}
            color={labelColor}
            style={{ marginRight: Spacing[2] }}
          />
        )
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
    disabled: {
      opacity: 0.7,
    },
    text: {
      color: txtCol,
      fontWeight: FontWeights.medium,
      fontSize: FontSizes.base.size,
    },
  });

import React from "react";
import { Text } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";
import Colors from "../../constants/theme/Colors";
import Spacing from "../../constants/theme/Spacing";
import FontSizes from "../../constants/theme/FontSizes";
import { FeatherIcon } from "../../types/icons";

interface ActionSheetItemProps {
  label: string;
  icon?: FeatherIcon;
  iconColor?: string;
  onPress?: () => void;
}

export default function ActionSheetItem({
  label,
  icon,
  iconColor = Colors.gray[600],
  onPress,
}: ActionSheetItemProps) {
  return (
    <TouchableOpacity style={styles.actionSheetItem} onPress={onPress}>
      {icon && (
        <Icon
          name={icon}
          size={22}
          color={iconColor}
          style={styles.iconStyles}
        />
      )}
      <Text style={styles.actionSheetText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  actionSheetItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing[2],
    paddingLeft: Spacing[1],
    marginRight: Spacing[5],
  },
  iconStyles: {
    marginRight: Spacing[4],
  },
  actionSheetText: {
    fontSize: FontSizes["lg"].size,
    lineHeight: FontSizes["lg"].lineHeight,
  },
});

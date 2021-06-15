import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, StyleSheet, TouchableOpacity, View } from "react-native";
import Colors from "../../constants/theme/Colors";
import FontSizes from "../../constants/theme/FontSizes";
import FontWeights from "../../constants/theme/FontWeights";
import Spacing from "../../constants/theme/Spacing";
import { FeatherIcon } from "../../types/icons";

interface ListItemProps {
  text: string;
  leftIcon?: FeatherIcon;
  rightIcon?: FeatherIcon;
  rightIconColor?: string;
  onPress?: () => void;
}

const ListItem: React.FC<ListItemProps> = ({
  leftIcon,
  rightIcon,
  rightIconColor = Colors.gray[400],
  text,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <View style={styles.leftContainer}>
        {leftIcon && (
          <Feather name={leftIcon} size={20} color={Colors.gray[500]} />
        )}
        <Text style={styles.text}>{text}</Text>
      </View>
      {rightIcon && (
        <Feather name={rightIcon} size={20} color={rightIconColor} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: FontSizes.base.size,
    marginLeft: Spacing[2],
    fontWeight: FontWeights.medium,
    color: Colors.gray[900],
  },
});

export default ListItem;

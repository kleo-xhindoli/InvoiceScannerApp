import React from "react";
import { TouchableHighlight, StyleSheet, View, ViewProps } from "react-native";
import Colors from "../../constants/theme/Colors";
import Radii from "../../constants/theme/Radii";
import Spacing from "../../constants/theme/Spacing";

interface IconButtonProps extends ViewProps {
  onPress?: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({
  children,
  onPress,
  ...rest
}) => {
  return (
    <TouchableHighlight
      style={styles.iconButton}
      underlayColor={Colors.gray[200]}
      onPress={onPress}
    >
      <View {...rest}>{children}</View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    padding: Spacing[3],
    borderRadius: Radii.full,
    overflow: "hidden",
  },
});

export default IconButton;

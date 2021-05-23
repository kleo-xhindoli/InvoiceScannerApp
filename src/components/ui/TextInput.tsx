import React, { useState } from "react";
import { StyleSheet, TextInputProps } from "react-native";
import { TextInput as NativeTextInput } from "react-native-gesture-handler";
import Colors from "../../constants/theme/Colors";
import FontSizes from "../../constants/theme/FontSizes";
import FontWeights from "../../constants/theme/FontWeights";
import Radii from "../../constants/theme/Radii";
import Spacing from "../../constants/theme/Spacing";

const TextInput = React.forwardRef<NativeTextInput, TextInputProps>(
  ({ style, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const focusStyles = { borderWidth: 2, borderColor: Colors.brand[600] };
    return (
      <NativeTextInput
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={[styles.textInput, isFocused && focusStyles, style]}
        ref={ref}
        {...props}
      />
    );
  }
);

const styles = StyleSheet.create({
  textInput: {
    backgroundColor: Colors.gray[100],
    borderRadius: Radii.lg,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    fontWeight: FontWeights.medium,
    fontSize: FontSizes.base.size,
  },
});

export default TextInput;

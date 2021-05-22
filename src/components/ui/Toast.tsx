import React from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import Colors from "../../constants/theme/Colors";
import FontSizes from "../../constants/theme/FontSizes";
import FontWeights from "../../constants/theme/FontWeights";
import Layers from "../../constants/theme/Layers";
import Radii from "../../constants/theme/Radii";
import Spacing from "../../constants/theme/Spacing";

interface ToastProps {
  text: string;
  opacity?: Animated.Value;
}

export function Toast({ text, opacity }: ToastProps) {
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.background, { opacity }]}>
        <Text style={styles.text}>{text}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing[4],
    position: "absolute",
    top: Spacing[12],
    flexDirection: "row",
    justifyContent: "center",
    zIndex: Layers.toast,
    width: "100%",
  },
  background: {
    backgroundColor: Colors.gray[800],
    borderRadius: Radii.lg,
    paddingHorizontal: Spacing[6],
    paddingVertical: Spacing[3],
    maxWidth: 350,
  },
  text: {
    color: Colors.white,
    fontWeight: FontWeights.bold,
    fontSize: FontSizes.base.size,
    lineHeight: FontSizes.base.lineHeight,
  },
});

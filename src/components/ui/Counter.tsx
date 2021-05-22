import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Animated,
  TouchableOpacity,
} from "react-native";
import Colors from "../../constants/theme/Colors";
import FontSizes from "../../constants/theme/FontSizes";
import FontWeights from "../../constants/theme/FontWeights";
import Radii from "../../constants/theme/Radii";

interface CounterProps {
  value: number;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

const Counter: React.FC<CounterProps> = ({ value, style, onPress }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      fadeAnim.setValue(1);
    });

    Animated.timing(scaleAnim, {
      toValue: 1.3,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      scaleAnim.setValue(1);
    });
  }, [fadeAnim, scaleAnim, value]);

  return (
    <View style={[{ position: "relative" }, style]}>
      <Animated.View
        style={[
          styles.pulse,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      />
      <TouchableOpacity onPress={onPress} style={styles.counterContainer}>
        <Text style={styles.counterText}>{value}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  counterContainer: {
    backgroundColor: Colors.brand[500],
    borderRadius: Radii.full,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  pulse: {
    position: "absolute",
    backgroundColor: Colors.brand[500],
    borderRadius: Radii.full,
    width: 50,
    height: 50,
  },
  counterText: {
    color: Colors.white,
    fontSize: FontSizes.lg.size,
    fontWeight: FontWeights.bold,
    textAlign: "center",
  },
});

export default Counter;

import React from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Platform,
  NativeModules,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../types/stack";

import { useTranslation } from "react-i18next";
import ListItem from "../components/ui/ListItem";
import FontSizes from "../constants/theme/FontSizes";
import FontWeights from "../constants/theme/FontWeights";
import Spacing from "../constants/theme/Spacing";
import Colors from "../constants/theme/Colors";
import { useEffect } from "react";

type SettingsScreenProps = StackScreenProps<RootStackParamList, "Settings">;

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();

  useEffect(() => {
    const deviceLanguage =
      Platform.OS === "ios"
        ? NativeModules.SettingsManager.settings.AppleLocale ||
          NativeModules.SettingsManager.settings.AppleLanguages[0]
        : NativeModules.I18nManager.localeIdentifier;

    console.log(deviceLanguage);
  }, []);

  const navToLanguage = () => {
    navigation.navigate("Language");
  };

  const navToAppInfo = () => {
    navigation.navigate("AppInfo");
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.heading}>{t("settings.general")}</Text>
        <ListItem
          leftIcon="globe"
          rightIcon="chevron-right"
          text={t("common.language")}
          onPress={navToLanguage}
        />
        <ListItem
          leftIcon="info"
          rightIcon="chevron-right"
          text={t("settings.about")}
        />
        <ListItem
          leftIcon="smartphone"
          rightIcon="chevron-right"
          text={t("settings.appInfo")}
          onPress={navToAppInfo}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingVertical: Spacing[2],
  },
  heading: {
    fontSize: FontSizes.lg.size,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing[2],
    paddingHorizontal: Spacing[2],
  },
});

export default SettingsScreen;

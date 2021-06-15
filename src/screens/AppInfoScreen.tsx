import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../types/stack";
import Constants from "expo-constants";

import { useTranslation } from "react-i18next";
import ListItem from "../components/ui/ListItem";
import Spacing from "../constants/theme/Spacing";
import Colors from "../constants/theme/Colors";

type AppInfoScreenProps = StackScreenProps<RootStackParamList, "AppInfo">;

const AppInfoScreen: React.FC<AppInfoScreenProps> = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <ScrollView>
        <ListItem
          text={t("settings.appVersion", {
            version: Constants.manifest.version,
          })}
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
});

export default AppInfoScreen;

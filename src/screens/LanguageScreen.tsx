import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../types/stack";

import { useTranslation } from "react-i18next";
import ListItem from "../components/ui/ListItem";
import Spacing from "../constants/theme/Spacing";
import Colors from "../constants/theme/Colors";
import useLanguageState from "../hooks/useLanguageState";

type LanguagesScreenProps = StackScreenProps<RootStackParamList, "Language">;

const LanguagesScreen: React.FC<LanguagesScreenProps> = () => {
  const { t } = useTranslation();
  const [lang, setLang] = useLanguageState();

  return (
    <View style={styles.container}>
      <ScrollView>
        <ListItem
          rightIcon={lang === "en" ? "check" : undefined}
          rightIconColor={Colors.brand[600]}
          text={t("common.english")}
          onPress={() => setLang("en")}
        />
        <ListItem
          rightIcon={lang === "al" ? "check" : undefined}
          rightIconColor={Colors.brand[600]}
          text={t("common.albanian")}
          onPress={() => setLang("al")}
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

export default LanguagesScreen;

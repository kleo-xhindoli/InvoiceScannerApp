import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, NativeModules } from "react-native";
import create from "zustand";

type Lang = "en" | "al";

interface State {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const useLanguage = create<State>((set) => {
  return {
    lang: "al",
    setLang(lang) {
      set({ lang });
    },
  };
});

function getAppLocale(): string {
  const deviceLanguage =
    Platform.OS === "ios"
      ? NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0] //iOS 13
      : NativeModules.I18nManager.localeIdentifier;

  return deviceLanguage;
}

export default function useLanguageState() {
  const { i18n } = useTranslation();
  const { lang, setLang } = useLanguage();
  const [loaded, setLoaded] = useState(false);

  const setLanguage = (lang: Lang) => {
    setLang(lang);
    AsyncStorage.setItem("lang", lang);
    i18n.changeLanguage(lang);
  };

  useEffect(() => {
    const locale = getAppLocale();
    const isAlbanian = locale.toLowerCase().includes("al");

    AsyncStorage.getItem("lang").then((lang) => {
      if (!lang) {
        setLanguage(isAlbanian ? "al" : "en");
      } else {
        setLanguage(lang as Lang);
      }
      setLoaded(true);
    });
  }, []);

  return [lang, setLanguage, loaded] as const;
}

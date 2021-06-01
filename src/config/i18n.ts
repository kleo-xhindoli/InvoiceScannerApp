import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../../assets/locales/en/translation.json";
import al from "../../assets/locales/al/translation.json";

const resources = {
  en: {
    translation: en,
  },
  al: {
    translation: al,
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "al",

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;

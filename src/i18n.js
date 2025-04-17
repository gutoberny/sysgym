import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ptTranslation from "./locales/pt.json";
import enTranslation from "./locales/en.json";
import esTranslation from "./locales/es.json";

// Configurações de inicialização do i18next
i18n.use(initReactI18next).init({
  resources: {
    pt: {
      translation: ptTranslation,
    },
    en: {
      translation: enTranslation,
    },
    es: {
      translation: esTranslation,
    },
  },
  lng: "pt", // Idioma padrão
  fallbackLng: "pt",
  interpolation: {
    escapeValue: false, // Reativo com React
  },
});

export default i18n;

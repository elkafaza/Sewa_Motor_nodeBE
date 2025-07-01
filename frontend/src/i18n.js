import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enLogin from './locales/en/login.json';
import enHome from './locales/en/home.json';
import idLogin from './locales/id/login.json';
import idHome from './locales/id/home.json';

const resources = {
  en: {
    login: enLogin,
    home: enHome,
  },
  id: {
    login: idLogin,
    home: idHome,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'id', // default bahasa
    fallbackLng: 'en',
    ns: ['login', 'home'],         // ✅ namespace list
    defaultNS: 'home',             // ✅ default pakai 'home'
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

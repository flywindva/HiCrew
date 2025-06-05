import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import es from './es.json';
import en from './en.json';
import fr from './fr.json';
import pt from './pt.json';
import it from './it.json';
import ca from './ca.json';
import eu from './eu.json';
import gl from './gl.json';

const resources = {
    ES: es,
    EN: en,
    FR: fr,
    PT: pt,
    IT: it,
    CA: ca,
    EU: eu,
    GL: gl,
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'EN',
        detection: {
            order: ['localStorage', 'navigator'],
            lookupLocalStorage: 'language',
        },
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { globalVariables } from '../../config.jsx';

import es from './es.json';
import en from './en.json';
import fr from './fr.json';
import pt from './pt.json';
import it from './it.json';
import ca from './ca.json';
import eu from './eu.json';
import gl from './gl.json';

// Function to merge default translations with custom ones
const mergeTranslations = (defaultTranslations, language) => {
    const merged = { ...defaultTranslations.translation };
    
    if (globalVariables.CUSTOM_TRANSLATIONS) {
        Object.keys(globalVariables.CUSTOM_TRANSLATIONS).forEach(key => {
            if (globalVariables.CUSTOM_TRANSLATIONS[key][language]) {
                merged[key] = globalVariables.CUSTOM_TRANSLATIONS[key][language];
            }
        });
    }
    
    return { translation: merged };
};

const resources = {
    ES: mergeTranslations(es, 'ES'),
    EN: mergeTranslations(en, 'EN'),
    FR: mergeTranslations(fr, 'FR'),
    PT: mergeTranslations(pt, 'PT'),
    IT: mergeTranslations(it, 'IT'),
    CA: mergeTranslations(ca, 'CA'),
    EU: mergeTranslations(eu, 'EU'),
    GL: mergeTranslations(gl, 'GL'),
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
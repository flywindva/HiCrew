import { useTranslation } from 'react-i18next';
import { globalVariables } from '../../config.jsx';

export const useCustomTranslations = () => {
    const { i18n } = useTranslation();
    const currentLanguage = i18n.language;

    const getCustomTranslation = (key, fallbackKey = null) => {
        if (globalVariables.CUSTOM_TRANSLATIONS && globalVariables.CUSTOM_TRANSLATIONS[key]) {
            const customTranslation = globalVariables.CUSTOM_TRANSLATIONS[key][currentLanguage];
            if (customTranslation) {
                return customTranslation;
            }
        }

        if (fallbackKey) {
            return fallbackKey;
        }

        return key;
    };

    return { getCustomTranslation };
};

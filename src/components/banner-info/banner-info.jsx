import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import './banner-info.scss';

export function BannerInfo({ titleKey = 'banner.title', messageKey = 'banner.message' }) {
    const {t} = useTranslation();

    return (
        <div className="banner-info">
            <h2>
                <FontAwesomeIcon icon={faCircleExclamation}/> {t(titleKey)}
            </h2>
            <p>{t(messageKey)}</p>
        </div>
    );
}
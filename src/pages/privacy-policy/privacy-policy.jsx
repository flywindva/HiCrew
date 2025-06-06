import './privacy-policy.scss';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function PrivacyPolicy() {
    const { t } = useTranslation();
    const policyVariables = {
        COMPANY_NAME: 'HiCrew',
        LAST_UPDATED_DATE: 'April 28, 2025',
        WEBSITE_URL: 'https://www.example.com',
        LIST_SPECIFIC_PROVIDERS_IF_KNOWN: 'none',
        CONTACT_EMAIL: 'hicrew@example.com',
        SPECIFY_RETENTION_PERIOD: 'two years after account inactivity',
        COOKIE_POLICY_LINK: '/cookie-policy',
        MINIMUM_AGE: '13',
        DPO_EMAIL: 'dpo@example.com',
    };

    return (
        <div className="privacy-policy-container">
            <h1>
                {t('privacy-policy.title').replace('{companyName}', policyVariables.COMPANY_NAME)}
            </h1>
            <p>
                {t('privacy-policy.last-updated').replace('{lastUpdatedDate}', policyVariables.LAST_UPDATED_DATE)}
            </p>

            <p>
                {t('privacy-policy.intro')
                    .replace('{companyName}', policyVariables.COMPANY_NAME)
                    .replace('{websiteUrl}', policyVariables.WEBSITE_URL)}
                <a href={policyVariables.WEBSITE_URL}>{t('privacy-policy.intro-link-text')}</a>.
            </p>

            <h2>{t('privacy-policy.section1.title')}</h2>
            <p>{t('privacy-policy.section1.intro')}</p>
            <ul>
                <li>
                    <strong>{t('privacy-policy.section1.personal-info.title')}</strong>: {t('privacy-policy.section1.personal-info.description')}
                    <ul>
                        {t('privacy-policy.section1.personal-info.items', { returnObjects: true }).map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </li>
                <li>
                    <strong>{t('privacy-policy.section1.browser-storage.title')}</strong>: {t('privacy-policy.section1.browser-storage.description')}
                </li>
                <li>
                    <strong>{t('privacy-policy.section1.voluntary-info.title')}</strong>: {t('privacy-policy.section1.voluntary-info.description')}
                </li>
            </ul>

            <h2>{t('privacy-policy.section2.title')}</h2>
            <p>{t('privacy-policy.section2.intro')}</p>
            <ul>
                {t('privacy-policy.section2.items', { returnObjects: true }).map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>

            <h2>{t('privacy-policy.section3.title')}</h2>
            <p>{t('privacy-policy.section3.intro')}</p>
            <ul>
                <li>
                    <strong>{t('privacy-policy.section3.service-providers.title')}</strong>: {t('privacy-policy.section3.service-providers.description').replace('{listSpecificProvidersIfKnown}', policyVariables.LIST_SPECIFIC_PROVIDERS_IF_KNOWN)}
                </li>
                <li>
                    <strong>{t('privacy-policy.section3.virtual-aviation.title')}</strong>: {t('privacy-policy.section3.virtual-aviation.description')}
                </li>
                <li>
                    <strong>{t('privacy-policy.section3.legal-authorities.title')}</strong>: {t('privacy-policy.section3.legal-authorities.description')}
                </li>
            </ul>
            <p>{t('privacy-policy.section3.no-sale')}</p>

            <h2>{t('privacy-policy.section4.title')}</h2>
            <p>{t('privacy-policy.section4.intro')}</p>
            <ul>
                {t('privacy-policy.section4.items', { returnObjects: true }).map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
            <p>
                {t('privacy-policy.section4.contact').replace('{contactEmail}', policyVariables.CONTACT_EMAIL)}
                <a href={`mailto:${policyVariables.CONTACT_EMAIL}`}>{t('privacy-policy.section4.contact-link-text')}</a>.
            </p>

            <h2>{t('privacy-policy.section5.title')}</h2>
            <p>
                {t('privacy-policy.section5.description').replace('{specifyRetentionPeriod}', policyVariables.SPECIFY_RETENTION_PERIOD)}
            </p>

            <h2>{t('privacy-policy.section6.title')}</h2>
            <p>{t('privacy-policy.section6.description')}</p>

            <h2>{t('privacy-policy.section7.title')}</h2>
            <p>
                {t('privacy-policy.section7.description')}
                <Link to={policyVariables.COOKIE_POLICY_LINK}>{t('privacy-policy.section7.cookie-policy-link-text')}</Link>.
            </p>

            <h2>{t('privacy-policy.section8.title')}</h2>
            <p>{t('privacy-policy.section8.description')}</p>

            <h2>{t('privacy-policy.section9.title')}</h2>
            <p>
                {t('privacy-policy.section9.description').replace('{minimumAge}', policyVariables.MINIMUM_AGE)}
            </p>

            <h2>{t('privacy-policy.section10.title')}</h2>
            <p>{t('privacy-policy.section10.description')}</p>

            <h2>{t('privacy-policy.section11.title')}</h2>
            <p>{t('privacy-policy.section11.description')}</p>
            <p>
                {t('privacy-policy.section11.details')
                    .replace('{companyName}', policyVariables.COMPANY_NAME)
                    .replace('{contactEmail}', policyVariables.CONTACT_EMAIL)}
                <a href={`mailto:${policyVariables.CONTACT_EMAIL}`}>{t('privacy-policy.section4.contact-link-text')}</a>.
            </p>

            <h1>{t('privacy-policy.gdpr-compliance.title')}</h1>
            <p>
                {t('privacy-policy.gdpr-compliance.intro').replace('{companyName}', policyVariables.COMPANY_NAME)}
            </p>
            <ul>
                {t('privacy-policy.gdpr-compliance.items', { returnObjects: true }).map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
            <p>
                {t('privacy-policy.gdpr-compliance.dpo').replace('{dpoEmail}', policyVariables.DPO_EMAIL)}
                <a href={`mailto:${policyVariables.DPO_EMAIL}`}>{t('privacy-policy.gdpr-compliance.dpo-link-text')}</a>.
            </p>
        </div>
    );
}
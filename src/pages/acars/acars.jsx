import { faCopy, faEject, faEye, faEyeSlash, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function Acars() {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('uindiuandac839mf');

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(
            () => alert(t('copied-to-clipboard')),
            (err) => console.error(t('failed-to-copy'), err)
        );
    };

    const regeneratePassword = () => {
        const newPassword = Math.random().toString(36).slice(2, 18);
        setPassword(newPassword);
    };

    return (
        <>
            <div className="view-model left">
                <h1>
                    <FontAwesomeIcon icon={faEject} /> {t('acars-title')}
                </h1>
                <p dangerouslySetInnerHTML={{ __html: t('acars-description-1') }} />
                <p>
                    {t('acars-download-label')}{' '}
                    <a href="https://diazro.me/hicrew" target="_blank" rel="noopener noreferrer">
                        {t('acars-download-link')}
                    </a>
                </p>
                <p>{t('acars-credentials')}</p>
                <p>
                    {t('acars-url-label')} https://diazro.me/hicrew{' '}
                    <FontAwesomeIcon
                        icon={faCopy}
                        className="copy-icon"
                        onClick={() => copyToClipboard('https://diazro.me/hicrew')}
                        style={{ cursor: 'pointer', marginLeft: '8px' }}
                        title={t('copy-url-title')}
                    />
                </p>
                <p>
                    {t('acars-password-label')}{' '}
                    <span className="password">
            {showPassword ? password : '••••••••••••••••'}
          </span>{' '}
                    <FontAwesomeIcon
                        icon={faCopy}
                        className="copy-icon"
                        onClick={() => copyToClipboard(password)}
                        style={{ cursor: 'pointer', marginLeft: '8px' }}
                        title={t('copy-password-title')}
                    />
                    <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                        className="toggle-password"
                        onClick={togglePasswordVisibility}
                        style={{ cursor: 'pointer', marginLeft: '8px' }}
                        title={t(showPassword ? 'hide-password-title' : 'show-password-title')}
                    />
                    <FontAwesomeIcon
                        icon={faSyncAlt}
                        className="refresh-password"
                        onClick={regeneratePassword}
                        style={{ cursor: 'pointer', marginLeft: '8px' }}
                        title={t('regenerate-password-title')}
                    />
                </p>
            </div>
        </>
    );
}
import './cookie-policy.scss';

export function CookiePolicy() {
    const cookieVariables = {
        COMPANY_NAME: 'HiCrew',
        LAST_UPDATED_DATE: 'April 28, 2025',
        WEBSITE_URL: 'https://www.example.com',
        CONTACT_EMAIL: 'hicrew@example.com',
        PRIVACY_POLICY_LINK: '/privacy-policy',
    };

    return (
        <>
            <div className="cookie-policy-container">
                <h1>Cookie and Browser Storage Policy for {cookieVariables.COMPANY_NAME}</h1>
                <p><em>Last Updated: {cookieVariables.LAST_UPDATED_DATE}</em></p>

                <p>
                    At {cookieVariables.COMPANY_NAME}, we are committed to transparency about how we use browser storage to enhance your experience on our website (<a href={cookieVariables.WEBSITE_URL}>{cookieVariables.WEBSITE_URL}</a>) and related services (collectively, the "Services"). This Cookie and Browser Storage Policy explains how we use local storage, why we use it, and your options for managing it. For more details on how we handle your personal information, please see our <a href={cookieVariables.PRIVACY_POLICY_LINK}>Privacy Policy</a>.
                </p>

                <h2>1. What is Browser Storage?</h2>
                <p>
                    Browser storage, such as local storage, allows us to store small amounts of data on your device to improve your experience. Unlike cookies, local storage does not expire automatically and is not sent to our servers. We do not use cookies or similar tracking technologies.
                </p>

                <h2>2. How We Use Browser Storage</h2>
                <p>
                    We use local storage to save your preferences for the following purposes:
                </p>
                <ul>
                    <li><strong>Dark Mode Theme</strong>: To remember whether you have selected dark mode or light mode for the website’s appearance.</li>
                    <li><strong>Language Preferences</strong>: To store your preferred language for the website’s content.</li>
                </ul>
                <p>
                    These preferences are stored locally on your device and are not used to track your behavior, identify you, or collect personal information.
                </p>

                <h2>3. Do We Use Cookies or Tracking Technologies?</h2>
                <p>
                    No, we do not use cookies, web beacons, or other tracking technologies. We do not collect data about your IP address, browser type, or pages visited.
                </p>

                <h2>4. Managing Browser Storage</h2>
                <p>
                    You can control how browser storage is used by:
                </p>
                <ul>
                    <li><strong>Adjusting Settings</strong>: Use our website’s settings to change your dark mode or language preferences at any time.</li>
                    <li><strong>Clearing Local Storage</strong>: You can clear local storage by resetting your browser’s storage through its settings. Instructions vary by browser:
                        <ul>
                            <li><a href="https://support.google.com/chrome/answer/95647">Google Chrome</a></li>
                            <li><a href="https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox">Mozilla Firefox</a></li>
                            <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac">Safari</a></li>
                            <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09">Microsoft Edge</a></li>
                        </ul>
                    </li>
                </ul>
                <p>
                    Clearing local storage will reset your dark mode and language preferences to their defaults but will not affect your account or personal information.
                </p>

                <h2>5. Third-Party Services</h2>
                <p>
                    We do not use third-party services that place cookies or use tracking technologies on our website. If our Services link to third-party websites (e.g., IVAO or VATSIM platforms), those sites may have their own cookie or storage policies. We recommend reviewing their policies before interacting with them.
                </p>

                <h2>6. GDPR Compliance</h2>
                <p>
                   We comply with the General Data Protection Regulation (GDPR). Since our use of local storage for dark mode and language preferences does not involve processing personal data, it is not subject to GDPR consent requirements. However, we provide this policy for transparency and to inform you of your options.
                </p>

                <h2>7. Changes to This Policy</h2>
                <p>
                    We may update this Cookie and Browser Storage Policy to reflect changes in our practices or legal requirements. We will notify you of significant changes via email or a notice on our website. The updated policy will be effective as of the "Last Updated" date.
                </p>

                <h2>8. Contact Us</h2>
                <p>
                    If you have questions or concerns about this Cookie and Browser Storage Policy or our practices, please contact:
                </p>
                <p>
                    {cookieVariables.COMPANY_NAME}<br />
                    <a href={`mailto:${cookieVariables.CONTACT_EMAIL}`}>{cookieVariables.CONTACT_EMAIL}</a><br />
                </p>
            </div>
        </>
    );
}
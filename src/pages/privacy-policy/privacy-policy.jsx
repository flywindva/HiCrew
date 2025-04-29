import './privacy-policy.scss';

export function PrivacyPolicy() {
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
        <>
            <div className="privacy-policy-container">
                <h1>Privacy Policy for {policyVariables.COMPANY_NAME}</h1>
                <p><em>Last Updated: {policyVariables.LAST_UPDATED_DATE}</em></p>

                <p>
                    At {policyVariables.COMPANY_NAME}, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you use our virtual airline services, including our website (<a href={policyVariables.WEBSITE_URL}>{policyVariables.WEBSITE_URL}</a>), mobile applications, and related services (collectively, the "Services"). By using our Services, you consent to the practices described in this policy.
                </p>

                <h2>1. Information We Collect</h2>
                <p>We collect the following types of information:</p>
                <ul>
                    <li>
                        <strong>Personal Information</strong>: When you register for an account, participate in virtual flights, or contact us, we collect:
                        <ul>
                            <li>Name</li>
                            <li>Surname</li>
                            <li>Date of birth</li>
                            <li>IVAO ID</li>
                            <li>VATSIM ID</li>
                            <li>Email address</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Browser Storage</strong>: We store your preferences for dark mode theme and language selection in your browser’s local storage to enhance your experience.
                    </li>
                    <li>
                        <strong>Voluntarily Provided Information</strong>: Any information you provide through forums, surveys, or customer support, such as feedback or preferences for virtual flights.
                    </li>
                </ul>

                <h2>2. How We Use Your Information</h2>
                <p>We use your information to:</p>
                <ul>
                    <li>Provide and improve our Services, such as managing user accounts, verifying IVAO and VATSIM IDs, and facilitating virtual flight activities.</li>
                    <li>Communicate with you, including sending confirmations, updates, or promotional offers (if you opt-in).</li>
                    <li>Apply your dark mode and language preferences to personalize your experience.</li>
                    <li>Comply with legal obligations and protect the security of our Services.</li>
                </ul>

                <h2>3. How We Share Your Information</h2>
                <p>We may share your information with:</p>
                <ul>
                    <li>
                        <strong>Service Providers</strong>: Third-party vendors who assist with customer support or other services ({policyVariables.LIST_SPECIFIC_PROVIDERS_IF_KNOWN}).
                    </li>
                    <li>
                        <strong>Virtual Aviation Networks</strong>: We may share your IVAO ID or VATSIM ID with IVAO or VATSIM to verify your membership or facilitate flight activities, with your consent.
                    </li>
                    <li>
                        <strong>Legal Authorities</strong>: When required by law or to protect our rights and safety.
                    </li>
                </ul>
                <p>We do not sell your personal information to third parties.</p>

                <h2>4. Your Rights Under GDPR</h2>
                <p>You have the following rights under the General Data Protection Regulation (GDPR):</p>
                <ul>
                    <li><strong>Access</strong>: Request a copy of the personal data we hold about you.</li>
                    <li><strong>Rectification</strong>: Correct inaccurate or incomplete data.</li>
                    <li><strong>Erasure</strong>: Request deletion of your data, subject to legal obligations.</li>
                    <li><strong>Restriction</strong>: Restrict how we process your data in certain circumstances.</li>
                    <li><strong>Portability</strong>: Receive your data in a structured, machine-readable format.</li>
                    <li><strong>Objection</strong>: Object to processing for direct marketing or other purposes based on legitimate interests.</li>
                </ul>
                <p>
                    To exercise these rights, contact us at <a href={`mailto:${policyVariables.CONTACT_EMAIL}`}>{policyVariables.CONTACT_EMAIL}</a>. We will respond within one month, as required by GDPR.
                </p>

                <h2>5. Data Retention</h2>
                <p>
                    We retain your personal information for as long as necessary to provide the Services or comply with legal obligations. For example, account data is retained until you request deletion or {policyVariables.SPECIFY_RETENTION_PERIOD}. Browser-stored preferences (dark mode and language) are retained until you clear your browser’s local storage.
                </p>

                <h2>6. Data Security</h2>
                <p>
                    We implement industry-standard security measures, such as encryption and secure servers, to protect your data. However, no system is completely secure, and we cannot guarantee absolute security.
                </p>

                <h2>7. Browser Storage</h2>
                <p>
                    We store your dark mode theme and language preferences in your browser’s local storage. You can clear these preferences by resetting your browser’s local storage or adjusting your settings. For details, see our <a href={policyVariables.COOKIE_POLICY_LINK}>Cookie Policy</a>.
                </p>

                <h2>8. Third-Party Links</h2>
                <p>
                    Our Services may contain links to third-party websites (e.g., IVAO or VATSIM platforms). We are not responsible for their privacy practices. Please review their policies before sharing information.
                </p>

                <h2>9. Children’s Privacy</h2>
                <p>
                    Our Services are not intended for individuals under {policyVariables.MINIMUM_AGE}. We do not knowingly collect data from children. If we become aware of such data, we will delete it.
                </p>

                <h2>10. Changes to This Policy</h2>
                <p>
                    We may update this Privacy Policy to reflect changes in our practices or legal requirements. We will notify you of significant changes via email or a notice on our website. The updated policy will be effective as of the "Last Updated" date.
                </p>

                <h2>11. Contact Us</h2>
                <p>If you have questions or concerns about this Privacy Policy or our data practices, please contact:</p>
                <p>
                    {policyVariables.COMPANY_NAME}<br />
                    <a href={`mailto:${policyVariables.CONTACT_EMAIL}`}>{policyVariables.CONTACT_EMAIL}</a><br />

                </p>

                <h1>GDPR Compliance Notice</h1>
                <p>
                    {policyVariables.COMPANY_NAME} complies with the General Data Protection Regulation (GDPR). As a data controller, we ensure that:
                </p>
                <ul>
                    <li>We process personal data lawfully, fairly, and transparently.</li>
                    <li>We collect data for specified, explicit, and legitimate purposes.</li>
                    <li>We minimize data collection to what is necessary.</li>
                    <li>We maintain accurate data and allow corrections.</li>
                    <li>We limit data storage to what is necessary.</li>
                    <li>We protect data with appropriate technical and organizational measures.</li>
                </ul>
                <p>
                    Our Data Protection Officer (DPO) can be reached at <a href={`mailto:${policyVariables.DPO_EMAIL}`}>{policyVariables.DPO_EMAIL}</a> for GDPR-related inquiries. If you believe we have not addressed your concerns, you have the right to lodge a complaint with a supervisory authority in your country.
                </p>
            </div>
        </>
    );
}
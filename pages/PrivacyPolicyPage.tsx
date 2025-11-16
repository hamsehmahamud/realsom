import React from 'react';
import { useRouter } from '../hooks/useRouter';
import { Icon } from '../components/Icon';

const PolicySection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
        <h2 className="text-xl font-bold text-dark-text mb-2">{title}</h2>
        <div className="space-y-3 text-dark-text-secondary text-sm leading-relaxed">
            {children}
        </div>
    </div>
);

export const PrivacyPolicyPage: React.FC = () => {
    const { navigate } = useRouter();

    return (
        <div className="bg-dark-bg text-dark-text min-h-full">
            <header className="flex items-center p-4 sticky top-0 z-10 bg-dark-bg border-b border-dark-surface/50">
                <button onClick={() => navigate('profile')} className="p-2 -ml-2" aria-label="Go back">
                    <Icon name="arrow-left" className="h-6 w-6 text-dark-text" />
                </button>
                <h1 className="font-bold text-lg text-dark-text mx-auto">Privacy Policy</h1>
                <div className="w-6 h-6"></div>
            </header>

            <main className="p-4">
                <div className="prose prose-invert max-w-none">
                    <p className="text-sm text-dark-text-secondary mb-6">Last updated: {new Date().toLocaleDateString()}</p>
                    
                    <PolicySection title="Introduction">
                        <p>Welcome to Real Properties. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.</p>
                    </PolicySection>

                    <PolicySection title="Information We Collect">
                        <p>We may collect personal information from you such as your name, email address, and phone number when you register for an account. We also collect information about the properties you list or show interest in. For location services, we may request access to your device's geolocation.</p>
                    </PolicySection>

                    <PolicySection title="How We Use Your Information">
                        <p>We use the information we collect to:</p>
                        <ul className="list-disc list-inside">
                            <li>Provide, operate, and maintain our services.</li>
                            <li>Improve, personalize, and expand our services.</li>
                            <li>Understand and analyze how you use our services.</li>
                            <li>Communicate with you, either directly or through one of our partners.</li>
                            <li>Process your transactions and manage your account.</li>
                        </ul>
                    </PolicySection>

                     <PolicySection title="Data Security">
                        <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.</p>
                    </PolicySection>

                     <PolicySection title="Contact Us">
                        <p>If you have questions or comments about this Privacy Policy, please contact us at support@realproperties.com.</p>
                    </PolicySection>
                </div>
            </main>
        </div>
    );
};
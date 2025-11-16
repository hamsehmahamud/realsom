import React from 'react';
import { useRouter } from '../hooks/useRouter';
import { Icon } from '../components/Icon';

const FaqItem: React.FC<{ question: string; children: React.ReactNode }> = ({ question, children }) => (
    <details className="bg-dark-surface rounded-lg group">
        <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
            <span className="font-semibold text-dark-text">{question}</span>
            <Icon name="chevron-down" className="h-5 w-5 text-dark-text-secondary transition-transform duration-200 group-open:rotate-180" />
        </summary>
        <div className="px-4 pb-4 border-t border-gray-700 text-dark-text-secondary text-sm leading-relaxed">
            {children}
        </div>
    </details>
);

export const FaqsPage: React.FC = () => {
    const { navigate } = useRouter();

    return (
        <div className="bg-dark-bg text-dark-text min-h-full">
            <header className="flex items-center p-4 sticky top-0 z-10 bg-dark-bg border-b border-dark-surface/50">
                <button onClick={() => navigate('profile')} className="p-2 -ml-2" aria-label="Go back">
                    <Icon name="arrow-left" className="h-6 w-6 text-dark-text" />
                </button>
                <h1 className="font-bold text-lg text-dark-text mx-auto">Frequently Asked Questions</h1>
                <div className="w-6 h-6"></div>
            </header>

            <main className="p-4 space-y-3">
                <FaqItem question="How do I list my property?">
                    <p>To list your property, you must first create an account and log in. Then, from the Profile page, you can choose either "Add Property" for a detailed listing or "Quick Add Property" for a faster process. Fill in the required details and submit the form.</p>
                </FaqItem>
                <FaqItem question="Is my personal information secure?">
                    <p>Yes, we take your privacy very seriously. We use industry-standard security measures to protect your data. For more details, please read our Privacy Policy.</p>
                </FaqItem>
                <FaqItem question="How can I contact an agent?">
                    <p>You can find a list of agents on the "Agents" page accessible from the sidebar menu. From there, you can view their profiles and find contact information.</p>
                </FaqItem>
                <FaqItem question="What happens if I forget my password?">
                    <p>On the login screen, there is a "Forgot Password" link. Click this link and follow the instructions to reset your password via email. This feature is currently in development.</p>
                </FaqItem>
                <FaqItem question="Can I save properties to view later?">
                    <p>Absolutely! When browsing properties, click the heart icon to add a property to your "Favorites". You can view all your saved properties from the sidebar menu.</p>
                </FaqItem>
            </main>
        </div>
    );
};
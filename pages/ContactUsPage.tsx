
import React, { useState } from 'react';
import { useRouter } from '../hooks/useRouter';
import { Icon } from '../components/Icon';

const ContactInfoCard: React.FC<{ icon: string; title: string; detail: string }> = ({ icon, title, detail }) => (
    <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-dark-surface rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name={icon} className="h-6 w-6 text-accent-blue" />
        </div>
        <div>
            <h3 className="font-bold text-dark-text">{title}</h3>
            <p className="text-sm text-dark-text-secondary">{detail}</p>
        </div>
    </div>
);

export const ContactUsPage: React.FC = () => {
    const { navigate } = useRouter();
    const [form, setForm] = useState({ name: '', email: '', message: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Thank you, ${form.name}! Your message has been sent.`);
        setForm({ name: '', email: '', message: '' });
    };

    return (
        <div className="bg-dark-bg text-dark-text min-h-full">
            <header className="flex items-center p-4 sticky top-0 z-10 bg-dark-bg border-b border-dark-surface/50">
                <button onClick={() => navigate('home')} className="p-2 -ml-2" aria-label="Go back">
                    <Icon name="arrow-left" className="h-6 w-6 text-dark-text" />
                </button>
                <h1 className="font-bold text-lg text-dark-text mx-auto">Contact Us</h1>
                <div className="w-6 h-6"></div>
            </header>

            <main className="p-4 space-y-8">
                <section className="bg-dark-surface p-6 rounded-lg space-y-6">
                    <ContactInfoCard icon="location" title="Our Office" detail="123 Real Estate Ave, Mogadishu, Somalia" />
                    <ContactInfoCard icon="envelope" title="Email Us" detail="support@realproperties.com" />
                    <ContactInfoCard icon="phone" title="Call Us" detail="+252 61 000 0000" />
                </section>

                <section>
                    <h2 className="text-xl font-bold text-dark-text mb-4">Send us a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input name="name" type="text" placeholder="Your Name" value={form.name} onChange={handleChange} required className="w-full px-4 py-3 bg-dark-surface border border-gray-700 rounded-md focus:outline-none focus:ring-accent-blue focus:border-accent-blue text-dark-text" />
                        </div>
                         <div>
                            <input name="email" type="email" placeholder="Your Email" value={form.email} onChange={handleChange} required className="w-full px-4 py-3 bg-dark-surface border border-gray-700 rounded-md focus:outline-none focus:ring-accent-blue focus:border-accent-blue text-dark-text" />
                        </div>
                        <div>
                            <textarea name="message" placeholder="Your Message" value={form.message} onChange={handleChange} required rows={5} className="w-full px-4 py-3 bg-dark-surface border border-gray-700 rounded-md focus:outline-none focus:ring-accent-blue focus:border-accent-blue text-dark-text"></textarea>
                        </div>
                        <button type="submit" className="w-full bg-accent-blue text-white py-3 rounded-lg font-bold">
                            Send Message
                        </button>
                    </form>
                </section>
            </main>
        </div>
    );
};

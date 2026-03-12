import { useNavigate } from "react-router-dom";

// ─── Reusable sub-components ────────────────────────────────────────────────

const SectionCard = ({
    number,
    title,
    children,
}: {
    number: string;
    title: string;
    children: React.ReactNode;
}) => (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-4">
        <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold shrink-0">
                {number}
            </span>
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>
        <div className="text-gray-600 text-sm leading-relaxed space-y-3 pl-11">
            {children}
        </div>
    </section>
);

const BulletList = ({ items }: { items: string[] }) => (
    <ul className="space-y-2">
        {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                <span>{item}</span>
            </li>
        ))}
    </ul>
);

const InfoCallout = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-indigo-800 text-sm">
        <p>{children}</p>
    </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────

const PrivacyPolicy = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sticky top bar */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
                    >
                        ← Back
                    </button>
                </div>
            </div>

            {/* Page content */}
            <main className="max-w-3xl mx-auto px-6 py-12 space-y-6">

                {/* Header */}
                <div className="text-center space-y-2 pb-4">
                    <h1 className="text-3xl font-bold text-gray-900">SkillBridge Privacy Policy</h1>
                    <p className="text-sm text-gray-400">Last Updated: 06/03/2026</p>
                </div>

                {/* Intro card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-4">
                    <p className="text-gray-600 text-sm leading-relaxed">
                        SkillBridge is an early-stage digital platform designed to connect university students
                        with short-term, skills-based projects offered by small and medium-sized enterprises (SMEs).
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        For the purposes of UK data protection law, SkillBridge acts as the{" "}
                        <strong className="text-gray-800">data controller</strong> of your personal data.
                    </p>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-700">
                        If you have any questions about this Privacy Policy or your data, please contact us
                        at: <strong>bathskillbridge@gmail.com</strong>
                    </div>
                </div>

                {/* Section 1 */}
                <SectionCard number="1" title="Information We Collect">
                    <p>We may collect and process the following categories of personal data:</p>
                    <BulletList
                        items={[
                            "Name and contact details (e.g., email address)",
                            "University affiliation and course information (for students)",
                            "Business name and contact details (for SMEs)",
                            "Skills, interests, and project preferences",
                            "Usage data and interaction logs from our platform",
                            "Any information you voluntarily provide via forms or communications",
                        ]}
                    />
                </SectionCard>

                {/* Section 2 */}
                <SectionCard number="2" title="How We Use Your Data">
                    <p>We use your data for the following purposes:</p>
                    <BulletList
                        items={[
                            "To operate and improve the SkillBridge platform",
                            "To match students with relevant SME projects",
                            "To communicate platform updates and relevant information",
                            "To respond to enquiries and support requests",
                            "To conduct research and analyse platform usage",
                            "To comply with our legal obligations",
                        ]}
                    />
                    <InfoCallout>We do not sell your personal data to third parties.</InfoCallout>
                </SectionCard>

                {/* Section 3 */}
                <SectionCard number="3" title="Lawful Basis for Processing">
                    <p>Under UK GDPR, we rely on the following lawful bases:</p>
                    <BulletList
                        items={[
                            "Consent – where you have given clear consent for us to process your data",
                            "Legitimate interests – where processing is necessary for our legitimate business interests",
                            "Legal obligation – where we are required to process data to comply with the law",
                            "Contract – where processing is necessary to perform a contract with you",
                        ]}
                    />
                    <p className="text-gray-500 italic">You may withdraw consent at any time.</p>
                </SectionCard>

                {/* Section 4 */}
                <SectionCard number="4" title="Marketing Communications">
                    <p>If you sign up to receive updates:</p>
                    <BulletList
                        items={[
                            "We will use your email address to send relevant platform news and updates",
                            "You can unsubscribe from marketing emails at any time using the link in the email",
                        ]}
                    />
                    <p className="text-gray-500 italic">
                        We will not send marketing communications without your consent.
                    </p>
                </SectionCard>

                {/* Section 5 */}
                <SectionCard number="5" title="Research & Usability Testing">
                    <p>If you participate in surveys or usability testing:</p>
                    <BulletList
                        items={[
                            "We may collect feedback, opinions, and responses",
                            "Participation is voluntary and you may withdraw at any time",
                            "Data collected may be used to improve the SkillBridge platform",
                        ]}
                    />
                    <p className="text-gray-500 italic">
                        Anonymous surveys will not collect identifiable personal data.
                    </p>
                </SectionCard>

                {/* Section 6 */}
                <SectionCard number="6" title="Cookies & Analytics">
                    <p>
                        We may use cookies or analytics tools to understand how users interact with our
                        website. These may include:
                    </p>
                    <BulletList
                        items={[
                            "Essential cookies required for the platform to function",
                            "Analytics cookies to measure traffic and usage patterns",
                            "Preference cookies to remember your settings",
                        ]}
                    />
                    <p>
                        You can control cookie preferences through your browser settings. Please note that
                        disabling some cookies may affect your experience.
                    </p>
                </SectionCard>

                {/* Section 7 */}
                <SectionCard number="7" title="Data Security">
                    <p>
                        We implement appropriate technical and organisational measures to protect your personal
                        data, including:
                    </p>
                    <BulletList
                        items={[
                            "Encrypted data transmission (HTTPS)",
                            "Restricted access to personal data",
                            "Regular reviews of our data handling practices",
                            "Use of secure, reputable third-party services",
                        ]}
                    />
                    <p>
                        Personal data will only be retained for as long as necessary to fulfil the purposes
                        outlined in this policy.
                    </p>
                </SectionCard>

                {/* Section 8 */}
                <SectionCard number="8" title="Third-Party Processors">
                    <p>
                        We may use trusted third-party service providers (e.g., email platforms or website
                        hosting providers) to support our operations. These providers are required to process
                        your data securely and only on our instructions.
                    </p>
                    <p>We do not share your data for third-party advertising.</p>
                    <p>
                        If any service providers process data outside the UK, we will ensure appropriate
                        safeguards are in place in accordance with UK GDPR requirements.
                    </p>
                </SectionCard>

                {/* Section 9 */}
                <SectionCard number="9" title="Your Rights">
                    <p>Under UK data protection law, you have the right to:</p>
                    <BulletList
                        items={[
                            "Access the personal data we hold about you",
                            "Correct inaccurate or incomplete personal data",
                            "Request erasure of your personal data",
                            "Object to or restrict processing of your data",
                            "Data portability – receive your data in a structured, machine-readable format",
                            "Withdraw consent at any time where processing is based on consent",
                        ]}
                    />
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-700">
                        To exercise these rights, please contact us at{" "}
                        <strong>bathskillbridge@gmail.com</strong>.
                    </div>
                    <p>
                        You also have the right to lodge a complaint with the{" "}
                        <a
                            href="https://ico.org.uk"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:underline font-medium"
                        >
                            Information Commissioner's Office (ICO)
                        </a>
                        .
                    </p>
                </SectionCard>

                {/* Section 10 */}
                <SectionCard number="10" title="Data Retention">
                    <p>We retain personal data only as long as necessary:</p>
                    <BulletList
                        items={[
                            "Waitlist sign-up data: retained until no longer needed for platform launch purposes",
                            "Survey and research data: retained for the duration of the research period",
                            "Platform usage data: retained in line with our operational and legal requirements",
                        ]}
                    />
                    <p className="text-gray-500 italic">
                        Data will be securely deleted when no longer required.
                    </p>
                </SectionCard>

                {/* Section 11 */}
                <SectionCard number="11" title="Changes to This Policy">
                    <p>
                        We may update this Privacy Policy from time to time. The latest version will always
                        be available on our website.
                    </p>
                </SectionCard>

                {/* Footer */}
                <p className="text-center text-xs text-gray-400 pt-4 pb-8">
                    © {new Date().getFullYear()} SkillBridge. All rights reserved.
                </p>
            </main>
        </div>
    );
};

export default PrivacyPolicy;

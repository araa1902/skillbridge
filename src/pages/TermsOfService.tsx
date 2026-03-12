import { Link, useNavigate } from "react-router-dom";

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

const WarningCallout = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-amber-800 text-sm">
        <p>{children}</p>
    </div>
);

const InfoCallout = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-indigo-800 text-sm">
        <p>{children}</p>
    </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────

const TermsOfService = () => {
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
                    <h1 className="text-3xl font-bold text-gray-900">SkillBridge Terms of Service</h1>
                    <p className="text-sm text-gray-400">Last Updated: 06/03/2026</p>
                </div>

                {/* Intro card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-4">
                    <p className="text-gray-600 text-sm leading-relaxed">
                        SkillBridge is an early-stage digital platform designed to connect university students
                        and recent graduates with short-term, skills-based project opportunities offered by
                        small and medium-sized enterprises (SMEs).
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        By accessing or using the SkillBridge website or platform, you agree to be bound by
                        these Terms of Service ("Terms").
                    </p>
                    <WarningCallout>
                        If you do not agree to these Terms, you must not use the platform.
                    </WarningCallout>
                </div>

                {/* Section 1 */}
                <SectionCard number="1" title="Eligibility">
                    <p>You must:</p>
                    <BulletList
                        items={[
                            "Be at least 18 years of age",
                            "Be a registered student or graduate at a recognised UK university, or represent a legitimate UK-based SME",
                            "Have the legal capacity to enter into a binding agreement",
                            "Use the platform only for lawful purposes in accordance with these Terms",
                        ]}
                    />
                    <p className="text-gray-500 italic">
                        By using SkillBridge, you confirm that you meet these requirements.
                    </p>
                </SectionCard>

                {/* Section 2 */}
                <SectionCard number="2" title="Nature of the Platform">
                    <p>
                        SkillBridge acts solely as an intermediary platform that facilitates connections between:
                    </p>
                    <BulletList
                        items={[
                            "University students or graduates seeking skills-based project experience",
                            "SMEs looking for short-term project support",
                        ]}
                    />
                    <p>SkillBridge:</p>
                    <BulletList
                        items={[
                            "Does not guarantee the quality, accuracy, or outcomes of any projects",
                            "Does not vet, endorse, or verify any users, businesses, or project listings",
                            "Is not a party to any agreement formed between students and SMEs",
                        ]}
                    />
                    <InfoCallout>
                        Any agreement entered into between a student and an SME is solely between those parties.
                    </InfoCallout>
                </SectionCard>

                {/* Section 3 */}
                <SectionCard number="3" title="Account Responsibilities">
                    <p>If you create an account:</p>
                    <BulletList
                        items={[
                            "You are responsible for maintaining the confidentiality of your login credentials",
                            "You must provide accurate and truthful information when registering",
                            "You must notify us immediately of any unauthorised use of your account",
                            "You are responsible for all activity that occurs under your account",
                        ]}
                    />
                    <p className="text-gray-500 italic">
                        We reserve the right to suspend or terminate accounts that violate these Terms.
                    </p>
                </SectionCard>

                {/* Section 4 */}
                <SectionCard number="4" title="Acceptable Use">
                    <p>You agree not to:</p>
                    <BulletList
                        items={[
                            "Use the platform for any unlawful or fraudulent purpose",
                            "Post false, misleading, or offensive content",
                            "Attempt to gain unauthorised access to any part of the platform",
                            "Harass, abuse, or harm other users",
                            "Use automated tools to scrape or extract data from the platform",
                            "Impersonate any person or organisation",
                        ]}
                    />
                    <p className="text-gray-500 italic">
                        We may remove content or suspend accounts at our discretion if misuse occurs.
                    </p>
                </SectionCard>

                {/* Section 5 */}
                <SectionCard number="5" title="Intellectual Property">
                    <p>
                        All platform content, branding, logos, and design elements relating to SkillBridge
                        remain the intellectual property of SkillBridge unless otherwise stated.
                    </p>
                    <p>
                        You may not copy, reproduce, modify, or distribute any part of the platform without
                        written permission.
                    </p>
                    <p>
                        Users retain ownership of content they upload but grant SkillBridge a limited licence
                        to display it for platform functionality.
                    </p>
                </SectionCard>

                {/* Section 6 */}
                <SectionCard number="6" title="Employment & Agency Disclaimer">
                    <p>Use of SkillBridge does not create:</p>
                    <BulletList
                        items={[
                            "An employment relationship between any user and SkillBridge",
                            "An agency or partnership between SkillBridge and any user",
                            "Any obligation on SkillBridge to facilitate, complete, or guarantee any project",
                        ]}
                    />
                    <p>
                        SkillBridge does not employ students or represent SMEs. Any working relationship
                        formed through the platform is independent of SkillBridge.
                    </p>
                </SectionCard>

                {/* Section 7 */}
                <SectionCard number="7" title="Limitation of Liability">
                    <p>To the fullest extent permitted by law, SkillBridge shall not be liable for:</p>
                    <BulletList
                        items={[
                            "Any loss or damage arising from use of, or inability to use, the platform",
                            "Any disputes, claims, or losses arising between students and SMEs",
                            "Any inaccuracies in user-generated content or project listings",
                            "Any indirect, consequential, or incidental damages",
                        ]}
                    />
                    <WarningCallout>
                        Nothing in these Terms excludes liability for fraud or any liability that cannot be
                        excluded under UK law.
                    </WarningCallout>
                </SectionCard>

                {/* Section 8 */}
                <SectionCard number="8" title="Platform Availability">
                    <p>As an early-stage platform:</p>
                    <BulletList
                        items={[
                            "Features and functionality may change without notice",
                            "The platform may be temporarily unavailable for maintenance or updates",
                            "We are not liable for any losses resulting from platform downtime",
                        ]}
                    />
                    <p className="text-gray-500 italic">We do not guarantee uninterrupted availability.</p>
                </SectionCard>

                {/* Section 9 */}
                <SectionCard number="9" title="Privacy Policy">
                    <p>
                        Your use of the platform is also governed by our{" "}
                        <Link
                            to="/privacy-policy"
                            className="text-indigo-600 hover:underline font-medium"
                        >
                            Privacy Policy
                        </Link>
                        , which explains how we collect and use personal data.
                    </p>
                </SectionCard>

                {/* Section 10 */}
                <SectionCard number="10" title="Termination">
                    <p>
                        We reserve the right to suspend or terminate access, remove accounts, and remove
                        content where users breach these Terms.
                    </p>
                    <p>You may stop using the platform at any time.</p>
                </SectionCard>

                {/* Section 11 */}
                <SectionCard number="11" title="Changes to These Terms">
                    <p>
                        We may update these Terms from time to time. The latest version will be published on
                        our website.
                    </p>
                    <p>
                        Continued use of the platform after changes indicates acceptance of the revised Terms.
                    </p>
                </SectionCard>

                {/* Section 12 */}
                <SectionCard number="12" title="Contact Information">
                    <p>
                        If you have any questions about these Terms, please contact us at{" "}
                        <strong>bathskillbridge@gmail.com</strong>.
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

export default TermsOfService;

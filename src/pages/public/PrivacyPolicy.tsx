import { motion } from 'motion/react';

export default function PrivacyPolicy() {
  return (
    <div className="pt-32 pb-24">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 mb-8 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-zinc-500 mb-12">Last Updated: April 11, 2026</p>

          <div className="prose prose-zinc max-w-none space-y-12 text-zinc-600">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-zinc-900">1. Introduction</h2>
              <p>
                Welcome to Yuva Classes. We value your trust and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our website, mobile application, and services. By using Yuva Classes, you agree to the practices described in this policy.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-zinc-900">2. Information We Collect</h2>
              <p>We collect information to provide a better learning experience for you. This includes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Personal Information:</strong> Name, email address, phone number, and profile picture (if provided via Google Login).</li>
                <li><strong>Account Data:</strong> Login credentials and preferences.</li>
                <li><strong>Usage Data:</strong> Information on how you interact with our courses, videos, and test series.</li>
                <li><strong>Device Information:</strong> IP address, browser type, operating system, and device identifiers.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-zinc-900">3. How We Use Your Data</h2>
              <p>We use the collected information for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>To create and manage your student account.</li>
                <li>To provide access to purchased courses and study materials.</li>
                <li>To send important updates, class schedules, and promotional offers via WhatsApp, SMS, or email.</li>
                <li>To analyze platform performance and improve our teaching methodology.</li>
                <li>To prevent fraudulent activities and ensure platform security.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-zinc-900">4. Third-Party Services</h2>
              <p>
                We use trusted third-party services to power our platform. These include Google OAuth for secure login, Supabase for backend data management, and various analytics tools. These partners have access to your information only to perform specific tasks on our behalf and are obligated not to disclose or use it for any other purpose.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-zinc-900">5. Data Protection and Security</h2>
              <p>
                Yuva Classes employs industry-standard security measures to protect your data from unauthorized access, alteration, or destruction. While we strive to use commercially acceptable means to protect your personal information, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-zinc-900">6. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access the personal information we hold about you.</li>
                <li>Request corrections to any inaccurate or incomplete data.</li>
                <li>Request the deletion of your account and personal data, subject to legal obligations.</li>
                <li>Opt-out of promotional communications at any time.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-zinc-900">7. Cookies and Tracking</h2>
              <p>
                We use cookies and similar tracking technologies to track activity on our platform and hold certain information. Cookies help us remember your preferences and provide a seamless login experience. You can instruct your browser to refuse all cookies, but some parts of our service may not function correctly as a result.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-zinc-900">8. Children's Privacy</h2>
              <p>
                Our services are intended for students preparing for competitive exams. If you are under the age of 18, we recommend using our platform under the supervision of a parent or guardian. We do not knowingly collect personal data from children without parental consent.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-zinc-900">9. Updates to This Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date. We encourage you to review this policy periodically.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-zinc-900">10. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy or how we handle your data, please contact us at:
              </p>
              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
                <p className="font-bold text-zinc-900">Yuva Classes Support</p>
                <p>Email: support@yuvaclasses.com</p>
                <p>Phone: +91 98765 43210</p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

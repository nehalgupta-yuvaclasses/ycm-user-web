import { motion } from 'motion/react';

export default function TermsOfService() {
  return (
    <div className="pt-32 pb-24">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 mb-8 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-zinc-500 mb-12">Last Updated: April 11, 2026</p>

          <div className="prose prose-zinc max-w-none space-y-12 text-zinc-600">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-zinc-900">1. Acceptance of Terms</h2>
              <p>
                By accessing or using the Yuva Classes platform, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use our services. These terms apply to all students, visitors, and others who access the platform.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-zinc-900">2. User Accounts</h2>
              <p>
                To access most features of Yuva Classes, you must create an account. You agree to provide accurate and complete information during registration. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-zinc-900">3. Course Access and Usage</h2>
              <p>
                When you purchase a course on Yuva Classes, you are granted a limited, non-exclusive, non-transferable license to access the content for your personal, non-commercial educational use. 
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You may not share your login credentials with others.</li>
                <li>You may not download, record, or redistribute course content without explicit permission.</li>
                <li>Access to courses is typically limited to a specific duration as mentioned at the time of purchase.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-zinc-900">4. Payments and Refunds</h2>
              <p>
                All payments for courses must be made through our authorized payment gateways. Pricing is subject to change at our discretion. Please refer to our <strong>Refund Policy</strong> for details regarding cancellations and money-back requests. Generally, once a course is accessed or study material is downloaded, refunds are not provided.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-zinc-900">5. Intellectual Property</h2>
              <p>
                All content on the Yuva Classes platform, including videos, notes, test questions, graphics, and software, is the property of Yuva Classes and is protected by copyright and intellectual property laws. Unauthorized use of our materials is strictly prohibited.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-zinc-900">6. Prohibited Activities</h2>
              <p>You agree not to engage in any of the following prohibited activities:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Attempting to hack, decompile, or disrupt the platform's security.</li>
                <li>Using automated systems (bots, scrapers) to access content.</li>
                <li>Posting offensive, defamatory, or illegal content in discussion forums.</li>
                <li>Sharing course materials on social media or third-party websites.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-zinc-900">7. Platform Availability</h2>
              <p>
                While we strive to provide uninterrupted access to Yuva Classes, we do not guarantee 100% uptime. The platform may be temporarily unavailable for maintenance or due to technical issues beyond our control. We are not liable for any loss resulting from such downtime.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-zinc-900">8. Limitation of Liability</h2>
              <p>
                Yuva Classes and its faculty shall not be liable for any indirect, incidental, or consequential damages arising out of your use of the platform. Our total liability for any claim related to our services is limited to the amount you paid for the specific course in question.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-zinc-900">9. Termination</h2>
              <p>
                We reserve the right to terminate or suspend your account immediately, without prior notice, if you breach these Terms of Service. Upon termination, your right to use the platform will cease immediately.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-zinc-900">10. Governing Law</h2>
              <p>
                These Terms shall be governed and construed in accordance with the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in New Delhi.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-zinc-900">11. Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please reach out to us:
              </p>
              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
                <p className="font-bold text-zinc-900">Yuva Classes Legal Team</p>
                <p>Email: legal@yuvaclasses.com</p>
                <p>Address: 123, Education Hub, New Delhi, India</p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

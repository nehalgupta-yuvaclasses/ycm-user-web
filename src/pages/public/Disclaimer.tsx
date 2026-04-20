import { motion } from 'motion/react';

export default function Disclaimer() {
  return (
    <div className="pt-32 pb-24">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 mb-8 tracking-tight">
            Disclaimer
          </h1>
          <p className="text-zinc-500 mb-12">Last Updated: April 11, 2026</p>

          <div className="prose prose-zinc max-w-none space-y-12 text-zinc-600">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-zinc-900">1. Educational Purpose Only</h2>
              <p>
                The content provided by Yuva Classes, including live sessions, recorded videos, notes, and test series, is for <strong>educational and informational purposes only</strong>. While we aim to provide the best guidance for competitive exams, our content should not be considered as a substitute for official government notifications or textbooks.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-zinc-900">2. No Guarantee of Success</h2>
              <p>
                Yuva Classes <strong>does not guarantee</strong> exam success, selection, or any specific rank. Competitive exams are highly selective, and final results depend entirely on the student's individual effort, consistency, prior knowledge, and various external factors beyond our control.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-zinc-900">3. Accuracy of Content</h2>
              <p>
                We make every effort to ensure that the information provided is accurate and up-to-date. However, exam patterns, syllabi, and dates are subject to change by the respective governing bodies. Yuva Classes is not responsible for any errors, omissions, or outdated information that may appear on the platform.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-zinc-900">4. Limitation of Liability</h2>
              <p>
                Yuva Classes, its directors, and faculty members shall not be held liable for any direct or indirect losses, decisions made, or outcomes resulting from the use of our platform. Students are encouraged to verify critical information (like exam dates and eligibility) from official government websites.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-zinc-900">5. Third-Party Services</h2>
              <p>
                Our platform may integrate or link to third-party tools, payment gateways, or websites. Yuva Classes does not endorse or take responsibility for the content, privacy policies, or practices of any third-party services.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-zinc-900">6. Platform Availability</h2>
              <p>
                We strive to maintain high availability of our website and mobile app. However, we are not liable for any temporary downtime due to technical maintenance, server issues, or internet connectivity problems. We recommend a stable internet connection for the best learning experience.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-zinc-900">7. Changes to Disclaimer</h2>
              <p>
                Yuva Classes reserves the right to modify this disclaimer at any time without prior notice. By continuing to use our platform, you acknowledge and agree to the terms stated herein.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

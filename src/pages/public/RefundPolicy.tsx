import { motion } from 'motion/react';

export default function RefundPolicy() {
  return (
    <div className="pt-32 pb-24">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 mb-8 tracking-tight">
            Refund & Cancellation Policy
          </h1>
          <p className="text-zinc-500 mb-12">Last Updated: April 11, 2026</p>

          <div className="prose prose-zinc max-w-none space-y-12 text-zinc-600">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-zinc-900">1. Overview</h2>
              <p>
                At Yuva Classes, we strive to provide high-quality education and a seamless learning experience. We understand that circumstances may change, and we have established this Refund & Cancellation Policy to ensure transparency and fairness for all our students.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-zinc-900">2. Refund Eligibility</h2>
              <p>
                Refunds are generally <strong>not provided</strong> once a course has been accessed or study materials have been downloaded. However, we may consider refund requests under the following strict conditions:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The request is made within <strong>24 hours</strong> of the initial purchase.</li>
                <li>The student has not viewed more than <strong>2 video lectures</strong> or downloaded any PDF materials.</li>
                <li>There is a technical issue from our end that prevents the student from accessing the course, which we are unable to resolve within 72 hours.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-zinc-900">3. Non-Refundable Cases</h2>
              <p>Refunds will not be granted in the following scenarios:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Courses purchased during a <strong>Sale, Discount, or using a Coupon Code</strong>.</li>
                <li>Test Series, Daily Quizzes, or E-books (digital downloads).</li>
                <li>If the student has already consumed a significant portion of the course content.</li>
                <li>Change of mind or personal reasons after the 24-hour window.</li>
                <li>Batch transfers (in most cases, batch transfers are treated as final).</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-zinc-900">4. Cancellation Policy</h2>
              <p>
                Students can request to cancel their subscription before the course starts. Once a batch has commenced and the student has logged in, the standard refund rules apply. Yuva Classes reserves the right to cancel any batch due to unforeseen circumstances; in such cases, a full refund or an alternative batch option will be provided.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-zinc-900">5. Refund Processing</h2>
              <p>
                Once a refund request is approved, the amount will be credited back to the original payment method within <strong>5 to 10 business days</strong>. Please note that bank processing times may vary.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-zinc-900">6. Right to Refuse</h2>
              <p>
                Yuva Classes reserves the sole right to approve or reject a refund request based on our internal audit of the student's platform usage and engagement. Any attempt to misuse this policy for free access to content will lead to immediate account termination without a refund.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-zinc-900">7. How to Request a Refund</h2>
              <p>
                To initiate a refund request, please email us with your registered mobile number, email ID, and a valid reason for the request.
              </p>
              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
                <p className="font-bold text-zinc-900">Refund Support Team</p>
                <p>Email: support@yuvaclasses.com</p>
                <p>Subject: Refund Request - [Your Order ID]</p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

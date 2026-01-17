import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-edtech-blue via-bg-deep to-edtech-blue/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          
          <div className="relative mx-auto max-w-4xl px-6 text-center">
            <div className="badge-hero mx-auto w-max mb-8">
              <span>💰</span>
              <span>REFUND POLICY</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-8 leading-tight">
              Fair <span className="text-transparent bg-clip-text bg-gradient-to-r from-edtech-green to-edtech-orange">Refund Policy</span>
            </h1>
            <p className="text-white/80 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
              We want you to be completely satisfied with your learning experience. Here's our transparent refund policy.
            </p>
          </div>
        </section>

      {/* Content Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-4xl px-6">
          <div className="prose prose-lg max-w-none">
            
            <div className="bg-edtech-green/5 border border-edtech-green/20 rounded-2xl p-6 mb-8">
              <p className="text-gray-800 font-medium mb-0">
                <strong>Last updated:</strong> January 2025
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>1.1.</strong> This refund policy applies to all the programs offered by EdTech Informative (hereinafter referred to as "the Company").
            </p>
            <p className="text-gray-700 leading-relaxed mb-8">
              <strong>1.2.</strong> The Company offers a 45 day conditional money-back guarantee to ensure professional satisfaction and confidence in the program's value.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">2. Eligibility Criteria</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To be eligible for a refund, a professional must meet ALL of the following criteria:
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">2.1. Time Frame:</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
              <li>The refund request must be submitted between the 30th and 45th day from the official commencement date of the course batch.</li>
              <li>No refund requests will be entertained before the 31st day or after the 45th day.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">2.2. Course Participation:</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
              <li>Attend all live online classes in their entirety during the first 30 days.</li>
              <li>Submit all assignments issued within the first 30 days, including those with deadlines extending beyond the 30-day period.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">2.3. Attendance Requirements:</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
              <li>Classes must be attended in live mode only; watching recordings does not qualify.</li>
              <li>Professionals must be present for the full duration of each class.</li>
              <li>Proper identification (first and last name) must be used when attending classes.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">2.4. Assignment Submissions:</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-8 space-y-2">
              <li>All submissions must be complete, timely, and in accordance with the specified requirements.</li>
              <li>Assignments must be submitted with a genuine intention to learn and not merely to fulfill the refund policy criteria.</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">3. Refund Process</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>3.1.</strong> Eligible professionals may request a refund by writing to support@edtechinformative.uk within the specified time frame.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>3.2.</strong> The Company reserves the right to take up to 60 days to process the refund, although efforts will be made to complete the process within 14 days of a valid request.
            </p>
            <p className="text-gray-700 leading-relaxed mb-8">
              <strong>3.3.</strong> Refunds will be issued to the original payment source.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">4. Additional Terms and Conditions</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-4">4.1. Program Materials:</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
              <li>Professionals must return any hard copy materials received, in good condition, via registered post to the Company.</li>
              <li>Refunds will only be processed upon receipt of returned materials.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">4.2. Future Participation:</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
              <li>The Company reserves the right to refuse future program sales to individuals who have received a refund under this policy.</li>
              <li>Professionals who have previously received a refund must disclose this information when attempting to purchase any future programs from the Company.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">4.3. Disclosure Rights:</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              The Company retains the right to disclose the fact that a refund was issued to future customers.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">4.4. Exceptions:</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              In cases of technical issues preventing policy compliance, exceptions may be considered if the professional provides immediate notification to support@edtechinformative.uk with relevant evidence.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-8">4.5. Non-Refundable Fees:</h3>
            <p className="text-gray-700 leading-relaxed mb-8">
              All booking fees are non-refundable, except when a professional completes full enrollment and complies with this refund policy.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Limitations</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>5.1.</strong> This refund policy is an exception to the Company's general no-refund rule and applies only to the 10X Data Analyst and AI program.
            </p>
            <p className="text-gray-700 leading-relaxed mb-8">
              <strong>5.2.</strong> The Company reserves the right to modify or terminate this policy at any time, with such changes applying to future enrollments.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Legal Disclaimer</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              This refund policy does not affect any statutory rights that cannot be excluded under applicable law. In the event of any conflict between this policy and applicable law, the applicable law shall prevail.
            </p>
            <p className="text-gray-700 leading-relaxed mb-8">
              By enrolling in any EdTech Informative program, professionals confirm that they have read, understood, and agreed to the terms and conditions outlined in this refund policy.
            </p>

            <div className="bg-edtech-orange/5 border border-edtech-orange/20 rounded-2xl p-6 mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about our refund policy or need to request a refund, please contact us:
              </p>
              <ul className="list-none text-gray-700 space-y-2">
                <li><strong>Email:</strong> support@edtechinformative.uk</li>
                <li><strong>Phone:</strong> Available during business hours</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  );
}

import MainLayout from "@/components/layout/MainLayout";

const PrivacyPolicy = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="mb-4">Last Updated: April 13, 2025</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Introduction</h2>
            <p>
              HealWise ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our healthcare platform. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Information We Collect</h2>
            <p>We collect information that you provide directly to us, including:</p>
            <ul className="list-disc ml-6 mb-4">
              <li>Personal Information: Name, date of birth, gender, contact information</li>
              <li>Health Information: Medical history, symptoms, diagnoses, treatments, prescriptions</li>
              <li>Insurance Information: Insurance provider, policy number, coverage details</li>
              <li>Account Information: Email address, password, security questions</li>
              <li>Payment Information: Credit card details, billing address</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
            <p>We may use the information we collect for various purposes, including to:</p>
            <ul className="list-disc ml-6 mb-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Process appointments and manage your healthcare</li>
              <li>Communicate with you about your health and our services</li>
              <li>Comply with legal and regulatory requirements</li>
              <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
              <li>Analyze usage patterns and improve user experience</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">HIPAA Compliance</h2>
            <p>
              As a healthcare service provider, we comply with the Health Insurance Portability and Accountability Act (HIPAA). We implement physical, technical, and administrative safeguards to protect your personal health information as required by HIPAA.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Disclosure of Your Information</h2>
            <p>We may disclose your information to:</p>
            <ul className="list-disc ml-6 mb-4">
              <li>Healthcare providers involved in your care</li>
              <li>Insurance companies for billing purposes</li>
              <li>Service providers who perform services on our behalf</li>
              <li>Government authorities when required by law</li>
              <li>Other parties with your explicit consent</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Data Security</h2>
            <p>
              We use industry-standard security measures to protect your information from unauthorized access, disclosure, alteration, and destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc ml-6 mb-4">
              <li>Access and receive a copy of your personal information</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Request deletion of your personal information</li>
              <li>Restrict or object to certain processing of your information</li>
              <li>Receive your information in a structured, commonly used format</li>
              <li>Withdraw consent at any time, where processing is based on consent</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. The updated version will be indicated by an updated "Last Updated" date and the updated version will be effective as soon as it is accessible. We encourage you to review this Privacy Policy frequently to be informed of how we are protecting your information.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
            <p>
              If you have questions or concerns about this Privacy Policy, please contact us at:
            </p>
            <address className="not-italic mt-2 mb-4">
              HealWise<br />
              123 Medical Center Boulevard<br />
              San Francisco, CA 94107<br />
              Email: privacy@healwise.com<br />
              Phone: +1 (555) 123-4567
            </address>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PrivacyPolicy;
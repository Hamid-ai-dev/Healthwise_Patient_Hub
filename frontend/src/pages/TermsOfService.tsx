
import MainLayout from "@/components/layout/MainLayout";

const TermsOfService = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="mb-4">Last Updated: April 13, 2025</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Introduction</h2>
            <p>
              These Terms of Service ("Terms") govern your access to and use of the HealWise healthcare platform, including any related mobile applications and websites (collectively, the "Service"). Please read these Terms carefully before using the Service.
            </p>
            
            <p>
              By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the Terms, you may not access the Service.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Medical Disclaimer</h2>
            <p>
              The information provided by HealWise is not intended to replace professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
            </p>
            
            <p>
              If you think you may have a medical emergency, call your doctor or emergency services immediately. HealWise does not recommend or endorse any specific tests, physicians, products, procedures, opinions, or other information that may be mentioned on the Service.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Account Registration</h2>
            <p>
              To use certain features of the Service, you may need to register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
            </p>
            
            <p>
              You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. You agree not to disclose your password to any third party.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Telemedicine Services</h2>
            <p>
              HealWise facilitates telemedicine consultations between healthcare providers and patients. By using our telemedicine services, you acknowledge that:
            </p>
            <ul className="list-disc ml-6 mb-4">
              <li>Telemedicine is not appropriate for all medical conditions</li>
              <li>Technical failures may delay or interrupt services</li>
              <li>Information transmitted may not be sufficient for proper medical decision-making</li>
              <li>Delays in evaluation or treatment may occur due to failures of electronic equipment</li>
              <li>Security protocols could fail, causing a breach of privacy of personal medical information</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">User Conduct</h2>
            <p>You agree not to:</p>
            <ul className="list-disc ml-6 mb-4">
              <li>Use the Service in any way that violates any applicable laws or regulations</li>
              <li>Impersonate any person or entity or falsely state or misrepresent your affiliation with a person or entity</li>
              <li>Interfere with or disrupt the Service or servers or networks connected to the Service</li>
              <li>Upload or transmit viruses or any other malicious code</li>
              <li>Harvest or collect personally identifiable information from the Service</li>
              <li>Use the Service to send unsolicited communications</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality are and will remain the exclusive property of HealWise and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Limitation of Liability</h2>
            <p>
              In no event shall HealWise, its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
            </p>
            <ul className="list-disc ml-6 mb-4">
              <li>Your access to or use of or inability to access or use the Service</li>
              <li>Any conduct or content of any third party on the Service</li>
              <li>Any content obtained from the Service</li>
              <li>Unauthorized access, use, or alteration of your transmissions or content</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <address className="not-italic mt-2 mb-4">
              HealWise<br />
              123 Medical Center Boulevard<br />
              San Francisco, CA 94107<br />
              Email: legal@healwise.com<br />
              Phone: +1 (555) 123-4567
            </address>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TermsOfService;
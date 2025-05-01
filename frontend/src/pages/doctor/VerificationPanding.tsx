import React from "react";

const VerificationPending = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#F5F6FA] overflow-auto px-4 py-6">
      <div className="bg-white rounded-xl shadow-md w-full max-w-md sm:max-w-lg md:max-w-xl border-t-4 border-blue-500 p-4 sm:p-6 text-center">
        <h2 className="text-lg sm:text-xl font-semibold text-blue-600">Verification in Progress</h2>
        <p className="text-gray-600 text-sm sm:text-base mt-1">Your credentials are being reviewed</p>

        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto my-4 sm:my-6">
          {/* Two-person icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM8 11c1.657 0 3-1.343 3-3S9.657 5 8 5 5 6.343 5 8s1.343 3 3 3zM8 13c-2.67 0-8 1.337-8 4v2h16v-2c0-2.663-5.33-4-8-4zM16 13c-.29 0-.62.02-.97.05 1.17.84 1.97 1.95 1.97 3.45v2h6v-2c0-2.663-5.33-4-8-4z" />
          </svg>
        </div>

        <p className="text-gray-700 text-sm sm:text-base mb-4 sm:mb-6 px-2 sm:px-0">
          Thank you for submitting your credentials for verification. Our team is reviewing your information.
        </p>

        <div className="bg-green-50 border border-green-200 rounded-md p-3 sm:p-4 text-left text-sm sm:text-base mx-2 sm:mx-0">
          <p className="font-semibold mb-2">What happens next?</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Our administrative team is reviewing your submitted documentation</li>
            <li>This process typically takes 1–3 business days</li>
            <li>You'll receive an email notification once the review is complete</li>
            <li>You may be contacted if additional information is needed</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VerificationPending;

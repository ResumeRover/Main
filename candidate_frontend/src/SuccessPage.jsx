import React from 'react';
import { CheckCircle } from 'react-feather';

const SuccessPage = ({ currentPage, setCurrentPage }) => {
  if (currentPage === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={36} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Application Submitted!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for applying. We've received your application and will review it shortly.
            You'll receive an email confirmation with more details.
          </p>
          <button
            onClick={() => setCurrentPage('home')}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-md hover:bg-indigo-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }
  return null;
};

export default SuccessPage;
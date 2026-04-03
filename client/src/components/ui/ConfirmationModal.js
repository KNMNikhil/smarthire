import React from 'react';
import { CheckCircle, X, Calendar, Clock, MapPin, DollarSign } from 'lucide-react';

const ConfirmationModal = ({ isOpen, onClose, company, onConfirm, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-black/95 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h3 className="text-lg font-semibold text-white">Confirm Registration</h3>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-purple-400" />
            </div>
            <h4 className="text-xl font-semibold text-white mb-2">
              Register for {company?.name}?
            </h4>
            <p className="text-gray-400 text-sm">
              You are about to register for this placement opportunity
            </p>
          </div>
          
          {/* Company Details */}
          <div className="bg-white/10 rounded-lg p-4 mb-6 space-y-3">
            <div className="flex items-center text-sm">
              <DollarSign className="w-4 h-4 text-green-400 mr-2" />
              <span className="text-gray-400">Package:</span>
              <span className="text-white ml-2">{company?.package}</span>
            </div>
            
            <div className="flex items-center text-sm">
              <Calendar className="w-4 h-4 text-blue-400 mr-2" />
              <span className="text-gray-400">Drive Date:</span>
              <span className="text-white ml-2">
                {company?.visitDate ? new Date(company.visitDate).toLocaleDateString() : 'TBA'}
              </span>
            </div>
            
            <div className="flex items-center text-sm">
              <Clock className="w-4 h-4 text-yellow-400 mr-2" />
              <span className="text-gray-400">Registration Deadline:</span>
              <span className="text-white ml-2">
                {company?.registrationDeadline ? new Date(company.registrationDeadline).toLocaleDateString() : 'TBA'}
              </span>
            </div>
            
            {company?.location && (
              <div className="flex items-center text-sm">
                <MapPin className="w-4 h-4 text-red-400 mr-2" />
                <span className="text-gray-400">Location:</span>
                <span className="text-white ml-2">{company.location}</span>
              </div>
            )}
          </div>
          
          {/* Important Note */}
          <div className="bg-yellow-600/20 border border-yellow-600/30 rounded-lg p-3 mb-6">
            <p className="text-yellow-200 text-xs">
              <strong>Important:</strong> Once registered, you will receive email confirmation and further instructions. 
              Make sure to check your email regularly for updates.
            </p>
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex space-x-3 p-6 border-t border-white/20">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Registering...' : 'Confirm Registration'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
import React, { useState, useMemo } from 'react';
import { Check, Eye, EyeOff, X } from 'lucide-react';

// Constants
const PASSWORD_REQUIREMENTS = [
  { regex: /.{6,}/, text: 'At least 6 characters' },
  { regex: /[0-9]/, text: 'At least 1 number' },
  { regex: /[a-z]/, text: 'At least 1 lowercase letter' },
  { regex: /[A-Z]/, text: 'At least 1 uppercase letter' },
  { regex: /[@$!%*?&]/, text: 'At least 1 special character' },
];

const STRENGTH_CONFIG = {
  texts: {
    0: 'Enter a password',
    1: 'Weak password',
    2: 'Medium password',
    3: 'Strong password',
    4: 'Very Strong password',
    5: 'Excellent password',
  },
};

const PasswordInput = ({ value, onChange, placeholder = "Create password", name = "password", required = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const calculateStrength = useMemo(() => {
    const requirements = PASSWORD_REQUIREMENTS.map((req) => ({
      met: req.regex.test(value || ''),
      text: req.text,
    }));

    return {
      score: requirements.filter((req) => req.met).length,
      requirements,
    };
  }, [value]);

  return (
    <div className="w-full relative">
      <div className="relative">
        <input
          type={isVisible ? 'text' : 'password'}
          name={name}
          value={value || ''}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          required={required}
          aria-invalid={calculateStrength.score < 4}
          aria-describedby="password-strength"
          className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400"
        />
        <button
          type="button"
          onClick={() => setIsVisible((prev) => !prev)}
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          className="absolute inset-y-0 right-0 outline-none flex items-center justify-center w-9 text-gray-400 hover:text-white"
        >
          {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {value && isFocused && (
        <div className="absolute top-full left-0 mt-2 w-full bg-black/95 border border-white/20 rounded-lg p-3 z-50">
          <div className="flex gap-1 w-full mb-3">
            {[1, 2, 3, 4, 5].map((level) => (
              <span
                key={level}
                className={`h-1 rounded-full w-full ${
                  calculateStrength.score >= level ? 'bg-green-500' : 'bg-white/20'
                }`}
              />
            ))}
          </div>

          <p className="text-xs text-gray-300 flex justify-between mb-2">
            <span>Must contain:</span>
            <span className="text-white">
              {STRENGTH_CONFIG.texts[Math.min(calculateStrength.score, 5)]}
            </span>
          </p>

          <ul className="space-y-1">
            {calculateStrength.requirements.map((req, index) => (
              <li key={index} className="flex items-center space-x-2">
                {req.met ? (
                  <Check size={12} className="text-green-500" />
                ) : (
                  <X size={12} className="text-gray-400" />
                )}
                <span
                  className={`text-xs ${
                    req.met ? 'text-green-400' : 'text-gray-400'
                  }`}
                >
                  {req.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PasswordInput;
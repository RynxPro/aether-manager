import React from 'react';

export type SortOption = {
  value: string;
  label: string;
  icon?: React.ReactNode;
};

interface SortDropdownProps {
  options: SortOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({
  options,
  value,
  onChange,
  className = '',
}) => {
  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-gray-800/50 border border-gray-600 rounded-xl pl-3 pr-10 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 cursor-pointer"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg
          className="h-5 w-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
      {selectedOption?.icon && (
        <div className="absolute inset-y-0 left-3 flex items-center">
          {selectedOption.icon}
        </div>
      )}
    </div>
  );
};

export default SortDropdown;

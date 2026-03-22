"use client"
import { useState, ReactNode } from 'react'; 
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

type DropdownProps = {
  title: string;
  content: ReactNode; 
};

const DropdownComponent = ({ title, content }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border border-gray-300 rounded-xl overflow-hidden">
      <button
        onClick={toggleDropdown}
        className="flex justify-between items-center w-full p-4 text-left hover:bg-gray-100 focus:outline-none transition-colors"
      >
        <span className="font-medium text-gray-700">{title}</span>
        {isOpen ? (
          <FaChevronUp className="text-gray-400" />
        ) : (
          <FaChevronDown className="text-gray-400" />
        )}
      </button>
      
      {isOpen && (
        <div className="p-4 bg-white border-t border-gray-200 animate-in fade-in duration-300">
          {content}
        </div>
      )}
    </div>
  );
};

export default DropdownComponent;
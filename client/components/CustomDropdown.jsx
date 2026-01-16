import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';

const CustomDropdown = ({
    label,
    options,
    value,
    onChange,
    placeholder = "Select an option",
    icon: Icon,
    searchable = false,
    error = null,
    disabled = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions = options.filter(opt =>
        opt.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (option) => {
        if (disabled) return;
        onChange(option);
        setIsOpen(false);
        setSearchTerm('');
    };

    return (
        <div className={`relative w-full ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`} ref={dropdownRef}>
            {label && (
                <label className="block text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 mb-2 ml-1 tracking-[0.2em]">
                    {label}
                </label>
            )}

            <div className="relative group">
                {Icon && (
                    <div className={`absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 z-10 transition-all pointer-events-none ${isOpen ? 'text-blue-500 scale-110' : 'text-gray-400'}`}>
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                )}

                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full flex items-center justify-between pl-10 sm:pl-14 pr-3 sm:pr-4 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 font-bold text-xs sm:text-sm outline-none focus:outline-none
            ${isOpen
                            ? 'bg-white dark:bg-gray-800 border-blue-500 shadow-xl ring-4 ring-blue-500/5'
                            : error
                                ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/50'
                                : disabled
                                    ? 'bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-800 cursor-not-allowed'
                                    : 'bg-gray-50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-800 hover:border-blue-400/50 hover:bg-white dark:hover:bg-gray-800 shadow-sm'
                        }`}
                >
                    <span className={`truncate ${value ? 'text-gray-900 dark:text-white font-black' : 'text-gray-400 font-bold'}`}>
                        {value || placeholder}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-blue-500 transition-transform duration-500 flex-shrink-0 ml-2 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
                </button>
            </div>

            {isOpen && !disabled && (
                <div className="absolute z-[100] mt-2 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl sm:rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.3)] py-3 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-300 overflow-hidden backdrop-blur-xl bg-opacity-95 dark:bg-opacity-95">

                    {searchable && (
                        <div className="px-4 mb-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    autoFocus
                                    type="text"
                                    className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-xl py-2.5 pl-10 pr-4 text-xs font-black text-gray-900 dark:text-white outline-none"
                                    placeholder="Filter options..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        </div>
                    )}

                    <div className="max-h-64 overflow-y-auto custom-scrollbar px-2 space-y-1">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => handleSelect(option)}
                                    className={`w-full text-left px-4 py-2.5 text-[10px] sm:text-xs font-black uppercase tracking-tight transition-all flex items-center justify-between rounded-xl
                    ${value === option
                                            ? 'bg-blue-600 text-white shadow-lg'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400'}`}
                                >
                                    <span className="truncate">{option}</span>
                                    {value === option && <Check className="w-3.5 h-3.5 text-white animate-in zoom-in" />}
                                </button>
                            ))
                        ) : (
                            <div className="py-6 text-center text-gray-400 text-[9px] font-black uppercase tracking-widest">
                                No Results
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomDropdown;
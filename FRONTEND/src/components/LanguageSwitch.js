import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const LanguageSwitch = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-warm-200 bg-white hover:bg-warm-50 hover:border-navy-800 transition-all text-sm font-medium text-navy-900"
      title={language === 'en' ? 'Switch to French' : 'Passer en anglais'}
    >
      <Globe size={16} />
      <span className="uppercase font-bold">{language}</span>
    </button>
  );
};

export default LanguageSwitch;

export interface CountryCode {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
  maxLength: number; // Max length of phone number excluding country code
}

export const countryCodes: CountryCode[] = [
  { name: 'India', code: 'IN', dialCode: '+91', flag: '🇮🇳', maxLength: 10 },
  { name: 'United States', code: 'US', dialCode: '+1', flag: '🇺🇸', maxLength: 10 },
  { name: 'United Kingdom', code: 'GB', dialCode: '+44', flag: '🇬🇧', maxLength: 10 },
  { name: 'Canada', code: 'CA', dialCode: '+1', flag: '🇨🇦', maxLength: 10 },
  { name: 'Australia', code: 'AU', dialCode: '+61', flag: '🇦🇺', maxLength: 9 },
  { name: 'China', code: 'CN', dialCode: '+86', flag: '🇨🇳', maxLength: 11 },
  { name: 'Japan', code: 'JP', dialCode: '+81', flag: '🇯🇵', maxLength: 10 },
  { name: 'Germany', code: 'DE', dialCode: '+49', flag: '🇩🇪', maxLength: 11 },
  { name: 'France', code: 'FR', dialCode: '+33', flag: '🇫🇷', maxLength: 9 },
  { name: 'Brazil', code: 'BR', dialCode: '+55', flag: '🇧🇷', maxLength: 11 },
  { name: 'Mexico', code: 'MX', dialCode: '+52', flag: '🇲🇽', maxLength: 10 },
  { name: 'Spain', code: 'ES', dialCode: '+34', flag: '🇪🇸', maxLength: 9 },
  { name: 'Italy', code: 'IT', dialCode: '+39', flag: '🇮🇹', maxLength: 10 },
  { name: 'Russia', code: 'RU', dialCode: '+7', flag: '🇷🇺', maxLength: 10 },
  { name: 'South Korea', code: 'KR', dialCode: '+82', flag: '🇰🇷', maxLength: 10 },
  { name: 'Indonesia', code: 'ID', dialCode: '+62', flag: '🇮🇩', maxLength: 11 },
  { name: 'Turkey', code: 'TR', dialCode: '+90', flag: '🇹🇷', maxLength: 10 },
  { name: 'Saudi Arabia', code: 'SA', dialCode: '+966', flag: '🇸🇦', maxLength: 9 },
  { name: 'South Africa', code: 'ZA', dialCode: '+27', flag: '🇿🇦', maxLength: 9 },
  { name: 'Argentina', code: 'AR', dialCode: '+54', flag: '🇦🇷', maxLength: 10 },
  { name: 'Egypt', code: 'EG', dialCode: '+20', flag: '🇪🇬', maxLength: 10 },
  { name: 'Netherlands', code: 'NL', dialCode: '+31', flag: '🇳🇱', maxLength: 9 },
  { name: 'Belgium', code: 'BE', dialCode: '+32', flag: '🇧🇪', maxLength: 9 },
  { name: 'Sweden', code: 'SE', dialCode: '+46', flag: '🇸🇪', maxLength: 9 },
  { name: 'Switzerland', code: 'CH', dialCode: '+41', flag: '🇨🇭', maxLength: 9 },
  { name: 'Poland', code: 'PL', dialCode: '+48', flag: '🇵🇱', maxLength: 9 },
  { name: 'Pakistan', code: 'PK', dialCode: '+92', flag: '🇵🇰', maxLength: 10 },
  { name: 'Bangladesh', code: 'BD', dialCode: '+880', flag: '🇧🇩', maxLength: 10 },
  { name: 'Nigeria', code: 'NG', dialCode: '+234', flag: '🇳🇬', maxLength: 10 },
  { name: 'Philippines', code: 'PH', dialCode: '+63', flag: '🇵🇭', maxLength: 10 },
  { name: 'Vietnam', code: 'VN', dialCode: '+84', flag: '🇻🇳', maxLength: 9 },
  { name: 'Thailand', code: 'TH', dialCode: '+66', flag: '🇹🇭', maxLength: 9 },
  { name: 'Singapore', code: 'SG', dialCode: '+65', flag: '🇸🇬', maxLength: 8 },
  { name: 'Malaysia', code: 'MY', dialCode: '+60', flag: '🇲🇾', maxLength: 10 },
  { name: 'New Zealand', code: 'NZ', dialCode: '+64', flag: '🇳🇿', maxLength: 9 },
  { name: 'Ireland', code: 'IE', dialCode: '+353', flag: '🇮🇪', maxLength: 9 },
  { name: 'Portugal', code: 'PT', dialCode: '+351', flag: '🇵🇹', maxLength: 9 },
  { name: 'Greece', code: 'GR', dialCode: '+30', flag: '🇬🇷', maxLength: 10 },
  { name: 'Denmark', code: 'DK', dialCode: '+45', flag: '🇩🇰', maxLength: 8 },
  { name: 'Finland', code: 'FI', dialCode: '+358', flag: '🇫🇮', maxLength: 9 },
  { name: 'Norway', code: 'NO', dialCode: '+47', flag: '🇳🇴', maxLength: 8 },
  { name: 'Austria', code: 'AT', dialCode: '+43', flag: '🇦🇹', maxLength: 10 },
  { name: 'United Arab Emirates', code: 'AE', dialCode: '+971', flag: '🇦🇪', maxLength: 9 },
  { name: 'Israel', code: 'IL', dialCode: '+972', flag: '🇮🇱', maxLength: 9 },
  { name: 'Qatar', code: 'QA', dialCode: '+974', flag: '🇶🇦', maxLength: 8 },
  { name: 'Kuwait', code: 'KW', dialCode: '+965', flag: '🇰🇼', maxLength: 8 },
  { name: 'Sri Lanka', code: 'LK', dialCode: '+94', flag: '🇱🇰', maxLength: 9 },
  { name: 'Nepal', code: 'NP', dialCode: '+977', flag: '🇳🇵', maxLength: 10 },
];

export const getCountryByDialCode = (dialCode: string): CountryCode | undefined => {
  return countryCodes.find(country => country.dialCode === dialCode);
};

export const getCountryByCode = (code: string): CountryCode | undefined => {
  return countryCodes.find(country => country.code === code);
};

// Default country (India)
export const defaultCountry = countryCodes[0]; 
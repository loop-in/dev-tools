export interface TimezoneMetadata {
  city: string;
  country: string;
  flag: string;
  windowsZoneId: string;
  zone: string;
  fav?: boolean;
}

export const TIMEZONES: TimezoneMetadata[] = [
  { city: 'UTC', country: 'Global', flag: '🌐', windowsZoneId: 'UTC', zone: 'UTC', fav: true },
  // North America
  { city: 'New York', country: 'USA', flag: '🇺🇸', windowsZoneId: 'Eastern Standard Time', zone: 'America/New_York', fav: true },
  { city: 'Los Angeles', country: 'USA', flag: '🇺🇸', windowsZoneId: 'Pacific Standard Time', zone: 'America/Los_Angeles' },
  { city: 'Chicago', country: 'USA', flag: '🇺🇸', windowsZoneId: 'Central Standard Time', zone: 'America/Chicago' },
  { city: 'Denver', country: 'USA', flag: '🇺🇸', windowsZoneId: 'Mountain Standard Time', zone: 'America/Denver' },
  { city: 'Phoenix', country: 'USA', flag: '🇺🇸', windowsZoneId: 'US Mountain Standard Time', zone: 'America/Phoenix' },
  { city: 'Anchorage', country: 'USA', flag: '🇺🇸', windowsZoneId: 'Alaskan Standard Time', zone: 'America/Anchorage' },
  { city: 'Honolulu', country: 'USA', flag: '🇺🇸', windowsZoneId: 'Hawaiian Standard Time', zone: 'Pacific/Honolulu' },
  { city: 'Toronto', country: 'Canada', flag: '🇨🇦', windowsZoneId: 'Eastern Standard Time', zone: 'America/Toronto', fav: true },
  { city: 'Vancouver', country: 'Canada', flag: '🇨🇦', windowsZoneId: 'Pacific Standard Time', zone: 'America/Vancouver' },
  { city: 'Mexico City', country: 'Mexico', flag: '🇲🇽', windowsZoneId: 'Central Standard Time (Mexico)', zone: 'America/Mexico_City' },

  // South America
  { city: 'São Paulo', country: 'Brazil', flag: '🇧🇷', windowsZoneId: 'E. South America Standard Time', zone: 'America/Sao_Paulo' },
  { city: 'Rio de Janeiro', country: 'Brazil', flag: '🇧🇷', windowsZoneId: 'E. South America Standard Time', zone: 'America/Sao_Paulo', fav: true },
  { city: 'Buenos Aires', country: 'Argentina', flag: '🇦🇷', windowsZoneId: 'Argentina Standard Time', zone: 'America/Argentina/Buenos_Aires' },
  { city: 'Santiago', country: 'Chile', flag: '🇨🇱', windowsZoneId: 'Pacific SA Standard Time', zone: 'America/Santiago' },
  { city: 'Bogotá', country: 'Colombia', flag: '🇨🇴', windowsZoneId: 'SA Pacific Standard Time', zone: 'America/Bogota' },
  { city: 'Lima', country: 'Peru', flag: '🇵🇪', windowsZoneId: 'SA Pacific Standard Time', zone: 'America/Lima' },
  { city: 'Caracas', country: 'Venezuela', flag: '🇻🇪', windowsZoneId: 'Venezuela Standard Time', zone: 'America/Caracas' },
  { city: 'Guayaquil', country: 'Ecuador', flag: '🇪🇨', windowsZoneId: 'SA Pacific Standard Time', zone: 'America/Guayaquil' },
  { city: 'Montevideo', country: 'Uruguay', flag: '🇺🇾', windowsZoneId: 'Montevideo Standard Time', zone: 'America/Montevideo' },

  // Europe
  { city: 'London', country: 'UK', flag: '🇬🇧', windowsZoneId: 'GMT Standard Time', zone: 'Europe/London', fav: true },
  { city: 'Paris', country: 'France', flag: '🇫🇷', windowsZoneId: 'Romance Standard Time', zone: 'Europe/Paris' },
  { city: 'Berlin', country: 'Germany', flag: '🇩🇪', windowsZoneId: 'W. Europe Standard Time', zone: 'Europe/Berlin' },
  { city: 'Madrid', country: 'Spain', flag: '🇪🇸', windowsZoneId: 'Romance Standard Time', zone: 'Europe/Madrid' },
  { city: 'Rome', country: 'Italy', flag: '🇮🇹', windowsZoneId: 'W. Europe Standard Time', zone: 'Europe/Rome' },
  { city: 'Amsterdam', country: 'Netherlands', flag: '🇳🇱', windowsZoneId: 'W. Europe Standard Time', zone: 'Europe/Amsterdam' },
  { city: 'Brussels', country: 'Belgium', flag: '🇧🇪', windowsZoneId: 'Romance Standard Time', zone: 'Europe/Brussels' },
  { city: 'Zurich', country: 'Switzerland', flag: '🇨🇭', windowsZoneId: 'W. Europe Standard Time', zone: 'Europe/Zurich' },
  { city: 'Vienna', country: 'Austria', flag: '🇦🇹', windowsZoneId: 'W. Europe Standard Time', zone: 'Europe/Vienna' },
  { city: 'Warsaw', country: 'Poland', flag: '🇵🇱', windowsZoneId: 'Central European Standard Time', zone: 'Europe/Warsaw' },
  { city: 'Stockholm', country: 'Sweden', flag: '🇸🇪', windowsZoneId: 'W. Europe Standard Time', zone: 'Europe/Stockholm' },
  { city: 'Oslo', country: 'Norway', flag: '🇳🇴', windowsZoneId: 'W. Europe Standard Time', zone: 'Europe/Oslo' },
  { city: 'Copenhagen', country: 'Denmark', flag: '🇩🇰', windowsZoneId: 'Romance Standard Time', zone: 'Europe/Copenhagen' },
  { city: 'Helsinki', country: 'Finland', flag: '🇫🇮', windowsZoneId: 'FLE Standard Time', zone: 'Europe/Helsinki' },
  { city: 'Athens', country: 'Greece', flag: '🇬🇷', windowsZoneId: 'GTB Standard Time', zone: 'Europe/Athens' },
  { city: 'Moscow', country: 'Russia', flag: '🇷🇺', windowsZoneId: 'Russian Standard Time', zone: 'Europe/Moscow', fav: true },
  { city: 'Kyiv', country: 'Ukraine', flag: '🇺🇦', windowsZoneId: 'FLE Standard Time', zone: 'Europe/Kyiv' },
  { city: 'Istanbul', country: 'Turkey', flag: '🇹🇷', windowsZoneId: 'Turkey Standard Time', zone: 'Europe/Istanbul' },
  { city: 'Lisbon', country: 'Portugal', flag: '🇵🇹', windowsZoneId: 'GMT Standard Time', zone: 'Europe/Lisbon' },
  { city: 'Dublin', country: 'Ireland', flag: '🇮🇪', windowsZoneId: 'GMT Standard Time', zone: 'Europe/Dublin' },
  { city: 'Prague', country: 'Czech Republic', flag: '🇨🇿', windowsZoneId: 'Central Europe Standard Time', zone: 'Europe/Prague' },
  { city: 'Budapest', country: 'Hungary', flag: '🇭🇺', windowsZoneId: 'Central Europe Standard Time', zone: 'Europe/Budapest' },
  { city: 'Bucharest', country: 'Romania', flag: '🇷🇴', windowsZoneId: 'GTB Standard Time', zone: 'Europe/Bucharest' },
  { city: 'Reykjavik', country: 'Iceland', flag: '🇮🇸', windowsZoneId: 'Greenwich Standard Time', zone: 'Atlantic/Reykjavik' },

  // Asia
  { city: 'Tokyo', country: 'Japan', flag: '🇯🇵', windowsZoneId: 'Tokyo Standard Time', zone: 'Asia/Tokyo', fav: true },
  { city: 'Seoul', country: 'South Korea', flag: '🇰🇷', windowsZoneId: 'Korea Standard Time', zone: 'Asia/Seoul' },
  { city: 'Shanghai', country: 'China', flag: '🇨🇳', windowsZoneId: 'China Standard Time', zone: 'Asia/Shanghai' },
  { city: 'Ulaanbaatar', country: 'Mongolia', flag: '🇲🇳', windowsZoneId: 'Ulaanbaatar Standard Time', zone: 'Asia/Ulaanbaatar' },
  { city: 'Beijing', country: 'China', flag: '🇨🇳', windowsZoneId: 'China Standard Time', zone: 'Asia/Shanghai', fav: true },
  { city: 'Hong Kong', country: 'Hong Kong', flag: '🇭🇰', windowsZoneId: 'China Standard Time', zone: 'Asia/Hong_Kong' },
  { city: 'Taipei', country: 'Taiwan', flag: '🇹🇼', windowsZoneId: 'Taipei Standard Time', zone: 'Asia/Taipei' },
  { city: 'Singapore', country: 'Singapore', flag: '🇸🇬', windowsZoneId: 'Singapore Standard Time', zone: 'Asia/Singapore', fav: true },
  { city: 'Kuala Lumpur', country: 'Malaysia', flag: '🇲🇾', windowsZoneId: 'Singapore Standard Time', zone: 'Asia/Kuala_Lumpur' },
  { city: 'Bangkok', country: 'Thailand', flag: '🇹🇭', windowsZoneId: 'SE Asia Standard Time', zone: 'Asia/Bangkok' },
  { city: 'Jakarta', country: 'Indonesia', flag: '🇮🇩', windowsZoneId: 'SE Asia Standard Time', zone: 'Asia/Jakarta' },
  { city: 'Ho Chi Minh City', country: 'Vietnam', flag: '🇻🇳', windowsZoneId: 'SE Asia Standard Time', zone: 'Asia/Ho_Chi_Minh' },
  { city: 'Manila', country: 'Philippines', flag: '🇵🇭', windowsZoneId: 'Singapore Standard Time', zone: 'Asia/Manila' },
  { city: 'Mumbai', country: 'India', flag: '🇮🇳', windowsZoneId: 'India Standard Time', zone: 'Asia/Kolkata' },
  { city: 'Delhi', country: 'India', flag: '🇮🇳', windowsZoneId: 'India Standard Time', zone: 'Asia/Kolkata' },
  { city: 'Dubai', country: 'UAE', flag: '🇦🇪', windowsZoneId: 'Arabian Standard Time', zone: 'Asia/Dubai' },
  { city: 'Riyadh', country: 'Saudi Arabia', flag: '🇸🇦', windowsZoneId: 'Arab Standard Time', zone: 'Asia/Riyadh' },
  { city: 'Jerusalem', country: 'Israel', flag: '🇮🇱', windowsZoneId: 'Israel Standard Time', zone: 'Asia/Jerusalem' },
  { city: 'Tehran', country: 'Iran', flag: '🇮🇷', windowsZoneId: 'Iran Standard Time', zone: 'Asia/Tehran' },
  { city: 'Karachi', country: 'Pakistan', flag: '🇵🇰', windowsZoneId: 'Pakistan Standard Time', zone: 'Asia/Karachi' },
  { city: 'Dhaka', country: 'Bangladesh', flag: '🇧🇩', windowsZoneId: 'Bangladesh Standard Time', zone: 'Asia/Dhaka' },
  { city: 'Amman', country: 'Jordan', flag: '🇯🇴', windowsZoneId: 'Jordan Standard Time', zone: 'Asia/Amman' },
  { city: 'Baghdad', country: 'Iraq', flag: '🇮🇶', windowsZoneId: 'Arabic Standard Time', zone: 'Asia/Baghdad' },
  { city: 'Doha', country: 'Qatar', flag: '🇶🇦', windowsZoneId: 'Arab Standard Time', zone: 'Asia/Qatar' },
  { city: 'Colombo', country: 'Sri Lanka', flag: '🇱🇰', windowsZoneId: 'Sri Lanka Standard Time', zone: 'Asia/Colombo' },
  { city: 'Kathmandu', country: 'Nepal', flag: '🇳🇵', windowsZoneId: 'Nepal Standard Time', zone: 'Asia/Kathmandu' },

  // Oceania
  { city: 'Sydney', country: 'Australia', flag: '🇦🇺', windowsZoneId: 'AUS Eastern Standard Time', zone: 'Australia/Sydney', fav: true },
  { city: 'Melbourne', country: 'Australia', flag: '🇦🇺', windowsZoneId: 'AUS Eastern Standard Time', zone: 'Australia/Melbourne' },
  { city: 'Brisbane', country: 'Australia', flag: '🇦🇺', windowsZoneId: 'E. Australia Standard Time', zone: 'Australia/Brisbane' },
  { city: 'Perth', country: 'Australia', flag: '🇦🇺', windowsZoneId: 'W. Australia Standard Time', zone: 'Australia/Perth' },
  { city: 'Adelaide', country: 'Australia', flag: '🇦🇺', windowsZoneId: 'Cen. Australia Standard Time', zone: 'Australia/Adelaide' },
  { city: 'Auckland', country: 'New Zealand', flag: '🇳🇿', windowsZoneId: 'New Zealand Standard Time', zone: 'Pacific/Auckland', fav: true },
  { city: 'Suva', country: 'Fiji', flag: '🇫🇯', windowsZoneId: 'Fiji Standard Time', zone: 'Pacific/Fiji' },
  { city: 'Wellington', country: 'New Zealand', flag: '🇳🇿', windowsZoneId: 'New Zealand Standard Time', zone: 'Pacific/Auckland' },
  { city: 'Hobart', country: 'Australia', flag: '🇦🇺', windowsZoneId: 'Tasmania Standard Time', zone: 'Australia/Hobart' },

  // Africa
  { city: 'Cairo', country: 'Egypt', flag: '🇪🇬', windowsZoneId: 'Egypt Standard Time', zone: 'Africa/Cairo' },
  { city: 'Johannesburg', country: 'South Africa', flag: '🇿🇦', windowsZoneId: 'South Africa Standard Time', zone: 'Africa/Johannesburg', fav: true },
  { city: 'Nairobi', country: 'Kenya', flag: '🇰🇪', windowsZoneId: 'E. Africa Standard Time', zone: 'Africa/Nairobi' },
  { city: 'Lagos', country: 'Nigeria', flag: '🇳🇬', windowsZoneId: 'W. Central Africa Standard Time', zone: 'Africa/Lagos' },
  { city: 'Casablanca', country: 'Morocco', flag: '🇲🇦', windowsZoneId: 'Morocco Standard Time', zone: 'Africa/Casablanca' },
  { city: 'Accra', country: 'Ghana', flag: '🇬🇭', windowsZoneId: 'Greenwich Standard Time', zone: 'Africa/Accra' },
  { city: 'Addis Ababa', country: 'Ethiopia', flag: '🇪🇹', windowsZoneId: 'E. Africa Standard Time', zone: 'Africa/Addis_Ababa' },
  { city: 'Algiers', country: 'Algeria', flag: '🇩🇿', windowsZoneId: 'W. Central Africa Standard Time', zone: 'Africa/Algiers' },
  { city: 'Dakar', country: 'Senegal', flag: '🇸🇳', windowsZoneId: 'Greenwich Standard Time', zone: 'Africa/Dakar' },
  { city: 'Luanda', country: 'Angola', flag: '🇦🇴', windowsZoneId: 'W. Central Africa Standard Time', zone: 'Africa/Luanda' },
];

export const countryFlags: Record<string, string> = {
  "England": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "France": "🇫🇷",
  "Brazil": "🇧🇷",
  "Argentina": "🇦🇷",
  "Spain": "🇪🇸",
  "Germany": "🇩🇪",
  "Portugal": "🇵🇹",
  "Netherlands": "🇳🇱",
  "Belgium": "🇧🇪",
  "Italy": "🇮🇹",
  "Croatia": "🇭🇷",
  "Morocco": "🇲🇦",
  "Senegal": "🇸🇳",
  "USA": "🇺🇸",
  "Mexico": "🇲🇽",
  "Japan": "🇯🇵",
  "South Korea": "🇰🇷",
  "Canada": "🇨🇦",
  "Uruguay": "🇺🇾",
  "Colombia": "🇨🇴",
  "Nigeria": "🇳🇬",
  "Ecuador": "🇪🇨",
  "Poland": "🇵🇱",
  "Denmark": "🇩🇰",
  "Switzerland": "🇨🇭",
  "Egypt": "🇪🇬",
  "Cameroon": "🇨🇲",
  "Ghana": "🇬🇭",
  "Serbia": "🇷🇸",
  "Iran": "🇮🇷",
  "Australia": "🇦🇺",
  "Ivory Coast": "🇨🇮",
  "Qatar": "🇶🇦",
  "Saudi Arabia": "🇸🇦",
  "Wales": "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
  "Scotland": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
};

export function getFlag(country: string): string {
  return countryFlags[country] || "🌍";
}

export const allCountries = Object.keys(countryFlags).sort();

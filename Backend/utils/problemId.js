export const getLanguageById = (lang) => {
  const language = {
    "c++": 54,
    "cpp": 54,  // Add cpp as an alias for c++
    "java": 62,
    "javascript": 63,
    "python": 71,  // Add Python support
    "c": 50       // Add C as fallback
  };

  const langId = language[lang.toLowerCase()];
  
  // If language not found, use C as fallback
  if (!langId) {
    console.warn(`Language '${lang}' not found, using C (50) as fallback`);
    return 50;
  }
  
  return langId;
};

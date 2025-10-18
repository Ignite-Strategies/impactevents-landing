/**
 * Full Name Parser Utility
 * 
 * Handles parsing full names into first name, last name, and other components.
 * Replaces the manual name splitting that was required in HubSpot.
 * 
 * Features:
 * - Handles common name formats (First Last, Last, First, etc.)
 * - Preserves middle names/initials
 * - Handles titles (Mr., Dr., etc.)
 * - Handles suffixes (Jr., Sr., III, etc.)
 * - Returns structured name object
 */

/**
 * Parse a full name into structured components
 * @param {string} fullName - The full name to parse
 * @returns {Object} - Parsed name components
 * 
 * Example:
 * parseFullName("Dr. John Michael Smith Jr.") 
 * // Returns: {
 * //   firstName: "John",
 * //   lastName: "Smith", 
 * //   middleName: "Michael",
 * //   title: "Dr.",
 * //   suffix: "Jr.",
 * //   fullName: "Dr. John Michael Smith Jr."
 * // }
 */
function parseFullName(fullName) {
  if (!fullName || typeof fullName !== 'string') {
    return {
      firstName: '',
      lastName: '',
      middleName: '',
      title: '',
      suffix: '',
      fullName: fullName || ''
    };
  }

  // Clean up the input
  const cleanedName = fullName.trim().replace(/\s+/g, ' ');
  
  // Common titles
  const titles = ['Mr.', 'Mrs.', 'Ms.', 'Miss', 'Dr.', 'Prof.', 'Rev.', 'Sir', 'Lady', 'Dame'];
  
  // Common suffixes
  const suffixes = ['Jr.', 'Sr.', 'III', 'IV', 'V', 'PhD', 'MD', 'DDS', 'Esq.'];
  
  let nameParts = cleanedName.split(' ');
  let title = '';
  let suffix = '';
  let firstName = '';
  let middleName = '';
  let lastName = '';
  
  // Extract title (first part if it matches a title)
  if (nameParts.length > 0) {
    const firstPart = nameParts[0];
    for (const t of titles) {
      if (firstPart.toLowerCase() === t.toLowerCase()) {
        title = t;
        nameParts = nameParts.slice(1);
        break;
      }
    }
  }
  
  // Extract suffix (last part if it matches a suffix)
  if (nameParts.length > 0) {
    const lastPart = nameParts[nameParts.length - 1];
    for (const s of suffixes) {
      if (lastPart.toLowerCase() === s.toLowerCase()) {
        suffix = s;
        nameParts = nameParts.slice(0, -1);
        break;
      }
    }
  }
  
  // Now work with the remaining name parts
  if (nameParts.length === 0) {
    // Only title/suffix, no actual name
    return {
      firstName: '',
      lastName: '',
      middleName: '',
      title,
      suffix,
      fullName: cleanedName
    };
  } else if (nameParts.length === 1) {
    // Single name part - assume it's first name
    firstName = nameParts[0];
  } else if (nameParts.length === 2) {
    // Two parts - first and last
    firstName = nameParts[0];
    lastName = nameParts[1];
  } else {
    // Three or more parts - first, middle(s), last
    firstName = nameParts[0];
    lastName = nameParts[nameParts.length - 1];
    middleName = nameParts.slice(1, -1).join(' ');
  }
  
  return {
    firstName,
    lastName,
    middleName,
    title,
    suffix,
    fullName: cleanedName
  };
}

/**
 * Parse multiple names from a string (comma-separated)
 * @param {string} namesString - String containing multiple names
 * @returns {Array} - Array of parsed name objects
 */
function parseMultipleNames(namesString) {
  if (!namesString || typeof namesString !== 'string') {
    return [];
  }
  
  const names = namesString.split(',').map(name => name.trim()).filter(name => name.length > 0);
  return names.map(name => parseFullName(name));
}

/**
 * Format a parsed name back to a full name string
 * @param {Object} nameObj - Parsed name object
 * @param {Object} options - Formatting options
 * @returns {string} - Formatted full name
 */
function formatFullName(nameObj, options = {}) {
  const {
    includeTitle = true,
    includeSuffix = true,
    includeMiddleName = true,
    format = 'full' // 'full', 'first_last', 'last_first'
  } = options;
  
  const parts = [];
  
  if (format === 'last_first') {
    // Last, First format
    if (nameObj.lastName) parts.push(nameObj.lastName);
    if (nameObj.firstName) parts.push(nameObj.firstName);
  } else {
    // Standard First Last format
    if (includeTitle && nameObj.title) parts.push(nameObj.title);
    if (nameObj.firstName) parts.push(nameObj.firstName);
    if (includeMiddleName && nameObj.middleName) parts.push(nameObj.middleName);
    if (nameObj.lastName) parts.push(nameObj.lastName);
    if (includeSuffix && nameObj.suffix) parts.push(nameObj.suffix);
  }
  
  return parts.join(' ');
}

/**
 * Validate if a parsed name has required components
 * @param {Object} nameObj - Parsed name object
 * @returns {Object} - Validation result
 */
function validateName(nameObj) {
  const errors = [];
  const warnings = [];
  
  if (!nameObj.firstName && !nameObj.lastName) {
    errors.push('Name must have at least a first name or last name');
  }
  
  if (!nameObj.firstName) {
    warnings.push('Missing first name');
  }
  
  if (!nameObj.lastName) {
    warnings.push('Missing last name');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

module.exports = {
  parseFullName,
  parseMultipleNames,
  formatFullName,
  validateName
};
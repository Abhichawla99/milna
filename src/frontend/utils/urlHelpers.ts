
// Utility function to ensure URLs have proper protocol
export const ensureUrlProtocol = (url: string): string => {
  if (!url) return url;
  
  // Trim whitespace
  const trimmedUrl = url.trim();
  
  // If already has protocol, return as is
  if (trimmedUrl.match(/^https?:\/\//i)) {
    return trimmedUrl;
  }
  
  // Add http:// if no protocol is present
  return `http://${trimmedUrl}`;
};

// Validate if URL is properly formatted
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(ensureUrlProtocol(url));
    return true;
  } catch {
    return false;
  }
};

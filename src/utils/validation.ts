export const isValidUrl = (url: string): boolean => {
  try {
    let urlToValidate = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      urlToValidate = 'https://' + url;
    }
    new URL(urlToValidate);
    return true;
  } catch {
    return false;
  }
};

export const formatUrl = (url: string): string => {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return 'https://' + url;
  }
  return url;
};

export default { isValidUrl, formatUrl };

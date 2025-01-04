// List of disallowed email domains
const DISALLOWED_DOMAINS = [
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com',
    'aol.com',
    'mail.com',
    'icloud.com',
    'protonmail.com',
    'zoho.com',
    'yandex.com',
    'live.com',
    'inbox.com',
    'gmx.com'
  ];
  
  export const isOrganizationEmail = (email: string): boolean => {
    try {
      const domain = email.split('@')[1].toLowerCase();
      return !DISALLOWED_DOMAINS.includes(domain);
    } catch {
      return false;
    }
  };
  
  export const getEmailError = (email: string): string | null => {
    if (!email) return 'Email is required';
    if (!email.includes('@')) return 'Invalid email format';
    if (!isOrganizationEmail(email)) {
      return 'Please use your organization email address. Personal email domains (like Gmail, Yahoo, etc.) are not allowed.';
    }
    return null;
  };
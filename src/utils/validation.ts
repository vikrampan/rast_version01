export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  export const validatePassword = (password: string): {
    isValid: boolean;
    message: string;
  } => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);
  
    if (password.length < minLength) {
      return {
        isValid: false,
        message: 'Password must be at least 8 characters long'
      };
    }
  
    if (!hasUpperCase) {
      return {
        isValid: false,
        message: 'Password must contain at least one uppercase letter'
      };
    }
  
    if (!hasLowerCase) {
      return {
        isValid: false,
        message: 'Password must contain at least one lowercase letter'
      };
    }
  
    if (!hasNumbers) {
      return {
        isValid: false,
        message: 'Password must contain at least one number'
      };
    }
  
    if (!hasSpecialChar) {
      return {
        isValid: false,
        message: 'Password must contain at least one special character'
      };
    }
  
    return {
      isValid: true,
      message: 'Password is valid'
    };
  };
  
  export const validateAccessLevel = (
    accessLevel: string
  ): accessLevel is 'inspection' | 'maintenance' | 'leadership' => {
    return ['inspection', 'maintenance', 'leadership'].includes(accessLevel);
  };
  
  export const validateRegistrationInput = (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    organization: string;
    accessLevel: string;
  }) => {
    const errors: string[] = [];
  
    if (!data.firstName?.trim()) {
      errors.push('First name is required');
    }
  
    if (!data.lastName?.trim()) {
      errors.push('Last name is required');
    }
  
    if (!data.email?.trim()) {
      errors.push('Email is required');
    } else if (!validateEmail(data.email)) {
      errors.push('Invalid email format');
    }
  
    if (!data.organization?.trim()) {
      errors.push('Organization name is required');
    }
  
    if (!data.accessLevel?.trim()) {
      errors.push('Access level is required');
    } else if (!validateAccessLevel(data.accessLevel)) {
      errors.push('Invalid access level');
    }
  
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.isValid) {
      errors.push(passwordValidation.message);
    }
  
    return {
      isValid: errors.length === 0,
      errors
    };
  };
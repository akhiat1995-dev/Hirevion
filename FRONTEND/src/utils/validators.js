export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^\+?[\d\s-]{8,15}$/;
  return re.test(phone);
};

export const validateFile = (file, options = {}) => {
  const {
    allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    maxSize = 10 * 1024 * 1024, // 10MB
    maxFiles = 1
  } = options;

  const errors = [];

  if (!file) {
    errors.push("No file selected");
    return { valid: false, errors };
  }

  if (!allowedTypes.includes(file.type)) {
    errors.push(`Invalid file type. Allowed: ${allowedTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')}`);
  }

  if (file.size > maxSize) {
    errors.push(`File too large. Maximum size: ${maxSize / (1024 * 1024)}MB`);
  }

  return { valid: errors.length === 0, errors };
};

export const validateFiles = (files, options = {}) => {
  const {
    allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    maxSize = 10 * 1024 * 1024,
    maxFiles = 10
  } = options;

  const errors = [];

  if (!files || files.length === 0) {
    errors.push("No files selected");
    return { valid: false, errors };
  }

  if (files.length > maxFiles) {
    errors.push(`Too many files. Maximum: ${maxFiles}`);
  }

  for (const file of files) {
    if (!allowedTypes.includes(file.type)) {
      errors.push(`${file.name}: Invalid file type`);
    }
    if (file.size > maxSize) {
      errors.push(`${file.name}: File too large (${(file.size / (1024 * 1024)).toFixed(1)}MB > ${maxSize / (1024 * 1024)}MB)`);
    }
  }

  return { valid: errors.length === 0, errors };
};

export const validateJobTitle = (title) => {
  if (!title || title.trim().length < 3) {
    return { valid: false, error: "Job title must be at least 3 characters" };
  }
  if (title.length > 200) {
    return { valid: false, error: "Job title must be less than 200 characters" };
  }
  return { valid: true, error: null };
};

export const validateJobRequirements = (requirements) => {
  if (!requirements || requirements.trim().length < 20) {
    return { valid: false, error: "Job requirements must be at least 20 characters" };
  }
  return { valid: true, error: null };
};

export const validateNumber = (value, min = 1, max = 100) => {
  const num = parseInt(value);
  if (isNaN(num)) {
    return { valid: false, error: "Must be a valid number" };
  }
  if (num < min) {
    return { valid: false, error: `Must be at least ${min}` };
  }
  if (num > max) {
    return { valid: false, error: `Must be at most ${max}` };
  }
  return { valid: true, error: null };
};

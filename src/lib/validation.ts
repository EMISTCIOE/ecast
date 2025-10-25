// Form Validation Utilities
// Handles client-side validation for all content types

export interface ValidationErrors {
  [key: string]: string;
}

// General Validators
export const validateRequired = (
  value: string,
  fieldName: string
): string | null => {
  if (!value || value.trim().length === 0) {
    return `${fieldName} is required.`;
  }
  return null;
};

export const validateMaxLength = (
  value: string,
  maxLength: number,
  fieldName: string
): string | null => {
  if (value && value.length > maxLength) {
    return `${fieldName} must be less than ${maxLength} characters.`;
  }
  return null;
};

export const validateURL = (value: string): string | null => {
  if (!value || value.trim().length === 0) return null; // Optional field

  const trimmed = value.trim();
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    return "Please enter a valid URL (must start with http:// or https://).";
  }

  try {
    new URL(trimmed);
    return null;
  } catch {
    return "Please enter a valid URL.";
  }
};

export const validateEmail = (value: string): string | null => {
  if (!value || value.trim().length === 0) return null; // Optional field

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value.trim())) {
    return "Please enter a valid email address.";
  }
  return null;
};

export const validateDate = (value: string): string | null => {
  if (!value) return "Date is required.";

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(value)) {
    return "Please provide a valid date in YYYY-MM-DD format.";
  }

  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return "Please provide a valid date.";
  }

  return null;
};

export const validateTime = (value: string): string | null => {
  if (!value) return "Time is required.";

  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(value)) {
    return "Please provide a valid time in HH:MM format.";
  }

  return null;
};

export const validateFileSize = (
  file: File | null,
  maxSizeMB: number,
  fieldName: string
): string | null => {
  if (!file) return null; // Optional file

  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return `File is too large (${(file.size / (1024 * 1024)).toFixed(
      1
    )}MB). Maximum allowed size is ${maxSizeMB}MB.`;
  }

  return null;
};

export const validateImageFile = (file: File | null): string | null => {
  if (!file) return null;

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return "Please upload a valid image file (JPG, PNG, or GIF).";
  }

  return validateFileSize(file, 10, "Image");
};

export const validateDocumentFile = (file: File | null): string | null => {
  if (!file) return null;

  const allowedExtensions = ["pdf", "doc", "docx", "ppt", "pptx"];
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (!extension || !allowedExtensions.includes(extension)) {
    return "Invalid file format. Please upload a PDF, DOC, DOCX, PPT, or PPTX file.";
  }

  return validateFileSize(file, 25, "Document");
};

// Content-Specific Validators

export const validateResearchForm = (data: {
  title: string;
  abstract: string;
  authors: string;
  url?: string;
  doi?: string;
  journalName?: string;
  keywords?: string;
  document?: File | null;
}): ValidationErrors => {
  const errors: ValidationErrors = {};

  const titleError =
    validateRequired(data.title, "Title") ||
    validateMaxLength(data.title, 300, "Title");
  if (titleError) errors.title = titleError;

  const abstractError = validateRequired(data.abstract, "Abstract");
  if (abstractError) errors.abstract = abstractError;

  const authorsError =
    validateRequired(data.authors, "Authors") ||
    validateMaxLength(data.authors, 500, "Authors");
  if (authorsError) errors.authors = authorsError;

  if (data.url) {
    const urlError = validateURL(data.url);
    if (urlError) errors.url = urlError;
  }

  if (data.doi) {
    const doiError = validateMaxLength(data.doi, 200, "DOI");
    if (doiError) errors.doi = doiError;
  }

  if (data.journalName) {
    const journalError = validateMaxLength(
      data.journalName,
      200,
      "Journal name"
    );
    if (journalError) errors.journal_name = journalError;
  }

  if (data.keywords) {
    const keywordsError = validateMaxLength(data.keywords, 500, "Keywords");
    if (keywordsError) errors.keywords = keywordsError;
  }

  if (data.document) {
    const docError = validateDocumentFile(data.document);
    if (docError) errors.document = docError;
  }

  return errors;
};

export const validateBlogForm = (data: {
  title: string;
  description: string;
  content: string;
  coverImage?: File | null;
}): ValidationErrors => {
  const errors: ValidationErrors = {};

  const titleError =
    validateRequired(data.title, "Title") ||
    validateMaxLength(data.title, 200, "Title");
  if (titleError) errors.title = titleError;

  const descError =
    validateRequired(data.description, "Description") ||
    validateMaxLength(data.description, 500, "Description");
  if (descError) errors.description = descError;

  const contentError = validateRequired(data.content, "Content");
  if (contentError) errors.content = contentError;

  if (data.coverImage) {
    const imageError = validateImageFile(data.coverImage);
    if (imageError) errors.cover_image = imageError;
  }

  return errors;
};

export const validateEventForm = (data: {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  contactEmail?: string;
  formLink?: string;
  image?: File | null;
}): ValidationErrors => {
  const errors: ValidationErrors = {};

  const titleError =
    validateRequired(data.title, "Title") ||
    validateMaxLength(data.title, 200, "Title");
  if (titleError) errors.title = titleError;

  const descError = validateRequired(data.description, "Description");
  if (descError) errors.description = descError;

  const dateError = validateDate(data.date);
  if (dateError) errors.date = dateError;

  const timeError = validateTime(data.time);
  if (timeError) errors.time = timeError;

  const locError =
    validateRequired(data.location, "Location") ||
    validateMaxLength(data.location, 300, "Location");
  if (locError) errors.location = locError;

  if (data.contactEmail) {
    const emailError = validateEmail(data.contactEmail);
    if (emailError) errors.contact_email = emailError;
  }

  if (data.formLink) {
    const urlError = validateURL(data.formLink);
    if (urlError) errors.form_link = urlError;
  }

  if (data.image) {
    const imageError = validateImageFile(data.image);
    if (imageError) errors.image = imageError;
  }

  return errors;
};

export const validateNoticeForm = (data: {
  title: string;
  content: string;
  attachment?: File | null;
}): ValidationErrors => {
  const errors: ValidationErrors = {};

  const titleError =
    validateRequired(data.title, "Title") ||
    validateMaxLength(data.title, 200, "Title");
  if (titleError) errors.title = titleError;

  const contentError = validateRequired(data.content, "Content");
  if (contentError) errors.content = contentError;

  if (data.attachment) {
    const fileError = validateFileSize(data.attachment, 10, "Attachment");
    if (fileError) errors.attachment = fileError;
  }

  return errors;
};

export const validateProjectForm = (data: {
  title: string;
  description: string;
  repoLink?: string;
  liveLink?: string;
  image?: File | null;
}): ValidationErrors => {
  const errors: ValidationErrors = {};

  const titleError = validateRequired(data.title, "Title");
  if (titleError) errors.title = titleError;

  const descError = validateRequired(data.description, "Description");
  if (descError) errors.description = descError;

  if (data.repoLink) {
    const repoError = validateURL(data.repoLink);
    if (repoError) errors.repo_link = repoError;
  }

  if (data.liveLink) {
    const liveError = validateURL(data.liveLink);
    if (liveError) errors.live_link = liveError;
  }

  if (data.image) {
    const imageError = validateFileSize(data.image, 5, "Image");
    if (imageError) errors.image = imageError;
  } else {
    errors.image = "Project image is required.";
  }

  return errors;
};

export const validateGalleryForm = (data: {
  title: string;
  image?: File | null;
}): ValidationErrors => {
  const errors: ValidationErrors = {};

  const titleError =
    validateRequired(data.title, "Title") ||
    validateMaxLength(data.title, 200, "Title");
  if (titleError) errors.title = titleError;

  if (!data.image) {
    errors.image = "Image is required.";
  } else {
    const imageError = validateImageFile(data.image);
    if (imageError) errors.image = imageError;
  }

  return errors;
};

// Handle backend API errors
export const parseBackendErrors = (errorData: any): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (typeof errorData === "object" && errorData !== null) {
    Object.keys(errorData).forEach((key) => {
      if (Array.isArray(errorData[key]) && errorData[key].length > 0) {
        errors[key] = errorData[key][0]; // Take first error message
      } else if (typeof errorData[key] === "string") {
        errors[key] = errorData[key];
      }
    });
  }

  return errors;
};

// Scroll to first error field
export const scrollToFirstError = () => {
  setTimeout(() => {
    const errorElement = document.querySelector(
      ".error-message, .border-red-500"
    );
    if (errorElement) {
      errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, 100);
};

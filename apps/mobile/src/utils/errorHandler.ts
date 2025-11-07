// apps/mobile/src/utils/errorHandler.ts

/**
 * Custom error classes matching backend error types
 */
export class ValidationError extends Error {
  code: string;
  details: any[];
  status: number;

  constructor(errorData: any) {
    super(errorData.message || 'Validation failed');
    this.name = 'ValidationError';
    this.code = errorData.code;
    this.details = errorData.details || [];
    this.status = errorData.status || 400;
  }
}

export class ApplicationError extends Error {
  code: string;
  status: number;
  details?: any;

  constructor(errorData: any) {
    super(errorData.message || 'Application error');
    this.name = 'ApplicationError';
    this.code = errorData.code;
    this.status = errorData.status || 500;
    this.details = errorData.details;
  }
}

export class AuthenticationError extends Error {
  code: string;
  status: number;

  constructor(errorData: any) {
    super(errorData.message || 'Authentication failed');
    this.name = 'AuthenticationError';
    this.code = errorData.code;
    this.status = errorData.status || 401;
  }
}

export class AuthorizationError extends Error {
  code: string;
  status: number;

  constructor(errorData: any) {
    super(errorData.message || 'Authorization failed');
    this.name = 'AuthorizationError';
    this.code = errorData.code;
    this.status = errorData.status || 403;
  }
}

export class NotFoundError extends Error {
  code: string;
  status: number;

  constructor(errorData: any) {
    super(errorData.message || 'Resource not found');
    this.name = 'NotFoundError';
    this.code = errorData.code;
    this.status = errorData.status || 404;
  }
}

export class ConflictError extends Error {
  code: string;
  status: number;

  constructor(errorData: any) {
    super(errorData.message || 'Conflict error');
    this.name = 'ConflictError';
    this.code = errorData.code;
    this.status = errorData.status || 409;
  }
}

export const processFieldErrors = (details: any[]) => {
  if (!details || !Array.isArray(details)) return {};

  const fieldErrors: Record<string, any> = {};

  details.forEach(detail => {
    if (!detail.field) return;

    fieldErrors[detail.field] = {
      rule: detail.rule,
      expected: detail.expected,
      message: getValidationMessage(detail)
    };
  });

  return fieldErrors;
};

const getValidationMessage = (detail: any) => {
  const { rule, expected, field } = detail;

  const messages: Record<string, string> = {
    min_length: `Debe tener al menos ${expected} caracteres`,
    max_length: `No debe exceder ${expected} caracteres`,
    invalid_format: 'Formato inválido',
    invalid_email: 'El formato del correo electrónico es inválido',
    required: 'Este campo es requerido',
    unique: 'Este valor ya está registrado',
    email_exists: 'Este correo electrónico ya está registrado',
    password_mismatch: 'Las contraseñas no coinciden',
    passwords_do_not_match: 'Las contraseñas no coinciden',
  };

  return messages[rule] || detail.message || `Error en el campo ${field}`;
};

export const createErrorFromResponse = (errorData: any) => {
  const { code } = errorData;

  const errorMap: Record<string, any> = {
    'INPUT_VALIDATION_FAILED': ValidationError,
    'AUTHENTICATION_FAILED': AuthenticationError,
    'AUTHENTICATION_FAILURE': AuthenticationError,
    'AUTHORIZATION_FAILED': AuthorizationError,
    'RESOURCE_NOT_FOUND': NotFoundError,
    'RESOURCE_CONFLICT': ConflictError,
  };

  const ErrorClass = errorMap[code] || ApplicationError;
  return new ErrorClass(errorData);
};

export const getDisplayMessage = (error: any): string => {
  if (error instanceof ValidationError && error.details?.length > 0) {
    const firstError = error.details[0];
    return getValidationMessage(firstError);
  }

  if (error instanceof AuthenticationError) {
    return 'Credenciales inválidas. Por favor, verifica tu usuario y contraseña.';
  }

  if (error instanceof AuthorizationError) {
    return 'No tienes permisos para realizar esta acción.';
  }

  if (error instanceof NotFoundError) {
    return 'El recurso solicitado no existe o ha sido eliminado.';
  }

  if (error instanceof ConflictError) {
    return 'Ya existe un recurso con estos datos. Por favor, verifica la información.';
  }

  return error.message || 'Ha ocurrido un error. Por favor, intenta nuevamente.';
};
/**
 * Custom error classes matching backend error types
 */
export class ValidationError extends Error {
  constructor(errorData) {
    super(errorData.message || 'Validation failed');
    this.name = 'ValidationError';
    this.code = errorData.code;
    this.details = errorData.details || []; 
    this.status = errorData.status || 400;
  }
}

export class ApplicationError extends Error {
  constructor(errorData) {
    super(errorData.message || 'Application error');
    this.name = 'ApplicationError';
    this.code = errorData.code;
    this.status = errorData.status || 500;
    this.details = errorData.details;
  }
}

export class AuthenticationError extends Error {
  constructor(errorData) {
    super(errorData.message || 'Authentication failed');
    this.name = 'AuthenticationError';
    this.code = errorData.code;
    this.status = errorData.status || 401;
  }
}

export class AuthorizationError extends Error {
  constructor(errorData) {
    super(errorData.message || 'Authorization failed');
    this.name = 'AuthorizationError';
    this.code = errorData.code;
    this.status = errorData.status || 403;
  }
}

export class NotFoundError extends Error {
  constructor(errorData) {
    super(errorData.message || 'Resource not found');
    this.name = 'NotFoundError';
    this.code = errorData.code;
    this.status = errorData.status || 404;
  }
}

export class ConflictError extends Error {
  constructor(errorData) {
    super(errorData.message || 'Conflict error');
    this.name = 'ConflictError';
    this.code = errorData.code;
    this.status = errorData.status || 409;
  }
}

/**
 * Procesa el array de detalles de validación del backend
 * Convierte el formato del backend en un objeto clave-valor para formularios
 * 
 * Backend format:
 * {
 *   "error": {
 *     "code": "INPUT_VALIDATION_FAILED",
 *     "message": "Input validation failed.",
 *     "details": [
 *       { "field": "password", "rule": "min_length", "expected": 8 },
 *       { "field": "email", "rule": "invalid_format" }
 *     ]
 *   }
 * }
 * 
 * Output format:
 * {
 *   "password": {
 *     "rule": "min_length",
 *     "expected": 8,
 *     "message": "Debe tener al menos 8 caracteres"
 *   },
 *   "email": {
 *     "rule": "invalid_format",
 *     "message": "Formato inválido"
 *   }
 * }
 * 
 * @param {Array} details - Array de objetos de validación del backend
 * @returns {Object} Objeto con errores por campo
 */
export const processFieldErrors = (details) => {
  if (!details || !Array.isArray(details)) return {};
  
  const fieldErrors = {};
  
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

/**
 * Mensajes de validación traducidos según las reglas del backend
 */
const getValidationMessage = (detail) => {
  const { rule, expected, field } = detail;
  
  const messages = {
    // Validaciones de longitud
    min_length: `Debe tener al menos ${expected} caracteres`,
    max_length: `No debe exceder ${expected} caracteres`,
    
    // Validaciones de formato
    invalid_format: 'Formato inválido',
    invalid_email: 'El formato del correo electrónico es inválido',
    invalid_phone: 'El formato del teléfono es inválido',
    invalid_url: 'El formato de la URL es inválido',
    
    // Validaciones de requerimiento
    required: 'Este campo es requerido',
    missing_field: 'Este campo no puede estar vacío',
    
    // Validaciones de unicidad
    unique: 'Este valor ya está registrado',
    email_exists: 'Este correo electrónico ya está registrado',
    username_exists: 'Este nombre de usuario ya está en uso',
    
    // Validaciones de contraseña
    password_mismatch: 'Las contraseñas no coinciden',
    passwords_do_not_match: 'Las contraseñas no coinciden',
    weak_password: 'La contraseña es muy débil. Debe incluir mayúsculas, minúsculas, números y caracteres especiales',
    
    // Validaciones de tipo
    invalid_type: `Tipo de dato inválido para ${field}`,
    
    // Validaciones de rango
    out_of_range: `El valor debe estar entre ${expected?.min || 0} y ${expected?.max || '∞'}`,
    
    // Validaciones de archivo
    file_too_large: `El archivo no debe superar ${expected} MB`,
    invalid_file_type: 'Tipo de archivo no permitido',
    
    // Validaciones de relaciones
    not_found: 'El recurso especificado no existe',
    invalid_reference: 'Referencia inválida',
    
    // Validaciones de negocio
    business_rule_violation: detail.message || 'Violación de regla de negocio'
  };
  
  return messages[rule] || detail.message || `Error en el campo ${field}`;
};

/**
 * Crea instancia del error apropiado según el código del backend
 * 
 * @param {Object} errorData - Objeto de error del backend
 * @returns {Error} Instancia del tipo de error apropiado
 */
export const createErrorFromResponse = (errorData) => {
  const { code } = errorData;
  
  // Mapeo de códigos del backend a clases de error del frontend
  const errorMap = {
    // Validación
    'INPUT_VALIDATION_FAILED': ValidationError,
    'INVALID_INPUT': ValidationError,
    
    // Autenticación
    'AUTHENTICATION_FAILED': AuthenticationError,
    'AUTHENTICATION_FAILURE': AuthenticationError,
    'INVALID_CREDENTIALS': AuthenticationError,
    'TOKEN_EXPIRED': AuthenticationError,
    'TOKEN_INVALID': AuthenticationError,
    
    // Autorización
    'AUTHORIZATION_FAILED': AuthorizationError,
    'INSUFFICIENT_PERMISSIONS': AuthorizationError,
    'ACCESS_DENIED': AuthorizationError,
    
    // Not Found
    'RESOURCE_NOT_FOUND': NotFoundError,
    'USER_NOT_FOUND': NotFoundError,
    'APPLICATION_NOT_FOUND': NotFoundError,
    
    // Conflictos
    'RESOURCE_CONFLICT': ConflictError,
    'DUPLICATE_ENTRY': ConflictError,
    'EMAIL_EXISTS': ConflictError
  };
  
  const ErrorClass = errorMap[code] || ApplicationError;
  return new ErrorClass(errorData);
};

/**
 * Extrae mensaje de error amigable para mostrar al usuario
 * 
 * @param {Error} error - Instancia de error
 * @returns {string} Mensaje formateado para el usuario
 */
export const getDisplayMessage = (error) => {
  // Si es un ValidationError con detalles, retornar el primer error
  if (error instanceof ValidationError && error.details?.length > 0) {
    const firstError = error.details[0];
    return getValidationMessage(firstError);
  }
  
  // Mensajes específicos por tipo de error
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
  
  // Mensaje por defecto
  return error.message || 'Ha ocurrido un error. Por favor, intenta nuevamente.';
};
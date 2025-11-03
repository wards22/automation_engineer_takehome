// For tests and logging

export class PortalError extends Error {
  constructor(message, info = {}) { super(message); this.name = 'PortalError'; this.info = info; }
}
export class AuthError extends PortalError {
  constructor(message = 'Invalid credentials', info = {}) { super(message, info); this.name = 'AuthError'; }
}
export class NetworkError extends PortalError {
  constructor(message = 'Network/navigation error', info = {}) { super(message, info); this.name = 'NetworkError'; }
}
export class FormError extends PortalError {
  constructor(message = 'Form submit error', info = {}) { super(message, info); this.name = 'FormError'; }
}

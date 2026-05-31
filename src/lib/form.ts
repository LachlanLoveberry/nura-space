/** Pull the first human-readable message out of a TanStack Form field's error array. */
export function getFirstError(errors: Array<unknown>) {
  const error = errors[0]
  if (typeof error === 'string') {
    return error
  }

  if (typeof error === 'object' && error && 'message' in error) {
    return String((error as { message?: unknown }).message ?? '')
  }

  return null
}

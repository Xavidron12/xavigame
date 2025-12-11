// =====================================================
// OBSERVABLE STATE — Sistema reactivo ligero
// =====================================================

// Cada propiedad puede tener múltiples suscriptores
const listeners = new Map();

/**
 * Suscribir a un campo concreto del estado.
 */
export function subscribe(key, callback) {
  if (!listeners.has(key)) {
    listeners.set(key, new Set());
  }
  listeners.get(key).add(callback);
}

/**
 * Desuscribir (por si lo necesitas en componentes).
 */
export function unsubscribe(key, callback) {
  if (listeners.has(key)) {
    listeners.get(key).delete(callback);
  }
}

/**
 * Notifica a todos los listeners que un campo cambió.
 */
export function notify(key, value) {
  if (!listeners.has(key)) return;

  for (const cb of listeners.get(key)) {
    cb(value);
  }
}

/**
 * Crea un proxy que vigila modificaciones
 * de GameState y dispara notificaciones automáticamente.
 */
export function makeObservableState(state) {
  return new Proxy(state, {
    set(obj, prop, value) {
      obj[prop] = value;

      // Notificar a los listeners de esa propiedad
      notify(prop, value);

      return true;
    }
  });
}

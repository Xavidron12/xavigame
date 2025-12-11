// =====================================================
// OBSERVABLE STATE — Sistema reactivo ligero SIN BUCLES
// =====================================================

const listeners = new Map();
let isEmitting = false;  // <-- evita efecto cascada

export function subscribe(key, callback) {
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key).add(callback);
}

export function unsubscribe(key, callback) {
  if (listeners.has(key)) listeners.get(key).delete(callback);
}

export function notify(key, value) {
  if (isEmitting) return;      // ⛔ protección anti-bucles
  isEmitting = true;

  const subs = listeners.get(key);
  if (subs) {
    for (const cb of subs) cb(value);
  }

  isEmitting = false;
}

// PROXY SEGURO
export function makeObservableState(state) {
  return new Proxy(state, {
    set(obj, prop, value) {
      const changed = obj[prop] !== value;
      obj[prop] = value;

      if (changed) notify(prop, value);
      return true;
    }
  });
}

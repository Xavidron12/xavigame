const listeners = new Map();

export function subscribe(key, fn) {
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key).add(fn);
}

export function notify(key, value) {
  const subs = listeners.get(key);
  if (!subs) return;
  for (const fn of subs) fn(value);
}

export function makeObservableState(state) {
  return new Proxy(state, {
    set(obj, prop, value) {
      obj[prop] = value;
      notify(prop, value);
      return true;
    }
  });
}

import { BehaviorSubject } from "rxjs";

const subjects = new Map();

function getSubject(key) {
  if (!subjects.has(key)) subjects.set(key, new BehaviorSubject(undefined));
  return subjects.get(key);
}

export function subscribe(key, fn) {
  const sub = getSubject(key).subscribe((value) => {
    if (value !== undefined) fn(value);
  });
  return sub;
}

export function notify(key, value) {
  getSubject(key).next(value);
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

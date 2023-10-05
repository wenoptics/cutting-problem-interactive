export function mapValues<T, V>(obj: T, fn: (...any) => V) {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, fn(v)]));
}

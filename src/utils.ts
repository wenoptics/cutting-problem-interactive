export function mapValues<T extends object, V>(
  obj: T,
  fn: (v: T[keyof T]) => V,
) {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, fn(v)]));
}

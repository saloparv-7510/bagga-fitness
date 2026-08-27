/* Named-token interpolation for translatable strings, e.g.
   interpolate('© {year} {brand}', { year: 2026, brand: 'BAGGA FITNESS' }).

   Kept tiny and dependency-free on purpose: it is the one place both t() and
   the context's default value format a string, so English and Hindi share the
   exact same substitution rules. A token with no matching var is left as-is
   ({x} stays {x}) rather than becoming "undefined". */
export function interpolate(str, vars) {
  if (vars == null || typeof str !== 'string') return str
  return str.replace(/\{(\w+)\}/g, (m, key) =>
    Object.prototype.hasOwnProperty.call(vars, key) ? String(vars[key]) : m
  )
}

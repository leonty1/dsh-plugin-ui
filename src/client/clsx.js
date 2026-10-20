/** Minimal class-name joiner: strings and falsy values, matching how the ported components call clsx. */
export default function clsx(...parts) {
  return parts.filter(part => typeof part === 'string' && part.length > 0).join(' ')
}

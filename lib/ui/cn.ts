/**
 * Anything a `cond && "class"` expression can evaluate to. The falsey branch of
 * such an expression can be any non-object falsey value (e.g. `0`/`0n` when the
 * condition is a `ReactNode` like a `leadingIcon`), so we accept the full set
 * and drop non-strings at runtime — callers never need to wrap conditions in
 * `Boolean(...)`.
 */
type ClassValue = string | number | bigint | boolean | null | undefined;

/**
 * Tiny class-name joiner for design-system components. Keeps only the string
 * arguments so conditional classes read cleanly: cn("base", active && "on",
 * leadingIcon && "pl-12").
 *
 * Intentionally dependency-free. If class precedence/merging ever becomes a
 * problem, swap the internals for clsx + tailwind-merge without touching call
 * sites.
 */
export function cn(...classes: ClassValue[]): string {
  return classes.filter((c): c is string => typeof c === "string").join(" ");
}

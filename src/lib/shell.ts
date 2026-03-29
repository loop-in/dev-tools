/**
 * Safely escapes a string for use as a shell argument in bash.
 * This wraps the string in single quotes and safely escapes any embedded single quotes.
 */
export function escapeShellArg(arg: string): string {
  if (!arg) return "''";
  return `'${arg.replace(/'/g, "'\\''")}'`;
}

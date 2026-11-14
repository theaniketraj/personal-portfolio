/**
 * Safely serializes an object into a JSON-LD string suitable for embedding directly
 * into an HTML `<script type="application/ld+json">` tag.
 *
 * Hardening:
 * Replaces all occurrences of `<` with the standard JSON Unicode escape sequence `\u003c`.
 * This prevents script context breakout attacks (e.g. `</script>`, `<!--`) where authored
 * or dynamically computed strings might otherwise prematurely terminate the script element.
 *
 * Search engines and standard JSON parsers decode `\u003c` identically to `<`.
 */
export function serializeJsonLd(data: unknown): string {
    return JSON.stringify(data).replaceAll('<', String.raw`\u003c`);
}

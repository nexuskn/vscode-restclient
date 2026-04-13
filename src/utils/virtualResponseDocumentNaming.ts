import { HttpResponse } from '../models/httpResponse';

const DEFAULT_STEM = 'Response';

/**
 * Sanitize `@name` (or default) for use in a virtual document tab label.
 */
export function sanitizeResponseTabStem(raw: string | undefined): string {
    const trimmed = raw?.trim();
    const base = trimmed && trimmed.length > 0 ? trimmed : DEFAULT_STEM;
    const cleaned = base.replace(/[<>:"/\\|?*\x00-\x1f]/g, '_').replace(/\s+/g, ' ').trim();
    const truncated = cleaned.slice(0, 120);
    return truncated.length > 0 ? truncated : DEFAULT_STEM;
}

/**
 * Virtual URI path segment (tab title): `{name} ({ms}ms)` — no file extension.
 * Timing uses the same total as the response webview title (`timingPhases.total`).
 */
export function buildVirtualResponseTabPathSegment(response: HttpResponse): string {
    const stem = sanitizeResponseTabStem(response.request.name);
    const ms = Math.round(Number(response.timingPhases?.total ?? 0));
    let label = `${stem} (${ms}ms)`;
    label = label.replace(/[<>:"/\\|?*\x00-\x1f]/g, '_').trim();
    if (!label) {
        label = `Response (${ms}ms)`;
    }
    return label.slice(0, 200);
}

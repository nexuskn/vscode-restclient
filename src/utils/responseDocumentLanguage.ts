import { IRestClientSettings } from '../models/configurationSettings';
import { HttpResponse } from '../models/httpResponse';
import { PreviewOption } from '../models/previewOption';
import { MimeUtility } from './mimeUtility';

/** Map response Content-Type to a VS Code language id (no extension-based inference). */
export function languageIdFromResponseContentType(contentType: string | undefined): string {
    if (!contentType) {
        return 'plaintext';
    }
    try {
        if (MimeUtility.isJSON(contentType)) {
            return 'json';
        }
        if (MimeUtility.isJavaScript(contentType)) {
            return 'javascript';
        }
        if (MimeUtility.isXml(contentType)) {
            return 'xml';
        }
        if (MimeUtility.isHtml(contentType)) {
            return 'html';
        }
        if (MimeUtility.isCSS(contentType)) {
            return 'css';
        }
        const lower = contentType.toLowerCase();
        if (lower.includes('yaml') || lower.includes('x-yaml')) {
            return 'yaml';
        }
        if (lower.includes('markdown')) {
            return 'markdown';
        }
        if (lower.includes('typescript')) {
            return 'typescript';
        }
        const { essence } = MimeUtility.parse(contentType);
        if (essence === 'text/plain') {
            return 'plaintext';
        }
        return 'plaintext';
    } catch {
        return 'plaintext';
    }
}

/**
 * Language id for untitled response tab (legacy: `http` when not body-only MIME).
 */
export function getResponsePreviewDocumentLanguageId(response: HttpResponse, settings: IRestClientSettings): string {
    if (settings.previewOption === PreviewOption.Body) {
        return languageIdFromResponseContentType(response.contentType);
    }
    return 'http';
}

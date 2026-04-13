import { EOL } from 'os';
import { IRestClientSettings } from '../models/configurationSettings';
import { HttpResponse } from '../models/httpResponse';
import { PreviewOption } from '../models/previewOption';
import { formatHeaders } from './misc';
import { ResponseFormatUtility } from './responseFormatUtility';

/** Plain-text response body (same shape as untitled / external-browser preview). */
export function buildResponsePreviewPlainText(response: HttpResponse, settings: IRestClientSettings): string {
    let content = '';
    const previewOption = settings.previewOption;
    const suppress = settings.suppressResponseBodyContentTypeValidationWarning;

    if (previewOption === PreviewOption.Exchange) {
        const request = response.request;
        content += `${request.method} ${request.url} HTTP/1.1${EOL}`;
        content += formatHeaders(request.headers);
        if (request.body) {
            if (typeof request.body !== 'string') {
                request.body = 'NOTE: Request Body From Is File Not Shown';
            }
            content += `${EOL}${ResponseFormatUtility.formatBody(request.body.toString(), request.contentType, true)}${EOL}`;
        }
        // Blank line + heading separator: improves readability between request and response blocks.
        content += EOL.repeat(2);
        content += `###${EOL}${EOL}`;
    }

    if (previewOption !== PreviewOption.Body) {
        content += `HTTP/${response.httpVersion} ${response.statusCode} ${response.statusMessage}${EOL}`;
        content += formatHeaders(response.headers);
    }

    if (previewOption !== PreviewOption.Headers) {
        const prefix = previewOption === PreviewOption.Body ? '' : EOL;
        content += `${prefix}${ResponseFormatUtility.formatBody(response.body, response.contentType, suppress)}`;
    }

    return content;
}

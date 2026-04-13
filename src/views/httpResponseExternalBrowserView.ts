import * as fs from 'fs-extra';
import * as os from 'os';
import * as path from 'path';
import { env, Uri } from 'vscode';
import { IRestClientSettings } from '../models/configurationSettings';
import { HttpResponse } from '../models/httpResponse';
import { buildResponsePreviewPlainText } from '../utils/responsePreviewPlainText';

/** Single file under the OS temp directory, overwritten on each preview (no accumulation). */
const RESPONSE_PREVIEW_HTML_BASENAME = 'vscode-rest-client-response-preview.html';

/**
 * Opens a formatted HTTP response in the system default browser via a temporary HTML file.
 * Avoids the embedded webview (helps when host apps mishandle webviews, e.g. some Cursor builds).
 */
export class HttpResponseExternalBrowserView {

    public async render(response: HttpResponse, settings: IRestClientSettings): Promise<void> {
        const plain = buildResponsePreviewPlainText(response, settings);
        const html = this.wrapHtmlDocument(plain, response);
        const filePath = path.join(os.tmpdir(), RESPONSE_PREVIEW_HTML_BASENAME);
        await fs.writeFile(filePath, html, { encoding: 'utf8' });
        await env.openExternal(Uri.file(filePath));
    }

    private wrapHtmlDocument(plainText: string, response: HttpResponse): string {
        const title = this.escapeHtml(`HTTP ${response.statusCode} ${response.statusMessage} — REST Client`);
        const body = this.escapeHtml(plainText);
        return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<style>
  body { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; margin: 16px; background: #1e1e1e; color: #d4d4d4; }
  pre { white-space: pre-wrap; word-break: break-word; margin: 0; font-size: 13px; line-height: 1.45; }
</style>
</head>
<body>
<pre>${body}</pre>
</body>
</html>`;
    }

    private escapeHtml(s: string): string {
        return s
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }
}

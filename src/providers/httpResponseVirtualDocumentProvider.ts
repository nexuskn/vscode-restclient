import { CancellationToken, TextDocumentContentProvider, Uri } from 'vscode';

export const RESPONSE_VIRTUAL_URI_SCHEME = 'rest-client-response';

type CacheEntry = {
    content: string;
    languageId: string;
};

const MAX_CACHE_ENTRIES = 32;

/**
 * Read-only virtual documents for HTTP responses.
 * Tab title comes from the URI path (e.g. `/{name} (123ms)`); uniqueness uses query `t` and internal `id`.
 */
export class HttpResponseVirtualDocumentProvider implements TextDocumentContentProvider {

    private static _instance: HttpResponseVirtualDocumentProvider;

    public static get Instance(): HttpResponseVirtualDocumentProvider {
        if (!this._instance) {
            this._instance = new HttpResponseVirtualDocumentProvider();
        }
        return this._instance;
    }

    private readonly cache = new Map<string, CacheEntry>();

    private constructor() {
    }

    public provideTextDocumentContent(uri: Uri, _token: CancellationToken): string | undefined {
        const cacheKey = this.getCacheKeyFromUri(uri);
        return cacheKey ? this.cache.get(cacheKey)?.content : undefined;
    }

    /**
     * @param pathSegment tab label segment only, e.g. `MyAPI (125ms)` (no leading slash, no file extension)
     */
    public createResponseUri(content: string, languageId: string, pathSegment: string): Uri {
        const cacheId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`;
        this.cache.set(cacheId, { content, languageId });
        while (this.cache.size > MAX_CACHE_ENTRIES) {
            const oldest = this.cache.keys().next().value;
            if (oldest === undefined) {
                break;
            }
            this.cache.delete(oldest);
        }
        const t = Date.now();
        const query = new URLSearchParams({ t: String(t), id: cacheId }).toString();
        const safe = pathSegment.replace(/\\/g, '_').replace(/\//g, '_');
        const path = `/${safe}`;
        return Uri.from({ scheme: RESPONSE_VIRTUAL_URI_SCHEME, path, query });
    }

    private getCacheKeyFromUri(uri: Uri): string | undefined {
        if (!uri.query) {
            return undefined;
        }
        return new URLSearchParams(uri.query).get('id') ?? undefined;
    }
}

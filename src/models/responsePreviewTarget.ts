/** Where to show the HTTP response after Send Request. */
export enum ResponsePreviewTarget {
    Webview = 'webview',
    UntitledDocument = 'untitledDocument',
    ExternalBrowser = 'externalBrowser',
    /** Custom URI scheme + editor tab (no disk file, no webview). */
    VirtualDocument = 'virtualDocument',
    /** Output panel (no webview). */
    OutputChannel = 'outputChannel',
}

export function parseResponsePreviewTarget(value: string | undefined): ResponsePreviewTarget {
    if (value === ResponsePreviewTarget.UntitledDocument
        || value === ResponsePreviewTarget.ExternalBrowser
        || value === ResponsePreviewTarget.VirtualDocument
        || value === ResponsePreviewTarget.OutputChannel
        || value === ResponsePreviewTarget.Webview) {
        return value;
    }
    return ResponsePreviewTarget.Webview;
}

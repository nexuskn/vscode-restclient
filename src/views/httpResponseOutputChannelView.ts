import { OutputChannel, window } from 'vscode';
import { IRestClientSettings } from '../models/configurationSettings';
import { HttpResponse } from '../models/httpResponse';
import { buildResponsePreviewPlainText } from '../utils/responsePreviewPlainText';

const CHANNEL_NAME = 'REST Client Response';

/**
 * Plain-text response preview in the Output panel (no webview).
 */
export class HttpResponseOutputChannelView {

    private static channel: OutputChannel | undefined;

    private static getChannel(): OutputChannel {
        if (!this.channel) {
            this.channel = window.createOutputChannel(CHANNEL_NAME);
        }
        return this.channel;
    }

    public static disposeChannel(): void {
        HttpResponseOutputChannelView.channel?.dispose();
        HttpResponseOutputChannelView.channel = undefined;
    }

    public render(response: HttpResponse, settings: IRestClientSettings): void {
        const text = buildResponsePreviewPlainText(response, settings);
        const ch = HttpResponseOutputChannelView.getChannel();
        ch.clear();
        ch.append(text);
        ch.show(true);
    }
}

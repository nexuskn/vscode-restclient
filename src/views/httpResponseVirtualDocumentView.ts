import { languages, ViewColumn, window, workspace } from 'vscode';
import { IRestClientSettings, SystemSettings } from '../models/configurationSettings';
import { HttpResponse } from '../models/httpResponse';
import { HttpResponseVirtualDocumentProvider } from '../providers/httpResponseVirtualDocumentProvider';
import { buildResponsePreviewPlainText } from '../utils/responsePreviewPlainText';
import { getResponsePreviewDocumentLanguageId } from '../utils/responseDocumentLanguage';
import { buildVirtualResponseTabPathSegment } from '../utils/virtualResponseDocumentNaming';

export class HttpResponseVirtualDocumentView {

    public async render(response: HttpResponse, settings: IRestClientSettings, viewColumn: ViewColumn): Promise<void> {
        const content = buildResponsePreviewPlainText(response, settings);
        const languageId = getResponsePreviewDocumentLanguageId(response, settings);
        const pathSegment = buildVirtualResponseTabPathSegment(response);
        const uri = HttpResponseVirtualDocumentProvider.Instance.createResponseUri(content, languageId, pathSegment);
        const document = await workspace.openTextDocument(uri);
        await languages.setTextDocumentLanguage(document, languageId);
        const sys = SystemSettings.Instance;
        await window.showTextDocument(document, {
            viewColumn,
            preview: false,
            preserveFocus: !sys.previewResponsePanelTakeFocus,
        });
    }
}

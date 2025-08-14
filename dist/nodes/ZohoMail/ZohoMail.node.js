"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZohoMail = void 0;
class ZohoMail {
    constructor() {
        this.description = {
            displayName: 'Zoho Mail',
            name: 'zohoMail',
            icon: 'file:zohoMail.svg',
            group: ['transform'],
            version: 1,
            description: 'Interact with Zoho Mail API',
            defaults: { name: 'Zoho Mail' },
            inputs: ["main" /* NodeConnectionType.Main */],
            outputs: ["main" /* NodeConnectionType.Main */],
            credentials: [{ name: 'zohoMailOAuth2Api', required: true }],
            properties: [
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    options: [
                        { name: 'Account', value: 'account' },
                        { name: 'Message', value: 'message' },
                        { name: 'Attachment', value: 'attachment' },
                    ],
                    default: 'message',
                },
                // ACCOUNT
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    displayOptions: { show: { resource: ['account'] } },
                    options: [{ name: 'Get', value: 'get' }],
                    default: 'get',
                },
                // MESSAGE
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    displayOptions: { show: { resource: ['message'] } },
                    options: [
                        { name: 'Send', value: 'send' },
                        { name: 'Get', value: 'get' },
                        { name: 'Get Many', value: 'getMany' },
                        { name: 'Delete', value: 'delete' },
                    ],
                    default: 'send',
                },
                {
                    displayName: 'Account ID',
                    name: 'accountId',
                    type: 'string',
                    required: true,
                    displayOptions: { show: { resource: ['message', 'attachment'] } },
                    default: '',
                },
                {
                    displayName: 'Message ID',
                    name: 'messageId',
                    type: 'string',
                    displayOptions: { show: { resource: ['message'], operation: ['get', 'delete'] } },
                    default: '',
                },
                {
                    displayName: 'Folder ID',
                    name: 'folderId',
                    type: 'string',
                    displayOptions: { show: { resource: ['message'], operation: ['getMany'] } },
                    default: '',
                },
                {
                    displayName: 'From Address',
                    name: 'fromAddress',
                    type: 'string',
                    required: true,
                    displayOptions: { show: { resource: ['message'], operation: ['send'] } },
                    default: '',
                },
                {
                    displayName: 'To Address',
                    name: 'toAddress',
                    type: 'string',
                    required: true,
                    displayOptions: { show: { resource: ['message'], operation: ['send'] } },
                    default: '',
                },
                {
                    displayName: 'Subject',
                    name: 'subject',
                    type: 'string',
                    required: true,
                    displayOptions: { show: { resource: ['message'], operation: ['send'] } },
                    default: '',
                },
                {
                    displayName: 'Content',
                    name: 'content',
                    type: 'string',
                    typeOptions: { rows: 5 },
                    displayOptions: { show: { resource: ['message'], operation: ['send'] } },
                    default: '',
                },
                {
                    displayName: 'Mail Format',
                    name: 'mailFormat',
                    type: 'options',
                    options: [{ name: 'HTML', value: 'html' }, { name: 'Text', value: 'text' }],
                    displayOptions: { show: { resource: ['message'], operation: ['send'] } },
                    default: 'html',
                },
                {
                    displayName: 'Ask Read Receipt',
                    name: 'askReceipt',
                    type: 'boolean',
                    displayOptions: { show: { resource: ['message'], operation: ['send'] } },
                    default: false,
                },
                // ATTACHMENT
                {
                    displayName: 'Binary Property',
                    name: 'binaryPropertyName',
                    type: 'string',
                    displayOptions: { show: { resource: ['attachment'], operation: ['upload'] } },
                    default: 'data',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    displayOptions: { show: { resource: ['attachment'] } },
                    options: [{ name: 'Upload', value: 'upload' }],
                    default: 'upload',
                },
            ],
        };
    }
    async execute() {
        var _a, _b;
        const items = this.getInputData();
        const returnData = [];
        for (let i = 0; i < items.length; i++) {
            const resource = this.getNodeParameter('resource', i);
            const operation = this.getNodeParameter('operation', i);
            // Get region base URL from credentials for convenience
            const cred = await this.getCredentials('zohoMailOAuth2Api');
            const baseUrl = cred.regionBaseUrl || 'https://mail.zoho.com';
            let responseData;
            if (resource === 'account' && operation === 'get') {
                responseData = await this.helpers.requestWithAuthentication.call(this, 'zohoMailOAuth2Api', {
                    method: 'GET',
                    url: `${baseUrl}/api/accounts`,
                    json: true,
                });
            }
            if (resource === 'message') {
                const accountId = this.getNodeParameter('accountId', i);
                if (operation === 'send') {
                    const body = {
                        fromAddress: this.getNodeParameter('fromAddress', i),
                        toAddress: this.getNodeParameter('toAddress', i),
                        subject: this.getNodeParameter('subject', i),
                        content: this.getNodeParameter('content', i),
                        mailFormat: this.getNodeParameter('mailFormat', i),
                        askReceipt: this.getNodeParameter('askReceipt', i) ? 'yes' : 'no',
                    };
                    responseData = await this.helpers.requestWithAuthentication.call(this, 'zohoMailOAuth2Api', {
                        method: 'POST',
                        url: `${baseUrl}/api/accounts/${accountId}/messages`,
                        body,
                        json: true,
                    });
                }
                if (operation === 'get') {
                    const messageId = this.getNodeParameter('messageId', i);
                    responseData = await this.helpers.requestWithAuthentication.call(this, 'zohoMailOAuth2Api', {
                        method: 'GET',
                        url: `${baseUrl}/api/accounts/${accountId}/messages/${messageId}`,
                        json: true,
                    });
                }
                if (operation === 'getMany') {
                    const folderId = this.getNodeParameter('folderId', i, '');
                    const qs = {};
                    if (folderId)
                        qs.folderId = folderId;
                    responseData = await this.helpers.requestWithAuthentication.call(this, 'zohoMailOAuth2Api', {
                        method: 'GET',
                        url: `${baseUrl}/api/accounts/${accountId}/messages`,
                        qs,
                        json: true,
                    });
                }
                if (operation === 'delete') {
                    const messageId = this.getNodeParameter('messageId', i);
                    responseData = await this.helpers.requestWithAuthentication.call(this, 'zohoMailOAuth2Api', {
                        method: 'DELETE',
                        url: `${baseUrl}/api/accounts/${accountId}/messages/${messageId}`,
                        json: true,
                    });
                }
            }
            if (resource === 'attachment' && operation === 'upload') {
                const accountId = this.getNodeParameter('accountId', i);
                const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i);
                const binaryData = (_a = items[i].binary) === null || _a === void 0 ? void 0 : _a[binaryPropertyName];
                if (!binaryData) {
                    throw new Error(`Binary property "${binaryPropertyName}" is missing on item ${i}`);
                }
                const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
                responseData = await this.helpers.requestWithAuthentication.call(this, 'zohoMailOAuth2Api', {
                    method: 'POST',
                    url: `${baseUrl}/api/accounts/${accountId}/messages/attachments`,
                    body: buffer,
                    headers: { 'Content-Type': 'application/octet-stream' },
                    json: false,
                });
            }
            returnData.push({ json: (_b = responseData) !== null && _b !== void 0 ? _b : {} });
        }
        return [returnData];
    }
}
exports.ZohoMail = ZohoMail;

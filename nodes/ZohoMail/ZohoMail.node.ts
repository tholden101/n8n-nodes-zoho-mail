import type { IExecuteFunctions, IDataObject, INodeExecutionData, INodeType, INodeTypeDescription,  } from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';

export class ZohoMail implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Zoho Mail',
		name: 'zohoMail',
		icon: 'file:zohoMail.svg',
		group: ['transform'],
		version: 1,
		description: 'Interact with Zoho Mail API',
		defaults: { name: 'Zoho Mail' },
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
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
				displayOptions: { show: { resource: ['message'], operation: ['get','delete'] } },
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

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const resource = this.getNodeParameter('resource', i) as string;
			const operation = this.getNodeParameter('operation', i) as string;

			// Get region base URL from credentials for convenience
			const cred = await this.getCredentials('zohoMailOAuth2Api') as IDataObject;
			const baseUrl = (cred.regionBaseUrl as string) || 'https://mail.zoho.com';

			let responseData: IDataObject | IDataObject[] | undefined;

			if (resource === 'account' && operation === 'get') {
				responseData = await this.helpers.requestWithAuthentication.call(this, 'zohoMailOAuth2Api', {
					method: 'GET',
					url: `${baseUrl}/api/accounts`,
					json: true,
				});
			}

			if (resource === 'message') {
				const accountId = this.getNodeParameter('accountId', i) as string;

				if (operation === 'send') {
					const body = {
						fromAddress: this.getNodeParameter('fromAddress', i) as string,
						toAddress: this.getNodeParameter('toAddress', i) as string,
						subject: this.getNodeParameter('subject', i) as string,
						content: this.getNodeParameter('content', i) as string,
						mailFormat: this.getNodeParameter('mailFormat', i) as string,
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
					const messageId = this.getNodeParameter('messageId', i) as string;
					responseData = await this.helpers.requestWithAuthentication.call(this, 'zohoMailOAuth2Api', {
						method: 'GET',
						url: `${baseUrl}/api/accounts/${accountId}/messages/${messageId}`,
						json: true,
					});
				}

				if (operation === 'getMany') {
					const folderId = this.getNodeParameter('folderId', i, '') as string;
					const qs: Record<string, string> = {};
					if (folderId) qs.folderId = folderId;

					responseData = await this.helpers.requestWithAuthentication.call(this, 'zohoMailOAuth2Api', {
						method: 'GET',
						url: `${baseUrl}/api/accounts/${accountId}/messages`,
						qs,
						json: true,
					});
				}

				if (operation === 'delete') {
					const messageId = this.getNodeParameter('messageId', i) as string;
					responseData = await this.helpers.requestWithAuthentication.call(this, 'zohoMailOAuth2Api', {
						method: 'DELETE',
						url: `${baseUrl}/api/accounts/${accountId}/messages/${messageId}`,
						json: true,
					});
				}
			}

			if (resource === 'attachment' && operation === 'upload') {
				const accountId = this.getNodeParameter('accountId', i) as string;
				const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
				const binaryData = items[i].binary?.[binaryPropertyName];

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

			returnData.push({ json: (responseData as IDataObject) ?? {} });
		}

		return [returnData];
	}
}

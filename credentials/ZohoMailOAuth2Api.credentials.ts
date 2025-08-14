import type { ICredentialType, INodeProperties } from 'n8n-workflow';

export class ZohoMailOAuth2Api implements ICredentialType {
	extends = ['oAuth2Api'];
	name = 'zohoMailOAuth2Api';
	displayName = 'Zoho Mail OAuth2 API';
	documentationUrl = 'https://www.zoho.com/mail/help/api/';
	properties: INodeProperties[] = [
		{
			displayName: 'Auth URL',
			name: 'authUrl',
			type: 'string',
			default: 'https://accounts.zoho.com/oauth/v2/auth',
		},
		{
			displayName: 'Token URL',
			name: 'accessTokenUrl',
			type: 'string',
			default: 'https://accounts.zoho.com/oauth/v2/token',
		},
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'string',
			default: 'ZohoMail.accounts.READ,ZohoMail.messages.CREATE',
			description: 'Comma-separated OAuth scopes',
		},
		{
			displayName: 'Region Base URL',
			name: 'regionBaseUrl',
			type: 'options',
			options: [
				{ name: 'US (.com)', value: 'https://mail.zoho.com' },
				{ name: 'EU (.eu)', value: 'https://mail.zoho.eu' },
				{ name: 'IN (.in)', value: 'https://mail.zoho.in' },
				{ name: 'AU (.com.au)', value: 'https://mail.zoho.com.au' },
			],
			default: 'https://mail.zoho.com',
		},
	];

}

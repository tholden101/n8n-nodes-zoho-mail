import type { ICredentialType, INodeProperties } from 'n8n-workflow';
export declare class ZohoMailOAuth2Api implements ICredentialType {
    extends: string[];
    name: string;
    displayName: string;
    documentationUrl: string;
    properties: INodeProperties[];
}

import type { ICredentialType, INodeProperties } from 'n8n-workflow';
export declare class ZohoMailOAuth2Api implements ICredentialType {
    name: string;
    displayName: string;
    extends: string[];
    documentationUrl: string;
    properties: INodeProperties[];
    test: {
        request: {
            url: string;
        };
    };
}

# n8n-nodes-zoho-mail

Zoho Mail node for n8n (Community Node). Provides **Account**, **Message**, and **Attachment** resources.

## Features
- **Account → get** (`GET /api/accounts`)
- **Message → send|get|getMany|delete**
- **Attachment → upload** (binary)

## Credentials
Uses **ZohoMailOAuth2Api** (Authorization Code). Supports Zoho regions (US/EU/IN/AU).

### Scopes
- `ZohoMail.accounts.READ`
- `ZohoMail.messages.CREATE`
- Add more as needed (e.g., `ZohoMail.messages.ALL`)

## Development
```bash
npm i
npm run build
# or use n8n-node-dev if you prefer
```

## Install (locally)
- In n8n, enable Community Nodes, then install by package name: `n8n-nodes-zoho-mail`.

## Notes
- No runtime dependencies to align with Verified Community Node guidelines.
- This package uses the programmatic style as suggested in n8n docs.

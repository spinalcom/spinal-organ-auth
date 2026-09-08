# Spinal Organ Auth

Spinal Organ Auth is the authentication and authorization layer for SpinalCOM applications.
It centralizes user and application authentication, access management, and token handling for secure service-to-service and end-user workflows.

## Overview

This module is designed to manage:

- User authentication
- Application authentication
- Access control and authorization
- Token issuance and validation
- Permission and role-based access management

It includes both a user interface for managing authentication and authorization, and an API for integrating these capabilities into SpinalCOM applications.

## Usage

Clone the repository:

```bash
git clone https://github.com/spinalcom/spinal-organ-auth.git
cd spinal-organ-auth
```

Install dependencies from the repository root:

```bash
npm run install
```

Alternatively, install dependencies separately in the `api` and `vue-client` folders:

```bash
cd api && npm i
cd ../vue-client && npm i
```

Build the interface and API from the repository root:

```bash
npm run build
```

Alternatively, run the same build command in both the `api` and `vue-client` folders.

Create or update `api/.env` using the following environment variables:

```dotenv
# Hub info
ORGAN_NAME=""
SPINAL_USER_ID=''
SPINALHUB_IP=''
SPINAL_PASSWORD=''
SPINALHUB_PORT=''

# Auth info
TOKEN_SECRET=""
AUTH_ADMIN_PASSWORD=""
TOKEN_BOS_ADMIN=""
REGISTER_KEY=""

# Server info
REQUESTS_PORT=''
LIMIT_LOG="3000"

SERVER_PROTOCOL="http" # https / http
SSL_CERT_PATH=""
SSL_KEY_PATH=""
NODE_TLS_REJECT_UNAUTHORIZED=0
```

Start the application from the repository root:

```bash
npm run start
```

Alternatively, run `npm run start` from the `api` folder.

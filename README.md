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

Copy the documented template, then replace every environment-specific value:

```bash
cp api/.env.example api/.env
```

`api/.env.example` is the source of truth for every variable. Keep `api/.env`
outside source control and use a secret manager in production.

Example configuration:

```dotenv
# Hub info
ORGAN_NAME="Spinal-organ-auth"
SPINAL_USER_ID="admin"
SPINALHUB_IP="127.0.0.1"
SPINAL_PASSWORD="change-me"
SPINALHUB_PORT="7777"
SPINAL_DTWIN_PATH=""

# Auth info
TOKEN_SECRET=""
SESSION_SECRET=""
AUTH_ADMIN_PASSWORD=""
MAX_LOGIN_ATTEMPTS="5"
ACCOUNT_LOCK_DURATION_MINUTES="15"
TOKEN_BOS_ADMIN=""
REGISTER_KEY=""

# Server info
REQUESTS_PORT="3000"
LIMIT_LOG="3000"

SERVER_PROTOCOL="http" # https / http
SSL_CERT_PATH=""
SSL_KEY_PATH=""
NODE_TLS_REJECT_UNAUTHORIZED="1"

# CORS / cookie authentication
# Comma-separated exact origins of browser clients that call this API with credentials.
# Required for cross-site HttpOnly cookie authentication; use HTTPS in production.
CORS_ORIGINS=""
AUTH_COOKIE_SECURE=""
# Use "none" only when the Vue client and API are on different sites (HTTPS required).
AUTH_COOKIE_SAME_SITE="lax"
```

### Secrets

- `TOKEN_SECRET`: random value of at least 32 bytes used to sign JWTs. Keep it
  stable; changing it invalidates every active token.
- `SESSION_SECRET`: separate random value of at least 32 bytes used by Express
  sessions. Do not reuse `TOKEN_SECRET`.
- `AUTH_ADMIN_PASSWORD`: initial administrator password. It must follow the
  password policy (12 characters, uppercase, lowercase, number and symbol).
- `REGISTER_KEY`: random secret shared during platform registration.
- `TOKEN_BOS_ADMIN`: optional BOS administrator token; leave it empty when the
  integration does not use it.

Generate a suitable secret with:

```bash
openssl rand -base64 48
```

The API build generates missing `TOKEN_SECRET`, `SESSION_SECRET`,
`AUTH_ADMIN_PASSWORD` and `REGISTER_KEY` values. Explicit values supplied by a
production secret manager are preferable.

### Cookie deployment scenarios

| Deployment | `AUTH_COOKIE_SECURE` | `AUTH_COOKIE_SAME_SITE` | `CORS_ORIGINS` |
|---|---:|---|---|
| Local HTTP, same origin | `false` | `lax` | Empty |
| Production HTTPS, same origin/site | `true` | `lax` | Empty, unless origins differ |
| Production HTTPS, Vue/API on different sites | `true` | `none` | Exact Vue origin(s) |

When several clients call the API, separate exact origins with commas, for
example `https://app.example.com,https://admin.example.com`. Do not use a
wildcard with credentialed cookies. `SameSite=none` is rejected unless
`AUTH_COOKIE_SECURE=true`.

Use `SERVER_PROTOCOL=http` locally. In production, use `https` when Node serves
TLS directly and set `SSL_CERT_PATH` and `SSL_KEY_PATH`. If TLS terminates at a
reverse proxy, `SERVER_PROTOCOL` may remain `http`, but set
`AUTH_COOKIE_SECURE=true`. Keep `NODE_TLS_REJECT_UNAUTHORIZED=1`; value `0` is
only acceptable for local self-signed certificates.

### Login protection

- `MAX_LOGIN_ATTEMPTS`: positive integer, default `5`.
- `ACCOUNT_LOCK_DURATION_MINUTES`: positive integer, default `15`.

After the configured number of consecutive failures, the account is locked for
the configured duration. A successful login or password reset clears the
counter.

Start the application from the repository root:

```bash
npm run start
```

Alternatively, run `npm run start` from the `api` folder.

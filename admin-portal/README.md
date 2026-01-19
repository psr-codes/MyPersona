# RBI Admin Portal 🏛️

The Super Admin Portal for the **MyPersona zk-KYC Registry**. Ideally used by a regulatory authority (like RBI) to authorize and manage Trusted Issuers (Banks, Government Bodies).

![Status Active](https://img.shields.io/badge/Status-Active-brightgreen)
![Authority](https://img.shields.io/badge/Authority-RBI-D97706)
![Next.js](https://img.shields.io/badge/Next.js-16-black)

## Overview

This portal provides a secure interface for the **Owner** of the `IssuerRegistry` smart contract to:

1.  **Authorize Issuers**: Add trusted addresses (financial institutions) to the registry.
2.  **Revoke Authorization**: Remove trusted issuers if they violate compliance.
3.  **Emergency Control**: Pause/Unpause the entire registry in case of security threats.
4.  **Monitor Network**: View all active authorized entities on the Polygon Amoy Testnet.

## Features

### 🏛️ Dashboard

- System overview and health status.
- Key statistics (Total Issuers, Active Users).
- Secure administrative controls.

### 🏦 Manage Issuers

- Add new trusted issuers by wallet address.
- View comprehensive list of all authorized entities.
- Direct links to PolygonScan for audit trails.
- Remove/Revoke issuer authorization.

### 🛡️ System Controls

- **Emergency Pause**: Stop all new authorizations immediately.
- **Resume Operations**: Restore normal system functionality.
- **Contract Diagnostics**: View deployment addresses and ownership status.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4 (Gold/Amber & Slate Theme)
- **Blockchain**: ethers.js v6
- **Network**: Polygon Amoy Testnet

## Quick Start

### Prerequisites

- Node.js v18+
- MetaMask wallet (Must be the **Owner** of the deployed contracts for write access).

### Installation

```bash
# Navigate to admin-portal
cd admin-portal

# Install dependencies
npm install

# Start development server
npm run dev -- --port 3003
```

The app will open at `http://localhost:3003`.

## Contract Addresses

| Contract           | Address                                      |
| ------------------ | -------------------------------------------- |
| IssuerRegistry     | `0xf4ab183CabCD54F1d2632FD4DF6688bbd04595d5` |
| RevocationRegistry | `0xA5274b769D818785BdEDAB209ED23ef2125f58dF` |

## Roles & Permissions

- **Super Admin (RBI)**: Can Add/Remove Issuers, Pause System.
- **Public/Viewers**: Can only view the list of trusted issuers and system status.

---

**Note**: To perform administrative actions, you must connect the wallet address that owns the `IssuerRegistry` contract.

Built with ❤️ for **RBI HaRBInger 2025**

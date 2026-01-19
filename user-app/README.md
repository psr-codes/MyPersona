# MyPersona User Wallet 💳

A secure digital wallet for managing zk-KYC credentials. Built with **Next.js 16** and **Tailwind CSS** for the RBI HaRBInger 2025 hackathon.

![Wallet Preview](https://img.shields.io/badge/Status-Active-brightgreen)
![Polygon Amoy](https://img.shields.io/badge/Network-Polygon%20Amoy-purple)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4)

## Features

### 📊 Dashboard

- Credential overview with stats
- Quick actions for common tasks
- How it works guide
- Recent credentials display

### 💳 Credential Management

- View all stored credentials
- Request new KYC credentials
- Check revocation status on-chain
- View claim details
- Remove credentials

### 📱 QR Code Scanner

- Camera-based QR scanning
- Manual JSON input option
- Respond to verification requests
- Select credential to share
- Generate ZK proofs

### 📜 Activity History

- Track all credential activities
- Filter by type
- Search functionality
- Timeline view

### ⚙️ Settings

- Wallet information
- Contract addresses
- Network configuration

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4
- **Blockchain**: ethers.js v6
- **QR Code**: qrcode.react, html5-qrcode
- **Icons**: Lucide React
- **Notifications**: react-hot-toast
- **Network**: Polygon Amoy Testnet

## Quick Start

### Prerequisites

- Node.js v18+
- MetaMask browser extension
- MATIC on Polygon Amoy Testnet

### Installation

```bash
# Navigate to the user-app directory
cd user-app

# Install dependencies
npm install

# Start development server
npm run dev -- --port 3002
```

The app will open at `http://localhost:3002`

### Build for Production

```bash
npm run build
npm run start
```

## Contract Addresses

| Contract           | Address                                      |
| ------------------ | -------------------------------------------- |
| IssuerRegistry     | `0xf4ab183CabCD54F1d2632FD4DF6688bbd04595d5` |
| RevocationRegistry | `0xA5274b769D818785BdEDAB209ED23ef2125f58dF` |

Both contracts are deployed on **Polygon Amoy Testnet** (Chain ID: 80002)

## Project Structure

```
user-app/
├── app/
│   ├── page.js              # Dashboard
│   ├── layout.js            # Root layout
│   ├── globals.css          # Tailwind + theme
│   ├── credentials/page.js  # Credential management
│   ├── scan/page.js         # QR scanner
│   ├── activity/page.js     # Activity history
│   └── settings/page.js     # Settings
├── components/
│   ├── Sidebar.js           # Navigation
│   └── Header.js            # Wallet header
├── contexts/
│   └── WalletContext.js     # MetaMask integration
├── hooks/
│   └── useCredentials.js    # Credential hooks
├── lib/
│   └── contracts.js         # Contract utilities
├── public/
│   └── logo.svg             # Wallet logo
├── package.json
└── next.config.mjs
```

## Design System

### Color Palette

- **Primary**: Blue (`#2563EB`) - User Context
- **Secondary**: Emerald (`#10B981`) - Success
- **Success**: Emerald (`#10B981`)
- **Danger**: Rose (`#F43F5E`)
- **Warning**: Amber (`#F59E0B`)

### Key Features

- Blue/emerald theme for user wallet context
- Credential cards with gradient styling
- QR code scanning with camera support
- Wallet connection with balance display
- Responsive design

## User Flow

1. **Connect Wallet**: Link your MetaMask wallet
2. **Request Credential**: Get a KYC credential from a trusted issuer
3. **Store Securely**: Credentials are encrypted and stored locally
4. **Scan QR**: Scan a verifier's QR code when requested
5. **Share Proof**: Generate and share a ZK proof
6. **Verification Complete**: Verifier confirms without seeing your data

## Privacy Features

- **Local Storage**: Credentials never leave your device
- **ZK Proofs**: Prove attributes without revealing data
- **User Control**: You decide what to share
- **No Data Collection**: We don't store your personal data

## License

MIT License - See [LICENSE](../LICENSE)

---

Built with ❤️ for **RBI HaRBInger 2025**

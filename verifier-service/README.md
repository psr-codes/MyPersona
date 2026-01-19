# MyPersona Verifier Portal 🔐

A professional verification service for the zk-KYC network. Built with **Next.js 16** and **Tailwind CSS** for the RBI HaRBInger 2025 hackathon.

![Verifier Preview](https://img.shields.io/badge/Status-Active-brightgreen)
![Polygon Amoy](https://img.shields.io/badge/Network-Polygon%20Amoy-purple)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4)

## Features

### 📊 Dashboard

- Real-time network stats (issuers, revoked credentials)
- Recent revocation activity feed
- Quick verification actions
- How verification works guide

### 🔍 Verify Credentials

- Generate QR codes for verification requests
- Customizable verification requirements
- Track verification request status
- Multiple concurrent requests

### ✅ Check Status

- Verify credential revocation status on-chain
- Verify issuer trust status
- Load recent revocation activity
- No wallet connection required

### 📜 History

- Track all verification requests
- Filter by status (verified/pending/failed)
- Search by request ID
- Clear history option

### ⚙️ Settings

- Contract address reference
- Network information
- About the verifier service

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4
- **Blockchain**: ethers.js v6 (read-only)
- **QR Codes**: qrcode.react
- **Icons**: Lucide React
- **Notifications**: react-hot-toast
- **Network**: Polygon Amoy Testnet

## Quick Start

### Prerequisites

- Node.js v18+

### Installation

```bash
# Navigate to the verifier-service directory
cd verifier-service

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:3000`

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

All verifications are performed on **Polygon Amoy Testnet** (Chain ID: 80002)

## Project Structure

```
verifier-service/
├── app/
│   ├── page.js              # Dashboard
│   ├── layout.js            # Root layout
│   ├── globals.css          # Tailwind + custom styles
│   ├── verify/page.js       # Create verification requests
│   ├── status/page.js       # Check revocation/issuer status
│   ├── history/page.js      # Verification history
│   └── settings/page.js     # Configuration & info
├── components/
│   ├── Sidebar.js           # Navigation sidebar
│   └── Header.js            # Page header
├── hooks/
│   └── useVerification.js   # Verification hooks
├── lib/
│   └── contracts.js         # ABIs & read-only provider
├── public/
│   └── logo.svg             # Verifier logo
├── package.json
└── next.config.mjs
```

## Design System

### Color Palette

- **Primary**: Violet (`#7C3AED`) - Verification & Trust
- **Secondary**: Teal (`#0D9488`) - Success Indicators
- **Success**: Emerald (`#10B981`)
- **Danger**: Rose (`#F43F5E`)
- **Warning**: Amber (`#F59E0B`)

### Key Features

- Purple/violet theme for verification context
- QR code generation for verification requests
- Read-only blockchain queries (no wallet needed)
- Responsive design
- Smooth animations

## How Verification Works

1. **Create Request**: Generate a verification request with specific requirements
2. **Share QR Code**: User scans the QR code with their MyPersona wallet
3. **ZK Proof**: User generates and submits a zero-knowledge proof
4. **On-Chain Check**: Verify issuer trust and credential revocation status
5. **Get Result**: Receive verified status without seeing personal data

## No Wallet Required

Unlike the Issuer Portal, the Verifier Service performs **read-only** blockchain queries. This means:

- No MetaMask or wallet connection needed
- Anyone can check revocation status
- Anyone can verify issuer trust
- Perfect for merchant/service provider integration

## License

MIT License - See [LICENSE](../LICENSE)

---

Built with ❤️ for **RBI HaRBInger 2025**

# MyPersona Issuer Portal 🛡️

A professional-grade admin dashboard for managing the zk-KYC network. Built for the RBI HaRBInger 2025 hackathon.

![Dashboard Preview](https://img.shields.io/badge/Status-Active-brightgreen)
![Polygon Amoy](https://img.shields.io/badge/Network-Polygon%20Amoy-purple)
![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-5-yellow)

## Features

### 📊 Dashboard

- Real-time stats for trusted issuers and revoked credentials
- System status overview
- Recent activity feed with contract events
- Quick action buttons

### 👥 Issuer Management

- Add trusted issuers (banks, CKYCR nodes)
- Remove issuers with confirmation
- Verify issuer status by address
- Searchable list with block explorer links

### 📜 Credential Management

- Revoke compromised credentials
- Reinstate accidentally revoked credentials
- Check credential revocation status
- Full revocation history with transaction links

### ⚙️ System Controls

- Emergency pause/unpause for both contracts
- Contract address reference
- Network information
- Owner access controls

## Tech Stack

- **Framework**: React 18 + Vite 5
- **Blockchain**: ethers.js v6
- **Routing**: react-router-dom v6
- **Styling**: CSS Modules with custom design system
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
# Navigate to the issuer-portal directory
cd issuer-portal

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## Contract Addresses

| Contract           | Address                                      |
| ------------------ | -------------------------------------------- |
| IssuerRegistry     | `0xf4ab183CabCD54F1d2632FD4DF6688bbd04595d5` |
| RevocationRegistry | `0xA5274b769D818785BdEDAB209ED23ef2125f58dF` |

Both contracts are deployed on **Polygon Amoy Testnet** (Chain ID: 80002)

## Project Structure

```
issuer-portal/
├── public/
│   └── logo.svg           # Custom shield logo
├── src/
│   ├── components/
│   │   └── Layout/        # Sidebar, Header, MainLayout
│   ├── contexts/
│   │   └── WalletContext.jsx  # MetaMask connection
│   ├── hooks/
│   │   └── useContracts.js    # Contract interactions
│   ├── pages/
│   │   ├── Dashboard.jsx      # Main dashboard
│   │   ├── IssuersPage.jsx    # Issuer management
│   │   ├── CredentialsPage.jsx # Credential revocation
│   │   └── SystemPage.jsx     # Emergency controls
│   ├── utils/
│   │   └── contracts.js       # ABIs & addresses
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css          # Design system
├── index.html
├── vite.config.js
└── package.json
```

## Design System

### Color Palette

- **Primary**: Teal (`#0D9488`) - Trust & Security
- **Secondary**: Indigo (`#4F46E5`) - Innovation
- **Success**: Emerald (`#10B981`)
- **Danger**: Rose (`#F43F5E`)
- **Warning**: Amber (`#F59E0B`)

### Features

- Light theme optimized for clarity
- Glassmorphism effects
- Smooth animations and transitions
- Responsive design

## Usage

### Connecting Wallet

1. Click "Connect Wallet" button in the header
2. Approve MetaMask connection
3. Switch to Polygon Amoy if prompted

### Adding an Issuer (Owner Only)

1. Navigate to **Issuers** page
2. Enter the issuer's Ethereum address
3. Click "Add Issuer"
4. Approve the transaction in MetaMask

### Revoking a Credential (Trusted Issuer Only)

1. Navigate to **Credentials** page
2. Enter the credential nonce
3. Click "Revoke Credential"
4. Approve the transaction

### Emergency Pause (Owner Only)

1. Navigate to **System** page
2. Click "Pause Contract" on the desired registry
3. Approve the transaction

## License

MIT License - See [LICENSE](../LICENSE)

---

Built with ❤️ for **RBI HaRBInger 2025**

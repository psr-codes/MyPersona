Project zk-KYC: A Reusable, Privacy-First Identity Framework

Team Name: (Your Team Name Here)
Problem Statement: Tokenised KYC

1. Executive Summary

Our project, zk-KYC, directly addresses the "Tokenised KYC" challenge by building a decentralized, user-centric identity framework. We use a Self-Sovereign Identity (SSI) model where users store their verified credentials (e.g., from DigiLocker) as private, reusable "tokens" in a secure mobile wallet.

Our key innovation is the use of Zero-Knowledge Proofs (ZKPs). When a financial institution (like a mutual fund) needs to verify a user, the user doesn't share their sensitive data (like their name or date of birth). Instead, their wallet generates a cryptographic proof (e.g., "I am over 18" or "My KYC status is 'Verified'") which is instantly verifiable on the blockchain. This model eliminates data duplication, gives users full control, and makes onboarding instant and secure.

2. The Solution: How It Works

We are building a complete, four-part ecosystem based on the principles of Self-Sovereign Identity (SSI). The "token" is a W3C Verifiable Credential (VC), a digitally signed, tamper-proof JSON file containing the user's KYC data, which they store in their private wallet.

Issuance: A trusted authority (e.g., a bank or CKYCR) performs a one-time KYC. It then "mints" a digital Verifiable Credential and gives it directly to the user, who stores it in their Holder Wallet.

Storage: The user holds their own KYC "tokens" in their secure mobile wallet. This data never touches the blockchain.

Presentation (The ZKP Magic): When a new service (e.g., an insurance company) needs KYC, it requests a specific proof. The user's wallet locally generates a ZKP to prove the claims (e.g., "I am over 18") without revealing the underlying data.

Verification: The insurance company receives this ZKP and verifies it by checking our on-chain smart contracts. This check is instant, free for the user, and confirms two things:

Was this credential issued by a trusted source? (Checks IssuerRegistry.sol)

Has this credential been revoked? (Checks RevocationRegistry.sol)

This process is instant, requires no forms, and protects user privacy at all costs.

3. Architecture & Tech Stack

Our solution is composed of four distinct, interoperable components.

On-Chain Trust Layer (The Blockchain)

Technology: Solidity, Polygon Amoy Testnet

Contracts: We have already developed and deployed:

IssuerRegistry.sol: An on-chain list of trusted issuer addresses (e.g., banks, CKYCR).

RevocationRegistry.sol: An on-chain list of revoked credentials, allowing for real-time invalidation (e.g., if a user's phone is stolen).

Issuer Portal (Admin App)

Technology: Node.js (Express), React

Purpose: A secure web portal for trusted authorities (e.g., a bank) to create, sign, and issue Verifiable Credentials to users.

Holder Wallet (User App)

Technology: React Native (for cross-platform mobile)

Purpose: The user's secure wallet. It stores VCs, manages private keys, parses proof requests (via QR code), and locally generates the Zero-Knowledge Proofs.

Verifier Service (Onboarding App)

Technology: Node.js (Express), React, Polygon ID SDK

Purpose: A web app for a financial service (e.g., a mutual fund) to request and verify proofs. It will generate a QR code for the user to scan and will verify the submitted ZKP against our smart contracts.

4. Fulfilling the Problem Statement (Features a-j)

Our architecture is
specifically designed to meet every requirement of the problem statement:

(a, b) Token-based & Reusable: Our "token" is a W3C Verifiable Credential (VC), digitally signed by an issuer and stored by the user. It is machine-readable and designed for reuse.

(c, f) User Control & Privacy: The user's data never leaves their device. They only share ZKPs, giving them explicit, auditable consent for every interaction.

(d) Selective Disclosure: This is the core of our ZKP-based solution. The user can prove they are "Over 18" without revealing their date of birth, or "KYC-Verified" without revealing their address.

(e, h) Interoperability & Integration: Our system is built on open standards (W3C DIDs and VCs). Any existing infrastructure (Aadhaar, DigiLocker, CKYCR) can be integrated as a trusted "Issuer" by simply adding their address to our IssuerRegistry contract.

(g, j) Revocation & Updation: Our RevocationRegistry contract provides a real-time, on-chain mechanism for issuers to revoke credentials. A "KYC update" is handled by the issuer revoking the old VC and issuing a new, updated one to the user.

(i) Secure Delegation: Our architecture supports this via the "Unique Features" below, where a guardian can be an Owner of the contracts.

5. Our Unique Features (Standing Out)

To push the boundaries of the problem statement, we are including three simple but powerful features:

Truly Gas-less for Users: A major barrier to blockchain adoption is gas fees. In our system, the user never pays gas. Verification is a free read call. The only write transactions (adding issuers, revoking credentials) are paid by the institutions, which is a low-cost, infrequent event. This is critical for financial inclusion.

Administrative Emergency-Freeze: Both of our smart contracts include an Pausable module. This gives the system administrator (e.g., a governing body) a "panic button." In the event of a security vulnerability or attack, the admin can instantly call pause() to freeze all state changes (like adding new issuers or revoking credentials), while still allowing verification read calls to function. This is a mature security feature that ensures system integrity.

User-Centric Private Audit Trail: To fulfill the "auditable" requirement (feature c) in a privacy-first way, the user's mobile wallet will maintain a local, encrypted log of every proof it has ever shared. The user can see "You proved 'Over 18' to SecureInsure on Nov 18, 2025." This log is for the user's eyes only and cannot be tampered with.

6. Hackathon Deliverables

By the end of the hackathon, we will deliver a fully functional, end-to-end demo consisting of:

The deployed IssuerRegistry and RevocationRegistry smart contracts on the Polygon Amoy testnet.

A working web app for the Issuer to create a KYC credential.

A working web app for the Verifier to request a proof.

A functional prototype of the Holder's mobile wallet to store the credential and generate the ZK-Proof.
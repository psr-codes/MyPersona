import { ethers } from "ethers";

// Contract Addresses (Polygon Amoy Testnet)
export const CONTRACT_ADDRESSES = {
  ISSUER_REGISTRY: "0xf4ab183CabCD54F1d2632FD4DF6688bbd04595d5",
  REVOCATION_REGISTRY: "0xA5274b769D818785BdEDAB209ED23ef2125f58dF",
};

// IssuerRegistry ABI (read-only functions)
export const ISSUER_REGISTRY_ABI = [
  "function isTrustedIssuer(address) view returns (bool)",
  "function owner() view returns (address)",
  "function paused() view returns (bool)",
  "event IssuerAdded(address indexed issuerAddress)",
  "event IssuerRemoved(address indexed issuerAddress)",
];

// RevocationRegistry ABI (read-only functions for verifier)
export const REVOCATION_REGISTRY_ABI = [
  "function isRevoked(uint256) view returns (bool)",
  "function issuerRegistry() view returns (address)",
  "function owner() view returns (address)",
  "function paused() view returns (bool)",
  "event CredentialRevoked(address indexed issuerAddress, uint256 indexed credentialNonce)",
  "event CredentialUnRevoked(address indexed issuerAddress, uint256 indexed credentialNonce)",
];

// Default RPC Provider for read-only operations
const RPC_URL = "https://rpc-amoy.polygon.technology";

export function getReadOnlyProvider() {
  return new ethers.JsonRpcProvider(RPC_URL);
}

export function getIssuerRegistryContract(providerOrSigner) {
  return new ethers.Contract(
    CONTRACT_ADDRESSES.ISSUER_REGISTRY,
    ISSUER_REGISTRY_ABI,
    providerOrSigner || getReadOnlyProvider(),
  );
}

export function getRevocationRegistryContract(providerOrSigner) {
  return new ethers.Contract(
    CONTRACT_ADDRESSES.REVOCATION_REGISTRY,
    REVOCATION_REGISTRY_ABI,
    providerOrSigner || getReadOnlyProvider(),
  );
}

export function getExplorerUrl(txHash) {
  return `https://amoy.polygonscan.com/tx/${txHash}`;
}

export function getAddressExplorerUrl(address) {
  return `https://amoy.polygonscan.com/address/${address}`;
}

// Generate a unique verification request ID
export function generateRequestId() {
  return `VR-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

// Format timestamp to readable date
export function formatTimestamp(timestamp) {
  return new Date(timestamp).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

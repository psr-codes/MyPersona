import { ethers } from "ethers";

// Contract Addresses (Polygon Amoy Testnet)
export const CONTRACT_ADDRESSES = {
  ISSUER_REGISTRY: "0xf4ab183CabCD54F1d2632FD4DF6688bbd04595d5",
  REVOCATION_REGISTRY: "0xA5274b769D818785BdEDAB209ED23ef2125f58dF",
};

// IssuerRegistry ABI (Admin functionality)
export const ISSUER_REGISTRY_ABI = [
  // Write functions
  "function addIssuer(address _issuerAddress) external",
  "function removeIssuer(address _issuerAddress) external",
  "function pause() external",
  "function unpause() external",
  "function transferOwnership(address newOwner) external",

  // Read functions
  "function isTrustedIssuer(address) view returns (bool)",
  "function owner() view returns (address)",
  "function paused() view returns (bool)",

  // Events
  "event IssuerAdded(address indexed issuerAddress)",
  "event IssuerRemoved(address indexed issuerAddress)",
  "event Paused(address account)",
  "event Unpaused(address account)",
  "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)",
];

// RevocationRegistry ABI (Admin/Info functionality)
export const REVOCATION_REGISTRY_ABI = [
  "function isRevoked(uint256) view returns (bool)",
  "function issuerRegistry() view returns (address)",
  "function owner() view returns (address)",
  "function paused() view returns (bool)",
  "function pause() external",
  "function unpause() external",
];

// Default RPC Provider
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

// Format timestamp
export function formatTimestamp(timestamp) {
  return new Date(timestamp * 1000).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

// Shorten address
export function shortAddress(address) {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

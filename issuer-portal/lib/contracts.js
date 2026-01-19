import { ethers } from "ethers";

// Contract Addresses (Polygon Amoy Testnet)
export const CONTRACT_ADDRESSES = {
  ISSUER_REGISTRY: "0xf4ab183CabCD54F1d2632FD4DF6688bbd04595d5",
  REVOCATION_REGISTRY: "0xA5274b769D818785BdEDAB209ED23ef2125f58dF",
};

// IssuerRegistry ABI
export const ISSUER_REGISTRY_ABI = [
  "function isTrustedIssuer(address) view returns (bool)",
  "function owner() view returns (address)",
  "function paused() view returns (bool)",
  "function addIssuer(address _issuerAddress) external",
  "function removeIssuer(address _issuerAddress) external",
  "function pause() external",
  "function unpause() external",
  "function transferOwnership(address newOwner) external",
  "event IssuerAdded(address indexed issuerAddress)",
  "event IssuerRemoved(address indexed issuerAddress)",
  "event Paused(address account)",
  "event Unpaused(address account)",
  "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)",
];

// RevocationRegistry ABI
export const REVOCATION_REGISTRY_ABI = [
  "function isRevoked(uint256) view returns (bool)",
  "function issuerRegistry() view returns (address)",
  "function owner() view returns (address)",
  "function paused() view returns (bool)",
  "function revokeCredential(uint256 _credentialNonce) external",
  "function unRevokeCredential(uint256 _credentialNonce) external",
  "function setIssuerRegistryAddress(address _newRegistryAddress) external",
  "function pause() external",
  "function unpause() external",
  "function transferOwnership(address newOwner) external",
  "event CredentialRevoked(address indexed issuerAddress, uint256 indexed credentialNonce)",
  "event CredentialUnRevoked(address indexed issuerAddress, uint256 indexed credentialNonce)",
  "event IssuerRegistryAddressUpdated(address indexed newRegistryAddress)",
  "event Paused(address account)",
  "event Unpaused(address account)",
  "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)",
];

export function getIssuerRegistryContract(providerOrSigner) {
  return new ethers.Contract(
    CONTRACT_ADDRESSES.ISSUER_REGISTRY,
    ISSUER_REGISTRY_ABI,
    providerOrSigner,
  );
}

export function getRevocationRegistryContract(providerOrSigner) {
  return new ethers.Contract(
    CONTRACT_ADDRESSES.REVOCATION_REGISTRY,
    REVOCATION_REGISTRY_ABI,
    providerOrSigner,
  );
}

export function formatTransactionError(error) {
  if (error.code === 4001 || error.code === "ACTION_REJECTED") {
    return "Transaction rejected by user";
  }
  if (error.message?.includes("insufficient funds")) {
    return "Insufficient MATIC for gas fees";
  }
  if (error.reason) {
    return error.reason;
  }
  if (error.message?.includes("CallerNotTrustedIssuer")) {
    return "You are not a trusted issuer";
  }
  const match = error.message?.match(/reason="([^"]+)"/);
  if (match) {
    return match[1];
  }
  return "Transaction failed. Please try again.";
}

export function getExplorerUrl(txHash) {
  return `https://amoy.polygonscan.com/tx/${txHash}`;
}

export function getAddressExplorerUrl(address) {
  return `https://amoy.polygonscan.com/address/${address}`;
}

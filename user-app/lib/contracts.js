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
];

// RevocationRegistry ABI
export const REVOCATION_REGISTRY_ABI = [
  "function isRevoked(uint256) view returns (bool)",
  "function issuerRegistry() view returns (address)",
  "function owner() view returns (address)",
  "function paused() view returns (bool)",
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

// Generate a mock credential (for demo purposes)
export function generateMockCredential(userAddress) {
  const nonce = Math.floor(Math.random() * 1000000) + 1;
  const issuedAt = Date.now();
  const expiresAt = issuedAt + 365 * 24 * 60 * 60 * 1000; // 1 year from now

  return {
    id: `VC-${nonce}`,
    nonce: nonce,
    type: "KYCCredential",
    issuer: CONTRACT_ADDRESSES.ISSUER_REGISTRY,
    subject: userAddress,
    issuedAt: issuedAt,
    expiresAt: expiresAt,
    claims: {
      kycVerified: true,
      ageAbove18: true,
      nationality: "IN",
      riskLevel: "low",
    },
    proof: {
      type: "EcdsaSecp256k1Signature2019",
      created: new Date(issuedAt).toISOString(),
      verificationMethod: CONTRACT_ADDRESSES.ISSUER_REGISTRY,
    },
  };
}

// Format timestamp to readable date
export function formatTimestamp(timestamp) {
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Format full timestamp
export function formatFullTimestamp(timestamp) {
  return new Date(timestamp).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

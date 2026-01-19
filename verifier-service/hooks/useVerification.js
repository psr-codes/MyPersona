"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getIssuerRegistryContract,
  getRevocationRegistryContract,
  getReadOnlyProvider,
} from "@/lib/contracts";

export function useVerification() {
  const [isLoading, setIsLoading] = useState(false);
  const [registryPaused, setRegistryPaused] = useState(false);

  // Check if a credential is revoked
  const checkRevocationStatus = useCallback(async (credentialNonce) => {
    try {
      const contract = getRevocationRegistryContract();
      const isRevoked = await contract.isRevoked(credentialNonce);
      return { success: true, isRevoked, nonce: credentialNonce };
    } catch (error) {
      console.error("Failed to check revocation:", error);
      return { success: false, error: error.message };
    }
  }, []);

  // Verify if an address is a trusted issuer
  const verifyIssuer = useCallback(async (issuerAddress) => {
    try {
      const contract = getIssuerRegistryContract();
      const isTrusted = await contract.isTrustedIssuer(issuerAddress);
      return { success: true, isTrusted, address: issuerAddress };
    } catch (error) {
      console.error("Failed to verify issuer:", error);
      return { success: false, error: error.message };
    }
  }, []);

  // Get recent revocation events
  const getRecentRevocations = useCallback(async (limit = 20) => {
    try {
      const contract = getRevocationRegistryContract();
      const [revokedEvents, unrevokedEvents] = await Promise.all([
        contract.queryFilter(contract.filters.CredentialRevoked(), -10000),
        contract.queryFilter(contract.filters.CredentialUnRevoked(), -10000),
      ]);

      const allEvents = [...revokedEvents, ...unrevokedEvents]
        .sort((a, b) => b.blockNumber - a.blockNumber)
        .slice(0, limit)
        .map((event) => ({
          type: event.eventName,
          issuerAddress: event.args.issuerAddress,
          credentialNonce: event.args.credentialNonce.toString(),
          blockNumber: event.blockNumber,
          transactionHash: event.transactionHash,
        }));

      return allEvents;
    } catch (error) {
      console.error("Failed to get recent revocations:", error);
      return [];
    }
  }, []);

  // Get count of revoked credentials
  const getRevokedCount = useCallback(async () => {
    try {
      const contract = getRevocationRegistryContract();
      const [revokedEvents, unrevokedEvents] = await Promise.all([
        contract.queryFilter(contract.filters.CredentialRevoked(), -50000),
        contract.queryFilter(contract.filters.CredentialUnRevoked(), -50000),
      ]);

      const revokedSet = new Set();
      const allEvents = [...revokedEvents, ...unrevokedEvents].sort(
        (a, b) => a.blockNumber - b.blockNumber,
      );

      for (const event of allEvents) {
        const nonce = event.args.credentialNonce.toString();
        if (event.eventName === "CredentialRevoked") {
          revokedSet.add(nonce);
        } else {
          revokedSet.delete(nonce);
        }
      }

      return revokedSet.size;
    } catch (error) {
      console.error("Failed to get revoked count:", error);
      return 0;
    }
  }, []);

  // Get count of trusted issuers
  const getTrustedIssuersCount = useCallback(async () => {
    try {
      const contract = getIssuerRegistryContract();
      const [addedEvents, removedEvents] = await Promise.all([
        contract.queryFilter(contract.filters.IssuerAdded(), -50000),
        contract.queryFilter(contract.filters.IssuerRemoved(), -50000),
      ]);

      const issuerSet = new Set();
      const allEvents = [...addedEvents, ...removedEvents].sort(
        (a, b) => a.blockNumber - b.blockNumber,
      );

      for (const event of allEvents) {
        const address = event.args.issuerAddress;
        if (event.eventName === "IssuerAdded") {
          issuerSet.add(address);
        } else {
          issuerSet.delete(address);
        }
      }

      return issuerSet.size;
    } catch (error) {
      console.error("Failed to get issuers count:", error);
      return 0;
    }
  }, []);

  // Check contract status
  const checkContractStatus = useCallback(async () => {
    try {
      const contract = getRevocationRegistryContract();
      const paused = await contract.paused();
      setRegistryPaused(paused);
      return !paused;
    } catch (error) {
      console.error("Failed to check contract status:", error);
      return false;
    }
  }, []);

  // Batch verify multiple credentials
  const batchVerify = useCallback(
    async (credentialNonces) => {
      setIsLoading(true);
      try {
        const results = await Promise.all(
          credentialNonces.map(async (nonce) => {
            const result = await checkRevocationStatus(nonce);
            return { nonce, ...result };
          }),
        );
        return results;
      } finally {
        setIsLoading(false);
      }
    },
    [checkRevocationStatus],
  );

  useEffect(() => {
    checkContractStatus();
  }, [checkContractStatus]);

  return {
    isLoading,
    registryPaused,
    checkRevocationStatus,
    verifyIssuer,
    getRecentRevocations,
    getRevokedCount,
    getTrustedIssuersCount,
    checkContractStatus,
    batchVerify,
  };
}

// Hook to manage verification requests
export function useVerificationRequests() {
  const [requests, setRequests] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("verificationRequests");
      if (saved) {
        setRequests(JSON.parse(saved));
      }
    }
  }, []);

  // Save to localStorage when requests change
  useEffect(() => {
    if (typeof window !== "undefined" && requests.length > 0) {
      localStorage.setItem("verificationRequests", JSON.stringify(requests));
    }
  }, [requests]);

  const createRequest = useCallback((requirements = {}) => {
    const request = {
      id: `VR-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      createdAt: Date.now(),
      status: "pending",
      requirements: {
        ageAbove18: requirements.ageAbove18 || false,
        kycVerified: requirements.kycVerified || true,
        notRevoked: requirements.notRevoked || true,
        trustedIssuer: requirements.trustedIssuer || true,
        ...requirements,
      },
      response: null,
    };
    setRequests((prev) => [request, ...prev]);
    return request;
  }, []);

  const updateRequest = useCallback((requestId, updates) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === requestId ? { ...req, ...updates } : req)),
    );
  }, []);

  const deleteRequest = useCallback((requestId) => {
    setRequests((prev) => prev.filter((req) => req.id !== requestId));
  }, []);

  const clearAllRequests = useCallback(() => {
    setRequests([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("verificationRequests");
    }
  }, []);

  return {
    requests,
    createRequest,
    updateRequest,
    deleteRequest,
    clearAllRequests,
  };
}

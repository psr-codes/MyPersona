"use client";

import { useState, useEffect, useCallback } from "react";
import { useWallet } from "@/contexts/WalletContext";
import {
  getIssuerRegistryContract,
  getRevocationRegistryContract,
  generateMockCredential,
} from "@/lib/contracts";

const STORAGE_KEY = "mypersona_credentials";

export function useCredentials() {
  const { account, signMessage } = useWallet();
  const [credentials, setCredentials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load credentials from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Filter credentials for current account
        const userCredentials = account
          ? parsed.filter(
              (c) => c.subject?.toLowerCase() === account.toLowerCase(),
            )
          : [];
        setCredentials(userCredentials);
      }
      setIsLoading(false);
    }
  }, [account]);

  // Save credentials to localStorage
  const saveCredentials = useCallback(
    (newCredentials) => {
      if (typeof window !== "undefined") {
        // Get all credentials and merge
        const saved = localStorage.getItem(STORAGE_KEY);
        const allCredentials = saved ? JSON.parse(saved) : [];

        // Remove old credentials for this account
        const otherCredentials = allCredentials.filter(
          (c) => c.subject?.toLowerCase() !== account?.toLowerCase(),
        );

        // Add new credentials
        const merged = [...otherCredentials, ...newCredentials];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      }
    },
    [account],
  );

  // Add a new credential
  const addCredential = useCallback(
    (credential) => {
      const newCredentials = [...credentials, credential];
      setCredentials(newCredentials);
      saveCredentials(newCredentials);
      return credential;
    },
    [credentials, saveCredentials],
  );

  // Remove a credential
  const removeCredential = useCallback(
    (credentialId) => {
      const newCredentials = credentials.filter((c) => c.id !== credentialId);
      setCredentials(newCredentials);
      saveCredentials(newCredentials);
    },
    [credentials, saveCredentials],
  );

  // Request a new credential (mock)
  const requestCredential = useCallback(async () => {
    if (!account) return null;

    const credential = generateMockCredential(account);
    return addCredential(credential);
  }, [account, addCredential]);

  // Check if a credential is revoked on-chain
  const checkRevocationStatus = useCallback(async (credential) => {
    try {
      const contract = getRevocationRegistryContract();
      const isRevoked = await contract.isRevoked(credential.nonce);
      return { ...credential, isRevoked };
    } catch (error) {
      console.error("Failed to check revocation:", error);
      return { ...credential, isRevoked: false };
    }
  }, []);

  // Check all credentials revocation status
  const checkAllRevocations = useCallback(async () => {
    setIsLoading(true);
    const checked = await Promise.all(
      credentials.map((c) => checkRevocationStatus(c)),
    );
    setCredentials(checked);
    saveCredentials(checked);
    setIsLoading(false);
    return checked;
  }, [credentials, checkRevocationStatus, saveCredentials]);

  // Generate a ZK proof for a credential (mock)
  const generateProof = useCallback(
    async (credential, requirements) => {
      if (!signMessage) return null;

      const proofData = {
        credentialId: credential.id,
        credentialNonce: credential.nonce,
        requirements: requirements,
        timestamp: Date.now(),
      };

      // Sign the proof data
      const message = JSON.stringify(proofData);
      const signature = await signMessage(message);

      if (!signature) return null;

      return {
        ...proofData,
        signature,
        proof: {
          type: "zkSNARK",
          created: new Date().toISOString(),
          proofValue: signature.slice(0, 66), // Mock proof value
        },
      };
    },
    [signMessage],
  );

  // Get valid (non-revoked, non-expired) credentials
  const validCredentials = credentials.filter((c) => {
    const isExpired = c.expiresAt < Date.now();
    const isRevoked = c.isRevoked;
    return !isExpired && !isRevoked;
  });

  return {
    credentials,
    validCredentials,
    isLoading,
    addCredential,
    removeCredential,
    requestCredential,
    checkRevocationStatus,
    checkAllRevocations,
    generateProof,
  };
}

// Hook for handling verification requests (QR code scanning)
export function useVerificationHandler() {
  const { account, signMessage } = useWallet();
  const { credentials, generateProof } = useCredentials();
  const [pendingRequest, setPendingRequest] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleVerificationRequest = useCallback(
    async (requestData) => {
      if (!account) return { success: false, error: "Wallet not connected" };
      if (credentials.length === 0)
        return { success: false, error: "No credentials available" };

      setPendingRequest(requestData);
      return { success: true, request: requestData };
    },
    [account, credentials],
  );

  const submitProof = useCallback(
    async (credential) => {
      if (!pendingRequest || !credential) return null;

      setIsProcessing(true);
      try {
        const proof = await generateProof(
          credential,
          pendingRequest.requirements,
        );
        setPendingRequest(null);
        return proof;
      } finally {
        setIsProcessing(false);
      }
    },
    [pendingRequest, generateProof],
  );

  const cancelRequest = useCallback(() => {
    setPendingRequest(null);
  }, []);

  return {
    pendingRequest,
    isProcessing,
    handleVerificationRequest,
    submitProof,
    cancelRequest,
  };
}

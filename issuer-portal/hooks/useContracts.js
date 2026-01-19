"use client";

import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { useWallet } from "@/contexts/WalletContext";
import {
  getIssuerRegistryContract,
  getRevocationRegistryContract,
  formatTransactionError,
  CONTRACT_ADDRESSES,
} from "@/lib/contracts";
import toast from "react-hot-toast";

export function useIssuerRegistry() {
  const { provider, signer, account } = useWallet();

  const [owner, setOwner] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [trustedIssuers, setTrustedIssuers] = useState([]);
  const [events, setEvents] = useState([]);

  const loadContractState = useCallback(async () => {
    if (!provider) return;

    setIsLoading(true);
    try {
      const contract = getIssuerRegistryContract(provider);
      const [ownerAddr, paused] = await Promise.all([
        contract.owner(),
        contract.paused(),
      ]);

      setOwner(ownerAddr);
      setIsPaused(paused);
      setIsOwner(account?.toLowerCase() === ownerAddr.toLowerCase());

      await loadIssuers(contract);
      await loadEvents(contract);
    } catch (error) {
      console.error("Failed to load IssuerRegistry state:", error);
    } finally {
      setIsLoading(false);
    }
  }, [provider, account]);

  const loadIssuers = async (contract) => {
    try {
      const addedFilter = contract.filters.IssuerAdded();
      const removedFilter = contract.filters.IssuerRemoved();

      const [addedEvents, removedEvents] = await Promise.all([
        contract.queryFilter(addedFilter, -10000),
        contract.queryFilter(removedFilter, -10000),
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

      const issuerList = [];
      for (const address of issuerSet) {
        const isTrusted = await contract.isTrustedIssuer(address);
        if (isTrusted) {
          issuerList.push({
            address,
            addedAt: addedEvents.find((e) => e.args.issuerAddress === address)
              ?.blockNumber,
          });
        }
      }

      setTrustedIssuers(issuerList);
    } catch (error) {
      console.error("Failed to load issuers:", error);
    }
  };

  const loadEvents = async (contract) => {
    try {
      const [added, removed, paused, unpaused] = await Promise.all([
        contract.queryFilter(contract.filters.IssuerAdded(), -5000),
        contract.queryFilter(contract.filters.IssuerRemoved(), -5000),
        contract.queryFilter(contract.filters.Paused(), -5000),
        contract.queryFilter(contract.filters.Unpaused(), -5000),
      ]);

      const allEvents = [...added, ...removed, ...paused, ...unpaused]
        .sort((a, b) => b.blockNumber - a.blockNumber)
        .slice(0, 20)
        .map((event) => ({
          type: event.eventName,
          args: event.args,
          blockNumber: event.blockNumber,
          transactionHash: event.transactionHash,
        }));

      setEvents(allEvents);
    } catch (error) {
      console.error("Failed to load events:", error);
    }
  };

  const checkIsTrusted = useCallback(
    async (address) => {
      if (!provider || !ethers.isAddress(address)) return false;
      try {
        const contract = getIssuerRegistryContract(provider);
        return await contract.isTrustedIssuer(address);
      } catch (error) {
        console.error("Failed to check issuer:", error);
        return false;
      }
    },
    [provider],
  );

  const addIssuer = useCallback(
    async (address) => {
      if (!signer) {
        toast.error("Please connect your wallet");
        return false;
      }
      if (!ethers.isAddress(address)) {
        toast.error("Invalid Ethereum address");
        return false;
      }

      const toastId = toast.loading("Adding issuer...");
      try {
        const contract = getIssuerRegistryContract(signer);
        const tx = await contract.addIssuer(address);
        toast.loading("Waiting for confirmation...", { id: toastId });
        await tx.wait();
        toast.success("Issuer added successfully!", { id: toastId });
        await loadContractState();
        return true;
      } catch (error) {
        console.error("Failed to add issuer:", error);
        toast.error(formatTransactionError(error), { id: toastId });
        return false;
      }
    },
    [signer, loadContractState],
  );

  const removeIssuer = useCallback(
    async (address) => {
      if (!signer) {
        toast.error("Please connect your wallet");
        return false;
      }

      const toastId = toast.loading("Removing issuer...");
      try {
        const contract = getIssuerRegistryContract(signer);
        const tx = await contract.removeIssuer(address);
        toast.loading("Waiting for confirmation...", { id: toastId });
        await tx.wait();
        toast.success("Issuer removed successfully!", { id: toastId });
        await loadContractState();
        return true;
      } catch (error) {
        console.error("Failed to remove issuer:", error);
        toast.error(formatTransactionError(error), { id: toastId });
        return false;
      }
    },
    [signer, loadContractState],
  );

  const pause = useCallback(async () => {
    if (!signer) {
      toast.error("Please connect your wallet");
      return false;
    }

    const toastId = toast.loading("Pausing contract...");
    try {
      const contract = getIssuerRegistryContract(signer);
      const tx = await contract.pause();
      toast.loading("Waiting for confirmation...", { id: toastId });
      await tx.wait();
      toast.success("Contract paused!", { id: toastId });
      await loadContractState();
      return true;
    } catch (error) {
      console.error("Failed to pause:", error);
      toast.error(formatTransactionError(error), { id: toastId });
      return false;
    }
  }, [signer, loadContractState]);

  const unpause = useCallback(async () => {
    if (!signer) {
      toast.error("Please connect your wallet");
      return false;
    }

    const toastId = toast.loading("Unpausing contract...");
    try {
      const contract = getIssuerRegistryContract(signer);
      const tx = await contract.unpause();
      toast.loading("Waiting for confirmation...", { id: toastId });
      await tx.wait();
      toast.success("Contract unpaused!", { id: toastId });
      await loadContractState();
      return true;
    } catch (error) {
      console.error("Failed to unpause:", error);
      toast.error(formatTransactionError(error), { id: toastId });
      return false;
    }
  }, [signer, loadContractState]);

  useEffect(() => {
    loadContractState();
  }, [loadContractState]);

  return {
    owner,
    isPaused,
    isLoading,
    isOwner,
    trustedIssuers,
    events,
    contractAddress: CONTRACT_ADDRESSES.ISSUER_REGISTRY,
    checkIsTrusted,
    addIssuer,
    removeIssuer,
    pause,
    unpause,
    refresh: loadContractState,
  };
}

export function useRevocationRegistry() {
  const { provider, signer, account } = useWallet();

  const [owner, setOwner] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [isTrustedIssuer, setIsTrustedIssuer] = useState(false);
  const [events, setEvents] = useState([]);
  const [revokedCount, setRevokedCount] = useState(0);

  const loadContractState = useCallback(async () => {
    if (!provider) return;

    setIsLoading(true);
    try {
      const contract = getRevocationRegistryContract(provider);
      const issuerContract = getIssuerRegistryContract(provider);

      const [ownerAddr, paused] = await Promise.all([
        contract.owner(),
        contract.paused(),
      ]);

      setOwner(ownerAddr);
      setIsPaused(paused);
      setIsOwner(account?.toLowerCase() === ownerAddr.toLowerCase());

      if (account) {
        const trusted = await issuerContract.isTrustedIssuer(account);
        setIsTrustedIssuer(trusted);
      }

      await loadEvents(contract);
    } catch (error) {
      console.error("Failed to load RevocationRegistry state:", error);
    } finally {
      setIsLoading(false);
    }
  }, [provider, account]);

  const loadEvents = async (contract) => {
    try {
      const [revoked, unrevoked] = await Promise.all([
        contract.queryFilter(contract.filters.CredentialRevoked(), -10000),
        contract.queryFilter(contract.filters.CredentialUnRevoked(), -10000),
      ]);

      const revokedSet = new Set();
      const allEvents = [...revoked, ...unrevoked].sort(
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
      setRevokedCount(revokedSet.size);

      const recentEvents = [...revoked, ...unrevoked]
        .sort((a, b) => b.blockNumber - a.blockNumber)
        .slice(0, 20)
        .map((event) => ({
          type: event.eventName,
          args: {
            issuerAddress: event.args.issuerAddress,
            credentialNonce: event.args.credentialNonce.toString(),
          },
          blockNumber: event.blockNumber,
          transactionHash: event.transactionHash,
        }));

      setEvents(recentEvents);
    } catch (error) {
      console.error("Failed to load events:", error);
    }
  };

  const checkIsRevoked = useCallback(
    async (nonce) => {
      if (!provider) return false;
      try {
        const contract = getRevocationRegistryContract(provider);
        return await contract.isRevoked(nonce);
      } catch (error) {
        console.error("Failed to check revocation:", error);
        return false;
      }
    },
    [provider],
  );

  const revokeCredential = useCallback(
    async (nonce) => {
      if (!signer) {
        toast.error("Please connect your wallet");
        return false;
      }

      const toastId = toast.loading("Revoking credential...");
      try {
        const contract = getRevocationRegistryContract(signer);
        const tx = await contract.revokeCredential(nonce);
        toast.loading("Waiting for confirmation...", { id: toastId });
        await tx.wait();
        toast.success("Credential revoked successfully!", { id: toastId });
        await loadContractState();
        return true;
      } catch (error) {
        console.error("Failed to revoke credential:", error);
        toast.error(formatTransactionError(error), { id: toastId });
        return false;
      }
    },
    [signer, loadContractState],
  );

  const unRevokeCredential = useCallback(
    async (nonce) => {
      if (!signer) {
        toast.error("Please connect your wallet");
        return false;
      }

      const toastId = toast.loading("Unrevoking credential...");
      try {
        const contract = getRevocationRegistryContract(signer);
        const tx = await contract.unRevokeCredential(nonce);
        toast.loading("Waiting for confirmation...", { id: toastId });
        await tx.wait();
        toast.success("Credential reinstated successfully!", { id: toastId });
        await loadContractState();
        return true;
      } catch (error) {
        console.error("Failed to unrevoke credential:", error);
        toast.error(formatTransactionError(error), { id: toastId });
        return false;
      }
    },
    [signer, loadContractState],
  );

  const pause = useCallback(async () => {
    if (!signer) {
      toast.error("Please connect your wallet");
      return false;
    }

    const toastId = toast.loading("Pausing contract...");
    try {
      const contract = getRevocationRegistryContract(signer);
      const tx = await contract.pause();
      toast.loading("Waiting for confirmation...", { id: toastId });
      await tx.wait();
      toast.success("Contract paused!", { id: toastId });
      await loadContractState();
      return true;
    } catch (error) {
      console.error("Failed to pause:", error);
      toast.error(formatTransactionError(error), { id: toastId });
      return false;
    }
  }, [signer, loadContractState]);

  const unpause = useCallback(async () => {
    if (!signer) {
      toast.error("Please connect your wallet");
      return false;
    }

    const toastId = toast.loading("Unpausing contract...");
    try {
      const contract = getRevocationRegistryContract(signer);
      const tx = await contract.unpause();
      toast.loading("Waiting for confirmation...", { id: toastId });
      await tx.wait();
      toast.success("Contract unpaused!", { id: toastId });
      await loadContractState();
      return true;
    } catch (error) {
      console.error("Failed to unpause:", error);
      toast.error(formatTransactionError(error), { id: toastId });
      return false;
    }
  }, [signer, loadContractState]);

  useEffect(() => {
    loadContractState();
  }, [loadContractState]);

  return {
    owner,
    isPaused,
    isLoading,
    isOwner,
    isTrustedIssuer,
    events,
    revokedCount,
    contractAddress: CONTRACT_ADDRESSES.REVOCATION_REGISTRY,
    checkIsRevoked,
    revokeCredential,
    unRevokeCredential,
    pause,
    unpause,
    refresh: loadContractState,
  };
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { useWallet } from "@/contexts/WalletContext";
import {
  getIssuerRegistryContract,
  getRevocationRegistryContract,
} from "@/lib/contracts";
import toast from "react-hot-toast";

export function useAdmin() {
  const { account, signer, provider } = useWallet();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOwner, setIsOwner] = useState(false); // Connected account is owner?
  const [contractOwner, setContractOwner] = useState(null);
  const [issuers, setIssuers] = useState([]); // List of trusted issuer addresses
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch contract state (Owner, Paused)
  const fetchContractState = useCallback(async () => {
    if (!provider) return;

    try {
      const contract = getIssuerRegistryContract(provider);

      const ownerAddr = await contract.owner();
      setContractOwner(ownerAddr);

      const pausedState = await contract.paused();
      setIsPaused(pausedState);

      if (account) {
        setIsOwner(account.toLowerCase() === ownerAddr.toLowerCase());
        // For this demo, Admin = Owner.
        // Real systems might have roles, but ABI only has onlyOwner.
        setIsAdmin(account.toLowerCase() === ownerAddr.toLowerCase());
      }
    } catch (error) {
      console.error("Failed to fetch contract state:", error);
      toast.error("Failed to load contract state");
    }
  }, [account, provider]);

  // Fetch list of issuers from events
  const fetchIssuers = useCallback(async () => {
    if (!provider) return;
    setIsRefreshing(true);

    try {
      const contract = getIssuerRegistryContract(provider);

      // Get all added events
      const addedFilter = contract.filters.IssuerAdded();
      const addedEvents = await contract.queryFilter(addedFilter);

      // Get all removed events
      const removedFilter = contract.filters.IssuerRemoved();
      const removedEvents = await contract.queryFilter(removedFilter);

      // Process events to build current state
      const issuerSet = new Set();

      // Sort all events by block number and log index
      const allEvents = [
        ...addedEvents.map((e) => ({
          type: "add",
          address: e.args[0],
          block: e.blockNumber,
          index: e.index,
        })),
        ...removedEvents.map((e) => ({
          type: "remove",
          address: e.args[0],
          block: e.blockNumber,
          index: e.index,
        })),
      ].sort((a, b) => {
        if (a.block !== b.block) return a.block - b.block;
        return a.index - b.index;
      });

      // Replay events
      allEvents.forEach((e) => {
        if (e.type === "add") issuerSet.add(e.address);
        else if (e.type === "remove") issuerSet.delete(e.address);
      });

      const issuerList = Array.from(issuerSet);
      setIssuers(issuerList);
    } catch (error) {
      console.error("Failed to fetch issuers:", error);
      toast.error("Failed to load issuer list");
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  }, [provider]);

  // Initial load
  useEffect(() => {
    if (provider) {
      fetchContractState();
      fetchIssuers();
    }
  }, [provider, account, fetchContractState, fetchIssuers]);

  // Actions

  const addIssuer = async (address) => {
    if (!signer || !isOwner) {
      toast.error("Unauthorized: Only Admin can add issuers");
      return false;
    }

    const toastId = toast.loading("Adding issuer...");
    try {
      const contract = getIssuerRegistryContract(signer);
      const tx = await contract.addIssuer(address);
      toast.loading(`Transaction sent: ${tx.hash.slice(0, 8)}...`, {
        id: toastId,
      });

      await tx.wait();
      toast.success("Issuer added successfully", { id: toastId });

      // Refresh list
      fetchIssuers();
      return true;
    } catch (error) {
      console.error("Add issuer failed:", error);
      const reason = error.reason || error.message || "Unknown error";
      toast.error(`Failed: ${reason}`, { id: toastId });
      return false;
    }
  };

  const removeIssuer = async (address) => {
    if (!signer || !isOwner) {
      toast.error("Unauthorized: Only Admin can remove issuers");
      return false;
    }

    const toastId = toast.loading("Removing issuer...");
    try {
      const contract = getIssuerRegistryContract(signer);
      const tx = await contract.removeIssuer(address);
      toast.loading(`Transaction sent: ${tx.hash.slice(0, 8)}...`, {
        id: toastId,
      });

      await tx.wait();
      toast.success("Issuer removed successfully", { id: toastId });

      // Refresh list
      fetchIssuers();
      return true;
    } catch (error) {
      console.error("Remove issuer failed:", error);
      const reason = error.reason || error.message || "Unknown error";
      toast.error(`Failed: ${reason}`, { id: toastId });
      return false;
    }
  };

  const togglePause = async (shouldPause) => {
    if (!signer || !isOwner) return;

    const action = shouldPause ? "Pausing" : "Unpausing";
    const toastId = toast.loading(`${action} registry...`);

    try {
      const contract = getIssuerRegistryContract(signer);
      const tx = shouldPause
        ? await contract.pause()
        : await contract.unpause();

      toast.loading(`Transaction sent: ${tx.hash.slice(0, 8)}...`, {
        id: toastId,
      });
      await tx.wait();

      toast.success(`Registry ${shouldPause ? "paused" : "active"}`, {
        id: toastId,
      });
      fetchContractState();
      return true;
    } catch (error) {
      console.error(`${action} failed:`, error);
      toast.error(`Failed: ${error.reason || "Unknown error"}`, {
        id: toastId,
      });
      return false;
    }
  };

  return {
    isAdmin,
    isOwner,
    contractOwner,
    issuers,
    isLoading,
    isRefreshing,
    isPaused,
    addIssuer,
    removeIssuer,
    togglePause,
    refreshCallback: fetchIssuers,
  };
}

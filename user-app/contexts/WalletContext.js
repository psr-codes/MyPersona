"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { ethers } from "ethers";
import toast from "react-hot-toast";

const WalletContext = createContext(null);

const POLYGON_AMOY = {
  chainId: "0x13882",
  chainName: "Polygon Amoy Testnet",
  nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
  rpcUrls: ["https://rpc-amoy.polygon.technology/"],
  blockExplorerUrls: ["https://amoy.polygonscan.com/"],
};

export function WalletProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isMetaMaskInstalled =
    mounted && typeof window !== "undefined" && window.ethereum?.isMetaMask;

  const updateBalance = useCallback(async (providerInstance, address) => {
    if (!providerInstance || !address) return;
    try {
      const bal = await providerInstance.getBalance(address);
      setBalance(ethers.formatEther(bal));
    } catch (error) {
      console.error("Failed to get balance:", error);
    }
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === "undefined" || !window.ethereum) return;

    const provider = new ethers.BrowserProvider(window.ethereum);
    setProvider(provider);

    window.ethereum.request({ method: "eth_accounts" }).then((accounts) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        provider.getSigner().then(setSigner);
        updateBalance(provider, accounts[0]);
      }
    });

    window.ethereum.request({ method: "eth_chainId" }).then((chainId) => {
      setChainId(chainId);
      setIsCorrectNetwork(chainId === POLYGON_AMOY.chainId);
    });
  }, [mounted, updateBalance]);

  useEffect(() => {
    if (!mounted || typeof window === "undefined" || !window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        setAccount(null);
        setSigner(null);
        setBalance(null);
        toast.error("Wallet disconnected");
      } else if (accounts[0] !== account) {
        setAccount(accounts[0]);
        provider?.getSigner().then(setSigner);
        updateBalance(provider, accounts[0]);
        toast.success("Account changed");
      }
    };

    const handleChainChanged = (newChainId) => {
      setChainId(newChainId);
      setIsCorrectNetwork(newChainId === POLYGON_AMOY.chainId);
      const newProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(newProvider);
      if (account) {
        newProvider.getSigner().then(setSigner);
        updateBalance(newProvider, account);
      }
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [account, provider, mounted, updateBalance]);

  const connect = useCallback(async () => {
    if (!isMetaMaskInstalled) {
      toast.error("Please install MetaMask to continue");
      window.open("https://metamask.io/download/", "_blank");
      return;
    }

    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        const newProvider = new ethers.BrowserProvider(window.ethereum);
        setProvider(newProvider);
        const newSigner = await newProvider.getSigner();
        setSigner(newSigner);
        updateBalance(newProvider, accounts[0]);
        toast.success("Wallet connected!");
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      if (error.code === 4001) {
        toast.error("Connection request rejected");
      } else {
        toast.error("Failed to connect wallet");
      }
    } finally {
      setIsConnecting(false);
    }
  }, [isMetaMaskInstalled, updateBalance]);

  const disconnect = useCallback(() => {
    setAccount(null);
    setSigner(null);
    setBalance(null);
    toast.success("Wallet disconnected");
  }, []);

  const switchToPolygonAmoy = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) return;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: POLYGON_AMOY.chainId }],
      });
      toast.success("Switched to Polygon Amoy");
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [POLYGON_AMOY],
          });
          toast.success("Polygon Amoy network added");
        } catch (addError) {
          console.error("Failed to add network:", addError);
          toast.error("Failed to add Polygon Amoy network");
        }
      } else {
        console.error("Failed to switch network:", switchError);
        toast.error("Failed to switch network");
      }
    }
  }, []);

  const formatAddress = useCallback((address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, []);

  const signMessage = useCallback(
    async (message) => {
      if (!signer) {
        toast.error("Please connect your wallet");
        return null;
      }
      try {
        const signature = await signer.signMessage(message);
        return signature;
      } catch (error) {
        console.error("Failed to sign message:", error);
        if (error.code === 4001 || error.code === "ACTION_REJECTED") {
          toast.error("Signature rejected");
        } else {
          toast.error("Failed to sign message");
        }
        return null;
      }
    },
    [signer],
  );

  const value = {
    account,
    provider,
    signer,
    chainId,
    balance,
    isConnecting,
    isConnected: !!account,
    isCorrectNetwork,
    isMetaMaskInstalled,
    connect,
    disconnect,
    switchToPolygonAmoy,
    formatAddress,
    signMessage,
    networkName: "Polygon Amoy",
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}

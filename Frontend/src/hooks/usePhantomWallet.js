import { useState, useEffect, useCallback } from "react";
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  clusterApiUrl,
} from "@solana/web3.js";

const NETWORK = "devnet"; // Change to 'mainnet-beta' for production
const connection = new Connection(clusterApiUrl(NETWORK), "confirmed");

// Your platform's wallet address (replace with your actual wallet)
console.log(import.meta.env.VITE_PLATFORM_WALLET);
if (import.meta.env.VITE_PLATFORM_WALLET) {
  try {
    const PLATFORM_WALLET = new PublicKey(import.meta.env.VITE_PLATFORM_WALLET);
    console.log("Platform wallet set:", PLATFORM_WALLET.toBase58());
  } catch (e) {
    console.error("Invalid wallet address:", e.message);
  }
} else {
  console.warn("VITE_PLATFORM_WALLET is not set in env variables.");
}
const PLATFORM_WALLET = new PublicKey(import.meta.env.VITE_PLATFORM_WALLET);

export const usePhantomWallet = () => {
  const [wallet, setWallet] = useState(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [publicKey, setPublicKey] = useState(null);

  // Check if Phantom is installed
  const isPhantomInstalled = useCallback(() => {
    return (
      typeof window !== "undefined" && window.solana && window.solana.isPhantom
    );
  }, []);

  // Connect to Phantom wallet
  const connect = useCallback(async () => {
    if (!isPhantomInstalled()) {
      window.open("https://phantom.app/", "_blank");
      return { success: false, error: "Phantom wallet not installed" };
    }

    try {
      setConnecting(true);
      const response = await window.solana.connect();
      const wallet = window.solana;

      setWallet(wallet);
      setPublicKey(response.publicKey);
      setConnected(true);

      return {
        success: true,
        publicKey: response.publicKey.toString(),
        wallet,
      };
    } catch (error) {
      console.error("Failed to connect to Phantom:", error);
      return {
        success: false,
        error: error.message || "Failed to connect to wallet",
      };
    } finally {
      setConnecting(false);
    }
  }, [isPhantomInstalled]);

  // Disconnect wallet
  const disconnect = useCallback(async () => {
    try {
      if (wallet) {
        await wallet.disconnect();
      }
      setWallet(null);
      setPublicKey(null);
      setConnected(false);
      return { success: true };
    } catch (error) {
      console.error("Failed to disconnect:", error);
      return { success: false, error: error.message };
    }
  }, [wallet]);

  // Send SOL transaction
  const sendTransaction = useCallback(
    async (amount) => {
      if (!wallet || !publicKey) {
        return { success: false, error: "Wallet not connected" };
      }

      try {
        const lamports = amount * 1000000000; // Convert SOL to lamports

        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: PLATFORM_WALLET,
            lamports,
          })
        );

        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = publicKey;

        const signedTransaction = await wallet.signTransaction(transaction);
        const signature = await connection.sendRawTransaction(
          signedTransaction.serialize()
        );

        // Wait for confirmation
        await connection.confirmTransaction(signature, "confirmed");

        return {
          success: true,
          signature,
          amount,
        };
      } catch (error) {
        console.error("Transaction failed:", error);
        return {
          success: false,
          error: error.message || "Transaction failed",
        };
      }
    },
    [wallet, publicKey]
  );

  // Get wallet balance
  const getBalance = useCallback(async () => {
    if (!publicKey) return 0;

    try {
      const balance = await connection.getBalance(publicKey);
      return balance / 1000000000; // Convert lamports to SOL
    } catch (error) {
      console.error("Failed to get balance:", error);
      return 0;
    }
  }, [publicKey]);

  // Check for existing connection on mount
  useEffect(() => {
    if (isPhantomInstalled() && window.solana.isConnected) {
      setWallet(window.solana);
      setPublicKey(window.solana.publicKey);
      setConnected(true);
    }
  }, [isPhantomInstalled]);

  // Listen for account changes
  useEffect(() => {
    if (wallet) {
      const handleAccountChange = (publicKey) => {
        if (publicKey) {
          setPublicKey(publicKey);
        } else {
          // User disconnected
          setWallet(null);
          setPublicKey(null);
          setConnected(false);
        }
      };

      wallet.on("accountChanged", handleAccountChange);

      return () => {
        wallet.removeListener("accountChanged", handleAccountChange);
      };
    }
  }, [wallet]);

  return {
    wallet,
    connected,
    connecting,
    publicKey: publicKey?.toString(),
    isPhantomInstalled: isPhantomInstalled(),
    connect,
    disconnect,
    sendTransaction,
    getBalance,
  };
};

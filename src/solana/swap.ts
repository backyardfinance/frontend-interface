import type { Connection, Transaction } from "@solana/web3.js";
import {
  AddressLookupTableAccount,
  ComputeBudgetProgram,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import axios from "axios";
import bs58 from "bs58";
import { toast } from "sonner";
import { JUPITER_API_URL } from "@/config";
import { swapConfig } from "@/config/swap";
import { jitoClient } from "@/jito/rpc-client";
import type { JupiterSwap } from "@/jupiter/api";

// Types
export interface SwapQuote {
  quote: JupiterSwap.OrderGet200Response;
  outputMint: string;
}

export type SignTransactionFn = (
  tx: Transaction | VersionedTransaction
) => Promise<Transaction | VersionedTransaction | undefined>;

export interface MultiSwapParams {
  quotes: SwapQuote[];
  walletAddress: string;
  signTransaction: SignTransactionFn;
  connection: Connection;
}

export interface MultiSwapResult {
  success: boolean;
  bundleId?: string;
  signature?: string;
  error?: string;
}

interface SwapInstructionsResponse {
  setupInstructions: SerializedInstruction[];
  swapInstruction: SerializedInstruction;
  cleanupInstruction?: SerializedInstruction;
  addressLookupTableAddresses: string[];
}

interface SerializedInstruction {
  programId: string;
  accounts: { pubkey: string; isSigner: boolean; isWritable: boolean }[];
  data: string;
}

/**
 * Get a random Jito tip account
 */
async function getRandomTipAccount(): Promise<string> {
  return jitoClient.getRandomTipAccount();
}

/**
 * Calculate tip amount based on attempt number
 */
function calculateTipAmount(attemptIndex: number): number {
  const escalation = swapConfig.jitoTipEscalation[Math.min(attemptIndex, swapConfig.jitoTipEscalation.length - 1)];
  const baseTip = swapConfig.jitoMinTipLamports * swapConfig.jitoTipMultiplier;
  const tip = Math.ceil(baseTip * escalation);
  return Math.min(tip, swapConfig.jitoMaxTipLamports);
}

/**
 * Deserialize a serialized instruction from Jupiter API
 */
function deserializeInstruction(instruction: SerializedInstruction): TransactionInstruction {
  return new TransactionInstruction({
    programId: new PublicKey(instruction.programId),
    keys: instruction.accounts.map((key) => ({
      pubkey: new PublicKey(key.pubkey),
      isSigner: key.isSigner,
      isWritable: key.isWritable,
    })),
    data: Buffer.from(instruction.data, "base64"),
  });
}

/**
 * Get swap instructions from Jupiter v6 API
 */
async function getSwapInstructions(
  quote: JupiterSwap.OrderGet200Response,
  userPublicKey: string
): Promise<SwapInstructionsResponse> {
  const response = await axios.post(`${JUPITER_API_URL}/v6/swap-instructions`, {
    quoteResponse: quote,
    userPublicKey,
    wrapUnwrapSOL: true,
    dynamicComputeUnitLimit: true,
  });
  return response.data;
}

/**
 * Fetch address lookup table accounts
 */
async function getAddressLookupTableAccounts(
  keys: string[],
  connection: Connection
): Promise<AddressLookupTableAccount[]> {
  if (!keys || keys.length === 0) return [];

  const pubkeys = keys.map((k) => new PublicKey(k));
  const accounts = await connection.getMultipleAccountsInfo(pubkeys);

  const result: AddressLookupTableAccount[] = [];
  for (let i = 0; i < pubkeys.length; i++) {
    const info = accounts[i];
    if (info?.data) {
      try {
        const state = AddressLookupTableAccount.deserialize(info.data);
        result.push(new AddressLookupTableAccount({ key: pubkeys[i], state }));
      } catch {
        // Skip invalid lookup tables
      }
    }
  }
  return result;
}

/**
 * Create a tip instruction for Jito
 */
function createTipInstruction(walletAddress: string, tipAccount: string, tipLamports: number): TransactionInstruction {
  return SystemProgram.transfer({
    fromPubkey: new PublicKey(walletAddress),
    toPubkey: new PublicKey(tipAccount),
    lamports: tipLamports,
  });
}

/**
 * Simulate transaction to estimate compute units
 */
async function simulateForComputeUnits(
  instructions: TransactionInstruction[],
  payer: PublicKey,
  addressLookupTableAccounts: AddressLookupTableAccount[],
  connection: Connection
): Promise<number> {
  const { blockhash } = await connection.getLatestBlockhash("confirmed");

  const messageV0 = new TransactionMessage({
    payerKey: payer,
    recentBlockhash: blockhash,
    instructions,
  }).compileToV0Message(addressLookupTableAccounts);

  const transaction = new VersionedTransaction(messageV0);

  const simulation = await connection.simulateTransaction(transaction, {
    sigVerify: false,
    replaceRecentBlockhash: true,
  });

  if (simulation.value.err) {
    console.error("Simulation error:", simulation.value.err);
    console.error("Simulation logs:", simulation.value.logs);
    throw new Error(`Simulation failed: ${JSON.stringify(simulation.value.err)}`);
  }

  const unitsConsumed = simulation.value.unitsConsumed || 200000;
  // Add buffer for safety
  return Math.ceil(unitsConsumed * swapConfig.computeUnitBuffer);
}

/**
 * Execute multiple swaps as a single atomic transaction via Jito bundle
 * All swaps are combined into one transaction - all succeed or all fail
 */
export async function executeMultiSwap(params: MultiSwapParams): Promise<MultiSwapResult> {
  const { quotes, walletAddress, signTransaction, connection } = params;

  // Filter out quotes without valid data
  const validQuotes = quotes.filter((q) => q.quote && !q.quote.errorCode);

  if (validQuotes.length === 0) {
    return { success: false, error: "No valid quotes available" };
  }

  let attemptIndex = 0;
  const payerPubkey = new PublicKey(walletAddress);

  while (attemptIndex < swapConfig.maxRetries) {
    try {
      console.log(`\n🔄 ========== ATOMIC SWAP ATTEMPT ${attemptIndex + 1}/${swapConfig.maxRetries} ==========`);

      // Collect all instructions and lookup tables from all swaps
      const allSetupInstructions: TransactionInstruction[] = [];
      const allSwapInstructions: TransactionInstruction[] = [];
      const allCleanupInstructions: TransactionInstruction[] = [];
      const allLookupTableAddresses: Set<string> = new Set();

      console.log(`\n📦 Fetching swap instructions for ${validQuotes.length} swaps...`);

      for (const { quote, outputMint } of validQuotes) {
        console.log(`  → Swap to ${outputMint}: ${quote.inAmount} → ${quote.outAmount}`);

        const swapInstructions = await getSwapInstructions(quote, walletAddress);

        // Add setup instructions
        for (const ix of swapInstructions.setupInstructions) {
          allSetupInstructions.push(deserializeInstruction(ix));
        }

        // Add main swap instruction
        allSwapInstructions.push(deserializeInstruction(swapInstructions.swapInstruction));

        // Add cleanup instruction if present
        if (swapInstructions.cleanupInstruction) {
          allCleanupInstructions.push(deserializeInstruction(swapInstructions.cleanupInstruction));
        }

        // Collect lookup table addresses
        for (const addr of swapInstructions.addressLookupTableAddresses) {
          allLookupTableAddresses.add(addr);
        }
      }

      console.log(`✅ Collected ${allSwapInstructions.length} swap instructions`);

      // Fetch all address lookup tables
      console.log(`\n📋 Fetching ${allLookupTableAddresses.size} address lookup tables...`);
      const addressLookupTableAccounts = await getAddressLookupTableAccounts(
        Array.from(allLookupTableAddresses),
        connection
      );
      console.log(`✅ Loaded ${addressLookupTableAccounts.length} lookup tables`);

      // Get Jito tip account and calculate tip
      const tipAccount = await getRandomTipAccount();
      const tipLamports = calculateTipAmount(attemptIndex);
      console.log(`\n💰 Jito tip: ${tipLamports} lamports`);

      // Build combined instructions array
      // Order: setup → swaps → cleanup → tip
      const combinedInstructions: TransactionInstruction[] = [
        ...allSetupInstructions,
        ...allSwapInstructions,
        ...allCleanupInstructions,
        createTipInstruction(walletAddress, tipAccount, tipLamports),
      ];

      // Simulate to get compute units
      console.log("\n🧪 Simulating transaction...");
      const computeUnits = await simulateForComputeUnits(
        combinedInstructions,
        payerPubkey,
        addressLookupTableAccounts,
        connection
      );
      console.log(`✅ Estimated compute units: ${computeUnits}`);

      // Add compute budget instructions at the beginning
      const computeBudgetIx = ComputeBudgetProgram.setComputeUnitLimit({ units: computeUnits });
      const priorityFeeIx = ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 10000 });

      const finalInstructions = [computeBudgetIx, priorityFeeIx, ...combinedInstructions];

      // Get fresh blockhash and create versioned transaction
      const { blockhash } = await connection.getLatestBlockhash("confirmed");
      console.log(`📋 Blockhash: ${blockhash}`);

      const messageV0 = new TransactionMessage({
        payerKey: payerPubkey,
        recentBlockhash: blockhash,
        instructions: finalInstructions,
      }).compileToV0Message(addressLookupTableAccounts);

      const transaction = new VersionedTransaction(messageV0);

      // Sign transaction once
      console.log("\n✍️ Signing atomic transaction...");
      const signedTx = await signTransaction(transaction);
      if (!signedTx) {
        throw new Error("Failed to sign transaction");
      }
      console.log("✅ Transaction signed");

      // Encode for Jito bundle
      const encodedTx = Buffer.from((signedTx as VersionedTransaction).serialize()).toString("base64");

      // Send via Jito bundle (single transaction bundle)
      console.log("\n🚀 Sending to Jito...");
      const bundleResponse = await jitoClient.sendBundle([[encodedTx], { encoding: "base64" }]);

      if (bundleResponse.error) {
        throw new Error(`Jito error: ${bundleResponse.error.message}`);
      }

      const bundleId = bundleResponse.result;
      console.log(`✅ Bundle sent! ID: ${bundleId}`);

      // Wait for bundle confirmation
      console.log("\n⏳ Waiting for confirmation...");
      const bundleStatus = await jitoClient.confirmInflightBundle(bundleId!, swapConfig.bundleTimeoutMs);

      if (bundleStatus && "status" in bundleStatus && bundleStatus.status === "Landed") {
        const signature = bs58.encode((signedTx as VersionedTransaction).signatures[0]);
        console.log(`\n✨ Atomic swap successful! Signature: ${signature}`);

        toast.success(`Successfully swapped ${validQuotes.length} tokens in one transaction!`);

        return {
          success: true,
          bundleId: bundleId!,
          signature,
        };
      }

      if (bundleStatus && "status" in bundleStatus && bundleStatus.status === "Failed") {
        throw new Error("Bundle failed to land");
      }

      // If timeout or pending, retry
      console.log(
        `⚠️ Bundle status: ${bundleStatus && "status" in bundleStatus ? bundleStatus.status : "unknown"}, retrying...`
      );
      attemptIndex++;
    } catch (error) {
      console.error(`\n❌ Attempt ${attemptIndex + 1} failed:`, error);
      attemptIndex++;

      if (attemptIndex >= swapConfig.maxRetries) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        toast.error(`Swap failed: ${errorMessage}`);
        return { success: false, error: errorMessage };
      }

      console.log(`\n🔄 Retrying in ${swapConfig.retryDelayMs}ms...`);
      await new Promise((resolve) => setTimeout(resolve, swapConfig.retryDelayMs));
    }
  }

  return { success: false, error: "Max retries exceeded" };
}

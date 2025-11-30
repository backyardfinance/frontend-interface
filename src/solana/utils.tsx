// import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
// import {
//   ComputeBudgetProgram,
//   PublicKey,
//   SystemProgram,
//   Transaction,
//   TransactionMessage,
//   VersionedTransaction,
// } from "@solana/web3.js";
// import axios from "axios";

// const config = {
//   JUPITER_V6_API: "https://quote-api.jup.ag/v6",
//   // Primary Jito bundle URL (env overrides default global endpoint)
//   JITO_RPC_URL: process.env.JITO_BUNDLE_URL || "https://mainnet.block-engine.jito.wtf/api/v1/bundles",
//   // Optional list of regional fallback endpoints for rotation
//   JITO_BUNDLE_URLS: [
//     process.env.JITO_BUNDLE_URL,
//     process.env.JITO_BUNDLE_URL_FALLBACK_1,
//     process.env.JITO_BUNDLE_URL_FALLBACK_2,
//   ].filter(Boolean),
//   // Tip tuning (for bundles only the Jito tip matters)
//   JITO_TIP_MULTIPLIER: parseFloat(process.env.JITO_TIP_MULTIPLIER || "1.2"),
//   JITO_MIN_TIP_LAMPORTS: parseInt(process.env.JITO_MIN_TIP_LAMPORTS || "1000", 10),
//   // Optional higher floor just for the first attempt (falls back to JITO_MIN_TIP_LAMPORTS)
//   JITO_FIRST_ATTEMPT_MIN_TIP_LAMPORTS: parseInt(
//     process.env.JITO_FIRST_ATTEMPT_MIN_TIP_LAMPORTS || process.env.JITO_MIN_TIP_LAMPORTS || "1000",
//     10
//   ),
//   // Baseline to use from tip_floor: ema50|p50|p75|p95|p99 (default ema50)
//   JITO_TIP_BASE: (process.env.JITO_TIP_BASE || "ema50").toLowerCase(),
//   // Tip escalation across retries (e.g., 1.0,1.2,1.5,2.0)
//   JITO_TIP_ESCALATION: (process.env.JITO_TIP_ESCALATION || "1.0,1.2,1.5,2.0")
//     .split(",")
//     .map((v) => parseFloat(v.trim()))
//     .filter((v) => !Number.isNaN(v)),
//   // Absolute cap to prevent runaway tips
//   JITO_MAX_TIP_LAMPORTS: parseInt(process.env.JITO_MAX_TIP_LAMPORTS || "2000000", 10),
//   // Priority fee floor for sendTransaction fallback (micro-lamports)
//   PRIORITY_FEE_FLOOR_MICROLAMPORTS: parseInt(process.env.PRIORITY_FEE_FLOOR_MICROLAMPORTS || "10000", 10),
//   // Optional provider-based priority fee estimator (e.g., Helius/QuickNode)
//   PRIORITY_FEE_PROVIDER_URL: process.env.PRIORITY_FEE_PROVIDER_URL,
//   PRIORITY_FEE_PROVIDER_METHOD: process.env.PRIORITY_FEE_PROVIDER_METHOD || "getPriorityFeeEstimate",
//   PRIORITY_FEE_ACCOUNT_KEYS: (process.env.PRIORITY_FEE_ACCOUNT_KEYS || "")
//     .split(",")
//     .map((s) => s.trim())
//     .filter(Boolean),
//   // Percentile-based priority fee selection and caps
//   PRIORITY_FEE_PERCENTILE: parseInt(process.env.PRIORITY_FEE_PERCENTILE || "75", 10),
//   PRIORITY_FEE_MIN_MICROLAMPORTS: parseInt(process.env.PRIORITY_FEE_MIN_MICROLAMPORTS || "10000", 10),
//   PRIORITY_FEE_MAX_MICROLAMPORTS: parseInt(process.env.PRIORITY_FEE_MAX_MICROLAMPORTS || "1000000", 10),
//   SOLANA_RPC_URL: process.env.SOLANA_RPC_URL,
//   WALLET_PRIVATE_KEY: process.env.WALLET_PRIVATE_KEY,
// };

// // Priority fee estimator
// const TIP_FLOOR_URL = "https://bundles.jito.wtf/api/v1/bundles/tip_floor";

// // Bundle endpoints: primary + optional fallbacks, with simple rotation
// const BUNDLE_ENDPOINTS =
//   config.JITO_BUNDLE_URLS && config.JITO_BUNDLE_URLS.length > 0 ? config.JITO_BUNDLE_URLS : [config.JITO_RPC_URL];

// function shuffledEndpoints() {
//   if (BUNDLE_ENDPOINTS.length <= 1) return BUNDLE_ENDPOINTS;
//   const copy = BUNDLE_ENDPOINTS.slice();
//   for (let i = copy.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     const tmp = copy[i];
//     copy[i] = copy[j];
//     copy[j] = tmp;
//   }
//   return copy;
// }

// function sleep(ms) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

// function backoffDelayMs(attempt) {
//   const base = 250; // ms
//   const cap = 3000; // ms
//   const exp = Math.min(cap, base * 2 ** attempt);
//   const jitter = Math.floor(Math.random() * 150);
//   return exp + jitter;
// }

// async function postBundleRpc(method, params, options = {}) {
//   const { attemptsPerEndpoint = 4, requestTimeoutMs = 6000 } = options;

//   let endpoints;
//   if (method === "sendBundle") {
//     endpoints = shuffledEndpoints();
//   } else {
//     const path = METHOD_TO_PATH[method] || method;
//     const bases =
//       API_BASE_ENDPOINTS.length > 0 ? API_BASE_ENDPOINTS : BUNDLE_ENDPOINTS.map((u) => u.replace(/\/?bundles$/, ""));
//     endpoints = bases.map((base) => `${base}/${path}`);
//   }
//   let lastError;

//   for (const endpoint of endpoints) {
//     for (let attempt = 0; attempt < attemptsPerEndpoint; attempt++) {
//       try {
//         const response = await axios.post(
//           endpoint,
//           { jsonrpc: "2.0", id: 1, method, params },
//           { headers: { "Content-Type": "application/json" }, timeout: requestTimeoutMs }
//         );

//         if (response.data && response.data.error) {
//           const err = new Error(response.data.error.message || "Jito RPC error");
//           err.code = response.data.error.code;
//           throw err;
//         }

//         return response.data.result;
//       } catch (error) {
//         lastError = error;
//         const status = error.response?.status;
//         const isRateLimited = status === 429;
//         const isRetriable = isRateLimited || !status || status >= 500;
//         if (!isRetriable || attempt === attemptsPerEndpoint - 1) {
//           break; // move to next endpoint
//         }
//         await sleep(backoffDelayMs(attempt));
//       }
//     }
//   }

//   throw lastError || new Error("Unknown error calling Jito bundle RPC");
// }

// // Tip accounts cache to reduce rate-limit pressure
// let tipCache = { accounts: null, fetchedAt: 0 };
// const TIP_TTL_MS = 60_000; // 1 minute

// let tipFloorCache = { lamports: null, fetchedAt: 0 };
// const TIP_FLOOR_TTL_MS = 15_000; // refresh frequently

// async function fetchTipFloorLamports() {
//   const now = Date.now();
//   if (tipFloorCache.lamports !== null && now - tipFloorCache.fetchedAt < TIP_FLOOR_TTL_MS) {
//     return tipFloorCache.lamports;
//   }
//   try {
//     const resp = await axios.get(TIP_FLOOR_URL, { timeout: 4000 });
//     if (!Array.isArray(resp.data) || resp.data.length === 0) {
//       return JITO_MIN_TIP_LAMPORTS;
//     }
//     const entry = resp.data[resp.data.length - 1];
//     // Choose baseline based on JITO_TIP_BASE
//     let sol = 0;
//     switch (JITO_TIP_BASE) {
//       case "p99":
//         sol = entry.landed_tips_99th_percentile ?? 0;
//         break;
//       case "p95":
//         sol = entry.landed_tips_95th_percentile ?? 0;
//         break;
//       case "p75":
//         sol = entry.landed_tips_75th_percentile ?? 0;
//         break;
//       case "p50":
//         sol = entry.landed_tips_50th_percentile ?? 0;
//         break;
//       case "ema50":
//       default:
//         sol = entry.ema_landed_tips_50th_percentile ?? entry.landed_tips_50th_percentile ?? 0;
//         break;
//     }
//     const lamports = Math.max(JITO_MIN_TIP_LAMPORTS, Math.ceil(sol * 1e9));
//     tipFloorCache = { lamports, fetchedAt: now };
//     return lamports;
//   } catch {
//     return JITO_MIN_TIP_LAMPORTS;
//   }
// }

// async function getTipAccounts() {
//   try {
//     const now = Date.now();
//     if (tipCache.accounts && now - tipCache.fetchedAt < TIP_TTL_MS) {
//       return tipCache.accounts;
//     }

//     const result = await postBundleRpc("getTipAccounts", []);
//     tipCache = { accounts: result, fetchedAt: Date.now() };
//     return result;
//   } catch (error) {
//     console.error("❌ Error getting tip accounts:", error.message);
//     throw error;
//   }
// }

// async function createJitoBundle(transaction, wallet: PublicKey, sharedBlockhash, attemptIndex = 0) {
//   try {
//     const tipAccounts = await getTipAccounts();
//     if (!tipAccounts || tipAccounts.length === 0) {
//       throw new Error("❌ Failed to get Jito tip accounts");
//     }

//     const tipAccountPubkey = new PublicKey(tipAccounts[Math.floor(Math.random() * tipAccounts.length)]);

//     // Determine tip dynamically from tip floor with escalation
//     const floor = await fetchTipFloorLamports();
//     const esc =
//       JITO_TIP_ESCALATION && JITO_TIP_ESCALATION.length > 0
//         ? JITO_TIP_ESCALATION[Math.min(attemptIndex, JITO_TIP_ESCALATION.length - 1)]
//         : 1.0;
//     const baseMult = JITO_TIP_MULTIPLIER || 1.2;
//     const dynamicMult = baseMult * esc;
//     const minFloor =
//       attemptIndex === 0 ? Math.max(JITO_MIN_TIP_LAMPORTS, JITO_FIRST_ATTEMPT_MIN_TIP_LAMPORTS) : JITO_MIN_TIP_LAMPORTS;
//     let suggested = Math.max(minFloor, Math.ceil(floor * dynamicMult));
//     if (Number.isFinite(JITO_MAX_TIP_LAMPORTS)) {
//       suggested = Math.min(suggested, JITO_MAX_TIP_LAMPORTS);
//     }
//     console.log(
//       `🏷️ Tip floor: ${floor} lamports, multiplier: ${dynamicMult.toFixed(2)}, chosen tip: ${suggested} lamports`
//     );
//     const tipInstruction = SystemProgram.transfer({
//       fromPubkey: wallet,
//       toPubkey: tipAccountPubkey,
//       lamports: suggested,
//     });

//     let blockhashToUse = sharedBlockhash;
//     if (!blockhashToUse) {
//       const latestBlockhash = await connection.getLatestBlockhash("finalized");
//       blockhashToUse = latestBlockhash.blockhash;
//     }

//     const tipTransaction = new Transaction().add(tipInstruction);
//     tipTransaction.recentBlockhash = blockhashToUse;
//     tipTransaction.feePayer = wallet.publicKey;
//     tipTransaction.sign(wallet);

//     const signature = bs58.encode(transaction.signatures[0]);

//     console.log("🔄 Encoding transactions...");
//     // Order: [tip, main] for higher acceptance with current block engine behavior
//     const bundle = [tipTransaction, transaction].map((tx, index) => {
//       console.log(`📦 Encoding transaction ${index + 1}`);
//       if (tx instanceof VersionedTransaction) {
//         console.log(`🔢 Transaction ${index + 1} is VersionedTransaction`);
//         return Buffer.from(tx.serialize()).toString("base64");
//       } else {
//         console.log(`📜 Transaction ${index + 1} is regular Transaction`);
//         const bytes = tx.serialize({ verifySignatures: false });
//         return Buffer.from(bytes).toString("base64");
//       }
//     });

//     console.log("✅ Bundle created successfully");
//     return { bundle, tipLamports: suggested };
//   } catch (error) {
//     console.error("❌ Error in createJitoBundle:", error);
//     console.error("🔍 Error stack:", error.stack);
//     throw error;
//   }
// }

// async function sendJitoBundle(bundle) {
//   try {
//     const result = await postBundleRpc("sendBundle", [bundle, { encoding: "base64" }]);
//     return result;
//   } catch (error) {
//     console.error("❌ Error sending Jito bundle:", error.message);
//     throw error;
//   }
// }

// async function checkBundleStatus(bundleId, mainTxSignature) {
//   try {
//     // First try inflight (5 minute lookback)
//     const resp = await postBundleRpc("getInflightBundleStatuses", [[bundleId]], {
//       attemptsPerEndpoint: 4,
//       requestTimeoutMs: 4000,
//     });
//     const inflight = resp?.value?.[0];
//     if (inflight && (inflight.status === "Landed" || inflight.status === "Failed")) {
//       return {
//         bundleId: inflight.bundle_id,
//         status: inflight.status,
//         landedSlot: inflight.landed_slot,
//       };
//     }

//     // Fallback to historical bundle statuses which returns transaction signatures
//     const resp2 = await postBundleRpc("getBundleStatuses", [[bundleId]], {
//       attemptsPerEndpoint: 4,
//       requestTimeoutMs: 4000,
//     });
//     const hist = resp2?.value?.[0];
//     if (hist && hist.confirmation_status) {
//       return {
//         bundleId: hist.bundle_id,
//         status:
//           hist.confirmation_status === "finalized" || hist.confirmation_status === "confirmed" ? "Landed" : "Pending",
//         landedSlot: hist.slot,
//         transactions: hist.transactions || [],
//       };
//     }

//     // Final fallback: check the main tx signature via Solana RPC (not rate-limited by Jito)
//     if (mainTxSignature) {
//       const statuses = await connection.getSignatureStatuses([mainTxSignature], { searchTransactionHistory: true });
//       const s = statuses && statuses.value && statuses.value[0];
//       if (s && (s.confirmationStatus === "confirmed" || s.confirmationStatus === "finalized")) {
//         return { bundleId, status: "Landed", landedSlot: s.slot, transactions: [mainTxSignature] };
//       }
//     }

//     // If inflight existed but wasn't final, return it so caller can decide; else null
//     if (inflight) {
//       return {
//         bundleId: inflight.bundle_id,
//         status: inflight.status,
//         landedSlot: inflight.landed_slot,
//       };
//     }

//     console.log(`ℹ️ No status found for bundle ID: ${bundleId}`);
//     return null;
//   } catch (error) {
//     console.error("❌ Error checking bundle status:", error.message);
//     return null;
//   }
// }

// const JUPITER_V6_API = `https://quote-api.jup.ag/v6`;
// async function getQuote(inputMint, outputMint, amount, slippageBps) {
//   const response = await axios.get(`${JUPITER_V6_API}/quote`, {
//     params: {
//       inputMint,
//       outputMint,
//       amount,
//       slippageBps,
//     },
//   });
//   return response.data;
// }

// async function getAddressLookupTableAccounts(keys) {
//   if (!keys || keys.length === 0) return [];
//   const pubkeys = keys.map((k) => new PublicKey(k));
//   const accounts = await connection.getMultipleAccountsInfo(pubkeys, { commitment: "processed" });
//   const list = [];
//   for (let i = 0; i < pubkeys.length; i++) {
//     const info = accounts[i];
//     if (info && info.data) {
//       try {
//         const state = AddressLookupTableAccount.deserialize(info.data);
//         list.push({ key: pubkeys[i], state });
//       } catch (_) {
//         // skip invalid ALT
//       }
//     }
//   }
//   return list;
// }
// async function confirmBundle(bundleId, mainTxSignature, timeoutMs = 120000, pollMs = 2000, maxPolls = 3) {
//   const start = Date.now();
//   let lastStatus = null;
//   let attempt = 0;
//   let pollCount = 0;
//   while (Date.now() - start < timeoutMs) {
//     attempt++;
//     pollCount++;
//     const status = await checkBundleStatus(bundleId, mainTxSignature);
//     if (status) {
//       console.log(
//         `🧭 Bundle poll #${attempt}: status=${status.status}${status.landedSlot ? ` slot=${status.landedSlot}` : ""}`
//       );
//     } else {
//       console.log(`🧭 Bundle poll #${attempt}: status=unknown`);
//     }
//     if (status && (status.status === "Landed" || status.status === "Failed")) {
//       return status;
//     }
//     // Cap number of polls per attempt to allow quick retry/reprice
//     if (pollCount >= maxPolls && status && (status.status === "Pending" || status.status === "Invalid")) {
//       return status;
//     }
//     lastStatus = status;
//     await sleep(pollMs);
//     // gentle backoff to avoid 429s
//     if (pollMs < 5000) {
//       pollMs = Math.min(5000, Math.floor(pollMs * 1.25));
//     }
//   }
//   return lastStatus || { bundleId, status: "Timeout", landedSlot: null };
// }

// async function simulateTransaction(instructions, payer, addressLookupTableAccounts, maxRetries = 5, minContextSlot) {
//   console.log("🔍 Simulating transaction to estimate compute units...");
//   const latestBlockhash = await connection.getLatestBlockhash("confirmed");

//   let retries = 0;
//   while (retries < maxRetries) {
//     try {
//       const messageV0 = new TransactionMessage({
//         payerKey: payer,
//         recentBlockhash: latestBlockhash.blockhash,
//         instructions: instructions.filter(Boolean),
//       }).compileToV0Message(addressLookupTableAccounts);

//       const transaction = new VersionedTransaction(messageV0);

//       const simulation = await connection.simulateTransaction(transaction, {
//         sigVerify: false,
//         replaceRecentBlockhash: true,
//         minContextSlot,
//       });

//       if (simulation.value.err) {
//         console.error("❌ Simulation error:", JSON.stringify(simulation.value.err, null, 2));
//         if (simulation.value.logs) {
//           console.error("📜 Simulation logs:", simulation.value.logs);
//         }
//         throw new Error(`❌ Simulation failed: ${JSON.stringify(simulation.value.err)}`);
//       }

//       const unitsConsumed = simulation.value.unitsConsumed || 0;
//       console.log("✅ Simulation successful. Units consumed:", unitsConsumed);

//       const computeUnits = Math.ceil(unitsConsumed * 1.2);
//       return computeUnits;
//     } catch (error) {
//       console.error("❌ Error during simulation:", error.message);
//       if (error.message.includes("InsufficientFundsForRent")) {
//         return { error: "InsufficientFundsForRent" };
//       }
//       retries++;
//       if (retries >= maxRetries) {
//         console.error("❌ Max retries reached. Simulation failed.");
//         return undefined;
//       }
//       console.log(`🔄 Retrying simulation (attempt ${retries + 1})...`);
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//     }
//   }
// }

// function createVersionedTransaction(
//   instructions,
//   payer,
//   addressLookupTableAccounts,
//   recentBlockhash,
//   computeUnits,
//   priorityFee
// ) {
//   const computeBudgetIx = ComputeBudgetProgram.setComputeUnitLimit({
//     units: computeUnits,
//   });
//   const priorityFeeIx = ComputeBudgetProgram.setComputeUnitPrice({
//     microLamports: priorityFee.microLamports,
//   });

//   const finalInstructions = [computeBudgetIx, priorityFeeIx, ...instructions];

//   const messageV0 = new TransactionMessage({
//     payerKey: payer,
//     recentBlockhash: recentBlockhash,
//     instructions: finalInstructions,
//   }).compileToV0Message(addressLookupTableAccounts);

//   return new VersionedTransaction(messageV0);
// }

// async function getSwapInstructions(quoteResponse, userPublicKey) {
//   const response = await axios.post(`${JUPITER_V6_API}/swap-instructions`, {
//     quoteResponse,
//     userPublicKey,
//     wrapUnwrapSOL: true,
//   });
//   return response.data;
// }

// function deserializeInstruction(instruction) {
//   return {
//     programId: new PublicKey(instruction.programId),
//     keys: instruction.accounts.map((key) => ({
//       pubkey: new PublicKey(key.pubkey),
//       isSigner: key.isSigner,
//       isWritable: key.isWritable,
//     })),
//     data: Buffer.from(instruction.data, "base64"),
//   };
// }

// async function getTokenInfo(mint, connection) {
//   const mintAccount = new PublicKey(mint);
//   const mintInfo = await connection.getParsedAccountInfo(mintAccount);

//   if (!mintInfo.value || !mintInfo.value.data || !mintInfo.value.data.parsed) {
//     throw new Error(`❌ Failed to fetch token info for mint: ${mint}`);
//   }

//   const { decimals } = mintInfo.value.data.parsed.info;
//   return { decimals };
// }

// async function getAveragePriorityFee() {
//   const priorityFees = await connection.getRecentPrioritizationFees();
//   if (priorityFees.length === 0) {
//     return { microLamports: 0, solAmount: 0 }; // No data
//   }

//   const recentFees = priorityFees.slice(-150); // Get fees from last 150 slots
//   const averageFee = recentFees.reduce((sum, fee) => sum + fee.prioritizationFee, 0) / recentFees.length;
//   const microLamports = Math.ceil(averageFee);
//   const solAmount = microLamports / 1e15; // micro-lamports -> lamports (/1e6) -> SOL (/1e9)
//   return { microLamports, solAmount };
// }

// function pickPercentile(values, percentile) {
//   if (!Array.isArray(values) || values.length === 0) return 0;
//   const sorted = values.slice().sort((a, b) => a - b);
//   const idx = Math.min(sorted.length - 1, Math.max(0, Math.floor((percentile / 100) * (sorted.length - 1))));
//   return sorted[idx];
// }

// async function getPercentilePriorityFee() {
//   const priorityFees = await connection.getRecentPrioritizationFees();
//   if (!priorityFees || priorityFees.length === 0) {
//     const floor = PRIORITY_FEE_MIN_MICROLAMPORTS;
//     return { microLamports: floor, solAmount: floor / 1e15 };
//   }
//   const recentFees = priorityFees
//     .slice(-150)
//     .map((f) => f.prioritizationFee)
//     .filter((v) => Number.isFinite(v) && v >= 0);
//   if (recentFees.length === 0) {
//     const floor = PRIORITY_FEE_MIN_MICROLAMPORTS;
//     return { microLamports: floor, solAmount: floor / 1e15 };
//   }
//   let picked = Math.ceil(pickPercentile(recentFees, PRIORITY_FEE_PERCENTILE));
//   if (Number.isFinite(PRIORITY_FEE_MIN_MICROLAMPORTS)) {
//     picked = Math.max(picked, PRIORITY_FEE_MIN_MICROLAMPORTS);
//   }
//   if (Number.isFinite(PRIORITY_FEE_MAX_MICROLAMPORTS)) {
//     picked = Math.min(picked, PRIORITY_FEE_MAX_MICROLAMPORTS);
//   }
//   return { microLamports: picked, solAmount: picked / 1e15 };
// }

// async function getProviderEstimatedPriorityFee(percentileOverride, accountKeysOverride) {
//   if (!PRIORITY_FEE_PROVIDER_URL) return null;
//   try {
//     const effectivePercentile = Number.isFinite(percentileOverride) ? percentileOverride : PRIORITY_FEE_PERCENTILE;
//     const effectiveAccountKeys =
//       Array.isArray(accountKeysOverride) && accountKeysOverride.length
//         ? accountKeysOverride
//         : PRIORITY_FEE_ACCOUNT_KEYS.length
//           ? PRIORITY_FEE_ACCOUNT_KEYS
//           : undefined;
//     const params = [{ percentile: effectivePercentile, accountKeys: effectiveAccountKeys }];
//     const body = {
//       jsonrpc: "2.0",
//       id: 1,
//       method: PRIORITY_FEE_PROVIDER_METHOD,
//       params,
//     };
//     const resp = await axios.post(PRIORITY_FEE_PROVIDER_URL, body, {
//       timeout: 2500,
//       headers: { "Content-Type": "application/json" },
//     });
//     const result = resp.data?.result;
//     if (!result) return null;
//     // Normalize common provider shapes
//     let microLamports = null;
//     if (typeof result === "number") microLamports = Math.ceil(result);
//     else if (result?.microLamports) microLamports = Math.ceil(result.microLamports);
//     else if (result?.priorityFeeEstimate) microLamports = Math.ceil(result.priorityFeeEstimate);
//     if (!Number.isFinite(microLamports)) return null;
//     microLamports = Math.max(microLamports, PRIORITY_FEE_MIN_MICROLAMPORTS);
//     microLamports = Math.min(microLamports, PRIORITY_FEE_MAX_MICROLAMPORTS);
//     return { microLamports, solAmount: microLamports / 1e15 };
//   } catch {
//     return null;
//   }
// }

// async function swap(inputMint, outputMint, connection, amount, pubKey, slippageBps = 100, maxRetries = 5) {
//   let retries = 0;
//   while (retries < maxRetries) {
//     try {
//       console.log("\n🔄 ========== INITIATING SWAP ==========");
//       console.log("🔍 Fetching token information...");
//       const inputTokenInfo = await getTokenInfo(inputMint, connection);
//       const outputTokenInfo = await getTokenInfo(outputMint, connection);

//       console.log(`🔢 Input token decimals: ${inputTokenInfo.decimals}`);
//       console.log(`🔢 Output token decimals: ${outputTokenInfo.decimals}`);

//       const adjustedAmount = amount * 10 ** inputTokenInfo.decimals;
//       const adjustedSlippageBps = slippageBps * (1 + retries * 0.5);

//       // 1. Get quote from Jupiter
//       console.log("\n💰 Getting quote from Jupiter...");
//       const quoteResponse = await getQuote(inputMint, outputMint, adjustedAmount, adjustedSlippageBps);

//       if (!quoteResponse || !quoteResponse.routePlan) {
//         throw new Error("❌ No trading routes found");
//       }

//       console.log("✅ Quote received successfully");

//       // 2. Get swap instructions
//       console.log("\n📝 Getting swap instructions...");
//       const swapInstructions = await getSwapInstructions(quoteResponse, new PublicKey(pubKey));

//       if (!swapInstructions || swapInstructions.error) {
//         throw new Error(
//           "❌ Failed to get swap instructions: " + (swapInstructions ? swapInstructions.error : "Unknown error")
//         );
//       }

//       console.log("✅ Swap instructions received successfully");

//       const {
//         setupInstructions,
//         swapInstruction: swapInstructionPayload,
//         cleanupInstruction,
//         addressLookupTableAddresses,
//       } = swapInstructions;

//       const swapInstruction = deserializeInstruction(swapInstructionPayload);

//       // 3. Prepare transaction
//       console.log("\n🛠️  Preparing transaction...");
//       const addressLookupTableAccounts = await getAddressLookupTableAccounts(addressLookupTableAddresses);

//       // Use a fresher commitment for recent blockhash to maximize landing chances
//       // Always fetch a fresh processed blockhash to avoid staleness
//       const latestBlockhash = await connection.getLatestBlockhash("processed");

//       // 4. Simulate transaction to get compute units
//       const instructions = [...setupInstructions.map(deserializeInstruction), swapInstruction];

//       if (cleanupInstruction) {
//         instructions.push(deserializeInstruction(cleanupInstruction));
//       }

//       console.log("\n🧪 Simulating transaction...");
//       const computeUnits = await simulateTransaction(
//         instructions,
//         new PublicKey(pubKey),
//         addressLookupTableAccounts,
//         5,
//         latestBlockhash.lastValidBlockHeight ? undefined : undefined
//       );

//       if (computeUnits === undefined) {
//         throw new Error("❌ Failed to simulate transaction");
//       }

//       if (computeUnits && computeUnits.error === "InsufficientFundsForRent") {
//         console.log("❌ Insufficient funds for rent. Skipping this swap.");
//         return null;
//       }

//       // Collect program IDs from instructions to target provider estimator
//       const programIds = instructions.map((ix) => ix.programId?.toString?.()).filter(Boolean);
//       // Prefer provider estimate (targeted), then percentile; fallback to average
//       let priorityFee = await getProviderEstimatedPriorityFee(undefined, programIds);
//       if (!priorityFee || !Number.isFinite(priorityFee.microLamports) || priorityFee.microLamports <= 0) {
//         priorityFee = await getPercentilePriorityFee();
//       }
//       if (!priorityFee || !Number.isFinite(priorityFee.microLamports) || priorityFee.microLamports <= 0) {
//         priorityFee = await getAveragePriorityFee();
//       }

//       console.log(`🧮 Compute units: ${computeUnits}`);
//       console.log(
//         `💸 Priority fee: ${priorityFee.microLamports} micro-lamports (${priorityFee.solAmount.toFixed(9)} SOL)`
//       );

//       // 5. Create versioned transaction
//       const transaction = createVersionedTransaction(
//         instructions,
//         new PublicKey(pubKey),
//         addressLookupTableAccounts,
//         latestBlockhash.blockhash,
//         computeUnits,
//         priorityFee
//       );

//       // 6. Sign the transaction
//       transaction.sign([wallet]);

//       // 7. Create and send Jito bundle
//       const attemptStart = Date.now();
//       console.log("\n📦 Creating Jito bundle...");
//       const { bundle: jitoBundle, tipLamports } = await createJitoBundle(
//         transaction,
//         new PublicKey(pubKey),
//         latestBlockhash.blockhash,
//         retries
//       );
//       console.log("✅ Jito bundle created successfully");

//       console.log("\n📤 Sending Jito bundle...");
//       const bundleId = await sendJitoBundle(jitoBundle);
//       console.log(`✅ Jito bundle sent. Bundle ID: ${bundleId}`);

//       console.log("\n🔍 Checking bundle status...");
//       const mainSig = bs58.encode(transaction.signatures[0]);
//       const bundleStatus = await confirmBundle(bundleId, mainSig, 60000, 2000, 3);
//       const attemptMs = Date.now() - attemptStart;
//       console.log(
//         `⏱️ Attempt ${retries + 1} stats: time=${attemptMs}ms tip=${tipLamports} lamports status=${
//           bundleStatus ? bundleStatus.status : "unknown"
//         }`
//       );

//       if (!bundleStatus || bundleStatus.status !== "Landed") {
//         // If not landed, rebuild with a new fresh blockhash and resubmit in next retry loop
//         throw new Error("Failed to execute swap after multiple attempts.");
//       }

//       console.log("\n✨ Swap executed successfully! ✨");
//       console.log("========== SWAP COMPLETE ==========\n");

//       const signature = bs58.encode(transaction.signatures[0]);
//       return { bundleStatus, signature };
//     } catch (error) {
//       console.error(`\n❌ Error executing swap (attempt ${retries + 1}/${maxRetries}):`);
//       console.error(error.message);
//       retries++;
//       if (retries >= maxRetries) {
//         console.error(`\n💔 Failed to execute swap after ${maxRetries} attempts.`);
//         throw error;
//       }
//       console.log(`\nRetrying in 2 seconds...`);
//       await new Promise((resolve) => setTimeout(resolve, 2000));
//     }
//   }
// }

// export { deserializeInstruction, getTokenInfo, swap };

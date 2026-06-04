const RPC = process.env.SOLANA_RPC || "https://api.mainnet-beta.solana.com";
const TOKEN_MINT = process.env.TOKEN_MINT || "";
const REQUIRED = Number(process.env.TOKEN_REQUIRED_AMOUNT || "500000");
const TREASURY = process.env.TREASURY_WALLET || "";
const ENTRY_FEE_LAMPORTS = 0.2 * 1e9;

async function rpc(method: string, params: unknown[]) {
  const res = await fetch(RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  return res.json();
}

export async function checkTokenBalance(walletAddress: string): Promise<boolean> {
  try {
    if (!TOKEN_MINT) return true; // dev mode: skip check
    const data = await rpc("getTokenAccountsByOwner", [
      walletAddress,
      { mint: TOKEN_MINT },
      { encoding: "jsonParsed" },
    ]);
    if (!data.result?.value?.length) return false;
    const balance = data.result.value.reduce((sum: number, acc: { account: { data: { parsed: { info: { tokenAmount: { uiAmount: number } } } } } }) => {
      return sum + (acc.account.data.parsed.info.tokenAmount.uiAmount || 0);
    }, 0);
    return balance >= REQUIRED;
  } catch {
    return false;
  }
}

export async function verifyEntryPayment(txSignature: string, fromWallet: string): Promise<boolean> {
  try {
    const data = await rpc("getTransaction", [
      txSignature,
      { encoding: "jsonParsed", commitment: "confirmed" },
    ]);
    const tx = data.result;
    if (!tx) return false;
    const meta = tx.meta;
    if (meta?.err) return false;
    const accountKeys: string[] = tx.transaction.message.accountKeys.map(
      (k: { pubkey: string } | string) => (typeof k === "string" ? k : k.pubkey)
    );
    const fromIdx = accountKeys.indexOf(fromWallet);
    const toIdx = accountKeys.indexOf(TREASURY);
    if (fromIdx === -1 || toIdx === -1) return false;
    const preBalances: number[] = meta.preBalances;
    const postBalances: number[] = meta.postBalances;
    const received = postBalances[toIdx] - preBalances[toIdx];
    return received >= ENTRY_FEE_LAMPORTS * 0.99;
  } catch {
    return false;
  }
}
